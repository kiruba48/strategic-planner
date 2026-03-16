/**
 * UI store — active lane selection and sidebar state.
 *
 * Persistence: localStorage key 'chess-poker-ui:v1'
 * Zustand v5: create()(persist(...)) double-parentheses pattern.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { safeLocalStorage } from '../lib/safeLocalStorage.js'

export const useUIStore = create()(
  persist(
    (set) => ({
      activeLane: 'chess',
      sidebarCollapsed: false,

      setActiveLane: (lane) => {
        set({ activeLane: lane })
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
      },
    }),
    {
      name: 'chess-poker-ui:v1',
      storage: createJSONStorage(safeLocalStorage),
      partialize: (state) => ({
        activeLane: state.activeLane,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
