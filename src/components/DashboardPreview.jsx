import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Dumbbell, Utensils, MessageSquare,
  Flame, Zap, TrendingUp, CheckCircle2, ChevronRight,
  Send, Sparkles, Brain, Clock, ShieldCheck, HeartPulse,
  Plus, Droplets, RefreshCw
} from 'lucide-react'

// Simulated AI Chat dialogue and responses
const INITIAL_CHAT = [
  { sender: 'coach', time: '10:42 AM', text: "Good morning Alex! Your HRV scored 78ms and sleep was 8h 12m (94% recovery). Today's hypertrophy session is set for Upper Body Power." },
  { sender: 'user',  time: '10:43 AM', text: "Shoulder felt slightly tight yesterday on overhead press. Should I swap anything out?" },
  { sender: 'coach', time: '10:43 AM', text: "I've dynamically swapped the Standing Barbell OHP for Neutral-Grip Dumbbell Press at 60° incline. This reduces acromial impingement while maintaining full anterior deltoid load." },
]

const QUICK_PROMPTS = [
  "How much protein post-workout?",
  "Adjust calories for a rest day",
  "Can I substitute deadlifts today?",
  "My knees feel fatigued on squats",
]

const SMART_RESPONSES = {
  "How much protein post-workout?": "Aim for 35–45g of fast-absorbing whey isolate or lean animal protein within 90 minutes of your session, paired with 50g of high-glycemic carbohydrates to maximize glycogen re-synthesis.",
  "Adjust calories for a rest day": "On non-training days, we drop carbs by 65g and elevate healthy omega-3 fats by 10g. Your new daily baseline is 2,420 kcal to optimize insulin sensitivity while preventing excess adipose storage.",
  "Can I substitute deadlifts today?": "Yes! We can swap conventional deadlifts for Chest-Supported T-Bar Rows or Heavy Romanian Deadlifts (RDLs) depending on whether you want to prioritize lats or hamstring/glute hypertrophy.",
  "My knees feel fatigued on squats": "Let's modify today: swap heavy back squats for Leg Press with high/wide foot placement and slow 4-second eccentrics to keep tension strictly off the patellar tendon.",
}

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'workouts' | 'diet' | 'coach'
  const [timeframe, setTimeframe] = useState('7D') // '7D' | '30D' | '90D'

  // Interactive Workout Session State
  const [activeSessionCompleted, setActiveSessionCompleted] = useState([true, true, false, false])
  const [activeVolume, setActiveVolume] = useState(14850)

  const handleToggleSet = (index) => {
    setActiveSessionCompleted(prev => {
      const updated = [...prev]
      const wasDone = updated[index]
      updated[index] = !wasDone
      setActiveVolume(v => wasDone ? v - 850 : v + 850)
      return updated
    })
  }

  // Interactive Hydration State
  const [waterMl, setWaterMl] = useState(2500)
  const handleAddWater = () => {
    setWaterMl(w => Math.min(w + 250, 4500))
  }

  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT)
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = (textToSend) => {
    const text = textToSend || chatInput
    if (!text.trim()) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = { sender: 'user', time: now, text }

    setChatMessages(prev => [...prev, userMsg])
    if (!textToSend) setChatInput('')
    setIsTyping(true)

    setTimeout(() => {
      let reply = SMART_RESPONSES[text]
      if (!reply) {
        reply = `Understood! I've logged that telemetry. Based on your current volume load (${activeVolume.toLocaleString()} kg) and 94% recovery score, I recommend keeping your intensity at RPE 8.5 today.`
      }
      setChatMessages(prev => [...prev, { sender: 'coach', time: now, text: reply }])
      setIsTyping(false)
    }, 850)
  }

  return (
    <section id="dashboard" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 50px' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 14px', borderRadius: 999, marginBottom: 16,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)',
            color: '#34d399', fontSize: 12.5, fontWeight: 700,
          }}>
            <Activity size={13} />
            <span>Interactive SaaS Telemetry Command Center</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4.2vw, 48px)',
            fontWeight: 900,
            color: '#f8fafc',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            margin: '0 0 16px',
          }}>
            Experience the actual product.<br />
            <span className="animate-gradient-text">Live telemetry mockup</span>
          </h2>

          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Click the tabs, mark sets as completed, log hydration, or chat live with the built-in AI Neural Coach below.
          </p>
        </motion.div>

        {/* Outer SaaS Mockup Window Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card"
          style={{
            background: 'rgba(8,14,24,0.95)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.9), 0 0 45px rgba(16,185,129,0.15)',
          }}
        >
          {/* Top Window Bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(51,65,85,0.4)',
            background: 'rgba(15,23,42,0.8)',
            gap: 12,
          }}>
            {/* Window Traffic Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#eab308' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ marginLeft: 12, fontSize: 12.5, fontWeight: 700, color: '#94a3b8' }}>
                FitPulse Pro OS v3.4 · Live Telemetry
              </span>
            </div>

            {/* Sync Telemetry Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 999,
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} className="animate-pulse" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399' }}>Apple Watch Ultra Synced</span>
              </div>
              <span style={{ fontSize: 11.5, color: '#64748b' }}>Alex Rivera (Pro Athlete)</span>
            </div>
          </div>

          {/* Navigation Bar inside the App */}
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            gap: 8, padding: '12px 20px',
            borderBottom: '1px solid rgba(51,65,85,0.3)',
            background: 'rgba(15,23,42,0.4)',
          }}>
            {[
              { id: 'overview', label: 'Telemetry & Analytics', Icon: Activity },
              { id: 'workouts', label: 'Active Workout Queue', Icon: Dumbbell },
              { id: 'diet',     label: 'Nutritional Architecture', Icon: Utensils },
              { id: 'coach',    label: 'Live AI Neural Coach', Icon: Brain },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 18px', borderRadius: 12, cursor: 'pointer',
                  fontSize: 13, fontWeight: 700,
                  background: activeTab === id ? 'rgba(16,185,129,0.18)' : 'rgba(30,41,59,0.4)',
                  border: activeTab === id ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(51,65,85,0.3)',
                  color: activeTab === id ? '#34d399' : '#94a3b8',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={15} />
                <span>{label}</span>
                {id === 'coach' && (
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#10b981', boxShadow: '0 0 8px #10b981',
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Container */}
          <div style={{ padding: '28px 24px', minHeight: 480 }}>

            {/* TAB 1: OVERVIEW & TELEMETRY */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
              >
                {/* 4 Telemetry Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  {[
                    { title: 'Metabolic Output', val: '2,840 kcal', sub: '+320 kcal vs yesterday', color: '#fb923c', Icon: Flame },
                    { title: 'CNS Readiness Score', val: '94% Optimal', sub: 'HRV 78ms · High load ready', color: '#34d399', Icon: Zap },
                    { title: 'Weekly Volume Load', val: `${activeVolume.toLocaleString()} kg`, sub: '+14.2% overload on track', color: '#2dd4bf', Icon: TrendingUp },
                    { title: 'Training Consistency', val: '34 Days', sub: 'Personal all-time record', color: '#c084fc', Icon: HeartPulse },
                  ].map(({ title, val, sub, color, Icon }) => (
                    <div
                      key={title}
                      style={{
                        padding: 18, borderRadius: 16,
                        background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.4)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>{title}</span>
                        <div style={{ padding: 6, borderRadius: 8, background: `${color}15` }}>
                          <Icon size={14} color={color} />
                        </div>
                      </div>
                      <p style={{ fontSize: 22, fontWeight: 900, color, margin: 0, letterSpacing: '-0.5px' }}>{val}</p>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0' }}>{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Simulated Calorie Burn SVG Graph */}
                <div style={{
                  padding: 22, borderRadius: 18,
                  background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.4)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        Biometric Caloric Expenditure Curve
                      </h4>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
                        Continuous metabolic telemetry integrated with heart-rate zone calculation
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['7D', '30D', '90D'].map(t => (
                        <button
                          key={t}
                          onClick={() => setTimeframe(t)}
                          style={{
                            padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                            fontSize: 11.5, fontWeight: 700,
                            background: timeframe === t ? '#10b981' : 'rgba(30,41,59,0.6)',
                            color: timeframe === t ? '#000000' : '#94a3b8',
                            border: 'none',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Line Chart */}
                  <div style={{ width: '100%', height: 160, position: 'relative' }}>
                    <svg viewBox="0 0 600 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Horizontal Lines */}
                      <line x1="0" y1="30" x2="600" y2="30" stroke="rgba(51,65,85,0.25)" strokeDasharray="4 4" />
                      <line x1="0" y1="70" x2="600" y2="70" stroke="rgba(51,65,85,0.25)" strokeDasharray="4 4" />
                      <line x1="0" y1="110" x2="600" y2="110" stroke="rgba(51,65,85,0.25)" strokeDasharray="4 4" />

                      {/* Area Fill */}
                      <path
                        d="M 0 100 Q 60 70, 120 85 T 240 50 T 360 40 T 480 25 T 600 20 L 600 140 L 0 140 Z"
                        fill="url(#curveGradient)"
                      />

                      {/* Main Neon Stroke */}
                      <path
                        d="M 0 100 Q 60 70, 120 85 T 240 50 T 360 40 T 480 25 T 600 20"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Peak Dots */}
                      {[[120, 85], [240, 50], [360, 40], [480, 25], [600, 20]].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="4.5" fill="#10b981" stroke="#050a10" strokeWidth="2" />
                      ))}
                    </svg>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10.5, color: '#64748b' }}>
                    <span>Mon (2,410 kcal)</span>
                    <span>Tue (2,650 kcal)</span>
                    <span>Wed (2,520 kcal)</span>
                    <span>Thu (2,790 kcal)</span>
                    <span>Fri (2,840 kcal)</span>
                    <span>Today · Sat (Peak 3,110 kcal)</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ACTIVE WORKOUT QUEUE */}
            {activeTab === 'workouts' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 16, borderRadius: 14, background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.25)', flexWrap: 'wrap', gap: 12,
                }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                      Active Training Session
                    </span>
                    <h4 style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '2px 0 0' }}>
                      Upper Body Density & Core · 4 Sets Planned
                    </h4>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#cbd5e1' }}>
                      Session Volume: <strong style={{ color: '#34d399' }}>{activeVolume.toLocaleString()} kg</strong>
                    </span>
                    <span style={{ padding: '6px 12px', borderRadius: 8, background: '#1e293b', fontSize: 12, color: '#94a3b8' }}>
                      Elapsed: 42m 15s
                    </span>
                  </div>
                </div>

                {/* Interactive Sets Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { name: 'Incline Barbell Bench Press', load: '92.5 kg × 8 reps', targetRpe: 'RPE 8.5', rest: 'Rest 90s' },
                    { name: 'Neutral-Grip Dumbbell Press', load: '36 kg / hand × 10 reps', targetRpe: 'RPE 8.0', rest: 'Rest 75s' },
                    { name: 'Weighted Dips (with chain)', load: '+20 kg × 8 reps', targetRpe: 'RPE 9.0', rest: 'Rest 90s' },
                    { name: 'Cable Lateral Raise (Behind back)', load: '17.5 kg × 15 reps', targetRpe: 'RPE 9.5', rest: 'Rest 60s' },
                  ].map((exercise, idx) => {
                    const isDone = activeSessionCompleted[idx]
                    return (
                      <div
                        key={exercise.name}
                        onClick={() => handleToggleSet(idx)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                          background: isDone ? 'rgba(16,185,129,0.08)' : 'rgba(30,41,59,0.4)',
                          border: isDone ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(51,65,85,0.4)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <CheckCircle2
                            size={18}
                            color={isDone ? '#34d399' : '#475569'}
                            fill={isDone ? '#34d399' : 'none'}
                          />
                          <div>
                            <p style={{
                              fontSize: 14, fontWeight: 700, margin: 0,
                              color: isDone ? '#e2e8f0' : '#cbd5e1',
                              textDecoration: isDone ? 'line-through' : 'none',
                              opacity: isDone ? 0.8 : 1,
                            }}>
                              {exercise.name}
                            </p>
                            <p style={{ fontSize: 11.5, color: isDone ? '#34d399' : '#64748b', margin: '2px 0 0' }}>
                              {exercise.load}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: '#0f172a', color: '#94a3b8' }}>
                            {exercise.targetRpe}
                          </span>
                          <span style={{ fontSize: 11, color: '#64748b' }}>
                            {exercise.rest}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: DIET & NUTRITION */}
            {activeTab === 'diet' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                {/* Hydration Widget */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 16, borderRadius: 14, background: 'rgba(6,182,212,0.08)',
                  border: '1px solid rgba(6,182,212,0.3)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ padding: 10, borderRadius: 10, background: 'rgba(6,182,212,0.15)' }}>
                      <Droplets size={20} color="#22d3ee" />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                        Daily Electrolyte & Hydration: {waterMl} / 4,000 ml
                      </p>
                      <p style={{ fontSize: 11.5, color: '#94a3b8', margin: '2px 0 0' }}>
                        Hydration status: Optimal for heavy neuromuscular transmission
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddWater}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 10,
                      background: '#0891b2', border: 'none', color: '#ffffff',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} />
                    <span>Log +250ml</span>
                  </motion.button>
                </div>

                {/* Multimodal Meals Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { meal: 'Meal 1 (Post-Fast)', items: '6 Egg Whites, 60g Oats, Blueberries & Chia', cal: '520 kcal', p: '44g P', vision: '98% Vision Match' },
                    { meal: 'Meal 2 (Pre-Workout Fuel)', items: '200g Grass-Fed Ground Beef (90/10), 220g Jasmine Rice', cal: '720 kcal', p: '52g P', vision: 'Photo Logged' },
                    { meal: 'Meal 3 (Anabolic Recovery)', items: 'Whey Isolate + 1 Bagel with Natural Jam', cal: '410 kcal', p: '36g P', vision: 'Auto-Synced' },
                  ].map(m => (
                    <div
                      key={m.meal}
                      style={{
                        padding: '14px 16px', borderRadius: 12,
                        background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(51,65,85,0.4)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399' }}>{m.meal}</span>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: '#f8fafc', margin: '2px 0 0' }}>{m.items}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24' }}>{m.cal}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#34d399' }}>{m.p}</span>
                        <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                          {m.vision}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 4: LIVE AI COACH CHAT */}
            {activeTab === 'coach' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', height: 420 }}
              >
                {/* Chat Message Scroll Window */}
                <div style={{
                  flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
                  gap: 12, paddingRight: 6, marginBottom: 16,
                }}>
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div style={{
                        maxWidth: '82%',
                        padding: '10px 15px',
                        borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: msg.sender === 'user' ? 'rgba(16,185,129,0.2)' : 'rgba(30,41,59,0.8)',
                        border: msg.sender === 'user' ? '1px solid rgba(16,185,129,0.45)' : '1px solid rgba(51,65,85,0.5)',
                        color: '#f8fafc', fontSize: 13, lineHeight: 1.5,
                      }}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', gap: 14,
                          fontSize: 10, fontWeight: 700, marginBottom: 3,
                          color: msg.sender === 'user' ? '#34d399' : '#64748b',
                        }}>
                          <span>{msg.sender === 'user' ? 'You' : 'FitPulse Neural Coach'}</span>
                          <span>{msg.time}</span>
                        </div>
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: 12, width: 'fit-content' }}>
                      <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>Coach is analyzing...</span>
                      <span className="animate-bounce" style={{ width: 4, height: 4, borderRadius: '50%', background: '#34d399' }} />
                    </div>
                  )}
                </div>

                {/* Clickable Quick Prompts */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {QUICK_PROMPTS.map(qp => (
                    <button
                      key={qp}
                      type="button"
                      onClick={() => handleSendMessage(qp)}
                      style={{
                        padding: '5px 11px', borderRadius: 999, cursor: 'pointer',
                        fontSize: 11, color: '#94a3b8', background: 'rgba(30,41,59,0.6)',
                        border: '1px solid rgba(51,65,85,0.4)', transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#34d399'}
                      onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                    >
                      💬 {qp}
                    </button>
                  ))}
                </div>

                {/* Input Text Box */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  style={{ display: 'flex', gap: 8 }}
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask your coach anything (e.g., 'Should I train delts today?')..."
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: 12,
                      background: 'rgba(30,41,59,0.7)', border: '1px solid #334155',
                      color: '#f8fafc', fontSize: 13, outline: 'none',
                    }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="btn-primary"
                    style={{ padding: '12px 20px', borderRadius: 12 }}
                  >
                    <Send size={15} />
                    <span>Send</span>
                  </motion.button>
                </form>
              </motion.div>
            )}

          </div>

          {/* Bottom Telemetry Footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 20px',
            borderTop: '1px solid rgba(51,65,85,0.3)',
            background: 'rgba(15,23,42,0.6)',
            fontSize: 11.5, color: '#64748b',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={13} color="#10b981" />
              Real-time TLS 1.3 encrypted telemetry stream
            </span>
            <span style={{ color: '#34d399', fontWeight: 600 }}>
              Cloud Latency: 18ms · Tokyo Node
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
