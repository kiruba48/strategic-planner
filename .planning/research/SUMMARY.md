# Project Research Summary

**Project:** Chess-Poker Task Manager (Strategic Planner)
**Domain:** Personal Task Management / Classification-Based Kanban
**Researched:** 2026-02-16
**Confidence:** HIGH

## Executive Summary

This is a mobile-first personal task management web app built around a novel 5-dimension classification system (Information Completeness, Agent Adaptivity, Outcome Verifiability, Rule Stability, Reversibility). Tasks are scored 1-3 on each dimension and automatically routed to domain-specific kanban workflows: Chess lane (5-7 total score, structured execution), Hybrid lane (8-10 score, mixed approach), or Poker lane (11-15 score, adaptive negotiation). The core differentiator is transforming vague "priority" into structured decision frameworks with visual radar charts showing dimension breakdowns.

The recommended approach uses modern React 19 with Vite, Zustand for state management, dnd-kit for touch-optimized drag-and-drop, and TailwindCSS v4 for styling. localStorage provides offline-first persistence. This stack prioritizes mobile-first design (using touch sensors with long-press activation), selective re-renders (normalized state + Zustand selectors), and rapid development velocity (Vite's 1-2 second startup vs CRA's deprecated slow builds). The existing chess-poker-framework.jsx provides foundational scoring logic and radar chart visualization components ready to port.

