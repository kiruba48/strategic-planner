# Chess-Poker Task Manager
## Product Concept Brief

---

## Core Idea

A task management app that **automatically classifies** work as chess-like or poker-like using the 5-dimension framework, then organizes tasks on a **kanban board** optimized for each domain type.

**Value Proposition**: Stop treating all tasks the same. Chess tasks need execution velocity. Poker tasks need strategic timing and relationship prep.

---

## Key Features

### 1. Smart Task Intake
- User creates task with title + optional description
- App presents 5-dimension quick assessment (1-3 scale per dimension)
- Real-time score calculation (5-15 points)
- Auto-classification: Chess (5-7) | Hybrid (8-10) | Poker (11-15)
- Visual indicator: ♟️ | ⚖️ | 🃏

### 2. Domain-Aware Kanban Board

**Chess Lane** (5-7 points)
- Columns: `Backlog → In Progress → Testing → Done`
- Focus: Velocity, automation, verification
- Metrics: Cycle time, completion rate

**Hybrid Lane** (8-10 points)  
- Columns: `Backlog → Technical Work → Stakeholder Review → Done`
- Focus: Decomposition, sequencing
- Shows: Chess component vs Poker component tags

**Poker Lane** (11-15 points)
- Columns: `Backlog → Relationship Prep → Active Negotiation → Resolved`
- Focus: Timing, context, stakeholder readiness
- Shows: Key stakeholders, relationship health, urgency

### 3. Context Enhancement
Each task card shows:
- **Score breakdown** (IC: 2, AA: 3, OV: 1, RS: 3, RV: 2)
- **Bottleneck dimension** (highest score = constraint)
- **Compound pattern** (if hybrid: Wrapped Chess, Sequential, etc.)
- **Recommended next action** based on classification

### 4. Reclassification Flow
- User can re-score if context changes
- Shows "before/after" when score crosses boundaries (e.g., 7→8 moves Chess→Hybrid)
- History log of score changes

---

## User Flow

```
1. Create Task
   ↓
2. Quick Classification (5 questions, ~30 seconds)
   ↓
3. Auto-placement on Board (Chess/Hybrid/Poker lane)
   ↓
4. Move through lane-specific workflow
   ↓
5. Task completion
   ↓
6. [Optional] Retrospective: "Was classification accurate?"
```

---

## Technical Foundation

### Frontend (React)
- **Base Component**: `chess-poker-framework.jsx` (already built)
- **Enhancements**:
  - Kanban drag-and-drop (react-beautiful-dnd)
  - Task persistence (localStorage or backend)
  - Board view with 3 lanes
  - Task card component with score visualization

### Data Model
```javascript
{
  id: "task_123",
  title: "Implement rate limiting",
  description: "...",
  scores: {
    IC: 1,  // Information Completeness
    AA: 1,  // Agent Adaptivity
    OV: 1,  // Outcome Verifiability
    RS: 1,  // Rule Stability
    RV: 1   // Reversibility
  },
  totalScore: 5,
  classification: "chess", // chess | hybrid | poker
  lane: "chess",
  column: "backlog",  // varies by lane
  createdAt: "2026-02-16T10:30:00Z",
  updatedAt: "2026-02-16T10:30:00Z",
  metadata: {
    bottleneckDimension: "IC",
    compoundPattern: null, // or "wrapped_chess", "sequential", etc.
    stakeholders: []  // for poker tasks
  }
}
```

### Suggested Stack
- **Framework**: React (already built)
- **State Management**: Zustand or React Context
- **Drag & Drop**: react-beautiful-dnd
- **Persistence**: 
  - Phase 1: localStorage
  - Phase 2: Backend API (Supabase, Firebase, or custom)
- **Styling**: TailwindCSS (already in framework)

---

## MVP Scope (Phase 1)

**In Scope**:
- ✅ 5-dimension task classification
- ✅ Auto-placement on 3-lane kanban board
- ✅ Drag-and-drop between columns
- ✅ Score visualization per task
- ✅ localStorage persistence

**Out of Scope** (Future):
- ❌ Multi-user collaboration
- ❌ Integrations (Jira, Linear, Notion)
- ❌ AI-assisted classification
- ❌ Analytics dashboard
- ❌ Team/project workspaces

---

## Differentiation

**vs Traditional Kanban** (Trello, Jira):
- Domain-aware columns (chess ≠ poker workflow)
- Classification forces intentional task analysis
- Bottleneck dimension highlights constraint

**vs Getting Things Done** (Todoist, Things):
- Not just priority/context — fundamental nature of work
- Optimizes for *how* to approach task, not just *when*

**vs Smart Task Managers** (Motion, Reclaim):
- Doesn't just schedule — guides strategy per domain
- Makes implicit work patterns explicit

---

## Success Metrics (Post-Launch)

1. **Classification Accuracy**: % of tasks where user agrees with initial classification
2. **Reclassification Rate**: How often users rescore (low = good initial classification)
3. **Completion Velocity**: 
   - Chess tasks: Should complete faster
   - Poker tasks: Should take longer but with fewer rollbacks
4. **User Retention**: Weekly active usage
5. **Bottleneck Insight**: Do users report finding value in knowing their constraint dimension?

---

## Development Roadmap

### Week 1-2: Core Classification
- Port existing `chess-poker-framework.jsx` to app structure
- Build task creation flow with 5-dimension input
- Implement scoring logic and classification

### Week 3-4: Kanban Board
- 3-lane board layout (Chess, Hybrid, Poker)
- Lane-specific columns
- Drag-and-drop functionality
- Task card design with score display

### Week 5-6: Polish & Persistence
- localStorage integration
- Task editing/reclassification
- Responsive design
- Basic analytics (tasks by classification)

### Week 7-8: User Testing & Refinement
- Self-dogfooding (use it for own tasks)
- Gather feedback on classification accuracy
- Refine dimension questions for clarity
- Launch MVP

---

## Open Questions

1. **Column Customization**: Should users customize columns per lane, or use opinionated defaults?
2. **Hybrid Tasks**: Show single card or split into chess/poker sub-tasks?
3. **Stakeholder Tracking**: For poker tasks, how to represent stakeholder relationships?
4. **Mobile First**: Desktop or mobile-first design?
5. **Export**: Should users export to Jira/Linear, or keep standalone?

---

## Next Steps

1. Set up React project structure
2. Extract classification logic from `chess-poker-framework.jsx`
3. Design task data model
4. Wireframe 3-lane kanban layout
5. Build task creation + classification flow
6. Implement kanban board with drag-and-drop

---

**Target Users**: 
- Software engineers (especially Staff+)
- Product managers
- Technical leads
- Anyone with mixed technical + stakeholder work

**Core Value**: 
Making the invisible visible — helping people see that "why is this taking so long?" often means "this is poker-like work disguised as chess-like work."
