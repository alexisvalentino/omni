'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound, tapSound } from '../../services/sounds';

const places = [
  { id: 'philz', name: 'Philz Coffee', rating: 4.7, distance: '8 min walk', price: '$$', emoji: '☕' },
  { id: 'bluebottle', name: 'Blue Bottle Coffee', rating: 4.6, distance: '5 min walk', price: '$$', emoji: '☕' },
  { id: 'starbucks', name: 'Starbucks', rating: 4.2, distance: '3 min walk', price: '$', emoji: '☕' },
];

export default function NavigationScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 120, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 60, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 60, borderRadius: 10 }}/>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Simplified map */}
      <div style={{
        height: 120, background: 'var(--bg-tertiary)', borderRadius: 10,
        marginBottom: 12, position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="180" height="90" viewBox="0 0 180 90" fill="none">
          {/* Grid lines */}
          <line x1="0" y1="30" x2="180" y2="30" stroke="var(--text-tertiary)" strokeWidth="0.5" opacity="0.3"/>
          <line x1="0" y1="60" x2="180" y2="60" stroke="var(--text-tertiary)" strokeWidth="0.5" opacity="0.3"/>
          <line x1="60" y1="0" x2="60" y2="90" stroke="var(--text-tertiary)" strokeWidth="0.5" opacity="0.3"/>
          <line x1="120" y1="0" x2="120" y2="90" stroke="var(--text-tertiary)" strokeWidth="0.5" opacity="0.3"/>
          {/* Walking route */}
          <path d="M30 70 L60 55 L90 45 L120 35 L150 25" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="4 2"/>
          {/* You pin */}
          <circle cx="30" cy="70" r="5" fill="var(--accent-green)"/>
          <circle cx="30" cy="70" r="2.5" fill="white"/>
          {/* Destination pin */}
          <circle cx="150" cy="25" r="5" fill="var(--accent-red)"/>
          <circle cx="150" cy="25" r="2.5" fill="white"/>
          <text x="15" y="85" fill="var(--text-secondary)" fontSize="8" fontFamily="Inter">You</text>
        </svg>
      </div>

      {/* Nearby places */}
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
        Nearby Results
      </div>
      {places.map((place) => {
        const selected = selectedPlace === place.id;
        return (
          <motion.button
            key={place.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => { tapSound(); setSelectedPlace(place.id); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, marginBottom: 8,
              background: selected ? 'rgba(0,122,255,0.08)' : 'var(--bg-tertiary)',
              border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--separator)'}`,
              borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              fontFamily: 'inherit', color: 'var(--text-primary)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(0,122,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>{place.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{place.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {place.distance} · {place.rating}★ · {place.price}
              </div>
            </div>
            {place.id === 'philz' && (
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-green)', background: 'rgba(48,209,88,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                Best
              </span>
            )}
          </motion.button>
        );
      })}

      {/* AI recommendation */}
      <div style={{
        background: 'var(--bg-tertiary)', borderRadius: 12,
        padding: 12, marginBottom: 14, marginTop: 4,
        display: 'flex', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 1,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Philz has the <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>highest rating</span> nearby. 8 min walk via Market St.
        </div>
      </div>

      {/* Action */}
      {workspacePhase !== 'complete' && (
        <motion.button
          whileTap={selectedPlace ? { scale: 0.97 } : {}}
          onClick={() => { successSound(); approveAction(); }}
          disabled={!selectedPlace}
          style={{
            width: '100%', padding: 14,
            background: selectedPlace ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: 'none', borderRadius: 12,
            color: selectedPlace ? 'white' : 'var(--text-tertiary)',
            fontSize: 16, fontWeight: 600,
            cursor: selectedPlace ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          {selectedPlace ? `Navigate to ${places.find((p) => p.id === selectedPlace)?.name}` : 'Select a destination'}
        </motion.button>
      )}
    </motion.div>
  );
}
