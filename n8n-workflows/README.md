# n8n Automation Workflows for Peer Club

This directory contains pre-configured, importable **n8n automation workflows** for Peer Club, featuring AI-driven adaptive learning.

---

## 📁 Available Workflows

| File | Webhook Path | Trigger Event / Endpoint | Action |
|---|---|---|---|
| `1_quiz_completed_digest.json` | `/webhook/quiz-completed` | `quiz.completed` | Receives quiz score, time taken, and missed questions; formats automated feedback report. |
| `2_flashcard_deck_generator.json` | `/webhook/flashcards-generated` | `flashcards.generated` | Receives generated deck metadata and triggers ready notifications. |
| `3_ai_quiz_generator.json` | `/webhook/generate-quiz` | `POST /generate-quiz` | **Adaptive Quiz Generator**: Computes exact difficulty distribution based on learner score (0-30%, 31-50%, 51-70%, 71-85%, 86-100%), prioritizes weak topics, prevents repeat questions, calls OpenRouter, and returns verified questions. |
| `4_ai_flashcards_generator.json` | `/webhook/generate-flashcards` | `POST /generate-flashcards` | **Adaptive Flashcard Deck Generator**: Converts score into cognitive depth tiers (Foundational Recall, Application & Mechanisms, Advanced Analysis & Edge Cases), prioritizes weak topics, and returns structured active-recall cards. |
| `5_daily_streak_check.json` | `/webhook/daily-streak-check` | `daily-streak-check` | Automated cron/streak validation checking learner engagement and maintaining streaks. |

---

## 🧠 Adaptive Learning Engine Specification

Both `3_ai_quiz_generator.json` and `4_ai_flashcards_generator.json` calculate the difficulty distribution automatically:

| Learner Score | Easy % | Medium % | Hard % | Pedagogical Focus |
|---|---|---|---|---|
| **0 – 30%** | **70%** | **30%** | **0%** | Foundations, core definitions, and basic terminology |
| **31 – 50%** | **50%** | **40%** | **10%** | Core reinforcement + initial application problems |
| **51 – 70%** | **30%** | **50%** | **20%** | Balanced practice with multi-step reasoning |
| **71 – 85%** | **20%** | **50%** | **30%** | Higher-order thinking and scenario evaluation |
| **86 – 100%** | **10%** | **40%** | **50%** | Mastery challenge: edge cases, trade-offs, and synthesis |

### Webhook Request Payload (`/webhook/generate-quiz` & `/webhook/generate-flashcards`)
```json
{
  "topic": "Data Structures - Binary Search Trees",
  "score": 65,
  "count": 5,
  "weakTopics": ["Balancing AVL Trees", "Rotation edge cases"],
  "previousQuestions": ["What is the search time complexity of a balanced BST?"]
}
```

### Webhook Response Output (`/webhook/generate-quiz`)
```json
{
  "success": true,
  "topic": "Data Structures - Binary Search Trees",
  "score": 65,
  "difficulty_distribution": {
    "easy": 1,
    "medium": 3,
    "hard": 1
  },
  "questions": [
    {
      "id": "q1",
      "difficulty": "easy",
      "question": "What is the defining property of a binary search tree?",
      "options": [
        "Left child keys are less than the root, and right child keys are greater",
        "Every node must have exactly two child nodes",
        "All leaf nodes must reside on the same level",
        "The tree is automatically rebalanced after every insertion"
      ],
      "correct_answer": "Left child keys are less than the root, and right child keys are greater",
      "explanation": "By definition, a binary search tree maintains all keys in the left subtree smaller than the parent node and all keys in the right subtree greater."
    }
  ]
}
```

---

## 🚀 How to Import and Run Workflows in n8n

### Option A: Local n8n Instance (Free)
1. In your terminal, run:
   ```bash
   npx n8n
   ```
2. Open your browser to `http://localhost:5678`.
3. Click **Workflows** -> **Import from File...** (or press `Ctrl+O`).
4. Select `3_ai_quiz_generator.json` or `4_ai_flashcards_generator.json`.
5. Toggle the workflow to **Active**.

### Option B: Hosted / n8n Cloud
1. In your n8n workspace, click **Add Workflow** -> **Import from File**.
2. Upload the JSON files from this directory.
3. Update `N8N_WEBHOOK_BASE_URL` in [server/.env](file:///d:/Peer_club/server/.env) with your live n8n webhook URL.

---

## 🔒 Security & Headers
Every webhook dispatched by the Peer Club backend includes:
- **`X-N8N-Secret`**: Verified against `N8N_WEBHOOK_SECRET` in `server/.env`.
- **Non-blocking asynchronous dispatch**: If n8n is offline, the core app falls back gracefully to direct OpenRouter or Gemini completions.
