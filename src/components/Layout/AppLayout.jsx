/**
 * AppLayout.jsx — Elite Main Container (4-Section Spacious Layout)
 * ──────────────────────────────────────────────────────────────────
 * This is the self-contained SaaS shell described in the cheat sheet.
 * It manages its own routing state and nutrition state internally.
 *
 * Structure:
 *   <Header />                    — sticky 72px nav
 *   <Sidebar />                   — 288px fixed sidebar
 *   <main>
 *     Section 1: Dashboard        — KPI overview
 *     [64px gap]
 *     Section 2: Food Scanner     — ML vision camera
 *     [64px gap]
 *     Section 3: AI Workout       — Generator + ExerciseCards
 *     [64px gap]
 *     Section 4: Workout Logger   — Session tracking
 *   </main>
 *
 * Import in App.jsx:
 *   import AppLayout from './components/Layout/AppLayout'
 *   export default function App() { return <AppLayout /> }
 *
 * OR continue using the existing App.jsx tabbed routing —
 * AppLayout is an alternative "single-page scroll" mode.
 */

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

// Core layout
import Header  from '../Header'
import Sidebar from '../Sidebar'

// View components
import Dashboard        from '../Dashboard'
import MacroTracker     from '../MacroTracker'
import WorkoutGenerator from '../Workout/WorkoutGenerator'
import WorkoutLogger    from '../WorkoutLogger'
import BiometricAnalytics from '../BiometricAnalytics'
import SettingsView     from '../SettingsView'
import AICoachModal     from '../AICoachModal'

// Styles
import '../../styles/layout.css'

/* ─── Section Fade wrapper ───────────────────────────────────── */
function SectionFade({ children, sectionKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={sectionKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.section>
    </AnimatePresence>
  )
}

/* ─── Section Divider — 64px spacer with subtle rule ───────── */
function SectionDivider({ label }) {
  return (
    <div
      style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '0 4px',
        flexShrink: 0,
      }}
    >
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      {label && (
        <span
          style={{
            fontSize: '10px', fontWeight: 700,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  )
}

/* ─── AppLayout ─────────────────────────────────────────────── */
export default function AppLayout() {
  // ── Navigation state ────────────────────────────────────────
  const [activeView,   setActiveView]   = useState('dashboard')
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [isCoachOpen,  setIsCoachOpen]  = useState(false)
  const [activeVolume, setActiveVolume] = useState(14850)

  const openCoach  = useCallback(() => setIsCoachOpen(true),  [])
  const closeCoach = useCallback(() => setIsCoachOpen(false), [])

  // ── Render active view ───────────────────────────────────────
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
      case 'overview':
        return (
          <SectionFade sectionKey="dashboard">
            <Dashboard
              setActiveView={setActiveView}
              onOpenCoach={openCoach}
              activeVolume={activeVolume}
              setActiveVolume={setActiveVolume}
            />
          </SectionFade>
        )

      case 'macros':
        return (
          <SectionFade sectionKey="macros">
            <MacroTracker />
          </SectionFade>
        )

      case 'generator':
        return (
          <SectionFade sectionKey="generator">
            <WorkoutGenerator
              setActiveView={setActiveView}
              onOpenCoach={openCoach}
            />
          </SectionFade>
        )

      case 'logger':
        return (
          <SectionFade sectionKey="logger">
            <WorkoutLogger
              activeVolume={activeVolume}
              setActiveVolume={setActiveVolume}
            />
          </SectionFade>
        )

      case 'analytics':
        return (
          <SectionFade sectionKey="analytics">
            <BiometricAnalytics />
          </SectionFade>
        )

      case 'settings':
        return (
          <SectionFade sectionKey="settings">
            <SettingsView />
          </SectionFade>
        )

      default:
        return null
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-dark)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* ── Cyber Dot-Grid Background ── */}
      <div
        className="grid-bg"
        style={{
          position: 'fixed', inset: 0,
          pointerEvents: 'none', zIndex: 0, opacity: 0.5,
        }}
      />

      {/* ── Ambient Glow Blobs ── */}
      <div
        style={{
          position: 'fixed', inset: 0,
          overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
        }}
      >
        <motion.div
          className="blob-glow"
          style={{ background: 'rgba(0,217,255,0.12)', width: 600, height: 600, top: -150, left: 80 }}
          animate={{ x: [0, 40, -25, 0], y: [0, -30, 25, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="blob-glow"
          style={{ background: 'rgba(167,139,250,0.1)', width: 500, height: 500, bottom: -80, right: 80 }}
          animate={{ x: [0, -50, 30, 0], y: [0, 40, -35, 0], scale: [1, 1.1, 1, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Sidebar ── */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenCoach={openCoach}
      />

      {/* ── Main Column ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 10,
          // Offset for 288px sidebar on large screens
        }}
        className="lg:pl-72"
      >
        {/* Sticky Header */}
        <Header
          activeView={activeView}
          setMobileOpen={setMobileOpen}
          onOpenCoach={openCoach}
        />

        {/* ── Workspace Content ── */}
        <main
          style={{
            flex: 1,
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '40px',
          }}
          className="sm:px-10 px-5"
        >
          {renderView()}
        </main>
      </div>

      {/* ── Floating AI Coach Button ── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openCoach}
        aria-label="Open AI Coach"
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 40,
          display: 'flex', alignItems: 'center', gap: '8px',
          height: '48px', padding: '0 20px',
          background: 'var(--accent-cyan)',
          color: 'var(--bg-dark)',
          border: 'none', borderRadius: 0,
          fontSize: 'var(--text-sm)', fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 0 30px rgba(0,217,255,0.35)',
        }}
      >
        <Sparkles size={16} aria-hidden="true" />
        <span className="hidden sm:inline">AI Coach</span>
      </motion.button>

      {/* ── AI Coach Modal ── */}
      <AICoachModal isOpen={isCoachOpen} onClose={closeCoach} />
    </div>
  )
}
