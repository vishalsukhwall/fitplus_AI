import React from 'react'
import { motion } from 'framer-motion'
import {
  Menu, Search, Sparkles, Bell, HeartPulse,
  Flame, ChevronRight, Zap
} from 'lucide-react'

const VIEW_TITLES = {
  dashboard: { title: 'Dashboard & Telemetry Center',  breadcrumb: 'Workspace / Dashboard' },
  overview:  { title: 'Dashboard & Telemetry Center',  breadcrumb: 'Workspace / Dashboard' },
  generator: { title: 'AI Workout Generator Engine',   breadcrumb: 'AI Models / Workout Generator' },
  macros:    { title: 'Macro & Calorie Tracker',       breadcrumb: 'Nutrition / Macro & Calorie Engine' },
  logger:    { title: 'Workout Session Logger',        breadcrumb: 'Active Session / Live Telemetry' },
  analytics: { title: 'Analytics & Trends',            breadcrumb: 'Telemetry / Biometric Analytics' },
  settings:  { title: 'Settings & Profile',            breadcrumb: 'Configuration / Hardware Settings' },
}

export default function Header({
  activeView,
  setMobileOpen,
  onOpenCoach
}) {
  const current = VIEW_TITLES[activeView] || VIEW_TITLES.dashboard

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#030712]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <span>Workspace</span>
            <ChevronRight size={12} />
            <span className="text-emerald-400 font-bold">{current.breadcrumb}</span>
          </div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
            {current.title}
          </h1>
        </div>
      </div>

      {/* Right: Quick Search, Telemetry, and AI Coach Trigger */}
      <div className="flex items-center gap-3">
        {/* Real-time Telemetry Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <HeartPulse size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-medium">Recovery:</span>
          <span className="text-emerald-400 font-extrabold">94% Optimal</span>
        </div>

        {/* Ask AI Coach Quick Action Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenCoach}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer"
        >
          <Sparkles size={14} className="text-emerald-400" />
          <span className="hidden sm:inline">Ask AI Coach</span>
          <span className="sm:hidden">AI Coach</span>
        </motion.button>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      </div>
    </header>
  )
}
