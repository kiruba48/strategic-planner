# Pitfalls Research

**Domain:** Mobile-First React Kanban Board with Classification Logic
**Researched:** 2026-02-16
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Touch-Drag vs. Scroll Conflict on Mobile

**What goes wrong:**
Mobile users cannot scroll the kanban board because the browser interprets touch gestures as drag attempts, or vice versa—they cannot drag tasks because the interface keeps scrolling. This creates a completely unusable mobile experience where users are trapped between two competing gestures.

**Why it happens:**
HTML5 Drag & Drop API does not work natively on touch screens. Developers often implement drag-and-drop using libraries designed for desktop (mouse events) without properly handling touch events, leading to gesture conflicts. The browser's default behavior is to scroll on touch-move, which conflicts with dragging logic that also uses touch-move events.

**How to avoid:**
- Use libraries with native touch support (dnd-kit, pragmatic-drag-and-drop) rather than desktop-only libraries
- Implement "hold-to-drag" pattern: long-press initiates drag mode, quick touch allows scrolling
- Use `touch-action: none` CSS on drag handles during active drag, but NOT on the entire board
- Never use HTML5 Drag & Drop API for mobile—use Touch API or pointer events instead
- Test on actual mobile devices, not just browser DevTools mobile emulation (Safari iOS behaves differently)

**Warning signs:**
- Users report "can't scroll" or "can't drag" on mobile during testing
- Touch events firing simultaneously with drag events in console logs
- `preventDefault()` calls blocking all touch interactions globally
- Drag operations only work on desktop browser testing

**Phase to address:**
Phase 1 (Core Kanban Board) — this must be solved from the beginning, not retrofitted. Architecture decisions for drag-and-drop library selection happen in Phase 1.

---

### Pitfall 2: React 18 Concurrent Mode Drag Race Conditions

**What goes wrong:**
During drag operations, task positions "skip" or "jump" unpredictably, especially on slower devices. Drag coordinates don't match mouse/touch position. Tasks snap back to wrong positions after drop. This happens because React 18's concurrent rendering batches setState calls, causing drag state updates to be processed out of order or with stale values.

**Why it happens:**
In React 18, setState updates are batched by default and never run synchronously—they're always deferred. High-frequency events like drag operations fire faster than React can process state updates, leading to race conditions where `this.state` or useState returns stale values during the drag operation.

**How to avoid:**
- Wrap critical drag state updates in `ReactDOM.flushSync()` to force synchronous updates
- Use refs (`useRef`) for transient drag state (current position) that doesn't need to trigger renders
- Only update React state on drag START and drag END, not during drag MOVE
- Use functional state updates: `setState(prev => ({ ...prev, x: newX }))` to avoid stale closures
- Consider libraries that already handle this (dnd-kit is optimized for React 18)
- For custom implementations: store drag position in DOM transforms, not React state

**Warning signs:**
- Drag performance degrades after upgrading to React 18
- Console warnings about "Cannot update during render"
- Drag position lags behind cursor/touch by several frames
- Different behavior between development and production builds
- Works fine on fast machines, breaks on mobile/slow devices

**Phase to address:**
Phase 1 (Core Kanban Board) — drag-and-drop library selection and state architecture must account for React 18 concurrent features from the start.

---

### Pitfall 3: localStorage Quota Exceeded Causing Silent Data Loss

**What goes wrong:**
Tasks disappear permanently. User adds a new task or updates existing ones, the operation appears successful, but on page reload the changes are gone. No error message appears to the user. This happens when localStorage exceeds its ~5MB limit, causing `localStorage.setItem()` to throw `QuotaExceededError` which the app silently swallows.

**Why it happens:**
Developers assume localStorage has unlimited space. The app stores increasingly large data structures (entire task history, verbose score breakdowns, embedded chart data) without size checks. When the quota is exceeded, localStorage.setItem() throws an exception. If not caught and handled, the app appears to work but data is never persisted.

