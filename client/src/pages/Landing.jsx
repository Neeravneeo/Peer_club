import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ============================================================
   PEER CLUB — CRAFT-STYLE LIGHT EDITORIAL LANDING PAGE
   Inspired by craft.do: Warm light palette, Fraunces serif headlines,
   organic cloud SVGs, pastel accents, diffuse shadows.
   Preserves ALL 14 demo-critical DOM IDs & interactive demo states.
   ============================================================ */

/* ---------------- CLOUD & ILLUSTRATIVE SVGS ---------------- */
const CloudSVG1 = ({ className = "w-32 h-20 text-white/90" }) => (
  <svg className={className} viewBox="0 0 120 70" fill="currentColor">
    <path d="M25 50 C12 50 2 40 2 28 C2 17 12 8 23 9 C28 3 37 0 46 0 C58 0 69 6 74 16 C78 14 83 13 88 13 C101 13 112 23 112 36 C112 37 112 38 111 40 C116 42 120 47 120 52 C120 60 114 66 106 66 C104 66 30 66 25 50 Z" />
  </svg>
);

const CloudSVG2 = ({ className = "w-44 h-24 text-sky-100/80" }) => (
  <svg className={className} viewBox="0 0 160 85" fill="currentColor">
    <path d="M30 65 C15 65 3 53 3 38 C3 24 14 13 28 13 C35 5 46 0 58 0 C74 0 88 8 94 22 C100 19 107 18 114 18 C131 18 146 32 146 49 C154 51 160 58 160 67 C160 77 152 85 142 85 L35 85 C30 85 30 65 30 65 Z" />
  </svg>
);

const CloudSVG3 = ({ className = "w-28 h-16 text-indigo-50/70" }) => (
  <svg className={className} viewBox="0 0 100 55" fill="currentColor">
    <path d="M20 42 C10 42 2 34 2 24 C2 15 9 7 19 8 C23 3 30 0 38 0 C48 0 57 5 61 13 C64 12 68 11 72 11 C83 11 92 19 92 30 C96 32 100 36 100 41 C100 47 95 52 89 52 L22 52 Z" />
  </svg>
);

