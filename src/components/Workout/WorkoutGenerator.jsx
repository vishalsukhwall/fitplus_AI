/**
 * WorkoutGenerator.jsx — AI Workout Generator (Elite Edition)
 * src/components/Workout/WorkoutGenerator.jsx
 * ──────────────────────────────────────────────────────────────
 * Replaces the old flat-state version with:
 *   - useReducer state machine (workoutReducer)
 *   - generateWorkoutFromAI() from workoutAI.js
 *   - ExerciseCard sub-components with completion tracking
 *   - 6 muscle group presets + custom text input
 *   - Animated loading states with step-by-step progress
 *
 * State shape:
 * {
 *   selectedMuscleGroup: string,
 *   customInput:         string,
 *   exercises:           Exercise[],
 *   completedIds:        Set<string>,
 *   isGenerating:        boolean,
 *   hasGenerated:        boolean,
 *   error:               string | null,
 *   loadingStep:         number,
 * }
 */

import React, { useReducer, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Zap, RotateCcw, ChevronRight,
  AlertTriangle, CheckCircle2, Dumbbell,
} from 'lucide-react'

import ExerciseCard from './ExerciseCard'
import { generateWorkoutFromAI, MUSCLE_GROUPS } from '../../utils/workoutAI'

/* ─── Loading step messages ───────────────────────────────── */
const LOADING_STEPS = [
  'Calibrating neuromuscular load parameters...',
  'Selecting optimal exercise database entries...',
  'Applying progressive overload sequencing...',
  'Structuring rest intervals and RPE targets...',
  'Finalizing your personalized routine...',
]

import { workoutReducer, initialState } from '../../store/workoutReducer'


/* ─── Muscle Group Selector Button ───────────────────────── */
function MuscleGroupBtn({ group, isSelected, onClick }) {
  const [hovered, setHovered] = React.useState(false)
  const active = isSelected || hovered

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={isSelected}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        padding: '12px 8px',
        background: isSelected ? 'rgba(0,217,255,0.08)' : hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        border: '1px solid',
        borderColor: isSelected ? 'rgba(0,217,255,0.35)' : hovered ? 'var(--border)' : 'var(--border)',
        borderRadius: 0,
        cursor: 'pointer',
        transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
        boxShadow: isSelected ? '0 0 15px rgba(0,217,255,0.08)' : 'none',
      }}
    >
      <span style={{ fontSize: '20px', lineHeight: 1 }}>{group.icon}</span>
      <span
        style={{
          fontSize: '10px', fontWeight: 600,
          color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          textAlign: 'center', lineHeight: 1.3,
          transition: 'color 200ms',
        }}
      >
        {group.label}
      </span>
    </button>
  )
}

/* ─── Stats Footer ─────────────────────────────────────────── */
function CompletionFooter({ completed, total, onReset }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone = completed === total && total > 0

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        background: allDone ? 'rgba(0,208,132,0.06)' : 'transparent',
        border: '1px solid',
        borderColor: allDone ? 'rgba(0,208,132,0.3)' : 'var(--border)',
        marginTop: '8px',
        transition: 'all 300ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Progress bar + label */}
      <div style={{ flex: 1, marginRight: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {allDone ? '🎉 Workout Complete!' : `${completed} / ${total} exercises done`}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: allDone ? 'var(--success)' : 'var(--accent-cyan)' }}>
            {pct}%
          </span>
        </div>
        <div style={{ height: '4px', background: 'var(--border)', width: '100%' }}>
          <motion.div
            style={{
              height: '100%',
              background: allDone ? 'var(--success)' : 'var(--accent-cyan)',
              borderRadius: 0,
            }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '0 16px', height: '36px',
          background: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-xs)', fontWeight: 600,
          borderRadius: 0, cursor: 'pointer',
          transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--accent-cyan)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        <RotateCcw size={13} />
        New Workout
      </button>
    </div>
  )
}

