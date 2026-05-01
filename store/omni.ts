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

export const GLOBAL_APP_SUGGESTIONS: Record<string, string[]> = {
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
  'Omni': ['Hey Omni!', "What's my schedule?", 'Check my email', "How's the weather?"],
  'Agent': ['Book a flight to NYC', 'Book an Uber to the airport', 'Book a table for dinner', 'Order my usual coffee', 'How is my portfolio doing?', 'Find a hotel in Paris'],
};

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
  matchedApps: AppItem[];
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
  homeResetTrigger: number;

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
  // Navigation / Maps — check BEFORE commute so distance/direction queries about airports don't trigger commute
  if (lower.includes('navigate') || lower.includes('direction') || lower.includes('nearest') || lower.includes('where is') || lower.includes('map') || lower.includes('nearby') || lower.includes('find near') || lower.includes('walk to') || lower.includes('how do i get') || lower.includes('how far') || lower.includes('downtown') || lower.includes('distance') || lower.includes('route to') || lower.includes('way to')) return 'navigation';
  // Commute / transport (booking rides, catching flights, transit)
  if (lower.includes('airport') || lower.includes('commute') || lower.includes('get me to') || lower.includes('uber') || lower.includes('bart') || lower.includes('drive me') || lower.includes('traffic')) return 'commute';
  // Relationship / messaging / phone
  if (lower.includes('sarah') || lower.includes('dinner') || lower.includes('tell ') || lower.includes('message') || lower.includes('text ') || lower.includes('texts') || lower.includes('call') || lower.includes('dial') || lower.includes('contact')) return 'relationship';
  // Email
  if (lower.includes('email') || lower.includes('boss') || lower.includes('summarize') || lower.includes('draft') || lower.includes('inbox') || lower.includes('mail') || lower.includes('reply') || lower.includes('unread') || lower.includes('follow-up')) return 'email';
  // Schedule / calendar
  if (lower.includes('calendar') || lower.includes('schedule') || lower.includes('meeting') || lower.includes('agenda') || lower.includes('free slot') || lower.includes('block off') || lower.includes('block time') || lower.includes('lunch hour')) return 'schedule';
  // Order / food
  if (lower.includes('order') || lower.includes('grocery') || lower.includes('food') || lower.includes('coffee') || lower.includes('deliver') || lower.includes('restaurant') || lower.includes('buy')) return 'order';
  // Finance
  if (lower.includes('stock') || lower.includes('portfolio') || lower.includes('invest') || lower.includes('market') || lower.includes('aapl') || lower.includes('wallet') || lower.includes('balance') || lower.includes('card') || lower.includes('pay') || lower.includes('transaction')) return 'finance';
  // Travel (standalone keyword — catch remaining flight/hotel/trip mentions)
  if (lower.includes('flight') || lower.includes('hotel') || lower.includes('reservation') || lower.includes('travel') || lower.includes('trip')) return 'travel';
  // General catch-all for misc app commands
  if (lower.includes('photo') || lower.includes('camera') || lower.includes('music') || lower.includes('play') || lower.includes('podcast') || lower.includes('listen') || lower.includes('news') || lower.includes('book') || lower.includes('read') || lower.includes('note') || lower.includes('file') || lower.includes('weather') || lower.includes('translate') || lower.includes('step') || lower.includes('health') || lower.includes('fitness') || lower.includes('run') || lower.includes('safari') || lower.includes('scan') || lower.includes('selfie') || lower.includes('video') || lower.includes('search') || lower.includes('bookmark') || lower.includes('trending') || lower.includes('movie') || lower.includes('showtime') || lower.includes('vacation') || lower.includes('collage') || lower.includes('lo-fi') || lower.includes('album') || lower.includes('drake') || lower.includes('headline') || lower.includes('novel') || lower.includes('remind') || lower.includes('download') || lower.includes('presentation') || lower.includes('document') || lower.includes('clock') || lower.includes('timer') || lower.includes('alarm') || lower.includes('time is') || lower.includes('stopwatch') || lower.includes('calculate') || lower.includes('tip') || lower.includes('convert') || lower.includes('split') || lower.includes('mortgage') || lower.includes('rain') || lower.includes('forecast') || lower.includes('japanese') || lower.includes('french') || lower.includes('spanish') || lower.includes('sleep') || lower.includes('weight') || lower.includes('workout') || lower.includes('goal')) return 'general';
  return null;
}

