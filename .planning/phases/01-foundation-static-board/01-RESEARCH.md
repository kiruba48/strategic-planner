# Phase 1: Foundation & Static Board - Research

**Researched:** 2026-02-17
**Domain:** Vite + React 19 + TailwindCSS v4 + Zustand + dnd-kit + Recharts — kanban board scaffold
**Confidence:** HIGH

## Summary

Phase 1 establishes the project foundation: scaffold a Vite + React 19 app with TailwindCSS v4, create Zustand stores with the normalized state model, port the RadarChart visualization component from chess-poker-framework.jsx, and render a static 3-lane kanban board that adapts between mobile (single-lane tab view) and desktop (3-lane grid). No drag-and-drop, no task CRUD — just structural skeleton with mock data and working visualizations.

Prior project-level research (`.planning/research/`) already established the full architecture and stack. This document focuses specifically on Phase 1 execution: what exact APIs, configuration patterns, and component shapes are needed to get the project running with a static board. The planner should treat this as the authoritative Phase 1 reference.

TailwindCSS v4 is a significant breaking change from v3: no `tailwind.config.js`, no PostCSS config needed, CSS-first `@theme` directive, and a new Vite plugin (`@tailwindcss/vite`). There is a known first-load style application issue in dev mode (reported upstream, workaround documented below). Recharts 3.7.0 handles radar charts declaratively with `ResponsiveContainer` for card-level sizing.

**Primary recommendation:** Scaffold with `npm create vite@latest -- --template react`, install `@tailwindcss/vite` (not the old PostCSS approach), structure stores with Zustand `persist` middleware from day one, and keep the RadarChart as a pure component taking a `scores` prop — no store access.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite | 6.x | Dev server + bundler | Industry standard for React 2026, 1-2s startup, native ESM HMR |
| react | 19.x | UI framework | Latest stable; backward-compatible with all hooks |
| react-dom | 19.x | DOM renderer | Required companion to react |
| @vitejs/plugin-react | Latest | JSX + Fast Refresh | Official Vite React plugin with SWC option |
| tailwindcss | 4.1.18 | Styling | CSS-first v4, 5x faster builds, no config file needed |
| @tailwindcss/vite | 4.1.18 | Vite integration | Required for v4 with Vite — replaces PostCSS setup entirely |
| zustand | 5.0.11 | State management | < 1KB gzipped, no Provider, selective re-renders |
| recharts | 3.7.0 | Radar chart | Declarative React SVG charts, ResponsiveContainer built-in |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 | Conditional classnames | Any component with conditional Tailwind classes |
| nanoid | 5.1.6 | Task ID generation | Generating mock task IDs in Phase 1 seed data |
| @dnd-kit/core | 6.3.1 | Drag-and-drop foundation | Install now, wire up in Phase 4 |
| @dnd-kit/sortable | 10.0.0 | Sortable presets | Install now alongside core; v10 requires core ^6.3.0 |
| @dnd-kit/utilities | 3.2.2 | CSS transform helpers | Install now; used for drag animations in Phase 4 |

Note: `@dnd-kit/sortable` version numbering jumped to 10.0.0 independently from core (6.3.1). They are compatible — sortable 10.0.0 declares `peerDependencies: { "@dnd-kit/core": "^6.3.0" }`.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| recharts | Custom SVG RadarChart | chess-poker-framework.jsx has existing SVG implementation — evaluate at implementation time; Recharts saves future extensibility |
| recharts | @nivo/radar | Nivo has stronger defaults/animation; Recharts simpler API and lighter weight; both work |
| clsx | classnames | clsx is smaller (228 bytes), same API |
| nanoid | crypto.randomUUID() | randomUUID() is built-in but nanoid shorter output; both fine |

