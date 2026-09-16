/**
 * Card.jsx — Elite Glassmorphic Card Component System
 * Design: Titanium Minimalist Deep Space
 * ─────────────────────────────────────────────────────
 * Variants: default | flat | highlight | danger | success
 * Sub-components: Card.Header | Card.Body | Card.Footer | Card.Divider | Card.Stat
 */

import React from 'react'

/* ─── Variant Style Map ─────────────────────────────────── */
const VARIANTS = {
  default: {
    base: {
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      color: 'var(--text-primary)',
      transition: 'box-shadow 200ms cubic-bezier(0.4,0,0.2,1), transform 200ms cubic-bezier(0.4,0,0.2,1)',
    },
    hover: { boxShadow: '0 0 30px rgba(0,217,255,0.15)', transform: 'translateY(-2px)' },
  },
  flat: {
    base: {
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      color: 'var(--text-primary)',
    },
    hover: {},
  },
  highlight: {
    base: {
      background: 'rgba(0,217,255,0.04)',
      border: '1px solid rgba(0,217,255,0.3)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 0 20px rgba(0,217,255,0.08)',
      color: 'var(--text-primary)',
      transition: 'box-shadow 200ms cubic-bezier(0.4,0,0.2,1), transform 200ms cubic-bezier(0.4,0,0.2,1)',
    },
    hover: { boxShadow: '0 0 40px rgba(0,217,255,0.2)', transform: 'translateY(-2px)' },
  },
  danger: {
    base: {
      background: 'rgba(255,0,110,0.04)',
      border: '1px solid rgba(255,0,110,0.25)',
      backdropFilter: 'blur(20px)',
      color: 'var(--text-primary)',
      transition: 'box-shadow 200ms cubic-bezier(0.4,0,0.2,1)',
    },
    hover: { boxShadow: '0 0 20px rgba(255,0,110,0.15)' },
  },
  success: {
    base: {
      background: 'rgba(0,208,132,0.04)',
      border: '1px solid rgba(0,208,132,0.25)',
      backdropFilter: 'blur(20px)',
      color: 'var(--text-primary)',
      transition: 'box-shadow 200ms cubic-bezier(0.4,0,0.2,1)',
    },
    hover: { boxShadow: '0 0 20px rgba(0,208,132,0.15)' },
  },
}

/* ─── Root Card ────────────────────────────────────────── */
function Card({
  children,
  variant = 'default',
  padding = '40px',
  hoverable = true,
  className = '',
  style = {},
  onClick,
  as: Tag = 'div',
}) {
  const [hovered, setHovered] = React.useState(false)
  const v = VARIANTS[variant] ?? VARIANTS.default
  const hoverStyle = hoverable && hovered ? v.hover : {}

  return (
    <Tag
      className={className}
      style={{ borderRadius: 0, padding, ...v.base, ...hoverStyle, ...style }}
      onMouseEnter={hoverable ? () => setHovered(true) : undefined}
      onMouseLeave={hoverable ? () => setHovered(false) : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    >
      {children}
    </Tag>
  )
}

/* ─── Card.Header ─────────────────────────────────────── */
function CardHeader({ title, subtitle, icon: Icon, action, className = '' }) {
  return (
    <div
      className={className}
      style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: '16px', marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {Icon && (
          <div style={{
            width: 40, height: 40, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,217,255,0.08)',
            border: '1px solid rgba(0,217,255,0.2)',
          }}>
            <Icon size={20} color="var(--accent-cyan)" />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          {title && (
            <h4 style={{
              fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0,
              color: 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: 1.3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {title}
            </h4>
          )}
          {subtitle && (
            <p style={{
              fontSize: 'var(--text-xs)', color: 'var(--text-secondary)',
              margin: 0, marginTop: '3px', maxWidth: 'none',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}

/* ─── Card.Body ───────────────────────────────────────── */
function CardBody({ children, className = '', style = {} }) {
  return <div className={className} style={style}>{children}</div>
}

/* ─── Card.Footer ────────────────────────────────────── */
function CardFooter({ children, className = '', align = 'right' }) {
  const justifyMap = { right: 'flex-end', left: 'flex-start', between: 'space-between', center: 'center' }
  return (
    <div
      className={className}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        justifyContent: justifyMap[align] ?? 'flex-end',
        marginTop: '24px', paddingTop: '24px',
        borderTop: '1px solid var(--border)',
      }}
    >
      {children}
    </div>
  )
}

/* ─── Card.Divider ───────────────────────────────────── */
function CardDivider({ my = '24px' }) {
  return (
    <hr style={{ border: 'none', height: '1px', background: 'var(--border)', margin: `${my} 0` }} />
  )
}

/* ─── Card.Stat — Large KPI metric display ───────────── */
function CardStat({ label, value, unit, delta, deltaDir = 'neutral', accentColor = 'var(--accent-cyan)' }) {
  const deltaColor =
    deltaDir === 'up'   ? 'var(--success)' :
    deltaDir === 'down' ? 'var(--danger)'  :
    'var(--text-secondary)'
  const deltaArrow = deltaDir === 'up' ? '↑' : deltaDir === 'down' ? '↓' : '→'

  return (
    <div>
      {label && (
        <p style={{
          fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, marginBottom: '6px',
        }}>
          {label}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: 'var(--text-5xl)', fontWeight: 700, letterSpacing: '-1px', lineHeight: 1, color: accentColor }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 400, color: 'var(--text-secondary)' }}>
            {unit}
          </span>
        )}
      </div>
      {delta && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px',
          fontSize: 'var(--text-xs)', fontWeight: 600, color: deltaColor,
        }}>
          {deltaArrow} {delta}
        </span>
      )}
    </div>
  )
}

/* ─── Attach sub-components ─────────────────────────── */
Card.Header  = CardHeader
Card.Body    = CardBody
Card.Footer  = CardFooter
Card.Divider = CardDivider
Card.Stat    = CardStat

export default Card
