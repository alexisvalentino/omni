'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound, tapSound } from '../../services/sounds';

export default function CommuteScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<'bart' | 'uber' | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 140, borderRadius: 10 }}/>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="skeleton" style={{ height: 80, flex: 1, borderRadius: 10 }}/>
          <div className="skeleton" style={{ height: 80, flex: 1, borderRadius: 10 }}/>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Fake map */}
      <div style={{
        height: 150,
        background: 'var(--bg-tertiary)',
        borderRadius: 10,
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Simplified map representation */}
        <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
          {/* Roads */}
          <path d="M20 100 Q60 80 100 60 Q140 40 180 20" stroke="var(--text-tertiary)" strokeWidth="2" strokeDasharray="4 3" opacity="0.5"/>
          <path d="M20 100 Q40 60 80 50 Q120 40 180 20" stroke="var(--accent)" strokeWidth="2.5"/>
          {/* Start pin */}
          <circle cx="20" cy="100" r="6" fill="var(--accent-green)"/>
          <circle cx="20" cy="100" r="3" fill="white"/>
          {/* End pin */}
          <circle cx="180" cy="20" r="6" fill="var(--accent-red)"/>
          <circle cx="180" cy="20" r="3" fill="white"/>
          {/* Labels */}
          <text x="10" y="118" fill="var(--text-secondary)" fontSize="9" fontFamily="Inter">Home</text>
          <text x="168" y="16" fill="var(--text-secondary)" fontSize="9" fontFamily="Inter">SFO</text>
        </svg>
      </div>

      {/* Route options */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {/* BART option */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { tapSound(); setSelectedRoute('bart'); }}
          style={{
            flex: 1,
            padding: 14,
            background: selectedRoute === 'bart' ? 'rgba(0,122,255,0.12)' : 'var(--bg-tertiary)',
            border: `1.5px solid ${selectedRoute === 'bart' ? 'var(--accent)' : 'var(--separator)'}`,
            borderRadius: 12,
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
            color: 'var(--text-primary)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 4 }}>🚇</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>BART</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: 'var(--accent-green)' }}>$12</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>42 min · Powell St</div>
        </motion.button>

        {/* Uber option */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { tapSound(); setSelectedRoute('uber'); }}
          style={{
            flex: 1,
            padding: 14,
            background: selectedRoute === 'uber' ? 'rgba(0,122,255,0.12)' : 'var(--bg-tertiary)',
            border: `1.5px solid ${selectedRoute === 'uber' ? 'var(--accent)' : 'var(--separator)'}`,
            borderRadius: 12,
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
            color: 'var(--text-primary)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 4 }}>🚘</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Uber</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>$65</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>50 min · via 101</div>
        </motion.button>
      </div>

      {/* AI recommendation */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        display: 'flex',
        gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 1,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Traffic is heavy on 101. BART is <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>$53 cheaper</span> and <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>8 min faster</span>. I recommend BART.
        </div>
      </div>

      {/* Action button */}
      {workspacePhase !== 'complete' && (
        <motion.button
          whileTap={selectedRoute ? { scale: 0.97 } : {}}
          onClick={() => { successSound(); approveAction(); }}
          disabled={!selectedRoute}
          style={{
            width: '100%',
            padding: 14,
            background: selectedRoute ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: 'none',
            borderRadius: 12,
            color: selectedRoute ? 'white' : 'var(--text-tertiary)',
            fontSize: 16,
            fontWeight: 600,
            cursor: selectedRoute ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          {selectedRoute ? `Book ${selectedRoute === 'bart' ? 'BART' : 'Uber'} — ${selectedRoute === 'bart' ? '$12.00' : '$65.00'}` : 'Select a route'}
        </motion.button>
      )}
    </motion.div>
  );
}
