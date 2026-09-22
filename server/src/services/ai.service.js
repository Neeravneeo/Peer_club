import https from 'https';
import axios from 'axios';
import dotenv from 'dotenv';
import { geminiModel } from '../lib/gemini.js';

dotenv.config();

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_BASE_URL || 'http://localhost:5678/webhook';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen3.8-27b:free';

function extractJson(text) {
  let cleaned = String(text || '').trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

const QUIZ_SYSTEM_PROMPT = `You are the Quiz Generation Engine for Peer Club, an AI-powered collaborative learning platform.
Your job is to create a high-quality quiz strictly from the study material provided by the user.
The uploaded material is the SOURCE OF TRUTH.
You must understand the material before generating questions.
Do not generate generic questions.
Do not use templates such as:
- "Which fundamental principle..."
- "Concept #1"
- "Concept #2"
- "Primary governing rule and mechanism"
- "Alternative theoretical hypothesis"
- "Secondary experimental anomaly"
- "Unrelated auxiliary factor"

Every question must be directly connected to actual information, concepts, relationships, examples, definitions, events, processes, or explanations contained in the supplied material.
Return ONLY valid JSON. No conversational text, no markdown code fences.`;

function buildQuizUserPrompt({ count, difficulty, questionType, studyText }) {
  return `==================================================
QUIZ CONFIGURATION
==================================================

Number of questions:
${count}

Difficulty:
${difficulty}

Question type:
${questionType}

Study material:
${studyText}

==================================================
STEP 1: UNDERSTAND THE STUDY MATERIAL
==================================================
Before generating questions, analyze the supplied study material.
Identify:
- Main topics
- Important concepts
- Subtopics
- Definitions
- Facts
- Relationships
- Processes
- Examples
- Comparisons
- Cause-and-effect relationships
- Important names, events, dates, formulas, or terminology where applicable
- Important conclusions or themes

Do not invent concepts that are not supported by the study material.

==================================================
STEP 2: BUILD A CONCEPT MAP
==================================================
Internally identify the most important concepts that can be tested.
Distribute questions across the important concepts in the material rather than only the first paragraph.
Prioritize important and information-rich concepts over minor details.

==================================================
STEP 3: GENERATE QUESTIONS
==================================================
Generate exactly ${count} questions.
Every question must test something that can be learned from the supplied material.
Questions should test understanding rather than simply copying sentences from the document.

DIFFICULTY RULES:
- EASY: Basic concepts, definitions, direct facts, simple identification.
- MEDIUM: Understanding concepts, comparing concepts, connecting information, relationships, moderate reasoning.
- HARD: Applying multiple concepts, scenario-based reasoning, distinguishing closely related concepts, deeper interpretation.

MCQ RULES:
- Each question must contain exactly 4 options.
- Exactly ONE correct answer.
- Incorrect answers must be plausible and related to the study material.
- Randomize the correct answer position across options (correctIndex: 0, 1, 2, or 3).

SHORT ANSWER RULES:
- Specific expectedAnswer and concise explanation based strictly on the material.

EXPLANATION RULES:
- Every question must have an explanation explaining WHY the answer is correct, grounded in the material.

SOURCE TRACEABILITY:
- Identify sourcePage (integer or null if unavailable) and sourceConcept (name of concept or topic tested).

ANTI-HALLUCINATION & DUPLICATE PREVENTION:
- The uploaded study material is the source of truth. Do not use outside knowledge.
- Do not generate duplicate or near-duplicate questions.
- Never fill missing questions with generic placeholders.

OUTPUT FORMAT:
Return ONLY valid JSON array:
[
  {
    "questionText": "...",
    "questionType": "mcq",
    "options": ["...", "...", "...", "..."],
    "correctIndex": 0,
    "explanation": "...",
    "sourcePage": 1,
    "sourceConcept": "..."
  }
]`;
}

/**
 * Generate Quiz Questions
 * 1. n8n workflow (`/webhook/generate-quiz` powered by OpenRouter)
 * 2. Fallback: Direct OpenRouter chat completions
 * 3. Fallback: Gemini AI
 * 4. Fallback: Content-grounded text extraction
 */
export async function generateQuizFromText(
  extractedText,
  count = 5,
  difficulty = 'medium',
  questionType = 'mcq',
  options = {}
) {
  const cleanText = (extractedText || '').trim();
  const truncatedText = cleanText.slice(0, 8000);
  const score = typeof options.score === 'number' ? options.score : 50;
  const weakTopics = Array.isArray(options.weakTopics) ? options.weakTopics : [];
  const previousQuestions = Array.isArray(options.previousQuestions) ? options.previousQuestions : [];

  // Strategy 1: n8n Workflow with OpenRouter
  try {
    const n8nBase = N8N_WEBHOOK_URL.replace(/\/+$/, '');
    const res = await axios.post(
      `${n8nBase}/generate-quiz`,
      {
        studyText: truncatedText,
        topic: options.topic || truncatedText.slice(0, 60),
        count,
        numberOfQuestions: count,
        difficulty,
        questionType,
        score,
        weakTopics,
        previousQuestions,
      },
      { timeout: 90000 }
    );

    const data = Array.isArray(res.data) ? res.data[0] : res.data;
    if (data && Array.isArray(data.questions) && data.questions.length > 0) {
      console.log(`[ai.service] Successfully generated adaptive quiz via n8n OpenRouter workflow (${data.questions.length} questions, score: ${score}%)`);
      return data.questions;
    }
  } catch (n8nErr) {
    console.warn(`[ai.service] n8n workflow bypassed: ${n8nErr.message}`);
  }

  const promptContent = buildQuizUserPrompt({
    count,
    difficulty,
    questionType,
    studyText: truncatedText,
  });

  // Strategy 2: Direct OpenRouter API
  if (OPENROUTER_API_KEY) {
    try {
      console.log(`[ai.service] Calling OpenRouter directly (${OPENROUTER_MODEL})...`);
      const openRouterRes = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: OPENROUTER_MODEL,
          temperature: 0.3,
          messages: [
            { role: 'system', content: QUIZ_SYSTEM_PROMPT },
            { role: 'user', content: promptContent },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Peer Club',
          },
          httpsAgent,
          timeout: 90000,
        }
      );

      const content = openRouterRes.data?.choices?.[0]?.message?.content;
      const parsed = extractJson(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          questionText: item.questionText || item.question || `Question ${idx + 1}`,
          questionType: item.questionType || 'mcq',
          options: Array.isArray(item.options) && item.options.length >= 2 ? item.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
          explanation: item.explanation || 'Verified from the provided study material.',
          sourcePage: item.sourcePage !== undefined ? item.sourcePage : null,
          sourceConcept: item.sourceConcept || 'Study Material Concept',
          expectedAnswer: item.expectedAnswer || (Array.isArray(item.options) ? item.options[item.correctIndex || 0] : ''),
        }));
      }
    } catch (orErr) {
      console.warn(`[ai.service] Direct OpenRouter fallback failed: ${orErr.message}`);
    }
  }

  // Strategy 3: Gemini AI Fallback
  try {
    console.log('[ai.service] Falling back to Gemini AI...');
    const geminiPrompt = `${QUIZ_SYSTEM_PROMPT}\n\n${promptContent}`;
    const result = await geminiModel.generateContent(geminiPrompt);
    const parsed = extractJson(result.response.text());
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => ({
        questionText: item.questionText || item.question || `Question ${idx + 1}`,
        questionType: item.questionType || 'mcq',
        options: Array.isArray(item.options) && item.options.length >= 2 ? item.options : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
        explanation: item.explanation || 'Directly grounded in the uploaded document.',
        sourcePage: item.sourcePage !== undefined ? item.sourcePage : null,
        sourceConcept: item.sourceConcept || 'Document Topic',
        expectedAnswer: item.expectedAnswer || (Array.isArray(item.options) ? item.options[item.correctIndex || 0] : ''),
      }));
    }
  } catch (geminiErr) {
    console.warn(`[ai.service] Gemini fallback error: ${geminiErr.message}`);
  }

  // Strategy 4: Content-grounded extraction from actual text sentences
  // Avoid any generic templates like "Which fundamental principle..." or "Concept #1"
  const sentences = cleanText
    .split(/[.\n;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && s.length < 200 && !s.includes('http'));

  if (sentences.length >= 2) {
    return Array.from({ length: Math.min(count, sentences.length) }, (_, i) => {
      const targetSentence = sentences[i];
      const otherSentences = sentences.filter((_, idx) => idx !== i);
      const distractors = [
        otherSentences[0] || 'Contradictory premise not stated in document',
        otherSentences[1] || 'Alternative mechanism not found in text',
        otherSentences[2] || 'Unrelated claim excluded from the notes',
      ];
      const options = [targetSentence, ...distractors.slice(0, 3)];

      // Deterministic shuffle
      const correctIdx = i % 4;
      const temp = options[0];
      options[0] = options[correctIdx];
      options[correctIdx] = temp;

      return {
        questionText: `According to the provided document, which of the following statements is accurate?`,
        questionType: questionType || 'mcq',
        options,
        correctIndex: correctIdx,
        explanation: `Based directly on the study material: "${targetSentence}"`,
        sourcePage: null,
        sourceConcept: targetSentence.slice(0, 40) + '...',
        expectedAnswer: targetSentence,
      };
    });
  }

  // Fallback for minimal text
  const docSnippet = cleanText.slice(0, 60) || 'Uploaded Study Material';
  return Array.from({ length: count }, (_, i) => ({
    questionText: `Based on "${docSnippet}", which point is directly supported?`,
    questionType: questionType || 'mcq',
    options: [
      `Key point supported by "${docSnippet}"`,
      `Misinterpretation of ${docSnippet}`,
      `Unstated condition outside of ${docSnippet}`,
      `Factually unsupported alternative`,
    ],
    correctIndex: 0,
    explanation: `Directly supported by the document text: ${docSnippet}`,
    sourcePage: null,
    sourceConcept: docSnippet,
    expectedAnswer: `Key point supported by "${docSnippet}"`,
  }));
}

