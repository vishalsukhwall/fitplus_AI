/**
 * DashboardGrid.test.jsx
 * ──────────────────────
 * Component tests for Central Dashboard Overview (DashboardGrid.jsx).
 * Tests real-time KPI rendering, macro progress bars, negative space, and empty states.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import DashboardGrid from '../Dashboard/DashboardGrid'

const STORAGE_KEY = 'fitpulse_nutrition_state'

describe('DashboardGrid Component', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders default zero state when no meals have been logged', () => {
    render(<DashboardGrid />)

    expect(screen.getByText(/Command Center/i)).toBeInTheDocument()
    expect(screen.getByText(/Real-Time Macronutrient & Caloric Architecture/i)).toBeInTheDocument()
    expect(screen.getByText(/Caloric Expenditure Balance/i)).toBeInTheDocument()
    expect(screen.getByText(/Protein Synthesis/i)).toBeInTheDocument()
    expect(screen.getByText(/Carbs & Lipids Distribution/i)).toBeInTheDocument()
    expect(screen.getByText(/No Meals Logged Today/i)).toBeInTheDocument()
  })

  it('pulls live metrics from localStorage and displays updated values and progress', () => {
    const mockState = {
      mealLog: {
        meals: [
          {
            id: 'meal-1',
            name: 'Grilled Salmon Bowl',
            portion: '300g',
            calories: 600,
            macros: { protein: 50, carbs: 40, fat: 20 },
            timestamp: new Date().toISOString(),
            source: 'computer_vision',
          },
        ],
        dailyTotal: {
          calories: 600,
          protein: 50,
          carbs: 40,
          fat: 20,
        },
        tdee: 2500,
      },
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockState))

    render(<DashboardGrid />)

    expect(screen.getByText('600')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText(/Grilled Salmon Bowl/i)).toBeInTheDocument()
    expect(screen.getByText(/Today’s Logged Meals \(1\)/i)).toBeInTheDocument()
    expect(screen.getByText(/AI Vision/i)).toBeInTheDocument()
  })

  it('renders action buttons for scanner, logger, and AI workout', () => {
    render(<DashboardGrid />)

    expect(screen.getByText(/Scan Food \(CV\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Log Meal/i)).toBeInTheDocument()
    expect(screen.getByText(/AI Workout/i)).toBeInTheDocument()
    expect(screen.getByText(/Launch Session Logger/i)).toBeInTheDocument()
  })
})
