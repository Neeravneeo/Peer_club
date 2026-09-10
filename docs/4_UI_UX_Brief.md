# UI/UX Design Brief
# Peer Club

## 1. Design Philosophy

Peer Club should feel like a focused, modern productivity app - not a generic edtech platform.
Inspired by Linear, Notion, and Discord. Calm but motivating, dark-themed for long study sessions,
with purposeful pops of color for gamification elements.

Core Design Principles:
1. Focus First - Never distract. UI fades away when users are in study mode.
2. Gamified But Not Childish - Leaderboards, streaks, and badges feel rewarding, not toy-like.
3. Clarity at a Glance - Progress data and room status understood in under 2 seconds.
4. Consistent and Predictable - Repeated patterns across all screens build user confidence.

## 2. Color Palette

### Primary Colors
| Name | Hex | Usage |
|---|---|---|
| Violet (Brand Primary) | #7C3AED | CTAs, active states, brand elements |
| Violet Light | #8B5CF6 | Hover states, gradients |
| Violet Pale | #EDE9FE | Light badges, soft backgrounds |

### Neutral (Dark Theme - Default)
| Name | Hex | Usage |
|---|---|---|
| Background | #0F0F13 | App base background |
| Surface | #1A1A24 | Cards, modals, sidebars |
| Surface Elevated | #22223A | Hover card backgrounds, selected states |
| Border | #2D2D45 | Card borders, dividers |
| Text Primary | #F0F0FF | Headlines, primary text |
| Text Secondary | #9494B8 | Subtitles, labels, timestamps |
| Text Muted | #5C5C80 | Placeholders, disabled states |

### Accent / Status Colors
| Name | Hex | Usage |
|---|---|---|
| Green (Success / Online) | #22C55E | Online status, success toasts, Known button |
| Amber (Warning / Streak) | #F59E0B | Streak fire icon, warning states |
| Red (Danger) | #EF4444 | Errors, delete actions, kick member |
| Blue (Info) | #3B82F6 | Info toasts, info badges |
| Orange (Revisit) | #F97316 | Flashcard Revisit button |

### Gamification Colors
| Name | Hex | Usage |
|---|---|---|
| Gold (1st place) | #F59E0B | Leaderboard #1 badge |
| Silver (2nd) | #9CA3AF | Leaderboard #2 badge |
| Bronze (3rd) | #CD7F32 | Leaderboard #3 badge |

## 3. Typography

| Use | Font | Weight | Size |
|---|---|---|---|
| App Font | Inter (Google Fonts) | - | - |
| H1 - Page Title | Inter | 700 Bold | 32px / 2rem |
| H2 - Section Title | Inter | 600 SemiBold | 24px / 1.5rem |
| H3 - Card Title | Inter | 600 SemiBold | 18px / 1.125rem |
| Body - Default | Inter | 400 Regular | 16px / 1rem |
| Body - Small | Inter | 400 Regular | 14px / 0.875rem |
| Label / Caption | Inter | 500 Medium | 12px / 0.75rem |
| Timer Display | Inter | 800 ExtraBold | 64px / 4rem |
| Code Blocks | JetBrains Mono | 400 Regular | 14px |

Typography Rules:
- Line height: 1.5 for body text, 1.2 for headings
- Letter spacing: -0.02em for headings, 0 for body
- Max line width: 65ch for reading-heavy content (notes, quiz)

## 4. Iconography

- Library: Lucide React
- Size: 16px inline, 20px buttons, 24px navigation, 32px feature icons
- Style: Outline icons only (filled for active/selected states)
- Color: Inherit text color unless semantic

Key Icon Mapping:
| Action | Icon |
|---|---|
| Study Room | Users |
| Timer / Pomodoro | Timer |
| Upload Document | Upload |
| AI Quiz | Brain |
| Flashcards | BookOpen |
| Notes | FileText |
| Leaderboard | Trophy |
| Streak | Flame (Amber) |
| Dashboard | LayoutDashboard |
| Notifications | Bell |
| Settings | Settings |
| Online status | Circle (filled green) |

## 5. Component Style Guide

### Buttons
Primary: bg #7C3AED | hover #8B5CF6 | text white | rounded-lg | px-4 py-2
  Active: scale(0.97) | Disabled: opacity-50 cursor-not-allowed

Secondary (Outline): border #2D2D45 | bg transparent | hover-bg #22223A | text #F0F0FF

Danger: bg #EF4444 | hover #DC2626 | text white

Ghost: bg transparent | hover-bg #22223A | text #9494B8

Sizes: sm (px-3 py-1.5 text-sm), md (px-4 py-2), lg (px-6 py-3 text-lg)

### Cards
Base Card: bg #1A1A24 | border 1px solid #2D2D45 | border-radius 12px | padding 20px
Hover: border-color #7C3AED (20% opacity) | soft shadow

Stat Card: Same as base + top colored accent line (3px, brand color)
           Icon top-right (muted color)

### Inputs and Forms
Input: bg #0F0F13 | border 1px solid #2D2D45 | rounded-lg | padding 10px 14px
       text #F0F0FF | placeholder #5C5C80
Focus: border-color #7C3AED | ring 2px #7C3AED40
Error: border-color #EF4444

Label: text-sm font-medium text-secondary | 6px gap above input
Error message: text-sm text-red-400 below input

### Badges and Tags
Subject Tag: bg #7C3AED20 | text #8B5CF6 | rounded-full | px-3 py-1 | text-xs font-medium
Online Status: bg #22C55E | w-2 h-2 | rounded-full (dot only)
Difficulty Easy: bg #22C55E20, text #22C55E
Difficulty Medium: bg #F59E0B20, text #F59E0B
Difficulty Hard: bg #EF444420, text #EF4444

