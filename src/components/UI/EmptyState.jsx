/**
 * EmptyState.jsx — Designed Zero-State Component
 * ─────────────────────────────────────────────────
 * Replaces null / bare empty returns across all sections.
 * Never returns null — always renders a themed placeholder.
 *
 * Props:
 *   icon     {string|ReactNode}  — emoji or Lucide icon
 *   title    {string}            — headline (required)
 *   message  {string}            — subtext (optional)
 *   action   {{ label, onClick }} — optional CTA button
 */
import React from 'react'

export function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '48px 24px',
        gap:            '12px',
        textAlign:      'center',
        color:          'var(--text-secondary, #64748b)',
        border:         '1px dashed var(--border, #1e293b)',
        background:     'var(--bg-secondary, #0f0f1a)',
        width:          '100%',
      }}
    >
      {/* Icon */}
      <span style={{ fontSize: '32px', lineHeight: 1 }} aria-hidden="true">
        {icon}
      </span>

      {/* Title */}
      <p
        style={{
          fontSize:   'var(--text-base, 1rem)',
          fontWeight: 600,
          color:      'var(--text-primary, #e8eaed)',
          margin:     0,
        }}
      >
        {title}
      </p>

      {/* Message */}
      {message && (
        <p style={{ fontSize: 'var(--text-sm, 0.875rem)', margin: 0, maxWidth: '360px' }}>
          {message}
        </p>
      )}

      {/* Optional CTA */}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop:   '8px',
            padding:     '0 20px',
            height:      '36px',
            background:  'transparent',
            border:      '1px solid var(--accent-cyan, #00d9ff)',
            color:       'var(--accent-cyan, #00d9ff)',
            cursor:      'pointer',
            fontSize:    'var(--text-sm, 0.875rem)',
            fontWeight:  600,
            letterSpacing: '0.02em',
            transition:  'background 200ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,217,255,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState
