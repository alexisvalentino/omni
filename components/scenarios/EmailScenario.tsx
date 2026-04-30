'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound, tapSound } from '../../services/sounds';

const emailBody = `Hi team,

Just wanted to follow up on the Q3 deliverables. I need the updated dashboard mockups and the API integration docs by Friday EOD. This is critical for the client presentation on Monday.

Also, please make sure the staging environment is updated with the latest build. Let me know if there are any blockers.

Thanks,
David`;

const draftReply = `Hi David,

Thanks for the heads-up on the timeline. I've reviewed the current progress and want to flag a concern — the API integration docs require input from the backend team, who are wrapping up the auth migration through Wednesday.

I can have the dashboard mockups ready by Friday, but I'd recommend pushing the API docs to next Wednesday to ensure accuracy. This won't impact the client presentation since we can walk through the architecture overview instead.

Happy to jump on a quick call to align. Let me know what works.

Best regards`;

export default function EmailScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const [loading, setLoading] = useState(true);
  const [showDraft, setShowDraft] = useState(false);
  const [tone, setTone] = useState<'professional' | 'direct' | 'friendly'>('professional');
  const [typedDraft, setTypedDraft] = useState('');
  const [draftDone, setDraftDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setShowDraft(true), 800);
    return () => clearTimeout(t);
  }, [loading]);

  useEffect(() => {
    if (!showDraft) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      setTypedDraft(draftReply.slice(0, i));
      if (i >= draftReply.length) {
        clearInterval(interval);
        setDraftDone(true);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [showDraft]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 160, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 40, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 100, borderRadius: 10 }}/>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Original email */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 17,
              background: 'var(--bg-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 600, color: 'var(--accent)',
            }}>
              DK
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>David Kim</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>VP of Product · 2h ago</div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Re: Q3 Deliverables Timeline
        </div>
        <div style={{
          fontSize: 13, color: 'var(--text-secondary)',
          lineHeight: 1.6, whiteSpace: 'pre-line',
        }}>
          {emailBody.split('Friday').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span style={{
                  background: 'rgba(255,69,58,0.2)',
                  color: 'var(--accent-red)',
                  fontWeight: 600,
                  padding: '1px 4px',
                  borderRadius: 3,
                }}>
                  Friday
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div style={{
        background: 'rgba(0,122,255,0.08)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{
            width: 18, height: 18, borderRadius: 9,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <circle cx="12" cy="12" r="9"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Summary</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          David needs dashboard mockups + API docs by <strong style={{ color: 'var(--accent-red)' }}>Friday EOD</strong> for Monday client presentation. Also wants staging updated.
        </div>
      </div>

      {/* Draft section */}
      {showDraft && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Tone selector */}
          <div style={{
            display: 'flex', gap: 6, marginBottom: 12,
          }}>
            {(['professional', 'direct', 'friendly'] as const).map((t) => (
              <motion.button
                key={t}
                whileTap={{ scale: 0.95 }}
                onClick={() => { tapSound(); setTone(t); }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  background: tone === t ? 'var(--accent)' : 'var(--bg-tertiary)',
                  border: `1px solid ${tone === t ? 'var(--accent)' : 'var(--separator)'}`,
                  borderRadius: 8,
                  color: tone === t ? 'white' : 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                }}
              >
                {t}
              </motion.button>
            ))}
          </div>

          {/* Draft content */}
          <div style={{
            background: 'var(--bg-tertiary)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 8 }}>
              Draft Reply — {tone}
            </div>
            <div style={{
              fontSize: 13, color: 'var(--text-primary)',
              lineHeight: 1.6, whiteSpace: 'pre-line',
            }}>
              {typedDraft}
              {!draftDone && <span className="typing-cursor" />}
            </div>
          </div>

          {/* Action */}
          {workspacePhase !== 'complete' && (
            <motion.button
              whileTap={draftDone ? { scale: 0.97 } : {}}
              onClick={() => { successSound(); approveAction(); }}
              disabled={!draftDone}
              style={{
                width: '100%', padding: 14,
                background: draftDone ? 'var(--accent)' : 'var(--bg-tertiary)',
                border: 'none', borderRadius: 12,
                color: draftDone ? 'white' : 'var(--text-tertiary)',
                fontSize: 16, fontWeight: 600,
                cursor: draftDone ? 'pointer' : 'default',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              Send Reply
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
