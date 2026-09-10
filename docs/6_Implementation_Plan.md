# Implementation Plan
# Peer Club - Month 1 MVP Build

## Overview

Stack: React.js (Vercel) + Express.js (Render) + Supabase (PostgreSQL) + Prisma +
JWT Auth + Google OAuth (Passport.js) + Google Gemini API + Multer + pdf-parse +
Cloudinary + nodemailer + n8n automation (15 workflows)

Month 1 Scope: Auth, Dashboard, Document Upload, AI Quiz, Flashcards, Profile,
               In-App Notifications, Session Logging, Badge System, n8n Automation
NOT in Month 1: Study Rooms, Socket.io, Leaderboard, Shared Notes, Pomodoro Timer

Total: ~27 days (solo developer, full-time)

---

## Phase 0: Project Setup
Duration: Day 1-2

0.1 Repository Setup
- GitHub repo: peer-club with /client and /server folders
- React: npm create vite@latest client -- --template react-ts
- Express: cd server && npm init -y

0.2 Client Dependencies
  npm install react-router-dom@6 axios @tanstack/react-query zustand
    react-hook-form zod @hookform/resolvers framer-motion lucide-react
    react-pdf recharts date-fns react-dropzone
  npx shadcn@latest init
  npx shadcn@latest add button card input label badge dialog
    dropdown-menu skeleton progress tabs avatar separator sonner

0.3 Server Dependencies
  npm install express cors helmet dotenv bcryptjs jsonwebtoken uuid
    prisma @prisma/client passport passport-google-oauth20
    multer pdf-parse cloudinary @google/generative-ai
    nodemailer express-rate-limit zod axios

0.4 Environment Files
/server/.env extras for n8n:
  N8N_WEBHOOK_BASE_URL=
  N8N_WEBHOOK_SECRET=
  N8N_ONBOARDING_WEBHOOK_ID=
  N8N_BADGE_WEBHOOK_ID=
  N8N_STREAK_BROKEN_WEBHOOK_ID=
  N8N_QUIZ_SCORE_WEBHOOK_ID=
  N8N_DOCUMENT_SUMMARY_WEBHOOK_ID=
  N8N_SESSION_MILESTONE_WEBHOOK_ID=

0.5 TypeScript Config
  tsconfig.json: strict mode, outDir: dist, path aliases
  nodemon.json: watch src/, exec ts-node src/server.ts

0.6 Supabase Setup
  Create project, copy DATABASE_URL + DIRECT_URL
  npx prisma init

Deliverables: both apps run, Prisma connects to Supabase

---

## Phase 1: Database Schema
Duration: Day 2-3

1.1 Write Prisma Schema (all 20 models from Backend Schema doc)
  Plus 2 additional tables:
    ai_request_log: id, user_id, created_at
      (tracks AI calls per user per hour for rate limiting)
    n8n_event_log: id, user_id, event_type, fired_at
      (prevents duplicate webhook triggers)

1.2 Migrations
  npx prisma migrate dev --name init
  npx prisma generate

1.3 Seed Data
  prisma/seed.ts -> seed all 10 badges
  npx prisma db seed

1.4 Prisma Singleton
  src/lib/prisma.ts -> singleton PrismaClient

Deliverables: all tables in Supabase, 10 badges seeded

---

## Phase 2: Express Server and Authentication
Duration: Day 3-6

2.1 Express App
  src/app.ts: CORS (CLIENT_URL only), Helmet, JSON parser, all routes
  src/server.ts: createServer(app), listen on PORT

2.2 Middleware Stack
  auth.middleware.ts: verify Bearer JWT, attach req.user
  validate.middleware.ts: Zod schema wrapper
  rateLimit.middleware.ts: general / auth / AI limiters
  upload.middleware.ts: Multer memoryStorage, 10MB, PDF+txt only
  internalAuth.middleware.ts: verify X-N8N-Secret header
  errorHandler.middleware.ts: global error -> JSON response

2.3 Auth Library
  src/lib/jwt.ts: generateAccessToken (15min), generateRefreshToken (UUID stored in DB), verifyToken
  src/lib/passport.ts: GoogleStrategy, upsert user by google_id or email

