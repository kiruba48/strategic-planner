# Feature Research

**Domain:** Personal Task Management / Classification-Based Kanban
**Researched:** 2026-02-16
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Visual kanban board with columns | Core kanban paradigm - users expect column-based task flow | LOW | 3 parallel boards (Chess/Hybrid/Poker) adds complexity beyond standard single board |
| Drag-and-drop task movement | Standard interaction for kanban boards, especially mobile touch interfaces | MEDIUM | Touch support essential for mobile-first; requires state management for cross-lane moves |
| Task card CRUD operations | Basic expectation - create, read, update, delete tasks | LOW | Standard form operations |
| Task details (title, description, due date) | Minimal context needed to track work | LOW | Due dates are table stakes for personal task managers |
| Mobile-responsive design | Personal task managers are accessed on-the-go | MEDIUM | Mobile-first constraint requires touch-optimized UI, not desktop-with-responsive |
| Data persistence | Users expect tasks to survive browser refresh | LOW | localStorage is specified, prevents backend complexity |
| Visual progress indicators | Users need to see "what's done" at a glance | LOW | Per-column counts, completion percentages |
| Task filtering/sorting | Basic organization - by date, priority, status | MEDIUM | Enhanced by classification dimensions in this product |
| Quick task creation | Low-friction task entry (keyboard shortcut, quick-add button) | LOW | Critical for personal tools - reduce friction to capture |
| Task search | Finding specific tasks in growing lists | MEDIUM | Search by title/description/tags; enhanced by dimension values |
| Completed task archiving | Keep active views clean without losing history | LOW | Prevents UI clutter, maintains historical record |
| Task status visibility | Clear indication of backlog vs in-progress vs done | LOW | Built into kanban columns, but compound patterns add layer |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **5-dimension classification scoring** | Transforms vague "priority" into structured decision framework | HIGH | Core differentiator - Chess/Poker lens on work classification |
| **Radar chart visualization per task** | Visual pattern recognition beats reading 5 numbers | MEDIUM | Libraries exist (Chart.js, Recharts); 5-8 axes is best practice range |
| **Domain-specific kanban lanes** | Different work types need different workflows (Chess ≠ Poker) | MEDIUM | 3 parallel boards with custom columns per classification |
| **Automatic task reclassification** | Work changes nature - tool adapts the workflow | MEDIUM | Rescore task → move to appropriate lane + show before/after comparison |
| **Bottleneck dimension indicator** | Identifies which dimension is blocking progress | MEDIUM | Highlights lowest-scoring dimension on each card |
| **Compound pattern detection** | Recognizes Wrapped Chess, Disguised Poker, Sequential, Parallel | HIGH | Pattern matching across task relationships, not isolated scoring |
| **Before/after classification comparison** | Track how task understanding evolved | LOW | Simple diff view when task moves between classifications |
| **Dimension-based filtering** | Filter by specific dimension scores (e.g., "show all low-verifiability tasks") | MEDIUM | Leverages unique classification system for novel queries |
| **Classification distribution analytics** | See portfolio balance (too much Poker? not enough Chess?) | MEDIUM | Aggregate view of work types, informs strategic decisions |
| **Dimension trend visualization** | Track how dimensions change over time per task | MEDIUM | Line chart showing score evolution as task progresses |
| **Offline-first with localStorage** | Works without internet, no server dependency | LOW | Reduces complexity vs cloud sync, but limits multi-device |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Multi-user collaboration | "Team task management is popular" | Adds auth, sync conflicts, permissions - contradicts "personal tool" positioning | Focus on single-user excellence; export/share reports if needed |
| Cloud sync across devices | "I want tasks everywhere" | Requires backend, sync conflict resolution, accounts - bloats simple tool | localStorage persistence per device; import/export for migration |
| Unlimited custom dimensions | "What if I need more than 5?" | Dilutes Chess-Poker framework; radar charts break beyond 8 axes | Keep 5-dimension model focused; add notes field for qualitative context |
| Automated task prioritization | "AI should tell me what to work on" | Removes user agency, misses context, creates black-box decisions | Provide dimension insights; user decides priority from classification |
| Real-time notifications | "Alert me when tasks are due" | Adds notification infra, drains battery, annoys users | Focus on in-app visual cues (overdue styling, today view) |
| Calendar integration | "Sync with Google Calendar" | Complicates mobile-first localStorage design, adds external dependency | Built-in due date views sufficient for personal planning |
| Time tracking | "Log hours per task" | Feature creep - not core to classification framework | Focus on classification insights, not time accounting |
| Subtasks/nested tasks | "Break big tasks down" | Complicates UI on mobile, unclear how to score parent vs child tasks | Use checklist in task description; encourage atomic task creation |
| Custom column workflows | "Let me define my own columns" | Undermines domain-specific workflows (Chess/Hybrid/Poker lanes) | Stick to researched workflows per classification type |
| Email-to-task creation | "Forward emails to create tasks" | Requires email parsing, backend service, privacy concerns | Manual quick-add is fast enough for personal use |

