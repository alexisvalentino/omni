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
  if (lower.includes('photo') || lower.includes('camera') || lower.includes('selfie') || lower.includes('video') || lower.includes('scan')) {
    let mode = 'Smart Auto';
    let title = 'Camera Ready';
    if (lower.includes('selfie')) { mode = 'Front-Facing Portrait'; title = 'Front Camera Ready'; }
    if (lower.includes('video')) { mode = '4K Video (60fps)'; title = 'Video Camera Ready'; }
    if (lower.includes('scan')) { mode = 'Document Scan'; title = 'Scanner Ready'; }

    return {
      icon: '📷', title: title, subtitle: 'Omni Camera AI',
      details: [
        { label: 'Mode', value: mode },
        { label: 'Scene', value: 'Indoor — Optimal Lighting' },
        { label: 'Filter', value: 'Natural' },
        { label: 'Storage', value: '42.3 GB free' },
      ],
      actionLabel: lower.includes('scan') ? 'Scan Document' : lower.includes('video') ? 'Start Recording' : 'Capture',
    };
  }

  if (lower.includes('safari') || lower.includes('search') || lower.includes('bookmark') || lower.includes('trending') || lower.includes('movie')) {
    let title = 'Web Search';
    let subtitle = 'Safari Browser';
    let details = [
      { label: 'Engine', value: 'Google' },
      { label: 'Network', value: '5G UW' },
      { label: 'Privacy', value: 'Tracking Prevented' },
      { label: 'Tabs', value: '4 open tabs' },
    ];
    let action = 'Open Search';

    if (lower.includes('restaurant')) {
      title = 'Best Restaurants Nearby';
      details[0] = { label: 'Query', value: 'Best restaurants' };
      details[1] = { label: 'Location', value: 'San Francisco, CA' };
    } else if (lower.includes('bookmark')) {
      title = 'Safari Bookmarks';
      action = 'Open Bookmarks';
      details[0] = { label: 'Bookmarks', value: '34 saved pages' };
      details[1] = { label: 'Folders', value: 'Favorites, Work, Recipes' };
    } else if (lower.includes('trending')) {
      title = 'Trending Searches';
      details[0] = { label: 'Topic 1', value: 'AI earnings reports' };
      details[1] = { label: 'Topic 2', value: 'Golden State Warriors' };
    } else if (lower.includes('movie') || lower.includes('showtime')) {
      title = 'Movie Showtimes';
      details[0] = { label: 'Query', value: 'Movies near me' };
      details[1] = { label: 'Theaters', value: 'AMC Metreon, Alamo Drafthouse' };
    }

    return {
      icon: '🧭', title, subtitle,
      details,
      actionLabel: action,
    };
  }
  if (lower.includes('photos') || lower.includes('vacation') || lower.includes('collage') || lower.includes('gallery') || lower.includes('share photos')) {
    let title = 'Recent Photos';
    let details = [
      { label: 'Photos', value: '24 new today' },
      { label: 'Location', value: 'San Francisco' },
      { label: 'Albums', value: 'Saved to Camera Roll' },
    ];
    let action = 'View Gallery';
    
    if (lower.includes('vacation')) { title = 'Vacation Memories'; details[0] = { label: 'Album', value: 'Hawaii 2023' }; details[1] = { label: 'Photos', value: '142 items' }; action = 'Play Slideshow'; }
    else if (lower.includes('collage')) { title = 'Photo Collage'; details[0] = { label: 'Style', value: 'Grid Layout' }; details[1] = { label: 'Items', value: '9 photos selected' }; action = 'Create Collage'; }
    else if (lower.includes('share')) { title = 'Share Photos'; details[0] = { label: 'Selected', value: '5 photos' }; details[1] = { label: 'Method', value: 'AirDrop / Messages' }; action = 'Share Now'; }

    return { icon: '🖼️', title, subtitle: 'Photos', details, actionLabel: action };
  }

  if (lower.includes('music') || lower.includes('play') || lower.includes('listen') || lower.includes('lo-fi') || lower.includes('liked') || lower.includes('album') || lower.includes('drake')) {
    let title = 'Now Playing';
    let subtitle = 'Focus Playlist';
    let track = 'Weightless — Marconi Union';
    let playlist = '12 tracks · 45 min';
    let action = 'Play Now';

    if (lower.includes('lo-fi')) { subtitle = 'Lo-Fi Beats'; track = 'Snowman — WYS'; playlist = 'Lofi Girl Radio'; }
    else if (lower.includes('liked')) { subtitle = 'Liked Songs'; track = 'Shuffle Play'; playlist = '428 tracks'; action = 'Shuffle'; }
    else if (lower.includes('drake') || lower.includes('album')) { subtitle = 'For All The Dogs'; track = 'First Person Shooter'; playlist = 'Drake · 23 tracks'; }

    return {
      icon: '🎵', title, subtitle,
      details: [
        { label: 'Track', value: track },
        { label: 'Playlist', value: playlist },
        { label: 'Output', value: 'AirPods Pro' },
        { label: 'Quality', value: 'Lossless Audio' },
      ],
      actionLabel: action,
    };
  }

  if (lower.includes('podcast')) {
    let subtitle = 'Tech Podcasts';
    let show = 'The Vergecast';
    let episode = '#412 — AI & Design';
    if (lower.includes('science')) { subtitle = 'Science & Medicine'; show = 'Huberman Lab'; episode = 'Focus & Productivity'; }
    else if (lower.includes('trending')) { subtitle = 'Trending Now'; show = 'SmartLess'; episode = 'Latest Episode'; }
    return {
      icon: '🎙️', title: 'Latest Episode', subtitle,
      details: [
        { label: 'Show', value: show },
        { label: 'Episode', value: episode },
        { label: 'Duration', value: '58 min left' },
        { label: 'Speed', value: '1.2x' },
      ],
      actionLabel: 'Resume Podcast',
    };
  }

  if (lower.includes('news') || lower.includes('headline')) {
    let subtitle = 'Today\'s Headlines';
    let topStory = 'Tech stocks rally on AI earnings';
    if (lower.includes('tech')) { subtitle = 'Technology News'; topStory = 'New AI model released today'; }
    else if (lower.includes('breaking')) { subtitle = 'Breaking News'; topStory = 'Major update on global markets'; }
    return {
      icon: '📰', title: 'News Briefing', subtitle,
      details: [
        { label: 'Top Story', value: topStory },
        { label: 'Local', value: 'New BART expansion approved' },
        { label: 'Sports', value: 'Warriors clinch playoff spot' },
        { label: 'Sources', value: 'WSJ, NYT, The Verge' },
      ],
      actionLabel: 'Read Full Briefing',
    };
  }

  if (lower.includes('book') || lower.includes('read') || lower.includes('novel')) {
    let title = 'Continue Reading';
    let book = 'Thinking, Fast and Slow';
    let progress = '68% — Chapter 22';
    if (lower.includes('sci-fi') || lower.includes('novel')) { title = 'New Book Request'; book = 'Project Hail Mary'; progress = 'Not started'; }
    else if (lower.includes('list')) { title = 'Reading List'; book = '4 books pending'; progress = 'Next: Atomic Habits'; }
    else if (lower.includes('summary')) { title = 'Book Summary'; book = 'Thinking, Fast and Slow'; progress = '15 min read'; }
    return {
      icon: '📚', title, subtitle: 'Apple Books',
      details: [
        { label: 'Title', value: book },
        { label: 'Status', value: progress },
        { label: 'Format', value: 'eBook' },
        { label: 'Streak', value: '12 days reading' },
      ],
      actionLabel: lower.includes('summary') ? 'Read Summary' : 'Open Book',
    };
  }

  if (lower.includes('note') || lower.includes('ideas list')) {
    let title = 'New Note';
    let folder = 'General';
    let action = 'Create Note';
    if (lower.includes('recent')) { title = 'Recent Notes'; folder = 'All Notes'; action = 'View Notes'; }
    else if (lower.includes('ideas')) { title = 'Ideas List'; folder = 'Personal'; action = 'Add to List'; }
    else if (lower.includes('search')) { title = 'Note Search'; folder = 'Search Results'; action = 'Open Search'; }
    return {
      icon: '📝', title, subtitle: 'Apple Notes',
      details: [
        { label: 'Folder', value: folder },
        { label: 'Account', value: 'iCloud' },
        { label: 'Recent', value: '3 notes this week' },
        { label: 'Storage', value: '128 notes total' },
      ],
      actionLabel: action,
    };
  }

  if (lower.includes('remind')) {
    let title = 'New Reminder';
    let item = 'Call dentist';
    let time = 'Today at 3:00 PM';
    let action = 'Set Reminder';
    if (lower.includes('pending')) { title = 'Pending Reminders'; item = '4 tasks due today'; time = 'Next: Buy groceries'; action = 'View All'; }
    else if (lower.includes('tomorrow')) { title = 'Reminder Set'; item = 'Follow up with team'; time = 'Tomorrow at 9:00 AM'; }
    else if (lower.includes('clear')) { title = 'Clean Up'; item = '12 completed tasks'; time = 'Last 7 days'; action = 'Clear Completed'; }
    return {
      icon: '✅', title, subtitle: 'Reminders',
      details: [
        { label: 'Task', value: item },
        { label: 'Due', value: time },
        { label: 'List', value: 'Personal' },
        { label: 'Priority', value: 'High' },
      ],
      actionLabel: action,
    };
  }

  if (lower.includes('file') || lower.includes('report') || lower.includes('download') || lower.includes('presentation') || lower.includes('document')) {
    let title = 'File Search';
    let found = 'Q3_Report_Final.pdf';
    let location = 'Documents/Work';
    if (lower.includes('download')) { title = 'Recent Downloads'; found = 'Invoice_April.pdf'; location = 'Downloads'; }
    else if (lower.includes('presentation')) { title = 'Presentations'; found = 'Pitch_Deck_v2.key'; location = 'iCloud Drive'; }
    else if (lower.includes('shared')) { title = 'Shared Documents'; found = 'Project_Plan.docx'; location = 'Shared with Me'; }
    return {
      icon: '📁', title, subtitle: 'Files',
      details: [
        { label: 'Found', value: found },
        { label: 'Location', value: location },
        { label: 'Size', value: '2.4 MB' },
        { label: 'Modified', value: '2 days ago' },
      ],
      actionLabel: 'Open File',
    };
  }
  if (lower.includes('weather') || lower.includes('rain') || lower.includes('forecast')) {
    let title = 'Current Weather';
    let temp = '72°F';
    let detail = 'Sunny · High 76° · Low 54°';
    if (lower.includes('rain') || lower.includes('weekend')) { title = 'Weekend Forecast'; temp = '65°F'; detail = '60% chance of rain on Saturday'; }
    else if (lower.includes('nyc') || lower.includes('new york')) { title = 'New York City'; temp = '58°F'; detail = 'Partly Cloudy · High 62° · Low 50°'; }
    else if (lower.includes('10-day')) { title = '10-Day Forecast'; temp = 'Weekly'; detail = 'Trending warmer towards next week'; }
    return {
      icon: '🌤️', title, subtitle: 'Weather',
      details: [
        { label: 'Temp', value: temp },
        { label: 'Conditions', value: detail },
        { label: 'AQI', value: '42 (Good)' },
        { label: 'Wind', value: '8 mph NW' },
      ],
      actionLabel: 'View Radar',
    };
  }

  if (lower.includes('clock') || lower.includes('timer') || lower.includes('alarm') || lower.includes('time is') || lower.includes('stopwatch')) {
    let title = 'Timer Set';
    let value = '25:00';
    let detail = 'Focus Timer';
    let action = 'Pause Timer';
    let icon = '⏱️';
    if (lower.includes('alarm')) { title = 'Alarm Set'; value = '7:00 AM'; detail = 'Wake Up Alarm • Weekdays'; action = 'Edit Alarm'; icon = '⏰'; }
    else if (lower.includes('time is') || lower.includes('tokyo')) { title = 'World Clock'; value = '08:00 AM'; detail = 'Tokyo, Japan • Tomorrow'; action = 'Add City'; icon = '🌍'; }
    else if (lower.includes('stopwatch')) { title = 'Stopwatch'; value = '00:00.00'; detail = 'Ready to start'; action = 'Start'; icon = '⏱️'; }
    return {
      icon, title, subtitle: 'Clock',
      details: [
        { label: 'Status', value },
        { label: 'Detail', value: detail },
      ],
      actionLabel: action,
    };
  }

  if (lower.includes('calculate') || lower.includes('tip') || lower.includes('convert') || lower.includes('split') || lower.includes('mortgage')) {
    let title = 'Calculation';
    let result = '$12.90';
    let equation = '15% of $86.00';
    let action = 'Copy Result';
    if (lower.includes('convert') || lower.includes('eur')) { title = 'Currency Conversion'; result = '€92.45'; equation = '100 USD to EUR'; action = 'Copy'; }
    else if (lower.includes('split')) { title = 'Split Bill'; result = '$21.50 per person'; equation = '$86.00 ÷ 4 people'; action = 'Request via Apple Pay'; }
    else if (lower.includes('mortgage')) { title = 'Mortgage Estimate'; result = '$2,845 / month'; equation = '$400k loan • 6.5% APR • 30 yr'; action = 'Save Calculation'; }
    return {
      icon: '🧮', title, subtitle: 'Calculator',
      details: [
        { label: 'Equation', value: equation },
        { label: 'Result', value: result },
      ],
      actionLabel: action,
    };
  }

  if (lower.includes('translate') || lower.includes('japanese') || lower.includes('french') || lower.includes('spanish')) {
    let title = 'Translation';
    let input = 'Hello';
    let output = 'こんにちは (Konnichiwa)';
    if (lower.includes('french')) { input = 'Thank you'; output = 'Merci'; }
    else if (lower.includes('menu')) { input = 'Menu Scan'; output = 'Live Translation Active'; }
    else if (lower.includes('spanish')) { input = 'Voice Input'; output = 'Detecting Spanish...'; }
    return {
      icon: '🌐', title, subtitle: 'Translate',
      details: [
        { label: 'Input', value: input },
        { label: 'Output', value: output },
      ],
      actionLabel: lower.includes('menu') || lower.includes('spanish') ? 'Start Translating' : 'Play Audio',
    };
  }

  if (lower.includes('health') || lower.includes('sleep') || lower.includes('weight') || lower.includes('steps')) {
    let title = 'Activity Today';
    let value = '8,432 steps';
    let detail = 'Distance: 4.1 miles';
    if (lower.includes('sleep')) { title = 'Sleep Analysis'; value = '7h 24m'; detail = 'Deep Sleep: 1h 45m'; }
    else if (lower.includes('weight')) { title = 'Weight Logged'; value = '158.4 lbs'; detail = '-0.6 lbs this week'; }
    else if (lower.includes('summary')) { title = 'Weekly Health'; value = 'All Goals Met'; detail = 'View full report'; }
    return {
      icon: '❤️', title, subtitle: 'Apple Health',
      details: [
        { label: 'Metric', value: value },
        { label: 'Detail', value: detail },
        { label: 'Last Sync', value: 'Just now' },
      ],
      actionLabel: 'Open Health App',
    };
  }

  if (lower.includes('fitness') || lower.includes('run') || lower.includes('workout') || lower.includes('goal')) {
    let title = 'Workout Started';
    let value = 'Outdoor Run';
    let detail = 'Goal: 30 minutes';
    if (lower.includes('activity')) { title = 'Weekly Activity'; value = 'Move Ring: 4/7 Days'; detail = 'Exercise: 140/210 min'; }
    else if (lower.includes('goal')) { title = 'Fitness Goal'; value = 'Updated Move Goal'; detail = '600 calories / day'; }
    return {
      icon: '🏃', title, subtitle: 'Apple Fitness',
      details: [
        { label: 'Activity', value: value },
        { label: 'Detail', value: detail },
      ],
      actionLabel: lower.includes('run') ? 'End Workout' : 'View Rings',
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
