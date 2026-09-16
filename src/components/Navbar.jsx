import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X, ChevronRight, Sparkles, Terminal } from 'lucide-react'

const NAV_LINKS = [
  { label: 'AI Generator', href: '#ai-generator' },
  { label: 'Live Dashboard', href: '#dashboard' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false)

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        transition: 'background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        backgroundColor: scrolled ? 'rgba(3, 7, 18, 0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(51, 65, 85, 0.5)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Brand Logo */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(20,184,166,0.15))',
              border: '1px solid rgba(16,185,129,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16,185,129,0.25)',
            }}>
              <Zap size={18} color="#34d399" fill="#34d399" />
            </div>
            <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.5px' }}>
              <span style={{ color: '#f8fafc' }}>FitPulse</span>
              <span className="text-neon-gradient"> AI</span>
            </span>
            <span style={{
              fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999,
              background: 'rgba(16,185,129,0.15)', color: '#34d399',
              border: '1px solid rgba(16,185,129,0.3)',
              marginLeft: 4,
            }}>
              PRO
            </span>
          </motion.a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-none bg-[var(--bg-dark)]/60 border border-slate-800/80 backdrop-blur-md">
            {NAV_LINKS.map(({ label, href }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '7px 15px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#94a3b8',
                  borderRadius: 999,
                  textDecoration: 'none',
                  transition: 'color 0.2s, background-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#34d399'
                  e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#94a3b8'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {label}
              </motion.a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <motion.a
              href="#dashboard"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: '#cbd5e1',
                textDecoration: 'none',
                padding: '8px 12px',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#34d399'}
              onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
            >
              <Terminal size={14} color="#10b981" />
              <span>Live Demo</span>
            </motion.a>

            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16,185,129,0.65)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
              style={{ fontSize: 13.5, padding: '9px 18px' }}
            >
              <span>Start Free Trial</span>
              <ChevronRight size={14} />
            </motion.a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center"
            style={{
              padding: 9,
              borderRadius: 10,
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(51,65,85,0.6)',
              cursor: 'pointer',
              color: '#94a3b8',
            }}
            aria-label="Toggle mobile menu"
          >
            {open ? <X size={20} color="#34d399" /> : <Menu size={20} color="#cbd5e1" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer with AnimatePresence */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 64px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              top: 64,
              zIndex: 40,
              backgroundColor: 'rgba(3,7,18,0.98)',
              backdropFilter: 'blur(24px)',
              overflowY: 'auto',
              borderTop: '1px solid rgba(51,65,85,0.4)',
            }}
          >
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 20px 40px',
              gap: 10,
              maxWidth: 480,
              margin: '0 auto',
            }}>
              {NAV_LINKS.map(({ label, href }, index) => (
                <motion.a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * index, duration: 0.3 }}
                  style={{
                    padding: '14px 18px',
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#e2e8f0',
                    borderRadius: 14,
                    textDecoration: 'none',
                    background: 'rgba(15,23,42,0.6)',
                    border: '1px solid rgba(51,65,85,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{label}</span>
                  <ChevronRight size={16} color="#10b981" />
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.3 }}
                style={{
                  borderTop: '1px solid rgba(51,65,85,0.5)',
                  marginTop: 16,
                  paddingTop: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <a
                  href="#dashboard"
                  onClick={() => setOpen(false)}
                  style={{
                    padding: '14px 18px',
                    textAlign: 'center',
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#cbd5e1',
                    borderRadius: 14,
                    border: '1px solid #334155',
                    textDecoration: 'none',
                    background: 'rgba(30,41,59,0.4)',
                  }}
                >
                  Explore Live Dashboard
                </a>
                <a
                  href="#pricing"
                  onClick={() => setOpen(false)}
                  className="btn-primary"
                  style={{ justifyContent: 'center', padding: '14px 20px', fontSize: 15 }}
                >
                  <span>Start Free Trial</span>
                  <ChevronRight size={16} />
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
