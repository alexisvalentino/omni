'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound } from '../../services/sounds';
import { getCalendarEvents } from '../../services/timeContext';

export default function ScheduleScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const [loading, setLoading] = useState(true);

  const events = getCalendarEvents();
  const past = events.filter((e) => e.isPast);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 60, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 100, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 60, borderRadius: 10 }}/>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Today header */}
      <div style={{
        fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)',
        textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10,
      }}>
        Today&apos;s Schedule
      </div>

      {/* Events list */}
      <div style={{
        background: 'var(--bg-tertiary)', borderRadius: 12,
        padding: 14, marginBottom: 12,
      }}>
        {events.map((e, i) => (
          <div key={e.title} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 0',
            borderBottom: i < events.length - 1 ? '1px solid var(--separator)' : 'none',
            opacity: e.isPast ? 0.4 : 1,
          }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: e.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
                textDecoration: e.isPast ? 'line-through' : 'none',
              }}>{e.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.time}</div>
            </div>
            {e.isPast && (
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Done</span>
            )}
            {!e.isPast && i === past.length && (
              <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>Next</span>
            )}
          </div>
        ))}
      </div>

      {/* AI optimization suggestion */}
      <div style={{
        background: 'rgba(0,122,255,0.08)', borderRadius: 12,
        padding: 12, marginBottom: 12,
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
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Optimization Found</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Move <strong style={{ color: 'var(--text-primary)' }}>Design Review</strong> to 2 PM to free up a
          <strong style={{ color: 'var(--accent-green)' }}> 3-5 PM focus block</strong>. No conflicts detected.
        </div>
      </div>

      {/* Free blocks */}
      <div style={{
        background: 'var(--bg-tertiary)', borderRadius: 12,
        padding: 14, marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'rgba(48,209,88,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 20 }}>✅</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>2-hour Free Block</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Available after optimization</div>
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
          Apply Optimized Schedule
        </motion.button>
      )}
    </motion.div>
  );
}
