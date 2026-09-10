# Technical Requirements Document (TRD)
# Peer Club

---

## 1. Architecture Overview

Peer Club uses a **separated frontend + backend** architecture:
- A **React.js SPA** hosted on Vercel for the client
- An **Express.js REST API server** hosted on Render for business logic
- A **Socket.io server** (integrated into the Express app) for real-time features
- **Supabase** for managed PostgreSQL database
- **Cloudinary / Firebase Storage** for file uploads
- **Google Gemini API** for AI quiz and flashcard generation
- **n8n** for automation workflows (email sequences, streak checks, weekly summaries)

```
BROWSER (React.js SPA - Vercel)
  |
  +--HTTPS/REST--> Express.js API Server (Render)
  |                    |
  +--WSS----------> Socket.io (same Express server)
                       |
                +------+------+----------+-----------+
                |             |          |           |
           Supabase      Cloudinary  Google      n8n
           (PostgreSQL)  /Firebase   Gemini API  (Automation)
                         Storage
```

---

## 2. Frontend Stack

| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 18.x | UI library, SPA routing |
| **TypeScript** | 5.x | Type safety |
| **React Router DOM** | 6.x | Client-side routing |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **shadcn/ui** | Latest | Pre-built accessible components |
| **Zustand** | 4.x | Lightweight global state management |
| **TanStack Query** | 5.x | API data fetching, caching, sync |
| **Axios** | 1.x | HTTP client for REST API calls |
| **Socket.io Client** | 4.x | Real-time WebSocket connection |
| **React Hook Form** | 7.x | Form handling and validation |
| **Zod** | 3.x | Schema-based client-side validation |
| **Framer Motion** | 11.x | Animations and transitions |
| **react-pdf** | 7.x | In-browser PDF preview |
| **Recharts** | 2.x | Dashboard charts and graphs |
| **date-fns** | 3.x | Date formatting and manipulation |
| **Lucide React** | Latest | Icon library |

### Frontend Project Structure
```
/src
  /pages            (route-level components)
    /auth           (Login, Register, VerifyEmail, ResetPassword)
    /dashboard      (Dashboard)
    /rooms          (RoomList, CreateRoom, JoinRoom, RoomHome)
    /quiz           (TakeQuiz, QuizResults)
    /flashcards     (ReviewFlashcards)
    /notes          (NotesEditor)
    /leaderboard    (Leaderboard)
    /profile        (Profile)
  /components
    /ui             (shadcn base components)
    /shared         (Navbar, Sidebar, Toast, Modal)
    /timer          (PomodoroTimer, TimerRing)
    /quiz           (QuizCard, QuestionDisplay, ResultsView)
    /flashcards     (FlipCard, FlashcardSet)
    /dashboard      (StatCard, ActivityChart, RoomWidget)
  /hooks            (custom React hooks)
  /stores           (Zustand stores)
  /lib
    /api.ts         (Axios instance + interceptors)
    /socket.ts      (Socket.io client singleton)
    /auth.ts        (JWT storage and refresh logic)
    /utils.ts
  /types            (TypeScript interfaces)
```

### Routing Structure
```
Public:
  /                     Landing Page
  /login                Login
  /register             Register
  /verify-email         Email Verification
  /forgot-password      Forgot Password
  /reset-password       Reset Password

Protected (PrivateRoute wrapper):
  /dashboard            Dashboard
  /rooms                My Rooms
  /rooms/new            Create Room
  /rooms/join           Join Room
  /rooms/:roomId        Room Home
  /rooms/:roomId/quiz/:quizId   Take Quiz
  /rooms/:roomId/flashcards/:setId  Review Flashcards
  /rooms/:roomId/notes  Notes Editor
  /leaderboard          Leaderboard
  /profile              Profile & Settings
  /notifications        All Notifications
```

---

## 3. Backend Stack

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 20.x LTS | Runtime |
| **Express.js** | 4.x | REST API framework |
| **Socket.io** | 4.x | Real-time server (integrated with Express) |
| **Prisma ORM** | 5.x | Database access layer and migrations |
| **jsonwebtoken** | 9.x | JWT signing and verification |
| **bcryptjs** | 2.x | Password hashing (12 salt rounds) |
| **Multer** | 1.x | Multipart form-data / file upload handling |
| **pdf-parse** | 1.x | Extract text content from PDF files |
| **@google/generative-ai** | Latest | Google Gemini API SDK |
| **cloudinary** | 2.x | Cloudinary SDK for file storage |
| **cors** | 2.x | Cross-origin resource sharing |
| **helmet** | 7.x | HTTP security headers |
| **express-rate-limit** | 7.x | Rate limiting middleware |
| **express-validator** | 7.x | Input validation |
| **zod** | 3.x | Schema validation for API bodies |
| **nodemailer** | 6.x | Email sending (via SMTP / Resend relay) |
| **dotenv** | 16.x | Environment variable loading |
| **passport** | 0.7.x | OAuth strategy middleware |
| **passport-google-oauth20** | 2.x | Google OAuth 2.0 strategy |

