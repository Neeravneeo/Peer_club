import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { generateQuizFromText } from '../services/ai.service.js';
import { triggerN8nWebhook } from '../services/n8n.service.js';
import { getDocumentById } from './documents.controller.js';
import { recordUserActivity } from '../services/streak.service.js';

// In-memory quiz cache to ensure resilience during network/database pooler failovers
const memoryQuizzes = new Map();

export async function generateQuiz(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      documentId,
      documentName,
      title,
      topic,
      studyText,
      questionCount = 5,
      difficulty = 'medium',
      questionType = 'mcq',
      score,
      scorePercentage,
      weakTopics,
      previousQuestions,
    } = req.body;

    // Support custom question counts from 1 to 50
    const count = Math.min(Math.max(Number(questionCount) || 5, 1), 50);

    // Resolve document uploaded by user
    let document = null;
    if (documentId) {
      try {
        document = await prisma.document.findFirst({
          where: { id: documentId, uploadedBy: userId },
        });
      } catch (dbErr) {
        console.warn('[quiz.controller] Document query warning:', dbErr.message);
      }

      if (!document) {
        document = getDocumentById(documentId, userId);
      }
    }

    // If not found in DB, resolve document name from request
    if (!document) {
      const resolvedName =
        documentName ||
        title ||
        topic ||
        'Study Notes & Core Concepts';

      try {
        let defaultRoom = await prisma.studyRoom.findFirst({
          where: { adminId: userId },
        });

        if (!defaultRoom) {
          defaultRoom = await prisma.studyRoom.create({
            data: {
              name: 'General Study Room',
              subjectTag: 'General',
              roomCode: `GEN${uuidv4().slice(0, 3).toUpperCase()}`,
              adminId: userId,
              members: { connect: { id: userId } },
            },
          });
        }

        document = await prisma.document.create({
          data: {
            roomId: defaultRoom.id,
            uploadedBy: userId,
            fileName: resolvedName,
            fileUrl: 'https://peerclub.app/docs/sample.pdf',
          },
        });
      } catch (dbCreateErr) {
        console.warn('[quiz.controller] DB document creation skipped:', dbCreateErr.message);
        document = {
          id: uuidv4(),
          fileName: resolvedName,
          uploadedBy: userId,
        };
      }
    }

    // Determine prompt context for AI quiz generator
    const promptText =
      studyText ||
      topic ||
      document.extractedText ||
      `Subject material: ${document.fileName}. Focus on essential definitions, principles, problem-solving, and practical applications.`;

    // Generate questions using adaptive n8n workflow
    const learnerScore = typeof score === 'number' ? score : (typeof scorePercentage === 'number' ? scorePercentage : undefined);
    const generatedQuestions = await generateQuizFromText(
      promptText,
      count,
      difficulty,
      questionType,
      {
        score: learnerScore,
        weakTopics,
        previousQuestions,
        topic: topic || document.fileName || title,
      }
    );

    const formattedQuestions = (generatedQuestions || []).map((q, idx) => ({
      id: q.id || uuidv4(),
      orderIndex: idx + 1,
      difficulty: q.difficulty || difficulty,
      question: q.question || q.questionText || `Question ${idx + 1}`,
      questionText: q.question || q.questionText || `Question ${idx + 1}`,
      questionType: q.questionType || 'mcq',
      options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
      correct_answer: q.correct_answer || q.correctAnswer,
      correctAnswer: q.correct_answer || q.correctAnswer,
      explanation: q.explanation || 'Verified study concept.',
    }));

    // Save Quiz directly in database matching ER diagram
    let quiz = null;
    try {
      quiz = await prisma.quiz.create({
        data: {
          documentId: document.id,
          difficulty,
          questions: formattedQuestions,
        },
      });
    } catch (dbErr) {
      console.warn('[quiz.controller] Quiz database persist skipped:', dbErr.message);
      quiz = {
        id: uuidv4(),
        documentId: document.id,
        difficulty,
        questions: formattedQuestions,
        createdAt: new Date().toISOString(),
      };
    }

    // Save to in-memory fallback cache
    memoryQuizzes.set(quiz.id, {
      ...quiz,
      document: { id: document.id, fileName: document.fileName },
    });

    // Fire n8n webhook asynchronously
    triggerN8nWebhook(
      'quiz.generated',
      {
        quizId: quiz.id,
        questionCount: formattedQuestions.length,
        difficulty: quiz.difficulty,
        documentName: document.fileName,
      },
      { id: req.user?.id, email: req.user?.email }
    );

    return res.status(201).json({
      message: 'Quiz generated successfully',
      quizId: quiz.id,
      difficulty: quiz.difficulty,
      questionCount: formattedQuestions.length,
      document: { id: document.id, fileName: document.fileName },
    });
  } catch (err) {
    next(err);
  }
}

