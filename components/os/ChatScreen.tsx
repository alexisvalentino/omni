'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound } from '../../services/sounds';

export default function ChatScreen() {
  const goHome = useOmniStore((s) => s.goHome);
  const chatMessages = useOmniStore((s) => s.chatMessages);
  const isChatTyping = useOmniStore((s) => s.isChatTyping);
  const sendChatMessage = useOmniStore((s) => s.sendChatMessage);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    tapSound();
    sendChatMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        paddingTop: 130,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 12,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--separator)',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        flexShrink: 0,
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
        <div style={{ flex: 1, textAlign: 'center', marginRight: 50 }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>
            Omni
          </div>
          <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500 }}>
            Online
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Welcome message if empty */}
        {chatMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              padding: '40px 20px',
            }}
          >
            <div style={{
              margin: '0 auto 16px',
              fontSize: 14,
              fontWeight: 300,
              letterSpacing: '4px',
              color: 'var(--text-tertiary)',
              textTransform: 'lowercase',
            }}>
              omni
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              Chat with Omni
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 260, margin: '0 auto' }}>
              Ask me anything — about your commute, schedule, emails, or just say hi.
            </div>

            {/* Quick starters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 20 }}>
              {['Hey Omni!', "What's my schedule?", 'Check my email', "How's the weather?"].map((q) => (
                <motion.button
                  key={q}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { tapSound(); sendChatMessage(q); }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--separator)',
                    borderRadius: 20,
                    padding: '8px 14px',
                    fontSize: 13,
                    color: 'var(--accent)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message bubbles */}
        <AnimatePresence>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: 6,
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{
                  width: 26, height: 26, borderRadius: 13,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--separator)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="9"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--separator)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                fontSize: 14,
                lineHeight: 1.5,
                fontWeight: 400,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isChatTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 6,
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: 13,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--separator)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div style={{
                padding: '12px 18px',
                borderRadius: '18px 18px 18px 4px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--separator)',
                display: 'flex',
                gap: 4,
              }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: 'var(--text-tertiary)',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div style={{
        padding: '10px 16px',
        paddingBottom: 'max(var(--safe-area-bottom, 0px), 16px)',
        borderTop: '1px solid var(--separator)',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Omni..."
          style={{
            flex: 1,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--separator)',
            borderRadius: 22,
            padding: '10px 16px',
            fontSize: 15,
            color: 'var(--text-primary)',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: 36, height: 36, borderRadius: 18,
            background: input.trim() ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            transition: 'background 0.2s ease',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? 'white' : 'var(--text-tertiary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