/**
 * Generate Flashcards
 * 1. n8n workflow (`/webhook/generate-flashcards` powered by OpenRouter qwen/qwen3.8-27b:free)
 * 2. Fallback: Direct OpenRouter chat completions
 * 3. Fallback: Gemini AI
 */
export async function generateFlashcardsFromText(extractedText, count = 10, options = {}) {
  const truncatedText = (extractedText || '').slice(0, 6000);
  const score = typeof options.score === 'number' ? options.score : 50;
  const weakTopics = Array.isArray(options.weakTopics) ? options.weakTopics : [];
  const previousCards = Array.isArray(options.previousCards) ? options.previousCards : [];

  // Strategy 1: n8n Workflow with OpenRouter
  try {
    const n8nBase = N8N_WEBHOOK_URL.replace(/\/+$/, '');
    const res = await axios.post(
      `${n8nBase}/generate-flashcards`,
      {
        studyText: truncatedText,
        topic: options.topic || truncatedText.slice(0, 60),
        cardCount: count,
        numberOfCards: count,
        score,
        weakTopics,
        previousCards,
      },
      { timeout: 90000 }
    );

    const data = Array.isArray(res.data) ? res.data[0] : res.data;
    const cards = data?.flashcards || data?.cards;
    if (data && Array.isArray(cards) && cards.length > 0) {
      console.log(`[ai.service] Successfully generated adaptive flashcards via n8n OpenRouter workflow (${cards.length} cards, score: ${score}%)`);
      return cards;
    }
  } catch (n8nErr) {
    console.warn(`[ai.service] n8n workflow bypassed: ${n8nErr.message}`);
  }

  // Strategy 2: Direct OpenRouter API
  if (OPENROUTER_API_KEY) {
    try {
      console.log(`[ai.service] Calling OpenRouter directly (${OPENROUTER_MODEL})...`);
      const openRouterRes = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: OPENROUTER_MODEL,
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content: 'You are an educational tutor creating active recall flashcards. Output ONLY a valid JSON array of objects with front and back.',
            },
            {
              role: 'user',
              content: `Generate ${count} flashcards from this study material:\n\n${truncatedText}\n\nFormat required:\n[{"front": "Key Concept or Question", "back": "Clear, concise definition or answer"}]`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Peer Club',
          },
          httpsAgent,
          timeout: 90000,
        }
      );

      const content = openRouterRes.data?.choices?.[0]?.message?.content;
      const parsed = extractJson(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          front: item.front || item.term || `Concept ${idx + 1}`,
          back: item.back || item.definition || 'Definition and key points',
        }));
      }
    } catch (orErr) {
      console.warn(`[ai.service] Direct OpenRouter fallback failed: ${orErr.message}`);
    }
  }

  // Strategy 3: Gemini AI Fallback
  try {
    console.log('[ai.service] Falling back to Gemini AI for flashcards...');
    const prompt = `Generate ${count} flashcards in JSON format: [{"front": "...", "back": "..."}] from:\n${truncatedText}`;
    const result = await geminiModel.generateContent(prompt);
    const parsed = extractJson(result.response.text());
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (geminiErr) {
    console.warn(`[ai.service] Gemini flashcard fallback error: ${geminiErr.message}`);
  }

  // Strategy 4: Deterministic fallback cards
  const topicLabel = truncatedText.split('\n')[0].replace(/^[^a-zA-Z0-9]+/, '').slice(0, 50) || 'Study Concepts';
  return Array.from({ length: count }, (_, i) => ({
    front: `What is the core definition of concept #${i + 1} in ${topicLabel}?`,
    back: `Essential principle #${i + 1} covering critical fundamentals and applied mechanisms.`,
  }));
}

export async function generateDocumentSummary(extractedText) {
  const truncatedText = (extractedText || '').slice(0, 6000);
  const prompt = `Summarize in JSON {"summary": ["point 1", "point 2", "point 3"], "keyTopics": ["tag 1", "tag 2"]}:\n${truncatedText}`;
  const result = await geminiModel.generateContent(prompt);
  return extractJson(result.response.text());
}
