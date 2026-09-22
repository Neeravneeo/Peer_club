# Graph Report - Peer_club  (2026-09-14)

## Corpus Check
- 240 files · ~120,525 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1066 nodes · 2033 edges · 74 communities (58 shown, 11 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7f39c3f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- client/package.json
- Peer Club
- Peer Club
- dependencies
- What You Must Do When Invoked
- 2. Tables
- What You Must Do When Invoked
- 2. Screen-by-Screen Flow
- 5. Core Features (MVP)
- Peer Club - Month 1 MVP Build
- flashcards.controller.js
- lucide-react
- documents.controller.js
- auth.middleware.js
- quiz.controller.js
- Source Course — Translated Curriculum
- supabase.ts
- Source Course — Translated Curriculum
- Knowledge Graph Workflows — paste-ready
- app.js
- users.routes.js
- Task Graphs: Orchestrating Agents
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- rooms.controller.js
- Knowledge Extraction: Entities, Relations, Events
- Knowledge Fusion & Serving the Graph to LLMs
- Knowledge Extraction: Entities, Relations, Events
- Knowledge Fusion & Serving the Graph to LLMs
- Task Graphs: Orchestrating Agents
- 🚀 Getting Started
- express
- App.jsx
- Knowledge Representation & Ontology Modeling
- Knowledge Representation & Ontology Modeling
- n8n Automation Workflows for Peer Club
- Profile.jsx
- TakeQuizPage.jsx
- Graph Engineering
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- Graph Engineering
- Graph Engineering
- server/package.json
- internal.routes.js
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- craftTokens.js
- rules/graphify.md
- .agents/skills/graphify/references/extraction-spec.md
- workflows/graphify.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- client/src/lib/supabase.js
- FlashcardsHub.jsx
- LeaderboardPage.jsx
- Documents.jsx
- Dashboard.jsx
- AboutSection.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 116 edges
2. `lucide-react` - 82 edges
3. `cn()` - 47 edges
4. `react-router-dom` - 46 edges
5. `sonner` - 33 edges
6. `useAuth()` - 29 edges
7. `api` - 22 edges
8. `2. Tables` - 21 edges
9. `2. Screen-by-Screen Flow` - 20 edges
10. `Peer Club - Month 1 MVP Build` - 19 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/App.jsx → client/src/hooks/useAuth.ts
- `Topbar()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/Topbar.jsx → client/src/hooks/useAuth.ts
- `PrivateRoute()` --calls--> `useAuthStore`  [EXTRACTED]
  client/src/components/auth/PrivateRoute.jsx → client/src/stores/authStore.js
- `SparklineCard()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/dashboard/SparklineCard.jsx → client/src/lib/utils.js
- `StatCard()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/dashboard/StatCard.jsx → client/src/lib/utils.js

## Import Cycles
- None detected.

## Communities (74 total, 11 thin omitted)

### Community 0 - "react"
Cohesion: 0.05
Nodes (58): LogStudyModal(), SparklineCard(), StatCard(), FlipCard3D(), GenerateFlashcardModal(), ProgressBar(), RatingControls(), SessionCompleteModal() (+50 more)

### Community 1 - "client/package.json"
Cohesion: 0.05
Nodes (37): devDependencies, autoprefixer, postcss, tailwindcss, vite, @vitejs/plugin-react, axios, @supabase/supabase-js (+29 more)

### Community 2 - "Peer Club"
Cohesion: 0.06
Nodes (35): 10. Gamification Visual Design, 11. Responsive Behavior, 12. Accessibility, 1. Design Philosophy, 2. Color Palette, 3. Typography, 4. Iconography, 5. Component Style Guide (+27 more)

### Community 3 - "Peer Club"
Cohesion: 0.06
Nodes (34): 10. Email, 11. Deployment and Hosting, 12. Security Requirements, 13. Performance Requirements, 14. API Structure, 15. Testing Strategy, 1. Architecture Overview, 2. Frontend Stack (+26 more)

### Community 4 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, axios, class-variance-authority, clsx, date-fns, framer-motion, @hookform/resolvers, lucide-react (+22 more)

### Community 5 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 6 - "2. Tables"
Cohesion: 0.07
Nodes (26): 1. Overview, 2. Tables, 3.10 quiz_attempts, 3.11 quiz_attempt_answers, 3.12 flashcard_sets, 3.13 flashcards, 3.14 user_flashcard_progress, 3.15 study_sessions (+18 more)

### Community 7 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 8 - "2. Screen-by-Screen Flow"
Cohesion: 0.08
Nodes (24): 1. High-Level Navigation Structure, 2.10 Join Room Page (/rooms/join), 2.11 Room Home Page (/rooms/[roomId]), 2.12 Generate Quiz Modal, 2.13 Take Quiz Page (/rooms/[roomId]/quiz/[quizId]), 2.14 Generate Flashcards Modal, 2.15 Flashcard Review Page (/rooms/[roomId]/flashcards/[setId]), 2.16 Notes Page (/rooms/[roomId]/notes) (+16 more)

### Community 9 - "5. Core Features (MVP)"
Cohesion: 0.08
Nodes (23): 1. App Overview, 2. Target Users, 3. Problem Statement, 4. User Roles, 5.10 Notifications, 5.1 User Authentication, 5.2 Study Rooms, 5.3 Pomodoro Study Timer (+15 more)

### Community 10 - "Peer Club - Month 1 MVP Build"
Cohesion: 0.10
Nodes (19): n8n Workflows Summary, Overview, Peer Club - Month 1 MVP Build, Phase 0: Project Setup, Phase 10: Study Session Logging and Streak, Phase 11: Badge System, Phase 12: EXPANDED n8n Automation (15 Workflows), Phase 13: Polish and Error Handling (+11 more)

### Community 11 - "flashcards.controller.js"
Cohesion: 0.16
Nodes (15): cloudinary, dotenv, @google/generative-ai, deleteFlashcardSet(), generateFlashcards(), getFlashcardSet(), listFlashcardSets(), updateFlashcardProgress() (+7 more)

### Community 12 - "lucide-react"
Cohesion: 0.15
Nodes (13): PodiumShowcase(), OptionButton(), CreateRoomModal(), DocumentsVault(), JoinRoomModal(), MembersList(), RoomCard(), RoomHeader() (+5 more)

### Community 14 - "documents.controller.js"
Cohesion: 0.38
Nodes (6): deleteDocument(), getDocument(), listDocuments(), uploadDocument(), deleteFile(), uploadBuffer()

### Community 15 - "auth.middleware.js"
Cohesion: 0.23
Nodes (9): getDashboardData(), getNotifications(), markAllAsRead(), markAsRead(), prisma, supabaseAdmin, requireAuth(), dashboardRouter (+1 more)

### Community 16 - "quiz.controller.js"
Cohesion: 0.27
Nodes (8): generateQuiz(), getAttempt(), getQuiz(), listQuizzes(), submitAttempt(), createStudySession(), getStudySessions, triggerN8nWebhook()

### Community 17 - "Source Course — Translated Curriculum"
Cohesion: 0.18
Nodes (11): How the course maps to this skill's 9-stage pipeline, Lecture 1 — Knowledge Graphs: Theory, Technology, Practice, Challenges, Lecture 2 — Knowledge Representation (2025-pub-2), Lecture 3 — Knowledge Modeling (2025-pub-3), Lecture 4 — Knowledge Extraction: Problems & Methods (2025-pub-4), Lecture 5 — Entity Recognition (2025-pub-5, plus 2025 frontier deck 5-1), Lecture 6 — Relation Extraction (2025-pub-6), Lecture 7 — Event Extraction (2024-pub-7; includes Huawei industry lecture "From Classic (+3 more)

### Community 18 - "supabase.ts"
Cohesion: 0.14
Nodes (21): BrainIcon(), CheckCircleIcon(), EnvelopeIcon(), EyeIcon(), EyeOffIcon(), GoogleIcon(), Spinner(), PrivateRoute() (+13 more)

### Community 19 - "Source Course — Translated Curriculum"
Cohesion: 0.18
Nodes (11): How the course maps to this skill's 9-stage pipeline, Lecture 1 — Knowledge Graphs: Theory, Technology, Practice, Challenges, Lecture 2 — Knowledge Representation (2025-pub-2), Lecture 3 — Knowledge Modeling (2025-pub-3), Lecture 4 — Knowledge Extraction: Problems & Methods (2025-pub-4), Lecture 5 — Entity Recognition (2025-pub-5, plus 2025 frontier deck 5-1), Lecture 6 — Relation Extraction (2025-pub-6), Lecture 7 — Event Extraction (2024-pub-7; includes Huawei industry lecture "From Classic (+3 more)

### Community 20 - "Knowledge Graph Workflows — paste-ready"
Cohesion: 0.18
Nodes (10): 1 · THE ANCHOR — `/kg-tutor`, 2 · `/kg-scope`, 3 · `/kg-schema`, 4 · `/kg-extract`, 5 · `/kg-relations`, 6 · `/kg-events`, 7 · `/kg-fuse`, 8 · `/kg-eval` (+2 more)

### Community 21 - "app.js"
Cohesion: 0.18
Nodes (10): app, getGlobalLeaderboard(), getRoomLeaderboard(), errorHandler(), documentsRouter, leaderboardRouter, quizRouter, roomsRouter (+2 more)

### Community 22 - "users.routes.js"
Cohesion: 0.33
Nodes (7): deleteMe(), getBadges, changePassword(), getMe(), updateMe(), updatePreferences(), usersRouter

### Community 23 - "Task Graphs: Orchestrating Agents"
Cohesion: 0.22
Nodes (8): Contents, Fake edges, Guardrails, Task Graphs: Orchestrating Agents, The diamond pattern, The human gate, The stop rule, What a task graph is

### Community 24 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 25 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 26 - "rooms.controller.js"
Cohesion: 0.33
Nodes (8): uuid, createRoom(), generateRoomCode(), getRoom(), joinRoom(), leaveRoom(), listRooms(), localRoomsStore

### Community 27 - "Knowledge Extraction: Entities, Relations, Events"
Cohesion: 0.25
Nodes (8): Contents, Entity extraction, Event extraction, Extraction by source type, Failure modes, Knowledge Extraction: Entities, Relations, Events, LLM extraction prompt pattern, Relation extraction

### Community 28 - "Knowledge Fusion & Serving the Graph to LLMs"
Cohesion: 0.25
Nodes (8): Contents, Graph-as-memory loop, KG for LLM, Knowledge Fusion & Serving the Graph to LLMs, LLM for KG, Ontology matching, The fusion pipeline, Why fusion is the make-or-break stage

### Community 29 - "Knowledge Extraction: Entities, Relations, Events"
Cohesion: 0.25
Nodes (8): Contents, Entity extraction, Event extraction, Extraction by source type, Failure modes, Knowledge Extraction: Entities, Relations, Events, LLM extraction prompt pattern, Relation extraction

### Community 30 - "Knowledge Fusion & Serving the Graph to LLMs"
Cohesion: 0.25
Nodes (8): Contents, Graph-as-memory loop, KG for LLM, Knowledge Fusion & Serving the Graph to LLMs, LLM for KG, Ontology matching, The fusion pipeline, Why fusion is the make-or-break stage

### Community 31 - "Task Graphs: Orchestrating Agents"
Cohesion: 0.25
Nodes (8): Contents, Fake edges, Guardrails, Task Graphs: Orchestrating Agents, The diamond pattern, The human gate, The stop rule, What a task graph is

### Community 32 - "🚀 Getting Started"
Cohesion: 0.25
Nodes (7): 1. Prerequisites, 2. Client Setup, 3. Server Setup, 🚀 Getting Started, 🏗️ Month 1 Architecture & Tech Stack, Peer Club, 📂 Repository Structure

### Community 33 - "express"
Cohesion: 0.43
Nodes (6): express, deleteAccount(), changePassword(), getMe(), updateMe(), router

### Community 34 - "App.jsx"
Cohesion: 0.08
Nodes (27): App(), App(), PrivateRoute(), AppLayout(), AuthState, useAuth(), queryClient, ForgotPasswordPage() (+19 more)

### Community 35 - "Knowledge Representation & Ontology Modeling"
Cohesion: 0.29
Nodes (7): Choosing a representation, Contents, Knowledge Representation & Ontology Modeling, Ontology engineering method, Ontology learning, Schema design rules, Worked example

### Community 37 - "Knowledge Representation & Ontology Modeling"
Cohesion: 0.29
Nodes (7): Choosing a representation, Contents, Knowledge Representation & Ontology Modeling, Ontology engineering method, Ontology learning, Schema design rules, Worked example

### Community 38 - "n8n Automation Workflows for Peer Club"
Cohesion: 0.29
Nodes (6): 📁 Available Workflows, 🚀 How to Import and Run Workflows in n8n, n8n Automation Workflows for Peer Club, Option A: Local n8n Instance (Free), Option B: Hosted / n8n Cloud, 🔒 Security & Headers

### Community 39 - "Profile.jsx"
Cohesion: 0.17
Nodes (11): BadgesSection(), DEFAULT_BADGES, DeleteConfirmationModal(), DEFAULT_PREFERENCES, PreferencesSection(), ProfileHero(), SecuritySection(), DEFAULT_ADMIN_ROOMS (+3 more)

### Community 40 - "TakeQuizPage.jsx"
Cohesion: 0.21
Nodes (6): PastelBlob(), ProgressBar(), QuestionCard(), ResultsBreakdown(), SAMPLE_QUIZZES, Timer()

### Community 41 - "Graph Engineering"
Cohesion: 0.33
Nodes (6): Credits, Graph Engineering, Reference Files, Teaching Mode, The 9-Stage Pipeline, Working Rules

### Community 42 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 43 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 44 - "Graph Engineering"
Cohesion: 0.33
Nodes (6): Credits, Graph Engineering, Reference Files, Teaching Mode, The 9-Stage Pipeline, Working Rules

### Community 45 - "Graph Engineering"
Cohesion: 0.33
Nodes (6): Credits, Graph Engineering, Install (two commands), The 9-stage pipeline, The task-graph rules (the other half), What's inside

### Community 46 - "server/package.json"
Cohesion: 0.04
Nodes (43): cors, helmet, multer, nodemon, pdf-parse, prisma, @prisma/client, dependencies (+35 more)

### Community 48 - "internal.routes.js"
Cohesion: 0.48
Nodes (5): getAdminDigest(), getInactiveUsers(), getStreakAlertUsers(), getWeeklyStats(), internalRouter

### Community 50 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 51 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 52 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 53 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 54 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 55 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 60 - "craftTokens.js"
Cohesion: 0.33
Nodes (5): craftColors, craftFonts, craftRadius, craftShadows, craftTokens

### Community 71 - "FlashcardsHub.jsx"
Cohesion: 0.24
Nodes (7): HandDrawnUnderline(), DeckGrid(), FILTER_CHIPS, FilterBar(), FlashcardDeckCard(), getSubjectGradient(), SAMPLE_FLASHCARD_DECKS

### Community 72 - "LeaderboardPage.jsx"
Cohesion: 0.20
Nodes (7): FilterTabs(), LeagueTiers(), PersonalRankCard(), RankingTable(), SAMPLE_LEADERBOARD_USERS, StatCard(), UserRow()

### Community 73 - "Documents.jsx"
Cohesion: 0.16
Nodes (10): HandDrawnArrow(), DocumentCard(), BACKDROP_COLORS, DocumentGrid(), DocumentPreview(), DocumentsSidebar(), EmptyDocsState(), SearchBar() (+2 more)

### Community 74 - "Dashboard.jsx"
Cohesion: 0.16
Nodes (13): DotGridPattern(), TornPaperBackdrop(), EmptyState(), LogSessionModal(), NotificationBell(), NotificationFilters(), SAMPLE_NOTIFICATIONS, GenerationModal() (+5 more)

### Community 75 - "AboutSection.jsx"
Cohesion: 0.28
Nodes (6): AboutSection(), STUDY_GOAL_OPTIONS, AVATAR_PRESETS, AvatarPicker(), ALL_SUBJECTS, SubjectChips()

## Knowledge Gaps
- **443 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+438 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 546 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `client/package.json`, `App.jsx`, `FlashcardsHub.jsx`, `LeaderboardPage.jsx`, `Documents.jsx`, `Dashboard.jsx`, `AboutSection.jsx`, `lucide-react`, `Profile.jsx`, `TakeQuizPage.jsx`, `Landing.jsx`, `supabase.ts`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `react` to `client/package.json`, `App.jsx`, `FlashcardsHub.jsx`, `LeaderboardPage.jsx`, `Documents.jsx`, `Dashboard.jsx`, `Profile.jsx`, `lucide-react`, `Landing.jsx`, `TakeQuizPage.jsx`, `supabase.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `react`, `client/package.json`, `App.jsx`, `FlashcardsHub.jsx`, `LeaderboardPage.jsx`, `Documents.jsx`, `Dashboard.jsx`, `AboutSection.jsx`, `Profile.jsx`, `TakeQuizPage.jsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _443 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05202135774218154 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Should `Peer Club` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._