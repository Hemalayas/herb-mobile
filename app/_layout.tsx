import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { initDatabase } from '../src/services/database';
import { useAppStore } from '../src/store/appStore';
import { ThemeProvider } from '../src/context/ThemeContext';
import { PremiumProvider } from '../src/context/PremiumContext';
import BadgeUnlockModal from '../src/components/BadgeUnlockModal';
import { initRevenueCat } from '../src/services/revenueCat';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AGE_VERIFIED_KEY = '@age_verified';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const settings = useAppStore((state) => state.settings);

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
      setIsReady(true);
    };
    setup();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const checkAgeAndOnboarding = async () => {
      const ageVerified = await AsyncStorage.getItem(AGE_VERIFIED_KEY);
      const inAgeVerification = segments[0] === 'age-verification';
      const inOnboarding = segments[0] === 'onboarding';
      const inPremiumPaywall = segments[0] === 'premium-paywall';
      const inLegalScreens = segments[0] === 'privacy-policy' || segments[0] === 'terms-of-service';
      const hasCompletedOnboarding = settings.hasCompletedOnboarding;

      // If not age verified and not already on age verification screen
      if (!ageVerified && !inAgeVerification && !inLegalScreens) {
        router.replace('/age-verification');
        return;
      }

      // If age verified but hasn't completed onboarding
      if (ageVerified && !hasCompletedOnboarding && !inOnboarding && !inPremiumPaywall && !inLegalScreens) {
        router.replace('/onboarding');
      }
    };

    checkAgeAndOnboarding();
  }, [isReady, settings.hasCompletedOnboarding, segments]);

  return (
    <ThemeProvider>
      <PremiumProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 300,
          }}
        >
          <Stack.Screen
            name="age-verification"
            options={{
              headerShown: false,
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="onboarding"
            options={{
              headerShown: false,
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="premium-paywall"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 350,
            }}
          />
          <Stack.Screen
            name="privacy-policy"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="terms-of-service"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              animation: 'fade',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
        <BadgeUnlockModal />
      </PremiumProvider>
    </ThemeProvider>
  );
}