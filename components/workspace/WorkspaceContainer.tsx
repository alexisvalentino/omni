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
import { getCommuteDepartureTime } from '../../services/timeContext';

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

              {activeScenario === 'relationship' && (
                <div style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 16,
                      background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600,
                    }}>S</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Sarah Chen</div>
                      <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>2 messages sent</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Cancelled dinner tonight • Proposed lunch Tue 12:30 PM at The Corner Kitchen
                  </div>
                </div>
              )}

              {activeScenario === 'email' && (
                <div style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 16,
                      background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                    }}>DK</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Reply sent to David Kim</div>
                      <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>Re: Q3 Deliverables Timeline</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Deadline pushed to next Wednesday • Dashboard mockups confirmed for Friday
                  </div>
                </div>
              )}

              {activeScenario === 'schedule' && (
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>📅</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Schedule Optimized</div>
                      <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>3 events reorganized</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Design Review moved to 2 PM • 3-5 PM block freed for focus time
                  </div>
                </div>
              )}

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

              {activeScenario === 'finance' && (
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
              )}

              {activeScenario === 'navigation' && (
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>🗺️</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Navigation Started</div>
                      <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>Walking directions active</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Philz Coffee • 8 min walk via Market St
                  </div>
                </div>
              )}

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

              {activeScenario === 'general' && (
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>✨</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Task Complete</div>
                      <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>Request handled</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Saved to memory feed
                  </div>
                </div>
              )}

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