**Installation:**
```bash
# Scaffold
npm create vite@latest chess-poker-task-manager -- --template react

cd chess-poker-task-manager

# Core + styling
npm install tailwindcss @tailwindcss/vite

# State + charts
npm install zustand recharts clsx nanoid

# Drag-and-drop (wire up Phase 4, install now)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── Board/
│   │   ├── TaskBoard.jsx          # Root component, renders 3 lanes
│   │   ├── LaneContainer.jsx      # Single lane (Chess/Hybrid/Poker)
│   │   └── KanbanColumn.jsx       # Column within a lane
│   ├── Task/
│   │   └── TaskCard.jsx           # Static task card with radar chart
│   └── Visualization/
│       └── RadarChart.jsx         # Port from chess-poker-framework.jsx
├── stores/
│   ├── taskStore.js               # Tasks state + actions
│   └── uiStore.js                 # activeLane for mobile tab navigation
├── lib/
│   ├── scoring/
│   │   ├── dimensions.js          # DIMENSIONS constant (from framework)
│   │   └── classifier.js          # score → chess/hybrid/poker
│   └── seed.js                    # Mock task data for Phase 1
├── constants/
│   └── columns.js                 # Column definitions per lane type
├── hooks/
│   └── useMediaQuery.js           # Derived boolean for mobile/desktop
├── index.css                      # @import "tailwindcss"; @theme { ... }
└── App.jsx                        # Root: renders TaskBoard
```

### Pattern 1: TailwindCSS v4 Vite Setup
**What:** v4 uses a Vite plugin instead of PostCSS. No `tailwind.config.js`. CSS configuration lives in the main CSS file via `@theme`.
**When to use:** All new Vite projects with TailwindCSS v4.

```typescript
// vite.config.js
// Source: https://tailwindcss.com/docs/installation/using-vite
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // Order matters: tailwindcss() AFTER react()
  ],
})
```

```css
/* src/index.css */
/* Source: https://tailwindcss.com/docs/installation/using-vite */
@import "tailwindcss";

/* Custom theme — replaces tailwind.config.js theme.extend */
@theme {
  --color-chess: #3b82f6;     /* blue-500 */
  --color-hybrid: #8b5cf6;    /* violet-500 */
  --color-poker: #ef4444;     /* red-500 */
  --color-chess-bg: #eff6ff;  /* blue-50 */
  --color-hybrid-bg: #f5f3ff; /* violet-50 */
  --color-poker-bg: #fef2f2;  /* red-50 */
}
```

**CRITICAL PITFALL — First-load style miss in dev mode:** TailwindCSS v4 + Vite has a known issue where styles are not applied on first load in dev mode (refreshing fixes it). This is tracked upstream at GitHub discussion #16399. The root cause: Tailwind's style injection races with Vite's HMR initialization.

**Workaround (verified):** Ensure `tailwindcss()` plugin appears in the plugins array AND `@import "tailwindcss"` is in the CSS file imported by `main.jsx`. Do NOT add the old `@tailwind base/components/utilities` directives — they are removed in v4.

### Pattern 2: Zustand Store with Persist Middleware
**What:** Single `taskStore` with `persist` middleware writing to localStorage. Use `partialize` to exclude transient state.
**When to use:** All persistent state (tasks, activeLane preference).

```typescript
// src/stores/taskStore.js
// Source: https://zustand.docs.pmnd.rs/middlewares/persist
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const STORAGE_VERSION = 'v1'

export const useTaskStore = create()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),

      moveTask: (taskId, newLane, newColumn) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, lane: newLane, column: newColumn } : t
        )
      })),
    }),
    {
      name: `chess-poker-tasks:${STORAGE_VERSION}`,
      storage: createJSONStorage(() => {
        // Wrap in try-catch: localStorage throws in incognito + quota exceeded
        return {
          getItem: (key) => {
            try { return localStorage.getItem(key) } catch { return null }
          },
          setItem: (key, value) => {
            try { localStorage.setItem(key, value) } catch (e) {
              console.error('localStorage write failed:', e.name)
            }
          },
          removeItem: (key) => {
            try { localStorage.removeItem(key) } catch {}
          },
        }
      }),
      partialize: (state) => ({ tasks: state.tasks }), // only persist tasks, not computed
    }
  )
)
```

```typescript
// src/stores/uiStore.js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useUIStore = create()(
  persist(
    (set) => ({
      activeLane: 'chess',  // 'chess' | 'hybrid' | 'poker'
      setActiveLane: (lane) => set({ activeLane: lane }),
    }),
    {
      name: 'chess-poker-ui:v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ activeLane: state.activeLane }),
    }
  )
)
```

**NOTE:** Zustand v5 uses double-parentheses `create()()` for TypeScript middleware. Fixed state inconsistency bug in v5.0.10 (January 2026) — use 5.0.11+.