### Backend Project Structure
```
/server
  /src
    /controllers      (route handler functions)
      auth.controller.ts
      rooms.controller.ts
      documents.controller.ts
      quiz.controller.ts
      flashcards.controller.ts
      notes.controller.ts
      sessions.controller.ts
      leaderboard.controller.ts
      notifications.controller.ts
      users.controller.ts
    /routes           (Express Router files)
    /middleware
      auth.middleware.ts     (JWT verification)
      upload.middleware.ts   (Multer config)
      rateLimit.middleware.ts
      validate.middleware.ts (Zod validation)
    /services         (business logic)
      ai.service.ts          (Gemini calls)
      storage.service.ts     (Cloudinary)
      email.service.ts       (nodemailer)
      badges.service.ts      (badge checking)
      streak.service.ts      (streak calculation)
    /socket           (Socket.io event handlers)
      timer.socket.ts
      presence.socket.ts
    /lib
      prisma.ts              (Prisma client singleton)
      gemini.ts              (Gemini client setup)
      cloudinary.ts          (Cloudinary config)
      passport.ts            (Google OAuth config)
    /types
    app.ts                   (Express app setup)
    server.ts                (HTTP + Socket.io server)
  prisma/
    schema.prisma
    seed.ts
```

---

## 4. Database

| Property | Choice |
|---|---|
| **Database** | PostgreSQL 15+ |
| **Hosting** | Supabase (managed PostgreSQL) |
| **ORM** | Prisma 5.x |
| **Connection Pooling** | Supabase Pgbouncer (Transaction mode) |
| **Migrations** | Prisma Migrate |
| **Direct URL** | Supabase direct connection (for migrations) |

### Why Supabase?
- Managed PostgreSQL with generous free tier
- Built-in connection pooling via Pgbouncer
- Dashboard for easy DB inspection
- Can use Supabase Storage as backup to Cloudinary if needed

---

## 5. Authentication

| Aspect | Implementation |
|---|---|
| **Strategy** | JWT (Access Token + Refresh Token) |
| **Access Token** | Signed with `JWT_SECRET`, short-lived (15 min) |
| **Refresh Token** | Stored in DB, long-lived (30 days), rotated on use |
| **Storage (Client)** | Access token in memory (Zustand), Refresh token in HTTP-only cookie |
| **Social Auth** | Google OAuth 2.0 via Passport.js `passport-google-oauth20` |
| **Password Hashing** | bcryptjs (12 salt rounds) |
| **Email Verification** | UUID token stored in DB (24h expiry), sent via nodemailer |
| **Password Reset** | UUID token stored in DB (15 min expiry) |

### JWT Auth Flow
```
1. POST /api/auth/login
   -> validate credentials
   -> return { accessToken } in response body
   -> set refreshToken in HTTP-only cookie

2. All protected API calls:
   -> Authorization: Bearer {accessToken}
   -> auth.middleware.ts verifies token

3. Access token expired:
   -> POST /api/auth/refresh
   -> reads refreshToken from cookie
   -> issues new accessToken + rotates refreshToken

4. Logout:
   -> DELETE /api/auth/logout
   -> invalidates refreshToken in DB
   -> clears cookie
```

### Google OAuth Flow
```
1. User clicks "Continue with Google"
2. Frontend redirects to GET /api/auth/google
3. Passport redirects to Google consent screen
4. Google calls back: GET /api/auth/google/callback
5. Passport upserts user in DB (create or find by google_id)
6. Server issues JWT tokens
7. Redirects to frontend with accessToken in URL fragment
8. Frontend stores token, redirects to /dashboard
```

---

## 6. AI Integration — Google Gemini API

| Aspect | Implementation |
|---|---|
| **Provider** | Google AI Studio / Vertex AI |
| **SDK** | `@google/generative-ai` npm package |
| **Model** | `gemini-1.5-flash` (fast, cost-effective for MVP) |
| **Quiz Generation** | Prompt + structured JSON response |
| **Flashcard Generation** | Prompt + structured JSON response |
| **Text Extraction** | `pdf-parse` extracts text -> sent to Gemini |
| **Token Limit** | Max ~6000 chars of PDF text per Gemini request |
| **Rate Limiting** | Per-user: max 10 AI requests/hour (tracked in DB) |
| **Error Handling** | Retry once on 429/503; user-friendly error on failure |

