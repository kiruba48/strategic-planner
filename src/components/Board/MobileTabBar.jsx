/**
 * MobileTabBar — Bottom tab bar for mobile lane switching.
 *
 * Visible only on mobile (hidden on md+). Fixed at bottom.
 * Active tab uses lane accent color; inactive tabs are gray.
 */

import clsx from 'clsx'
import { useUIStore } from '../../stores/uiStore.js'
import { LANES } from '../../constants/columns.js'

export default function MobileTabBar() {
  const activeLane = useUIStore((s) => s.activeLane)
  const setActiveLane = useUIStore((s) => s.setActiveLane)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden z-40 border-t border-[#1f2937]"
      style={{ backgroundColor: '#0f0f17' }}
    >
      <div className="flex items-stretch">
        {LANES.map((lane) => {
          const isActive = activeLane === lane.id
          return (
            <button
              key={lane.id}
              onClick={() => setActiveLane(lane.id)}
              className={clsx(
                'flex-1 flex flex-col items-center justify-center gap-0.5 py-2',
                'text-xs font-medium transition-colors duration-150',
                isActive ? 'text-white' : 'text-[#475569]'
              )}
              style={isActive ? { color: lane.accent } : {}}
            >
              <span className="text-xl leading-none">{lane.emoji}</span>
              <span className="text-[11px] leading-tight">{lane.label}</span>
            </button>
          )
        })}
      </div>
      {/* iOS safe area spacer */}
      <div className="h-safe-bottom" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  )
}