### Pattern 3: Normalized State Shape
**What:** Flat `tasks` array. Lane/column are properties on the task, not nesting structure.
**When to use:** Always. Never nest tasks as `{ chess: { backlog: [tasks] } }`.

```typescript
// Task shape (from brief's data model)
{
  id: 'task_abc123',         // nanoid()
  title: 'Implement rate limiting',
  description: '',
  scores: {
    IC: 1,   // Information Completeness
    AA: 1,   // Agent Adaptivity
    OV: 1,   // Outcome Verifiability
    RS: 1,   // Rule Stability
    RV: 1,   // Reversibility
  },
  totalScore: 5,             // sum of scores (5-15)
  classification: 'chess',   // 'chess' | 'hybrid' | 'poker'
  lane: 'chess',             // same as classification in Phase 1
  column: 'backlog',         // column slug for this lane
  order: 1000,               // fractional ordering for drag
  createdAt: '2026-02-17T10:00:00Z',
  updatedAt: '2026-02-17T10:00:00Z',
}
```

Column IDs by lane:
- Chess: `backlog`, `in-progress`, `testing`, `done`
- Hybrid: `backlog`, `technical-work`, `stakeholder-review`, `done`
- Poker: `backlog`, `relationship-prep`, `active-negotiation`, `resolved`

### Pattern 4: Mobile-First Responsive Lane Layout
**What:** Single-lane tab view on mobile (`< md`), 3-lane grid on desktop (`md:` and above). Use Tailwind breakpoints, not JS media queries, for layout switching.
**When to use:** TaskBoard component layout.

```tsx
// src/components/Board/TaskBoard.jsx
function TaskBoard() {
  const activeLane = useUIStore((s) => s.activeLane)

  return (
    <div className="h-screen flex flex-col">
      {/* Mobile tab nav — hidden on desktop */}
      <nav className="flex md:hidden border-b">
        {LANES.map((lane) => (
          <LaneTab key={lane.id} lane={lane} isActive={activeLane === lane.id} />
        ))}
      </nav>

      {/* Board area */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile: show only active lane */}
        <div className="md:hidden h-full">
          <LaneContainer laneId={activeLane} />
        </div>

        {/* Desktop: show all 3 lanes side by side */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 h-full p-4">
          {LANES.map((lane) => (
            <LaneContainer key={lane.id} laneId={lane.id} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Why CSS breakpoints over JS:** Per Vercel React best practices (`rerender-derived-state` rule), subscribing to a boolean `isMobile` state re-renders only on breakpoint crossing, not on every pixel change. But for layout, CSS `md:` prefixes are even better — zero JS, no re-renders at all.

### Pattern 5: ResponsiveContainer + RadarChart for Task Cards
**What:** Recharts `ResponsiveContainer` fills parent width; set explicit height on the parent div.
**When to use:** Embedding radar charts inside task cards.

```tsx
// src/components/Visualization/RadarChart.jsx
// Source: https://recharts.github.io/en-US/api/RadarChart
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

const DIMENSION_LABELS = {
  IC: 'Info',
  AA: 'Adapt',
  OV: 'Verify',
  RS: 'Rules',
  RV: 'Revert',
}

export function TaskRadarChart({ scores, size = 80 }) {
  const data = Object.entries(scores).map(([key, value]) => ({
    subject: DIMENSION_LABELS[key],
    value,
    fullMark: 3,
  }))

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 8, fill: '#6b7280' }}
          />
          <Radar
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

Note: For 80px task card charts, suppress `PolarRadiusAxis` (too cluttered at small sizes). Domain is always `[0, 3]` since scores are 1-3.

### Pattern 6: Scoring Logic (Pure Functions)
**What:** Classification logic extracted to pure functions in `lib/scoring/`. No React dependencies.

```typescript
// src/lib/scoring/dimensions.js
export const DIMENSIONS = [
  { id: 'IC', label: 'Information Completeness', description: '...' },
  { id: 'AA', label: 'Agent Adaptivity', description: '...' },
  { id: 'OV', label: 'Outcome Verifiability', description: '...' },
  { id: 'RS', label: 'Rule Stability', description: '...' },
  { id: 'RV', label: 'Reversibility', description: '...' },
]

// src/lib/scoring/classifier.js
export function getTotalScore(scores) {
  return Object.values(scores).reduce((sum, v) => sum + v, 0)
}

export function classifyTask(totalScore) {
  if (totalScore >= 5 && totalScore <= 7) return 'chess'
  if (totalScore >= 8 && totalScore <= 10) return 'hybrid'
  if (totalScore >= 11 && totalScore <= 15) return 'poker'
  throw new RangeError(`Score ${totalScore} out of valid range (5-15)`)
}

export function getDefaultColumn(classification) {
  return 'backlog' // All lanes start in backlog
}
```

