import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useAppStore } from '../../src/store/appStore';
import { useTheme } from '../../src/context/ThemeContext';
import { initDatabase /*, resetDatabase */ } from '../../src/services/database';
import type { ConsumptionMethod, Mood } from '../../src/types';

const DAY_MS = 24 * 60 * 60 * 1000;

const getCurrencySymbol = (code?: string): string => {
  if (!code) return '$';
  switch (code) {
    case 'USD':
    case '$':
      return '$';
    case 'EUR':
    case '€':
      return '€';
    case 'GBP':
    case '£':
      return '£';
    case 'ZAR':
    case 'R':
      return 'R';
    default:
      return code;
  }
};

export default function HomeScreen() {
  const theme = useTheme();
  const {
    addSession,
    deleteSession,
    todayCount,
    sessions,
    loadSessions,
    loadBadges,
    settings,
    activeTBreak,
    isRecoveryMode,
    sobrietyStartDate,
    loadTBreaks,
    completeTBreak,
    markSlipUp,
    cancelTBreak,
    exitRecoveryMode,
  } = useAppStore();

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<ConsumptionMethod>('joint');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [strain, setStrain] = useState('');
  const [amount, setAmount] = useState('');
  const [cost, setCost] = useState('');
  const [isSocial, setIsSocial] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(undefined);

  // Timer state
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Message state - changes every 10 minutes
  const [tbreakMessage, setTbreakMessage] = useState('');
  const [messageTimestamp, setMessageTimestamp] = useState(Date.now());

  // Initial Data Load
  useEffect(() => {
    const initData = async () => {
      try {
        // ⚙️ Ensure DB schema exists before any reads
        // resetDatabase(); // 🔥 DEV ONLY: uncomment once if you need to nuke local DB
        initDatabase();

        await loadSessions();
        await loadTBreaks();
        await loadBadges();

        const { loadSettings } = useAppStore.getState();
        await loadSettings();
      } catch (e) {
        console.error('❌ Init error in HomeScreen:', e);
      }
    };
    initData();
  }, []);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const methodImages = {
    joint: require('../../assets/joint.png'),
    pen: require('../../assets/pen.png'),
    bong: require('../../assets/bong.png'),
    edible: require('../../assets/edible.png'),
    dab: require('../../assets/dab.png'),
  };

  const methods: { value: ConsumptionMethod; label: string }[] = [
    { value: 'joint', label: 'Joint' },
    { value: 'pen', label: 'Pen' },
    { value: 'bong', label: 'Bong' },
    { value: 'edible', label: 'Edible' },
    { value: 'dab', label: 'Dab' },
  ];

  const currencySymbol = getCurrencySymbol((settings as any).defaultCurrency);

  // 🔢 Average session cost (from settings or historical data)
  const averageSessionCost = useMemo(() => {
    // Prefer user setting if available
    const manual = (settings as any).averageSessionCost;
    if (typeof manual === 'number' && manual > 0) return manual;

    const sessionsWithCost = sessions.filter(
      (s) => typeof s.cost === 'number' && (s.cost ?? 0) > 0
    );
    if (sessionsWithCost.length === 0) return 0;

    const totalCost = sessionsWithCost.reduce(
      (sum, s) => sum + (s.cost || 0),
      0
    );
    return totalCost / sessionsWithCost.length;
  }, [settings, sessions]);

  const handleQuickLog = async (method: ConsumptionMethod) => {
    await addSession({
      method,
      timestamp: Date.now(),
      social: false,
      // If user has an average cost, use it so quick log still tracks spend
      cost: averageSessionCost > 0 ? averageSessionCost : undefined,
    });
    Alert.alert('✅ Logged!', `${method.charAt(0).toUpperCase() + method.slice(1)} session logged`);
  };

  const handleLongPress = (method: ConsumptionMethod) => {
    setSelectedMethod(method);
    setShowDetailModal(true);
  };

  const handleDetailedLog = async () => {
    await addSession({
      method: selectedMethod,
      timestamp: Date.now(),
      strain: strain.trim() || undefined,
      amount: amount ? parseFloat(amount) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      social: isSocial ? true : false,
      notes: notes.trim() || undefined,
      mood: selectedMood,
    });

    setStrain('');
    setAmount('');
    setCost('');
    setIsSocial(false);
    setNotes('');
    setSelectedMood(undefined);
    setShowDetailModal(false);

    Alert.alert('✅ Logged!', 'Detailed session logged');
  };

  const lastSession = sessions[0];
  const lastMethod = lastSession?.method;

  // Session level images
  const level1Image = require('../../assets/level1.png');
  const level2Image = require('../../assets/level2.png');
  const level3Image = require('../../assets/level3.png');

  // Calculate weekly sessions
  const weekStartDate = new Date();
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
  const weekSessions = sessions.filter(
    (session) => new Date(session.timestamp) >= weekStartDate
  );

  // Determine current level and image
  const getCurrentLevelData = () => {
    const dailyLimit = settings.dailyLimit || 0;
    const weeklyLimit = settings.weeklyLimit || 0;

    if (todayCount === 0) {
      return { image: level1Image, message: 'ready to track today?' };
    }

    if (
      (dailyLimit && todayCount > dailyLimit) ||
      (weeklyLimit && weekSessions.length > weeklyLimit)
    ) {
      return { image: level3Image, message: "bro I'm about to green out… STOP" };
    }

    return { image: level2Image, message: "you're chilling bro" };
  };

  const { image: currentImage, message: currentMessage } = getCurrentLevelData();

  // Check if limit is exceeded
  const isDailyLimitExceeded = settings.dailyLimit ? todayCount > settings.dailyLimit : false;
  const isWeeklyLimitExceeded = settings.weeklyLimit ? weekSessions.length > settings.weeklyLimit : false;
  const isLimitExceeded = isDailyLimitExceeded || isWeeklyLimitExceeded;

  const handleUndo = async () => {
    if (!lastSession) return;

    Alert.alert(
      'Undo Last Session?',
      `Remove ${lastMethod} session from ${new Date(lastSession.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Undo',
          style: 'destructive',
          onPress: async () => {
            await deleteSession(lastSession.id);
          },
        },
      ]
    );
  };

  // 🔢 Spending chart data – last 7 days (used in T-break + Recovery)
  const spendingChartData = useMemo(() => {
    const now = new Date();
    const data: { value: number; label: string; frontColor: string }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i
      );
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const end = start + DAY_MS;

      const daySessions = sessions.filter(
        (s) => s.timestamp >= start && s.timestamp < end
      );

      let total = 0;
      daySessions.forEach((s) => {
        if (typeof s.cost === 'number' && (s.cost ?? 0) > 0) {
          total += s.cost || 0;
        } else if (averageSessionCost > 0) {
          // Estimate cost if no explicit cost
          total += averageSessionCost;
        }
      });

      const label = `${date.getMonth() + 1}/${date.getDate()}`; // e.g., 12/10
      data.push({
        value: total,
        label,
        frontColor: '#F59E0B',
      });
    }

    return data;
  }, [sessions, averageSessionCost]);

  const hasSpendingData = spendingChartData.some((d) => d.value > 0);

  // T-Break helper functions
  const getTimeRemaining = () => {
    if (!activeTBreak) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const goalDate = activeTBreak.startDate + activeTBreak.goalDays * DAY_MS;
    const remaining = goalDate - currentTime;

    if (remaining <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };
    }

    const days = Math.floor(remaining / DAY_MS);
    const hours = Math.floor((remaining % DAY_MS) / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

    return { days, hours, minutes, seconds, completed: false };
  };

  const getSobrietyTime = () => {
    if (!sobrietyStartDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const elapsed = currentTime - sobrietyStartDate;
    const days = Math.floor(elapsed / DAY_MS);
    const hours = Math.floor((elapsed % DAY_MS) / (60 * 60 * 1000));
    const minutes = Math.floor((elapsed % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((elapsed % (60 * 1000)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const generateTBreakMessage = () => {
    if (!activeTBreak) return "You're doing good";

    const { days, completed } = getTimeRemaining();

    if (completed) return "Time's up!";
    if (days === 0) return 'Last day! You got this!';
    if (days === 1) return 'Only 1 day to go!';

    const messages = [
      "You're doing good",
      'Stay strong!',
      'Keep it up!',
      'You got this!',
      'Almost there!',
      'Your tolerance is dropping',
      'Every moment counts',
      'Mind over matter',
      'Building discipline',
      "You're getting stronger",
    ];
    const index = Math.floor((messageTimestamp / 1000) % messages.length);
    return messages[index];
  };

  const generateRecoveryMessage = () => {
    const { days } = getSobrietyTime();

    if (days === 0) return 'One day at a time';
    if (days === 1) return '24 hours strong!';
    if (days === 3) return '3 days! Your body is healing';
    if (days === 7) return 'One week! Sleep is improving';
    if (days === 14) return 'Two weeks! Memory sharpening';
    if (days === 30) return "One month! You're amazing!";
    if (days === 90) return '90 days! Mental clarity restored';

    const messages = [
      "You're doing amazing",
      'Every day is a victory',
      'Your health is improving',
      'Stay strong, stay free',
      "You're getting healthier",
      'Building a better you',
      'Reclaiming your life',
      'Healing every day',
      'Your mind is clearing',
      'Proud of your progress',
    ];
    const index = Math.floor((messageTimestamp / 1000) % messages.length);
    return messages[index];
  };

  // 💰 Savings estimator (used for T-break & Recovery)
  const computeSavings = (startDate?: number | null) => {
    if (!startDate || averageSessionCost <= 0) {
      return { estimated: 0, daysElapsed: 0 };
    }

    const now = currentTime;

    // Use history BEFORE the break/recovery to estimate baseline sessions/day
    const pastSessions = sessions.filter((s) => s.timestamp < startDate);
    if (pastSessions.length === 0) {
      return { estimated: 0, daysElapsed: 0 };
    }

    const firstTs = pastSessions.reduce(
      (min, s) => (s.timestamp < min ? s.timestamp : min),
      pastSessions[0].timestamp
    );
    const lastTs = pastSessions.reduce(
      (max, s) => (s.timestamp > max ? s.timestamp : max),
      pastSessions[0].timestamp
    );

    const spanDays = Math.max(1, Math.round((lastTs - firstTs) / DAY_MS) + 1);
    const avgSessionsPerDay = pastSessions.length / spanDays;

    const daysElapsed = Math.max(0, Math.floor((now - startDate) / DAY_MS));
    const estimatedSessions = avgSessionsPerDay * daysElapsed;
    const estimatedSpend = estimatedSessions * averageSessionCost;

    return { estimated: estimatedSpend, daysElapsed };
  };

  const tbreakSavings = useMemo(
    () => computeSavings(activeTBreak?.startDate ?? null),
    [activeTBreak, sessions, averageSessionCost, currentTime]
  );

  const recoverySavings = useMemo(
    () => computeSavings(sobrietyStartDate),
    [sobrietyStartDate, sessions, averageSessionCost, currentTime]
  );

  // Update message every 10 minutes
  useEffect(() => {
    const updateMessage = () => {
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;

      if (now - messageTimestamp >= tenMinutes) {
        setMessageTimestamp(now);

        if (activeTBreak) {
          setTbreakMessage(generateTBreakMessage());
        } else if (isRecoveryMode) {
          setTbreakMessage(generateRecoveryMessage());
        }
      }
    };

    if (activeTBreak || isRecoveryMode) {
      if (!tbreakMessage) {
        if (activeTBreak) {
          setTbreakMessage(generateTBreakMessage());
        } else if (isRecoveryMode) {
          setTbreakMessage(generateRecoveryMessage());
        }
      } else {
        updateMessage();
      }
    }

    const interval = setInterval(updateMessage, 60 * 1000);
    return () => clearInterval(interval);
  }, [currentTime, activeTBreak, isRecoveryMode, messageTimestamp, tbreakMessage]);

  const handleCompleteTBreak = async () => {
    await completeTBreak();
    setShowSuccessModal(true);
  };

  const handleSlipUp = async () => {
    Alert.alert(
      'Log Slip-Up?',
      'This will restart your T-break from today',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restart',
          style: 'destructive',
          onPress: async () => {
            await markSlipUp();
            await cancelTBreak();
            const { startTBreak } = useAppStore.getState();
            await startTBreak(activeTBreak?.goalDays || 1);
            await loadTBreaks();
          },
        },
      ]
    );
  };

  const handleCancelTBreak = async () => {
    Alert.alert(
      'Cancel T-Break?',
      'This will end your current tolerance break',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await cancelTBreak();
            await loadTBreaks();
          },
        },
      ]
    );
  };

  // Check if T-break is complete
  useEffect(() => {
    if (activeTBreak) {
      const { completed } = getTimeRemaining();
      if (completed && !showSuccessModal) {
        handleCompleteTBreak();
      }
    }
  }, [currentTime, activeTBreak, showSuccessModal]);

  // 🧊 T-Break Mode Screen
  if (activeTBreak) {
    const timeRemaining = getTimeRemaining();
    const message =
      activeTBreak.hadSlipUp ? 'it happens bro' : tbreakMessage || generateTBreakMessage();
    const image = activeTBreak.hadSlipUp ? level2Image : level1Image;

    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text }]}>T-Break Mode 💙</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Stay strong!</Text>
        </View>

        <View style={[styles.timerCard, { backgroundColor: theme.card, borderColor: '#3B82F6' }]}>
          <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>Time Remaining</Text>
          <View style={styles.timerDisplay}>
            <View style={styles.timerUnit}>
              <Text style={[styles.timerNumber, { color: '#3B82F6' }]}>{timeRemaining.days}</Text>
              <Text style={[styles.timerText, { color: theme.textSecondary }]}>days</Text>
            </View>
            <Text style={[styles.timerColon, { color: '#3B82F6' }]}>:</Text>
            <View style={styles.timerUnit}>
              <Text style={[styles.timerNumber, { color: '#3B82F6' }]}>
                {String(timeRemaining.hours).padStart(2, '0')}
              </Text>
              <Text style={[styles.timerText, { color: theme.textSecondary }]}>hours</Text>
            </View>
            <Text style={[styles.timerColon, { color: '#3B82F6' }]}>:</Text>
            <View style={styles.timerUnit}>
              <Text style={[styles.timerNumber, { color: '#3B82F6' }]}>
                {String(timeRemaining.minutes).padStart(2, '0')}
              </Text>
              <Text style={[styles.timerText, { color: theme.textSecondary }]}>mins</Text>
            </View>
          </View>
        </View>

        {/* 💰 Savings chart for T-Break */}
        {tbreakSavings.estimated > 0 && (
          <View style={[styles.savingsCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Savings this break</Text>
            <Text style={[styles.savingsAmount, { color: '#22C55E' }]}>
              {currencySymbol}
              {tbreakSavings.estimated.toFixed(0)}
            </Text>
            <BarChart
              data={[
                {
                  value: tbreakSavings.estimated,
                  label: 'Saved',
                  frontColor: '#22C55E',
                },
              ]}
              width={300}
              height={160}
              barWidth={40}
              spacing={30}
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
              yAxisLabelPrefix={currencySymbol}
              noOfSections={4}
              maxValue={tbreakSavings.estimated}
              roundedTop
              isAnimated
            />
            <Text style={[styles.savingsCaption, { color: theme.textSecondary }]}>
              Estimated savings since you started this T-break.
            </Text>
          </View>
        )}

        {/* 💸 Spending chart – last 7 days (T-Break) */}
        {hasSpendingData && (
          <View style={[styles.spendingCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Spending – last 7 days</Text>
            <BarChart
              data={spendingChartData}
              width={300}
              height={180}
              barWidth={20}
              spacing={10}
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 9 }}
              yAxisLabelPrefix={currencySymbol}
              noOfSections={4}
              maxValue={Math.max(...spendingChartData.map((d) => d.value))}
              roundedTop
              isAnimated
            />
          </View>
        )}

        <View style={styles.sessionImageContainer}>
          <View style={styles.sessionContent}>
            <Image
              source={image}
              style={{
                width: 200,
                height: 200,
                alignSelf: 'center',
              }}
            />
            <View
              style={[
                styles.messageCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.messageText, { color: theme.text }]}>{message}</Text>
            </View>
          </View>
        </View>

        <View style={styles.breakActions}>
          <TouchableOpacity
            style={[styles.slipUpButton, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}
            onPress={handleSlipUp}
          >
            <Text style={styles.slipUpButtonText}>⚠️ Log Slip-Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cancelBreakButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handleCancelTBreak}
          >
            <Text style={[styles.cancelBreakButtonText, { color: theme.text }]}>Cancel Break</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showSuccessModal} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.successModal, { backgroundColor: theme.card }]}>
              <Text style={[styles.successTitle, { color: theme.text }]}>🎉 T-Break Successful! 🎉</Text>
              <Text style={[styles.successMessage, { color: theme.textSecondary }]}>
                Congratulations on completing your {activeTBreak?.goalDays} day tolerance break!
              </Text>
              <TouchableOpacity
                style={[styles.successButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setShowSuccessModal(false);
                  loadTBreaks();
                }}
              >
                <Text style={styles.successButtonText}>Collect Badges</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  // 💚 Recovery Mode Screen
  if (isRecoveryMode) {
    const sobrietyTime = getSobrietyTime();
    const message = tbreakMessage || generateRecoveryMessage();

    const healthMilestones = [
      {
        days: 1,
        icon: '🌅',
        title: '24 Hours',
        description: 'Carbon monoxide levels normalizing',
        achieved: sobrietyTime.days >= 1,
      },
      {
        days: 3,
        icon: '👃',
        title: '3 Days',
        description: 'Taste and smell improving',
        achieved: sobrietyTime.days >= 3,
      },
      {
        days: 7,
        icon: '😴',
        title: '1 Week',
        description: 'Sleep quality improving',
        achieved: sobrietyTime.days >= 7,
      },
      {
        days: 30,
        icon: '💚',
        title: '1 Month',
        description: 'Mental clarity enhanced',
        achieved: sobrietyTime.days >= 30,
      },
    ];

    const achievedCount = healthMilestones.filter((m) => m.achieved).length;

    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text }]}>Recovery Mode 💚</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>You're on the right path</Text>
        </View>

        <View style={[styles.timerCard, { backgroundColor: theme.card, borderColor: '#10B981' }]}>
          <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>Sober Time</Text>
          <View style={styles.timerDisplay}>
            <View style={styles.timerUnit}>
              <Text style={[styles.timerNumber, { color: '#10B981' }]}>{sobrietyTime.days}</Text>
              <Text style={[styles.timerText, { color: theme.textSecondary }]}>days</Text>
            </View>
            <Text style={[styles.timerColon, { color: '#10B981' }]}>:</Text>
            <View style={styles.timerUnit}>
              <Text style={[styles.timerNumber, { color: '#10B981' }]}>
                {String(sobrietyTime.hours).padStart(2, '0')}
              </Text>
              <Text style={[styles.timerText, { color: theme.textSecondary }]}>hours</Text>
            </View>
            <Text style={[styles.timerColon, { color: '#10B981' }]}>:</Text>
            <View style={styles.timerUnit}>
              <Text style={[styles.timerNumber, { color: '#10B981' }]}>
                {String(sobrietyTime.minutes).padStart(2, '0')}
              </Text>
              <Text style={[styles.timerText, { color: theme.textSecondary }]}>mins</Text>
            </View>
          </View>
        </View>

        {/* 💰 Savings chart for Recovery */}
        {recoverySavings.estimated > 0 && (
          <View style={[styles.savingsCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Money saved in recovery</Text>
            <Text style={[styles.savingsAmount, { color: '#22C55E' }]}>
              {currencySymbol}
              {recoverySavings.estimated.toFixed(0)}
            </Text>
            <BarChart
              data={[
                {
                  value: recoverySavings.estimated,
                  label: 'Saved',
                  frontColor: '#22C55E',
                },
              ]}
              width={300}
              height={160}
              barWidth={40}
              spacing={30}
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
              yAxisLabelPrefix={currencySymbol}
              noOfSections={4}
              maxValue={recoverySavings.estimated}
              roundedTop
              isAnimated
            />
            <Text style={[styles.savingsCaption, { color: theme.textSecondary }]}>
              Estimated savings since you started recovery, based on your past use.
            </Text>
          </View>
        )}

        {/* 💸 Spending chart – last 7 days (Recovery) */}
        {hasSpendingData && (
          <View style={[styles.spendingCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Spending – last 7 days</Text>
            <BarChart
              data={spendingChartData}
              width={300}
              height={180}
              barWidth={20}
              spacing={10}
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 9 }}
              yAxisLabelPrefix={currencySymbol}
              noOfSections={4}
              maxValue={Math.max(...spendingChartData.map((d) => d.value))}
              roundedTop
              isAnimated
            />
          </View>
        )}

        <View style={[styles.recoveryStatsCard, { backgroundColor: theme.card }]}>
          <View style={styles.recoveryStatItem}>
            <Text style={[styles.recoveryStatNumber, { color: '#10B981' }]}>
              {achievedCount}/{healthMilestones.length}
            </Text>
            <Text style={[styles.recoveryStatLabel, { color: theme.textSecondary }]}>Milestones</Text>
          </View>
        <View style={[styles.recoveryStatDivider, { backgroundColor: theme.border }]} />
          <View style={styles.recoveryStatItem}>
            <Text style={[styles.recoveryStatNumber, { color: '#10B981' }]}>{sobrietyTime.days}</Text>
            <Text style={[styles.recoveryStatLabel, { color: theme.textSecondary }]}>Days Clean</Text>
          </View>
          <View style={[styles.recoveryStatDivider, { backgroundColor: theme.border }]} />
          <View style={styles.recoveryStatItem}>
            <Text style={[styles.recoveryStatNumber, { color: '#10B981' }]}>💪</Text>
            <Text style={[styles.recoveryStatLabel, { color: theme.textSecondary }]}>Strong</Text>
          </View>
        </View>

        <View style={styles.recoveryMilestones}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>Health Progress</Text>
          {healthMilestones.map((milestone, index) => (
            <View
              key={index}
              style={[
                styles.milestoneCard,
                {
                  backgroundColor: milestone.achieved ? theme.card : theme.background,
                  borderColor: milestone.achieved ? '#10B981' : theme.border,
                  borderWidth: milestone.achieved ? 2 : 1,
                  opacity: milestone.achieved ? 1 : 0.5,
                },
              ]}
            >
              <Text style={styles.milestoneCardIcon}>{milestone.icon}</Text>
              <View style={styles.milestoneCardContent}>
                <Text style={[styles.milestoneCardTitle, { color: theme.text }]}>
                  {milestone.title}
                </Text>
                <Text style={[styles.milestoneCardDescription, { color: theme.textSecondary }]}>
                  {milestone.description}
                </Text>
              </View>
              {milestone.achieved && <Text style={styles.milestoneCardCheck}>✓</Text>}
            </View>
          ))}
        </View>

        <View style={styles.sessionImageContainer}>
          <View style={styles.sessionContent}>
            <Image
              source={level1Image}
              style={{
                width: 200,
                height: 200,
                alignSelf: 'center',
              }}
            />
            <View
              style={[
                styles.messageCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.messageText, { color: theme.text }]}>{message}</Text>
            </View>
          </View>
        </View>

        <View style={styles.breakActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
            onPress={() => {
              Alert.alert(
                'Exit Recovery Mode?',
                'This will end recovery tracking',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Exit', style: 'destructive', onPress: exitRecoveryMode },
                ]
              );
            }}
          >
            <Text style={styles.actionButtonText}>Exit Recovery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // 🌿 Normal Mode Screen
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.text }]}>Hey there! 👋</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Ready to track?</Text>
      </View>

      <View
        style={[
          styles.countCard,
          {
            backgroundColor: theme.card,
            borderColor: isLimitExceeded ? '#EF4444' : theme.primary,
          },
        ]}
      >
        <Text
          style={[
            styles.countNumber,
            {
              color: isLimitExceeded ? '#EF4444' : theme.primary,
            },
          ]}
        >
          {todayCount}
        </Text>
        <Text style={[styles.countLabel, { color: theme.textSecondary }]}>sessions today</Text>
        {settings.dailyLimit && (
          <Text
            style={[
              styles.limitText,
              { color: isDailyLimitExceeded ? '#EF4444' : theme.textSecondary },
            ]}
          >
            {todayCount} / {settings.dailyLimit} daily limit
          </Text>
        )}
        {settings.weeklyLimit && (
          <Text
            style={[
              styles.limitText,
              { color: isWeeklyLimitExceeded ? '#EF4444' : theme.textSecondary },
            ]}
          >
            {weekSessions.length} / {settings.weeklyLimit} weekly limit
          </Text>
        )}
        {lastSession && lastMethod && (
          <View style={styles.lastSessionRow}>
            <View style={styles.lastSessionContent}>
              <Text style={[styles.lastSession, { color: theme.textSecondary }]}>Last: </Text>
              <Image source={methodImages[lastMethod]} style={styles.lastSessionIcon} />
              <Text
                style={[
                  styles.lastSession,
                  { color: theme.textSecondary },
                ]}
              >
                {new Date(lastSession.timestamp).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <TouchableOpacity onPress={handleUndo} style={styles.undoButton}>
              <Text style={[styles.undoText, { color: theme.textSecondary }]}>undo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 👇 No spending chart in normal mode anymore */}

      <View style={styles.instructions}>
        <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
          <Text style={[styles.instructionBold, { color: theme.text }]}>Tap</Text> for quick log
        </Text>
        <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
          <Text style={[styles.instructionBold, { color: theme.text }]}>Hold</Text> for details
        </Text>
      </View>

      <View style={styles.methodsGrid}>
        {methods.map((method) => (
          <TouchableOpacity
            key={method.value}
            style={[styles.methodButton, { backgroundColor: theme.card }]}
            onPress={() => handleQuickLog(method.value)}
            onLongPress={() => handleLongPress(method.value)}
            delayLongPress={500}
          >
            <Image source={methodImages[method.value]} style={styles.methodIcon} resizeMode="contain" />
            <Text style={[styles.methodLabel, { color: theme.text }]}>{method.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sessionImageContainer}>
        <View style={styles.sessionContent}>
          <Image
            source={currentImage}
            style={{
              width: 200,
              height: 200,
              alignSelf: 'center',
            }}
          />
          <View
            style={[
              styles.messageCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.messageText, { color: theme.text }]}>{currentMessage}</Text>
          </View>
        </View>
      </View>

      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalTitleContainer}>
                <Image
                  source={methodImages[selectedMethod]}
                  style={styles.modalIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Log {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Session
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Strain (optional)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  value={strain}
                  onChangeText={setStrain}
                  placeholder="e.g., Blue Dream"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Amount in grams (optional)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="e.g., 1.5"
                  keyboardType="decimal-pad"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Cost {currencySymbol} (optional)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  value={cost}
                  onChangeText={setCost}
                  placeholder="e.g., 15"
                  keyboardType="decimal-pad"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.switchRow}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>With friends?</Text>
                  <Switch
                    value={isSocial}
                    onValueChange={setIsSocial}
                    trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
                    thumbColor={isSocial ? '#00D084' : '#F3F4F6'}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Notes (optional)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    styles.textArea,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="How are you feeling?"
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Mood (optional)</Text>
                <View style={styles.moodGrid}>
                  {[
                    { value: 'relaxed' as Mood, emoji: '😌', label: 'Relaxed' },
                    { value: 'energized' as Mood, emoji: '⚡', label: 'Energized' },
                    { value: 'creative' as Mood, emoji: '🎨', label: 'Creative' },
                    { value: 'focused' as Mood, emoji: '🎯', label: 'Focused' },
                    { value: 'social' as Mood, emoji: '🗣️', label: 'Social' },
                    { value: 'sleepy' as Mood, emoji: '😴', label: 'Sleepy' },
                    { value: 'euphoric' as Mood, emoji: '😄', label: 'Euphoric' },
                    { value: 'calm' as Mood, emoji: '🧘', label: 'Calm' },
                  ].map((mood) => (
                    <TouchableOpacity
                      key={mood.value}
                      style={[
                        styles.moodButton,
                        {
                          backgroundColor:
                            selectedMood === mood.value ? theme.primary : theme.inputBackground,
                          borderColor: selectedMood === mood.value ? theme.primary : theme.border,
                        },
                      ]}
                      onPress={() =>
                        setSelectedMood(selectedMood === mood.value ? undefined : mood.value)
                      }
                    >
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text
                        style={[
                          styles.moodLabel,
                          {
                            color: selectedMood === mood.value ? '#FFFFFF' : theme.text,
                          },
                        ]}
                      >
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.cancelButton,
                    { backgroundColor: theme.inputBackground },
                  ]}
                  onPress={() => setShowDetailModal(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.logButton,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={handleDetailedLog}
                >
                  <Text style={styles.logButtonText}>Log Session</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  countCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
  },
  countNumber: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  countLabel: {
    fontSize: 16,
    marginTop: 8,
  },
  lastSession: {
    fontSize: 14,
  },
  lastSessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  lastSessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastSessionIcon: {
    width: 18,
    height: 18,
  },
  undoButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  undoText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  limitText: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  instructions: {
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
  },
  instructionText: {
    fontSize: 14,
  },
  instructionBold: {
    fontWeight: 'bold',
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    justifyContent: 'center',
  },
  methodButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  methodIcon: {
    width: 56,
    height: 56,
    marginBottom: 12,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  // 💸 Spending / Savings cards
  spendingCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  savingsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savingsCaption: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 12,
  },
  modalIcon: {
    width: 32,
    height: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {},
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logButton: {},
  logButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sessionImageContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sessionContent: {
    alignItems: 'center',
    gap: 16,
  },
  messageCard: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  timerCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerUnit: {
    alignItems: 'center',
  },
  timerNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 12,
    marginTop: 4,
  },
  timerColon: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  breakActions: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  slipUpButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  slipUpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
  },
  cancelBreakButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  cancelBreakButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  successModal: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  successButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recoveryStatsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recoveryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  recoveryStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recoveryStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  recoveryStatDivider: {
    width: 1,
    marginHorizontal: 12,
  },
  recoveryMilestones: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  milestoneCardIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  milestoneCardContent: {
    flex: 1,
  },
  milestoneCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  milestoneCardDescription: {
    fontSize: 12,
  },
  milestoneCardCheck: {
    fontSize: 20,
    color: '#10B981',
    marginLeft: 8,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodButton: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
