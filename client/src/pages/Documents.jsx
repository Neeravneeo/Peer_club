import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FilePlus,
  LayoutTemplate,
  Star,
  MoreHorizontal,
  LayoutGrid,
  List,
  Menu,
  Sparkles,
  Plus,
  BookOpen,
  Check,
  X,
  Upload,
  Brain,
  Layers,
  ArrowRight,
  ExternalLink,
  Flame,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

// Components
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { DocumentGrid } from '@/components/DocumentGrid';
import { SearchBar } from '@/components/SearchBar';
import { EmptyDocsState } from '@/components/EmptyDocsState';
import {
  DotGridPattern,
  PastelBlob,
  HandDrawnUnderline,
  HandDrawnArrow,
} from '@/components/DecorativeElements';
import { DocumentUploadModal } from '@/components/documents';
import { triggerStreakActivity } from '@/components/StreakCard';

// Sample Documents Data (Mock preloaded docs removed - only user uploaded files shown)
export const INITIAL_SAMPLE_DOCUMENTS = [];

export function DocumentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isCraftPlusModalOpen, setIsCraftPlusModalOpen] = useState(false);
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);
  const [renameDocTarget, setRenameDocTarget] = useState(null);
  const [newTitleInput, setNewTitleInput] = useState('');

  // New Document Form
  const [newDocData, setNewDocData] = useState({
    title: '',
    category: 'Study Resources',
    description: '',
    previewType: 'editor',
    bullets: ['', ''],
  });

  // Supabase Data Fetching
  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      let fetchedDocs = [];

      // 1. Attempt API fetch
      try {
        const res = await api.get('/documents');
        if (Array.isArray(res?.data?.documents) && res.data.documents.length > 0) {
          fetchedDocs = res.data.documents.map((d) => ({
            id: d.id,
            title: d.title || d.fileName || 'Study Document',
            category: d.subject || d.category || 'Study Resources',
            updatedAt: d.createdAt ? `Updated ${new Date(d.createdAt).toLocaleDateString()}` : 'Updated recently',
            starred: Boolean(d.starred),
            description: d.summary || d.description || 'Uploaded document ready for AI study analysis.',
            previewType: 'editor',
            bullets: [
              'Synced with peer revision space.',
              'AI quiz and flashcards generation available.',
            ],
            tags: ['study', 'synced'],
            fileUrl: d.fileUrl,
          }));
        }
      } catch (_) {
        // Fallback to direct Supabase query
        if (user?.id) {
          const { data, error: sbError } = await supabase
            .from('documents')
            .select('*')
            .eq('uploaded_by', user.id)
            .order('created_at', { ascending: false });

          if (!sbError && Array.isArray(data) && data.length > 0) {
            fetchedDocs = data.map((d) => ({
              id: d.id,
              title: d.file_name || d.name || 'Study Document',
              category: d.subject_tag || 'Study Resources',
              updatedAt: d.created_at ? `Updated ${new Date(d.created_at).toLocaleDateString()}` : 'Recent',
              starred: Boolean(d.is_starred),
              description: d.summary || 'Uploaded study document.',
              previewType: 'editor',
              bullets: [
                'AI Study document uploaded to Peer Club vault.',
                'Ready for quiz extraction and review.',
              ],
              tags: ['study'],
              fileUrl: d.file_url,
            }));
          }
        }
      }

      // Strictly only display documents uploaded by the authenticated user
      setDocuments(fetchedDocs);
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError('Unable to load documents from server.');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user?.id]);

  // Starred docs list for sidebar
  const starredDocs = useMemo(() => {
    return documents.filter((d) => Boolean(d.starred));
  }, [documents]);

  // Filtered & Searched documents
  const filteredDocuments = useMemo(() => {
    let result = [...documents];

    // Filter by Sidebar Selection
    if (activeFilter === 'starred') {
      result = result.filter((d) => d.starred);
    } else if (activeFilter === 'folder-craft') {
      result = result.filter((d) => d.category === 'How to use Craft');
    } else if (activeFilter === 'folder-unsorted') {
      result = result.filter((d) => d.category !== 'How to use Craft');
    } else if (activeFilter.startsWith('tag-')) {
      const tag = activeFilter.replace('tag-', '');
      result = result.filter((d) => d.tags && d.tags.includes(tag));
    } else if (activeFilter.startsWith('doc-')) {
      const docId = activeFilter.replace('doc-', '');
      result = result.filter((d) => d.id === docId);
    } else if (activeFilter === 'tasks' || activeFilter === 'calendar' || activeFilter === 'templates') {
      // Mock filter subset for tabs
      result = result.filter((d) => d.previewType === 'study-tips' || d.previewType === 'project-notes');
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.category.toLowerCase().includes(query) ||
          (d.tags && d.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    return result;
  }, [documents, activeFilter, searchQuery]);

  // Actions
  const handleToggleStar = (doc) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, starred: !d.starred } : d))
    );
    toast.success(doc.starred ? `Unstarred "${doc.title}"` : `Starred "${doc.title}"!`);
  };

  const handleDelete = async (doc) => {
    try {
      if (doc.id && !doc.id.startsWith('sample-')) {
        await api.delete(`/documents/${doc.id}`);
      }
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      toast.success(`Deleted "${doc.title}"`);
    } catch (err) {
      console.warn('Failed to delete document:', err);
      toast.error('Failed to delete document from server');
    }
  };

  const handleDuplicate = (doc) => {
    const duplicated = {
      ...doc,
      id: `copy-${Date.now()}`,
      title: `${doc.title} (Copy)`,
      updatedAt: 'Updated just now',
    };
    setDocuments((prev) => [duplicated, ...prev]);
    toast.success(`Duplicated "${doc.title}"`);
  };

  const handleCreateDocument = async (payload) => {
    const { title, category, previewStyle, summary, file } = payload || {};
    if (!title || !title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    let uploadedDoc = null;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('category', category || 'Study Resources');
      if (summary) formData.append('description', summary.trim());
      
      const locationState = location.state;
      if (locationState?.roomId) {
        formData.append('roomId', locationState.roomId);
      }

      try {
        const res = await api.post('/documents', formData);
        uploadedDoc = res.data;
      } catch (err) {
        console.warn('API document upload fallback:', err);
      }

      // Sync streak tracking
      triggerStreakActivity('document');
    }

    const newDoc = {
      id: uploadedDoc?.id || `doc-${Date.now()}`,
      title: title.trim(),
      category: category || 'Study Resources',
      updatedAt: 'Updated just now',
      starred: false,
      description:
        summary ||
        (file
          ? `Uploaded ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
          : 'Newly created Craft document. Click to open and begin writing your study notes.'),
      previewType: previewStyle || 'editor',
      bullets: [
        file ? `File: ${file.name}` : 'Start writing your outline here.',
        'Link pages and study resources effortlessly.',
      ],
      tags: ['study', (category || 'general').toLowerCase().replace(/\s+/g, '-')],
      fileUrl: uploadedDoc?.fileUrl || null,
      fileSize: file ? file.size : null,
      fileName: file ? file.name : null,
    };

    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleUseTemplate = (template) => {
    const templatedDoc = {
      id: `template-${Date.now()}`,
      title: `${template.name} 📝`,
      category: template.category,
      updatedAt: 'Updated just now',
      starred: false,
      description: template.description,
      previewType: template.previewType,
      bullets: template.bullets,
      tags: template.tags,
    };
    setDocuments((prev) => [templatedDoc, ...prev]);
    setIsTemplatesModalOpen(false);
    toast.success(`Created document from "${template.name}" template!`);
  };

  const handleRenameConfirm = () => {
    if (!renameDocTarget || !newTitleInput.trim()) return;
    setDocuments((prev) =>
      prev.map((d) => (d.id === renameDocTarget.id ? { ...d, title: newTitleInput.trim() } : d))
    );
    toast.success('Document renamed!');
    setRenameDocTarget(null);
    setNewTitleInput('');
  };

  // Header Title Text helper
  const getHeaderTitle = () => {
    if (activeFilter === 'starred') return 'Starred Docs';
    if (activeFilter === 'folder-craft') return 'How to use Craft';
    if (activeFilter === 'folder-unsorted') return 'Unsorted Documents';
    if (activeFilter === 'tasks') return 'Document Tasks';
    if (activeFilter === 'calendar') return 'Daily Notes & Calendar';
    if (activeFilter === 'templates') return 'My Templates';
    if (activeFilter.startsWith('tag-')) return `#${activeFilter.replace('tag-', '')}`;
    return 'All Docs';
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] relative overflow-x-clip w-full max-w-full selection:bg-[var(--color-mint)]/50 selection:text-[var(--color-ink)] flex flex-col">
      {/* 1. Scrapbook Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <DotGridPattern opacity="opacity-30" />
        <PastelBlob color="var(--color-mint)" className="w-96 h-96 -top-20 -left-20" opacity={0.12} />
        <PastelBlob color="var(--color-marigold)" className="w-96 h-96 top-40 -right-20" opacity={0.12} />
        <PastelBlob color="var(--color-periwinkle)" className="w-96 h-96 bottom-20 left-1/3" opacity={0.10} />
      </div>

      {/* Floating Topbar */}
      <Topbar />

      {/* 2. Main Layout Container with Sidebar (Identical to Dashboard) */}
      <div className="flex flex-1 min-h-screen w-full relative z-10 items-start">
        {/* Left Sidebar (Desktop Only - Stays fixed in place while scrolling, full 100vh height) */}
        <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 pt-24 px-4 sm:px-6 md:px-10 pb-16 max-w-7xl w-full min-w-0">
          {/* Section 1: Page Header */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            {/* Left: Title & Scrapbook Underline */}
            <div>
              <h1 className="font-serif text-[38px] sm:text-[46px] leading-[1.1] tracking-[-1.38px] text-[var(--color-ink)] font-normal">
                {getHeaderTitle()}
              </h1>
              <div className="-mt-1 mb-1">
                <HandDrawnUnderline className="w-36 h-3 text-[var(--color-mint)]" />
              </div>
              <p className="text-sm text-[var(--color-graphite)] font-sans">
                {filteredDocuments.length} document{filteredDocuments.length === 1 ? '' : 's'} in your personal study vault
              </p>
            </div>

            {/* Right: Action buttons group */}
            <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
              {/* New Doc Button */}
              <button
                onClick={() => setIsNewDocModalOpen(true)}
                className="bg-[var(--color-periwinkle)]/30 hover:bg-[var(--color-periwinkle)]/50 text-[var(--color-ink)] rounded-full px-5 py-2.5 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <FilePlus className="w-4 h-4 text-indigo-900" />
                <span>New Doc</span>
              </button>

              {/* Templates Button */}
              <button
                onClick={() => setIsTemplatesModalOpen(true)}
                className="bg-[var(--color-marigold)]/30 hover:bg-[var(--color-marigold)]/50 text-[var(--color-ink)] rounded-full px-5 py-2.5 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <LayoutTemplate className="w-4 h-4 text-amber-900" />
                <span>Templates</span>
              </button>

              {/* Get Craft Plus Button */}
              <button
                onClick={() => setIsCraftPlusModalOpen(true)}
                className="bg-white border border-[var(--color-ash)] hover:shadow-[var(--shadow-subtle)] rounded-full px-5 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Get Craft Plus</span>
              </button>

              {/* "..." More Options Button */}
              <button
                onClick={() => toast.info('Shortcuts: ⌘N for new doc, ⌘K to search, Esc to close.')}
                className="w-10 h-10 rounded-full bg-white border border-[var(--color-ash)] hover:bg-[var(--color-linen)] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Options & Tips"
              >
                <MoreHorizontal className="w-4 h-4 text-[var(--color-graphite)]" />
              </button>
            </div>
          </section>

          {/* Section 2: Search Bar, View Mode Toggle & Filter Chips */}
          <section className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                placeholder="Search documents by title, tags or content..."
              />

              {/* View Mode Toggle (Grid vs List) */}
              <div className="flex items-center gap-1 self-end sm:self-auto bg-white p-1 rounded-full border border-[var(--color-ash)] shadow-xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[var(--color-ink)] text-white'
                      : 'text-[var(--color-stone)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)]'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[var(--color-ink)] text-white'
                      : 'text-[var(--color-stone)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)]'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All Docs' },
                { id: 'starred', label: '⭐ Starred' },
                { id: 'tasks', label: 'Tasks' },
                { id: 'templates', label: 'Templates' },
                { id: 'folder-craft', label: 'Study Guides' },
                { id: 'folder-unsorted', label: 'Notes & Uploads' },
              ].map((chip) => {
                const isActive = activeFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => setActiveFilter(chip.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--color-ink)] text-white shadow-xs'
                        : 'bg-white hover:bg-[var(--color-linen)] text-[var(--color-graphite)] border border-[var(--color-ash)]'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Document Content Area */}
          {loading ? (
            /* Loading State: Skeleton Cards (PART 11) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-[24px] p-6 border border-[var(--color-ash)]/50 shadow-[var(--shadow-xl)] animate-pulse flex flex-col min-h-[400px] justify-between"
                >
                  <div>
                    <div className="h-6 bg-[var(--color-cloud)] rounded-md w-3/4 mb-3" />
                    <div className="h-3 bg-[var(--color-cloud)]/70 rounded-md w-1/3 mb-4" />
                    <div className="h-3 bg-[var(--color-cloud)]/50 rounded-md w-full mb-1.5" />
                    <div className="h-3 bg-[var(--color-cloud)]/50 rounded-md w-5/6 mb-6" />
                    <div className="h-40 bg-[var(--color-linen)] rounded-[14px] w-full" />
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="h-2.5 bg-[var(--color-cloud)] rounded w-4/5" />
                    <div className="h-2.5 bg-[var(--color-cloud)] rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State (PART 11) */
            <div className="bg-white rounded-[24px] p-8 border border-[var(--color-papaya)]/40 shadow-craft-md text-center max-w-lg mx-auto">
              <AlertCircle className="w-12 h-12 text-[var(--color-papaya)] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-semibold text-[var(--color-ink)] mb-2">
                Sync Alert
              </h3>
              <p className="text-sm text-[var(--color-graphite)] mb-6">{error}</p>
              <button
                onClick={fetchDocuments}
                className="bg-[var(--color-ink)] text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:shadow-craft-md transition-all"
              >
                Retry Fetch
              </button>
            </div>
          ) : filteredDocuments.length === 0 ? (
            /* Section 4: Empty State (PART 5) */
            <EmptyDocsState
              onCreateClick={() => setIsNewDocModalOpen(true)}
              heading={searchQuery ? 'No matching documents' : 'No documents yet'}
              subheading={
                searchQuery
                  ? `We couldn't find any documents matching "${searchQuery}". Try a different keyword or reset filters.`
                  : 'Create your first document to start organizing your study materials.'
              }
              actionLabel={searchQuery ? 'Clear Search' : 'Create Document'}
            />
          ) : (
            /* Document Grid / List */
            <DocumentGrid
              documents={filteredDocuments}
              viewMode={viewMode}
              onCardClick={(doc) => setActiveViewerDoc(doc)}
              onOpen={(doc) => setActiveViewerDoc(doc)}
              onEdit={(doc) => {
                setRenameDocTarget(doc);
                setNewTitleInput(doc.title);
              }}
              onRename={(doc) => {
                setRenameDocTarget(doc);
                setNewTitleInput(doc.title);
              }}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onToggleStar={handleToggleStar}
            />
          )}
        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: NEW DOCUMENT & FILE UPLOAD MODAL (Craft.do Style)   */}
      {/* ============================================================ */}
      <DocumentUploadModal
        isOpen={isNewDocModalOpen}
        onClose={() => setIsNewDocModalOpen(false)}
        onCreate={handleCreateDocument}
      />

      {/* ============================================================ */}
      {/* MODAL 2: TEMPLATES MODAL                                     */}
      {/* ============================================================ */}
      {isTemplatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 sm:p-8 border border-[var(--color-ash)] shadow-craft-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsTemplatesModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-[var(--color-stone)] hover:text-[var(--color-ink)] rounded-full hover:bg-[var(--color-linen)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <LayoutTemplate className="w-6 h-6 text-amber-600" />
              <h2 className="font-serif text-2xl text-[var(--color-ink)] font-normal">
                Craft Study Templates
              </h2>
            </div>
            <p className="text-sm text-[var(--color-graphite)] mb-6">
              Pick a ready-made structure to jumpstart your study sessions.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  name: 'Lecture Note-Taking',
                  category: 'Study Resources',
                  description: 'Cornell note-taking method template with cues, notes, and summary block.',
                  previewType: 'editor',
                  bullets: ['Main lecture takeaways and keywords.', 'Summary section for fast active recall.'],
                  tags: ['lecture', 'notes'],
                },
                {
                  name: 'Exam Revision Matrix',
                  category: 'Study Resources',
                  description: 'High-yield formula cheat sheet and error-pattern tracker.',
                  previewType: 'exam-guide',
                  bullets: ['Formula sheets & derivation checkpoints.', 'Past paper mock score tracking.'],
                  tags: ['exam', 'prep'],
                },
                {
                  name: 'Active Recall Deck',
                  category: 'Study Resources',
                  description: 'Question-answer flashcard structure optimized for spaced repetition.',
                  previewType: 'study-tips',
                  bullets: ['Questions on left, hidden answers on toggle.', '3-day repetition checkpoints.'],
                  tags: ['study', 'recall'],
                },
                {
                  name: 'Weekly Sprint Planner',
                  category: 'Personal',
                  description: 'Track academic tasks, assignment deadlines, and study streaks.',
                  previewType: 'project-notes',
                  bullets: ['Daily study goal checklist.', 'Weekly reflection and productivity rating.'],
                  tags: ['sprint', 'schedule'],
                },
              ].map((tpl, i) => (
                <div
                  key={i}
                  className="p-5 rounded-[18px] bg-[var(--color-linen)]/60 border border-[var(--color-ash)] hover:border-[var(--color-azure)]/60 hover:bg-white transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-amber-900 bg-[var(--color-marigold)]/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {tpl.category}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)] mt-2">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-[var(--color-graphite)] mt-1.5 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleUseTemplate(tpl)}
                    className="mt-4 w-full bg-white hover:bg-[var(--color-ink)] hover:text-white border border-[var(--color-ash)] py-2 rounded-full text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: GET CRAFT PLUS MODAL                                */}
      {/* ============================================================ */}
      {isCraftPlusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-8 border border-[var(--color-ash)] shadow-craft-xl relative text-center">
            <button
              onClick={() => setIsCraftPlusModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-[var(--color-stone)] hover:text-[var(--color-ink)] rounded-full hover:bg-[var(--color-linen)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[var(--color-marigold)]/40 border border-[var(--color-marigold)]/70 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-amber-700 fill-amber-500" />
            </div>

            <h2 className="font-serif text-2xl text-[var(--color-ink)] mb-2 font-normal">
              Unlock Craft Plus
            </h2>
            <p className="text-sm text-[var(--color-graphite)] mb-6">
              Supercharge your Peer Club study system with premium Craft Docs features.
            </p>

            <div className="space-y-3 text-left mb-6 font-sans">
              <div className="flex items-center gap-3 text-xs text-[var(--color-graphite)]">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited documents & nested block hierarchies</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--color-graphite)]">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full AI quiz and flashcard batch generation</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--color-graphite)]">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PDF, Markdown, & Notion lossless export</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--color-graphite)]">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real-time collaborative study rooms sync</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCraftPlusModalOpen(false);
                toast.success('Craft Plus plan activated for this session! Enjoy unlimited power.');
              }}
              className="w-full bg-[var(--color-ink)] text-white rounded-full py-3 text-sm font-semibold hover:shadow-craft-md transition-all"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: DOCUMENT VIEWER / INSPECTOR MODAL                  */}
      {/* ============================================================ */}
      {activeViewerDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 sm:p-8 border border-[var(--color-ash)] shadow-craft-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveViewerDoc(null)}
              className="absolute top-6 right-6 p-2 text-[var(--color-stone)] hover:text-[var(--color-ink)] rounded-full hover:bg-[var(--color-linen)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-[var(--color-stone)] mb-2">
              <span className="font-semibold text-amber-800 bg-[var(--color-marigold)]/40 px-2.5 py-0.5 rounded-full">
                {activeViewerDoc.category}
              </span>
              <span>•</span>
              <span>{activeViewerDoc.updatedAt}</span>
            </div>

            <h2 className="font-serif text-3xl text-[var(--color-ink)] font-normal mb-3">
              {activeViewerDoc.title}
            </h2>

            <p className="text-sm text-[var(--color-graphite)] leading-relaxed mb-6 font-sans">
              {activeViewerDoc.description}
            </p>

            <div className="p-4 rounded-[16px] bg-[var(--color-linen)]/70 border border-[var(--color-ash)]/60 mb-6 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-stone)]">
                Document Contents & Outline
              </h4>
              {activeViewerDoc.bullets?.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[var(--color-graphite)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-mint)] mt-1 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--color-ash)]/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveViewerDoc(null);
                    navigate('/quizzes');
                  }}
                  className="bg-[var(--color-mint)]/30 hover:bg-[var(--color-mint)]/50 text-emerald-950 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Generate Quiz</span>
                </button>

                <button
                  onClick={() => {
                    setActiveViewerDoc(null);
                    navigate('/flashcards');
                  }}
                  className="bg-[var(--color-periwinkle)]/30 hover:bg-[var(--color-periwinkle)]/50 text-indigo-950 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Study Flashcards</span>
                </button>
              </div>

              {activeViewerDoc.fileUrl && (
                <a
                  href={activeViewerDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-[var(--color-azure)] hover:underline flex items-center gap-1"
                >
                  <span>Open Raw File</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: RENAME MODAL                                        */}
      {/* ============================================================ */}
      {renameDocTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] max-w-sm w-full p-6 border border-[var(--color-ash)] shadow-craft-xl">
            <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)] mb-1">
              Rename Document
            </h3>
            <p className="text-xs text-[var(--color-stone)] mb-4">
              Enter a new name for this study document.
            </p>
            <input
              type="text"
              value={newTitleInput}
              onChange={(e) => setNewTitleInput(e.target.value)}
              className="w-full h-10 px-3 rounded-[10px] bg-[var(--color-linen)] border border-[var(--color-ash)] text-sm mb-4 focus:outline-none focus:border-[var(--color-azure)]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRenameDocTarget(null)}
                className="px-4 py-2 text-xs font-medium text-[var(--color-graphite)] hover:bg-[var(--color-linen)] rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameConfirm}
                className="bg-[var(--color-ink)] text-white px-5 py-2 text-xs font-semibold rounded-full hover:shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentsPage;