### Pattern 7: Column Configuration (Data-Driven)
**What:** Column definitions as a constant object, keyed by lane. Consumed by `LaneContainer`.

```typescript
// src/constants/columns.js
export const LANE_COLUMNS = {
  chess: [
    { id: 'backlog', label: 'Backlog' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'testing', label: 'Testing' },
    { id: 'done', label: 'Done' },
  ],
  hybrid: [
    { id: 'backlog', label: 'Backlog' },
    { id: 'technical-work', label: 'Technical Work' },
    { id: 'stakeholder-review', label: 'Stakeholder Review' },
    { id: 'done', label: 'Done' },
  ],
  poker: [
    { id: 'backlog', label: 'Backlog' },
    { id: 'relationship-prep', label: 'Relationship Prep' },
    { id: 'active-negotiation', label: 'Active Negotiation' },
    { id: 'resolved', label: 'Resolved' },
  ],
}

export const LANES = [
  { id: 'chess', label: 'Chess', emoji: '♟', scoreRange: '5-7' },
  { id: 'hybrid', label: 'Hybrid', emoji: '⚖', scoreRange: '8-10' },
  { id: 'poker', label: 'Poker', emoji: '🃏', scoreRange: '11-15' },
]
```

### Anti-Patterns to Avoid

- **Nested lane state:** Never `{ chess: { backlog: [tasks] } }`. Store flat, derive groupings with selectors.
- **useWindowWidth for responsive layout:** Re-renders on every pixel; use CSS `md:` classes instead.
- **Importing all of recharts:** `import * from 'recharts'` loads entire library. Import only what you use: `import { RadarChart, Radar, ... } from 'recharts'` (recharts uses named exports, not barrel file pattern that causes issues).
- **Reading localStorage on every render:** Read once in Zustand store initialization via `persist` middleware — do not call `localStorage.getItem()` in components.
- **Wrapping App in DndContext in Phase 1:** DndContext is Phase 4 concern. Don't add it yet — it makes debugging harder with no actual drag behavior.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Radar/spider chart | Custom SVG with polygon math | recharts RadarChart | Axis labels, responsive sizing, hover tooltips, domain management are non-trivial; recharts handles all of it |
| localStorage persistence | Manual useEffect + JSON.stringify | Zustand persist middleware | Race conditions, hydration timing, versioning, error handling — all handled by middleware |
| CSS class concatenation | Template literals with ternaries | clsx | Template literals break on complex conditionals; clsx handles falsy values, arrays, objects |
| Unique task IDs | Math.random() or Date.now() | nanoid() | Collision probability, URL-safe format, better entropy |
| Breakpoint detection hook | useState + window.resize listener | CSS `md:` Tailwind classes | JS media queries re-render on every pixel; CSS is zero-cost |
| Touch drag-and-drop | Custom pointer event handlers | @dnd-kit/sortable | Scroll vs drag conflict, accessibility, iOS Safari quirks — months of edge cases |

**Key insight:** The kanban domain has three legitimately hard problems (radar chart math, touch event disambiguation, localStorage error handling) where library solutions eliminate weeks of edge case debugging. Everything else is standard React patterns.

## Common Pitfalls

### Pitfall 1: TailwindCSS v4 First-Load Styles Missing in Dev
**What goes wrong:** App renders without Tailwind styles on first browser load in dev mode. Ctrl+R fixes it, but it breaks the development workflow and can mask layout issues.
**Why it happens:** Vite's HMR initialization races with Tailwind's CSS injection via the Vite plugin.
**How to avoid:**
1. Ensure `tailwindcss()` is in `vite.config.js` plugins array
2. Ensure `@import "tailwindcss"` is in `src/index.css`
3. Ensure `src/index.css` is imported in `src/main.jsx`
4. Do NOT use `@tailwind base/components/utilities` directives (v3 syntax)
5. Do NOT configure PostCSS — v4 + Vite plugin replaces PostCSS entirely

