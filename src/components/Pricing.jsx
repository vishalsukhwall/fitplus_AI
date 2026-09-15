import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, Zap, Building2, ChevronRight, Star } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter Tier',
    subtitle: 'Essential AI programming for solo lifters',
    price: { monthly: 0, annual: 0 },
    Icon: Zap,
    accent: 'slate',
    badge: null,
    cta: 'Get Started Free',
    features: [
      'AI Workout Engine (3 routines / week)',
      'Standard Macro & Calorie Counter',
      'Progressive Overload Telemetry',
      '7-day workout and biometric log',
      'Global Athlete Community access',
      'iOS & Android native companion apps',
    ],
    excluded: [
      'Real-time Computer Vision Form Guard',
      '24/7 Speech-to-Speech Voice Coach',
      'Advanced Biometric HRV Synchronization',
      'Dedicated Priority Performance Support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Athlete',
    subtitle: 'For athletes striving for peak performance',
    price: { monthly: 15, annual: 12 },
    Icon: Sparkles,
    accent: 'emerald',
    badge: 'Most Popular',
    cta: 'Start 14-Day Free Trial',
    features: [
      'Unlimited Neural Workout Generation',
      'Multimodal Vision Macro Photo Snapping',
      '60 FPS Real-time Form Correction AI',
      '24/7 Conversational Voice Neural Coach',
      'Sleep, HRV & Recovery auto-regulation',
      'Smart Apple Watch / Garmin / Whoop sync',
      'Deep injury rehabilitation protocols',
      'Priority VIP Support (< 1 hr SLA)',
      'Lifetime Cloud Workout Analytics',
    ],
    excluded: [],
  },
  {
    id: 'gym',
    name: 'Gyms & Performance Centers',
    subtitle: 'Enterprise AI suite for coaches & gyms',
    price: { monthly: 49, annual: 39 },
    Icon: Building2,
    accent: 'purple',
    badge: 'Enterprise',
    cta: 'Book Live Demo',
    features: [
      'Everything in Pro Athlete tier',
      'Up to 50 active athlete / client licenses',
      'Custom white-label branding & domain',
      'Head Coach CRM & Telemetry Command Center',
      'Bulk AI program distribution pipeline',
      'Team retention & metabolic analytics',
      'Full REST & GraphQL Developer API access',
      'Dedicated Solutions Architect support',
    ],
    excluded: [],
  },
]

const ACCENT = {
  slate: {
    card: {
      border: '1px solid rgba(71,85,105,0.45)',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
    },
    icon: { background: 'rgba(71,85,105,0.3)', color: '#94a3b8' },
    price: { color: '#f1f5f9' },
    btnClass: 'btn-secondary',
    check: '#94a3b8',
  },
  emerald: {
    card: {
      border: '1px solid rgba(16,185,129,0.55)',
      boxShadow: '0 0 45px rgba(16,185,129,0.18), 0 20px 40px -15px rgba(0,0,0,0.7)',
    },
    icon: { background: 'rgba(16,185,129,0.15)', color: '#34d399' },
    price: {
      background: 'linear-gradient(90deg, #34d399, #14b8a6, #10b981)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent',
    },
    btnClass: 'btn-primary',
    check: '#34d399',
  },
  purple: {
    card: {
      border: '1px solid rgba(168,85,247,0.35)',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
    },
    icon: { background: 'rgba(168,85,247,0.12)', color: '#c084fc' },
    price: { color: '#f1f5f9' },
    btnClass: 'btn-secondary',
    check: '#c084fc',
  },
}

