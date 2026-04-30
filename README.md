# Omni

### An Agent-First Operating System — Built Two Years Before The Industry Catches Up.

---

## The Story

In April 2026, reports surfaced that OpenAI was partnering with Qualcomm to build an entirely new smartphone operating system — one designed from scratch around AI agents rather than apps. Sam Altman called it _"a good time to seriously rethink how operating systems and user interfaces are designed."_ Mass production is set for 2028.

His vision was radical: **kill the app grid.** No more opening Maps, then switching to Uber, then checking your calendar, then texting your friend. Instead, say _"Get me to the airport"_ and an AI orchestrator breaks it into steps, executes them across services in the background, and delivers a result. The user never touches an app.

It's a beautiful idea. But I think it's incomplete.

People don't just want AI doing things _for_ them — they also want to **feel in control**. They want to see their apps. Swipe through their home screen. Glance at notifications. Pull down a control center. Decades of muscle memory built on iOS and Android don't vanish overnight. The smartphone isn't broken — it's just missing a brain.

So I asked a different question:

> _What if the next OS isn't a departure from what we have — but an evolution of it?_

**Omni** is my answer. A hybrid operating system that keeps the familiar, tactile interface of a modern smartphone — lock screen, home screen, notifications, settings, app library — but weaves an AI agent layer through every surface. You can still tap an app icon. But now, when you do, the OS already knows what you might need from it. And when you type a command, you don't navigate to an app — you enter a **Workspace**, where agents orchestrate across multiple services in real-time while you watch.

It's not app-first. It's not agent-only. It's both.

I built this as a working simulator to prove the concept — a high-fidelity prototype that feels like holding a real device, runs in a browser, and can deploy to iOS and Android via Capacitor.

---

## The Idea

Traditional OS:

```
User → Open App → Find feature → Do the thing → Repeat across 4 apps
```

Sam Altman's vision:

```
User → Tell AI → AI does everything → User gets result
```

Omni:

```
User → Tell AI or tap an app → AI-aware interface suggests, orchestrates,
       and executes → User approves → Result delivered
       (All within a familiar OS they already know how to use)
```

The key insight: **the best AI OS doesn't replace the smartphone — it makes the smartphone conscious.**

---

## What I Built

### A Full Operating System Simulator

Not a mockup. Not a wireframe. A working, interactive OS with every surface you'd expect from a real device:

- **Lock Screen** — Swipe to unlock. Live clock. Notification previews at a glance.
- **Home Screen** — Context-aware greeting that shifts with time of day. Recent agent activity feed. Quick access to chat and settings.
- **Status Bar** — Real-time clock, signal indicators, battery, and a notification dot — just like a real phone.
- **Control Center** — Wi-Fi, Bluetooth, Airplane Mode, Do Not Disturb. Brightness and volume sliders. Pull it down like you would on iOS.
- **Notification System** — Slide-in banners with auto-dismiss. A full notification center. Mark as read. Clear all.
- **Settings** — Grouped lists with animated toggle switches. Feels native.
- **App Library** — 24 apps across 6 categories in a familiar 4-column grid. But here's the twist — tapping an app doesn't just "open" it. It takes you to a contextual screen with agent-powered suggestions for what you might want to do.

### The Agent Layer

This is where Omni diverges from any phone you've held before.

**Unified Input** — A floating command bar at the bottom of every screen. Type naturally. _"Get me to the airport."_ _"Tell Sarah I can't make dinner."_ _"Summarize my boss's email."_ Predictive agent chains appear as you type.

**Agent Workspace** — When you issue a command, the OS doesn't navigate to an app. It opens a Workspace — a cascading card stack showing:
1. **The Orchestrator** — Your request, the AI's plan, and a step-by-step checklist that animates as each step completes.
2. **The Execution** — A mocked but realistic tool UI (map with routes, email client, chat interface, etc.) where the agent is actively working.
3. **The Receipt** — Confirmation of what was done, with a one-tap option to go home. Everything is logged to memory.

