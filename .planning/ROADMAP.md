# Roadmap: Chess-Poker Task Manager

## Overview

This roadmap transforms a novel 5-dimension classification system into a working personal task manager. Starting with project foundation and component porting (Phase 1), we establish the core classification and CRUD operations (Phases 2-3), add touch-optimized drag-and-drop within lanes (Phase 4), enable cross-lane reclassification (Phase 5), layer on filtering and search (Phase 6), implement task archiving (Phase 7), add differentiating visualizations (Phase 8), and finish with production-grade polish (Phase 9). The journey delivers incremental value: static board validates layout, classification proves the concept, drag-and-drop enables workflow, and each subsequent phase adds capabilities that leverage the unique dimension-based model.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Static Board** - Project setup, component porting, mobile-responsive layout
- [ ] **Phase 2: Classification System** - 5-dimension scoring with auto-classification
- [ ] **Phase 3: Task CRUD Operations** - Create, read, update, delete tasks with persistence
- [ ] **Phase 4: Drag-and-Drop Within Lanes** - Touch-optimized task movement within same lane
- [ ] **Phase 5: Cross-Lane Reclassification** - Task re-scoring and lane migration
- [ ] **Phase 6: Filtering & Search** - Filter by lane, column, dimensions; search by title/description
- [ ] **Phase 7: Task Archiving** - Soft archive completed tasks to keep board clean
- [ ] **Phase 8: Differentiating Visualizations** - Bottleneck indicators, classification analytics
- [ ] **Phase 9: Polish & Hardening** - Production readiness, error handling, multi-tab sync

## Phase Details

### Phase 1: Foundation & Static Board
**Goal**: Establish architecture and mobile-responsive layout with ported visualization components
**Depends on**: Nothing (first phase)
**Requirements**: KANB-01, KANB-02, KANB-03, KANB-04, MOBL-03
**Success Criteria** (what must be TRUE):
  1. User sees a 3-lane kanban board (Chess/Hybrid/Poker) with correct column labels per lane
  2. Board adapts between mobile (single-lane view) and desktop (3-lane view) at appropriate breakpoints
  3. Mock tasks display with radar charts showing 5-dimension score profiles
  4. Project runs locally with Vite + React 19 + TailwindCSS v4 + Zustand
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Project scaffold, dark theme, stores, scoring lib, seed data
- [ ] 01-02-PLAN.md — Board layout, sidebar, tab bar, lanes, columns, task cards
- [ ] 01-03-PLAN.md — RadarChart visualization, mobile swipe/dots, visual checkpoint

### Phase 2: Classification System
**Goal**: User can score tasks on 5 dimensions with automatic Chess/Hybrid/Poker classification
**Depends on**: Phase 1
**Requirements**: CLAS-01, CLAS-02, CLAS-03
**Success Criteria** (what must be TRUE):
  1. User can open a classification form and score a task 1-3 on all 5 dimensions (IC, AA, OV, RS, RV)
  2. Form shows live classification preview (total score → Chess 5-7 / Hybrid 8-10 / Poker 11-15)
  3. User can use quick-classify presets (Chess/Hybrid/Poker buttons) to auto-fill dimension scores
  4. Classification form includes contextual help for each dimension in plain language
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 3: Task CRUD Operations
**Goal**: User can create, edit, and delete tasks with localStorage persistence
**Depends on**: Phase 2
**Requirements**: TASK-01, TASK-02, TASK-03, TASK-04, DATA-01
**Success Criteria** (what must be TRUE):
  1. User can create a task with title, optional description, and dimension scores (via classification form)
  2. Created tasks appear in the correct lane's Backlog column based on auto-classification
  3. User can edit an existing task's title, description, and dimension scores
  4. User can delete a task from any column
  5. All tasks persist across browser refresh (stored in localStorage)
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 4: Drag-and-Drop Within Lanes
**Goal**: User can drag tasks between columns within the same lane using touch or mouse
**Depends on**: Phase 3
**Requirements**: KANB-05, KANB-06, MOBL-01, MOBL-02
**Success Criteria** (what must be TRUE):
  1. User can drag a task from one column to another within the same lane (e.g., Chess Backlog → In Progress)
  2. User can reorder tasks within the same column via drag-and-drop
  3. Drag-and-drop works reliably on touch devices (distinguishes drag from scroll with 250ms delay)
  4. Each column displays task count as progress indicator
  5. Task positions persist across browser refresh
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 5: Cross-Lane Reclassification
**Goal**: User can re-score tasks to change classification and migrate between lanes
**Depends on**: Phase 4
**Requirements**: CLAS-04, CLAS-05
**Success Criteria** (what must be TRUE):
  1. User can open a task's classification form to re-score dimensions
  2. When classification changes (e.g., Chess → Hybrid), app shows before/after comparison
  3. Reclassified task moves to the new lane's Backlog column automatically
  4. Task retains title, description, and history through reclassification
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 6: Filtering & Search
**Goal**: User can filter tasks by lane, column, dimension scores and search by text
**Depends on**: Phase 3
**Requirements**: TASK-05, DATA-02, DATA-03
**Success Criteria** (what must be TRUE):
  1. User can filter visible tasks by lane (Chess/Hybrid/Poker)
  2. User can filter visible tasks by column status (Backlog, In Progress, etc.)
  3. User can search tasks by title or description text
  4. Filtering and search work together (cumulative filters)
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 7: Task Archiving
**Goal**: User can archive completed tasks to keep active board clean
**Depends on**: Phase 3
**Requirements**: TASK-06, TASK-07
**Success Criteria** (what must be TRUE):
  1. User can archive a task from Done/Resolved columns
  2. Archived tasks disappear from main board but remain in storage
  3. User can view archived tasks in a separate view
  4. User can restore archived tasks to their original lane's Backlog
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 8: Differentiating Visualizations
**Goal**: User sees bottleneck dimensions and portfolio-level classification analytics
**Depends on**: Phase 3
**Requirements**: VIZN-01, VIZN-02, VIZN-03
**Success Criteria** (what must be TRUE):
  1. Each task card displays a radar chart showing 5-dimension score profile
  2. Each task card highlights the bottleneck dimension (highest score = primary constraint)
  3. Each task card shows classification badge (Chess/Hybrid/Poker with emoji)
  4. User can view classification distribution analytics (how many tasks in each domain)
**Plans**: TBD

Plans:
- [ ] TBD

### Phase 9: Polish & Hardening
**Goal**: Production-ready app with robust error handling and multi-tab synchronization
**Depends on**: Phases 1-8
**Requirements**: (No direct requirements, addresses production readiness)
**Success Criteria** (what must be TRUE):
  1. App warns user when localStorage approaches capacity (80% full)
  2. App implements LRU cleanup for old completed tasks when storage is constrained
  3. Changes in one browser tab sync to other open tabs automatically
  4. User can export all tasks as JSON for backup
  5. User can import previously exported task data
**Plans**: TBD

Plans:
- [ ] TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Static Board | 0/3 | Planned | - |
| 2. Classification System | 0/0 | Not started | - |
| 3. Task CRUD Operations | 0/0 | Not started | - |
| 4. Drag-and-Drop Within Lanes | 0/0 | Not started | - |
| 5. Cross-Lane Reclassification | 0/0 | Not started | - |
| 6. Filtering & Search | 0/0 | Not started | - |
| 7. Task Archiving | 0/0 | Not started | - |
| 8. Differentiating Visualizations | 0/0 | Not started | - |
| 9. Polish & Hardening | 0/0 | Not started | - |
