import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, TrendingUp, Flame, CheckCircle2 } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Alex Rivera', handle: '@alex_lifts', initials: 'AR', avatarBg: '#10b981',
    role: 'Competitive Powerlifter · 4 yrs', stars: 5,
    text: "FitPulse AI restructured my peak deadlift cycle in under 60 seconds. It factored in my past rotator cuff tear and erratic work shifts. Added 12.5 kg to my bench and 8 lbs of clean muscle.",
    stat: '+8 lbs Lean Muscle', StatIcon: TrendingUp,
  },
  {
    name: 'Priya Sharma', handle: '@priya_fitlife', initials: 'PS', avatarBg: '#8b5cf6',
    role: 'Marathon Runner · 2 yrs', stars: 5,
    text: "The photo macro analyzer is unmatched. I snap my post-run bowl and it breaks down glycogen refills accurately. Shed 16 lbs without ever weighing chicken breast on a kitchen scale.",
    stat: '-16 lbs Body Fat', StatIcon: Flame,
  },
  {
    name: 'Marcus Lee', handle: '@coachmarctv', initials: 'ML', avatarBg: '#f59e0b',
    role: 'CSCS Strength Coach · 7 yrs', stars: 5,
    text: "I coach 40 collegiate athletes through the Performance tier. The AI autocomputes velocity drop-offs and adjusts volume sets automatically. It saves me 15+ program hours every week.",
    stat: '15 hrs Saved / Wk', StatIcon: TrendingUp,
  },
  {
    name: 'Jessica Park', handle: '@jessfitness', initials: 'JP', avatarBg: '#14b8a6',
    role: 'CrossFit Athlete · 3 yrs', stars: 5,
    text: "The Computer Vision Form Guard caught subtle knee valgus collapse on rep 6 of my squats—something two coaches missed. My patellar tendonitis vanished in 4 weeks.",
    stat: 'Zero Injury Time', StatIcon: Star,
  },
  {
    name: 'David Chen', handle: '@dchen_gains', initials: 'DC', avatarBg: '#3b82f6',
    role: 'Hypertrophy Specialist · 5 yrs', stars: 5,
    text: "The 24/7 Voice Coach is like having a veteran coach standing next to your rack. Talking between heavy sets without touching a greasy phone screen is absolute luxury.",
    stat: '+18.5% Squat Max', StatIcon: TrendingUp,
  },
  {
    name: 'Sofia Moreno', handle: '@sofiamoves', initials: 'SM', avatarBg: '#ec4899',
    role: 'HYROX Competitor · 2 yrs', stars: 5,
    text: "Consolidated Whoop, MyFitnessPal, and Trainerize into FitPulse AI. Having one central neural model connect HRV, meals, and lifting weights changed everything.",
    stat: '98% Habit Streak', StatIcon: Flame,
  },
]

function StarsRow({ count }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} color="#fbbf24" fill="#fbbf24" />
      ))}
    </div>
  )
}

function ReviewCard({ r, index }) {
  const { name, handle, initials, avatarBg, role, stars, text, stat, StatIcon } = r

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -6,
        borderColor: 'rgba(16,185,129,0.45)',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7), 0 0 25px rgba(16,185,129,0.12)',
      }}
      style={{
        background: 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(51,65,85,0.45)',
        borderRadius: 20,
        padding: 26,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Quote size={22} color="rgba(16,185,129,0.4)" />
        <StarsRow count={stars} />
      </div>

      <p style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.65, flex: 1, margin: 0 }}>
        "{text}"
      </p>

      {/* Measurable Stat Badge */}
      <div style={{
        display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 7,
        padding: '5px 12px', borderRadius: 10,
        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
      }}>
        <StatIcon size={12} color="#34d399" />
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#34d399' }}>{stat}</span>
      </div>

      {/* User Meta Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(51,65,85,0.4)', paddingTop: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#ffffff',
            boxShadow: `0 0 12px ${avatarBg}40`,
          }}>
            {initials}
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{name}</p>
            <p style={{ fontSize: 11.5, color: '#64748b', margin: 0 }}>{role}</p>
          </div>
        </div>
        <span style={{ fontSize: 11.5, color: '#475569', fontWeight: 500 }}>{handle}</span>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: '100px 0', position: 'relative' }}>
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
            <span>Over 2,000,000 Athletes Empowered</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4.2vw, 48px)',
            fontWeight: 900,
            color: '#f8fafc',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            margin: '0 0 16px',
          }}>
            Proven transformations by<br />
            <span className="animate-gradient-text">athletes of all calibers</span>
          </h2>

          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Hear from collegiate competitors, powerlifters, and busy professionals who replaced generic PDF plans with adaptive intelligence.
          </p>
        </motion.div>

        {/* Quantitative Rating Summary Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: 36,
            marginBottom: 56,
          }}
        >
          {[
            { val: '4.9 / 5.0', label: 'Apple App Store', sub: '38,400+ Verified Ratings' },
            { val: '4.8 / 5.0', label: 'Google Play Store', sub: '22,100+ Verified Ratings' },
            { val: '98.4%', label: 'Retention Rate', sub: 'Annual Member Re-Enrollment' },
          ].map(({ val, label, sub }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.03 }}
              style={{
                textAlign: 'center',
                padding: '16px 28px',
                borderRadius: 16,
                background: 'rgba(15,23,42,0.5)',
                border: '1px solid rgba(51,65,85,0.4)',
              }}
            >
              <p style={{ fontSize: 26, fontWeight: 900, color: '#34d399', margin: 0, letterSpacing: '-0.5px' }}>{val}</p>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc', margin: '4px 0 2px' }}>{label}</p>
              <p style={{ fontSize: 11.5, color: '#64748b', margin: 0 }}>{sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Reviews Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r, idx) => (
            <ReviewCard key={r.handle} r={r} index={idx} />
          ))}
        </div>

      </div>
    </section>
  )
}
