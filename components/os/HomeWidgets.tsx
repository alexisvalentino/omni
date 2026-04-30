'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getCalendarEvents } from '../../services/timeContext';

function WeatherWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: 16,
        border: '1px solid var(--separator)',
        padding: '14px 16px',
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            Weather
          </div>
          <div style={{ fontSize: 32, fontWeight: 200, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-1px' }}>
            68°
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            Partly Cloudy
          </div>
        </div>
        <span style={{ fontSize: 32 }}>⛅</span>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px solid var(--separator)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>H</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>72°</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>L</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>58°</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>💧</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>12%</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>💨</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>8mph</div>
        </div>
      </div>
    </motion.div>
  );
}

function CalendarWidget() {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'short' });
  const date = now.getDate();

  const events = getCalendarEvents(now);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35 }}
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: 16,
        border: '1px solid var(--separator)',
        padding: '14px 16px',
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Calendar
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-red)', textTransform: 'uppercase' }}>{day}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{date}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {events.map((e) => (
          <div key={e.title} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: e.isPast ? 0.4 : 1 }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: e.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', textDecoration: e.isPast ? 'line-through' : 'none' }}>{e.title}</div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StocksWidget() {
  const stocks = [
    { symbol: 'AAPL', price: '189.84', change: '+1.23%', up: true },
    { symbol: 'NVDA', price: '824.18', change: '+3.41%', up: true },
    { symbol: 'TSLA', price: '168.29', change: '-0.87%', up: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: 16,
        border: '1px solid var(--separator)',
        padding: '14px 16px',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
        Watchlist
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {stocks.map((s) => (
          <div key={s.symbol} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{s.symbol}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>${s.price}</div>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: s.up ? 'var(--accent-green)' : 'var(--accent-red)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function BatteryWidget() {
  const battery = 82;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.45 }}
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: 16,
        border: '1px solid var(--separator)',
        padding: '14px 16px',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
        Battery
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 200, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>
          {battery}%
        </div>
        <div style={{ flex: 1 }}>
          {/* Battery bar */}
          <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${battery}%` }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: battery > 20 ? 'var(--accent-green)' : 'var(--accent-red)',
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>
            ~4h 30m remaining
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomeWidgets() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      width: '100%',
      padding: '0 20px',
      marginBottom: 16,
    }}>
      {/* Top row — Weather + Calendar side by side */}
      <div style={{ display: 'flex', gap: 8 }}>
        <WeatherWidget />
        <CalendarWidget />
      </div>

      {/* Bottom row — Stocks + Battery side by side */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <StocksWidget />
        </div>
        <div style={{ flex: 1 }}>
          <BatteryWidget />
        </div>
      </div>
    </div>
  );
}
