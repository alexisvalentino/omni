'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound, tapSound } from '../../services/sounds';

export default function TravelScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const [loading, setLoading] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState<'united' | 'delta' | 'jetblue' | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 60, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 80, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 80, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 80, borderRadius: 10 }}/>
      </div>
    );
  }

  const flights = [
    {
      id: 'united' as const,
      airline: 'United',
      icon: '✈️',
      price: 289,
      originalPrice: 329,
      time: '8:00 AM',
      arrival: '4:30 PM',
      duration: '5h 30m',
      stops: 'Nonstop',
      badge: '💰 Best Deal',
    },
    {
      id: 'delta' as const,
      airline: 'Delta',
      icon: '✈️',
      price: 315,
      originalPrice: 340,
      time: '11:00 AM',
      arrival: '7:15 PM',
      duration: '5h 15m',
      stops: 'Nonstop',
      badge: null,
    },
    {
      id: 'jetblue' as const,
      airline: 'JetBlue',
      icon: '✈️',
      price: 249,
      originalPrice: 280,
      time: '6:00 AM',
      arrival: '3:45 PM',
      duration: '6h 45m',
      stops: '1 stop (BOS)',
      badge: null,
    },
  ];

  const selected = flights.find((f) => f.id === selectedFlight);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Route header */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>SFO</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>San Francisco</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 1, background: 'var(--text-tertiary)' }}/>
            <span style={{ fontSize: 16 }}>✈️</span>
            <div style={{ width: 20, height: 1, background: 'var(--text-tertiary)' }}/>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>JFK</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>New York</div>
          </div>
        </div>
        <div style={{
          background: 'rgba(48, 209, 88, 0.12)',
          color: 'var(--accent-green)',
          fontSize: 12,
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: 20,
        }}>
          $40 off
        </div>
      </div>

      {/* Flight options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {flights.map((flight) => (
          <motion.button
            key={flight.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => { tapSound(); setSelectedFlight(flight.id); }}
            style={{
              width: '100%',
              padding: 14,
              background: selectedFlight === flight.id ? 'rgba(0,122,255,0.12)' : 'var(--bg-tertiary)',
              border: `1.5px solid ${selectedFlight === flight.id ? 'var(--accent)' : 'var(--separator)'}`,
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
              color: 'var(--text-primary)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{flight.icon}</span>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{flight.airline}</div>
                {flight.badge && (
                  <div style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: 'rgba(255, 204, 0, 0.15)',
                    color: 'var(--accent-orange)',
                    padding: '2px 8px',
                    borderRadius: 10,
                  }}>
                    {flight.badge}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-green)' }}>
                  ${flight.price}
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--text-tertiary)',
                  textDecoration: 'line-through',
                }}>
                  ${flight.originalPrice}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span>{flight.time} → {flight.arrival}</span>
              <span>{flight.duration}</span>
              <span>{flight.stops}</span>
            </div>
          </motion.button>
        ))}
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
          United at <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>$289</span> is the best value — nonstop, dropped <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>$40 yesterday</span>. Price may increase by tonight.
        </div>
      </div>

      {/* Action button */}
      {workspacePhase !== 'complete' && (
        <motion.button
          whileTap={selectedFlight ? { scale: 0.97 } : {}}
          onClick={() => { successSound(); approveAction(); }}
          disabled={!selectedFlight}
          style={{
            width: '100%',
            padding: 14,
            background: selectedFlight ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: 'none',
            borderRadius: 12,
            color: selectedFlight ? 'white' : 'var(--text-tertiary)',
            fontSize: 16,
            fontWeight: 600,
            cursor: selectedFlight ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          {selected
            ? `Book ${selected.airline} — $${selected.price}`
            : 'Select a flight'}
        </motion.button>
      )}
    </motion.div>
  );
}
