import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar             from './components/Sidebar'
import Header              from './components/Header'
import Dashboard           from './components/Dashboard'
import WorkoutGenerator    from './components/WorkoutGenerator'
import MacroTracker        from './components/MacroTracker'
import WorkoutLogger       from './components/WorkoutLogger'
import BiometricAnalytics  from './components/BiometricAnalytics'
import SettingsView        from './components/SettingsView'
import AICoachModal        from './components/AICoachModal'
import { Sparkles } from 'lucide-react'

export default function App() {
  const [activeView, setActiveView] = useState('dashboard') // 'dashboard' | 'generator' | 'macros' | 'logger' | 'analytics' | 'settings'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCoachOpen, setIsCoachOpen] = useState(false)
  const [activeVolume, setActiveVolume] = useState(14850)

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans flex relative overflow-x-hidden">

      {/* Cybernetic Dot-Grid Mesh Background */}
      <div className="grid-bg fixed inset-0 pointer-events-none z-0 opacity-80" />

      {/* Ambient Morphing Glow Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="blob-glow bg-emerald-500/20"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 700, height: 700, top: -200, left: 100 }}
        />
        <motion.div
          className="blob-glow bg-teal-500/15"
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 50, -40, 0],
            scale: [1, 1.15, 1, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 600, height: 600, bottom: -100, right: 100 }}
        />
      </div>

      {/* SaaS Dashboard Persistent Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenCoach={() => setIsCoachOpen(true)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen relative z-10">

        {/* Top Header Navigation Bar */}
        <Header
          activeView={activeView}
          setMobileOpen={setMobileOpen}
          onOpenCoach={() => setIsCoachOpen(true)}
        />

        {/* Workspace Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {(activeView === 'dashboard' || activeView === 'overview') && (
                <Dashboard
                  setActiveView={setActiveView}
                  onOpenCoach={() => setIsCoachOpen(true)}
                  activeVolume={activeVolume}
                  setActiveVolume={setActiveVolume}
                />
              )}

              {activeView === 'generator' && (
                <WorkoutGenerator
                  setActiveView={setActiveView}
                  onOpenCoach={() => setIsCoachOpen(true)}
                />
              )}

              {activeView === 'macros' && (
                <MacroTracker />
              )}

              {activeView === 'logger' && (
                <WorkoutLogger
                  activeVolume={activeVolume}
                  setActiveVolume={setActiveVolume}
                />
              )}

              {activeView === 'analytics' && (
                <BiometricAnalytics />
              )}

              {activeView === 'settings' && (
                <SettingsView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Action Button for AI Coach (Global Access) */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsCoachOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-black font-extrabold shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2 cursor-pointer"
        aria-label="Open AI Assistant"
      >
        <Sparkles size={18} />
        <span className="text-xs font-black hidden sm:inline">AI Coach</span>
      </motion.button>

      {/* Global AI Coach Chat Drawer */}
      <AICoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
      />

    </div>
  )
}
