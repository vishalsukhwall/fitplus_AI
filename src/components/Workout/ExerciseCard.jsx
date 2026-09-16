/**
 * ExerciseCard.jsx — Single Exercise Display Card
 * Design: Titanium Minimalist Deep Space
 * ──────────────────────────────────────────────────
 * Props:
 *   exercise        {object}   - Exercise data object
 *   exerciseNumber  {number}   - Display index (1, 2, 3...)
 *   isCompleted     {boolean}  - Completion state
 *   onToggleComplete{function} - Called when checkbox is toggled
 *
 * Exercise object shape:
 * {
 *   id, name, sets, reps, weight, difficulty,
 *   restSeconds, formTips[], videoUrl?
 * }
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, Circle, ChevronDown, ChevronUp,
  ExternalLink, Clock, Dumbbell, Zap,
} from 'lucide-react'
import { getDifficultyColor, formatRestTime } from '../../utils/workoutAI'

// ─── Difficulty Badge ─────────────────────────────────────────
function DifficultyBadge({ level }) {
  const color = getDifficultyColor(level)
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '2px 10px',
        background: `${color}18`,
        border: `1px solid ${color}44`,
        color,
        fontSize: '10px', fontWeight: 700,
        textTransform: 'capitalize',
        letterSpacing: '0.06em',
        borderRadius: 0,
      }}
    >
      {level}
    </span>
  )
}

// ─── Metric Pill ──────────────────────────────────────────────
function MetricPill({ label, value, accent = false }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '8px 14px', gap: '2px',
        background: accent ? 'rgba(0,217,255,0.06)' : 'transparent',
        border: '1px solid',
        borderColor: accent ? 'rgba(0,217,255,0.2)' : 'var(--border)',
        borderRadius: 0, minWidth: '70px',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-xs)', fontWeight: 700,
          color: accent ? 'var(--accent-cyan)' : 'var(--text-primary)',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '10px', fontWeight: 500,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ─── ExerciseCard ─────────────────────────────────────────────
export default function ExerciseCard({
  exercise,
  exerciseNumber,
  isCompleted = false,
  onToggleComplete,
}) {
  const [tipsOpen, setTipsOpen] = useState(false)

  if (!exercise) return null

  const {
    name, sets, reps, weight, difficulty,
    restSeconds, formTips = [], videoUrl,
  } = exercise

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        background:   isCompleted ? 'rgba(0,208,132,0.04)' : 'var(--bg-secondary)',
        border:       '1px solid',
        borderColor:  isCompleted ? 'rgba(0,208,132,0.25)' : 'var(--border)',
        borderRadius: 0,
        padding:      '20px 24px',
        transition:   'border-color 200ms cubic-bezier(0.4,0,0.2,1), background 200ms cubic-bezier(0.4,0,0.2,1)',
        opacity:      isCompleted ? 0.75 : 1,
      }}
    >
      {/* ── Top Row: Number + Name + Complete Toggle ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>

        {/* Exercise number */}
        <div
          style={{
            width: '32px', height: '32px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,217,255,0.08)',
            border: '1px solid rgba(0,217,255,0.2)',
            borderRadius: 0,
            fontSize: 'var(--text-xs)', fontWeight: 700,
            color: 'var(--accent-cyan)',
          }}
        >
          {String(exerciseNumber).padStart(2, '0')}
        </div>

        {/* Name + badges */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: 'var(--text-base)', fontWeight: 600,
              color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
              margin: 0, lineHeight: 1.3,
              textDecoration: isCompleted ? 'line-through' : 'none',
            }}
          >
            {name}
          </h4>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {difficulty && <DifficultyBadge level={difficulty} />}
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 200ms',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <ExternalLink size={11} />
                Watch
              </a>
            )}
          </div>
        </div>

        {/* Complete toggle */}
        <button
          onClick={onToggleComplete}
          aria-label={isCompleted ? `Mark ${name} incomplete` : `Mark ${name} complete`}
          aria-pressed={isCompleted}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: isCompleted ? 'var(--success)' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '4px', flexShrink: 0,
            transition: 'color 200ms cubic-bezier(0.4,0,0.2,1)',
          }}
          onMouseEnter={e => !isCompleted && (e.currentTarget.style.color = 'var(--success)')}
          onMouseLeave={e => !isCompleted && (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          {isCompleted
            ? <CheckCircle2 size={22} />
            : <Circle size={22} />
          }
        </button>
      </div>

      {/* ── Metrics Row ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: formTips.length ? '12px' : 0 }}>
        {sets  && <MetricPill label="Sets"   value={String(sets)}    accent />}
        {reps  && <MetricPill label="Reps"   value={String(reps)}    />}
        {weight && <MetricPill label="Load"  value={String(weight)}  />}
        {restSeconds && (
          <MetricPill
            label="Rest"
            value={formatRestTime(restSeconds)}
          />
        )}
      </div>

      {/* ── Form Tips Accordion ── */}
      {formTips.length > 0 && (
        <div>
          <button
            onClick={() => setTipsOpen(o => !o)}
            aria-expanded={tipsOpen}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 'var(--text-xs)', fontWeight: 600,
              color: tipsOpen ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              transition: 'color 200ms',
              marginTop: '12px',
            }}
          >
            <Zap size={12} color={tipsOpen ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
            Form Tips
            {tipsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          <AnimatePresence>
            {tipsOpen && (
              <motion.ul
                key="tips"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{
                  overflow: 'hidden', margin: '10px 0 0 0', padding: 0,
                  listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px',
                }}
              >
                {formTips.map((tip, i) => (
                  <li
                    key={i}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(0,217,255,0.04)',
                      borderLeft: '2px solid var(--accent-cyan)',
                      fontSize: 'var(--text-xs)', lineHeight: 1.55,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {tip}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