**How to avoid:**
- Always wrap `localStorage.setItem()` in try-catch blocks checking for `QuotaExceededError` (code 22 or 1014)
- Check error.name for 'QuotaExceededError' AND 'NS_ERROR_DOM_QUOTA_REACHED' (Firefox)
- Implement automatic cleanup: LRU (Least Recently Used) eviction of old completed tasks
- Show user-facing warnings when approaching quota (e.g., at 80% capacity)
- Compress data before storing: JSON.stringify + base64 encoding reduces size significantly
- Store only essential data: don't store computed values, chart render data, or UI state
- Consider IndexedDB for larger datasets (supports 50MB+ depending on browser)
- Implement "export tasks" functionality so users can backup before data loss

**Warning signs:**
- Data inconsistency between what user sees and what persists after reload
- No error handling around localStorage operations in codebase
- Storing entire state tree including derived/computed values
- Task history growing unbounded without cleanup
- No size monitoring or quota checks in code

**Phase to address:**
Phase 1 (Core Kanban Board) — localStorage strategy must include error handling and quota management from first implementation. Phase 3 (Data Persistence Polish) — add LRU cleanup and export features.

---

### Pitfall 4: Multi-Tab State Desynchronization

**What goes wrong:**
User has the kanban board open in two browser tabs. They move a task in Tab A, but Tab B doesn't update. They then move a task in Tab B, reload the page, and Tab A's changes are lost. This creates data loss and user confusion about which tab has the "correct" state.

**Why it happens:**
localStorage changes in one tab don't automatically trigger React re-renders in other tabs. The `storage` event fires when localStorage changes, but only in OTHER tabs (not the tab that made the change). Without subscribing to the storage event, tabs operate independently with diverging state that eventually conflicts.

**How to avoid:**
- Subscribe to the `storage` event to detect cross-tab changes: `window.addEventListener('storage', handleStorageChange)`
- Manually dispatch a custom storage event in the current tab after localStorage.setItem()
- Use React's `useSyncExternalStore` hook to sync localStorage across tabs automatically
- Implement "last-write-wins" with timestamps to resolve conflicts
- Show users a "data updated in another tab" notification with option to reload
- For concurrent writes: use versioning system where highest version/timestamp wins
- Before writing, check if localStorage value changed since last read to detect conflicts

**Warning signs:**
- No storage event listeners in codebase
- localStorage reads happen only on component mount, never after
- No conflict resolution strategy for concurrent updates
- Users report "my changes disappeared" when using multiple tabs
- State management reads from localStorage but never subscribes to changes

**Phase to address:**
Phase 1 (Core Kanban Board) — basic storage event listener for reload notification. Phase 3 (Data Persistence Polish) — implement useSyncExternalStore and conflict resolution.

---

### Pitfall 5: 5-Question Classification Form Friction Prevents Task Creation

**What goes wrong:**
Users abandon task creation halfway through because the 5-dimension scoring questionnaire (Information Completeness, Agent Adaptivity, Outcome Verifiability, Rule Stability, Reversibility) feels like a chore. New users don't understand what the questions mean. The app ends up with an empty board because creating tasks requires too much cognitive overhead.

**Why it happens:**
Frictionless onboarding requires 2-3 form fields; this form requires 5 dimension scores (1-3 each) plus task description. Without context, questions like "Agent Adaptivity" are meaningless to first-time users. Requiring complete classification before task creation blocks users who just want to capture a quick thought. This violates the UX principle: minimize friction before first value.

**How to avoid:**
- Allow task creation WITHOUT classification: "Add task → Backlog lane → classify later"
- Implement progressive disclosure: show classification form as optional "Want to optimize this task's workflow?"
- Provide smart defaults: auto-classify as "Hybrid" (score 9) so users can start immediately
- Show contextual help INLINE: "Agent Adaptivity: Can you adapt your approach if plan A fails? High = many options"
- Use visual affordances: emoji or icons for each dimension (🧩 Info, 🔄 Adaptivity, ✓ Verifiable, 📏 Rules, ⏮️ Reversible)
- Implement "Classify by example": "Is this more like 'Write a bug fix' (Chess) or 'Negotiate a contract' (Poker)?"
- Add "Quick classify" button: 3 preset buttons (Chess/Hybrid/Poker) that auto-fills all 5 scores
- Show classification form as a modal/drawer that can be dismissed and reopened later

