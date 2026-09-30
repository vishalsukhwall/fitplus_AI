import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Utensils, Calculator, Flame, Scale, Plus,
  Trash2, Sparkles, CheckCircle2, RotateCcw, Droplets,
  HeartPulse, Activity, ChevronRight, Apple, Check,
  Sliders, Calendar, Coffee, Sun, Moon, Cookie
} from 'lucide-react'
import { useNutrition } from '../hooks/useNutrition'
import MealLogger from './Meals/MealLogger'


export default function MacroTracker() {
  const { state } = useNutrition()
  const { dailyTotal } = state.mealLog

  // Biometric Target Parameters
  const [weight, setWeight] = useState('78')
  const [height, setHeight] = useState('180')
  const [age, setAge] = useState('27')
  const [gender, setGender] = useState('male')
  const [activity, setActivity] = useState('1.55') // 1.2 to 1.9
  const [goalOffset, setGoalOffset] = useState('lean_bulk') // 'cut', 'maintenance', 'lean_bulk'

  // Hydration state
  const [waterLoggedMl, setWaterLoggedMl] = useState(2750)

  // Interactive Daily Food Intake Log State
  const [loggedMeals, setLoggedMeals] = useState([
    {
      id: '1',
      name: 'Oatmeal with Peanut Butter & Banana',
      portion: '1 bowl (320g)',
      category: 'Breakfast',
      cal: 480,
      p: 18,
      c: 68,
      f: 16,
      completed: true,
      time: '08:30 AM',
    },
    {
      id: '2',
      name: 'Grilled Chicken Breast & Jasmine Rice',
      portion: '200g chicken + 180g rice',
      category: 'Lunch',
      cal: 590,
      p: 54,
      c: 66,
      f: 7,
      completed: true,
      time: '01:15 PM',
    },
    {
      id: '3',
      name: 'Whey Protein Isolate Shake',
      portion: '1 scoop (35g)',
      category: 'Snacks',
      cal: 135,
      p: 30,
      c: 2,
      f: 1,
      completed: true,
      time: '04:45 PM',
    },
  ])

  // New Food Item Input Form State
  const [foodName, setFoodName] = useState('')
  const [foodPortion, setFoodPortion] = useState('')
  const [foodCategory, setFoodCategory] = useState('Lunch')
  const [foodCal, setFoodCal] = useState('')
  const [foodP, setFoodP] = useState('')
  const [foodC, setFoodC] = useState('')
  const [foodF, setFoodF] = useState('')

  // Filter category for log
  const [filterCategory, setFilterCategory] = useState('All')

  // Real-Time Scientific Calculations
  const calculations = useMemo(() => {
    const w = parseFloat(weight) || 75
    const h = parseFloat(height) || 175
    const a = parseFloat(age) || 25
    const act = parseFloat(activity) || 1.55

    // 1. BMI Calculation
    const heightInMeters = h / 100
    const bmi = (w / (heightInMeters * heightInMeters)).toFixed(1)
    let bmiCategory = 'Normal Weight'
    let bmiColor = '#34d399'

    if (bmi < 18.5) {
      bmiCategory = 'Underweight'
      bmiColor = '#38bdf8'
    } else if (bmi >= 25 && bmi < 29.9) {
      bmiCategory = 'Athletic / Overweight'
      bmiColor = '#fbbf24'
    } else if (bmi >= 30) {
      bmiCategory = 'High Adiposity'
      bmiColor = '#f87171'
    }

    // 2. BMR (Mifflin-St Jeor)
    let bmr = (10 * w) + (6.25 * h) - (5 * a)
    bmr = gender === 'male' ? bmr + 5 : bmr - 161
    bmr = Math.round(bmr)

    // 3. TDEE
    const tdee = Math.round(bmr * act)

    // 4. Target Calories based on Goal
    let targetCal = tdee
    if (goalOffset === 'aggressive_cut') targetCal = Math.round(tdee - 500)
    else if (goalOffset === 'cut')       targetCal = Math.round(tdee - 300)
    else if (goalOffset === 'lean_bulk') targetCal = Math.round(tdee + 250)
    else if (goalOffset === 'bulk')      targetCal = Math.round(tdee + 500)

    // 5. Target Macros
    const proteinGrams = Math.round(w * 2.2)
    const proteinKcal = proteinGrams * 4

    const fatKcal = Math.round(targetCal * 0.25)
    const fatGrams = Math.round(fatKcal / 9)

    const carbKcal = Math.max(targetCal - proteinKcal - fatKcal, 0)
    const carbGrams = Math.round(carbKcal / 4)

    const waterTargetL = (w * 0.045).toFixed(1)

    return {
      bmi,
      bmiCategory,
      bmiColor,
      bmr,
      tdee,
      targetCal,
      proteinGrams,
      carbGrams,
      fatGrams,
      waterTargetL,
    }
  }, [weight, height, age, gender, activity, goalOffset])

  // Aggregate Logged Totals from unified nutrition state
  const loggedTotals = {
    cal: Math.round(dailyTotal.calories || 0),
    p: Math.round(dailyTotal.protein || 0),
    c: Math.round(dailyTotal.carbs || 0),
    f: Math.round(dailyTotal.fat || 0),
  }

  return (
    <div className="space-y-8">

      {/* Top Banner: Real-Time Macro Telemetry Summary */}
      <div className="p-6 sm:p-8 rounded-none bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-[rgba(0,217,255,0.2)] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d9ff]/10 rounded-none blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#00d9ff]/15 border border-[rgba(0,217,255,0.2)] text-[#00d9ff] text-xs font-bold mb-3">
              <Scale size={13} />
              <span>Biometric Macro Calibration Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Calorie & Macronutrient Architecture
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Log your meals in real time. Track grams of protein, carbohydrates, and healthy fats against your Mifflin-St Jeor TDEE targets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Caloric Delta Counter */}
            <div className="p-4 rounded-none bg-[var(--bg-dark)]/80 border border-slate-800 text-right">
              <span className="text-[10.5px] font-extrabold text-slate-400 uppercase block">Daily Target</span>
              <span className="text-xl sm:text-2xl font-black text-[#00d9ff]">
                {calculations.targetCal.toLocaleString()}{' '}
                <span className="text-xs text-slate-500">kcal</span>
              </span>
            </div>

            <div className="p-4 rounded-none bg-[var(--bg-dark)]/80 border border-slate-800 text-right">
              <span className="text-[10.5px] font-extrabold text-slate-400 uppercase block">Remaining</span>
              <span className={`text-xl sm:text-2xl font-black ${calculations.targetCal - loggedTotals.cal >= 0 ? 'text-[#33e4ff]' : 'text-amber-400'}`}>
                {calculations.targetCal - loggedTotals.cal}{' '}
                <span className="text-xs text-slate-500">kcal</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Live Macro Progress Cards with Progress Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Calories Consumed',
            cur: loggedTotals.cal,
            tar: calculations.targetCal,
            unit: 'kcal',
            color: '#10b981',
            icon: Flame,
            sub: `${Math.max(calculations.targetCal - loggedTotals.cal, 0)} kcal left`,
          },
          {
            title: 'Protein (2.2g/kg)',
            cur: loggedTotals.p,
            tar: calculations.proteinGrams,
            unit: 'g',
            color: '#34d399',
            icon: Scale,
            sub: `${Math.max(calculations.proteinGrams - loggedTotals.p, 0)}g to anabolic goal`,
          },
          {
            title: 'Carbohydrates',
            cur: loggedTotals.c,
            tar: calculations.carbGrams,
            unit: 'g',
            color: '#14b8a6',
            icon: Utensils,
            sub: 'Glycogen energy reserve',
          },
          {
            title: 'Healthy Dietary Fats',
            cur: loggedTotals.f,
            tar: calculations.fatGrams,
            unit: 'g',
            color: '#f59e0b',
            icon: Droplets,
            sub: 'Hormonal baseline intake',
          },
        ].map(m => {
          const pct = Math.min(Math.round((m.cur / m.tar) * 100), 100) || 0
          const Icon = m.icon
          return (
            <motion.div
              key={m.title}
              whileHover={{ y: -2 }}
              className="p-5 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{m.title}</span>
                <div
                  className="p-2 rounded-none"
                  style={{ backgroundColor: `${m.color}15`, color: m.color }}
                >
                  <Icon size={16} />
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {m.cur}{' '}
                  <span className="text-xs font-semibold text-slate-500">
                    / {m.tar} {m.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold mt-1" style={{ color: m.color }}>
                  <span>{pct}% Fulfilled</span>
                  <span className="text-slate-500 text-[10px]">{m.sub}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-none bg-[var(--bg-dark)] overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: m.color }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main 2-Column Split: Daily Intake Food Logger (Core) vs Biometric Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT 7 COLUMNS: Interactive Meal Logger Component */}
        <div className="lg:col-span-7">
          <MealLogger />
        </div>

        {/* RIGHT 5 COLUMNS: Biometric Target Calculator & Hydration */}
        <div className="lg:col-span-5 space-y-6">

          {/* Biometric Calculator Settings */}
          <div className="p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-none bg-[rgba(0,217,255,0.06)] border border-[#00d9ff]/30 text-[#00d9ff]">
                <Calculator size={17} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Biometric Target Calibration
                </h3>
                <p className="text-xs text-slate-400">
                  Recalculates BMI, BMR, and macronutrient ratios
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Weight & Height */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full py-2 px-3 rounded-none bg-[var(--bg-dark)] border border-slate-800 font-bold text-white outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full py-2 px-3 rounded-none bg-[var(--bg-dark)] border border-slate-800 font-bold text-white outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Age & Sex */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Age (yrs)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full py-2 px-3 rounded-none bg-[var(--bg-dark)] border border-slate-800 font-bold text-white outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Biological Sex
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {['male', 'female'].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`
                          py-2 font-bold capitalize rounded-none border text-center transition-all cursor-pointer
                          ${gender === g
                            ? 'bg-[rgba(0,217,255,0.08)] border-[#00d9ff] text-[#33e4ff]'
                            : 'bg-[var(--bg-dark)]/60 border-slate-800 text-slate-400'
                          }
                        `}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Multiplier */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Activity Level Multiplier
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full py-2 px-2.5 rounded-none bg-[var(--bg-dark)] border border-slate-800 font-semibold text-slate-300 outline-none focus:border-teal-400"
                >
                  <option value="1.2">Sedentary (Desk Job)</option>
                  <option value="1.375">Lightly Active (1–3 training days)</option>
                  <option value="1.55">Moderately Active (3–5 training days)</option>
                  <option value="1.725">Very Active (6–7 heavy days)</option>
                  <option value="1.9">Elite Competitive Athlete (2x / day)</option>
                </select>
              </div>

              {/* Goal Offset */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Caloric Phase
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'cut', label: 'Cut (-300)' },
                    { id: 'maintenance', label: 'Maintenance' },
                    { id: 'lean_bulk', label: 'Lean Bulk (+250)' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGoalOffset(item.id)}
                      className={`
                        py-1.5 px-1 rounded-none border font-bold text-center transition-all cursor-pointer
                        ${goalOffset === item.id
                          ? 'bg-[#00d9ff]/20 border-[#00d9ff] text-[#33e4ff]'
                          : 'bg-[var(--bg-dark)] border-slate-800 text-slate-400'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Metrics Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center border-t border-slate-800/80">
              <div className="p-2.5 rounded-none bg-[var(--bg-dark)] border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">BMI</span>
                <span className="text-base font-black text-white">{calculations.bmi}</span>
                <span className="text-[9px] font-bold block" style={{ color: calculations.bmiColor }}>
                  {calculations.bmiCategory}
                </span>
              </div>

              <div className="p-2.5 rounded-none bg-[var(--bg-dark)] border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">BMR</span>
                <span className="text-base font-black text-white">{calculations.bmr}</span>
                <span className="text-[9px] text-slate-500 block">kcal</span>
              </div>

              <div className="p-2.5 rounded-none bg-[var(--bg-dark)] border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">TDEE</span>
                <span className="text-base font-black text-[#00d9ff]">{calculations.tdee}</span>
                <span className="text-[9px] text-slate-500 block">kcal</span>
              </div>
            </div>
          </div>

          {/* Hydration Widget */}
          <div className="p-5 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-cyan-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs">
                <Droplets size={16} />
                <span>Hydration & Electrolytes</span>
              </div>
              <span className="text-xs font-black text-white">
                {waterLoggedMl} / {Math.round(parseFloat(calculations.waterTargetL) * 1000)} ml
              </span>
            </div>

            <div className="w-full h-2.5 rounded-none bg-[var(--bg-dark)] overflow-hidden border border-slate-800">
              <div
                className="h-full bg-cyan-400 rounded-none transition-all duration-300"
                style={{ width: `${Math.min((waterLoggedMl / (parseFloat(calculations.waterTargetL) * 1000)) * 100, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Target: {calculations.waterTargetL} L / day</span>
              <button
                onClick={() => setWaterLoggedMl(w => Math.min(w + 250, 6000))}
                className="px-3 py-1 rounded-none bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-colors cursor-pointer"
              >
                + Log 250ml
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
