import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { generateQuizFromText } from '../services/ai.service.js';
import { triggerN8nWebhook } from '../services/n8n.service.js';

export async function generateQuiz(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      documentId,
      questionCount = 5,
      difficulty = 'medium',
      questionType = 'mcq',
    } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: 'documentId is required' });
    }

    // Fetch document
    const document = await prisma.document.findFirst({
      where: { id: documentId, uploadedBy: userId },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Support custom question counts from 1 to 50
    const count = Math.min(Math.max(Number(questionCount) || 5, 1), 50);
    // Use document title or fileName as prompt context if text extraction isn't present
    const promptText = document.fileName || 'General Knowledge and Computer Science';
    const generatedQuestions = await generateQuizFromText(
      promptText,
      count,
      difficulty,
      questionType
    );

    const formattedQuestions = generatedQuestions.map((q, idx) => ({
      id: uuidv4(),
      orderIndex: idx + 1,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options || [],
      correctIndex: q.correctIndex,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    // Save Quiz directly in database matching ER diagram
    const quiz = await prisma.quiz.create({
      data: {
        documentId: document.id,
        difficulty,
        questions: formattedQuestions,
      },
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

    const quizzes = await prisma.quiz.findMany({
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

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        document: { select: { id: true, fileName: true, roomId: true } },
      },
    });

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

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        document: true,
      },
    });

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

    return res.status(201).json({
      score: correctCount,
      totalQuestions,
      percentage,
      timeTakenSeconds: timeTakenSeconds || null,
      answers: answerResults,
      completedAt: new Date().toISOString(),
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
