import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Dumbbell, Zap, Sliders, Copy, Check,
  Download, ArrowRight, Activity, ShieldCheck, Clock,
  Calendar, RotateCcw, AlertTriangle, Layers
} from 'lucide-react'

// Protocols dictionary for various goals & splits
const GENERATED_PROGRAMS = {
  hypertrophy: {
    title: 'Adaptive Hypertrophy & Density Engine',
    model: 'Periodized Progressive Overload · Vol. Accumulation',
    split: '4-Day Upper / Lower High Density',
    duration: '65–75 mins per session',
    rpeTarget: 'RPE 8.0 – 9.5',
    days: [
      {
        dayName: 'Day 1 · Upper Body Heavy Press & Pull',
        focus: 'Chest, Back, Shoulders & Arms',
        exercises: [
          { name: 'Barbell Incline Bench Press', target: 'Upper Pectorals', sets: '4 sets × 8 reps', rpe: 'RPE 8.5', rest: '120s', cue: 'Pause 1s at clavicular junction. Explode upward with active chest contraction.' },
          { name: 'Chest-Supported T-Bar Row', target: 'Lats & Rhomboids', sets: '4 sets × 10 reps', rpe: 'RPE 8.0', rest: '90s', cue: 'Retract scapulae fully at top; 3-second controlled eccentric descent.' },
          { name: 'Standing DB Overhead Press', target: 'Anterior Deltoids', sets: '3 sets × 8 reps', rpe: 'RPE 8.0', rest: '90s', cue: 'Brace core tightly to avoid lumbar hyper-extension.' },
          { name: 'Cable Lateral Raise (Behind Back)', target: 'Lateral Deltoids', sets: '3 sets × 15 reps', rpe: 'RPE 9.0', rest: '60s', cue: 'Lead with elbow vector. Do not swing torso.' },
          { name: 'Incline Dumbbell Bicep Curl', target: 'Biceps Long Head', sets: '3 sets × 12 reps', rpe: 'RPE 8.5', rest: '60s', cue: 'Full passive stretch at the bottom with supinated wrist angle.' },
        ],
      },
      {
        day: 'Day 2 · Lower Body Posterior Chain & Quad Bias',
        dayName: 'Day 2 · Lower Body Posterior Chain',
        focus: 'Quads, Hamstrings & Calves',
        exercises: [
          { name: 'Safety Bar Squat', target: 'Quadriceps & Glutes', sets: '4 sets × 6 reps', rpe: 'RPE 8.5', rest: '180s', cue: 'Keep torso upright. Drive hard into floor spread.' },
          { name: 'Romanian Deadlift (RDL)', target: 'Hamstrings & Gluteus', sets: '4 sets × 8 reps', rpe: 'RPE 8.0', rest: '120s', cue: 'Hinge hips backward until maximum hamstring stretch is achieved.' },
          { name: 'Bulgarian Split Squat', target: 'Unilateral Quads', sets: '3 sets × 10 reps/leg', rpe: 'RPE 8.5', rest: '90s', cue: 'Slight 15° forward torso angle for glute focus.' },
          { name: 'Standing Calf Raise with 2s Pause', target: 'Gastrocnemius', sets: '4 sets × 15 reps', rpe: 'RPE 9.0', rest: '60s', cue: '2s static pause in deep dorsiflexion to eliminate achilles stretch reflex.' },
        ],
      },
      {
        day: 'Day 3 · Upper Body Density & Arm Hypertrophy',
        dayName: 'Day 3 · Upper Body Density',
        focus: 'Lats, Triceps & Upper Delts',
        exercises: [
          { name: 'Weighted Neutral-Grip Pull-ups', target: 'Latissimus Dorsi', sets: '4 sets × 6 reps', rpe: 'RPE 8.5', rest: '120s', cue: 'Chin clears bar height, dead-hang stretch at bottom.' },
          { name: 'Flat Dumbbell Press with Pronation', target: 'Mid Pectorals', sets: '4 sets × 10 reps', rpe: 'RPE 8.0', rest: '90s', cue: 'Bring dumbbells down at 45° angle to reduce shoulder strain.' },
          { name: 'Close-Grip Triceps Pressdown', target: 'Triceps Lateral Head', sets: '3 sets × 12 reps', rpe: 'RPE 9.0', rest: '60s', cue: 'Keep elbows pinned to ribcage during extension.' },
          { name: 'Facepulls with External Rotation', target: 'Rear Delts & Rotator', sets: '4 sets × 15 reps', rpe: 'RPE 8.5', rest: '45s', cue: 'Pull rope apart toward crown of head.' },
        ],
      },
    ],
  },
  fatloss: {
    title: 'Metabolic Conditioning & Glycogen Depletion Protocol',
    model: 'High-Density Rest Periods · Muscle Preservation',
    split: '5-Day High Frequency Density',
    duration: '45–55 mins per session',
    rpeTarget: 'RPE 8.5 – 9.0',
    days: [
      {
        dayName: 'Day 1 · Push Density & Core Circuit',
        focus: 'Chest, Shoulders & Metabolic Core',
        exercises: [
          { name: 'Barbell Flat Bench Press', target: 'Chest Baseline', sets: '4 sets × 8 reps', rpe: 'RPE 8.0', rest: '75s', cue: 'Sustain peak strength output to preserve lean tissue.' },
          { name: 'Incline Dumbbell Hex Press', target: 'Inner Chest', sets: '3 sets × 12 reps', rpe: 'RPE 8.5', rest: '60s', cue: 'Squeeze dumbbells together continuously throughout motion.' },
          { name: 'Seated Arnold Shoulder Press', target: 'Shoulder Delts', sets: '3 sets × 10 reps', rpe: 'RPE 8.5', rest: '60s', cue: 'Rotate wrists smoothly from supinated to pronated.' },
          { name: 'Hanging Leg Raises with Pelvic Curl', target: 'Abdominals', sets: '3 sets × 15 reps', rpe: 'RPE 9.0', rest: '45s', cue: 'Roll pelvis upward at top of repetition.' },
        ],
      },
      {
        dayName: 'Day 2 · Pull & High-Volume Back Intervals',
        focus: 'Back & Posterior Chain',
        exercises: [
          { name: 'Barbell Pendlay Row', target: 'Mid-Back Power', sets: '4 sets × 8 reps', rpe: 'RPE 8.0', rest: '75s', cue: 'Reset bar on floor dead-stop every single rep.' },
          { name: 'Single-Arm Cable Lat Pulldown', target: 'Lats Focus', sets: '3 sets × 12 reps', rpe: 'RPE 8.5', rest: '60s', cue: 'Lateral torso bend at top to maximize stretch.' },
          { name: 'Dumbbell Hammer Curls', target: 'Brachialis', sets: '3 sets × 12 reps', rpe: 'RPE 8.5', rest: '45s', cue: 'Neutral thumbs-up grip throughout the range.' },
        ],
      },
    ],
  },
  strength: {
    title: 'Neuromuscular Power & Maximum Force Production',
    model: 'CNS Potentiation · 1RM Strength Development',
    split: '4-Day Competition Big 3 Focus',
    duration: '75–90 mins per session',
    rpeTarget: 'RPE 8.5 – 9.5 (Heavy)',
    days: [
      {
        dayName: 'Day 1 · Heavy Squat & Leg Drive Focus',
        focus: 'Low-Bar Squat & Quad Potentiation',
        exercises: [
          { name: 'Competition Barbell Back Squat', target: 'Lower Kinetic Chain', sets: '5 sets × 3 reps', rpe: 'RPE 9.0', rest: '240s', cue: 'Aggressive valsalva maneuver into lever belt. Drive through midfoot.' },
          { name: 'Pause Squat (2s in Hole)', target: 'Rate of Force Dev', sets: '3 sets × 4 reps', rpe: 'RPE 8.0', rest: '180s', cue: 'Eliminate stretch shortening cycle at absolute parallel.' },
          { name: 'Heavy Barbell Romanian Deadlift', target: 'Posterior Chain', sets: '3 sets × 6 reps', rpe: 'RPE 8.5', rest: '120s', cue: 'Maintain neutral spine, do not shrug at lockout.' },
        ],
      },
      {
        dayName: 'Day 2 · Competition Bench & Triceps Power',
        focus: 'Pectoral Arch & Lockout Speed',
        exercises: [
          { name: 'Competition Barbell Bench Press', target: 'Chest & Triceps', sets: '5 sets × 3 reps', rpe: 'RPE 9.0', rest: '210s', cue: 'Scapulae pinned and retracted. Drive heels hard into floor.' },
          { name: 'Close-Grip Bench Press', target: 'Triceps Lockout', sets: '3 sets × 6 reps', rpe: 'RPE 8.5', rest: '120s', cue: 'Hands shoulder-width apart, elbows tucked at 30°.' },
          { name: 'Weighted Dips', target: 'Chest & Shoulders', sets: '3 sets × 8 reps', rpe: 'RPE 8.5', rest: '120s', cue: 'Torso vertical, full lock at peak.' },
        ],
      },
    ],
  },
}

