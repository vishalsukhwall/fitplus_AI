/**
 * WorkoutGenerator.test.jsx
 * ─────────────────────────
 * Component tests for Custom Muscle AI Workout Generator (WorkoutGenerator.jsx).
 * Tests dynamic muscle input selection, custom text focus, routine generation,
 * form tips display, and completion toggles.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import React from 'react'
import WorkoutGenerator from '../WorkoutGenerator'

describe('WorkoutGenerator Component', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the muscle group presets, custom input, and zero state placeholder', () => {
    render(<WorkoutGenerator />)

    expect(screen.getByText(/Custom Muscle AI Workout Generator/i)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Chest & Triceps/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: /Back & Biceps/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: /Legs & Glutes/i }).length).toBeGreaterThan(0)
    expect(screen.getByPlaceholderText(/Chest & Triceps/i)).toBeInTheDocument()
    expect(screen.getByText(/No Active Routine Generated/i)).toBeInTheDocument()
  })

  it('generates a multi-exercise routine when a muscle preset is clicked', async () => {
    render(<WorkoutGenerator />)

    // Click Chest & Triceps preset button
    const chestBtns = screen.getAllByRole('button', { name: /Chest & Triceps/i })
    act(() => {
      fireEvent.click(chestBtns[0])
    })

    const generateBtn = screen.getByRole('button', { name: /Generate AI Workout Routine/i })
    act(() => {
      fireEvent.click(generateBtn)
    })

    // Advance simulated AI inference timer
    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.getByText(/Prescribed Neural Protocol/i)).toBeInTheDocument()
    expect(screen.getByText(/Barbell Bench Press/i)).toBeInTheDocument()
    expect(screen.getByText(/Incline Dumbbell Press/i)).toBeInTheDocument()
    expect(screen.getByText(/Triceps Rope Pushdown/i)).toBeInTheDocument()
    expect(screen.getByText(/0 \/ 5 Exercises Completed/i)).toBeInTheDocument()
  })

  it('allows checking off exercises and updates the completion percentage', async () => {
    render(<WorkoutGenerator />)

    const chestBtns = screen.getAllByRole('button', { name: /Chest & Triceps/i })
    act(() => {
      fireEvent.click(chestBtns[0])
    })

    const generateBtn = screen.getByRole('button', { name: /Generate AI Workout Routine/i })
    act(() => {
      fireEvent.click(generateBtn)
    })

    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    // Toggle completion on the first exercise
    const completeBtn = screen.getByLabelText(/Mark Barbell Bench Press complete/i)
    act(() => {
      fireEvent.click(completeBtn)
    })

    expect(screen.getByText(/1 \/ 5 Exercises Completed/i)).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('supports custom text input for arbitrary muscle groups', async () => {
    render(<WorkoutGenerator />)

    const input = screen.getByPlaceholderText(/Chest & Triceps/i)
    act(() => {
      fireEvent.change(input, { target: { value: 'Legs & Glutes' } })
    })

    const generateBtn = screen.getByRole('button', { name: /Generate AI Workout Routine/i })
    act(() => {
      fireEvent.click(generateBtn)
    })

    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.getByText(/Barbell Back Squat/i)).toBeInTheDocument()
    expect(screen.getByText(/Romanian Deadlift/i)).toBeInTheDocument()
  })
})
