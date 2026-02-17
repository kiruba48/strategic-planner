# Phase 1: Foundation & Static Board - Context

**Gathered:** 2026-02-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Project setup with Vite + React 19 + TailwindCSS v4 + Zustand. Mobile-responsive 3-lane kanban board (Chess/Hybrid/Poker) displaying mock tasks with radar charts showing 5-dimension score profiles. No task creation, editing, or persistence — static mock data only.

</domain>

<decisions>
## Implementation Decisions

### Board layout
- Single lane visible at a time — user selects which lane to view (not all 3 simultaneously)
- Desktop: collapsible sidebar on the left for lane selection (Chess/Hybrid/Poker), board fills remaining space
- Sidebar collapses to icons only to maximize board space
- Each lane has 4 columns: Backlog → In Progress → Review → Done

### Task card design
- Cards show by default: title + classification emoji badge, mini dimension bars (5 scores at a glance), description preview (first 1-2 lines)
- Radar chart appears on hover/tap — compact by default, expands to show full 5-dimension radar
- Emoji badges: ♟️ Chess / 🎲 Hybrid / 🃁 Poker
- Comfortable spacing between cards — breathing room, not packed tight

### Mobile navigation
- Bottom tab bar for lane switching (Chess | Hybrid | Poker) — replaces desktop sidebar entirely
- Swipe gestures also supported for lane switching (complementary to tabs)
- Columns within a lane scroll horizontally (swipe left/right through Backlog → In Progress → Review → Done)
- Both sticky column header AND dot indicators for position awareness within columns

### Visual identity
- Dark theme with vibrant accent pops — dark base with colorful lane differentiation
- Subtle tints per lane — same base palette with slight color variations per lane, not fully distinct colors
- Dark mode only for v1 — no light mode toggle
- Linear-inspired aesthetic — clean, fast, professional dark UI

### Claude's Discretion
- Exact color palette and accent tint values per lane
- Typography choices and font sizing
- Sidebar icon design when collapsed
- Radar chart library/implementation approach
- Card shadow and border radius values
- Column header styling
- Dot indicator design for mobile columns

</decisions>

<specifics>
## Specific Ideas

- Linear's dark UI as the primary visual reference — clean, not cluttered, professional feel
- Bottom tabs + swipe is the mobile interaction pattern (like many modern mobile apps)
- Radar chart should feel like a "reveal" on hover, not clutter the default card view

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-static-board*
*Context gathered: 2026-02-17*
