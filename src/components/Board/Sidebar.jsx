/**
 * Sidebar — Desktop collapsible lane navigation.
 *
 * Visible only on md+ viewports. Collapsed = icons only.
 * Active lane highlighted with lane's accent tint color.
 */

import clsx from 'clsx'
import { useUIStore } from '../../stores/uiStore.js'
import { LANES } from '../../constants/columns.js'

export default function Sidebar() {
  const activeLane = useUIStore((s) => s.activeLane)
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setActiveLane = useUIStore((s) => s.setActiveLane)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  return (
    <aside
      className={clsx(
        'hidden md:flex md:flex-col',
        'shrink-0 h-screen',
        'border-r border-[#1f2937]',
        'transition-all duration-200',
        sidebarCollapsed ? 'w-14' : 'w-52'
      )}
      style={{ backgroundColor: '#0f0f17' }}
    >
      {/* Logo / header area */}
      <div
        className={clsx(
          'flex items-center h-14 px-3 border-b border-[#1f2937]',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!sidebarCollapsed && (
          <span className="text-xs font-semibold tracking-widest text-[#475569] uppercase">
            Lanes
          </span>
        )}
        {sidebarCollapsed && (
          <span className="text-base text-[#475569]">≡</span>
        )}
      </div>

      {/* Lane buttons */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
        {LANES.map((lane) => {
          const isActive = activeLane === lane.id
          return (
            <button
              key={lane.id}
              onClick={() => setActiveLane(lane.id)}
              title={sidebarCollapsed ? `${lane.label} (${lane.scoreRange[0]}-${lane.scoreRange[1]})` : undefined}
              className={clsx(
                'w-full flex items-center rounded-md text-sm font-medium transition-colors duration-150',
                sidebarCollapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-3 py-2.5',
                isActive
                  ? 'text-white'
                  : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
              )}
              style={
                isActive
                  ? {
                      backgroundColor: lane.subtle,
                      boxShadow: `inset 2px 0 0 ${lane.accent}`,
                    }
                  : {}
              }
            >
              <span className="text-base leading-none">{lane.emoji}</span>
              {!sidebarCollapsed && (
                <span className="flex-1 text-left">
                  {lane.label}
                  <span className="ml-1.5 text-xs text-[#475569] font-normal">
                    ({lane.scoreRange[0]}-{lane.scoreRange[1]})
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse / expand toggle */}
      <div className="shrink-0 border-t border-[#1f2937] p-2">
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={clsx(
            'w-full flex items-center rounded-md px-3 py-2 text-sm text-[#475569]',
            'hover:text-[#94a3b8] hover:bg-white/5 transition-colors duration-150',
            sidebarCollapsed ? 'justify-center px-0' : 'gap-2'
          )}
        >
          <span className="text-base">{sidebarCollapsed ? '→' : '←'}</span>
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
