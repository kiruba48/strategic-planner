/**
 * Task store — flat array of tasks with Zustand + persist middleware.
 *
 * Persistence: localStorage key 'chess-poker-tasks:v1'
 * Pattern: flat array, never nested by lane — use selector helpers to group.
 * Zustand v5: create()(persist(...)) double-parentheses pattern.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { MOCK_TASKS } from '../lib/seed.js'
import { getTotalScore, classifyTask, getDefaultColumn } from '../lib/scoring/classifier.js'

// Safe localStorage wrapper — handles incognito / quota errors gracefully
const safeLocalStorage = () => {
  try {
    return {
      getItem: (key) => {
        try {
          return localStorage.getItem(key)
        } catch {
          return null
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value)
        } catch {
          // Quota exceeded or security error — fail silently
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key)
        } catch {
          // Fail silently
        }
      },
    }
  } catch {
    // localStorage not available (SSR, etc.)
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }
}

export const useTaskStore = create()(
  persist(
    (set, get) => ({
      tasks: MOCK_TASKS,

      // ── Mutations ─────────────────────────────────────────────────────────

      addTask: (taskData) => {
        const total = getTotalScore(taskData.scores)
        const classification = classifyTask(total)
        const column = getDefaultColumn(classification)
        const now = new Date().toISOString()
        const newTask = {
          id: nanoid(),
          title: taskData.title,
          description: taskData.description ?? '',
          scores: taskData.scores,
          totalScore: total,
          classification,
          column,
          order: Date.now(),
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
        return newTask
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task
            const merged = { ...task, ...updates }
            // Recalculate classification if scores changed
            if (updates.scores) {
              merged.totalScore = getTotalScore(merged.scores)
              merged.classification = classifyTask(merged.totalScore)
            }
            merged.updatedAt = new Date().toISOString()
            return merged
          }),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
      },

      moveTask: (id, targetColumn, targetOrder) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task
            return {
              ...task,
              column: targetColumn,
              order: targetOrder ?? task.order,
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      // ── Selectors ─────────────────────────────────────────────────────────

      getTasksByLane: (lane) => {
        return get().tasks.filter((t) => t.classification === lane)
      },

      getTasksByColumn: (lane, column) => {
        return get()
          .tasks.filter((t) => t.classification === lane && t.column === column)
          .sort((a, b) => a.order - b.order)
      },
    }),
    {
      name: 'chess-poker-tasks:v1',
      storage: createJSONStorage(safeLocalStorage),
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
)