function PricingCard({ plan, annual, index }) {
  const { name, subtitle, price, Icon, accent, badge, cta, features, excluded } = plan
  const a = ACCENT[accent]
  const currentPrice = annual ? price.annual : price.monthly
  const isPro = accent === 'emerald'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: isPro ? -8 : -5, scale: isPro ? 1.025 : 1.01 }}
      style={{
        position: 'relative',
        background: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(16px)',
        borderRadius: 22,
        padding: '32px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        zIndex: isPro ? 2 : 1,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        ...a.card,
      }}
    >
      {/* Featured Badge */}
      {badge && (
        <motion.div
          animate={isPro ? { y: [-2, 2, -2] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
            padding: '5px 18px', borderRadius: 999, fontSize: 11.5, fontWeight: 800,
            background: isPro
              ? 'linear-gradient(90deg, rgba(16,185,129,0.25), rgba(20,184,166,0.25))'
              : 'rgba(168,85,247,0.2)',
            color: isPro ? '#34d399' : '#c084fc',
            border: `1px solid ${isPro ? 'rgba(16,185,129,0.5)' : 'rgba(168,85,247,0.4)'}`,
            whiteSpace: 'nowrap',
            boxShadow: isPro ? '0 0 20px rgba(16,185,129,0.3)' : 'none',
          }}
        >
          ✦ {badge}
        </motion.div>
      )}

      {/* Plan Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          padding: 11, borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...a.icon,
        }}>
          <Icon size={20} color={a.icon.color} />
        </div>
        <div>
          <h3 style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: 0 }}>{name}</h3>
          <p style={{ fontSize: 12.5, color: '#64748b', margin: '2px 0 0' }}>{subtitle}</p>
        </div>
      </div>

      {/* Price Header with animated number */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          {currentPrice === 0 ? (
            <span style={{ fontSize: 44, fontWeight: 900, ...a.price, letterSpacing: '-1px' }}>Free</span>
          ) : (
            <>
              <span style={{ fontSize: 16, color: '#64748b', marginBottom: 10, fontWeight: 600 }}>$</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPrice}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 50, fontWeight: 900, letterSpacing: '-1.5px', ...a.price }}
                >
                  {currentPrice}
                </motion.span>
              </AnimatePresence>
              <span style={{ fontSize: 13.5, color: '#64748b', marginBottom: 10, fontWeight: 500 }}>/month</span>
            </>
          )}
        </div>

        {annual && currentPrice > 0 && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ fontSize: 11.5, color: '#10b981', fontWeight: 600, marginTop: 4, margin: 0 }}
          >
            Billed annually — save ${(price.monthly - price.annual) * 12}/year
          </motion.p>
        )}
      </div>

      {/* Primary CTA button with micro-interactions */}
      <motion.a
        href="#"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={a.btnClass}
        style={{
          justifyContent: 'center', width: '100%',
          padding: '13px 0', borderRadius: 14,
          fontSize: 14.5, textDecoration: 'none',
        }}
      >
        <span>{cta}</span>
        <ChevronRight size={15} />
      </motion.a>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(51,65,85,0.45)' }} />

      {/* Feature Bullet List */}
      <ul style={{
        listStyle: 'none', padding: 0, margin: 0,
        display: 'flex', flexDirection: 'column', gap: 11,
      }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#cbd5e1' }}>
            <Check size={15} color={a.check} style={{ marginTop: 1, flexShrink: 0 }} />
            <span>{f}</span>
          </li>
        ))}
        {excluded.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#475569', textDecoration: 'line-through' }}>
            <div style={{ width: 15, height: 15, marginTop: 1, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 8, height: 1.5, background: '#334155' }} />
            </div>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 50px' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 14px', borderRadius: 999, marginBottom: 16,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)',
            color: '#34d399', fontSize: 12.5, fontWeight: 700,
          }}>
            <Star size={12} fill="#34d399" color="#34d399" />
            <span>Transparent Pricing Architecture</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4.2vw, 48px)',
            fontWeight: 900,
            color: '#f8fafc',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            margin: '0 0 16px',
          }}>
            Invest in your best self,<br />
            <span className="animate-gradient-text">not expensive personal trainers</span>
          </h2>

          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Start on our generous free tier. Upgrade whenever you are ready to unleash full computer vision and voice intelligence.
          </p>

          {/* Interactive Monthly / Annual Switch with Spring Physics */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 36 }}>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: !annual ? '#f1f5f9' : '#64748b' }}>
              Monthly Billing
            </span>

            <button
              onClick={() => setAnnual(!annual)}
              style={{
                position: 'relative', width: 54, height: 28, borderRadius: 999,
                background: annual ? '#10b981' : '#1e293b',
                border: '1px solid rgba(51,65,85,0.6)', cursor: 'pointer',
                outline: 'none', padding: 2,
                transition: 'background-color 0.3s ease',
              }}
              aria-label="Toggle annual billing"
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  width: 22, height: 22,
                  borderRadius: '50%', background: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  transform: annual ? 'translateX(26px)' : 'translateX(0px)',
                }}
              />
            </button>

            <span style={{ fontSize: 14.5, fontWeight: 600, color: annual ? '#f1f5f9' : '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
              Annual Billing
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontSize: 10.5, fontWeight: 800, padding: '3px 9px', borderRadius: 999,
                  background: 'rgba(16,185,129,0.18)', color: '#34d399',
                  border: '1px solid rgba(16,185,129,0.4)',
                }}
              >
                SAVE 20%
              </motion.span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, idx) => (
            <PricingCard key={plan.id} plan={plan} annual={annual} index={idx} />
          ))}
        </div>

        {/* Footnote reassurance */}
        <p style={{ textAlign: 'center', fontSize: 12.5, color: '#64748b', marginTop: 44 }}>
          All memberships include 256-bit AES encryption, on-device biometric security, and zero ads.{' '}
          <a href="#" style={{ color: '#34d399', textDecoration: 'none', marginLeft: 4, fontWeight: 600 }}>
            Compare full feature breakdown →
          </a>
        </p>

      </div>
    </section>
  )
}