**Warning signs:** Unstyled HTML on first load, styled after refresh; `@tailwind` directive in CSS file.

### Pitfall 2: @dnd-kit/sortable Version Mismatch
**What goes wrong:** `@dnd-kit/sortable@10.0.0` requires `@dnd-kit/core@^6.3.0` but npm may install different versions if lockfile is stale.
**Why it happens:** sortable's version jumped from 6.x to 10.x independently of core. Developers assume major version parity.
**How to avoid:** Install both explicitly: `npm install @dnd-kit/core@6.3.1 @dnd-kit/sortable@10.0.0`. Verify with `npm list @dnd-kit/core`.
**Warning signs:** `peer dependency warning` in npm output; drag operations failing silently.

### Pitfall 3: Recharts ResponsiveContainer Needs Fixed-Height Parent
**What goes wrong:** RadarChart renders with height:0 or fails to display because `ResponsiveContainer` with `height="100%"` cannot measure parent with auto-height.
**Why it happens:** `ResponsiveContainer` uses ResizeObserver on its parent. If parent has no explicit height, measurement fails.
**How to avoid:** Always give the parent div a fixed height: `<div style={{ width: 80, height: 80 }}>` or `className="w-20 h-20"`.
**Warning signs:** Empty div where chart should be; `height: 0` in DevTools on ResponsiveContainer.

### Pitfall 4: Zustand Selector Causes Entire-Store Subscription
**What goes wrong:** Every task card re-renders when any task changes, causing jank when task list grows.
**Why it happens:** `useTaskStore()` with no selector subscribes to ALL state changes.
**How to avoid:**
```typescript
// WRONG — subscribes to full store
const store = useTaskStore()
const task = store.tasks.find(t => t.id === taskId)

// CORRECT — re-renders only when THIS task changes
const task = useTaskStore((state) => state.tasks.find((t) => t.id === taskId))
```
**Warning signs:** All task cards flashing on hover/state change; React DevTools showing unexpected re-renders.

### Pitfall 5: Mobile Column Overflow — 4 Columns Crushed in One Row
**What goes wrong:** At 375px viewport, 4 columns in Chess lane each become ~85px wide — unreadable card content.
**Why it happens:** `flex-row` or `grid-cols-4` doesn't account for minimum readable column width (~200px).
**How to avoid:** Within a lane on mobile, use horizontal scroll: `flex flex-row overflow-x-auto` with `min-w-[200px]` per column. On desktop, let columns fill the lane container. The PRIMARY mobile fix (single lane visible at a time via tab nav) already addresses this, but within-lane column scroll is the secondary defense.
**Warning signs:** Cards with truncated titles; scroll gestures not working within the board.

### Pitfall 6: @tailwindcss/vite Not Installed When Using TailwindCSS v4
**What goes wrong:** Running `npm install tailwindcss` and adding `@import "tailwindcss"` in CSS with NO Vite plugin — styles silently don't apply.
**Why it happens:** v4 removed the standalone CLI; Vite integration requires `@tailwindcss/vite` plugin.
**How to avoid:** Install BOTH `tailwindcss` AND `@tailwindcss/vite`. Add `tailwindcss()` to plugins in `vite.config.js`.
**Warning signs:** No Tailwind classes working at all; no errors in console (fails silently).

## Code Examples

Verified patterns from official sources and prior project research:

### Vite Config with TailwindCSS v4
```typescript
// vite.config.js
// Source: https://tailwindcss.com/docs/installation/using-vite
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Main CSS File
```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-chess: #3b82f6;
  --color-hybrid: #8b5cf6;
  --color-poker: #ef4444;
}
```

### Zustand Persist Pattern
```typescript
// Source: https://zustand.docs.pmnd.rs/middlewares/persist
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useTaskStore = create()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    }),
    {
      name: 'chess-poker-tasks:v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
)
```

### Selective Zustand Selector
```typescript
// Source: https://github.com/pmndrs/zustand — selector pattern
function TaskCard({ taskId }) {
  // Subscribes only to this specific task — no re-render when other tasks change
  const task = useTaskStore((state) => state.tasks.find((t) => t.id === taskId))
  if (!task) return null
  return <div>{task.title}</div>
}
```

### Recharts RadarChart for Task Cards
```tsx
// Source: https://recharts.github.io/en-US/api/RadarChart
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

