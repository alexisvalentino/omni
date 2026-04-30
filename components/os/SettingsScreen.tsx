'use client';

import { motion } from 'framer-motion';
import { useOmniStore } from '../../store/omni';
import { tapSound } from '../../services/sounds';

type SettingsItem = {
  icon: string;
  label: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
};

function SettingsGroup({ title, items }: { title?: string; items: SettingsItem[] }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && (
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
          marginBottom: 6,
          paddingLeft: 16,
        }}>
          {title}
        </div>
      )}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 14,
        border: '1px solid var(--separator)',
        overflow: 'hidden',
      }}>
        {items.map((item, idx) => (
          <motion.div
            key={item.label}
            whileTap={{ backgroundColor: 'rgba(84,84,88,0.2)' }}
            onClick={() => { if (item.toggle && item.onToggle) { tapSound(); item.onToggle(); } }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderBottom: idx < items.length - 1 ? '1px solid var(--separator)' : 'none',
              cursor: item.toggle ? 'pointer' : 'default',
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}>
              {item.icon}
            </div>
            <span style={{ flex: 1, fontSize: 15, color: 'var(--text-primary)', fontWeight: 400 }}>
              {item.label}
            </span>
            {item.toggle ? (
              <div
                style={{
                  width: 44, height: 26, borderRadius: 13,
                  background: item.toggleValue ? 'var(--accent-green)' : 'rgba(84,84,88,0.5)',
                  position: 'relative',
                  transition: 'background 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <motion.div
                  animate={{ x: item.toggleValue ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{
                    width: 22, height: 22,
                    borderRadius: 11,
                    background: 'white',
                    position: 'absolute',
                    top: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
            ) : item.value ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>{item.value}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsScreen() {
  const goHome = useOmniStore((s) => s.goHome);
  const wifi = useOmniStore((s) => s.wifiEnabled);
  const bluetooth = useOmniStore((s) => s.bluetoothEnabled);
  const airplane = useOmniStore((s) => s.airplaneMode);
  const dnd = useOmniStore((s) => s.doNotDisturb);
  const toggleWifi = useOmniStore((s) => s.toggleWifi);
  const toggleBluetooth = useOmniStore((s) => s.toggleBluetooth);
  const toggleAirplaneMode = useOmniStore((s) => s.toggleAirplaneMode);
  const toggleDoNotDisturb = useOmniStore((s) => s.toggleDoNotDisturb);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingTop: 'max(var(--safe-area-top, 0px), 80px)',
      paddingBottom: 40,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        marginBottom: 20,
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { tapSound(); goHome(); }}
          style={{
            background: 'none', border: 'none',
            padding: '8px 12px 8px 0',
            color: 'var(--accent)', fontSize: 15, fontWeight: 400,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </motion.button>
        <h1 style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 17,
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
          marginRight: 50, // compensate for back button
        }}>
          Settings
        </h1>
      </div>

      {/* Profile card */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 14,
          border: '1px solid var(--separator)',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 54, height: 54, borderRadius: 27,
            background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 600, color: 'var(--accent)',
          }}>
            AV
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Alexis Valentino</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>alexis@omni.ai</div>
            <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>Omni Pro</div>
          </div>
        </div>
      </div>

      {/* Settings groups */}
      <div style={{ padding: '0 20px' }}>
        <SettingsGroup
          title="Connectivity"
          items={[
            { icon: '📶', label: 'Wi-Fi', toggle: true, toggleValue: wifi, onToggle: toggleWifi },
            { icon: '📡', label: 'Bluetooth', toggle: true, toggleValue: bluetooth, onToggle: toggleBluetooth },
            { icon: '✈️', label: 'Airplane Mode', toggle: true, toggleValue: airplane, onToggle: toggleAirplaneMode },
            { icon: '📱', label: 'Cellular', value: '5G' },
          ]}
        />

        <SettingsGroup
          title="Agent Preferences"
          items={[
            { icon: '🤖', label: 'Proactive Suggestions', toggle: true, toggleValue: true, onToggle: () => {} },
            { icon: '🔕', label: 'Do Not Disturb', toggle: true, toggleValue: dnd, onToggle: toggleDoNotDisturb },
            { icon: '🧠', label: 'Memory Retention', value: '30 days' },
            { icon: '🗣️', label: 'Voice', value: 'Nova' },
            { icon: '🌐', label: 'Language', value: 'English' },
          ]}
        />

        <SettingsGroup
          title="Display & Sound"
          items={[
            { icon: '🌙', label: 'Dark Mode', toggle: true, toggleValue: true, onToggle: () => {} },
            { icon: '🔊', label: 'Haptic Sound Effects', toggle: true, toggleValue: true, onToggle: () => {} },
            { icon: '📐', label: 'Text Size', value: 'Default' },
          ]}
        />

        <SettingsGroup
          title="Privacy & Security"
          items={[
            { icon: '🔒', label: 'Face ID' },
            { icon: '🛡️', label: 'Privacy Dashboard' },
            { icon: '📊', label: 'Data & Storage', value: '2.1 GB' },
          ]}
        />

        <SettingsGroup
          title="About"
          items={[
            { icon: '📋', label: 'Software Version', value: '1.0.0' },
            { icon: '⚙️', label: 'Model', value: 'Omni One' },
            { icon: '🏷️', label: 'Serial Number', value: 'OMNI-2026' },
          ]}
        />
      </div>
    </div>
  );
}
