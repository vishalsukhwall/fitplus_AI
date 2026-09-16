/**
 * Sidebar.jsx — Elite Spacious Navigation Sidebar
 * Design: Titanium Minimalist Deep Space
 * ─────────────────────────────────────────────────────
 * Width:      288px (18rem)
 * BG:         #09090b (--bg-dark)
 * Border-R:   1px solid #1e293b (--border)
 * Padding:    40px (sides/top)
 * Item Gap:   8px
 * Height:     100vh fixed
 *
 * Sections:
 *   Brand header  — Logo + wordmark + version badge
 *   Nav items     — Icon + label + optional badge
 *   AI Coach card — Prompt card with launch CTA
 *   Telemetry row — Device sync status
 *   User footer   — Avatar + name + tier
 *
 * Active state uses cyan (--accent-cyan) tokens.
 * All emerald/teal from old design is replaced with cyan/purple.
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Dumbbell, Utensils, Timer,
  BarChart3, Settings, Zap, X, Sparkles, ChevronRight,
  ScanLine,
} from 'lucide-react'

/* ─── Navigation Items ─────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',           icon: LayoutDashboard, badge: null       },
  { id: 'generator', label: 'AI Workout Generator', icon: Dumbbell,        badge: 'AI'       },
  { id: 'macros',    label: 'Macro Tracker',        icon: Utensils,        badge: 'Active'   },
  { id: 'scanner',   label: 'Food Scanner',         icon: ScanLine,        badge: 'New'      },
  { id: 'logger',    label: 'Workout Logger',       icon: Timer,           badge: 'Live'     },
  { id: 'analytics', label: 'Analytics',            icon: BarChart3,       badge: null       },
  { id: 'settings',  label: 'Settings',             icon: Settings,        badge: null       },
]

/* ─── Badge color map ──────────────────────────────────────── */
const BADGE_STYLES = {
  Live:   { background: 'rgba(0,217,255,0.1)',  border: '1px solid rgba(0,217,255,0.3)',  color: 'var(--accent-cyan)'  },
  AI:     { background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--accent-purple)' },
  Active: { background: 'rgba(0,208,132,0.1)',  border: '1px solid rgba(0,208,132,0.3)',  color: 'var(--success)'      },
  New:    { background: 'rgba(0,217,255,0.1)',  border: '1px solid rgba(0,217,255,0.25)', color: 'var(--accent-cyan)'  },
}

/* ─── Single Nav Item ──────────────────────────────────────── */
function NavItem({ id, label, icon: Icon, badge, isActive, onClick }) {
  const [hovered, setHovered] = React.useState(false)
  const badgeStyle = badge ? (BADGE_STYLES[badge] ?? BADGE_STYLES.Active) : null

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '10px', padding: '0 14px', height: '48px',
        borderRadius: 0, cursor: 'pointer', border: '1px solid',
        // Active vs default vs hover
        background: isActive
          ? 'rgba(0,217,255,0.08)'
          : hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderColor: isActive
          ? 'rgba(0,217,255,0.25)'
          : hovered ? 'var(--border)' : 'transparent',
        boxShadow: isActive ? '0 0 20px rgba(0,217,255,0.06)' : 'none',
        color: isActive ? 'var(--accent-cyan)' : hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontSize: 'var(--text-sm)', fontWeight: isActive ? 600 : 400,
        transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
        textAlign: 'left',
      }}
    >
      {/* Icon + Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icon
          size={18}
          color={isActive ? 'var(--accent-cyan)' : hovered ? 'var(--text-primary)' : 'var(--text-secondary)'}
          aria-hidden="true"
        />
        <span>{label}</span>
      </div>

      {/* Badge */}
      {badge && (
        <span
          style={{
            fontSize: '10px', fontWeight: 700, padding: '1px 8px',
            borderRadius: 0, flexShrink: 0,
            ...badgeStyle,
            ...(badge === 'Live' ? { animation: 'none' } : {}),
          }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

/* ─── AI Coach Prompt Card ─────────────────────────────────── */
function AICoachCard({ onOpen }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      style={{
        padding: '20px',
        background: hovered ? 'rgba(0,217,255,0.04)' : 'rgba(15,15,26,0.6)',
        border: '1px solid',
        borderColor: hovered ? 'rgba(0,217,255,0.3)' : 'rgba(0,217,255,0.15)',
        boxShadow: hovered ? '0 0 20px rgba(0,217,255,0.08)' : 'none',
        transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
        <Sparkles size={13} color="var(--accent-cyan)" aria-hidden="true" />
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          AI Coach Active
        </span>
      </div>

      {/* Body */}
      <p style={{
        fontSize: 'var(--text-xs)', color: 'var(--text-secondary)',
        lineHeight: 1.55, margin: 0, marginBottom: '14px', maxWidth: 'none',
      }}>
        Ask about form, food substitutions, recovery or personalized programming.
      </p>

      {/* CTA */}
      <button
        onClick={onOpen}
        style={{
          width: '100%', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.3)',
          color: 'var(--accent-cyan)', fontSize: 'var(--text-xs)', fontWeight: 600,
          borderRadius: 0, cursor: 'pointer',
          transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,217,255,0.16)'
          e.currentTarget.style.boxShadow = '0 0 15px rgba(0,217,255,0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,217,255,0.1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        Launch Assistant
        <ChevronRight size={12} aria-hidden="true" />
      </button>
    </div>
  )
}

/* ─── Device Telemetry Row ─────────────────────────────────── */
function TelemetryRow() {
  return (
    <div
      style={{
        padding: '14px 16px',
        background: 'transparent',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '4px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Ping dot */}
          <span style={{ position: 'relative', width: '8px', height: '8px', display: 'inline-flex' }}>
            <span style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'var(--success)', opacity: 0.6,
              animation: 'ping-live 1.8s cubic-bezier(0,0,0.2,1) infinite',
            }} />
            <span style={{
              position: 'relative', display: 'block',
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--success)',
            }} />
          </span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-primary)' }}>
            Apple Watch Ultra
          </span>
        </div>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--success)', letterSpacing: '0.06em' }}>
          LIVE
        </span>
      </div>
      <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: 0, maxWidth: 'none' }}>
        Sync: 18ms · HRV 78ms · BPM 62
      </p>
    </div>
  )
}