2.4 Auth Endpoints
  POST /api/auth/register
    -> Zod validate -> check unique email -> hash password
    -> Create User + UserPreferences (transaction)
    -> Generate 24h verification token
    -> Fire n8n webhook: user.registered
    -> Return { message }

  POST /api/auth/login
    -> Validate creds -> check emailVerified
    -> accessToken in body + refreshToken in HTTP-only cookie

  POST /api/auth/refresh
    -> Read cookie -> verify in DB -> issue new pair

  DELETE /api/auth/logout -> revoke token, clear cookie

  GET /api/auth/verify-email?token=
    -> Mark emailVerified = true
    -> Fire n8n webhook: email.verified
    -> Redirect to CLIENT_URL/login?verified=true

  POST /api/auth/resend-verification
  POST /api/auth/forgot-password
  POST /api/auth/reset-password
  GET /api/auth/google + GET /api/auth/google/callback (Passport)

2.5 React Auth Pages + PrivateRoute
  PrivateRoute: checks authStore.accessToken, silently refreshes on null
  LoginPage, RegisterPage, VerifyEmailPage
  ForgotPasswordPage, ResetPasswordPage

2.6 Axios Interceptor (client/src/lib/api.ts)
  Attach Authorization: Bearer token
  On 401: auto-refresh -> retry request
  On refresh fail: clear store, redirect /login

Deliverables: full auth flow, Google OAuth, webhooks fire on register + verify

---

## Phase 3: Core React Layout
Duration: Day 6-7

3.1 Tailwind dark theme config (colors from UI/UX Brief)
3.2 AppLayout: TopNav (64px) + Sidebar (240px) + Outlet
3.3 TopNav: Logo + Bell + AvatarDropdown
3.4 Sidebar: nav links with violet active state
3.5 BottomTabBar: 5 tabs for mobile
3.6 React Router setup with all Month 1 routes

Deliverables: shell renders all screen sizes, dark theme applied

---

## Phase 4: Dashboard
Duration: Day 7-9

4.1 Dashboard API (GET /api/dashboard)
  Returns:
    today_minutes, week_by_day (7 days), current_streak, longest_streak
    quizzes_this_week, avg_quiz_score, recent_quiz_attempts (3)
    recent_documents (3), badges_count, recent_badges (2), total_study_minutes

4.2 Dashboard Components
  StatCard: icon, value, label, accent color
  ActivityChart: Recharts BarChart 7-day dark theme
  StreakCounter: flame icon, count-up animation
  RecentQuizzes: 3 cards with score bar
  BadgesWidget: 2 recent badges
  RecentDocuments: 3 doc cards with quick actions

4.3 Empty states for new users

Deliverables: dashboard shows real data, charts render

---

## Phase 5: Document Upload
Duration: Day 9-10

5.1 Cloudinary (src/services/storage.service.ts)
  uploadBuffer, getSignedUrl (10min), deleteFile

5.2 Document API
  POST /api/documents (multipart/form-data)
    -> Multer -> validate type+size -> count check (max 10 per user)
    -> pdf-parse(buffer) -> extractedText
    -> cloudinary upload -> save Document to DB
    -> Fire n8n webhook: document.uploaded { docId, textLength }
  GET /api/documents -> list with fresh signed URLs
  GET /api/documents/:id/url -> fresh signed URL
  DELETE /api/documents/:id -> soft delete + cloudinary destroy

5.3 Upload React Page
  FileDropzone: react-dropzone, constraints label
  UploadProgress: Axios onUploadProgress bar
  DocumentCard: filename, size, date, quick action buttons
  PDF preview: iframe in Dialog

Deliverables: upload -> Cloudinary + text in DB + n8n webhook fires

---

## Phase 6: AI Quiz Generator
Duration: Day 10-12

6.1 Gemini Client (src/lib/gemini.ts)
  gemini-1.5-flash model

6.2 AI Rate Limiting
  Check ai_request_log: count WHERE user_id AND created_at > 1h ago
  Reject if >= 10 (429), else insert log row after success

6.3 AI Service (src/services/ai.service.ts)
  generateQuiz(text, count, difficulty, type): Gemini call, Zod validate JSON
  generateFlashcards(text, count): Gemini call, Zod validate JSON
  generateDocumentSummary(text): 3 bullet points + key topics
  generateStudyTips(weakTopics[]): 3 personalised tips in 100 words

