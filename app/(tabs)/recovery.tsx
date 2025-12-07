import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { useAppStore } from '../../src/store/appStore';
import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns';
import { useTheme } from '../../src/context/ThemeContext';

export default function RecoveryScreen() {
  const theme = useTheme();
  const {
    isRecoveryMode,
    sobrietyStartDate,
    enterRecoveryMode,
    exitRecoveryMode,
    activeTBreak,
    startTBreak,
    completeTBreak,
    loadTBreaks,
  } = useAppStore();

  const [tbreakDays, setTbreakDays] = useState('7');
  const [activeTBreakEndDate, setActiveTBreakEndDate] = useState<number | undefined>(undefined);

  useEffect(() => {
    loadTBreaks();
  }, []);

  useEffect(() => {
    if (activeTBreak) {
      const endDate = activeTBreak.startDate + activeTBreak.goalDays * 24 * 60 * 60 * 1000;
      setActiveTBreakEndDate(endDate);
    } else {
      setActiveTBreakEndDate(undefined);
    }
  }, [activeTBreak]);

  const handleStartTBreak = () => {
    const days = parseInt(tbreakDays);
    if (isNaN(days) || days < 1) {
      Alert.alert('Invalid Input', 'Please enter a valid number of days');
      return;
    }
    startTBreak(days);
    Alert.alert('T-Break Started! 🧘', `Good luck with your ${days}-day break!`);
  };

  const handleCompleteTBreak = () => {
    Alert.alert(
      'Complete T-Break?',
      'Congratulations on your progress!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            completeTBreak();
            Alert.alert('T-Break Complete! 🎉', 'Great job!');
          },
        },
      ]
    );
  };

  const handleEnterRecovery = () => {
    Alert.alert(
      'Enter Recovery Mode?',
      'This will track your sobriety journey',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Recovery', onPress: enterRecoveryMode },
      ]
    );
  };

  const handleExitRecovery = () => {
    Alert.alert(
      'Exit Recovery Mode?',
      'Your progress will be saved',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: exitRecoveryMode },
      ]
    );
  };

  const renderSobrietyCounter = () => {
    if (!sobrietyStartDate) return null;

    const now = Date.now();
    const days = differenceInDays(now, sobrietyStartDate);
    const hours = differenceInHours(now, sobrietyStartDate) % 24;
    const minutes = differenceInMinutes(now, sobrietyStartDate) % 60;

    return (
      <View style={[styles.counterCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.counterTitle, { color: theme.text }]}>🌟 Time Sober</Text>
        <View style={styles.timeGrid}>
          <View style={styles.timeUnit}>
            <Text style={[styles.timeNumber, { color: theme.primary }]}>{days}</Text>
            <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Days</Text>
          </View>
          <View style={styles.timeUnit}>
            <Text style={[styles.timeNumber, { color: theme.primary }]}>{hours}</Text>
            <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Hours</Text>
          </View>
          <View style={styles.timeUnit}>
            <Text style={[styles.timeNumber, { color: theme.primary }]}>{minutes}</Text>
            <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Minutes</Text>
          </View>
        </View>
        <Text style={[styles.startDate, { color: theme.textSecondary }]}>
          Started {format(sobrietyStartDate, 'MMM d, yyyy')}
        </Text>
      </View>
    );
  };

  const renderTBreakCounter = () => {
    if (!activeTBreak || !activeTBreakEndDate) return null;

    const now = Date.now();
    const daysLeft = Math.max(0, differenceInDays(activeTBreakEndDate, now));
    const progress = ((activeTBreak.goalDays - daysLeft) / activeTBreak.goalDays) * 100;

    return (
      <View style={[styles.tbreakCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.tbreakTitle, { color: theme.text }]}>🧘 Active T-Break</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.primary }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.primary }]}>{Math.round(progress)}%</Text>
        </View>
        <Text style={[styles.daysLeft, { color: theme.textSecondary }]}>
          {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
        </Text>
        <TouchableOpacity style={[styles.completeButton, { backgroundColor: theme.primary }]} onPress={handleCompleteTBreak}>
          <Text style={styles.completeButtonText}>Complete T-Break</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>💚 Recovery</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your wellness journey</Text>
      </View>

      {!isRecoveryMode ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recovery Mode</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>🌱 Start Your Journey</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Track your sobriety and celebrate milestones
            </Text>
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={handleEnterRecovery}>
              <Text style={styles.primaryButtonText}>Enter Recovery Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          {renderSobrietyCounter()}
          <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme.inputBackground }]} onPress={handleExitRecovery}>
            <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>Exit Recovery Mode</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Tolerance Break</Text>
        {!activeTBreak ? (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>⏸️ Take a Break</Text>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Reset your tolerance and save money
            </Text>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Duration (days):</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
                value={tbreakDays}
                onChangeText={setTbreakDays}
                placeholder="7"
                keyboardType="number-pad"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={handleStartTBreak}>
              <Text style={styles.primaryButtonText}>Start T-Break</Text>
            </TouchableOpacity>
          </View>
        ) : (
          renderTBreakCounter()
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Health Timeline</Text>
        <View style={[styles.timelineCard, { backgroundColor: theme.card }]}>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineBadge}>✅</Text>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: theme.text }]}>24 hours</Text>
              <Text style={[styles.timelineDesc, { color: theme.textSecondary }]}>Lung capacity improves</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineBadge}>✅</Text>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: theme.text }]}>3 days</Text>
              <Text style={[styles.timelineDesc, { color: theme.textSecondary }]}>Brain fog begins to fade</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineBadge}>⏳</Text>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: theme.text }]}>1 week</Text>
              <Text style={[styles.timelineDesc, { color: theme.textSecondary }]}>Sleep patterns normalize</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineBadge}>⏳</Text>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: theme.text }]}>2 weeks</Text>
              <Text style={[styles.timelineDesc, { color: theme.textSecondary }]}>Memory & focus improve</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineBadge}>⏳</Text>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: theme.text }]}>1 month</Text>
              <Text style={[styles.timelineDesc, { color: theme.textSecondary }]}>Tolerance fully reset</Text>
            </View>
          </View>
        </View>
      </View>
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  primaryButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  counterCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  counterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timeGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  timeLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  startDate: {
    fontSize: 14,
  },
  tbreakCard: {
    borderRadius: 16,
    padding: 24,
  },
  tbreakTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  daysLeft: {
    fontSize: 16,
    marginBottom: 16,
  },
  completeButton: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timelineCard: {
    borderRadius: 16,
    padding: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 16,
    marginLeft: 12,
  },
  timelineBadge: {
    fontSize: 24,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  timelineDesc: {
    fontSize: 14,
  },
});