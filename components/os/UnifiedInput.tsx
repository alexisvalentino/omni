'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { openSound, tapSound } from '../../services/sounds';

export default function UnifiedInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputValue = useOmniStore((s) => s.inputValue);
  const setInputValue = useOmniStore((s) => s.setInputValue);
  const submitCommand = useOmniStore((s) => s.submitCommand);
  const suggestions = useOmniStore((s) => s.suggestions);
  const showSuggestions = useOmniStore((s) => s.showSuggestions);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    openSound();
    submitCommand(inputValue.trim());
  }, [inputValue, submitCommand]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    tapSound();
    submitCommand(suggestion);
  }, [submitCommand]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 90,
      paddingBottom: 'max(var(--safe-area-bottom, 0px), 16px)',
    }}>
      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '0 20px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(s)}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--separator)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: 'inherit',
                  width: '100%',
                }}
              >
                <span style={{ color: 'var(--accent)', fontSize: 14 }}>→</span>
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
          border: `1px solid ${isFocused ? 'var(--accent)' : 'var(--separator)'}`,
          borderRadius: 'var(--input-radius)',
          padding: '0 6px 0 18px',
          height: 50,
          transition: 'border-color 0.2s ease',
        }}>
          {/* Mic icon */}
          <button
            style={{
              background: 'none', border: 'none', padding: 4,
              color: 'var(--text-secondary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}
            aria-label="Voice input"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="1" width="6" height="12" rx="3"/>
              <path d="M5 10a7 7 0 0014 0"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What do you need done?"
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 16,
              fontFamily: 'inherit',
              padding: '0 12px',
              fontWeight: 400,
            }}
          />

          {/* Submit / Camera */}
          {inputValue.trim() ? (
            <button
              onClick={handleSubmit}
              style={{
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 18,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label="Submit command"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          ) : (
            <button
              style={{
                background: 'none', border: 'none', padding: 8,
                color: 'var(--text-secondary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}
              aria-label="Camera input"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="15" rx="2"/>
                <circle cx="12" cy="13" r="4"/>
                <path d="M9 2h6l1.5 3h-9z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
