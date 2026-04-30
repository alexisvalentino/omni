'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';

/**
 * Subtle ambient background orbs that shift color based on active scenario
 * AND time of day (when idle).
 */

const sceneColors: Record<string, { a: string; b: string }> = {
  idle:         { a: 'rgba(0, 122, 255, 0.06)',  b: 'rgba(100, 210, 255, 0.04)' },
  commute:      { a: 'rgba(0, 122, 255, 0.08)',  b: 'rgba(48, 209, 88, 0.05)' },
  relationship: { a: 'rgba(100, 210, 255, 0.07)', b: 'rgba(0, 122, 255, 0.05)' },
  email:        { a: 'rgba(255, 69, 58, 0.05)',   b: 'rgba(0, 122, 255, 0.06)' },
  schedule:     { a: 'rgba(255, 149, 0, 0.06)',   b: 'rgba(0, 122, 255, 0.05)' },
  order:        { a: 'rgba(48, 209, 88, 0.06)',   b: 'rgba(255, 204, 0, 0.04)' },
  finance:      { a: 'rgba(48, 209, 88, 0.07)',   b: 'rgba(0, 122, 255, 0.05)' },
  navigation:   { a: 'rgba(0, 122, 255, 0.07)',   b: 'rgba(48, 209, 88, 0.04)' },
  travel:       { a: 'rgba(255, 149, 0, 0.07)',   b: 'rgba(0, 122, 255, 0.05)' },
  general:      { a: 'rgba(139, 92, 246, 0.06)',  b: 'rgba(0, 122, 255, 0.04)' },
};

// Time-of-day idle colors for ambient warmth
const timeOfDayColors: Record<string, { a: string; b: string }> = {
  morning:   { a: 'rgba(255, 179, 71, 0.07)',  b: 'rgba(255, 149, 0, 0.04)' },
  afternoon: { a: 'rgba(0, 122, 255, 0.06)',   b: 'rgba(100, 210, 255, 0.04)' },
  evening:   { a: 'rgba(139, 92, 246, 0.07)',  b: 'rgba(88, 86, 214, 0.05)' },
  night:     { a: 'rgba(88, 86, 214, 0.06)',   b: 'rgba(48, 48, 120, 0.04)' },
};

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

export default function DynamicBackground() {
  const activeScenario = useOmniStore((s) => s.activeScenario);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

  // Update time-of-day periodically
  useEffect(() => {
    const id = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(id);
  }, []);

  const colors = useMemo(() => {
    // If there's an active scenario, use scenario colors
    if (activeScenario && sceneColors[activeScenario]) {
      return sceneColors[activeScenario];
    }
    // Otherwise use time-of-day colors for idle state
    return timeOfDayColors[timeOfDay] || sceneColors.idle;
  }, [activeScenario, timeOfDay]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Top-right orb */}
      <motion.div
        animate={{
          backgroundColor: colors.a,
          x: [0, 15, -10, 0],
          y: [0, -10, 15, 0],
        }}
        transition={{
          backgroundColor: { duration: 1.5, ease: 'easeInOut' },
          x: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 25, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-15%',
          width: '70%',
          height: '45%',
          borderRadius: '50%',
          filter: 'blur(80px)',
          backgroundColor: colors.a,
        }}
      />

      {/* Bottom-left orb */}
      <motion.div
        animate={{
          backgroundColor: colors.b,
          x: [0, -12, 8, 0],
          y: [0, 12, -8, 0],
        }}
        transition={{
          backgroundColor: { duration: 1.5, ease: 'easeInOut' },
          x: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          position: 'absolute',
          bottom: '-5%',
          left: '-20%',
          width: '65%',
          height: '40%',
          borderRadius: '50%',
          filter: 'blur(80px)',
          backgroundColor: colors.b,
        }}
      />

      {/* Center subtle pulse — very faint */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '25%',
          width: '50%',
          height: '30%',
          borderRadius: '50%',
          filter: 'blur(100px)',
          backgroundColor: 'rgba(0, 122, 255, 0.03)',
        }}
      />
    </div>
  );
}

