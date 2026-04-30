'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound } from '../../services/sounds';

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.84, change: 1.23, up: true },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 824.18, change: 3.41, up: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 168.29, change: -0.87, up: false },
];

export default function FinanceScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const totalValue = 24830;
  const dayChange = 142;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 80, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 140, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 50, borderRadius: 10 }}/>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Portfolio summary */}
      <div style={{
        background: 'var(--bg-tertiary)', borderRadius: 12,
        padding: 16, marginBottom: 12, textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
          Portfolio Value
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
          ${totalValue.toLocaleString()}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-green)', marginTop: 4 }}>
          +${dayChange} (+0.57%) today
        </div>
      </div>

      {/* Holdings */}
      <div style={{
        background: 'var(--bg-tertiary)', borderRadius: 12,
        padding: 14, marginBottom: 12,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          Holdings
        </div>
        {stocks.map((s, i) => (
          <div key={s.symbol} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: i < stocks.length - 1 ? '1px solid var(--separator)' : 'none',
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{s.symbol}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                ${s.price.toFixed(2)}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 600,
                color: s.up ? 'var(--accent-green)' : 'var(--accent-red)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {s.up ? '+' : ''}{s.change.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert recommendation */}
      <div style={{
        background: 'rgba(0,122,255,0.08)', borderRadius: 12,
        padding: 12, marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{
            width: 18, height: 18, borderRadius: 9,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <circle cx="12" cy="12" r="9"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Recommendation</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--accent-green)' }}>NVDA</strong> is your top performer today (+3.41%). Set a price alert at <strong style={{ color: 'var(--text-primary)' }}>$850</strong> to lock in gains.
        </div>
      </div>

      {/* Action */}
      {workspacePhase !== 'complete' && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { successSound(); approveAction(); }}
          style={{
            width: '100%', padding: 14,
            background: 'var(--accent)',
            border: 'none', borderRadius: 12,
            color: 'white',
            fontSize: 16, fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Set NVDA Alert at $850
        </motion.button>
      )}
    </motion.div>
  );
}