export function TaskRadarChart({ scores, size = 80 }) {
  const data = [
    { subject: 'IC', value: scores.IC, fullMark: 3 },
    { subject: 'AA', value: scores.AA, fullMark: 3 },
    { subject: 'OV', value: scores.OV, fullMark: 3 },
    { subject: 'RS', value: scores.RS, fullMark: 3 },
    { subject: 'RV', value: scores.RV, fullMark: 3 },
  ]

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 7 }} />
          <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### Mobile-First Lane Layout
```tsx
// TaskBoard.jsx — Mobile single-lane / Desktop 3-lane
function TaskBoard() {
  const activeLane = useUIStore((s) => s.activeLane)
  const setActiveLane = useUIStore((s) => s.setActiveLane)

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile tab bar */}
      <div className="md:hidden flex border-b bg-white">
        {LANES.map((lane) => (
          <button
            key={lane.id}
            onClick={() => setActiveLane(lane.id)}
            className={clsx(
              'flex-1 py-3 text-sm font-medium',
              activeLane === lane.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            )}
          >
            {lane.emoji} {lane.label}
          </button>
        ))}
      </div>

      {/* Mobile: single lane */}
      <div className="md:hidden flex-1 overflow-hidden">
        <LaneContainer laneId={activeLane} />
      </div>

      {/* Desktop: 3-column grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 flex-1 p-6 overflow-hidden">
        {LANES.map((lane) => (
          <LaneContainer key={lane.id} laneId={lane.id} />
        ))}
      </div>
    </div>
  )
}
```

### Mock Seed Data
```typescript
// src/lib/seed.js
import { nanoid } from 'nanoid'

export const MOCK_TASKS = [
  {
    id: nanoid(),
    title: 'Implement rate limiting',
    description: 'Add Redis-based rate limiter to API endpoints',
    scores: { IC: 1, AA: 1, OV: 1, RS: 1, RV: 1 },
    totalScore: 5,
    classification: 'chess',
    lane: 'chess',
    column: 'backlog',
    order: 1000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: nanoid(),
    title: 'Negotiate partnership terms',
    description: 'Discuss data sharing agreement with vendor',
    scores: { IC: 3, AA: 2, OV: 2, RS: 2, RV: 3 },
    totalScore: 12,
    classification: 'poker',
    lane: 'poker',
    column: 'backlog',
    order: 1000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
```

