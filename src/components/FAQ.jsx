import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react'

const FAQS = [
  {
    q: 'How does FitPulse AI personalize my workout blocks?',
    a: "FitPulse AI combines your specific fitness targets, anatomical joint restrictions, past injury records, available equipment, and live readiness data. Rather than generating a static spreadsheet, it is an autoregulated program that recalculates optimal loads, reps, and sets each week.",
  },
  {
    q: 'Can I use FitPulse AI with zero gym equipment or just resistance bands?',
    a: 'Absolutely. During configuration you can select "Zero Equipment / Bodyweight", "Resistance Bands Only", "Home Dumbbell Setup", or "Full Commercial Facility". The AI strictly filters exercises you have the exact biomechanical apparatus to execute.',
  },
  {
    q: 'How accurate is the Multimodal Vision Macro Tracker?',
    a: "Our multimodal vision model achieves a 97.4% precision rate across millions of whole and mixed food recipes. For composite restaurant meals, it produces a calibrated volume estimate which you can refine with a single slider adjustment. The model continuously personalizes to your dining patterns.",
  },
  {
    q: 'Does Computer Vision Form Guard record or upload video feeds?',
    a: "Never. All 17-point skeletal vector tracking runs strictly on-device using local WebAssembly/WebGL hardware acceleration in your browser. Zero frames or video pixels are ever transmitted or saved to external servers—ensuring absolute biometric privacy.",
  },
  {
    q: 'Can I cancel or change my subscription tier at any time?',
    a: "Yes, you can modify or cancel your plan instantly in your account settings with zero friction. If you cancel during the Pro Athlete trial or billing cycle, all premium neural tools stay active until the term finishes, after which your account safely transitions to the free Starter tier.",
  },
  {
    q: 'Which wearable biometrics and health suites integrate natively?',
    a: 'FitPulse AI directly links with Apple Health, Apple Watch, Garmin Connect, Whoop 4.0, Oura Ring Gen 3, and Google Fit. Resting heart rate, HRV (Heart Rate Variability), and sleep architecture automatically feed into your morning readiness index.',
  },
  {
    q: 'How does the 24/7 Voice Coach respond during workouts?',
    a: "Using ultra-low latency speech-to-speech models (< 250ms latency), you can simply speak while resting between sets without touching your screen. You can say 'The bar felt sluggish on rep 4, what weight should I drop to?' and receive an immediate verbal adjustment.",
  },
]

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(index === 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: open ? 'rgba(16,185,129,0.04)' : 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(16px)',
        border: open ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(51,65,85,0.45)',
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
        boxShadow: open ? '0 10px 30px -10px rgba(16,185,129,0.12)' : 'none',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '20px 22px',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
        aria-expanded={open}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 800,
            color: open ? '#34d399' : 'rgba(16,185,129,0.4)',
            transition: 'color 0.2s',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{
            fontSize: 15,
            fontWeight: 700,
            color: open ? '#f8fafc' : '#e2e8f0',
            lineHeight: 1.4,
            transition: 'color 0.2s',
          }}>
            {faq.q}
          </span>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{
            flexShrink: 0,
            padding: 6,
            borderRadius: 10,
            background: open ? 'rgba(16,185,129,0.15)' : 'rgba(30,41,59,0.7)',
            border: `1px solid ${open ? 'rgba(16,185,129,0.35)' : 'rgba(51,65,85,0.6)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronDown size={15} color={open ? '#34d399' : '#94a3b8'} />
        </motion.div>
      </button>

      {/* Accordion Content via AnimatePresence */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 22px 22px 48px',
              borderTop: '1px solid rgba(51,65,85,0.3)',
              paddingTop: 16,
            }}>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 14px', borderRadius: 999, marginBottom: 16,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)',
            color: '#34d399', fontSize: 12.5, fontWeight: 700,
          }}>
            <HelpCircle size={13} />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4.2vw, 48px)',
            fontWeight: 900,
            color: '#f8fafc',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            margin: '0 0 16px',
          }}>
            Clear answers to your<br />
            <span className="animate-gradient-text">technical questions</span>
          </h2>

          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Everything you need to know about models, device compatibility, privacy protocols, and billing.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FAQS.map((faq, idx) => (
            <FAQItem key={faq.q} faq={faq} index={idx} />
          ))}
        </div>

        {/* Support Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginTop: 48,
            padding: '24px 28px',
            borderRadius: 18,
            background: 'rgba(15,23,42,0.5)',
            border: '1px solid rgba(51,65,85,0.4)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 14.5, color: '#cbd5e1', margin: 0 }}>
            Still have questions about how FitPulse AI fits your specialized training goals?
          </p>
          <a
            href="mailto:support@fitpulse.ai"
            className="btn-secondary"
            style={{ fontSize: 13.5, padding: '10px 20px', borderRadius: 10 }}
          >
            Contact Performance Engineering Team →
          </a>
        </motion.div>

      </div>
    </section>
  )
}