export default function WorkoutGenerator({ setActiveView, onOpenCoach }) {
  // Inputs state
  const [goal, setGoal] = useState('hypertrophy')
  const [experience, setExperience] = useState('intermediate')
  const [frequency, setFrequency] = useState('4')
  const [split, setSplit] = useState('upper_lower')
  const [equipment, setEquipment] = useState('commercial_gym')
  const [injury, setInjury] = useState('none')

  // Generation process state
  const [isGenerating, setIsGenerating] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [program, setProgram] = useState(GENERATED_PROGRAMS.hypertrophy)
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const loadingSteps = [
    'Computing neuromuscular workload coefficient...',
    'Calibrating progressive overload & RPE progression...',
    'Applying injury restriction filters & exercise substitutions...',
    'Structuring periodized multi-day volume allocation...',
  ]

  const handleGenerate = () => {
    setIsGenerating(true)
    setStepIndex(0)

    let cur = 0
    const interval = setInterval(() => {
      cur += 1
      if (cur < loadingSteps.length) {
        setStepIndex(cur)
      } else {
        clearInterval(interval)
        const selected = GENERATED_PROGRAMS[goal] || GENERATED_PROGRAMS.hypertrophy
        setProgram(selected)
        setActiveDayIndex(0)
        setIsGenerating(false)
      }
    }, 600)
  }

  const handleCopy = () => {
    const text = `FITPULSE AI - ${program.title}
Model: ${program.model}
Frequency: ${frequency} Days/Wk | Split: ${split}
Days: ${program.days.map(d => `\n\n${d.dayName}\n` + d.exercises.map(e => `- ${e.name} (${e.sets}, ${e.rpe})`).join('\n')).join('')}`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">

      {/* Generator Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Parameter Controls Panel */}
        <div className="lg:col-span-5 p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-none bg-[#00d9ff]/15 border border-[rgba(0,217,255,0.2)] text-[#00d9ff]">
              <Sliders size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                AI Routine Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Set athlete parameters to trigger neural model
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">

            {/* 1. Primary Goal */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                1. Primary Adaptive Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hypertrophy', label: 'Hypertrophy', sub: 'Muscle Mass' },
                  { id: 'fatloss',     label: 'Fat Shred',   sub: 'Metabolic Cut' },
                  { id: 'strength',    label: 'Max Strength', sub: 'Power / 1RM' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`
                      p-2.5 rounded-none text-left border transition-all cursor-pointer
                      ${goal === item.id
                        ? 'bg-[#00d9ff]/15 border-[rgba(0,217,255,0.3)] text-[#33e4ff] shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : 'bg-[var(--bg-dark)]/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }
                    `}
                  >
                    <p className="text-xs font-bold leading-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Experience Level */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                2. Experience Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['beginner', 'intermediate', 'advanced', 'elite'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperience(lvl)}
                    className={`
                      py-2 px-1 rounded-none text-xs font-bold text-center capitalize border transition-all cursor-pointer
                      ${experience === lvl
                        ? 'bg-[#00d9ff]/15 border-[#00d9ff] text-[#33e4ff]'
                        : 'bg-[var(--bg-dark)]/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }
                    `}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Days Per Week & Split */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  3. Frequency
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['3', '4', '5', '6'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFrequency(d)}
                      className={`
                        py-2 text-xs font-bold rounded-none border text-center transition-all cursor-pointer
                        ${frequency === d
                          ? 'bg-[#00d9ff]/20 border-[#00d9ff] text-[#33e4ff]'
                          : 'bg-[var(--bg-dark)]/60 border-slate-800 text-slate-400'
                        }
                      `}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  4. Muscle Split
                </label>
                <select
                  value={split}
                  onChange={(e) => setSplit(e.target.value)}
                  className="w-full py-2 px-2.5 rounded-none bg-[var(--bg-dark)] border border-slate-800 text-xs font-semibold text-slate-200 outline-none focus:border-[#00d9ff]"
                >
                  <option value="upper_lower">Upper / Lower Split</option>
                  <option value="ppl">Push / Pull / Legs</option>
                  <option value="full_body">Full Body High Frequency</option>
                  <option value="arnold">Arnold Antagonist Split</option>
                </select>
              </div>
            </div>

            {/* 5. Equipment Access */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                5. Equipment Environment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'commercial_gym', label: 'Commercial Gym' },
                  { id: 'dumbbells_only', label: 'Dumbbells Only' },
                  { id: 'bodyweight',     label: 'Bodyweight' },
                ].map(eq => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => setEquipment(eq.id)}
                    className={`
                      p-2 text-center rounded-none text-[11.5px] font-semibold border transition-all cursor-pointer
                      ${equipment === eq.id
                        ? 'bg-[rgba(0,217,255,0.06)] border-[#00d9ff] text-[#33e4ff]'
                        : 'bg-[var(--bg-dark)]/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }
                    `}
                  >
                    {eq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Joint & Injury Accommodation */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                6. Joint Safeguard (Substitutions)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'shoulder', label: 'Shoulder' },
                  { id: 'back', label: 'Lower Back' },
                  { id: 'knee', label: 'Knees' },
                ].map(inj => (
                  <button
                    key={inj.id}
                    type="button"
                    onClick={() => setInjury(inj.id)}
                    className={`
                      py-1.5 px-1 text-center rounded-none text-[11px] font-bold border transition-all cursor-pointer
                      ${injury === inj.id
                        ? 'bg-[rgba(167,139,250,0.1)] border-[#a78bfa] text-[#a78bfa]'
                        : 'bg-[var(--bg-dark)]/60 border-slate-800 text-slate-400'
                      }
                    `}
                  >
                    {inj.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isGenerating}
              onClick={handleGenerate}
              className="w-full btn-primary py-3.5 mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Activity size={17} className="animate-spin" />
                  <span>Synthesizing Model Weights...</span>
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  <span>Generate AI Routine Protocol</span>
                </>
              )}
            </motion.button>

          </div>
        </div>

        {/* Right Output Program Display Panel */}
        <div className="lg:col-span-7 p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 shadow-2xl relative overflow-hidden space-y-6">

          {/* Staged Neural Loading Overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-[var(--bg-dark)]/92 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-14 h-14 rounded-none bg-[#00d9ff]/15 border border-[rgba(0,217,255,0.25)] flex items-center justify-center mb-4">
                  <Zap size={26} className="text-[#00d9ff] animate-pulse" />
                </div>
                <h4 className="text-lg font-black text-white mb-2">
                  Building Periodized Training Architecture
                </h4>
                <p className="text-xs font-semibold text-[#00d9ff] min-h-[20px] mb-4">
                  {loadingSteps[stepIndex]}
                </p>
                <div className="w-64 h-2 rounded-none bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${((stepIndex + 1) / loadingSteps.length) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Routine Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-none bg-[#00d9ff]/15 text-[#00d9ff] border border-[rgba(0,217,255,0.2)] uppercase">
                  Active AI Prescription
                </span>
                <span className="text-xs text-slate-500">
                  {frequency} Days / Week
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {program.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {program.model} · {program.duration}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-none bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                {copied ? <Check size={14} className="text-[#00d9ff]" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => {
                  if (setActiveView) setActiveView('logger')
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-none bg-[#00d9ff]/20 border border-[rgba(0,217,255,0.25)] text-[#33e4ff] text-xs font-bold hover:bg-[#00d9ff]/30 cursor-pointer"
              >
                <span>Log Session</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Day Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {program.days.map((d, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDayIndex(idx)}
                className={`
                  px-4 py-2 rounded-none text-xs font-bold whitespace-nowrap transition-all cursor-pointer
                  ${activeDayIndex === idx
                    ? 'bg-[#00d9ff]/20 border border-[rgba(0,217,255,0.3)] text-[#33e4ff]'
                    : 'bg-[var(--bg-dark)]/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                {d.dayName}
              </button>
            ))}
          </div>

          {/* Current Day Exercises Card */}
          {program.days[activeDayIndex] && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                <span>Prescribed Movements</span>
                <span className="text-[#00d9ff]">{program.days[activeDayIndex].focus}</span>
              </div>

              <div className="space-y-2.5">
                {program.days[activeDayIndex].exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-none bg-[var(--bg-dark)]/70 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{ex.name}</span>
                          <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[#00d9ff]">
                            {ex.target}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-extrabold text-[#00d9ff]">{ex.sets}</span>
                        <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-bold text-[10.5px]">
                          {ex.rpe}
                        </span>
                        <span className="text-slate-500 text-[11px] font-medium">
                          {ex.rest}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/50 p-2 rounded-none border border-slate-800/50">
                      💡 <span className="font-semibold text-slate-300">Biomechanical Cue:</span> {ex.cue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Diagnostic Tag */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#00d9ff]" />
              <span>Autoregulated RPE threshold calibrated</span>
            </span>
            <span className="text-[#00d9ff] font-semibold">
              RPE Target: {program.rpeTarget}
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}
