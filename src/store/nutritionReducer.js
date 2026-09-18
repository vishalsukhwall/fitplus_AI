/**
 * nutritionReducer.js — Nutrition & Food Scanner State Machine
 * ──────────────────────────────────────────────────────────────
 * Manages the complete nutrition state architecture:
 *   scanner | currentScan | scanResult | mealLog
 *
 * Designed for FitPulse Elite with zero-runtime dependencies beyond app constants.
 */

import { NUTRITION_DEFAULTS } from '../utils/constants'

// ─── Initial State ────────────────────────────────────────────
export const initialState = {
  scanner: {
    isActive:         false,
    cameraPermission: 'pending',   // 'granted' | 'denied' | 'pending' | 'unavailable' | 'insecure'
    videoStream:      null,
    isProcessing:     false,
    error:            null,
  },
  currentScan: {
    imageData:   null,
    isAnalyzing: false,
    confidence:  0,
  },
  scanResult: {
    name:          null,
    portion:       null,
    category:      null,
    description:   null,
    foodItems:     [],
    totalCalories: 0,
    macros:        { protein: 0, carbs: 0, fat: 0 },
    confidence:    0,
    timestamp:     null,
  },
  mealLog: {
    meals:      [],
    dailyTotal: {
      calories: 0,
      protein:  0,
      carbs:    0,
      fat:      0,
    },
    tdee: NUTRITION_DEFAULTS?.tdee ?? 2500,
  },
}

// ─── Helper — Recalculate daily macros ───────────────────────
export function recalculateTotals(meals = []) {
  return meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories ?? meal.cal ?? 0),
      protein:  acc.protein  + (meal.macros?.protein ?? meal.protein ?? meal.p ?? 0),
      carbs:    acc.carbs    + (meal.macros?.carbs   ?? meal.carbs   ?? meal.c ?? 0),
      fat:      acc.fat      + (meal.macros?.fat     ?? meal.fat     ?? meal.f ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}

// ─── Reducer ─────────────────────────────────────────────────
export function nutritionReducer(state = initialState, action) {
  switch (action?.type) {

    // ── Scanner lifecycle ───────────────────────────────────
    case 'SCANNER_INIT':
      return {
        ...state,
        scanner: {
          ...state.scanner,
          isActive:     true,
          error:        null,
          isProcessing: false,
        },
      }

    case 'CAMERA_INITIALIZED':
      return {
        ...state,
        scanner: {
          ...state.scanner,
          cameraPermission: 'granted',
          videoStream:      action.payload,
          isProcessing:     false,
          error:            null,
        },
      }

    case 'CAMERA_ERROR':
      return {
        ...state,
        scanner: {
          ...state.scanner,
          cameraPermission: action.payload?.permission ?? 'denied',
          videoStream:      null,
          isProcessing:     false,
          error:            action.payload?.message ?? action.payload,
        },
      }

    case 'SET_PROCESSING':
      return {
        ...state,
        scanner: {
          ...state.scanner,
          isProcessing: Boolean(action.payload),
        },
      }

    case 'SCANNER_CLOSE':
      return {
        ...state,
        scanner: {
          ...state.scanner,
          isActive:     false,
          videoStream:  null,
          isProcessing: false,
        },
        currentScan: { ...initialState.currentScan },
      }

    // ── Scan actions ────────────────────────────────────────
    case 'SCAN_IMAGE':
      return {
        ...state,
        scanner: {
          ...state.scanner,
          isProcessing: true,
          error:        null,
        },
        currentScan: {
          imageData:   action.payload,
          isAnalyzing: true,
          confidence:  0,
        },
        scanResult: { ...initialState.scanResult },
      }

    case 'ANALYSIS_COMPLETE': {
      const payload = action.payload || {}
      const macros = payload.macros ?? {
        protein: payload.protein ?? 0,
        carbs:   payload.carbs   ?? 0,
        fat:     payload.fat     ?? 0,
      }
      const foodItems = payload.foodItems ?? (
        payload.name
          ? [{ name: payload.name, calories: payload.totalCalories ?? payload.calories ?? 0, portion: payload.portion ?? '1 serving' }]
          : []
      )
      const totalCalories = payload.totalCalories ?? payload.calories ?? 0
      const confidence = payload.confidence ?? 0.984

      return {
        ...state,
        scanner: {
          ...state.scanner,
          isProcessing: false,
          error:        null,
        },
        currentScan: {
          ...state.currentScan,
          isAnalyzing: false,
          confidence,
        },
        scanResult: {
          name:          payload.name ?? foodItems[0]?.name ?? 'Detected Meal',
          portion:       payload.portion ?? '1 serving',
          category:      payload.category ?? 'High-Protein Fuel',
          description:   payload.description ?? '',
          foodItems,
          totalCalories,
          macros,
          confidence,
          timestamp:     new Date().toISOString(),
        },
      }
    }

    case 'ANALYSIS_ERROR':
      return {
        ...state,
        scanner: {
          ...state.scanner,
          isProcessing: false,
          error:        action.payload,
        },
        currentScan: {
          ...state.currentScan,
          isAnalyzing: false,
        },
      }

    case 'SCAN_RESET':
      return {
        ...state,
        scanner: {
          ...state.scanner,
          isProcessing: false,
          error:        null,
        },
        currentScan: { ...initialState.currentScan },
        scanResult:  { ...initialState.scanResult },
      }

    // ── Meal log ────────────────────────────────────────────
    case 'LOG_MEAL': {
      const newMeal = {
        ...action.payload,
        id:        action.payload.id ?? `meal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: action.payload.timestamp ?? new Date().toISOString(),
        logged:    true,
      }
      const updatedMeals = [...state.mealLog.meals, newMeal]
      return {
        ...state,
        mealLog: {
          ...state.mealLog,
          meals:      updatedMeals,
          dailyTotal: recalculateTotals(updatedMeals),
        },
      }
    }

    case 'REMOVE_MEAL': {
      const filtered = state.mealLog.meals.filter(m => m.id !== action.payload)
      return {
        ...state,
        mealLog: {
          ...state.mealLog,
          meals:      filtered,
          dailyTotal: recalculateTotals(filtered),
        },
      }
    }

    case 'SET_TDEE':
      return {
        ...state,
        mealLog: { ...state.mealLog, tdee: action.payload },
      }

    case 'RESET_DAILY_LOG':
      return {
        ...state,
        mealLog: {
          ...initialState.mealLog,
          tdee: state.mealLog.tdee,
        },
      }

    // ── State persistence ────────────────────────────────────
    case 'REHYDRATE':
      return {
        ...initialState,
        ...action.payload,
        // Ensure scanner and currentScan reset to idle when restored
        scanner: {
          ...initialState.scanner,
          ...(action.payload?.scanner ?? {}),
          isActive:     false,
          videoStream:  null,
          isProcessing: false,
        },
        currentScan: {
          ...initialState.currentScan,
        },
        mealLog: {
          ...initialState.mealLog,
          ...(action.payload?.mealLog ?? {}),
          dailyTotal: recalculateTotals(action.payload?.mealLog?.meals ?? []),
        },
      }

    default:
      return state
  }
}

export default nutritionReducer
