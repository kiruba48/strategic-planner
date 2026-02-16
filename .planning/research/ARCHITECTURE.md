# Architecture Research

**Domain:** Mobile-First Kanban Task Management with Classification System
**Researched:** 2026-02-16
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                           │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │TaskCreate│  │ChessLane │  │HybridLane│  │PokerLane │            │
│  │  Modal   │  │ (Kanban) │  │ (Kanban) │  │ (Kanban) │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │               │             │                  │
│       └─────────────┴───────────────┴─────────────┘                  │
│                             │                                        │
├─────────────────────────────┼────────────────────────────────────────┤
│                      Component Layer                                 │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │TaskCard  │  │RadarChart│  │Dimension │  │ Column   │            │
│  │ Draggable│  │Component │  │Breakdown │  │Container │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │               │             │                  │
│       └─────────────┴───────────────┴─────────────┘                  │
│                             │                                        │
├─────────────────────────────┼────────────────────────────────────────┤
│                         Logic Layer                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐       │
│  │Scoring Engine   │  │Classification    │  │  Drag & Drop │       │
│  │(5 dimensions)   │  │Logic (5/7/10/15) │  │  Coordinator │       │
│  └────────┬────────┘  └────────┬─────────┘  └──────┬───────┘       │
│           │                    │                    │               │
│           └────────────────────┴────────────────────┘               │
│                               │                                     │
├───────────────────────────────┼─────────────────────────────────────┤
│                        State Layer (Zustand)                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐     │
│  │Task Store  │  │  UI Store  │  │Filter Store│  │Undo/Redo │     │
│  │(tasks data)│  │(view mode) │  │(sorting)   │  │ (future) │     │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └────┬─────┘     │
│         │                │                │             │           │
├─────────┴────────────────┴────────────────┴─────────────┴───────────┤
│                      Persistence Layer                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐          │
│  │              localStorage Adapter                      │          │
│  │  (subscribeWithSelector + auto-save on mutations)     │          │
│  └───────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **TaskBoard** | Root orchestrator, manages drag-and-drop context, renders 3 lanes | `<DndContext>` wrapper from dnd-kit with sensors and collision detection |
| **LaneContainer** | Renders single lane with column headers, drop zones, task filtering | Droppable area, maps columns dynamically based on classification type |
| **TaskCard** | Draggable task with score visualization, bottleneck indicator | Combines `<Draggable>` + `RadarChart` + dimension breakdown UI |
| **TaskCreateModal** | 5-dimension assessment form, calculates classification on input | Controlled form with live score preview, auto-classifies on submit |
| **RadarChart** | SVG visualization of 5-dimension scores | Reusable from chess-poker-framework.jsx (already implemented) |
| **DimensionCard** | Individual dimension display with 1-3 scale selector | Interactive component for scoring tasks during creation/editing |
| **ColumnDropZone** | Valid drop target for tasks, handles reordering within column | `<Droppable>` with `useDroppable` hook, manages task order state |
| **DragOverlay** | Visual feedback while dragging (card follows cursor) | Portal-rendered overlay showing dragged task appearance |

## Recommended Project Structure

