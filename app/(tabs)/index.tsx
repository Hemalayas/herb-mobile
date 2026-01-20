import { useState, useEffect, useMemo, useRef } from 'react';
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
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { BarChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/appStore';
import { useTheme } from '../../src/context/ThemeContext';
import { initDatabase /*, resetDatabase */ } from '../../src/services/database';
import type { ConsumptionMethod, Mood } from '../../src/types';
import MoodTracker from '../../src/components/MoodTracker';
import ToastNotification from '../../src/components/ToastNotification';
import { useToast } from '../../src/hooks/useToast';

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

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
  const { toast, showToast, hideToast } = useToast();
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
  const [isPremium, setIsPremium] = useState(false);

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

  // Flip card state for session counter
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

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
    showToast(`${method.charAt(0).toUpperCase() + method.slice(1)} session logged`, 'success');
  };

  const handleLongPress = (method: ConsumptionMethod) => {
    setSelectedMethod(method);
    setShowDetailModal(true);
  };

  const handleFlipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.spring(flipAnimation, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
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

    showToast('Detailed session logged', 'success');
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

  // Weekly insights for home screen
  const weeklyInsights = useMemo(() => {
    if (weekSessions.length === 0) return null;

    // Most used method
    const methodCounts: Record<string, number> = {};
    weekSessions.forEach(s => {
      methodCounts[s.method] = (methodCounts[s.method] || 0) + 1;
    });
    const mostUsed = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0];

    // Social vs Solo
    const social = weekSessions.filter(s => s.social).length;
    const total = weekSessions.length;
    const socialPercent = Math.round((social / total) * 100);

    // Current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const uniqueDays = new Set(
      sessions.map(s => {
        const d = new Date(s.timestamp);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );
    const sortedDays = Array.from(uniqueDays).sort((a, b) => b - a);
    let streak = 0;
    let expectedDay = today.getTime();
    for (const day of sortedDays) {
      if (day === expectedDay) {
        streak++;
        expectedDay -= 24 * 60 * 60 * 1000;
      } else if (day === expectedDay + 24 * 60 * 60 * 1000) {
        continue;
      } else {
        break;
      }
    }

    return {
      mostUsedMethod: mostUsed ? mostUsed[0] : null,
      socialPercent,
      streak,
    };
  }, [weekSessions, sessions]);

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

  // 💰 Money saved chart data – last 7 days (Recovery mode)
  const moneySavedChartData = useMemo(() => {
    if (!isRecoveryMode || !sobrietyStartDate || averageSessionCost <= 0) return [];

    const now = new Date();
    const data: { value: number; label: string; frontColor: string }[] = [];

    // Calculate average sessions per day from historical data
    const allDays = Math.max(
      1,
      Math.floor(
        (Date.now() - (sessions[sessions.length - 1]?.timestamp || Date.now())) / DAY_MS
      )
    );
    const avgSessionsPerDay = sessions.length / allDays;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i
      );
      const dayTimestamp = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime();

      // Check if this day is within the recovery period
      if (dayTimestamp >= sobrietyStartDate) {
        // Estimate money saved on this day based on average usage
        const estimatedSavings = avgSessionsPerDay * averageSessionCost;
        const label = `${date.getMonth() + 1}/${date.getDate()}`;
        data.push({
          value: estimatedSavings,
          label,
          frontColor: '#10B981',
        });
      } else {
        data.push({
          value: 0,
          label: `${date.getMonth() + 1}/${date.getDate()}`,
          frontColor: '#10B981',
        });
      }
    }

    return data;
  }, [sessions, averageSessionCost, isRecoveryMode, sobrietyStartDate]);

  const hasMoneySavedData = moneySavedChartData.some((d) => d.value > 0);

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
          <Text style={[styles.greeting, { color: theme.text }]}>T-Break Mode</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Stay strong!</Text>
        </View>

        <View style={[styles.tbreakTimerCard, { backgroundColor: theme.card, borderColor: '#3B82F6' }]}>
          <View style={styles.timerHeaderRow}>
            <Ionicons name="timer-outline" size={20} color="#3B82F6" />
            <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>Time Remaining</Text>
          </View>
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
          <View style={[styles.tbreakSavingsCard, { backgroundColor: theme.card }]}>
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

        {/* No spending chart on t-break screen */}

        <View style={styles.tbreakImageContainer}>
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
                styles.tbreakMessageCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.tbreakMessageText, { color: theme.text }]}>{message}</Text>
            </View>
            {/* Mood Tracker Widget */}
            <MoodTracker />
          </View>
        </View>

        <View style={styles.tbreakActions}>
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
    const elapsedMs = sobrietyStartDate ? currentTime - sobrietyStartDate : 0;

    // Compact milestone summary (still used only for counts in stats)
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

    // Full health timeline (merged from Recovery page)
    const fullHealthTimeline = [
      {
        thresholdMs: 20 * MINUTE_MS,
        label: '20 minutes',
        description: 'Heart rate normalizes',
      },
      {
        thresholdMs: 2 * HOUR_MS,
        label: '2 hours',
        description: 'Short-term memory begins to improve',
      },
      {
        thresholdMs: 8 * HOUR_MS,
        label: '8 hours',
        description: 'Cannabinoid levels drop significantly',
      },
      {
        thresholdMs: 12 * HOUR_MS,
        label: '12 hours',
        description: 'Mental clarity starts returning',
      },
      {
        thresholdMs: 24 * HOUR_MS,
        label: '24 hours',
        description: 'Lungs begin to clear out residue',
      },
      {
        thresholdMs: 2 * DAY_MS,
        label: '2 days',
        description: 'Nerve endings begin to regenerate',
      },
      {
        thresholdMs: 2 * DAY_MS,
        label: '2 days',
        description: 'Sense of taste and smell improve',
      },
      {
        thresholdMs: 3 * DAY_MS,
        label: '3 days',
        description: 'Brain fog begins to lift',
      },
      {
        thresholdMs: 3 * DAY_MS,
        label: '3 days',
        description: 'Breathing becomes easier',
      },
      {
        thresholdMs: 3 * DAY_MS,
        label: '3 days',
        description: 'Withdrawal symptoms peak',
      },
      {
        thresholdMs: 5 * DAY_MS,
        label: '5 days',
        description: 'Appetite returns to normal',
      },
      {
        thresholdMs: 7 * DAY_MS,
        label: '1 week',
        description: 'REM sleep quality improves',
      },
      {
        thresholdMs: 7 * DAY_MS,
        label: '1 week',
        description: 'Energy levels increase noticeably',
      },
      {
        thresholdMs: 7 * DAY_MS,
        label: '1 week',
        description: 'Physical cravings mostly gone',
      },
      {
        thresholdMs: 10 * DAY_MS,
        label: '10 days',
        description: 'Circulation improves throughout body',
      },
      {
        thresholdMs: 14 * DAY_MS,
        label: '2 weeks',
        description: 'Mental clarity increases',
      },
      {
        thresholdMs: 14 * DAY_MS,
        label: '2 weeks',
        description: 'Physical fitness improves',
      },
      {
        thresholdMs: 14 * DAY_MS,
        label: '2 weeks',
        description: 'Skin appearance improves',
      },
      {
        thresholdMs: 21 * DAY_MS,
        label: '3 weeks',
        description: 'Mood stabilizes and improves',
      },
      {
        thresholdMs: 21 * DAY_MS,
        label: '3 weeks',
        description: 'Anxiety levels decrease',
      },
      {
        thresholdMs: 30 * DAY_MS,
        label: '1 month',
        description: 'Tolerance fully reset',
      },
      {
        thresholdMs: 30 * DAY_MS,
        label: '1 month',
        description: 'Lung function significantly improved',
      },
      {
        thresholdMs: 30 * DAY_MS,
        label: '1 month',
        description: 'Immune system begins strengthening',
      },
      {
        thresholdMs: 45 * DAY_MS,
        label: '6 weeks',
        description: 'Dopamine receptors begin healing',
      },
      {
        thresholdMs: 60 * DAY_MS,
        label: '2 months',
        description: 'Mental clarity fully restored',
      },
      {
        thresholdMs: 60 * DAY_MS,
        label: '2 months',
        description: 'Motivation returns to normal',
      },
      {
        thresholdMs: 90 * DAY_MS,
        label: '3 months',
        description: 'Cognitive function fully restored',
      },
      {
        thresholdMs: 90 * DAY_MS,
        label: '3 months',
        description: 'Blood circulation normalized',
      },
      {
        thresholdMs: 90 * DAY_MS,
        label: '3 months',
        description: 'Lung capacity increased significantly',
      },
      {
        thresholdMs: 120 * DAY_MS,
        label: '4 months',
        description: 'Brain chemistry stabilizes',
      },
      {
        thresholdMs: 180 * DAY_MS,
        label: '6 months',
        description: 'Long-term brain function restored',
      },
      {
        thresholdMs: 180 * DAY_MS,
        label: '6 months',
        description: 'Cardiovascular health improved',
      },
      {
        thresholdMs: 270 * DAY_MS,
        label: '9 months',
        description: 'Lung healing continues progressively',
      },
      {
        thresholdMs: 365 * DAY_MS,
        label: '1 year',
        description: 'Respiratory health greatly improved',
      },
      {
        thresholdMs: 365 * DAY_MS,
        label: '1 year',
        description: 'Overall health significantly better',
      },
      {
        thresholdMs: 730 * DAY_MS,
        label: '2 years',
        description: 'Long-term health risks reduced',
      },
      {
        thresholdMs: 1095 * DAY_MS,
        label: '3 years',
        description: 'Body fully recovered from effects',
      },
      {
        thresholdMs: 1825 * DAY_MS,
        label: '5 years',
        description: 'Health fully normalized',
      },
    ];

    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text }]}>Recovery Mode</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>You're on the right path</Text>
        </View>

        <View style={[styles.recoveryTimerCard, { backgroundColor: theme.card, borderColor: '#10B981' }]}>
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
          <View style={[styles.recoverySavingsCard, { backgroundColor: theme.card }]}>
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

        {/* 💰 Money saved chart – last 7 days (Recovery) */}
        {hasMoneySavedData && (
          <View style={[styles.recoverySpendingCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>💰 Money saved – last 7 days</Text>
            <BarChart
              data={moneySavedChartData}
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
              maxValue={Math.max(...moneySavedChartData.map((d) => d.value), 1)}
              roundedTop
              isAnimated
            />
            <Text style={[styles.savingsCaption, { color: theme.textSecondary }]}>
              Estimated daily savings based on your past average usage.
            </Text>
          </View>
        )}

        {/* Recovery stats only */}
        <View style={[styles.recoveryStatsCard, { backgroundColor: theme.card }]}>
          <View style={styles.recoveryStatItem}>
            <Text style={[styles.recoveryStatNumber, { color: '#10B981' }]}>
              {sobrietyTime.days}
            </Text>
            <Text style={[styles.recoveryStatLabel, { color: theme.textSecondary }]}>Days Clean</Text>
          </View>
          <View style={[styles.recoveryStatDivider, { backgroundColor: theme.border }]} />
          <View style={styles.recoveryStatItem}>
            <Text style={[styles.recoveryStatNumber, { color: '#10B981' }]}>
              {sobrietyTime.hours}h
            </Text>
            <Text style={[styles.recoveryStatLabel, { color: theme.textSecondary }]}>Hours</Text>
          </View>
          <View style={[styles.recoveryStatDivider, { backgroundColor: theme.border }]} />
          <View style={styles.recoveryStatItem}>
            <Text style={[styles.recoveryStatNumber, { color: '#10B981' }]}>
              {achievedCount}/{healthMilestones.length}
            </Text>
            <Text style={[styles.recoveryStatLabel, { color: theme.textSecondary }]}>Milestones</Text>
          </View>
          <View style={[styles.recoveryStatDivider, { backgroundColor: theme.border }]} />
          <View style={styles.recoveryStatItem}>
            <Text style={[styles.recoveryStatNumber, { color: '#10B981' }]}>
              {currencySymbol}{recoverySavings.estimated.toFixed(0)}
            </Text>
            <Text style={[styles.recoveryStatLabel, { color: theme.textSecondary }]}>Saved</Text>
          </View>
        </View>

        {/* 🦝 Image + message + mood ABOVE Health Timeline */}
        <View style={styles.recoveryImageContainer}>
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
                styles.recoveryMessageCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.recoveryMessageText, { color: theme.text }]}>{message}</Text>
            </View>
            {/* Mood Tracker Widget */}
            <MoodTracker />
          </View>
        </View>

        {/* Full Health Timeline from Recovery page */}
        <View style={styles.recoveryMilestones}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>Health Timeline</Text>
          <Text
            style={[
              styles.milestoneCardDescription,
              { color: theme.textSecondary, marginBottom: 8 },
            ]}
          >
            Recovery milestones and health benefits
          </Text>
          {fullHealthTimeline.map((milestone, index) => {
            const achieved = elapsedMs >= milestone.thresholdMs;
            return (
              <View
                key={`${milestone.label}-${index}`}
                style={[
                  styles.milestoneCard,
                  {
                    backgroundColor: achieved ? theme.card : theme.background,
                    borderColor: achieved ? '#10B981' : theme.border,
                    borderWidth: achieved ? 2 : 1,
                    opacity: achieved ? 1 : 0.5,
                  },
                ]}
              >
                <View style={styles.milestoneCardContent}>
                  <Text style={[styles.milestoneCardTitle, { color: theme.text }]}>
                    {milestone.label}
                  </Text>
                  <Text style={[styles.milestoneCardDescription, { color: theme.textSecondary }]}>
                    {milestone.description}
                  </Text>
                </View>
                {achieved && <Text style={styles.milestoneCardCheck}>✓</Text>}
              </View>
            );
          })}
        </View>

        {/* Exit button stays at the bottom */}
        <View style={styles.recoveryActions}>
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

      {/* Flip Card Container */}
      <TouchableOpacity onPress={handleFlipCard} activeOpacity={0.9} style={styles.flipCardContainer}>
        <View style={styles.flipCard}>
          {/* Front Side - Session Counter */}
          <Animated.View
            style={[
              styles.flipCardFace,
              {
                transform: [
                  {
                    rotateY: flipAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    }),
                  },
                ],
                opacity: flipAnimation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0, 0],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={
                isLimitExceeded
                  ? (settings.theme === 'dark' ? ['#7F1D1D', '#450A0A'] : ['#FEE2E2', '#FECACA'])
                  : [theme.primary + '10', theme.card]
              }
              style={[
                styles.countCard,
                {
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
              <Text style={[styles.countLabel, { color: isLimitExceeded && settings.theme === 'dark' ? '#FCA5A5' : theme.textSecondary }]}>sessions today</Text>
              {settings.dailyLimit && (
                <Text
                  style={[
                    styles.limitText,
                    { color: isDailyLimitExceeded ? (settings.theme === 'dark' ? '#FCA5A5' : '#EF4444') : (isLimitExceeded && settings.theme === 'dark' ? '#FCA5A5' : theme.textSecondary) },
                  ]}
                >
                  {todayCount} / {settings.dailyLimit} daily limit
                </Text>
              )}
              {settings.weeklyLimit && (
                <Text
                  style={[
                    styles.limitText,
                    { color: isWeeklyLimitExceeded ? (settings.theme === 'dark' ? '#FCA5A5' : '#EF4444') : (isLimitExceeded && settings.theme === 'dark' ? '#FCA5A5' : theme.textSecondary) },
                  ]}
                >
                  {weekSessions.length} / {settings.weeklyLimit} weekly limit
                </Text>
              )}
              {lastSession && lastMethod && (
                <View style={styles.lastSessionRow}>
                  <View style={styles.lastSessionContent}>
                    <Text style={[styles.lastSession, { color: isLimitExceeded && settings.theme === 'dark' ? '#FCA5A5' : theme.textSecondary }]}>Last: </Text>
                    <Image source={methodImages[lastMethod]} style={styles.lastSessionIcon} />
                    <Text
                      style={[
                        styles.lastSession,
                        { color: isLimitExceeded && settings.theme === 'dark' ? '#FCA5A5' : theme.textSecondary },
                      ]}
                    >
                      {new Date(lastSession.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Text>
                    <TouchableOpacity onPress={handleUndo} style={styles.undoButton}>
                      <Text style={[styles.undoText, { color: isLimitExceeded && settings.theme === 'dark' ? '#FCA5A5' : theme.textSecondary }]}>undo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <Text style={[styles.tapHint, { color: isLimitExceeded && settings.theme === 'dark' ? '#FCA5A5' : theme.textSecondary }]}>
                Tap for weekly stats
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Back Side - Weekly Insights */}
          <Animated.View
            style={[
              styles.flipCardFace,
              styles.flipCardBack,
              {
                transform: [
                  {
                    rotateY: flipAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['180deg', '360deg'],
                    }),
                  },
                ],
                opacity: flipAnimation.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [0, 0, 1, 1],
                }),
              },
            ]}
          >
            <LinearGradient
                colors={[theme.primary + '10', theme.card]}
                style={[styles.insightsCardFlipped, { borderColor: theme.primary }]}
              >
                <Text style={[styles.insightsTitle, { color: theme.text }]}>This Week</Text>

                {/* Weekly activity mini chart */}
                <View style={styles.weeklyBars}>
                  {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - dayOffset));
                    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
                    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
                    const daySessions = sessions.filter(s => s.timestamp >= dayStart && s.timestamp < dayEnd);
                    const maxSessions = Math.max(...[0, 1, 2, 3, 4, 5, 6].map(offset => {
                      const d = new Date();
                      d.setDate(d.getDate() - (6 - offset));
                      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
                      const end = start + 24 * 60 * 60 * 1000;
                      return sessions.filter(s => s.timestamp >= start && s.timestamp < end).length;
                    }), 1);
                    const barHeight = daySessions.length > 0 ? (daySessions.length / maxSessions) * 40 : 2;
                    const dayLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];

                    return (
                      <View key={dayOffset} style={styles.weeklyBarContainer}>
                        <View style={[styles.weeklyBar, {
                          height: barHeight,
                          backgroundColor: theme.primary,
                          opacity: daySessions.length > 0 ? 1 : 0.2,
                        }]} />
                        <Text style={[styles.weeklyBarLabel, { color: theme.textSecondary }]}>{dayLetter}</Text>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.insightsRow}>
                  <View style={styles.insightItem}>
                    <Ionicons name="flame" size={20} color={theme.primary} />
                    <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>Top</Text>
                    <Text style={[styles.insightValue, { color: theme.text }]}>
                      {weeklyInsights?.mostUsedMethod ?
                        weeklyInsights.mostUsedMethod.charAt(0).toUpperCase() + weeklyInsights.mostUsedMethod.slice(1)
                        : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.insightDivider} />
                  <View style={styles.insightItem}>
                    <Ionicons name="people" size={20} color={theme.primary} />
                    <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>Social</Text>
                    <Text style={[styles.insightValue, { color: theme.text }]}>
                      {weeklyInsights?.socialPercent ?? 0}%
                    </Text>
                  </View>
                  <View style={styles.insightDivider} />
                  <View style={styles.insightItem}>
                    <Ionicons name="calendar" size={20} color={theme.primary} />
                    <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>Streak</Text>
                    <Text style={[styles.insightValue, { color: theme.text }]}>
                      {weeklyInsights?.streak ?? 0} {(weeklyInsights?.streak ?? 0) === 1 ? 'day' : 'days'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.tapHint, { color: theme.textSecondary }]}>
                  Tap to return
                </Text>
              </LinearGradient>
          </Animated.View>
        </View>
      </TouchableOpacity>

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
        <Image
          source={currentImage}
          style={styles.raccoonImage}
          resizeMode="contain"
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

      {/* Mood Tracker Widget - Moved outside to prevent cutoff */}
      <MoodTracker />

      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <LinearGradient
                colors={[theme.primary + '15', 'transparent']}
                style={styles.modalHeaderGradient}
              >
                <View style={styles.modalTitleContainer}>
                  <View style={[styles.modalIconContainer, { backgroundColor: theme.primary + '20' }]}>
                    <Image
                      source={methodImages[selectedMethod]}
                      style={styles.modalIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                    Log {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Session
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                    Track your experience
                  </Text>
                </View>
              </LinearGradient>

              <View style={{ paddingHorizontal: 24 }}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>
                    🌿 Strain (optional)
                  </Text>
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
                  <Text style={[styles.inputLabel, { color: theme.text }]}>
                    ⚖️ Amount in grams (optional)
                  </Text>
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
                  <Text style={[styles.inputLabel, { color: theme.text }]}>
                    💰 Cost {currencySymbol} (optional)
                  </Text>
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
                    <Text style={[styles.inputLabel, { color: theme.text }]}>
                      👥 With friends?
                    </Text>
                    <Switch
                      value={isSocial}
                      onValueChange={setIsSocial}
                      trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
                      thumbColor={isSocial ? '#00D084' : '#F3F4F6'}
                    />
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.cancelButton,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.border,
                      },
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
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ToastNotification
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  // FLIP CARD FRONT SIDE - Session Counter
  countCard: {
    marginHorizontal: 20,        // EDIT: Left/right spacing of card
    borderRadius: 20,             // EDIT: Corner roundness
    padding: 18,                  // EDIT: Inside spacing (affects card height)
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    minHeight: 2,               // EDIT: Minimum card height
  },
  countNumber: {
    fontSize: 100,                // EDIT: Session number size
    fontWeight: 'bold',
  },
  countLabel: {
    fontSize: 16,                 // EDIT: "sessions today" text size
    marginTop: 1,                 // EDIT: Space above label
    fontWeight: 'bold',
  },
  lastSession: {
    fontSize: 16,
  },
  lastSessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,                // EDIT: Space above "Last session" row
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
    marginLeft: 8,
  },
  undoText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  limitText: {
    fontSize: 12,                 // EDIT: Daily/weekly limit text size
    marginTop: 8,                 // EDIT: Space above limit text
    fontWeight: '600',
  },
  insightsCard: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  insightItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  insightDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    opacity: 0.3,
  },
  insightLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  flipCardContainer: {
    marginHorizontal: 20,
    marginBottom: 0,
  },
  flipCard: {
    width: '100%',
    position: 'relative',
  },
  flipCardFace: {
    width: '100%',
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  // FLIP CARD BACK SIDE - Weekly Insights
  insightsCardFlipped: {
    borderRadius: 20,
    padding: 18,                  // EDIT: Inside spacing (affects card height)
    borderWidth: 2,
    minHeight: 240,               // EDIT: Minimum card height (MUST match countCard)
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  weeklyBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 60,                   // EDIT: Height of bar chart (affects card height)
    width: '100%',
    marginVertical: 16,           // EDIT: Space above/below bar chart
    paddingHorizontal: 8,
  },
  weeklyBarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    height: '100%',
  },
  weeklyBar: {
    width: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  weeklyBarLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  tapHint: {
    fontSize: 11,                 // EDIT: "Tap for weekly stats" text size
    marginTop: 12,                // EDIT: Space above hint (affects card height)
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
  },
  instructions: {
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 2,
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
    gap: 10,
    justifyContent: 'center',
    zIndex: 10,
  },
  methodButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  methodIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  methodLabel: {
    fontSize: 13,
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
    paddingBottom: 24,
    maxHeight: '85%',
  },
  modalHeaderGradient: {
    paddingTop: 24,
    paddingHorizontal: 24,
    marginHorizontal: -24,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalIcon: {
    width: 48,
    height: 48,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  textInput: {
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    marginTop: 28,
    paddingTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  logButton: {},
  logButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  sessionImageContainer: {
    alignItems: 'center',
    marginTop: -130,
    marginBottom: 8,
    paddingHorizontal: 20,
    zIndex: -1,
  },
  sessionContent: {
    alignItems: 'center',
    width: '100%',
  },
  raccoonImage: {
    width: 350,
    height: 350,
    alignSelf: 'center',
  },
  messageCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    marginTop: -120,
    marginHorizontal: 20,
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
  timerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 0,
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
    marginBottom: 4,
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
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  premiumFlipOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumFlipLockContent: {
    alignItems: 'center',
    gap: 8,
  },
  premiumFlipLockText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  premiumFlipLockSubtext: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  // 🧊 T-Break Mode Specific Styles
  tbreakTimerCard: {
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
  tbreakSavingsCard: {
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
  tbreakImageContainer: {
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  tbreakActions: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  tbreakMessageCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    marginTop: -40,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tbreakMessageText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  // 💚 Recovery Mode Specific Styles
  recoveryTimerCard: {
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
  recoverySavingsCard: {
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
  recoverySpendingCard: {
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
  recoveryImageContainer: {
    alignItems: 'center',
    marginTop: -30,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  recoveryActions: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  recoveryMessageCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    marginTop: -40,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recoveryMessageText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
