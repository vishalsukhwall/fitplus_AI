import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, HeartPulse, Activity,
  Calendar, Flame, Zap, Award, ArrowUpRight
} from 'lucide-react'

export default function BiometricAnalytics() {
  const [range, setRange] = useState('30D')

  const PR_PROGRESSIONS = [
    { lift: 'Barbell Back Squat', current: '175 kg', baseline: '150 kg', gain: '+16.6%', date: '3 days ago' },
    { lift: 'Competition Bench Press', current: '135 kg', baseline: '120 kg', gain: '+12.5%', date: 'Yesterday' },
    { lift: 'Conventional Deadlift', current: '220 kg', baseline: '195 kg', gain: '+12.8%', date: 'Last week' },
    { lift: 'Standing Overhead Press', current: '82.5 kg', baseline: '72.5 kg', gain: '+13.7%', date: '5 days ago' },
  ]

  const MUSCLE_DISTRIBUTION = [
    { muscle: 'Quadriceps & Hamstrings', sets: 42, pct: 28, color: '#10b981' },
    { muscle: 'Upper Pectorals & Delts', sets: 36, pct: 24, color: '#14b8a6' },
    { muscle: 'Latissimus Dorsi & Traps', sets: 34, pct: 22, color: '#06b6d4' },
    { muscle: 'Arms (Triceps & Biceps)', sets: 24, pct: 16, color: '#8b5cf6' },
    { muscle: 'Core & Stabilizers', sets: 15, pct: 10, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-8">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Biometric & Hypertrophy Trends
          </h2>
          <p className="text-xs text-slate-400">
            Longitudinal sensor telemetry aggregated across 142 logged training sessions
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-none bg-[var(--bg-dark)] border border-slate-800 text-xs">
          {['7D', '30D', '90D', '1Y'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`
                px-3 py-1.5 rounded-none font-bold transition-all cursor-pointer
                ${range === r ? 'bg-[#00d9ff] text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white'}
              `}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80">
          <span className="text-xs text-slate-400 font-bold uppercase">Mean HRV Recovery</span>
          <p className="text-2xl font-black text-[#00d9ff] mt-1">78.4 ms</p>
          <span className="text-[11px] text-[#00d9ff] font-bold block mt-1">+9.2% parasympathetic tone</span>
        </div>

        <div className="p-5 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80">
          <span className="text-xs text-slate-400 font-bold uppercase">Monthly Accumulated Volume</span>
          <p className="text-2xl font-black text-[#00d9ff] mt-1">584,200 kg</p>
          <span className="text-[11px] text-[#00d9ff] font-bold block mt-1">+14.2% progressive overload</span>
        </div>

        <div className="p-5 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80">
          <span className="text-xs text-slate-400 font-bold uppercase">Average Sleep Quality Index</span>
          <p className="text-2xl font-black text-purple-400 mt-1">91 / 100</p>
          <span className="text-[11px] text-purple-400 font-bold block mt-1">2h 14m restorative deep sleep</span>
        </div>
      </div>

      {/* 2-Column: 1RM Progression & Muscle Group Volume Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* 1RM Strength Gains Table */}
        <div className="lg:col-span-7 p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-[#00d9ff]" />
            <h3 className="text-base font-extrabold text-white">Estimated 1RM Strength Trajectory</h3>
          </div>

          <div className="space-y-2.5 pt-2">
            {PR_PROGRESSIONS.map((pr) => (
              <div
                key={pr.lift}
                className="p-4 rounded-none bg-[var(--bg-dark)]/70 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-white">{pr.lift}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Baseline: {pr.baseline} · {pr.date}</p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#00d9ff]">{pr.current}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#00d9ff]/10 text-[#33e4ff] block mt-0.5">
                    {pr.gain}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Muscle Volume Distribution Bar */}
        <div className="lg:col-span-5 p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[#00d9ff]" />
            <h3 className="text-base font-extrabold text-white">Weekly Volume Allocation</h3>
          </div>

          <div className="space-y-3 pt-2">
            {MUSCLE_DISTRIBUTION.map(m => (
              <div key={m.muscle} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{m.muscle}</span>
                  <span style={{ color: m.color }}>{m.sets} sets ({m.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-none bg-[var(--bg-dark)] overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${m.pct * 2}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