```
src/
├── components/           # Presentation components
│   ├── Board/
│   │   ├── TaskBoard.jsx              # Root drag-and-drop orchestrator
│   │   ├── LaneContainer.jsx          # Single lane (Chess/Hybrid/Poker)
│   │   └── ColumnDropZone.jsx         # Individual column with droppable
│   ├── Task/
│   │   ├── TaskCard.jsx               # Draggable task card
│   │   ├── TaskCreateModal.jsx        # Task creation with scoring
│   │   ├── TaskEditModal.jsx          # Task editing with re-scoring
│   │   └── TaskActions.jsx            # Action buttons (edit, delete, etc.)
│   ├── Visualization/
│   │   ├── RadarChart.jsx             # Port from chess-poker-framework.jsx
│   │   ├── DimensionCard.jsx          # Port from chess-poker-framework.jsx
│   │   └── BottleneckIndicator.jsx    # Shows which dimension blocks progress
│   └── UI/
│       ├── Modal.jsx                  # Reusable modal wrapper
│       ├── Button.jsx                 # TailwindCSS button variants
│       └── Badge.jsx                  # Status badges for columns
├── stores/               # Zustand state stores
│   ├── taskStore.js                   # Task CRUD + classification logic
│   ├── uiStore.js                     # View mode, filters, sort preferences
│   └── index.js                       # Combined store exports
├── lib/                  # Business logic & utilities
│   ├── scoring/
│   │   ├── dimensions.js              # DIMENSIONS constant (port from framework)
│   │   ├── classifier.js              # Score → Classification mapping (5-7, 8-10, 11-15)
│   │   └── bottleneckDetector.js      # Identifies lowest-scored dimension
│   ├── persistence/
│   │   └── localStorage.js            # Save/load utilities with error handling
│   └── dnd/
│       ├── sensors.js                 # Touch/mouse/keyboard sensors config
│       └── collisionDetection.js      # Custom collision for multi-lane board
├── hooks/                # Custom React hooks
│   ├── useTasksByLane.js              # Groups tasks by classification
│   ├── useTaskDragDrop.js             # Handles drag events + state updates
│   ├── usePersistence.js              # Auto-saves state to localStorage
│   └── useResponsive.js               # Window size detection for mobile/desktop
├── constants/            # Configuration
│   ├── columns.js                     # Column definitions per lane type
│   └── config.js                      # App-wide settings
└── App.jsx               # Root component with providers
```

### Structure Rationale

- **components/:** Organized by domain (Board, Task, Visualization) not by type. Enables feature-based navigation.
- **stores/:** Separate stores for tasks vs. UI state prevents unnecessary re-renders. Task mutations don't trigger UI re-renders.
- **lib/:** Pure functions isolated from React. Enables unit testing without rendering, can be reused in Node.js if adding backend later.
- **hooks/:** Encapsulates complex logic like drag-and-drop coordination. Custom hooks keep components thin and focused on rendering.
- **Flat structure:** Max 2 levels of nesting (per best practices). Avoids deeply nested imports like `../../../../utils/scoring`.

## Architectural Patterns

### Pattern 1: Optimistic UI Updates with Eventual Consistency

**What:** UI updates immediately when user drags a task, then syncs with localStorage. If localStorage write fails (browser restrictions), revert to previous state.

**When to use:** All drag-and-drop operations, task creation, task editing, reclassification.

**Trade-offs:**
- **Pro:** Feels instant, no loading spinners during interactions
- **Pro:** Works offline-first naturally
- **Con:** Requires revert logic if persistence fails
- **Con:** Can confuse users if revert happens (rare with localStorage)

**Example:**
```typescript
// In taskStore.js (Zustand)
const useTaskStore = create(
  subscribeWithSelector((set, get) => ({
    tasks: [],

    moveTask: (taskId, newStatus, newColumn, newOrder) => {
      const previousTasks = get().tasks;

      // Optimistic update
      set(state => ({
        tasks: state.tasks.map(t =>
          t.id === taskId
            ? { ...t, status: newStatus, column: newColumn, order: newOrder }
            : t
        )
      }));

      // Persist to localStorage
      try {
        localStorage.setItem('tasks', JSON.stringify(get().tasks));
      } catch (error) {
        // Revert on failure
        console.error('Failed to persist:', error);
        set({ tasks: previousTasks });
      }
    }
  }))
);
```

### Pattern 2: Normalized State with Computed Groups

**What:** Store tasks as flat array with classification fields. Compute lane groupings via selector hooks rather than duplicating data in state.

**When to use:** Any time you need to display tasks grouped by classification (Chess/Hybrid/Poker) or filtered by column.

**Trade-offs:**
- **Pro:** Single source of truth, no sync issues between denormalized copies
- **Pro:** Reclassification = simple field update, no array splicing between lanes
- **Con:** Re-computation on every render (mitigated with useMemo)

**Example:**
```typescript
// hooks/useTasksByLane.js
export function useTasksByLane() {
  const tasks = useTaskStore(state => state.tasks);

  return useMemo(() => {
    const chess = tasks.filter(t => t.totalScore >= 5 && t.totalScore <= 7);
    const hybrid = tasks.filter(t => t.totalScore >= 8 && t.totalScore <= 10);
    const poker = tasks.filter(t => t.totalScore >= 11 && t.totalScore <= 15);

    return { chess, hybrid, poker };
  }, [tasks]);
}
```

