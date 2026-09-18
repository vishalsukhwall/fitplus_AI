/**
 * useFoodScanner.js — ML Computer Vision Food Scanner Hook
 * ────────────────────────────────────────────────────────
 * Implements the state machine, ML simulation engine, and persistence
 * layer for FitPulse Elite's food scanner subsystem.
 *
 * Features:
 *   - 1.5-second realistic ML latency simulation
 *   - High-confidence food classification mock dataset
 *   - Automatic localStorage persistence for meals and daily totals
 *   - Full scanner lifecycle & hardware permission abstraction
 */

import { useReducer, useEffect, useRef, useCallback } from 'react'
import { nutritionReducer, initialState, recalculateTotals } from '../store/nutritionReducer'

export const STORAGE_KEY = 'fitpulse_nutrition_state'

// ─── High-Confidence Food Classification Mock Database ─────────
export const FOOD_DATABASE = [
  {
    name: 'Grilled Chicken Salad',
    portion: '320g bowl',
    category: 'High-Protein / Lean Fuel',
    description: 'Flame-grilled chicken breast over crisp romaine, English cucumber, cherry tomatoes, and cold-pressed extra virgin olive vinaigrette.',
    totalCalories: 380,
    macros: { protein: 44, carbs: 12, fat: 14 },
    confidence: 0.984, // 98.4%
    foodItems: [
      { name: 'Grilled Herb Chicken Breast', calories: 275, portion: '200g' },
      { name: 'Romaine, Cucumbers & Cherry Tomatoes', calories: 45, portion: '100g' },
      { name: 'Cold-Pressed Olive Vinaigrette', calories: 60, portion: '20g' },
    ],
  },
  {
    name: 'Paneer Tikka Bowl',
    portion: '350g bowl',
    category: 'Vegetarian / High-Protein',
    description: 'Spiced tandoori chargrilled paneer cubes with bell peppers, red onions, steamed basmati rice, and fresh mint-coriander yogurt drizzle.',
    totalCalories: 520,
    macros: { protein: 28, carbs: 42, fat: 26 },
    confidence: 0.976, // 97.6%
    foodItems: [
      { name: 'Tandoori Chargrilled Paneer', calories: 310, portion: '160g' },
      { name: 'Turmeric Basmati Rice', calories: 155, portion: '140g' },
      { name: 'Roasted Peppers & Mint Chutney', calories: 55, portion: '50g' },
    ],
  },
  {
    name: 'Wild Salmon & Sweet Potato',
    portion: '340g plate',
    category: 'Omega-3 / Performance',
    description: 'Pan-seared Alaskan wild sockeye salmon with steamed asparagus spears and roasted cinnamon sweet potato mash.',
    totalCalories: 540,
    macros: { protein: 46, carbs: 48, fat: 16 },
    confidence: 0.991, // 99.1%
    foodItems: [
      { name: 'Alaskan Wild Sockeye Salmon', calories: 335, portion: '190g' },
      { name: 'Roasted Sweet Potato Mash', calories: 175, portion: '120g' },
      { name: 'Steamed Asparagus Spears', calories: 30, portion: '80g' },
    ],
  },
  {
    name: 'Oatmeal with Peanut Butter & Banana',
    portion: '300g bowl',
    category: 'Complex Carbs / Pre-Workout',
    description: 'Steel-cut rolled oats simmered in almond milk, topped with freshly sliced banana, organic natural peanut butter, and chia seeds.',
    totalCalories: 460,
    macros: { protein: 18, carbs: 64, fat: 16 },
    confidence: 0.968, // 96.8%
    foodItems: [
      { name: 'Slow-Cooked Rolled Oats', calories: 235, portion: '180g' },
      { name: 'Natural Peanut Butter', calories: 145, portion: '25g' },
      { name: 'Sliced Banana & Chia Seeds', calories: 80, portion: '95g' },
    ],
  },
  {
    name: 'Avocado Sourdough & Poached Eggs',
    portion: '280g plate',
    category: 'Essential Fats & Micronutrients',
    description: 'Artisan rustic sourdough toast topped with creamy Hass avocado mash, two farm-fresh poached eggs, and micro-radish sprouts.',
    totalCalories: 430,
    macros: { protein: 22, carbs: 36, fat: 22 },
    confidence: 0.987, // 98.7%
    foodItems: [
      { name: 'Toasted Rustic Sourdough', calories: 160, portion: '2 slices' },
      { name: 'Crushed Hass Avocado', calories: 130, portion: '80g' },
      { name: 'Pasture-Raised Poached Eggs', calories: 140, portion: '2 large' },
    ],
  },
  {
    name: 'Greek Yogurt Berry Parfait',
    portion: '260g glass',
    category: 'Gut Health / Clean Protein',
    description: 'Authentic 0% Greek strained yogurt layered with antioxidant-rich wild blueberries, organic raw clover honey, and toasted almond slivers.',
    totalCalories: 290,
    macros: { protein: 26, carbs: 38, fat: 4 },
    confidence: 0.979, // 97.9%
    foodItems: [
      { name: '0% Strained Greek Yogurt', calories: 170, portion: '200g' },
      { name: 'Wild Blueberries & Raw Honey', calories: 85, portion: '50g' },
      { name: 'Toasted Almond Slivers', calories: 35, portion: '10g' },
    ],
  },
]

