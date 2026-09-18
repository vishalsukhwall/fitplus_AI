/**
 * workoutReducer.js — Workout Generator State Machine
 * ─────────────────────────────────────────────────────
 * Extracted from WorkoutGenerator.jsx for independent testability.
 *
 * State shape:
 * {
 *   selectedMuscleGroup: string,
 *   customInput:         string,
 *   exercises:           Exercise[],
 *   completedIds:        string[],   // array (Set not JSON-serializable)
 *   isGenerating:        boolean,
 *   hasGenerated:        boolean,
 *   error:               string | null,
 *   loadingStep:         number,
 * }
 */

export const initialState = {
  selectedMuscleGroup: '',
  customInput:         '',
  exercises:           [],
  completedIds:        [],
  isGenerating:        false,
  hasGenerated:        false,
  error:               null,
  loadingStep:         0,
}

export function workoutReducer(state, action) {
  switch (action.type) {

    case 'SET_MUSCLE_GROUP':
      return {
        ...state,
        selectedMuscleGroup: action.payload,
        customInput:         '',
        error:               null,
      }

    case 'SET_CUSTOM_INPUT':
      return {
        ...state,
        customInput:         action.payload,
        selectedMuscleGroup: '',
        error:               null,
      }

    case 'GENERATE_START':
      return {
        ...state,
        isGenerating: true,
        hasGenerated: false,
        error:        null,
        exercises:    [],
        completedIds: [],
        loadingStep:  0,
      }

    case 'LOADING_STEP':
      return { ...state, loadingStep: action.payload }

    case 'GENERATE_SUCCESS':
      return {
        ...state,
        isGenerating: false,
        hasGenerated: true,
        exercises:    action.payload,
        completedIds: [],
        error:        null,
      }

    case 'GENERATE_ERROR':
      return {
        ...state,
        isGenerating: false,
        error:        action.payload,
      }

    case 'TOGGLE_EXERCISE': {
      const id = action.payload
      const already = state.completedIds.includes(id)
      return {
        ...state,
        completedIds: already
          ? state.completedIds.filter(x => x !== id)
          : [...state.completedIds, id],
      }
    }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}