### Pattern 3: Fractional Ordering for Drag-and-Drop

**What:** Instead of reindexing all tasks when one moves, calculate new `order` as average between adjacent tasks.

**When to use:** Reordering tasks within a column during drag-and-drop.

**Trade-offs:**
- **Pro:** O(1) updates instead of O(n) when moving a task
- **Pro:** No database writes for unaffected tasks (important when adding backend sync)
- **Con:** Eventually need to "normalize" orders when they get too close (rare)
- **Con:** Slightly more complex ordering logic

**Example:**
```typescript
// lib/dnd/calculateOrder.js
export function getNewOrder(tasks, overIndex) {
  if (overIndex === 0) {
    return tasks[0] ? tasks[0].order / 2 : 1;
  }

  if (overIndex >= tasks.length) {
    return tasks[tasks.length - 1].order + 1;
  }

  const prevOrder = tasks[overIndex - 1].order;
  const nextOrder = tasks[overIndex].order;
  return (prevOrder + nextOrder) / 2;
}
```

### Pattern 4: Provider-Free Global State (Zustand)

**What:** Use Zustand stores directly without wrapping app in `<Provider>`. Import store hook anywhere in component tree.

**When to use:** All global state (tasks, UI preferences, filters). Local component state still uses useState.

**Trade-offs:**
- **Pro:** No provider nesting hell, cleaner App.jsx
- **Pro:** Can access state outside React (event handlers, utilities)
- **Con:** Less familiar to Redux developers (but simpler API)

**Example:**
```typescript
// stores/taskStore.js
export const useTaskStore = create(/* ... */);

// Any component
import { useTaskStore } from '@/stores/taskStore';

function TaskCard({ taskId }) {
  const task = useTaskStore(state =>
    state.tasks.find(t => t.id === taskId)
  );
  // ...
}
```

### Pattern 5: Custom Hook Abstraction for Drag-and-Drop

**What:** Encapsulate all dnd-kit setup (sensors, collision detection, event handlers) in a custom hook. Components just call `useTaskDragDrop()` and get back minimal API.

**When to use:** TaskBoard component needs drag-and-drop without knowing dnd-kit implementation details.

**Trade-offs:**
- **Pro:** Can swap dnd-kit for pragmatic-drag-and-drop later with minimal changes
- **Pro:** Testing is easier (mock the hook instead of dnd-kit internals)
- **Con:** Extra abstraction layer to maintain

**Example:**
```typescript
// hooks/useTaskDragDrop.js
export function useTaskDragDrop() {
  const moveTask = useTaskStore(state => state.moveTask);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const [newLane, newColumn] = over.id.split(':');
    // Calculate new order, update store
  };

  return {
    sensors: useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor),
      useSensor(TouchSensor)
    ),
    onDragEnd: handleDragEnd
  };
}

// TaskBoard.jsx
function TaskBoard() {
  const { sensors, onDragEnd } = useTaskDragDrop();
  return <DndContext sensors={sensors} onDragEnd={onDragEnd}>...</DndContext>;
}
```

## Data Flow

### Task Creation Flow

```
User clicks "New Task"
    ↓
TaskCreateModal opens
    ↓
User scores 5 dimensions (1-3 each)
    ↓
Live preview: totalScore = sum(dimensions)
    ↓
Classification auto-calculated:
  - 5-7 → Chess
  - 8-10 → Hybrid
  - 11-15 → Poker
    ↓
User clicks "Create"
    ↓
taskStore.addTask({ ...scores, classification })
    ↓
Optimistic update: task appears in correct lane's Backlog column
    ↓
Auto-save to localStorage
    ↓
Modal closes, focus returns to board
```

### Drag-and-Drop Reclassification Flow

