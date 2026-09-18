/**
 * nutritionReducer.test.js
 * ────────────────────────
 * Pure-function unit tests for every action type.
 * Run with: npm test
 */
import { describe, it, expect } from 'vitest'
import { nutritionReducer, initialState } from '../nutritionReducer'

// ─── Helpers ──────────────────────────────────────────────────
const meal1 = {
  id:       'meal-001',
  name:     'Grilled Chicken',
  calories: 350,
  macros:   { protein: 45, carbs: 10, fat: 8 },
}

const meal2 = {
  id:       'meal-002',
  name:     'Brown Rice',
  calories: 220,
  macros:   { protein: 5, carbs: 45, fat: 2 },
}

// ─── LOG_MEAL ─────────────────────────────────────────────────
describe('LOG_MEAL', () => {
  it('appends a meal to mealLog.meals', () => {
    const next = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    expect(next.mealLog.meals).toHaveLength(1)
    expect(next.mealLog.meals[0]).toMatchObject({ id: 'meal-001', name: 'Grilled Chicken' })
  })

  it('increments dailyTotal.calories correctly', () => {
    const next = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    expect(next.mealLog.dailyTotal.calories).toBe(350)
  })

  it('sums macros correctly after one meal', () => {
    const next = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    expect(next.mealLog.dailyTotal.protein).toBe(45)
    expect(next.mealLog.dailyTotal.carbs).toBe(10)
    expect(next.mealLog.dailyTotal.fat).toBe(8)
  })

  it('sums macros correctly after two meals', () => {
    const s1 = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    const s2 = nutritionReducer(s1,          { type: 'LOG_MEAL', payload: meal2 })
    expect(s2.mealLog.dailyTotal.calories).toBe(570)
    expect(s2.mealLog.dailyTotal.protein).toBe(50)
    expect(s2.mealLog.dailyTotal.carbs).toBe(55)
    expect(s2.mealLog.dailyTotal.fat).toBe(10)
  })

  it('auto-generates an id when none is provided', () => {
    const { id, ...mealWithoutId } = meal1
    const next = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: mealWithoutId })
    expect(next.mealLog.meals[0].id).toBeTruthy()
  })

  it('marks the logged meal with logged: true', () => {
    const next = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    expect(next.mealLog.meals[0].logged).toBe(true)
  })
})

// ─── REMOVE_MEAL ──────────────────────────────────────────────
describe('REMOVE_MEAL', () => {
  function stateWithTwo() {
    const s1 = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    return    nutritionReducer(s1,           { type: 'LOG_MEAL', payload: meal2 })
  }

  it('removes the meal by id', () => {
    const s2   = stateWithTwo()
    const next = nutritionReducer(s2, { type: 'REMOVE_MEAL', payload: 'meal-001' })
    expect(next.mealLog.meals).toHaveLength(1)
    expect(next.mealLog.meals[0].id).toBe('meal-002')
  })

  it('recalculates totals from the remaining array (not simple subtraction)', () => {
    const s2   = stateWithTwo()
    const next = nutritionReducer(s2, { type: 'REMOVE_MEAL', payload: 'meal-001' })
    // Only meal2 remains: 220 kcal, 5p / 45c / 2f
    expect(next.mealLog.dailyTotal.calories).toBe(220)
    expect(next.mealLog.dailyTotal.protein).toBe(5)
    expect(next.mealLog.dailyTotal.carbs).toBe(45)
    expect(next.mealLog.dailyTotal.fat).toBe(2)
  })

  it('removing the only meal resets totals to zero', () => {
    const s1   = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    const next = nutritionReducer(s1, { type: 'REMOVE_MEAL', payload: 'meal-001' })
    expect(next.mealLog.meals).toHaveLength(0)
    expect(next.mealLog.dailyTotal.calories).toBe(0)
  })

  it('removing a non-existent id leaves state unchanged', () => {
    const s1   = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    const next = nutritionReducer(s1, { type: 'REMOVE_MEAL', payload: 'does-not-exist' })
    expect(next.mealLog.meals).toHaveLength(1)
  })
})

// ─── RESET_DAILY_LOG ──────────────────────────────────────────
describe('RESET_DAILY_LOG', () => {
  it('clears meals and resets totals to zero', () => {
    const s1   = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    const next = nutritionReducer(s1, { type: 'RESET_DAILY_LOG' })
    expect(next.mealLog.meals).toHaveLength(0)
    expect(next.mealLog.dailyTotal.calories).toBe(0)
  })

  it('preserves the tdee value through reset', () => {
    const withTdee = nutritionReducer(initialState, { type: 'SET_TDEE', payload: 3000 })
    const next     = nutritionReducer(withTdee, { type: 'RESET_DAILY_LOG' })
    expect(next.mealLog.tdee).toBe(3000)
  })

  it('returns state with initialState mealLog shape', () => {
    const s1   = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    const next = nutritionReducer(s1, { type: 'RESET_DAILY_LOG' })
    expect(next.mealLog.dailyTotal).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0 })
  })
})

// ─── REHYDRATE ────────────────────────────────────────────────
describe('REHYDRATE', () => {
  it('merges persisted payload into state', () => {
    const persisted = {
      mealLog: {
        meals:      [meal1],
        dailyTotal: { calories: 350, protein: 45, carbs: 10, fat: 8 },
        tdee:       2800,
      },
    }
    const next = nutritionReducer(initialState, { type: 'REHYDRATE', payload: persisted })
    expect(next.mealLog.meals).toHaveLength(1)
    expect(next.mealLog.tdee).toBe(2800)
  })

  it('does not drop keys that exist in initialState but not in the payload', () => {
    const partial = { mealLog: { ...initialState.mealLog, tdee: 2200 } }
    const next    = nutritionReducer(initialState, { type: 'REHYDRATE', payload: partial })
    // scanner and currentScan should still be present from initialState
    expect(next.scanner).toBeDefined()
    expect(next.currentScan).toBeDefined()
  })
})

// ─── Unknown action — identity check ──────────────────────────
describe('Unknown action type', () => {
  it('returns the identical state reference (toBe, not toEqual)', () => {
    const result = nutritionReducer(initialState, { type: '__UNKNOWN__' })
    expect(result).toBe(initialState)
  })
})

// ─── Immutability ─────────────────────────────────────────────
describe('Immutability', () => {
  it('does not mutate the previous state on LOG_MEAL', () => {
    const frozen = Object.freeze({
      ...initialState,
      mealLog: Object.freeze({
        ...initialState.mealLog,
        meals:      Object.freeze([]),
        dailyTotal: Object.freeze({ ...initialState.mealLog.dailyTotal }),
      }),
      scanner:     Object.freeze({ ...initialState.scanner }),
      currentScan: Object.freeze({ ...initialState.currentScan }),
      scanResult:  Object.freeze({ ...initialState.scanResult }),
    })

    // Should not throw even though prevState is frozen
    expect(() => {
      nutritionReducer(frozen, { type: 'LOG_MEAL', payload: meal1 })
    }).not.toThrow()
  })

  it('does not mutate the previous state on REMOVE_MEAL', () => {
    const s1 = nutritionReducer(initialState, { type: 'LOG_MEAL', payload: meal1 })
    const frozen = Object.freeze({
      ...s1,
      mealLog: Object.freeze({
        ...s1.mealLog,
        meals:      Object.freeze([Object.freeze({ ...meal1 })]),
        dailyTotal: Object.freeze({ ...s1.mealLog.dailyTotal }),
      }),
    })
    expect(() => {
      nutritionReducer(frozen, { type: 'REMOVE_MEAL', payload: 'meal-001' })
    }).not.toThrow()
  })
})
