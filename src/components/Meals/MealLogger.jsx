/**
 * MealLogger.jsx — Intelligent Manual Macro & Calorie Calculator & History
 * Design: Titanium Minimalist / Deep Space Cyber
 * ─────────────────────────────────────────────────────────────────────────────
 * Deliverable:
 *   - Smart Food Parsing & Estimation Engine: Built-in lookup dictionary + algorithmic
 *     fallback based on caloric density. Parses food name and serving size (e.g., "100g",
 *     "2 cups", "1.5 scoop", "2 pieces").
 *   - Live Calculated Preview Card: Displays estimated calories, protein, carbs, and fats
 *     with visual ratio bar before logging.
 *   - Manual Override: User can tweak any macro field with instant feedback and reset capability.
 *   - State & LocalStorage: Integrates with useNutrition, updates daily totals vs TDEE,
 *     and broadcasts fitpulse_nutrition_update.
 *   - Zero Blank Screens: Dashed-border empty states and 1-click presets.
 */

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Utensils, Scale, Flame,
  CheckCircle2, Clock, Sparkles, Droplets,
  ScanLine, AlertCircle, RefreshCw, Layers,
  Cpu, Zap, Sliders, Check, ArrowRight
} from 'lucide-react'
import { useNutrition } from '../../hooks/useNutrition'
import {
  estimateMacros,
  parseQuantity,
  FOOD_DATABASE,
} from '../../utils/foodCalculator'

// 1-Click Common Athlete Presets for quick manual logging
const ATHLETE_PRESETS = [
  {
    name: 'Grilled Chicken & Jasmine Rice',
    portion: '200g chicken + 180g rice',
    category: 'Lunch',
    calories: 590,
    protein: 54,
    carbs: 66,
    fat: 7,
  },
  {
    name: 'Oatmeal, Peanut Butter & Banana',
    portion: '1 bowl (320g)',
    category: 'Breakfast',
    calories: 480,
    protein: 18,
    carbs: 68,
    fat: 16,
  },
  {
    name: 'Whey Protein Isolate Shake',
    portion: '1 scoop (35g with water)',
    category: 'Snacks',
    calories: 135,
    protein: 30,
    carbs: 2,
    fat: 1,
  },
  {
    name: 'Wild Salmon & Sweet Potato',
    portion: '220g salmon + roasted sweet potato',
    category: 'Dinner',
    calories: 640,
    protein: 48,
    carbs: 52,
    fat: 22,
  },
  {
    name: 'Greek Yogurt Berry Parfait',
    portion: '250g bowl + honey',
    category: 'Breakfast',
    calories: 240,
    protein: 26,
    carbs: 30,
    fat: 1,
  },
  {
    name: '4 Whole Eggs & Artisan Sourdough',
    portion: '4 eggs + 2 slices',
    category: 'Breakfast',
    calories: 510,
    protein: 34,
    carbs: 38,
    fat: 24,
  },
]

// Common Athlete Staple Foods for 1-click chip input
const POPULAR_FOOD_CHIPS = [
  'Oats',
  'Chicken Breast',
  'Brown Rice',
  'Banana',
  'Paneer',
  'Whey Protein',
  'Atlantic Salmon',
  'Whole Eggs',
]

// Quick Portions for 1-click chip input
const QUICK_PORTIONS = [
  '100g',
  '200g',
  '1 cup',
  '1.5 scoop',
  '2 pieces',
  '1 serving',
]