## Feature Dependencies

```
Data Persistence (localStorage)
    └──requires──> Task CRUD operations
                       └──requires──> Visual Kanban Board
                                          └──enhances──> Drag-and-Drop

5-Dimension Scoring
    └──requires──> Task Classification (Chess/Hybrid/Poker)
                       └──requires──> Domain-Specific Lanes
                       └──enables──> Task Reclassification
                       └──enables──> Dimension-Based Filtering
                       └──enables──> Bottleneck Indicator

Radar Chart Visualization
    └──requires──> 5-Dimension Scoring
                       └──enhances──> Bottleneck Indicator

Compound Pattern Detection
    └──requires──> 5-Dimension Scoring
                       └──requires──> Task Relationships (implicit or explicit)

Classification Distribution Analytics
    └──requires──> 5-Dimension Scoring
    └──requires──> Multiple tasks with classifications

Task Archiving
    └──enhances──> Completed tasks cleanup
    └──conflicts──> Dimension trend visualization (needs historical data)
```

### Dependency Notes

- **Data Persistence → Task CRUD:** No persistence = tasks lost on refresh, core functionality broken
- **5-Dimension Scoring → Classification:** Scoring IS the classification mechanism; one cannot exist without the other
- **Radar Chart → 5-Dimension Scoring:** Chart meaningless without dimension data; provides visual pattern recognition
- **Compound Pattern Detection → Task Relationships:** Patterns only detectable when tasks relate (e.g., Sequential = Task A then B)
- **Archiving conflicts with Trends:** If archived tasks are hidden from trend calculations, history is incomplete; need "soft archive"

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the Chess-Poker classification concept.

- [x] **Visual 3-lane kanban board** — Core UI: Chess lane, Hybrid lane, Poker lane with domain-specific columns
- [x] **Task CRUD with 5-dimension scoring** — Create task, score 5 dimensions (1-3 each), auto-classify to lane
- [x] **Radar chart per task card** — Visual representation of 5 dimensions on each card
- [x] **Drag-and-drop between columns** — Move tasks through workflow stages within a lane
- [x] **Bottleneck dimension indicator** — Highlight lowest-scoring dimension on each card
- [x] **localStorage persistence** — Tasks survive browser refresh
- [x] **Mobile-first responsive design** — Touch-optimized for phone/tablet use
- [x] **Task reclassification** — Rescore task → auto-move to appropriate lane with before/after comparison
- [x] **Quick task creation** — Fast-entry form (title + quick dimension scoring)
- [x] **Basic filtering** — Filter by lane, by dimension score ranges

**Rationale:** These features prove the core value proposition: "structured classification replaces vague priority." Without 5-dimension scoring + visualization + domain-specific workflows, the product is just another kanban board.

### Add After Validation (v1.x)

Features to add once core classification model is validated by real usage.

