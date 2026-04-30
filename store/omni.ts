'use client';

import { create } from 'zustand';
import {
  getTimeAwareNotifications,
  getTimeAwareMemoryItems,
  getTimeAwareProactiveCards,
  getTimeAwareContextPills,
  getCommuteScenarioPills,
  getRelationshipScenarioPills,
  getEmailScenarioPills,
  getScheduleScenarioPills,
  getOrderScenarioPills,
  getFinanceScenarioPills,
  getNavigationScenarioPills,
  getTravelScenarioPills,
  getPostActionPills,
  getApproveMemoryItem,
  getCalendarEvents,
  getTimeOfDay,
  getGreeting,
} from '../services/timeContext';

export type ContextPill = {
  id: string;
  icon: string;
  label: string;
};

export type MemoryItem = {
  id: string;
  icon: string;
  text: string;
  time: string;
  type: 'saving' | 'info' | 'alert' | 'action';
};

export type AgentStep = {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done';
};

export type ScenarioId = 'commute' | 'relationship' | 'email' | 'schedule' | 'order' | 'finance' | 'navigation' | 'travel' | 'general' | null;

export type WorkspacePhase = 'orchestrator' | 'executing' | 'complete';

export type Notification = {
  id: string;
  app: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type ActiveScreen = 'lock' | 'home' | 'workspace' | 'settings' | 'appLibrary' | 'chat' | 'app';

export type ProactiveCard = {
  id: string;
  icon: string;
  title: string;
  body: string;
  action: string;
  command: string;
  dismissed: boolean;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
};

export type AppItem = {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
};

export interface OmniState {
  // Screen state
  activeScreen: ActiveScreen;
  isWorkspaceOpen: boolean;
  isMemoryFeedOpen: boolean;
  isControlCenterOpen: boolean;
  isNotificationCenterOpen: boolean;
  inputValue: string;

  // Lock screen
  isLocked: boolean;

  // Notifications
  notifications: Notification[];
  bannerNotification: Notification | null;

  // Control center toggles
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  airplaneMode: boolean;
  doNotDisturb: boolean;
  brightness: number;
  volume: number;

  // Active Scenario
  activeScenario: ScenarioId;
  workspacePhase: WorkspacePhase;
  agentSteps: AgentStep[];
  orchestratorMessage: string;
  userPrompt: string;

  // Context
  contextPills: ContextPill[];

  // Memory Feed
  memoryItems: MemoryItem[];

  // Predictive suggestions
  suggestions: string[];
  showSuggestions: boolean;

  // App screen state
  activeAppName: string;
  activeAppSuggestions: string[];

  // Proactive agent cards
  proactiveCards: ProactiveCard[];

  // Conversation mode
  chatMessages: ChatMessage[];
  isChatTyping: boolean;

  // App Library
  apps: AppItem[];

  // Computed helpers
  isHomeScreen: boolean;

  // Actions
  unlock: () => void;
  lock: () => void;
  setInputValue: (value: string) => void;
  submitCommand: (command: string) => void;
  goHome: () => void;
  goToSettings: () => void;
  goToAppLibrary: () => void;
  goToChat: () => void;
  toggleMemoryFeed: () => void;
  closeMemoryFeed: () => void;
  toggleControlCenter: () => void;
  closeControlCenter: () => void;
  toggleNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  toggleAirplaneMode: () => void;
  toggleDoNotDisturb: () => void;
  setBrightness: (v: number) => void;
  setVolume: (v: number) => void;
  dismissBanner: () => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  pushNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
  dismissProactiveCard: (id: string) => void;
  actOnProactiveCard: (id: string) => void;
  sendChatMessage: (text: string) => void;
  advanceWorkspace: () => void;
  completeStep: (stepId: string) => void;
  approveAction: () => void;
  openAppWithSuggestions: (appName: string, suggestions: string[]) => void;
}

const defaultPills: ContextPill[] = getTimeAwareContextPills();

const defaultMemory: MemoryItem[] = getTimeAwareMemoryItems();

const defaultNotifications: Notification[] = getTimeAwareNotifications();

function matchScenario(input: string): ScenarioId {
  const lower = input.toLowerCase();
  // Travel / flight booking — check BEFORE commute so "book flight" doesn't match commute's 'flight' keyword
  if ((lower.includes('book') && lower.includes('flight')) || lower.includes('book flight') || lower.includes('rebook') || (lower.includes('price') && lower.includes('drop')) || lower.includes('flight deal') || lower.includes('cheap flight')) return 'travel';
  // Commute / transport (immediate navigation, getting to a place)
  if (lower.includes('airport') || lower.includes('commute') || lower.includes('get me to') || lower.includes('uber') || lower.includes('bart') || lower.includes('drive me') || lower.includes('traffic')) return 'commute';
  // Relationship / messaging
  if (lower.includes('sarah') || lower.includes('dinner') || lower.includes('tell ') || lower.includes('message') || lower.includes('text ') || lower.includes('call ')) return 'relationship';
  // Email
  if (lower.includes('email') || lower.includes('boss') || lower.includes('summarize') || lower.includes('draft') || lower.includes('inbox') || lower.includes('mail') || lower.includes('reply')) return 'email';
  // Schedule / calendar
  if (lower.includes('calendar') || lower.includes('schedule') || lower.includes('meeting') || lower.includes('agenda') || lower.includes('remind') || lower.includes('alarm') || lower.includes('timer') || lower.includes('clock')) return 'schedule';
  // Order / food
  if (lower.includes('order') || lower.includes('grocery') || lower.includes('food') || lower.includes('coffee') || lower.includes('deliver') || lower.includes('restaurant') || lower.includes('buy')) return 'order';
  // Finance
  if (lower.includes('stock') || lower.includes('portfolio') || lower.includes('invest') || lower.includes('market') || lower.includes('aapl') || lower.includes('wallet') || lower.includes('balance') || lower.includes('card') || lower.includes('pay') || lower.includes('tip') || lower.includes('calculate')) return 'finance';
  // Navigation
  if (lower.includes('navigate') || lower.includes('direction') || lower.includes('nearest') || lower.includes('where is') || lower.includes('map') || lower.includes('nearby') || lower.includes('find near') || lower.includes('walk to') || lower.includes('how do i get')) return 'navigation';
  // Travel (standalone keyword — after specific booking check above, catch remaining flight/hotel/trip mentions)
  if (lower.includes('flight') || lower.includes('hotel') || lower.includes('reservation') || lower.includes('travel') || lower.includes('trip')) return 'travel';
  // General catch-all for misc app commands
  if (lower.includes('photo') || lower.includes('camera') || lower.includes('music') || lower.includes('play') || lower.includes('podcast') || lower.includes('listen') || lower.includes('news') || lower.includes('book') || lower.includes('read') || lower.includes('note') || lower.includes('file') || lower.includes('weather') || lower.includes('translate') || lower.includes('step') || lower.includes('health') || lower.includes('fitness') || lower.includes('run') || lower.includes('safari')) return 'general';
  return null;
}

function getSuggestions(input: string): string[] {
  const lower = input.toLowerCase();
  if (!lower || lower.length < 2) return [];

  if (lower.startsWith('get') || lower.startsWith('take') || lower.startsWith('go')) {
    return ['Get me to the airport', 'Get an Uber to downtown', 'Get directions to work'];
  }
  if (lower.startsWith('tell') || lower.startsWith('mes') || lower.startsWith('sen') || lower.startsWith('tex')) {
    return ["Tell Sarah I can't make dinner", 'Send a message to Mom', 'Text John happy birthday'];
  }
  if (lower.startsWith('sum') || lower.startsWith('ema') || lower.startsWith('dra') || lower.startsWith('rea')) {
    return ["Summarize my boss's email and draft a pushback", 'Draft a follow-up email', 'Read my unread messages'];
  }
  if (lower.startsWith('ord') || lower.startsWith('buy') || lower.startsWith('sho')) {
    return ['Order usual coffee', 'Order from UberEats', 'Order groceries'];
  }
  if (lower.startsWith('pla') || lower.startsWith('mus') || lower.startsWith('lis')) {
    return ['Play my focus playlist', 'Play the latest podcast', 'Listen to lo-fi beats'];
  }
  if (lower.startsWith('wha') || lower.startsWith('how') || lower.startsWith('che')) {
    return ["What's the weather?", "What's on my calendar?", 'Check my stocks', "How's the market?"];
  }
  if (lower.startsWith('set') || lower.startsWith('rem') || lower.startsWith('ala')) {
    return ['Set a timer for 25 min', 'Remind me to call dentist at 3 PM', 'Set an alarm for 7 AM'];
  }
  if (lower.startsWith('cal')) {
    return ['Calculate tip on $86', "What's on my calendar today?", 'Call Mom'];
  }
  if (lower.startsWith('nav') || lower.startsWith('dir') || lower.startsWith('fin')) {
    return ['Navigate to downtown', 'Find the nearest coffee shop', 'Find the Q3 report'];
  }
  if (lower.startsWith('boo') || lower.startsWith('res') || lower.startsWith('tra')) {
    return ['Book a flight to NYC', 'Reserve a table for tonight', 'Track my package'];
  }
  return ['Get me to the airport', "Tell Sarah I can't make dinner", "Summarize my boss's email", "What's on my calendar?"];
}

function getScenarioData(scenario: ScenarioId) {
  switch (scenario) {
    case 'commute':
      return {
        steps: [
          { id: 's1', label: 'Check traffic conditions', status: 'pending' as const },
          { id: 's2', label: 'Compare Uber vs. BART routes', status: 'pending' as const },
          { id: 's3', label: 'Find optimal departure time', status: 'pending' as const },
          { id: 's4', label: 'Book transport & generate ticket', status: 'pending' as const },
        ],
        message: "I'll check current traffic, compare your options between Uber and BART, and book the fastest route to SFO.",
        pills: getCommuteScenarioPills(),
      };
    case 'relationship':
      return {
        steps: [
          { id: 's1', label: 'Compose polite cancellation message', status: 'pending' as const },
          { id: 's2', label: 'Scan calendar for lunch openings', status: 'pending' as const },
          { id: 's3', label: 'Draft lunch invite with suggestion', status: 'pending' as const },
          { id: 's4', label: 'Prepare messages for approval', status: 'pending' as const },
        ],
        message: "I'll draft a polite cancellation for dinner tonight, find an open lunch slot next week, and suggest a restaurant.",
        pills: getRelationshipScenarioPills(),
      };
    case 'email':
      return {
        steps: [
          { id: 's1', label: "Retrieve and analyze boss's email", status: 'pending' as const },
          { id: 's2', label: 'Extract key points & deadline', status: 'pending' as const },
          { id: 's3', label: 'Generate summary brief', status: 'pending' as const },
          { id: 's4', label: 'Draft polite pushback response', status: 'pending' as const },
        ],
        message: "I'll read through the email, pull out the key asks and the deadline, then draft a professional pushback for your review.",
        pills: getEmailScenarioPills(),
      };
    case 'schedule':
      return {
        steps: [
          { id: 's1', label: 'Scan today\'s calendar events', status: 'pending' as const },
          { id: 's2', label: 'Identify conflicts & gaps', status: 'pending' as const },
          { id: 's3', label: 'Suggest optimizations', status: 'pending' as const },
          { id: 's4', label: 'Prepare schedule summary', status: 'pending' as const },
        ],
        message: "I'll pull your full calendar, check for conflicts, find free slots, and give you an optimized rundown of your day.",
        pills: getScheduleScenarioPills(),
      };
    case 'order':
      return {
        steps: [
          { id: 's1', label: 'Check previous order history', status: 'pending' as const },
          { id: 's2', label: 'Scan for deals & coupons', status: 'pending' as const },
          { id: 's3', label: 'Build order & estimate total', status: 'pending' as const },
          { id: 's4', label: 'Place order & track delivery', status: 'pending' as const },
        ],
        message: "I'll check your past orders, find any available discounts, and place the order for you. Estimated delivery in 35 min.",
        pills: getOrderScenarioPills(),
      };
    case 'finance':
      return {
        steps: [
          { id: 's1', label: 'Pull real-time portfolio data', status: 'pending' as const },
          { id: 's2', label: 'Analyze today\'s market movers', status: 'pending' as const },
          { id: 's3', label: 'Generate performance report', status: 'pending' as const },
          { id: 's4', label: 'Highlight alerts & recommendations', status: 'pending' as const },
        ],
        message: "I'll pull your current holdings, check today's market activity, and flag anything that needs attention.",
        pills: getFinanceScenarioPills(),
      };
    case 'navigation':
      return {
        steps: [
          { id: 's1', label: 'Search nearby locations', status: 'pending' as const },
          { id: 's2', label: 'Compare ratings & distance', status: 'pending' as const },
          { id: 's3', label: 'Calculate optimal route', status: 'pending' as const },
          { id: 's4', label: 'Start turn-by-turn navigation', status: 'pending' as const },
        ],
        message: "I'll find the best options nearby, compare ratings and walking distance, and get you directions.",
        pills: getNavigationScenarioPills(),
      };
    case 'travel':
      return {
        steps: [
          { id: 's1', label: 'Search available flights & prices', status: 'pending' as const },
          { id: 's2', label: 'Compare airlines & schedules', status: 'pending' as const },
          { id: 's3', label: 'Apply loyalty points & discounts', status: 'pending' as const },
          { id: 's4', label: 'Confirm booking & send itinerary', status: 'pending' as const },
        ],
        message: "I'll search for the best available flights, compare prices across airlines, and lock in the lowest fare before it goes back up.",
        pills: getTravelScenarioPills(),
      };
    case 'general':
      return {
        steps: [
          { id: 's1', label: 'Understand your request', status: 'pending' as const },
          { id: 's2', label: 'Gather context & data', status: 'pending' as const },
          { id: 's3', label: 'Process & prepare result', status: 'pending' as const },
          { id: 's4', label: 'Present result for review', status: 'pending' as const },
        ],
        message: "I'll handle that for you. Give me a moment to work through it.",
        pills: getTimeAwareContextPills(),
      };
    default:
      return { steps: [], message: '', pills: defaultPills };
  }
}

const defaultProactiveCards = getTimeAwareProactiveCards();

const defaultApps: AppItem[] = [
  { id: 'a1', name: 'Maps', icon: '🗺️', color: '#34C759', category: 'Essentials' },
  { id: 'a2', name: 'Calendar', icon: '📅', color: '#FF3B30', category: 'Essentials' },
  { id: 'a3', name: 'Mail', icon: '📧', color: '#007AFF', category: 'Essentials' },
  { id: 'a4', name: 'Messages', icon: '💬', color: '#34C759', category: 'Essentials' },
  { id: 'a5', name: 'Phone', icon: '📞', color: '#34C759', category: 'Essentials' },
  { id: 'a6', name: 'Camera', icon: '📷', color: '#8E8E93', category: 'Essentials' },
  { id: 'a7', name: 'Photos', icon: '🖼️', color: '#FF9500', category: 'Media' },
  { id: 'a8', name: 'Music', icon: '🎵', color: '#FF2D55', category: 'Media' },
  { id: 'a9', name: 'Podcasts', icon: '🎙️', color: '#8B5CF6', category: 'Media' },
  { id: 'a10', name: 'Notes', icon: '📝', color: '#FFCC00', category: 'Productivity' },
  { id: 'a11', name: 'Reminders', icon: '✅', color: '#007AFF', category: 'Productivity' },
  { id: 'a12', name: 'Files', icon: '📁', color: '#007AFF', category: 'Productivity' },
  { id: 'a13', name: 'Weather', icon: '🌤️', color: '#5AC8FA', category: 'Utilities' },
  { id: 'a14', name: 'Clock', icon: '🕐', color: '#1C1C1E', category: 'Utilities' },
  { id: 'a15', name: 'Calculator', icon: '🔢', color: '#636366', category: 'Utilities' },
  { id: 'a16', name: 'Wallet', icon: '💳', color: '#1C1C1E', category: 'Finance' },
  { id: 'a17', name: 'Stocks', icon: '📈', color: '#1C1C1E', category: 'Finance' },
  { id: 'a18', name: 'Health', icon: '❤️', color: '#FF2D55', category: 'Health' },
  { id: 'a19', name: 'Fitness', icon: '🏃', color: '#30D158', category: 'Health' },
  { id: 'a20', name: 'Safari', icon: '🧭', color: '#007AFF', category: 'Essentials' },
  { id: 'a21', name: 'News', icon: '📰', color: '#FF3B30', category: 'Media' },
  { id: 'a22', name: 'Books', icon: '📚', color: '#FF9500', category: 'Media' },
  { id: 'a23', name: 'Translate', icon: '🌐', color: '#007AFF', category: 'Utilities' },
  { id: 'a24', name: 'Settings', icon: '⚙️', color: '#8E8E93', category: 'Utilities' },
];

export const useOmniStore = create<OmniState>((set, get) => ({
  activeScreen: 'lock',
  isWorkspaceOpen: false,
  isMemoryFeedOpen: false,
  isControlCenterOpen: false,
  isNotificationCenterOpen: false,
  inputValue: '',
  isLocked: true,
  notifications: defaultNotifications,
  bannerNotification: null,
  wifiEnabled: true,
  bluetoothEnabled: true,
  airplaneMode: false,
  doNotDisturb: false,
  brightness: 80,
  volume: 65,
  activeScenario: null,
  workspacePhase: 'orchestrator',
  agentSteps: [],
  orchestratorMessage: '',
  userPrompt: '',
  contextPills: defaultPills,
  memoryItems: defaultMemory,
  suggestions: [],
  showSuggestions: false,
  activeAppName: '',
  activeAppSuggestions: [],
  proactiveCards: defaultProactiveCards,
  chatMessages: [],
  isChatTyping: false,
  apps: defaultApps,

  // Computed
  get isHomeScreen() { return get().activeScreen === 'home'; },

  // Lock screen
  unlock: () => set({ isLocked: false, activeScreen: 'home' }),
  lock: () => set({ isLocked: true, activeScreen: 'lock', isControlCenterOpen: false, isNotificationCenterOpen: false, isMemoryFeedOpen: false }),

  setInputValue: (value) => {
    const suggestions = getSuggestions(value);
    set({ inputValue: value, suggestions, showSuggestions: suggestions.length > 0 && value.length > 1 });
  },

  submitCommand: (command) => {
    const scenario = matchScenario(command);
    const effectiveScenario = scenario || 'general';
    const data = getScenarioData(effectiveScenario);
    set({
      activeScreen: 'workspace',
      isWorkspaceOpen: true,
      activeScenario: effectiveScenario,
      workspacePhase: 'orchestrator',
      agentSteps: data.steps,
      orchestratorMessage: data.message,
      userPrompt: command,
      contextPills: data.pills,
      inputValue: '',
      showSuggestions: false,
      suggestions: [],
    });
  },

  goHome: () => {
    set({
      activeScreen: 'home',
      isWorkspaceOpen: false,
      activeScenario: null,
      workspacePhase: 'orchestrator',
      agentSteps: [],
      orchestratorMessage: '',
      userPrompt: '',
      contextPills: defaultPills,
      inputValue: '',
      showSuggestions: false,
      isMemoryFeedOpen: false,
      isControlCenterOpen: false,
      isNotificationCenterOpen: false,
    });
  },

  goToSettings: () => {
    set({ activeScreen: 'settings', isWorkspaceOpen: false, isControlCenterOpen: false, isNotificationCenterOpen: false, isMemoryFeedOpen: false });
  },

  goToAppLibrary: () => {
    set({ activeScreen: 'appLibrary', isWorkspaceOpen: false, isControlCenterOpen: false, isNotificationCenterOpen: false, isMemoryFeedOpen: false });
  },

  goToChat: () => {
    set({ activeScreen: 'chat', isWorkspaceOpen: false, isControlCenterOpen: false, isNotificationCenterOpen: false, isMemoryFeedOpen: false });
  },

  toggleMemoryFeed: () => {
    set({ isMemoryFeedOpen: !get().isMemoryFeedOpen, isControlCenterOpen: false, isNotificationCenterOpen: false });
  },

  closeMemoryFeed: () => set({ isMemoryFeedOpen: false }),

  toggleControlCenter: () => {
    set({ isControlCenterOpen: !get().isControlCenterOpen, isNotificationCenterOpen: false, isMemoryFeedOpen: false });
  },

  closeControlCenter: () => set({ isControlCenterOpen: false }),

  toggleNotificationCenter: () => {
    set({ isNotificationCenterOpen: !get().isNotificationCenterOpen, isControlCenterOpen: false, isMemoryFeedOpen: false });
  },

  closeNotificationCenter: () => set({ isNotificationCenterOpen: false }),

  // Control center toggles
  toggleWifi: () => set({ wifiEnabled: !get().wifiEnabled }),
  toggleBluetooth: () => set({ bluetoothEnabled: !get().bluetoothEnabled }),
  toggleAirplaneMode: () => set({ airplaneMode: !get().airplaneMode }),
  toggleDoNotDisturb: () => set({ doNotDisturb: !get().doNotDisturb }),
  setBrightness: (v) => set({ brightness: v }),
  setVolume: (v) => set({ volume: v }),

  // Notifications
  dismissBanner: () => set({ bannerNotification: null }),
  markNotificationRead: (id) => {
    set({ notifications: get().notifications.map((n) => n.id === id ? { ...n, read: true } : n) });
  },
  clearNotifications: () => set({ notifications: [] }),
  pushNotification: (n) => {
    const notification: Notification = { ...n, id: `n-${Date.now()}`, read: false };
    set({
      notifications: [notification, ...get().notifications],
      bannerNotification: get().doNotDisturb ? null : notification,
    });
    // Auto-dismiss banner after 4s
    if (!get().doNotDisturb) {
      setTimeout(() => {
        if (get().bannerNotification?.id === notification.id) {
          set({ bannerNotification: null });
        }
      }, 4000);
    }
  },

  // Proactive cards
  dismissProactiveCard: (id) => {
    set({ proactiveCards: get().proactiveCards.map((c) => c.id === id ? { ...c, dismissed: true } : c) });
  },

  actOnProactiveCard: (id) => {
    const card = get().proactiveCards.find((c) => c.id === id);
    if (card) {
      get().dismissProactiveCard(id);
      get().submitCommand(card.command);
    }
  },

  // Conversation mode
  sendChatMessage: (text) => {
    const userMsg: ChatMessage = { id: `cm-${Date.now()}`, role: 'user', text, timestamp: Date.now() };
    const messages = [...get().chatMessages, userMsg];
    set({ chatMessages: messages, isChatTyping: true });

    const lower = text.toLowerCase();
    const prevTopics = messages.filter(m => m.role === 'user').map(m => m.text.toLowerCase());
    const askedBefore = (kw: string) => prevTopics.slice(0, -1).some(t => t.includes(kw));

    let response: string;

    // Greetings
    if (lower.match(/^(hi|hey|hello|sup|yo|what can you|what do you)/)) {
      const tod = getTimeOfDay();
      response = `Hey! ${getGreeting()}. I'm Omni, your AI assistant. I can manage your commute, messages, emails, schedule, finances, and more. ${tod === 'night' ? "It's getting late — need a morning alarm?" : "Try asking about your calendar, the weather, or say 'order coffee'."}`;
    }
    // Farewell
    else if (lower.match(/^(bye|goodbye|see you|later|good night|night)/)) {
      response = "See you later! I'll keep an eye on your notifications and traffic. Sleep well! 🌙";
    }
    // Gratitude
    else if (lower.match(/^(thanks|thank you|thx|great|awesome|perfect|nice|cool)/)) {
      response = "Happy to help! Let me know if there's anything else you need.";
    }
    // Confirmation
    else if (lower.match(/^(yes|yeah|yep|do it|go ahead|book it|confirm|sure|ok|okay|sounds good)/)) {
      response = "Done! I've taken care of it. You'll get a confirmation notification shortly. ✅";
    }
    // Commute/Traffic
    else if (lower.match(/traffic|commute|airport|uber|bart|drive|ride/)) {
      response = askedBefore('traffic') || askedBefore('commute')
        ? "Traffic has eased slightly since you last asked. 101 is down to 25 min now. BART is still the faster option at 38 min for $12."
        : "I checked the current traffic — 101 is congested. BART from Powell St would get you to SFO in 38 min for $12. Want me to book it?";
    }
    // Weather
    else if (lower.match(/weather|temperature|rain|forecast|cold|hot|outside/)) {
      response = askedBefore('weather')
        ? "Still 68°F. Temps dropping to 58° by tonight though. No rain expected. Tomorrow looks similar — 70°F and sunny."
        : "It's 68°F and partly cloudy in SF right now. High of 72° today with a 12% chance of rain. Perfect day to be outside!";
    }
    // Schedule/Calendar
    else if (lower.match(/schedule|calendar|today|meeting|agenda|busy|free|appointment/)) {
      const evts = getCalendarEvents();
      const upcomingEvts = evts.filter(e => !e.isPast);
      const pastEvts = evts.filter(e => e.isPast);
      if (askedBefore('schedule') || askedBefore('calendar')) {
        const next = upcomingEvts[0];
        response = next
          ? `No changes to your schedule. Next up is ${next.title} at ${next.time}. You have ${upcomingEvts.length} event${upcomingEvts.length > 1 ? 's' : ''} remaining today.`
          : `All events are done for today. You're free the rest of the ${getTimeOfDay()}.`;
      } else {
        const eventList = evts.map(e => `• ${e.title} — ${e.time}${e.isPast ? ' ✓' : ''}`).join('\n');
        response = `You have ${evts.length} things today:\n\n${eventList}\n\n${upcomingEvts.length > 0 ? `Next up: ${upcomingEvts[0].title} at ${upcomingEvts[0].time}.` : 'All done for today!'} Want me to optimize your schedule?`;
      }
    }
    // Email
    else if (lower.match(/email|inbox|mail|unread|draft/)) {
      response = askedBefore('email')
        ? "Your inbox is the same — 3 unread. David Kim's email is still the most urgent one. Want me to draft a reply?"
        : "You have 3 unread emails. The most urgent is from David Kim about Q3 Deliverables — he's asking about the Friday deadline. Then Sarah's lunch confirmation and a newsletter. Want me to summarize David's?";
    }
    // Music
    else if (lower.match(/music|play|spotify|song|playlist|listen|podcast/)) {
      if (lower.includes('podcast')) {
        response = "Your subscribed podcasts have 3 new episodes. The latest 'Lex Fridman' dropped today — 2 hours on AI agents. Want me to play it?";
      } else {
        response = "Based on your listening habits, it's focus time. I'll start your Lo-Fi Focus playlist on Spotify. 142 songs, ~6 hours. 🎵";
      }
    }
    // Messages/Texts
    else if (lower.match(/message|text |sms|sarah|john|mom|reply|respond/)) {
      if (lower.includes('mom')) response = "Sure, what would you like to say to Mom? I'll draft the message for you.";
      else if (lower.includes('john')) response = "Last message from John was 2 days ago about the weekend plans. Want me to check in with him?";
      else response = "Sarah Chen's last message was 'That lunch spot sounds great! See you Tuesday 😊'. Want me to reply or send something new?";
    }
    // Stocks/Finance
    else if (lower.match(/stock|portfolio|market|aapl|nvda|tsla|invest|finance/)) {
      response = askedBefore('stock')
        ? "Market update: AAPL just hit $190.12 (+0.15% since you asked). NVDA still up 3.41%. Your total portfolio is at $24,830 — up $142 today."
        : "Your portfolio is up 1.2% today ($+142). Here's the breakdown:\n\n• AAPL: $189.84 (+1.23%)\n• NVDA: $824.18 (+3.41%)\n• TSLA: $168.29 (-0.87%)\n\nNVDA is your biggest gainer. Want a detailed report?";
    }
    // Reminders/Todo
    else if (lower.match(/remind|todo|task|remember|don't forget/)) {
      response = "Got it! I'll set that reminder for you. You currently have 3 active reminders:\n\n• Call dentist at 3 PM\n• Pick up dry cleaning tomorrow\n• Review Q3 slides by Friday\n\nAnything else to add?";
    }
    // Food/Ordering
    else if (lower.match(/order|food|coffee|lunch|dinner|eat|ubereats|delivery|hungry|restaurant/)) {
      response = lower.includes('coffee')
        ? "Your usual order from Blue Bottle — Oat Milk Latte, Medium — is $6.50. They're 5 min away with no wait. Want me to place it?"
        : "I found 3 options nearby:\n\n• Blue Bottle Coffee — 5 min walk, no wait\n• Souvla — 8 min, 4.6★, Greek bowls\n• Tartine — 12 min, 4.8★, pastries & sandwiches\n\nWant me to order ahead from any of these?";
    }
    // Fitness/Health
    else if (lower.match(/workout|steps|run|gym|health|calories|exercise|fitness/)) {
      response = "Today's health snapshot:\n\n• Steps: 4,238 (goal: 10,000)\n• Calories burned: 340\n• Active minutes: 22\n• Heart rate: 72 bpm (resting)\n\nYou usually hit the gym around 5 PM. Want me to set a reminder?";
    }
    // News
    else if (lower.match(/news|headlines|what.*happening|world/)) {
      response = "Here are today's top stories:\n\n1. 🤖 OpenAI announces new reasoning model\n2. 📈 S&P 500 hits new all-time high\n3. 🌍 Global climate summit reaches new agreement\n\nWant me to read any of these in detail?";
    }
    // Navigation/Maps
    else if (lower.match(/navigate|direction|how to get|where is|nearby|nearest|find.*near/)) {
      response = "I found a few options near you:\n\n• Starbucks — 3 min walk (4.2★)\n• Blue Bottle Coffee — 5 min walk (4.6★)\n• Philz Coffee — 8 min walk (4.7★)\n\nPhilz has the best reviews. Want directions?";
    }
    // Photos
    else if (lower.match(/photo|picture|screenshot|camera|selfie/)) {
      response = "You have 2,847 photos in your library. Your most recent ones are from yesterday — 12 photos from the team dinner. Want me to create a shared album?";
    }
    // Notes
    else if (lower.match(/note|write down|remember this|jot/)) {
      response = "Note saved! ✏️ You have 14 notes total. Your most recent ones:\n\n• Meeting ideas (today)\n• Book recommendations (2 days ago)\n• Grocery list (3 days ago)\n\nWant to open or edit any of these?";
    }
    // Timer/Alarm
    else if (lower.match(/timer|alarm|wake|set.*for|countdown/)) {
      response = lower.includes('alarm')
        ? "Alarm set for 7:30 AM tomorrow. You have no other alarms active. Sweet dreams! ⏰"
        : "Timer set for 25 minutes. I'll notify you when it's done. ⏱️";
    }
    // Calculator
    else if (lower.match(/calculate|math|how much|convert|tip|percent/)) {
      if (lower.includes('tip')) response = "15% tip on $86 is $12.90. 18% would be $15.48, and 20% would be $17.20. Total with 18% tip: $101.48.";
      else response = "I can help with that calculation! Just type out the math and I'll solve it for you.";
    }
    // Translation
    else if (lower.match(/translate|spanish|french|japanese|say.*in|chinese|korean/)) {
      if (lower.includes('japanese')) response = "\"Hello\" in Japanese is こんにちは (Konnichiwa). Want me to translate anything else?";
      else if (lower.includes('spanish')) response = "\"Hello\" in Spanish is ¡Hola! Want me to translate a full phrase?";
      else response = "I can translate to and from 40+ languages. What would you like me to translate, and to which language?";
    }
    // Booking/Travel
    else if (lower.match(/book|flight|hotel|reservation|travel|trip/)) {
      response = "I found flights to NYC for you:\n\n• United — $289 nonstop, departs 8 AM\n• Delta — $315 nonstop, departs 11 AM\n• JetBlue — $249 with 1 stop, departs 6 AM\n\nThe United flight dropped $40 since yesterday. Want me to book it?";
    }
    // Shopping
    else if (lower.match(/buy|shop|amazon|price|deal/)) {
      response = "I can help you shop. What are you looking for? I'll compare prices across Amazon, Target, and Best Buy and find you the best deal.";
    }
    // Battery
    else if (lower.match(/battery|charge|power|low battery/)) {
      response = "Battery is at 82% — about 4 hours 30 minutes remaining at current usage. You've been averaging 5.2 hours of screen time. No need to charge yet.";
    }
    // Settings
    else if (lower.match(/settings|wifi|bluetooth|brightness|dark mode|volume/)) {
      response = "I can adjust that for you. Currently: WiFi is on, Bluetooth on, brightness at 75%, volume at 60%. What would you like to change?";
    }
    // Fallback
    else {
      response = `I'm not sure about "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}", but I can help with:\n\n• 📅 Schedule & Calendar\n• 📧 Email & Messages\n• 🚗 Commute & Navigation\n• 🌤️ Weather\n• 📈 Stocks & Finance\n• 🎵 Music & Podcasts\n\nTry asking about any of these!`;
    }

    setTimeout(() => {
      const aiMsg: ChatMessage = { id: `cm-${Date.now()}`, role: 'assistant', text: response, timestamp: Date.now() };
      set({ chatMessages: [...get().chatMessages, aiMsg], isChatTyping: false });
    }, 800 + Math.random() * 1200);
  },

  advanceWorkspace: () => {
    const { workspacePhase } = get();
    if (workspacePhase === 'orchestrator') {
      set({ workspacePhase: 'executing' });
    } else if (workspacePhase === 'executing') {
      set({ workspacePhase: 'complete' });
    }
  },

  completeStep: (stepId) => {
    const steps = get().agentSteps.map((s) =>
      s.id === stepId ? { ...s, status: 'done' as const } : s
    );
    set({ agentSteps: steps });
  },

  approveAction: () => {
    const { activeScenario, memoryItems } = get();
    const newMemory = activeScenario ? getApproveMemoryItem(activeScenario) : null;
    const postPills = activeScenario ? getPostActionPills(activeScenario) : defaultPills;

    set({
      workspacePhase: 'complete',
      memoryItems: newMemory ? [newMemory, ...memoryItems] : memoryItems,
      contextPills: postPills,
    });
  },

  openAppWithSuggestions: (appName, suggestions) => {
    set({
      activeScreen: 'app',
      isWorkspaceOpen: false,
      activeAppName: appName,
      activeAppSuggestions: suggestions,
      inputValue: '',
      showSuggestions: false,
    });
  },
}));
