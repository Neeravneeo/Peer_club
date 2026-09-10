# Backend Schema Document
# Peer Club

## 1. Overview

- Database: PostgreSQL 15+
- Hosting: Supabase (managed PostgreSQL)
- ORM: Prisma 5.x
- Naming: snake_case for all tables and columns
- Timestamps: All tables include created_at and updated_at
- Soft deletes: users, rooms, documents use deleted_at (nullable)
- Primary keys: UUID v4 via gen_random_uuid()

## 2. Tables

### 3.1 users
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK, default gen_random_uuid() | Unique user identifier |
| name | VARCHAR(100) | NOT NULL | Display name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Login email |
| email_verified | BOOLEAN | NOT NULL, default false | Email verification status |
| password_hash | VARCHAR(255) | NULLABLE | Null for OAuth-only accounts |
| avatar_url | VARCHAR(500) | NULLABLE | Profile picture URL |
| google_id | VARCHAR(100) | NULLABLE, UNIQUE | Google OAuth ID |
| subjects | TEXT[] | NOT NULL, default {} | Array of subject interests |
| total_study_minutes | INTEGER | NOT NULL, default 0 | Cumulative study time in minutes |
| current_streak_days | INTEGER | NOT NULL, default 0 | Current active streak |
| longest_streak_days | INTEGER | NOT NULL, default 0 | Longest ever streak |
| last_study_date | DATE | NULLABLE | Last date user studied (for streak calc) |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete |
| created_at | TIMESTAMPTZ | NOT NULL, default now() | Account creation |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() | Last update |

Indexes:
- UNIQUE on email
- UNIQUE on google_id (partial, where not null)
- INDEX on last_study_date

### 3.2 refresh_tokens
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Token ID |
| user_id | UUID | FK -> users.id, ON DELETE CASCADE | Owner |
| token_hash | VARCHAR(255) | NOT NULL, UNIQUE | Hashed refresh token |
| expires_at | TIMESTAMPTZ | NOT NULL | Expiry (30 days) |
| revoked_at | TIMESTAMPTZ | NULLABLE | When revoked (logout) |
| created_at | TIMESTAMPTZ | NOT NULL, default now() | Creation time |

Indexes:
- UNIQUE on token_hash
- INDEX on user_id

### 3.3 verification_tokens
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Token identifier |
| user_id | UUID | FK -> users.id, ON DELETE CASCADE | Associated user |
| token | VARCHAR(255) | NOT NULL, UNIQUE | Hashed token string |
| type | VARCHAR(50) | NOT NULL | email_verification or password_reset |
| expires_at | TIMESTAMPTZ | NOT NULL | Expiry (24h verify, 15min reset) |
| used_at | TIMESTAMPTZ | NULLABLE | When consumed |
| created_at | TIMESTAMPTZ | NOT NULL, default now() | Creation time |

### 3.4 user_preferences
One record per user (1:1).
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Record ID |
| user_id | UUID | FK -> users.id, UNIQUE | One per user |
| email_weekly_summary | BOOLEAN | NOT NULL, default true | Weekly summary opt-in |
| email_streak_alert | BOOLEAN | NOT NULL, default true | Streak alert opt-in |
| pomodoro_work_minutes | INTEGER | NOT NULL, default 25 | Default work duration |
| pomodoro_short_break | INTEGER | NOT NULL, default 5 | Default short break |
| pomodoro_long_break | INTEGER | NOT NULL, default 15 | Default long break |
| pomodoro_sessions_before_long | INTEGER | NOT NULL, default 4 | Sessions before long break |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() | Last update |

### 3.5 rooms
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Room identifier |
| code | CHAR(6) | NOT NULL, UNIQUE | 6-character join code (uppercase alphanumeric) |
| name | VARCHAR(100) | NOT NULL | Room display name |
| description | VARCHAR(500) | NULLABLE | Optional description |
| subject | VARCHAR(50) | NOT NULL | Subject tag |
| is_public | BOOLEAN | NOT NULL, default true | Discoverable on global leaderboard |
| is_active | BOOLEAN | NOT NULL, default true | False = closed room |
| max_members | INTEGER | NOT NULL, default 20 | Member capacity |
| created_by | UUID | FK -> users.id | Room creator |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete |
| created_at | TIMESTAMPTZ | NOT NULL, default now() | Creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() | Last update |

Indexes:
- UNIQUE on code
- INDEX on created_by
- INDEX on (is_public, is_active)