/* Hand-drawn underline SVG for "superpower" */
const WavyUnderline = ({ className = "w-full h-3 text-emerald-500" }) => (
  <svg className={className} viewBox="0 0 260 14" fill="none" preserveAspectRatio="none">
    <path
      d="M3 10C45 3 115 2 257 8.5C185 12 75 11 15 11.5"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

/* ---------------- INLINE SVG ICONS (Craft rounded style) ---------------- */
const Icon = ({ path, className = "w-5 h-5", fill = "none" }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const BrainIcon = ({ className }) => (
  <Icon className={className} path={<><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></>} />
);
const FireIcon = ({ className }) => (
  <Icon className={className} path={<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />} />
);
const BookIcon = ({ className }) => (
  <Icon className={className} path={<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />} />
);
const ZapIcon = ({ className }) => (
  <Icon className={className} path={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />} />
);
const CheckIcon = ({ className }) => (
  <Icon className={className} path={<polyline points="20 6 9 17 4 12" />} />
);
const XIcon = ({ className }) => (
  <Icon className={className} path={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />
);
const UploadIcon = ({ className }) => (
  <Icon className={className} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>} />
);
const TrophyIcon = ({ className }) => (
  <Icon className={className} path={<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>} />
);
const ClockIcon = ({ className }) => (
  <Icon className={className} path={<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>} />
);
const StarIcon = ({ className }) => (
  <Icon className={className} fill="currentColor" path={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />} />
);
const MenuIcon = ({ className }) => (
  <Icon className={className} path={<><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>} />
);
const ChevronIcon = ({ className }) => (
  <Icon className={className} path={<polyline points="6 9 12 15 18 9" />} />
);
const ShieldIcon = ({ className }) => (
  <Icon className={className} path={<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />} />
);
const UsersIcon = ({ className }) => (
  <Icon className={className} path={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />
);

/* ---------------- COUNT-UP HOOK ---------------- */
const CountUp = ({ end, suffix = "", duration = 1600 }) => {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStarted(true),
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTs = null, raf;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      setValue(Math.floor(p * end));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, end, duration]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
};

/* ============================================================
   SECTIONS
   ============================================================ */

/* ---------------- 1. NAVBAR ---------------- */
const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav
      id="responsiveNav"
      className="fixed top-0 left-0 w-full md:top-4 md:left-1/2 md:-translate-x-1/2 z-50 md:w-[95%] md:max-w-6xl px-5 py-3 md:px-6 md:py-3 md:rounded-full bg-white/90 md:bg-white/70 backdrop-blur-md md:backdrop-blur-xl border-b md:border border-gray-200/60 md:border-white/60 shadow-sm md:shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        {/* Group 1: Logo (Left) */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <BrainIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight font-serif">
            Peer Club
          </span>
        </Link>

        {/* Group 2: Navigation Links (Center) */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Subjects", href: "#subjects" },
            { label: "Reviews", href: "#reviews" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Group 3: Actions (Right) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-[15px] font-medium text-gray-700 hover:text-gray-900 transition-colors px-2 py-1"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-gray-900 text-white text-[14px] font-semibold px-5 py-2 rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap shadow-xs"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          id="mobileMenuBtn"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors focus:outline-none"
        >
          {open ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 mt-3 -mx-5 -mb-3 px-6 py-5 flex flex-col gap-4 shadow-xl animate-in fade-in duration-150">
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Subjects", href: "#subjects" },
            { label: "Reviews", href: "#reviews" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-[15px] font-medium text-gray-700 hover:text-gray-900 py-1"
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-center py-2.5 rounded-full border border-gray-300 text-gray-700 text-[14px] font-medium hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="text-center py-2.5 rounded-full bg-gray-900 text-white text-[14px] font-semibold hover:bg-black transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ---------------- 2. HERO ---------------- */
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-36 md:pt-44 pb-20 px-6 overflow-hidden bg-gradient-to-b from-[#F0F4FF] via-[#FAFAF7] to-[#FAFAF7]">
      {/* Floating Organic Clouds */}
      <div className="absolute top-16 left-6 md:left-24 animate-craft-cloud opacity-80 pointer-events-none -z-0">
        <CloudSVG1 className="w-36 md:w-48 h-auto text-white drop-shadow-[0_12px_24px_rgba(45,91,255,0.06)]" />
      </div>
      <div className="absolute top-24 right-4 md:right-32 animate-craft-cloud-slow opacity-90 pointer-events-none -z-0">
        <CloudSVG2 className="w-48 md:w-64 h-auto text-sky-50 drop-shadow-[0_16px_32px_rgba(45,91,255,0.08)]" />
      </div>
      <div className="absolute top-96 left-1/4 animate-craft-cloud opacity-60 pointer-events-none -z-0 hidden md:block">
        <CloudSVG3 className="w-32 h-auto text-indigo-50/90" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 mb-16">
        {/* Gemini Badge */}
        <div
          id="geminiBadge"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-xs font-semibold text-[#2D5BFF] mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D5BFF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D5BFF]"></span>
          </span>
          Powered by Google Gemini 3.8 Flash
        </div>

        {/* Serif Headline with Hand-drawn Underline */}
        <h1
          id="heroHeadline"
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold text-[#1A1A1A] tracking-[-0.03em] leading-[1.05] mb-6 max-w-4xl mx-auto"
        >
          Your notes are{" "}
          <span className="relative inline-block text-emerald-600">
            your superpower.
            <WavyUnderline className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-3 md:h-4 text-emerald-500" />
          </span>
        </h1>

        {/* Subheadline */}
        <p
          id="heroSubheadline"
          className="text-lg md:text-xl text-[#6B6B6B] mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Study Together. Stay Accountable. Learn Faster. Upload revision notes or PDFs to generate
          instant AI quizzes and flashcards, track your study streak, and level up.
        </p>

        {/* Craft-Style CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="ctaGetStarted"
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto px-9 py-4 bg-[#1A1A1A] hover:bg-black text-white font-medium rounded-full text-base transition-all transform hover:-translate-y-0.5 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.35)]"
          >
            Get Started Free
          </button>
          <button
            id="ctaSignIn"
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-9 py-4 bg-white hover:bg-[#F6F6F2] text-[#1A1A1A] font-semibold rounded-full text-base border border-[#E8E8E3] hover:border-[#1A1A1A] transition-all transform hover:-translate-y-0.5 shadow-sm"
          >
            Sign In
          </button>
        </div>
        <p className="mt-5 text-xs text-[#9A9A9A] tracking-wide">
          Free forever for students · No credit card required
        </p>
      </div>

      {/* Floating Dashboard Mockup */}
      <div id="coreLoopAnimation" className="relative max-w-5xl mx-auto px-2">
        {/* Soft Background Cloud Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/30 via-emerald-100/30 to-purple-200/30 blur-2xl -z-10 rounded-3xl" />

        <div className="relative rounded-3xl border border-[#E8E8E3] bg-white shadow-[0_24px_70px_-20px_rgba(0,0,0,0.12)] overflow-hidden animate-craft-float">
          {/* Mockup macOS / Craft App Window Header */}
          <div className="h-10 bg-[#FAF9F6] border-b border-[#E8E8E3] flex items-center px-4 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60" />
            </div>
            <div className="text-[11px] font-medium text-[#8A8F98] bg-white border border-[#E8E8E3] px-4 py-1 rounded-full shadow-2xl">
              peer-club-workspace.app · Gemini  Flash
            </div>
            <div className="w-12" />
          </div>

          {/* App Body */}
          <div className="p-6 md:p-8 grid grid-cols-12 gap-6 bg-[#FAFAF7]">
            {/* Sidebar */}
            <div className="col-span-3 hidden md:flex flex-col gap-3">
              <div className="h-9 w-36 bg-emerald-50 text-emerald-800 font-semibold text-xs rounded-xl flex items-center px-3 border border-emerald-200/60">
                🌱 Active Study Room
              </div>
              <div className="h-8 w-28 bg-white text-[#6B6B6B] text-xs rounded-xl flex items-center px-3 border border-[#E8E8E3]">
                📚 Revision Vault
              </div>
              <div className="h-8 w-32 bg-white text-[#6B6B6B] text-xs rounded-xl flex items-center px-3 border border-[#E8E8E3]">
                🃏 Smart Flashcards
              </div>
              <div className="h-8 w-24 bg-white text-[#6B6B6B] text-xs rounded-xl flex items-center px-3 border border-[#E8E8E3]">
                📊 Leaderboard
              </div>
              <div className="mt-auto h-16 rouned-2xl bg-[#F0F4FF] p-3 border border-blue-100 flex flex-col justify-center">
                <span className="text-[10px] text-[#2D5BFF] font-semibold uppercase">Daily Goal</span>
                <span className="text-xs font-bold text-[#1A1A1A]">45 / 60 mins</span>
              </div>
            </div>

            {/* Main Content Pane */}
            <div className="col-span-12 md:col-span-9 flex flex-col gap-5">
              {/* Stat Chips Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                {[
                  { icon: <FireIcon className="w-4 h-4 text-orange-500" />, label: "Streak", v: "5 Days", bg: "bg-orange-50" },
                  { icon: <ClockIcon className="w-4 h-4 text-blue-500" />, label: "Focus", v: "12h 30m", bg: "bg-blue-50" },
                  { icon: <BrainIcon className="w-4 h-4 text-purple-500" />, label: "Quizzes", v: "8 Exams", bg: "bg-purple-50" },
                  { icon: <TrophyIcon className="w-4 h-4 text-amber-500" />, label: "Badges", v: "3 Badges", bg: "bg-amber-50" },
                ].map((s, i) => (
                  <div key={i} className={`rounded-2xl border border-[#E8E8E3] bg-white p-3.5 flex flex-col justify-between shadow-sm`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#9A9A9A] tracking-wider">{s.label}</span>
                      <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>{s.icon}</div>
                    </div>
                    <div className="font-serif text-lg font-bold text-[#1A1A1A] mt-2">{s.v}</div>
                  </div>
                ))}
              </div>

              {/* Two Feature Panels inside Mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-[#E8E8E3] p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#6B6B6B] mb-3">
                    <BookIcon className="w-4 h-4 text-emerald-600" /> RECENT DOCUMENTS
                  </div>
                  <div className="space-y-2">
                    <div className="h-9 bg-[#FAFAF7] rounded-xl flex items-center justify-between px-3 text-xs text-[#1A1A1A] border border-[#E8E8E3]">
                      <span>Physics_Ch3_Optics.pdf</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Indexed</span>
                    </div>
                    <div className="h-9 bg-[#FAFAF7] rounded-xl flex items-center justify-between px-3 text-xs text-[#1A1A1A] border border-[#E8E8E3]">
                      <span>Modern_History_Notes.txt</span>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Ready</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E8E8E3] p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#6B6B6B] mb-3">
                    <ZapIcon className="w-4 h-4 text-purple-600" /> ACTIVE REVISION
                  </div>
                  <div className="space-y-2">
                    <div className="h-9 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between px-3 text-xs font-medium text-emerald-900">
                      <span>Newton's Laws Mock</span>
                      <span className="font-bold text-emerald-700">80% Score</span>
                    </div>
                    <div className="h-9 bg-[#FAFAF7] rounded-xl flex items-center justify-between px-3 text-xs text-[#1A1A1A] border border-[#E8E8E3]">
                      <span>Spaced Flashcard Set</span>
                      <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">30 Cards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Playful Accent Pills around the Mockup */}
        <div className="absolute -top-6 -left-4 bg-white border border-[#E8E8E3] p-3 rounded-2xl shadow-xl hidden md:flex items-center gap-3 animate-craft-cloud">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
            <ZapIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider">AI Generated</div>
            <div className="text-xs font-bold text-[#1A1A1A]">10 Questions in 8s</div>
          </div>
        </div>

        <div className="absolute -bottom-6 -right-4 bg-white border border-[#E8E8E3] p-3 rounded-2xl shadow-xl hidden md:flex items-center gap-3 animate-craft-cloud-slow">
          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
            <FireIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider">Daily Streak</div>
            <div className="text-xs font-bold text-[#1A1A1A]">🔥 5 Day Streak Saved</div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- 3. SUBJECT MARQUEE ---------------- */
const Marquee = () => {
  const subjects = [
    "Physics", "Mathematics", "History", "Computer Science", "Biology",
    "Chemistry", "Economics", "Law", "Medicine", "GRE", "GATE", "UPSC", "CAT", "JEE", "NEET"
  ];
  const row = [...subjects, ...subjects];

  return (
    <div className="py-12 border-y border-[#E8E8E3] bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
        <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-widest">
          BUILT FOR EVERY SYLLABUS
        </p>
      </div>
      <div className="flex gap-4 whitespace-nowrap animate-craft-marquee">
        {row.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F6F6F2] border border-[#E8E8E3] text-[#4A4A4A] font-medium text-sm hover:border-black hover:text-black transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 4. CRAFT-STYLE INTRO: "NOT JUST FOR ONE THING" ---------------- */
const CraftIntro = () => {
  const items = [
    { icon: "📝", label: "AI Quizzes", desc: "Instant mock tests", bg: "bg-purple-100/60", border: "border-purple-200" },
    { icon: "🃏", label: "Spaced Flashcards", desc: "Active recall in 3D", bg: "bg-blue-100/60", border: "border-blue-200" },
    { icon: "🔥", label: "Daily Streaks", desc: "Unforgiving consistency", bg: "bg-orange-100/60", border: "border-orange-200" },
    { icon: "🏆", label: "Smart Badges", desc: "Gamified progress", bg: "bg-amber-100/60", border: "border-amber-200" },
    { icon: "📊", label: "Study Dashboard", desc: "Focus analytics", bg: "bg-emerald-100/60", border: "border-emerald-200" },
  ];

  return (
    <section className="py-24 px-6 bg-[#FAFAF7]">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight mb-4">
          Peer Club isn't just for one thing, <br className="hidden sm:block" />
          it's for <span className="italic font-normal">your</span> things.
        </h2>
        <p className="text-base sm:text-lg text-[#6B6B6B] max-w-xl mx-auto mb-14">
          Turn passive reading into active mastery with tools fine-tuned for high retention.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((it, i) => (
            <div
              key={i}
              className={`rounded-2xl bg-white border border-[#E8E8E3] p-5 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow`}
            >
              <div className={`w-12 h-12 rounded-full ${it.bg} ${it.border} border flex items-center justify-center text-2xl mb-3`}>
                {it.icon}
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A] mb-1">{it.label}</h3>
              <p className="text-xs text-[#6B6B6B]">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- 5. HORIZONTAL SCROLL: HOW STUDENTS USE PEER CLUB ---------------- */
const StudentUseCases = () => {
  const cases = [
    { n: "NEERAV S.", r: "CS UNDERGRAD, DELHI", t: "End-sem revision, project notes, GATE CS formulas into instant quizzes.", bg: "from-blue-500 to-indigo-600" },
    { n: "ANANYA R.", r: "UPSC ASPIRANT, PUNE", t: "400-page NCERT history books synthesized into active recall loops.", bg: "from-amber-500 to-orange-600" },
    { n: "ROHAN M.", r: "GATE 2027, IIT BOMBAY", t: "Engineering mathematics theorem sets reviewed using 3D revisit loops.", bg: "from-emerald-500 to-teal-600" },
    { n: "FATIMA K.", r: "MBBS 2ND YEAR, HYDERABAD", t: "Anatomy viva diagrams and pharmacological side effects flashcard decks.", bg: "from-rose-500 to-pink-600" },
    { n: "ARJUN P.", r: "CAT ASPIRANT, BANGALORE", t: "Daily quant formula sheets and reading comprehension test drills.", bg: "from-purple-500 to-violet-600" },
    { n: "SNEHA D.", r: "STUDY GROUP LEAD, CHENNAI", t: "Shared class document slots so 6 classmates test from one question bank.", bg: "from-cyan-500 to-blue-600" },
  ];

  return (
    <section className="py-20 px-6 bg-white border-b border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#9A9A9A] uppercase tracking-widest">REAL WORKFLOWS</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2">
              How students use Peer Club
            </h2>
          </div>
          <p className="text-xs text-[#9A9A9A] mt-2 sm:mt-0 font-medium">Scroll to explore →</p>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-6 snap-x no-scrollbar">
          {cases.map((c, i) => (
            <div
              key={i}
              className="w-[290px] shrink-0 snap-start rounded-2xl bg-[#FAFAF7] border border-[#E8E8E3] p-6 flex flex-col justify-between shadow-sm hover:border-[#1A1A1A]/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${c.bg} flex items-center justify-center font-bold text-white text-sm shadow-sm`}>
                  {c.n.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A] tracking-tight">{c.n}</div>
                  <div className="text-[10px] text-[#9A9A9A] font-semibold">{c.r}</div>
                </div>
              </div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed font-normal">"{c.t}"</p>
              <div className="mt-4 pt-3 border-t border-[#E8E8E3] text-[11px] font-semibold text-emerald-700">
                Verified Student
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- 6. FEATURE 1: AI QUIZZES (Interactive Demo) ---------------- */
const QuizFeatureSection = () => {
  const [selected, setSelected] = useState(null);
  const options = [
    { id: "A", text: "F = ma", correct: true },
    { id: "B", text: "E = mc²", correct: false },
    { id: "C", text: "F = mg", correct: false },
    { id: "D", text: "p = mv", correct: false },
  ];
  const answered = selected !== null;
  const picked = options.find((o) => o.id === selected);

  return (
    <section id="features" className="py-28 px-6 bg-[#F0F4FF] border-b border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* Left Column Text */}
        <div>
          <span className="text-xs font-bold text-[#2D5BFF] uppercase tracking-widest bg-blue-100/70 px-3 py-1 rounded-full">
            QUIZ
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1A1A] mt-4 mb-6 leading-tight">
            From uploaded notes to graded quiz in 10 seconds.
          </h2>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
            Choose 3–15 questions, pick Easy / Medium / Hard, and select MCQ, Short Answer or Mixed.
            Gemini analyzes your exact document and returns a graded exam with AI explanations for every single answer.
          </p>

          <ul className="space-y-4 mb-8">
            {[
              "Auto-graded instantly on submit",
              "💡 AI explanation for every question",
              "Retake anytime — best score is tracked",
              "Low score? Get personalized study tips by email",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm sm:text-base text-[#1A1A1A]">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckIcon className="w-3.5 h-3.5" />
                </div>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <a href="#how-it-works" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D5BFF] hover:underline underline-offset-4">
            Learn more about quiz generation →
          </a>
        </div>

        {/* Right Column: Restyled Light Interactive Quiz */}
        <div className="bg-white border border-[#E8E8E3] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              LIVE INTERACTIVE DEMO
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
              MEDIUM
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-6">
            What is Newton's Second Law of Motion?
          </h3>

          <div className="space-y-3">
            {options.map((o) => {
              let cls = "border-[#E8E8E3] bg-[#FAFAF7] hover:border-[#1A1A1A] text-[#1A1A1A]";
              if (answered && o.correct) cls = "border-emerald-500 bg-emerald-50 text-emerald-900";
              else if (answered && o.id === selected && !o.correct) cls = "border-red-400 bg-red-50 text-red-900";
              else if (answered) cls = "border-[#E8E8E3] bg-neutral-50 text-[#9A9A9A]";

              return (
                <button
                  key={o.id}
                  disabled={answered}
                  onClick={() => setSelected(o.id)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl border transition-all flex items-center gap-4 ${cls}`}
                >
                  <span className="w-7 h-7 rounded-xl bg-white border border-[#E8E8E3] flex items-center justify-center text-xs font-bold text-[#1A1A1A] shrink-0 shadow-xs">
                    {o.id}
                  </span>
                  <span className="font-medium text-sm sm:text-base">{o.text}</span>
                  {answered && o.correct && <CheckIcon className="w-5 h-5 ml-auto text-emerald-600" />}
                  {answered && o.id === selected && !o.correct && <XIcon className="w-5 h-5 ml-auto text-red-500" />}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`mt-5 p-4 rounded-2xl text-sm leading-relaxed ${picked.correct ? "bg-emerald-50 border border-emerald-200 text-emerald-900" : "bg-red-50 border border-red-200 text-red-900"}`}>
              💡 <strong>AI Explanation:</strong> Newton's 2nd Law relates force, mass & acceleration: <em>F = ma</em>. Energy-mass equivalence (E = mc²) is Einstein; p = mv is momentum.
            </div>
          )}

          {answered && (
            <button
              onClick={() => setSelected(null)}
              className="mt-4 text-xs font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] underline underline-offset-4"
            >
              Reset and try again
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

/* ---------------- 7. AWARDS / TRUST STRIP ---------------- */
const TrustStrip = () => {
  const badges = [
    { icon: "📱", t: "App Store Ready", d: "PWA installable on iOS & Android" },
    { icon: "⚡", t: "Gemini 1.5 Flash", d: "Under 10-second multimodal synthesis" },
    { icon: "🛡️", t: "Supabase Secure", d: "Encrypted sessions & JWT authentication" },
    { icon: "🎓", t: "Built for Students", d: "Free Month 1 habit-forming core" },
  ];

  return (
    <section className="py-14 px-6 bg-white border-b border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map((b, i) => (
          <div key={i} className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAFAF7] border border-[#E8E8E3]">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E8E3] flex items-center justify-center text-xl shrink-0 shadow-xs">
              {b.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A1A1A]">{b.t}</div>
              <div className="text-[11px] text-[#6B6B6B]">{b.d}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ---------------- 8. QUOTE 1 (Soft Yellow) ---------------- */
const QuoteSection1 = () => (
  <section className="py-24 px-6 bg-[#FFF9E6] border-b border-[#E8E8E3]">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex-1">
        <span className="text-3xl text-amber-400 font-serif">“</span>
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl italic text-[#1A1A1A] leading-snug">
          I used to spend 2 hours making revision questions. Now it's 8 seconds. My end-sem score jumped from 6.8 to 8.4 subject average.
        </blockquote>
      </div>
      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
        <div className="w-12 h-12 rounded-full bg-amber-400 text-black font-bold flex items-center justify-center font-serif text-lg shadow-sm">
          N
        </div>
        <div>
          <div className="font-bold text-sm text-[#1A1A1A]">Neerav S.</div>
          <div className="text-xs text-[#6B6B6B]">CS Undergrad, Delhi</div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- 9. FEATURE 2: FLASHCARDS (3D Interactive Demo, Alternating Layout) ---------------- */
const FlashcardFeatureSection = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <section className="py-28 px-6 bg-[#F0FFF4] border-b border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* Left: 3D Flip Card Demo */}
        <div className="order-2 lg:order-1 flex flex-col items-center">
          <div className="w-full max-w-md [perspective:1200px] cursor-pointer select-none" onClick={() => setFlipped(!flipped)}>
            <div className={`relative h-72 transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
              {/* Front Face */}
              <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl bg-white border border-[#E8E8E3] p-8 flex flex-col items-center justify-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)]">
                <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full mb-6">
                  Front · Tap to flip
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] text-center">
                  Newton's Second Law
                </h3>
                <p className="text-xs text-[#9A9A9A] mt-6">Active Recall • Card 01 of 15</p>
              </div>

              {/* Back Face */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-300 p-8 flex flex-col items-center justify-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)]">
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold bg-white border border-emerald-200 px-3 py-1 rounded-full mb-4">
                  Back Face
                </span>
                <p className="font-serif text-xl sm:text-2xl text-[#1A1A1A] text-center leading-relaxed">
                  States that <strong className="text-emerald-700 font-bold">F = ma</strong> — force equals mass times acceleration.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setFlipped(false)}
              className="px-5 py-2 rounded-full bg-white text-emerald-800 text-xs font-bold border border-emerald-300 shadow-xs hover:bg-emerald-50"
            >
              ✅ Known
            </button>
            <button
              onClick={() => setFlipped(true)}
              className="px-5 py-2 rounded-full bg-white text-orange-800 text-xs font-bold border border-orange-300 shadow-xs hover:bg-orange-50"
            >
              🔄 Revisit Loop
            </button>
          </div>
        </div>

        {/* Right: Text Copy */}
        <div className="order-1 lg:order-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
            RECALL
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1A1A] mt-4 mb-6 leading-tight">
            Active recall that feels like play.
          </h2>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
            Generate 5–30 revision cards from any document. Flip them in smooth 3D, mark Known or Revisit,
            and loop only your weak cards until they stick. On mobile, swipe right for Known, left for Revisit.
          </p>

          <ul className="space-y-4 mb-8">
            {[
              "3D flip animation with zero layout shift",
              "Known / Revisit tracking per set",
              "One-tap 'Review Revisit Cards' loop",
              "Swipe gestures on touch devices",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm sm:text-base text-[#1A1A1A]">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckIcon className="w-3.5 h-3.5" />
                </div>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <a href="#how-it-works" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline underline-offset-4">
            Learn more about Leitner repetition →
          </a>
        </div>
      </div>
    </section>
  );
};

/* ---------------- 10. FEATURE 3: STREAKS (Alternating Layout) ---------------- */
const StreakFeatureSection = () => {
  const days = Array.from({ length: 28 }, (_, i) => {
    const pattern = [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1];
    return pattern[i];
  });

  return (
    <section className="py-28 px-6 bg-[#FFF0F5] border-b border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* Left: Text Content */}
        <div>
          <span className="text-xs font-bold text-rose-700 uppercase tracking-widest bg-rose-100 px-3 py-1 rounded-full">
            TRACK
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1A1A] mt-4 mb-6 leading-tight">
            Streaks that keep you honest.
          </h2>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
            Every quiz, flashcard session and logged study hour feeds your streak. Miss a day and our
            automation engine emails you at 9PM: "Your streak ends at midnight!" Break it? We'll be there to restart you.
          </p>

          <ul className="space-y-4">
            {[
              "Daily streak with midnight deadline reminders",
              "Badge auto-awards: Brain Starter, On a Roll & more",
              "Weekly & monthly progress report cards by email",
              "Milestone celebrations at 1hr / 10hr / 50hr studied",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm sm:text-base text-[#1A1A1A]">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckIcon className="w-3.5 h-3.5" />
                </div>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Restyled Streak Calendar Mockup */}
        <div className="bg-white border border-[#E8E8E3] rounded-3xl p-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)] max-w-md mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">September 2026</h3>
            <span className="flex items-center gap-1.5 text-xs font-bold text-orange-800 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
              <FireIcon className="w-4 h-4 text-orange-500" /> 22 days streak
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((d, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl flex items-center justify-center text-[11px] font-semibold border ${d
                    ? "bg-orange-100 border-orange-200 text-orange-800"
                    : "bg-[#FAFAF7] border-[#E8E8E3] text-[#9A9A9A]"
                  }`}
              >
                {d ? "🔥" : i + 1}
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              ["Badges", "7 🏆"],
              ["Hours", "41h"],
              ["Quizzes", "26"],
            ].map(([k, v]) => (
              <div key={k} className="bg-[#FAFAF7] border border-[#E8E8E3] rounded-2xl py-3">
                <div className="font-serif text-lg font-bold text-[#1A1A1A]">{v}</div>
                <div className="text-[10px] text-[#9A9A9A] uppercase tracking-wider font-semibold mt-0.5">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- 11. STRUCTURE THAT ADAPTS TO YOUR THINKING ---------------- */
const StructureCards = () => {
  const cards = [
    {
      title: "Rooms",
      desc: "Segregate semesters, exam years, and distinct competitive syllabi in isolated study rooms.",
      bg: "bg-[#F0F4FF]",
      border: "border-blue-200",
      tag: "ORGANIZATION",
      href: "/rooms"
    },
    {
      title: "Documents",
      desc: "Upload lecture PDFs, textbook scans, and summaries with cloud extraction into text chunks.",
      bg: "bg-[#FFF9E6]",
      border: "border-amber-200",
      tag: "SYNTHESIS",
      href: "/documents"
    },
    {
      title: "Collections",
      desc: "Collate high-yield flashcard decks and targeted mock tests ready before final vivas.",
      bg: "bg-[#F0FFF4]",
      border: "border-emerald-200",
      tag: "MASTERY",
      href: "/quizzes"
    },
  ];

  return (
    <section className="py-24 px-6 bg-white border-b border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
          Structure that adapts to your thinking.
        </h2>
        <p className="text-base sm:text-lg text-[#6B6B6B] max-w-xl mx-auto mb-14">
          Organize knowledge intuitively without rigid hierarchies or complicated setup tutorials.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {cards.map((c, i) => (
            <Link 
              key={i} 
              to={c.href}
              className={`rounded-3xl ${c.bg} border ${c.border} p-8 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer`}
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#1A1A1A]/70 uppercase bg-white/60 px-3 py-1 rounded-full">
                  {c.tag}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-5 mb-3">{c.title}</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed font-normal">{c.desc}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#1A1A1A]">
                <span>Explore {c.title}</span>
                <span className="text-lg leading-none">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- 12. QUOTE 2 (White) ---------------- */
const QuoteSection2 = () => (
  <section className="py-24 px-6 bg-white border-b border-[#E8E8E3]">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex-1">
        <span className="text-3xl text-emerald-500 font-serif">“</span>
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl italic text-[#1A1A1A] leading-snug">
          The 9PM streak emails are ruthless and I love it. 47-day streak and counting. History optional has never felt this light.
        </blockquote>
      </div>
      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center font-serif text-lg shadow-sm">
          A
        </div>
        <div>
          <div className="font-bold text-sm text-[#1A1A1A]">Ananya R.</div>
          <div className="text-xs text-[#6B6B6B]">UPSC Aspirant, Pune</div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- 13. SUBJECTS MASONRY / HORIZONTAL SNAP SCROLL ---------------- */
const SubjectsMasonry = () => {
  const items = [
    { t: "GATE 2027 Prep", d: "Engineering Mathematics + Core CS", g: "from-blue-50 to-indigo-50 border-blue-200" },
    { t: "Semester Exams", d: "End-sem revision in half the time", g: "from-emerald-50 to-teal-50 border-emerald-200" },
    { t: "UPSC History", d: "400 pages → 60 flashcards", g: "from-amber-50 to-orange-50 border-amber-200" },
    { t: "GRE Vocabulary", d: "Daily 20-card active recall loops", g: "from-purple-50 to-violet-50 border-purple-200" },
    { t: "NEET Biology", d: "Diagram-heavy notes, MCQ mode", g: "from-rose-50 to-pink-50 border-rose-200" },
    { t: "CAT Quant", d: "Formula sheets into mixed quizzes", g: "from-sky-50 to-blue-50 border-sky-200" },
    { t: "Law Case Notes", d: "Short-answer judgments practice", g: "from-slate-50 to-neutral-100 border-neutral-300" },
    { t: "Medicine Anatomy", d: "Revisit-only loops before vivas", g: "from-pink-50 to-rose-50 border-pink-200" },
    { t: "Study Groups", d: "Shared notes, one quiz bank", g: "from-teal-50 to-emerald-50 border-teal-200" },
  ];

  return (
    <section id="subjects" className="py-24 px-6 bg-[#FAFAF7] border-b border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-[#9A9A9A] uppercase tracking-widest">SUBJECTS</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-2 tracking-tight">
            Built for every syllabus.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B6B] mt-3">
            From first-year lectures to final-attempt competitive prep.
          </p>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-6 snap-x no-scrollbar">
          {items.map((it, i) => (
            <div
              key={i}
              className={`w-[280px] shrink-0 snap-start h-72 rounded-3xl border bg-gradient-to-b ${it.g} p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group`}
            >
              <div>
                <span className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-wider bg-white/70 px-3 py-1 rounded-full">
                  Topic #{i + 1}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-4 mb-2">{it.t}</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{it.d}</p>
              </div>
              <div className="text-xs font-semibold text-[#1A1A1A] group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                <span>Generate a quiz</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- 14. "MAKE IT UNMISTAKABLY YOURS" ---------------- */
const CustomizationSection = () => {
  const previews = [
    { title: "Quiz Formats", desc: "MCQ single choice, short answer typing, or mixed difficulty exams.", icon: "⚡" },
    { title: "Study Flip Styles", desc: "3D interactive flip, mobile swipe gestures, or spaced review queues.", icon: "🃏" },
    { title: "Accountability Digests", desc: "Daily streak notifications, 9PM alarms, and weekly performance cards.", icon: "📬" },
  ];

  return (
    <section className="py-24 px-6 bg-[#F0F4FF] border-b border-[#E8E8E3] relative overflow-hidden">
      <div className="absolute top-10 right-10 animate-craft-cloud opacity-40 pointer-events-none">
        <CloudSVG1 className="w-36 h-auto text-white" />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
          Make it unmistakably yours.
        </h2>
        <p className="text-base sm:text-lg text-[#6B6B6B] max-w-xl mx-auto mb-14">
          Tune the AI depth, quiz length, and review schedules to match how your brain retains.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {previews.map((p, i) => (
            <div key={i} className="bg-white rounded-3xl border border-[#E8E8E3] p-8 shadow-sm">
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">{p.title}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- 15. QUOTE 3 (Soft Green) ---------------- */
const QuoteSection3 = () => (
  <section className="py-24 px-6 bg-[#F0FFF4] border-b border-[#E8E8E3]">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex-1">
        <span className="text-3xl text-emerald-500 font-serif">“</span>
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl italic text-[#1A1A1A] leading-snug">
          Revisit-only flashcard loops are genius. I only re-study what I actually forget. Pure spaced repetition without the Anki setup pain.
        </blockquote>
      </div>
      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center font-serif text-lg shadow-sm">
          R
        </div>
        <div>
          <div className="font-bold text-sm text-[#1A1A1A]">Rohan M.</div>
          <div className="text-xs text-[#6B6B6B]">GATE 2027, IIT Bombay</div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- 16. STATS BAND ---------------- */
const StatsBand = () => (
  <section className="py-24 px-6 bg-white border-b border-[#E8E8E3]">
    <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
      {[
        { v: <CountUp end={12480} suffix="+" />, l: "Quizzes generated" },
        { v: <CountUp end={38000} suffix="+" />, l: "Flashcards flipped" },
        { v: <CountUp end={96} suffix="%" />, l: "Report better consistency" },
        { v: <CountUp end={4500} suffix="+" />, l: "Active students" },
      ].map((s, i) => (
        <div key={i}>
          <div className="font-serif text-4xl sm:text-5xl font-black text-[#1A1A1A] tracking-tight">
            {s.v}
          </div>
          <div className="text-[#6B6B6B] mt-2 text-xs font-semibold uppercase tracking-widest">
            {s.l}
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ---------------- 17. TESTIMONIALS (3x2 Grid) ---------------- */
const Testimonials = () => {
  const reviews = [
    { n: "Neerav S.", r: "CS Undergrad, Delhi", q: "I used to spend 2 hours making revision questions. Now it's 8 seconds. My end-sem score jumped from 6.8 to 8.4 subject average." },
    { n: "Ananya R.", r: "UPSC Aspirant, Pune", q: "The 9PM streak emails are ruthless and I love it. 47-day streak and counting. History optional has never felt this light." },
    { n: "Rohan M.", r: "GATE 2027, IIT Bombay", q: "Revisit-only flashcard loops are genius. I only re-study what I actually forget. Pure spaced repetition without the Anki setup pain." },
    { n: "Fatima K.", r: "MBBS 2nd Year, Hyderabad", q: "Anatomy vivas used to wreck me. Now I flip 30 cards every morning on the bus. The mobile swipe gestures are so smooth." },
    { n: "Arjun P.", r: "CAT Aspirant, Bangalore", q: "The weekly report card email shows me hours vs last week. Seeing the graph go up is weirdly addictive. Best accountability tool I've used." },
    { n: "Sneha D.", r: "Study Group Lead, Chennai", q: "Our 6-person group uploads to one account and shares quiz banks. Month 2 study rooms can't come soon enough!" },
  ];

  return (
    <section id="reviews" className="py-24 px-6 bg-[#FAFAF7] border-b border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#9A9A9A] uppercase tracking-widest">REVIEWS</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-2 tracking-tight">
            Students love Peer Club.
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-amber-400">
            {[0, 1, 2, 3, 4].map((i) => (
              <StarIcon key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="text-sm font-semibold text-[#6B6B6B] ml-2">4.8 / 5 average student rating</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rv, i) => (
            <div
              key={i}
              className="bg-white border border-[#E8E8E3] rounded-3xl p-7 flex flex-col justify-between shadow-[0_20px_60px_-20px_rgba(0,0,0,0.06)] hover:border-[#1A1A1A]/30 transition-colors"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <StarIcon key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-serif italic text-base text-[#1A1A1A] leading-relaxed">
                  "{rv.q}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 mt-6 pt-5 border-t border-[#E8E8E3]">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {rv.n.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1A1A1A]">{rv.n}</div>
                  <div className="text-xs text-[#9A9A9A] font-medium">{rv.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- 18. PRICING (White + Black Card) ---------------- */
const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 px-6 bg-white border-b border-[#E8E8E3]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#9A9A9A] uppercase tracking-widest">PRICING</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-2 tracking-tight">
            Your pace, your plan.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B6B] mt-3">
            Month 1 MVP is completely free. Pro features arrive with study rooms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Free Starter: White Card */}
          <div className="bg-[#FAFAF7] border border-[#E8E8E3] rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Starter</h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">STUDENT CORE</span>
              </div>
              <div className="my-6">
                <span className="font-serif text-5xl font-black text-[#1A1A1A]">₹0</span>
                <span className="text-sm font-medium text-[#6B6B6B] ml-2">/ forever</span>
              </div>
              <ul className="space-y-3.5 mb-10 text-sm text-[#4A4A4A]">
                {[
                  "Unlimited AI quizzes & flashcards",
                  "10 document revision slots",
                  "Streaks, badges & dashboard",
                  "All 15 email reminder automations",
                  "Email + Google OAuth sign-in",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => navigate("/register")}
              className="w-full py-4 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-semibold transition-all transform hover:-translate-y-0.5 shadow-sm"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Club: Black Card (Craft Style) */}
          <div className="relative bg-[#1A1A1A] text-white border border-[#2B2B2B] rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-black text-xs font-bold shadow-md">
              COMING MONTH 2
            </span>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-white">Pro Club</h3>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">EXPANDED</span>
              </div>
              <div className="my-6">
                <span className="font-serif text-5xl font-black text-white">₹149</span>
                <span className="text-sm font-medium text-neutral-400 ml-2">/ month</span>
              </div>
              <ul className="space-y-3.5 mb-10 text-sm text-neutral-300">
                {[
                  "Live study rooms & shared group timers",
                  "Peer leaderboard competition",
                  "Unlimited document slots",
                  "Priority AI generation queue",
                  "Advanced performance analytics & export",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => navigate("/register")}
              className="w-full py-4 rounded-full bg-white hover:bg-neutral-100 text-black font-bold transition-all transform hover:-translate-y-0.5 shadow-md"
            >
              Join Waitlist
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="#faq" className="text-xs font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] underline underline-offset-4">
            Learn more about student group discounts →
          </a>
        </div>
      </div>
    </section>
  );
};

/* ---------------- 19. HOW IT WORKS & FAQ ---------------- */
const HowItWorks = () => {
  const steps = [
    { n: "01", icon: <UploadIcon className="w-6 h-6" />, t: "Upload your notes", d: "Drag & drop any PDF or TXT — up to 10MB. We extract the text instantly." },
    { n: "02", icon: <BrainIcon className="w-6 h-6" />, t: "AI reads & generates", d: "Gemini 1.5 Flash builds quizzes & flashcards from your material in under 10 seconds." },
    { n: "03", icon: <CheckIcon className="w-6 h-6" />, t: "Practice & flip", d: "Take auto-graded quizzes with AI explanations, or flip 3D flashcards for active recall." },
    { n: "04", icon: <FireIcon className="w-6 h-6" />, t: "Track & level up", d: "Results hit your dashboard. Streaks grow, badges unlock, and emails keep you honest." },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#FAFAF7] border-b border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
            THE CORE LOOP
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-4 tracking-tight">
            Four steps to unstoppable consistency.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative bg-white border border-[#E8E8E3] rounded-3xl p-7 hover:border-black/30 transition-colors shadow-sm"
            >
              <div className="absolute top-5 right-6 font-serif text-4xl font-bold text-neutral-200">
                {s.n}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                {s.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">{s.t}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Is Peer Club really free?", a: "Yes — the entire Month 1 MVP (uploads, AI quizzes, flashcards, streaks, badges, emails) is free forever for students. Pro pricing only applies to Month 2 social features like study rooms." },
    { q: "What file types can I upload?", a: "PDF and TXT files up to 10MB each. We extract the text server-side with pdf-parse, store the file securely on Cloudinary, and you get up to 10 document slots." },
    { q: "How fast is the AI generation?", a: "Google Gemini 1.5 Flash typically returns a 10-question quiz in under 10 seconds. Flashcard sets of 30 cards usually complete in a similar window." },
    { q: "How does the streak system work?", a: "Any quiz attempt, flashcard session or logged study hour counts as activity for the day. At 9PM, if you haven't studied, our n8n automation emails you a warning. Miss the day and the streak resets — with a motivational restart email." },
    { q: "Can I use it on my phone?", a: "Absolutely. The whole app is mobile-responsive, and flashcard review supports swipe-right (Known) and swipe-left (Revisit) gestures on touch devices." },
    { q: "Is my data safe?", a: "Yes. Authentication runs on Supabase Auth with email verification and Google OAuth. Your documents are stored privately on Cloudinary and never shared." },
  ];

  return (
    <section id="faq" className="py-24 px-6 bg-white border-b border-[#E8E8E3]">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] text-center mb-14 tracking-tight">
          Questions, answered.
        </h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-[#FAFAF7] border border-[#E8E8E3] rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full flex items-center justify-between px-7 py-5 text-left"
              >
                <span className="font-serif text-lg font-bold text-[#1A1A1A] pr-4">{f.q}</span>
                <ChevronIcon className={`w-5 h-5 text-[#6B6B6B] shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
              </button>
              {openIdx === i && (
                <div className="px-7 pb-6 text-sm text-[#4A4A4A] leading-relaxed border-t border-[#E8E8E3]/60 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- 20. FINAL CTA BLOCK (Full-width Soft Green) ---------------- */
const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 md:px-8 bg-[#FAFAF7]">
      <div className="max-w-6xl mx-auto rounded-3xl bg-[#D4EDDA] border border-emerald-300 p-10 md:p-20 text-center relative overflow-hidden shadow-lg">
        {/* Floating Clouds in Corners */}
        <div className="absolute -top-6 -left-6 animate-craft-cloud opacity-80 pointer-events-none">
          <CloudSVG1 className="w-40 h-auto text-white" />
        </div>
        <div className="absolute -bottom-6 -right-6 animate-craft-cloud-slow opacity-80 pointer-events-none">
          <CloudSVG2 className="w-48 h-auto text-white" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/80 border border-emerald-400 flex items-center justify-center text-emerald-800 mx-auto mb-6 shadow-sm">
            <BrainIcon className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-4 tracking-tight leading-tight">
            Let's get started.
          </h2>
          <p className="text-base sm:text-lg text-[#2E4A35] mb-10 font-normal">
            Start for free. No credit card required. Upload your first document and take your first AI quiz in 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto px-10 py-4 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-full text-base transition-all transform hover:-translate-y-0.5 shadow-md"
            >
              Get Started Free →
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-neutral-50 text-[#1A1A1A] font-semibold rounded-full text-base border border-emerald-400/80 transition-all shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- 21. FOOTER (Dark #1A1A1A, 5 Columns) ---------------- */
const Footer = () => (
  <footer className="border-t border-[#2B2B2B] bg-[#1A1A1A] text-white pt-16 pb-12 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
      <div className="col-span-2">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <BrainIcon className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold text-white">Peer Club</span>
        </div>
        <p className="text-[#9A9A9A] text-sm leading-relaxed max-w-sm mb-6">
          AI-powered study accountability for college students and competitive exam aspirants.
          Upload revision notes. Generate adaptive exams. Keep the streak.
        </p>
      </div>

      {[
        { h: "Product", ls: ["Features", "AI Quizzes", "Flashcards", "Streaks & Badges", "Pricing"] },
        { h: "Community", ls: ["Student Discord", "Campus Leads", "Study Rooms", "Beta Testers"] },
        { h: "Company", ls: ["About Us", "Careers", "Privacy Policy", "Terms of Service", "Contact"] },
      ].map((col) => (
        <div key={col.h}>
          <h4 className="font-serif text-sm font-bold text-white mb-4 uppercase tracking-wider">{col.h}</h4>
          <ul className="space-y-2.5">
            {col.ls.map((l) => (
              <li key={l}>
                <a href="#" className="text-xs text-[#9A9A9A] hover:text-white transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="max-w-7xl mx-auto pt-8 border-t border-[#2B2B2B] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B6B6B]">
      <p>© 2026 Peer Club Inc. All rights reserved.</p>
      <p className="flex items-center gap-2">
        Built with <span className="text-emerald-400">Gemini 1.5 Flash</span> · Made for students, by students 🎓
      </p>
    </div>
  </footer>
);

/* ============================================================
   MAIN COMPONENT EXPORT
   ============================================================ */
export default function Landing() {
  // Auth guard: redirect logged-in users to /dashboard
  // const { session } = useAuth();
  // useEffect(() => { if (session) navigate("/dashboard", { replace: true }); }, [session]);

  // Pause animations when document is hidden to conserve power and respect user
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        document.body.classList.add("page-hidden");
      } else {
        document.body.classList.remove("page-hidden");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A] font-sans selection:bg-emerald-500/20 selection:text-emerald-900 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <CraftIntro />
        <StudentUseCases />
        <QuizFeatureSection />
        <TrustStrip />
        <QuoteSection1 />
        <FlashcardFeatureSection />
        <StreakFeatureSection />
        <StructureCards />
        <QuoteSection2 />
        <SubjectsMasonry />
        <CustomizationSection />
        <QuoteSection3 />
        <StatsBand />
        <Testimonials />
        <Pricing />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export { Landing as LandingPage };
