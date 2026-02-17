/**
 * TaskCard — Individual task card with title, emoji badge,
 * mini dimension bars, description preview, and radar chart reveal.
 *
 * Desktop: hover reveals radar chart below dimension bars.
 * Mobile: tap toggles radar chart (tap to reveal, tap again to hide).
 *
 * Uses selective Zustand selector (taskId) to prevent unnecessary re-renders.
 */

import { useState, useCallback } from 'react'
import clsx from 'clsx'
import { useTaskStore } from '../../stores/taskStore.js'
import { LANES } from '../../constants/columns.js'
import TaskRadarChart from '../Visualization/RadarChart.jsx'

// Dimension abbreviations in display order
const DIMENSION_KEYS = ['IC', 'AA', 'OV', 'RS', 'RV']

// Map lane id -> lane metadata (accent, subtle)
const LANE_MAP = Object.fromEntries(LANES.map((l) => [l.id, l]))

// Detect touch device to distinguish mobile tap behavior
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function TaskCard({ taskId, laneAccent }) {
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === taskId))
  const [isExpanded, setIsExpanded] = useState(false)

  const laneMeta = LANE_MAP[task?.classification]
  const accent = laneAccent ?? laneMeta?.accent ?? '#6366f1'
  const subtleBg = laneMeta?.subtle ?? '#1a1a24'
  const emoji = laneMeta?.emoji ?? '?'

  // Desktop hover handlers
  const handleMouseEnter = useCallback(
    (e) => {
      if (isTouchDevice()) return
      e.currentTarget.style.borderColor = accent + '55'
      e.currentTarget.style.backgroundColor = '#1e1e2e'
      setIsExpanded(true)
    },
    [accent]
  )

  const handleMouseLeave = useCallback((e) => {
    if (isTouchDevice()) return
    e.currentTarget.style.borderColor = '#1f2937'
    e.currentTarget.style.backgroundColor = '#1a1a24'
    setIsExpanded(false)
  }, [])

  // Mobile tap handler — toggle radar chart
  const handleTap = useCallback(
    (e) => {
      if (!isTouchDevice()) return
      e.stopPropagation()
      setIsExpanded((prev) => !prev)
      // Update border glow to match expanded state
      const el = e.currentTarget
      if (!isExpanded) {
        el.style.borderColor = accent + '55'
        el.style.backgroundColor = '#1e1e2e'
      } else {
        el.style.borderColor = '#1f2937'
        el.style.backgroundColor = '#1a1a24'
      }
    },
    [accent, isExpanded]
  )

  if (!task) return null

  return (
    <div
      className={clsx(
        'group rounded-lg p-3 border border-[#1f2937]',
        'transition-colors duration-150 cursor-pointer',
      )}
      style={{
        backgroundColor: '#1a1a24',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
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
        <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed mb-2">
          {task.description}
        </p>
      )}

      {/* Radar chart reveal — smooth transition */}
      <div
        style={{
          maxHeight: isExpanded ? '140px' : '0px',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 200ms ease-out, opacity 200ms ease-out',
        }}
      >
        <div className="flex justify-center pt-1">
          <TaskRadarChart
            scores={task.scores}
            accentColor={accent}
            size={120}
          />
        </div>
      </div>
    </div>
  )
}
