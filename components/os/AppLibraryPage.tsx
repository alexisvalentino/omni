'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound } from '../../services/sounds';

export default function AppLibraryPage() {
  const goToSettings = useOmniStore((s) => s.goToSettings);
  const apps = useOmniStore((s) => s.apps);
  const openAppWithSuggestions = useOmniStore((s) => s.openAppWithSuggestions);

  const categories = useMemo(() => {
    const cats: Record<string, typeof apps> = {};
    apps.forEach((app) => {
      if (!cats[app.category]) cats[app.category] = [];
      cats[app.category].push(app);
    });
    return cats;
  }, [apps]);

  // App-specific suggestion chips — shown before the user types anything
  const appSuggestions: Record<string, string[]> = {
    'Maps': ['Navigate to downtown', 'Find nearest coffee shop', 'Get directions to work', 'How far is the airport?'],
    'Calendar': ["What's on my calendar today?", 'Schedule a meeting tomorrow at 2 PM', 'When is my next free slot?', 'Block off lunch hour'],
    'Mail': ["Summarize my boss's email", 'Draft a follow-up email', 'Check my unread mail', 'Reply to the latest email'],
    'Messages': ["Tell Sarah I can't make dinner", 'Send a message to Mom', 'Text John happy birthday', 'Read my latest texts'],
    'Phone': ['Call Mom', 'Dial my recent contacts', 'Return missed calls', 'Call the nearest pizza place'],
    'Camera': ['Take a photo', 'Scan a document', 'Take a selfie', 'Record a video'],
    'Photos': ['Show my recent photos', 'Find photos from last vacation', 'Create a photo collage', 'Share photos with friends'],
    'Music': ['Play my focus playlist', 'Play some lo-fi beats', 'Shuffle my liked songs', 'Play the latest album by Drake'],
    'Podcasts': ['Play the latest tech podcast', 'Resume my podcast', 'Find a new science podcast', 'What are trending podcasts?'],
    'News': ["What's in the news today?", 'Show me tech news', 'Any breaking news?', "Show today's headlines"],
    'Books': ['Continue reading my book', 'Find a new sci-fi novel', 'Show my reading list', 'Read book summary'],
    'Notes': ['Create a new note', 'Show my recent notes', 'Add to my ideas list', 'Search my notes'],
    'Reminders': ['Remind me to call dentist at 3 PM', 'Show my pending reminders', 'Set a reminder for tomorrow', 'Clear completed reminders'],
    'Files': ['Find the Q3 report file', 'Show recent downloads', 'Search for presentation files', 'Open shared documents'],
    'Weather': ["What's the weather today?", 'Will it rain this weekend?', 'Weather forecast for NYC', '10-day forecast'],
    'Clock': ['Set a timer for 25 minutes', 'Set an alarm for 7 AM', "What time is it in Tokyo?", 'Start a stopwatch'],
    'Calculator': ['Calculate 15% tip on $86', 'Convert 100 USD to EUR', 'Split the bill for 4 people', 'Calculate mortgage payment'],
    'Wallet': ['Show my card balance', 'Recent transactions', 'Add a new card', 'Pay with Apple Pay'],
    'Stocks': ['How are my stocks doing?', "How's AAPL today?", 'Show market overview', 'Check my portfolio returns'],
    'Health': ['How many steps today?', 'Show my sleep data', 'Log my weight', 'Weekly health summary'],
    'Fitness': ['Log a 30-min run', 'Start a workout', 'Show my weekly activity', 'Set a fitness goal'],
    'Safari': ['Search the web for best restaurants', 'Open my bookmarks', 'What are trending searches?', 'Look up movie showtimes'],
    'Translate': ['Translate hello to Japanese', 'How do you say thank you in French?', 'Translate this menu to English', 'Spanish to English'],
  };

  const handleAppTap = (appName: string) => {
    tapSound();
    if (appName === 'Settings') { goToSettings(); return; }
    const suggestions = appSuggestions[appName] || [`Open ${appName}`, `What can ${appName} do?`, `Help me with ${appName}`];
    openAppWithSuggestions(appName, suggestions);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 130,
      paddingBottom: 100,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '0 24px', marginBottom: 16 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 300,
          letterSpacing: '4px',
          color: 'var(--text-tertiary)',
          textTransform: 'lowercase',
          marginBottom: 12,
        }}>
          omni
        </div>
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.8px',
          margin: 0,
          marginBottom: 14,
        }}>
          App Library
        </h1>

        {/* Search bar */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 10,
          border: '1px solid var(--separator)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span style={{ fontSize: 15, color: 'var(--text-tertiary)' }}>Search Apps</span>
        </div>
      </div>

      {/* App categories */}
      <div style={{ padding: '0 20px' }}>
        {Object.entries(categories).map(([category, catApps], catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.06 }}
            style={{ marginBottom: 20 }}
          >
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 10,
            }}>
              {category}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
            }}>
              {catApps.map((app, i) => (
                <motion.button
                  key={app.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: catIdx * 0.06 + i * 0.02 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={(e) => { e.stopPropagation(); handleAppTap(app.name); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: 4,
                  }}
                >
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 13,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}>
                    {app.icon}
                  </div>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    maxWidth: 60,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {app.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Swipe hint */}
      <div style={{
        padding: '16px 0',
        textAlign: 'center',
        fontSize: 12,
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Swipe left for Home
      </div>
    </div>
  );
}
