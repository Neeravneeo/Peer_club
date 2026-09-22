# Graph Report - Peer_club  (2026-09-17)

## Corpus Check
- 276 files · ~134,134 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1203 nodes · 2400 edges · 87 communities (70 shown, 12 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7f39c3f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
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
- cn
- DocumentUploadModal.jsx
- auth.middleware.js
- quiz.controller.js
- Source Course — Translated Curriculum
- supabase.ts
- Source Course — Translated Curriculum
- Knowledge Graph Workflows — paste-ready
- users.routes.js
- app.js
- Task Graphs: Orchestrating Agents
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- scripts
- Knowledge Extraction: Entities, Relations, Events
- Knowledge Fusion & Serving the Graph to LLMs
- Knowledge Extraction: Entities, Relations, Events
- Knowledge Fusion & Serving the Graph to LLMs
- Task Graphs: Orchestrating Agents
- 🚀 Getting Started
- AboutSection.jsx
- App.jsx
- Knowledge Representation & Ontology Modeling
- Knowledge Representation & Ontology Modeling
- n8n Automation Workflows for Peer Club
- react-router-dom
- RoomsPage.jsx
- Graph Engineering
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- Graph Engineering
- Graph Engineering
- server/package.json
- navigation/UniversalNavbar.jsx
- devDependencies
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
- dashboard.controller.js
- client/src/lib/supabase.js
- documents.controller.js
- react
- lucide-react
- Dashboard.jsx
- sonner
- Documents.jsx
- streak.service.js
- scripts
- rooms.controller.js
- notifications/NotificationBell.jsx
- Adaptive Quiz Generator for Peer Club
- FlashcardStudyMode.jsx
- Adaptive Flashcard Deck Generator for Peer Club
- vite.config.js
- TakeQuizPage.jsx
- client/src/utils/dateUtils.js

## God Nodes (most connected - your core abstractions)
1. `react` - 133 edges
2. `lucide-react` - 85 edges
3. `react-router-dom` - 50 edges
4. `cn()` - 45 edges
5. `sonner` - 37 edges
6. `useAuth()` - 31 edges
7. `api` - 24 edges
8. `2. Tables` - 21 edges
9. `2. Screen-by-Screen Flow` - 20 edges
10. `Peer Club - Month 1 MVP Build` - 19 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/App.jsx → client/src/hooks/useAuth.ts
- `DocumentUploadModal()` --calls--> `triggerStreakActivity()`  [EXTRACTED]
  client/src/components/documents/DocumentUploadModal.jsx → client/src/components/StreakCard.jsx
- `DocumentsPage()` --calls--> `triggerStreakActivity()`  [EXTRACTED]
  client/src/pages/Documents.jsx → client/src/components/StreakCard.jsx
- `FlashcardStudyMode()` --calls--> `triggerStreakActivity()`  [EXTRACTED]
  client/src/pages/FlashcardStudyMode.jsx → client/src/components/StreakCard.jsx
- `TakeQuizPage()` --calls--> `triggerStreakActivity()`  [EXTRACTED]
  client/src/pages/quiz/TakeQuizPage.jsx → client/src/components/StreakCard.jsx

## Import Cycles
- None detected.

## Communities (87 total, 12 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, axios, cloudinary, cors, dotenv, express, @google/generative-ai, helmet (+6 more)

### Community 1 - "client/package.json"
Cohesion: 0.08
Nodes (24): axios, @supabase/supabase-js, zod, name, private, type, version, autoprefixer (+16 more)

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
Cohesion: 0.24
Nodes (12): deleteFlashcardSet(), generateFlashcards(), getFlashcardSet(), listFlashcardSets(), memoryFlashcardSets, updateFlashcardProgress(), buildQuizUserPrompt(), extractJson() (+4 more)

### Community 12 - "cn"
Cohesion: 0.07
Nodes (47): LogStudyModal(), SparklineCard(), StatCard(), GenerateFlashcardModal(), BottomTabBar(), tabs, NotificationBell(), Sidebar() (+39 more)

### Community 14 - "DocumentUploadModal.jsx"
Cohesion: 0.12
Nodes (22): AnimatedLoader(), COLOR_VARIANTS, ROTATIONS, CATEGORIES, DocumentUploadModal(), PREVIEW_STYLES, FileUploadZone(), FormField() (+14 more)

### Community 15 - "auth.middleware.js"
Cohesion: 0.16
Nodes (16): express, getGlobalLeaderboard(), getRoomLeaderboard(), getNotifications(), markAllAsRead(), markAsRead(), deleteAccount(), changePassword() (+8 more)

### Community 16 - "quiz.controller.js"
Cohesion: 0.23
Nodes (10): getDocumentById(), generateQuiz(), getAttempt(), getQuiz(), listQuizzes(), memoryQuizzes, submitAttempt(), createStudySession() (+2 more)

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

### Community 21 - "users.routes.js"
Cohesion: 0.33
Nodes (7): deleteMe(), getBadges, changePassword(), getMe(), updateMe(), updatePreferences(), usersRouter

### Community 22 - "app.js"
Cohesion: 0.17
Nodes (13): checkLapsedStreaksInternal(), getAdminDigest(), getInactiveUsers(), getStreakAlertUsers(), getWeeklyStats(), errorHandler(), documentsRouter, flashcardsRouter (+5 more)

### Community 23 - "Task Graphs: Orchestrating Agents"
Cohesion: 0.22
Nodes (8): Contents, Fake edges, Guardrails, Task Graphs: Orchestrating Agents, The diamond pattern, The human gate, The stop rule, What a task graph is

### Community 24 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 25 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 26 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, db:deploy, db:migrate, db:seed, db:studio, dev, generate, start (+1 more)

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

### Community 33 - "AboutSection.jsx"
Cohesion: 0.28
Nodes (6): AboutSection(), STUDY_GOAL_OPTIONS, AVATAR_PRESETS, AvatarPicker(), ALL_SUBJECTS, SubjectChips()

### Community 34 - "App.jsx"
Cohesion: 0.08
Nodes (28): App(), App(), PrivateRoute(), AppLayout(), AuthState, useAuth(), queryClient, ForgotPasswordPage() (+20 more)

### Community 35 - "Knowledge Representation & Ontology Modeling"
Cohesion: 0.29
Nodes (7): Choosing a representation, Contents, Knowledge Representation & Ontology Modeling, Ontology engineering method, Ontology learning, Schema design rules, Worked example

### Community 37 - "Knowledge Representation & Ontology Modeling"
Cohesion: 0.29
Nodes (7): Choosing a representation, Contents, Knowledge Representation & Ontology Modeling, Ontology engineering method, Ontology learning, Schema design rules, Worked example

### Community 38 - "n8n Automation Workflows for Peer Club"
Cohesion: 0.20
Nodes (9): 🧠 Adaptive Learning Engine Specification, 📁 Available Workflows, 🚀 How to Import and Run Workflows in n8n, n8n Automation Workflows for Peer Club, Option A: Local n8n Instance (Free), Option B: Hosted / n8n Cloud, 🔒 Security & Headers, Webhook Request Payload (`/webhook/generate-quiz` & `/webhook/generate-flashcards`) (+1 more)

### Community 39 - "react-router-dom"
Cohesion: 0.16
Nodes (12): BadgesSection(), DEFAULT_BADGES, DeleteConfirmationModal(), DEFAULT_PREFERENCES, PreferencesSection(), ProfileHero(), SecuritySection(), DEFAULT_ADMIN_ROOMS (+4 more)

### Community 40 - "RoomsPage.jsx"
Cohesion: 0.16
Nodes (9): CreateRoomModal(), DocumentsVault(), JoinRoomModal(), MembersList(), RoomCard(), RoomHeader(), RoomLeaderboard(), SAMPLE_STUDY_ROOMS (+1 more)

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
Cohesion: 0.08
Nodes (23): cloudinary, cors, dotenv, @google/generative-ai, helmet, nodemon, pdf-parse, prisma (+15 more)

### Community 48 - "navigation/UniversalNavbar.jsx"
Cohesion: 0.20
Nodes (9): MobileTopBar(), MoreMenu(), NavLinkItem(), UniversalNavbar(), NotificationBell(), MOBILE_NAV_ITEMS, PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS (+1 more)

### Community 49 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, autoprefixer, postcss, tailwindcss, vite, @vitejs/plugin-react

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

### Community 69 - "dashboard.controller.js"
Cohesion: 0.54
Nodes (6): calculateBadgeLevel(), calculateUserBadges(), getDashboardData(), getDashboardStats(), withTimeout(), dashboardRouter

### Community 71 - "documents.controller.js"
Cohesion: 0.17
Nodes (11): multer, deleteDocument(), getDocument(), listDocuments(), memoryDocuments, uploadDocument(), allowedMimeTypes, storage (+3 more)

### Community 72 - "react"
Cohesion: 0.13
Nodes (8): LeagueTiers(), RankingTable(), StatCard(), UserRow(), QuizCard(), ResultsBreakdown(), StatCard(), react

### Community 73 - "lucide-react"
Cohesion: 0.14
Nodes (9): DeckGrid(), FILTER_CHIPS, FilterBar(), FlashcardDeckCard(), getSubjectGradient(), FilterTabs(), PersonalRankCard(), OptionButton() (+1 more)

### Community 74 - "Dashboard.jsx"
Cohesion: 0.24
Nodes (12): DotGridPattern(), HandDrawnUnderline(), PastelBlob(), TornPaperBackdrop(), EmptyState(), SAMPLE_LEADERBOARD_USERS, NotificationFilters(), GenerationModal() (+4 more)

### Community 75 - "sonner"
Cohesion: 0.19
Nodes (12): PodiumShowcase(), LogSessionModal(), StreakCard(), triggerStreakActivity(), DocumentCard(), formatFileSize(), formatUploadDate(), FileDropzone() (+4 more)

### Community 76 - "Documents.jsx"
Cohesion: 0.17
Nodes (9): HandDrawnArrow(), DocumentCard(), BACKDROP_COLORS, DocumentGrid(), DocumentPreview(), DocumentsSidebar(), EmptyDocsState(), SearchBar() (+1 more)

### Community 77 - "streak.service.js"
Cohesion: 0.12
Nodes (33): app, getStreak(), resetStreak(), updateStreak(), streakRouter, server, calculateNextStreak(), checkAndResetLapsedStreaks() (+25 more)

### Community 78 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 79 - "rooms.controller.js"
Cohesion: 0.33
Nodes (8): uuid, createRoom(), generateRoomCode(), getRoom(), joinRoom(), leaveRoom(), listRooms(), localRoomsStore

### Community 80 - "notifications/NotificationBell.jsx"
Cohesion: 0.43
Nodes (3): NotificationCard(), NotificationIcon(), SAMPLE_NOTIFICATIONS

### Community 81 - "Adaptive Quiz Generator for Peer Club"
Cohesion: 0.25
Nodes (7): Adaptive Behavior Guidelines, Adaptive Quiz Generator for Peer Club, Conversion to Integer Counts, Difficulty Definitions, Difficulty Rules & Distribution, Input Parameters, Output JSON Schema

### Community 82 - "FlashcardStudyMode.jsx"
Cohesion: 0.23
Nodes (6): FlipCard3D(), ProgressBar(), RatingControls(), SAMPLE_FLASHCARD_DECKS, SessionCompleteModal(), FlashcardStudyMode()

### Community 83 - "Adaptive Flashcard Deck Generator for Peer Club"
Cohesion: 0.29
Nodes (6): Adaptive Behavior Guidelines, Adaptive Flashcard Deck Generator for Peer Club, Difficulty Definitions for Flashcards, Difficulty Rules & Cognitive Depth Distribution, Input Parameters, Output JSON Schema

### Community 85 - "TakeQuizPage.jsx"
Cohesion: 0.36
Nodes (4): ProgressBar(), QuestionCard(), SAMPLE_QUIZZES, Timer()

### Community 88 - "client/src/utils/dateUtils.js"
Cohesion: 0.60
Nodes (5): daysBetween(), isSameDay(), isStreakActive(), isYesterday(), normalizeDateToUtc()

## Knowledge Gaps
- **482 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+477 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 587 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `client/package.json`, `App.jsx`, `AboutSection.jsx`, `react-router-dom`, `RoomsPage.jsx`, `lucide-react`, `Dashboard.jsx`, `sonner`, `cn`, `Documents.jsx`, `DocumentUploadModal.jsx`, `Landing.jsx`, `navigation/UniversalNavbar.jsx`, `notifications/NotificationBell.jsx`, `supabase.ts`, `FlashcardStudyMode.jsx`, `TakeQuizPage.jsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `react-router-dom` to `client/package.json`, `App.jsx`, `RoomsPage.jsx`, `lucide-react`, `Dashboard.jsx`, `cn`, `Documents.jsx`, `Landing.jsx`, `navigation/UniversalNavbar.jsx`, `notifications/NotificationBell.jsx`, `supabase.ts`, `FlashcardStudyMode.jsx`, `TakeQuizPage.jsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `client/package.json`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _482 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Peer Club` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._