'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound } from '../../services/sounds';

const chatMessage = "Hey Sarah! Really sorry but I'm stuck at work tonight and won't be able to make dinner. 😔 But I'd love to catch up — are you free for lunch next week? I've got Tuesday at 12:30 open. There's that new place on Main St I've been wanting to try!";

export default function RelationshipScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const [loading, setLoading] = useState(true);
  const [typedMsg, setTypedMsg] = useState('');
  const [msgDone, setMsgDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedMsg(chatMessage.slice(0, i));
      if (i >= chatMessage.length) {
        clearInterval(interval);
        setMsgDone(true);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 50, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 120, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 60, borderRadius: 10 }}/>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Contact header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 14, padding: '10px 0',
        borderBottom: '1px solid var(--separator)',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 21,
          background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>
          S
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Sarah Chen</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Last seen 15 min ago</div>
        </div>
      </div>

      {/* Chat simulation */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        padding: 14,
        marginBottom: 12,
        maxWidth: '92%',
      }}>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
          {typedMsg}
          {!msgDone && <span className="typing-cursor" />}
        </div>
      </div>

      {/* Calendar card */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'rgba(0,122,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 20 }}>📅</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Tuesday, 12:30 PM</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Suggested slot · 90 min free</div>
        </div>
        <div style={{
          marginLeft: 'auto',
          width: 24, height: 24, borderRadius: 12,
          background: 'var(--accent-green)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      {/* Venue suggestion */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'rgba(48,209,88,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 20 }}>🍽️</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>The Corner Kitchen</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Main St · 4.7 rating · $$</div>
        </div>
      </div>

      {/* Action */}
      {workspacePhase !== 'complete' && (
        <motion.button
          whileTap={msgDone ? { scale: 0.97 } : {}}
          onClick={() => { successSound(); approveAction(); }}
          disabled={!msgDone}
          style={{
            width: '100%', padding: 14,
            background: msgDone ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: 'none', borderRadius: 12,
            color: msgDone ? 'white' : 'var(--text-tertiary)',
            fontSize: 16, fontWeight: 600,
            cursor: msgDone ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          Approve & Send
        </motion.button>
      )}
    </motion.div>
  );
}
