'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useOmniStore } from '../store/omni';
import StatusBar from './os/StatusBar';
import UnifiedInput from './os/UnifiedInput';
import HomeScreen from './os/HomeScreen';
import HomeSwiper from './os/HomeSwiper';
import SuggestionsPage from './os/SuggestionsPage';
import AppLibraryPage from './os/AppLibraryPage';
import WorkspaceContainer from './workspace/WorkspaceContainer';
import MemoryFeed from './memory/MemoryFeed';
import DynamicBackground from './os/DynamicBackground';
import LockScreen from './os/LockScreen';
import ControlCenter from './os/ControlCenter';
import SettingsScreen from './os/SettingsScreen';
import AppLibrary from './os/AppLibrary';
import ChatScreen from './os/ChatScreen';
import AppScreen from './os/AppScreen';
import PhoneFrame from './os/PhoneFrame';
import { NotificationBanner, NotificationCenter } from './os/NotificationSystem';
import { tapSound } from '../services/sounds';

const AppShell = () => {
  const activeScreen = useOmniStore((s) => s.activeScreen);
  const isLocked = useOmniStore((s) => s.isLocked);
  const isWorkspaceOpen = useOmniStore((s) => s.isWorkspaceOpen);
  const isMemoryFeedOpen = useOmniStore((s) => s.isMemoryFeedOpen);
  const toggleMemoryFeed = useOmniStore((s) => s.toggleMemoryFeed);

  return (
    <PhoneFrame>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}>
        {/* Dynamic ambient background */}
        <DynamicBackground />

        {/* Status bar — always visible */}
        <StatusBar />

        {/* Lock Screen overlay */}
        <AnimatePresence>
          {isLocked && (
            <motion.div
              key="lock"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <LockScreen />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activity feed toggle — hidden when locked or feed already open */}
        {!isLocked && !isMemoryFeedOpen && (
          <button
            onClick={() => { tapSound(); toggleMemoryFeed(); }}
            aria-label="Open activity feed"
            style={{
              position: 'absolute',
              top: 'max(var(--safe-area-top, 0px), 4px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10000,
              background: 'none',
              border: 'none',
              padding: '4px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.25)',
            }}/>
          </button>
        )}

        {/* Main content area */}
        <AnimatePresence mode="wait">
          {activeScreen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <HomeSwiper
                leftPage={<SuggestionsPage />}
                centerPage={<HomeScreen />}
                rightPage={<AppLibrary />}
              />
            </motion.div>
          )}

          {(activeScreen === 'workspace' || isWorkspaceOpen) && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <WorkspaceContainer />
            </motion.div>
          )}

          {activeScreen === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <SettingsScreen />
            </motion.div>
          )}



          {activeScreen === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <ChatScreen />
            </motion.div>
          )}

          {activeScreen === 'app' && (
            <motion.div
              key="app"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <AppScreen />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unified input — only on home */}
        {activeScreen === 'home' && <UnifiedInput />}

        {/* Overlay panels */}
        <MemoryFeed />
        <ControlCenter />
        <NotificationCenter />

        {/* Home indicator bar */}
        {!isLocked && (
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 134,
            height: 5,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.2)',
            zIndex: 95,
            pointerEvents: 'none',
          }} />
        )}

        {/* Banner notification — floats above everything */}
        <NotificationBanner />
      </div>
    </PhoneFrame>
  );
};

export default AppShell;
