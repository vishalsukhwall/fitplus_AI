/**
 * useFoodScanner.test.js
 * ───────────────────────
 * Unit and integration tests for the ML food scanner hook.
 * Tests state transitions, 1.5s simulation latency, and localStorage persistence.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFoodScanner, STORAGE_KEY } from '../useFoodScanner'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, val) => {
      store[key] = String(val)
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true })

describe('useFoodScanner Hook', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with default scanner and mealLog state', () => {
    const { result } = renderHook(() => useFoodScanner())

    expect(result.current.isActive).toBe(false)
    expect(result.current.isProcessing).toBe(false)
    expect(result.current.isAnalyzing).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.scanResult.name).toBeNull()
    expect(result.current.meals).toEqual([])
    expect(result.current.dailyTotal).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0 })
  })

  it('transitions isActive when startScanner and stopScanner are invoked', () => {
    const { result } = renderHook(() => useFoodScanner())

    act(() => {
      result.current.startScanner()
    })
    expect(result.current.isActive).toBe(true)

    act(() => {
      result.current.stopScanner()
    })
    expect(result.current.isActive).toBe(false)
  })

  it('performs ML simulation with 1.5s latency and sets high-confidence result', async () => {
    const { result } = renderHook(() => useFoodScanner())

    let promise
    act(() => {
      promise = result.current.captureAndAnalyze('mock-base64-frame')
    })

    // While waiting for ML inference
    expect(result.current.isAnalyzing).toBe(true)
    expect(result.current.isProcessing).toBe(true)

    // Advance timers by 1500ms (the ML latency requirement)
    await act(async () => {
      vi.advanceTimersByTime(1500)
      await promise
    })

    expect(result.current.isAnalyzing).toBe(false)
    expect(result.current.isProcessing).toBe(false)
    expect(result.current.scanResult.name).toBeTruthy()
    expect(result.current.scanResult.confidence).toBeGreaterThanOrEqual(0.95)
    expect(result.current.scanResult.totalCalories).toBeGreaterThan(0)
    expect(result.current.scanResult.macros.protein).toBeGreaterThan(0)
  })

  it('logs scanned meal and updates dailyTotal immediately', async () => {
    const { result } = renderHook(() => useFoodScanner())

    // Complete a scan first
    let promise
    act(() => {
      promise = result.current.captureAndAnalyze('mock-frame', 0) // Grilled Chicken Salad
    })
    await act(async () => {
      vi.advanceTimersByTime(1500)
      await promise
    })

    expect(result.current.scanResult.name).toBe('Grilled Chicken Salad')

    // Log the scanned meal
    act(() => {
      result.current.logScannedMeal()
    })

    expect(result.current.meals).toHaveLength(1)
    expect(result.current.meals[0].name).toBe('Grilled Chicken Salad')
    expect(result.current.dailyTotal.calories).toBe(380)
    expect(result.current.dailyTotal.protein).toBe(44)
    expect(result.current.dailyTotal.carbs).toBe(12)
    expect(result.current.dailyTotal.fat).toBe(14)
  })

  it('allows resetting scan state to scan another meal', async () => {
    const { result } = renderHook(() => useFoodScanner())

    let promise
    act(() => {
      promise = result.current.captureAndAnalyze('frame-1')
    })
    await act(async () => {
      vi.advanceTimersByTime(1500)
      await promise
    })

    expect(result.current.scanResult.name).toBeTruthy()

    act(() => {
      result.current.resetScan()
    })

    expect(result.current.scanResult.name).toBeNull()
    expect(result.current.scanResult.totalCalories).toBe(0)
    expect(result.current.isAnalyzing).toBe(false)
  })

  it('persists meal log to localStorage automatically', async () => {
    const { result } = renderHook(() => useFoodScanner())

    let promise
    act(() => {
      promise = result.current.captureAndAnalyze('frame-1', 0)
    })
    await act(async () => {
      vi.advanceTimersByTime(1500)
      await promise
    })

    act(() => {
      result.current.logScannedMeal()
    })

    // Advance timer for 200ms debounce
    act(() => {
      vi.advanceTimersByTime(250)
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.stringContaining('Grilled Chicken Salad')
    )
  })
})
