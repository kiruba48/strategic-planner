/**
 * Lane and column definitions for the Chess-Poker Task Manager.
 *
 * Score ranges:
 *   Chess  5-7  — high information, deterministic
 *   Hybrid 8-10 — mixed signals, partial uncertainty
 *   Poker  11-15 — low information, relationship-driven
 */

export const LANE_COLUMNS = {
  chess: [
    { id: 'backlog', label: 'Backlog' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'testing', label: 'Testing' },
    { id: 'done', label: 'Done' },
  ],
  hybrid: [
    { id: 'backlog', label: 'Backlog' },
    { id: 'technical-work', label: 'Technical Work' },
    { id: 'stakeholder-review', label: 'Stakeholder Review' },
    { id: 'done', label: 'Done' },
  ],
  poker: [
    { id: 'backlog', label: 'Backlog' },
    { id: 'relationship-prep', label: 'Relationship Prep' },
    { id: 'active-negotiation', label: 'Active Negotiation' },
    { id: 'resolved', label: 'Resolved' },
  ],
}

export const LANES = [
  {
    id: 'chess',
    label: 'Chess',
    emoji: '♙',
    scoreRange: [5, 7],
    description: 'High-information deterministic tasks — velocity and automation',
    accent: '#3b82f6',
    subtle: '#1e3a5f',
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    emoji: '🎲',
    scoreRange: [8, 10],
    description: 'Mixed signals — decompose into chess and poker components',
    accent: '#8b5cf6',
    subtle: '#2d1f5e',
  },
  {
    id: 'poker',
    label: 'Poker',
    emoji: '🃏',
    scoreRange: [11, 15],
    description: 'Low-information relationship-driven tasks — timing and context',
    accent: '#f59e0b',
    subtle: '#5e3a1f',
  },
]
