import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Share, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/appStore';
import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns';
import { useTheme } from '../../src/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMELINE_COLLAPSED_KEY = '@timeline_collapsed';
const WELLNESS_TIPS = [
  { icon: 'water', tip: 'Stay hydrated! Drink at least 8 glasses of water today.' },
  { icon: 'fitness', tip: 'Take a 10-minute walk. Fresh air helps with cravings.' },
  { icon: 'moon', tip: 'Prioritize sleep. Your brain is healing while you rest.' },
  { icon: 'leaf', tip: 'Day 3 is often the hardest - you\'ve got this!' },
  { icon: 'heart', tip: 'Call a friend or join a support group. You\'re not alone.' },
  { icon: 'nutrition', tip: 'Eat nutrient-rich foods. Your body is rebuilding.' },
  { icon: 'medical', tip: 'Practice deep breathing: 4 seconds in, 4 seconds hold, 4 seconds out.' },
  { icon: 'time', tip: 'Cravings typically pass in 15-20 minutes. Stay strong!' },
  { icon: 'sunny', tip: 'Get some sunlight. Vitamin D helps boost mood naturally.' },
  { icon: 'journal', tip: 'Journal your feelings. Writing helps process emotions.' },
];

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
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(true);
  const [dailyTipIndex, setDailyTipIndex] = useState(0);

  useEffect(() => {
    loadTBreaks();
    loadTimelineState();
    loadDailyTip();
  }, []);

  useEffect(() => {
    if (activeTBreak) {
      const endDate = activeTBreak.startDate + activeTBreak.goalDays * 24 * 60 * 60 * 1000;
      setActiveTBreakEndDate(endDate);
    } else {
      setActiveTBreakEndDate(undefined);
    }
  }, [activeTBreak]);

  const loadTimelineState = async () => {
    try {
      const collapsed = await AsyncStorage.getItem(TIMELINE_COLLAPSED_KEY);
      if (collapsed !== null) {
        setIsTimelineCollapsed(collapsed === 'true');
      }
    } catch (error) {
      console.error('Error loading timeline state:', error);
    }
  };

  const toggleTimeline = async () => {
    const newState = !isTimelineCollapsed;
    setIsTimelineCollapsed(newState);
    try {
      await AsyncStorage.setItem(TIMELINE_COLLAPSED_KEY, newState.toString());
    } catch (error) {
      console.error('Error saving timeline state:', error);
    }
  };

  const loadDailyTip = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setDailyTipIndex(dayOfYear % WELLNESS_TIPS.length);
  };

  const handleInviteFriend = async () => {
    try {
      const shareMessage = Platform.select({
        ios: 'Join me on Herb! Let\'s track our wellness journey together 🌿\n\nDownload Herb - Cannabis Tracker from the App Store',
        android: 'Join me on Herb! Let\'s track our wellness journey together 🌿\n\nDownload Herb - Cannabis Tracker from Google Play',
        default: 'Join me on Herb! Let\'s track our wellness journey together 🌿'
      });

      await Share.share({
        message: shareMessage,
        title: 'Join me on Herb',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleStartTBreak = () => {
    const days = parseInt(tbreakDays);
    if (isNaN(days) || days < 1) {
      Alert.alert('Invalid Input', 'Please enter a valid number of days');
      return;
    }
    startTBreak(days);
    Alert.alert('T-Break Started!', `Good luck with your ${days}-day break!`);
  };

  const handleCompleteTBreak = () => {
    if (!activeTBreak || !activeTBreakEndDate) return;

    const now = Date.now();
    const daysElapsed = Math.floor((now - activeTBreak.startDate) / (24 * 60 * 60 * 1000));
    const goalDays = activeTBreak.goalDays;

    if (daysElapsed < goalDays) {
      Alert.alert(
        'T-Break Not Complete',
        `You've made it ${daysElapsed} ${daysElapsed === 1 ? 'day' : 'days'}, but your goal was ${goalDays} ${goalDays === 1 ? 'day' : 'days'}. Keep going!\n\nYou can end it early, but you'll need to complete the full duration to earn the T-Break Complete badge.`,
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
              Alert.alert('T-Break Complete!', 'Great job completing your full break!');
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
        <View style={styles.counterTitleContainer}>
          <Ionicons name="sparkles" size={24} color={theme.primary} />
          <Text style={[styles.counterTitle, { color: theme.text }]}>Time Sober</Text>
        </View>
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
        <View style={styles.counterTitleContainer}>
          <Ionicons name="pause-circle" size={24} color={theme.primary} />
          <Text style={[styles.tbreakTitle, { color: theme.text }]}>Active T-Break</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.primary }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.primary }]}>{Math.round(progress)}%</Text>
        </View>
        <Text style={[styles.daysLeft, { color: theme.textSecondary }]}>
          {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
        </Text>
        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: theme.primary }]}
          onPress={handleCompleteTBreak}
          activeOpacity={0.8}
        >
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
    startDate: number | null,
    index: number
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
      <View key={`milestone-${index}`} style={styles.timelineItem}>
        <View style={styles.timelineBadgeContainer}>
          <Text style={[styles.timelineBadge, { opacity: isCompleted ? 1 : 0.5 }]}>{badge}</Text>
          {index !== 37 && (
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
        <View style={styles.headerTitleContainer}>
          <Image source={require('../../assets/recovery.png')} style={styles.headerIconLarge} />
          <Text style={[styles.title, { color: theme.text }]}>Recovery</Text>
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your wellness journey</Text>
      </View>

      {!isRecoveryMode ? (
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Image source={require('../../assets/recovery.png')} style={styles.headerIcon} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recovery Mode</Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="sparkles" size={20} color={theme.primary} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Start Your Journey</Text>
            </View>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Track your sobriety and celebrate milestones
            </Text>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleEnterRecovery}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Enter Recovery Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          {renderSobrietyCounter()}
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.inputBackground }]}
            onPress={handleExitRecovery}
            activeOpacity={0.7}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>Exit Recovery Mode</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Tolerance Break</Text>
        {!activeTBreak ? (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="pause-circle-outline" size={20} color={theme.primary} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Take a Break</Text>
            </View>
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
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleStartTBreak}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Start T-Break</Text>
            </TouchableOpacity>
          </View>
        ) : (
          renderTBreakCounter()
        )}
      </View>

      {/* Invite a Friend Section */}
      <View style={styles.section}>
        <View style={[styles.inviteCard, { backgroundColor: theme.card }]}>
          <View style={styles.inviteHeader}>
            <Ionicons name="people" size={32} color={theme.primary} />
            <View style={styles.inviteTextContainer}>
              <Text style={[styles.inviteTitle, { color: theme.text }]}>Quitting is Easier Together</Text>
              <Text style={[styles.inviteDescription, { color: theme.textSecondary }]}>
                Invite friends to support each other's journey
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: theme.primary }]}
            onPress={handleInviteFriend}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social" size={20} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>Invite a Friend</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Wellness Tip */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Wellness Tip</Text>
        <View style={[styles.wellnessTipCard, { backgroundColor: theme.card }]}>
          <Ionicons name={WELLNESS_TIPS[dailyTipIndex].icon as any} size={28} color={theme.primary} />
          <Text style={[styles.wellnessTipText, { color: theme.text }]}>
            {WELLNESS_TIPS[dailyTipIndex].tip}
          </Text>
        </View>
      </View>

      {/* Collapsible Health Timeline */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.timelineHeader}
          onPress={toggleTimeline}
          activeOpacity={0.7}
        >
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Health Timeline</Text>
          <Ionicons
            name={isTimelineCollapsed ? 'chevron-down' : 'chevron-up'}
            size={24}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        {!isTimelineCollapsed && (
          <>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Recovery milestones and health benefits
            </Text>
            <View style={[styles.timelineCard, { backgroundColor: theme.card }]}>
              {renderHealthMilestone(1, '20 minutes', 'Heart rate normalizes', isRecoveryMode, sobrietyStartDate, 0)}
              {renderHealthMilestone(1, '2 hours', 'Short-term memory begins to improve', isRecoveryMode, sobrietyStartDate, 1)}
              {renderHealthMilestone(1, '8 hours', 'Cannabinoid levels drop significantly', isRecoveryMode, sobrietyStartDate, 2)}
              {renderHealthMilestone(1, '12 hours', 'Mental clarity starts returning', isRecoveryMode, sobrietyStartDate, 3)}
              {renderHealthMilestone(1, '24 hours', 'Lungs begin to clear out residue', isRecoveryMode, sobrietyStartDate, 4)}
              {renderHealthMilestone(2, '2 days', 'Nerve endings begin to regenerate', isRecoveryMode, sobrietyStartDate, 5)}
              {renderHealthMilestone(2, '2 days', 'Sense of taste and smell improve', isRecoveryMode, sobrietyStartDate, 6)}
              {renderHealthMilestone(3, '3 days', 'Brain fog begins to lift', isRecoveryMode, sobrietyStartDate, 7)}
              {renderHealthMilestone(3, '3 days', 'Breathing becomes easier', isRecoveryMode, sobrietyStartDate, 8)}
              {renderHealthMilestone(3, '3 days', 'Withdrawal symptoms peak', isRecoveryMode, sobrietyStartDate, 9)}
              {renderHealthMilestone(5, '5 days', 'Appetite returns to normal', isRecoveryMode, sobrietyStartDate, 10)}
              {renderHealthMilestone(7, '1 week', 'REM sleep quality improves', isRecoveryMode, sobrietyStartDate, 11)}
              {renderHealthMilestone(7, '1 week', 'Energy levels increase noticeably', isRecoveryMode, sobrietyStartDate, 12)}
              {renderHealthMilestone(7, '1 week', 'Physical cravings mostly gone', isRecoveryMode, sobrietyStartDate, 13)}
              {renderHealthMilestone(10, '10 days', 'Circulation improves throughout body', isRecoveryMode, sobrietyStartDate, 14)}
              {renderHealthMilestone(14, '2 weeks', 'Mental clarity increases', isRecoveryMode, sobrietyStartDate, 15)}
              {renderHealthMilestone(14, '2 weeks', 'Physical fitness improves', isRecoveryMode, sobrietyStartDate, 16)}
              {renderHealthMilestone(14, '2 weeks', 'Skin appearance improves', isRecoveryMode, sobrietyStartDate, 17)}
              {renderHealthMilestone(21, '3 weeks', 'Mood stabilizes and improves', isRecoveryMode, sobrietyStartDate, 18)}
              {renderHealthMilestone(21, '3 weeks', 'Anxiety levels decrease', isRecoveryMode, sobrietyStartDate, 19)}
              {renderHealthMilestone(30, '1 month', 'Tolerance fully reset', isRecoveryMode, sobrietyStartDate, 20)}
              {renderHealthMilestone(30, '1 month', 'Lung function significantly improved', isRecoveryMode, sobrietyStartDate, 21)}
              {renderHealthMilestone(30, '1 month', 'Immune system begins strengthening', isRecoveryMode, sobrietyStartDate, 22)}
              {renderHealthMilestone(45, '6 weeks', 'Dopamine receptors begin healing', isRecoveryMode, sobrietyStartDate, 23)}
              {renderHealthMilestone(60, '2 months', 'Mental clarity fully restored', isRecoveryMode, sobrietyStartDate, 24)}
              {renderHealthMilestone(60, '2 months', 'Motivation returns to normal', isRecoveryMode, sobrietyStartDate, 25)}
              {renderHealthMilestone(90, '3 months', 'Cognitive function fully restored', isRecoveryMode, sobrietyStartDate, 26)}
              {renderHealthMilestone(90, '3 months', 'Blood circulation normalized', isRecoveryMode, sobrietyStartDate, 27)}
              {renderHealthMilestone(90, '3 months', 'Lung capacity increased significantly', isRecoveryMode, sobrietyStartDate, 28)}
              {renderHealthMilestone(120, '4 months', 'Brain chemistry stabilizes', isRecoveryMode, sobrietyStartDate, 29)}
              {renderHealthMilestone(180, '6 months', 'Long-term brain function restored', isRecoveryMode, sobrietyStartDate, 30)}
              {renderHealthMilestone(180, '6 months', 'Cardiovascular health improved', isRecoveryMode, sobrietyStartDate, 31)}
              {renderHealthMilestone(270, '9 months', 'Lung healing continues progressively', isRecoveryMode, sobrietyStartDate, 32)}
              {renderHealthMilestone(365, '1 year', 'Respiratory health greatly improved', isRecoveryMode, sobrietyStartDate, 33)}
              {renderHealthMilestone(365, '1 year', 'Overall health significantly better', isRecoveryMode, sobrietyStartDate, 34)}
              {renderHealthMilestone(730, '2 years', 'Long-term health risks reduced', isRecoveryMode, sobrietyStartDate, 35)}
              {renderHealthMilestone(1095, '3 years', 'Body fully recovered from effects', isRecoveryMode, sobrietyStartDate, 36)}
              {renderHealthMilestone(1825, '5 years', 'Health fully normalized', isRecoveryMode, sobrietyStartDate, 37)}
            </View>
          </>
        )}
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  headerIconLarge: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 15,
    marginTop: 8,
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
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  counterTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  counterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  inviteCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  inviteTextContainer: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  inviteDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 14,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  wellnessTipCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  wellnessTipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
