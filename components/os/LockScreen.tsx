'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useOmniStore } from '../../store/omni';

function useLiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function LockScreen() {
  const unlock = useOmniStore((s) => s.unlock);
  const notifications = useOmniStore((s) => s.notifications);
  const now = useLiveClock();

  const dragY = useMotionValue(0);
  const lockOpacity = useTransform(dragY, [0, -120], [1, 0]);
  const lockScale = useTransform(dragY, [0, -120], [1, 0.95]);

  const hours = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const unread = notifications.filter((n) => !n.read);

  const handleDragEnd = useCallback((_: any, info: any) => {
    if (info.offset.y < -100) {
      unlock();
    }
  }, [unlock]);

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
      onClick={() => unlock()}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 500,
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        opacity: lockOpacity,
        scale: lockScale,
      }}
    >
      {/* Time display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{
          textAlign: 'center',
          marginTop: 'max(var(--safe-area-top, 60px), 80px)',
        }}
      >
        <div style={{
          fontSize: 72,
          fontWeight: 200,
          letterSpacing: '-3px',
          lineHeight: 1,
          color: 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {hours}
        </div>
        <div style={{
          fontSize: 18,
          fontWeight: 400,
          color: 'var(--text-secondary)',
          marginTop: 6,
          letterSpacing: '0.3px',
        }}>
          {dateStr}
        </div>
      </motion.div>

      {/* Notification previews */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          flex: 1,
          width: '100%',
          padding: '32px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {unread.slice(0, 4).map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            style={{
              background: 'rgba(28,28,30,0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 14,
              padding: '12px 14px',
              border: '1px solid rgba(84,84,88,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{n.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{n.app}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{n.time}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{n.title}</div>
                <div style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {n.body}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Swipe hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          paddingBottom: 'max(var(--safe-area-bottom, 0px), 40px)',
          textAlign: 'center',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 400, marginTop: 4 }}>
          Tap or swipe up to unlock
        </div>
      </motion.div>
    </motion.div>
  );
}
