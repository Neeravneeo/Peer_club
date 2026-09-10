# Product Requirements Document (PRD)
# Peer Club

## 1. App Overview

| Field | Details |
|---|---|
| App Name | Peer Club |
| One-Line Idea | A real-time collaborative study platform where students study together, stay accountable, and learn faster using AI-generated quizzes and gamified progress tracking. |
| Version | 1.0 MVP |
| Target Release | Q3 2026 |

## 2. Target Users

### Primary - College Students (18-25)
- Preparing for semester exams across technical and non-technical subjects
- Pain Points: procrastination, lack of motivation, isolation while studying

### Secondary - Competitive Exam Aspirants
- GATE, CAT, UPSC, IELTS, GRE preparation
- Pain Points: long preparation cycles, inconsistency, no peer interaction

### Tertiary - Study Groups and Academic Communities
- University clubs, online cohorts, coaching groups
- Pain Points: poor coordination, no centralized tool

## 3. Problem Statement

Students struggle with three core issues:
1. Consistency - No accountability mechanism keeps them studying daily
2. Motivation - Studying alone is demotivating and easy to abandon
3. Efficiency - Creating revision material from lectures and notes is time-consuming

## 4. User Roles

| Role | Description |
|---|---|
| Student (Default) | Creates/joins rooms, uploads docs, takes quizzes, views progress |
| Room Admin | Creates and manages a study room, controls members and permissions |
| Guest | Can preview a public room but cannot participate (future feature) |

## 5. Core Features (MVP)

### 5.1 User Authentication
- Email/password registration and login
- Google OAuth login
- Email verification
- Password reset via email
- Profile setup (name, avatar, subjects of interest)

### 5.2 Study Rooms
- Create a room with name, subject tag, and privacy setting (public/private)
- Join room via unique 6-character room code
- Room member list showing online/offline status
- Room admin controls: kick member, promote to co-admin, close room
- Maximum 20 members per room (MVP)

### 5.3 Pomodoro Study Timer
- Configurable work/break intervals (default: 25 min work / 5 min break)
- Synced timer visible to all room members
- Automatic session logging on completion
- Sound notification on session end
- Session history per user

### 5.4 Document Upload
- Upload PDF and text files (max 10MB per file)
- Store up to 5 documents per room (MVP limit)
- File preview in browser
- Delete uploaded documents (admin or uploader)

### 5.5 AI Quiz Generator
- Generate 5-20 MCQ or short-answer questions from uploaded document
- Select difficulty: Easy / Medium / Hard
- Take quiz inline with automatic scoring
- View correct answers after submission
- Quiz results saved to user progress

### 5.6 Flashcard Generator
- Auto-generate 10-30 flashcards from uploaded content
- Flip-card review interface
- Mark cards as Known or Revisit
- Save flashcard sets to personal library

### 5.7 Shared Notes
- Room-level shared notes editor (rich text, last-write-wins)
- Personal notes per user (private)
- Notes organized by room

### 5.8 Leaderboards
- Weekly and monthly leaderboard per study room
- Rankings based on: study hours logged, quizzes completed, streak days
- Global leaderboard across all public rooms

### 5.9 Progress Dashboard
- Total study hours (daily, weekly, monthly)
- Session count and average session duration
- Quiz performance over time (score trends)
- Current streak and longest streak
- Badges earned

### 5.10 Notifications
- In-app notifications: room invites, session start reminders, achievements
- Email notifications: weekly summary, streak alerts (opt-in)

## 6. User Stories

| # | As a... | I want to... | So that... |
|---|---|---|---|
| 1 | Student | Create a study room | I can invite friends and study together |
| 2 | Student | Join a room via code | I can participate immediately |
| 3 | Student | Upload a PDF | AI can generate quizzes from it |
| 4 | Student | Take an AI quiz | I can revise material faster |
| 5 | Student | Start a Pomodoro timer | I can study in focused intervals |
| 6 | Student | See a leaderboard | I stay motivated by friendly competition |
| 7 | Student | View my dashboard | I can track my study progress |
| 8 | Student | Create flashcards from notes | I can review key concepts quickly |
| 9 | Room Admin | Manage room members | I can keep the room productive |
| 10 | Student | Get a streak notification | I do not break my study habit |

## 7. MVP Scope

In MVP:
- Authentication (email + Google)
- Study rooms (create, join, member list)
- Pomodoro timer (synced)
- PDF upload + AI quiz generation
- Flashcard generation
- Shared notes (basic)
- Progress dashboard
- Leaderboard (room + global)
- In-app notifications

NOT in MVP (Future):
- Real-time collaborative editing
- Video/audio rooms
- Whiteboard, Coding rooms
- AI study assistant (chat interface)
- Institution dashboards, Marketplace
- Mobile native apps
- Payment/premium tier

## 8. Success Metrics

| Metric | Target (30 days post-launch) |
|---|---|
| Daily Active Users (DAU) | 500+ |
| Weekly Active Users (WAU) | 2,000+ |
| Average Session Duration | 45+ minutes |
| Study Rooms Created | 200+ |
| Quiz Completion Rate | 60%+ |
| Day-7 Retention Rate | 30%+ |
| User Satisfaction Score (CSAT) | 4.0+ / 5.0 |
| Streak of 3+ days | 25%+ of active users |

## 9. Assumptions

- Users have a stable internet connection
- PDFs are text-based (not scanned images) for AI parsing in MVP
- AI usage is powered by OpenAI API
- No payment processing required in MVP
- English-only interface in MVP
