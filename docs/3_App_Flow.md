# App Flow Document
# Peer Club

## 1. High-Level Navigation Structure

Public Routes:
- /                  Landing Page
- /login             Login Page
- /register          Register Page
- /verify-email      Email Verification Page
- /reset-password    Password Reset Page
- /forgot-password   Forgot Password Page

Protected Routes (requires login):
- /dashboard                              User Dashboard
- /rooms                                  My Rooms List
- /rooms/new                              Create Room Page
- /rooms/join                             Join Room via Code
- /rooms/[roomId]                         Room Home (timer + members + documents)
- /rooms/[roomId]/quiz/new               Generate Quiz Page
- /rooms/[roomId]/quiz/[quizId]          Take Quiz Page
- /rooms/[roomId]/flashcards/new         Generate Flashcards Page
- /rooms/[roomId]/flashcards/[setId]     Review Flashcards Page
- /rooms/[roomId]/notes                  Notes Editor Page
- /leaderboard                            Global Leaderboard
- /profile                               User Profile and Settings
- /notifications                          Notifications Page

## 2. Screen-by-Screen Flow

### 2.1 Landing Page (/)
Purpose: Convert visitors to signups.

Elements:
- Hero section: tagline, CTAs (Get Started Free -> /register, Sign In -> /login)
- Features section: Pomodoro, AI Quiz, Leaderboard highlights
- How It Works: 3-step graphic, Footer

Actions:
- Click Get Started Free -> /register
- Click Sign In -> /login
- If already logged in -> redirect to /dashboard

### 2.2 Register Page (/register)
Elements:
- Form: Full Name, Email, Password, Confirm Password
- Continue with Google button
- Link to /login

Actions:
- Submit: validate (Zod) -> create account -> send verification email -> redirect to /verify-email
- Google: OAuth flow -> on success: redirect to /dashboard

Validations:
- Name: 2-50 characters
- Email: valid format, not already registered
- Password: min 8 chars, 1 uppercase, 1 number
- Confirm Password: must match

Error States:
- Email already in use: An account with this email already exists.
- Weak password: field-level error
- Server error: toast: Something went wrong. Please try again.

### 2.3 Verify Email Page (/verify-email)
Elements:
- Message: We sent a verification link to {email}
- Resend Email button (cooldown 60s)
- Link to /login

Actions:
- User clicks email link -> GET /api/auth/verify-email?token=...
  - Valid token -> mark email verified -> redirect to /dashboard with success toast
  - Invalid/expired -> error: This link is invalid or has expired. + Resend button
- Click Resend Email -> send new token -> show success message

### 2.4 Login Page (/login)
Elements:
- Form: Email, Password
- Forgot Password? link -> /forgot-password
- Continue with Google button, Link to /register

Actions:
- Submit valid -> /dashboard | Invalid -> Incorrect email or password.
- Email not verified -> Please verify your email first. + resend option
- Click Google -> OAuth flow

### 2.5 Forgot Password Page (/forgot-password)
Elements: Email input, Submit button

Actions:
- Submit -> send reset email (if email exists)
- Always show: If an account exists with this email, you will receive a reset link.

### 2.6 Reset Password Page (/reset-password?token=...)
Elements: New Password, Confirm New Password form

Actions:
- Submit valid -> update password -> redirect to /login with success toast
- Expired token -> This link has expired. + link to /forgot-password

### 2.7 Dashboard (/dashboard)
Purpose: Central hub showing user stats and quick access.

Sections:
- Top Nav: Logo, search, notifications bell, avatar dropdown
- Left Sidebar: Dashboard, My Rooms, Leaderboard, Profile
- Stats Cards Row: Today Study Hours | Current Streak (N days) | Quizzes This Week | Badges Earned
- Study Activity Chart: Bar chart, last 7 days study hours
- My Rooms Widget: Last 3 active rooms with quick-join
- Recent Quiz Scores: Last 3 attempts with scores

Actions:
- Click room card -> /rooms/[roomId]
- Click Create Room -> /rooms/new
- Click Join Room -> /rooms/join
- Click notification bell -> notification dropdown
- Click avatar -> dropdown: Profile, Settings, Logout

Empty States:
- No rooms: You have not joined any rooms yet. Create one or join with a code.
- No quiz history: Take your first quiz to see your scores here.
- No streak: Start studying today to build your streak!

### 2.8 My Rooms Page (/rooms)
Elements:
- Create Room button -> /rooms/new
- Join Room button -> /rooms/join
- Grid: room cards with name, subject tag, member count, online count, admin badge

Empty State: No rooms yet. Create your first room or join one with a room code.

### 2.9 Create Room Page (/rooms/new)
Form: Room Name (3-50 chars, required), Subject Tag (dropdown), Description (optional), Privacy toggle

Actions:
- Submit -> create room -> generate 6-char code -> redirect to /rooms/[roomId]
- Cancel -> back to /rooms

### 2.10 Join Room Page (/rooms/join)
Elements: 6-character code input (auto-uppercase), Join Room button

Error States:
- Invalid code: Room not found. Check the code and try again.
- Room full: This room is full.
- Already a member: redirect directly to /rooms/[roomId]

### 2.11 Room Home Page (/rooms/[roomId])
Layout:
- Header: Back | Room Name | Code: ABC123 | Leave Room
- Left sidebar (260px): Members list with online/offline dots
- Right main: Pomodoro Timer + Tabs (Documents, Quiz, Flashcards, Notes)

Pomodoro Timer Section:
- Large MM:SS countdown
- Current phase: Work / Short Break / Long Break
- Session counter: Session 2 of 4
- Settings icon -> configure durations modal (admin only)
- Admin: Start, Pause, Reset buttons
- Non-admin: read-only synced display
- Complete -> browser sound + toast notification

