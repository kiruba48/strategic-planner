/**
 * TaskDetailModal — Full task detail overlay.
 *
 * Opens when a task card is clicked. Shows title, classification badge,
 * full description, dimension scores with labels, and a larger radar chart.
 *
 * Desktop: centered modal with backdrop.
 * Mobile: full-screen slide-up panel.
 */

import { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { LANES } from '../../constants/columns.js'
import { DIMENSIONS } from '../../lib/scoring/dimensions.js'
import { getClassificationMeta } from '../../lib/scoring/classifier.js'
import TaskRadarChart from '../Visualization/RadarChart.jsx'
import DimensionBar from './DimensionBar.jsx'

const LANE_MAP = Object.fromEntries(LANES.map((l) => [l.id, l]))

export default function TaskDetailModal({ task, onClose }) {
  const closeButtonRef = useRef(null)

  // Body overflow lock — restore previous value on cleanup
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Escape key listener — separate from overflow effect
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Auto-focus close button on mount for keyboard accessibility
  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  if (!task) return null

  // Use stored classification/totalScore from task, not recomputed (#4)
  const classification = task.classification
  const totalScore = task.totalScore
  const lane = LANE_MAP[classification]
  const accent = lane?.accent ?? '#6366f1'
  const subtle = lane?.subtle ?? '#1e1e2e'
  const meta = getClassificationMeta(classification)

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className="relative w-full md:max-w-md md:rounded-xl rounded-t-xl bg-base-surface border border-border overflow-hidden max-h-[85vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-4 pb-3 border-b border-border">
          <span
            className="shrink-0 text-sm px-2 py-1 rounded font-medium"
            style={{ backgroundColor: subtle, color: accent }}
          >
            {lane?.emoji ?? '?'}
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-text-primary leading-snug">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs font-medium px-1.5 py-0.5 rounded"
                style={{ backgroundColor: subtle, color: accent }}
              >
                {meta.label}
              </span>
              <span className="text-xs text-text-muted">
                Score: {totalScore}/15
              </span>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="shrink-0 text-text-muted hover:text-text-primary transition-colors p-1 -mt-1 -mr-1"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Radar chart — centered, larger size */}
          <div className="flex justify-center">
            <TaskRadarChart
              scores={task.scores}
              accentColor={accent}
              size={180}
            />
          </div>

          {/* Dimension scores with full labels */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Dimensions
            </h3>
            {DIMENSIONS.map((dim) => {
              const score = task.scores?.[dim.id] ?? 1
              const level = dim.levels.find((l) => l.value === score)
              return (
                <div key={dim.id} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      <span className="font-mono text-text-muted mr-1.5">{dim.id}</span>
                      {dim.label}
                    </span>
                    <span className="text-xs font-medium" style={{ color: accent }}>
                      {level?.label ?? score} ({score}/3)
                    </span>
                  </div>
                  <DimensionBar score={score} accent={accent} size="detailed" />
                </div>
              )
            })}
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Description
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {/* Column info */}
          <div className="flex items-center gap-2 text-xs text-text-muted pt-1 border-t border-border">
            <span>Column: <span className="text-text-secondary font-medium">{task.column ?? 'backlog'}</span></span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
