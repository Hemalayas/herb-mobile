import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Image } from 'react-native';
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
    if (!activeTBreak || !activeTBreakEndDate) return;

    const now = Date.now();
    const daysElapsed = Math.floor((now - activeTBreak.startDate) / (24 * 60 * 60 * 1000));
    const goalDays = activeTBreak.goalDays;

    if (daysElapsed < goalDays) {
      Alert.alert(
        'T-Break Not Complete',
        `You've made it ${daysElapsed} ${daysElapsed === 1 ? 'day' : 'days'}, but your goal was ${goalDays} ${goalDays === 1 ? 'day' : 'days'}. Keep going! 💪\n\nYou can end it early, but you'll need to complete the full duration to earn the T-Break Complete badge.`,
        [
          { text: 'Keep Going', style: 'cancel' },
          {
            text: 'End Early',
            style: 'destructive',
            onPress: () => {
              completeTBreak();
              Alert.alert('T-Break Ended', 'You ended your break early. Start a new one anytime!');
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Complete T-Break?',
        'Congratulations on reaching your goal!',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Complete',
            onPress: () => {
              completeTBreak();
              Alert.alert('T-Break Complete! 🎉', 'Great job completing your full break!');
            },
          },
        ]
      );
    }
  };

  const handleEnterRecovery = () => {
    Alert.alert(
      'Enter Recovery Mode?',
      'This will track your sobriety journey',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Recovery',
          onPress: async () => {
            await enterRecoveryMode();
          }
        },
      ]
    );
  };

  const handleExitRecovery = () => {
    Alert.alert(
      'Exit Recovery Mode?',
      'Your progress will be saved',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: async () => {
            await exitRecoveryMode();
          },
        },
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

  const renderHealthMilestone = (
    requiredDays: number,
    label: string,
    description: string,
    isInRecoveryMode: boolean,
    startDate: number | null
  ) => {
    let isCompleted = false;
    let isActive = false;

    if (isInRecoveryMode && startDate) {
      const daysSober = differenceInDays(Date.now(), startDate);
      isCompleted = daysSober >= requiredDays;
      isActive = !isCompleted && daysSober >= requiredDays - 1;
    } else if (activeTBreak) {
      const daysSober = differenceInDays(Date.now(), activeTBreak.startDate);
      isCompleted = daysSober >= requiredDays;
      isActive = !isCompleted && daysSober >= requiredDays - 1;
    }

    const badge = isCompleted ? '✅' : isActive ? '🔄' : '⏳';
    const lineColor = isCompleted ? '#22C55E' : isActive ? '#F59E0B' : theme.border;

    return (
      <View key={`${requiredDays}-${label}`} style={styles.timelineItem}>
        <View style={styles.timelineBadgeContainer}>
          <Text style={[styles.timelineBadge, { opacity: isCompleted ? 1 : 0.5 }]}>{badge}</Text>
          {requiredDays !== 1825 && (
            <View style={[styles.timelineLine, { backgroundColor: lineColor, opacity: 0.3 }]} />
          )}
        </View>
        <View style={styles.timelineContent}>
          <Text style={[styles.timelineTitle, { color: theme.text, opacity: isCompleted ? 1 : 0.7 }]}>
            {label}
          </Text>
          <Text style={[styles.timelineDesc, { color: theme.textSecondary, opacity: isCompleted ? 1 : 0.6 }]}>
            {description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        {/* Changed the Title to include the Image */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <Image 
            source={require('../../assets/recovery.png')} 
            style={{ width: 60, height: 60, marginRight: 1 }} // Adjust size as needed
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text }]}>Recovery</Text>
        </View>
        
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
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          Recovery milestones and health benefits
        </Text>
        <View style={[styles.timelineCard, { backgroundColor: theme.card }]}>
          {renderHealthMilestone(1, '20 minutes', 'Heart rate & blood pressure normalize', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(1, '2 hours', 'Nicotine cravings peak and start to subside', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(1, '8 hours', 'Carbon monoxide levels drop to normal', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(1, '12 hours', 'Blood oxygen levels return to normal', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(1, '24 hours', 'Lungs start clearing out mucus and debris', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(2, '2 days', 'Nerve endings begin to regenerate', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(2, '2 days', 'Sense of taste and smell improve', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(3, '3 days', 'Brain fog begins to lift', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(3, '3 days', 'Breathing becomes noticeably easier', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(3, '3 days', 'Withdrawal symptoms peak', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(5, '5 days', 'Coughing decreases significantly', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(7, '1 week', 'Sleep quality improves dramatically', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(7, '1 week', 'Energy levels increase noticeably', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(7, '1 week', 'Physical cravings mostly gone', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(10, '10 days', 'Circulation improves throughout body', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(14, '2 weeks', 'Memory & concentration significantly improve', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(14, '2 weeks', 'Physical fitness improves', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(14, '2 weeks', 'Skin appearance improves', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(21, '3 weeks', 'Mood stabilizes and improves', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(21, '3 weeks', 'Anxiety levels decrease', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(30, '1 month', 'Tolerance fully reset', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(30, '1 month', 'Lung function increases 10-30%', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(30, '1 month', 'Immune system begins strengthening', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(45, '6 weeks', 'Dopamine receptors begin healing', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(60, '2 months', 'Mental clarity fully restored', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(60, '2 months', 'Motivation returns to normal', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(90, '3 months', 'Immune system fully strengthened', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(90, '3 months', 'Blood circulation normalized', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(90, '3 months', 'Lung capacity increased significantly', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(120, '4 months', 'Brain chemistry stabilizes', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(180, '6 months', 'Long-term brain function restored', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(180, '6 months', 'Risk of heart disease reduced', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(270, '9 months', 'Lung healing continues progressively', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(365, '1 year', 'Respiratory health greatly improved', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(365, '1 year', 'Overall health significantly better', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(730, '2 years', 'Risk of chronic health issues drops', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(1095, '3 years', 'Body fully recovered from effects', isRecoveryMode, sobrietyStartDate)}
          {renderHealthMilestone(1825, '5 years', 'Long-term health risks normalized', isRecoveryMode, sobrietyStartDate)}
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
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
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
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingLeft: 4,
  },
  timelineBadgeContainer: {
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  timelineBadge: {
    fontSize: 24,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 28,
    left: 11,
    width: 2,
    height: 40,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  timelineDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
});