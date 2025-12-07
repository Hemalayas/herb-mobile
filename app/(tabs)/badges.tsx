import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useAppStore } from '../../src/store/appStore';
import { useEffect, useState } from 'react';
import { BADGE_DEFINITIONS, getBadgeImage } from '../../src/utils/badges';
import { Badge } from '../../src/types';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../src/context/ThemeContext';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 12;
const GAP = 10;
const CARD_WIDTH = (width - (CONTAINER_PADDING * 2) - GAP) / 2;

export default function BadgesScreen() {
  const theme = useTheme();
  const { badges, loadBadges, sessions } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sobriety' | 'tbreak' | 'usage' | 'time' | 'financial' | 'strains' | 'volume' | 'variety' | 'special'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    loadBadges();
  }, [sessions]);

  const categories = [
    { value: 'all' as const, label: 'All', icon: '🏆' },
    { value: 'sobriety' as const, label: 'Sobriety', icon: '💚' },
    { value: 'tbreak' as const, label: 'T-Break', icon: '🧘' },
    { value: 'usage' as const, label: 'Usage', icon: '📊' },
    { value: 'time' as const, label: 'Time', icon: '⏰' },
    { value: 'variety' as const, label: 'Variety', icon: '🎨' },
    { value: 'special' as const, label: 'Special', icon: '⭐' },
  ];

  const filteredBadges = badges.filter(badge => {
    if (selectedCategory === 'all') return true;
    const def = BADGE_DEFINITIONS.find(d => d.id === badge.id);
    return def?.category === selectedCategory;
  });

  const unlockedCount = badges.filter(b => b.unlockedAt).length;
  const totalCount = badges.length;

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>🏆 Badges</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {unlockedCount} / {totalCount} unlocked
          </Text>
        </View>

        <View style={[styles.progressCard, { backgroundColor: theme.card }]}>
          <View style={[styles.progressBarBackground, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(unlockedCount / totalCount) * 100}%`, backgroundColor: theme.primary },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.primary }]}>
            {Math.round((unlockedCount / totalCount) * 100)}% Complete
          </Text>
        </View>

        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryScroll}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    selectedCategory === cat.value && { borderColor: theme.primary, backgroundColor: theme.inputBackground },
                  ]}
                  onPress={() => setSelectedCategory(cat.value)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      { color: theme.textSecondary },
                      selectedCategory === cat.value && { color: theme.primary },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.badgesGrid}>
          {filteredBadges.map(badge => {
            const def = BADGE_DEFINITIONS.find(d => d.id === badge.id);
            const isUnlocked = !!badge.unlockedAt;
            const currentProgress = Math.round((badge.progress / 100) * badge.requirement);

            return (
              <TouchableOpacity
                key={badge.id}
                activeOpacity={0.8}
                onPress={() => setSelectedBadge(badge)}
                style={[
                  styles.badgeCard,
                  { backgroundColor: theme.card, borderColor: theme.primary },
                  !isUnlocked && { borderColor: theme.border, backgroundColor: theme.inputBackground }
                ]}
              >
                <View style={styles.badgeImageContainer}>
                  <Image
                    source={getBadgeImage(def?.imageId || '')}
                    style={[
                      styles.badgeImage,
                      !isUnlocked && styles.badgeImageLocked,
                    ]}
                    resizeMode="contain"
                  />
                  {isUnlocked && (
                    <View style={[styles.badgeCheckmark, { backgroundColor: theme.primary }]}>
                      <Text style={styles.badgeCheckmarkText}>✓</Text>
                    </View>
                  )}
                </View>
                
                <Text 
                  style={[
                    styles.badgeName,
                    { color: theme.text },
                    !isUnlocked && { color: theme.textSecondary }
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {badge.name}
                </Text>

                {!isUnlocked && currentProgress > 0 ? (
                   <View style={[styles.badgeProgressBar, { backgroundColor: theme.border }]}>
                     <View style={[styles.badgeProgressFill, { width: `${badge.progress}%`, backgroundColor: theme.primary }]} />
                   </View>
                ) : null}

                {isUnlocked && badge.id !== 'first_spark' && badge.timesEarned && badge.timesEarned > 1 ? (
                  <View style={styles.timesEarnedContainer}>
                    <Text style={[styles.timesEarnedText, { color: theme.primary }]}>×{badge.timesEarned}</Text>
                  </View>
                ) : isUnlocked ? (
                  <Text style={[styles.unlockedMiniText, { color: theme.primary }]}>UNLOCKED</Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredBadges.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No badges in this category yet</Text>
          </View>
        )}
      </ScrollView>

      {selectedBadge && (
        <View style={styles.overlayContainer}>
          <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
          
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            onPress={() => setSelectedBadge(null)} 
            activeOpacity={1}
          />

          <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: theme.inputBackground }]} 
              onPress={() => setSelectedBadge(null)}
            >
              <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>✕</Text>
            </TouchableOpacity>

            <View style={styles.detailImageContainer}>
              <Image 
                source={getBadgeImage(selectedBadge.id)} 
                style={[
                  styles.detailImage,
                  !selectedBadge.unlockedAt && { opacity: 0.5, tintColor: '#888' }
                ]}
                resizeMode="contain"
              />
            </View>

            <Text style={[styles.detailTitle, { color: theme.text }]}>{selectedBadge.name}</Text>
            
            <View style={styles.detailStatusContainer}>
              {selectedBadge.unlockedAt ? (
                <View style={styles.detailUnlockedBadge}>
                  <Text style={styles.detailUnlockedText}>✓ UNLOCKED</Text>
                </View>
              ) : (
                <View style={[styles.detailLockedBadge, { backgroundColor: theme.inputBackground }]}>
                  <Text style={[styles.detailLockedText, { color: theme.textSecondary }]}>LOCKED</Text>
                </View>
              )}
            </View>

            <Text style={[styles.detailDescription, { color: theme.textSecondary }]}>{selectedBadge.description}</Text>

            {selectedBadge.unlockedAt && selectedBadge.id !== 'first_spark' && selectedBadge.timesEarned && selectedBadge.timesEarned > 1 && (
              <View style={[styles.detailTimesEarnedBadge, { backgroundColor: theme.inputBackground }]}>
                <Text style={[styles.detailTimesEarnedText, { color: theme.primary }]}>Earned {selectedBadge.timesEarned} times!</Text>
              </View>
            )}

            {!selectedBadge.unlockedAt && (
              <View style={styles.detailProgressContainer}>
                <View style={[styles.detailProgressBarBg, { backgroundColor: theme.border }]}>
                  <View 
                    style={[
                      styles.detailProgressBarFill, 
                      { width: `${selectedBadge.progress}%`, backgroundColor: theme.primary }
                    ]} 
                  />
                </View>
                <Text style={[styles.detailProgressText, { color: theme.textSecondary }]}>
                  {Math.round((selectedBadge.progress / 100) * selectedBadge.requirement)} / {selectedBadge.requirement}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 6,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: CONTAINER_PADDING,
    gap: GAP,
    paddingBottom: 50,
  },
  badgeCard: {
    width: CARD_WIDTH,
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 6,
  },
  badgeImageContainer: {
    position: 'relative',
    marginBottom: 8,
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  badgeImageLocked: {
    opacity: 0.25,
    tintColor: '#9CA3AF',
  },
  badgeCheckmark: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 10,
  },
  badgeCheckmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeName: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeProgressBar: {
    width: '80%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  badgeProgressFill: {
    height: '100%',
  },
  unlockedMiniText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  timesEarnedContainer: {
    marginTop: 4,
  },
  timesEarnedText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  detailCard: {
    width: width * 0.9,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailImageContainer: {
    width: width * 0.75,
    height: width * 0.75,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailTitle: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  detailStatusContainer: {
    marginBottom: 20,
  },
  detailUnlockedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailUnlockedText: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  detailLockedBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailLockedText: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  detailDescription: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  detailProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  detailProgressBarBg: {
    width: '100%',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 10,
  },
  detailProgressBarFill: {
    height: '100%',
  },
  detailProgressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailTimesEarnedBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  detailTimesEarnedText: {
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});