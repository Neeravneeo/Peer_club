-- Peer Club Database Schema (PostgreSQL / Supabase)
-- Generated to match ER Diagram

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE "FlashcardStatus" AS ENUM ('known', 'revisit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "NotificationType" AS ENUM ('reminder', 'report', 'achievement');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USERS table
CREATE TABLE IF NOT EXISTS "users" (
    "_id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. STUDYROOMS table
CREATE TABLE IF NOT EXISTS "studyrooms" (
    "_id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" VARCHAR(255) NOT NULL,
    "subjectTag" VARCHAR(100) NOT NULL,
    "roomCode" VARCHAR(50) NOT NULL UNIQUE,
    "adminId" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "fk_studyrooms_admin" FOREIGN KEY ("adminId") REFERENCES "users"("_id") ON DELETE CASCADE
);

-- 4. Implicit Join Table for StudyRooms members (members[] -> users._id)
CREATE TABLE IF NOT EXISTS "_RoomMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RoomMembers_AB_pkey" PRIMARY KEY ("A", "B"),
    CONSTRAINT "fk_roommembers_a" FOREIGN KEY ("A") REFERENCES "studyrooms"("_id") ON DELETE CASCADE,
    CONSTRAINT "fk_roommembers_b" FOREIGN KEY ("B") REFERENCES "users"("_id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "_RoomMembers_B_index" ON "_RoomMembers"("B");

-- 5. DOCUMENTS table
CREATE TABLE IF NOT EXISTS "documents" (
    "_id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "roomId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "fk_documents_room" FOREIGN KEY ("roomId") REFERENCES "studyrooms"("_id") ON DELETE CASCADE,
    CONSTRAINT "fk_documents_uploader" FOREIGN KEY ("uploadedBy") REFERENCES "users"("_id") ON DELETE CASCADE
);

-- 6. QUIZZES table
CREATE TABLE IF NOT EXISTS "quizzes" (
    "_id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "documentId" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "difficulty" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "fk_quizzes_document" FOREIGN KEY ("documentId") REFERENCES "documents"("_id") ON DELETE CASCADE
);

-- 7. FLASHCARDS table
CREATE TABLE IF NOT EXISTS "flashcards" (
    "_id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "documentId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "status" "FlashcardStatus" NOT NULL DEFAULT 'revisit',
    CONSTRAINT "fk_flashcards_document" FOREIGN KEY ("documentId") REFERENCES "documents"("_id") ON DELETE CASCADE
);

-- 8. STUDYSESSIONS table
CREATE TABLE IF NOT EXISTS "studysessions" (
    "_id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "startTime" TIMESTAMPTZ NOT NULL,
    "endTime" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "fk_studysessions_user" FOREIGN KEY ("userId") REFERENCES "users"("_id") ON DELETE CASCADE,
    CONSTRAINT "fk_studysessions_room" FOREIGN KEY ("roomId") REFERENCES "studyrooms"("_id") ON DELETE CASCADE
);

-- 9. LEADERBOARD table
CREATE TABLE IF NOT EXISTS "leaderboard" (
    "_id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studyHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quizzesCompleted" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "uq_leaderboard_room_user" UNIQUE ("roomId", "userId"),
    CONSTRAINT "fk_leaderboard_room" FOREIGN KEY ("roomId") REFERENCES "studyrooms"("_id") ON DELETE CASCADE,
    CONSTRAINT "fk_leaderboard_user" FOREIGN KEY ("userId") REFERENCES "users"("_id") ON DELETE CASCADE
);

-- 10. NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS "notifications" (
    "_id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "fk_notifications_user" FOREIGN KEY ("userId") REFERENCES "users"("_id") ON DELETE CASCADE
);

-- 11. Performance Indexes
CREATE INDEX IF NOT EXISTS "idx_studyrooms_admin" ON "studyrooms"("adminId");
CREATE INDEX IF NOT EXISTS "idx_documents_room" ON "documents"("roomId");
CREATE INDEX IF NOT EXISTS "idx_documents_uploader" ON "documents"("uploadedBy");
CREATE INDEX IF NOT EXISTS "idx_quizzes_document" ON "quizzes"("documentId");
CREATE INDEX IF NOT EXISTS "idx_flashcards_document" ON "flashcards"("documentId");
CREATE INDEX IF NOT EXISTS "idx_studysessions_user" ON "studysessions"("userId");
CREATE INDEX IF NOT EXISTS "idx_studysessions_room" ON "studysessions"("roomId");
CREATE INDEX IF NOT EXISTS "idx_leaderboard_room" ON "leaderboard"("roomId");
CREATE INDEX IF NOT EXISTS "idx_leaderboard_user" ON "leaderboard"("userId");
CREATE INDEX IF NOT EXISTS "idx_notifications_user" ON "notifications"("userId");