### Quiz Generation Prompt
```
You are an educational AI. Given the following study material, generate {count} 
{difficulty} multiple-choice questions.

Rules:
- Each question must have exactly 4 options
- Only one option is correct
- Include a brief explanation for the correct answer

Return ONLY a valid JSON array with this structure:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "..."
  }
]

Study Material:
{extractedText}
```

### Flashcard Generation Prompt
```
You are an educational AI. Given the following study material, generate {count} 
flashcards for effective revision.

Return ONLY a valid JSON array with this structure:
[
  {
    "front": "concept or term",
    "back": "clear explanation or definition"
  }
]

Study Material:
{extractedText}
```

---

## 7. File Upload and Storage

| Aspect | Implementation |
|---|---|
| **Upload Middleware** | Multer (memory storage - buffer kept in RAM) |
| **Allowed Types** | application/pdf, text/plain |
| **Max File Size** | 10MB (enforced by Multer limits) |
| **Primary Storage** | Cloudinary (upload PDF as raw resource) |
| **Backup Option** | Firebase Storage (if Cloudinary limits are hit) |
| **Text Extraction** | pdf-parse runs on Multer buffer BEFORE upload to Cloudinary |
| **File Access** | Cloudinary signed URLs for secure access |
| **Naming** | `peer-club/{roomId}/{uuid}` as Cloudinary public_id |
| **Room Limit** | Max 5 active documents per room (enforced in controller) |

### Upload Flow
```
Client -> POST /api/rooms/:roomId/documents (multipart/form-data)
  -> Multer parses file into req.file buffer
  -> Validate MIME type and size
  -> Check room document count (max 5)
  -> pdf-parse(req.file.buffer) -> extract text
  -> cloudinary.uploader.upload(buffer) -> get secure_url + public_id
  -> Save Document record to DB (with extracted_text, cloudinary_url, cloudinary_id)
  -> Return document metadata to client
```

---

## 8. Real-Time Architecture (Socket.io)

Socket.io is integrated directly into the Express server (shared HTTP server instance).

### Socket.io Setup
```javascript
// server.ts
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: FRONTEND_URL } });
httpServer.listen(PORT);
```

### Authentication on Socket
- Client sends JWT in `auth` handshake: `socket.handshake.auth.token`
- Server middleware verifies token before allowing connection

### Room Namespacing
- Each study room uses a Socket.io room: `io.to(roomId).emit(...)`
- Client joins on room page load: `socket.emit('room:join', { roomId })`

### Timer State Management
- Timer state stored in memory: `Map<roomId, TimerState>`
- `TimerState`: `{ phase, remainingSeconds, isRunning, sessionCount, config, adminId }`
- Server runs `setInterval` per active room, emits `timer:tick` every second
- On completion: auto-log session to DB, emit `timer:complete`, advance phase

### Socket.io Events
```
Client -> Server:
  room:join         { roomId }
  room:leave        { roomId }
  timer:start       { roomId }
  timer:pause       { roomId }
  timer:reset       { roomId }
  timer:configure   { roomId, config: { workMins, shortBreak, longBreak } }

Server -> Client:
  timer:tick        { remainingSeconds, phase, sessionCount }
  timer:complete    { phase, nextPhase }
  timer:state       { ...TimerState }  (on room join)
  presence:update   { members: [{ userId, isOnline }] }
  room:member-joined  { userId, name, avatar }
  room:member-left    { userId }
  room:member-kicked  { userId }
```

---

## 9. Automation — n8n

n8n handles scheduled and event-driven workflows that run outside the main API.

| Workflow | Trigger | Actions |
|---|---|---|
| **Weekly Summary Email** | CRON: every Monday 8AM | Query DB for user stats -> send summary email via nodemailer |
| **Streak Alert** | CRON: every day 8PM | Find users with streak > 0 who have not studied today -> send alert email |
| **Badge Check** | Webhook from Express server | Re-check badge thresholds -> award new badges -> create notifications |
| **Welcome Email** | Webhook: new user registered | Wait 2 min -> send welcome email |

### n8n Integration Points
- Express server calls n8n webhook URL after key events (user register, session complete)
- n8n calls back to Express internal API endpoint for DB writes
- n8n runs self-hosted or on n8n.cloud

---

## 10. Email

| Aspect | Implementation |
|---|---|
| **Library** | nodemailer |
| **SMTP Provider** | Gmail SMTP (MVP) / Resend (production) |
| **Templates** | HTML strings / React Email (rendered server-side) |
| **Emails** | Verification, password reset, weekly summary, streak alert, welcome |

---

## 11. Deployment and Hosting

