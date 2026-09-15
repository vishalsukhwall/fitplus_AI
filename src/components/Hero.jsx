import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, Play, Flame, Brain,
  Dumbbell, CheckCircle2, Activity, Zap, Star, ShieldCheck,
  Terminal, Sparkles
} from 'lucide-react'

/* Animated counter hook */
function useCounter(target, duration, active) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])
  return val
}

/* ── Interactive Dashboard Mockup Card ── */
function DashboardCard() {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-40px' })

  const calories = useCounter(847, 1600, isInView)
  const streak   = useCounter(32,  1200, isInView)
  const score    = useCounter(94,  1400, isInView)

  const [plan, setPlan] = useState([
    { name: 'Incline Barbell Bench', sets: '4 × 10', done: true  },
    { name: 'Neutral-Grip DB Press', sets: '3 × 12', done: true  },
    { name: 'Weighted Pull-Ups',     sets: '3 × 8',  done: false },
    { name: 'Cable Lateral Raise',   sets: '3 × 15', done: false },
  ])

  const togglePlan = (index) => {
    setPlan(prev => prev.map((item, i) => i === index ? { ...item, done: !item.done } : item))
  }

  const bars = [60, 80, 55, 90, 70, 95, 75]
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      style={{ position: 'relative', width: '100%', maxWidth: 460 }}
    >
      {/* Ambient float wrapper */}
      <motion.div
        animate={{ y: [-5, 7, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative' }}
      >
        {/* Glow halo behind dashboard */}
        <div style={{
          position: 'absolute', inset: -20, borderRadius: 28,
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(20,184,166,0.06) 60%, transparent 80%)',
          filter: 'blur(32px)', pointerEvents: 'none',
        }} />

        {/* Floating AI badge pill */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          style={{
            position: 'absolute', top: -16, right: -12, zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(15,23,42,0.92)',
            border: '1px solid rgba(16,185,129,0.45)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 16px rgba(16,185,129,0.25)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Zap size={13} color="#34d399" fill="#34d399" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>AI Biomechanics: 98.4%</span>
        </motion.div>

        {/* Floating Biometrics pill */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          style={{
            position: 'absolute', bottom: -14, left: -10, zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(15,23,42,0.92)',
            border: '1px solid rgba(20,184,166,0.45)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 16px rgba(20,184,166,0.25)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Activity size={13} color="#2dd4bf" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>HRV 78ms · High CNS Readiness</span>
        </motion.div>

        {/* Main Card Container */}
        <div
          className="glass-card glow-border"
          style={{
            padding: '26px 22px',
            background: 'rgba(15,23,42,0.85)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.15)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <p style={{ fontSize: 10.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
                Live Biometric Telemetry
              </p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>
                Today's Power Hypertrophy
              </p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)',
            }}>
              <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                <span className="animate-ping-live" style={{
                  position: 'absolute', width: '100%', height: '100%',
                  borderRadius: '50%', background: '#34d399', opacity: 0.7,
                }} />
                <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399' }}>CONNECTED</span>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
            {[
              { Icon: Flame,  label: 'Burned',   val: calories, unit: 'kcal', color: '#fb923c', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)' },
              { Icon: Zap,    label: 'Streak',   val: streak,   unit: 'days', color: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
              { Icon: Star,   label: 'AI Score', val: score,    unit: '/100', color: '#c084fc', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)' },
            ].map(({ Icon, label, val, unit, color, bg, border }) => (
              <motion.div
                key={label}
                whileHover={{ y: -2, scale: 1.02 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '12px 8px', borderRadius: 14, background: bg,
                  border: `1px solid ${border}`,
                  transition: 'background 0.2s',
                }}
              >
                <Icon size={14} color={color} />
                <span style={{ fontSize: 21, fontWeight: 800, color, marginTop: 4, letterSpacing: '-0.5px' }}>{val}</span>
                <span style={{ fontSize: 9.5, color: '#64748b' }}>{unit}</span>
                <span style={{ fontSize: 9.5, color: '#94a3b8', marginTop: 2, fontWeight: 600 }}>{label}</span>
              </motion.div>
            ))}
          </div>

          {/* Bar chart with animated entrance */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#cbd5e1' }}>Weekly Output Volume</span>
              <Activity size={12} color="#34d399" />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 56, padding: '4px 0' }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: isInView ? `${h}%` : '0%' }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                    style={{
                      width: '100%',
                      borderRadius: '4px 4px 0 0',
                      background: i === 5
                        ? 'linear-gradient(to top, #10b981, #34d399)'
                        : 'rgba(16,185,129,0.22)',
                      boxShadow: i === 5 ? '0 0 12px rgba(16,185,129,0.5)' : 'none',
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', marginTop: 4 }}>
              {days.map((d, i) => (
                <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: i === 5 ? '#34d399' : '#64748b', fontWeight: i === 5 ? 700 : 500 }}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Workout Plan list */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#cbd5e1' }}>Interactive Queue (click to complete)</span>
              <Dumbbell size={12} color="#34d399" />
            </div>
            {plan.map(({ name, sets, done }, idx) => (
              <motion.div
                key={name}
                onClick={() => togglePlan(idx)}
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: 10, marginBottom: 6,
                  cursor: 'pointer',
                  background: done ? 'rgba(16,185,129,0.09)' : 'rgba(30,41,59,0.5)',
                  border: done ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(51,65,85,0.4)',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <CheckCircle2
                    size={13}
                    color={done ? '#34d399' : '#475569'}
                    fill={done ? '#34d399' : 'none'}
                    style={{ transition: 'all 0.2s' }}
                  />
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: done ? '#e2e8f0' : '#64748b',
                    textDecoration: done ? 'line-through' : 'none',
                    opacity: done ? 0.8 : 1,
                  }}>
                    {name}
                  </span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: done ? '#34d399' : '#64748b' }}>
                  {sets}
                </span>
              </motion.div>
            ))}
          </div>

          {/* AI Neural Coach Insight */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 11,
              padding: '12px 14px', borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.06))',
              border: '1px solid rgba(16,185,129,0.3)',
            }}
          >
            <Brain size={17} color="#34d399" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: '#34d399', margin: '0 0 3px' }}>
                AI Neural Coach Recommendation
              </p>
              <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Neurological recovery is 94%. Increase bench load by +2.5 kg on set 3—your readiness allows it!
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Hero Section ── */
export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: 88,
      paddingBottom: 64,
    }}>
      {/* Central hero radiant glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 840, height: 840, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.09) 0%, rgba(20,184,166,0.02) 50%, transparent 70%)',
        filter: 'blur(130px)', pointerEvents: 'none',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Copy & Value Proposition */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                display: 'inline-flex', alignSelf: 'flex-start',
                alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 999,
                background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.4)',
                color: '#34d399', fontSize: 12.5, fontWeight: 700,
                boxShadow: '0 0 18px rgba(16,185,129,0.18)',
              }}
            >
              <Zap size={13} fill="#34d399" color="#34d399" />
              <span>Next-Gen Autonomous Fitness OS</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontSize: 'clamp(34px, 5.2vw, 64px)',
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-1.5px',
                margin: 0,
              }}
            >
              <span style={{ color: '#f8fafc' }}>Transform Your Body</span><br />
              <span style={{ color: '#f8fafc' }}>with Your Personal </span>
              <span className="animate-gradient-text">AI Coach</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                fontSize: 17.5,
                color: '#94a3b8',
                lineHeight: 1.65,
                maxWidth: 540,
                margin: 0,
              }}
            >
              FitPulse AI designs precision workout blocks and meal targets in milliseconds—dynamically adapting to your equipment, past injuries, sleep score, and real-time form.
            </motion.p>

            {/* Trust Signals and Avatars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}
            >
              {[
                { val: '2M+',  label: 'Athletes Trained' },
                { val: '4.9★', label: 'App Store Rating' },
                { val: '98%',  label: 'Goal Achievement' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#34d399', letterSpacing: '-0.5px' }}>{val}</div>
                  <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 500 }}>{label}</div>
                </div>
              ))}

              <div style={{ width: 1, height: 32, background: '#1e293b' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex' }}>
                  {['#10b981', '#14b8a6', '#06b6d4', '#6366f1', '#a855f7'].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        border: '2px solid #030712',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, color: '#fff',
                        marginLeft: i > 0 ? -8 : 0,
                        background: c,
                      }}
                    >
                      {['A','R','K','J','M'][i]}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 500 }}>Join 2M+ members</span>
              </div>
            </motion.div>

            {/* CTAs pointing to interactive tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 4 }}
            >
              <motion.a
                href="#ai-generator"
                whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(16,185,129,0.7)' }}
                whileTap={{ scale: 0.96 }}
                className="btn-primary"
                style={{ fontSize: 15, padding: '13px 26px' }}
              >
                <Sparkles size={16} />
                <span>Test Live AI Generator</span>
                <ArrowRight size={16} />
              </motion.a>

              <motion.a
                href="#dashboard"
                whileHover={{ scale: 1.04, borderColor: 'rgba(16,185,129,0.6)' }}
                whileTap={{ scale: 0.96 }}
                className="btn-secondary"
                style={{ fontSize: 15, padding: '13px 24px', display: 'flex', alignItems: 'center', gap: 9 }}
              >
                <Terminal size={15} color="#34d399" />
                <span>Explore Live Dashboard</span>
              </motion.a>
            </motion.div>

            {/* Reassurance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#64748b' }}
            >
              <ShieldCheck size={14} color="#10b981" />
              <span>No credit card required · 14-day free Pro trial · Immediate generation</span>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Interactive AI Dashboard */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <DashboardCard />
          </div>

        </div>
      </div>
    </section>
  )
}
