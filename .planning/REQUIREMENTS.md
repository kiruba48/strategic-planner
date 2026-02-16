# Requirements: Chess-Poker Task Manager

**Defined:** 2026-02-16
**Core Value:** Stop treating all tasks the same — chess tasks need execution velocity, poker tasks need strategic timing and relationship prep.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Classification

- [ ] **CLAS-01**: User can score a task on 5 dimensions (IC, AA, OV, RS, RV) using a 1-3 scale per dimension
- [ ] **CLAS-02**: App automatically classifies task as Chess (5-7), Hybrid (8-10), or Poker (11-15) based on total score
- [ ] **CLAS-03**: App automatically places task in the correct lane based on classification
- [ ] **CLAS-04**: User can re-score a task's dimensions to trigger reclassification
- [ ] **CLAS-05**: App shows before/after comparison when a task's classification changes

### Kanban Board

- [ ] **KANB-01**: User sees a 3-lane kanban board with Chess, Hybrid, and Poker lanes
- [ ] **KANB-02**: Chess lane has columns: Backlog, In Progress, Testing, Done
- [ ] **KANB-03**: Hybrid lane has columns: Backlog, Technical Work, Stakeholder Review, Done
- [ ] **KANB-04**: Poker lane has columns: Backlog, Relationship Prep, Active Negotiation, Resolved
- [ ] **KANB-05**: User can drag-and-drop tasks between columns within a lane (touch-optimized)
- [ ] **KANB-06**: User sees task count per column as progress indicator

### Task Management

- [ ] **TASK-01**: User can create a task with title and optional description
- [ ] **TASK-02**: User can edit a task's title, description, and dimension scores
- [ ] **TASK-03**: User can delete a task
- [ ] **TASK-04**: User can quickly create a task with minimal friction (title + dimension scoring in one flow)
- [ ] **TASK-05**: User can search tasks by title or description
- [ ] **TASK-06**: User can archive completed tasks to keep active board clean
- [ ] **TASK-07**: User can view archived tasks separately

### Visualization

- [ ] **VIZN-01**: Each task card displays a radar chart showing the 5-dimension score profile
- [ ] **VIZN-02**: Each task card highlights the bottleneck dimension (highest score = primary constraint)
- [ ] **VIZN-03**: Each task card shows the classification badge (Chess/Hybrid/Poker with emoji)

### Data & Filtering

- [ ] **DATA-01**: All tasks persist in localStorage across browser refresh
- [ ] **DATA-02**: User can filter tasks by lane (Chess/Hybrid/Poker)
- [ ] **DATA-03**: User can filter tasks by column status

### Mobile & Responsiveness

- [ ] **MOBL-01**: App is usable on mobile phone screens (375px+) with touch-optimized interactions
- [ ] **MOBL-02**: Drag-and-drop works reliably on touch devices (distinguishes drag from scroll)
- [ ] **MOBL-03**: App adapts layout between mobile (single-lane view) and desktop (multi-lane view)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Classification

- **CLAS-06**: App detects compound patterns (Wrapped Chess, Disguised Poker, Sequential, Parallel)
- **CLAS-07**: User can view compound pattern label and description on task cards

### Advanced Visualization

- **VIZN-04**: User can see dimension trend visualization showing how scores changed over time per task
- **VIZN-05**: User can see classification distribution analytics (portfolio balance of Chess vs Hybrid vs Poker)

### Advanced Filtering & Search

- **DATA-04**: User can filter tasks by specific dimension score ranges
- **DATA-05**: User can search by dimension values and classification type
- **DATA-06**: User can sort tasks by any dimension score

### Productivity

- **PROD-01**: User can use keyboard shortcuts for common actions (quick-add, navigation)
- **PROD-02**: User can export task history as JSON/CSV

### Data Management

- **DATA-07**: App auto-archives completed tasks after configurable period
- **DATA-08**: App monitors localStorage usage and warns at capacity limits

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Multi-user collaboration | Personal tool — no comments, assignments, sharing |
| Cloud sync / backend | localStorage-first, no server dependency for v1 |
| Custom dimensions beyond 5 | Dilutes Chess-Poker framework; radar charts break beyond 8 axes |
| AI-assisted classification | Manual scoring is intentional — builds user understanding |
| Push notifications | Adds infra complexity, drains battery, not needed for personal tool |
| Calendar integration | Complicates localStorage design, adds external dependency |
| Time tracking | Feature creep — not core to classification framework |
| Subtasks / nested tasks | Complicates mobile UI; unclear how to score parent vs child |
| Custom column workflows | Undermines domain-specific workflows per classification |
| Email-to-task creation | Requires email parsing, backend service, privacy concerns |
| OAuth / authentication | No accounts needed for local-only personal tool |
| Due dates | Deferred — classification is the primary organizing principle, not dates |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (populated during roadmap creation) | | |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 0
- Unmapped: 22 (pending roadmap creation)

---
*Requirements defined: 2026-02-16*
*Last updated: 2026-02-16 after initial definition*