/* ─── User Profile Footer ──────────────────────────────────── */
function UserFooter() {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Avatar */}
        <div
          style={{
            width: '36px', height: '36px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,217,255,0.08)',
            border: '1px solid rgba(0,217,255,0.25)',
            borderRadius: 0,
            fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--accent-cyan)',
          }}
        >
          AR
        </div>
        <div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
            Alex Rivera
          </p>
          <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent-purple)', margin: 0, marginTop: '1px' }}>
            Pro Athlete Tier
          </p>
        </div>
      </div>

      {/* Version badge */}
      <span
        style={{
          fontSize: '10px', fontWeight: 700, padding: '3px 8px',
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', borderRadius: 0,
          letterSpacing: '0.04em',
        }}
      >
        v3.5
      </span>
    </div>
  )
}

/* ─── Main Sidebar ─────────────────────────────────────────── */
export default function Sidebar({
  activeView,
  setActiveView,
  mobileOpen,
  setMobileOpen,
  onOpenCoach,
}) {
  const handleNav = (id) => {
    setActiveView(id)
    setMobileOpen(false)
  }

  return (
    <>
      {/* ── Mobile Backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(4px)',
            }}
            className="lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar Panel ── */}
      <aside
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0,
          zIndex: 50, width: '288px',
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg-dark)',
          borderRight: '1px solid var(--border)',
          transition: 'transform 300ms cubic-bezier(0.22,1,0.36,1)',
        }}
        className={`lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Sidebar navigation"
      >

        {/* ── Brand Header ── */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', height: '72px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Logo mark */}
            <div
              style={{
                width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,217,255,0.08)',
                border: '1px solid rgba(0,217,255,0.25)',
                borderRadius: 0,
              }}
            >
              <Zap size={18} color="var(--accent-cyan)" fill="var(--accent-cyan)" aria-hidden="true" />
            </div>

            {/* Wordmark */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                  FitPulse
                </span>
                <span className="text-cyan-gradient" style={{ fontSize: 'var(--text-base)', fontWeight: 700, letterSpacing: '-0.3px' }}>
                  Elite
                </span>
              </div>
              <p style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                AI Command Center
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px',
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 0, cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <div
          style={{
            flex: 1, overflowY: 'auto',
            padding: '24px 16px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}
        >
          {/* Section label */}
          <p
            style={{
              fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '0 14px', marginBottom: '8px',
            }}
          >
            Navigation
          </p>

          {NAV_ITEMS.map(({ id, label, icon, badge }) => (
            <NavItem
              key={id}
              id={id}
              label={label}
              icon={icon}
              badge={badge}
              isActive={activeView === id || (activeView === 'overview' && id === 'dashboard')}
              onClick={() => handleNav(id)}
            />
          ))}

          {/* AI Coach card */}
          <div style={{ marginTop: '24px' }}>
            <AICoachCard onOpen={onOpenCoach} />
          </div>
        </div>

        {/* ── Telemetry ── */}
        <TelemetryRow />

        {/* ── User footer ── */}
        <UserFooter />
      </aside>
    </>
  )
}