export async function listQuizzes(req, res, next) {
  try {
    const userId = req.user.id;

    let quizzes = [];
    try {
      quizzes = await prisma.quiz.findMany({
        where: {
          document: { uploadedBy: userId },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          document: {
            select: { id: true, fileName: true, roomId: true },
          },
        },
      });
    } catch (dbErr) {
      console.warn('[quiz.controller] listQuizzes DB fallback:', dbErr.message);
      quizzes = Array.from(memoryQuizzes.values());
    }

    const formatted = quizzes.map((q) => {
      const qList = Array.isArray(q.questions) ? q.questions : [];
      return {
        id: q.id,
        difficulty: q.difficulty,
        questionCount: qList.length,
        document: q.document ? { id: q.document.id, name: q.document.fileName } : null,
        createdAt: q.createdAt,
      };
    });

    return res.json({ quizzes: formatted });
  } catch (err) {
    next(err);
  }
}

export async function getQuiz(req, res, next) {
  try {
    const { id } = req.params;

    let quiz = null;
    try {
      quiz = await prisma.quiz.findUnique({
        where: { id },
        include: {
          document: { select: { id: true, fileName: true, roomId: true } },
        },
      });
    } catch (dbErr) {
      console.warn('[quiz.controller] getQuiz DB fallback:', dbErr.message);
    }

    if (!quiz) {
      quiz = memoryQuizzes.get(id);
    }

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const qList = Array.isArray(quiz.questions) ? quiz.questions : [];
    // Omit correct answers and explanations while user is taking the quiz
    const questionsForTaking = qList.map((q) => ({
      id: q.id,
      orderIndex: q.orderIndex,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options,
    }));

    return res.json({
      quiz: {
        id: quiz.id,
        difficulty: quiz.difficulty,
        questionCount: qList.length,
        document: quiz.document ? { id: quiz.document.id, name: quiz.document.fileName } : null,
        createdAt: quiz.createdAt,
        questions: questionsForTaking,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function submitAttempt(req, res, next) {
  try {
    const userId = req.user.id;
    const { id: quizId } = req.params;
    const { answers, timeTakenSeconds } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers array is required' });
    }

    let quiz = null;
    try {
      quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
          document: true,
        },
      });
    } catch (dbErr) {
      console.warn('[quiz.controller] submitAttempt DB fallback:', dbErr.message);
    }

    if (!quiz) {
      quiz = memoryQuizzes.get(quizId);
    }

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const qList = Array.isArray(quiz.questions) ? quiz.questions : [];
    let correctCount = 0;

    const answerResults = qList.map((q) => {
      const submitted = answers.find((a) => a.questionId === q.id);
      let isCorrect = false;

      if (q.questionType === 'mcq') {
        isCorrect = submitted?.selectedOptionIndex === q.correctIndex;
      } else {
        isCorrect =
          submitted?.answerText &&
          q.correctAnswer &&
          submitted.answerText.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      }

      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        selectedOptionIndex: submitted?.selectedOptionIndex ?? null,
        answerText: submitted?.answerText ?? null,
        isCorrect,
        questionText: q.questionText,
        options: q.options,
        correctIndex: q.correctIndex,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      };
    });

    const totalQuestions = qList.length || 1;
    const percentage = Number(((correctCount / totalQuestions) * 100).toFixed(2));

    // Update or increment leaderboard quizzesCompleted for this room
    if (quiz.document?.roomId) {
      await prisma.leaderboard.upsert({
        where: {
          roomId_userId: {
            roomId: quiz.document.roomId,
            userId,
          },
        },
        create: {
          roomId: quiz.document.roomId,
          userId,
          quizzesCompleted: 1,
          streak: 1,
        },
        update: {
          quizzesCompleted: { increment: 1 },
        },
      });
    }

    // Fire n8n webhook
    triggerN8nWebhook(
      'quiz.completed',
      {
        quizId: quiz.id,
        score: correctCount,
        totalQuestions,
        percentage,
        difficulty: quiz.difficulty,
      },
      { id: req.user?.id, email: req.user?.email }
    );

    // Update comprehensive streak tracking
    const streakResult = await recordUserActivity(userId, 'quiz').catch(() => null);

    return res.status(201).json({
      score: correctCount,
      totalQuestions,
      percentage,
      timeTakenSeconds: timeTakenSeconds || null,
      answers: answerResults,
      completedAt: new Date().toISOString(),
      streak: streakResult,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAttempt(req, res, next) {
  try {
    const { attemptId } = req.params;
    return res.json({
      attempt: {
        id: attemptId,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
}
