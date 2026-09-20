/**
 * MealLogger.test.jsx
 * ───────────────────
 * Component tests for Interactive Meal Logger & History (MealLogger.jsx).
 * Tests intelligent macro calculation, live preview card, manual overrides,
 * 1-click presets, deletion, and empty states.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import MealLogger from '../Meals/MealLogger'

describe('MealLogger Component', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the manual log fallback form and empty state initially', () => {
    render(<MealLogger />)

    expect(screen.getByText(/Meal Logger & Chronological History/i)).toBeInTheDocument()
    expect(screen.getByText(/Manual Log Entry/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Flame-Grilled Ribeye Steak/i)).toBeInTheDocument()
    expect(screen.getByText(/No Meals Logged Yet/i)).toBeInTheDocument()
    expect(screen.getByText(/1-Click Athlete Presets:/i)).toBeInTheDocument()
  })

  it('allows manually adding a custom food item with macros and updates feed', async () => {
    const user = userEvent.setup()
    render(<MealLogger />)

    const nameInput = screen.getByPlaceholderText(/Flame-Grilled Ribeye Steak/i)
    const calInput = screen.getByPlaceholderText('480')
    const pInput = screen.getByPlaceholderText('45')
    const cInput = screen.getByPlaceholderText('30')
    const fInput = screen.getByPlaceholderText('12')
    const submitBtn = screen.getByText(/Add Meal to Daily Log/i)

    await user.type(nameInput, 'Egg White Omelet')
    await user.type(calInput, '250')
    await user.type(pInput, '35')
    await user.type(cInput, '4')
    await user.type(fInput, '6')

    await user.click(submitBtn)

    expect(screen.getByText('Egg White Omelet')).toBeInTheDocument()
    expect(screen.getAllByText(/250 kcal/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/35g P|35g Protein/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Today’s Meal Feed/i)).toBeInTheDocument()
  })

  it('automatically calculates macros and shows live preview card when typing food name and portion', async () => {
    const user = userEvent.setup()
    render(<MealLogger />)

    const nameInput = screen.getByPlaceholderText(/Flame-Grilled Ribeye Steak/i)
    const portionInput = screen.getByPlaceholderText(/e\.g\. 100g, 2 cups, 1\.5 scoop/i)

    await user.type(nameInput, 'Oats')
    await user.type(portionInput, '100g')

    // Live Calculated Preview Card should appear
    expect(screen.getByText(/Live Calculated Preview/i)).toBeInTheDocument()
    expect(screen.getByText(/Oats \/ Oatmeal/i)).toBeInTheDocument()
    expect(screen.getByText(/DB Match/i)).toBeInTheDocument()
    expect(screen.getByText('389')).toBeInTheDocument()
    expect(screen.getByText('16.9g')).toBeInTheDocument()

    // Submit meal without typing into the macro inputs
    const submitBtn = screen.getByText(/Add Meal to Daily Log/i)
    await user.click(submitBtn)

    // Verify it was logged with the auto-calculated macros
    expect(screen.getAllByText('Oats').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/389 kcal/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/17g P/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Smart Calc/i).length).toBeGreaterThan(0)
  })

  it('allows manual override of auto-calculated macros', async () => {
    const user = userEvent.setup()
    render(<MealLogger />)

    const nameInput = screen.getByPlaceholderText(/Flame-Grilled Ribeye Steak/i)
    const portionInput = screen.getByPlaceholderText(/e\.g\. 100g, 2 cups, 1\.5 scoop/i)
    const calInput = screen.getByPlaceholderText('480')

    await user.type(nameInput, 'Chicken Breast')
    await user.type(portionInput, '100g')

    expect(screen.getByText(/Live Calculated Preview/i)).toBeInTheDocument()
    expect(screen.getByText('165')).toBeInTheDocument()

    // Override calories to 200
    await user.type(calInput, '200')

    // Live preview should show Manual Override badge
    expect(screen.getByText(/Manual Override/i)).toBeInTheDocument()
    expect(screen.getAllByText('200').length).toBeGreaterThan(0)

    const submitBtn = screen.getByText(/Add Meal to Daily Log/i)
    await user.click(submitBtn)

    expect(screen.getAllByText('Chicken Breast').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/200 kcal/i).length).toBeGreaterThan(0)
  })

  it('populates food name and portion when clicking staple chips', async () => {
    const user = userEvent.setup()
    render(<MealLogger />)

    const paneerChip = screen.getByRole('button', { name: 'Paneer' })
    await user.click(paneerChip)

    // Should auto-fill name to Paneer and portion to 100g
    expect(screen.getByText(/Live Calculated Preview/i)).toBeInTheDocument()
    expect(screen.getByText(/Paneer \(Indian Cottage Cheese\)/i)).toBeInTheDocument()
    expect(screen.getByText('265')).toBeInTheDocument()
  })

  it('adds preset meal on 1-click preset button press', async () => {
    const user = userEvent.setup()
    render(<MealLogger />)

    const presetBtn = screen.getByText(/Whey Protein Isolate Shake/i)
    await user.click(presetBtn)

    // Appears in preset list and in the logged feed
    expect(screen.getAllByText('Whey Protein Isolate Shake').length).toBe(2)
    expect(screen.getAllByText(/135 kcal/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/30g P|30g Protein/i).length).toBeGreaterThan(0)
  })

  it('removes meal when delete button is clicked and recalculates totals', async () => {
    const user = userEvent.setup()
    render(<MealLogger />)

    const presetBtn = screen.getByText(/Whey Protein Isolate Shake/i)
    await user.click(presetBtn)

    expect(screen.getAllByText('Whey Protein Isolate Shake').length).toBe(2)

    const deleteBtn = screen.getByLabelText(/Delete Whey Protein Isolate Shake/i)
    await user.click(deleteBtn)

    await waitForElementToBeRemoved(() => screen.queryByLabelText(/Delete Whey Protein Isolate Shake/i))

    expect(screen.getAllByText('Whey Protein Isolate Shake').length).toBe(1)
    expect(screen.getByText(/No Meals Logged Yet/i)).toBeInTheDocument()
  })
})
