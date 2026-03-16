/**
 * Safe localStorage wrapper — handles incognito / quota errors gracefully.
 * Shared across all stores for consistent error handling.
 */

export const safeLocalStorage = () => {
  try {
    return {
      getItem: (key) => {
        try {
          return localStorage.getItem(key)
        } catch (e) {
          console.error('[storage] getItem failed:', e)
          return null
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value)
        } catch (e) {
          console.error('[storage] setItem failed (quota exceeded or security error):', e)
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key)
        } catch (e) {
          console.error('[storage] removeItem failed:', e)
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
