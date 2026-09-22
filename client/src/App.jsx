import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from './hooks/useAuth'
import { PrivateRoute } from './components/auth/PrivateRoute'
import { AnimatedLoader } from './components/AnimatedLoader'

// Helper for resilient lazy named or default exports
const lazyNamed = (importFn, name) =>
  lazy(() => importFn().then((mod) => ({ default: mod[name] || mod.default })))

// Route-level code-splitting (reduces initial bundle by >80%)
const LandingPage = lazyNamed(() => import('./pages/landing/LandingPage'), 'LandingPage')
const LoginPage = lazyNamed(() => import('./pages/auth/LoginPage'), 'LoginPage')
const RegisterPage = lazyNamed(() => import('./pages/auth/RegisterPage'), 'RegisterPage')
const ForgotPasswordPage = lazyNamed(() => import('./pages/auth/ForgotPasswordPage'), 'ForgotPasswordPage')
const ResetPasswordPage = lazyNamed(() => import('./pages/auth/ResetPasswordPage'), 'ResetPasswordPage')
const VerifyEmailPage = lazyNamed(() => import('./pages/auth/VerifyEmailPage'), 'VerifyEmailPage')

const DashboardPage = lazyNamed(() => import('./pages/dashboard/DashboardPage'), 'DashboardPage')
const DocumentsPage = lazyNamed(() => import('./pages/Documents'), 'DocumentsPage')
const UploadPage = lazyNamed(() => import('./pages/upload/UploadPage'), 'UploadPage')
const QuizListPage = lazyNamed(() => import('./pages/quiz/QuizListPage'), 'QuizListPage')
const TakeQuizPage = lazyNamed(() => import('./pages/quiz/TakeQuizPage'), 'TakeQuizPage')
const QuizResultsPage = lazyNamed(() => import('./pages/quiz/QuizResultsPage'), 'QuizResultsPage')
const FlashcardListPage = lazyNamed(() => import('./pages/flashcards/FlashcardListPage'), 'FlashcardListPage')
const FlashcardStudyPage = lazyNamed(() => import('./pages/flashcards/FlashcardStudyPage'), 'FlashcardStudyPage')
const ProfilePage = lazyNamed(() => import('./pages/profile/ProfilePage'), 'ProfilePage')
const NotificationsPage = lazyNamed(() => import('./pages/notifications/NotificationsPage'), 'NotificationsPage')
const RoomsPage = lazyNamed(() => import('./pages/rooms/RoomsPage'), 'RoomsPage')
const LeaderboardPage = lazyNamed(() => import('./pages/leaderboard/LeaderboardPage'), 'LeaderboardPage')

function RouteLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-3">
        <AnimatedLoader size={44} variant="rotate" color="brand" glow label="Loading page..." />
        <p className="text-xs text-[var(--color-graphite,#41413f)] font-medium tracking-wide">Loading page...</p>
      </div>
    </div>
  )
}

export function App() {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-canvas,#fff3e7)] text-[var(--color-ink,#030302)]">
        <div className="flex flex-col items-center gap-4">
          <AnimatedLoader size={48} variant="rotate" color="brand" glow label="Loading Peer Club..." />
          <p className="text-xs text-[var(--color-graphite,#41413f)] font-medium tracking-wide">Loading Peer Club...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors theme="dark" />
      <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[var(--color-canvas,#fff3e7)] text-[var(--color-ink,#030302)] selection:bg-[#5e6ad2]/20 selection:text-ink antialiased">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Protected Application Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/docs" element={<DocumentsPage />} />
              <Route path="/documents/new" element={<DocumentsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/flashcards" element={<FlashcardListPage />} />
              <Route path="/flashcards/:setId" element={<FlashcardStudyPage />} />
              <Route path="/flashcards/:id/study" element={<FlashcardStudyPage />} />
              <Route path="/quizzes" element={<QuizListPage />} />
              <Route path="/quiz/:quizId" element={<TakeQuizPage />} />
              <Route path="/quiz/:quizId/results" element={<QuizResultsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:roomId" element={<RoomsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/upload" element={<UploadPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

