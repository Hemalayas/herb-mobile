import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
        },
        // These tint colors now only apply to the text labels below the icons
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/home.png')}
              style={{
                width: 40,
                height: 40,
                // No tintColor here, so the original image colors show
                opacity: focused ? 1 : 0.5, 
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/stats.png')}
              style={{
                width: 40,
                height: 40,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: 'Badges',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/badges.png')}
              style={{
                width: 40,
                height: 40,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recovery"
        options={{
          title: 'Recovery',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/recovery.png')}
              style={{
                width: 40,
                height: 40,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/settings.png')}
              style={{
                width: 40,
                height: 40,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}