```
User drags task from Chess lane to Poker lane
    ↓
onDragStart: Capture task ID, source lane, source column
    ↓
onDragOver: Visual feedback (highlight drop zone)
    ↓
onDragEnd: Validate drop target
    ↓
├─ Same lane, different column?
│     → Update task.column + task.order
│     → Save to localStorage
│
└─ Different lane?
      ↓
   Trigger reclassification modal:
   "This task is currently scored for Chess (score: 6).
    Moving to Poker lane requires re-scoring. Continue?"
      ↓
   User confirms → Open TaskEditModal with dimension scores
      ↓
   User adjusts dimensions → New score: 12 (Poker range)
      ↓
   Update task: { ...dimensions, classification: 'poker', column: 'backlog' }
      ↓
   Task appears in Poker lane
```

### State Synchronization Flow

```
[User Action] → [Zustand Store] → [localStorage]
                       ↓
                  [Selectors] ← [Components Subscribe]
                       ↓
                  [Re-render affected components only]

Example: Moving task from "In Progress" to "Testing"
  1. TaskCard drag ends → useTaskDragDrop hook
  2. Hook calls taskStore.moveTask(id, 'chess', 'testing', newOrder)
  3. Zustand updates tasks array immutably
  4. subscribeWithSelector middleware writes to localStorage
  5. Components subscribed to affected tasks re-render
  6. Other components (different lanes, UI state) don't re-render
```

### Key Data Flows

1. **Task Lifecycle:** Create (modal) → Classify (auto) → Render (lane/column) → Move (drag) → Reclassify (modal if lane changes) → Archive/Delete
2. **Score Calculation:** DimensionCard inputs → Sum dimensions → Classify → Update task → Persist
3. **Persistence:** Every state mutation → debounced localStorage write → error boundary catches quota exceeded

## Mobile-First Considerations

### Touch Event Handling

Modern drag-and-drop libraries (dnd-kit, pragmatic-drag-and-drop) handle touch events natively. Configure sensors with touch support:

```typescript
// lib/dnd/sensors.js
import { TouchSensor, MouseSensor, KeyboardSensor } from '@dnd-kit/core';

export const sensors = [
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,      // Prevent accidental drags during scroll
      tolerance: 5     // Allow 5px movement before starting drag
    }
  }),
  useSensor(MouseSensor),
  useSensor(KeyboardSensor)
];
```

**Touch Target Sizes:** Follow iOS Human Interface Guidelines (44x44pt minimum). Task cards should have minimum height of 56px (touch-friendly).

### Responsive Layout Strategy

**Mobile (<640px):**
- Single lane visible at a time (horizontal swipe between Chess/Hybrid/Poker)
- Vertical scrolling within lane
- Columns stack vertically (Backlog → In Progress → Testing → Done)
- Drag-and-drop: long-press to grab, drag vertically between columns

**Tablet (640px-1024px):**
- Two lanes side-by-side
- Horizontal scrolling for third lane
- Columns remain horizontal within each lane

**Desktop (>1024px):**
- All three lanes side-by-side
- Each lane scrolls independently

**Implementation:**
```typescript
// hooks/useResponsive.js
export function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    visibleLanes: width < 640 ? 1 : width < 1024 ? 2 : 3
  };
}
```

## State Management Deep Dive

### Zustand Store Shape

```typescript
// stores/taskStore.js
interface TaskStore {
  // State
  tasks: Task[];

  // Actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, lane: Lane, column: Column, order: number) => void;
  reclassifyTask: (id: string, newDimensions: Dimensions) => void;
}

// stores/uiStore.js
interface UIStore {
  // State
  viewMode: 'board' | 'list' | 'calendar'; // Future views
  activeLane: 'chess' | 'hybrid' | 'poker'; // For mobile single-lane view
  sortBy: 'order' | 'created' | 'updated';
  filters: {
    hideCompleted: boolean;
    searchQuery: string;
  };

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setActiveLane: (lane: Lane) => void;
  setSortBy: (sort: SortOption) => void;
  updateFilters: (filters: Partial<Filters>) => void;
}
```

### Selector Patterns

**Bad (causes unnecessary re-renders):**
```typescript
const store = useTaskStore(); // Subscribes to entire store
```

**Good (selective subscriptions):**
```typescript
const chessTasks = useTaskStore(state =>
  state.tasks.filter(t => t.classification === 'chess')
);
```

**Best (with shallow equality for objects):**
```typescript
const { addTask, updateTask } = useTaskStore(
  state => ({ addTask: state.addTask, updateTask: state.updateTask }),
  shallow
);
```

