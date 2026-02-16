# Chess-Poker Task Manager

## What This Is

A personal task management app that classifies work using the Chess-Poker 5-dimension framework (Information Completeness, Agent Adaptivity, Outcome Verifiability, Rule Stability, Reversibility), then organizes tasks on a domain-aware kanban board with lanes optimized for chess-like, hybrid, and poker-like work. Built as a responsive web app, mobile-first.

## Core Value

Stop treating all tasks the same — chess tasks need execution velocity, poker tasks need strategic timing and relationship prep. Making the invisible visible helps you see that "why is this taking so long?" often means poker-like work disguised as chess-like work.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 5-dimension task classification with 1-3 scoring per dimension
- [ ] Auto-classification into Chess (5-7) / Hybrid (8-10) / Poker (11-15) domains
- [ ] 3-lane kanban board with domain-specific columns
- [ ] Task creation with title, optional description, and dimension scoring
- [ ] Drag-and-drop task movement through lane-specific columns
- [ ] Score visualization per task card (breakdown, bottleneck dimension, compound pattern)
- [ ] Task reclassification flow with before/after comparison
- [ ] localStorage persistence
- [ ] Mobile-first responsive design

### Out of Scope

- Multi-user collaboration — personal tool, not a team product
- Integrations (Jira, Linear, Notion) — standalone for now
- AI-assisted classification — manual scoring is intentional
- Analytics dashboard — ship core experience first
- Team/project workspaces — single user
- Backend/cloud sync — local-first, sync is a future concern
- OAuth/authentication — no accounts needed for local tool

## Context

An existing `chess-poker-framework.jsx` React component exists in another project and will be ported as the classification foundation. It includes:
- Full DIMENSIONS data model (5 dimensions, 3 levels each, with questions, labels, descriptions)
- EXAMPLES array (15 pre-scored reference tasks across domains)
- COMPOUND_PATTERNS definitions (Wrapped Chess, Disguised Poker, Sequential, Parallel)
- `getClassification(total)` scoring logic with 4 classification tiers
- DimensionCard and RadarChart UI components
- Tab-based UI (Classifier, Framework, Patterns, Examples)

The existing component is educational/reference — the task manager builds on top of it with CRUD, persistence, and the kanban board.

### Lane Definitions (from brief)

**Chess Lane** (5-7 points): `Backlog → In Progress → Testing → Done`
- Focus: Velocity, automation, verification

**Hybrid Lane** (8-10 points): `Backlog → Technical Work → Stakeholder Review → Done`
- Focus: Decomposition, sequencing
- Shows chess component vs poker component tags

**Poker Lane** (11-15 points): `Backlog → Relationship Prep → Active Negotiation → Resolved`
- Focus: Timing, context, stakeholder readiness

### Mobile UX

Board layout on small screens TBD — open to one-lane-at-a-time swipe, unified list with filters, or whatever works best. Will decide during build.

### Open Questions (to resolve during build)

- Column customization: Ship opinionated defaults first
- Hybrid tasks: Single card or split into sub-tasks?
- Stakeholder tracking UX for poker tasks

## Constraints

- **Tech stack**: React + TailwindCSS (existing component uses inline styles — will migrate to Tailwind)
- **Persistence**: localStorage only for v1
- **Platform**: Responsive web, mobile-first design
- **Single user**: No auth, no backend, no multi-device sync

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mobile-first responsive web (not native) | Personal tool, avoid app store overhead, works on any device | — Pending |
| localStorage for persistence | Simplest path for single-user, no backend needed | — Pending |
| Port existing framework component | Proven classification logic and dimension model, saves rework | — Pending |
| Opinionated lane columns (no customization) | Ship faster, validate the workflow before adding flexibility | — Pending |
| Full 5-dimension scoring (no quick mode) | User wants the intentional classification moment, 30 seconds is acceptable | — Pending |

---
*Last updated: 2026-02-16 after initialization*
