import React from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Dumbbell, Utensils, Timer,
  BarChart3, Settings, Zap, HeartPulse, ChevronRight,
  ShieldCheck, X, Sparkles
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',               icon: LayoutDashboard, badge: null },
  { id: 'generator', label: 'AI Workout Generator',    icon: Dumbbell,        badge: 'AI Core' },
  { id: 'macros',    label: 'Macro & Calorie Tracker', icon: Utensils,        badge: 'Active' },
  { id: 'logger',    label: 'Workout Session Logger',  icon: Timer,           badge: 'Live' },
  { id: 'analytics', label: 'Analytics',               icon: BarChart3,       badge: null },
  { id: 'settings',  label: 'Settings',                icon: Settings,        badge: null },
]

export default function Sidebar({
  activeView,
  setActiveView,
  mobileOpen,
  setMobileOpen,
  onOpenCoach
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col
          bg-[#030712] border-r border-slate-800/80 transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Zap size={20} className="text-emerald-400 fill-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">FitPulse</span>
                <span className="text-neon-gradient text-lg font-black">AI</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                SaaS Command Center
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-3">
            Core Workspace Navigation
          </p>

          {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeView === id || (activeView === 'overview' && id === 'dashboard')
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveView(id)
                  setMobileOpen(false)
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold
                  transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{label}</span>
                </div>

                {badge && (
                  <span className={`
                    text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border
                    ${badge === 'Live'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                      : badge === 'Active'
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }
                  `}>
                    {badge}
                  </span>
                )}
              </button>
            )
          })}

          {/* Quick AI Coach Trigger Card */}
          <div className="pt-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-emerald-500/30 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <Sparkles size={14} />
                <span>AI Coach Active</span>
              </div>
              <p className="text-[11.5px] text-slate-400 leading-relaxed mb-3">
                Ask about form corrections, food substitutions, or rest day macros.
              </p>
              <button
                onClick={onOpenCoach}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Launch Assistant</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Hardware Sync Card */}
        <div className="p-4 mx-4 mb-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-slate-300">Apple Watch Ultra</span>
            </span>
            <span className="text-emerald-400 font-bold">LIVE</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Telemetry sync: 18ms latency · HRV 78ms
          </p>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-300">
              AR
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Alex Rivera</p>
              <p className="text-[10.5px] text-emerald-400 font-semibold">Pro Athlete Tier</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
            v3.4
          </span>
        </div>
      </aside>
    </>
  )
}