### Persistence Middleware

```typescript
// stores/taskStore.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useTaskStore = create(
  subscribeWithSelector((set, get) => ({
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),

    // Actions automatically trigger persistence
    addTask: (task) => set(state => ({
      tasks: [...state.tasks, { ...task, id: crypto.randomUUID() }]
    }))
  }))
);

// Auto-save on any tasks change
useTaskStore.subscribe(
  state => state.tasks,
  tasks => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save:', e);
    }
  }
);
```

## Porting chess-poker-framework.jsx

The existing framework component provides foundational pieces. Here's the mapping:

| Existing Component | New Location | Changes Needed |
|-------------------|--------------|----------------|
| `DIMENSIONS` constant | `lib/scoring/dimensions.js` | Extract as standalone export |
| `RadarChart` SVG component | `components/Visualization/RadarChart.jsx` | Make props configurable (size, colors) |
| `DimensionCard` component | `components/Visualization/DimensionCard.jsx` | Add interactive mode for task creation |
| Tab-based UI | Remove | Replace with kanban board lanes |
| Scoring logic | `lib/scoring/classifier.js` | Extract calculate total → classify logic |

**Key extraction pattern:**
```typescript
// From chess-poker-framework.jsx
const DIMENSIONS = [ /* ... */ ];
const totalScore = dimensions.reduce((sum, d) => sum + d.value, 0);
const classification = totalScore <= 7 ? 'chess' : totalScore <= 10 ? 'hybrid' : 'poker';

// To lib/scoring/classifier.js
export function classifyTask(dimensions) {
  const total = dimensions.reduce((sum, d) => sum + d.value, 0);
  if (total >= 5 && total <= 7) return 'chess';
  if (total >= 8 && total <= 10) return 'hybrid';
  if (total >= 11 && total <= 15) return 'poker';
  throw new Error(`Invalid score: ${total}`);
}
```

## Build Order Implications

Suggested phase structure based on dependencies:

### Phase 1: Foundation (No dependencies)
- Set up project structure
- Port `DIMENSIONS` constant and visualization components (RadarChart, DimensionCard)
- Create Zustand stores (empty actions)
- Implement localStorage persistence utilities

### Phase 2: Static Board (Depends on Phase 1)
- Build TaskBoard layout (3 lanes, columns, no drag-and-drop yet)
- Implement TaskCard display with score visualization
- Create mock data in store to render static board
- Mobile-responsive layout (single lane → multi-lane)

### Phase 3: Task Creation (Depends on Phase 1, 2)
- Build TaskCreateModal with 5-dimension scoring
- Implement classification logic (score → lane)
- Connect to store: addTask action
- Task appears in correct lane's Backlog column

### Phase 4: Drag-and-Drop (Depends on Phase 2, 3)
- Configure dnd-kit sensors for touch/mouse/keyboard
- Implement within-column reordering (same lane)
- Add cross-column movement (same lane)
- Optimistic UI updates + localStorage sync

### Phase 5: Reclassification (Depends on Phase 3, 4)
- Detect cross-lane drag attempts
- Build reclassification confirmation modal
- Implement TaskEditModal (re-score dimensions)
- Update classification + move task to new lane

### Phase 6: Polish & Features
- Bottleneck indicator (lowest dimension score)
- Search/filter tasks
- Compound pattern detection (future)
- Undo/redo (future)

**Critical path:** Phase 1 → 2 → 3 → 4 (MVP achievable without Phase 5, but reclassification adds significant value)

## Anti-Patterns to Avoid

### Anti-Pattern 1: Storing Derived State

**What people do:** Store both `tasks` array and separate `chessTasks`, `hybridTasks`, `pokerTasks` arrays in Zustand.

**Why it's wrong:** Creates sync issues. If you update `tasks`, you must remember to update all derived arrays. Violates single source of truth.

**Do this instead:** Store only `tasks`. Use selector hooks (`useTasksByLane`) with `useMemo` to compute groupings on-demand.

### Anti-Pattern 2: Prop Drilling Drag Handlers

**What people do:** Pass `onDragStart`, `onDragEnd`, `onDragOver` handlers down through 5+ component levels.

