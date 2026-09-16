import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Flame, Zap, TrendingUp, HeartPulse, Dumbbell,
  Utensils, CheckCircle2, ArrowUpRight, Activity,
  Clock, ShieldCheck, Sparkles, ChevronRight, Award
} from 'lucide-react'

export default function DashboardOverview({
  setActiveView,
  onOpenCoach,
  activeVolume,
  setActiveVolume
}) {
  const [timeframe, setTimeframe] = useState('7D')
  const [todaySetsDone, setTodaySetsDone] = useState([true, true, false, false])

  const toggleSet = (index) => {
    setTodaySetsDone(prev => {
      const updated = [...prev]
      const wasDone = updated[index]
      updated[index] = !wasDone
      if (setActiveVolume) {
        setActiveVolume(v => wasDone ? v - 850 : v + 850)
      }
      return updated
    })
  }

  const kpis = [
    {
      title: 'Total Volume Lifted',
      value: `${(activeVolume || 14850).toLocaleString()} kg`,
      change: '+14.2% vs last cycle',
      positive: true,
      color: '#34d399',
      icon: Dumbbell,
      subtext: 'Optimal progressive overload curve',
    },
    {
      title: 'Metabolic Energy Burned',
      value: '2,840 kcal',
      change: '+310 kcal above target',
      positive: true,
      color: '#fb923c',
      icon: Flame,
      subtext: '48 min in Zone 2 cardiovascular zone',
    },
    {
      title: 'Consistency Habit Streak',
      value: '34 Days',
      change: 'Personal All-Time Record',
      positive: true,
      color: '#c084fc',
      icon: Zap,
      subtext: 'Next achievement unlock in 6 days',
    },
    {
      title: 'CNS Neuromuscular Readiness',
      value: '94% Optimal',
      change: 'HRV 78ms (Prime)',
      positive: true,
      color: '#2dd4bf',
      icon: HeartPulse,
      subtext: 'High tolerance for heavy barbell CNS loading',
    },
  ]

  return (
    <div className="space-y-8">

      {/* Hero Welcome & Quick Diagnostic Banner */}
      <div className="relative rounded-none p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-[rgba(0,217,255,0.2)] overflow-hidden shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#00d9ff]/15 rounded-none blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#00d9ff]/10 border border-[rgba(0,217,255,0.2)] text-[#00d9ff] text-xs font-bold mb-3">
              <Sparkles size={13} />
              <span>AI Readiness Analysis: Prime For Heavy Sets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="text-neon-gradient">Alex</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Sleep telemetry indicates 8h 14m restorative deep sleep. Your recovery coefficient is in the 94th percentile. Today’s prescribed focus is Upper Hypertrophy.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView('generator')}
              className="btn-primary text-xs py-2.5 px-5"
            >
              <Dumbbell size={15} />
              <span>Generate New AI Plan</span>
            </button>
            <button
              onClick={onOpenCoach}
              className="btn-secondary text-xs py-2.5 px-4"
            >
              <span>Consult AI Coach</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 High-Density KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.title}
              whileHover={{ y: -3 }}
              className="p-5 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 hover:border-[rgba(0,217,255,0.25)] transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{kpi.title}</span>
                <div
                  className="p-2 rounded-none"
                  style={{ backgroundColor: `${kpi.color}15` }}
                >
                  <Icon size={16} style={{ color: kpi.color }} />
                </div>
              </div>

              <div className="text-2xl font-black text-white tracking-tight">
                {kpi.value}
              </div>

              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}
                >
                  {kpi.change}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 mt-2">{kpi.subtext}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Interactive Telemetry Chart Section */}
      <div className="p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-extrabold text-white">
              Longitudinal Caloric & Volume Telemetry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-sensor expenditure curve mapped with barbell volume load
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-none bg-[var(--bg-dark)] border border-slate-800 text-xs">
            {['7D', '30D', '90D'].map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`
                  px-3 py-1.5 rounded-none font-bold transition-all cursor-pointer
                  ${timeframe === t
                    ? 'bg-[#00d9ff] text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : 'text-slate-400 hover:text-white'
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic SVG Spline Chart */}
        <div className="w-full h-48 relative">
          <svg viewBox="0 0 700 160" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="telemetryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Guide Grid Lines */}
            <line x1="0" y1="35" x2="700" y2="35" stroke="rgba(51,65,85,0.25)" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="700" y2="80" stroke="rgba(51,65,85,0.25)" strokeDasharray="4 4" />
            <line x1="0" y1="125" x2="700" y2="125" stroke="rgba(51,65,85,0.25)" strokeDasharray="4 4" />

            {/* Shaded Area */}
            <path
              d="M 0 115 Q 70 85, 140 100 T 280 60 T 420 45 T 560 30 T 700 22 L 700 160 L 0 160 Z"
              fill="url(#telemetryGrad)"
            />

            {/* Glowing Spline Stroke */}
            <path
              d="M 0 115 Q 70 85, 140 100 T 280 60 T 420 45 T 560 30 T 700 22"
              fill="none"
              stroke="#34d399"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data Coordinates */}
            {[[140, 100], [280, 60], [420, 45], [560, 30], [700, 22]].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="5"
                fill="#10b981"
                stroke="#030712"
                strokeWidth="2.5"
                className="hover:r-7 transition-all cursor-pointer"
              />
            ))}
          </svg>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-800/80">
          <span>Mon (2,410 kcal)</span>
          <span>Tue (2,650 kcal)</span>
          <span>Wed (2,520 kcal)</span>
          <span>Thu (2,790 kcal)</span>
          <span>Fri (2,840 kcal)</span>
          <span className="text-[#00d9ff] font-bold">Today · Sat (3,110 kcal · Peak)</span>
        </div>
      </div>

      {/* 2-Column Split: Active Workout Checklist & Real-Time Macro Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Today's Active Session Queue */}
        <div className="lg:col-span-7 p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-none bg-[#00d9ff]/10 border border-[rgba(0,217,255,0.2)] text-[#00d9ff]">
                <Dumbbell size={16} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">
                  Today's Active Workout Queue
                </h4>
                <p className="text-xs text-slate-400">
                  Click sets to toggle completion state & calculate live volume
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('logger')}
              className="text-xs font-bold text-[#00d9ff] hover:text-[#33e4ff] flex items-center gap-1"
            >
              <span>Launch Logger</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-2.5 pt-2">
            {[
              { name: 'Incline Barbell Bench Press', load: '92.5 kg × 8 reps', rpe: 'RPE 8.5', rest: '90s' },
              { name: 'Neutral-Grip DB Shoulder Press', load: '36 kg/hand × 10 reps', rpe: 'RPE 8.0', rest: '75s' },
              { name: 'Weighted Chest Dips (+Chain)', load: '+20 kg × 8 reps', rpe: 'RPE 9.0', rest: '90s' },
              { name: 'Cable Lateral Raise (Behind back)', load: '17.5 kg × 15 reps', rpe: 'RPE 9.5', rest: '60s' },
            ].map((exercise, idx) => {
              const isDone = todaySetsDone[idx]
              return (
                <div
                  key={exercise.name}
                  onClick={() => toggleSet(idx)}
                  className={`
                    p-3.5 rounded-none border flex items-center justify-between cursor-pointer transition-all
                    ${isDone
                      ? 'bg-[#00d9ff]/10 border-[rgba(0,217,255,0.25)] text-slate-300'
                      : 'bg-[var(--bg-dark)]/60 border-slate-800 hover:border-slate-700 text-slate-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      size={18}
                      className={isDone ? 'text-[#00d9ff] fill-emerald-400' : 'text-slate-600'}
                    />
                    <div>
                      <p className={`text-xs font-bold ${isDone ? 'line-through opacity-75' : ''}`}>
                        {exercise.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {exercise.load}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {exercise.rpe}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {exercise.rest}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Macro Rings & Nutrition Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-none bg-[rgba(0,217,255,0.05)] border border-[#00d9ff]/30 text-[#00d9ff]">
                <Utensils size={16} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">Daily Macro Allocation</h4>
                <p className="text-xs text-slate-400">2,150 / 2,750 kcal Logged</p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('macros')}
              className="text-xs font-bold text-[#00d9ff] hover:text-[#33e4ff] flex items-center gap-1"
            >
              <span>Calculator</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Macro Progress Bars */}
          <div className="space-y-3.5 pt-2">
            {[
              { label: 'Protein (Anabolic Synthesis)', current: 165, target: 195, unit: 'g', color: '#10b981' },
              { label: 'Carbohydrates (Glycogen Repletion)', current: 240, target: 310, unit: 'g', color: '#14b8a6' },
              { label: 'Healthy Fats (Hormonal Balance)', current: 58, target: 70, unit: 'g', color: '#f59e0b' },
              { label: 'Hydration & Electrolytes', current: 3.2, target: 4.0, unit: 'L', color: '#06b6d4' },
            ].map(m => {
              const pct = Math.min((m.current / m.target) * 100, 100)
              return (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{m.label}</span>
                    <span style={{ color: m.color }}>
                      {m.current} / {m.target} {m.unit}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-none bg-[var(--bg-dark)] overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-none transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: m.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Log Alert */}
          <div className="p-3.5 rounded-none bg-[var(--bg-dark)]/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Next scheduled feeding:</span>
            <span className="text-[#00d9ff] font-bold">Post-Workout Isolate · 35g P</span>
          </div>
        </div>

      </div>

    </div>
  )
}
