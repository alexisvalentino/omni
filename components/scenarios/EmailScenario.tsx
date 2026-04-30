'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound, tapSound } from '../../services/sounds';

// ─── Query-specific result data ──────────────────────────────────────────────

type EmailVariant = 'summarize' | 'followup' | 'unread' | 'reply';

function getEmailVariantForPrompt(prompt: string): EmailVariant {
  const lower = prompt.toLowerCase();
  if (lower.includes('boss') || lower.includes('summarize')) return 'summarize';
  if (lower.includes('draft') || lower.includes('follow-up')) return 'followup';
  if (lower.includes('unread') || lower.includes('check')) return 'unread';
  if (lower.includes('reply') || lower.includes('latest')) return 'reply';
  return 'summarize';
}

const emailBodyBoss = `Hi team,

Just wanted to follow up on the Q3 deliverables. I need the updated dashboard mockups and the API integration docs by Friday EOD. This is critical for the client presentation on Monday.

Also, please make sure the staging environment is updated with the latest build. Let me know if there are any blockers.

Thanks,
David`;

const draftReplyBoss = `Hi David,

Thanks for the heads-up on the timeline. I've reviewed the current progress and want to flag a concern — the API integration docs require input from the backend team, who are wrapping up the auth migration through Wednesday.

I can have the dashboard mockups ready by Friday, but I'd recommend pushing the API docs to next Wednesday to ensure accuracy. This won't impact the client presentation since we can walk through the architecture overview instead.

Happy to jump on a quick call to align. Let me know what works.

Best regards`;

const draftFollowup = `Hi Sarah,

Hope you're having a good week.

I'm following up on the design assets for the new landing page we discussed last Thursday. Do you have an ETA on when those might be ready for review? 

Our developers are aiming to start implementation by next Tuesday, so having them by end of week would be ideal.

Let me know if you need any additional context or if there are any blockers on your end.

Best,`;

const draftReplyLatest = `Hi Alex,

Thanks for reaching out and sharing the latest metrics report. I've taken a brief look and the numbers are very promising, especially the user retention stats from the new cohort.

I'll do a deeper dive this afternoon and add my comments directly to the document. Let's touch base tomorrow morning during our standup to discuss next steps.

Talk soon,`;

export default function EmailScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const userPrompt = useOmniStore((s) => s.userPrompt);
  const [loading, setLoading] = useState(true);
  const [showDraft, setShowDraft] = useState(false);
  const [tone, setTone] = useState<'professional' | 'direct' | 'friendly'>('professional');
  const [typedDraft, setTypedDraft] = useState('');
  const [draftDone, setDraftDone] = useState(false);

  const variant = useMemo(() => getEmailVariantForPrompt(userPrompt), [userPrompt]);

  const targetDraft = useMemo(() => {
    if (variant === 'summarize') return draftReplyBoss;
    if (variant === 'followup') return draftFollowup;
    if (variant === 'reply') return draftReplyLatest;
    return '';
  }, [variant]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading || variant === 'unread') return;
    const t = setTimeout(() => setShowDraft(true), 800);
    return () => clearTimeout(t);
  }, [loading, variant]);

  useEffect(() => {
    if (!showDraft || variant === 'unread') return;
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      setTypedDraft(targetDraft.slice(0, i));
      if (i >= targetDraft.length) {
        clearInterval(interval);
        setDraftDone(true);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [showDraft, targetDraft, variant]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 160, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 40, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 100, borderRadius: 10 }}/>
      </div>
    );
  }

  // ── Variant: Unread Mail ────────────────────────────────────────────────
  if (variant === 'unread') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          Unread Emails (Filtered)
        </div>

        {/* Unread list */}
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
          {[
            { sender: 'David Kim', subject: 'Re: Q3 Deliverables Timeline', time: '10m ago', urgent: true },
            { sender: 'HR Dept', subject: 'Action Required: Benefits Enrollment', time: '1h ago', urgent: false },
            { sender: 'Alex Chen', subject: 'Latest Metrics Report', time: '2h ago', urgent: false },
          ].map((msg, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '10px 0',
              borderBottom: i < arr.length - 1 ? '1px solid var(--separator)' : 'none',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--accent)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{msg.sender}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{msg.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{msg.subject}</div>
                {msg.urgent && <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-red)', marginTop: 4, background: 'rgba(255,69,58,0.1)', display: 'inline-block', padding: '2px 6px', borderRadius: 4 }}>Urgent</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Action */}
        {workspacePhase !== 'complete' && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { successSound(); approveAction(); }}
            style={{ width: '100%', padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Mark All as Read
          </motion.button>
        )}
      </motion.div>
    );
  }

  // ── Other Variants (Summarize, Follow-up, Reply) ────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {variant === 'summarize' && (
        <>
          {/* Original email */}
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 17, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>DK</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>David Kim</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>VP of Product · 2h ago</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Re: Q3 Deliverables Timeline</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {emailBodyBoss.split('Friday').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span style={{ background: 'rgba(255,69,58,0.2)', color: 'var(--accent-red)', fontWeight: 600, padding: '1px 4px', borderRadius: 3 }}>Friday</span>}
                </span>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          <div style={{ background: 'rgba(0,122,255,0.08)', borderRadius: 12, padding: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>Summary</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              David needs dashboard mockups + API docs by <strong style={{ color: 'var(--accent-red)' }}>Friday EOD</strong> for Monday client presentation. Also wants staging updated.
            </div>
          </div>
        </>
      )}

      {variant === 'reply' && (
        <>
          {/* Latest email */}
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 17, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'var(--accent-green)' }}>AC</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Alex Chen</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Data Analyst · 15m ago</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Latest Metrics Report</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              Hey, I just finished compiling the new cohort retention stats. Attached is the report. Let me know your thoughts!
            </div>
          </div>
        </>
      )}

      {/* Draft section */}
      {showDraft && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Tone selector */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {(['professional', 'direct', 'friendly'] as const).map((t) => (
              <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => { tapSound(); setTone(t); }}
                style={{ flex: 1, padding: '8px 0', background: tone === t ? 'var(--accent)' : 'var(--bg-tertiary)', border: `1px solid ${tone === t ? 'var(--accent)' : 'var(--separator)'}`, borderRadius: 8, color: tone === t ? 'white' : 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize', transition: 'all 0.15s ease' }}>
                {t}
              </motion.button>
            ))}
          </div>

          {/* Draft content */}
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 8 }}>
              {variant === 'followup' ? 'Follow-up Draft' : 'Draft Reply'} — {tone}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {typedDraft}
              {!draftDone && <span className="typing-cursor" />}
            </div>
          </div>

          {/* Action */}
          {workspacePhase !== 'complete' && (
            <motion.button whileTap={draftDone ? { scale: 0.97 } : {}} onClick={() => { successSound(); approveAction(); }} disabled={!draftDone}
              style={{ width: '100%', padding: 14, background: draftDone ? 'var(--accent)' : 'var(--bg-tertiary)', border: 'none', borderRadius: 12, color: draftDone ? 'white' : 'var(--text-tertiary)', fontSize: 16, fontWeight: 600, cursor: draftDone ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'all 0.2s ease' }}>
              {variant === 'followup' ? 'Send Follow-up' : 'Send Reply'}
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
