/**
 * timeContext.ts — Central time-aware data engine for the Omni OS simulator.
 *
 * Every time-derived string in the app is produced here so that all surfaces
 * (lock screen, notifications, memory feed, proactive cards, pills, widgets,
 * chat, workspace) stay consistent with each other and with the real clock.
 */

import type { Notification, MemoryItem, ProactiveCard, ContextPill } from '../store/omni';

// ─── Helpers ────────────────────────────────────────────────────────────

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function getTimeOfDay(now: Date = new Date()): TimeOfDay {
  const h = now.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

export function getGreeting(now: Date = new Date()): string {
  const tod = getTimeOfDay(now);
  switch (tod) {
    case 'morning': return 'Good morning';
    case 'afternoon': return 'Good afternoon';
    case 'evening': return 'Good evening';
    case 'night': return 'Good night';
  }
}

/** Format a Date into "h:mm AM/PM" */
export function fmt12(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/** Return a human-friendly relative-time string.  Always returns a string like "2m ago", "1h ago", "Yesterday", etc. */
export function relativeTime(ts: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

/** Produce a Date for *today* at the given hour:minute. */
function todayAt(h: number, m: number = 0): Date {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

/** Produce a Date for tomorrow at the given hour:minute. */
function tomorrowAt(h: number, m: number = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(h, m, 0, 0);
  return d;
}

/** Number of full hours from now until a target timestamp. */
function hoursUntil(target: Date, now: Date = new Date()): number {
  return Math.max(0, Math.round((target.getTime() - now.getTime()) / 3_600_000));
}

/** Number of minutes from now until a target. */
function minutesUntil(target: Date, now: Date = new Date()): number {
  return Math.max(0, Math.round((target.getTime() - now.getTime()) / 60_000));
}

// ─── Calendar events (time-aware) ───────────────────────────────────────

export type CalendarEvent = {
  time: string;          // "9:30 AM"
  title: string;
  color: string;
  ts: number;            // epoch for sorting / filtering
  isPast: boolean;
};

export function getCalendarEvents(now: Date = new Date()): CalendarEvent[] {
  const tod = getTimeOfDay(now);
  const h = now.getHours();

  // We build a schedule that always has some upcoming events.
  // The exact times shift so there's always something ahead.
  let events: { hour: number; min: number; title: string; color: string }[];

  if (tod === 'morning') {
    events = [
      { hour: 9, min: 30, title: 'Team Standup', color: 'var(--accent)' },
      { hour: 12, min: 30, title: 'Lunch with Sarah', color: 'var(--accent-green)' },
      { hour: 15, min: 0, title: 'Design Review', color: 'var(--accent-orange)' },
    ];
  } else if (tod === 'afternoon') {
    events = [
      { hour: 9, min: 30, title: 'Team Standup', color: 'var(--accent)' },
      { hour: 12, min: 30, title: 'Lunch with Sarah', color: 'var(--accent-green)' },
      { hour: 15, min: 0, title: 'Design Review', color: 'var(--accent-orange)' },
    ];
  } else if (tod === 'evening') {
    events = [
      { hour: 9, min: 30, title: 'Team Standup', color: 'var(--accent)' },
      { hour: 15, min: 0, title: 'Design Review', color: 'var(--accent-orange)' },
      { hour: h + 1, min: 0, title: 'Evening Walk', color: 'var(--accent-green)' },
    ];
  } else {
    // Night — show tomorrow's events
    events = [
      { hour: 7, min: 30, title: 'Morning Run', color: 'var(--accent-green)' },
      { hour: 9, min: 30, title: 'Team Standup', color: 'var(--accent)' },
      { hour: 12, min: 30, title: 'Lunch with Sarah', color: 'var(--accent-green)' },
    ];
  }

  return events.map((e) => {
    const eventDate = tod === 'night' ? tomorrowAt(e.hour, e.min) : todayAt(e.hour, e.min);
    return {
      time: fmt12(eventDate),
      title: e.title,
      color: e.color,
      ts: eventDate.getTime(),
      isPast: eventDate.getTime() < now.getTime(),
    };
  });
}

// ─── Notifications ──────────────────────────────────────────────────────

export function getTimeAwareNotifications(now: Date = new Date()): Notification[] {
  const tod = getTimeOfDay(now);
  const ts = now.getTime();

  // Base notifications — always present but with realistic offsets
  const base: Notification[] = [
    {
      id: 'n1', app: 'Omni Agent', icon: '🤖',
      title: 'Proactive Insight',
      body: tod === 'morning'
        ? 'Traffic is light this morning. Great time to head out.'
        : tod === 'evening'
          ? 'Traffic is building on 101. Leave soon to avoid delays.'
          : 'Traffic is building on 101. Leave in 10 min to stay on schedule.',
      time: relativeTime(ts - 2 * 60_000, ts), // 2 min ago
      read: false,
    },
    {
      id: 'n2', app: 'Mail', icon: '📧',
      title: 'David Kim',
      body: "Re: Q3 Deliverables — Thanks for the update, let's sync tomorrow.",
      time: relativeTime(ts - 15 * 60_000, ts), // 15 min ago
      read: false,
    },
    {
      id: 'n3', app: 'Messages', icon: '💬',
      title: 'Sarah Chen',
      body: 'That lunch spot sounds great! See you Tuesday 😊',
      time: relativeTime(ts - 60 * 60_000, ts), // 1h ago
      read: false,
    },
  ];

  // Time-contextual notifications
  if (tod === 'morning') {
    base.push({
      id: 'n4', app: 'Calendar', icon: '📅',
      title: 'Upcoming',
      body: `Team standup at ${fmt12(todayAt(9, 30))} — Conference Room B`,
      time: relativeTime(ts - 90 * 60_000, ts),
      read: true,
    });
  } else if (tod === 'afternoon') {
    base.push({
      id: 'n4', app: 'Calendar', icon: '📅',
      title: 'Upcoming',
      body: `Design Review at ${fmt12(todayAt(15, 0))} — Conference Room B`,
      time: relativeTime(ts - 45 * 60_000, ts),
      read: true,
    });
  } else if (tod === 'evening') {
    base.push({
      id: 'n4', app: 'Calendar', icon: '📅',
      title: 'Tomorrow',
      body: `First event: Team standup at ${fmt12(tomorrowAt(9, 30))}`,
      time: relativeTime(ts - 60 * 60_000, ts),
      read: true,
    });
  } else {
    base.push({
      id: 'n4', app: 'Calendar', icon: '📅',
      title: 'Tomorrow',
      body: `First event: Morning Run at ${fmt12(tomorrowAt(7, 30))}`,
      time: relativeTime(ts - 2 * 3600_000, ts),
      read: true,
    });
  }

  base.push({
    id: 'n5', app: 'Finance', icon: '💳',
    title: 'Spending Alert',
    body: "You've spent $340 this week — $60 under budget. Nice work.",
    time: relativeTime(ts - 3 * 3600_000, ts), // 3h ago
    read: true,
  });

  return base;
}

// ─── Memory Items ───────────────────────────────────────────────────────

export function getTimeAwareMemoryItems(now: Date = new Date()): MemoryItem[] {
  const ts = now.getTime();
  return [
    { id: 'm1', icon: '💰', text: 'Saved $12 on your last Uber by waiting 3 mins', time: relativeTime(ts - 2 * 3600_000, ts), type: 'saving' },
    { id: 'm2', icon: '✈️', text: 'Flights to NYC dropped by $40 since yesterday', time: relativeTime(ts - 4 * 3600_000, ts), type: 'alert' },
    { id: 'm3', icon: '📧', text: "Drafted reply to boss's email — awaiting approval", time: relativeTime(ts - 5 * 3600_000, ts), type: 'action' },
    { id: 'm4', icon: '🐕', text: 'John mentioned his dog is sick — saved to contact card', time: relativeTime(ts - 24 * 3600_000, ts), type: 'info' },
    { id: 'm5', icon: '📅', text: 'Rescheduled dentist appointment to next Thursday 3 PM', time: relativeTime(ts - 26 * 3600_000, ts), type: 'action' },
    { id: 'm6', icon: '🛒', text: 'Weekly grocery order auto-submitted — delivery by 6 PM', time: relativeTime(ts - 48 * 3600_000, ts), type: 'action' },
  ];
}

// ─── Context Pills ──────────────────────────────────────────────────────

export function getTimeAwareContextPills(now: Date = new Date()): ContextPill[] {
  const tod = getTimeOfDay(now);
  const events = getCalendarEvents(now);
  const nextEvent = events.find((e) => !e.isPast);
  const minsToNext = nextEvent ? minutesUntil(new Date(nextEvent.ts), now) : 0;

  const freeLabel = nextEvent
    ? minsToNext > 60
      ? `Free for ${Math.floor(minsToNext / 60)}h ${minsToNext % 60}m`
      : `Free for ${minsToNext} min`
    : 'No more events';

  // Flight is always "in N days" from now — we pin it to 3 days from today
  const flightDate = new Date(now);
  flightDate.setDate(flightDate.getDate() + 3);
  const daysToFlight = 3;

  return [
    { id: 'location', icon: '📍', label: 'SF Downtown' },
    { id: 'time', icon: '🕐', label: freeLabel },
    { id: 'balance', icon: '💳', label: '$124.50' },
    { id: 'flight', icon: '✈️', label: `NYC in ${daysToFlight} days` },
  ];
}

// ─── Proactive Cards ────────────────────────────────────────────────────

export function getTimeAwareProactiveCards(now: Date = new Date()): ProactiveCard[] {
  const tod = getTimeOfDay(now);
  const h = now.getHours();
  const cards: ProactiveCard[] = [];

  // ---- Traffic / Commute alert ----
  // Relevant in morning or afternoon when user might need to go somewhere
  if (tod === 'morning' || tod === 'afternoon') {
    cards.push({
      id: 'p1', icon: '🚦', title: 'Traffic Alert',
      body: 'Traffic is building on 101. Leave in 10 min to catch your flight to NYC.',
      action: 'Navigate Now',
      command: 'Get me to the airport',
      dismissed: false,
    });
  } else if (tod === 'evening') {
    cards.push({
      id: 'p1', icon: '🚦', title: 'Traffic Alert',
      body: 'Rush hour traffic on 101 is clearing up. Now is a good time to head home.',
      action: 'Navigate Home',
      command: 'Navigate me home via the best route',
      dismissed: false,
    });
  } else {
    // Night — show tomorrow's commute prep
    cards.push({
      id: 'p1', icon: '🚦', title: 'Tomorrow\'s Commute',
      body: `Your first meeting is at ${fmt12(tomorrowAt(9, 30))}. I'll check traffic in the morning.`,
      action: 'Set Reminder',
      command: 'Check my schedule for tomorrow morning',
      dismissed: false,
    });
  }

  // ---- Urgent email ----
  // Always relevant — adjust urgency based on day proximity to Friday
  const dayOfWeek = now.getDay(); // 0=Sun, 5=Fri
  const daysToFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 7 - dayOfWeek + 5;
  const deadlineText = daysToFriday === 0
    ? 'deadline is today'
    : daysToFriday === 1
      ? 'deadline is tomorrow'
      : `deadline in ${daysToFriday} days`;
  cards.push({
    id: 'p2', icon: '📧', title: 'Urgent Email',
    body: `3 unread emails. David Kim's about Q3 Deliverables looks urgent — ${deadlineText}.`,
    action: 'Summarize',
    command: "Summarize my boss's email and draft a polite pushback on the deadline",
    dismissed: false,
  });

  // ---- Dinner with Sarah ----
  // Only show if dinner time is still ahead (dinner at ~7 PM tonight)
  const dinnerTime = todayAt(19, 0);
  const minsUntilDinner = minutesUntil(dinnerTime, now);
  if (h < 19) {
    // Dinner is still ahead
    const timeLabel = minsUntilDinner > 120
      ? `tonight at ${fmt12(dinnerTime)}`
      : minsUntilDinner > 60
        ? `in about ${Math.floor(minsUntilDinner / 60)} hours`
        : `in ${minsUntilDinner} minutes`;
    cards.push({
      id: 'p3', icon: '📅', title: 'Dinner with Sarah',
      body: `Dinner with Sarah Chen ${timeLabel}. Running late? Want to reschedule?`,
      action: 'Reschedule',
      command: "Tell Sarah I can't make dinner, but let's do lunch next week",
      dismissed: false,
    });
  } else if (h >= 19 && h < 21) {
    // Dinner time — show "happening now" variant
    cards.push({
      id: 'p3', icon: '📅', title: 'Dinner with Sarah',
      body: `Dinner with Sarah Chen is now. Not going to make it?`,
      action: 'Cancel',
      command: "Tell Sarah I can't make dinner, but let's do lunch next week",
      dismissed: false,
    });
  } else {
    // Past dinner time — show next-day suggestion instead
    cards.push({
      id: 'p3', icon: '📅', title: 'Lunch with Sarah',
      body: `You missed dinner with Sarah tonight. Want to reschedule for lunch this week?`,
      action: 'Reschedule',
      command: "Tell Sarah I can't make dinner, but let's do lunch next week",
      dismissed: false,
    });
  }

  // ---- Flight price drop ----
  // Always relevant — distinct from commute; this is about booking, not navigating
  cards.push({
    id: 'p4', icon: '✈️', title: 'Flight Price Drop',
    body: 'Your NYC flight dropped $40 since yesterday. Book before it goes back up.',
    action: 'Book Flight',
    command: 'Book the cheapest NYC flight before the price goes back up',
    dismissed: false,
  });

  return cards;
}

// ─── Scenario-specific time-aware pills ─────────────────────────────────

export function getCommuteScenarioPills(now: Date = new Date()): ContextPill[] {
  // Departure = ~45 min from now
  const depart = new Date(now.getTime() + 45 * 60_000);
  const hrsToFlight = hoursUntil(new Date(now.getTime() + 3 * 3600_000), now);
  return [
    { id: 'location', icon: '📍', label: 'Home → SFO' },
    { id: 'time', icon: '🕐', label: `Departs ${fmt12(depart)}` },
    { id: 'balance', icon: '💳', label: '$124.50' },
    { id: 'flight', icon: '✈️', label: `Flight in ${hrsToFlight}h` },
  ];
}

export function getCommuteDepartureTime(now: Date = new Date()): string {
  const depart = new Date(now.getTime() + 45 * 60_000);
  return fmt12(depart);
}

export function getRelationshipScenarioPills(now: Date = new Date()): ContextPill[] {
  return [
    { id: 'location', icon: '📍', label: 'SF Downtown' },
    { id: 'contact', icon: '👤', label: 'Sarah Chen' },
    { id: 'calendar', icon: '📅', label: 'Tue 12:30 open' },
  ];
}

export function getEmailScenarioPills(_now: Date = new Date()): ContextPill[] {
  return [
    { id: 'location', icon: '📍', label: 'SF Downtown' },
    { id: 'email', icon: '📧', label: '3 unread' },
    { id: 'sender', icon: '👤', label: 'From: David Kim' },
  ];
}

export function getScheduleScenarioPills(now: Date = new Date()): ContextPill[] {
  const events = getCalendarEvents(now);
  const upcoming = events.filter((e) => !e.isPast);
  const nextEvent = upcoming[0];
  return [
    { id: 'calendar', icon: '📅', label: `${events.length} events today` },
    { id: 'time', icon: '🕐', label: nextEvent ? `Next: ${nextEvent.time}` : 'All done' },
    { id: 'free', icon: '✅', label: '2 hr free block' },
  ];
}

export function getOrderScenarioPills(_now: Date = new Date()): ContextPill[] {
  return [
    { id: 'location', icon: '📍', label: 'Home delivery' },
    { id: 'balance', icon: '💳', label: '$124.50' },
    { id: 'time', icon: '🕐', label: 'ETA 35 min' },
  ];
}

export function getFinanceScenarioPills(_now: Date = new Date()): ContextPill[] {
  const h = new Date().getHours();
  const isMarketOpen = h >= 6 && h < 13; // PST rough market hours
  return [
    { id: 'portfolio', icon: '📈', label: 'Portfolio +1.2%' },
    { id: 'market', icon: '🏛️', label: isMarketOpen ? 'Market open' : 'Market closed' },
    { id: 'alert', icon: '🔔', label: '2 alerts' },
  ];
}

export function getNavigationScenarioPills(_now: Date = new Date()): ContextPill[] {
  return [
    { id: 'location', icon: '📍', label: 'SF Downtown' },
    { id: 'mode', icon: '🚶', label: 'Walking' },
    { id: 'eta', icon: '🕐', label: 'ETA 8 min' },
  ];
}

export function getTravelScenarioPills(_now: Date = new Date()): ContextPill[] {
  return [
    { id: 'route', icon: '✈️', label: 'SFO → JFK' },
    { id: 'price', icon: '💰', label: '$249 – $315' },
    { id: 'date', icon: '📅', label: 'In 3 days' },
  ];
}

// ─── Post-action pills (after approve) ──────────────────────────────────

export function getPostActionPills(scenario: string, now: Date = new Date()): ContextPill[] {
  const departTime = getCommuteDepartureTime(now);
  const pills: Record<string, ContextPill[]> = {
    commute: [
      { id: 'location', icon: '🚇', label: 'Powell → SFO' },
      { id: 'time', icon: '🕐', label: `Departs ${departTime}` },
      { id: 'balance', icon: '💳', label: '$112.50' },
    ],
    relationship: [
      { id: 'location', icon: '📍', label: 'SF Downtown' },
      { id: 'contact', icon: '✅', label: 'Sarah notified' },
      { id: 'calendar', icon: '📅', label: 'Tue 12:30 booked' },
    ],
    email: [
      { id: 'location', icon: '📍', label: 'SF Downtown' },
      { id: 'email', icon: '✅', label: 'Reply sent' },
      { id: 'time', icon: '🕐', label: 'Free for 45 min' },
    ],
    schedule: [
      { id: 'calendar', icon: '✅', label: 'Optimized' },
      { id: 'time', icon: '🕐', label: 'Next: 2 PM' },
      { id: 'free', icon: '📅', label: '3-5 PM free' },
    ],
    order: [
      { id: 'location', icon: '🛒', label: 'Blue Bottle' },
      { id: 'time', icon: '🕐', label: 'ETA 25 min' },
      { id: 'balance', icon: '💳', label: '$118.00' },
    ],
    finance: [
      { id: 'portfolio', icon: '📈', label: '+$142 today' },
      { id: 'alert', icon: '🔔', label: 'NVDA alert set' },
      { id: 'balance', icon: '💳', label: '$24,830' },
    ],
    navigation: [
      { id: 'location', icon: '📍', label: 'Philz Coffee' },
      { id: 'eta', icon: '🚶', label: '8 min walk' },
      { id: 'mode', icon: '🗺️', label: 'Market St' },
    ],
    travel: [
      { id: 'route', icon: '✈️', label: 'SFO → JFK booked' },
      { id: 'price', icon: '💰', label: '$289 — United' },
      { id: 'date', icon: '📅', label: 'Confirmation sent' },
    ],
    general: getTimeAwareContextPills(now),
  };
  return pills[scenario] || getTimeAwareContextPills(now);
}

// ─── Post-action memory items ───────────────────────────────────────────

export function getApproveMemoryItem(scenario: string, now: Date = new Date(), userPrompt: string = ''): MemoryItem | null {
  const departTime = getCommuteDepartureTime(now);
  switch (scenario) {
    case 'commute':
      return { id: `m-${Date.now()}`, icon: '🚇', text: `BART ticket booked — $12.00. Departs ${departTime} from Powell St.`, time: 'Just now', type: 'action' };
    case 'relationship': {
      const lower = userPrompt.toLowerCase();
      if (lower.includes('mom') && (lower.includes('message') || lower.includes('text'))) {
        return { id: `m-${Date.now()}`, icon: '💬', text: 'Message sent to Mom — "Just thinking about you..."', time: 'Just now', type: 'action' };
      }
      if (lower.includes('john') || lower.includes('birthday')) {
        return { id: `m-${Date.now()}`, icon: '💬', text: 'Message sent to John Doe — Happy birthday wishes.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('texts') || lower.includes('read')) {
        return { id: `m-${Date.now()}`, icon: '💬', text: 'Unread messages checked — 4 messages marked as read.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('mom') && lower.includes('call')) {
        return { id: `m-${Date.now()}`, icon: '📞', text: 'FaceTime Audio call with Mom — 4m 12s duration.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('recent') || lower.includes('missed')) {
        return { id: `m-${Date.now()}`, icon: '📞', text: 'Returned missed call to Mom — 2m 05s duration.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('pizza') || lower.includes('nearest')) {
        return { id: `m-${Date.now()}`, icon: '📞', text: "Called Tony's Pizza — 1m 30s duration.", time: 'Just now', type: 'action' };
      }
      return { id: `m-${Date.now()}`, icon: '💬', text: 'Messages sent to Sarah — dinner cancelled, lunch Tue 12:30 proposed.', time: 'Just now', type: 'action' };
    }
    case 'email': {
      const lower = userPrompt.toLowerCase();
      if (lower.includes('boss') || lower.includes('summarize')) {
        return { id: `m-${Date.now()}`, icon: '📧', text: 'Email reply sent to David Kim — deadline pushback to next Wednesday.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('draft') || lower.includes('follow-up')) {
        return { id: `m-${Date.now()}`, icon: '📧', text: 'Follow-up email sent to Sarah Chen regarding Landing Page Assets.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('unread') || lower.includes('check')) {
        return { id: `m-${Date.now()}`, icon: '📧', text: 'Inbox cleared — 3 unread messages processed and marked as read.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('reply') || lower.includes('latest')) {
        return { id: `m-${Date.now()}`, icon: '📧', text: 'Reply sent to Alex Chen — acknowledged receipt of Latest Metrics Report.', time: 'Just now', type: 'action' };
      }
      return { id: `m-${Date.now()}`, icon: '📧', text: 'Email response sent.', time: 'Just now', type: 'action' };
    }
    case 'schedule': {
      const lower = userPrompt.toLowerCase();
      if ((lower.includes('what') && lower.includes('calendar')) || lower.includes('today')) {
        return { id: `m-${Date.now()}`, icon: '📅', text: 'Calendar reviewed — full schedule overview generated.', time: 'Just now', type: 'action' };
      }
      if ((lower.includes('schedule') && lower.includes('meeting')) || lower.includes('schedule a')) {
        return { id: `m-${Date.now()}`, icon: '📅', text: 'Meeting scheduled — tomorrow at 2:00 PM, Conference Room B. Invite sent.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('free') || lower.includes('next free') || lower.includes('available')) {
        return { id: `m-${Date.now()}`, icon: '📅', text: 'Free slot found — next available: 10:00 AM (2.5 hour block).', time: 'Just now', type: 'action' };
      }
      if (lower.includes('block') || lower.includes('lunch')) {
        return { id: `m-${Date.now()}`, icon: '📅', text: 'Lunch hour blocked — 12:00-1:00 PM. Auto-decline enabled.', time: 'Just now', type: 'action' };
      }
      return { id: `m-${Date.now()}`, icon: '📅', text: 'Schedule optimized — moved Design Review to 2 PM, freed up 3-5 PM block.', time: 'Just now', type: 'action' };
    }
    case 'order':
      return { id: `m-${Date.now()}`, icon: '🛒', text: 'Order placed — Oat Milk Latte + Avocado Toast from Blue Bottle. ETA 25 min.', time: 'Just now', type: 'action' };
    case 'finance': {
      const lower = userPrompt.toLowerCase();
      if (lower.includes('wallet') || lower.includes('balance') || lower.includes('card') || lower.includes('pay') || lower.includes('transaction')) {
        return { id: `m-${Date.now()}`, icon: '💳', text: 'Checked Apple Card balance and recent transactions.', time: 'Just now', type: 'action' };
      }
      return { id: `m-${Date.now()}`, icon: '📈', text: 'Portfolio report generated — up $142 today. NVDA alert set for $850 target.', time: 'Just now', type: 'action' };
    }
    case 'navigation': {
      const lower = userPrompt.toLowerCase();
      if (lower.includes('downtown')) {
        return { id: `m-${Date.now()}`, icon: '🗺️', text: 'Navigation started — Downtown SF, 18 min walk.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('coffee') || lower.includes('nearest')) {
        return { id: `m-${Date.now()}`, icon: '🗺️', text: 'Navigation started — Philz Coffee, 8 min walk via Market St.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('work') || lower.includes('office') || lower.includes('directions to')) {
        return { id: `m-${Date.now()}`, icon: '🗺️', text: 'Navigation started — Office, 22 min via 101 S.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('airport') || lower.includes('how far')) {
        return { id: `m-${Date.now()}`, icon: '🗺️', text: 'Distance calculated — SFO Airport is 13 miles away (25 min drive).', time: 'Just now', type: 'action' };
      }
      return { id: `m-${Date.now()}`, icon: '🗺️', text: 'Navigation started — route calculated.', time: 'Just now', type: 'action' };
    }
    case 'travel':
      return { id: `m-${Date.now()}`, icon: '✈️', text: 'Flight booked — United SFO→JFK, $289 nonstop. Confirmation sent to email.', time: 'Just now', type: 'action' };
    case 'general': {
      const lower = userPrompt.toLowerCase();
      if (lower.includes('take a photo') || lower.includes('camera') || lower.includes('selfie') || lower.includes('video') || lower.includes('scan')) {
        let text = 'Captured a photo with Camera.';
        if (lower.includes('selfie')) text = 'Captured a selfie with Front Camera.';
        if (lower.includes('video')) text = 'Recorded a 4K video (60fps) with Camera.';
        if (lower.includes('scan')) text = 'Scanned a document and saved to Files.';
        return { id: `m-${Date.now()}`, icon: '📷', text: text, time: 'Just now', type: 'action' };
      }
      if (lower.includes('safari') || lower.includes('search') || lower.includes('bookmark') || lower.includes('trending') || lower.includes('movie')) {
        let text = 'Browsed the web using Safari.';
        if (lower.includes('restaurant')) text = 'Searched Safari for the best restaurants in San Francisco.';
        if (lower.includes('bookmark')) text = 'Opened Safari Bookmarks manager.';
        if (lower.includes('trending')) text = 'Checked trending searches in Safari.';
        if (lower.includes('movie')) text = 'Looked up movie showtimes in Safari.';
        return { id: `m-${Date.now()}`, icon: '🧭', text: text, time: 'Just now', type: 'action' };
      }
      if (lower.includes('photos') || lower.includes('vacation') || lower.includes('collage') || lower.includes('gallery') || lower.includes('share photos')) {
        return { id: `m-${Date.now()}`, icon: '🖼️', text: 'Viewed Photos gallery.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('music') || lower.includes('play') || lower.includes('listen') || lower.includes('lo-fi') || lower.includes('liked') || lower.includes('album') || lower.includes('drake')) {
        return { id: `m-${Date.now()}`, icon: '🎵', text: 'Started playing music.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('podcast')) {
        return { id: `m-${Date.now()}`, icon: '🎙️', text: 'Resumed podcast playback.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('news') || lower.includes('headline')) {
        return { id: `m-${Date.now()}`, icon: '📰', text: 'Checked today\'s top news headlines.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('book') || lower.includes('read') || lower.includes('novel')) {
        return { id: `m-${Date.now()}`, icon: '📚', text: 'Opened Apple Books.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('note') || lower.includes('ideas list')) {
        return { id: `m-${Date.now()}`, icon: '📝', text: 'Saved a new note to Apple Notes.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('remind')) {
        return { id: `m-${Date.now()}`, icon: '✅', text: 'Set a new reminder in Apple Reminders.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('file') || lower.includes('report') || lower.includes('download') || lower.includes('presentation') || lower.includes('document')) {
        return { id: `m-${Date.now()}`, icon: '📁', text: 'Opened a document from Files app.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('weather') || lower.includes('rain') || lower.includes('forecast')) {
        return { id: `m-${Date.now()}`, icon: '🌤️', text: 'Checked the weather forecast.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('clock') || lower.includes('timer') || lower.includes('alarm') || lower.includes('time is') || lower.includes('stopwatch')) {
        return { id: `m-${Date.now()}`, icon: '⏱️', text: 'Set a timer or alarm.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('calculate') || lower.includes('tip') || lower.includes('convert') || lower.includes('split') || lower.includes('mortgage')) {
        return { id: `m-${Date.now()}`, icon: '🧮', text: 'Performed a calculation.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('translate') || lower.includes('japanese') || lower.includes('french') || lower.includes('spanish')) {
        return { id: `m-${Date.now()}`, icon: '🌐', text: 'Translated text.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('health') || lower.includes('sleep') || lower.includes('weight') || lower.includes('steps')) {
        return { id: `m-${Date.now()}`, icon: '❤️', text: 'Checked Apple Health data.', time: 'Just now', type: 'action' };
      }
      if (lower.includes('fitness') || lower.includes('run') || lower.includes('workout') || lower.includes('goal')) {
        return { id: `m-${Date.now()}`, icon: '🏃', text: 'Logged activity in Apple Fitness.', time: 'Just now', type: 'action' };
      }
      return { id: `m-${Date.now()}`, icon: '✨', text: 'Task completed — result saved to memory.', time: 'Just now', type: 'action' };
    }
    default:
      return null;
  }
}
