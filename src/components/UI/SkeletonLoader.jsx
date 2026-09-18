/**
 * SkeletonLoader.jsx — Themed Skeleton Placeholder
 * ──────────────────────────────────────────────────
 * Used inside <Suspense fallback={<SkeletonLoader />}> and
 * as a loading state while data is being fetched.
 * Always uses CSS variables — never hardcoded browser defaults.
 *
 * Props:
 *   rows    {number} — number of skeleton rows (default: 4)
 *   height  {string} — row height (default: '20px')
 *   card    {boolean} — wrap in a card container (default: true)
 */
import React from 'react'

function SkeletonRow({ width = '100%', height = '20px' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        background:   'linear-gradient(90deg, var(--bg-secondary, #0f0f1a) 25%, #1e293b 50%, var(--bg-secondary, #0f0f1a) 75%)',
        backgroundSize: '200% 100%',
        animation:    'skeleton-shimmer 1.5s infinite',
        borderRadius: '2px',
        flexShrink:   0,
      }}
    />
  )
}

export function SkeletonLoader({ rows = 4, height = '20px', card = true }) {
  const content = (
    <div
      role="status"
      aria-label="Loading content"
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
    >
      {/* Wide header row */}
      <SkeletonRow width="60%" height="28px" />
      {/* Body rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow
          key={i}
          width={i % 3 === 2 ? '75%' : '100%'}
          height={height}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )

  if (!card) return content

  return (
    <div
      style={{
        background:   'var(--bg-secondary, #0f0f1a)',
        border:       '1px solid var(--border, #1e293b)',
        padding:      '24px',
        width:        '100%',
      }}
    >
      {content}
    </div>
  )
}

export default SkeletonLoader
