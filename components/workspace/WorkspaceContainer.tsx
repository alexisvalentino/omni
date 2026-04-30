'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import CommuteScenario from '../scenarios/CommuteScenario';
import RelationshipScenario from '../scenarios/RelationshipScenario';
import EmailScenario from '../scenarios/EmailScenario';
import ScheduleScenario from '../scenarios/ScheduleScenario';
import OrderScenario from '../scenarios/OrderScenario';
import FinanceScenario from '../scenarios/FinanceScenario';
import NavigationScenario from '../scenarios/NavigationScenario';
import TravelScenario from '../scenarios/TravelScenario';
import GeneralScenario from '../scenarios/GeneralScenario';
import { tickSound, openSound } from '../../services/sounds';
import { getCommuteDepartureTime, getCalendarEvents } from '../../services/timeContext';

function TypingText({ text, speed = 25, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onDone]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="typing-cursor" />}
    </span>
  );
}

export default function WorkspaceContainer() {
  const userPrompt = useOmniStore((s) => s.userPrompt);
  const orchestratorMessage = useOmniStore((s) => s.orchestratorMessage);
  const agentSteps = useOmniStore((s) => s.agentSteps);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const activeScenario = useOmniStore((s) => s.activeScenario);
  const goHome = useOmniStore((s) => s.goHome);
  const advanceWorkspace = useOmniStore((s) => s.advanceWorkspace);
  const completeStep = useOmniStore((s) => s.completeStep);
  const approveAction = useOmniStore((s) => s.approveAction);

  const events = getCalendarEvents();

  const [typingDone, setTypingDone] = useState(false);
  const [stepsAnimated, setStepsAnimated] = useState(false);
  const [showToolCard, setShowToolCard] = useState(false);
  const stepIndexRef = useRef(0);
  const stepIdsRef = useRef<string[]>([]);

  const handleTypingDone = useCallback(() => setTypingDone(true), []);

  // Snapshot step IDs once when workspace opens
  useEffect(() => {
    if (agentSteps.length > 0 && stepIdsRef.current.length === 0) {
      stepIdsRef.current = agentSteps.map((s) => s.id);
    }
  }, [agentSteps]);

  // Auto-animate steps after typing completes
  useEffect(() => {
    if (!typingDone || stepsAnimated) return;
    const ids = stepIdsRef.current;
    stepIndexRef.current = 0;

    const interval = setInterval(() => {
      if (stepIndexRef.current < ids.length) {
        completeStep(ids[stepIndexRef.current]);
        tickSound();
        stepIndexRef.current++;
      } else {
        clearInterval(interval);
        setStepsAnimated(true);
        setTimeout(() => {
          advanceWorkspace();
          openSound();
          setShowToolCard(true);
        }, 400);
      }
    }, 600);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingDone, stepsAnimated]);

  const renderToolCard = () => {
    switch (activeScenario) {
      case 'commute': return <CommuteScenario />;
      case 'relationship': return <RelationshipScenario />;
      case 'email': return <EmailScenario />;
      case 'schedule': return <ScheduleScenario />;
      case 'order': return <OrderScenario />;
      case 'finance': return <FinanceScenario />;
      case 'navigation': return <NavigationScenario />;
      case 'travel': return <TravelScenario />;
      case 'general': return <GeneralScenario />;
      default: return null;
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      paddingTop: 130,
      paddingBottom: 90,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={goHome}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 0',
            fontFamily: 'inherit',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Home
        </motion.button>

        {/* Card 1: Orchestrator */}
        <motion.div
          className="omni-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* User prompt */}
          <div style={{
            fontSize: 13,
            color: 'var(--text-tertiary)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 8,
          }}>
            Your request
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 500,
            marginBottom: 16,
            color: 'var(--text-primary)',
          }}>
            &ldquo;{userPrompt}&rdquo;
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: 'var(--separator)',
            margin: '0 -16px 16px',
          }}/>

          {/* AI Plan message */}
          <div style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            marginBottom: 16,
            lineHeight: 1.6,
          }}>
            <TypingText text={orchestratorMessage} onDone={handleTypingDone} />
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {agentSteps.map((step) => (
              <div key={step.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 14,
              }}>
                {step.status === 'done' ? (
                  <div className="step-done-icon" style={{
                    width: 20, height: 20,
                    borderRadius: 10,
                    background: 'var(--accent-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                ) : (
                  <div style={{
                    width: 20, height: 20,
                    borderRadius: 10,
                    border: '1.5px solid var(--text-tertiary)',
                    flexShrink: 0,
                  }}/>
                )}
                <span style={{
                  color: step.status === 'done' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  transition: 'color 0.3s ease',
                }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 2: Tool Execution */}
        <AnimatePresence>
          {showToolCard && workspacePhase !== 'orchestrator' && (
            <motion.div
              className="omni-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
            >
              <div style={{
                fontSize: 13,
                color: 'var(--text-tertiary)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 12,
              }}>
                Agent Workspace
              </div>
              {renderToolCard()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card 3: Confirmation / Receipt */}
        <AnimatePresence>
          {workspacePhase === 'complete' && (
            <motion.div
              className="omni-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.15 }}
              style={{ borderColor: 'var(--accent-green)' }}
            >
              {/* Success header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
              }}>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: 16,
                  background: 'var(--accent-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Done</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Saved to memory feed</div>
                </div>
              </div>

              {/* Scenario-specific receipt */}
              {activeScenario === 'commute' && (
                <div style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 14,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Transit Pass</div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>BART — SFO</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-green)' }}>$12</div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>From</span> Powell St</div>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>Departs</span> {getCommuteDepartureTime()}</div>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>ETA</span> 42 min</div>
                  </div>
                </div>
              )}

              {activeScenario === 'relationship' && (() => {
                const lower = userPrompt.toLowerCase();
                let initial = 'S';
                let initialColor = 'var(--text-primary)';
                let title = 'Sarah Chen';
                let subtitle = '2 messages sent';
                let detail = 'Cancelled dinner tonight • Proposed lunch Tue 12:30 PM at The Corner Kitchen';

                if (lower.includes('mom') && (lower.includes('message') || lower.includes('text'))) {
                  initial = 'M';
                  title = 'Mom';
                  subtitle = 'Message sent';
                  detail = 'Sent iMessage: "Hey Mom! Just thinking about you..."';
                } else if (lower.includes('john') || lower.includes('birthday')) {
                  initial = 'J';
                  title = 'John Doe';
                  subtitle = 'Message sent';
                  detail = 'Sent iMessage with birthday wishes and celebratory emojis';
                } else if (lower.includes('texts') || lower.includes('read')) {
                  initial = '✓';
                  initialColor = 'var(--accent-green)';
                  title = 'Messages Read';
                  subtitle = 'Inbox caught up';
                  detail = 'Marked 4 messages as read • No urgent replies needed';
                } else if (lower.includes('mom') && lower.includes('call')) {
                  initial = 'M';
                  title = 'Mom';
                  subtitle = 'Call ended';
                  detail = 'FaceTime Audio • 4m 12s duration';
                } else if (lower.includes('recent') || lower.includes('missed')) {
                  initial = 'M';
                  title = 'Mom';
                  subtitle = 'Call ended';
                  detail = 'Returned missed call • 2m 05s duration';
                } else if (lower.includes('pizza') || lower.includes('nearest')) {
                  initial = '🍕';
                  title = "Tony's Pizza";
                  subtitle = 'Call ended';
                  detail = 'Mobile Call • 1m 30s duration';
                }

                return (
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 16, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: initialColor }}>
                        {initial}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                        <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>{subtitle}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {detail}
                    </div>
                  </div>
                );
              })()}

              {activeScenario === 'email' && (() => {
                const lower = userPrompt.toLowerCase();
                let initial = 'DK';
                let initialColor = 'var(--accent)';
                let title = 'Reply sent to David Kim';
                let subtitle = 'Re: Q3 Deliverables Timeline';
                let detail = 'Deadline pushed to next Wednesday • Dashboard mockups confirmed for Friday';
                
                if (lower.includes('boss') || lower.includes('summarize')) {
                  // Keep default DK summary
                } else if (lower.includes('draft') || lower.includes('follow-up')) {
                  initial = 'SC';
                  initialColor = 'var(--accent-orange)';
                  title = 'Follow-up sent to Sarah Chen';
                  subtitle = 'Landing Page Assets';
                  detail = 'Requested ETA for design assets • Aiming for next Tuesday implementation';
                } else if (lower.includes('unread') || lower.includes('check')) {
                  initial = '✓';
                  initialColor = 'var(--accent-green)';
                  title = 'Inbox Cleared';
                  subtitle = '3 unread messages processed';
                  detail = 'All messages marked as read • No further action required';
                } else if (lower.includes('reply') || lower.includes('latest')) {
                  initial = 'AC';
                  initialColor = 'var(--accent-green)';
                  title = 'Reply sent to Alex Chen';
                  subtitle = 'Re: Latest Metrics Report';
                  detail = 'Acknowledged receipt • Deeper dive this afternoon • Scheduled sync for tomorrow';
                }

                return (
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 16,
                        background: 'var(--bg-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 600, color: initialColor,
                      }}>{initial}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                        <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>{subtitle}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {detail}
                    </div>
                  </div>
                );
              })()}

              {activeScenario === 'schedule' && (() => {
                const lower = userPrompt.toLowerCase();
                let title = 'Schedule Optimized';
                let subtitle = '3 events reorganized';
                let detail = 'Design Review moved to 2 PM • 3-5 PM block freed for focus time';
                if ((lower.includes('what') && lower.includes('calendar')) || lower.includes('today')) {
                  title = 'Schedule Reviewed';
                  subtitle = 'Today\'s overview ready';
                  detail = `${events.filter(e => e.isPast).length} completed • ${events.filter(e => !e.isPast).length} upcoming`;
                } else if ((lower.includes('schedule') && lower.includes('meeting')) || lower.includes('schedule a')) {
                  title = 'Meeting Scheduled';
                  subtitle = 'Tomorrow at 2:00 PM';
                  detail = 'Conference Room B • Calendar invite sent • No conflicts';
                } else if (lower.includes('free') || lower.includes('next free') || lower.includes('available')) {
                  title = 'Free Slots Found';
                  subtitle = '2 open blocks today';
                  detail = 'Next free: 10:00 AM – 12:30 PM (2.5 hours)';
                } else if (lower.includes('block') || lower.includes('lunch')) {
                  title = 'Lunch Hour Blocked';
                  subtitle = '12:00 PM – 1:00 PM';
                  detail = 'Calendar event created • Auto-decline enabled';
                }
                return (
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 24 }}>📅</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                        <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>{subtitle}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {detail}
                    </div>
                  </div>
                );
              })()}

              {activeScenario === 'order' && (
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Order Placed</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>Blue Bottle Coffee</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-green)' }}>$16.65</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Oat Milk Latte + Avocado Toast • ETA 25 min</div>
                </div>
              )}

              {activeScenario === 'finance' && (() => {
                const lower = userPrompt.toLowerCase();
                if (lower.includes('wallet') || lower.includes('balance') || lower.includes('card') || lower.includes('pay') || lower.includes('transaction')) {
                  return (
                    <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 24 }}>💳</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>Payment Processed</div>
                          <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>Apple Card Balance Paid</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        Payment successful • Updated available credit to $10,000.00
                      </div>
                    </div>
                  );
                }
                return (
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 24 }}>📈</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>Alert Set</div>
                        <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>NVDA target: $850.00</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Portfolio: $24,830 (+$142 today) • You&apos;ll be notified when NVDA hits $850
                    </div>
                  </div>
                );
              })()}

              {activeScenario === 'navigation' && (() => {
                const lower = userPrompt.toLowerCase();
                let title = 'Navigation Started';
                let subtitle = 'Turn-by-turn active';
                let detail = 'Route calculated · Following optimal path';
                if (lower.includes('downtown')) {
                  title = 'Navigating to Downtown';
                  subtitle = 'Walking directions active';
                  detail = 'Downtown SF · 18 min walk · 0.9 mi';
                } else if (lower.includes('coffee') || lower.includes('nearest')) {
                  title = 'Navigating to Philz Coffee';
                  subtitle = 'Walking directions active';
                  detail = 'Philz Coffee · 8 min walk via Market St';
                } else if (lower.includes('work') || lower.includes('office') || lower.includes('directions to')) {
                  title = 'Navigating to Work';
                  subtitle = 'Driving directions active';
                  detail = 'Office · 22 min via 101 S · Light traffic';
                } else if (lower.includes('airport') || lower.includes('how far')) {
                  title = 'SFO Airport — 13 mi away';
                  subtitle = 'Distance calculated';
                  detail = 'Driving: 25 min · BART: 38 min · Rideshare: 22 min';
                }
                return (
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 24 }}>🗺️</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                        <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>{subtitle}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {detail}
                    </div>
                  </div>
                );
              })()}

              {activeScenario === 'travel' && (
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Flight Booked</div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>United — SFO → JFK</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-green)' }}>$289</div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>Departs</span> 8:00 AM</div>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>Arrives</span> 4:30 PM</div>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>Saved</span> $40</div>
                  </div>
                </div>
              )}

              {activeScenario === 'general' && (() => {
                const lower = userPrompt.toLowerCase();
                let icon = '✨';
                let title = 'Task Complete';
                let subtitle = 'Request handled';
                let detail = 'Saved to memory feed';

                if (lower.includes('take a photo') || lower.includes('camera') || lower.includes('selfie') || lower.includes('video') || lower.includes('scan')) {
                  icon = '📷';
                  title = 'Media Captured';
                  subtitle = 'Saved to Photos';
                  detail = 'High-resolution media saved • Synced to iCloud';
                } else if (lower.includes('safari') || lower.includes('search') || lower.includes('bookmark') || lower.includes('trending') || lower.includes('movie')) {
                  icon = '🧭';
                  title = 'Browsing Session';
                  subtitle = 'Safari';
                  detail = 'Web results displayed • Safari tab left open in background';
                } else if (lower.includes('photos') || lower.includes('vacation') || lower.includes('collage') || lower.includes('gallery') || lower.includes('share photos')) {
                  icon = '🖼️'; title = 'Photos Accessed'; subtitle = 'Photos app'; detail = 'Gallery requested • Albums ready to view';
                } else if (lower.includes('music') || lower.includes('play') || lower.includes('listen') || lower.includes('lo-fi') || lower.includes('liked') || lower.includes('album') || lower.includes('drake')) {
                  icon = '🎵'; title = 'Audio Playing'; subtitle = 'Apple Music'; detail = 'Background playback started • Playing on AirPods';
                } else if (lower.includes('podcast')) {
                  icon = '🎙️'; title = 'Podcast Playing'; subtitle = 'Apple Podcasts'; detail = 'Resumed latest episode • Synced playback';
                } else if (lower.includes('news') || lower.includes('headline')) {
                  icon = '📰'; title = 'News Briefing Delivered'; subtitle = 'Apple News'; detail = 'Top stories aggregated • Personalized feed ready';
                } else if (lower.includes('book') || lower.includes('read') || lower.includes('novel')) {
                  icon = '📚'; title = 'Book Opened'; subtitle = 'Apple Books'; detail = 'Reading session resumed • Progress saved';
                } else if (lower.includes('note') || lower.includes('ideas list')) {
                  icon = '📝'; title = 'Note Saved'; subtitle = 'Apple Notes'; detail = 'Note updated and saved to iCloud';
                } else if (lower.includes('remind')) {
                  icon = '✅'; title = 'Reminder Set'; subtitle = 'Reminders'; detail = 'Task scheduled • Notification configured';
                } else if (lower.includes('file') || lower.includes('report') || lower.includes('download') || lower.includes('presentation') || lower.includes('document')) {
                  icon = '📁'; title = 'File Opened'; subtitle = 'Files App'; detail = 'Document retrieved • Ready for editing';
                } else if (lower.includes('weather') || lower.includes('rain') || lower.includes('forecast')) {
                  icon = '🌤️'; title = 'Weather Checked'; subtitle = 'Weather App'; detail = 'Forecast generated • Radar available';
                } else if (lower.includes('clock') || lower.includes('timer') || lower.includes('alarm') || lower.includes('time is') || lower.includes('stopwatch')) {
                  icon = '⏱️'; title = 'Clock Action'; subtitle = 'Clock App'; detail = 'Timer/Alarm set and active';
                } else if (lower.includes('calculate') || lower.includes('tip') || lower.includes('convert') || lower.includes('split') || lower.includes('mortgage')) {
                  icon = '🧮'; title = 'Calculated'; subtitle = 'Calculator'; detail = 'Result copied to clipboard';
                } else if (lower.includes('translate') || lower.includes('japanese') || lower.includes('french') || lower.includes('spanish')) {
                  icon = '🌐'; title = 'Translated'; subtitle = 'Translate App'; detail = 'Text translated successfully';
                } else if (lower.includes('health') || lower.includes('sleep') || lower.includes('weight') || lower.includes('steps')) {
                  icon = '❤️'; title = 'Health Synced'; subtitle = 'Apple Health'; detail = 'Metrics retrieved and updated';
                } else if (lower.includes('fitness') || lower.includes('run') || lower.includes('workout') || lower.includes('goal')) {
                  icon = '🏃'; title = 'Workout Synced'; subtitle = 'Apple Fitness'; detail = 'Activity tracked on Apple Watch';
                }

                return (
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 24 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                        <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>{subtitle}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {detail}
                    </div>
                  </div>
                );
              })()}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={goHome}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--separator)',
                  borderRadius: 12,
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Back to Home
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
