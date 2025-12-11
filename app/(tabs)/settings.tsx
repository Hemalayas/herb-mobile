import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Image } from 'react-native';
import { useAppStore } from '../../src/store/appStore';
import { useEffect } from 'react';
import { useTheme } from '../../src/context/ThemeContext';

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, updateSettings, loadSettings } = useAppStore();

    const currencySymbolMap: Record<string, string> = {
    ZAR: 'R',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const currencySymbol =
    currencySymbolMap[settings.currency || 'USD'] || '$';


  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        {/* Container to align Icon and Text side-by-side */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <Image
            source={require('../../assets/settings.png')}
            style={{ width: 60, height: 60, marginRight: 1 }}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Customize your experience
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>

        {/* Notifications */}
        <View style={[styles.settingRow, { backgroundColor: theme.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              🔔 Notifications
            </Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              Get reminders and updates
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
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
            onValueChange={(value) => updateSettings({ theme: value ? 'dark' : 'light' })}
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
                const limit = parseInt(text, 10);
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

        {/* Weekly Limit */}
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: theme.card }]}
          onPress={() => {
            Alert.prompt(
              'Set Weekly Limit',
              'How many sessions per week?',
              (text) => {
                const limit = parseInt(text, 10);
                if (!isNaN(limit) && limit > 0) {
                  updateSettings({ weeklyLimit: limit });
                }
              },
              'plain-text',
              settings.weeklyLimit?.toString() || ''
            );
          }}

          
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>📅 Weekly Limit</Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              {settings.weeklyLimit
                ? `${settings.weeklyLimit} sessions per week`
                : 'No limit set'}
            </Text>
          </View>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
        </TouchableOpacity>

                {/* Currency */}
        <View style={[styles.settingRow, { backgroundColor: theme.card }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              💱 Currency
            </Text>
            <Text
              style={[styles.settingDescription, { color: theme.textSecondary }]}
            >
              {settings.currency || 'USD'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 6 }}>
            {(['ZAR', 'USD', 'EUR', 'GBP'] as const).map((code) => {
              const isActive = (settings.currency || 'USD') === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: isActive ? theme.primary : theme.border,
                    backgroundColor: isActive
                      ? theme.primary
                      : theme.background,
                  }}
                  onPress={() => updateSettings({ currency: code })}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: isActive ? '#FFFFFF' : theme.text,
                    }}
                  >
                    {currencySymbolMap[code]} {code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Average session cost */}
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: theme.card }]}
          onPress={() => {
            // @ts-ignore Alert.prompt iOS
            Alert.prompt(
              'Average session cost',
              `Typical spend per session (${currencySymbol})`,
              (text) => {
                const value = parseFloat(text);
                if (!isNaN(value) && value >= 0) {
                  updateSettings({ averageSessionCost: value });
                }
              },
              'plain-text',
              settings.averageSessionCost?.toString() || '',
            );
          }}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              💵 Average session cost
            </Text>
            <Text
              style={[styles.settingDescription, { color: theme.textSecondary }]}
            >
              {settings.averageSessionCost != null
                ? `${currencySymbol}${settings.averageSessionCost.toFixed(2)}`
                : 'Used for savings estimates'}
            </Text>
          </View>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>
            ›
          </Text>
        </TouchableOpacity>


        {/* Average Session Cost */}
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: theme.card }]}
          onPress={() => {
            Alert.prompt(
              'Average Session Cost',
              'Used when you quick log a session without entering a custom amount.',
              (text) => {
                const value = parseFloat(text);
                if (!isNaN(value) && value >= 0) {
                  updateSettings({ averageSessionCost: value });
                } else if (text.trim() === '') {
                  // Clear the setting if user deletes the value
                  updateSettings({ averageSessionCost: undefined });
                }
              },
              'plain-text',
              settings.averageSessionCost !== undefined
                ? settings.averageSessionCost.toString()
                : ''
            );
          }}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>💰 Average Session Cost</Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              {settings.averageSessionCost !== undefined
                ? `$${settings.averageSessionCost.toFixed(2)} per session`
                : 'Not set'}
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
          <Text style={[styles.tagline, { color: theme.primary }]}>
            Track mindfully, live better
          </Text>
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