- [ ] **Compound pattern detection** — Trigger: Users manually note "this is wrapped chess" repeatedly → automate pattern recognition
- [ ] **Classification distribution analytics** — Trigger: Users accumulate 20+ tasks → portfolio-level insights become meaningful
- [ ] **Dimension trend visualization** — Trigger: Tasks stay active for weeks → tracking score evolution over time adds value
- [ ] **Advanced search** — Trigger: Task count exceeds 50 → search by dimension values, patterns, date ranges
- [ ] **Task archiving with analytics preservation** — Trigger: Completed tasks clutter UI → soft archive (hidden but queryable)
- [ ] **Keyboard shortcuts** — Trigger: Power users request faster navigation → add quick-add (Cmd+K), column jump, etc.
- [ ] **Dimension-based sorting** — Trigger: Users want "show highest Information Completeness first" → sort by any dimension
- [ ] **Export task history** — Trigger: Users want to share insights or migrate → JSON/CSV export

**Rationale:** These enhance the core model but aren't needed to validate the classification approach. Add when user behavior demonstrates the need.

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Explicit task relationships** — Link tasks as "Sequential," "Parallel," "Blocking" for better pattern detection
- [ ] **Custom classification thresholds** — Let users adjust Chess (5-7) vs Hybrid (8-10) vs Poker (11-15) score ranges
- [ ] **Historical classification heatmap** — Visualize how task portfolio composition changed over months
- [ ] **Recommendation engine** — "Based on your Chess tasks, consider testing these hypothesis patterns"
- [ ] **Multi-device sync** — If users demand it, implement cloud backend; but contradicts localStorage simplicity
- [ ] **Collaboration (view-only sharing)** — Share a read-only snapshot of classification insights with others
- [ ] **Integration APIs** — Export to other tools if this becomes "source of truth" for work classification

**Rationale:** These add significant complexity. Only pursue if the core classification model proves valuable and users demand expansion.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| 5-dimension classification scoring | HIGH | HIGH | P1 |
| Visual 3-lane kanban board | HIGH | MEDIUM | P1 |
| Radar chart visualization | HIGH | MEDIUM | P1 |
| Task reclassification | HIGH | MEDIUM | P1 |
| Drag-and-drop task movement | HIGH | MEDIUM | P1 |
| localStorage persistence | HIGH | LOW | P1 |
| Mobile-first responsive UI | HIGH | MEDIUM | P1 |
| Bottleneck dimension indicator | MEDIUM | MEDIUM | P1 |
| Quick task creation | MEDIUM | LOW | P1 |
| Task filtering (basic) | MEDIUM | MEDIUM | P1 |
| Compound pattern detection | HIGH | HIGH | P2 |
| Classification distribution analytics | MEDIUM | MEDIUM | P2 |
| Dimension trend visualization | MEDIUM | MEDIUM | P2 |
| Task archiving | MEDIUM | LOW | P2 |
| Advanced search | MEDIUM | MEDIUM | P2 |
| Keyboard shortcuts | LOW | LOW | P2 |
| Export task history | LOW | LOW | P2 |
| Explicit task relationships | MEDIUM | HIGH | P3 |
| Custom classification thresholds | LOW | MEDIUM | P3 |
| Multi-device cloud sync | MEDIUM | HIGH | P3 |

**Priority key:**
- **P1: Must have for launch** — Validates core classification value proposition
- **P2: Should have, add when possible** — Enhances validated model, adds polish
- **P3: Nice to have, future consideration** — Expands scope beyond MVP validation

## Competitor Feature Analysis

