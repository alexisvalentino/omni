'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound } from '../../services/sounds';

function ToggleTile({ icon, label, active, onToggle, size = 'normal' }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
  size?: 'normal' | 'large';
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={() => { tapSound(); onToggle(); }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        background: active ? 'var(--accent)' : 'rgba(58,58,60,0.8)',
        borderRadius: 16,
        border: 'none',
        padding: size === 'large' ? '18px 12px' : '14px 8px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        color: active ? 'white' : 'var(--text-primary)',
        transition: 'background 0.2s ease',
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 22 }}>{icon}</div>
      <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.9 }}>{label}</span>
    </motion.button>
  );
}

function Slider({ value, onChange, icon }: {
  value: number;
  onChange: (v: number) => void;
  icon: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'rgba(58,58,60,0.8)',
      borderRadius: 14,
      padding: '12px 16px',
    }}>
      <div style={{ color: 'var(--text-secondary)', flexShrink: 0, display: 'flex' }}>{icon}</div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          flex: 1,
          height: 6,
          appearance: 'none',
          WebkitAppearance: 'none',
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${value}%, rgba(84,84,88,0.5) ${value}%, rgba(84,84,88,0.5) 100%)`,
          borderRadius: 3,
          outline: 'none',
          cursor: 'pointer',
        }}
      />
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
    </div>
  );
}

export default function ControlCenter() {
  const isOpen = useOmniStore((s) => s.isControlCenterOpen);
  const closeControlCenter = useOmniStore((s) => s.closeControlCenter);
  const wifi = useOmniStore((s) => s.wifiEnabled);
  const bluetooth = useOmniStore((s) => s.bluetoothEnabled);
  const airplane = useOmniStore((s) => s.airplaneMode);
  const dnd = useOmniStore((s) => s.doNotDisturb);
  const brightness = useOmniStore((s) => s.brightness);
  const volume = useOmniStore((s) => s.volume);
  const toggleWifi = useOmniStore((s) => s.toggleWifi);
  const toggleBluetooth = useOmniStore((s) => s.toggleBluetooth);
  const toggleAirplaneMode = useOmniStore((s) => s.toggleAirplaneMode);
  const toggleDoNotDisturb = useOmniStore((s) => s.toggleDoNotDisturb);
  const setBrightness = useOmniStore((s) => s.setBrightness);
  const setVolume = useOmniStore((s) => s.setVolume);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeControlCenter}
            style={{
              position: 'absolute', inset: 0, zIndex: 300,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'absolute',
              top: 'max(var(--safe-area-top, 0px), 50px)',
              right: 12,
              width: 'min(320px, calc(100vw - 24px))',
              zIndex: 301,
              background: 'rgba(28,28,30,0.95)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderRadius: 20,
              padding: 14,
              border: '1px solid rgba(84,84,88,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Top grid — connectivity toggles */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              marginBottom: 12,
            }}>
              <ToggleTile
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>}
                label="Wi-Fi"
                active={wifi}
                onToggle={toggleWifi}
              />
              <ToggleTile
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6.5 6.5l11 11"/><path d="M18 9a5 5 0 0 0-7-1"/><path d="M6 15a5 5 0 0 0 7 1"/></svg>}
                label="Bluetooth"
                active={bluetooth}
                onToggle={toggleBluetooth}
              />
              <ToggleTile
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 15 l5 -11 l5 11"/><path d="M12 8 l5 -5 l5 5 l-5 5z"/></svg>}
                label="Airplane"
                active={airplane}
                onToggle={toggleAirplaneMode}
              />
              <ToggleTile
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18.36 6.64A9 9 0 0 1 20.77 15"/><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"/><line x1="2" y1="2" x2="22" y2="22"/></svg>}
                label="Do Not Disturb"
                active={dnd}
                onToggle={toggleDoNotDisturb}
              />
            </div>

            {/* Brightness slider */}
            <div style={{ marginBottom: 8 }}>
              <Slider
                value={brightness}
                onChange={setBrightness}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                }
              />
            </div>

            {/* Volume slider */}
            <div style={{ marginBottom: 12 }}>
              <Slider
                value={volume}
                onChange={setVolume}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                }
              />
            </div>

            {/* Bottom row — quick actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 8,
            }}>
              <ToggleTile icon="🔦" label="Flashlight" active={false} onToggle={() => {}} />
              <ToggleTile icon="⏱️" label="Timer" active={false} onToggle={() => {}} />
              <ToggleTile icon="📷" label="Camera" active={false} onToggle={() => {}} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
