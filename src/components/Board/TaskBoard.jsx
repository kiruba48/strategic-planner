/**
 * TaskBoard — Root board layout component.
 *
 * Desktop: Sidebar (left) + active lane board (right)
 * Mobile: full-width board + MobileTabBar (fixed bottom)
 *
 * Mobile swipe gestures:
 * Horizontal swipe on non-scrollable areas (lane header) switches lanes.
 * Swipes originating inside the horizontal scroll container are ignored
 * to prevent conflict with column scrolling.
 */

import { useRef, useCallback } from 'react'
import { useUIStore } from '../../stores/uiStore.js'
import { LANES } from '../../constants/columns.js'
import Sidebar from './Sidebar.jsx'
import MobileTabBar from './MobileTabBar.jsx'
import LaneContainer from './LaneContainer.jsx'

const LANE_IDS = LANES.map((l) => l.id)
const SWIPE_THRESHOLD = 50 // px

export default function TaskBoard() {
  const activeLane = useUIStore((s) => s.activeLane)
  const setActiveLane = useUIStore((s) => s.setActiveLane)

  // Touch tracking for swipe gestures
  const touchStartRef = useRef({ x: 0, y: 0, insideScrollable: false })

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    // Check if touch started inside a horizontally-scrollable container
    const insideScrollable = e.target.closest('[data-scroll-container]') !== null
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, insideScrollable }
  }, [])

  const handleTouchEnd = useCallback(
    (e) => {
      // Skip lane-switch if swipe started inside the column scroll area
      if (touchStartRef.current.insideScrollable) return

      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStartRef.current.x
      const dy = touch.clientY - touchStartRef.current.y

      // Only count as horizontal swipe if more horizontal than vertical
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return

      const currentIndex = LANE_IDS.indexOf(activeLane)
      if (dx < 0) {
        // Swipe left -> next lane (wrap)
        const nextIndex = (currentIndex + 1) % LANE_IDS.length
        setActiveLane(LANE_IDS[nextIndex])
      } else {
        // Swipe right -> previous lane (wrap)
        const prevIndex = (currentIndex - 1 + LANE_IDS.length) % LANE_IDS.length
        setActiveLane(LANE_IDS[prevIndex])
      }
    },
    [activeLane, setActiveLane]
  )

  return (
    <div className="flex h-screen overflow-hidden bg-base-body">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main board content — swipe gestures on mobile */}
      <main
        className="flex flex-1 flex-col min-w-0 overflow-hidden pb-[56px] md:pb-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <LaneContainer laneId={activeLane} />
      </main>

      {/* Mobile bottom tab bar */}
      <MobileTabBar />
    </div>
  )
}