6.4 Quiz API
  POST /api/quiz/generate -> rate check -> Gemini -> save Quiz + Questions
  GET /api/quiz -> list user quizzes
  GET /api/quiz/:id -> quiz + questions (no correct answers)
  POST /api/quiz/:id/attempts
    -> score all answers -> save QuizAttempt + Answers
    -> checkAndAwardBadges(userId)
    -> logStudyActivity(userId)
    -> Fire n8n webhook: quiz.completed { score, percentage, difficulty }
  GET /api/quiz/:id/attempts -> list attempts

6.5 Quiz React Pages
  GenerateQuizPage: doc selector, difficulty, count, type, loading state
  TakeQuizPage: progress bar, MCQ radios or text area
  QuizResultsPage: score circle, per-question review accordion

Deliverables: quiz generated in < 15s, scored, n8n webhook fires on completion

---

## Phase 7: Flashcard Generator
Duration: Day 12-13

7.1 Flashcard API
  POST /api/flashcards/generate -> AI rate check -> Gemini -> save Set + Cards
  GET /api/flashcards -> list sets
  GET /api/flashcards/:setId -> set + cards + user progress
  PATCH /api/flashcards/:cardId/progress { status: known|revisit }

7.2 FlipCard React Component
  3D CSS rotateY 180deg on click or Space
  Known (green) and Revisit (orange) buttons
  Progress bar + end-of-set summary screen
  Touch support: swipe right = Known, swipe left = Revisit

Deliverables: flashcards generated in < 10s, flip animation, progress persists

---

## Phase 8: Profile Page
Duration: Day 13-14

8.1 User API
  GET /api/users/me -> user + preferences + badges count + stats
  PATCH /api/users/me -> name, subjects, avatarUrl
  PATCH /api/users/me/preferences -> all n8n email opt-ins (one per workflow)
  POST /api/users/me/change-password
  DELETE /api/users/me -> soft delete + revoke tokens
  GET /api/users/me/badges -> all badges (earned + locked)

8.2 Profile React Page
  Avatar: preset grid or Cloudinary upload
  Name + Subjects multi-select
  Change password form
  Notification Preferences (individual toggle per n8n workflow):
    Weekly Progress Report | Daily Streak Alert | Badge Earned Alert
    Inactivity Reminder (3-day) | Document Reminder | Low Quiz Score Tips
    Document TL;DR Summary | Monthly Report Card
  BadgeGrid: earned (color + date) + locked (greyscale + threshold)
  Delete Account danger zone

Deliverables: profile saves, each n8n email has individual opt-in toggle

---

## Phase 9: In-App Notifications
Duration: Day 14-15

9.1 Notifications API
  GET /api/notifications?page=1&limit=20 (paginated)
  PATCH /api/notifications/read-all
  PATCH /api/notifications/:id/read

9.2 Notification Bell in TopNav
  Poll unread count every 60s
  Red badge dot on Bell icon
  Dropdown: last 5 notifications

9.3 Notifications Page
  Full paginated list: Today / Yesterday / This Week / Older

Deliverables: notifications show for badges and system events

---

## Phase 10: Study Session Logging and Streak
Duration: Day 15

10.1 Session API
  POST /api/sessions { sessionType, plannedMinutes, actualMinutes, completed }
    -> Create StudySession
    -> streak.service.updateStreak(userId)
    -> badges.service.checkAndAwardBadges(userId)
    -> Fire n8n webhook: session.completed { minutes, newStreak, totalMinutes }
    -> Return { session, newStreak, badgesAwarded }

10.2 Streak Service (src/services/streak.service.ts)
  updateStreak(userId):
    if last_study_date == today: return (already counted)
    if last_study_date == yesterday: increment streak
    else: reset streak to 1
    update last_study_date, total_study_minutes

10.3 Manual Session Logger (client)
  "Log Study Time" modal on Dashboard
  Duration picker + session type + completed toggle

Deliverables: sessions logged, streak logic correct, n8n fires on completion

---

## Phase 11: Badge System
Duration: Day 15-16

11.1 Badge Service (src/services/badges.service.ts)
checkAndAwardBadges(userId):
  Fetch user stats
  For each unearned badge: check threshold
  If met: insert user_badges + insert notification record
  Fire n8n webhook: badge.awarded { badgeName, badgeIconUrl }
  Return: newly awarded badges[]

