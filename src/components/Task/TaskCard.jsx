/**
 * TaskCard — Individual task card with title, emoji badge,
 * mini dimension bars, and description preview.
 *
 * Uses selective Zustand selector (taskId) to prevent unnecessary re-renders.
 * Radar chart appears on hover/tap in Plan 03 — NOT rendered here.
 */

import clsx from 'clsx'
import { useTaskStore } from '../../stores/taskStore.js'
import { LANES } from '../../constants/columns.js'

// Dimension abbreviations in display order
const DIMENSION_KEYS = ['IC', 'AA', 'OV', 'RS', 'RV']

// Map lane id -> lane metadata (accent, subtle)
const LANE_MAP = Object.fromEntries(LANES.map((l) => [l.id, l]))

export default function TaskCard({ taskId, laneAccent }) {
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === taskId))

  if (!task) return null

  const laneMeta = LANE_MAP[task.classification]
  const accent = laneAccent ?? laneMeta?.accent ?? '#6366f1'
  const subtleBg = laneMeta?.subtle ?? '#1a1a24'
  const emoji = laneMeta?.emoji ?? '?'

  return (
    <div
      className={clsx(
        'group rounded-lg p-3 border border-[#1f2937]',
        'transition-all duration-150 cursor-pointer',
        'hover:border-opacity-80'
      )}
      style={{
        backgroundColor: '#1a1a24',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent + '55'
        e.currentTarget.style.backgroundColor = '#1e1e2e'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1f2937'
        e.currentTarget.style.backgroundColor = '#1a1a24'
      }}
    >
      {/* Title row with emoji badge */}
      <div className="flex items-start gap-2 mb-2">
        {/* Classification emoji badge */}
        <span
          className="shrink-0 text-xs px-1.5 py-0.5 rounded font-medium leading-none pt-[3px]"
          style={{ backgroundColor: subtleBg, color: accent }}
        >
          {emoji}
        </span>

        {/* Title */}
        <span className="text-sm font-semibold text-[#f1f5f9] leading-snug line-clamp-1 flex-1">
          {task.title}
        </span>
      </div>

      {/* Mini dimension bars */}
      <div className="space-y-[3px] mb-2">
        {DIMENSION_KEYS.map((dim) => {
          const score = task.scores?.[dim] ?? 1
          // Score range: 1-3; bar fill = score/3
          const fillPct = Math.round((score / 3) * 100)
          return (
            <div key={dim} className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#475569] w-5 shrink-0 font-mono">{dim}</span>
              <div className="flex-1 h-[3px] rounded-full" style={{ backgroundColor: '#0f0f17' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${fillPct}%`,
                    backgroundColor: accent,
                    opacity: 0.75,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
    </div>
  )
}
