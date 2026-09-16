/**
 * Header.jsx — Elite Top Navigation Bar
 * Design: Titanium Minimalist Deep Space
 * ─────────────────────────────────────────────────────
 * Height:   72px
 * Padding:  0 40px
 * BG:       rgba(9,9,11,0.92) + blur(20px)
 * Border:   1px solid #1e293b (bottom)
 *
 * Layout:
 *   LEFT  — Mobile menu toggle + View breadcrumb + title
 *   RIGHT — Status pill | AI Coach button | Notifications
 *
 * All colors use CSS custom properties from index.css
 */

import React from 'react'
import { motion } from 'framer-motion'
import {
  Menu, Sparkles, Bell, HeartPulse, ChevronRight,
} from 'lucide-react'

/* ─── View Metadata Map ─────────────────────────────────────── */
const VIEW_META = {
  dashboard: { title: 'Dashboard',            section: 'Workspace' },
  overview:  { title: 'Dashboard',            section: 'Workspace' },
  generator: { title: 'AI Workout Generator', section: 'AI Models' },
  macros:    { title: 'Macro & Calorie Tracker', section: 'Nutrition' },
  logger:    { title: 'Workout Logger',        section: 'Active Session' },
  analytics: { title: 'Analytics & Trends',   section: 'Telemetry' },
  settings:  { title: 'Settings & Profile',   section: 'Configuration' },
  scanner:   { title: 'Food Scanner',         section: 'Nutrition' },
}

/* ─── Notification Dot ──────────────────────────────────────── */
function NotifDot() {
  return (
    <span
      style={{
        position: 'absolute', top: '9px', right: '9px',
        width: '6px', height: '6px', borderRadius: '50%',
        background: 'var(--accent-cyan)',
        boxShadow: '0 0 6px rgba(0,217,255,0.8)',
      }}
      aria-hidden="true"
    />
  )
}

/* ─── Status Pill — shows live metric ──────────────────────── */
function StatusPill() {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '0 14px', height: '36px',
        background: 'rgba(15,15,26,0.8)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Live ping dot */}
      <span style={{ position: 'relative', width: '8px', height: '8px', display: 'inline-flex' }}>
        <span
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'var(--success)', opacity: 0.7,
            animation: 'ping-live 1.8s cubic-bezier(0,0,0.2,1) infinite',
          }}
        />
        <span
          style={{
            position: 'relative', display: 'block',
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--success)',
          }}
        />
      </span>
      <HeartPulse size={13} color="var(--success)" aria-hidden="true" />
      <span
        style={{
          fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500,
        }}
      >
        Recovery:&nbsp;
        <span style={{ color: 'var(--success)', fontWeight: 600 }}>94% Optimal</span>
      </span>
    </div>
  )
}

/* ─── AI Coach Button ───────────────────────────────────────── */
function AICoachButton({ onClick }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Open AI Coach"
      style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '0 16px', height: '36px',
        background: hovered ? 'rgba(0,217,255,0.12)' : 'rgba(0,217,255,0.06)',
        border: '1px solid',
        borderColor: hovered ? 'rgba(0,217,255,0.5)' : 'rgba(0,217,255,0.25)',
        color: 'var(--accent-cyan)',
        fontSize: 'var(--text-xs)', fontWeight: 600,
        borderRadius: 0, cursor: 'pointer',
        boxShadow: hovered ? '0 0 20px rgba(0,217,255,0.15)' : 'none',
        transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
        whiteSpace: 'nowrap',
      }}
    >
      <Sparkles size={13} aria-hidden="true" />
      <span className="hidden sm:inline">Ask AI Coach</span>
      <span className="sm:hidden">AI</span>
    </button>
  )
}

/* ─── Notifications Button ──────────────────────────────────── */
function NotificationsButton() {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      aria-label="Notifications"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '40px', height: '40px',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: '1px solid',
        borderColor: hovered ? 'var(--border)' : 'var(--border)',
        borderRadius: 0, cursor: 'pointer',
        color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <Bell size={16} aria-hidden="true" />
      <NotifDot />
    </button>
  )
}

/* ─── Mobile Menu Toggle ────────────────────────────────────── */
function MobileToggle({ onClick }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Open sidebar navigation"
      className="lg:hidden"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '40px', height: '40px',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: '1px solid var(--border)',
        borderRadius: 0, cursor: 'pointer',
        color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
      }}
    >
      <Menu size={18} aria-hidden="true" />
    </button>
  )
}

/* ─── Main Header ───────────────────────────────────────────── */
export default function Header({ activeView, setMobileOpen, onOpenCoach }) {
  const meta = VIEW_META[activeView] ?? VIEW_META.dashboard

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 30,
        height: '72px',
        background: 'rgba(9,9,11,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', gap: '16px',
      }}
    >
      {/* ── LEFT: Toggle + Breadcrumb + Title ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
        <MobileToggle onClick={() => setMobileOpen(true)} />

        <div style={{ minWidth: 0 }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: 'var(--text-xs)', fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: '2px',
            }}
          >
            <span>{meta.section}</span>
            <ChevronRight size={11} aria-hidden="true" />
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{meta.title}</span>
          </div>

          {/* Page title */}
          <motion.h1
            key={activeView}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              fontSize: 'var(--text-lg)', fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.3px', lineHeight: 1.2,
              margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {meta.title}
          </motion.h1>
        </div>
      </div>

      {/* ── RIGHT: Status | AI Coach | Notifs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* Status pill — hidden on mobile */}
        <div className="hidden md:flex">
          <StatusPill />
        </div>

        {/* AI Coach CTA */}
        <AICoachButton onClick={onOpenCoach} />

        {/* Notifications */}
        <NotificationsButton />
      </div>
    </header>
  )
}
