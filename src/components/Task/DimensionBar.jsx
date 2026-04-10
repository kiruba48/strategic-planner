/**
 * DimensionBar — Shared progress bar for a single dimension score.
 *
 * size="compact"  → mini bar used in TaskCard (3px tall, label only)
 * size="detailed" → full bar used in TaskDetailModal (4px tall, label + score text)
 */

export default function DimensionBar({ score, accent, size = 'compact', dimId, label, levelLabel }) {
  const fillPct = Math.round((score / 3) * 100)

  if (size === 'compact') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-text-muted w-5 shrink-0 font-mono">{dimId}</span>
        <div className="flex-1 h-[3px] rounded-full bg-base-sidebar">
          <div
            className="h-full rounded-full"
            style={{ width: `${fillPct}%`, backgroundColor: accent, opacity: 0.75 }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">
          <span className="font-mono text-text-muted mr-1.5">{dimId}</span>
          {label}
        </span>
        <span className="text-xs font-medium" style={{ color: accent }}>
          {levelLabel ?? score} ({score}/3)
        </span>
      </div>
      <div className="h-1 rounded-full bg-base-sidebar">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${fillPct}%`, backgroundColor: accent, opacity: 0.75 }}
        />
      </div>
    </div>
  )
}
