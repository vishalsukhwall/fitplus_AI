import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dumbbell, Camera, Eye, Mic, Sparkles,
  ArrowRight, ChevronDown, Cpu, Wifi, Clock, Check
} from 'lucide-react'

/* ── Interactive Demo Components ── */
function WorkoutDemo() {
  const items = [
    { name: 'Incline Bench Press', reps: '4 × 10', weight: '85 kg', pct: 85 },
    { name: 'Standing DB Lateral Raise', reps: '3 × 12', weight: '16 kg', pct: 65 },
    { name: 'Cable Chest Fly', reps: '3 × 15', weight: '20 kg', pct: 45 },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
      {items.map(({ name, reps, weight, pct }) => (
        <div key={name}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 5 }}>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{name}</span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>{reps} · {weight}</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(51,65,85,0.6)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                borderRadius: 999,
                background: 'linear-gradient(90deg, #10b981, #14b8a6)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function MacroDemo() {
  const items = [
    { label: 'Protein', val: 148, max: 180, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Carbohydrates', val: 215, max: 280, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
    { label: 'Healthy Fats', val: 56, max: 70, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ]
  return (
    <div style={{
      marginTop: 14, padding: 14, borderRadius: 14,
      background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(51,65,85,0.4)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {items.map(({ label, val, max, color }) => (
        <div key={label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 5 }}>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>{label}</span>
            <span style={{ color, fontWeight: 700 }}>{val}g / {max}g</span>
          </div>
          <div style={{ height: 7, borderRadius: 999, background: '#1e293b', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(val / max) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 999, background: color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function FormDemo() {
  const joints = [
    { name: 'Lumbar Spine Alignment', status: 'optimal', val: 98 },
    { name: 'Knee Patellar Tracking', status: 'optimal', val: 92 },
    { name: 'Hip Hinge Angle (84°)', status: 'adjust', val: 76 },
  ]
  return (
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
      {joints.map(({ name, status, val }) => (
        <div
          key={name}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 10,
            background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.4)',
            fontSize: 11.5,
          }}
        >
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: status === 'optimal' ? '#34d399' : '#fbbf24',
            boxShadow: `0 0 10px ${status === 'optimal' ? '#34d399' : '#fbbf24'}`,
          }} />
          <span style={{ color: '#cbd5e1', flex: 1, fontWeight: 500 }}>{name}</span>
          <span style={{
            fontWeight: 800,
            color: status === 'optimal' ? '#34d399' : '#fbbf24',
          }}>
            {val}%
          </span>
        </div>
      ))}
    </div>
  )
}

function VoiceDemo() {
  return (
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          maxWidth: '85%', padding: '9px 14px', borderRadius: '14px 14px 2px 14px',
          background: 'rgba(51,65,85,0.7)', fontSize: 12, color: '#f1f5f9',
        }}>
          <span style={{ display: 'block', fontSize: 9.5, fontWeight: 700, color: '#94a3b8', marginBottom: 2 }}>You</span>
          The last set of RDLs felt light, should I load more?
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{
          maxWidth: '85%', padding: '9px 14px', borderRadius: '14px 14px 14px 2px',
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
          fontSize: 12, color: '#f1f5f9',
        }}>
          <span style={{ display: 'block', fontSize: 9.5, fontWeight: 700, color: '#34d399', marginBottom: 2 }}>FitPulse Voice AI</span>
          Add 5 kg. Your bar velocity was 0.72 m/s on rep 8—you have plenty in reserve.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{
          padding: '8px 14px', borderRadius: 12,
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          display: 'flex', gap: 5, alignItems: 'center',
        }}>
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#34d399', display: 'block',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Features Specification ── */
const FEATURES = [
  {
    id: 'workout',
    Icon: Dumbbell,
    label: 'Autonomous Workout Engine',
    tagline: 'Hyper-personalized periodized programming',
    desc: 'Input available equipment, schedule, and joint restrictions. FitPulse constructs progressive overload training blocks that dynamically adapt weight and volume as you advance.',
    bullets: [
      'Adapts to commercial gym, barbell dungeon, or home bands',
      'Real-time joint & injury aware exercise substitutions',
      'Autoregulated RPE & progressive overload formulas',
    ],
    accent: {
      border: 'rgba(16,185,129,0.35)',
      glow: 'rgba(16,185,129,0.18)',
      iconBg: 'rgba(16,185,129,0.12)',
      iconColor: '#34d399',
      badgeBg: 'rgba(16,185,129,0.12)',
      badgeColor: '#34d399',
    },
    large: true,
    meta: '500+ Exercise Library',
    DemoComponent: WorkoutDemo,
  },
  {
    id: 'macro',
    Icon: Camera,
    label: 'Vision Macro Tracker',
    tagline: 'Point. Snap. Logged in 200ms.',
    desc: 'Photograph any meal and our multimodal vision model instantly measures portion volumes and logs caloric macros directly into your daily target.',
    bullets: [
      'Real-time protein, carbohydrate, and fat breakdown',
      'Accurately calculates restaurant and home-cooked meals',
      'Bi-directional sync with Apple Health and Google Fit',
    ],
    accent: {
      border: 'rgba(20,184,166,0.35)',
      glow: 'rgba(20,184,166,0.18)',
      iconBg: 'rgba(20,184,166,0.12)',
      iconColor: '#2dd4bf',
      badgeBg: 'rgba(20,184,166,0.12)',
      badgeColor: '#2dd4bf',
    },
    large: false,
    meta: '97.4% Accuracy',
    DemoComponent: MacroDemo,
  },
  {
    id: 'form',
    Icon: Eye,
    label: 'Computer Vision Form Guard',
    tagline: 'Real-time biomechanics & injury shield',
    desc: 'Point your camera at your workout station. Our on-device neural model analyzes skeletal joint vectors at 60 FPS, cueing you to fix lumbar breakdown before injury.',
    bullets: [
      '17-point skeletal landmark tracking at 60 FPS',
      'Zero video recorded — 100% private on-device analysis',
      'Real-time audio & haptic cueing mid-rep',
    ],
    accent: {
      border: 'rgba(168,85,247,0.35)',
      glow: 'rgba(168,85,247,0.18)',
      iconBg: 'rgba(168,85,247,0.12)',
      iconColor: '#c084fc',
      badgeBg: 'rgba(168,85,247,0.12)',
      badgeColor: '#c084fc',
    },
    large: false,
    meta: '< 20ms Latency',
    DemoComponent: FormDemo,
  },
  {
    id: 'coach',
    Icon: Mic,
    label: '24/7 Conversational Voice Coach',
    tagline: 'Natural audio coaching during intense sets',
    desc: 'Speak naturally mid-workout without tapping a screen. Ask for weight suggestions, form tips, or playlist swaps with human-level cadence and instant response.',
    bullets: [
      'Ultra-low latency speech-to-speech architecture',
      'Adapts weight load in real-time between sets',
      'Instant post-session debrief and recovery readiness',
    ],
    accent: {
      border: 'rgba(59,130,246,0.35)',
      glow: 'rgba(59,130,246,0.18)',
      iconBg: 'rgba(59,130,246,0.12)',
      iconColor: '#60a5fa',
      badgeBg: 'rgba(59,130,246,0.12)',
      badgeColor: '#60a5fa',
    },
    large: true,
    meta: '< 250ms Response',
    DemoComponent: VoiceDemo,
  },
]

/* ── Single Bento Card ── */
function FeatureCard({ f, expanded, onToggle, index }) {
  const { Icon, label, tagline, desc, bullets, accent, large, meta, DemoComponent } = f

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
      onClick={onToggle}
      className={large ? 'md:col-span-2' : 'md:col-span-1'}
      style={{
        background: 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${expanded ? accent.border.replace('0.35', '0.75') : accent.border}`,
        borderRadius: 20,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        cursor: 'pointer',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: expanded
          ? `0 20px 40px -15px rgba(0,0,0,0.7), 0 0 30px ${accent.glow}`
          : '0 10px 30px -10px rgba(0,0,0,0.5)',
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            padding: 11, borderRadius: 14,
            background: accent.iconBg, flexShrink: 0,
            border: `1px solid ${accent.border}`,
          }}>
            <Icon size={22} color={accent.iconColor} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{label}</h3>
              <span style={{
                fontSize: 9.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                background: accent.badgeBg, color: accent.badgeColor,
                border: `1px solid ${accent.border}`,
              }}>
                {meta}
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: '#64748b', marginTop: 3, margin: 0 }}>{tagline}</p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            color: '#94a3b8',
            flexShrink: 0,
            padding: 4,
            borderRadius: 8,
            background: 'rgba(30,41,59,0.5)',
          }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
        {desc}
      </p>

      {/* Bullet Points */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bullets.map(b => (
          <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#cbd5e1' }}>
            <Sparkles size={13} color={accent.iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Expandable Demo with AnimatePresence */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px solid rgba(51,65,85,0.5)', paddingTop: 10 }}>
              <DemoComponent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Footer Action */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(51,65,85,0.3)',
        paddingTop: 10,
        marginTop: 'auto',
      }}>
        <span style={{ fontSize: 11.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Cpu size={12} color="#10b981" /> Neural Engine
        </span>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {expanded ? 'Hide Interactive Demo' : 'Live Interactive Demo'}
          <ArrowRight size={12} />
        </span>
      </div>
    </motion.div>
  )
}

/* ── Features Section ── */
export default function Features() {
  const [expanded, setExpanded] = useState('workout')
  const toggle = (id) => setExpanded(p => p === id ? null : id)

  return (
    <section id="features" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 60px' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 14px', borderRadius: 999, marginBottom: 16,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)',
            color: '#34d399', fontSize: 12.5, fontWeight: 700,
          }}>
            <Sparkles size={12} /> Proprietary AI Core
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4.2vw, 48px)',
            fontWeight: 900,
            color: '#f8fafc',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            margin: '0 0 16px',
          }}>
            Everything your human coach<br />
            <span className="animate-gradient-text">wishes they could do</span>
          </h2>

          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Four interconnected AI neural networks operating at 60 FPS—designing routines, auditing macros, protecting joints, and guiding your reps.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div id="ai-tools" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, idx) => (
            <FeatureCard
              key={f.id}
              f={f}
              index={idx}
              expanded={expanded === f.id}
              onToggle={() => toggle(f.id)}
            />
          ))}
        </div>

        {/* Bottom Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            marginTop: 48,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 28,
            fontSize: 13,
            color: '#64748b',
          }}
        >
          {[
            { I: Wifi, t: '100% Offline Mode Capable' },
            { I: Clock, t: '< 200ms Neural Generation' },
            { I: Cpu, t: 'Zero-Cloud On-Device Biometric Processing' },
          ].map(({ I, t }) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <I size={14} color="#10b981" />
              <span>{t}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
