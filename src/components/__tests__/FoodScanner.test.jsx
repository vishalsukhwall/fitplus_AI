/**
 * FoodScanner.test.jsx
 * ────────────────────
 * Component tests for the Master Scanner Interface & ScanResult component.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import FoodScanner from '../Scanner/FoodScanner'
import ScanResult from '../Scanner/ScanResult'

describe('FoodScanner Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the empty state UI with dashed container, cyber icon, and action prompts', () => {
    render(<FoodScanner />)

    expect(screen.getByText(/ML Computer Vision Food Scanner/i)).toBeInTheDocument()
    expect(screen.getByText(/Activate Camera/i)).toBeInTheDocument()
    expect(screen.getByText(/Upload Image/i)).toBeInTheDocument()
    expect(screen.getByText(/FitPulse Vision CV Module/i)).toBeInTheDocument()
    expect(screen.getByText(/ResNet-50 CV/i)).toBeInTheDocument()
  })

  it('triggers 1.5s simulated inference and renders ScanResult with 4-column macro grid', async () => {
    const handleMealLogged = vi.fn()
    render(<FoodScanner onMealLogged={handleMealLogged} />)

    // Click demo simulation trigger
    const demoButton = screen.getByText(/run instant 1.5s simulated inference/i)
    act(() => {
      fireEvent.click(demoButton)
    })

    // Should enter analyzing state
    expect(screen.getByText(/Processing Computer Vision Model/i)).toBeInTheDocument()
    expect(screen.getByText(/Inferring Macro Vectors/i)).toBeInTheDocument()

    // Advance by 1500ms
    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    // Should mount ScanResult
    expect(screen.getByText(/ML Confidence/i)).toBeInTheDocument()
    expect(screen.getByText(/Macronutrient Profile/i)).toBeInTheDocument()
    expect(screen.getByText(/Calories/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Protein/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Carbs/i)).toBeInTheDocument()
    expect(screen.getByText(/Fats/i)).toBeInTheDocument()
    expect(screen.getByText(/Add to Today's Log/i)).toBeInTheDocument()
    expect(screen.getByText(/Scan Another/i)).toBeInTheDocument()

    // Click Add to Today's Log
    const addBtn = screen.getByText(/Add to Today's Log/i)
    act(() => {
      fireEvent.click(addBtn)
    })

    expect(screen.getByText(/Added to Daily Log/i)).toBeInTheDocument()
    expect(handleMealLogged).toHaveBeenCalled()
  })
})

describe('ScanResult Component', () => {
  const sampleResult = {
    name: 'Grilled Chicken Salad',
    category: 'High-Protein / Lean Fuel',
    portion: '320g bowl',
    description: 'Flame-grilled chicken breast over crisp romaine.',
    totalCalories: 380,
    macros: { protein: 44, carbs: 12, fat: 14 },
    confidence: 0.984,
    foodItems: [
      { name: 'Grilled Herb Chicken Breast', calories: 275, portion: '200g' },
      { name: 'Romaine Salad', calories: 45, portion: '100g' },
    ],
  }

  const user = userEvent.setup({ delay: null })

  it('renders recognized food taxonomy, 98.4% confidence, and macro metrics', () => {
    render(<ScanResult scanResult={sampleResult} />)

    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument()
    expect(screen.getByText('98.4%')).toBeInTheDocument()
    expect(screen.getByText('380')).toBeInTheDocument()
    expect(screen.getByText('44')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.getByText(/High-Protein \/ Lean Fuel/i)).toBeInTheDocument()
  })

  it('scales calories and macros when portion multiplier is clicked', async () => {
    render(<ScanResult scanResult={sampleResult} />)

    // Initial calories is 380
    expect(screen.getByText('380')).toBeInTheDocument()

    // Click 2.0x multiplier
    const mult2x = screen.getByText('2x')
    await user.click(mult2x)

    // 380 * 2 = 760
    expect(screen.getByText('760')).toBeInTheDocument()
    // 44 * 2 = 88 protein
    expect(screen.getByText('88')).toBeInTheDocument()
  })

  it('fires onLogMeal callback with scaled meal data when Add to Log is clicked', async () => {
    const handleLog = vi.fn()
    render(<ScanResult scanResult={sampleResult} onLogMeal={handleLog} />)

    const addBtn = screen.getByText(/Add to Today's Log/i)
    await user.click(addBtn)

    expect(handleLog).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Grilled Chicken Salad',
        calories: 380,
        macros: { protein: 44, carbs: 12, fat: 14 },
      })
    )
  })

  it('fires onScanAnother callback when Scan Another is clicked', async () => {
    const handleScanAnother = vi.fn()
    render(<ScanResult scanResult={sampleResult} onScanAnother={handleScanAnother} />)

    const scanAnotherBtn = screen.getByText(/Scan Another/i)
    await user.click(scanAnotherBtn)

    expect(handleScanAnother).toHaveBeenCalled()
  })
})