/**
 * Initializes state from localStorage safely.
 */
function initFromStorage(defaultInit) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultInit
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultInit

    const parsed = JSON.parse(saved)
    return {
      ...defaultInit,
      mealLog: {
        ...defaultInit.mealLog,
        ...(parsed.mealLog || {}),
        meals: parsed.mealLog?.meals || [],
        dailyTotal: recalculateTotals(parsed.mealLog?.meals || []),
      },
    }
  } catch (err) {
    console.warn('useFoodScanner: failed to rehydrate from localStorage', err)
    return defaultInit
  }
}

export function useFoodScanner(customStorageKey = STORAGE_KEY) {
  const [state, dispatch] = useReducer(nutritionReducer, initialState, initFromStorage)
  const debounceTimerRef = useRef(null)
  const isMountedRef = useRef(true)
  const nextItemIndexRef = useRef(0)

  // Track component mount status to prevent post-unmount dispatches
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // ── Automatic localStorage persistence (debounced 200ms) ───
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return

    clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => {
      try {
        const payloadToPersist = {
          mealLog: {
            meals: state.mealLog.meals,
            dailyTotal: state.mealLog.dailyTotal,
            tdee: state.mealLog.tdee,
          },
        }
        window.localStorage.setItem(customStorageKey, JSON.stringify(payloadToPersist))
      } catch (err) {
        console.warn('useFoodScanner: localStorage sync error', err)
      }
    }, 200)

    return () => clearTimeout(debounceTimerRef.current)
  }, [state.mealLog, customStorageKey])

  // ── Scanner Lifecycle Actions ─────────────────────────────
  const startScanner = useCallback(() => {
    dispatch({ type: 'SCANNER_INIT' })
  }, [])

  const stopScanner = useCallback(() => {
    // Release video stream if present
    if (state.scanner.videoStream) {
      try {
        state.scanner.videoStream.getTracks().forEach((track) => track.stop())
      } catch (err) {
        console.warn('useFoodScanner: error stopping video tracks', err)
      }
    }
    dispatch({ type: 'SCANNER_CLOSE' })
  }, [state.scanner.videoStream])

  const setCameraInitialized = useCallback((stream) => {
    dispatch({ type: 'CAMERA_INITIALIZED', payload: stream })
  }, [])

  const setCameraError = useCallback((error) => {
    dispatch({ type: 'CAMERA_ERROR', payload: error })
  }, [])

  const resetScan = useCallback(() => {
    dispatch({ type: 'SCAN_RESET' })
  }, [])

  // ── ML Simulation Engine (Realistic 1.5s latency) ─────────
  const captureAndAnalyze = useCallback(
    async (imageData = null, preferredIndex = null) => {
      dispatch({ type: 'SCAN_IMAGE', payload: imageData })

      try {
        // Realistic network & neural inference delay: 1500ms
        await new Promise((resolve) => setTimeout(resolve, 1500))

        if (!isMountedRef.current) return null

        // Select food item from database
        let selectedFood
        if (typeof preferredIndex === 'number' && preferredIndex >= 0 && preferredIndex < FOOD_DATABASE.length) {
          selectedFood = FOOD_DATABASE[preferredIndex]
        } else {
          selectedFood = FOOD_DATABASE[nextItemIndexRef.current % FOOD_DATABASE.length]
          nextItemIndexRef.current += 1
        }

        const scanPayload = {
          ...selectedFood,
          imageData,
          timestamp: new Date().toISOString(),
        }

        dispatch({ type: 'ANALYSIS_COMPLETE', payload: scanPayload })
        return scanPayload
      } catch (err) {
        if (!isMountedRef.current) return null
        const errorMsg = err?.message || 'Neural inference failed. Please try again.'
        dispatch({ type: 'ANALYSIS_ERROR', payload: errorMsg })
        throw err
      }
    },
    []
  )

  // ── Meal Logging Actions ──────────────────────────────────
  const logScannedMeal = useCallback(
    (customOverrides = {}) => {
      const currentResult = state.scanResult
      if (!currentResult || !currentResult.name) {
        console.warn('useFoodScanner: no active scanResult to log')
        return null
      }

      const mealToLog = {
        id: `meal-cv-${Date.now()}`,
        name: customOverrides.name ?? currentResult.name,
        calories: customOverrides.totalCalories ?? customOverrides.calories ?? currentResult.totalCalories,
        portion: customOverrides.portion ?? currentResult.portion,
        category: customOverrides.category ?? currentResult.category,
        confidence: currentResult.confidence,
        macros: customOverrides.macros ?? currentResult.macros,
        foodItems: customOverrides.foodItems ?? currentResult.foodItems,
        timestamp: new Date().toISOString(),
        source: 'computer_vision',
      }

      dispatch({ type: 'LOG_MEAL', payload: mealToLog })
      return mealToLog
    },
    [state.scanResult]
  )

  const removeMeal = useCallback((mealId) => {
    dispatch({ type: 'REMOVE_MEAL', payload: mealId })
  }, [])

  const resetDailyLog = useCallback(() => {
    dispatch({ type: 'RESET_DAILY_LOG' })
  }, [])

  const setTdee = useCallback((kcal) => {
    dispatch({ type: 'SET_TDEE', payload: kcal })
  }, [])

  // ── Return Unified Interface ──────────────────────────────
  return {
    state,
    dispatch,
    // Convenience state properties
    isActive:         state.scanner.isActive,
    isProcessing:     state.scanner.isProcessing,
    cameraPermission: state.scanner.cameraPermission,
    videoStream:      state.scanner.videoStream,
    error:            state.scanner.error,
    imageData:        state.currentScan.imageData,
    isAnalyzing:      state.currentScan.isAnalyzing,
    confidence:       state.currentScan.confidence,
    scanResult:       state.scanResult,
    meals:            state.mealLog.meals,
    dailyTotal:       state.mealLog.dailyTotal,
    tdee:             state.mealLog.tdee,
    // Action handlers
    actions: {
      startScanner,
      stopScanner,
      setCameraInitialized,
      setCameraError,
      captureAndAnalyze,
      logScannedMeal,
      resetScan,
      removeMeal,
      resetDailyLog,
      setTdee,
    },
    // Direct action bindings for quick invocation
    startScanner,
    stopScanner,
    captureAndAnalyze,
    logScannedMeal,
    resetScan,
    removeMeal,
    resetDailyLog,
  }
}

export default useFoodScanner
