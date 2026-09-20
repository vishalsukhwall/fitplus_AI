/**
 * DashboardGrid.jsx — Central Dashboard Overview Grid
 * Design: Titanium Minimalist / Deep Space Cyber
 * ──────────────────────────────────────────────────────────────
 * Deliverable:
 *   - Real-Time KPI Cards: Live metrics from localStorage via useNutrition
 *     (Total Daily Calories Consumed vs. Target TDEE, Remaining Macros for Protein, Carbs, Fats)
 *   - Visual Progress Bars: Clean dynamic progress indicators filling up live
 *   - Spacious Layout: 3-column responsive grid with 64px section gaps, 40px padding,
 *     0px border-radius, #09090b / #0f0f1a palette, #00d9ff cyber cyan accents.
 */

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Flame, Scale, Utensils, Droplets, Dumbbell,
  Zap, HeartPulse, ScanLine, PlusCircle, ArrowUpRight,
  Sparkles, CheckCircle2, ChevronRight, Activity, Clock
} from 'lucide-react'
import { useNutrition } from '../../hooks/useNutrition'
import { NUTRITION_DEFAULTS } from '../../utils/constants'

export default function DashboardGrid({
  setActiveView,
  onOpenCoach,
  activeVolume = 14850,
}) {
  const { state } = useNutrition()
  const { meals, dailyTotal, tdee } = state.mealLog

  // Compute macro targets based on TDEE or defaults
  const targetTdee = tdee || NUTRITION_DEFAULTS.tdee || 2500
  const targetProtein = NUTRITION_DEFAULTS.protein || 180
  const targetCarbs = NUTRITION_DEFAULTS.carbs || 280
  const targetFat = NUTRITION_DEFAULTS.fat || 80

  // Live Deltas & Percentages
  const caloriesConsumed = Math.round(dailyTotal.calories || 0)
  const caloriesRemaining = Math.max(targetTdee - caloriesConsumed, 0)
  const caloriesPercent = Math.min(Math.round((caloriesConsumed / targetTdee) * 100), 100)

  const proteinConsumed = Math.round(dailyTotal.protein || 0)
  const proteinRemaining = Math.max(targetProtein - proteinConsumed, 0)
  const proteinPercent = Math.min(Math.round((proteinConsumed / targetProtein) * 100), 100)

  const carbsConsumed = Math.round(dailyTotal.carbs || 0)
  const carbsRemaining = Math.max(targetCarbs - carbsConsumed, 0)
  const carbsPercent = Math.min(Math.round((carbsConsumed / targetCarbs) * 100), 100)

  const fatConsumed = Math.round(dailyTotal.fat || 0)
  const fatRemaining = Math.max(targetFat - fatConsumed, 0)
  const fatPercent = Math.min(Math.round((fatConsumed / targetFat) * 100), 100)

  // Recent 3 meals
  const recentMeals = useMemo(() => {
    return [...meals].reverse().slice(0, 3)
  }, [meals])

  return (
    <div className="space-y-16" style={{ padding: '40px 0' }}>

      {/* ─── SECTION 1: HERO TELEMETRY COMMAND HEADER ─── */}
      <section className="relative p-8 sm:p-10 bg-[#0f0f1a] border border-slate-800 shadow-2xl overflow-hidden rounded-none">
        {/* Cyber ambient glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00d9ff]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] font-mono text-xs uppercase tracking-wider font-bold">
              <Sparkles size={14} />
              <span>AI Biometric Telemetry · Prime CNS Status</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Command Center: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] via-[#38bdf8] to-[#a78bfa]">Real-Time Overview</span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Live nutritional & volume telemetry synchronized directly from computer vision scans and athlete logs. All metrics calibrate dynamically against your Mifflin-St Jeor metabolic target.
            </p>
          </div>

          {/* Quick Action Matrix */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView?.('scanner')}
              type="button"
              className="px-5 h-12 flex items-center gap-2 bg-[#00d9ff] hover:bg-[#3be3ff] text-[#09090b] font-mono font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all"
            >
              <ScanLine size={16} />
              <span>Scan Food (CV)</span>
            </button>

            <button
              onClick={() => setActiveView?.('macros')}
              type="button"
              className="px-5 h-12 flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-[#00d9ff] text-slate-200 font-mono font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer transition-colors"
            >
              <PlusCircle size={15} className="text-[#00d9ff]" />
              <span>Log Meal</span>
            </button>

            <button
              onClick={() => setActiveView?.('generator')}
              type="button"
              className="px-5 h-12 flex items-center gap-2 bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-mono font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer transition-colors"
            >
              <Dumbbell size={15} />
              <span>AI Workout</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: 3-COLUMN REAL-TIME NUTRITION & MACRO KPI GRID ─── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#00d9ff] font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-[#00d9ff]" />
              <span>Dynamic State Telemetry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Real-Time Macronutrient & Caloric Architecture
            </h2>
          </div>

          <div className="font-mono text-xs text-slate-400">
            SYNC STATUS: <span className="text-emerald-400 font-bold">LOCALSTORAGE LIVE</span>
          </div>
        </div>

        {/* 3-Column Spacious Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* COLUMN 1: CALORIC BUDGET & METABOLIC STATUS */}
          <div className="p-8 bg-[#0f0f1a] border border-slate-800 hover:border-[#00d9ff]/30 transition-all rounded-none space-y-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                  Caloric Expenditure Balance
                </span>
                <div className="w-9 h-9 border border-[#00d9ff]/30 bg-[#00d9ff]/10 flex items-center justify-center text-[#00d9ff]">
                  <Flame size={18} />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {caloriesConsumed.toLocaleString()}
                  </span>
                  <span className="text-sm font-mono text-slate-400">
                    / {targetTdee.toLocaleString()} kcal
                  </span>
                </div>
                <p className="text-xs font-mono text-[#00d9ff] mt-2">
                  {caloriesRemaining > 0
                    ? `${caloriesRemaining.toLocaleString()} kcal remaining for today`
                    : 'Daily TDEE goal met or exceeded'}
                </p>
              </div>

              {/* Progress meter */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Budget Consumed</span>
                  <span className="text-[#00d9ff] font-bold">{caloriesPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 border border-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00d9ff] to-[#38bdf8] shadow-[0_0_12px_#00d9ff]"
                    initial={{ width: 0 }}
                    animate={{ width: `${caloriesPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs text-slate-400">
              <span>Target TDEE Base</span>
              <span className="text-white font-bold">{targetTdee} kcal</span>
            </div>
          </div>

          {/* COLUMN 2: ANABOLIC PROTEIN ALLOCATION */}
          <div className="p-8 bg-[#0f0f1a] border border-slate-800 hover:border-emerald-500/30 transition-all rounded-none space-y-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                  Protein Synthesis (2.2g/kg)
                </span>
                <div className="w-9 h-9 border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Scale size={18} />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {proteinConsumed}
                  </span>
                  <span className="text-sm font-mono text-slate-400">
                    / {targetProtein}g
                  </span>
                </div>
                <p className="text-xs font-mono text-emerald-400 mt-2">
                  {proteinRemaining > 0
                    ? `${proteinRemaining}g remaining to optimal hyper-recovery`
                    : 'Target protein intake reached'}
                </p>
              </div>

              {/* Progress meter */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Anabolic Target</span>
                  <span className="text-emerald-400 font-bold">{proteinPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 border border-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${proteinPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs text-slate-400">
              <span>Hypertrophy Velocity</span>
              <span className="text-emerald-400 font-bold">
                {proteinPercent >= 80 ? 'Optimal' : 'In Progress'}
              </span>
            </div>
          </div>

          {/* COLUMN 3: CARBS & DIETARY FATS DIVISION */}
          <div className="p-8 bg-[#0f0f1a] border border-slate-800 hover:border-amber-500/30 transition-all rounded-none space-y-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                  Carbs & Lipids Distribution
                </span>
                <div className="w-9 h-9 border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Droplets size={18} />
                </div>
              </div>

              {/* Dual Mini Meters */}
              <div className="space-y-4 pt-1">
                {/* Carbs */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Carbohydrates (Glycogen)</span>
                    <span className="text-cyan-300 font-bold">{carbsConsumed} / {targetCarbs}g ({carbsPercent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 border border-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${carbsPercent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 text-right">
                    {carbsRemaining}g remaining
                  </p>
                </div>

                {/* Fats */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Healthy Fats (Hormones)</span>
                    <span className="text-amber-400 font-bold">{fatConsumed} / {targetFat}g ({fatPercent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 border border-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${fatPercent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 text-right">
                    {fatRemaining}g remaining
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs text-slate-400">
              <span>Combined Energy Ratio</span>
              <span className="text-amber-400 font-bold">Balanced</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 3: 3-COLUMN RECENT MEALS & PERFORMANCE INTELLIGENCE ─── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#00d9ff] font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-[#00d9ff]" />
              <span>Real-Time Log Feed & Diagnostics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Active Meal Queue & Training Telemetry
            </h2>
          </div>

          <button
            onClick={() => setActiveView?.('macros')}
            className="text-xs font-mono text-[#00d9ff] hover:text-[#33e4ff] flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
          >
            <span>Open Meal Logger</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 2-Column Span: Recent Logged Meals List */}
          <div className="lg:col-span-2 p-8 bg-[#0f0f1a] border border-slate-800 rounded-none space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase">
                <Utensils size={15} className="text-[#00d9ff]" />
                <span>Today’s Logged Meals ({meals.length})</span>
              </div>
              <span className="font-mono text-xs text-slate-400">
                {caloriesConsumed} kcal accumulated
              </span>
            </div>

            {meals.length === 0 ? (
              /* Designed empty state */
              <div className="p-8 border-2 border-dashed border-slate-800 bg-slate-950/60 text-center space-y-4 rounded-none">
                <div className="w-12 h-12 mx-auto border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-500">
                  <Utensils size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase font-mono">No Meals Logged Today</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
                    Point your camera at food to scan instant macros or manually log custom fuel to populate your live telemetry.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveView?.('scanner')}
                    type="button"
                    className="px-4 h-9 bg-[#00d9ff] text-[#09090b] font-mono text-xs font-bold uppercase rounded-none cursor-pointer hover:bg-[#3be3ff] transition-all"
                  >
                    Launch Vision Scanner
                  </button>
                  <button
                    onClick={() => setActiveView?.('macros')}
                    type="button"
                    className="px-4 h-9 bg-slate-900 border border-slate-700 hover:border-[#00d9ff] text-slate-200 font-mono text-xs font-bold uppercase rounded-none cursor-pointer"
                  >
                    Manual Entry
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMeals.map((meal) => {
                  const mTime = meal.timestamp
                    ? new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Today'
                  return (
                    <div
                      key={meal.id}
                      className="p-4 bg-slate-950/70 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-none hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{meal.name}</span>
                          {meal.source === 'computer_vision' && (
                            <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] uppercase">
                              AI Vision
                            </span>
                          )}
                          {meal.category && (
                            <span className="font-mono text-[9px] font-semibold px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400">
                              {meal.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-500">
                          {meal.portion || '1 serving'} · {mTime}
                        </p>
                      </div>

                      <div className="text-left sm:text-right font-mono">
                        <span className="text-sm font-black text-[#00d9ff] block">
                          {meal.calories || 0} kcal
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {(meal.macros?.protein ?? meal.protein ?? 0)}g P · {(meal.macros?.carbs ?? meal.carbs ?? 0)}g C · {(meal.macros?.fat ?? meal.fat ?? 0)}g F
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 1-Column Span: Training Telemetry Card */}
          <div className="p-8 bg-[#0f0f1a] border border-slate-800 rounded-none space-y-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                  Neuromuscular Workload
                </span>
                <div className="w-9 h-9 border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Activity size={18} />
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {(activeVolume || 14850).toLocaleString()}{' '}
                  <span className="text-base font-mono font-normal text-slate-400">kg</span>
                </div>
                <p className="text-xs font-mono text-purple-400 mt-1">
                  +14.2% progressive overload vs. cycle mean
                </p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800/80 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>CNS Readiness</span>
                  <span className="text-emerald-400 font-bold">94% (Prime)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Consistency Streak</span>
                  <span className="text-[#00d9ff] font-bold">34 Days</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Heart Rate HRV</span>
                  <span className="text-white font-bold">78ms Baseline</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveView?.('logger')}
              type="button"
              className="w-full h-11 flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-[#00d9ff] text-slate-200 font-mono font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer transition-colors"
            >
              <span>Launch Session Logger</span>
              <ChevronRight size={14} />
            </button>
          </div>

        </div>
      </section>

    </div>
  )
}