export default function MealLogger({ onLaunchScanner, className = '' }) {
  const { state, actions } = useNutrition()
  const { meals, dailyTotal, tdee = 2500 } = state.mealLog

  // Form Inputs State
  const [foodName, setFoodName] = useState('')
  const [foodPortion, setFoodPortion] = useState('')
  const [foodCategory, setFoodCategory] = useState('Lunch')
  const [foodCalories, setFoodCalories] = useState('')
  const [foodProtein, setFoodProtein] = useState('')
  const [foodCarbs, setFoodCarbs] = useState('')
  const [foodFat, setFoodFat] = useState('')
  const [isMacroOverridden, setIsMacroOverridden] = useState(false)
  const [formError, setFormError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  // Live Auto-Calculation Engine
  const estimatedResult = useMemo(() => {
    if (!foodName.trim()) return null
    return estimateMacros(foodName, foodPortion)
  }, [foodName, foodPortion])

  // Reset override flag if foodName is completely cleared
  useEffect(() => {
    if (!foodName.trim()) {
      setIsMacroOverridden(false)
    }
  }, [foodName])

  // Active values taking into account manual overrides vs auto-calculated estimates
  const effectiveCalories = useMemo(() => {
    if (foodCalories !== '') {
      const parsed = parseInt(foodCalories, 10)
      return isNaN(parsed) ? 0 : parsed
    }
    return estimatedResult ? estimatedResult.calories : 0
  }, [foodCalories, estimatedResult])

  const effectiveProtein = useMemo(() => {
    if (foodProtein !== '') {
      const parsed = parseFloat(foodProtein)
      return isNaN(parsed) ? 0 : parsed
    }
    return estimatedResult ? estimatedResult.protein : 0
  }, [foodProtein, estimatedResult])

  const effectiveCarbs = useMemo(() => {
    if (foodCarbs !== '') {
      const parsed = parseFloat(foodCarbs)
      return isNaN(parsed) ? 0 : parsed
    }
    return estimatedResult ? estimatedResult.carbs : 0
  }, [foodCarbs, estimatedResult])

  const effectiveFat = useMemo(() => {
    if (foodFat !== '') {
      const parsed = parseFloat(foodFat)
      return isNaN(parsed) ? 0 : parsed
    }
    return estimatedResult ? estimatedResult.fat : 0
  }, [foodFat, estimatedResult])

  // Macro Energy Percentages for Live Preview Ratio Bar
  const macroRatios = useMemo(() => {
    const pCals = effectiveProtein * 4
    const cCals = effectiveCarbs * 4
    const fCals = effectiveFat * 9
    const total = pCals + cCals + fCals
    if (total <= 0) return { p: 0, c: 0, f: 0 }
    return {
      p: Math.round((pCals / total) * 100),
      c: Math.round((cCals / total) * 100),
      f: Math.round((fCals / total) * 100),
    }
  }, [effectiveProtein, effectiveCarbs, effectiveFat])

  // Populate manual inputs with estimated values for fine-tuning
  const handlePopulateManualInputs = () => {
    if (!estimatedResult) return
    setFoodCalories(String(estimatedResult.calories))
    setFoodProtein(String(estimatedResult.protein))
    setFoodCarbs(String(estimatedResult.carbs))
    setFoodFat(String(estimatedResult.fat))
    setIsMacroOverridden(true)
  }

  // Reset manual overrides to rely on auto-estimation
  const handleResetToAuto = () => {
    setFoodCalories('')
    setFoodProtein('')
    setFoodCarbs('')
    setFoodFat('')
    setIsMacroOverridden(false)
  }

  // Handle manual / smart calculated meal form submission
  const handleSubmitMeal = (e) => {
    e.preventDefault()
    setFormError(null)

    if (!foodName.trim()) {
      setFormError('Food name or description is required.')
      return
    }

    const cals = effectiveCalories
    if (isNaN(cals) || cals < 0) {
      setFormError('Please provide a valid calorie value (0 or greater).')
      return
    }

    if (cals === 0 && !foodCalories && !estimatedResult) {
      setFormError('Please enter a calorie value or recognized food item.')
      return
    }

    const p = Math.round(effectiveProtein)
    const c = Math.round(effectiveCarbs)
    const f = Math.round(effectiveFat)

    const portionLabel = foodPortion.trim()
      ? foodPortion.trim()
      : estimatedResult
        ? `${estimatedResult.parsedQuantity.amount} ${estimatedResult.parsedQuantity.unit}`
        : '1 serving'

    const newMeal = {
      id: `meal-smart-${Date.now()}`,
      name: foodName.trim(),
      portion: portionLabel,
      category: foodCategory,
      calories: cals,
      macros: { protein: p, carbs: c, fat: f },
      timestamp: new Date().toISOString(),
      source: isMacroOverridden
        ? 'manual'
        : estimatedResult?.matched
          ? 'smart_calc'
          : 'manual',
    }

    actions.logMeal(newMeal)

    // Reset Form
    setFoodName('')
    setFoodPortion('')
    setFoodCalories('')
    setFoodProtein('')
    setFoodCarbs('')
    setFoodFat('')
    setIsMacroOverridden(false)
  }

  // Handle Quick Preset Click
  const handleQuickPreset = (preset) => {
    const newMeal = {
      id: `meal-pre-${Date.now()}`,
      name: preset.name,
      portion: preset.portion,
      category: preset.category,
      calories: preset.calories,
      macros: {
        protein: preset.protein,
        carbs: preset.carbs,
        fat: preset.fat,
      },
      timestamp: new Date().toISOString(),
      source: 'manual',
    }
    actions.logMeal(newMeal)
  }

  // Filtered Meals Feed
  const filteredMeals = useMemo(() => {
    if (activeFilter === 'All') return [...meals].reverse()
    return [...meals].filter(m => m.category === activeFilter).reverse()
  }, [meals, activeFilter])

  return (
    <div className={`space-y-12 ${className}`}>

      {/* ─── MODULE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#00d9ff] font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Utensils size={14} />
            <span>Interactive Nutrition Subsystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Meal Logger & Chronological History
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Type any food & portion for instant macro calculation, or manually fine-tune your intake.
          </p>
        </div>

        {onLaunchScanner && (
          <button
            onClick={onLaunchScanner}
            type="button"
            className="self-start sm:self-auto px-4 h-11 flex items-center gap-2 bg-[#00d9ff] hover:bg-[#3be3ff] text-[#09090b] font-mono font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer shadow-[0_0_20px_rgba(0,217,255,0.25)] transition-all"
          >
            <ScanLine size={15} />
            <span>Switch to Camera Scanner</span>
          </button>
        )}
      </div>

      {/* ─── 2-COLUMN SPLIT: SMART MANUAL CALCULATOR + LOGGED FEED ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT COLUMN (5 cols): SMART MANUAL CALCULATOR & LOG FORM ── */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#0f0f1a] border border-slate-800 rounded-none shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-[#00d9ff]/30 bg-[#00d9ff]/10 flex items-center justify-center text-[#00d9ff]">
                <Cpu size={18} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight font-mono uppercase">
                  Manual Log Entry
                </h3>
                <p className="text-xs text-slate-400">
                  Smart parsing & auto-calculated macro estimator
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] uppercase">
              Auto-Calc v2.4
            </span>
          </div>

          <form onSubmit={handleSubmitMeal} className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-950/30 border border-red-500/40 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Food Name with Autocomplete Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Food Name / Description *
                </label>
                {estimatedResult && (
                  <span className="text-[10px] font-mono text-[#00d9ff] flex items-center gap-1">
                    <Zap size={10} />
                    <span>Live Parsed</span>
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Flame-Grilled Ribeye Steak"
                className="w-full py-2.5 px-3.5 bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-[#00d9ff] transition-colors rounded-none"
              />

              {/* Quick Athlete Staple Chips */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-500">Staples:</span>
                {POPULAR_FOOD_CHIPS.map((food) => (
                  <button
                    key={food}
                    type="button"
                    onClick={() => {
                      setFoodName(food)
                      if (!foodPortion) setFoodPortion('100g')
                    }}
                    className="px-2 py-0.5 bg-slate-900/90 hover:bg-[#00d9ff]/15 border border-slate-800 hover:border-[#00d9ff]/50 text-slate-400 hover:text-[#00d9ff] text-[10px] font-mono transition-colors rounded-none cursor-pointer"
                  >
                    {food}
                  </button>
                ))}
              </div>
            </div>

            {/* Portion & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Portion / Serving Size
                </label>
                <input
                  type="text"
                  value={foodPortion}
                  onChange={(e) => setFoodPortion(e.target.value)}
                  placeholder="e.g. 100g, 2 cups, 1.5 scoop"
                  className="w-full py-2.5 px-3.5 bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 outline-none focus:border-[#00d9ff] transition-colors rounded-none"
                />

                {/* Quick Portions Chips */}
                <div className="mt-1.5 flex flex-wrap items-center gap-1">
                  {QUICK_PORTIONS.map((portion) => (
                    <button
                      key={portion}
                      type="button"
                      onClick={() => setFoodPortion(portion)}
                      className={`px-1.5 py-0.5 text-[9.5px] font-mono border rounded-none cursor-pointer transition-colors ${
                        foodPortion === portion
                          ? 'bg-[#00d9ff]/20 border-[#00d9ff] text-[#00d9ff]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {portion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Meal Category
                </label>
                <select
                  value={foodCategory}
                  onChange={(e) => setFoodCategory(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 outline-none focus:border-[#00d9ff] rounded-none cursor-pointer"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Pre-Workout">Pre-Workout</option>
                  <option value="Post-Workout">Post-Workout</option>
                </select>
                <p className="text-[10px] font-mono text-slate-500 mt-1.5">
                  TDEE target: <span className="text-[#00d9ff] font-bold">{tdee} kcal</span>
                </p>
              </div>
            </div>

            {/* ─── LIVE CALCULATED PREVIEW CARD ─── */}
            <AnimatePresence>
              {estimatedResult && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="p-4 bg-[#0a0a14] border border-[#00d9ff]/30 shadow-[0_0_15px_rgba(0,217,255,0.08)] space-y-3 rounded-none overflow-hidden"
                >
                  {/* Preview Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00d9ff] animate-pulse" />
                      <span className="font-mono text-[11px] font-black uppercase text-[#00d9ff] tracking-wider">
                        Live Calculated Preview
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isMacroOverridden ? (
                        <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 uppercase">
                          Manual Override
                        </span>
                      ) : (
                        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 uppercase border ${
                          estimatedResult.matched
                            ? 'bg-[#00d9ff]/10 border-[#00d9ff]/30 text-[#00d9ff]'
                            : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                        }`}>
                          {estimatedResult.matched
                            ? `DB Match (${(estimatedResult.confidence * 100).toFixed(0)}%)`
                            : 'Algorithmic Density'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Matched Info & Net Weight */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="text-white font-bold truncate max-w-[220px]">
                      {estimatedResult.resolvedName}
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      Basis: <strong className="text-white">{estimatedResult.parsedQuantity.effectiveGrams}g</strong> net weight
                    </span>
                  </div>

                  {/* Live Macro Numbers Bar */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono">
                    <div className="p-2 bg-slate-950/80 border border-slate-800">
                      <span className="block text-[10px] text-slate-400 uppercase">Calories</span>
                      <span className="text-sm font-black text-[#00d9ff]">
                        {effectiveCalories}
                      </span>
                      <span className="text-[9px] text-slate-500 block">kcal</span>
                    </div>

                    <div className="p-2 bg-slate-950/80 border border-slate-800">
                      <span className="block text-[10px] text-slate-400 uppercase">Protein</span>
                      <span className="text-sm font-black text-emerald-400">
                        {effectiveProtein}g
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        {macroRatios.p}% cals
                      </span>
                    </div>

                    <div className="p-2 bg-slate-950/80 border border-slate-800">
                      <span className="block text-[10px] text-slate-400 uppercase">Carbs</span>
                      <span className="text-sm font-black text-cyan-400">
                        {effectiveCarbs}g
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        {macroRatios.c}% cals
                      </span>
                    </div>

                    <div className="p-2 bg-slate-950/80 border border-slate-800">
                      <span className="block text-[10px] text-slate-400 uppercase">Fat</span>
                      <span className="text-sm font-black text-amber-400">
                        {effectiveFat}g
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        {macroRatios.f}% cals
                      </span>
                    </div>
                  </div>

                  {/* Macro Ratio Color Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-slate-900 flex overflow-hidden rounded-none">
                      <div
                        style={{ width: `${macroRatios.p}%` }}
                        className="h-full bg-emerald-400 transition-all duration-300"
                        title={`Protein: ${macroRatios.p}%`}
                      />
                      <div
                        style={{ width: `${macroRatios.c}%` }}
                        className="h-full bg-cyan-400 transition-all duration-300"
                        title={`Carbs: ${macroRatios.c}%`}
                      />
                      <div
                        style={{ width: `${macroRatios.f}%` }}
                        className="h-full bg-amber-400 transition-all duration-300"
                        title={`Fat: ${macroRatios.f}%`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-500">
                      <span className="text-emerald-400">■ Protein {macroRatios.p}%</span>
                      <span className="text-cyan-400">■ Carbs {macroRatios.c}%</span>
                      <span className="text-amber-400">■ Fat {macroRatios.f}%</span>
                    </div>
                  </div>

                  {/* Fine-Tuning Controls */}
                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono">
                    {isMacroOverridden ? (
                      <button
                        type="button"
                        onClick={handleResetToAuto}
                        className="text-[#00d9ff] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={11} />
                        <span>Reset to Auto-Estimate</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePopulateManualInputs}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Sliders size={11} className="text-[#00d9ff]" />
                        <span>Populate Fields for Fine-Tuning</span>
                      </button>
                    )}

                    <span className="text-slate-500 text-[10px]">
                      {isMacroOverridden ? 'Using manual numbers' : 'Using auto calculations'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Macro Adjustment Inputs (Calories, Protein, Carbs, Fats) */}
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={12} className="text-[#00d9ff]" />
                  <span>Precise Macro Adjustments (Optional Override)</span>
                </label>
                {isMacroOverridden && (
                  <span className="text-[10px] font-mono text-amber-400">
                    Overridden
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#00d9ff] mb-1 uppercase">
                    Calories *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={foodCalories}
                    onChange={(e) => {
                      setFoodCalories(e.target.value)
                      setIsMacroOverridden(true)
                    }}
                    placeholder="480"
                    className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-white outline-none focus:border-[#00d9ff] rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-emerald-400 mb-1 uppercase">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={foodProtein}
                    onChange={(e) => {
                      setFoodProtein(e.target.value)
                      setIsMacroOverridden(true)
                    }}
                    placeholder="45"
                    className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-white outline-none focus:border-emerald-400 rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-cyan-400 mb-1 uppercase">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={foodCarbs}
                    onChange={(e) => {
                      setFoodCarbs(e.target.value)
                      setIsMacroOverridden(true)
                    }}
                    placeholder="30"
                    className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-white outline-none focus:border-cyan-400 rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-amber-400 mb-1 uppercase">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={foodFat}
                    onChange={(e) => {
                      setFoodFat(e.target.value)
                      setIsMacroOverridden(true)
                    }}
                    placeholder="12"
                    className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-white outline-none focus:border-amber-400 rounded-none"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full h-12 mt-2 flex items-center justify-center gap-2 bg-[#00d9ff] hover:bg-[#3be3ff] text-[#09090b] font-mono font-extrabold text-xs uppercase tracking-wider rounded-none cursor-pointer shadow-[0_0_20px_rgba(0,217,255,0.25)] transition-all"
            >
              <Plus size={16} />
              <span>Add Meal to Daily Log</span>
              {effectiveCalories > 0 && (
                <span className="ml-1.5 px-2 py-0.5 bg-[#09090b]/25 text-[#09090b] font-black text-[11px]">
                  +{effectiveCalories} kcal
                </span>
              )}
            </motion.button>
          </form>

          {/* 1-Click Fast Presets */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#00d9ff]" />
              <span>1-Click Athlete Presets:</span>
            </span>

            <div className="flex flex-wrap gap-2">
              {ATHLETE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleQuickPreset(preset)}
                  className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-[#00d9ff] text-slate-300 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer rounded-none"
                >
                  <Plus size={12} className="text-[#00d9ff]" />
                  <span>{preset.name}</span>
                  <span className="text-emerald-400 font-bold text-[10px]">+{preset.protein}g P</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (7 cols): CHRONOLOGICAL LOGGED MEALS FEED ── */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-[#0f0f1a] border border-slate-800 rounded-none shadow-xl space-y-6">

          {/* Feed Header with Category Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white uppercase font-mono tracking-tight">
                  Today’s Meal Feed
                </h3>
                <span className="font-mono text-xs text-[#00d9ff] font-bold px-2 py-0.5 bg-[#00d9ff]/10 border border-[#00d9ff]/30">
                  {meals.length} {meals.length === 1 ? 'Entry' : 'Entries'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time chronological timeline of consumed nutrients
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-950 border border-slate-800 text-[11px] font-mono">
              {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`
                    px-2.5 py-1 rounded-none transition-all cursor-pointer
                    ${activeFilter === cat
                      ? 'bg-[#00d9ff] text-[#09090b] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Meals List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredMeals.length === 0 ? (
                /* Empty state */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-10 border-2 border-dashed border-slate-800 bg-slate-950/60 text-center space-y-4 rounded-none"
                >
                  <div className="w-14 h-14 mx-auto border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-500 shadow-inner">
                    <Utensils size={24} />
                  </div>
                  <div className="space-y-1 max-w-sm mx-auto">
                    <h4 className="text-sm font-bold text-white uppercase font-mono">
                      {activeFilter === 'All' ? 'No Meals Logged Yet' : `No Meals in "${activeFilter}"`}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono leading-relaxed">
                      {activeFilter === 'All'
                        ? 'Type a food name & serving on the left for instant auto-calculation, or launch the Food Scanner.'
                        : `Switch back to "All" or add a meal under ${activeFilter} to view entries here.`
                      }
                    </p>
                  </div>
                  {activeFilter !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setActiveFilter('All')}
                      className="text-xs font-mono text-[#00d9ff] underline cursor-pointer"
                    >
                      Reset filter to All
                    </button>
                  )}
                </motion.div>
              ) : (
                filteredMeals.map((meal) => {
                  const mTime = meal.timestamp
                    ? new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Today'
                  const pVal = meal.macros?.protein ?? meal.protein ?? 0
                  const cVal = meal.macros?.carbs ?? meal.carbs ?? 0
                  const fVal = meal.macros?.fat ?? meal.fat ?? 0

                  return (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none transition-all"
                    >
                      {/* Left: Food description and meta */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">{meal.name}</span>
                          {meal.source === 'computer_vision' ? (
                            <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] uppercase">
                              CV Vision
                            </span>
                          ) : meal.source === 'smart_calc' ? (
                            <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff] uppercase flex items-center gap-1">
                              <Zap size={9} />
                              <span>Smart Calc</span>
                            </span>
                          ) : (
                            <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                              Manual
                            </span>
                          )}
                          {meal.category && (
                            <span className="font-mono text-[9.5px] font-semibold px-1.5 py-0.5 bg-slate-900/60 border border-slate-800 text-slate-400">
                              {meal.category}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                          <span>{meal.portion || '1 serving'}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {mTime}
                          </span>
                        </div>
                      </div>

                      {/* Right: Macro breakdown and Delete button */}
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-left sm:text-right font-mono">
                          <span className="text-sm font-black text-[#00d9ff] block">
                            {meal.calories || 0} kcal
                          </span>
                          <span className="text-[11px] text-slate-400">
                            <strong className="text-emerald-400">{pVal}g P</strong> · {cVal}g C · {fVal}g F
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => actions.removeMeal(meal.id)}
                          title="Delete meal from history"
                          aria-label={`Delete ${meal.name}`}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 border border-transparent hover:border-red-500/30 transition-all cursor-pointer rounded-none"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>

          {/* Daily Aggregate Totals Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-slate-400 block">
                Total Consumed: <strong className="text-white font-bold">{dailyTotal.calories} kcal</strong>
                <span className="text-slate-500 ml-2">/ {tdee} kcal TDEE</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">
                  {dailyTotal.calories > tdee
                    ? `+${dailyTotal.calories - tdee} kcal surplus`
                    : `${tdee - dailyTotal.calories} kcal remaining`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold">{dailyTotal.protein}g Protein</span>
              <span className="text-cyan-400 font-bold">{dailyTotal.carbs}g Carbs</span>
              <span className="text-amber-400 font-bold">{dailyTotal.fat}g Fats</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
