import { useState, useEffect } from 'react';
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
} from 'react-native';
import { useAppStore } from '../../src/store/appStore';
import { useTheme } from '../../src/context/ThemeContext';
import type { ConsumptionMethod } from '../../src/types';

export default function HomeScreen() {
  const theme = useTheme();
  const { addSession, todayCount, sessions, loadSessions } = useAppStore();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<ConsumptionMethod>('joint');
  
  const [strain, setStrain] = useState('');
  const [amount, setAmount] = useState('');
  const [cost, setCost] = useState('');
  const [isSocial, setIsSocial] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const methods: { value: ConsumptionMethod; icon: string; label: string }[] = [
    { value: 'joint', icon: '🚬', label: 'Joint' },
    { value: 'pen', icon: '💨', label: 'Pen' },
    { value: 'bong', icon: '🌿', label: 'Bong' },
    { value: 'edible', icon: '🍪', label: 'Edible' },
    { value: 'dab', icon: '💎', label: 'Dab' },
  ];

  const handleQuickLog = (method: ConsumptionMethod) => {
    addSession({
      method,
      timestamp: Date.now(),
      social: false,
    });
    Alert.alert('✅ Logged!', `${method.charAt(0).toUpperCase() + method.slice(1)} session logged`);
  };

  const handleLongPress = (method: ConsumptionMethod) => {
    setSelectedMethod(method);
    setShowDetailModal(true);
  };

  const handleDetailedLog = () => {
    addSession({
      method: selectedMethod,
      timestamp: Date.now(),
      strain: strain.trim() || undefined,
      amount: amount ? parseFloat(amount) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      social: isSocial ? true : false,
      notes: notes.trim() || undefined,
    });

    setStrain('');
    setAmount('');
    setCost('');
    setIsSocial(false);
    setNotes('');
    setShowDetailModal(false);

    Alert.alert('✅ Logged!', 'Detailed session logged');
  };

  const lastSession = sessions[0];
  const lastMethod = lastSession?.method;
  const lastIcon = methods.find(m => m.value === lastMethod)?.icon || '✨';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.text }]}>Hey there! 👋</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Ready to track?</Text>
      </View>

      <View style={[styles.countCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
        <Text style={[styles.countNumber, { color: theme.primary }]}>{todayCount}</Text>
        <Text style={[styles.countLabel, { color: theme.textSecondary }]}>sessions today</Text>
        {lastSession && (
          <Text style={[styles.lastSession, { color: theme.textSecondary }]}>
            Last: {lastIcon} {new Date(lastSession.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>

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
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <Text style={[styles.methodLabel, { color: theme.text }]}>{method.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {methods.find(m => m.value === selectedMethod)?.icon} Log {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Session
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Strain (optional)</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
                  value={strain}
                  onChangeText={setStrain}
                  placeholder="e.g., Blue Dream"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Amount in grams (optional)</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="e.g., 1.5"
                  keyboardType="decimal-pad"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Cost $ (optional)</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
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
                  style={[styles.textInput, styles.textArea, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="How are you feeling?"
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.inputBackground }]}
                  onPress={() => setShowDetailModal(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.logButton, { backgroundColor: theme.primary }]}
                  onPress={handleDetailedLog}
                >
                  <Text style={styles.logButtonText}>Log Session</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 30,
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
    padding: 30,
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
    marginTop: 12,
  },
  instructions: {
    marginTop: 30,
    marginBottom: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  methodIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
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
});