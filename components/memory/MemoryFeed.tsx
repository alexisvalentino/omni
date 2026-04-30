'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound } from '../../services/sounds';
import { useRef } from 'react';

type UnifiedItem = {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  type: 'notification' | 'memory';
  subtype?: string;
  read?: boolean;
  app?: string;
};

export default function MemoryFeed() {
  const isOpen = useOmniStore((s) => s.isMemoryFeedOpen);
  const memoryItems = useOmniStore((s) => s.memoryItems);
  const notifications = useOmniStore((s) => s.notifications);
  const closeMemoryFeed = useOmniStore((s) => s.closeMemoryFeed);
  const markNotificationRead = useOmniStore((s) => s.markNotificationRead);
  const clearNotifications = useOmniStore((s) => s.clearNotifications);
  const dragY = useMotionValue(0);
  const dragOpacity = useTransform(dragY, [-50, 0, 200], [1, 1, 0.3]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Merge notifications + memory into a single timeline
  const notifItems: UnifiedItem[] = notifications.map((n) => ({
    id: n.id,
    icon: n.icon,
    title: n.title,
    body: n.body,
    time: n.time,
    type: 'notification' as const,
    read: n.read,
    app: n.app,
  }));

  const memItems: UnifiedItem[] = memoryItems.map((m) => ({
    id: m.id,
    icon: m.icon,
    title: 'Omni Agent',
    body: m.text,
    time: m.time,
    type: 'memory' as const,
    subtype: m.type,
  }));

  const allItems = [...notifItems, ...memItems];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMemoryFeed}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 199,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Feed panel */}
          <motion.div
            ref={containerRef}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) closeMemoryFeed();
            }}
            style={{ y: dragY, opacity: dragOpacity }}
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="memory-feed-panel"
          >
            <div style={{ padding: '0 20px', paddingTop: 'max(var(--safe-area-top, 0px), 12px)' }}>
              {/* Drag handle */}
              <div style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: 'var(--text-tertiary)',
                margin: '8px auto 20px',
              }} />

              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <div>
                  <h2 style={{
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: '-0.6px',
                    marginBottom: 2,
                  }}>
                    Activity
                  </h2>
                  <p style={{
                    fontSize: 13,
                    color: 'var(--text-tertiary)',
                  }}>
                    {unreadCount > 0 ? `${unreadCount} unread` : `${allItems.length} items`}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {notifications.length > 0 && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { tapSound(); clearNotifications(); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Clear
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={closeMemoryFeed}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: 'none',
                      borderRadius: 15,
                      width: 30,
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Unified timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 40 }}>
                {allItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-tertiary)' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>All caught up</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>No activity right now</div>
                  </div>
                ) : (
                  allItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => {
                        if (item.type === 'notification' && !item.read) {
                          tapSound();
                          markNotificationRead(item.id);
                        }
                      }}
                      style={{
                        background: item.type === 'notification' && !item.read
                          ? 'rgba(0,122,255,0.06)'
                          : 'var(--bg-secondary)',
                        borderRadius: 14,
                        padding: '13px 14px',
                        border: `1px solid ${item.type === 'notification' && !item.read ? 'rgba(0,122,255,0.15)' : 'var(--separator)'}`,
                        cursor: item.type === 'notification' ? 'pointer' : 'default',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: item.type === 'memory' ? 'var(--accent-teal)' : 'var(--text-secondary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                              }}>
                                {item.type === 'memory' ? 'Omni' : item.app}
                              </span>
                              {item.type === 'memory' && (
                                <div style={{
                                  fontSize: 9,
                                  fontWeight: 600,
                                  color: 'var(--accent-teal)',
                                  background: 'rgba(100,210,255,0.1)',
                                  padding: '1px 5px',
                                  borderRadius: 4,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.3px',
                                }}>
                                  {item.subtype}
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {item.type === 'notification' && !item.read && (
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
                              )}
                              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.time}</span>
                            </div>
                          </div>
                          {item.type === 'notification' && (
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                              {item.title}
                            </div>
                          )}
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {item.body}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
