import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Users, Plus, Key, Copy, Check, BookOpen, Shield, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export function RoomsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isJoinOpen, setIsJoinOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState(null)

  // Form states
  const [name, setName] = useState('')
  const [subjectTag, setSubjectTag] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [joinCode, setJoinCode] = useState('')

  // Fetch rooms
  const { data, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await api.get('/rooms')
      return res.data.rooms || []
    },
  })

  // Create room mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/rooms', payload)
      return res.data
    },
    onSuccess: (res) => {
      toast.success('Study room created successfully!')
      setIsCreateOpen(false)
      setName('')
      setSubjectTag('')
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      if (res?.room?.id) {
        navigate(`/rooms/${res.room.id}`)
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to create room')
    },
  })

  // Join room mutation
  const joinMutation = useMutation({
    mutationFn: async (code) => {
      const res = await api.post('/rooms/join', { roomCode: code })
      return res.data
    },
    onSuccess: (res) => {
      toast.success(`Joined room "${res.name}" successfully!`)
      setIsJoinOpen(false)
      setJoinCode('')
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      if (res?.roomId) {
        navigate(`/rooms/${res.roomId}`)
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Invalid room code')
    },
  })

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success('Room code copied to clipboard!')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-carbon-ink flex items-center gap-2.5">
            <Users className="w-6 h-6 text-true-black" />
            Study Rooms
          </h1>
          <p className="text-sm text-ash mt-1">
            Collaborate with peers, share documents, and track room leaderboards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Join Room Dialog */}
          <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Key className="w-4 h-4" />
                Join with Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Join a Study Room</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (joinCode) joinMutation.mutate(joinCode)
                }}
                className="space-y-4 pt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="roomCode">6-Character Room Code</Label>
                  <Input
                    id="roomCode"
                    placeholder="e.g. PC8X9A"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="font-mono text-center tracking-widest uppercase text-lg"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={joinMutation.isPending || joinCode.length < 5}
                  className="w-full bg-voltage-lime text-true-black hover:bg-voltage-lime/90 font-semibold"
                >
                  {joinMutation.isPending ? 'Joining...' : 'Join Room'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Create Room Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-voltage-lime text-true-black hover:bg-voltage-lime/90 font-semibold">
                <Plus className="w-4 h-4" />
                Create Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Create New Study Room</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  createMutation.mutate({ name, subjectTag, isPrivate })
                }}
                className="space-y-4 pt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Room Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Machine Learning Study Group"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subjectTag">Subject / Topic Tag</Label>
                  <Input
                    id="subjectTag"
                    placeholder="e.g. Computer Science, Calculus"
                    value={subjectTag}
                    onChange={(e) => setSubjectTag(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 text-voltage-lime rounded"
                  />
                  <Label htmlFor="isPrivate" className="text-xs text-ash cursor-pointer">
                    Private Room (only joinable via invite code)
                  </Label>
                </div>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-voltage-lime text-true-black hover:bg-voltage-lime/90 font-semibold"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Room'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse p-6 h-48 bg-surface-elevated/50" />
          ))}
        </div>
      ) : data?.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-voltage-lime/20 flex items-center justify-center text-true-black">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-carbon-ink">No Study Rooms Yet</h3>
            <p className="text-sm text-ash max-w-sm">
              Create your first study room or join an existing one using an invite code to start collaborating!
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 bg-voltage-lime text-true-black hover:bg-voltage-lime/90 font-semibold"
            >
              Create Study Room
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((room) => (
            <Card
              key={room.id}
              onClick={() => navigate(`/rooms/${room.id}`)}
              className="border border-border/80 hover:border-carbon-ink transition-all hover:shadow-md flex flex-col justify-between cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className="bg-surface-elevated text-xs font-semibold">
                    {room.subjectTag}
                  </Badge>
                  {room.isPrivate && (
                    <Badge variant="outline" className="text-[10px] gap-1 text-ash">
                      <Shield className="w-3 h-3" /> Private
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-bold text-carbon-ink mt-2 group-hover:text-true-black transition-colors">
                  {room.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="flex items-center justify-between text-xs text-ash border-t border-border pt-3">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {room._count?.members || 1} members
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {room._count?.documents || 0} documents
                  </span>
                </div>

                <div className="flex items-center justify-between bg-surface-elevated p-2.5 rounded-[8px] border border-border/60">
                  <div className="text-xs">
                    <span className="text-ash block text-[10px] uppercase font-bold tracking-wider">
                      Room Code
                    </span>
                    <span className="font-mono font-bold text-sm tracking-wider text-carbon-ink">
                      {room.roomCode}
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(room.roomCode)
                    }}
                    className="h-8 w-8 text-ash hover:text-carbon-ink"
                    title="Copy Room Code"
                  >
                    {copiedCode === room.roomCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <Button
                  className="w-full bg-surface-elevated text-carbon-ink group-hover:bg-voltage-lime group-hover:text-true-black transition-all font-semibold text-xs gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/rooms/${room.id}`)
                  }}
                >
                  Enter Workspace
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
