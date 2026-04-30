'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound, successSound } from '../../services/sounds';
import HomeWidgets from './HomeWidgets';

export default function SuggestionsPage() {
  const cards = useOmniStore((s) => s.proactiveCards);
  const dismissProactiveCard = useOmniStore((s) => s.dismissProactiveCard);
  const actOnProactiveCard = useOmniStore((s) => s.actOnProactiveCard);

  const visible = cards.filter((c) => !c.dismissed);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 130,
      paddingBottom: 100,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '0 24px', marginBottom: 20 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 300,
          letterSpacing: '4px',
          color: 'var(--text-tertiary)',
          textTransform: 'lowercase',
          marginBottom: 12,
        }}>
          omni
        </div>
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.8px',
          margin: 0,
          marginBottom: 6,
        }}>
          Suggested for You
        </h1>
        <p style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Proactive insights based on your context, habits, and schedule.
        </p>
      </div>

      {/* Cards */}
      <div style={{ padding: '0 20px' }}>
        <AnimatePresence>
          {visible.map((card, i) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -200, height: 0, marginBottom: 0, padding: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.06 }}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 16,
                border: '1px solid var(--separator)',
                padding: '16px 18px',
                marginBottom: 10,
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(0,122,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                }}>
                  {card.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}>
                    {card.title}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: 12,
                  }}>
                    {card.body}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); successSound(); actOnProactiveCard(card.id); }}
                      style={{
                        background: 'var(--accent)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 10,
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {card.action}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); tapSound(); dismissProactiveCard(card.id); }}
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        border: 'none',
                        borderRadius: 10,
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Dismiss
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              All caught up
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
              No suggestions right now. Check back later.
            </div>
          </motion.div>
        )}
      </div>

      {/* Live Widgets */}
      <HomeWidgets />

      {/* Swipe hint */}
      <div style={{
        padding: '20px 0',
        textAlign: 'center',
        fontSize: 12,
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        Swipe right for Home
      </div>
    </div>
  );
}
