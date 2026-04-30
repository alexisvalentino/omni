'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound, openSound } from '../../services/sounds';

/**
 * AppScreen — shown when user taps an app from the App Library.
 * Displays the app name, contextual suggestion chips, and an input bar
 * so the user can choose an action before the agent executes.
 */
export default function AppScreen() {
  const activeAppName = useOmniStore((s) => s.activeAppName);
  const activeAppSuggestions = useOmniStore((s) => s.activeAppSuggestions);
  const apps = useOmniStore((s) => s.apps);
  const submitCommand = useOmniStore((s) => s.submitCommand);
  const goHome = useOmniStore((s) => s.goHome);

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const activeApp = apps.find((a) => a.name === activeAppName);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    openSound();
    submitCommand(inputValue.trim());
  }, [inputValue, submitCommand]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    tapSound();
    submitCommand(suggestion);
  }, [submitCommand]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 130,
      paddingBottom: 20,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Back button */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { tapSound(); goHome(); }}
          style={{
            background: 'none', border: 'none',
            padding: '4px 0',
            color: 'var(--accent)', fontSize: 15, fontWeight: 400,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Home
        </motion.button>
      </div>

      {/* App branding */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        marginBottom: 32,
        padding: '0 24px',
      }}>
        {/* App icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
          }}
        >
          {activeApp?.icon || '📱'}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
            marginBottom: 4,
          }}>
            {activeAppName}
          </div>
          <div style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            fontWeight: 400,
          }}>
            What would you like to do?
          </div>
        </motion.div>
      </div>

      {/* Suggestion chips */}
      <div style={{
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: 1,
      }}>
        <AnimatePresence>
          {activeAppSuggestions.map((suggestion, i) => (
            <motion.button
              key={suggestion}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--separator)',
                borderRadius: 14,
                padding: '14px 18px',
                color: 'var(--text-primary)',
                fontSize: 15,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: 'inherit',
                width: '100%',
                fontWeight: 400,
              }}
            >
              <span style={{
                color: 'var(--accent)',
                fontSize: 14,
                fontWeight: 500,
              }}>→</span>
              {suggestion}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Custom input bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          padding: '16px 16px',
          paddingBottom: 'max(var(--safe-area-bottom, 0px), 16px)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
          border: `1px solid ${isFocused ? 'var(--accent)' : 'var(--separator)'}`,
          borderRadius: 'var(--input-radius)',
          padding: '0 6px 0 18px',
          height: 48,
          transition: 'border-color 0.2s ease',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={`Ask ${activeAppName} anything...`}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 15,
              fontFamily: 'inherit',
              padding: '0 12px',
              fontWeight: 400,
            }}
          />
          {inputValue.trim() && (
            <button
              onClick={handleSubmit}
              style={{
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 16,
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label="Submit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
