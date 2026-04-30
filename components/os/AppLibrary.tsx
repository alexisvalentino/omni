'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore, GLOBAL_APP_SUGGESTIONS } from '../../store/omni';
import { tapSound } from '../../services/sounds';

export default function AppLibrary() {
  const goHome = useOmniStore((s) => s.goHome);
  const goToSettings = useOmniStore((s) => s.goToSettings);
  const goToChat = useOmniStore((s) => s.goToChat);
  const apps = useOmniStore((s) => s.apps);
  const openAppWithSuggestions = useOmniStore((s) => s.openAppWithSuggestions);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats: Record<string, typeof apps> = {};
    const filteredApps = apps.filter(app => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filteredApps.forEach((app) => {
      if (!cats[app.category]) cats[app.category] = [];
      cats[app.category].push(app);
    });
    return cats;
  }, [apps, searchQuery]);

  const handleAppTap = (appName: string) => {
    tapSound();
    if (appName === 'Settings') { goToSettings(); return; }
    if (appName === 'Omni') { goToChat(); return; }
    const suggestions = GLOBAL_APP_SUGGESTIONS[appName] || [`Open ${appName}`, `What can ${appName} do?`, `Help me with ${appName}`];
    openAppWithSuggestions(appName, suggestions);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingTop: 130,
      paddingBottom: 40,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        marginBottom: 20,
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { tapSound(); goHome(); }}
          style={{
            background: 'none', border: 'none',
            padding: '8px 12px 8px 0',
            color: 'var(--accent)', fontSize: 15, fontWeight: 400,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </motion.button>
        <h1 style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 17,
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
          marginRight: 50,
        }}>
          App Library
        </h1>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 20px', marginBottom: 30 }}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 10,
          border: '1px solid var(--separator)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Apps"
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-primary)', 
              fontSize: 16,
              width: '100%',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      {/* App categories */}
      <div style={{ padding: '0 20px' }}>
        {Object.entries(categories).map(([category, catApps], catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.08 }}
            style={{ marginBottom: 32 }}
          >
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: '1px solid var(--separator)'
            }}>
              {category}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
              {catApps.map((app, i) => (
                <motion.button
                  key={app.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: catIdx * 0.06 + i * 0.02 }}
                  whileTap={{ scale: 0.98, opacity: 0.7 }}
                  onClick={() => handleAppTap(app.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: '14px 4px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontSize: 18,
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    letterSpacing: '0.3px',
                  }}>
                    {app.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
        {Object.keys(categories).length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-tertiary)', fontSize: 15 }}>
            No apps found
          </div>
        )}
      </div>

      {/* Footer note */}
      <div style={{
        textAlign: 'center',
        padding: '30px 40px 40px',
        fontSize: 12,
        color: 'var(--text-tertiary)',
        lineHeight: 1.5,
      }}>
        Omni manages your apps intelligently. Tap any app to let Omni handle it, or use voice commands.
      </div>
    </div>
  );
}
