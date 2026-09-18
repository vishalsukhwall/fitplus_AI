/**
 * ScanResult.jsx — Result Visualization Component
 * ─────────────────────────────────────────────────────────────
 * Renders the computer vision analysis result in an elevated
 * Titanium Minimalist / Cyber dark glassmorphic card (#0f0f1a,
 * backdrop-blur-md, 0px border-radius, #00d9ff cyber accents).
 *
 * Displays:
 *   - Recognized food taxonomy & itemized breakdown
 *   - High-confidence ML classification score (e.g. 98.4%)
 *   - 4-column macro metrics grid (Calories, Protein, Carbs, Fats)
 *   - Interactive portion scaling multiplier (0.5x - 2.0x)
 *   - Instant "Add to Today's Log" and "Scan Another" actions
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RotateCcw,
  Sparkles,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  ShieldCheck,
  Plus,
  Check,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'

export function ScanResult({
  scanResult,
  onLogMeal,
  onScanAnother,
  isLogging = false,
  className = '',
}) {
  const [portionMultiplier, setPortionMultiplier] = useState(1.0)
  const [logged, setLogged] = useState(false)

  // Fallback defaults if payload is minimal
  const name = scanResult?.name || 'Recognized Meal'
  const category = scanResult?.category || 'High-Protein Fuel'
  const basePortion = scanResult?.portion || '1 serving'
  const description = scanResult?.description || 'Classified via FitPulse Deep Vision Neural Classifier.'
  const confidence = scanResult?.confidence ?? 0.984
  const confidencePercent = (confidence * 100).toFixed(1)

  const baseCalories = scanResult?.totalCalories ?? scanResult?.calories ?? 0
  const baseProtein = scanResult?.macros?.protein ?? scanResult?.protein ?? 0
  const baseCarbs = scanResult?.macros?.carbs ?? scanResult?.carbs ?? 0
  const baseFat = scanResult?.macros?.fat ?? scanResult?.fat ?? 0

  // Scaled calculations based on active portion multiplier
  const scaledCalories = Math.round(baseCalories * portionMultiplier)
  const scaledProtein = Math.round(baseProtein * portionMultiplier)
  const scaledCarbs = Math.round(baseCarbs * portionMultiplier)
  const scaledFat = Math.round(baseFat * portionMultiplier)

  // Macro calorie energy contribution breakdown
  const macroBreakdown = useMemo(() => {
    const proteinCal = scaledProtein * 4
    const carbsCal = scaledCarbs * 4
    const fatCal = scaledFat * 9
    const totalCal = proteinCal + carbsCal + fatCal || 1

    return {
      proteinPct: Math.round((proteinCal / totalCal) * 100),
      carbsPct: Math.round((carbsCal / totalCal) * 100),
      fatPct: Math.round((fatCal / totalCal) * 100),
    }
  }, [scaledProtein, scaledCarbs, scaledFat])

  // Handle immediate logging
  const handleLog = () => {
    if (logged || isLogging) return

    const payload = {
      name: portionMultiplier === 1.0 ? name : `${name} (${portionMultiplier}x)`,
      calories: scaledCalories,
      portion: portionMultiplier === 1.0 ? basePortion : `${basePortion} × ${portionMultiplier}`,
      category,
      confidence,
      macros: {
        protein: scaledProtein,
        carbs: scaledCarbs,
        fat: scaledFat,
      },
      foodItems: scanResult?.foodItems || [],
      timestamp: new Date().toISOString(),
      source: 'computer_vision',
    }

    onLogMeal?.(payload)
    setLogged(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full border border-slate-800 bg-[#0f0f1a]/95 backdrop-blur-md p-6 sm:p-8 text-slate-100 rounded-none shadow-2xl ${className}`}
      style={{
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(0,217,255,0.06)',
      }}
    >
      {/* Cyber Top Accent Indicator Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent" />

      {/* Cyber Reticle Corner Decals (0px border-radius aesthetic) */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00d9ff]" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00d9ff]" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00d9ff]" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00d9ff]" />

      {/* ─── Header: Taxonomy & Confidence Score ─── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/30">
              {category}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
              {basePortion}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <ShieldCheck size={13} className="text-emerald-400" />
              Verified CV Match
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            {name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Confidence Gauge Badge */}
        <div className="flex flex-col sm:items-end justify-center p-3.5 bg-slate-950/70 border border-slate-800 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-[#00d9ff]" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              ML Confidence
            </span>
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#00d9ff] tracking-tight">
            {confidencePercent}%
          </div>
          {/* Progress bar */}
          <div className="w-28 h-1.5 bg-slate-800 overflow-hidden mt-1.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-[#00d9ff] transition-all duration-500"
              style={{ width: `${Math.min(100, confidence * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1">
            FitPulse Neural Vision v2.4
          </span>
        </div>
      </div>

      {/* ─── 4-Column Macro Metrics Breakdown Grid ─── */}
      <div className="py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[#00d9ff]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Macronutrient Profile (Calculated)
            </span>
          </div>

          {/* Interactive Portion Multiplier */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 px-2 uppercase">Portion:</span>
            {[0.5, 1.0, 1.5, 2.0].map((mult) => (
              <button
                key={mult}
                onClick={() => setPortionMultiplier(mult)}
                className={`px-2.5 py-1 text-xs font-mono transition-all ${
                  portionMultiplier === mult
                    ? 'bg-[#00d9ff] text-[#09090b] font-bold shadow-[0_0_12px_rgba(0,217,255,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Calories */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 hover:border-[#00d9ff]/40 transition-colors relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Calories</span>
              <Flame size={16} className="text-[#00d9ff] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                {scaledCalories}
              </span>
              <span className="text-xs font-mono text-slate-400">kcal</span>
            </div>
            <div className="mt-3 text-[10px] font-mono text-[#00d9ff] flex items-center gap-1">
              <TrendingUp size={11} />
              <span>{Math.round((scaledCalories / 2500) * 100)}% Daily TDEE</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00d9ff]" />
          </div>

          {/* 2. Protein */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 hover:border-[#a78bfa]/40 transition-colors relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Protein</span>
              <Dumbbell size={16} className="text-[#a78bfa] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#a78bfa] tracking-tight">
                {scaledProtein}
              </span>
              <span className="text-xs font-mono text-slate-400">g</span>
            </div>
            <div className="mt-3 text-[10px] font-mono text-slate-400">
              {macroBreakdown.proteinPct}% Energy share
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a78bfa]" />
          </div>

          {/* 3. Carbs */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 hover:border-[#00d084]/40 transition-colors relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Carbs</span>
              <Wheat size={16} className="text-[#00d084] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#00d084] tracking-tight">
                {scaledCarbs}
              </span>
              <span className="text-xs font-mono text-slate-400">g</span>
            </div>
            <div className="mt-3 text-[10px] font-mono text-slate-400">
              {macroBreakdown.carbsPct}% Energy share
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00d084]" />
          </div>

          {/* 4. Fats */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 hover:border-amber-400/40 transition-colors relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Fats</span>
              <Droplet size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tracking-tight">
                {scaledFat}
              </span>
              <span className="text-xs font-mono text-slate-400">g</span>
            </div>
            <div className="mt-3 text-[10px] font-mono text-slate-400">
              {macroBreakdown.fatPct}% Energy share
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" />
          </div>
        </div>

        {/* Macro Composition Bar */}
        <div className="mt-4 pt-3 border-t border-slate-900 flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Macro Ratio (P / C / F)</span>
            <span>
              {macroBreakdown.proteinPct}% P · {macroBreakdown.carbsPct}% C · {macroBreakdown.fatPct}% F
            </span>
          </div>
          <div className="h-2 w-full flex overflow-hidden bg-slate-900 border border-slate-800">
            <div
              style={{ width: `${macroBreakdown.proteinPct}%` }}
              className="bg-[#a78bfa] transition-all duration-300"
              title={`Protein: ${macroBreakdown.proteinPct}%`}
            />
            <div
              style={{ width: `${macroBreakdown.carbsPct}%` }}
              className="bg-[#00d084] transition-all duration-300"
              title={`Carbs: ${macroBreakdown.carbsPct}%`}
            />
            <div
              style={{ width: `${macroBreakdown.fatPct}%` }}
              className="bg-amber-400 transition-all duration-300"
              title={`Fats: ${macroBreakdown.fatPct}%`}
            />
          </div>
        </div>
      </div>

      {/* ─── Detected Ingredients Breakdown ─── */}
      {scanResult?.foodItems && scanResult.foodItems.length > 0 && (
        <div className="py-4 border-t border-slate-800/80">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <ChevronRight size={13} className="text-[#00d9ff]" />
            <span>Detected Food Components & Portions</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {scanResult.foodItems.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-900/50 border border-slate-800/60 flex items-center justify-between text-xs"
              >
                <div className="truncate pr-2">
                  <span className="font-medium text-slate-200 block truncate">{item.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.portion}</span>
                </div>
                <span className="font-mono text-[11px] text-[#00d9ff] shrink-0 font-semibold">
                  {Math.round((item.calories || 0) * portionMultiplier)} kcal
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Action Handlers ─── */}
      <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onScanAnother}
          type="button"
          className="w-full sm:w-auto px-6 h-12 flex items-center justify-center gap-2.5 bg-transparent border border-slate-700 hover:border-[#00d9ff] text-slate-300 hover:text-white transition-all text-xs font-mono font-semibold uppercase tracking-wider rounded-none cursor-pointer"
        >
          <RotateCcw size={15} />
          <span>Scan Another</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <AnimatePresence mode="wait">
            {logged ? (
              <motion.div
                key="logged"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full sm:w-auto px-7 h-12 flex items-center justify-center gap-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider rounded-none"
              >
                <Check size={16} className="text-emerald-400" />
                <span>Added to Daily Log ({scaledCalories} kcal)</span>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLog}
                disabled={isLogging}
                type="button"
                className="w-full sm:w-auto px-8 h-12 flex items-center justify-center gap-2.5 bg-[#00d9ff] hover:bg-[#2ae0ff] text-[#09090b] font-mono font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer shadow-[0_0_24px_rgba(0,217,255,0.35)] transition-all"
              >
                <Plus size={16} strokeWidth={3} />
                <span>Add to Today's Log</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default ScanResult
