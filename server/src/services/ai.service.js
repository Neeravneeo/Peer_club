import axios from 'axios';
import dotenv from 'dotenv';
import { geminiModel } from '../lib/gemini.js';

dotenv.config();

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_BASE_URL || 'http://localhost:5678/webhook';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'nex-agi/nex-n2.5-pro:free';

function extractJson(text) {
  let cleaned = String(text || '').trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

/**
 * Generate Quiz Questions
 * 1. n8n workflow (`/webhook/generate-quiz` powered by OpenRouter nex-n2.5-pro:free)
 * 2. Fallback: Direct OpenRouter chat completions
 * 3. Fallback: Gemini AI
 */
export async function generateQuizFromText(
  extractedText,
  count = 5,
  difficulty = 'medium',
  questionType = 'mcq'
) {
  const truncatedText = (extractedText || '').slice(0, 6000);

  // Strategy 1: n8n Workflow with OpenRouter
  try {
    const n8nBase = N8N_WEBHOOK_URL.replace(/\/+$/, '');
    const res = await axios.post(
      `${n8nBase}/generate-quiz`,
      {
        studyText: truncatedText,
        count,
        difficulty,
        questionType,
      },
      { timeout: 90000 }
    );

    const data = Array.isArray(res.data) ? res.data[0] : res.data;
    if (data && Array.isArray(data.questions) && data.questions.length > 0) {
      console.log(`[ai.service] Successfully generated quiz via n8n OpenRouter workflow (${data.questions.length} questions)`);
      return data.questions;
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
              content: 'You are an educational AI tutor. You output ONLY a valid JSON array of questions. Never include markdown markers or conversational preamble.',
            },
            {
              role: 'user',
              content: `Generate ${count} ${difficulty} ${questionType} questions from this study material:\n\n${truncatedText}\n\nFormat required:\n[{"questionText": "...", "questionType": "mcq", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0, "explanation": "..."}]`,
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
          timeout: 90000,
        }
      );

      const content = openRouterRes.data?.choices?.[0]?.message?.content;
      const parsed = extractJson(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          questionText: item.questionText || item.question || `Question ${idx + 1}`,
          questionType: item.questionType || 'mcq',
          options: Array.isArray(item.options) ? item.options : ['A', 'B', 'C', 'D'],
          correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
          explanation: item.explanation || 'Verified study concept.',
        }));
      }
    } catch (orErr) {
      console.warn(`[ai.service] Direct OpenRouter fallback failed: ${orErr.message}`);
    }
  }

  // Strategy 3: Gemini AI Fallback
  console.log('[ai.service] Falling back to Gemini AI...');
  const prompt = `Generate ${count} ${difficulty} ${questionType} questions in a valid JSON array from:\n${truncatedText}\n[{"questionText": "...", "questionType": "mcq", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0, "explanation": "..."}]`;
  const result = await geminiModel.generateContent(prompt);
  const parsed = extractJson(result.response.text());
  return Array.isArray(parsed) ? parsed : [];
}

/**
 * Generate Flashcards
 * 1. n8n workflow (`/webhook/generate-flashcards` powered by OpenRouter nex-n2.5-pro:free)
 * 2. Fallback: Direct OpenRouter chat completions
 * 3. Fallback: Gemini AI
 */
export async function generateFlashcardsFromText(extractedText, count = 10) {
  const truncatedText = (extractedText || '').slice(0, 6000);

  // Strategy 1: n8n Workflow with OpenRouter
  try {
    const n8nBase = N8N_WEBHOOK_URL.replace(/\/+$/, '');
    const res = await axios.post(
      `${n8nBase}/generate-flashcards`,
      {
        studyText: truncatedText,
        cardCount: count,
      },
      { timeout: 90000 }
    );

    const data = Array.isArray(res.data) ? res.data[0] : res.data;
    if (data && Array.isArray(data.cards) && data.cards.length > 0) {
      console.log(`[ai.service] Successfully generated flashcards via n8n OpenRouter workflow (${data.cards.length} cards)`);
      return data.cards;
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
  console.log('[ai.service] Falling back to Gemini AI...');
  const prompt = `Generate ${count} flashcards in JSON format: [{"front": "...", "back": "..."}] from:\n${truncatedText}`;
  const result = await geminiModel.generateContent(prompt);
  const parsed = extractJson(result.response.text());
  return Array.isArray(parsed) ? parsed : [];
}

export async function generateDocumentSummary(extractedText) {
  const truncatedText = (extractedText || '').slice(0, 6000);
  const prompt = `Summarize in JSON {"summary": ["point 1", "point 2", "point 3"], "keyTopics": ["tag 1", "tag 2"]}:\n${truncatedText}`;
  const result = await geminiModel.generateContent(prompt);
  return extractJson(result.response.text());
}