### 3.6 room_members
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Record ID |
| room_id | UUID | FK -> rooms.id, ON DELETE CASCADE | Room reference |
| user_id | UUID | FK -> users.id, ON DELETE CASCADE | User reference |
| role | VARCHAR(20) | NOT NULL, default member | member, co_admin, or admin |
| is_online | BOOLEAN | NOT NULL, default false | Real-time presence |
| last_seen_at | TIMESTAMPTZ | NULLABLE | Last Socket.io presence update |
| joined_at | TIMESTAMPTZ | NOT NULL, default now() | Join time |

Indexes:
- UNIQUE on (room_id, user_id)
- INDEX on room_id
- INDEX on user_id

### 3.7 documents
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Document ID |
| room_id | UUID | FK -> rooms.id, ON DELETE CASCADE | Associated room |
| uploaded_by | UUID | FK -> users.id | Uploader |
| name | VARCHAR(255) | NOT NULL | Original filename |
| cloudinary_url | VARCHAR(500) | NOT NULL | Cloudinary secure URL |
| cloudinary_public_id | VARCHAR(300) | NOT NULL, UNIQUE | Cloudinary public_id for deletion |
| file_size_bytes | INTEGER | NOT NULL | File size in bytes |
| mime_type | VARCHAR(100) | NOT NULL | application/pdf or text/plain |
| extracted_text | TEXT | NULLABLE | Text extracted by pdf-parse |
| text_extracted_at | TIMESTAMPTZ | NULLABLE | When text was extracted |
| deleted_at | TIMESTAMPTZ | NULLABLE | Soft delete |
| created_at | TIMESTAMPTZ | NOT NULL, default now() | Upload time |

Indexes:
- INDEX on room_id
- INDEX on uploaded_by

Constraints:
- Max 5 active documents per room (enforced in controller)
- Max 10MB per file (enforced by Multer)

### 3.8 quizzes
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Quiz ID |
| room_id | UUID | FK -> rooms.id, ON DELETE CASCADE | Associated room |
| document_id | UUID | FK -> documents.id, ON DELETE SET NULL | Source document |
| created_by | UUID | FK -> users.id | Generator |
| title | VARCHAR(200) | NOT NULL | Quiz title |
| difficulty | VARCHAR(10) | NOT NULL | easy, medium, or hard |
| question_type | VARCHAR(20) | NOT NULL | mcq, short_answer, or mixed |
| question_count | INTEGER | NOT NULL | Number of questions |
| created_at | TIMESTAMPTZ | NOT NULL, default now() | Generation time |

Indexes:
- INDEX on room_id
- INDEX on document_id

### 3.9 quiz_questions
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Question ID |
| quiz_id | UUID | FK -> quizzes.id, ON DELETE CASCADE | Parent quiz |
| order_index | INTEGER | NOT NULL | Display order (1-based) |
| question_text | TEXT | NOT NULL | The question |
| question_type | VARCHAR(20) | NOT NULL | mcq or short_answer |
| options | JSONB | NULLABLE | ["Option A","Option B","Option C","Option D"] (MCQ) |
| correct_index | INTEGER | NULLABLE | 0-based correct option index (MCQ) |
| correct_answer | TEXT | NULLABLE | Correct answer text (short answer) |
| explanation | TEXT | NULLABLE | AI explanation for correct answer |

Indexes:
- INDEX on quiz_id

### 3.10 quiz_attempts
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Attempt ID |
| quiz_id | UUID | FK -> quizzes.id, ON DELETE CASCADE | Quiz attempted |
| user_id | UUID | FK -> users.id, ON DELETE CASCADE | User |
| score | INTEGER | NOT NULL | Correct answers count |
| total_questions | INTEGER | NOT NULL | Total questions |
| percentage | DECIMAL(5,2) | NOT NULL | Score percentage |
| time_taken_seconds | INTEGER | NULLABLE | Duration |
| completed_at | TIMESTAMPTZ | NOT NULL, default now() | Completion time |

Indexes:
- INDEX on (quiz_id, user_id)
- INDEX on user_id
- INDEX on completed_at

### 3.11 quiz_attempt_answers
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Answer ID |
| attempt_id | UUID | FK -> quiz_attempts.id, ON DELETE CASCADE | Parent attempt |
| question_id | UUID | FK -> quiz_questions.id, ON DELETE CASCADE | Question |
| selected_option_index | INTEGER | NULLABLE | Chosen MCQ option (0-3) |
| answer_text | TEXT | NULLABLE | Written short answer |
| is_correct | BOOLEAN | NOT NULL | Correctness |

Indexes:
- INDEX on attempt_id

