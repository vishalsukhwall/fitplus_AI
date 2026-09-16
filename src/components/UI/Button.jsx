/**
 * Button.jsx — Elite Button Component System
 * Design: Titanium Minimalist Deep Space
 * ─────────────────────────────────────────────────────
 * Variants:
 *   primary   — Cyber Cyan fill  (#00d9ff)   — main CTAs
 *   secondary — Outlined border              — secondary actions
 *   ghost     — No border, subtle hover      — tertiary / text
 *   success   — Quantum Green fill           — confirm / log meal
 *   danger    — Plasma Red outlined          — destructive actions
 *   icon      — Square icon-only button      — toolbars
 *
 * Sizes:
 *   sm   — height: 36px  padding: 0 16px  text: 12px
 *   md   — height: 48px  padding: 0 28px  text: 14px  (default)
 *   lg   — height: 56px  padding: 0 36px  text: 16px
 *   icon — width/height: 40px
 *
 * Props:
 *   variant, size, disabled, loading, leftIcon, rightIcon,
 *   fullWidth, as (renders as <a>, <button>, etc.)
 */

import React from 'react'

/* ─── Size Tokens ──────────────────────────────────────────── */
const SIZES = {
  sm:   { height: '36px', padding: '0 16px', fontSize: 'var(--text-xs)',  iconSize: 14 },
  md:   { height: '48px', padding: '0 28px', fontSize: 'var(--text-sm)',  iconSize: 16 },
  lg:   { height: '56px', padding: '0 36px', fontSize: 'var(--text-base)', iconSize: 18 },
  icon: { width: '40px',  height: '40px',    padding: '0',               iconSize: 16 },
}

/* ─── Variant Style Factories ─────────────────────────────── */
const VARIANTS = {
  primary: {
    base: {
      background: 'var(--accent-cyan)',
      color: 'var(--bg-dark)',
      border: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
      boxShadow: 'none',
    },
    hover: {
      background: '#33e4ff',
      transform: 'translateY(-2px)',
      boxShadow: '0 0 30px rgba(0,217,255,0.3)',
    },
    active: { transform: 'translateY(0)', boxShadow: 'none' },
    disabled: { background: 'rgba(0,217,255,0.25)', color: 'rgba(9,9,11,0.5)', cursor: 'not-allowed' },
  },
  secondary: {
    base: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      fontWeight: 500,
      backdropFilter: 'blur(12px)',
    },
    hover: {
      borderColor: 'var(--accent-cyan)',
      color: 'var(--accent-cyan)',
      transform: 'translateY(-2px)',
      boxShadow: '0 0 20px rgba(0,217,255,0.2)',
    },
    active: { transform: 'translateY(0)', boxShadow: 'none' },
    disabled: { opacity: 0.4, cursor: 'not-allowed' },
  },
  ghost: {
    base: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: 'none',
      fontWeight: 500,
    },
    hover: {
      color: 'var(--text-primary)',
      background: 'rgba(255,255,255,0.04)',
    },
    active: { background: 'rgba(255,255,255,0.08)' },
    disabled: { opacity: 0.4, cursor: 'not-allowed' },
  },
  success: {
    base: {
      background: 'var(--success)',
      color: 'var(--bg-dark)',
      border: 'none',
      fontWeight: 600,
    },
    hover: {
      background: '#00ec93',
      transform: 'translateY(-2px)',
      boxShadow: '0 0 30px rgba(0,208,132,0.3)',
    },
    active: { transform: 'translateY(0)', boxShadow: 'none' },
    disabled: { background: 'rgba(0,208,132,0.3)', color: 'rgba(9,9,11,0.5)', cursor: 'not-allowed' },
  },
  danger: {
    base: {
      background: 'transparent',
      color: 'var(--danger)',
      border: '1px solid rgba(255,0,110,0.4)',
      fontWeight: 500,
    },
    hover: {
      background: 'rgba(255,0,110,0.08)',
      borderColor: 'var(--danger)',
      boxShadow: '0 0 20px rgba(255,0,110,0.2)',
      transform: 'translateY(-2px)',
    },
    active: { transform: 'translateY(0)', boxShadow: 'none' },
    disabled: { opacity: 0.4, cursor: 'not-allowed' },
  },
  icon: {
    base: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)',
      fontWeight: 400,
    },
    hover: {
      color: 'var(--text-primary)',
      borderColor: 'var(--accent-cyan)',
      boxShadow: '0 0 20px rgba(0,217,255,0.2)',
    },
    active: { boxShadow: 'none' },
    disabled: { opacity: 0.4, cursor: 'not-allowed' },
  },
}

