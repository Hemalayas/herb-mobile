import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types';

const SETTINGS_KEY = '@herb_user_settings';
const ONBOARDING_KEY = '@herb_onboarding_complete';
const SHOWN_BADGES_KEY = '@herb_shown_badges';
const RECOVERY_MODE_KEY = '@herb_recovery_mode';

// Settings
export const saveSettings = async (settings: UserSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (): Promise<UserSettings> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!data) {
      return {
        notificationsEnabled: true,
        theme: 'light',
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      notificationsEnabled: true,
      theme: 'light',
    };
  }
};

// Onboarding
export const saveOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error loading onboarding status:', error);
    return false;
  }
};

// Shown Badges (to prevent re-showing on app restart)
export const getShownBadges = async (): Promise<Set<string>> => {
  try {
    const data = await AsyncStorage.getItem(SHOWN_BADGES_KEY);
    if (!data) return new Set();
    return new Set(JSON.parse(data));
  } catch (error) {
    console.error('Error loading shown badges:', error);
    return new Set();
  }
};

export const markBadgeAsShown = async (badgeId: string): Promise<void> => {
  try {
    const shownBadges = await getShownBadges();
    shownBadges.add(badgeId);
    await AsyncStorage.setItem(SHOWN_BADGES_KEY, JSON.stringify(Array.from(shownBadges)));
  } catch (error) {
    console.error('Error marking badge as shown:', error);
  }
};

// Recovery Mode State
export const saveRecoveryMode = async (isRecoveryMode: boolean, sobrietyStartDate: number | null): Promise<void> => {
  try {
    await AsyncStorage.setItem(RECOVERY_MODE_KEY, JSON.stringify({
      isRecoveryMode,
      sobrietyStartDate,
    }));
  } catch (error) {
    console.error('Error saving recovery mode:', error);
  }
};

export const loadRecoveryMode = async (): Promise<{ isRecoveryMode: boolean; sobrietyStartDate: number | null }> => {
  try {
    const data = await AsyncStorage.getItem(RECOVERY_MODE_KEY);
    if (!data) {
      return {
        isRecoveryMode: false,
        sobrietyStartDate: null,
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading recovery mode:', error);
    return {
      isRecoveryMode: false,
      sobrietyStartDate: null,
    };
  }
};

// Clear all storage (for testing/reset)
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};