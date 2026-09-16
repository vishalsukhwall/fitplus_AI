/**
 * useNutrition.js — Nutrition State Management Hook
 * ──────────────────────────────────────────────────
 * Wraps nutritionReducer with useReducer + localStorage persistence.
 * Provides stable action dispatchers for common operations.
 */
import { useReducer, useEffect } from 'react'
import { nutritionReducer, initialState } from '../store/nutritionReducer'

const STORAGE_KEY = 'fitpulse_nutrition_state'

export function useNutrition() {
  const [state, dispatch] = useReducer(nutritionReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...init, ...JSON.parse(saved) } : init
    } catch {
      return init
    }
  })

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      // Don't persist videoStream (not serializable)
      const { scanner, ...rest } = state
      const { videoStream, ...safeScanner } = scanner
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, scanner: safeScanner }))
    } catch {
      // Quota exceeded or private mode — fail silently
    }
  }, [state])

  // ── Stable action helpers ─────────────────────────────────
  const actions = {
    logMeal:       (meal)      => dispatch({ type: 'LOG_MEAL',   payload: meal }),
    removeMeal:    (id)        => dispatch({ type: 'REMOVE_MEAL', payload: id }),
    setTdee:       (kcal)      => dispatch({ type: 'SET_TDEE',    payload: kcal }),
    resetDay:      ()          => dispatch({ type: 'RESET_DAILY_LOG' }),
    initScanner:   ()          => dispatch({ type: 'SCANNER_INIT' }),
    closeScanner:  ()          => dispatch({ type: 'SCANNER_CLOSE' }),
    scanImage:     (blob)      => dispatch({ type: 'SCAN_IMAGE', payload: blob }),
    scanComplete:  (result)    => dispatch({ type: 'ANALYSIS_COMPLETE', payload: result }),
    scanError:     (msg)       => dispatch({ type: 'ANALYSIS_ERROR', payload: msg }),
    scanReset:     ()          => dispatch({ type: 'SCAN_RESET' }),
  }

  return { state, dispatch, actions }
}

export default useNutrition
