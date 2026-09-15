import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Timer, Play, Pause, RotateCcw, CheckCircle2,
  Plus, Dumbbell, Flame, Activity, Zap, ShieldCheck
} from 'lucide-react'

export default function WorkoutLogger({ activeVolume, setActiveVolume }) {
  // Session Stopwatch
  const [elapsedSeconds, setElapsedSeconds] = useState(2535) // Start at ~42 mins
  const [isRunning, setIsRunning] = useState(true)

  // Rest Timer
  const [restSeconds, setRestSeconds] = useState(0)
  const [restRunning, setRestRunning] = useState(false)

  // Active Exercises Queue
  const [exercises, setExercises] = useState([
    {
      id: '1',
      name: 'Incline Barbell Bench Press',
      target: 'Upper Chest',
      sets: [
        { id: '1-1', setNum: 1, weight: 85, reps: 8, done: true },
        { id: '1-2', setNum: 2, weight: 90, reps: 8, done: true },
        { id: '1-3', setNum: 3, weight: 92.5, reps: 8, done: false },
        { id: '1-4', setNum: 4, weight: 92.5, reps: 7, done: false },
      ],
    },
    {
      id: '2',
      name: 'Chest-Supported T-Bar Row',
      target: 'Latissimus Dorsi',
      sets: [
        { id: '2-1', setNum: 1, weight: 60, reps: 10, done: true },
        { id: '2-2', setNum: 2, weight: 65, reps: 10, done: false },
        { id: '2-3', setNum: 3, weight: 65, reps: 10, done: false },
      ],
    },
    {
      id: '3',
      name: 'Standing DB Lateral Raise',
      target: 'Side Deltoids',
      sets: [
        { id: '3-1', setNum: 1, weight: 16, reps: 15, done: false },
        { id: '3-2', setNum: 2, weight: 16, reps: 15, done: false },
        { id: '3-3', setNum: 3, weight: 16, reps: 14, done: false },
      ],
    },
  ])

  // Stopwatch effect
  useEffect(() => {
    let timer = null
    if (isRunning) {
      timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning])

  useEffect(() => {
    let restTimer = null
    if (restRunning && restSeconds > 0) {
      restTimer = setInterval(() => {
        setRestSeconds(s => {
          if (s <= 1) {
            setRestRunning(false)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(restTimer)
  }, [restRunning, restSeconds])

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const s = secs % 60
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const startRestTimer = (seconds) => {
    setRestSeconds(seconds)
    setRestRunning(true)
  }

  // Toggle Set Complete
  const handleToggleSet = (exId, setId) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId) return ex
      return {
        ...ex,
        sets: ex.sets.map(s => {
          if (s.id !== setId) return s
          const isNowDone = !s.done
          // update total session volume
          const setVolume = s.weight * s.reps
          if (setActiveVolume) {
            setActiveVolume(v => isNowDone ? v + setVolume : v - setVolume)
          }
          if (isNowDone) {
            startRestTimer(90) // Auto-trigger 90s rest timer
          }
          return { ...s, done: isNowDone }
        })
      }
    }))
  }

  // Update Set Weight or Reps
  const handleUpdateSet = (exId, setId, field, val) => {
    const num = parseFloat(val) || 0
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId) return ex
      return {
        ...ex,
        sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: num } : s)
      }
    }))
  }

  // Calculate total completed sets
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  const completedSets = exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.done).length, 0)

  return (
    <div className="space-y-8">

      {/* Top Session Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stopwatch Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Timer size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Elapsed Time</p>
              <p className="text-2xl font-black text-white tracking-tight">{formatTime(elapsedSeconds)}</p>
            </div>
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>

        {/* Rest Interval Timer Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${restRunning ? 'bg-teal-500/20 text-teal-300 border-teal-500 animate-pulse' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rest Countdown</p>
              <p className="text-2xl font-black text-teal-400 tracking-tight">
                {restSeconds > 0 ? `${restSeconds}s` : 'Ready'}
              </p>
            </div>
          </div>

          <div className="flex gap-1">
            {[60, 90, 120].map(s => (
              <button
                key={s}
                onClick={() => startRestTimer(s)}
                className="px-2 py-1 text-[10px] font-bold rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        {/* Total Volume Accumulated Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Dumbbell size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Volume</p>
              <p className="text-2xl font-black text-emerald-400 tracking-tight">
                {(activeVolume || 14850).toLocaleString()} <span className="text-xs text-slate-400 font-semibold">kg</span>
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {completedSets} / {totalSets} Sets
          </span>
        </div>
      </div>

      {/* Exercises Queue & Set Logging */}
      <div className="space-y-6">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-extrabold text-white">{exercise.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-teal-400">
                  {exercise.target}
                </span>
              </div>

              <span className="text-xs text-slate-500 font-semibold">
                Auto Rest: 90s on completion
              </span>
            </div>

            {/* Sets Table Header */}
            <div className="grid grid-cols-12 gap-2 text-[11px] font-extrabold uppercase text-slate-500 px-3">
              <span className="col-span-2">Set</span>
              <span className="col-span-4">Load (kg)</span>
              <span className="col-span-4">Reps</span>
              <span className="col-span-2 text-right">Complete</span>
            </div>

            {/* Set Rows */}
            <div className="space-y-2">
              {exercise.sets.map((set) => (
                <div
                  key={set.id}
                  className={`
                    grid grid-cols-12 gap-2 items-center p-3 rounded-xl border transition-all
                    ${set.done
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-200'
                    }
                  `}
                >
                  <span className="col-span-2 text-xs font-bold text-slate-400">
                    Set {set.setNum}
                  </span>

                  <div className="col-span-4 flex items-center gap-1.5">
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => handleUpdateSet(exercise.id, set.id, 'weight', e.target.value)}
                      className="w-16 py-1 px-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-500">kg</span>
                  </div>

                  <div className="col-span-4 flex items-center gap-1.5">
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => handleUpdateSet(exercise.id, set.id, 'reps', e.target.value)}
                      className="w-16 py-1 px-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-500">reps</span>
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => handleToggleSet(exercise.id, set.id)}
                      className={`
                        p-2 rounded-xl transition-all cursor-pointer
                        ${set.done
                          ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-500 border border-slate-800'
                        }
                      `}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
