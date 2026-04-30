'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound } from '../../services/sounds';

type RelVariant = 'dinner' | 'mom_msg' | 'birthday' | 'read_texts' | 'mom_call' | 'recent_calls' | 'pizza';

function getRelVariant(prompt: string): RelVariant {
  const lower = prompt.toLowerCase();
  if (lower.includes('dinner') || lower.includes('sarah')) return 'dinner';
  if (lower.includes('mom') && (lower.includes('message') || lower.includes('text'))) return 'mom_msg';
  if (lower.includes('john') || lower.includes('birthday')) return 'birthday';
  if (lower.includes('texts') || lower.includes('read')) return 'read_texts';
  if (lower.includes('mom') && lower.includes('call')) return 'mom_call';
  if (lower.includes('recent') || lower.includes('missed')) return 'recent_calls';
  if (lower.includes('pizza') || lower.includes('nearest')) return 'pizza';
  return 'dinner';
}

const chatDinner = "Hey Sarah! Really sorry but I'm stuck at work tonight and won't be able to make dinner. 😔 But I'd love to catch up — are you free for lunch next week? I've got Tuesday at 12:30 open. There's that new place on Main St I've been wanting to try!";
const chatMom = "Hey Mom! Just thinking about you. Hope you're having a great week! Call you this weekend ❤️";
const chatBday = "Happy birthday John! 🎉 Hope you have an awesome day and we should definitely celebrate soon! 🍻";

export default function RelationshipScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const userPrompt = useOmniStore((s) => s.userPrompt);
  
  const [loading, setLoading] = useState(true);
  const [typedMsg, setTypedMsg] = useState('');
  const [msgDone, setMsgDone] = useState(false);

  const variant = useMemo(() => getRelVariant(userPrompt), [userPrompt]);

  const targetMsg = useMemo(() => {
    if (variant === 'dinner') return chatDinner;
    if (variant === 'mom_msg') return chatMom;
    if (variant === 'birthday') return chatBday;
    return '';
  }, [variant]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading || targetMsg === '') {
      if (targetMsg === '') setMsgDone(true);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      setTypedMsg(targetMsg.slice(0, i));
      if (i >= targetMsg.length) {
        clearInterval(interval);
        setMsgDone(true);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [loading, targetMsg]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 50, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 120, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 60, borderRadius: 10 }}/>
      </div>
    );
  }

  // ── Variant: Read latest texts ──────────────────────────────────────────
  if (variant === 'read_texts') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          Unread Messages
        </div>
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 14 }}>
          {[
            { sender: 'Sarah Chen', preview: 'Are we still on for dinner?', time: '5m', unread: 1 },
            { sender: 'Mom', preview: 'Call me when you are free!', time: '1h', unread: 2 },
            { sender: 'Delivery', preview: 'Your package has been delivered.', time: '2h', unread: 1 },
          ].map((msg, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--separator)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--accent)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{msg.sender}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{msg.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{msg.preview}</div>
              </div>
            </div>
          ))}
        </div>
        {workspacePhase !== 'complete' && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => { successSound(); approveAction(); }} style={{ width: '100%', padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Mark All as Read
          </motion.button>
        )}
      </motion.div>
    );
  }

  // ── Variant: Recent / Missed Calls ──────────────────────────────────────
  if (variant === 'recent_calls') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          Recent Calls
        </div>
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 14 }}>
          {[
            { caller: 'Mom', type: 'Missed Call', time: '10m ago', isMissed: true },
            { caller: 'David Kim', type: 'Outgoing Call', time: '2h ago', isMissed: false },
            { caller: 'Spam Risk', type: 'Missed Call', time: '4h ago', isMissed: true },
          ].map((call, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--separator)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                📞
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: call.isMissed ? 'var(--accent-red)' : 'var(--text-primary)' }}>{call.caller}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{call.type} · {call.time}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Call Back</div>
            </div>
          ))}
        </div>
        {workspacePhase !== 'complete' && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => { successSound(); approveAction(); }} style={{ width: '100%', padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Call Back Mom
          </motion.button>
        )}
      </motion.div>
    );
  }

  // ── Phone Call Variants ──────────────────────────────────────────────────
  if (variant === 'mom_call' || variant === 'pizza') {
    const isPizza = variant === 'pizza';
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div style={{ textAlign: 'center', padding: '20px 0 30px' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: 'var(--bg-tertiary)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            {isPizza ? '🍕' : '👩‍👧'}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{isPizza ? "Tony's Pizza" : 'Mom'}</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{isPizza ? 'Calling Mobile...' : 'FaceTime Audio...'}</div>
        </div>
        
        {isPizza && (
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(0,122,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>📍</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>0.8 miles away</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>123 Main St, San Francisco</div>
            </div>
          </div>
        )}

        {workspacePhase !== 'complete' && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => { successSound(); approveAction(); }} style={{ width: '100%', padding: 14, background: 'var(--accent-red)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            End Call
          </motion.button>
        )}
      </motion.div>
    );
  }

  // ── Draft Message Variants (Dinner, Mom, Birthday) ────────────────────────
  let initial = 'S';
  let name = 'Sarah Chen';
  let status = 'Last seen 15 min ago';
  
  if (variant === 'mom_msg') { initial = 'M'; name = 'Mom'; status = 'iMessage'; }
  if (variant === 'birthday') { initial = 'J'; name = 'John Doe'; status = 'Birthday today! 🎉'; }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Contact header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, padding: '10px 0', borderBottom: '1px solid var(--separator)' }}>
        <div style={{ width: 42, height: 42, borderRadius: 21, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          {initial}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{status}</div>
        </div>
      </div>

      {/* Chat simulation */}
      <div style={{ background: 'var(--bg-tertiary)', borderRadius: 16, borderBottomLeftRadius: 4, padding: 14, marginBottom: 12, maxWidth: '92%' }}>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
          {typedMsg}
          {!msgDone && <span className="typing-cursor" />}
        </div>
      </div>

      {/* Extra cards for dinner variant */}
      {variant === 'dinner' && msgDone && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,122,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 20 }}>📅</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Tuesday, 12:30 PM</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Suggested slot · 90 min free</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(48,209,88,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 20 }}>🍽️</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>The Corner Kitchen</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Main St · 4.7 rating · $$</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action */}
      {workspacePhase !== 'complete' && (
        <motion.button whileTap={msgDone ? { scale: 0.97 } : {}} onClick={() => { successSound(); approveAction(); }} disabled={!msgDone}
          style={{ width: '100%', padding: 14, background: msgDone ? 'var(--accent)' : 'var(--bg-tertiary)', border: 'none', borderRadius: 12, color: msgDone ? 'white' : 'var(--text-tertiary)', fontSize: 16, fontWeight: 600, cursor: msgDone ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'all 0.2s ease' }}>
          Approve & Send
        </motion.button>
      )}
    </motion.div>
  );
}
