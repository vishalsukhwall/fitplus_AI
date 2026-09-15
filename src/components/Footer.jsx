import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Zap, Send, Heart, Shield,
  Globe, MessageCircle, Video, Music, Link as LinkIcon
} from 'lucide-react'

const LINKS = {
  Product: ['Autonomous Workout Engine', 'Multimodal Vision Macro', 'Form Guard Computer Vision', '24/7 Neural Voice Coach', 'Biometric Integrations'],
  Company: ['About FitPulse', 'Research Papers', 'Careers (We’re Hiring)', 'Press & Media Kit', 'Security Whitepaper'],
  Legal:   ['Privacy Protocol', 'Terms of Service', 'HIPAA Compliance', 'GDPR Verification', 'Biometric Consent'],
  Community: ['Athlete Discord', 'Developer API', 'Affiliate Partners', 'System Status', 'Changelog'],
}

/* Social icons with standard lucide generic icons */
const SOCIAL = [
  { Icon: MessageCircle, label: 'Twitter / X',   href: '#' },
  { Icon: Globe,         label: 'Community Hub', href: '#' },
  { Icon: Video,         label: 'YouTube Demos', href: '#' },
  { Icon: LinkIcon,      label: 'GitHub Repos',  href: '#' },
  { Icon: Music,         label: 'Podcast Feed',  href: '#' },
]

const TRUST_BADGES = ['SOC 2 Type II Certified', 'HIPAA Compliant Protocol', 'AES-256 Bit Encryption', 'GDPR Verified']

function Newsletter() {
  const [email, setEmail]         = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim() && email.includes('@')) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card glow-border"
      style={{
        padding: '36px 32px',
        marginBottom: 72,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 28,
        background: 'rgba(15,23,42,0.8)',
      }}
    >
      <div style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          <Zap size={14} color="#34d399" fill="#34d399" />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Neural Fitness Dispatch
          </span>
        </div>
        <h3 style={{ fontSize: 21, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Stay ahead of your physical potential
        </h3>
        <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
          Weekly breakdowns of breakthrough sports science, algorithm updates, and hypertrophy protocols. No promotional spam.
        </p>
      </div>

      {subscribed ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 24px', borderRadius: 14,
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.4)',
            color: '#34d399', fontWeight: 700, fontSize: 14,
          }}
        >
          <Zap size={16} fill="#34d399" color="#34d399" />
          <span>You're enrolled! Check your inbox for issue #01.</span>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          display: 'flex', gap: 10, width: '100%', maxWidth: 440,
        }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="athlete@domain.com"
            required
            style={{
              flex: 1, padding: '13px 18px', borderRadius: 14,
              fontSize: 14, background: 'rgba(30,41,59,0.7)',
              border: '1px solid #334155', color: '#f1f5f9',
              outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.6)' }}
            onBlur={e  => { e.target.style.borderColor = '#334155' }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn-primary"
            style={{ padding: '13px 22px', flexShrink: 0, borderRadius: 14 }}
          >
            <Send size={14} />
            <span>Join 85K+</span>
          </motion.button>
        </form>
      )}
    </motion.div>
  )
}

export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      borderTop: '1px solid rgba(30,41,59,0.7)',
      paddingTop: 80,
      paddingBottom: 48,
      overflow: 'hidden',
    }}>
      {/* Top glowing line */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Newsletter />

        {/* 4-Column Navigation Directory */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 36,
          marginBottom: 60,
        }}>
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <h4 style={{
                fontSize: 11.5, fontWeight: 800, color: '#f1f5f9',
                textTransform: 'uppercase', letterSpacing: 2, marginBottom: 18,
              }}>
                {category}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {items.map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{
                        fontSize: 13.5, color: '#64748b', textDecoration: 'none',
                        transition: 'color 0.2s', display: 'inline-block',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#34d399' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#64748b' }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Brand, Copyright, Socials */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: 20, paddingTop: 32,
          borderTop: '1px solid rgba(30,41,59,0.7)',
        }}>
          {/* Logo */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={16} color="#34d399" fill="#34d399" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800 }}>
              <span style={{ color: '#f8fafc' }}>FitPulse</span>
              <span className="text-neon-gradient"> AI</span>
            </span>
          </motion.a>

          {/* Copyright notice */}
          <p style={{ fontSize: 12.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
            © 2026 FitPulse AI Technologies, Inc. Engineered with
            <Heart size={12} color="#10b981" fill="#10b981" />
            for elite human performance.
          </p>

          {/* Social icons with micro-interactions */}
          <div style={{ display: 'flex', gap: 10 }}>
            {SOCIAL.map(({ Icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  padding: 9, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(30,41,59,0.6)',
                  border: '1px solid rgba(51,65,85,0.6)',
                  textDecoration: 'none', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'
                  e.currentTarget.querySelector('svg').style.color = '#34d399'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)'
                  e.currentTarget.querySelector('svg').style.color = '#64748b'
                }}
              >
                <Icon size={15} color="#64748b" style={{ transition: 'color 0.2s' }} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Security & Regulatory Compliance Badges */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: 14, marginTop: 32,
        }}>
          {TRUST_BADGES.map(badge => (
            <div key={badge} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 14px', borderRadius: 999,
              background: 'rgba(15,23,42,0.7)',
              border: '1px solid rgba(51,65,85,0.45)',
              fontSize: 11.5, color: '#64748b', fontWeight: 500,
            }}>
              <Shield size={11} color="#10b981" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

      </div>
    </footer>
  )
}
