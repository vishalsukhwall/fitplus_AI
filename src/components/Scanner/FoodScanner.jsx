/**
 * FoodScanner.jsx — ML Computer Vision Food Scanner
 * ──────────────────────────────────────────────────
 * Handles all four getUserMedia states:
 *   pending → granted → (analysis) → result
 *   pending → denied  → instructions + file-upload fallback
 *   pending → unavailable (no hardware)
 *   insecure context (non-HTTPS)
 *
 * Fallback chain: camera → file upload → (manual entry handled by parent)
 * Stream is always released on unmount to prevent camera-in-use indicator.
 * Analysis has a 10-second timeout with retry affordance.
 */
import React, { useReducer, useRef, useEffect, useCallback } from 'react'
import { Camera, Upload, AlertTriangle, RefreshCw, CheckCircle2, X, Zap } from 'lucide-react'

// ─── Permission states ────────────────────────────────────────
// 'pending' | 'requesting' | 'granted' | 'denied' | 'unavailable' | 'insecure'

const ANALYSIS_TIMEOUT_MS = 10_000

// ─── Reducer ─────────────────────────────────────────────────
const initialState = {
  permission:    'pending',    // camera permission state
  stream:        null,         // MediaStream | null
  isAnalyzing:   false,
  analysisError: null,
  result:        null,         // { foodItems, totalCalories, confidence }
  capturedImage: null,         // dataURL | null
}

function scannerReducer(state, action) {
  switch (action.type) {
    case 'REQUESTING':
      return { ...state, permission: 'requesting' }
    case 'STREAM_GRANTED':
      return { ...state, permission: 'granted', stream: action.payload, analysisError: null }
    case 'DENIED':
      return { ...state, permission: 'denied', stream: null }
    case 'UNAVAILABLE':
      return { ...state, permission: 'unavailable', stream: null }
    case 'INSECURE':
      return { ...state, permission: 'insecure', stream: null }
    case 'CAPTURE':
      return { ...state, capturedImage: action.payload, isAnalyzing: true, analysisError: null, result: null }
    case 'ANALYSIS_SUCCESS':
      return { ...state, isAnalyzing: false, result: action.payload }
    case 'ANALYSIS_ERROR':
      return { ...state, isAnalyzing: false, analysisError: action.payload }
    case 'RESET_SCAN':
      return { ...state, capturedImage: null, result: null, analysisError: null, isAnalyzing: false }
    case 'CLOSE':
      return { ...initialState }
    default:
      return state
  }
}

