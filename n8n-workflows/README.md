# n8n Automation Workflows for Peer Club

This directory contains pre-configured, importable **n8n automation workflows** for Peer Club.

---

## 📁 Available Workflows

| File | Webhook Path | Trigger Event | Action |
|---|---|---|---|
| `1_quiz_completed_digest.json` | `/webhook/quiz-completed` | `quiz.completed` | Receives quiz score, time taken, and missed questions; formats automated feedback report. |
| `2_flashcard_deck_generator.json` | `/webhook/flashcards-generated` | `flashcards.generated` | Receives generated deck metadata and triggers ready notifications. |
| `3_ai_quiz_generator.json` | `/webhook/generate-quiz` | `generate-quiz` | Calls OpenRouter (`nex-agi/nex-n2.5-pro:free`) to generate MCQ / short-answer exam questions and returns JSON. |
| `4_ai_flashcards_generator.json` | `/webhook/generate-flashcards` | `generate-flashcards` | Calls OpenRouter (`nex-agi/nex-n2.5-pro:free`) to generate active recall study flashcards and returns JSON. |

---

## 🚀 How to Import and Run Workflows in n8n

### Option A: Local n8n Instance (Free)
1. In a terminal, run:
   ```bash
   npx n8n
   ```
2. Open your browser to `http://localhost:5678`.
3. Click **Workflows** -> **Import from File...** (or press `Ctrl+O`).
4. Select `1_quiz_completed_digest.json` or `2_flashcard_deck_generator.json`.
5. Toggle the workflow to **Active**.

### Option B: Hosted / n8n Cloud
1. In your n8n workspace, click **Add Workflow** -> **Import from File**.
2. Upload the JSON files from this directory.
3. Update `N8N_WEBHOOK_BASE_URL` in [server/.env](file:///d:/Peer_club/server/.env) with your live n8n webhook URL.

---

## 🔒 Security & Headers
Every webhook sent by the Peer Club backend includes:
- **`X-N8N-Secret`**: Verified against `N8N_WEBHOOK_SECRET` in `server/.env`.
- **Non-blocking asynchronous dispatch**: If n8n is offline, the core app continues without any interruption.
