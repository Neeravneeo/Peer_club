import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from './hooks/useAuth'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { PrivateRoute } from './components/auth/PrivateRoute'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { UploadPage } from './pages/upload/UploadPage'
import { QuizListPage } from './pages/quiz/QuizListPage'
import { TakeQuizPage } from './pages/quiz/TakeQuizPage'
import { QuizResultsPage } from './pages/quiz/QuizResultsPage'
import { FlashcardListPage } from './pages/flashcards/FlashcardListPage'
import { FlashcardStudyPage } from './pages/flashcards/FlashcardStudyPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { NotificationsPage } from './pages/notifications/NotificationsPage'
import { RoomsPage } from './pages/rooms/RoomsPage'
import { RoomDetailPage } from './pages/rooms/RoomDetailPage'
import { LeaderboardPage } from './pages/leaderboard/LeaderboardPage'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Badge } from './components/ui/badge'
import {
  Brain,
  Layers,
  Sparkles,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Zap,
  BookOpen,
} from 'lucide-react'

export function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pure-white text-carbon-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-voltage-lime border-t-true-black rounded-full animate-spin" />
          <p className="text-sm text-ash font-medium">Loading Peer Club...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-pure-white text-carbon-ink">
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Application Routes wrapped in AppLayout */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/quizzes" element={<QuizListPage />} />
              <Route path="/quiz/:quizId" element={<TakeQuizPage />} />
              <Route path="/quiz/:quizId/results" element={<QuizResultsPage />} />
              <Route path="/flashcards" element={<FlashcardListPage />} />
              <Route path="/flashcards/:setId" element={<FlashcardStudyPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col justify-between bg-pure-white text-carbon-ink">
      {/* Top Header */}
      <header className="max-w-[1200px] mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-voltage-lime text-true-black font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-carbon-ink">
            Peer Club
          </span>
        </div>

        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button asChild size="sm">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section with Aurora Radial Glow */}
      <section className="relative overflow-hidden pt-12 pb-24 px-6">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-80" />

        <div className="max-w-[1200px] mx-auto relative z-10 text-center flex flex-col items-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold rounded-full bg-voltage-lime text-true-black">
            <Zap className="w-3.5 h-3.5 fill-true-black" /> Active Recall & AI Learning Engine
          </div>

          {/* Architectural Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.03em] leading-[0.9] max-w-4xl text-carbon-ink mb-6">
            Study Together. <br />
            <span className="bg-voltage-lime px-3 rounded-[8px] text-true-black inline-block my-1">
              Learn Faster.
            </span>
          </h1>

          <p className="max-w-xl text-base md:text-lg text-ash mb-10 leading-relaxed font-normal">
            Upload revision notes or lecture PDFs to generate instant AI quizzes and 3D flashcards, track your study streak, and level up with peers.
          </p>

          {/* CTA & Suggestion Chips */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
            {isAuthenticated ? (
              <Button asChild size="lg" className="px-8 text-base">
                <Link to="/dashboard" className="gap-2">
                  Launch Workspace <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="px-8 text-base">
                  <Link to="/register" className="gap-2">
                    Create Free Account <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 text-base">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
            {['⚡ 3D Flip Flashcards', '🧠 Gemini AI Quizzes', '🔥 Streak Accountability', '📄 PDF & TXT Parsing'].map(
              (chip, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1.5 rounded-full border border-border bg-pure-white text-xs font-semibold text-carbon-ink"
                >
                  {chip}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-[1200px] mx-auto w-full px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border bg-pure-white rounded-[24px]">
            <CardContent className="p-8 space-y-4">
              <div className="p-3 rounded-[12px] bg-voltage-lime text-true-black w-fit font-bold">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-carbon-ink tracking-tight">Instant Document Ingestion</h3>
              <p className="text-sm text-ash leading-relaxed">
                Drop your lecture notes, slides, or chapters. Gemini parses the raw text and prepares conceptual outlines.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-pure-white rounded-[24px]">
            <CardContent className="p-8 space-y-4">
              <div className="p-3 rounded-[12px] bg-surface-elevated text-carbon-ink border border-border w-fit font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-carbon-ink tracking-tight">3D Active Recall Cards</h3>
              <p className="text-sm text-ash leading-relaxed">
                Flip cards with smooth 3D animations, mark confidence with swipe gestures, and drill down on difficult concepts.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-pure-white rounded-[24px]">
            <CardContent className="p-8 space-y-4">
              <div className="p-3 rounded-[12px] bg-surface-elevated text-carbon-ink border border-border w-fit font-bold">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-carbon-ink tracking-tight">Adaptive AI Quizzes</h3>
              <p className="text-sm text-ash leading-relaxed">
                Practice exams tailored to your notes with difficulty sliders and detailed reasoning breakdowns.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer (Mid Abyss #052326 Dark Surface) */}
      <footer className="w-full bg-mid-abyss text-pure-white mt-16 rounded-t-[32px] px-6 py-12">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-voltage-lime text-true-black font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-pure-white">
              Peer Club
            </span>
          </div>

          <p className="text-xs text-pure-white/60">
            © {new Date().getFullYear()} Peer Club. Built with Google Gemini AI & Handshake Design System.
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-pure-white/80">
            <Link to="/upload" className="hover:text-voltage-lime transition-colors">
              Documents
            </Link>
            <Link to="/quizzes" className="hover:text-voltage-lime transition-colors">
              Quizzes
            </Link>
            <Link to="/flashcards" className="hover:text-voltage-lime transition-colors">
              Flashcards
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
