import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/appStore';
import type { MoodType, CravingIntensity } from '../types';

interface MoodTrackerProps {
  compact?: boolean; // If true, show inline; if false, show as floating widget
}

export default function MoodTracker({ compact = false }: MoodTrackerProps) {
  const theme = useTheme();
  const { addMoodEntry, todaysMoodCount } = useAppStore();

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [hasCraving, setHasCraving] = useState(false);
  const [cravingIntensity, setCravingIntensity] = useState<CravingIntensity>('none');

  const moods: { value: MoodType; emoji: string; label: string; color: string }[] = [
    { value: 'happy', emoji: '😊', label: 'Happy', color: '#10B981' },
    { value: 'calm', emoji: '😌', label: 'Calm', color: '#06B6D4' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', color: '#6B7280' },
    { value: 'anxious', emoji: '😰', label: 'Anxious', color: '#F59E0B' },
    { value: 'stressed', emoji: '😤', label: 'Stressed', color: '#EF4444' },
    { value: 'sad', emoji: '😔', label: 'Sad', color: '#8B5CF6' },
  ];

  const cravingLevels: { value: CravingIntensity; label: string; color: string }[] = [
    { value: 'none', label: 'None', color: '#10B981' },
    { value: 'mild', label: 'Mild', color: '#84CC16' },
    { value: 'moderate', label: 'Moderate', color: '#F59E0B' },
    { value: 'strong', label: 'Strong', color: '#F97316' },
    { value: 'intense', label: 'Intense', color: '#EF4444' },
  ];

  const handleQuickLog = async (mood: MoodType) => {
    await addMoodEntry({ mood });
    Alert.alert('Logged! 📝', `Mood logged as ${mood}`);
  };

  const handleDetailedLog = async () => {
    if (!selectedMood) {
      Alert.alert('Select a mood', 'Please select how you\'re feeling');
      return;
    }

    await addMoodEntry({
      mood: selectedMood,
      intensity,
      note: note.trim() || undefined,
      hasCraving,
      cravingIntensity: hasCraving ? cravingIntensity : undefined,
    });

    // Reset form
    setSelectedMood(null);
    setIntensity(5);
    setNote('');
    setHasCraving(false);
    setCravingIntensity('none');
    setShowDetailModal(false);

    Alert.alert('Logged! 📝', 'Your mood and feelings have been recorded');
  };

  if (compact) {
    // Compact inline version for stats page
    return (
      <View style={[styles.compactContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.compactTitle, { color: theme.text }]}>
          How are you feeling? 💭
        </Text>
        <View style={styles.compactMoodRow}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.value}
              style={[styles.compactMoodButton, { borderColor: theme.border }]}
              onPress={() => handleQuickLog(mood.value)}
            >
              <Text style={styles.compactMoodEmoji}>{mood.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.detailsButton, { backgroundColor: theme.primary + '20' }]}
          onPress={() => setShowDetailModal(true)}
        >
          <Text style={[styles.detailsButtonText, { color: theme.primary }]}>
            + Add Details
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Floating widget version for home screens
  return (
    <>
      <LinearGradient
        colors={[theme.primary + '10', theme.card]}
        style={[styles.floatingWidget, { borderColor: theme.border }]}
      >
        <View style={styles.widgetHeader}>
          <Text style={[styles.widgetTitle, { color: theme.text }]}>
            💭 Quick Mood Check
          </Text>
          {todaysMoodCount > 0 && (
            <View style={[styles.countBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.countBadgeText}>{todaysMoodCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.widgetMoodRow}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.widgetMoodButton,
                { backgroundColor: theme.background, borderColor: theme.border },
              ]}
              onPress={() => handleQuickLog(mood.value)}
            >
              <Text style={styles.widgetMoodEmoji}>{mood.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.widgetDetailsButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowDetailModal(true)}
        >
          <Text style={styles.widgetDetailsButtonText}>
            Add Details & Cravings
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Detailed Mood Modal */}
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
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                    How Are You Feeling? 💭
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                    Track your mood & cravings
                  </Text>
                </View>
              </LinearGradient>

              <View style={{ paddingHorizontal: 24 }}>
                {/* Mood Selection */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>
                    😊 Select your mood
                  </Text>
                  <View style={styles.moodGrid}>
                    {moods.map((mood) => {
                      const isSelected = selectedMood === mood.value;
                      return (
                        <TouchableOpacity
                          key={mood.value}
                          style={[
                            styles.moodButton,
                            {
                              backgroundColor: isSelected ? mood.color + '20' : theme.inputBackground,
                              borderColor: isSelected ? mood.color : theme.border,
                            },
                          ]}
                          onPress={() => setSelectedMood(mood.value)}
                        >
                          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                          <Text
                            style={[
                              styles.moodLabel,
                              { color: isSelected ? mood.color : theme.text },
                            ]}
                          >
                            {mood.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Intensity Slider */}
                {selectedMood && (
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>
                      💪 Intensity: {intensity}/10
                    </Text>
                    <View style={styles.intensityButtons}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={[
                            styles.intensityButton,
                            {
                              backgroundColor: intensity >= level ? theme.primary : theme.inputBackground,
                              borderColor: intensity >= level ? theme.primary : theme.border,
                            },
                          ]}
                          onPress={() => setIntensity(level)}
                        >
                          <Text
                            style={[
                              styles.intensityButtonText,
                              { color: intensity >= level ? '#FFFFFF' : theme.textSecondary },
                            ]}
                          >
                            {level}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Craving Tracking */}
                <View style={styles.inputGroup}>
                  <TouchableOpacity
                    style={[
                      styles.cravingToggle,
                      {
                        backgroundColor: hasCraving ? theme.primary + '20' : theme.inputBackground,
                        borderColor: hasCraving ? theme.primary : theme.border,
                      },
                    ]}
                    onPress={() => setHasCraving(!hasCraving)}
                  >
                    <Text style={styles.cravingToggleEmoji}>
                      {hasCraving ? '🌿' : '✨'}
                    </Text>
                    <Text style={[styles.cravingToggleText, { color: theme.text }]}>
                      {hasCraving ? 'Experiencing cravings' : 'No cravings'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {hasCraving && (
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>
                      🌡️ Craving intensity
                    </Text>
                    <View style={styles.cravingLevels}>
                      {cravingLevels.slice(1).map((level) => (
                        <TouchableOpacity
                          key={level.value}
                          style={[
                            styles.cravingLevelButton,
                            {
                              backgroundColor:
                                cravingIntensity === level.value
                                  ? level.color + '20'
                                  : theme.inputBackground,
                              borderColor:
                                cravingIntensity === level.value ? level.color : theme.border,
                            },
                          ]}
                          onPress={() => setCravingIntensity(level.value)}
                        >
                          <Text
                            style={[
                              styles.cravingLevelText,
                              {
                                color:
                                  cravingIntensity === level.value ? level.color : theme.text,
                              },
                            ]}
                          >
                            {level.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Notes */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>
                    📝 Notes (optional)
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
                    value={note}
                    onChangeText={setNote}
                    placeholder="What's on your mind?"
                    placeholderTextColor={theme.textSecondary}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Buttons */}
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
                    style={[styles.modalButton, { backgroundColor: theme.primary }]}
                    onPress={handleDetailedLog}
                  >
                    <Text style={styles.logButtonText}>Log Mood</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Compact version styles
  compactContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  compactMoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  compactMoodButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactMoodEmoji: {
    fontSize: 24,
  },
  detailsButton: {
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Floating widget styles
  floatingWidget: {
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  widgetMoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  widgetMoodButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetMoodEmoji: {
    fontSize: 24,
  },
  widgetDetailsButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  widgetDetailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: '90%',
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
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
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  intensityButtons: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  intensityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  cravingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  cravingToggleEmoji: {
    fontSize: 28,
  },
  cravingToggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cravingLevels: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  cravingLevelButton: {
    flex: 1,
    minWidth: 70,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  cravingLevelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1.5,
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  logButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