**Why it's wrong:** Makes components tightly coupled to drag-and-drop library. Hard to test. Messy prop chains.

**Do this instead:** Use a custom hook (`useTaskDragDrop`) that encapsulates all drag logic. Components subscribe to store state, not drag events.

### Anti-Pattern 3: Blocking UI During localStorage Writes

**What people do:** Synchronously write to localStorage in event handler, show loading spinner during write.

**Why it's wrong:** localStorage is synchronous but fast (< 5ms typically). Blocking UI feels sluggish. User expects instant feedback.

**Do this instead:** Use optimistic updates. Write to localStorage in background (Zustand middleware). If write fails (rare), revert UI state.

### Anti-Pattern 4: Duplicating Task Data in Drag State

**What people do:** Store entire task object in drag event (`active.data.task`). Components read from drag state instead of store.

**Why it's wrong:** Creates temporary copy of task during drag. If task updates mid-drag (unlikely but possible), drag state is stale.

**Do this instead:** Store only task ID in drag state. Components read from store: `useTaskStore(state => state.tasks.find(t => t.id === active.id))`.

### Anti-Pattern 5: Global Re-renders on Task Move

**What people do:** Update entire store state, triggering re-render of all lanes and cards.

**Why it's wrong:** Moving one task shouldn't re-render 50 other task cards. Causes jank, especially on mobile.

**Do this instead:** Use Zustand's selective subscriptions. Cards subscribe only to their specific task: `useTaskStore(state => state.tasks.find(t => t.id === taskId))`.

## Drag-and-Drop Library Decision

**Recommendation: dnd-kit**

**Why dnd-kit over alternatives:**

| Criterion | dnd-kit | pragmatic-drag-and-drop | hello-pangea/dnd |
|-----------|---------|------------------------|------------------|
| Bundle size | 29kb gzipped | 15kb gzipped | 35kb gzipped |
| Touch support | Built-in | Built-in | Built-in |
| Accessibility | Keyboard + screen reader | Limited docs | Good support |
| React integration | Hooks + components | Headless (more setup) | Hooks + components |
| Mobile-first | Excellent (configurable activation) | Excellent | Good |
| Customizability | High (sensors, modifiers, collision) | Very high (fully headless) | Medium (opinionated) |
| Maintenance | Active (2026) | Active (Atlassian) | Active (community fork) |
| Documentation | Excellent | Growing (newer lib) | Good |

**Decision rationale:**
- **Mobile-first requirement:** dnd-kit's touch sensor configuration (delay, tolerance) prevents accidental drags during scroll, critical for mobile kanban.
- **Accessibility:** Keyboard navigation and screen reader support are first-class, not afterthoughts.
- **Future-proofing:** If we need to swap to pragmatic-drag-and-drop later (for bundle size), our `useTaskDragDrop` hook abstraction makes this a localized change.
- **React integration:** Hooks-based API feels natural in React vs. pragmatic's more imperative style.

**When to reconsider:** If bundle size becomes critical (< 100kb total app), pragmatic-drag-and-drop is 14kb smaller. For this app, UX (touch handling) > bundle size.

## Integration Points

### External Services (Future)

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Backend API (future) | Optimistic updates + background sync | Replace localStorage writes with API calls, keep optimistic pattern |
| Real-time sync (future) | WebSocket + conflict resolution | Zustand can subscribe to socket events, merge remote changes |
| Cloud storage (future) | Sync localStorage to cloud on auth | Treat cloud as backup, localStorage remains primary |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| TaskCard ↔ TaskStore | Zustand selectors | Card subscribes to single task by ID, minimal re-renders |
| DragContext ↔ TaskStore | Custom hook bridge | `useTaskDragDrop` translates drag events to store actions |
| Modal ↔ TaskStore | Direct actions | `addTask` / `updateTask` called from modal submit handlers |
| Persistence ↔ TaskStore | Middleware subscription | `subscribeWithSelector` writes to localStorage on task changes |
| RadarChart ↔ Task | Props (dimensions array) | Visualization is pure component, no store access |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-100 tasks | Current architecture is ideal. localStorage handles easily. All tasks loaded in memory. |
| 100-1000 tasks | Add virtualization (react-window) for long columns. Still localStorage, but lazy-load off-screen tasks. |
| 1000+ tasks | Move to IndexedDB for storage (larger quota). Paginate/lazy-load tasks by lane. Consider server sync. |

