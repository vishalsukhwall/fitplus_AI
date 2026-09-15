import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, X, Send, Bot, User, Brain,
  Zap, MessageSquare, CornerDownLeft, ShieldCheck
} from 'lucide-react'

const SUGGESTIONS = [
  "How much protein post-workout?",
  "Substitute back squats (knee fatigue)",
  "Adjust calories for a rest day",
  "How to break through bench press plateau?",
]

const AI_KNOWLEDGE = {
  "How much protein post-workout?": "For optimal muscle protein synthesis (MPS), consume 35–45g of rapid-digesting protein (such as Whey Isolate or high-leucine animal source) combined with 40–60g of fast-acting carbohydrates within 90 minutes post-training. This maximizes glycogen re-synthesis and blunts exercise-induced cortisol.",
  "Substitute back squats (knee fatigue)": "If you are experiencing patellar tendon fatigue, immediately swap low-bar back squats for Leg Press with a high and wide foot placement, or Romanian Deadlifts (RDLs). Focus on a 4-second eccentric tempo and pause 1s at parallel to preserve hypertrophy without anterior shear force on the knee.",
  "Adjust calories for a rest day": "On non-lifting recovery days, drop your carbohydrate intake by 60–80g while increasing healthy monounsaturated and omega-3 fats by 10–15g. This lowers insulin exposure while maintaining hormonal synthesis and tissue repair. Your rest day baseline is ~2,420 kcal.",
  "How to break through bench press plateau?": "To push past a flat bench plateau: 1) Introduce close-grip bench to overload triceps lockout power; 2) Implement 2s pause reps at 82.5% 1RM to eliminate the chest stretch-reflex; 3) Increase weekly horizontal pressing frequency from 1x to 2x using an autoregulated RPE 8.5 threshold.",
}

export default function AICoachModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'coach',
      text: "Hello Alex! I'm your FitPulse AI Coach. Your readiness today is 94% with an HRV of 78ms. How can I optimize your training, macros, or recovery right now?",
      time: 'Just now',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Stream text token-by-token for genuine AI response feel
  const streamBotResponse = (fullText) => {
    setIsTyping(true)
    const newMsgId = Date.now().toString()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Add empty message placeholder
    setMessages(prev => [...prev, { id: newMsgId, sender: 'coach', text: '', time: now }])

    let currentIndex = 0
    const charsPerStep = 4 // realistic token chunk
    const interval = setInterval(() => {
      currentIndex += charsPerStep
      if (currentIndex <= fullText.length) {
        const chunk = fullText.slice(0, currentIndex)
        setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: chunk } : m))
      } else {
        setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: fullText } : m))
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 20)
  }

  const handleSend = (textOverride) => {
    const text = textOverride || inputValue
    if (!text.trim() || isTyping) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: now,
    }

    setMessages(prev => [...prev, userMsg])
    if (!textOverride) setInputValue('')

    // Generate smart response
    setTimeout(() => {
      let reply = AI_KNOWLEDGE[text]
      if (!reply) {
        reply = `Telemetry acknowledged. Analyzing your 14,850 kg weekly volume accumulation and biomechanical indicators: for "${text}", prioritize strict progressive overload, 2.2g/kg protein intake, and limit working set intensity to RPE 8.5 to prevent CNS overreaching.`
      }
      streamBotResponse(reply)
    }, 450)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-Over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-[#030712] border-l border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Brain size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">FitPulse AI Assistant</h3>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Neural v3.4
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Real-time biomechanics & nutritional reasoning
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((m) => {
                const isCoach = m.sender === 'coach'
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isCoach ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`
                        max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed
                        ${isCoach
                          ? 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm'
                          : 'bg-emerald-500/20 text-white border border-emerald-500/40 rounded-tr-sm shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between gap-4 text-[10px] font-bold text-slate-500 mb-1.5">
                        <span className={isCoach ? 'text-emerald-400' : 'text-slate-300'}>
                          {isCoach ? 'FitPulse Coach' : 'You'}
                        </span>
                        <span>{m.time}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                  </div>
                )
              })}

              {isTyping && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-emerald-400 w-fit">
                  <Sparkles size={13} className="animate-spin" />
                  <span>Synthesizing sports science recommendation...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-5 py-2.5 border-t border-slate-900 bg-slate-950/40 flex gap-2 overflow-x-auto">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={isTyping}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-400 hover:text-emerald-300 whitespace-nowrap transition-colors cursor-pointer"
                >
                  💬 {q}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about exercises, RPE, rest, or macros..."
                  disabled={isTyping}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputValue.trim()}
                  className="p-3 rounded-xl btn-primary cursor-pointer disabled:opacity-50"
                >
                  <Send size={15} />
                </button>
              </form>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Biometric safety guardrails active · Context-aware recovery telemetry
              </p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