| Feature | Trello (General Kanban) | Things 3 (Personal GTD) | Notion (All-in-One) | Our Approach (Chess-Poker Classifier) |
|---------|-------------------------|-------------------------|---------------------|---------------------------------------|
| **Task organization** | Single board with custom columns | Areas, Projects, Today/Upcoming/Someday | Databases with multiple views | 3 parallel boards (Chess/Hybrid/Poker) with domain-specific columns |
| **Prioritization** | Labels, due dates | Manual ordering, Today list | Manual priority property | **5-dimension scoring → automatic classification** |
| **Visualization** | Board/Timeline/Calendar views | List-based, minimal visualization | Table/Board/Calendar/Gallery | **Radar chart per task showing dimension breakdown** |
| **Mobile experience** | Good drag-and-drop, touch-optimized | Excellent mobile-first design | Complex on mobile due to feature depth | Mobile-first with touch-optimized dimension scoring |
| **Workflow customization** | Fully custom columns per board | Fixed GTD structure | Unlimited customization | **Fixed domain-specific workflows per classification** |
| **Analytics** | Basic card counts, Butler automation | None (focuses on simplicity) | Manual with databases/formulas | **Classification distribution, dimension trends, pattern detection** |
| **Collaboration** | Team-focused (comments, @mentions, sharing) | Single-user only | Team-focused (real-time, permissions) | Single-user (personal classification tool) |
| **Data model** | Flat cards with labels/checklists | Hierarchical (Areas → Projects → Tasks) | Relational databases | **Dimensional scoring with classification-based routing** |
| **Automation** | Butler (rule-based triggers) | None | Limited native, requires integrations | **Auto-reclassification when dimensions change** |
| **Offline capability** | Limited (requires sync) | Full offline with iCloud sync | Limited (web-based) | **Full offline with localStorage** |

**Key Differentiator:** No competitor offers **structured multi-dimensional work classification** with **automatic workflow routing** based on task nature. Trello/Notion are generic boards; Things 3 is GTD-focused. Chess-Poker framework is a unique lens.

## Personal vs Team Task Manager Implications

Based on research, personal task managers differ significantly from team tools:

### What Personal Tools Skip (That We Can Ignore)

- **Real-time collaboration** — No @mentions, comments, assignments
- **Permissions/roles** — No admin/member/viewer complexity
- **Notification systems** — No push alerts, email digests
- **Activity feeds** — No "who changed what when" audit logs
- **Team analytics** — No velocity, burndown, capacity planning

### What Personal Tools Emphasize (That We Must Prioritize)

- **Speed of task entry** — Quick-add shortcuts, minimal required fields (title + dimensions)
- **Mobile-first design** — Personal tools used on-the-go, not just at desk
- **Simplicity over flexibility** — Opinionated workflows (domain-specific lanes) beat infinite customization
- **Offline reliability** — No dependency on network/server availability
- **Privacy by default** — localStorage = no data leaves device, no accounts needed
- **Focus/clarity** — Today view, bottleneck indicators, visual cues over complex queries

### What This Means for Feature Decisions

1. **No collaboration features in MVP** — Contradicts "personal tool" positioning, adds complexity for zero value
2. **Mobile-first, not mobile-responsive** — Design for touch/small screens FIRST, desktop is secondary
3. **Opinionated workflows** — Don't offer "custom columns" - Chess/Hybrid/Poker lanes are researched, fixed patterns
4. **Offline-first architecture** — localStorage not as fallback, but as primary data store
5. **Minimal onboarding friction** — No signup, no tutorial, immediate value (create task → see classification)

## Classification-Specific Feature Insights

Based on research into prioritization systems (Eisenhower Matrix, Priority Matrix), our 5-dimension approach offers:

### Advantages Over Traditional Priority Systems

| Traditional Approach | Chess-Poker Classification |
|---------------------|---------------------------|
| **Eisenhower:** 2 dimensions (Urgent/Important) | **5 dimensions:** Information Completeness, Agent Adaptivity, Outcome Verifiability, Rule Stability, Reversibility |
| **Single priority score** (High/Medium/Low) | **Multi-dimensional profile** → reveals task nature, not just rank |
| **Manual classification** ("Is this urgent?") | **Structured scoring** (1-3 per dimension) → consistent classification |
| **Static categorization** | **Dynamic reclassification** when task understanding evolves |
| **No workflow guidance** beyond priority | **Domain-specific workflows** matched to task type (Chess ≠ Poker process) |

### Unique Capabilities Enabled

1. **Bottleneck identification** — Traditional priority doesn't reveal "low verifiability is blocking this task"
2. **Portfolio insights** — "80% of my work is Poker, but I'm treating it like Chess" → strategic realization
3. **Pattern recognition** — "This looks like Chess but has Poker wrapped around it" → avoid misclassification
4. **Process matching** — Chess tasks use Testing column; Poker tasks use Negotiation column → appropriate workflows
5. **Classification trends** — "This task started as Chess but evolved into Hybrid" → track understanding evolution

