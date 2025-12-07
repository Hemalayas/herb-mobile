import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppStore } from '../../src/store/appStore';
import { useEffect } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useTheme } from '../../src/context/ThemeContext';

export default function StatsScreen() {
  const theme = useTheme();
  const { sessions, todayCount, loadSessions } = useAppStore();

  useEffect(() => {
    loadSessions();
  }, []);

  const now = new Date();
  const weekStart = startOfWeek(now).getTime();
  const weekEnd = endOfWeek(now).getTime();
  const weekSessions = sessions.filter(
    s => s.timestamp >= weekStart && s.timestamp <= weekEnd
  );

  const methodCounts = sessions.reduce((acc, session) => {
    acc[session.method] = (acc[session.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const methodIcons: Record<string, string> = {
    pen: '💨',
    joint: '🚬',
    bong: '🌿',
    edible: '🍪',
    dab: '💎',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>📊 Your Stats</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Track your progress</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{todayCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Today</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{weekSessions.length}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>This Week</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{sessions.length}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>All Time</Text>
        </View>
      </View>

      {sessions.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>By Method</Text>
          {Object.entries(methodCounts).map(([method, count]) => {
            const percentage = ((count / sessions.length) * 100).toFixed(0);
            return (
              <View key={method} style={[styles.methodRow, { backgroundColor: theme.card }]}>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodIcon}>{methodIcons[method] || '✨'}</Text>
                  <Text style={[styles.methodName, { color: theme.text }]}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </Text>
                </View>
                <View style={styles.methodStats}>
                  <Text style={[styles.methodCount, { color: theme.primary }]}>{count}</Text>
                  <Text style={[styles.methodPercent, { color: theme.textSecondary }]}>{percentage}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {sessions.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Sessions</Text>
          {sessions.slice(0, 10).map((session) => (
            <View key={session.id} style={[styles.sessionRow, { backgroundColor: theme.card }]}>
              <Text style={styles.sessionIcon}>{methodIcons[session.method]}</Text>
              <View style={styles.sessionInfo}>
                <Text style={[styles.sessionMethod, { color: theme.text }]}>
                  {session.method.charAt(0).toUpperCase() + session.method.slice(1)}
                </Text>
                <Text style={[styles.sessionTime, { color: theme.textSecondary }]}>
                  {format(session.timestamp, 'MMM d, h:mm a')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>No sessions yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Log your first session on the Home screen!
          </Text>
        </View>
      )}
    </ScrollView>
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
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
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
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIcon: {
    fontSize: 24,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
  },
  methodStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  methodPercent: {
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  sessionIcon: {
    fontSize: 20,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionMethod: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionTime: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});