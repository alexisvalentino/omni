'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound, tapSound } from '../../services/sounds';

// ─── Query-specific result data ──────────────────────────────────────────────

type NavigationResult = {
  heading: string;
  sectionLabel: string;
  items: { id: string; name: string; detail: string; emoji: string; tag?: string; tagColor?: string }[];
  recommendation: string;
  recommendationHighlight: string;
  actionLabel: string;
  actionLabelSelected?: (name: string) => string;
  mapLabel?: string;
};

function getNavigationResultForPrompt(prompt: string): NavigationResult {
  const lower = prompt.toLowerCase();

  // ── "Navigate to downtown" ─────────────────────────────────────────────
  if (lower.includes('downtown')) {
    return {
      heading: 'Route to Downtown',
      sectionLabel: 'Route Options',
      items: [
        { id: 'walk', name: 'Walking', detail: '18 min · 0.9 mi', emoji: '🚶', tag: 'Fastest', tagColor: 'var(--accent-green)' },
        { id: 'transit', name: 'BART — Powell St', detail: '12 min · $2.50', emoji: '🚇' },
        { id: 'rideshare', name: 'Uber / Lyft', detail: '8 min · ~$9', emoji: '🚗' },
      ],
      recommendation: 'Walking is',
      recommendationHighlight: 'the healthiest option',
      actionLabel: 'Start Navigation',
      actionLabelSelected: (name: string) => `Navigate via ${name}`,
      mapLabel: 'Downtown SF',
    };
  }

  // ── "Find nearest coffee shop" ─────────────────────────────────────────
  if (lower.includes('coffee') || lower.includes('nearest')) {
    return {
      heading: 'Coffee Nearby',
      sectionLabel: 'Nearby Results',
      items: [
        { id: 'philz', name: 'Philz Coffee', detail: '8 min walk · 4.7★ · $$', emoji: '☕', tag: 'Best', tagColor: 'var(--accent-green)' },
        { id: 'bluebottle', name: 'Blue Bottle Coffee', detail: '5 min walk · 4.6★ · $$', emoji: '☕' },
        { id: 'starbucks', name: 'Starbucks', detail: '3 min walk · 4.2★ · $', emoji: '☕' },
      ],
      recommendation: 'Philz has the',
      recommendationHighlight: 'highest rating',
      actionLabel: 'Select a destination',
      actionLabelSelected: (name: string) => `Navigate to ${name}`,
      mapLabel: 'Coffee Shops',
    };
  }

  // ── "Get directions to work" ───────────────────────────────────────────
  if (lower.includes('work') || lower.includes('office') || lower.includes('directions to')) {
    return {
      heading: 'Directions to Work',
      sectionLabel: 'Commute Options',
      items: [
        { id: 'drive', name: 'Driving — 101 S', detail: '22 min · Light traffic', emoji: '🚗', tag: 'Suggested', tagColor: 'var(--accent)' },
        { id: 'transit', name: 'BART + Walk', detail: '35 min · $4.50', emoji: '🚇' },
        { id: 'bike', name: 'Biking — Market St', detail: '28 min · 3.2 mi', emoji: '🚲' },
      ],
      recommendation: 'Traffic is light right now.',
      recommendationHighlight: 'Good time to drive',
      actionLabel: 'Select a route',
      actionLabelSelected: (name: string) => `Start ${name}`,
      mapLabel: 'Office — 2.8 mi',
    };
  }

  // ── "How far is the airport?" ──────────────────────────────────────────
  if (lower.includes('airport') || lower.includes('how far')) {
    return {
      heading: 'Distance to SFO Airport',
      sectionLabel: 'Getting There',
      items: [
        { id: 'drive', name: 'Driving — 101 S', detail: '13 mi · 25 min', emoji: '🚗', tag: 'Fastest', tagColor: 'var(--accent-green)' },
        { id: 'bart', name: 'BART Direct', detail: '13 mi · 38 min · $12', emoji: '🚇' },
        { id: 'rideshare', name: 'Uber / Lyft', detail: '13 mi · 22 min · ~$35', emoji: '🚕' },
      ],
      recommendation: 'SFO is',
      recommendationHighlight: '13 miles away',
      actionLabel: 'Get directions',
      actionLabelSelected: (name: string) => `Navigate via ${name}`,
      mapLabel: 'SFO — 13 mi',
    };
  }

  // ── Fallback: generic navigation ───────────────────────────────────────
  return {
    heading: 'Navigation',
    sectionLabel: 'Route Options',
    items: [
      { id: 'walk', name: 'Walking', detail: 'Calculating...', emoji: '🚶' },
      { id: 'transit', name: 'Public Transit', detail: 'Calculating...', emoji: '🚇' },
      { id: 'drive', name: 'Driving', detail: 'Calculating...', emoji: '🚗' },
    ],
    recommendation: 'Analyzing the best route',
    recommendationHighlight: 'for you',
    actionLabel: 'Start Navigation',
    actionLabelSelected: (name: string) => `Navigate via ${name}`,
  };
}

export default function NavigationScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const userPrompt = useOmniStore((s) => s.userPrompt);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const result = useMemo(() => getNavigationResultForPrompt(userPrompt), [userPrompt]);

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
          {result.mapLabel && (
            <text x="100" y="18" fill="var(--text-secondary)" fontSize="7" fontFamily="Inter" textAnchor="middle">{result.mapLabel}</text>
          )}
        </svg>
      </div>

      {/* Section label */}
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
        {result.sectionLabel}
      </div>

      {/* Result items */}
      {result.items.map((item) => {
        const selected = selectedItem === item.id;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => { tapSound(); setSelectedItem(item.id); }}
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
            }}>{item.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {item.detail}
              </div>
            </div>
            {item.tag && (
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: item.tagColor || 'var(--accent-green)',
                background: `${item.tagColor || 'var(--accent-green)'}18`,
                padding: '2px 6px', borderRadius: 4,
              }}>
                {item.tag}
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
          {result.recommendation}{' '}
          <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{result.recommendationHighlight}</span>
          {result.recommendation.endsWith('.') ? '' : '.'}
        </div>
      </div>

      {/* Action */}
      {workspacePhase !== 'complete' && (
        <motion.button
          whileTap={selectedItem ? { scale: 0.97 } : {}}
          onClick={() => { successSound(); approveAction(); }}
          disabled={!selectedItem}
          style={{
            width: '100%', padding: 14,
            background: selectedItem ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: 'none', borderRadius: 12,
            color: selectedItem ? 'white' : 'var(--text-tertiary)',
            fontSize: 16, fontWeight: 600,
            cursor: selectedItem ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          {selectedItem && result.actionLabelSelected
            ? result.actionLabelSelected(result.items.find((i) => i.id === selectedItem)?.name || '')
            : result.actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