Members Sidebar:
- Green dot = online, grey = offline
- Admin sees ... menu: Kick / Promote to Co-Admin

Documents Tab:
- List: filename, size, uploader, date
- Upload Document button
- Actions per doc: Preview (PDF modal), Generate Quiz, Generate Flashcards, Delete
- Empty: No documents uploaded yet. Upload a PDF to get started.

Quiz Tab:
- List: title, difficulty badge, question count, creator, date
- Generate New Quiz button -> modal
- Click quiz -> /rooms/[roomId]/quiz/[quizId]
- Empty: No quizzes yet. Upload a document and generate your first quiz.

Flashcards Tab:
- List: title, card count, creator, date
- Generate Flashcards button -> modal
- Click set -> /rooms/[roomId]/flashcards/[setId]
- Empty: No flashcard sets yet.

Notes Tab:
- Shared rich text editor
- Last saved: {username} at {time}
- Auto-save every 30 seconds
- My Private Notes toggle -> personal notes view

Admin-Only:
- Room Settings: edit name, subject, privacy
- Close Room -> confirmation modal -> marks room inactive

### 2.12 Generate Quiz Modal
Trigger: Generate New Quiz button

Fields: Select Document, Quiz Title (auto-fill), Questions (slider 5-20), Difficulty (Easy/Medium/Hard), Type (MCQ/Short Answer/Mixed)

Flow:
- Submit -> loading: Generating your quiz with AI... (5-15s)
- Success -> navigate to /rooms/[roomId]/quiz/[quizId]
- Error -> Failed to generate quiz. Please try again. + retry

### 2.13 Take Quiz Page (/rooms/[roomId]/quiz/[quizId])
Layout: Quiz title, question X of Y, progress bar
- MCQ: 4 radio buttons | Short answer: text input
- Next Question button
- Submit Quiz button (last question)

Results Screen:
- Score: X/Y (percentage), time taken
- Per-question: your answer, correct answer, explanation
- Retake Quiz | Back to Room buttons

States:
- Already completed: show previous score with retake option
- Navigate away mid-quiz: warn: You will lose your progress.

### 2.14 Generate Flashcards Modal
Fields: Select Document, Set Title, Card count slider (10-30)

### 2.15 Flashcard Review Page (/rooms/[roomId]/flashcards/[setId])
Layout:
- Header: title, X/Y cards, progress bar
- Large flip card (click or Space to flip)
  - Front: concept/term
  - Back: explanation
- Known button (green) | Revisit button (orange)
- Previous/Next navigation
- Progress: X Known | Y Revisit | Z Remaining

End State:
- Summary: X Known, Y to Revisit
- Review Revisit Cards | Study Again | Save to My Library | Back to Room

### 2.16 Notes Page (/rooms/[roomId]/notes)
Elements:
- Toggle: Room Notes | My Notes
- Rich text editor (Tiptap)
- Toolbar: Bold, Italic, Underline, H1/H2/H3, Bullet list, Numbered list, Quote, Code
- Save button, last saved indicator

Room Notes: shared, last-write-wins, shows Last edited by {name} at {time}
My Notes: private to user, associated with room

### 2.17 Leaderboard Page (/leaderboard)
Elements:
- Toggle: My Rooms | Global
- Room selector (for My Rooms), Period toggle: This Week | This Month
- Podium for top 3 (gold/silver/bronze)
- Table: Rank, Avatar, Name, Study Hours, Quizzes, Streak
- Own row highlighted

Empty state: No data for this period yet.

### 2.18 Profile and Settings Page (/profile)
Sections:
1. Profile Info: Avatar, Full Name, Email (display only), Subjects of Interest, Save
2. Account Settings: Change Password, Connected Accounts
3. Notification Preferences: Weekly Summary Email toggle, Streak Alert Email toggle
4. Badges and Achievements: grid of earned (colored) and unearned (greyed) badges
5. Danger Zone: Delete Account button

### 2.19 Notifications
In-App Bell Dropdown:
- Types: Achievement, Streak alert, Room invite (Accept/Decline), Timer started
- Mark all as read button
- See all -> /notifications

Notifications Page (/notifications):
- Full list with date grouping: Today, Yesterday, This Week

## 3. Key User Journeys

Journey 1 - New User Onboarding:
Landing -> Register -> Verify Email -> Dashboard (empty) -> Create Room -> Upload PDF -> Generate Quiz -> Take Quiz -> View Score -> Dashboard (stats updated)

Journey 2 - Returning Study Session:
Login -> Dashboard -> Click existing room -> Timer starts (admin) -> All members see sync -> Timer ends -> Session logged -> Streak updated

Journey 3 - Join and Study:
Login -> Join Room (code) -> Review shared notes -> Open flashcard set -> Review cards -> Check leaderboard

## 4. Global UI Behaviors

| Behavior | Implementation |
|---|---|
| Auth Guard | /dashboard, /rooms, /profile redirect to /login if not authenticated |
| Toast Notifications | Success (green), Error (red), Info (blue) - top-right, auto-dismiss 4s |
| Loading States | Skeleton loaders for fetches; spinner for mutations |
| Responsive Design | Mobile (320px+), tablet (768px+), desktop (1024px+) |
| Dark Mode | Default dark theme, no light mode toggle in MVP |
| 404 Page | Custom page with link to dashboard |
| 500 Page | Custom error page with retry |
| Offline State | Banner: You are offline. Some features may not work. |
| Session Expiry | On API 401 -> redirect to /login with Session expired toast |