function getSuggestions(input: string, max: number = 5): string[] {
  const lower = input.toLowerCase().trim();
  if (!lower) return [];

  const allSuggestions = Object.values(GLOBAL_APP_SUGGESTIONS).flat();
  
  // Sort matches to prioritize ones that start with the input
  const matches = allSuggestions.filter(s => s.toLowerCase().includes(lower)).sort((a, b) => {
    const aStarts = a.toLowerCase().startsWith(lower);
    const bStarts = b.toLowerCase().startsWith(lower);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });

  return Array.from(new Set(matches)).slice(0, max);
}

function getScenarioData(scenario: ScenarioId, command: string = '') {
  const lower = command.toLowerCase();
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
    case 'relationship': {
      // Prompt-aware: Messages and Phone queries
      if (lower.includes('dinner') || lower.includes('sarah')) {
        return {
          steps: [
            { id: 's1', label: 'Draft cancellation text', status: 'pending' as const },
            { id: 's2', label: 'Check calendar for next week', status: 'pending' as const },
            { id: 's3', label: 'Propose alternate time', status: 'pending' as const },
            { id: 's4', label: 'Suggest highly-rated restaurant', status: 'pending' as const },
          ],
          message: "I'll draft a polite cancellation for dinner tonight, find an open lunch slot next week, and suggest a restaurant.",
          pills: getRelationshipScenarioPills(),
        };
      }
      if (lower.includes('mom') && (lower.includes('message') || lower.includes('text'))) {
        return {
          steps: [
            { id: 's1', label: 'Find Mom in contacts', status: 'pending' as const },
            { id: 's2', label: 'Open new iMessage draft', status: 'pending' as const },
            { id: 's3', label: 'Listen for dictation', status: 'pending' as const },
            { id: 's4', label: 'Send message', status: 'pending' as const },
          ],
          message: "I'm ready. What would you like to say to Mom?",
          pills: getRelationshipScenarioPills(),
        };
      }
      if (lower.includes('john') || lower.includes('birthday')) {
        return {
          steps: [
            { id: 's1', label: 'Find John in contacts', status: 'pending' as const },
            { id: 's2', label: 'Generate happy birthday message', status: 'pending' as const },
            { id: 's3', label: 'Add celebratory emoji', status: 'pending' as const },
            { id: 's4', label: 'Prepare for approval', status: 'pending' as const },
          ],
          message: "I've drafted a fun happy birthday message for John.",
          pills: getRelationshipScenarioPills(),
        };
      }
      if (lower.includes('texts') || lower.includes('read')) {
        return {
          steps: [
            { id: 's1', label: 'Retrieve recent messages', status: 'pending' as const },
            { id: 's2', label: 'Identify unread conversations', status: 'pending' as const },
            { id: 's3', label: 'Summarize text threads', status: 'pending' as const },
            { id: 's4', label: 'Prepare quick replies', status: 'pending' as const },
          ],
          message: "I'll pull up your latest unread texts and summarize them for you.",
          pills: getRelationshipScenarioPills(),
        };
      }
      if (lower.includes('mom') && lower.includes('call')) {
        return {
          steps: [
            { id: 's1', label: 'Find Mom in contacts', status: 'pending' as const },
            { id: 's2', label: 'Check current cellular signal', status: 'pending' as const },
            { id: 's3', label: 'Initiate FaceTime Audio', status: 'pending' as const },
            { id: 's4', label: 'Connect call', status: 'pending' as const },
          ],
          message: "Calling Mom on FaceTime Audio...",
          pills: getRelationshipScenarioPills(),
        };
      }
      if (lower.includes('recent') || lower.includes('missed')) {
        return {
          steps: [
            { id: 's1', label: 'Access phone app history', status: 'pending' as const },
            { id: 's2', label: 'Identify recent or missed calls', status: 'pending' as const },
            { id: 's3', label: 'Display call log', status: 'pending' as const },
            { id: 's4', label: 'Wait for callback selection', status: 'pending' as const },
          ],
          message: "Here are your recent missed calls. Who would you like to call back?",
          pills: getRelationshipScenarioPills(),
        };
      }
      if (lower.includes('pizza') || lower.includes('nearest')) {
        return {
          steps: [
            { id: 's1', label: 'Search Maps for nearby pizza', status: 'pending' as const },
            { id: 's2', label: 'Extract highest-rated option', status: 'pending' as const },
            { id: 's3', label: 'Retrieve phone number', status: 'pending' as const },
            { id: 's4', label: 'Initiate call', status: 'pending' as const },
          ],
          message: "I found Tony's Pizza nearby. Calling them now...",
          pills: getRelationshipScenarioPills(),
        };
      }
      return {
        steps: [
          { id: 's1', label: 'Identify contact', status: 'pending' as const },
          { id: 's2', label: 'Determine communication method', status: 'pending' as const },
          { id: 's3', label: 'Draft or initiate action', status: 'pending' as const },
          { id: 's4', label: 'Complete request', status: 'pending' as const },
        ],
        message: "I'll handle that communication for you.",
        pills: getRelationshipScenarioPills(),
      };
    }
    case 'email': {
      // Prompt-aware: different steps & messages for each Mail query
      if (lower.includes('boss') || lower.includes('summarize')) {
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
      }
      if (lower.includes('draft') || lower.includes('follow-up')) {
        return {
          steps: [
            { id: 's1', label: 'Identify recent correspondence', status: 'pending' as const },
            { id: 's2', label: 'Determine missing action items', status: 'pending' as const },
            { id: 's3', label: 'Draft follow-up email', status: 'pending' as const },
            { id: 's4', label: 'Review tone and clarity', status: 'pending' as const },
          ],
          message: "I'll check who you need to follow up with and draft a polite email checking in on their progress.",
          pills: getEmailScenarioPills(),
        };
      }
      if (lower.includes('unread') || lower.includes('check')) {
        return {
          steps: [
            { id: 's1', label: 'Scan inbox for unread messages', status: 'pending' as const },
            { id: 's2', label: 'Filter out newsletters & spam', status: 'pending' as const },
            { id: 's3', label: 'Identify high-priority senders', status: 'pending' as const },
            { id: 's4', label: 'Summarize unread inbox', status: 'pending' as const },
          ],
          message: "I'll scan your inbox, filter out the noise, and show you only the important unread messages.",
          pills: getEmailScenarioPills(),
        };
      }
      if (lower.includes('reply') || lower.includes('latest')) {
        return {
          steps: [
            { id: 's1', label: 'Fetch latest received email', status: 'pending' as const },
            { id: 's2', label: 'Analyze context and tone', status: 'pending' as const },
            { id: 's3', label: 'Draft context-aware reply', status: 'pending' as const },
            { id: 's4', label: 'Prepare for your review', status: 'pending' as const },
          ],
          message: "I'll look at the latest email you received and draft a contextually appropriate reply.",
          pills: getEmailScenarioPills(),
        };
      }
      // Fallback email
      return {
        steps: [
          { id: 's1', label: "Retrieve and analyze email", status: 'pending' as const },
          { id: 's2', label: 'Extract key points', status: 'pending' as const },
          { id: 's3', label: 'Generate summary', status: 'pending' as const },
          { id: 's4', label: 'Draft response', status: 'pending' as const },
        ],
        message: "I'll review the email and prepare a response.",
        pills: getEmailScenarioPills(),
      };
    }
    case 'schedule': {
      // Prompt-aware: different steps & messages for each Calendar query
      if (lower.includes('what') && lower.includes('calendar') || lower.includes('today')) {
        return {
          steps: [
            { id: 's1', label: 'Pull today\'s calendar events', status: 'pending' as const },
            { id: 's2', label: 'Check which events are done', status: 'pending' as const },
            { id: 's3', label: 'Identify upcoming commitments', status: 'pending' as const },
            { id: 's4', label: 'Prepare today\'s schedule overview', status: 'pending' as const },
          ],
          message: "I'll pull your full calendar for today, check what's done, and give you a clear rundown of what's ahead.",
          pills: getScheduleScenarioPills(),
        };
      }
      if (lower.includes('schedule') && lower.includes('meeting') || lower.includes('schedule a')) {
        return {
          steps: [
            { id: 's1', label: 'Check calendar for conflicts', status: 'pending' as const },
            { id: 's2', label: 'Find available time slots', status: 'pending' as const },
            { id: 's3', label: 'Create meeting event', status: 'pending' as const },
            { id: 's4', label: 'Send calendar invite', status: 'pending' as const },
          ],
          message: "I'll check for conflicts, find the right slot, create the meeting, and send out invites.",
          pills: getScheduleScenarioPills(),
        };
      }
      if (lower.includes('free') || lower.includes('next free') || lower.includes('available')) {
        return {
          steps: [
            { id: 's1', label: 'Scan all events & commitments', status: 'pending' as const },
            { id: 's2', label: 'Map out busy vs. free time', status: 'pending' as const },
            { id: 's3', label: 'Identify largest open blocks', status: 'pending' as const },
            { id: 's4', label: 'Present free slot options', status: 'pending' as const },
          ],
          message: "I'll scan your entire calendar and find your next available free slot.",
          pills: getScheduleScenarioPills(),
        };
      }
      if (lower.includes('block') || lower.includes('lunch')) {
        return {
          steps: [
            { id: 's1', label: 'Check lunch hour availability', status: 'pending' as const },
            { id: 's2', label: 'Verify no conflicts at 12-1 PM', status: 'pending' as const },
            { id: 's3', label: 'Create "Lunch" calendar block', status: 'pending' as const },
            { id: 's4', label: 'Set auto-decline for new invites', status: 'pending' as const },
          ],
          message: "I'll block off your lunch hour, check for conflicts, and auto-decline any overlapping invites.",
          pills: getScheduleScenarioPills(),
        };
      }
      // Fallback schedule
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
    }
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
    case 'finance': {
      if (lower.includes('wallet') || lower.includes('balance') || lower.includes('card') || lower.includes('pay') || lower.includes('transaction')) {
        return {
          steps: [
            { id: 's1', label: 'Authenticate Apple Wallet', status: 'pending' as const },
            { id: 's2', label: 'Retrieve payment methods', status: 'pending' as const },
            { id: 's3', label: 'Fetch recent transactions', status: 'pending' as const },
            { id: 's4', label: 'Prepare payment/balance UI', status: 'pending' as const },
          ],
          message: "Opening Apple Wallet...",
          pills: getFinanceScenarioPills(),
        };
      }
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
    }
    case 'navigation': {
      // Prompt-aware: different steps & messages for each Maps query
      if (lower.includes('downtown')) {
        return {
          steps: [
            { id: 's1', label: 'Locate Downtown SF from your position', status: 'pending' as const },
            { id: 's2', label: 'Compare walking, transit & driving', status: 'pending' as const },
            { id: 's3', label: 'Calculate fastest route', status: 'pending' as const },
            { id: 's4', label: 'Prepare turn-by-turn directions', status: 'pending' as const },
          ],
          message: "I'll find the quickest way to get you to Downtown SF and compare your transport options.",
          pills: getNavigationScenarioPills(),
        };
      }
      if (lower.includes('coffee') || lower.includes('nearest')) {
        return {
          steps: [
            { id: 's1', label: 'Search coffee shops near you', status: 'pending' as const },
            { id: 's2', label: 'Compare ratings & walking distance', status: 'pending' as const },
            { id: 's3', label: 'Rank by best overall match', status: 'pending' as const },
            { id: 's4', label: 'Prepare directions to top pick', status: 'pending' as const },
          ],
          message: "I'll scan for coffee shops nearby, compare ratings and distance, and recommend the best option.",
          pills: getNavigationScenarioPills(),
        };
      }
      if (lower.includes('work') || lower.includes('office') || lower.includes('directions to')) {
        return {
          steps: [
            { id: 's1', label: 'Look up your saved work address', status: 'pending' as const },
            { id: 's2', label: 'Check live traffic conditions', status: 'pending' as const },
            { id: 's3', label: 'Compare driving, transit & biking', status: 'pending' as const },
            { id: 's4', label: 'Generate optimal route', status: 'pending' as const },
          ],
          message: "I'll check traffic and find the best route to your office right now.",
          pills: getNavigationScenarioPills(),
        };
      }
      if (lower.includes('airport') || lower.includes('how far')) {
        return {
          steps: [
            { id: 's1', label: 'Identify nearest airport (SFO)', status: 'pending' as const },
            { id: 's2', label: 'Calculate distance from your location', status: 'pending' as const },
            { id: 's3', label: 'Estimate travel time by each mode', status: 'pending' as const },
            { id: 's4', label: 'Summarize distance & options', status: 'pending' as const },
          ],
          message: "I'll calculate the distance to SFO Airport and show you how long it takes by car, BART, and rideshare.",
          pills: getNavigationScenarioPills(),
        };
      }
      // Fallback navigation
      return {
        steps: [
          { id: 's1', label: 'Look up destination & current location', status: 'pending' as const },
          { id: 's2', label: 'Calculate distance & travel time', status: 'pending' as const },
          { id: 's3', label: 'Find optimal route & transport mode', status: 'pending' as const },
          { id: 's4', label: 'Start turn-by-turn navigation', status: 'pending' as const },
        ],
        message: "I'll pinpoint the destination, calculate the best route, and start navigation for you.",
        pills: getNavigationScenarioPills(),
      };
    }
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
    case 'general': {
      // Prompt-aware: Camera and Safari queries
      if (lower.includes('take a photo') || lower.includes('selfie') || lower.includes('video') || lower.includes('scan') || lower.includes('camera')) {
        let action = 'Take a photo';
        if (lower.includes('selfie')) action = 'Take a selfie';
        if (lower.includes('video')) action = 'Record a video';
        if (lower.includes('scan')) action = 'Scan a document';
        return {
          steps: [
            { id: 's1', label: 'Open Camera app', status: 'pending' as const },
            { id: 's2', label: 'Set appropriate mode', status: 'pending' as const },
            { id: 's3', label: 'Adjust exposure and focus', status: 'pending' as const },
            { id: 's4', label: 'Capture media', status: 'pending' as const },
          ],
          message: `Opening Camera to ${action.toLowerCase()}...`,
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('search') || lower.includes('bookmark') || lower.includes('trending') || lower.includes('movie') || lower.includes('safari') || lower.includes('web')) {
        let message = "Opening Safari...";
        if (lower.includes('restaurant')) message = "Searching Safari for the best restaurants nearby...";
        if (lower.includes('bookmark')) message = "Opening your Safari bookmarks...";
        if (lower.includes('trending')) message = "Pulling up trending searches in Safari...";
        if (lower.includes('movie')) message = "Looking up movie showtimes in Safari...";
        return {
          steps: [
            { id: 's1', label: 'Open Safari browser', status: 'pending' as const },
            { id: 's2', label: 'Execute search query', status: 'pending' as const },
            { id: 's3', label: 'Analyze top results', status: 'pending' as const },
            { id: 's4', label: 'Display web page', status: 'pending' as const },
          ],
          message: message,
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('photos') || lower.includes('vacation') || lower.includes('collage') || lower.includes('gallery')) {
        return {
          steps: [
            { id: 's1', label: 'Search Photos library', status: 'pending' as const },
            { id: 's2', label: 'Filter by query context', status: 'pending' as const },
            { id: 's3', label: 'Process image selection', status: 'pending' as const },
            { id: 's4', label: 'Display photo gallery', status: 'pending' as const },
          ],
          message: "Opening Photos...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('music') || lower.includes('play') || lower.includes('lo-fi') || lower.includes('liked') || lower.includes('album') || lower.includes('drake')) {
        return {
          steps: [
            { id: 's1', label: 'Open Music app', status: 'pending' as const },
            { id: 's2', label: 'Retrieve requested track/playlist', status: 'pending' as const },
            { id: 's3', label: 'Queue audio stream', status: 'pending' as const },
            { id: 's4', label: 'Start playback', status: 'pending' as const },
          ],
          message: "Getting your music ready...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('podcast')) {
        return {
          steps: [
            { id: 's1', label: 'Open Podcasts app', status: 'pending' as const },
            { id: 's2', label: 'Find requested episode', status: 'pending' as const },
            { id: 's3', label: 'Sync playback position', status: 'pending' as const },
            { id: 's4', label: 'Start podcast', status: 'pending' as const },
          ],
          message: "Pulling up your podcast...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('news') || lower.includes('headline')) {
        return {
          steps: [
            { id: 's1', label: 'Aggregate latest headlines', status: 'pending' as const },
            { id: 's2', label: 'Filter by personal interests', status: 'pending' as const },
            { id: 's3', label: 'Summarize top stories', status: 'pending' as const },
            { id: 's4', label: 'Display News feed', status: 'pending' as const },
          ],
          message: "Checking the latest news...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('book') || lower.includes('read') || lower.includes('novel')) {
        return {
          steps: [
            { id: 's1', label: 'Access Books library', status: 'pending' as const },
            { id: 's2', label: 'Locate requested title', status: 'pending' as const },
            { id: 's3', label: 'Sync reading progress', status: 'pending' as const },
            { id: 's4', label: 'Open book', status: 'pending' as const },
          ],
          message: "Opening your book...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('note') || lower.includes('ideas list')) {
        return {
          steps: [
            { id: 's1', label: 'Open Notes app', status: 'pending' as const },
            { id: 's2', label: 'Search existing notes or create new', status: 'pending' as const },
            { id: 's3', label: 'Draft content', status: 'pending' as const },
            { id: 's4', label: 'Save note', status: 'pending' as const },
          ],
          message: "Getting your notes ready...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('remind')) {
        return {
          steps: [
            { id: 's1', label: 'Parse reminder trigger & time', status: 'pending' as const },
            { id: 's2', label: 'Create new reminder entry', status: 'pending' as const },
            { id: 's3', label: 'Set notification alert', status: 'pending' as const },
            { id: 's4', label: 'Save to Reminders', status: 'pending' as const },
          ],
          message: "Managing your reminders...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('file') || lower.includes('report') || lower.includes('download') || lower.includes('presentation') || lower.includes('document')) {
        return {
          steps: [
            { id: 's1', label: 'Search file system', status: 'pending' as const },
            { id: 's2', label: 'Filter by file type & date', status: 'pending' as const },
            { id: 's3', label: 'Locate target document', status: 'pending' as const },
            { id: 's4', label: 'Display file preview', status: 'pending' as const },
          ],
          message: "Searching for your files...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('weather') || lower.includes('rain') || lower.includes('forecast')) {
        return {
          steps: [
            { id: 's1', label: 'Get current location', status: 'pending' as const },
            { id: 's2', label: 'Fetch meteorological data', status: 'pending' as const },
            { id: 's3', label: 'Analyze forecast patterns', status: 'pending' as const },
            { id: 's4', label: 'Generate weather summary', status: 'pending' as const },
          ],
          message: "Checking the weather...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('clock') || lower.includes('timer') || lower.includes('alarm') || lower.includes('time is') || lower.includes('stopwatch')) {
        return {
          steps: [
            { id: 's1', label: 'Open Clock app', status: 'pending' as const },
            { id: 's2', label: 'Parse time request', status: 'pending' as const },
            { id: 's3', label: 'Configure timer/alarm', status: 'pending' as const },
            { id: 's4', label: 'Start clock function', status: 'pending' as const },
          ],
          message: "Setting that up in Clock...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('calculate') || lower.includes('tip') || lower.includes('convert') || lower.includes('split') || lower.includes('mortgage')) {
        return {
          steps: [
            { id: 's1', label: 'Parse mathematical expression', status: 'pending' as const },
            { id: 's2', label: 'Apply required formulas', status: 'pending' as const },
            { id: 's3', label: 'Compute exact result', status: 'pending' as const },
            { id: 's4', label: 'Format calculation', status: 'pending' as const },
          ],
          message: "Calculating that for you...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('translate') || lower.includes('japanese') || lower.includes('french') || lower.includes('spanish')) {
        return {
          steps: [
            { id: 's1', label: 'Identify source text & language', status: 'pending' as const },
            { id: 's2', label: 'Process translation model', status: 'pending' as const },
            { id: 's3', label: 'Generate translated output', status: 'pending' as const },
            { id: 's4', label: 'Format for text-to-speech', status: 'pending' as const },
          ],
          message: "Translating...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('health') || lower.includes('sleep') || lower.includes('weight')) {
        return {
          steps: [
            { id: 's1', label: 'Access HealthKit data', status: 'pending' as const },
            { id: 's2', label: 'Compile requested metrics', status: 'pending' as const },
            { id: 's3', label: 'Generate trend analysis', status: 'pending' as const },
            { id: 's4', label: 'Format health summary', status: 'pending' as const },
          ],
          message: "Pulling your health data...",
          pills: getTimeAwareContextPills(),
        };
      }
      if (lower.includes('fitness') || lower.includes('run') || lower.includes('workout') || lower.includes('goal')) {
        return {
          steps: [
            { id: 's1', label: 'Open Fitness app', status: 'pending' as const },
            { id: 's2', label: 'Sync Apple Watch activity', status: 'pending' as const },
            { id: 's3', label: 'Configure workout type', status: 'pending' as const },
            { id: 's4', label: 'Log or start session', status: 'pending' as const },
          ],
          message: "Setting up your fitness request...",
          pills: getTimeAwareContextPills(),
        };
      }
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
    }
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
  { id: 'a25', name: 'Omni', icon: '✨', color: '#8B5CF6', category: 'Productivity' },
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
  matchedApps: [],
  activeAppName: '',
  activeAppSuggestions: [],
  proactiveCards: defaultProactiveCards,
  chatMessages: [],
  isChatTyping: false,
  apps: defaultApps,
  homeResetTrigger: 0,

  // Computed
  get isHomeScreen() { return get().activeScreen === 'home'; },

  // Lock screen
  unlock: () => set({ isLocked: false, activeScreen: 'home' }),
  lock: () => set({ isLocked: true, activeScreen: 'lock', isControlCenterOpen: false, isNotificationCenterOpen: false, isMemoryFeedOpen: false }),

  setInputValue: (value) => {
    const trimmed = value.trim().toLowerCase();
    let matchedApps = trimmed.length > 0 
      ? get().apps.filter(app => app.name.toLowerCase().includes(trimmed)).sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(trimmed);
          const bStarts = b.name.toLowerCase().startsWith(trimmed);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
        })
      : [];
      
    // Max 2 apps to leave room for text suggestions
    matchedApps = matchedApps.slice(0, 2);
    
    // Max 5 items total between apps and text suggestions
    const maxSuggestions = 5 - matchedApps.length;
    const suggestions = getSuggestions(value, maxSuggestions);

    set({ 
      inputValue: value, 
      suggestions, 
      matchedApps,
      showSuggestions: (suggestions.length > 0 || matchedApps.length > 0) && trimmed.length > 0 
    });
  },

  submitCommand: (command) => {
    if (command.toLowerCase().includes('hey omni') || command.toLowerCase() === 'hi omni') {
      set({ activeScreen: 'chat', isWorkspaceOpen: false });
      get().sendChatMessage(command);
      return;
    }

    const scenario = matchScenario(command);
    const effectiveScenario = scenario || 'general';
    const data = getScenarioData(effectiveScenario, command);
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
      matchedApps: [],
    });
  },

  goHome: () => {
    set({
      activeScreen: 'home',
      homeResetTrigger: get().homeResetTrigger + 1,
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
    const { activeScenario, memoryItems, userPrompt } = get();
    const newMemory = activeScenario ? getApproveMemoryItem(activeScenario, new Date(), userPrompt) : null;
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
