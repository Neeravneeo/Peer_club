# Peer Club

> A real-time collaborative study platform where students study together, stay accountable, and learn faster using AI-generated quizzes and gamified progress tracking.

---

## 🏗️ Month 1 Architecture & Tech Stack

- **Frontend**: React 18 (JSX), Vite, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, Framer Motion, Recharts, Lucide Icons
- **Backend**: Node.js (JavaScript / ESM), Express.js, Prisma ORM
- **Database & ORM**: Supabase (PostgreSQL 15+) with Prisma ORM
- **Authentication**: Supabase Auth (JWT), Google OAuth
- **AI Integration**: Google Gemini 1.5 Flash API
- **File Upload & Storage**: Multer, pdf-parse, Cloudinary
- **Automation**: n8n (15 Automated Email & Retention Workflows)
- **Deployment**: Vercel (Client) + Render (Server)

---

## 📂 Repository Structure

```
peer-club/
├── client/          # React SPA (Vite + JSX)
├── server/          # Express API (Node.js ESM + Prisma)
├── docs/            # Product & Technical Specifications
│   ├── 1_PRD.md
│   ├── 2_TRD.md
│   ├── 3_App_Flow.md
│   ├── 4_UI_UX_Brief.md
│   ├── 5_Backend_Schema.md
│   └── 6_Implementation_Plan.md
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ LTS
- npm or pnpm
- Supabase account (PostgreSQL DB)
- Google AI Studio API key (Gemini)
- Cloudinary account

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```
Client runs at: `http://localhost:3000`

### 3. Server Setup
```bash
cd server
npm install
# Configure your .env from .env.example
npx prisma generate
npx prisma migrate dev
npm run dev
```
API runs at: `http://localhost:4000`