Month 1 badges (excluding room badges):
  first_quiz, quiz_master, streak_3, streak_7, streak_30
  study_hour_1, study_hour_10, study_hour_50

Deliverables: badges auto-awarded, notifications created, n8n fires per badge

---

## Phase 12: EXPANDED n8n Automation (15 Workflows)
Duration: Day 16-21

--- INTERNAL ROUTES (all protected by X-N8N-Secret header) ---

GET /api/internal/streak-alert-users
  -> Users where streak > 0, not studied today, email_streak_alert = true

GET /api/internal/inactive-users?days=3
  -> Users where last activity < N days ago, email_inactivity_alert = true

GET /api/internal/weekly-stats/:userId
  -> This week vs last week: study minutes, quizzes, avg score, streak, badges

GET /api/internal/weak-quiz-topics/:userId
  -> Quiz attempts where percentage < 60, grouped by document (max 3)

GET /api/internal/unquizzed-documents
  -> Documents older than 48h with no quiz, user opted in to document_reminder

GET /api/internal/quiz-abandoned-users
  -> Users with quiz generated but no attempt in 48h

GET /api/internal/monthly-stats/:userId
  -> Full month aggregate vs previous month

GET /api/internal/admin-digest
  -> Platform-wide: signups, DAU, quizzes, docs, AI calls (needs ADMIN_SECRET header)

--- n8n SERVICE ---

src/services/n8n.service.ts
  triggerWebhook(webhookId, payload): async POST to n8n, catch+log errors
  (never throw - automation failures must NOT break main API flow)
  After success: insert into n8n_event_log for idempotency

--- WEBHOOK EVENTS FIRED FROM EXPRESS ---

user.registered   -> after User created in DB
email.verified    -> after emailVerified = true
document.uploaded -> after Document saved to DB
quiz.completed    -> after QuizAttempt saved (always fires, n8n filters by score)
badge.awarded     -> after user_badges insert (one per badge)
session.completed -> after StudySession created
streak.broken     -> when streak resets from > 1 to 1

--- 15 n8n WORKFLOWS ---

1. Welcome Email
   Trigger: Webhook user.registered | instant
   Action: Send welcome HTML email with verify CTA

2. Onboarding Sequence (6-step drip)
   Trigger: Webhook user.registered | delayed steps
   Step 1 (instant): Upload prompt
   Step 2 (after email.verified OR 24h): Getting started tip
   Step 3 (Day 2): Check doc uploaded -> nudge if not
   Step 4 (Day 4): Check quiz taken -> feature highlight if not
   Step 5 (Day 7): Social proof stats email
   Step 6 (Day 14): Flashcard feature highlight if never used

3. Daily Streak Alert
   Trigger: CRON 9PM IST | GET /api/internal/streak-alert-users
   Action: Personalised "Your {N}-day streak ends at midnight!" email

4. Weekly Progress Report
   Trigger: CRON Monday 8AM | GET /api/internal/weekly-stats/{userId} per user
   Action: HTML report: hours vs last week, quiz scores, streak, badges, CTA

5. Badge Celebration Email
   Trigger: Webhook badge.awarded | instant
   Action: "{badgeName}" earned - badge image + description + dashboard link

6. Document TL;DR Summary (AI-powered)
   Trigger: Webhook document.uploaded | if textLength > 500 chars
   Action: Call Gemini directly in n8n -> 3 bullet summary + key topics -> email

7. Low Quiz Score Study Tips (AI-powered)
   Trigger: Webhook quiz.completed | only if percentage < 60
   Action: GET weak-quiz-topics -> call Gemini for 3 tips -> "Here is how to improve" email

8. 3-Day Inactivity Re-engagement
   Trigger: CRON 10AM IST | GET /api/internal/inactive-users?days=3
   Action: "We miss you" email with last activity context + dashboard CTA

9. 7-Day Lapse Win-Back
   Trigger: CRON 10:30AM IST | GET /api/internal/inactive-users?days=7
   Action: Show total hours + badges earned + "you were close to {next badge}" email

10. Document Reminder (quiz not generated)
    Trigger: CRON 11AM IST | GET /api/internal/unquizzed-documents
    Action: "Turn {doc} into a quiz in one click" email with direct link