/* ─── Loading Overlay ─────────────────────────────────────── */
function LoadingOverlay({ step }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 30,
        background: 'rgba(9,9,11,0.94)',
        backdropFilter: 'blur(12px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px', textAlign: 'center',
        borderRadius: 0,
      }}
    >
      {/* Pulsing icon */}
      <div
        style={{
          width: '56px', height: '56px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,217,255,0.08)',
          border: '1px solid rgba(0,217,255,0.3)',
          borderRadius: 0,
          animation: 'glow-pulse 2s ease-in-out infinite',
        }}
      >
        <Zap size={26} color="var(--accent-cyan)" />
      </div>

      <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
        Building Your Routine
      </h4>

      {/* Step message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-cyan)', margin: '0 0 24px', minHeight: '20px' }}
        >
          {LOADING_STEPS[step] ?? LOADING_STEPS[0]}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div style={{ width: '240px', height: '3px', background: 'var(--border)', borderRadius: 0 }}>
        <motion.div
          style={{ height: '100%', background: 'var(--accent-cyan)', borderRadius: 0 }}
          animate={{ width: `${((step + 1) / LOADING_STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {LOADING_STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: i <= step ? 'var(--accent-cyan)' : 'var(--border)',
              transition: 'background 300ms',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Main WorkoutGenerator ───────────────────────────────── */
export default function WorkoutGenerator({ setActiveView, onOpenCoach }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState)
  const intervalRef = useRef(null)

  const {
    selectedMuscleGroup, customInput,
    exercises, completedIds,
    isGenerating, hasGenerated,
    error, loadingStep,
  } = state

  // ── Generate handler ──────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    const target = customInput.trim() || selectedMuscleGroup
    if (!target) return

    dispatch({ type: 'GENERATE_START' })

    // Animate loading steps
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
      dispatch({ type: 'GENERATE_ERROR', payload: err.message ?? 'Generation failed. Please try again.' })
    }
  }, [selectedMuscleGroup, customInput])

  const handleToggle   = useCallback((id) => dispatch({ type: 'TOGGLE_EXERCISE', payload: id }), [])
  const handleReset    = useCallback(() => dispatch({ type: 'RESET' }), [])

  const canGenerate = (selectedMuscleGroup || customInput.trim().length >= 3) && !isGenerating

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge-cyan">AI Engine</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              useReducer · generateWorkoutFromAI
            </span>
          </div>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, letterSpacing: '-0.5px', margin: 0, color: 'var(--text-primary)' }}>
            AI Workout Generator
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '6px 0 0', maxWidth: '60ch' }}>
            Select a muscle group or type a custom focus, then generate a science-backed training protocol with biomechanical cues.
          </p>
        </div>

        {setActiveView && (
          <button
            onClick={() => setActiveView('logger')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0 16px', height: '40px', flexShrink: 0,
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', fontWeight: 600,
              borderRadius: 0, cursor: 'pointer',
              transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-cyan)'; e.currentTarget.style.borderColor = 'rgba(0,217,255,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            Log Session
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* ── 2-column layout: Config + Output ── */}
      <div className="grid-dashboard">

        {/* ── LEFT: Configuration Panel ── */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 0,
            padding: '32px',
            display: 'flex', flexDirection: 'column', gap: '28px',
          }}
        >
          {/* Panel title */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)',
              }}>
                <Dumbbell size={18} color="var(--accent-cyan)" />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                  Routine Configuration
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, maxWidth: 'none' }}>
                  Select focus or type a custom split
                </p>
              </div>
            </div>
          </div>

          {/* Muscle group presets */}
          <div>
            <label style={{
              display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600,
              color: 'var(--text-secondary)', textTransform: 'uppercase',
              letterSpacing: '0.08em', marginBottom: '12px',
            }}>
              Muscle Group
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {MUSCLE_GROUPS.map(group => (
                <MuscleGroupBtn
                  key={group.id}
                  group={group}
                  isSelected={selectedMuscleGroup === group.id}
                  onClick={() => dispatch({ type: 'SET_MUSCLE_GROUP', payload: group.id })}
                />
              ))}
            </div>
          </div>

          {/* Divider with "or" */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Custom input */}
          <div>
            <label
              htmlFor="custom-workout"
              style={{
                display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600,
                color: 'var(--text-secondary)', textTransform: 'uppercase',
                letterSpacing: '0.08em', marginBottom: '8px',
              }}
            >
              Custom Focus
            </label>
            <input
              id="custom-workout"
              type="text"
              value={customInput}
              onChange={e => dispatch({ type: 'SET_CUSTOM_INPUT', payload: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && canGenerate && handleGenerate()}
              placeholder='e.g. "Push Day Strength" or "Glute Hypertrophy"'
              className="elite-input"
              style={{ fontSize: 'var(--text-sm)' }}
            />
          </div>

          {/* Active selection indicator */}
          {(selectedMuscleGroup || customInput.trim()) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                padding: '12px 16px',
                background: 'rgba(0,217,255,0.04)',
                border: '1px solid rgba(0,217,255,0.2)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                Target:{' '}
                <strong>
                  {customInput.trim() || MUSCLE_GROUPS.find(g => g.id === selectedMuscleGroup)?.label}
                </strong>
              </span>
            </motion.div>
          )}

          {/* Error state */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,0,110,0.06)',
              border: '1px solid rgba(255,0,110,0.25)',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
            }}>
              <AlertTriangle size={15} color="var(--danger)" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--danger)', margin: 0, maxWidth: 'none' }}>{error}</p>
            </div>
          )}

          {/* Generate CTA */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            style={{
              width: '100%', height: '52px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: canGenerate ? 'var(--accent-cyan)' : 'rgba(0,217,255,0.2)',
              color: canGenerate ? 'var(--bg-dark)' : 'rgba(0,217,255,0.5)',
              border: 'none', borderRadius: 0,
              fontSize: 'var(--text-sm)', fontWeight: 700,
              cursor: canGenerate ? 'pointer' : 'not-allowed',
              transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => canGenerate && (e.currentTarget.style.boxShadow = '0 0 30px rgba(0,217,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            {isGenerating ? (
              <>
                <Zap size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Workout
              </>
            )}
          </button>

          {/* Hint text */}
          {!selectedMuscleGroup && !customInput && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textAlign: 'center', margin: '-12px 0 0', maxWidth: 'none' }}>
              Select a muscle group above to enable generation
            </p>
          )}
        </div>

        {/* ── RIGHT: Exercise Output Panel ── */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 0,
            padding: '32px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column', gap: '20px',
          }}
        >
          {/* Loading overlay */}
          <AnimatePresence>
            {isGenerating && <LoadingOverlay step={loadingStep} />}
          </AnimatePresence>

          {/* Empty state */}
          {!hasGenerated && !isGenerating && !error && (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '60px 24px', textAlign: 'center', gap: '16px',
            }}>
              <div style={{
                width: '64px', height: '64px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,217,255,0.05)',
                border: '1px solid rgba(0,217,255,0.15)',
              }}>
                <Dumbbell size={28} color="var(--text-secondary)" />
              </div>
              <div>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                  Ready to Generate
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, maxWidth: '30ch' }}>
                  Configure your muscle group and click <strong style={{ color: 'var(--accent-cyan)' }}>Generate Workout</strong> to see your personalized routine.
                </p>
              </div>
            </div>
          )}

          {/* Exercise list */}
          {hasGenerated && exercises.length > 0 && (
            <>
              {/* Output header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <CheckCircle2 size={14} color="var(--success)" />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Routine Ready
                    </span>
                  </div>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: '-0.3px', margin: 0, color: 'var(--text-primary)' }}>
                    {customInput.trim()
                      ? customInput.trim()
                      : MUSCLE_GROUPS.find(g => g.id === selectedMuscleGroup)?.label ?? 'Custom Workout'
                    }
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '4px 0 0', maxWidth: 'none' }}>
                    {exercises.length} exercises · Mark each complete as you go
                  </p>
                </div>

                <span className="badge-cyan">
                  {completedIds.length}/{exercises.length} done
                </span>
              </div>

              {/* Exercise cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence>
                  {exercises.map((ex, idx) => (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      exerciseNumber={idx + 1}
                      isCompleted={completedIds.includes(ex.id)}
                      onToggleComplete={() => handleToggle(ex.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Completion bar + reset */}
              <CompletionFooter
                completed={completedIds.length}
                total={exercises.length}
                onReset={handleReset}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
