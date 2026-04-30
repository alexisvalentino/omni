'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound, successSound } from '../../services/sounds';

export default function ProactiveCards() {
  const cards = useOmniStore((s) => s.proactiveCards);
  const dismissProactiveCard = useOmniStore((s) => s.dismissProactiveCard);
  const actOnProactiveCard = useOmniStore((s) => s.actOnProactiveCard);

  const visible = cards.filter((c) => !c.dismissed);

  if (visible.length === 0) return null;

  return (
    <div style={{
      width: '100%',
      padding: '0 20px',
      marginBottom: 16,
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Suggested for You
      </div>

      <AnimatePresence>
        {visible.map((card, i) => (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, y: 10, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 8 }}
            exit={{ opacity: 0, x: -200, height: 0, marginBottom: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.05 }}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: 14,
              border: '1px solid var(--separator)',
              padding: '14px 16px',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(0,122,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                {card.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 3,
                }}>
                  {card.title}
                </div>
                <div style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                  marginBottom: 10,
                }}>
                  {card.body}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { successSound(); actOnProactiveCard(card.id); }}
                    style={{
                      background: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '7px 14px',
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
                    onClick={() => { tapSound(); dismissProactiveCard(card.id); }}
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '7px 14px',
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
    </div>
  );
}
