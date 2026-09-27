import React, { useState, useEffect } from 'react';
import { X, Check, Search, Folder, BookOpen } from 'lucide-react';
import { api } from '@/lib/api';

export function MoveDocumentModal({ isOpen, onClose, onMove, documentToMove }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get('/rooms')
        .then(res => {
          setRooms(res.data?.rooms || []);
        })
        .catch(err => console.error('Failed to load rooms for move:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredRooms = rooms.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    (r.subjectTag && r.subjectTag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-serif text-[var(--color-ink)]">Move to Study Room</h3>
              <p className="text-sm text-[var(--color-stone)] mt-1 truncate max-w-[280px]">
                {documentToMove?.title || 'Select a document'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[var(--color-stone)] hover:bg-[var(--color-linen)] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-stone)]" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-linen)]/50 border border-[var(--color-ash)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-azure)]/30 focus:border-[var(--color-azure)] transition-all"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {loading ? (
              <div className="text-center py-8 text-[var(--color-stone)] text-sm">Loading rooms...</div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-stone)] text-sm flex flex-col items-center gap-2">
                <BookOpen className="w-8 h-8 opacity-20" />
                <span>No study rooms found</span>
              </div>
            ) : (
              filteredRooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    selectedRoom === room.id
                      ? 'bg-[var(--color-azure)]/5 border-[var(--color-azure)] shadow-sm'
                      : 'bg-white border-[var(--color-ash)] hover:bg-[var(--color-linen)]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-periwinkle)]/20 flex items-center justify-center">
                      <Folder className="w-5 h-5 text-[var(--color-periwinkle)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--color-ink)]">{room.name}</div>
                      <div className="text-xs text-[var(--color-stone)] mt-0.5">{room.subjectTag || 'General'}</div>
                    </div>
                  </div>
                  {selectedRoom === room.id && (
                    <Check className="w-5 h-5 text-[var(--color-azure)]" />
                  )}
                </button>
              ))
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[var(--color-ash)]/50">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-[var(--color-graphite)] hover:bg-[var(--color-linen)] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onMove(selectedRoom)}
              disabled={!selectedRoom}
              className="px-5 py-2 text-sm font-medium bg-[var(--color-ink)] text-white rounded-xl hover:bg-[var(--color-ink)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Move Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