### Modals / Dialogs
Overlay: bg-black/60 backdrop-blur-sm
Modal: bg #1A1A24 | border 1px solid #2D2D45 | border-radius 16px | padding 24px | max-width 520px
Animation: fade-in + slide-up (Framer Motion, 200ms)
Header: H3 title + X close button (top-right)
Footer: action buttons right-aligned

### Toast Notifications
Position: top-right, 16px from edge | rounded-xl | min-width 300px
Success: border-left 4px #22C55E | bg #1A1A24
Error: border-left 4px #EF4444 | bg #1A1A24
Info: border-left 4px #3B82F6 | bg #1A1A24
Auto-dismiss: 4 seconds | Animation: slide-in from right

## 6. Layout and Spacing

### Grid System
- Mobile: single column
- Tablet (768px+): 2 columns
- Desktop (1024px+): sidebar + main content

### Spacing Scale (Tailwind-based)
- 4px = xs (icon-to-text)
- 8px = sm (within components)
- 16px = md (between related elements)
- 24px = lg (between sections)
- 32px = xl (page padding)
- 48px = 2xl (between major sections)

### Desktop Page Layout
Top Nav: 64px height, fixed, bg #0F0F13, border-bottom 1px solid #2D2D45
Left Sidebar: 240px fixed, bg #0F0F13, border-right 1px solid #2D2D45
Main Content: max-width 1200px, centered, padding 32px

### Mobile Layout
Sidebar -> bottom tab bar (5 tabs)
Top nav: logo + notifications + avatar only
Content: full width, 16px horizontal padding

## 7. Navigation

Desktop Left Sidebar:
- Items: Dashboard, My Rooms, Leaderboard, Profile
- Active item: bg #7C3AED20, left border 3px violet, text violet
- Bottom: user name + email

Mobile Bottom Tab Bar:
- Height: 60px, bg #1A1A24, top border
- Tabs: Home, Rooms, Leaderboard, Notifications, Profile
- Active icon: filled + violet

## 8. Key Screen Designs

### Dashboard
4 stat cards (2x2 on mobile) | Activity chart (full width) | Rooms grid | Recent scores
Streak: amber flame icon, large number, "day streak" label

### Room Home (Two-panel)
Left: members sidebar (260px)
Right: Pomodoro timer (centered) + tab bar (Documents/Quiz/Flashcards/Notes)

### Pomodoro Timer
SVG circle ring: stroke #7C3AED, animated stroke-dashoffset
Background ring: #2D2D45
Center: MM:SS Inter ExtraBold 64px (monospace)
Below: "Session 2 of 4" muted | Work/Break phase pill badge
Buttons: Start (green) | Pause (amber) | Reset (ghost)
Active: pulsing violet glow on ring

### Flashcard Component
Size: 480px x 280px desktop, full-width mobile
bg #1A1A24 | border 1px solid #2D2D45 | border-radius 16px
3D flip: rotateY 180deg, 0.4s ease
Front: violet icon top + term in H2
Back: explanation in body text + subtle gradient background
Buttons: Known (green, left) | Revisit (orange, right)

### Leaderboard
Podium: top 3 with gold/silver/bronze circles
Table: rows 4+ with rank, avatar, name, metrics
Own row: highlighted with subtle violet background

## 9. Micro-Interactions and Animations

| Element | Animation |
|---|---|
| Button click | scale(0.97) for 100ms |
| Card hover | Border glow (violet 0.2 opacity), 150ms ease |
| Modal open | Fade-in overlay + slide-up modal (200ms) |
| Toast appear | Slide-in from right (300ms spring) |
| Flashcard flip | 3D rotateY 180deg (400ms ease-in-out) |
| Streak counter | Number count-up on load |
| Progress bar | Width transition on load (600ms ease) |
| Timer pulse | Subtle scale pulse every second when running |
| Tab switch | Underline slides to new tab (200ms) |
| Page transitions | Fade-in (150ms) on route change |

## 10. Gamification Visual Design

### Badges
Shape: Hexagonal icon with gradient background
Earned: Full color with glow | Unearned: Greyscale 40% opacity

Badge Examples:
- On Fire: 7-day streak (amber gradient)
- Quiz Master: 10 quizzes (violet gradient)
- Time Lord: 10 hours logged (blue gradient)
- Top Student: Leaderboard #1 (gold gradient)

### Streak Display
Large flame emoji + number + "day streak" text
Amber/orange gradient glow
Scale bounce animation when streak increases

### Leaderboard Podium (Top 3)
Gold crown for #1 | Silver for #2 | Bronze for #3
Slightly larger avatar for #1

## 11. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Mobile < 768px | Single column, bottom nav, stacked cards, full-width modals |
| Tablet 768-1023px | 2-column grids, top nav only, hamburger menu |
| Desktop >= 1024px | Left sidebar + main, 3-4 column grids |
| Wide >= 1440px | Content centered at max-width 1200px |

Key Mobile Adaptations:
- Room page: members sidebar becomes a bottom sheet
- Timer: takes full center focus
- Flashcard: swipe right = Known, swipe left = Revisit
- Leaderboard: horizontal scroll for wide tables

## 12. Accessibility

- Minimum contrast ratio: 4.5:1 for all text (WCAG AA)
- Focus rings: visible on all interactive elements (violet ring, 2px)
- Keyboard navigation: all modals and dropdowns fully navigable
- Screen reader: all images have alt text, icons have aria-labels
- Reduced motion: respect prefers-reduced-motion - disable non-essential animations
- Font size: minimum 14px for all readable text
