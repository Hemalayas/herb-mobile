import { create } from 'zustand';
import { Session, Badge, TBreak, UserSettings } from '../types';
import {
  addSession as dbAddSession,
  getSessions,
  getTodaySessionCount,
  addTBreak,
  getActiveTBreak,
  completeTBreak as dbCompleteTBreak,
  getTBreaks,
} from '../services/database';
import { calculateBadgeProgress } from '../utils/badges';
import { loadSettings, saveSettings, getShownBadges } from '../services/storage';

interface AppStore {
  // Sessions
  sessions: Session[];
  todayCount: number;
  
  // Badges
  badges: Badge[];
  newlyUnlockedBadges: string[];
  
  // T-Breaks
  activeTBreak: TBreak | null;
  tbreaks: TBreak[];
  
  // Settings
  settings: UserSettings;
  
  // Recovery Mode
  isRecoveryMode: boolean;
  sobrietyStartDate: number | null;
  
  // Actions
  addSession: (session: Omit<Session, 'id'>) => Promise<void>;
  loadSessions: () => Promise<void>;
  refreshStats: () => Promise<void>;
  
  loadBadges: () => Promise<void>;
  clearUnlockedBadge: (badgeId: string) => void;
  
  startTBreak: (goalDays: number) => Promise<void>;
  completeTBreak: () => Promise<void>;
  loadTBreaks: () => Promise<void>;
  
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  
  enterRecoveryMode: () => void;
  exitRecoveryMode: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial State
  sessions: [],
  todayCount: 0,
  badges: [],
  newlyUnlockedBadges: [],
  activeTBreak: null,
  tbreaks: [],
  settings: {
    notificationsEnabled: true,
    theme: 'light',
  },
  isRecoveryMode: false,
  sobrietyStartDate: null,

  // Session Actions
  addSession: async (sessionData) => {
    const session: Session = {
      ...sessionData,
      id: Date.now().toString(),
    };
    
    await dbAddSession(session);
    
    // Reload data
    await get().loadSessions();
    await get().refreshStats();
    await get().loadBadges();
  },

  loadSessions: async () => {
    const sessions = await getSessions();
    set({ sessions });
  },

  refreshStats: async () => {
    const todayCount = await getTodaySessionCount();
    set({ todayCount });
  },

  // Badge Actions
  loadBadges: async () => {
    const { sessions, tbreaks, badges: oldBadges } = get();
    const newBadges = calculateBadgeProgress(sessions, tbreaks);

    // Get badges that have already been shown to the user
    const shownBadges = await getShownBadges();

    // Find newly unlocked badges that haven't been shown yet
    const newlyUnlocked = newBadges
      .filter(badge => {
        // Badge must be unlocked
        if (!badge.unlockedAt) return false;

        // Badge must not have been shown before
        if (shownBadges.has(badge.id)) return false;

        // Badge must be newly unlocked (wasn't unlocked in oldBadges)
        const wasUnlockedBefore = oldBadges.find(old => old.id === badge.id && old.unlockedAt);
        return !wasUnlockedBefore;
      })
      .map(badge => badge.id);

    set({
      badges: newBadges,
      newlyUnlockedBadges: [...get().newlyUnlockedBadges, ...newlyUnlocked],
    });
  },

  clearUnlockedBadge: (badgeId: string) => {
    set({
      newlyUnlockedBadges: get().newlyUnlockedBadges.filter(id => id !== badgeId),
    });
  },

  // T-Break Actions
  startTBreak: async (goalDays: number) => {
    const tbreak: TBreak = {
      id: Date.now().toString(),
      startDate: Date.now(),
      goalDays,
      completed: false,
    };
    
    await addTBreak(tbreak);
    set({ activeTBreak: tbreak });
    await get().loadTBreaks();
  },

  completeTBreak: async () => {
    const { activeTBreak } = get();
    if (!activeTBreak) return;

    await dbCompleteTBreak(activeTBreak.id);
    
    // Update local state
    await get().loadTBreaks();
    set({ activeTBreak: null });
    
    // Reload badges
    await get().loadBadges();
  },

  loadTBreaks: async () => {
    const tbreaks = await getTBreaks();
    const activeTBreak = await getActiveTBreak();
    set({ tbreaks, activeTBreak });
  },

  // Settings Actions
  loadSettings: async () => {
    const settings = await loadSettings();
    set({ settings });
  },

  updateSettings: async (newSettings) => {
    const currentSettings = get().settings;
    const updatedSettings = { ...currentSettings, ...newSettings };
    await saveSettings(updatedSettings);
    set({ settings: updatedSettings });
  },

  // Recovery Mode
  enterRecoveryMode: () => {
    set({
      isRecoveryMode: true,
      sobrietyStartDate: Date.now(),
    });
  },

  exitRecoveryMode: () => {
    set({
      isRecoveryMode: false,
      sobrietyStartDate: null,
    });
  },
}));