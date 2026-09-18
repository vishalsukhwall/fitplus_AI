/**
 * ErrorBoundary.jsx — Global Themed Error Boundary
 * ──────────────────────────────────────────────────
 * Catches runtime errors and renders a themed fallback
 * instead of a white browser error screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary section="Food Scanner" icon="🔬">
 *     <FoodScanner />
 *   </ErrorBoundary>
 */
import React from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log to console in dev; swap for Sentry.captureException in prod
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack)
  }

  handleReset() {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    const { section = 'App', icon = '⚠️' } = this.props

    return (
      <div
        role="alert"
        style={{
          minHeight:       section === 'App' ? '100vh' : '200px',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          background:      '#09090b',
          color:           '#e8eaed',
          padding:         '48px 24px',
          textAlign:       'center',
          gap:             '16px',
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: '40px', lineHeight: 1 }}>{icon}</div>

        {/* Alert icon */}
        <AlertTriangle
          size={section === 'App' ? 48 : 32}
          color="#ff006e"
          aria-hidden="true"
        />

        {/* Heading */}
        <h2
          style={{
            fontSize:   section === 'App' ? '1.5rem' : '1.125rem',
            fontWeight: 700,
            color:      '#e8eaed',
            margin:     0,
          }}
        >
          {section === 'App' ? 'Something went wrong' : `${section} failed to load`}
        </h2>

        {/* Subtext */}
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, maxWidth: '400px' }}>
          {section === 'App'
            ? 'An unexpected error occurred. Your session data is safe — click retry to reload.'
            : `The ${section} module encountered an error. The rest of the app is still working.`}
        </p>

        {/* Error detail (dev only) */}
        {import.meta.env.DEV && this.state.error && (
          <pre
            style={{
              fontSize:    '0.75rem',
              color:       '#64748b',
              background:  '#0f0f1a',
              border:      '1px solid #1e293b',
              borderRadius: 0,
              padding:     '12px 16px',
              maxWidth:    '560px',
              overflowX:   'auto',
              textAlign:   'left',
              margin:      0,
            }}
          >
            {this.state.error.toString()}
          </pre>
        )}

        {/* Retry button */}
        <button
          onClick={this.handleReset}
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:         '8px',
            padding:     '0 20px',
            height:      '40px',
            background:  'var(--accent-cyan, #00d9ff)',
            color:       '#09090b',
            border:      'none',
            borderRadius: 0,
            cursor:      'pointer',
            fontSize:    '0.875rem',
            fontWeight:  700,
            marginTop:   '8px',
          }}
          aria-label="Retry loading the component"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Retry
        </button>
      </div>
    )
  }
}

export default ErrorBoundary