**9 Fully Built Scenarios** — Each one is a complete agent workflow:

| Scenario | What It Replaces | Example Command |
|---|---|---|
| Commute Optimizer | Maps + Uber + Wallet | _"Get me to the airport"_ |
| Relationship Manager | Contacts + Messages + Calendar | _"Tell Sarah I can't make dinner"_ |
| Autopilot Email | Gmail | _"Summarize my boss's email and draft a pushback"_ |
| Schedule Organizer | Calendar + Reminders | _"What's on my calendar today?"_ |
| Smart Ordering | UberEats + DoorDash | _"Order my usual coffee"_ |
| Finance Dashboard | Stocks + Wallet + Banking | _"How's my portfolio doing?"_ |
| Navigation | Maps + Reviews | _"Find the nearest coffee shop"_ |
| Travel Booking | Flight search + Hotels | _"Book a flight to NYC"_ |
| General Assistant | Everything else | _"Play my focus playlist"_ |

### Contextual Intelligence

The OS doesn't just respond — it anticipates.

- **Context Pills** — Dynamic badges below the status bar that update based on your situation. Location, free time, balance, upcoming flights. They shift when you enter a scenario and update after you approve an action.
- **Proactive Cards** — The home screen surfaces "Suggested for You" cards that adapt to the time of day. Morning shows commute alerts. Evening shows dinner plans. They're actionable — tap one and it feeds directly into the agent workspace.
- **Memory Feed** — A persistent timeline of everything the AI has done, learned, or is tracking. _"Saved $12 on your last Uber."_ _"John mentioned his dog is sick — saved to contact card."_ _"Flights to NYC dropped $40."_ Every agent action generates a memory entry.
- **Time-Aware Engine** — A centralized service (`timeContext.ts`) that ensures every notification, proactive card, context pill, memory item, greeting, and calendar event stays synchronized with the real clock. Morning, afternoon, evening, and night each produce different data across all surfaces.

### Conversation Mode

A multi-turn chat interface with iMessage-style bubbles. Omni responds to dozens of topics — weather, stocks, schedule, food, music, directions, reminders, fitness, news, and more. It remembers what you asked earlier in the session and adjusts its responses. It's not GPT — it's pattern-matched and scripted — but it _feels_ alive.

### The Design

- Dark mode, always. Deep blacks and charcoals.
- Glassmorphism blur on system overlays (control center, notifications, memory feed).
- Spring physics animations on every interaction (Framer Motion).
- Haptic-like sound effects via Web Audio API — taps, ticks, opens, closes.
- Dynamic ambient background orbs that subtly shift color.
- iOS-native aesthetic without being an iOS clone.
- Runs inside a realistic phone frame on desktop. Full-screen on mobile.

---

## Why This Matters

OpenAI's AI OS is coming in 2028 with Qualcomm silicon, Luxshare manufacturing, and Jony Ive designing hardware. Google is reportedly rethinking Android around Gemini. Apple is threading intelligence into every app.

But nobody has shown what the **interface** actually looks like. What does an agent-first home screen feel like? How does a workspace replace an app? What happens to notifications when an AI is doing things on your behalf? How do you maintain control without micromanaging?

Omni is one answer. It's a simulator, yes — but it's a working, tangible vision of what everyone is talking about in the abstract. And it argues for the hybrid path: **keep what works, add what's missing.**

---

## Run It

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

```bash
# Build for production
pnpm run build

# Deploy to mobile
pnpm run build && pnpm run sync
pnpm run android   # Requires Android Studio
pnpm run ios       # Requires Xcode on macOS
```

## Tech

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (Static Export) |
| UI | React 18 + Framer Motion |
| State | Zustand |
| Styling | CSS Custom Properties |
| Native Bridge | Capacitor 5 (iOS + Android) |
| Audio | Web Audio API |

---

<p align="center">
  <sub>Built by <strong>Alexis Valentino</strong> — April 2026</sub>
</p>