**Warning signs:**
- Task creation requires completing classification form before submit button enables
- No explanation of what dimensions mean within the form itself
- Classification questions use jargon without examples
- No default/suggested classifications provided
- First-time user flow forces classification before showing any kanban board functionality
- Analytics show users starting task creation but not completing it (drop-off in form)

**Phase to address:**
Phase 2 (Task Classification System) — must include UX research and iteration on form design. Phase 4 (Score Visualization) — add contextual education via hover states and examples.

---

### Pitfall 6: Mobile Column Layout Breaking with 4+ Columns per Lane

**What goes wrong:**
The Chess lane has 4 columns (Backlog → In Progress → Testing → Done). On mobile viewports (375px wide), each column becomes ~85px wide, making task cards unreadable. Horizontal scrolling is clunky. Users can't see where to drag tasks because destination columns are off-screen. The board becomes unusable without constant horizontal panning.

**Why it happens:**
Desktop kanban boards show all columns simultaneously, assuming wide screens. Mobile devices have limited horizontal space. Developers test on desktop or tablet-sized browser windows, missing the constraint. CSS grid/flex layouts that work on desktop create crushed columns on mobile. Auto-scrolling during drag doesn't work well with touch events.

**How to avoid:**
- Implement mobile-first responsive design: 1 column at a time on mobile, horizontal swipe/tabs to switch columns
- Use CSS: `overflow-x: auto` on mobile with proper touch-scrolling behavior
- Implement "vertical timeline" view for mobile: stack columns vertically instead of horizontally
- Add column navigation: tab bar at bottom showing "Backlog (3) → In Progress (1) → Testing (0) → Done (5)"
- Make columns full-width on mobile with swipe gestures to navigate between them
- Test actual column widths: if < 120px per column, switch to single-column mobile view
- Auto-scroll during drag: detect when dragged element is within 50px of viewport edge
- Provide "zoom out" overview mode: see all columns at reduced card size for orientation

**Warning signs:**
- Column width calculations assume > 1024px viewport
- No mobile-specific layout breakpoints in CSS
- Testing only done on desktop or iPad-sized screens
- Card content truncates severely on actual phones
- Drag-and-drop destinations not visible during drag on mobile
- No column navigation UI for mobile

**Phase to address:**
Phase 1 (Core Kanban Board) — responsive layout must be designed from the beginning. Phase 5 (Mobile Polish) — refine column navigation and add swipe gestures.

---

### Pitfall 7: State Management Complexity Explosion with 3 Lanes × 4 Columns × N Tasks

**What goes wrong:**
As the codebase grows, state updates become increasingly buggy. Moving a task from "Chess Backlog" to "Poker Active Negotiation" requires updating multiple nested objects, leading to state mutation bugs, stale UI, and inconsistent localStorage persistence. Re-scoring a task (which changes its lane) creates orphaned references. The state structure becomes too complex to reason about.

