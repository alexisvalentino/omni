'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound } from '../../services/sounds';
import { getCalendarEvents } from '../../services/timeContext';

// ─── Query-specific result data ──────────────────────────────────────────────

type ScheduleResult = {
  heading: string;
  variant: 'overview' | 'meeting' | 'freeslot' | 'block';
};

function getScheduleResultForPrompt(prompt: string): ScheduleResult {
  const lower = prompt.toLowerCase();

  if ((lower.includes('what') && lower.includes('calendar')) || lower.includes('today')) {
    return { heading: "Today's Schedule", variant: 'overview' };
  }
  if ((lower.includes('schedule') && lower.includes('meeting')) || lower.includes('schedule a')) {
    return { heading: 'Schedule Meeting', variant: 'meeting' };
  }
  if (lower.includes('free') || lower.includes('next free') || lower.includes('available')) {
    return { heading: 'Free Slot Analysis', variant: 'freeslot' };
  }
  if (lower.includes('block') || lower.includes('lunch')) {
    return { heading: 'Block Time', variant: 'block' };
  }
  return { heading: "Today's Schedule", variant: 'overview' };
}

export default function ScheduleScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const userPrompt = useOmniStore((s) => s.userPrompt);
  const [loading, setLoading] = useState(true);

  const events = getCalendarEvents();
  const past = events.filter((e) => e.isPast);
  const upcoming = events.filter((e) => !e.isPast);
  const result = useMemo(() => getScheduleResultForPrompt(userPrompt), [userPrompt]);

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

  // ── Variant: "What's on my calendar today?" ────────────────────────────
  if (result.variant === 'overview') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          {result.heading}
        </div>

        {/* Events list */}
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
          {events.map((e, i) => (
            <div key={e.title} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 0',
              borderBottom: i < events.length - 1 ? '1px solid var(--separator)' : 'none',
              opacity: e.isPast ? 0.4 : 1,
            }}>
              <div style={{ width: 4, height: 32, borderRadius: 2, background: e.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textDecoration: e.isPast ? 'line-through' : 'none' }}>{e.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.time}</div>
              </div>
              {e.isPast && <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>Done</span>}
              {!e.isPast && i === past.length && <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>Next</span>}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,122,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>📊</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{past.length} done, {upcoming.length} upcoming</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{upcoming.length > 0 ? `Next: ${upcoming[0].title} at ${upcoming[0].time}` : 'All done for today!'}</div>
          </div>
        </div>

        {workspacePhase !== 'complete' && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => { successSound(); approveAction(); }}
            style={{ width: '100%', padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Got It
          </motion.button>
        )}
      </motion.div>
    );
  }

  // ── Variant: "Schedule a meeting tomorrow at 2 PM" ─────────────────────
  if (result.variant === 'meeting') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          {result.heading}
        </div>

        {/* Meeting card */}
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 4, height: 48, borderRadius: 2, background: 'var(--accent)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>New Meeting</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Tomorrow · 2:00 PM – 3:00 PM</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
            <div>📍 <span style={{ color: 'var(--text-primary)' }}>Conference Room B</span></div>
            <div>⏱️ <span style={{ color: 'var(--text-primary)' }}>1 hour</span></div>
          </div>
        </div>

        {/* Conflict check */}
        <div style={{ background: 'rgba(48,209,88,0.08)', borderRadius: 12, padding: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>No conflicts found</span> — 2 PM slot is clear tomorrow
          </div>
        </div>

        {/* Invite option */}
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,122,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>✉️</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Calendar Invite Ready</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Will be sent upon confirmation</div>
          </div>
        </div>

        {workspacePhase !== 'complete' && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => { successSound(); approveAction(); }}
            style={{ width: '100%', padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Schedule Meeting
          </motion.button>
        )}
      </motion.div>
    );
  }

  // ── Variant: "When is my next free slot?" ──────────────────────────────
  if (result.variant === 'freeslot') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          {result.heading}
        </div>

        {/* Busy times */}
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8 }}>BUSY</div>
          {events.filter(e => !e.isPast).map((e, i) => (
            <div key={e.title} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0',
              borderBottom: i < upcoming.length - 1 ? '1px solid var(--separator)' : 'none',
            }}>
              <div style={{ width: 4, height: 24, borderRadius: 2, background: 'var(--accent-red)', flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{e.title}</div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{e.time}</span>
            </div>
          ))}
        </div>

        {/* Free slots */}
        <div style={{ background: 'rgba(48,209,88,0.08)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-green)', marginBottom: 8 }}>FREE SLOTS FOUND</div>
          {[
            { time: '10:00 AM – 12:30 PM', duration: '2.5 hours', best: true },
            { time: '3:00 PM – 5:00 PM', duration: '2 hours', best: false },
          ].map((slot, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0',
              borderBottom: i === 0 ? '1px solid rgba(48,209,88,0.15)' : 'none' }}>
              <div style={{ width: 4, height: 24, borderRadius: 2, background: 'var(--accent-green)', flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{slot.time}</div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{slot.duration}</span>
              {slot.best && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-green)', background: 'rgba(48,209,88,0.12)', padding: '2px 6px', borderRadius: 4 }}>Next</span>}
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,122,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>✅</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Next free: 10:00 AM</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>2.5-hour block available</div>
          </div>
        </div>

        {workspacePhase !== 'complete' && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => { successSound(); approveAction(); }}
            style={{ width: '100%', padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Got It
          </motion.button>
        )}
      </motion.div>
    );
  }

  // ── Variant: "Block off lunch hour" ────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
        {result.heading}
      </div>

      {/* Blocked time card */}
      <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 4, height: 48, borderRadius: 2, background: 'var(--accent-orange)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>🍽️ Lunch Break</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Today · 12:00 PM – 1:00 PM</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
          <div>⏱️ <span style={{ color: 'var(--text-primary)' }}>1 hour</span></div>
          <div>🔕 <span style={{ color: 'var(--text-primary)' }}>Auto-decline on</span></div>
        </div>
      </div>

      {/* Conflict check */}
      <div style={{ background: 'rgba(48,209,88,0.08)', borderRadius: 12, padding: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>No conflicts</span> — 12-1 PM is clear
        </div>
      </div>

      {/* Info */}
      <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,149,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Protected Time</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>New meeting invites will be auto-declined</div>
        </div>
      </div>

      {workspacePhase !== 'complete' && (
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { successSound(); approveAction(); }}
          style={{ width: '100%', padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Block Lunch Hour
        </motion.button>
      )}
    </motion.div>
  );
}