Key risks center on mobile UX friction: touch-drag vs scroll conflicts (mitigated via dnd-kit's activation constraints), classification form abandonment (solved with progressive disclosure and smart defaults), and localStorage quota limits (handled with error boundaries and LRU cleanup). Critical architectural decision: normalized state structure from Phase 1 prevents state management complexity explosion. Early investment in mobile-responsive design and accessibility (keyboard navigation) avoids expensive retrofitting later.

## Key Findings

### Recommended Stack

Modern React 19 ecosystem optimized for mobile-first, offline-first single-user applications. Core decision: Vite replaced Create React App (officially deprecated Feb 2025) with 40-80% faster local feedback loops. TailwindCSS v4 brings 5x faster builds and CSS-first configuration using @theme directive.

**Core technologies:**
- **React 19.2.4** (UI framework) — Latest stable with Actions, improved ref handling, and concurrent rendering for optimistic UI updates
- **Vite 6.x** (build tool) — Industry standard for new React projects in 2026, starts dev server in 1-2 seconds vs CRA's slow startup
- **TailwindCSS 4.1.18** (styling) — v4 delivers 5x faster full builds, 100x faster incremental builds, mobile-first breakpoint system out-of-the-box
- **@dnd-kit/core 6.3.1** (drag-and-drop) — Modern, lightweight (10kb), actively maintained with superior mobile touch support; replaces archived react-beautiful-dnd
- **Zustand 5.x** (state management) — Lightweight (<1KB gzipped), no providers, superior performance vs Context API; components only re-render when their specific state slice changes
- **use-local-storage-state** (persistence) — Handles React 18/19 concurrent rendering, syncs changes across tabs via Window storage event

**Critical technical choice:** react-beautiful-dnd is archived/unmaintained. @dnd-kit is the community-recommended replacement with built-in support for pointer, mouse, touch, and keyboard sensors. Mobile touch sensor requires `activationConstraint: { delay: 250, tolerance: 5 }` to prevent accidental drags during scroll.

### Expected Features

Classification-based kanban boards require table stakes features (visual columns, drag-and-drop, CRUD, mobile-responsive) plus unique differentiators leveraging the 5-dimension scoring system.

**Must have (table stakes):**
- Visual kanban board with columns (3 parallel boards: Chess/Hybrid/Poker)
- Drag-and-drop task movement with touch support
- Task CRUD operations with persistence (localStorage)
- Mobile-responsive design (mobile-first constraint, not desktop-with-responsive)
- Task details (title, description, due date, dimension scores)
- Data persistence surviving browser refresh
- Task filtering/sorting by classification dimensions

**Should have (competitive advantage):**
- 5-dimension classification scoring — transforms vague priority into structured decision framework (CORE DIFFERENTIATOR)
- Radar chart visualization per task — visual pattern recognition beats reading 5 numbers
- Domain-specific kanban lanes — Chess, Hybrid, Poker workflows tailored to task nature
- Automatic task reclassification — work changes nature, tool adapts workflow
- Bottleneck dimension indicator — identifies lowest-scoring dimension blocking progress
- Dimension-based filtering — filter by specific dimension scores (e.g., "low verifiability tasks")
- Classification distribution analytics — portfolio-level insights (too much Poker? not enough Chess?)

**Defer (v2+):**
- Compound pattern detection (Wrapped Chess, Disguised Poker) — HIGH complexity, needs usage validation
- Multi-device cloud sync — contradicts localStorage simplicity, requires backend infrastructure
- Time tracking — feature creep, not core to classification framework
- Subtasks/nested tasks — complicates mobile UI, unclear how to score parent vs child
- Custom column workflows — undermines researched domain-specific workflows

**Anti-features to avoid:**
- Multi-user collaboration (adds auth, sync conflicts — contradicts "personal tool" positioning)
- Unlimited custom dimensions (dilutes Chess-Poker framework; radar charts break beyond 8 axes)
- Automated task prioritization (removes user agency, creates black-box decisions)

### Architecture Approach

Normalized state with computed groups, optimistic UI updates, and provider-free global state. 5-layer architecture: Presentation → Components → Logic → State (Zustand) → Persistence (localStorage).

**Major components:**
1. **TaskBoard** — Root drag-and-drop orchestrator with `<DndContext>` wrapper, manages 3 lanes (Chess/Hybrid/Poker) with touch/mouse/keyboard sensors
2. **TaskCard** — Draggable task combining `<Draggable>` + `RadarChart` + dimension breakdown UI, subscribes to single task by ID for selective re-renders
3. **TaskCreateModal** — 5-dimension assessment form with live classification preview (score → Chess/Hybrid/Poker auto-classification)
4. **Scoring Engine** — Pure functions for classification logic (dimensions → totalScore → lane assignment based on 5-7/8-10/11-15 ranges)
5. **Zustand Store** — Normalized state `{ tasks: [] }`, selective subscriptions prevent global re-renders, middleware auto-saves to localStorage

**Critical patterns:**
- **Normalized state:** Store tasks as flat array with classification fields; compute lane groupings via selector hooks with useMemo (avoids denormalization sync issues)
- **Optimistic UI updates:** UI updates immediately on drag, then syncs with localStorage; if persistence fails, revert to previous state
- **Fractional ordering:** Calculate new task order as average between adjacent tasks (O(1) updates vs O(n) reindexing)
- **Custom hook abstraction:** `useTaskDragDrop()` encapsulates all dnd-kit setup, enabling library swaps without component changes

**Porting chess-poker-framework.jsx:**
- Extract `DIMENSIONS` constant → `lib/scoring/dimensions.js`
- Port `RadarChart` component → `components/Visualization/RadarChart.jsx` with configurable props
- Port `DimensionCard` component → `components/Visualization/DimensionCard.jsx` with interactive mode
- Extract scoring logic → `lib/scoring/classifier.js` (totalScore → Chess/Hybrid/Poker classification)

### Critical Pitfalls

1. **Touch-drag vs scroll conflict on mobile** — HTML5 Drag & Drop API doesn't work on touch screens; use dnd-kit with `activationConstraint: { delay: 250, tolerance: 5 }` and `touch-action: none` CSS on drag handles. Test on actual iOS/Android devices, not just DevTools emulation.

2. **React 18 concurrent mode drag race conditions** — High-frequency drag events outpace setState batching, causing position skips. Wrap critical updates in `ReactDOM.flushSync()` or use refs for transient drag position. dnd-kit already handles this internally.

3. **localStorage quota exceeded causing silent data loss** — QuotaExceededError (5-10MB limit) throws exception that apps silently swallow. Always wrap `localStorage.setItem()` in try-catch checking for error.name 'QuotaExceededError' AND 'NS_ERROR_DOM_QUOTA_REACHED' (Firefox). Implement LRU cleanup for old completed tasks.

4. **Multi-tab state desynchronization** — Changes in Tab A don't update Tab B, leading to conflicts. Subscribe to `storage` event to detect cross-tab changes; use `useSyncExternalStore` hook for automatic syncing. Implement "last-write-wins" with timestamps.

5. **5-question classification form friction prevents task creation** — Users abandon form halfway through. Allow task creation WITHOUT classification (default to Hybrid lane), add progressive disclosure ("Optimize this task's workflow?"), provide quick-classify presets (Chess/Hybrid/Poker buttons auto-fill scores), use inline contextual help with plain language.

6. **Mobile column layout breaking with 4+ columns per lane** — 4 columns on 375px viewport = ~85px per column, making cards unreadable. Implement mobile-first responsive: single column at a time with horizontal swipe/tabs on mobile, vertical timeline view stacking columns, or column navigation tab bar.

7. **State management complexity explosion** — Deeply nested state `{ chess: { backlog: [tasks] } }` creates mutation bugs. Use normalized structure: `{ tasks: [] }` with `task.columnId` property, not nesting. Store classification score on task; lane placement is derived. Single `moveTask()` function encapsulates all state logic.

8. **Tailwind migration breaking existing inline styles** — chess-poker-framework.jsx uses inline styles with specific pixel values that don't map cleanly to Tailwind's scale. Extend Tailwind config FIRST with custom colors/spacing, migrate component-by-component with screenshot comparisons, test at multiple breakpoints (375px, 768px, 1024px).

## Implications for Roadmap

Based on research, suggested phase structure prioritizing mobile-first architecture, classification system validation, and incremental complexity:

### Phase 1: Foundation & Static Board
**Rationale:** Establish architecture decisions (Vite, Zustand, Tailwind) and mobile-responsive layout BEFORE adding drag-and-drop complexity. Port existing chess-poker-framework.jsx visualization components. Static board validates 3-lane layout and mobile column navigation without drag state complexity.

**Delivers:**
- Project scaffolding (Vite + React 19 + TailwindCSS v4)
- Zustand stores with normalized state structure
- Ported `DIMENSIONS` constant, `RadarChart`, and `DimensionCard` components
- Static 3-lane kanban board (Chess/Hybrid/Poker) with mock task data
- Mobile-responsive layout (single lane on mobile, 3 lanes on desktop)
- localStorage persistence utilities with error handling

**Addresses:** Anti-pattern avoidance (normalized state from start), Tailwind migration with incremental testing, mobile-first layout foundation
**Avoids:** State management complexity explosion (normalized state), Tailwind visual regressions (component-by-component migration)

### Phase 2: Task Classification & CRUD
**Rationale:** Core value proposition = 5-dimension scoring → automatic classification. Must work before drag-and-drop, enabling testing of scoring logic independently. Progressive disclosure prevents form abandonment.

**Delivers:**
- `TaskCreateModal` with 5-dimension scoring (1-3 per dimension)
- Live classification preview (totalScore → Chess/Hybrid/Poker)
- Smart defaults (auto-classify as Hybrid if dimensions left blank)
- Quick-classify presets (Chess/Hybrid/Poker buttons)
- Inline contextual help for each dimension
- Task CRUD operations (create, read, update, delete)
- Tasks appear in correct lane's Backlog column

**Addresses:** 5-dimension classification scoring (P1 feature), Quick task creation (table stakes), Task filtering by dimensions
**Avoids:** Classification form friction (progressive disclosure, defaults, presets)

### Phase 3: Drag-and-Drop Within Lanes
**Rationale:** Implement touch-optimized drag AFTER classification works. Start with within-lane movement (simpler) before cross-lane reclassification. Critical mobile UX decisions happen here.

**Delivers:**
- dnd-kit sensors configured for touch/mouse/keyboard
- Touch sensor with `activationConstraint: { delay: 250, tolerance: 5 }`
- Within-column reordering (same lane, same column)
- Cross-column movement (same lane, different columns)
- Optimistic UI updates + localStorage sync
- Fractional ordering for O(1) task position updates
- `DragOverlay` component for mobile drag feedback

**Addresses:** Drag-and-drop task movement (P1 feature), Mobile-responsive design (P1 feature)
**Avoids:** Touch-drag vs scroll conflict (dnd-kit activation constraints), React 18 concurrent mode race conditions (dnd-kit handles internally), Mobile column layout breaking (tested at 375px viewport)

### Phase 4: Cross-Lane Reclassification
**Rationale:** Most complex feature requiring re-scoring logic + lane migration. Depends on working classification and drag systems. Unlocks "task nature evolved" use case.

**Delivers:**
- Detect cross-lane drag attempts
- Reclassification confirmation modal
- `TaskEditModal` for re-scoring dimensions
- Before/after classification comparison
- Task migration to new lane's Backlog column
- Update task dimensions + classification + column atomically

**Addresses:** Automatic task reclassification (P1 feature), Before/after classification comparison (differentiator)
**Avoids:** State management complexity (single moveTask function with lane migration logic)

### Phase 5: Differentiating Features
**Rationale:** Core classification model validated by Phase 4. Add value-adding features that leverage dimension data.

**Delivers:**
- Bottleneck dimension indicator (highlight lowest-scoring dimension on cards)
- Dimension-based filtering (filter by score ranges)
- Classification distribution analytics (portfolio view: Chess vs Hybrid vs Poker balance)
- Basic search (by title/description)
- Task archiving (soft archive preserving analytics history)

**Addresses:** Bottleneck dimension indicator (P1 feature), Dimension-based filtering (P2 feature), Classification distribution analytics (P2 feature)

### Phase 6: Polish & Data Persistence Hardening
**Rationale:** Production-ready requires robust error handling, multi-tab sync, and performance optimization.

**Delivers:**
- localStorage quota monitoring (warn at 80% capacity)
- LRU cleanup for old completed tasks
- Multi-tab synchronization via `storage` event + `useSyncExternalStore`
- Conflict resolution (last-write-wins with timestamps)
- Export/import task data (JSON backup)
- Performance optimization (React.memo, virtual scrolling for 100+ task columns)
- Keyboard navigation for drag-and-drop (accessibility)

**Addresses:** localStorage persistence (table stakes), Advanced search (P2 feature), Task archiving (P2 feature)
**Avoids:** localStorage quota exceeded (error handling + LRU cleanup), Multi-tab desynchronization (storage event + useSyncExternalStore)

### Phase Ordering Rationale

- **Foundation first:** Architecture decisions (normalized state, Zustand, Tailwind config) are HIGH cost to change later; establish in Phase 1
- **Classification before drag:** Scoring logic can be tested independently; drag-and-drop adds significant state complexity
- **Within-lane before cross-lane:** Simpler drag operations validate touch handling before adding reclassification modal complexity
- **Differentiators after core:** Bottleneck indicators and analytics only valuable once users have classified multiple tasks
- **Polish last:** Error handling and multi-tab sync aren't visible until users hit edge cases; defer to final phase

**Dependency critical path:** Phase 1 → 2 → 3 → 4 (MVP achievable, classification model validated). Phases 5-6 enhance but aren't required for core value proposition.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (Drag-and-Drop):** Touch event handling nuances on iOS Safari vs Android Chrome; dnd-kit collision detection configuration for multi-lane boards
- **Phase 6 (Performance):** Virtual scrolling library evaluation (react-window vs react-virtualized); IndexedDB migration path if localStorage insufficient

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** Vite + React 19 setup is well-documented; Zustand store patterns are straightforward
- **Phase 2 (Classification):** Form handling and state management are standard React patterns
- **Phase 4 (Reclassification):** Extends Phase 2 patterns with modal UX
- **Phase 5 (Differentiators):** Filtering and analytics are standard data transformations

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | React 19 + Vite + dnd-kit + Zustand are 2026 industry standards; npm packages actively maintained; version compatibility verified |
| Features | MEDIUM | Table stakes features backed by competitor analysis; differentiators (5-dimension scoring) are novel with no direct comparables |
| Architecture | MEDIUM | Kanban board patterns well-documented; normalized state + Zustand + optimistic UI are proven patterns; porting chess-poker-framework.jsx is straightforward |
| Pitfalls | HIGH | Mobile touch-drag conflicts, localStorage quota issues, and React 18 concurrent mode are documented problems with known solutions |

**Overall confidence:** HIGH

### Gaps to Address

**Classification UX:** 5-dimension scoring is novel; no usability data on whether users understand dimensions without extensive onboarding. Plan to iterate on form language, contextual help, and quick-classify presets based on first-use feedback. Consider A/B testing "classify by example" vs "score 5 dimensions" approaches in Phase 2.

**Mobile column navigation:** Research shows various approaches (horizontal scroll, vertical timeline, swipe gestures, tab navigation) but no clear best practice for 4-column kanban on 375px viewport. Phase 1 should prototype 2-3 approaches and user-test on actual devices before committing to architecture.

**Compound pattern detection:** Deferred to v2+ due to HIGH complexity, but architecture should anticipate eventual task relationship modeling (Sequential, Parallel, Wrapped, Disguised patterns). Consider adding optional `relatedTaskIds: []` field to task schema in Phase 1 even if unused initially.

**localStorage limits at scale:** 5-10MB quota sufficient for 500-1000 tasks depending on verbosity. If user adopts tool heavily (1000+ tasks), migration to IndexedDB required. Phase 6 should include monitoring task count and alerting user at 500 tasks to gauge need for v1.x IndexedDB migration.

## Sources

### Primary (HIGH confidence)
- **STACK.md:** React v19 Release Notes, Vite official docs, dnd-kit npm, TailwindCSS v4 release, Zustand GitHub — core technology versions and capabilities verified against official docs
- **ARCHITECTURE.md:** dnd-kit official docs, Zustand patterns, React folder structure best practices from RobinWieruch/MaxRozen — architectural patterns backed by official documentation
- **PITFALLS.md:** dnd-kit GitHub discussions on touch handling, React 18 concurrent mode issues, localStorage quota error handling from MDN/RxDB — problems and solutions sourced from official issue trackers and documentation

### Secondary (MEDIUM confidence)
- **STACK.md:** LogRocket blog (Vite vs CRA comparison), Medium articles (Redux vs Zustand 2026, TailwindCSS migration) — industry trends and comparisons from reputable sources
- **FEATURES.md:** Atlassian kanban guides, competitor feature analysis (Trello, Things 3, Notion), priority matrix research — feature expectations based on established competitors
- **ARCHITECTURE.md:** Marmelab blog (kanban board patterns), React state management tutorials — implementation patterns from experienced practitioners
- **PITFALLS.md:** LogRocket/Medium technical blogs, Syncfusion component docs, GitHub issue discussions — pitfall examples and mitigations from community experience

### Tertiary (LOW confidence)
- **FEATURES.md:** Asrify blog (AI kanban boards 2026), Any.do blog (mobile-first workflows) — forward-looking feature predictions, less grounded in current practice
- **PITFALLS.md:** Forum discussions (CryptPad kanban mobile scrolling), Netlify blog (Tailwind migration) — anecdotal experiences, need validation in specific context

---
*Research completed: 2026-02-16*
*Ready for roadmap: yes*
