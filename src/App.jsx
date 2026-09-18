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
import ErrorBoundary       from './components/ErrorBoundary'
import FoodScanner         from './components/Scanner/FoodScanner'
import { Sparkles } from 'lucide-react'

export default function App() {
  const [activeView, setActiveView] = useState('dashboard') // 'dashboard' | 'generator' | 'macros' | 'logger' | 'analytics' | 'settings'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCoachOpen, setIsCoachOpen] = useState(false)
  const [activeVolume, setActiveVolume] = useState(14850)

  return (
    <ErrorBoundary section="App" icon="🏋️">
    <div className="min-h-screen text-slate-100 font-sans flex relative overflow-x-hidden" style={{ background: 'var(--bg-dark, #09090b)' }}>

      {/* Cyber Dot-Grid Mesh Background */}
      <div className="grid-bg fixed inset-0 pointer-events-none z-0 opacity-60" />

      {/* Ambient Glow Blobs — Cyan + Purple */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="blob-glow"
          style={{ background: 'rgba(0,217,255,0.15)', width: 600, height: 600, top: -150, left: 80 }}
          animate={{ x: [0, 40, -25, 0], y: [0, -30, 25, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="blob-glow"
          style={{ background: 'rgba(167,139,250,0.12)', width: 500, height: 500, bottom: -80, right: 80 }}
          animate={{ x: [0, -50, 30, 0], y: [0, 40, -35, 0], scale: [1, 1.1, 1, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Persistent Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenCoach={() => setIsCoachOpen(true)}
      />

      {/* Main Content Column */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen relative z-10">

        {/* Top Navigation Bar */}
        <Header
          activeView={activeView}
          setMobileOpen={setMobileOpen}
          onOpenCoach={() => setIsCoachOpen(true)}
        />

 
        {/* Workspace Dynamic Content Area */}
        <main style={{ padding: '32px 40px', maxWidth: '1280px', width: '100%', margin: '0 auto', flex: 1 }}
              className="sm:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {(activeView === 'dashboard' || activeView === 'overview') && (
                <ErrorBoundary section="Dashboard" icon="📊">
                  <Dashboard
                    setActiveView={setActiveView}
                    onOpenCoach={() => setIsCoachOpen(true)}
                    activeVolume={activeVolume}
                    setActiveVolume={setActiveVolume}
                  />
                </ErrorBoundary>
              )}

              {activeView === 'generator' && (
                <ErrorBoundary section="Workout Generator" icon="🏋️">
                  <WorkoutGenerator
                    setActiveView={setActiveView}
                    onOpenCoach={() => setIsCoachOpen(true)}
                  />
                </ErrorBoundary>
              )}

              {activeView === 'macros' && (
                <ErrorBoundary section="Macro Tracker" icon="🔬">
                  <MacroTracker />
                </ErrorBoundary>
              )}

              {activeView === 'scanner' && (
                <ErrorBoundary section="Food Scanner" icon="📷">
                  <FoodScanner />
                </ErrorBoundary>
              )}

              {activeView === 'logger' && (
                <ErrorBoundary section="Workout Logger" icon="📝">
                  <WorkoutLogger
                    activeVolume={activeVolume}
                    setActiveVolume={setActiveVolume}
                  />
                </ErrorBoundary>
              )}

              {activeView === 'analytics' && (
                <ErrorBoundary section="Biometric Analytics" icon="📈">
                  <BiometricAnalytics />
                </ErrorBoundary>
              )}

              {activeView === 'settings' && (
                <ErrorBoundary section="Settings" icon="⚙️">
                  <SettingsView />
                </ErrorBoundary>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI Coach Button — Global Access */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCoachOpen(true)}
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 40,
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '0 20px', height: '48px',
          background: 'var(--accent-cyan, #00d9ff)',
          color: 'var(--bg-dark, #09090b)',
          border: 'none', borderRadius: 0, cursor: 'pointer',
          fontSize: 'var(--text-sm, 0.875rem)', fontWeight: 700,
          boxShadow: '0 0 30px rgba(0,217,255,0.35)',
        }}
        aria-label="Open AI Assistant"
      >
        <Sparkles size={16} aria-hidden="true" />
        <span className="hidden sm:inline">AI Coach</span>
      </motion.button>

      {/* Global AI Coach Chat Drawer */}
      <AICoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
      />

    </div>
    </ErrorBoundary>
  )
}
