import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Dumbbell, Flame, Utensils, Zap,
  CheckCircle2, Copy, Check, RotateCcw, ArrowRight,
  TrendingUp, Activity, ShieldCheck, Clock, Sliders
} from 'lucide-react'

const PRESET_PROTOCOLS = {
  hypertrophy: {
    title: 'Hypertrophy & Myofibrillar Density Protocol',
    focus: 'Lean Muscle Accumulation · 4-Day Upper/Lower Split',
    calories: 2750,
    protein: 195,
    carbs: 310,
    fats: 70,
    hydration: 3.8,
    frequency: '4 Days / Week',
    volumeWeekly: '16 Working Sets / Muscle Group',
    cardio: '15 min Zone 2 Incline Walk post-lift',
    schedule: [
      {
        day: 'Day 1 · Upper Heavy Press & Pull',
        exercises: [
          { name: 'Barbell Incline Bench Press', sets: '4 sets × 8 reps', rpe: 'RPE 8.5', rest: '120s', cue: 'Controlled 3s eccentric, pause 1s on chest' },
          { name: 'Chest-Supported T-Bar Row', sets: '4 sets × 10 reps', rpe: 'RPE 8.0', rest: '90s', cue: 'Drive elbows back, full lat squeeze at top' },
          { name: 'Standing DB Overhead Press', sets: '3 sets × 8 reps', rpe: 'RPE 8.0', rest: '90s', cue: 'Brace core tightly, avoid excessive lumbar arch' },
          { name: 'Cable Lateral Raises (Behind Back)', sets: '3 sets × 15 reps', rpe: 'RPE 9.0', rest: '60s', cue: 'Lead with elbows, pause at parallel' },
          { name: 'Incline Dumbbell Bicep Curls', sets: '3 sets × 12 reps', rpe: 'RPE 8.5', rest: '60s', cue: 'Full stretch at bottom, suppress deltoid assist' },
        ],
      },
      {
        day: 'Day 2 · Lower Posterior Chain & Squat',
        exercises: [
          { name: 'Safety Bar Squat', sets: '4 sets × 6 reps', rpe: 'RPE 8.5', rest: '180s', cue: 'Break hips and knees together, hit depth' },
          { name: 'Romanian Deadlift (RDL)', sets: '4 sets × 8 reps', rpe: 'RPE 8.0', rest: '120s', cue: 'Hinge back until hamstring tension peaks' },
          { name: 'Bulgarian Split Squats', sets: '3 sets × 10 reps/leg', rpe: 'RPE 8.5', rest: '90s', cue: 'Slight forward torso tilt for glute bias' },
          { name: 'Standing Calf Raise with 2s Pause', sets: '4 sets × 15 reps', rpe: 'RPE 9.0', rest: '60s', cue: 'Full dorsiflexion stretch on step edge' },
        ],
      },
    ],
    nutritionTimeline: [
      { time: '08:00 AM · Breakfast', meal: '4 Egg Whites + 2 Whole Eggs, 80g Rolled Oats with Blueberries & Honey (580 kcal · 42g P)' },
      { time: '12:30 PM · Lunch', meal: '200g Grilled Chicken Breast, 180g Jasmine Rice, Asparagus & Olive Oil (680 kcal · 54g P)' },
      { time: '04:30 PM · Pre-Workout Fuel', meal: 'Rice Cakes with 25g Almond Butter, 1 Scoop Whey Isolate (340 kcal · 30g P)' },
      { time: '08:00 PM · Recovery Dinner', meal: '200g Wild Salmon Fillet, Baked Sweet Potato, Steamed Broccoli (650 kcal · 48g P)' },
    ],
  },
  fatloss: {
    title: 'Metabolic Conditioning & Fat Shred Protocol',
    focus: 'Caloric Deficit with Muscle Sparing · High Glycogen Efficiency',
    calories: 2150,
    protein: 210,
    carbs: 175,
    fats: 52,
    hydration: 4.2,
    frequency: '5 Days / Week',
    volumeWeekly: '12 High-Density Sets / Muscle Group',
    cardio: '30 min Fasted Zone 2 or 15 min HIIT Finisher',
    schedule: [
      {
        day: 'Day 1 · Push Density & Core Circuit',
        exercises: [
          { name: 'Barbell Flat Bench Press', sets: '4 sets × 8 reps', rpe: 'RPE 8.0', rest: '90s', cue: 'Maintain strength baseline, drive through heels' },
          { name: 'Dumbbell Seated Shoulder Press', sets: '3 sets × 10 reps', rpe: 'RPE 8.5', rest: '75s', cue: 'Keep elbows at 45° angle to reduce shoulder pinch' },
          { name: 'Incline Dumbbell Flyes to Hex Press', sets: '3 sets × 12 reps', rpe: 'RPE 8.5', rest: '60s', cue: 'Compound set for metabolic depletion' },
          { name: 'Triceps Rope Pushdowns (Drop-set)', sets: '3 sets × 15 reps', rpe: 'RPE 9.0', rest: '45s', cue: 'Lock out fully at bottom with pronation' },
          { name: 'Hanging Leg Raises with Pelvic Tilt', sets: '3 sets × 15 reps', rpe: 'RPE 8.5', rest: '45s', cue: 'Avoid swinging; initiate strictly with lower abs' },
        ],
      },
      {
        day: 'Day 2 · High-Volume Back & Metabolic Intervals',
        exercises: [
          { name: 'Weighted Neutral-Grip Pull-ups', sets: '4 sets × 6 reps', rpe: 'RPE 8.5', rest: '120s', cue: 'Chin clears bar, dead-hang at bottom' },
          { name: 'Barbell Pendlay Row', sets: '4 sets × 8 reps', rpe: 'RPE 8.0', rest: '90s', cue: 'Explosive pull from dead floor stop' },
          { name: 'Single-Arm Cable Lat Pulldowns', sets: '3 sets × 12 reps', rpe: 'RPE 8.5', rest: '60s', cue: 'Lateral flexion stretch at eccentric peak' },
          { name: 'Facepulls with External Rotation', sets: '4 sets × 20 reps', rpe: 'RPE 9.0', rest: '45s', cue: 'Protect rotator cuff and posterior deltoids' },
        ],
      },
    ],
    nutritionTimeline: [
      { time: '08:30 AM · Breakfast', meal: 'Egg White Scramble with Spinach, Half Avocado, 1 Slice Sourdough (410 kcal · 38g P)' },
      { time: '01:00 PM · High-Protein Lunch', meal: '220g Ground Turkey (93/7), Cauliflower Rice with Black Beans & Salsa (520 kcal · 52g P)' },
      { time: '05:00 PM · Pre-Lift Snack', meal: 'Greek Yogurt (0% Fat) with Strawberries & Chia Seeds (260 kcal · 28g P)' },
      { time: '08:30 PM · Dinner', meal: '220g White Cod or Halibut, Roasted Zucchini, Olive Oil Dressing (480 kcal · 48g P)' },
    ],
  },
  strength: {
    title: 'Neuromuscular Power & Peak Force Protocol',
    focus: 'CNS Potentiation · 1RM Strength & Biomechanical Efficiency',
    calories: 3100,
    protein: 205,
    carbs: 380,
    fats: 80,
    hydration: 4.5,
    frequency: '4 Days / Week',
    volumeWeekly: 'High Intensity, Low Volume (RPE 9+)',
    cardio: 'Low intensity recovery walk only (Zero interference effect)',
    schedule: [
      {
        day: 'Day 1 · Heavy Squat & Leg Drive Focus',
        exercises: [
          { name: 'Low-Bar Barbell Back Squat', sets: '5 sets × 3 reps', rpe: 'RPE 9.0', rest: '240s', cue: 'Aggressive intra-abdominal pressure into belt' },
          { name: 'Pause Squat (2s at Parallel)', sets: '3 sets × 4 reps', rpe: 'RPE 8.0', rest: '180s', cue: 'Kill stretch reflex at bottom, explode up' },
          { name: 'Leg Press (Quad-Dominant Foot Placement)', sets: '3 sets × 8 reps', rpe: 'RPE 8.5', rest: '120s', cue: 'Knees to chest without pelvic tuck' },
          { name: 'Standing Hamstring Curl Machine', sets: '3 sets × 10 reps', rpe: 'RPE 8.5', rest: '90s', cue: 'Keep hips pinned flat against pad' },
        ],
      },
      {
        day: 'Day 2 · Bench Press & Explosive Lockout',
        exercises: [
          { name: 'Competition Flat Barbell Bench', sets: '5 sets × 3 reps', rpe: 'RPE 9.0', rest: '210s', cue: 'Arch upper back, retract scapulae, drive heels' },
          { name: 'Close-Grip Bench Press (Triceps Bias)', sets: '3 sets × 6 reps', rpe: 'RPE 8.5', rest: '120s', cue: 'Shoulder-width grip, tuck elbows tight' },
          { name: 'Heavy Barbell Barbell Shrugs', sets: '4 sets × 8 reps', rpe: 'RPE 8.5', rest: '90s', cue: 'Pause 2s at top, do not roll shoulders' },
          { name: 'Weighted Dips', sets: '3 sets × 8 reps', rpe: 'RPE 8.5', rest: '120s', cue: 'Vertical torso, full lockout at top' },
        ],
      },
    ],
    nutritionTimeline: [
      { time: '07:30 AM · Power Breakfast', meal: '3 Whole Eggs + 3 Whites, 1 Bagel with Honey, 1 Banana (720 kcal · 45g P)' },
      { time: '12:00 PM · Fuel Lunch', meal: '220g Sirloin Steak, 250g Sweet Potato, Steamed Green Beans (780 kcal · 58g P)' },
      { time: '04:00 PM · Pre-Workout Carbs', meal: 'Cream of Rice with 1 Scoop Whey & Blueberries (420 kcal · 32g P)' },
      { time: '08:00 PM · Satiety Dinner', meal: '220g Chicken Thighs, 200g Brown Rice, Mixed Greens with Olive Oil (810 kcal · 52g P)' },
    ],
  },
}

