/**
 * TaskBoard — Root board layout component.
 *
 * Desktop: Sidebar (left) + active lane board (right)
 * Mobile: full-width board + MobileTabBar (fixed bottom)
 */

import { useUIStore } from '../../stores/uiStore.js'
import Sidebar from './Sidebar.jsx'
import MobileTabBar from './MobileTabBar.jsx'
import LaneContainer from './LaneContainer.jsx'

export default function TaskBoard() {
  const activeLane = useUIStore((s) => s.activeLane)

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main board content */}
      <main className="flex flex-1 flex-col min-w-0 overflow-hidden pb-[56px] md:pb-0">
        <LaneContainer laneId={activeLane} />
      </main>

      {/* Mobile bottom tab bar */}
      <MobileTabBar />
    </div>
  )
}