**Why it happens:**
Developers start with deeply nested state: `{ chess: { backlog: [tasks], inProgress: [tasks] }, hybrid: { ... } }`. Every task move requires complex state updates across multiple nesting levels. Without immutable update patterns, accidental mutations creep in. Re-classification (changing task's lane) requires removing from one lane and adding to another, doubling the complexity.

**How to avoid:**
- Use normalized state structure: `{ tasks: { [id]: task }, columns: { [columnId]: { taskIds: [] } } }`
- Store task's current column as task property, not by nesting: `task.columnId = 'chess-backlog'`
- Use state management library (Zustand preferred for simplicity, Redux Toolkit if team is large)
- Implement immer for immutable updates: `produce(state, draft => { draft.tasks[id].column = newColumn })`
- Single source of truth: task classification score lives on task object, lane/column placement is derived
- Helper functions: `moveTask(taskId, targetColumn)` encapsulates all state update logic
- Never mutate state directly: `tasks.push(newTask)` ❌ → `setTasks([...tasks, newTask])` ✅
- Write unit tests for state transitions to catch mutation bugs early

**Warning signs:**
- Deeply nested state structure (3+ levels deep)
- Direct array mutations: `tasks[index] = newTask`
- Complex find-and-update logic scattered across components
- Different components have inconsistent views of same task
- Bugs where task appears in multiple columns or disappears after move
- No single "moveTask" function — every component implements drag differently

**Phase to address:**
Phase 1 (Core Kanban Board) — normalized state structure from the start prevents this entirely. Refactoring later is HIGH cost.

---

### Pitfall 8: Tailwind Migration Breaking Existing Inline Styles and Visual Regressions

**What goes wrong:**
While migrating the chess-poker-framework.jsx component from inline styles to Tailwind, visual regressions occur: spacing breaks, colors change unexpectedly, responsive behavior stops working. The radar chart visualization looks different. Styles that worked with inline CSS don't have Tailwind equivalents. The migration takes 3x longer than estimated.

**Why it happens:**
Tailwind's reset CSS (Preflight) overrides browser defaults differently than the original inline styles assumed. Inline styles use specific pixel values (e.g., `padding: 17px`) that don't map cleanly to Tailwind's scale (p-4 = 16px, p-5 = 20px). Custom colors defined in inline styles need to be added to Tailwind config. Responsive inline styles using media queries need to be converted to Tailwind's responsive prefixes. Developers assume 1:1 migration is possible without testing each component.

**How to avoid:**
- Migrate component by component, not the entire codebase at once
- Extend Tailwind config FIRST with custom colors, spacing, and breakpoints from existing design
- Take screenshots before migration for pixel-perfect comparison
- Use Tailwind's `@apply` sparingly — only for small reusable utilities, not replacing inline styles 1:1
- Avoid Tailwind for complex one-off styles; keep inline styles or CSS modules for edge cases
- Test at multiple breakpoints (375px, 768px, 1024px) after each component migration
- Watch for Preflight reset side effects: forms, buttons, headings all have default styles removed
- Use `className` alongside `style` temporarily: migrate incrementally, not all-or-nothing
- Expect 20-30% of inline styles to need custom Tailwind config extensions

**Warning signs:**
- Assuming all inline styles have Tailwind equivalents without checking
- Migrating everything in one massive PR without incremental testing
- Not extending Tailwind config with project-specific design tokens
- Visual QA only happens after entire migration is complete
- Using `@apply` excessively (defeats Tailwind's utility-first approach)
- No before/after screenshot comparison process

**Phase to address:**
Phase 0 (Foundation Setup) — configure Tailwind with custom theme extensions. Phase 1 (Core Kanban Board) — migrate chess-poker-framework.jsx incrementally during kanban board implementation.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Storing entire state tree in localStorage | Simple implementation: `localStorage.setItem('state', JSON.stringify(state))` | Hits quota quickly, performance degrades, can't debug individual pieces, migration to IndexedDB requires full rewrite | MVP only; refactor by Phase 3 |
| Using react-beautiful-dnd instead of dnd-kit | Familiar API, lots of tutorials | Library is unmaintained, no React 18 optimization, poor mobile support, will need full rewrite to migrate | Never — library is deprecated |
| Skipping keyboard navigation for drag-and-drop | Faster development, mobile-first focus | Fails WCAG 2.1 accessibility, excludes motor-impaired users, can't be retrofitted easily | Never — build accessibility from start |
| Hard-coding column definitions instead of data-driven config | Quick to implement 3 lanes × 4 columns | Adding/reordering columns requires code changes, can't support user customization later, testing is harder | Acceptable for MVP; refactor to config in Phase 2 |
| No optimistic UI updates | Simpler state management, fewer edge cases | Every drag operation waits for localStorage write, feels sluggish | Acceptable for Phase 1; add in Phase 3 |
| Inline classification scoring in task component | Fewer components, less prop drilling | Hard to test, can't reuse scoring logic, difficult to change classification algorithm | Never — extract from start |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Re-rendering all tasks on every drag move | Drag feels laggy, CPU spikes to 100% during drag | Use React.memo on task cards, memoize column components, only update actively dragged task | > 50 tasks total |
| Recalculating task classifications on every render | Slow renders, UI freezes when scrolling | Memoize classification logic with useMemo, store computed lane in task object | > 20 tasks |
| Storing radar chart SVG data in localStorage | QuotaExceededError, slow reads/writes | Don't persist visualization data — recompute from scores on demand | > 100 tasks with charts |
| No virtual scrolling for task lists | Slow scrolling, choppy animations | Implement react-window for columns with > 30 tasks | > 100 tasks per column |
| Reading from localStorage on every render | Slow initial render, blocking main thread | Read localStorage once on mount, subscribe to storage event for updates | Any non-trivial usage |
| Large Tailwind bundle including unused utilities | 3MB+ CSS bundle, slow initial load on mobile | Use Tailwind's purge/content config, enable JIT mode, audit with PurgeCSS | Production deployment |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No visual feedback during drag | User unsure if drag started, drops in wrong location | Show drag preview/ghost, highlight valid drop zones, add haptic feedback on mobile |
| Classification form uses technical jargon without explanation | Users don't understand questions, skip classification or guess randomly | Add inline help text, examples, tooltips; use plain language; provide "classify by analogy" shortcuts |
| No undo after accidental drag | User accidentally drops task in wrong column, has to manually fix | Implement undo/redo with Ctrl+Z, show temporary "Undo" toast after drag operations |
| Radar chart displays without context | User sees 5-point visualization but doesn't know what it means or why it matters | Add legend, show score-to-strategy mapping, explain implications of classification |
| No onboarding for first-time users | User sees empty board, doesn't know what Chess/Hybrid/Poker mean | Add interactive tutorial, sample tasks, explainer for framework, progressive disclosure |
| Columns scroll independently causing disorientation | User loses context of which column they're in while scrolling | Sticky column headers, breadcrumb navigation, overview mini-map for mobile |

## "Looks Done But Isn't" Checklist

- [ ] **Drag-and-drop:** Often missing keyboard navigation — verify Tab, Arrow keys, Space, Enter work without mouse
- [ ] **localStorage persistence:** Often missing error handling — verify try-catch around setItem, QuotaExceededError handling
- [ ] **Mobile touch:** Often missing hold-to-drag distinction from scroll — verify long-press vs quick-swipe on actual iOS device
- [ ] **Multi-tab sync:** Often missing storage event listener — verify changes in Tab A appear in Tab B without manual reload
- [ ] **Classification form:** Often missing validation — verify scores are 1-3, all dimensions required before submit
- [ ] **Task reclassification:** Often missing lane migration logic — verify re-scoring task moves it to correct lane's backlog
- [ ] **Responsive layout:** Often missing mobile column navigation — verify 4-column lanes work on 375px viewport
- [ ] **Accessibility:** Often missing ARIA labels and focus indicators — verify screen reader announces drag operations
- [ ] **Error states:** Often missing network/localStorage failure UI — verify user sees helpful message when operations fail
- [ ] **Empty states:** Often missing helpful prompts — verify new user sees "Create your first task" guidance, not blank board

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Chose react-beautiful-dnd (deprecated library) | HIGH | 1. Add dnd-kit alongside (don't remove rbd yet) 2. Migrate one lane at a time 3. A/B test thoroughly 4. Remove rbd after full migration |
| Deep nested state structure causing mutation bugs | HIGH | 1. Write state normalization functions 2. Create new normalized store alongside old 3. Migrate components incrementally 4. Remove old state after all migrations complete |
| localStorage quota exceeded without handling | MEDIUM | 1. Add try-catch error handling 2. Implement LRU cleanup 3. Notify affected users to export/import data 4. Consider migration to IndexedDB |
| No mobile-first design, desktop-only UX | MEDIUM | 1. Add mobile breakpoints 2. Build responsive column navigation 3. Test on actual devices 4. Iterate based on mobile user feedback |
| Missing keyboard navigation | MEDIUM | 1. Audit components with accessibility tools 2. Add keyboard handlers to drag operations 3. Test with keyboard-only navigation 4. Add ARIA labels |
| Multi-tab desync causing data loss | MEDIUM | 1. Add storage event listener 2. Implement conflict detection 3. Show "reload to sync" notification 4. Add auto-merge for simple conflicts |
| Touch-drag vs scroll conflict | LOW | 1. Add hold-to-drag delay 2. Use touch-action CSS 3. Test gesture timing thresholds 4. Provide visual drag affordance |
| Classification form friction | LOW | 1. Make classification optional 2. Add smart defaults 3. Progressive disclosure 4. Quick-classify presets |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Touch-drag vs scroll conflict | Phase 1 (Core Kanban Board) | Test on actual iOS/Android devices with touch interaction |
| React 18 concurrent mode race conditions | Phase 1 (Core Kanban Board) | Drag 10 tasks rapidly on slow device, verify positions are correct |
| localStorage quota exceeded | Phase 1 (Core Kanban Board) + Phase 3 (Data Persistence Polish) | Fill localStorage to 4MB, verify error handling and user messaging |
| Multi-tab state desynchronization | Phase 1 (Core Kanban Board) + Phase 3 (Data Persistence Polish) | Open 2 tabs, modify in Tab A, verify Tab B shows change |
| Classification form friction | Phase 2 (Task Classification System) | Track task creation completion rate, aim for > 80% |
| Mobile column layout breaking | Phase 1 (Core Kanban Board) + Phase 5 (Mobile Polish) | Test on 375px viewport, verify all columns accessible |
| State management complexity explosion | Phase 1 (Core Kanban Board) | Move task across lanes, re-classify task, verify state consistency |
| Tailwind migration visual regressions | Phase 0 (Foundation Setup) + Phase 1 (Core Kanban Board) | Screenshot comparison before/after migration |
| No keyboard navigation | Phase 1 (Core Kanban Board) | Complete all tasks using keyboard only, no mouse |
| Performance degradation with large task lists | Phase 3 (Data Persistence Polish) + Phase 6 (Performance Optimization) | Test with 200+ tasks, verify smooth drag and scroll |

## Sources

### Drag-and-Drop & Touch Interactions
- [Top 5 Drag-and-Drop Libraries for React in 2026](https://puckeditor.com/blog/top-5-drag-and-drop-libraries-for-react)
- [Building a Drag-and-Drop Kanban Board with React and dnd-kit](https://radzion.com/blog/kanban/)
- [How I Built Drag and Drop in React Without Libraries (Using Pointer Events)](https://medium.com/@aswathyraj/how-i-built-drag-and-drop-in-react-without-libraries-using-pointer-events-a0f96843edb7)
- [Dragging React performance forward](https://medium.com/@alexandereardon/dragging-react-performance-forward-688b30d40a33)
- [Comparison with react-beautiful-dnd · Discussion #481](https://github.com/clauderic/dnd-kit/discussions/481)
- [Integrating Touch Support to Drag-and-Drop Interfaces](https://chariotsolutions.com/blog/post/integrating-touch-support-to-drag-and-drop-interfaces/)
- [Best way to prevent page scrolling on drag (mobile) · Issue #487](https://github.com/bevacqua/dragula/issues/487)
- [Drag and Drop (DnD) for mobile browsers](https://medium.com/@deepakkadarivel/drag-and-drop-dnd-for-mobile-browsers-fc9bcd1ad3c5)

### localStorage & Data Persistence
- [localStorage in JavaScript: A complete guide - LogRocket Blog](https://blog.logrocket.com/localstorage-javascript-complete-guide/)
- [How to Fix localStorage Task Persistence Issues in a React To-Do App](https://medium.com/@lakewyetnayet93/how-to-fix-localstorage-task-persistence-issues-in-a-react-to-do-app-434ca28f98dd)
- [Using localStorage in Modern Applications - A Comprehensive Guide | RxDB](https://rxdb.info/articles/localstorage.html)
- [Handling localStorage errors (such as quota exceeded errors)](https://mmazzarolo.com/blog/2022-06-25-local-storage-status/)
- [Understanding and Resolving LocalStorage Quota Exceeded Errors](https://medium.com/@zahidbashirkhan/understanding-and-resolving-localstorage-quota-exceeded-errors-5ce72b1d577a)
- [Always catch LocalStorage security and quota exceeded errors](http://crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors)

### Multi-Tab Synchronization
- [Syncing LocalStorage across multiple tabs](https://medium.com/@mfreundlich1/syncing-localstorage-across-multiple-tabs-cb5d0b1feaab)
- [Sync Local Storage state across tabs in React using useSyncExternalStore](https://oakhtar147.medium.com/sync-local-storage-state-across-tabs-in-react-using-usesyncexternalstore-613d2c22819e)
- [4 Ways to Communicate Across Browser Tabs in Realtime](https://blog.bitsrc.io/4-ways-to-communicate-across-browser-tabs-in-realtime-e4f5f6cbedca)

### State Management
- [State Management in 2026: Redux, Context API, and Modern Patterns](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns)
- [State Management in 2026: Comparing Zustand, Signals, and Redux](https://veduis.com/blog/state-management-comparing-zustand-signals-redux/)
- [Why Developers Are Ditching Redux for Zustand and React Query](https://medium.com/@mernstackdevbykevin/state-management-in-2025-why-developers-are-ditching-redux-for-zustand-and-react-query-b5ecad4ff497)
- [Race condition on React 18 setState causes mouse to "skip" when dragging](https://github.com/react-grid-layout/react-grid-layout/issues/2003)
- [Fix React 18 Concurrent Mode drag glitches · Issue #698](https://github.com/react-grid-layout/react-draggable/issues/698)

### Mobile Responsive Design
- [Kanban has difficult UI for scrolling on mobile devices - CryptPad Forum](https://forum.cryptpad.org/d/211-kanban-has-difficult-ui-for-scrolling-on-mobile-devices)
- [Responsive Mode in React Kanban component | Syncfusion](https://ej2.syncfusion.com/react/documentation/kanban/responsive-mode)
- [Top Kanban Boards for Mobile-First Workflows in 2026](https://www.any.do/blog/top-kanban-boards-for-mobile-first-workflows-in-2026/)

### UX & Onboarding
- [Onboarding UX: Best Practices for First-Time User Flow & Activation](https://gapsystudio.com/blog/onboarding-ux-design/)
- [2025 Guide to Understand and Minimize User Friction](https://survicate.com/blog/user-friction/)
- [Onboarding UX: Ultimate guide to designing for user experience](https://www.appcues.com/blog/user-onboarding-ui-ux-patterns)

### Performance & Virtualization
- [Virtual scrolling in React Kanban component | Syncfusion](https://ej2.syncfusion.com/react/documentation/kanban/virtual-scrolling)
- [Virtual Scrolling in React](https://medium.com/@swatikpl44/virtual-scrolling-in-react-6028f700da6b)
- [Virtualization in React: Improving Performance for Large Lists](https://medium.com/@ignatovich.dm/virtualization-in-react-improving-performance-for-large-lists-3df0800022ef)

### Tailwind CSS Migration
- [From semantic CSS to Tailwind - Refactoring the Netlify UI codebase](https://www.netlify.com/blog/2021/03/23/from-semantic-css-to-tailwind-refactoring-the-netlify-ui-codebase/)
- [Reusing Styles - Tailwind CSS](https://tailwindcss.com/docs/reusing-styles)

### Accessibility
- [WCAG Keyboard Accessible Explained](https://www.getstark.co/wcag-explained/operable/keyboard-accessible/)
- [The Ultimate Guide to Building a Production-Ready Kanban Board with Shadcn/UI (2025)](https://www.blog.brightcoding.dev/2025/12/12/%F0%9F%9A%80-the-ultimate-guide-to-building-a-production-ready-kanban-board-with-shadcn-ui-2025/)
- [Keyboard Navigation Testing: Complete Guide to WCAG](https://testparty.ai/blog/keyboard-navigation-testing)

### Optimistic UI & State Management
- [Optimistic UI in Rails with optimism... and Inertia](https://evilmartians.com/chronicles/optimistic-ui-in-rails-with-optimism-and-inertia)
- [Build a Kanban Board With Drag-and-Drop in React with Shadcn](https://marmelab.com/blog/2026/01/15/building-a-kanban-board-with-shadcn.html)

### Chart Visualization
- [Best React chart libraries (2025 update): Features, performance & use cases](https://blog.logrocket.com/best-react-chart-libraries-2025/)
- [React SVG radar chart](https://itnext.io/react-svg-radar-chart-a89d15760e8)
- [The Top 5 React Chart Libraries to Know in 2026 for Modern Dashboards](https://www.syncfusion.com/blogs/post/top-5-react-chart-libraries)

---
*Pitfalls research for: Chess-Poker Task Manager (Mobile-First React Kanban Board)*
*Researched: 2026-02-16*
