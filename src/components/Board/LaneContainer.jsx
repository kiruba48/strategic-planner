/**
 * LaneContainer — Renders a single lane with its columns.
 *
 * Reads LANE_COLUMNS[laneId] for column definitions.
 * Filters tasks from taskStore by lane and column.
 * Columns scroll horizontally on mobile, fill space on desktop.
 *
 * Mobile enhancements (Plan 03):
 * - Dot indicators below column row showing current scroll position
 */

import { useRef, useState, useCallback } from 'react'
import { useTaskStore } from '../../stores/taskStore.js'
import { LANE_COLUMNS, LANES } from '../../constants/columns.js'
import KanbanColumn from './KanbanColumn.jsx'

export default function LaneContainer({ laneId }) {
  const columns = LANE_COLUMNS[laneId] ?? []
  const laneMeta = LANES.find((l) => l.id === laneId)

  // Flat task array — filter by lane then split by column
  const tasks = useTaskStore((s) => s.tasks.filter((t) => t.classification === laneId))

  // Build column -> taskId[] map
  const tasksByColumn = {}
  for (const col of columns) {
    tasksByColumn[col.id] = tasks
      .filter((t) => t.column === col.id)
      .sort((a, b) => a.order - b.order)
      .map((t) => t.id)
  }

  // Scroll container ref for dot indicator tracking
  const scrollContainerRef = useRef(null)
  const [activeColumnIndex, setActiveColumnIndex] = useState(0)

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el || columns.length === 0) return
    // Each column is approximately 236px wide (220px + 16px gap)
    const columnWidth = el.scrollWidth / columns.length
    const index = Math.round(el.scrollLeft / columnWidth)
    setActiveColumnIndex(Math.max(0, Math.min(index, columns.length - 1)))
  }, [columns.length])

  const accent = laneMeta?.accent ?? '#6366f1'

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Lane header */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-[#1f2937]">
        <span className="text-lg leading-none">{laneMeta?.emoji}</span>
        <h2 className="text-base font-semibold text-[#f1f5f9]">{laneMeta?.label}</h2>
        <span className="text-xs text-[#475569] font-normal">
          ({laneMeta?.scoreRange?.[0]}-{laneMeta?.scoreRange?.[1]})
        </span>
        <span className="ml-auto text-xs text-[#475569]">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Columns — horizontal scroll on mobile */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden"
        onScroll={handleScroll}
      >
        <div className="flex gap-3 p-3 h-full min-h-0" style={{ minWidth: `${columns.length * 236}px` }}>
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              taskIds={tasksByColumn[col.id] ?? []}
              laneAccent={laneMeta?.accent}
            />
          ))}
        </div>
      </div>

      {/* Dot indicators — mobile only (md:hidden) */}
      {columns.length > 1 && (
        <div className="md:hidden shrink-0 flex items-center justify-center gap-2 py-2">
          {columns.map((col, index) => (
            <div
              key={col.id}
              className="w-2 h-2 rounded-full transition-colors duration-150"
              style={{
                backgroundColor: index === activeColumnIndex ? accent : '#4b5563',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
