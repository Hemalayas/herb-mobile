import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useAppStore } from '../../src/store/appStore';
import { useEffect } from 'react';
import { useTheme } from '../../src/context/ThemeContext';

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, updateSettings, loadSettings } = useAppStore();

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>⚙️ Settings</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Customize your experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>

        {/* Notifications */}
        <View style={[styles.settingRow, { backgroundColor: theme.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>🔔 Notifications</Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              Get reminders and updates
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) =>
              updateSettings({ notificationsEnabled: value })
            }
            trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
            thumbColor={settings.notificationsEnabled ? '#00D084' : '#F3F4F6'}
          />
        </View>

        {/* Theme */}
        <View style={[styles.settingRow, { backgroundColor: theme.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              {settings.theme === 'dark' ? '🌙' : '☀️'} Theme
            </Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              {settings.theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </Text>
          </View>
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={(value) =>
              updateSettings({ theme: value ? 'dark' : 'light' })
            }
            trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
            thumbColor={settings.theme === 'dark' ? '#00D084' : '#F3F4F6'}
          />
        </View>

        {/* Daily Limit */}
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: theme.card }]}
          onPress={() => {
            Alert.prompt(
              'Set Daily Limit',
              'How many sessions per day?',
              (text) => {
                const limit = parseInt(text);
                if (!isNaN(limit) && limit > 0) {
                  updateSettings({ dailyLimit: limit });
                }
              },
              'plain-text',
              settings.dailyLimit?.toString() || ''
            );
          }}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>🎯 Daily Limit</Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              {settings.dailyLimit
                ? `${settings.dailyLimit} sessions per day`
                : 'No limit set'}
            </Text>
          </View>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
        <View style={[styles.aboutCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.appName, { color: theme.text }]}>🌿 Herb</Text>
          <Text style={[styles.version, { color: theme.textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.tagline, { color: theme.primary }]}>Track mindfully, live better</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 24,
    marginLeft: 8,
  },
  aboutCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
  },
});