/**
 * WorkoutGenerator.jsx — Custom Muscle AI Workout Generator
 * Design: Titanium Minimalist / Deep Space Cyber
 * ──────────────────────────────────────────────────────────────
 * Deliverable:
 *   - Dynamic Muscle Input: Interactive selection of muscle presets (Chest & Triceps,
 *     Back & Biceps, Legs & Glutes, Shoulders, Full Body, Core & Abs) + custom text input
 *   - AI Routine Output: Structured multi-exercise routine cards showing exercise name,
 *     target sets, reps, recommended load, rest interval, form cues, and interactive
 *     completion tracking
 *   - Client-Ready Empty States: Elegant dashed-border placeholder with icons & guidance
 *   - Persistence: Automatically persists generated routine and completion state across
 *     browser reloads via localStorage ('fitpulse_workout_state')
 */

import React, { useReducer, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Zap, RotateCcw, ChevronRight,
  AlertTriangle, CheckCircle2, Dumbbell, Copy, Check,
  Activity, ArrowRight, ShieldCheck
} from 'lucide-react'

import ExerciseCard from './Workout/ExerciseCard'
import { generateWorkoutFromAI, MUSCLE_GROUPS } from '../utils/workoutAI'
import { workoutReducer, initialState } from '../store/workoutReducer'

const WORKOUT_STORAGE_KEY = 'fitpulse_workout_state'

/* ─── Loading step messages for realistic neural inference telemetry ─── */
const LOADING_STEPS = [
  'Calibrating neuromuscular load parameters...',
  'Querying biomechanical exercise vector database...',
  'Applying progressive overload & RPE sequencing...',
  'Structuring rest intervals and hypertrophy tempos...',
  'Finalizing your personalized training routine...',
]

/**
 * Initializes state from localStorage safely.
 */
function initWorkoutFromStorage(defaultInit) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultInit
  }
  try {
    const saved = window.localStorage.getItem(WORKOUT_STORAGE_KEY)
    if (!saved) return defaultInit
    const parsed = JSON.parse(saved)
    return {
      ...defaultInit,
      ...parsed,
      isGenerating: false,
      loadingStep: 0,
      error: null,
    }
  } catch (err) {
    console.warn('WorkoutGenerator: failed to rehydrate from localStorage', err)
    return defaultInit
  }
}

/* ─── Muscle Group Preset Selector Button ─── */
function MuscleGroupBtn({ group, isSelected, onClick }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={isSelected}
      className={`
        p-3 rounded-none flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer text-center
        ${isSelected
          ? 'bg-[#00d9ff]/10 border-[#00d9ff] shadow-[0_0_15px_rgba(0,217,255,0.15)]'
          : hovered
          ? 'bg-slate-900 border-slate-700'
          : 'bg-slate-950/60 border-slate-800'
        }
      `}
    >
      <span className="text-xl leading-none" aria-hidden="true">{group.icon}</span>
      <span className={`text-[11px] font-mono font-bold leading-tight ${isSelected ? 'text-[#00d9ff]' : 'text-slate-400'}`}>
        {group.label}
      </span>
    </button>
  )
}

/* ─── Completion & Progress Footer ─── */
function CompletionFooter({ completed, total, onReset }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone = completed === total && total > 0

  return (
    <div
      className={`
        p-4 sm:p-5 border flex flex-col sm:flex-row items-center justify-between gap-4 rounded-none transition-all
        ${allDone ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-950/70 border-slate-800'}
      `}
    >
      {/* Progress bar + label */}
      <div className="w-full sm:flex-1 sm:mr-6 space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400 font-semibold">
            {allDone ? '🎉 Workout Complete! Peak Volume Reached' : `${completed} / ${total} Exercises Completed`}
          </span>
          <span className={`font-black ${allDone ? 'text-emerald-400' : 'text-[#00d9ff]'}`}>
            {pct}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-900 border border-slate-800 overflow-hidden">
          <motion.div
            className={`h-full ${allDone ? 'bg-emerald-400' : 'bg-[#00d9ff]'}`}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Reset CTA */}
      <button
        type="button"
        onClick={onReset}
        className="w-full sm:w-auto px-4 h-9 flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-[#00d9ff] text-slate-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded-none cursor-pointer transition-colors"
      >
        <RotateCcw size={13} />
        <span>New Routine</span>
      </button>
    </div>
  )
}