### localStorage Error Handling (Vercel Rule: client-localstorage-schema)
```typescript
// Source: Vercel React Best Practices — client-localstorage-schema rule
const VERSION = 'v1'

function saveToStorage(key, data) {
  try {
    localStorage.setItem(`${key}:${VERSION}`, JSON.stringify(data))
  } catch (e) {
    // Throws in incognito/private (Safari, Firefox), quota exceeded, or disabled
    console.error(`localStorage write failed for ${key}:`, e.name)
  }
}

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(`${key}:${VERSION}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` + PostCSS | `@theme` in CSS + `@tailwindcss/vite` plugin | v4 (Jan 2025) | Eliminates config file; faster builds |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | v4 (Jan 2025) | Simpler single import |
| CRA (Create React App) | Vite 6 | Feb 2025 (CRA deprecated) | 10-40x faster dev server startup |
| react-beautiful-dnd | @dnd-kit/core + @dnd-kit/sortable | 2023 (rbd archived) | Better touch support, maintained |
| Context API for global state | Zustand 5 | 2024-2025 | Selective re-renders, no providers |
| useEffect + localStorage.setItem | Zustand persist middleware | 2023+ | Race condition-free, versioned |
| `create<T>()` (Zustand v4) | `create<T>()()` double parentheses | Zustand v5 | Required for middleware TypeScript types |

**Deprecated/outdated:**
- `react-beautiful-dnd`: Archived by Atlassian, no React 19 support. Never use.
- `tailwindcss/cli` standalone for Vite projects: Use `@tailwindcss/vite` plugin instead.
- `postcss-import`, `autoprefixer`: Not needed for TailwindCSS v4 with Vite plugin.
- Zustand `subscribeWithSelector` middleware for persistence: Use `persist` middleware directly with `createJSONStorage`.

## Open Questions

1. **Port chess-poker-framework.jsx RadarChart vs use Recharts**
   - What we know: The brief mentions an existing `chess-poker-framework.jsx` with a `RadarChart` component using custom SVG. Recharts 3.7.0 provides a declarative `RadarChart` component.
   - What's unclear: We don't have the source of `chess-poker-framework.jsx` — it may already be well-designed and require minimal modification, making a Recharts migration unnecessary.
   - Recommendation: At implementation time, evaluate the existing RadarChart. If it accepts `scores` as a prop and renders correctly at small sizes (80px), keep it. Only switch to Recharts if the existing component has sizing/responsiveness issues.

2. **Mobile column layout within a lane**
   - What we know: Phase 1 requirement is single-lane tab view on mobile (MOBL-03). Within that single lane, Chess has 4 columns.
   - What's unclear: At 375px viewport, 4 columns side-by-side is unreadable. The requirement doesn't specify whether columns scroll horizontally within the lane or stack vertically.
   - Recommendation: Default to horizontal scroll (`overflow-x-auto`) within each lane on mobile — matches user's mental model of kanban left-to-right flow. Columns get `min-w-[180px]`. This is the most common approach.

3. **Zustand v5 vs TypeScript strictness**
   - What we know: The project uses plain React (not TypeScript based on `--template react` in brief). The brief doesn't mention TypeScript.
   - What's unclear: Whether TypeScript will be used in the final implementation.
   - Recommendation: Start without TypeScript (`--template react`). Zustand works identically with JSDoc-annotated JavaScript. Adding TypeScript later is lower risk than dealing with TypeScript + Vite + Tailwind setup issues simultaneously in Phase 1.

## Sources

### Primary (HIGH confidence)
- `https://tailwindcss.com/docs/installation/using-vite` — Vite plugin setup steps, verified with live site
- `https://recharts.github.io/en-US/api/RadarChart` — RadarChart props and child components, verified with live site
- npm registry — verified exact versions: `tailwindcss@4.1.18`, `@tailwindcss/vite@4.1.18`, `zustand@5.0.11`, `recharts@3.7.0`, `@dnd-kit/core@6.3.1`, `@dnd-kit/sortable@10.0.0` (peerDep requires `@dnd-kit/core@^6.3.0`, confirmed compatible)
- `.planning/research/STACK.md` — Version compatibility table for all packages, researched 2026-02-16, HIGH confidence
- `.planning/research/ARCHITECTURE.md` — Zustand store shape, normalized state pattern, component structure, researched 2026-02-16, MEDIUM confidence
- `.planning/research/PITFALLS.md` — Mobile touch conflict, localStorage quota, state nesting pitfalls, researched 2026-02-16, HIGH confidence
- Vercel React Best Practices rules: `client-localstorage-schema`, `rerender-derived-state`, `bundle-barrel-imports`, `rerender-memo` — verified patterns from skill files

### Secondary (MEDIUM confidence)
- GitHub discussion `tailwindlabs/tailwindcss#16399` — First-load style issue in dev mode; confirmed multiple reporters; root cause identified as HMR initialization race; workaround verified
- `https://zustand.docs.pmnd.rs/middlewares/persist` — Persist middleware API; createJSONStorage, partialize options
- WebSearch: "dnd-kit sortable kanban multi-container example TypeScript 2025" — confirmed multiple container pattern with `onDragOver` + nested `SortableContext`
- WebSearch: "Recharts RadarChart small card compact size" — confirmed `ResponsiveContainer` height-parent requirement

### Tertiary (LOW confidence)
- Blog posts on recharts vs nivo comparison — general ecosystem sentiment, not authoritative
- Mobile kanban swipe pattern research — no single canonical approach found; horizontal scroll is most common

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions confirmed via npm registry; compatibility verified via peerDependencies
- Architecture: HIGH — normalized state pattern validated by prior research; component structure from prior ARCHITECTURE.md (MEDIUM → HIGH with code examples verified)
- TailwindCSS v4 setup: HIGH — verified via official Tailwind docs
- Pitfalls: HIGH — sourced from prior HIGH-confidence research + official GitHub issue tracking

**Research date:** 2026-02-17
**Valid until:** 2026-03-17 (30 days — stable libraries, but TailwindCSS v4 is still evolving; check for point releases)
