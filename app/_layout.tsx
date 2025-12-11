import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initDatabase } from '../src/services/database';
import { useAppStore } from '../src/store/appStore';
import { ThemeProvider } from '../src/context/ThemeContext';
import BadgeUnlockModal from '../src/components/BadgeUnlockModal';
import { initRevenueCat } from '../src/services/revenueCat';

export default function RootLayout() {
  useEffect(() => {
    const setup = async () => {
      initDatabase();
      await initRevenueCat(); // Initialize RevenueCat
      await useAppStore.getState().loadSettings();
      await useAppStore.getState().loadRecoveryMode();
      await useAppStore.getState().loadSessions();
      await useAppStore.getState().loadTBreaks();
      await useAppStore.getState().loadMoodEntries(); // Load mood tracking data
      await useAppStore.getState().refreshStats();
      await useAppStore.getState().loadBadges();
    };
    setup();
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <BadgeUnlockModal />
    </ThemeProvider>
  );
}