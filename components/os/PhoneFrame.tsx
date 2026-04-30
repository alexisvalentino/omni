'use client';

import { useState, useEffect, ReactNode } from 'react';

/**
 * PhoneFrame — wraps the OS simulator in a realistic phone bezel on desktop.
 * Dynamically scales to fit any viewport while maintaining aspect ratio.
 * 
 * Breakpoints:
 *   < 1024px  → Mobile/iPad: full-screen, no frame, native safe-area insets
 *   >= 1024px → Desktop: phone bezel frame with Dynamic Island + custom safe-area
 */

// iPhone 15 Pro dimensions as reference
const PHONE_WIDTH = 393;
const PHONE_HEIGHT = 852;
const BEZEL_PADDING = 12;
const BEZEL_RADIUS = 55;
const SCREEN_RADIUS = 44;

const DESKTOP_BREAKPOINT = 1024;

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false); // default to mobile for SSR

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isDesktop;
}

function useFrameScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculate = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // Total bezel dimensions
      const totalW = PHONE_WIDTH + BEZEL_PADDING * 2;
      const totalH = PHONE_HEIGHT + BEZEL_PADDING * 2;

      // Leave padding around the phone (40px top/bottom, 80px sides)
      const availH = vh - 80;
      const availW = vw - 160;

      const scaleH = availH / totalH;
      const scaleW = availW / totalW;

      // Use the smaller scale so it fits both dimensions, cap at 1x
      setScale(Math.min(scaleH, scaleW, 1));
    };

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  return scale;
}

export default function PhoneFrame({ children }: { children: ReactNode }) {
  const isDesktop = useIsDesktop();
  const scale = useFrameScale();

  // On mobile/iPad — full-screen with native safe-area insets
  if (!isDesktop) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      overflow: 'hidden',
    }}>
      {/* Subtle ambient glow behind phone */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,122,255,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Scale wrapper — scales the entire phone to fit viewport */}
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        flexShrink: 0,
      }}>
        {/* Phone bezel container */}
        <div style={{
          position: 'relative',
          width: PHONE_WIDTH + BEZEL_PADDING * 2,
          height: PHONE_HEIGHT + BEZEL_PADDING * 2,
          borderRadius: BEZEL_RADIUS,
          background: '#1a1a1a',
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.08),
            0 0 0 2px rgba(0,0,0,0.5),
            0 25px 80px rgba(0,0,0,0.6),
            0 10px 30px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
        }}>
          {/* Side button — right (power) */}
          <div style={{
            position: 'absolute',
            right: -3,
            top: 180,
            width: 4,
            height: 80,
            borderRadius: '0 3px 3px 0',
            background: '#2a2a2a',
            boxShadow: '1px 0 2px rgba(0,0,0,0.3)',
          }} />

          {/* Side buttons — left (volume up) */}
          <div style={{
            position: 'absolute',
            left: -3,
            top: 160,
            width: 4,
            height: 36,
            borderRadius: '3px 0 0 3px',
            background: '#2a2a2a',
            boxShadow: '-1px 0 2px rgba(0,0,0,0.3)',
          }} />

          {/* Side buttons — left (volume down) */}
          <div style={{
            position: 'absolute',
            left: -3,
            top: 205,
            width: 4,
            height: 36,
            borderRadius: '3px 0 0 3px',
            background: '#2a2a2a',
            boxShadow: '-1px 0 2px rgba(0,0,0,0.3)',
          }} />

          {/* Silent toggle — left */}
          <div style={{
            position: 'absolute',
            left: -3,
            top: 120,
            width: 4,
            height: 22,
            borderRadius: '3px 0 0 3px',
            background: '#2a2a2a',
            boxShadow: '-1px 0 2px rgba(0,0,0,0.3)',
          }} />

          {/* Inner screen area */}
          <div style={{
            width: PHONE_WIDTH,
            height: PHONE_HEIGHT,
            margin: BEZEL_PADDING,
            borderRadius: SCREEN_RADIUS,
            overflow: 'hidden',
            position: 'relative',
            background: '#000',
            border: '1.5px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.04), 0 0 8px rgba(0,0,0,0.5)',
          }}>
            {/* Dynamic Island (notch) */}
            <div style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 126,
              height: 37,
              borderRadius: 20,
              background: '#000',
              zIndex: 9999,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04)',
            }}>
              {/* Camera lens */}
              <div style={{
                position: 'absolute',
                right: 22,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#0a0a1a',
                boxShadow: 'inset 0 0 3px rgba(0,100,200,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
              }} />
            </div>

            {/* App content — sized to fill the screen area */}
            <div
              className="phone-screen"
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Brand label below phone */}
      <div style={{
        position: 'absolute',
        bottom: 'max(12px, 2vh)',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 300,
          letterSpacing: '6px',
          color: 'rgba(255,255,255,0.18)',
          textTransform: 'lowercase',
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}>
          omni
        </div>
        <div style={{
          fontSize: 10,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.08)',
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}>
          Agent-First OS Simulator
        </div>
      </div>
    </div>
  );
}