// ─── Browser-specific re-enable instructions ─────────────────
function ReEnableInstructions() {
  const ua = navigator.userAgent
  const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua)

  return (
    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary, #64748b)', textAlign: 'left', maxWidth: '340px' }}>
      <p style={{ fontWeight: 600, color: 'var(--text-primary, #e8eaed)', marginBottom: '6px' }}>
        How to re-enable camera access:
      </p>
      {isSafari ? (
        <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>Open <strong>Settings</strong> → <strong>Safari</strong> → <strong>Camera</strong></li>
          <li>Find this site and set it to <strong>Allow</strong></li>
          <li>Reload this page</li>
        </ol>
      ) : (
        <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>Click the <strong>🔒 lock icon</strong> in the address bar</li>
          <li>Find <strong>Camera</strong> and set it to <strong>Allow</strong></li>
          <li>Reload this page</li>
        </ol>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────
export function FoodScanner({ onMealLogged, onClose }) {
  const [state, dispatch] = useReducer(scannerReducer, initialState)
  const videoRef      = useRef(null)
  const canvasRef     = useRef(null)
  const streamRef     = useRef(null)     // tracks stream for cleanup
  const timeoutRef    = useRef(null)     // analysis timeout handle
  const fileInputRef  = useRef(null)

  // ── Release stream on unmount ─────────────────────────────
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
      clearTimeout(timeoutRef.current)
    }
  }, [])

  // ── Attach stream to video element when granted ───────────
  useEffect(() => {
    if (state.stream && videoRef.current) {
      videoRef.current.srcObject = state.stream
    }
  }, [state.stream])

  // ── Request camera access ─────────────────────────────────
  const requestCamera = useCallback(async () => {
    // Detect insecure context
    if (!navigator.mediaDevices?.getUserMedia) {
      dispatch({ type: 'INSECURE' })
      return
    }

    dispatch({ type: 'REQUESTING' })

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      dispatch({ type: 'STREAM_GRANTED', payload: stream })
    } catch (err) {
      // Release any partial stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }

      switch (err.name) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
          dispatch({ type: 'DENIED' })
          break
        case 'NotFoundError':
        case 'DevicesNotFoundError':
          dispatch({ type: 'UNAVAILABLE' })
          break
        case 'NotReadableError':
        case 'TrackStartError':
          dispatch({ type: 'DENIED' })   // hardware busy — treat as denied for UX
          break
        case 'OverconstrainedError':
        case 'ConstraintNotSatisfiedError':
          // Retry with relaxed constraints (no facingMode)
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true })
            streamRef.current = fallbackStream
            dispatch({ type: 'STREAM_GRANTED', payload: fallbackStream })
          } catch {
            dispatch({ type: 'UNAVAILABLE' })
          }
          break
        default:
          dispatch({ type: 'UNAVAILABLE' })
      }
    }
  }, [])

  // ── Capture frame from video ──────────────────────────────
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video  = videoRef.current
    const canvas = canvasRef.current
    canvas.width  = video.videoWidth  || 640
    canvas.height = video.videoHeight || 480
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataURL = canvas.toDataURL('image/jpeg', 0.8)
    dispatch({ type: 'CAPTURE', payload: dataURL })
    analyzeImage(dataURL)
  }, [])

  // ── File upload fallback ──────────────────────────────────
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataURL = ev.target.result
      dispatch({ type: 'CAPTURE', payload: dataURL })
      analyzeImage(dataURL)
    }
    reader.readAsDataURL(file)
  }, [])

  // ── ML Analysis with 10s timeout ─────────────────────────
  const analyzeImage = useCallback(async (dataURL) => {
    clearTimeout(timeoutRef.current)

    // Set 10-second timeout
    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'ANALYSIS_ERROR', payload: 'Analysis timed out. Please try again.' })
    }, ANALYSIS_TIMEOUT_MS)

    try {
      // ── Mock analysis pipeline (swap for real model call) ──
      // Flow: capture → canvas resize → compression → model inference
      //       → confidence threshold → nutrition mapping → result
      await new Promise(r => setTimeout(r, 2000)) // simulated inference

      // Simulated result — replace with actual ML API response
      const mockResult = {
        foodItems:     [{ name: 'Grilled Chicken Breast', calories: 350, portion: '200g' }],
        totalCalories: 350,
        confidence:    0.91,
        macros:        { protein: 45, carbs: 10, fat: 8 },
      }

      clearTimeout(timeoutRef.current)
      dispatch({ type: 'ANALYSIS_SUCCESS', payload: mockResult })
    } catch (err) {
      clearTimeout(timeoutRef.current)
      dispatch({ type: 'ANALYSIS_ERROR', payload: err.message ?? 'Analysis failed. Please try again.' })
    }
  }, [])

  const handleLogMeal = useCallback(() => {
    if (!state.result) return
    onMealLogged?.({
      name:     state.result.foodItems[0]?.name ?? 'Scanned Meal',
      calories: state.result.totalCalories,
      macros:   state.result.macros ?? { protein: 0, carbs: 0, fat: 0 },
    })
    dispatch({ type: 'CLOSE' })
    onClose?.()
  }, [state.result, onMealLogged, onClose])

  // ─── Render: permission states ────────────────────────────
  return (
    <div style={{ background: 'var(--bg-secondary, #0f0f1a)', border: '1px solid var(--border, #1e293b)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan, #00d9ff)' }}>
          <Camera size={18} />
          <span style={{ fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Food Scanner
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary, #64748b)', padding: '4px' }} aria-label="Close scanner">
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Insecure context ─────────────────────────────── */}
      {state.permission === 'insecure' && (
        <ScannerMessage
          icon={<AlertTriangle size={32} color="#ff006e" />}
          title="HTTPS required"
          message="Camera access requires a secure connection (HTTPS). Please open this app over HTTPS."
        >
          <FileUploadFallback fileInputRef={fileInputRef} onFileUpload={handleFileUpload} />
        </ScannerMessage>
      )}

      {/* ── Pending ─────────────────────────────────────── */}
      {state.permission === 'pending' && (
        <ScannerMessage
          icon={<Camera size={32} color="var(--accent-cyan, #00d9ff)" />}
          title="Scan your meal"
          message="Point your camera at food to identify it and log macros automatically."
        >
          <button onClick={requestCamera} style={btnStyle('#00d9ff', '#09090b')}>
            <Camera size={14} />
            Enable Camera
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)' }}>or</span>
          <FileUploadFallback fileInputRef={fileInputRef} onFileUpload={handleFileUpload} />
        </ScannerMessage>
      )}

      {/* ── Requesting ───────────────────────────────────── */}
      {state.permission === 'requesting' && (
        <ScannerMessage
          icon={<RefreshCw size={28} color="var(--accent-cyan, #00d9ff)" className="animate-spin" />}
          title="Requesting camera access..."
          message="Please allow camera access in your browser prompt."
        />
      )}

      {/* ── Denied ───────────────────────────────────────── */}
      {state.permission === 'denied' && (
        <ScannerMessage
          icon={<AlertTriangle size={32} color="#ff006e" />}
          title="Camera access denied"
          message="You denied camera permission. Use the file upload below, or re-enable camera access in your browser settings."
        >
          <ReEnableInstructions />
          <FileUploadFallback fileInputRef={fileInputRef} onFileUpload={handleFileUpload} />
        </ScannerMessage>
      )}

      {/* ── Unavailable ──────────────────────────────────── */}
      {state.permission === 'unavailable' && (
        <ScannerMessage
          icon={<AlertTriangle size={32} color="#64748b" />}
          title="No camera detected"
          message="No camera hardware was found. Upload a photo of your meal instead."
        >
          <FileUploadFallback fileInputRef={fileInputRef} onFileUpload={handleFileUpload} />
        </ScannerMessage>
      )}

      {/* ── Granted — live viewfinder ─────────────────────── */}
      {state.permission === 'granted' && !state.capturedImage && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', background: '#000' }}
            aria-label="Live camera feed"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={captureFrame} style={btnStyle('#00d9ff', '#09090b')}>
              <Zap size={14} />
              Scan Food
            </button>
            <FileUploadFallback fileInputRef={fileInputRef} onFileUpload={handleFileUpload} compact />
          </div>
        </div>
      )}

      {/* ── Analyzing ────────────────────────────────────── */}
      {state.isAnalyzing && (
        <ScannerMessage
          icon={<RefreshCw size={28} color="var(--accent-cyan, #00d9ff)" />}
          title="Analyzing..."
          message="Running nutrition inference. This may take a few seconds."
        >
          {state.capturedImage && (
            <img src={state.capturedImage} alt="Captured food" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', opacity: 0.5 }} />
          )}
        </ScannerMessage>
      )}

      {/* ── Analysis error ───────────────────────────────── */}
      {state.analysisError && !state.isAnalyzing && (
        <ScannerMessage
          icon={<AlertTriangle size={28} color="#ff006e" />}
          title="Analysis failed"
          message={state.analysisError}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => state.capturedImage && analyzeImage(state.capturedImage)} style={btnStyle('transparent', '#00d9ff', true)}>
              <RefreshCw size={14} />
              Retry
            </button>
            <button onClick={() => dispatch({ type: 'RESET_SCAN' })} style={btnStyle('transparent', '#64748b', true)}>
              New Scan
            </button>
          </div>
        </ScannerMessage>
      )}

      {/* ── Success result ────────────────────────────────── */}
      {state.result && !state.isAnalyzing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {state.capturedImage && (
            <img src={state.capturedImage} alt="Scanned food" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(0,208,132,0.06)', border: '1px solid rgba(0,208,132,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00d084' }}>
              <CheckCircle2 size={16} />
              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                {state.result.foodItems[0]?.name ?? 'Food Detected'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #64748b)' }}>
              {state.result.totalCalories} kcal
              {state.result.macros && ` · ${state.result.macros.protein}g P · ${state.result.macros.carbs}g C · ${state.result.macros.fat}g F`}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)' }}>
              Confidence: {Math.round((state.result.confidence ?? 0) * 100)}%
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleLogMeal} style={btnStyle('#00d9ff', '#09090b')}>
              <CheckCircle2 size={14} />
              Log This Meal
            </button>
            <button onClick={() => dispatch({ type: 'RESET_SCAN' })} style={btnStyle('transparent', '#64748b', true)}>
              Rescan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────
function ScannerMessage({ icon, title, message, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px 16px', textAlign: 'center' }}>
      {icon}
      <p style={{ fontWeight: 700, color: 'var(--text-primary, #e8eaed)', margin: 0 }}>{title}</p>
      {message && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #64748b)', margin: 0, maxWidth: '320px' }}>{message}</p>}
      {children}
    </div>
  )
}

function FileUploadFallback({ fileInputRef, onFileUpload, compact = false }) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileUpload}
        style={{ display: 'none' }}
        aria-label="Upload food photo"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        style={compact ? btnStyle('transparent', '#64748b', true) : btnStyle('transparent', '#00d9ff', true)}
      >
        <Upload size={14} />
        {compact ? 'Upload' : 'Upload Photo Instead'}
      </button>
    </>
  )
}

function btnStyle(bg, color, outlined = false) {
  return {
    display:     'flex',
    alignItems:  'center',
    gap:         '6px',
    padding:     '0 16px',
    height:      '36px',
    background:  bg,
    color:       color,
    border:      outlined ? `1px solid ${color}` : 'none',
    cursor:      'pointer',
    fontSize:    '0.8125rem',
    fontWeight:  600,
    transition:  'opacity 150ms',
    flexShrink:  0,
  }
}

export default FoodScanner
