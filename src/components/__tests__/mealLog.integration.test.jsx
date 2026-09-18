/**
 * mealLog.integration.test.jsx
 * ─────────────────────────────
 * Integration tests for the meal-log flow.
 * Tests that state lifts correctly to the UI via useNutrition.
 * Uses a lightweight wrapper component that exercises the hook directly,
 * avoiding complex Scanner/Camera setup while still testing the full
 * useReducer → localStorage → UI pipeline.
 *
 * Run with: npm test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useContext, createContext } from 'react'

// Import the hook under test directly
import { useNutrition } from '../../hooks/useNutrition'

// ─── Mock localStorage ────────────────────────────────────────
const localStorageMock = (() => {
  let store = {}
  return {
    getItem:  (key) => store[key] ?? null,
    setItem:  (key, val) => { store[key] = String(val) },
    removeItem: (key) => { delete store[key] },
    clear:    () => { store = {} },
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true })

// ─── Test Harness Component ───────────────────────────────────
/**
 * A minimal component that exposes the nutrition state and dispatch
 * via data-testid attributes so tests can read values without
 * depending on visual layout.
 */
function NutritionTestHarness() {
  const { state, actions } = useNutrition()
  const { meals, dailyTotal } = state.mealLog

  return (
    <div>
      <span data-testid="calorie-total">{dailyTotal.calories}</span>
      <span data-testid="protein-total">{dailyTotal.protein}</span>
      <span data-testid="carbs-total">{dailyTotal.carbs}</span>
      <span data-testid="fat-total">{dailyTotal.fat}</span>
      <span data-testid="meal-count">{meals.length}</span>
      {meals.map((m) => (
        <div key={m.id} data-testid={`meal-${m.id}`}>
          <span data-testid={`meal-name-${m.id}`}>{m.name}</span>
          <button
            data-testid={`remove-${m.id}`}
            onClick={() => actions.removeMeal(m.id)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        data-testid="log-meal-a"
        onClick={() =>
          actions.logMeal({
            id: 'meal-a', name: 'Chicken', calories: 350,
            macros: { protein: 45, carbs: 10, fat: 8 },
          })
        }
      >
        Log A
      </button>
      <button
        data-testid="log-meal-b"
        onClick={() =>
          actions.logMeal({
            id: 'meal-b', name: 'Rice', calories: 220,
            macros: { protein: 5, carbs: 45, fat: 2 },
          })
        }
      >
        Log B
      </button>
      <button
        data-testid="log-meal-c"
        onClick={() =>
          actions.logMeal({
            id: 'meal-c', name: 'Salad', calories: 120,
            macros: { protein: 3, carbs: 15, fat: 5 },
          })
        }
      >
        Log C
      </button>
    </div>
  )
}

// ─── Tests ────────────────────────────────────────────────────
describe('Meal Log Integration', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    localStorageMock.clear()
  })

  it('calorie total updates in the same render after logging a meal', async () => {
    render(<NutritionTestHarness />)
    expect(screen.getByTestId('calorie-total').textContent).toBe('0')

    await user.click(screen.getByTestId('log-meal-a'))

    expect(screen.getByTestId('calorie-total').textContent).toBe('350')
  })

  it('macro breakdown recalculates correctly after two meals', async () => {
    render(<NutritionTestHarness />)

    await user.click(screen.getByTestId('log-meal-a'))
    await user.click(screen.getByTestId('log-meal-b'))

    expect(screen.getByTestId('calorie-total').textContent).toBe('570')
    expect(screen.getByTestId('protein-total').textContent).toBe('50')   // 45 + 5
    expect(screen.getByTestId('carbs-total').textContent).toBe('55')     // 10 + 45
    expect(screen.getByTestId('fat-total').textContent).toBe('10')       // 8 + 2
  })

  it('rapid dispatch × 3 — all three meals persist (stale-closure guard)', async () => {
    render(<NutritionTestHarness />)

    // Fire three dispatches in rapid succession
    await act(async () => {
      await user.click(screen.getByTestId('log-meal-a'))
      await user.click(screen.getByTestId('log-meal-b'))
      await user.click(screen.getByTestId('log-meal-c'))
    })

    expect(screen.getByTestId('meal-count').textContent).toBe('3')
    expect(screen.getByTestId('calorie-total').textContent).toBe('690') // 350+220+120
  })

  it('removing the middle meal recomputes totals from remaining array', async () => {
    render(<NutritionTestHarness />)

    await user.click(screen.getByTestId('log-meal-a'))
    await user.click(screen.getByTestId('log-meal-b'))
    await user.click(screen.getByTestId('log-meal-c'))

    // Remove the middle meal (meal-b)
    await user.click(screen.getByTestId('remove-meal-b'))

    // meal-a (350 kcal) + meal-c (120 kcal) = 470
    expect(screen.getByTestId('meal-count').textContent).toBe('2')
    expect(screen.getByTestId('calorie-total').textContent).toBe('470')
    expect(screen.getByTestId('protein-total').textContent).toBe('48')  // 45 + 3
    expect(screen.getByTestId('carbs-total').textContent).toBe('25')    // 10 + 15
    expect(screen.getByTestId('fat-total').textContent).toBe('13')      // 8 + 5
  })

  it('meal-a is present and meal-b is removed after selective removal', async () => {
    render(<NutritionTestHarness />)

    await user.click(screen.getByTestId('log-meal-a'))
    await user.click(screen.getByTestId('log-meal-b'))
    await user.click(screen.getByTestId('remove-meal-b'))

    expect(screen.queryByTestId('meal-meal-a')).toBeInTheDocument()
    expect(screen.queryByTestId('meal-meal-b')).not.toBeInTheDocument()
  })
})
