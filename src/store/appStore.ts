import { create } from 'zustand';
import { Session, Badge, TBreak, UserSettings, MoodEntry } from '../types';
import {
  addSession as dbAddSession,
  getSessions,
  getTodaySessionCount,
  addTBreak,
  getActiveTBreak,
  completeTBreak as dbCompleteTBreak,
  getTBreaks,
  deleteSession as dbDeleteSession,
  markTBreakSlipUp as dbMarkTBreakSlipUp,
  cancelTBreak as dbCancelTBreak,
  addMoodEntry as dbAddMoodEntry,
  getMoodEntries,
  deleteMoodEntry as dbDeleteMoodEntry,
  getTodaysMoodEntries,
} from '../services/database';
import {
  calculateBadgeProgress
} from '../utils/badges';
import {
  loadSettings as storageLoadSettings,
  saveSettings,
  getShownBadges,
  saveRecoveryMode,
  loadRecoveryMode,
} from '../services/storage';

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

  // Mood Tracking
  moodEntries: MoodEntry[];
  todaysMoodCount: number;

  // Actions
  addSession: (session: Omit<Session, 'id'>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  refreshStats: () => Promise<void>;

  loadBadges: () => Promise<void>;
  clearUnlockedBadge: (badgeId: string) => void;

  startTBreak: (goalDays: number) => Promise<void>;
  completeTBreak: () => Promise<void>;
  loadTBreaks: () => Promise<void>;
  markSlipUp: () => Promise<void>;
  cancelTBreak: () => Promise<void>;

  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;

  loadRecoveryMode: () => Promise<void>;
  enterRecoveryMode: () => Promise<void>;
  exitRecoveryMode: () => Promise<void>;

  // Mood Actions
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => Promise<void>;
  loadMoodEntries: () => Promise<void>;
  deleteMoodEntry: (id: string) => Promise<void>;
}

const defaultSettings: UserSettings = {
  notificationsEnabled: true,
  theme: 'light',
  currency: 'USD',
};

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial State
  sessions: [],
  todayCount: 0,
  badges: [],
  newlyUnlockedBadges: [],
  moodEntries: [],
  todaysMoodCount: 0,
  activeTBreak: null,
  tbreaks: [],
  settings: defaultSettings,
  isRecoveryMode: false,
  sobrietyStartDate: null,

  // Session Actions
  addSession: async (sessionData) => {
    const session: Session = {
      ...sessionData,
      id: Date.now().toString(),
    };

    await dbAddSession(session);

    await get().loadSessions();
    await get().refreshStats();
    await get().loadBadges();
  },

  deleteSession: async (id: string) => {
    await dbDeleteSession(id);
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
    const {
      sessions,
      tbreaks,
      badges: oldBadges,
      settings,
      isRecoveryMode,
      sobrietyStartDate,
    } = get();

    const newBadges = calculateBadgeProgress(
      sessions,
      tbreaks,
      settings,
      { isRecoveryMode, sobrietyStartDate },
    );

    const shownBadges = await getShownBadges();

    const newlyUnlocked = newBadges
      .filter((badge) => {
        if (!badge.unlockedAt) return false;
        if (shownBadges.has(badge.id)) return false;

        const wasUnlockedBefore = oldBadges.find(
          (old) => old.id === badge.id && old.unlockedAt,
        );
        return !wasUnlockedBefore;
      })
      .map((badge) => badge.id);

    set({
      badges: newBadges,
      newlyUnlockedBadges: [...get().newlyUnlockedBadges, ...newlyUnlocked],
    });
  },

  clearUnlockedBadge: (badgeId: string) => {
    set({
      newlyUnlockedBadges: get().newlyUnlockedBadges.filter(
        (id) => id !== badgeId,
      ),
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

    await get().loadTBreaks();
    set({ activeTBreak: null });
    await get().loadBadges();
  },

  loadTBreaks: async () => {
    const tbreaks = await getTBreaks();
    const activeTBreak = await getActiveTBreak();
    set({ tbreaks, activeTBreak });
  },

  markSlipUp: async () => {
    const { activeTBreak } = get();
    if (!activeTBreak) return;

    await dbMarkTBreakSlipUp(activeTBreak.id);
    await get().loadTBreaks();
  },

  cancelTBreak: async () => {
    const { activeTBreak } = get();
    if (!activeTBreak) return;

    await dbCancelTBreak(activeTBreak.id);
    set({ activeTBreak: null });
    await get().loadTBreaks();
  },

  // Settings Actions
  loadSettings: async () => {
    const loaded = await storageLoadSettings();

    // Merge with defaults so old installs get a currency + core fields
    const merged: UserSettings = {
      ...defaultSettings,
      ...(loaded || {}),
    };

    set({ settings: merged });
  },

  updateSettings: async (newSettings) => {
    const currentSettings = get().settings;
    const updatedSettings: UserSettings = {
      ...defaultSettings,
      ...currentSettings,
      ...newSettings,
    };
    await saveSettings(updatedSettings);
    set({ settings: updatedSettings });
  },

  // Recovery Mode
  loadRecoveryMode: async () => {
    const recoveryData = await loadRecoveryMode();
    set({
      isRecoveryMode: recoveryData.isRecoveryMode,
      sobrietyStartDate: recoveryData.sobrietyStartDate,
    });
  },

  enterRecoveryMode: async () => {
    const startDate = Date.now();

    set({
      isRecoveryMode: true,
      sobrietyStartDate: startDate,
    });

    await saveRecoveryMode(true, startDate);
    await get().loadBadges();
  },

  exitRecoveryMode: async () => {
    set({
      isRecoveryMode: false,
      sobrietyStartDate: null,
    });

    await saveRecoveryMode(false, null);
    await get().loadBadges();
  },

  // Mood Tracking Actions
  addMoodEntry: async (entry) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    dbAddMoodEntry(newEntry);

    // Reload mood entries to update state
    await get().loadMoodEntries();
  },

  loadMoodEntries: async () => {
    const entries = getMoodEntries();
    const todaysEntries = getTodaysMoodEntries();

    set({
      moodEntries: entries,
      todaysMoodCount: todaysEntries.length,
    });
  },

  deleteMoodEntry: async (id: string) => {
    dbDeleteMoodEntry(id);
    await get().loadMoodEntries();
  },
}));
