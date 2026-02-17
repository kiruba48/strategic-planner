/**
 * KanbanColumn — A single column within a lane.
 *
 * Receives column definition (id, label) and an array of task IDs
 * for this column. Renders TaskCard for each task.
 */

import TaskCard from '../Task/TaskCard.jsx'

export default function KanbanColumn({ column, taskIds, laneAccent }) {
  const count = taskIds.length

  return (
    <div
      className="flex flex-col min-w-[220px] flex-1 rounded-lg overflow-hidden"
      style={{ backgroundColor: '#111118' }}
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-3 py-2.5 border-b border-[#1f2937]"
        style={{ backgroundColor: '#111118' }}
      >
        <span className="text-sm font-semibold text-[#f1f5f9]">{column.label}</span>
        <span
          className="text-xs font-medium px-1.5 py-0.5 rounded-full text-[#94a3b8]"
          style={{ backgroundColor: '#1a1a24' }}
        >
          {count}
        </span>
      </div>

      {/* Task cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {taskIds.map((taskId) => (
          <TaskCard key={taskId} taskId={taskId} laneAccent={laneAccent} />
        ))}
        {count === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-[#475569] italic">
            No tasks
          </div>
        )}
      </div>
    </div>
  )
}
