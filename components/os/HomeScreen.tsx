'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound } from '../../services/sounds';
import { getGreeting } from '../../services/timeContext';



export default function HomeScreen() {

  const memoryItems = useOmniStore((s) => s.memoryItems);
  const goToSettings = useOmniStore((s) => s.goToSettings);
  const goToChat = useOmniStore((s) => s.goToChat);
  const [greeting, setGreeting] = useState(getGreeting());

  // Update greeting when time-of-day changes
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(id);
  }, []);

  const recentMemory = memoryItems.slice(0, 3);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 130,
      paddingBottom: 120,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Greeting + Settings gear */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ textAlign: 'center', marginBottom: 24, padding: '0 32px', width: '100%', position: 'relative' }}
      >
        {/* Top-right action buttons */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 20,
          display: 'flex',
          gap: 8,
        }}>
          {/* Chat button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => { tapSound(); goToChat(); }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--separator)',
              width: 36,
              height: 36,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
            aria-label="Chat"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </motion.button>

          {/* Settings gear */}
          <motion.button
            whileTap={{ scale: 0.85, rotate: 90 }}
            onClick={() => { tapSound(); goToSettings(); }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--separator)',
              width: 36,
              height: 36,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
            aria-label="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </motion.button>
        </div>

        {/* omni wordmark */}
        <div style={{
          margin: '0 auto 16px',
          fontSize: 15,
          fontWeight: 300,
          letterSpacing: '4px',
          color: 'var(--text-tertiary)',
          textTransform: 'lowercase',
        }}>
          omni
        </div>

        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: '-0.8px',
          marginBottom: 6,
          color: 'var(--text-primary)',
        }}>
          {greeting}
        </h1>
        <p style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          fontWeight: 400,
          lineHeight: 1.5,
          maxWidth: 260,
          margin: '0 auto',
        }}>
          Tell me what you need — I&apos;ll handle the rest.
        </p>
      </motion.div>



      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          width: '100%',
          padding: '0 20px',
        }}
      >
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: 10,
        }}>
          Recent
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--card-radius)',
          border: '1px solid var(--separator)',
          overflow: 'hidden',
        }}>
          {recentMemory.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 16px',
                borderBottom: idx < recentMemory.length - 1 ? '1px solid var(--separator)' : 'none',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14,
                  color: 'var(--text-primary)',
                  fontWeight: 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.text}
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', flexShrink: 0 }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