### 3.12 flashcard_sets
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Set ID |
| room_id | UUID | FK -> rooms.id, ON DELETE CASCADE | Associated room |
| document_id | UUID | FK -> documents.id, ON DELETE SET NULL | Source document |
| created_by | UUID | FK -> users.id | Creator |
| title | VARCHAR(200) | NOT NULL | Set title |
| card_count | INTEGER | NOT NULL | Number of cards |
| created_at | TIMESTAMPTZ | NOT NULL, default now() | Creation time |

### 3.13 flashcards
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Card ID |
| set_id | UUID | FK -> flashcard_sets.id, ON DELETE CASCADE | Parent set |
| order_index | INTEGER | NOT NULL | Display order |
| front | TEXT | NOT NULL | Front: concept or term |
| back | TEXT | NOT NULL | Back: explanation |

Indexes:
- INDEX on set_id

### 3.14 user_flashcard_progress
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Progress ID |
| user_id | UUID | FK -> users.id, ON DELETE CASCADE | User |
| flashcard_id | UUID | FK -> flashcards.id, ON DELETE CASCADE | Flashcard |
| status | VARCHAR(20) | NOT NULL, default unseen | unseen, known, or revisit |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() | Last update |

Indexes:
- UNIQUE on (user_id, flashcard_id)

### 3.15 study_sessions
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Session ID |
| user_id | UUID | FK -> users.id, ON DELETE CASCADE | User |
| room_id | UUID | FK -> rooms.id, ON DELETE SET NULL | Room context |
| session_type | VARCHAR(20) | NOT NULL | work, short_break, or long_break |
| planned_duration_minutes | INTEGER | NOT NULL | Configured duration |
| actual_duration_minutes | INTEGER | NOT NULL | Actual duration |
| completed | BOOLEAN | NOT NULL, default false | Full session completed |
| started_at | TIMESTAMPTZ | NOT NULL | Start time |
| ended_at | TIMESTAMPTZ | NOT NULL | End time |

Indexes:
- INDEX on user_id
- INDEX on (user_id, started_at)
- INDEX on room_id

### 3.16 room_notes
One notes document per room (last-write-wins).
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Record ID |
| room_id | UUID | FK -> rooms.id, UNIQUE | One per room |
| content | TEXT | NOT NULL, default '' | Rich text content (HTML/JSON) |
| last_edited_by | UUID | FK -> users.id | Last editor |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() | Last save |

### 3.17 personal_notes
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Record ID |
| user_id | UUID | FK -> users.id, ON DELETE CASCADE | Owner |
| room_id | UUID | FK -> rooms.id, ON DELETE CASCADE | Room context |
| content | TEXT | NOT NULL, default '' | Note content |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() | Last save |

Indexes:
- UNIQUE on (user_id, room_id)

### 3.18 badges
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Badge ID |
| slug | VARCHAR(50) | NOT NULL, UNIQUE | Machine name (e.g. first_quiz) |
| name | VARCHAR(100) | NOT NULL | Display name |
| description | VARCHAR(300) | NOT NULL | How to earn it |
| icon_url | VARCHAR(500) | NOT NULL | Badge icon URL |
| category | VARCHAR(50) | NOT NULL | streak, quiz, study_time, or social |
| threshold | INTEGER | NOT NULL | Numeric unlock threshold |

Seed Data:
| Slug | Name | Category | Threshold |
|---|---|---|---|
| first_quiz | Brain Starter | quiz | 1 |
| quiz_master | Quiz Master | quiz | 10 |
| streak_3 | On a Roll | streak | 3 |
| streak_7 | On Fire | streak | 7 |
| streak_30 | Unstoppable | streak | 30 |
| study_hour_1 | Clock In | study_time | 60 |
| study_hour_10 | Dedicated | study_time | 600 |
| study_hour_50 | Scholar | study_time | 3000 |
| first_room | Team Player | social | 1 |
| room_creator | Host | social | 1 |

### 3.19 user_badges
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Record ID |
| user_id | UUID | FK -> users.id, ON DELETE CASCADE | User |
| badge_id | UUID | FK -> badges.id, ON DELETE CASCADE | Badge |
| earned_at | TIMESTAMPTZ | NOT NULL, default now() | When earned |

Indexes:
- UNIQUE on (user_id, badge_id)