### First Bottleneck: Rendering Performance

**Symptom:** Lag when dragging task in a column with 50+ tasks.

**Cause:** All TaskCard components re-render on drag event (if not using selective subscriptions).

**Fix:**
1. Ensure cards use selective subscriptions: `useTaskStore(state => state.tasks.find(t => t.id === taskId))`
2. Memoize TaskCard component: `React.memo(TaskCard, (prev, next) => prev.task.id === next.task.id)`
3. Use react-window for columns with 30+ tasks (virtual scrolling)

### Second Bottleneck: localStorage Quota

**Symptom:** "QuotaExceededError" in console when saving tasks.

**Cause:** localStorage limit is ~5-10MB depending on browser. With 1000+ tasks (each ~1kb JSON), you hit limits.

**Fix:**
1. Migrate to IndexedDB (much larger quota, async API)
2. Compress task data before saving (LZ-string library)
3. Archive completed tasks to separate storage or delete after 30 days

## Sources

**Architecture Patterns & Best Practices:**
- [Build a Kanban Board With Drag-and-Drop in React with Shadcn](https://marmelab.com/blog/2026/01/15/building-a-kanban-board-with-shadcn.html) - Optimistic updates, React Admin patterns
- [Building a Drag-and-Drop Kanban Board with React and dnd-kit](https://radzion.com/blog/kanban/) - Component abstraction, fractional ordering
- [React Folder Structure in 5 Steps [2025]](https://www.robinwieruch.de/react-folder-structure/) - Feature-based structure, colocation
- [Guidelines to improve your React folder structure](https://maxrozen.com/guidelines-improve-react-app-folder-structure) - Nesting limits, component organization

**State Management (Zustand):**
- [GitHub - pmndrs/zustand](https://github.com/pmndrs/zustand) - Official docs, selector patterns, middleware
- [Introducing Zustand (State Management)](https://frontendmasters.com/blog/introducing-zustand/) - Hook-based API, provider-free pattern
- [Mastering State Management in React Native with Zustand](https://javascript.plainenglish.io/mastering-state-management-in-react-native-with-zustand-a-modern-guide-d6fb2764cdcb) - subscribeWithSelector patterns

**Drag-and-Drop:**
- [Top 5 Drag-and-Drop Libraries for React in 2026](https://puckeditor.com/blog/top-5-drag-and-drop-libraries-for-react) - Library comparison, bundle sizes
- [dnd kit – a modern drag and drop toolkit for React](https://dndkit.com/) - Core concepts, sensors, accessibility
- [Pragmatic Drag and Drop, the ultimate drag and drop library?](https://www.purplesquirrels.com.au/2024/05/pragmatic-drag-and-drop-the-ultimate-drag-and-drop-library/) - Performance comparison

**Mobile-First & Responsive:**
- [How to Implement Mobile-First Design in React](https://blog.pixelfreestudio.com/blog/how-to-implement-mobile-first-design-in-react/) - Touch events, responsive hooks
- [React Responsive Design: Mobile-First Development Strategy](https://medium.com/@dlrnjstjs/react-responsive-design-mobile-first-development-strategy-5292525fe108) - useState + useEffect window sizing

**localStorage Persistence:**
- [Persisting React State in localStorage](https://www.joshwcomeau.com/react/persisting-react-state-in-localstorage/) - Custom hook pattern, error handling
- [Mastering State Persistence with Local Storage in React](https://medium.com/@roman_j/mastering-state-persistence-with-local-storage-in-react-a-complete-guide-1cf3f56ab15c) - useEffect patterns, JSON parsing

**Data Structures:**
- [Building a Kanban Board With React](https://marmelab.com/blog/2023/07/28/create-a-kanban-board-in-react-admin.html) - Normalized state, useMemo grouping
- [Basic Kanban Board in React](https://medium.com/@jtonti/basic-kanban-board-in-react-593b14300a74) - Multi-lane data structures

---
*Architecture research for: Chess-Poker Task Manager*
*Researched: 2026-02-16*
