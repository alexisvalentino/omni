'use client';

import { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound } from '../../services/sounds';

/** Slide-in banner notification — appears from top */
export function NotificationBanner() {
  const banner = useOmniStore((s) => s.bannerNotification);
  const dismissBanner = useOmniStore((s) => s.dismissBanner);

  return (
    <AnimatePresence>
      {banner && (
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => { if (info.offset.y < -30) dismissBanner(); }}
          onClick={() => { tapSound(); dismissBanner(); }}
          style={{
            position: 'absolute',
            top: 'max(var(--safe-area-top, 0px), 12px)',
            left: 12,
            right: 12,
            zIndex: 400,
            background: 'rgba(28,28,30,0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 16,
            padding: '12px 14px',
            border: '1px solid rgba(84,84,88,0.4)',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{banner.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{banner.app}</span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>now</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{banner.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {banner.body}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Full-screen notification center — slides down from top */
export function NotificationCenter() {
  const isOpen = useOmniStore((s) => s.isNotificationCenterOpen);
  const notifications = useOmniStore((s) => s.notifications);
  const closeNotificationCenter = useOmniStore((s) => s.closeNotificationCenter);
  const markNotificationRead = useOmniStore((s) => s.markNotificationRead);
  const clearNotifications = useOmniStore((s) => s.clearNotifications);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    
    const startY = e.pageY;
    const startScroll = el.scrollTop;
    el.style.cursor = 'grabbing';

    const onMove = (ev: MouseEvent) => {
      el.scrollTop = startScroll - (ev.pageY - startY);
    };
    const onUp = () => {
      el.style.cursor = 'auto';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNotificationCenter}
            style={{
              position: 'absolute', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Panel */}
          <motion.div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              bottom: 0,
              zIndex: 201,
              background: 'var(--bg-primary)',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              background: 'var(--bg-primary)',
              padding: '0 20px 16px',
              paddingTop: 'max(var(--safe-area-top, 0px), 50px)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Notifications
                </h2>
                {unread > 0 && (
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {unread} unread
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {notifications.length > 0 && (
                  <button
                    onClick={() => { tapSound(); clearNotifications(); }}
                    style={{
                      background: 'none', border: 'none', color: 'var(--accent)',
                      fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => { tapSound(); closeNotificationCenter(); }}
                  style={{
                    background: 'var(--bg-tertiary)', border: 'none',
                    width: 30, height: 30, borderRadius: 15,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-secondary)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div style={{ padding: '0 20px', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-tertiary)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>All caught up</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>No notifications right now</div>
                </div>
              ) : (
                notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => { tapSound(); markNotificationRead(n.id); }}
                    style={{
                      background: n.read ? 'var(--bg-secondary)' : 'rgba(0,122,255,0.06)',
                      borderRadius: 14,
                      padding: '13px 14px',
                      border: `1px solid ${n.read ? 'var(--separator)' : 'rgba(0,122,255,0.15)'}`,
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{n.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{n.app}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {!n.read && (
                              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
                            )}
                            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{n.time}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {n.body}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
