/**
 * Scoring and classification logic for the Chess-Poker framework.
 *
 * Score ranges:
 *   5-7:  chess  — high information, deterministic, execute with velocity
 *   8-10: hybrid — mixed signals, decompose and sequence
 *   11-15: poker  — low information, relationship-driven, time carefully
 */

import { LANES } from '../../constants/columns.js'

const REQUIRED_DIMENSIONS = ['IC', 'AA', 'OV', 'RS', 'RV']

// Build lookup from LANES — single source of truth
const LANE_META = Object.fromEntries(
  LANES.map((l) => [
    l.id,
    { label: l.label, emoji: l.emoji, accent: l.accent, range: `${l.scoreRange[0]}-${l.scoreRange[1]}` },
  ])
)

/**
 * Sum all 5 dimension scores.
 * @param {Record<string, number>} scores - Object with dimension IDs as keys and 1-3 values
 * @returns {number} Total score (5-15)
 */
export function getTotalScore(scores) {
  if (!scores || typeof scores !== 'object') return 5
  const vals = REQUIRED_DIMENSIONS.map((dim) => scores[dim])
  if (vals.some((val) => typeof val !== 'number' || val < 1 || val > 3)) return NaN
  return vals.reduce((total, val) => total + val, 0)
}

/**
 * Classify a task based on its total score.
 * @param {number} totalScore - Score in range 5-15
 * @returns {'chess' | 'hybrid' | 'poker'} Classification
 */
export function classifyTask(totalScore) {
  if (!Number.isFinite(totalScore)) return 'hybrid'
  if (totalScore <= 7) return 'chess'
  if (totalScore <= 10) return 'hybrid'
  return 'poker'
}

/**
 * Get the default column for a newly classified task.
 * All new tasks start in backlog regardless of lane.
 * @param {string} _classification - 'chess' | 'hybrid' | 'poker'
 * @returns {string} Default column id
 */
export function getDefaultColumn(_classification) {
  return 'backlog'
}

/**
 * Get classification metadata for display.
 * Uses LANES from constants as single source of truth.
 * @param {'chess' | 'hybrid' | 'poker'} classification
 * @returns {{ label: string, emoji: string, accent: string, range: string }}
 */
export function getClassificationMeta(classification) {
  return LANE_META[classification] ?? LANE_META.hybrid
}