11. Quiz Abandonment Reminder
    Trigger: CRON 11:30AM IST | GET /api/internal/quiz-abandoned-users
    Action: "Your {quiz} is ready to take" email with direct link

12. Study Milestone Celebration
    Trigger: Webhook session.completed | check totalStudyMinutes
    Action: If hits 60/600/3000 min milestone -> celebration email

13. Streak Recovery Email
    Trigger: Webhook streak.broken | instant
    Action: "Streaks break. Champions restart." motivational email

14. Monthly Report Card
    Trigger: CRON 1st of month 9AM IST | per user
    Action: Full month vs previous month HTML report + goal for next month

15. Admin Daily Digest
    Trigger: CRON 8AM IST | GET /api/internal/admin-digest
    Action: Email to admin: signups, DAU, quizzes, docs, AI usage

--- n8n SETUP ---
1. n8n Cloud (free: 5 active workflows) OR self-host on Railway (n8nio/n8n Docker)
2. Credentials in n8n: SMTP, Gemini API key, internal API secret header
3. Copy all webhook URLs into server .env N8N_*_WEBHOOK_ID vars
4. All CRON workflows check user preference opt-ins via internal API

Deliverables:
- All 15 n8n workflows built and activated
- All 8 internal API routes secured and working
- All webhook events firing from Express controllers
- User notification preferences respected per workflow
- End-to-end email delivery verified

---

## Phase 13: Polish and Error Handling
Duration: Day 21-23

- Express global error handler (Prisma + Zod error mapping)
- React ErrorBoundary per route
- Skeleton loaders on all queries, spinner on all mutations
- Empty states everywhere with icon + message + CTA
- Rate limiting fine-tuning
- Mobile responsiveness audit (320px to 1440px)

---

## Phase 14: Testing
Duration: Day 23-25

Unit: streak.service, badges.service, ai.service (mock Gemini), n8n.service (mock axios), jwt
Integration: auth flow, document upload, quiz generate+attempt
E2E (Playwright):
  Path 1: Register -> Verify -> Login -> Upload -> Quiz -> Results -> Dashboard
  Path 2: Login -> Upload -> Flashcards -> Review All -> Progress
  Path 3: Log Session -> Streak increments -> Badge awarded -> Notification appears
Manual: AI PDFs, edge cases, all 15 n8n workflows, email opt-out

---

## Phase 15: Deployment
Duration: Day 25-27

Backend (Render):
  Build: npm install && npx prisma generate && npm run build
  Start: node dist/server.js
  Add all env vars including all N8N_*

Database (Supabase):
  npx prisma migrate deploy
  npx prisma db seed
  Enable Pgbouncer

Frontend (Vercel):
  Root: client | Build: npm run build | Output: dist
  SPA rewrite: all -> /index.html

n8n:
  Activate all 15 workflows
  Point webhooks to production Render URL

Monitoring: GET /api/health, Vercel Analytics, UptimeRobot

---

## n8n Workflows Summary

| # | Workflow | Trigger | Uses Gemini |
|---|---|---|---|
| 1 | Welcome Email | Webhook: user.registered | No |
| 2 | Onboarding Sequence (6 steps) | Webhook: user.registered | No |
| 3 | Daily Streak Alert | CRON 9PM | No |
| 4 | Weekly Progress Report | CRON Monday | No |
| 5 | Badge Celebration Email | Webhook: badge.awarded | No |
| 6 | Document TL;DR Summary | Webhook: document.uploaded | YES |
| 7 | Low Quiz Score Study Tips | Webhook: quiz.completed < 60% | YES |
| 8 | 3-Day Inactivity Re-engagement | CRON 10AM | No |
| 9 | 7-Day Lapse Win-Back | CRON 10:30AM | No |
| 10 | Document Reminder (no quiz) | CRON 11AM | No |
| 11 | Quiz Abandonment Reminder | CRON 11:30AM | No |
| 12 | Study Milestone Celebration | Webhook: session.completed | No |
| 13 | Streak Recovery Email | Webhook: streak.broken | No |
| 14 | Monthly Report Card | CRON 1st of month | No |
| 15 | Admin Daily Digest | CRON 8AM | No |
