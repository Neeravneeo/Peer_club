import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FileDropzone } from '@/components/upload/FileDropzone'
import { GenerateQuizModal } from '@/pages/quiz/GenerateQuizModal'
import { GenerateFlashcardModal } from '@/components/flashcards/GenerateFlashcardModal'
import { toast } from 'sonner'
import {
  Users,
  BookOpen,
  Trophy,
  Copy,
  Check,
  Shield,
  ArrowLeft,
  Brain,
  Layers,
  Download,
  Trash2,
  UploadCloud,
  Flame,
  Clock,
  Award,
  Sparkles,
  LogOut,
  FileText,
} from 'lucide-react'

export function RoomDetailPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState('documents') // 'documents' | 'leaderboard' | 'members'
  const [copiedCode, setCopiedCode] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Quiz / Flashcard generation modals state
  const [selectedDocForQuiz, setSelectedDocForQuiz] = useState(null)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [selectedDocForFlashcards, setSelectedDocForFlashcards] = useState(null)
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false)

  // Fetch room details
  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const res = await api.get(`/rooms/${roomId}`)
      return res.data.room
    },
    enabled: !!roomId,
  })

  // Leave room mutation
  const leaveMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/rooms/${roomId}/leave`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Left study room')
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      navigate('/rooms')
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to leave room')
    },
  })

  // Upload document scoped to this room mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('roomId', roomId)
      const res = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Document uploaded to room!')
      queryClient.invalidateQueries({ queryKey: ['room', roomId] })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setIsUploadOpen(false)
      setIsUploading(false)
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Upload failed')
      setIsUploading(false)
    },
  })

  // Delete document mutation
  const deleteDocMutation = useMutation({
    mutationFn: async (docId) => {
      const res = await api.delete(`/documents/${docId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Document deleted')
      queryClient.invalidateQueries({ queryKey: ['room', roomId] })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to delete document')
    },
  })

  const copyRoomCode = () => {
    if (!room?.roomCode) return
    navigator.clipboard.writeText(room.roomCode)
    setCopiedCode(true)
    toast.success('Room code copied to clipboard!')
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleFileDrop = (file) => {
    setIsUploading(true)
    uploadMutation.mutate(file)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1200px] mx-auto animate-pulse">
        <div className="h-8 w-32 bg-surface-elevated rounded" />
        <div className="h-44 bg-surface-elevated rounded-[24px]" />
        <div className="h-64 bg-surface-elevated rounded-[24px]" />
      </div>
    )
  }

  if (isError || !room) {
    return (
      <Card className="p-12 text-center max-w-[600px] mx-auto mt-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-carbon-ink">Study Room Not Found</h2>
          <p className="text-sm text-ash">
            The room you are looking for does not exist or you do not have permission to view it.
          </p>
          <Button asChild className="bg-voltage-lime text-true-black hover:bg-voltage-lime/90 font-semibold">
            <Link to="/rooms">Back to Study Rooms</Link>
          </Button>
        </div>
      </Card>
    )
  }

  const isAdmin = room.adminId === user?.id
  const documents = room.documents || []
  const leaderboard = room.leaderboard || []
  const members = room.members || []

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-12">
      {/* Back button */}
      <Link
        to="/rooms"
        className="inline-flex items-center gap-2 text-sm font-medium text-ash hover:text-carbon-ink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all study rooms
      </Link>

      {/* Room Hero Header */}
      <div className="bg-surface-elevated border border-border rounded-[24px] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-voltage-lime text-true-black font-semibold text-xs">
                {room.subjectTag}
              </Badge>
              {room.isPrivate && (
                <Badge variant="outline" className="gap-1 text-xs text-ash">
                  <Shield className="w-3.5 h-3.5" /> Private
                </Badge>
              )}
              {isAdmin && (
                <Badge className="bg-true-black text-pure-white text-xs font-semibold">
                  Admin
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-carbon-ink tracking-tight">
              {room.name}
            </h1>
            <p className="text-xs text-ash">
              Created by <span className="font-semibold text-carbon-ink">{room.admin?.name}</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Room Code Card */}
            <div className="flex items-center gap-2 bg-pure-white px-3 py-1.5 rounded-[12px] border border-border">
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider font-bold text-ash block">Room Code</span>
                <span className="font-mono font-bold text-sm tracking-wider text-carbon-ink">{room.roomCode}</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={copyRoomCode}
                className="h-7 w-7 text-ash hover:text-carbon-ink"
                title="Copy Room Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {/* Leave Room Button (if not admin) */}
            {!isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => leaveMutation.mutate()}
                disabled={leaveMutation.isPending}
                className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Leave
              </Button>
            )}
          </div>
        </div>

        {/* Room Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-voltage-lime/20 flex items-center justify-center text-true-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-carbon-ink leading-tight">{members.length}</p>
              <p className="text-xs text-ash">Members</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-blue-500/10 flex items-center justify-center text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-carbon-ink leading-tight">{documents.length}</p>
              <p className="text-xs text-ash">Documents</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-carbon-ink leading-tight">
                {leaderboard.reduce((acc, row) => acc + (row.quizzesCompleted || 0), 0)}
              </p>
              <p className="text-xs text-ash">Quizzes Solved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all ${
            activeTab === 'documents'
              ? 'bg-voltage-lime text-true-black shadow-sm'
              : 'text-ash hover:text-carbon-ink hover:bg-surface-elevated'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Documents ({documents.length})
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-voltage-lime text-true-black shadow-sm'
              : 'text-ash hover:text-carbon-ink hover:bg-surface-elevated'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Room Leaderboard
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all ${
            activeTab === 'members'
              ? 'bg-voltage-lime text-true-black shadow-sm'
              : 'text-ash hover:text-carbon-ink hover:bg-surface-elevated'
          }`}
        >
          <Users className="w-4 h-4" />
          Members ({members.length})
        </button>
      </div>

      {/* Tab 1: Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-carbon-ink">Study Documents</h2>
              <p className="text-xs text-ash">Shared notes and textbooks for generating quizzes & flashcards</p>
            </div>

            {/* Upload to Room Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-voltage-lime text-true-black hover:bg-voltage-lime/90 font-semibold gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Upload to this Room
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Upload Material to {room.name}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <FileDropzone onFileSelect={handleFileDrop} isUploading={isUploading} />
                  <p className="text-xs text-ash text-center mt-3">
                    Upload PDF or TXT notes (Max 10MB). Text is parsed automatically for AI active recall.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {documents.length === 0 ? (
            <Card className="p-10 text-center border-dashed border-2">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-voltage-lime/20 flex items-center justify-center text-true-black">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-carbon-ink">No Documents in this Room</h3>
                <p className="text-xs text-ash max-w-sm">
                  Upload syllabus files, lecture notes, or past papers so all room members can generate quizzes and practice together!
                </p>
                <Button
                  onClick={() => setIsUploadOpen(true)}
                  className="mt-2 bg-voltage-lime text-true-black hover:bg-voltage-lime/90 font-semibold text-xs"
                >
                  Upload First Document
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="border border-border hover:border-carbon-ink transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-[10px] bg-surface-elevated text-carbon-ink">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1">
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-ash hover:text-carbon-ink rounded"
                            title="Download / View"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        {(doc.uploadedBy === user?.id || isAdmin) && (
                          <button
                            onClick={() => deleteDocMutation.mutate(doc.id)}
                            className="p-1.5 text-ash hover:text-red-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-base font-bold text-carbon-ink line-clamp-1">
                      {doc.fileName}
                    </CardTitle>
                    <p className="text-[11px] text-ash">
                      Shared by {doc.uploader?.name || 'Member'} • {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center justify-between text-xs text-ash border-t border-border pt-3">
                      <span>{doc._count?.quizzes || 0} quizzes</span>
                      <span>{doc._count?.flashcards || 0} flashcards</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDocForQuiz(doc)
                          setIsQuizModalOpen(true)
                        }}
                        className="text-xs gap-1.5 font-semibold"
                      >
                        <Brain className="w-3.5 h-3.5 text-voltage-lime fill-voltage-lime/40" />
                        Quiz
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDocForFlashcards(doc)
                          setIsFlashcardModalOpen(true)
                        }}
                        className="text-xs gap-1.5 font-semibold"
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-500" />
                        Flashcards
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Room Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-carbon-ink">Room Leaderboard</h2>
            <p className="text-xs text-ash">Rankings based on study hours, quizzes completed, and active streaks</p>
          </div>

          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-elevated text-xs font-semibold uppercase tracking-wider text-ash border-b border-border">
                  <tr>
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Member</th>
                    <th className="py-3.5 px-4">Study Hours</th>
                    <th className="py-3.5 px-4">Quizzes Solved</th>
                    <th className="py-3.5 px-4">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-ash">
                        No activity recorded yet. Start studying or solving quizzes!
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((entry, index) => {
                      const isCurrentUser = entry.userId === user?.id
                      const rank = index + 1
                      return (
                        <tr
                          key={entry.id}
                          className={`hover:bg-surface-elevated/40 transition-colors ${
                            isCurrentUser ? 'bg-voltage-lime/10 font-medium' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            {rank === 1 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-true-black font-bold text-xs">
                                🥇
                              </span>
                            ) : rank === 2 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-true-black font-bold text-xs">
                                🥈
                              </span>
                            ) : rank === 3 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600/30 text-carbon-ink font-bold text-xs">
                                🥉
                              </span>
                            ) : (
                              <span className="text-ash text-xs font-semibold pl-2">#{rank}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-voltage-lime text-true-black font-bold flex items-center justify-center text-xs">
                                {entry.user?.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <span className="font-semibold text-carbon-ink text-sm">
                                  {entry.user?.name || 'Anonymous User'}
                                </span>
                                {isCurrentUser && (
                                  <span className="ml-2 text-[10px] bg-voltage-lime px-1.5 py-0.5 rounded text-true-black font-bold">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-carbon-ink font-semibold">
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="w-3.5 h-3.5 text-ash" />
                              {Number(entry.studyHours || 0).toFixed(1)} hrs
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-carbon-ink font-semibold">
                            <div className="flex items-center gap-1 text-xs">
                              <Award className="w-3.5 h-3.5 text-ash" />
                              {entry.quizzesCompleted || 0}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              {entry.streak || 0} days
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Members */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-carbon-ink">Room Members</h2>
            <p className="text-xs text-ash">Peers studying together in this room</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id} className="p-4 border border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-voltage-lime text-true-black font-bold flex items-center justify-center text-sm">
                  {member.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-carbon-ink truncate">{member.name}</p>
                  <p className="text-[11px] text-ash">
                    {member.id === room.adminId ? (
                      <span className="text-true-black font-semibold">Room Creator</span>
                    ) : (
                      'Member'
                    )}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {selectedDocForQuiz && (
        <GenerateQuizModal
          document={selectedDocForQuiz}
          isOpen={isQuizModalOpen}
          onClose={() => {
            setIsQuizModalOpen(false)
            setSelectedDocForQuiz(null)
          }}
        />
      )}

      {/* Flashcard Modal */}
      {selectedDocForFlashcards && (
        <GenerateFlashcardModal
          document={selectedDocForFlashcards}
          isOpen={isFlashcardModalOpen}
          onClose={() => {
            setIsFlashcardModalOpen(false)
            setSelectedDocForFlashcards(null)
          }}
        />
      )}
    </div>
  )
}
