'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound, tapSound } from '../../services/sounds';

export default function OrderScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>(['latte']);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const items = [
    { id: 'latte', name: 'Oat Milk Latte', price: 6.50, emoji: '☕', note: 'Your usual' },
    { id: 'toast', name: 'Avocado Toast', price: 12.00, emoji: '🥑', note: 'Ordered 3x this month' },
    { id: 'muffin', name: 'Blueberry Muffin', price: 4.50, emoji: '🧁', note: 'Try something new' },
  ];

  const toggleItem = (id: string) => {
    tapSound();
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const total = items.filter((i) => selectedItems.includes(i.id)).reduce((s, i) => s + i.price, 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 50, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 120, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 50, borderRadius: 10 }}/>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Restaurant header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 14, paddingBottom: 10,
        borderBottom: '1px solid var(--separator)',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: 'rgba(0,122,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>☕</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Blue Bottle Coffee</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>5 min walk · 4.6★ · Open now</div>
        </div>
      </div>

      {/* Item selection */}
      {items.map((item) => {
        const selected = selectedItems.includes(item.id);
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleItem(item.id)}
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
            <span style={{ fontSize: 24 }}>{item.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.note}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: selected ? 'var(--accent)' : 'var(--text-secondary)' }}>
              ${item.price.toFixed(2)}
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              background: selected ? 'var(--accent)' : 'var(--bg-secondary)',
              border: selected ? 'none' : '1.5px solid var(--text-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {selected && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          </motion.button>
        );
      })}

      {/* Deal banner */}
      <div style={{
        background: 'rgba(48,209,88,0.1)', borderRadius: 10,
        padding: '8px 12px', marginBottom: 14, marginTop: 4,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>🏷️</span>
        <span style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 600 }}>
          10% off applied — returning customer discount
        </span>
      </div>

      {/* Delivery info */}
      <div style={{
        background: 'var(--bg-tertiary)', borderRadius: 12,
        padding: 14, marginBottom: 14,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 2 }}>Estimated Delivery</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>25 min</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 2 }}>Total</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-green)' }}>${(total * 0.9).toFixed(2)}</div>
        </div>
      </div>

      {/* Action */}
      {workspacePhase !== 'complete' && (
        <motion.button
          whileTap={selectedItems.length > 0 ? { scale: 0.97 } : {}}
          onClick={() => { successSound(); approveAction(); }}
          disabled={selectedItems.length === 0}
          style={{
            width: '100%', padding: 14,
            background: selectedItems.length > 0 ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: 'none', borderRadius: 12,
            color: selectedItems.length > 0 ? 'white' : 'var(--text-tertiary)',
            fontSize: 16, fontWeight: 600,
            cursor: selectedItems.length > 0 ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          {selectedItems.length > 0 ? `Place Order — $${(total * 0.9).toFixed(2)}` : 'Select items'}
        </motion.button>
      )}
    </motion.div>
  );
}
