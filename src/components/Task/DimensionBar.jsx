/**
 * DimensionBar — Shared progress bar for dimension scores.
 *
 * Accepts:
 *   score  — numeric score (1–3)
 *   accent — fill color string
 *   size   — "compact" (thin, no transition) | "detailed" (taller, animated)
 */

export default function DimensionBar({ score, accent, size = 'compact' }) {
  const fillPct = Math.round((score / 3) * 100)
  const isDetailed = size === 'detailed'
  return (
    <div className={`rounded-full bg-base-sidebar ${isDetailed ? 'h-1' : 'h-[3px]'}`}>
      <div
        className={`h-full rounded-full${isDetailed ? ' transition-all duration-300' : ''}`}
        style={{
          width: `${fillPct}%`,
          backgroundColor: accent,
          opacity: 0.75,
        }}
      />
    </div>
  )
}