| Service | Provider | Purpose |
|---|---|---|
| **Frontend (React SPA)** | Vercel | Static site hosting + CDN |
| **Backend (Express + Socket.io)** | Render | Always-on Node.js web service |
| **Database** | Supabase | Managed PostgreSQL |
| **File Storage** | Cloudinary | Document and media storage |
| **Automation** | n8n.cloud / Self-hosted | Workflow automation |

### Render Configuration
- Service type: Web Service
- Build command: `npm run build`
- Start command: `node dist/server.js`
- Environment: Node.js 20
- Plan: Free (with spin-down) or Starter (always-on) for MVP

### Vercel Configuration
- Framework: Create React App / Vite
- Build command: `npm run build`
- Output directory: `dist` or `build`
- All routes -> `index.html` (SPA fallback)

### Required Environment Variables

**Backend (Render):**
```
NODE_ENV=production
PORT=4000
CLIENT_URL=https://your-app.vercel.app

# Database
DATABASE_URL=
DIRECT_URL=

# JWT
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

# Google Gemini
GEMINI_API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# n8n
N8N_WEBHOOK_BASE_URL=
N8N_WEBHOOK_SECRET=
```

**Frontend (Vercel):**
```
VITE_API_URL=https://your-api.onrender.com
VITE_SOCKET_URL=https://your-api.onrender.com
VITE_GOOGLE_CLIENT_ID=
```

---

## 12. Security Requirements

| Area | Requirement |
|---|---|
| **JWT Storage** | Access token in memory (never localStorage); refresh token in HTTP-only cookie |
| **Authorization** | JWT middleware on all protected Express routes |
| **Input Validation** | Zod schemas + express-validator on all API inputs |
| **File Uploads** | MIME type check + Multer file size limit before processing |
| **Rate Limiting** | `express-rate-limit`: 100 req/15 min general; 10 req/hour for AI routes |
| **SQL Injection** | Prevented by Prisma parameterized queries |
| **XSS** | Helmet.js CSP headers; React auto-escaping |
| **CORS** | Strict origin whitelist (Vercel frontend URL only) |
| **HTTPS** | Enforced by Vercel and Render (automatic TLS) |
| **Secrets** | All secrets in environment variables, never committed |
| **Password** | bcryptjs with 12 salt rounds |

---

## 13. Performance Requirements

| Metric | Target |
|---|---|
| **Page Load (LCP)** | < 2.5 seconds |
| **API Response Time** | < 300ms (p95) for standard endpoints |
| **AI Response Time** | < 15 seconds (quiz/flashcard generation) |
| **Timer Sync Latency** | < 100ms |
| **Concurrent Users** | 500 (MVP on Render Starter) |
| **DB Queries** | All list endpoints paginated (max 50 records) |

---

## 14. API Structure

Base URL: `https://your-api.onrender.com/api`

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
GET    /auth/verify-email?token=
POST   /auth/resend-verification
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /auth/google
GET    /auth/google/callback

GET    /users/me
PATCH  /users/me
DELETE /users/me

GET    /rooms
POST   /rooms
GET    /rooms/:roomId
PATCH  /rooms/:roomId
DELETE /rooms/:roomId
POST   /rooms/join
DELETE /rooms/:roomId/leave
DELETE /rooms/:roomId/members/:userId
PATCH  /rooms/:roomId/members/:userId

GET    /rooms/:roomId/documents
POST   /rooms/:roomId/documents      (multipart/form-data)
GET    /rooms/:roomId/documents/:docId/url
DELETE /rooms/:roomId/documents/:docId

POST   /rooms/:roomId/quizzes/generate
GET    /rooms/:roomId/quizzes
GET    /rooms/:roomId/quizzes/:quizId
POST   /rooms/:roomId/quizzes/:quizId/attempts

POST   /rooms/:roomId/flashcards/generate
GET    /rooms/:roomId/flashcards
GET    /rooms/:roomId/flashcards/:setId
PATCH  /flashcards/:cardId/progress

GET    /rooms/:roomId/notes
PUT    /rooms/:roomId/notes
GET    /rooms/:roomId/notes/personal
PUT    /rooms/:roomId/notes/personal

GET    /sessions
POST   /sessions

GET    /dashboard
GET    /leaderboard?scope=global|room&roomId=&period=week|month

GET    /notifications
PATCH  /notifications/read
PATCH  /notifications/:id/read
```

---

## 15. Testing Strategy

| Type | Tool | Scope |
|---|---|---|
| **Unit Tests** | Jest + Supertest | Service functions, validators, utils |
| **Integration Tests** | Jest + Supertest + test DB | API route handler logic |
| **E2E Tests** | Playwright | Critical user flows (auth, rooms, quiz) |
| **Manual QA** | Browser + Postman | Timer sync, file upload, AI generation |

