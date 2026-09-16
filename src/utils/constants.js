/**
 * constants.js — Design System Constants & App Config
 * ─────────────────────────────────────────────────────
 * Single source of truth for theme tokens, spacing,
 * and API configuration — matches index.css :root exactly.
 */

// ─── Color Tokens ────────────────────────────────────────────
export const COLORS = {
  bgDark:       '#09090b',
  bgSecondary:  '#0f0f1a',
  textPrimary:  '#e8eaed',
  textSecondary:'#64748b',
  accentCyan:   '#00d9ff',
  accentPurple: '#a78bfa',
  success:      '#00d084',
  danger:       '#ff006e',
  border:       '#1e293b',
}

// ─── 8px Grid Spacing ────────────────────────────────────────
export const SPACING = {
  xs:   '8px',
  sm:   '16px',
  md:   '24px',
  lg:   '32px',
  xl:   '48px',
  '2xl':'64px',
}

// ─── Typography Scale ────────────────────────────────────────
export const FONT_SIZE = {
  xs:   '0.75rem',   // 12px
  sm:   '0.875rem',  // 14px
  base: '1rem',      // 16px
  lg:   '1.125rem',  // 18px
  xl:   '1.25rem',   // 20px
  '2xl':'1.5rem',    // 24px
  '3xl':'1.75rem',   // 28px
  '4xl':'2.25rem',   // 36px
  '5xl':'3rem',      // 48px
}

// ─── Breakpoints ─────────────────────────────────────────────
export const BREAKPOINTS = {
  mobile:  480,
  tablet:  768,
  desktop: 1024,
  wide:    1280,
}

// ─── Animation Easing ────────────────────────────────────────
export const EASING = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  snappy:  'cubic-bezier(0.22, 1, 0.36, 1)',
  duration: '200ms',
}

// ─── App Views ───────────────────────────────────────────────
export const VIEWS = {
  DASHBOARD: 'dashboard',
  GENERATOR: 'generator',
  MACROS:    'macros',
  SCANNER:   'scanner',
  LOGGER:    'logger',
  ANALYTICS: 'analytics',
  SETTINGS:  'settings',
}

// ─── API Config (filled from .env) ──────────────────────────
export const API_CONFIG = {
  anthropicKey: import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
  clarifaiPat:  import.meta.env.VITE_CLARIFAI_PAT ?? '',
  geminiKey:    import.meta.env.VITE_GEMINI_API_KEY ?? '',
}

// ─── Nutrition Defaults ──────────────────────────────────────
export const NUTRITION_DEFAULTS = {
  tdee:     2500,
  protein:  180,  // grams
  carbs:    280,  // grams
  fat:      80,   // grams
  water:    3500, // ml
}