/* ─── Spinner ────────────────────────────────────────────── */
function Spinner({ size = 16, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
      aria-hidden="true"
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

/* ─── Root Button Component ──────────────────────────────── */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className = '',
  style = {},
  as: Tag = 'button',
  type = 'button',
  onClick,
  href,
  'aria-label': ariaLabel,
  ...rest
}) {
  const [hovered, setHovered]   = React.useState(false)
  const [pressed, setPressed]   = React.useState(false)

  const v = VARIANTS[variant] ?? VARIANTS.primary
  const s = SIZES[size === 'icon' || variant === 'icon' ? 'icon' : size] ?? SIZES.md

  const isDisabled = disabled || loading

  // Build composed style
  let composedStyle = {
    // Layout
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: fullWidth ? '100%' : (s.width ?? 'auto'),
    height: s.height,
    padding: s.padding,
    // Shape
    borderRadius: 0,
    // Typography
    fontFamily: 'var(--font-sans)',
    fontSize: s.fontSize,
    lineHeight: 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    // Transitions
    transition: 'background 200ms cubic-bezier(0.4,0,0.2,1), border-color 200ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms cubic-bezier(0.4,0,0.2,1), color 200ms cubic-bezier(0.4,0,0.2,1), transform 200ms cubic-bezier(0.4,0,0.2,1)',
    // Reset
    outline: 'none',
    position: 'relative',
    // Variant base
    ...v.base,
  }

  if (isDisabled) {
    composedStyle = { ...composedStyle, ...v.disabled }
  } else if (pressed) {
    composedStyle = { ...composedStyle, ...v.hover, ...v.active }
  } else if (hovered) {
    composedStyle = { ...composedStyle, ...v.hover }
  }

  // External style overrides
  composedStyle = { ...composedStyle, ...style }

  const iconSize = s.iconSize

  const tagProps = {
    className,
    style: composedStyle,
    onMouseEnter: () => !isDisabled && setHovered(true),
    onMouseLeave: () => { setHovered(false); setPressed(false) },
    onMouseDown:  () => !isDisabled && setPressed(true),
    onMouseUp:    () => setPressed(false),
    onClick: isDisabled ? undefined : onClick,
    'aria-label': ariaLabel,
    'aria-disabled': isDisabled,
    ...rest,
  }

  if (Tag === 'button') {
    tagProps.type = type
    tagProps.disabled = isDisabled
  } else if (Tag === 'a') {
    tagProps.href = isDisabled ? undefined : href
  }

  return (
    <Tag {...tagProps}>
      {/* Loading spinner replaces left icon */}
      {loading ? (
        <Spinner size={iconSize} />
      ) : (
        LeftIcon && <LeftIcon size={iconSize} aria-hidden="true" />
      )}

      {/* Label — hidden visually when icon-only and has aria-label */}
      {children && (
        <span>
          {children}
        </span>
      )}

      {/* Right icon — hidden while loading */}
      {!loading && RightIcon && (
        <RightIcon size={iconSize} aria-hidden="true" />
      )}
    </Tag>
  )
}

export default Button

/* ─────────────────────────────────────────────────────────────
   USAGE EXAMPLES
   ─────────────────────────────────────────────────────────────
   import Button from './UI/Button'
   import { Zap, ChevronRight, Trash2 } from 'lucide-react'

   // Primary CTA
   <Button variant="primary" leftIcon={Zap}>Scan Meal</Button>

   // Secondary outlined
   <Button variant="secondary" rightIcon={ChevronRight}>View History</Button>

   // Small ghost button
   <Button variant="ghost" size="sm">Cancel</Button>

   // Full-width success
   <Button variant="success" fullWidth>Log to Meal Tracker</Button>

   // Danger action
   <Button variant="danger" leftIcon={Trash2}>Delete Entry</Button>

   // Icon-only
   <Button variant="icon" aria-label="Settings"><Settings size={16} /></Button>

   // Loading state
   <Button variant="primary" loading>Analyzing...</Button>

   // Render as anchor
   <Button as="a" href="/dashboard" variant="secondary">Go to Dashboard</Button>
   ───────────────────────────────────────────────────────────── */