### 3.20 notifications
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Notification ID |
| user_id | UUID | FK -> users.id, ON DELETE CASCADE | Recipient |
| type | VARCHAR(50) | NOT NULL | achievement, streak_alert, room_invite, timer_start |
| title | VARCHAR(200) | NOT NULL | Headline |
| message | TEXT | NOT NULL | Body |
| action_url | VARCHAR(500) | NULLABLE | Deep link URL |
| metadata | JSONB | NULLABLE | Extra data (roomId, badgeId, etc.) |
| is_read | BOOLEAN | NOT NULL, default false | Read status |
| created_at | TIMESTAMPTZ | NOT NULL, default now() | Creation time |

Indexes:
- INDEX on (user_id, is_read)
- INDEX on (user_id, created_at DESC)

## 3. Data Ownership and Permissions

| Table | Owner | Read Access | Write Access |
|---|---|---|---|
| users | User | Self only | Self only |
| rooms | Room Admin | All members | Admin/Co-Admin |
| room_members | Room Admin | All members | Admin (kick), user (leave) |
| documents | Uploader | All room members | Uploader or Admin |
| quizzes | Creator | All room members | Creator or Admin |
| quiz_questions | System | All room members | System (Gemini AI) |
| quiz_attempts | User | Self only | Self |
| flashcard_sets | Creator | All room members | Creator or Admin |
| flashcards | System | All room members | System (Gemini AI) |
| user_flashcard_progress | User | Self only | Self |
| study_sessions | User | Self + aggregates | System (auto-logged) |
| room_notes | Room | All members | All members |
| personal_notes | User | Self only | Self |
| badges | System | All | System only |
| user_badges | System | Self + profile | System (auto-awarded) |
| notifications | System | Self only | System |

## 4. Prisma Schema (Abbreviated)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id                String    @id @default(uuid())
  name              String    @db.VarChar(100)
  email             String    @unique @db.VarChar(255)
  emailVerified     Boolean   @default(false)
  passwordHash      String?   @db.VarChar(255)
  avatarUrl         String?   @db.VarChar(500)
  googleId          String?   @unique @db.VarChar(100)
  subjects          String[]  @default([])
  totalStudyMinutes Int       @default(0)
  currentStreakDays Int       @default(0)
  longestStreakDays Int       @default(0)
  lastStudyDate     DateTime? @db.Date
  deletedAt         DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  preferences        UserPreferences?
  refreshTokens      RefreshToken[]
  verificationTokens VerificationToken[]
  roomMemberships    RoomMember[]
  studySessions      StudySession[]
  quizAttempts       QuizAttempt[]
  flashcardProgress  UserFlashcardProgress[]
  personalNotes      PersonalNote[]
  notifications      Notification[]
  userBadges         UserBadge[]
  uploadedDocuments  Document[]
  createdRooms       Room[]    @relation("RoomCreator")

  @@map("users")
}

model Room {
  id          String    @id @default(uuid())
  code        String    @unique @db.Char(6)
  name        String    @db.VarChar(100)
  description String?   @db.VarChar(500)
  subject     String    @db.VarChar(50)
  isPublic    Boolean   @default(true)
  isActive    Boolean   @default(true)
  maxMembers  Int       @default(20)
  createdBy   String
  creator     User      @relation("RoomCreator", fields: [createdBy], references: [id])
  deletedAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  members       RoomMember[]
  documents     Document[]
  quizzes       Quiz[]
  flashcardSets FlashcardSet[]
  notes         RoomNote?
  personalNotes PersonalNote[]
  studySessions StudySession[]

  @@map("rooms")
}

// All other models follow same pattern:
// RoomMember, Document, Quiz, QuizQuestion, QuizAttempt,
// QuizAttemptAnswer, FlashcardSet, Flashcard, UserFlashcardProgress,
// StudySession, RoomNote, PersonalNote, Badge, UserBadge,
// Notification, RefreshToken, VerificationToken, UserPreferences
```

## 5. Index Summary

| Table | Index | Type | Purpose |
|---|---|---|---|
| users | email | Unique | Login lookup |
| users | google_id | Unique | OAuth lookup |
| users | last_study_date | Standard | Streak calculation |
| refresh_tokens | token_hash | Unique | Token validation |
| rooms | code | Unique | Join by code |
| room_members | (room_id, user_id) | Unique | Membership check |
| study_sessions | (user_id, started_at) | Standard | Dashboard time queries |
| quiz_attempts | (quiz_id, user_id) | Standard | Attempt history |
| notifications | (user_id, created_at DESC) | Standard | Notification pagination |
| user_flashcard_progress | (user_id, flashcard_id) | Unique | Progress lookup |
| user_badges | (user_id, badge_id) | Unique | Badge deduplication |