### Feature Implications

- **Radar chart is critical** — 5 dimensions are too many to parse as numbers; visual pattern recognition essential
- **Bottleneck indicator adds value** — Surfaces "which dimension is the problem" without user analysis
- **Reclassification must be smooth** — Tasks change nature; tool should make re-scoring + lane-switching seamless
- **Domain-specific columns justified** — Different task types need different stages (Testing vs Negotiation)

## Sources

### Kanban Board Features
- [What is a kanban board? | Atlassian](https://www.atlassian.com/agile/kanban/boards)
- [Kanban Boards in 2026: AI Task Prioritization](https://asrify.com/blog/ai-kanban-boards-2026)
- [What Are the Vital Kanban Board Features in 2026?](https://businessmap.io/blog/best-kanban-board-features)
- [Top Kanban Boards for Mobile-First Workflows in 2026](https://www.any.do/blog/top-kanban-boards-for-mobile-first-workflows-in-2026/)

### Personal vs Team Task Management
- [26 Best Personal Task Management Software Reviewed in 2026](https://thedigitalprojectmanager.com/tools/best-personal-task-management-software/)
- [Personal vs. team task management](http://www.taskmanagementguide.com/solutions/task-management-solution/personal-task-management-team-task-management.php)
- [When to use Microsoft Project, Planner, To Do, or the Tasks app in Teams](https://support.microsoft.com/en-us/office/when-to-use-microsoft-project-planner-to-do-or-the-tasks-app-in-teams-8f950d32-d5f4-40db-a8b7-4d1b82b55e17)

### Competitor Analysis
- [Notion vs Trello: Comparison and Review (2026)](https://www.nuclino.com/solutions/notion-vs-trello)
- [Things 3 and GTD](https://forum.gettingthingsdone.com/threads/things-3-and-gtd.13356/)
- [Review: OmniFocus vs. Things](https://www.peterakkies.net/omnifocus-vs-things)

### Priority and Classification Systems
- [Priority Matrix Method: Master Task Management in Minutes](https://checklist.com/tips/priority-matrix-method)
- [Eisenhower Matrix - Task Priority Tool](https://stealthagents.com/eisenhower-matrix-task-priority-tool/)
- [Priority Matrix: Definition, Examples & How to Use It](https://www.freshworks.com/freshservice/priority-matrix/)

### Visualization and Radar Charts
- [What is a Radar Chart? A Complete Guide + 10 Radar Chart Templates](https://visme.co/blog/radar-chart/)
- [Radar chart explained: When they work, when they fail, and how to use them right](https://www.highcharts.com/blog/tutorials/radar-chart-explained-when-they-work-when-they-fail-and-how-to-use-them-right/)
- [Radar Charts: Best Practices and Examples](https://www.boldbi.com/blog/radar-charts-best-practices-and-examples/)

### Mobile and Offline Features
- [Local-first architecture with Expo](https://docs.expo.dev/guides/local-first/)
- [Offline data | web.dev](https://web.dev/learn/pwa/offline-data)
- [Drag & Drop Kanban Boards](https://toggl.com/plan/boards)

### Task Management Features
- [Completing & Archiving Personal Tasks | Any.do Help Center](https://support.any.do/en/articles/8635866-completing-archiving-personal-tasks)
- [Complete and Archive Finished Tasks – MeisterTask](https://support.meistertask.com/hc/en-us/articles/360015801919-Complete-and-Archive-Finished-Tasks)
- [Filtering and Sorting Task List](https://tmetric.com/help/tasks/filtering-and-sorting-task-list)

---
*Feature research for: Chess-Poker Task Manager (Classification-Based Personal Kanban)*
*Researched: 2026-02-16*
*Confidence: MEDIUM — Based on WebSearch results from established task management platforms and priority systems research. No official docs for Chess-Poker framework (novel approach), but component features (kanban, radar charts, classification systems) are well-documented.*
