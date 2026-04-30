'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound } from '../../services/sounds';

export default function StatusBar() {
  const contextPills = useOmniStore((s) => s.contextPills);
  const isLocked = useOmniStore((s) => s.isLocked);
  const toggleControlCenter = useOmniStore((s) => s.toggleControlCenter);
  const [time, setTime] = useState('');
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  // Mouse drag-to-scroll for context pills (desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = pillsRef.current;
    if (!el) return;
    
    const startX = e.pageX;
    const startScroll = el.scrollLeft;
    el.style.cursor = 'grabbing';

    const onMove = (ev: MouseEvent) => {
      el.scrollLeft = startScroll - (ev.pageX - startX);
    };
    const onUp = () => {
      el.style.cursor = 'grab';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      paddingTop: 'max(var(--safe-area-top, 0px), 8px)',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      {/* System indicators row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        height: 20,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '-0.3px',
      }}>
        {/* Left side — time */}
        <span style={{
          color: 'var(--text-primary)',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'inherit',
        }}>
          {time}
        </span>

        {/* Right side — indicators (tappable for control center) */}
        <button
          onClick={() => { if (!isLocked) { tapSound(); toggleControlCenter(); } }}
          style={{
            background: 'none', border: 'none', padding: 0,
            cursor: isLocked ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="8" width="3" height="4" rx="0.5" fill="white"/>
            <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="white"/>
            <rect x="9" y="2" width="3" height="10" rx="0.5" fill="white"/>
            <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="white" opacity="0.35"/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
            <path d="M8 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" transform="translate(0,-2)"/>
            <path d="M4.93 8.47a4.36 4.36 0 016.14 0" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" transform="translate(0,-2)"/>
            <path d="M2.4 5.93a7.63 7.63 0 0111.2 0" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" transform="translate(0,-2)"/>
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <div style={{
              width: 24, height: 11,
              border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: 3, padding: 1.5, position: 'relative',
            }}>
              <div style={{
                width: '80%', height: '100%',
                background: 'var(--accent-green)', borderRadius: 1,
              }}/>
            </div>
            <div style={{
              width: 2, height: 5,
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '0 1px 1px 0',
            }}/>
          </div>
        </button>
      </div>

      {/* Context pills — display only, update reactively */}
      {!isLocked && (
        <div
          ref={pillsRef}
          className="hide-scrollbar"
          onMouseDown={handleMouseDown}
          style={{
            display: 'flex',
            gap: 6,
            padding: '8px 16px 10px',
            overflowX: 'auto',
            overflowY: 'hidden',
            flexWrap: 'nowrap',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          <AnimatePresence mode="popLayout">
            {contextPills.map((pill) => (
              <motion.div
                key={pill.id}
                className="context-pill"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ flexShrink: 0 }}
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