/* ─── Loading Overlay ─── */
function LoadingOverlay({ step }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 bg-[#09090b]/94 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-none"
    >
      <div className="w-14 h-14 border border-[#00d9ff]/40 bg-[#00d9ff]/10 flex items-center justify-center text-[#00d9ff] mb-4 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
        <Zap size={26} className="animate-pulse" />
      </div>

      <h4 className="text-lg font-black text-white font-mono uppercase tracking-wider mb-2">
        Building Neural Routine
      </h4>

      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="text-xs font-mono text-[#00d9ff] mb-6 min-h-[20px]"
        >
          {LOADING_STEPS[step] ?? LOADING_STEPS[0]}
        </motion.p>
      </AnimatePresence>

      <div className="w-64 h-2 bg-slate-900 border border-slate-800 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#00d9ff] to-[#38bdf8]"
          animate={{ width: `${((step + 1) / LOADING_STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="flex gap-2 mt-4">
        {LOADING_STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-[#00d9ff]' : 'bg-slate-800'}`}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Main WorkoutGenerator Component ─── */
export default function WorkoutGenerator({ setActiveView, onOpenCoach }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState, initWorkoutFromStorage)
  const intervalRef = useRef(null)
  const [copied, setCopied] = React.useState(false)

  const {
    selectedMuscleGroup, customInput,
    exercises, completedIds,
    isGenerating, hasGenerated,
    error, loadingStep,
  } = state

  // Persist state to localStorage on update
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      const { isGenerating, loadingStep, error, ...toPersist } = state
      window.localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(toPersist))
    } catch (err) {
      console.warn('WorkoutGenerator: localStorage write failed', err)
    }
  }, [state])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // ── Generate AI routine handler ──
  const handleGenerate = useCallback(async () => {
    const target = customInput.trim() || selectedMuscleGroup
    if (!target) return

    dispatch({ type: 'GENERATE_START' })

    let step = 0
    intervalRef.current = setInterval(() => {
      step += 1
      if (step < LOADING_STEPS.length) {
        dispatch({ type: 'LOADING_STEP', payload: step })
      } else {
        clearInterval(intervalRef.current)
      }
    }, 550)

    try {
      const result = await generateWorkoutFromAI(target)
      clearInterval(intervalRef.current)
      dispatch({ type: 'GENERATE_SUCCESS', payload: result })
    } catch (err) {
      clearInterval(intervalRef.current)
      dispatch({ type: 'GENERATE_ERROR', payload: err?.message ?? 'Generation failed. Please try again.' })
    }
  }, [selectedMuscleGroup, customInput])

  const handleToggle = useCallback((id) => dispatch({ type: 'TOGGLE_EXERCISE', payload: id }), [])

  const handleReset = useCallback(() => {
    try {
      window.localStorage.removeItem(WORKOUT_STORAGE_KEY)
    } catch {}
    dispatch({ type: 'RESET' })
  }, [])

  const canGenerate = (selectedMuscleGroup || customInput.trim().length >= 2) && !isGenerating

  // Clipboard export
  const handleCopyRoutine = () => {
    const title = customInput.trim() || MUSCLE_GROUPS.find(g => g.id === selectedMuscleGroup)?.label || 'Custom Routine'
    const text = `FITPULSE ELITE — AI ROUTINE: ${title}\n` +
      exercises.map((e, idx) => `${idx + 1}. ${e.name} — ${e.sets} sets × ${e.reps} (${e.weight || 'Load as prescribed'})\n   Rest: ${e.restSeconds}s | Cue: ${e.formTips?.[0] || 'Focus on controlled eccentric'}`).join('\n\n')

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#00d9ff]/15 text-[#00d9ff] border border-[#00d9ff]/30 uppercase">
              Neural Kinematics Model
            </span>
            <span className="font-mono text-xs text-slate-500">
              Biomechanical Overload Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Custom Muscle AI Workout Generator
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Select target muscle groups or enter custom specifications (e.g. <em>Chest & Triceps</em>, <em>Back & Biceps</em>, <em>Legs</em>) to generate a periodized multi-exercise routine complete with biomechanical cues and rest tempos.
          </p>
        </div>

        {setActiveView && (
          <button
            onClick={() => setActiveView('logger')}
            type="button"
            className="self-start sm:self-auto px-4 h-10 flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-[#00d9ff] text-slate-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded-none cursor-pointer transition-colors"
          >
            <span>Workout Logger</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* ── 2-Column Grid: Configuration & Output ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT CONFIGURATION PANEL (5 cols) ── */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#0f0f1a] border border-slate-800 rounded-none shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-9 h-9 border border-[#00d9ff]/30 bg-[#00d9ff]/10 flex items-center justify-center text-[#00d9ff]">
              <Dumbbell size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-tight">
                Target Muscle Selection
              </h3>
              <p className="text-xs text-slate-400">
                Specify primary muscular target focus
              </p>
            </div>
          </div>

          {/* Muscle Group Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              1. Preset Muscle Groups
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MUSCLE_GROUPS.map((group) => (
                <MuscleGroupBtn
                  key={group.id}
                  group={group}
                  isSelected={selectedMuscleGroup === group.id}
                  onClick={() => dispatch({ type: 'SET_MUSCLE_GROUP', payload: group.id })}
                />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 font-mono text-xs text-slate-600">
            <div className="flex-1 h-[1px] bg-slate-800" />
            <span>OR CUSTOM INPUT</span>
            <div className="flex-1 h-[1px] bg-slate-800" />
          </div>

          {/* Custom Text Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="custom-muscle-input"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300"
            >
              2. Custom Muscle Target / Focus
            </label>
            <input
              id="custom-muscle-input"
              type="text"
              value={customInput}
              onChange={(e) => dispatch({ type: 'SET_CUSTOM_INPUT', payload: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && canGenerate && handleGenerate()}
              placeholder='e.g. "Chest & Triceps", "Glutes & Hamstrings", "Upper Pull"'
              className="w-full py-2.5 px-3.5 bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-[#00d9ff] rounded-none transition-colors"
            />
            <p className="text-[10.5px] font-mono text-slate-500">
              Type any muscle combination — our inference parser extracts target vectors.
            </p>
          </div>

          {/* Active Target Banner */}
          {(selectedMuscleGroup || customInput.trim()) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-[#00d9ff]/10 border border-[#00d9ff]/30 flex items-center gap-2 rounded-none font-mono text-xs"
            >
              <div className="w-2 h-2 bg-[#00d9ff] rounded-none" />
              <span className="text-[#00d9ff] font-bold">
                Target Selected:{' '}
                <strong className="text-white">
                  {customInput.trim() || MUSCLE_GROUPS.find(g => g.id === selectedMuscleGroup)?.label}
                </strong>
              </span>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 font-mono text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`
              w-full h-12 flex items-center justify-center gap-2 font-mono font-extrabold text-xs uppercase tracking-wider rounded-none cursor-pointer transition-all
              ${canGenerate
                ? 'bg-[#00d9ff] hover:bg-[#3be3ff] text-[#09090b] shadow-[0_0_20px_rgba(0,217,255,0.3)]'
                : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Activity size={16} className="animate-spin" />
                <span>Synthesizing Architecture...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate AI Workout Routine</span>
              </>
            )}
          </motion.button>
        </div>

        {/* ── RIGHT OUTPUT ROUTINE PANEL (7 cols) ── */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-[#0f0f1a] border border-slate-800 rounded-none shadow-2xl relative overflow-hidden space-y-6">

          {/* Neural Loading Telemetry Overlay */}
          <AnimatePresence>
            {isGenerating && <LoadingOverlay step={loadingStep} />}
          </AnimatePresence>

          {/* 1. ZERO BLANK SCREENS / EMPTY STATE */}
          {!hasGenerated && !isGenerating && (
            <div className="p-10 sm:p-14 border-2 border-dashed border-slate-800 bg-slate-950/60 text-center space-y-5 rounded-none group">
              <div className="w-16 h-16 mx-auto border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-500 shadow-inner group-hover:border-[#00d9ff]/40 group-hover:text-[#00d9ff] transition-colors">
                <Dumbbell size={28} />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  No Active Routine Generated
                </h4>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  Choose a muscle group preset from the panel on the left (e.g. <em>Chest & Triceps</em>, <em>Back & Biceps</em>, or <em>Legs</em>) or type a custom focus, then click <strong>Generate AI Workout Routine</strong>.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                {['Chest & Triceps', 'Back & Biceps', 'Legs & Glutes'].map((quickLabel) => {
                  const matchingGroup = MUSCLE_GROUPS.find(g => g.label === quickLabel)
                  return (
                    <button
                      key={quickLabel}
                      type="button"
                      onClick={() => {
                        if (matchingGroup) {
                          dispatch({ type: 'SET_MUSCLE_GROUP', payload: matchingGroup.id })
                        }
                      }}
                      className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-[#00d9ff] text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                    >
                      + Quick Select: {quickLabel}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 2. GENERATED MULTI-EXERCISE ROUTINE DISPLAY */}
          {hasGenerated && exercises.length > 0 && (
            <div className="space-y-6">

              {/* Routine Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Prescribed Neural Protocol
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {customInput.trim()
                      ? customInput.trim()
                      : MUSCLE_GROUPS.find(g => g.id === selectedMuscleGroup)?.label ?? 'Custom Workout'
                    }
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    {exercises.length} prescribed movements · Mark sets complete as performed
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyRoutine}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 rounded-none cursor-pointer transition-colors"
                  >
                    {copied ? <Check size={13} className="text-[#00d9ff]" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  {setActiveView && (
                    <button
                      type="button"
                      onClick={() => setActiveView('logger')}
                      className="px-3 py-2 bg-[#00d9ff]/15 border border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/25 text-xs font-mono font-bold flex items-center gap-1 rounded-none cursor-pointer transition-colors"
                    >
                      <span>Log Session</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Multi-Exercise Cards Feed */}
              <div className="space-y-4">
                {exercises.map((exercise, idx) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    exerciseNumber={idx + 1}
                    isCompleted={completedIds.includes(exercise.id)}
                    onToggleComplete={() => handleToggle(exercise.id)}
                  />
                ))}
              </div>

              {/* Interactive Completion Progress Bar & Reset CTA */}
              <CompletionFooter
                completed={completedIds.length}
                total={exercises.length}
                onReset={handleReset}
              />

              {/* Autoregulation Badge Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#00d9ff]" />
                  <span>Autoregulated progressive overload tuned</span>
                </span>
                <span className="text-[#00d9ff] font-semibold">
                  RPE Target: 8.0 – 9.5
                </span>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}
