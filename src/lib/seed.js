/**
 * Seed data: 12 mock tasks spread across all 3 lanes and their respective columns.
 *
 * Scores are validated: getTotalScore produces the correct classification.
 * IDs are pre-generated (stable across reloads for dev convenience).
 */

import { getTotalScore, classifyTask } from './scoring/classifier.js'

const now = new Date().toISOString()
const day = (d) => new Date(Date.now() - d * 86400000).toISOString()

function makeTask({ id, title, description, scores, column, order }) {
  const total = getTotalScore(scores)
  const classification = classifyTask(total)
  return {
    id,
    title,
    description,
    scores,
    totalScore: total,
    classification,
    column,
    order,
    createdAt: day(order / 1000),
    updatedAt: now,
  }
}

export const MOCK_TASKS = [
  // ── Chess lane (scores sum 5-7) ──────────────────────────────────────────

  makeTask({
    id: 'chess-001',
    title: 'Fix null pointer in user profile loader',
    description: 'Profile page crashes when avatar URL is missing. Add null check before image render.',
    scores: { IC: 1, AA: 1, OV: 1, RS: 1, RV: 1 }, // total: 5 → chess
    column: 'backlog',
    order: 1000,
  }),

  makeTask({
    id: 'chess-002',
    title: 'Migrate authentication to JWT refresh tokens',
    description: 'Replace session-based auth with JWT + refresh token rotation. Tests define success criteria.',
    scores: { IC: 1, AA: 1, OV: 1, RS: 2, RV: 1 }, // total: 6 → chess
    column: 'in-progress',
    order: 2000,
  }),

  makeTask({
    id: 'chess-003',
    title: 'Add rate limiting to public API endpoints',
    description: 'Implement token bucket algorithm. 100 req/min per IP. Return 429 with Retry-After header.',
    scores: { IC: 1, AA: 1, OV: 1, RS: 2, RV: 2 }, // total: 7 → chess
    column: 'testing',
    order: 3000,
  }),

  makeTask({
    id: 'chess-004',
    title: 'Set up CI pipeline for monorepo',
    description: 'GitHub Actions workflow: lint, test, build on PR. Cache node_modules per workspace.',
    scores: { IC: 2, AA: 1, OV: 1, RS: 1, RV: 1 }, // total: 6 → chess
    column: 'done',
    order: 4000,
  }),

  // ── Hybrid lane (scores sum 8-10) ────────────────────────────────────────

  makeTask({
    id: 'hybrid-001',
    title: 'Design task classification onboarding flow',
    description: 'New users need to learn the Chess-Poker framework before scoring tasks. Design and prototype.',
    scores: { IC: 2, AA: 2, OV: 2, RS: 2, RV: 2 }, // total: 10 → hybrid
    column: 'backlog',
    order: 5000,
  }),

  makeTask({
    id: 'hybrid-002',
    title: 'Implement drag-and-drop between columns',
    description: 'Use @dnd-kit to enable card movement. Persist order to localStorage on drop.',
    scores: { IC: 1, AA: 2, OV: 2, RS: 2, RV: 2 }, // total: 9 → hybrid
    column: 'technical-work',
    order: 6000,
  }),

  makeTask({
    id: 'hybrid-003',
    title: 'Add mobile bottom tab navigation',
    description: 'Replace desktop sidebar with bottom tabs on small screens. Swipe between Chess/Hybrid/Poker.',
    scores: { IC: 2, AA: 1, OV: 2, RS: 2, RV: 2 }, // total: 9 → hybrid
    column: 'stakeholder-review',
    order: 7000,
  }),

  makeTask({
    id: 'hybrid-004',
    title: 'Refactor scoring library for extensibility',
    description: 'Extract classification logic into pure functions. Stakeholders want to add custom dimensions.',
    scores: { IC: 2, AA: 2, OV: 2, RS: 1, RV: 1 }, // total: 8 → hybrid
    column: 'done',
    order: 8000,
  }),

  // ── Poker lane (scores sum 11-15) ─────────────────────────────────────────

  makeTask({
    id: 'poker-001',
    title: 'Negotiate cloud hosting budget with finance',
    description: 'Propose $500/mo for production infrastructure. Finance team approval needed before provisioning.',
    scores: { IC: 2, AA: 3, OV: 3, RS: 3, RV: 3 }, // total: 14 → poker
    column: 'backlog',
    order: 9000,
  }),

  makeTask({
    id: 'poker-002',
    title: 'Get design system sign-off from stakeholders',
    description: 'Present dark theme mockups to three stakeholders. Consensus needed before UI build begins.',
    scores: { IC: 3, AA: 3, OV: 3, RS: 3, RV: 2 }, // total: 14 → poker
    column: 'relationship-prep',
    order: 10000,
  }),

  makeTask({
    id: 'poker-003',
    title: 'Align product roadmap with engineering capacity',
    description: 'Engineering says Q2 is over-committed. Need to negotiate scope cuts with product leadership.',
    scores: { IC: 3, AA: 3, OV: 2, RS: 3, RV: 3 }, // total: 14 → poker
    column: 'active-negotiation',
    order: 11000,
  }),

  makeTask({
    id: 'poker-004',
    title: 'Secure exec sponsorship for platform rewrite',
    description: 'CTO buy-in required for 6-month platform rewrite. Prepared proposal and risk analysis.',
    scores: { IC: 2, AA: 3, OV: 2, RS: 3, RV: 3 }, // total: 13 → poker
    column: 'resolved',
    order: 12000,
  }),
]
