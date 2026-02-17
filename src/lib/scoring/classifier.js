/**
 * Scoring and classification logic for the Chess-Poker framework.
 *
 * Score ranges:
 *   5-7:  chess  — high information, deterministic, execute with velocity
 *   8-10: hybrid — mixed signals, decompose and sequence
 *   11-15: poker  — low information, relationship-driven, time carefully
 */

/**
 * Sum all 5 dimension scores.
 * @param {Record<string, number>} scores - Object with dimension IDs as keys and 1-3 values
 * @returns {number} Total score (5-15)
 */
export function getTotalScore(scores) {
  return Object.values(scores).reduce((sum, val) => sum + val, 0)
}

/**
 * Classify a task based on its total score.
 * @param {number} totalScore - Score in range 5-15
 * @returns {'chess' | 'hybrid' | 'poker'} Classification
 */
export function classifyTask(totalScore) {
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
 * @param {'chess' | 'hybrid' | 'poker'} classification
 * @returns {{ label: string, emoji: string, accent: string, range: string }}
 */
export function getClassificationMeta(classification) {
  const meta = {
    chess: { label: 'Chess', emoji: '♟️', accent: '#3b82f6', range: '5-7' },
    hybrid: { label: 'Hybrid', emoji: '🎲', accent: '#8b5cf6', range: '8-10' },
    poker: { label: 'Poker', emoji: '🃏', accent: '#f59e0b', range: '11-15' },
  }
  return meta[classification] ?? meta.hybrid
}
