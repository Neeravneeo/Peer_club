import React, { useState, useEffect } from 'react';
import { Play, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export function StudyTimer({ roomId, isAdmin, channel, initialSession }) {
  const [session, setSession] = useState(initialSession);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  useEffect(() => {
    if (!channel) return;

    const subscription = channel.on('broadcast', { event: 'session-state' }, (payload) => {
      setSession(payload.payload);
    });

    return () => {
      // Cleanup handled by parent channel
    };
  }, [channel]);

  useEffect(() => {
    let interval;
    if (session?.isActive) {
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - session.startTime) / 1000);
        setElapsed(diff);
      }, 1000);
    } else {
      setElapsed(0);
    }

    return () => clearInterval(interval);
  }, [session]);

  const handleStart = async () => {
    if (!isAdmin) return;
    const newState = { isActive: true, startTime: Date.now() };
    setSession(newState);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'session-state',
        payload: newState
      });
    }
  };

  const handleStop = async () => {
    if (!isAdmin) return;
    const newState = { isActive: false, startTime: null };
    setSession(newState);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'session-state',
        payload: newState
      });
    }
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
      <Clock className={`w-4 h-4 ${session?.isActive ? 'text-lime-400 animate-pulse' : 'text-slate-400'}`} />
      <span className={`font-mono text-lg font-bold tracking-widest ${session?.isActive ? 'text-white' : 'text-slate-400'}`}>
        {formatTime(elapsed)}
      </span>
      {isAdmin && (
        <div className="flex items-center gap-1 ml-2 border-l border-slate-700 pl-3">
          {!session?.isActive ? (
            <Button size="icon" variant="ghost" className="h-7 w-7 text-lime-400 hover:text-lime-300 hover:bg-lime-400/20" onClick={handleStart}>
              <Play className="w-4 h-4 fill-current" />
            </Button>
          ) : (
            <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-400/20" onClick={handleStop}>
              <Square className="w-4 h-4 fill-current" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
