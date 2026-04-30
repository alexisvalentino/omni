'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { successSound } from '../../services/sounds';

/**
 * GeneralScenario — a catch-all tool card for any command that doesn't map
 * to a dedicated scenario.  It dynamically generates a contextual result
 * based on what the user actually asked for so the workspace never looks blank.
 */

function getResultForPrompt(prompt: string) {
  const lower = prompt.toLowerCase();

  if (lower.includes('weather')) {
    return {
      icon: '🌤️', title: 'Weather Report', subtitle: 'San Francisco, CA',
      details: [
        { label: 'Now', value: '64°F — Partly Cloudy' },
        { label: 'High / Low', value: '68° / 54°' },
        { label: 'Wind', value: '12 mph W' },
        { label: 'Humidity', value: '62%' },
      ],
      actionLabel: 'Got it',
    };
  }
  if (lower.includes('photo') || lower.includes('camera')) {
    return {
      icon: '📷', title: 'Camera Ready', subtitle: 'Omni Camera AI',
      details: [
        { label: 'Mode', value: 'Smart Auto' },
        { label: 'Scene', value: 'Indoor — Low Light' },
        { label: 'Filter', value: 'Natural' },
        { label: 'Storage', value: '42.3 GB free' },
      ],
      actionLabel: 'Open Camera',
    };
  }
  if (lower.includes('music') || lower.includes('play') || lower.includes('listen')) {
    return {
      icon: '🎵', title: 'Now Playing', subtitle: 'Focus Playlist',
      details: [
        { label: 'Track', value: 'Weightless — Marconi Union' },
        { label: 'Duration', value: '8:09' },
        { label: 'Playlist', value: '12 tracks · 45 min' },
        { label: 'Quality', value: 'Lossless' },
      ],
      actionLabel: 'Play Now',
    };
  }
  if (lower.includes('podcast')) {
    return {
      icon: '🎙️', title: 'Latest Episode', subtitle: 'Tech Podcasts',
      details: [
        { label: 'Show', value: 'The Vergecast' },
        { label: 'Episode', value: '#412 — AI & Design' },
        { label: 'Duration', value: '58 min' },
        { label: 'Released', value: 'Today' },
      ],
      actionLabel: 'Play Episode',
    };
  }
  if (lower.includes('news')) {
    return {
      icon: '📰', title: 'Today\'s Headlines', subtitle: 'Personalized News',
      details: [
        { label: 'Top Story', value: 'Tech stocks rally on AI earnings' },
        { label: 'Local', value: 'New BART expansion approved' },
        { label: 'Sports', value: 'Warriors clinch playoff spot' },
        { label: 'Unread', value: '14 articles' },
      ],
      actionLabel: 'Read More',
    };
  }
  if (lower.includes('note')) {
    return {
      icon: '📝', title: 'New Note', subtitle: 'Notes',
      details: [
        { label: 'Title', value: 'Untitled Note' },
        { label: 'Folder', value: 'General' },
        { label: 'Recent', value: '3 notes this week' },
        { label: 'Storage', value: '128 notes total' },
      ],
      actionLabel: 'Create Note',
    };
  }
  if (lower.includes('book') || lower.includes('read')) {
    return {
      icon: '📚', title: 'Continue Reading', subtitle: 'Books',
      details: [
        { label: 'Book', value: 'Thinking, Fast and Slow' },
        { label: 'Progress', value: '68% — Chapter 22' },
        { label: 'Time left', value: '~4h 20m' },
        { label: 'Streak', value: '12 days reading' },
      ],
      actionLabel: 'Resume Reading',
    };
  }
  if (lower.includes('file') || lower.includes('report')) {
    return {
      icon: '📁', title: 'File Search', subtitle: 'Files',
      details: [
        { label: 'Found', value: 'Q3_Report_Final.pdf' },
        { label: 'Size', value: '2.4 MB' },
        { label: 'Modified', value: '2 days ago' },
        { label: 'Location', value: 'Documents/Work' },
      ],
      actionLabel: 'Open File',
    };
  }
  if (lower.includes('translate') || lower.includes('japanese') || lower.includes('language')) {
    return {
      icon: '🌐', title: 'Translation', subtitle: 'Translate',
      details: [
        { label: 'Input', value: 'Hello' },
        { label: 'Japanese', value: 'こんにちは (Konnichiwa)' },
        { label: 'Romaji', value: 'kon-ni-chi-wa' },
        { label: 'Confidence', value: '99%' },
      ],
      actionLabel: 'Copy Translation',
    };
  }
  if (lower.includes('step') || lower.includes('health') || lower.includes('fitness') || lower.includes('run')) {
    return {
      icon: '❤️', title: 'Health Summary', subtitle: 'Today\'s Activity',
      details: [
        { label: 'Steps', value: '6,842 / 10,000' },
        { label: 'Distance', value: '3.2 mi' },
        { label: 'Active Cal', value: '312 kcal' },
        { label: 'Stand', value: '8 / 12 hours' },
      ],
      actionLabel: 'View Details',
    };
  }

  // Default fallback
  return {
    icon: '✨', title: 'Request Processed', subtitle: 'Omni AI',
    details: [
      { label: 'Status', value: 'Completed' },
      { label: 'Context', value: 'Personal Assistant' },
      { label: 'Response', value: 'Task handled' },
      { label: 'Time', value: 'Just now' },
    ],
    actionLabel: 'Done',
  };
}

export default function GeneralScenario() {
  const approveAction = useOmniStore((s) => s.approveAction);
  const workspacePhase = useOmniStore((s) => s.workspacePhase);
  const userPrompt = useOmniStore((s) => s.userPrompt);
  const [loading, setLoading] = useState(true);

  const result = useMemo(() => getResultForPrompt(userPrompt), [userPrompt]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 60, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 120, borderRadius: 10 }}/>
        <div className="skeleton" style={{ height: 50, borderRadius: 10 }}/>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Result header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        marginBottom: 14, paddingBottom: 12,
        borderBottom: '1px solid var(--separator)',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'rgba(0,122,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, flexShrink: 0,
        }}>{result.icon}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{result.title}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{result.subtitle}</div>
        </div>
      </div>

      {/* Details */}
      <div style={{
        background: 'var(--bg-tertiary)', borderRadius: 12,
        padding: 14, marginBottom: 14,
      }}>
        {result.details.map((d, i) => (
          <div key={d.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0',
            borderBottom: i < result.details.length - 1 ? '1px solid var(--separator)' : 'none',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>{d.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</span>
          </div>
        ))}
      </div>

      {/* Action */}
      {workspacePhase !== 'complete' && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { successSound(); approveAction(); }}
          style={{
            width: '100%', padding: 14,
            background: 'var(--accent)',
            border: 'none', borderRadius: 12,
            color: 'white',
            fontSize: 16, fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {result.actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
