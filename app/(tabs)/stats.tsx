import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useAppStore } from '../../src/store/appStore';
import { useTheme } from '../../src/context/ThemeContext';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { format, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

type TimeFilter = 'week' | 'month' | 'year' | 'lifetime';

const screenWidth = Dimensions.get('window').width;
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

export default function StatsScreen() {
  const theme = useTheme();
  const {
    sessions,
    loadSessions,
    activeTBreak,
    isRecoveryMode,
    sobrietyStartDate,
    tbreaks,
    settings,
  } = useAppStore();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');

  useEffect(() => {
    loadSessions();
  }, []);

  const currencySymbol = getCurrencySymbol((settings as any).defaultCurrency);

  // 🔁 Currency conversion helper
  // Expects settings.baseCurrency (e.g. 'ZAR') and settings.currencyRates or exchangeRates
  // like { ZAR: 1, USD: 0.053, EUR: 0.049, GBP: 0.041 }.
  // If no config is present, we just return the raw amount.
  const convertAmount = (amount: number): number => {
    const s = settings as any;
    const target = s.defaultCurrency || 'USD';
    const base = s.baseCurrency || 'ZAR';
    const rates = s.currencyRates || s.exchangeRates || {};

    if (!rates || !rates[base] || !rates[target]) {
      return amount;
    }
    if (base === target) return amount;

    const baseRate = rates[base] || 1;
    const targetRate = rates[target];

    // Normalise to base, then to target
    return (amount / baseRate) * targetRate;
  };

  // Filter sessions based on selected time period
  const filteredSessions = useMemo(() => {
    const now = new Date();
    let startDate: number;

    switch (timeFilter) {
      case 'week':
        startDate = startOfWeek(now).getTime();
        break;
      case 'month':
        startDate = startOfMonth(now).getTime();
        break;
      case 'year':
        startDate = startOfYear(now).getTime();
        break;
      case 'lifetime':
        return sessions;
    }

    return sessions.filter(s => s.timestamp >= startDate);
  }, [sessions, timeFilter]);

  // Solo vs social
  const socialStats = useMemo(() => {
    const solo = filteredSessions.filter(s => !s.social).length;
    const social = filteredSessions.filter(s => s.social).length;
    const data: { value: number; color: string; text: string }[] = [];

    if (solo > 0) {
      data.push({ value: solo, color: '#6366F1', text: `Solo · ${solo}` });
    }
    if (social > 0) {
      data.push({ value: social, color: '#22C55E', text: `Social · ${social}` });
    }
    return data;
  }, [filteredSessions]);

  // Busiest time of day
  const hourlyStats = useMemo(() => {
    const hourCounts: Record<number, number> = {};

    filteredSessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const timeRanges = [
      { label: 'Morning\n6–12', hours: [6, 7, 8, 9, 10, 11], color: '#F59E0B' },
      { label: 'Afternoon\n12–6', hours: [12, 13, 14, 15, 16, 17], color: '#22C55E' },
      { label: 'Evening\n6–12', hours: [18, 19, 20, 21, 22, 23], color: '#6366F1' },
      { label: 'Night\n12–6', hours: [0, 1, 2, 3, 4, 5], color: '#0EA5E9' },
    ];

    const data = timeRanges
      .map(range => ({
        value: range.hours.reduce(
          (sum, hour) => sum + (hourCounts[hour] || 0),
          0,
        ),
        label: range.label,
        frontColor: range.color,
      }))
      .filter(item => item.value > 0);

    return data;
  }, [filteredSessions]);

  // Methods
  const methodStats = useMemo(() => {
    const methodCounts: Record<string, number> = {};

    filteredSessions.forEach(session => {
      methodCounts[session.method] = (methodCounts[session.method] || 0) + 1;
    });

    const colors: Record<string, string> = {
      joint: '#22C55E',
      pen: '#0EA5E9',
      bong: '#6366F1',
      edible: '#F97316',
      dab: '#EF4444',
    };

    return Object.entries(methodCounts).map(([method, count]) => ({
      value: count,
      color: colors[method] ?? '#6B7280',
      text:
        `${method.charAt(0).toUpperCase() + method.slice(1)}` +
        ` · ${count}`,
    }));
  }, [filteredSessions]);

  // Sessions over time
  const sessionsOverTime = useMemo(() => {
    if (filteredSessions.length === 0) return [];

    const groupedData: Record<string, number> = {};

    filteredSessions.forEach(session => {
      const date = new Date(session.timestamp);
      let key: string;

      switch (timeFilter) {
        case 'week':
          key = format(date, 'EEE');
          break;
        case 'month':
          key = format(date, 'MMM d');
          break;
        case 'year':
          key = format(date, 'MMM');
          break;
        case 'lifetime':
          key = format(date, 'yyyy');
          break;
      }

      groupedData[key] = (groupedData[key] || 0) + 1;
    });

    const items = Object.entries(groupedData).map(([label, value]) => ({
      value,
      label,
      frontColor: '#22C55E',
    }));

    // keep order, but cap how many we show
    return items.slice(-10);
  }, [filteredSessions, timeFilter]);

  // Spending (filtered, base)
  const totalSpending = useMemo(
    () =>
      filteredSessions
        .filter(s => s.cost)
        .reduce((sum, s) => sum + (s.cost || 0), 0),
    [filteredSessions],
  );

  const totalSpendingDisplay = convertAmount(totalSpending);

  const spendingOverTime = useMemo(() => {
    if (filteredSessions.length === 0) return [];

    const groupedData: Record<string, number> = {};

    filteredSessions.forEach(session => {
      if (!session.cost) return;
      const date = new Date(session.timestamp);
      let key: string;

      switch (timeFilter) {
        case 'week':
          key = format(date, 'EEE');
          break;
        case 'month':
          key = format(date, 'MMM d');
          break;
        case 'year':
          key = format(date, 'MMM');
          break;
        case 'lifetime':
          key = format(date, 'yyyy');
          break;
      }

      groupedData[key] = (groupedData[key] || 0) + (session.cost || 0);
    });

    return Object.entries(groupedData)
      .map(([label, value]) => ({
        value: convertAmount(value),
        label,
        frontColor: '#F59E0B',
      }))
      .slice(-10);
  }, [filteredSessions, timeFilter, settings]);

  // Amount + strains
  const totalAmount = useMemo(
    () =>
      filteredSessions
        .filter(s => s.amount)
        .reduce((sum, s) => sum + (s.amount || 0), 0),
    [filteredSessions],
  );

  const uniqueStrains = useMemo(() => {
    const strains = new Set(
      filteredSessions.filter(s => s.strain).map(s => s.strain!),
    );
    return strains.size;
  }, [filteredSessions]);

  // Mood patterns
  const moodByMethod = useMemo(() => {
    const withMood = filteredSessions.filter(s => s.mood);
    if (withMood.length === 0) return null;

    const methodMoodMap: Record<string, Record<string, number>> = {};

    withMood.forEach(session => {
      if (!methodMoodMap[session.method]) {
        methodMoodMap[session.method] = {};
      }
      const mood = session.mood!;
      methodMoodMap[session.method][mood] =
        (methodMoodMap[session.method][mood] || 0) + 1;
    });

    return Object.entries(methodMoodMap).map(([method, moods]) => {
      const entries = Object.entries(moods);
      const topMood = entries.sort((a, b) => b[1] - a[1])[0];
      return {
        method,
        mood: topMood[0],
        count: topMood[1],
        total: entries.reduce((sum, [, count]) => sum + count, 0),
      };
    });
  }, [filteredSessions]);

  // Days sober (for health section)
  const daysSober = useMemo(() => {
    if (isRecoveryMode && sobrietyStartDate) {
      const elapsed = Date.now() - sobrietyStartDate;
      return Math.floor(elapsed / DAY_MS);
    } else if (activeTBreak) {
      const elapsed = Date.now() - activeTBreak.startDate;
      return Math.floor(elapsed / DAY_MS);
    }
    return 0;
  }, [isRecoveryMode, sobrietyStartDate, activeTBreak]);

  const healthMilestones = useMemo(
    () => [
      {
        days: 1,
        icon: '🌅',
        title: '24 hours',
        description: 'Carbon monoxide levels normalizing',
        achieved: daysSober >= 1,
      },
      {
        days: 2,
        icon: '🫁',
        title: '48 hours',
        description: 'Breathing becomes easier',
        achieved: daysSober >= 2,
      },
      {
        days: 3,
        icon: '👃',
        title: '72 hours',
        description: 'Taste & smell improving',
        achieved: daysSober >= 3,
      },
      {
        days: 7,
        icon: '😴',
        title: '1 week',
        description: 'Sleep quality improving',
        achieved: daysSober >= 7,
      },
      {
        days: 14,
        icon: '🧠',
        title: '2 weeks',
        description: 'Memory & focus sharpening',
        achieved: daysSober >= 14,
      },
      {
        days: 30,
        icon: '💚',
        title: '1 month',
        description: 'Lung capacity & clarity up',
        achieved: daysSober >= 30,
      },
      {
        days: 60,
        icon: '⚡',
        title: '2 months',
        description: 'Energy & motivation back',
        achieved: daysSober >= 60,
      },
      {
        days: 90,
        icon: '🎯',
        title: '3 months',
        description: 'Cognitive function improved',
        achieved: daysSober >= 90,
      },
    ],
    [daysSober],
  );

  // 💸 Average session cost (global, base, with settings override)
  const averageSessionCost = useMemo(() => {
    const manual = (settings as any).averageSessionCost;
    if (typeof manual === 'number' && manual > 0) return manual;

    const sessionsWithCost = sessions.filter(
      s => typeof s.cost === 'number' && (s.cost ?? 0) > 0,
    );
    if (sessionsWithCost.length === 0) return 0;

    const totalCost = sessionsWithCost.reduce(
      (sum, s) => sum + (s.cost || 0),
      0,
    );
    return totalCost / sessionsWithCost.length;
  }, [settings, sessions]);

  const averageSessionCostDisplay =
    averageSessionCost > 0 ? convertAmount(averageSessionCost) : 0;

  // 💸 Lifetime spend (estimated, all sessions, base)
  const lifetimeSpend = useMemo(() => {
    if (sessions.length === 0) return 0;
    return sessions.reduce((sum, s) => {
      if (typeof s.cost === 'number' && (s.cost ?? 0) > 0) {
        return sum + (s.cost || 0);
      }
      if (averageSessionCost > 0) {
        return sum + averageSessionCost;
      }
      return sum;
    }, 0);
  }, [sessions, averageSessionCost]);

  // 📈 Global average sessions per day (baseline for savings, non-currency)
  const avgSessionsPerDay = useMemo(() => {
    if (sessions.length === 0) return 0;

    const firstTs = sessions.reduce(
      (min, s) => (s.timestamp < min ? s.timestamp : min),
      sessions[0].timestamp,
    );
    const lastTs = sessions.reduce(
      (max, s) => (s.timestamp > max ? s.timestamp : max),
      sessions[0].timestamp,
    );

    const spanDays = Math.max(1, Math.round((lastTs - firstTs) / DAY_MS) + 1);
    return sessions.length / spanDays;
  }, [sessions]);

  // 💰 Lifetime savings from all T-Breaks (base)
  const lifetimeTBreakSavings = useMemo(() => {
    if (averageSessionCost <= 0 || avgSessionsPerDay <= 0 || tbreaks.length === 0)
      return 0;

    return tbreaks.reduce((sum, tbreak) => {
      const start = tbreak.startDate;
      const end =
        tbreak.endDate ??
        (tbreak.completed
          ? tbreak.startDate + tbreak.goalDays * DAY_MS
          : Date.now());

      if (!start || end <= start) return sum;

      const daysElapsed = Math.floor((end - start) / DAY_MS);
      if (daysElapsed <= 0) return sum;

      const estimatedSessions = avgSessionsPerDay * daysElapsed;
      const estimatedSavings = estimatedSessions * averageSessionCost;

      return sum + estimatedSavings;
    }, 0);
  }, [tbreaks, avgSessionsPerDay, averageSessionCost]);

  // 💚 Recovery savings (current recovery period only, base)
  const recoverySavings = useMemo(() => {
    if (!isRecoveryMode || !sobrietyStartDate) return 0;
    if (averageSessionCost <= 0 || avgSessionsPerDay <= 0) return 0;

    const daysElapsed = Math.max(
      0,
      Math.floor((Date.now() - sobrietyStartDate) / DAY_MS),
    );
    if (daysElapsed <= 0) return 0;

    const estimatedSessions = avgSessionsPerDay * daysElapsed;
    return estimatedSessions * averageSessionCost;
  }, [isRecoveryMode, sobrietyStartDate, avgSessionsPerDay, averageSessionCost]);

  const lifetimeSavings = lifetimeTBreakSavings + recoverySavings;
  const lifetimeSavingsDisplay = convertAmount(lifetimeSavings);

  // 📊 Savings chart (T-Breaks vs Recovery) – converted values
  const savingsChartData = useMemo(() => {
    const data: { label: string; value: number; frontColor: string }[] = [];
    if (lifetimeTBreakSavings > 0) {
      data.push({
        label: 'T-Breaks',
        value: convertAmount(lifetimeTBreakSavings),
        frontColor: '#3B82F6',
      });
    }
    if (recoverySavings > 0) {
      data.push({
        label: 'Recovery',
        value: convertAmount(recoverySavings),
        frontColor: '#22C55E',
      });
    }
    return data;
  }, [lifetimeTBreakSavings, recoverySavings, settings]);

  const hasSavingsData = savingsChartData.length > 0;

  const FilterButton = ({ filter, label }: { filter: TimeFilter; label: string }) => {
    const isActive = timeFilter === filter;
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive ? theme.primary : 'transparent',
          },
        ]}
        onPress={() => setTimeFilter(filter)}
      >
        <Text
          style={[
            styles.filterButtonText,
            {
              color: isActive ? '#FFFFFF' : theme.textSecondary,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Empty state
  if (sessions.length === 0) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Image
              source={require('../../assets/stats.png')}
              style={styles.headerIcon}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: theme.text }]}>Your Stats</Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Track your progress over time
          </Text>
        </View>

        <View style={styles.emptyState}>
          <Image
            source={require('../../assets/stats.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No data yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Log a few sessions on the Home screen and your insights will show up
            here.
          </Text>
        </View>
      </ScrollView>
    );
  }

  // MAIN UI
  const costSessionsCount = filteredSessions.filter(s => s.cost).length;
  const avgCostForPeriodDisplay =
    costSessionsCount > 0
      ? convertAmount(totalSpending) / costSessionsCount
      : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../assets/stats.png')}
            style={styles.headerIconLarge}
            resizeMode="contain"
          />
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Your Stats</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              A snapshot of how you’ve been using Herb
            </Text>
          </View>
        </View>
      </View>

      {/* TIME FILTER PILL BAR */}
      <View
        style={[
          styles.filterOuter,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <FilterButton filter="week" label="Week" />
        <FilterButton filter="month" label="Month" />
        <FilterButton filter="year" label="Year" />
        <FilterButton filter="lifetime" label="All time" />
      </View>

      {/* QUICK STATS STRIP */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.card,
            },
          ]}
        >
          <View style={[styles.statIconPill, { backgroundColor: 'rgba(34,197,94,0.12)' }]}>
            <Text style={styles.statEmoji}>📊</Text>
          </View>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sessions</Text>
          <Text style={[styles.statNumber, { color: '#22C55E' }]}>
            {filteredSessions.length}
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.card,
            },
          ]}
        >
          <View style={[styles.statIconPill, { backgroundColor: 'rgba(245,158,11,0.12)' }]}>
            <Text style={styles.statEmoji}>💰</Text>
          </View>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Spent</Text>
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
            {currencySymbol}{totalSpendingDisplay.toFixed(0)}
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.card,
            },
          ]}
        >
          <View style={[styles.statIconPill, { backgroundColor: 'rgba(99,102,241,0.12)' }]}>
            <Text style={styles.statEmoji}>🌿</Text>
          </View>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Consumed</Text>
          <Text style={[styles.statNumber, { color: '#6366F1' }]}>
            {totalAmount.toFixed(1)}g
          </Text>
        </View>
      </View>

      {/* USAGE TRENDS */}
      {sessionsOverTime.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Usage trend
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            How often you’ve been logging sessions
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <BarChart
              data={sessionsOverTime}
              width={screenWidth - 72}
              height={220}
              barWidth={sessionsOverTime.length > 5 ? 22 : 32}
              spacing={sessionsOverTime.length > 5 ? 10 : 16}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 9 }}
              noOfSections={4}
              maxValue={Math.max(...sessionsOverTime.map(s => s.value)) + 1}
              isAnimated
              animationDuration={700}
            />
          </View>
        </View>
      )}

      {/* SOLO VS SOCIAL */}
      {socialStats.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Solo vs social
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            How many sessions were with friends vs on your own
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <PieChart
              data={socialStats}
              donut
              radius={90}
              innerRadius={60}
              innerCircleColor={theme.card}
              showGradient
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text
                    style={[
                      styles.centerLabelText,
                      { color: theme.text },
                    ]}
                  >
                    {filteredSessions.length}
                  </Text>
                  <Text
                    style={[
                      styles.centerLabelSubtext,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Sessions
                  </Text>
                </View>
              )}
            />
            <View style={styles.legendContainer}>
              {socialStats.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.legendText,
                      { color: theme.text },
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* METHODS */}
      {methodStats.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Methods used
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Which ways you tend to consume
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <PieChart
              data={methodStats}
              donut
              radius={90}
              innerRadius={60}
              innerCircleColor={theme.card}
              showGradient
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text
                    style={[
                      styles.centerLabelText,
                      { color: theme.text },
                    ]}
                  >
                    {methodStats.length}
                  </Text>
                  <Text
                    style={[
                      styles.centerLabelSubtext,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Methods
                  </Text>
                </View>
              )}
            />
            <View style={styles.legendContainer}>
              {methodStats.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.legendText,
                      { color: theme.text },
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* BUSIEST TIME */}
      {hourlyStats.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Busiest time of day
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            When you usually log sessions
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <BarChart
              data={hourlyStats}
              width={screenWidth - 72}
              height={200}
              barWidth={48}
              spacing={12}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 9 }}
              noOfSections={4}
              maxValue={Math.max(...hourlyStats.map(h => h.value)) + 1}
            />
          </View>
        </View>
      )}

      {/* SPENDING */}
      {spendingOverTime.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Spending over time
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            How your costs have been trending
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <BarChart
              data={spendingOverTime}
              width={screenWidth - 72}
              height={200}
              barWidth={spendingOverTime.length > 5 ? 22 : 32}
              spacing={spendingOverTime.length > 5 ? 10 : 16}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 9 }}
              noOfSections={4}
              maxValue={Math.max(...spendingOverTime.map(s => s.value)) + 1}
              yAxisLabelPrefix={currencySymbol}
            />
          </View>
        </View>
      )}

      {/* 💰 MONEY SAVED (T-BREAK + RECOVERY) */}
      {(hasSavingsData || lifetimeSavings > 0) && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Money saved
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Estimated savings from your tolerance breaks and recovery
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.moneyRow}>
              <View style={styles.moneyItem}>
                <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>
                  Lifetime saved
                </Text>
                <Text style={[styles.moneyValue, { color: '#22C55E' }]}>
                  {currencySymbol}{lifetimeSavingsDisplay.toFixed(0)}
                </Text>
              </View>
              <View style={styles.moneyItem}>
                <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>
                  Avg cost / session
                </Text>
                <Text style={[styles.moneyValue, { color: theme.text }]}>
                  {averageSessionCostDisplay > 0
                    ? `${currencySymbol}${averageSessionCostDisplay.toFixed(2)}`
                    : '—'}
                </Text>
              </View>
            </View>

            {hasSavingsData && (
              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <BarChart
                  data={savingsChartData}
                  width={screenWidth - 72}
                  height={200}
                  barWidth={40}
                  spacing={30}
                  roundedTop
                  roundedBottom
                  hideRules
                  xAxisThickness={0}
                  yAxisThickness={0}
                  yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                  noOfSections={4}
                  maxValue={
                    Math.max(...savingsChartData.map(s => s.value)) || 1
                  }
                  yAxisLabelPrefix={currencySymbol}
                  isAnimated
                />
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: theme.textSecondary, marginTop: 8 },
                  ]}
                >
                  Based on your average session cost and how long you’ve stayed off.
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* HEALTH – ONLY WHEN T-BREAK/RECOVERY */}
      {(activeTBreak || isRecoveryMode) && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isRecoveryMode ? 'Recovery progress' : 'T-Break benefits'}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            What your body has been gaining back
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View
              style={[
                styles.soberDaysContainer,
                { borderBottomColor: theme.border },
              ]}
            >
              <Text
                style={[
                  styles.soberDaysNumber,
                  { color: isRecoveryMode ? '#22C55E' : '#3B82F6' },
                ]}
              >
                {daysSober}
              </Text>
              <Text
                style={[
                  styles.soberDaysLabel,
                  { color: theme.textSecondary },
                ]}
              >
                {daysSober === 1 ? 'day sober' : 'days sober'}
              </Text>
            </View>

            <View style={styles.milestonesContainer}>
              {healthMilestones.map((m, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.milestoneItem,
                    {
                      borderColor: m.achieved
                        ? isRecoveryMode
                          ? '#22C55E'
                          : '#3B82F6'
                        : theme.border,
                      backgroundColor: m.achieved
                        ? theme.background
                        : theme.card,
                      opacity: m.achieved ? 1 : 0.45,
                    },
                  ]}
                >
                  <Text style={styles.milestoneIcon}>{m.icon}</Text>
                  <View style={styles.milestoneContent}>
                    <Text
                      style={[
                        styles.milestoneTitle,
                        { color: theme.text },
                      ]}
                    >
                      {m.title}
                    </Text>
                    <Text
                      style={[
                        styles.milestoneDescription,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {m.description}
                    </Text>
                  </View>
                  {m.achieved && <Text style={styles.checkmark}>✓</Text>}
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* MOOD PATTERNS */}
      {moodByMethod && moodByMethod.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Mood patterns
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            How different methods usually make you feel
          </Text>

          <View style={styles.moodPatternsContainer}>
            {moodByMethod.map((item, idx) => {
              const moodEmojis: Record<string, string> = {
                relaxed: '😌',
                energized: '⚡',
                creative: '🎨',
                focused: '🎯',
                social: '🗣️',
                sleepy: '😴',
                euphoric: '😄',
                calm: '🧘',
              };
              const percentage = Math.round((item.count / item.total) * 100);

              return (
                <View
                  key={idx}
                  style={[styles.moodPatternCard, { backgroundColor: theme.card }]}
                >
                  <View style={styles.moodPatternHeader}>
                    <Text
                      style={[
                        styles.moodPatternMethod,
                        { color: theme.text },
                      ]}
                    >
                      {item.method.charAt(0).toUpperCase() + item.method.slice(1)}
                    </Text>
                    <Text
                      style={[
                        styles.moodPatternCount,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {item.count}/{item.total} sessions
                    </Text>
                  </View>

                  <View style={styles.moodPatternContent}>
                    <Text style={styles.moodPatternEmoji}>
                      {moodEmojis[item.mood] ?? '😊'}
                    </Text>
                    <View style={styles.moodPatternInfo}>
                      <Text
                        style={[
                          styles.moodPatternMood,
                          { color: theme.text },
                        ]}
                      >
                        {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                      </Text>
                      <View
                        style={[
                          styles.moodPatternBar,
                          { backgroundColor: theme.border },
                        ]}
                      >
                        <View
                          style={[
                            styles.moodPatternBarFill,
                            {
                              width: `${percentage}%`,
                              backgroundColor: theme.primary,
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.moodPatternPercentage,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {percentage}% of the time
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* ADDITIONAL INSIGHTS */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Extra insights
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          Little details that add more context
        </Text>

        <View style={[styles.insightCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>
            Unique strains tried
          </Text>
          <Text style={[styles.insightValue, { color: theme.primary }]}>
            {uniqueStrains}
          </Text>
        </View>

        <View style={[styles.insightCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>
            Avg cost per session
          </Text>
          <Text style={[styles.insightValue, { color: theme.primary }]}>
            {currencySymbol}
            {avgCostForPeriodDisplay.toFixed(2)}
          </Text>
        </View>

        <View style={[styles.insightCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>
            Avg amount per session
          </Text>
          <Text style={[styles.insightValue, { color: theme.primary }]}>
            {filteredSessions.filter(s => s.amount).length > 0
              ? (
                  totalAmount /
                  filteredSessions.filter(s => s.amount).length
                ).toFixed(2)
              : '0.00'}
            g
          </Text>
        </View>

        <View style={[styles.insightCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.insightLabel, { color: theme.textSecondary }]}>
            Most common method
          </Text>
          <Text style={[styles.insightValue, { color: theme.primary }]}>
            {methodStats.length > 0
              ? methodStats.reduce((max, m) =>
                  m.value > max.value ? m : max,
                ).text.split('·')[0]
              : 'N/A'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // HEADER
  header: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
  },
  headerIconLarge: {
    width: 42,
    height: 42,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },

  // FILTER
  filterOuter: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 999,
    padding: 4,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // QUICK STATS
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
  },
  statEmoji: {
    fontSize: 14,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.85,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },

  // GENERIC CARD / SECTION
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 10,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  // PIE CHART
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelText: {
    fontSize: 22,
    fontWeight: '700',
  },
  centerLabelSubtext: {
    fontSize: 11,
    marginTop: 3,
  },
  legendContainer: {
    width: '100%',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // EMPTY STATE
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyImage: {
    width: 90,
    height: 90,
    marginBottom: 12,
    opacity: 0.9,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    textAlign: 'center',
  },

  // HEALTH
  soberDaysContainer: {
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  soberDaysNumber: {
    fontSize: 40,
    fontWeight: '800',
  },
  soberDaysLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  milestonesContainer: {
    width: '100%',
    gap: 10,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  milestoneIcon: {
    fontSize: 26,
    marginRight: 10,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  milestoneDescription: {
    fontSize: 12,
  },
  checkmark: {
    fontSize: 18,
    marginLeft: 6,
  },

  // MOOD PATTERNS
  moodPatternsContainer: {
    gap: 10,
  },
  moodPatternCard: {
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  moodPatternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  moodPatternMethod: {
    fontSize: 15,
    fontWeight: '700',
  },
  moodPatternCount: {
    fontSize: 11,
  },
  moodPatternContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  moodPatternEmoji: {
    fontSize: 30,
  },
  moodPatternInfo: {
    flex: 1,
  },
  moodPatternMood: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  moodPatternBar: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 4,
  },
  moodPatternBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  moodPatternPercentage: {
    fontSize: 11,
  },

  // EXTRA INSIGHTS
  insightCard: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  insightLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '700',
  },

  // MONEY
  moneyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
    gap: 16,
  },
  moneyItem: {
    flex: 1,
  },
  moneyValue: {
    fontSize: 18,
    fontWeight: '700',
  },
});
