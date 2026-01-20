import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useAppStore } from '../../src/store/appStore';
import { Platform } from 'react-native';

export default function TabLayout() {
  const theme = useTheme();
  const settings = useAppStore((state) => state.settings);
  const isDark = settings.theme === 'dark';

  // Production-ready tab bar configuration
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 68;
  const iconSize = 24;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 0.5,
          height: tabBarHeight,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingTop: 8,
          paddingHorizontal: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#10B981', // Brand green
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          letterSpacing: 0.2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        animation: 'none',
        lazy: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={iconSize}
              color={color}
              style={{ marginBottom: -2 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={iconSize}
              color={color}
              style={{ marginBottom: -2 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: 'Badges',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'trophy' : 'trophy-outline'}
              size={iconSize}
              color={color}
              style={{ marginBottom: -2 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recovery"
        options={{
          title: 'Recovery',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={iconSize}
              color={color}
              style={{ marginBottom: -2 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={iconSize}
              color={color}
              style={{ marginBottom: -2 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}