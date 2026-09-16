/**
 * nutritionReducer.js — Nutrition & Food Scanner State Machine
 * ──────────────────────────────────────────────────────────────
 * Manages the full nutrition state shape defined in the blueprint:
 *   scanner | currentScan | scanResult | mealLog
 *
 * Used by: useFoodScanner.js (coming in Part 3)
 */

import { NUTRITION_DEFAULTS } from '../utils/constants'

// ─── Initial State ────────────────────────────────────────────
export const initialState = {
  scanner: {
    isActive:         false,
    cameraPermission: 'pending',   // 'granted' | 'denied' | 'pending'
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
    foodItems:     [],
    totalCalories: 0,
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
    tdee: NUTRITION_DEFAULTS.tdee,
  },
}

// ─── Helper — Recalculate daily macros ───────────────────────
function recalculateTotals(meals) {
  return meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories ?? 0),
      protein:  acc.protein  + (meal.macros?.protein ?? meal.p ?? 0),
      carbs:    acc.carbs    + (meal.macros?.carbs   ?? meal.c ?? 0),
      fat:      acc.fat      + (meal.macros?.fat     ?? meal.f ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}

// ─── Reducer ─────────────────────────────────────────────────
export function nutritionReducer(state, action) {
  switch (action.type) {

    // ── Scanner lifecycle ───────────────────────────────────
    case 'SCANNER_INIT':
      return {
        ...state,
        scanner: { ...state.scanner, isActive: true, error: null },
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
          cameraPermission: 'denied',
          isProcessing:     false,
          error:            action.payload,
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
        currentScan: {
          imageData:   action.payload,
          isAnalyzing: true,
          confidence:  0,
        },
        scanResult: { ...initialState.scanResult },
      }

    case 'ANALYSIS_COMPLETE':
      return {
        ...state,
        currentScan: {
          ...state.currentScan,
          isAnalyzing: false,
          confidence:  action.payload.confidence ?? 0,
        },
        scanResult: {
          foodItems:     action.payload.foodItems ?? [],
          totalCalories: action.payload.totalCalories ?? 0,
          timestamp:     new Date().toISOString(),
        },
      }

    case 'ANALYSIS_ERROR':
      return {
        ...state,
        currentScan: { ...state.currentScan, isAnalyzing: false },
        scanner: { ...state.scanner, error: action.payload },
      }

    case 'SCAN_RESET':
      return {
        ...state,
        currentScan: { ...initialState.currentScan },
        scanResult:  { ...initialState.scanResult },
      }

    // ── Meal log ────────────────────────────────────────────
    case 'LOG_MEAL': {
      const newMeal = {
        ...action.payload,
        id:        action.payload.id ?? `meal-${Date.now()}`,
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
        mealLog: { ...initialState.mealLog, tdee: state.mealLog.tdee },
      }

    // ── State persistence ────────────────────────────────────
    case 'REHYDRATE':
      return { ...initialState, ...action.payload }

    default:
      return state
  }
}
