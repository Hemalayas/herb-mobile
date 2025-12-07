import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Session } from '../types';
import { VictoryPie, VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from 'victory-native';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, getHours } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface Props {
  sessions: Session[];
}

export default function SessionCharts({ sessions }: Props) {
  const theme = useTheme();

  // Method Distribution Data
  const methodCounts = sessions.reduce((acc, session) => {
    acc[session.method] = (acc[session.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const methodData = Object.entries(methodCounts).map(([method, count]) => ({
    x: method.charAt(0).toUpperCase() + method.slice(1),
    y: count,
  }));

  const methodColors = {
    Joint: '#10B981',
    Pen: '#3B82F6',
    Bong: '#8B5CF6',
    Edible: '#F59E0B',
    Dab: '#EF4444',
  };

  // Weekly Activity Data
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyData = daysOfWeek.map(day => {
    const dayStart = day.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const count = sessions.filter(s => s.timestamp >= dayStart && s.timestamp < dayEnd).length;
    
    return {
      x: format(day, 'EEE'),
      y: count,
    };
  });

  // Time of Day Distribution
  const timeRanges = [
    { label: '12AM-6AM', start: 0, end: 6 },
    { label: '6AM-12PM', start: 6, end: 12 },
    { label: '12PM-6PM', start: 12, end: 18 },
    { label: '6PM-12AM', start: 18, end: 24 },
  ];

  const timeData = timeRanges.map(range => {
    const count = sessions.filter(s => {
      const hour = getHours(new Date(s.timestamp));
      return hour >= range.start && hour < range.end;
    }).length;
    
    return {
      x: range.label,
      y: count,
    };
  });

  return (
    <View style={styles.container}>
      {/* Method Distribution Pie Chart */}
      {methodData.length > 0 && (
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Method Distribution</Text>
          <VictoryPie
            data={methodData}
            width={width - 80}
            height={220}
            colorScale={Object.values(methodColors)}
            innerRadius={50}
            labelRadius={70}
            style={{
              labels: { fill: theme.text, fontSize: 12, fontWeight: 'bold' },
            }}
          />
        </View>
      )}

      {/* Weekly Activity Bar Chart */}
      <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.chartTitle, { color: theme.text }]}>This Week's Activity</Text>
        <VictoryChart
          width={width - 80}
          height={220}
          theme={VictoryTheme.material}
          domainPadding={20}
        >
          <VictoryAxis
            style={{
              tickLabels: { fill: theme.textSecondary, fontSize: 10 },
              axis: { stroke: theme.border },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fill: theme.textSecondary, fontSize: 10 },
              axis: { stroke: theme.border },
              grid: { stroke: theme.border, strokeDasharray: '4,4' },
            }}
          />
          <VictoryBar
            data={weeklyData}
            style={{
              data: { fill: theme.primary },
            }}
            cornerRadius={{ top: 8 }}
            barWidth={30}
          />
        </VictoryChart>
      </View>

      {/* Time of Day Distribution */}
      <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.chartTitle, { color: theme.text }]}>Time of Day</Text>
        <VictoryChart
          width={width - 80}
          height={220}
          theme={VictoryTheme.material}
          domainPadding={20}
        >
          <VictoryAxis
            style={{
              tickLabels: { fill: theme.textSecondary, fontSize: 9, angle: -15 },
              axis: { stroke: theme.border },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fill: theme.textSecondary, fontSize: 10 },
              axis: { stroke: theme.border },
              grid: { stroke: theme.border, strokeDasharray: '4,4' },
            }}
          />
          <VictoryBar
            data={timeData}
            style={{
              data: { fill: '#8B5CF6' },
            }}
            cornerRadius={{ top: 8 }}
            barWidth={40}
          />
        </VictoryChart>
      </View>

      {/* Social vs Solo Stats */}
      {sessions.some(s => s.social !== undefined) && (
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Social vs Solo</Text>
          <View style={styles.socialStats}>
            <View style={styles.socialStatItem}>
              <Text style={styles.socialIcon}>👥</Text>
              <Text style={[styles.socialLabel, { color: theme.textSecondary }]}>Social</Text>
              <Text style={[styles.socialCount, { color: theme.primary }]}>
                {sessions.filter(s => s.social === true).length}
              </Text>
            </View>
            <View style={styles.socialStatItem}>
              <Text style={styles.socialIcon}>🧘</Text>
              <Text style={[styles.socialLabel, { color: theme.textSecondary }]}>Solo</Text>
              <Text style={[styles.socialCount, { color: theme.primary }]}>
                {sessions.filter(s => s.social === false).length}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Spending Stats */}
      {sessions.some(s => s.cost) && (
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Total Spending</Text>
          <Text style={[styles.spendingAmount, { color: theme.primary }]}>
            ${sessions.reduce((sum, s) => sum + (s.cost || 0), 0).toFixed(2)}
          </Text>
          <Text style={[styles.spendingLabel, { color: theme.textSecondary }]}>
            Avg: ${(sessions.reduce((sum, s) => sum + (s.cost || 0), 0) / sessions.length).toFixed(2)} per session
          </Text>
        </View>
      )}

      {/* Strain Stats */}
      {sessions.some(s => s.strain) && (
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Strain Variety</Text>
          <Text style={[styles.strainCount, { color: theme.primary }]}>
            {new Set(sessions.filter(s => s.strain).map(s => s.strain!.toLowerCase())).size}
          </Text>
          <Text style={[styles.strainLabel, { color: theme.textSecondary }]}>unique strains tried</Text>
        </View>
      )}

      {/* Amount Consumed */}
      {sessions.some(s => s.amount) && (
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Total Consumed</Text>
          <Text style={[styles.amountTotal, { color: theme.primary }]}>
            {sessions.reduce((sum, s) => sum + (s.amount || 0), 0).toFixed(2)}g
          </Text>
          <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
            Avg: {(sessions.reduce((sum, s) => sum + (s.amount || 0), 0) / sessions.filter(s => s.amount).length).toFixed(2)}g per session
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  socialStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  socialStatItem: {
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  socialLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  socialCount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  spendingAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  spendingLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  strainCount: {
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  strainLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  amountTotal: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  amountLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
});