export default function AIPlanner() {
  // User input states
  const [weight, setWeight] = useState('78')
  const [height, setHeight] = useState('180')
  const [gender, setGender] = useState('male')
  const [goal, setGoal] = useState('hypertrophy')
  const [experience, setExperience] = useState('intermediate')
  const [equipment, setEquipment] = useState('gym')
  const [diet, setDiet] = useState('high_protein')

  // Generation flow states
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)
  const [generatedPlan, setGeneratedPlan] = useState(PRESET_PROTOCOLS['hypertrophy'])
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('workouts') // 'workouts' | 'nutrition'

  const steps = [
    'Synthesizing Basal Metabolic Rate (BMR) & TDEE...',
    'Calibrating progressive volume load & joint recovery vectors...',
    'Structuring periodized weekly exercises & RPE thresholds...',
    'Formatting micronutrient ratios & post-workout nutrient timing...',
  ]

  const handleGenerate = () => {
    setIsGenerating(true)
    setGenerationStep(0)

    let current = 0
    const interval = setInterval(() => {
      current += 1
      if (current < steps.length) {
        setGenerationStep(current)
      } else {
        clearInterval(interval)
        // Select matching protocol with customized calorie tweaks based on user weight
        const base = PRESET_PROTOCOLS[goal] || PRESET_PROTOCOLS.hypertrophy
        const weightNum = parseFloat(weight) || 75
        const adjustedCal = Math.round(base.calories * (weightNum / 75))
        const adjustedProt = Math.round(base.protein * (weightNum / 75))

        setGeneratedPlan({
          ...base,
          calories: adjustedCal,
          protein: adjustedProt,
          carbs: Math.round(base.carbs * (weightNum / 75)),
          fats: Math.round(base.fats * (weightNum / 75)),
          userWeight: weight,
          userHeight: height,
        })
        setIsGenerating(false)
      }
    }, 650)
  }

  const handleCopy = () => {
    const text = `FITPULSE AI CUSTOM PROTOCOL
Goal: ${generatedPlan.title}
Daily Target: ${generatedPlan.calories} kcal (Protein: ${generatedPlan.protein}g | Carbs: ${generatedPlan.carbs}g | Fats: ${generatedPlan.fats}g)
Hydration: ${generatedPlan.hydration} L/day
Frequency: ${generatedPlan.frequency}
Generated for: ${weight}kg · ${height}cm · ${experience.toUpperCase()}`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section id="ai-generator" style={{ padding: '100px 0', position: 'relative' }}>
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
            <Sparkles size={13} />
            <span>Interactive Neural Workout & Diet Synthesizer</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4.2vw, 48px)',
            fontWeight: 900,
            color: '#f8fafc',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            margin: '0 0 16px',
          }}>
            Test our AI engine right now.<br />
            <span className="animate-gradient-text">Generate your custom protocol</span>
          </h2>

          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            No credit card. No email required. Input your biometric profile below and watch our neural model assemble a complete progressive plan in real time.
          </p>
        </motion.div>

        {/* Main Generator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Biometric Parameter Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 glass-card glow-border"
            style={{
              padding: '28px 24px',
              background: 'rgba(15,23,42,0.75)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sliders size={16} color="#34d399" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Biometric Parameters
                </h3>
                <p style={{ fontSize: 11.5, color: '#64748b', margin: 0 }}>
                  Fine-tune baseline parameters for model input
                </p>
              </div>
            </div>

            {/* Inputs Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Weight & Height Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 12,
                      background: 'rgba(30,41,59,0.7)', border: '1px solid #334155',
                      color: '#f8fafc', fontSize: 14, fontWeight: 600, outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 12,
                      background: 'rgba(30,41,59,0.7)', border: '1px solid #334155',
                      color: '#f8fafc', fontSize: 14, fontWeight: 600, outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Primary Fitness Goal */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                  Primary Fitness Objective
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { id: 'hypertrophy', label: 'Hypertrophy', sub: 'Lean Muscle' },
                    { id: 'fatloss',     label: 'Fat Shred',   sub: 'Metabolic Cut' },
                    { id: 'strength',    label: 'Max Strength', sub: 'Power / CNS' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGoal(item.id)}
                      style={{
                        padding: '10px 8px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                        background: goal === item.id ? 'rgba(16,185,129,0.18)' : 'rgba(30,41,59,0.5)',
                        border: goal === item.id ? '1px solid rgba(16,185,129,0.55)' : '1px solid rgba(51,65,85,0.4)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <p style={{ fontSize: 12, fontWeight: 700, color: goal === item.id ? '#34d399' : '#cbd5e1', margin: 0 }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: 9.5, color: '#64748b', margin: '2px 0 0' }}>
                        {item.sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Training Experience */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                  Experience Level
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['beginner', 'intermediate', 'advanced'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperience(lvl)}
                      style={{
                        flex: 1, padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                        background: experience === lvl ? 'rgba(16,185,129,0.15)' : 'rgba(30,41,59,0.5)',
                        border: experience === lvl ? '1px solid #10b981' : '1px solid #334155',
                        color: experience === lvl ? '#34d399' : '#94a3b8',
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment Access */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                  Available Equipment Access
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { id: 'gym', label: 'Commercial Gym' },
                    { id: 'home', label: 'Dumbbells Only' },
                    { id: 'body', label: 'Bodyweight' },
                  ].map(eq => (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => setEquipment(eq.id)}
                      style={{
                        padding: '8px 6px', borderRadius: 10, cursor: 'pointer',
                        fontSize: 11.5, fontWeight: 600,
                        background: equipment === eq.id ? 'rgba(20,184,166,0.15)' : 'rgba(30,41,59,0.5)',
                        border: equipment === eq.id ? '1px solid #14b8a6' : '1px solid #334155',
                        color: equipment === eq.id ? '#2dd4bf' : '#94a3b8',
                      }}
                    >
                      {eq.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Stance */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                  Dietary Paradigm
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { id: 'high_protein', label: 'High-Protein Balanced' },
                    { id: 'keto', label: 'Keto / Low-Carb' },
                    { id: 'plant', label: 'Plant-Based' },
                  ].map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDiet(d.id)}
                      style={{
                        flex: 1, padding: '8px 6px', borderRadius: 10, cursor: 'pointer',
                        fontSize: 11, fontWeight: 600,
                        background: diet === d.id ? 'rgba(168,85,247,0.15)' : 'rgba(30,41,59,0.5)',
                        border: diet === d.id ? '1px solid #a855f7' : '1px solid #334155',
                        color: diet === d.id ? '#c084fc' : '#94a3b8',
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate CTA Button */}
              <motion.button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                className="btn-primary"
                style={{
                  width: '100%', padding: '14px 20px',
                  borderRadius: 14, fontSize: 15,
                  marginTop: 6, opacity: isGenerating ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                {isGenerating ? (
                  <>
                    <Activity size={18} className="animate-spin" />
                    <span>Neural Model Running...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Precision AI Plan</span>
                  </>
                )}
              </motion.button>

            </div>
          </motion.div>

          {/* Right Column: Live Generated Plan Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 glass-card"
            style={{
              padding: '28px 24px',
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(16,185,129,0.3)',
              boxShadow: '0 20px 50px -15px rgba(0,0,0,0.8), 0 0 35px rgba(16,185,129,0.12)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Glowing Ambient Line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, #10b981, #14b8a6, #a855f7)',
            }} />

            {/* In-Progress Neural Loading State Overlay */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute', inset: 0, zIndex: 30,
                    background: 'rgba(5,10,16,0.92)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: 30, textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: 60, height: 60, borderRadius: 20,
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                    <Zap size={28} color="#34d399" className="animate-pulse" />
                  </div>

                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginBottom: 10 }}>
                    Synthesizing Athlete Blueprint
                  </h4>

                  <p style={{ fontSize: 13, color: '#34d399', fontWeight: 600, minHeight: 20, marginBottom: 24 }}>
                    {steps[generationStep]}
                  </p>

                  <div style={{ width: '100%', maxWidth: 320, height: 6, borderRadius: 999, background: '#1e293b', overflow: 'hidden' }}>
                    <motion.div
                      style={{
                        height: '100%', borderRadius: 999,
                        background: 'linear-gradient(90deg, #10b981, #14b8a6)',
                        width: `${((generationStep + 1) / steps.length) * 100}%`,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated Plan Header */}
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              justifyContent: 'space-between', alignItems: 'flex-start',
              gap: 16, marginBottom: 22,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999,
                    background: 'rgba(16,185,129,0.15)', color: '#34d399',
                    border: '1px solid rgba(16,185,129,0.3)', textTransform: 'uppercase',
                  }}>
                    Active Neural Blueprint
                  </span>
                  <span style={{ fontSize: 11.5, color: '#64748b' }}>
                    Updated in 380ms
                  </span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {generatedPlan.title}
                </h3>
                <p style={{ fontSize: 12.5, color: '#94a3b8', margin: '4px 0 0' }}>
                  {generatedPlan.focus}
                </p>
              </div>

              {/* Action Buttons: Copy Protocol */}
              <div style={{ display: 'flex', gap: 8 }}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCopy}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 10,
                    background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(30,41,59,0.7)',
                    border: `1px solid ${copied ? '#10b981' : '#334155'}`,
                    color: copied ? '#34d399' : '#cbd5e1',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Plan'}</span>
                </motion.button>
              </div>
            </div>

            {/* Target Macro Telemetry Bar */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
              padding: 14, borderRadius: 14, background: 'rgba(30,41,59,0.4)',
              border: '1px solid rgba(51,65,85,0.4)', marginBottom: 20,
            }}>
              <div>
                <p style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Daily Target</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: '#34d399', margin: '2px 0 0' }}>{generatedPlan.calories} <span style={{ fontSize: 10, color: '#94a3b8' }}>kcal</span></p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Protein</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: '2px 0 0' }}>{generatedPlan.protein} <span style={{ fontSize: 10, color: '#94a3b8' }}>g</span></p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Carbs</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: '#2dd4bf', margin: '2px 0 0' }}>{generatedPlan.carbs} <span style={{ fontSize: 10, color: '#94a3b8' }}>g</span></p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Fats</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: '#fbbf24', margin: '2px 0 0' }}>{generatedPlan.fats} <span style={{ fontSize: 10, color: '#94a3b8' }}>g</span></p>
              </div>
            </div>

            {/* Sub-Tabs: Training Schedule vs Nutrition Plan */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => setActiveTab('workouts')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                  fontSize: 12.5, fontWeight: 700,
                  background: activeTab === 'workouts' ? 'rgba(16,185,129,0.15)' : 'transparent',
                  border: `1px solid ${activeTab === 'workouts' ? 'rgba(16,185,129,0.4)' : 'transparent'}`,
                  color: activeTab === 'workouts' ? '#34d399' : '#94a3b8',
                }}
              >
                <Dumbbell size={14} />
                <span>Training Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('nutrition')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                  fontSize: 12.5, fontWeight: 700,
                  background: activeTab === 'nutrition' ? 'rgba(16,185,129,0.15)' : 'transparent',
                  border: `1px solid ${activeTab === 'nutrition' ? 'rgba(16,185,129,0.4)' : 'transparent'}`,
                  color: activeTab === 'nutrition' ? '#34d399' : '#94a3b8',
                }}
              >
                <Utensils size={14} />
                <span>Dietary Timeline</span>
              </button>
            </div>

            {/* Content Based on Tab */}
            {activeTab === 'workouts' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {generatedPlan.schedule.map((routine, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(30,41,59,0.4)', borderRadius: 14,
                      padding: 16, border: '1px solid rgba(51,65,85,0.4)',
                    }}
                  >
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginBottom: 12, borderBottom: '1px solid rgba(51,65,85,0.3)', paddingBottom: 8,
                    }}>
                      <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        {routine.day}
                      </h4>
                      <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>
                        {routine.exercises.length} Progressive Exercises
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {routine.exercises.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          style={{
                            display: 'flex', flexWrap: 'wrap',
                            justifyContent: 'space-between', alignItems: 'center',
                            padding: '8px 10px', borderRadius: 8,
                            background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.3)',
                            fontSize: 12,
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{ex.name}</span>
                            <p style={{ fontSize: 10.5, color: '#64748b', margin: '2px 0 0' }}>💡 {ex.cue}</p>
                          </div>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <span style={{ color: '#34d399', fontWeight: 700 }}>{ex.sets}</span>
                            <span style={{ color: '#94a3b8', fontSize: 10.5, padding: '2px 6px', borderRadius: 4, background: '#1e293b' }}>{ex.rpe}</span>
                            <span style={{ color: '#64748b', fontSize: 10.5 }}>{ex.rest}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {generatedPlan.nutritionTimeline.map((meal, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: 14, borderRadius: 12,
                      background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(51,65,85,0.4)',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Clock size={13} color="#34d399" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 12.5, fontWeight: 700, color: '#34d399', margin: '0 0 3px' }}>
                        {meal.time}
                      </h4>
                      <p style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                        {meal.meal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Meta Bar */}
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              justifyContent: 'space-between', alignItems: 'center',
              borderTop: '1px solid rgba(51,65,85,0.4)', paddingTop: 14, marginTop: 18,
              fontSize: 11.5, color: '#64748b',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <ShieldCheck size={13} color="#10b981" /> Auto-Regulated Progressive Overload
              </span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>
                Frequency: {generatedPlan.frequency}
              </span>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  )
}
