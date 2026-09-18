/**
 * workoutReducer.test.js
 * ──────────────────────
 * Pure-function unit tests for every workoutReducer action type.
 * Key regression guard: GENERATE_ERROR must clear isGenerating to false.
 * Run with: npm test
 */
import { describe, it, expect } from 'vitest'
import { workoutReducer, initialState } from '../workoutReducer'

// ─── Helpers ──────────────────────────────────────────────────
const mockExercises = [
  { id: 'ex-001', name: 'Bench Press',   sets: 4, reps: '6-8' },
  { id: 'ex-002', name: 'Incline Press', sets: 3, reps: '10-12' },
]

// ─── SET_MUSCLE_GROUP ─────────────────────────────────────────
describe('SET_MUSCLE_GROUP', () => {
  it('sets the selectedMuscleGroup', () => {
    const next = workoutReducer(initialState, { type: 'SET_MUSCLE_GROUP', payload: 'chest-triceps' })
    expect(next.selectedMuscleGroup).toBe('chest-triceps')
  })

  it('clears customInput when a group is selected', () => {
    const withCustom = { ...initialState, customInput: 'upper body' }
    const next       = workoutReducer(withCustom, { type: 'SET_MUSCLE_GROUP', payload: 'legs' })
    expect(next.customInput).toBe('')
  })

  it('clears any existing error', () => {
    const withError = { ...initialState, error: 'previous error' }
    const next      = workoutReducer(withError, { type: 'SET_MUSCLE_GROUP', payload: 'core' })
    expect(next.error).toBeNull()
  })
})

// ─── GENERATE_START ───────────────────────────────────────────
describe('GENERATE_START', () => {
  it('sets isGenerating to true', () => {
    const next = workoutReducer(initialState, { type: 'GENERATE_START' })
    expect(next.isGenerating).toBe(true)
  })

  it('resets exercises and completedIds', () => {
    const withData = { ...initialState, exercises: mockExercises, completedIds: ['ex-001'] }
    const next     = workoutReducer(withData, { type: 'GENERATE_START' })
    expect(next.exercises).toHaveLength(0)
    expect(next.completedIds).toHaveLength(0)
  })

  it('clears any prior error', () => {
    const withError = { ...initialState, error: 'old error' }
    const next      = workoutReducer(withError, { type: 'GENERATE_START' })
    expect(next.error).toBeNull()
  })

  it('resets loadingStep to 0', () => {
    const withStep = { ...initialState, loadingStep: 3 }
    const next     = workoutReducer(withStep, { type: 'GENERATE_START' })
    expect(next.loadingStep).toBe(0)
  })
})

// ─── GENERATE_SUCCESS ─────────────────────────────────────────
describe('GENERATE_SUCCESS', () => {
  it('sets exercises from the payload', () => {
    const generating = { ...initialState, isGenerating: true }
    const next       = workoutReducer(generating, { type: 'GENERATE_SUCCESS', payload: mockExercises })
    expect(next.exercises).toHaveLength(2)
    expect(next.exercises[0].name).toBe('Bench Press')
  })

  it('clears isGenerating to false', () => {
    const generating = { ...initialState, isGenerating: true }
    const next       = workoutReducer(generating, { type: 'GENERATE_SUCCESS', payload: mockExercises })
    expect(next.isGenerating).toBe(false)
  })

  it('sets hasGenerated to true', () => {
    const next = workoutReducer(initialState, { type: 'GENERATE_SUCCESS', payload: mockExercises })
    expect(next.hasGenerated).toBe(true)
  })

  it('clears any prior error', () => {
    const withError = { ...initialState, isGenerating: true, error: 'timeout' }
    const next      = workoutReducer(withError, { type: 'GENERATE_SUCCESS', payload: mockExercises })
    expect(next.error).toBeNull()
  })
})

// ─── GENERATE_ERROR — PRIMARY REGRESSION GUARD ───────────────
describe('GENERATE_ERROR', () => {
  it('*** clears isGenerating to false (most common state-leak bug) ***', () => {
    const generating = { ...initialState, isGenerating: true }
    const next       = workoutReducer(generating, { type: 'GENERATE_ERROR', payload: 'Network timeout' })
    // This is the critical assertion — a hung isGenerating locks the UI forever
    expect(next.isGenerating).toBe(false)
  })

  it('sets the error message from the payload', () => {
    const next = workoutReducer(initialState, { type: 'GENERATE_ERROR', payload: 'Network timeout' })
    expect(next.error).toBe('Network timeout')
  })

  it('does not clear exercises that were previously generated', () => {
    // Simulate: first generate succeeds, then a re-generate errors
    const withExercises = { ...initialState, exercises: mockExercises, isGenerating: true }
    const next          = workoutReducer(withExercises, { type: 'GENERATE_ERROR', payload: 'err' })
    expect(next.exercises).toHaveLength(2)
  })
})

// ─── TOGGLE_EXERCISE ──────────────────────────────────────────
describe('TOGGLE_EXERCISE', () => {
  it('adds an exercise id to completedIds when not present', () => {
    const withExercises = { ...initialState, exercises: mockExercises }
    const next          = workoutReducer(withExercises, { type: 'TOGGLE_EXERCISE', payload: 'ex-001' })
    expect(next.completedIds).toContain('ex-001')
  })

  it('removes an exercise id when already present (toggle idempotence)', () => {
    const alreadyCompleted = { ...initialState, completedIds: ['ex-001'] }
    const next             = workoutReducer(alreadyCompleted, { type: 'TOGGLE_EXERCISE', payload: 'ex-001' })
    expect(next.completedIds).not.toContain('ex-001')
  })

  it('preserves other completed ids when toggling one', () => {
    const twoCompleted = { ...initialState, completedIds: ['ex-001', 'ex-002'] }
    const next         = workoutReducer(twoCompleted, { type: 'TOGGLE_EXERCISE', payload: 'ex-001' })
    expect(next.completedIds).toContain('ex-002')
    expect(next.completedIds).toHaveLength(1)
  })
})

// ─── RESET ────────────────────────────────────────────────────
describe('RESET', () => {
  it('returns a state equal to initialState', () => {
    const dirty = {
      ...initialState,
      selectedMuscleGroup: 'legs',
      exercises:           mockExercises,
      completedIds:        ['ex-001'],
      isGenerating:        false,
      hasGenerated:        true,
      error:               'some error',
    }
    const next = workoutReducer(dirty, { type: 'RESET' })
    expect(next).toEqual(initialState)
  })
})

// ─── Unknown action — identity check ──────────────────────────
describe('Unknown action type', () => {
  it('returns the identical state reference (toBe, not toEqual)', () => {
    const result = workoutReducer(initialState, { type: '__UNKNOWN__' })
    expect(result).toBe(initialState)
  })
})

// ─── Immutability ─────────────────────────────────────────────
describe('Immutability', () => {
  it('does not mutate prevState on TOGGLE_EXERCISE', () => {
    const frozen = Object.freeze({
      ...initialState,
      exercises:    Object.freeze([...mockExercises]),
      completedIds: Object.freeze([]),
    })
    expect(() => {
      workoutReducer(frozen, { type: 'TOGGLE_EXERCISE', payload: 'ex-001' })
    }).not.toThrow()
  })

  it('does not mutate prevState on GENERATE_SUCCESS', () => {
    const frozen = Object.freeze({ ...initialState, isGenerating: true })
    expect(() => {
      workoutReducer(frozen, { type: 'GENERATE_SUCCESS', payload: mockExercises })
    }).not.toThrow()
  })
})
