/**
 * useLocalStorage.js — Persistent State Hook
 * ────────────────────────────────────────────
 * Drop-in replacement for useState that syncs to localStorage.
 * Handles JSON serialization, SSR safety, and storage errors.
 *
 * @param {string} key           - localStorage key
 * @param {*}      initialValue  - default value if key absent
 * @returns {[value, setValue]}  - same signature as useState
 */
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`useLocalStorage: failed to set "${key}"`, error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
