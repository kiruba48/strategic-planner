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
import { safeLocalStorage } from '../lib/safeLocalStorage.js'

export const useTaskStore = create()(
  persist(
    (set) => ({
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
              const newClassification = classifyTask(merged.totalScore)
              // Reset column to backlog if classification changed — prevents orphaned tasks
              if (newClassification !== task.classification) {
                merged.column = 'backlog'
              }
              merged.classification = newClassification
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
    }),
    {
      name: 'chess-poker-tasks:v1',
      storage: createJSONStorage(safeLocalStorage),
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
)
