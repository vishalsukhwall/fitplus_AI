import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, ShieldCheck, HeartPulse, Smartphone,
  HardDrive, Key, Sliders, Check, Copy, RefreshCw
} from 'lucide-react'

function SettingsView() {
  const [unitSystem, setUnitSystem] = useState('metric')
  const [autoSync, setAutoSync] = useState(true)
  const [hapticFeedback, setHapticFeedback] = useState(true)
  const [apiKeyCopied, setApiKeyCopied] = useState(false)

  const copyApiKey = () => {
    navigator.clipboard.writeText('fp_live_89f3a09e2c4b11f77d8a9e62')
    setApiKeyCopied(true)
    setTimeout(() => setApiKeyCopied(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-none bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-[rgba(0,217,255,0.3)] flex items-center justify-center font-black text-xl text-[#33e4ff] shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            AR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Alex Rivera</h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-none bg-[#00d9ff]/20 text-[#33e4ff] border border-[rgba(0,217,255,0.25)]">
                PRO ATHLETE TIER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Member since Jan 2025 · 142 Completed AI Sessions
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn-secondary text-xs py-2 px-4">
            Export Biometric JSON
          </button>
        </div>
      </div>

      {/* Hardware Telemetry Integration Section */}
      <div className="p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-white">
            Connected Biometric Hardware
          </h3>
          <p className="text-xs text-slate-400">
            Real-time sensor pipelines feeding into daily recovery calculations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            { name: 'Apple Watch Ultra 2', type: 'HRV, Resting HR & Workouts', status: 'Connected · 18ms latency', active: true },
            { name: 'Whoop 4.0 Strap', type: 'Sleep Architecture & Strain', status: 'Connected · Synced 4m ago', active: true },
            { name: 'Garmin Connect IQ', type: 'VO2 Max & Lactate Threshold', status: 'Standby / Paired', active: false },
            { name: 'Oura Ring Gen 3', type: 'Nocturnal Skin Temp & Recovery', status: 'Standby / Paired', active: false },
          ].map(device => (
            <div
              key={device.name}
              className="p-4 rounded-none bg-[var(--bg-dark)]/70 border border-slate-800/80 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-white">{device.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{device.type}</p>
                <span className="text-[10px] text-[#00d9ff] font-semibold block mt-1">
                  {device.status}
                </span>
              </div>

              <span className={`w-2.5 h-2.5 rounded-none ${device.active ? 'bg-[#00d9ff] animate-pulse' : 'bg-slate-600'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Units & App Preferences */}
      <div className="p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-white">
            System & Engine Preferences
          </h3>
          <p className="text-xs text-slate-400">
            Customize telemetry measurement units and interface behavior
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-none bg-[var(--bg-dark)]/60 border border-slate-800 text-xs">
            <div>
              <p className="font-bold text-white">Measurement Standard</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Barbell loads and anthropometric measurements</p>
            </div>
            <div className="flex gap-1 p-1 rounded-none bg-slate-900 border border-slate-800">
              <button
                onClick={() => setUnitSystem('metric')}
                className={`px-3 py-1 rounded text-xs font-bold ${unitSystem === 'metric' ? 'bg-[#00d9ff] text-black' : 'text-slate-400'}`}
              >
                Metric (kg/cm)
              </button>
              <button
                onClick={() => setUnitSystem('imperial')}
                className={`px-3 py-1 rounded text-xs font-bold ${unitSystem === 'imperial' ? 'bg-[#00d9ff] text-black' : 'text-slate-400'}`}
              >
                Imperial (lbs/in)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-none bg-[var(--bg-dark)]/60 border border-slate-800 text-xs">
            <div>
              <p className="font-bold text-white">Continuous Biometric Background Sync</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Update HRV and sleep markers every 15 minutes</p>
            </div>
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`w-12 h-6 rounded-none p-1 border transition-colors cursor-pointer ${autoSync ? 'bg-[#00d9ff] border-emerald-400' : 'bg-slate-800 border-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-none bg-white transition-transform ${autoSync ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Developer API Token Card */}
      <div className="p-6 rounded-none bg-[rgba(15,15,26,0.6)] backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-white text-base font-extrabold">
          <Key size={18} className="text-[#00d9ff]" />
          <span>FitPulse Neural Developer API Access</span>
        </div>
        <p className="text-xs text-slate-400">
          Programmatically query your generated workout routines and nutrition targets from custom scripts or mobile clients.
        </p>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            readOnly
            value="fp_live_89f3a09e2c4b11f77d8a9e62"
            className="flex-1 py-2.5 px-3.5 rounded-none bg-[var(--bg-dark)] border border-slate-800 text-xs font-mono text-[#00d9ff] outline-none"
          />
          <button
            onClick={copyApiKey}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-none bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
          >
            {apiKeyCopied ? <Check size={14} className="text-[#00d9ff]" /> : <Copy size={14} />}
            <span>{apiKeyCopied ? 'Copied' : 'Copy Key'}</span>
          </button>
        </div>
      </div>

    </div>
  )
}

export default React.memo(SettingsView)
