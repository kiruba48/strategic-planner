/**
 * TaskCard — Individual task card with title, emoji badge,
 * mini dimension bars, and description preview.
 *
 * Click opens TaskDetailModal with full task details + radar chart.
 * Desktop hover shows subtle accent glow.
 *
 * Uses selective Zustand selector (taskId) to prevent unnecessary re-renders.
 */

import { memo, useState, useCallback } from 'react'
import clsx from 'clsx'
import { useTaskStore } from '../../stores/taskStore.js'
import { LANES } from '../../constants/columns.js'
import TaskDetailModal from './TaskDetailModal.jsx'

// Dimension abbreviations in display order
const DIMENSION_KEYS = ['IC', 'AA', 'OV', 'RS', 'RV']

// Map lane id -> lane metadata (accent, subtle)
const LANE_MAP = Object.fromEntries(LANES.map((l) => [l.id, l]))

export default memo(function TaskCard({ taskId, laneAccent }) {
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === taskId))
  const [isHovered, setIsHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const laneMeta = LANE_MAP[task?.classification]
  const accent = laneAccent ?? laneMeta?.accent ?? '#6366f1'
  const subtleBg = laneMeta?.subtle ?? 'var(--color-base-card)'
  const emoji = laneMeta?.emoji ?? '?'

  const handlePointerEnter = useCallback((e) => {
    if (e.pointerType === 'touch') return
    setIsHovered(true)
  }, [])

  const handlePointerLeave = useCallback((e) => {
    if (e.pointerType === 'touch') return
    setIsHovered(false)
  }, [])

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    setShowModal(true)
  }, [])

  const handleCloseModal = useCallback(() => setShowModal(false), [])

  if (!task) return null

  return (
    <>
      <div
        className={clsx(
          'group rounded-lg p-3 transition-colors duration-150 cursor-pointer',
        )}
        style={{
          backgroundColor: isHovered ? '#1e1e2e' : 'var(--color-base-card)',
          border: `1px solid ${isHovered ? accent + '55' : 'var(--color-border)'}`,
        }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        {/* Title row with emoji badge */}
        <div className="flex items-start gap-2 mb-2">
          <span
            className="shrink-0 text-xs px-1.5 py-0.5 rounded font-medium leading-none pt-[3px]"
            style={{ backgroundColor: subtleBg, color: accent }}
          >
            {emoji}
          </span>
          <span className="text-sm font-semibold text-text-primary leading-snug line-clamp-1 flex-1">
            {task.title}
          </span>
        </div>

        {/* Mini dimension bars */}
        <div className="space-y-[3px] mb-2">
          {DIMENSION_KEYS.map((dim) => {
            const score = task.scores?.[dim] ?? 1
            const fillPct = Math.round((score / 3) * 100)
            return (
              <div key={dim} className="flex items-center gap-1.5">
                <span className="text-[10px] text-text-muted w-5 shrink-0 font-mono">{dim}</span>
                <div className="flex-1 h-[3px] rounded-full bg-base-sidebar">
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
          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Detail modal */}
      {showModal && (
        <TaskDetailModal task={task} onClose={handleCloseModal} />
      )}
    </>
  )
})
