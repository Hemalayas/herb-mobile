import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, SlideInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/appStore';
import { BADGE_DEFINITIONS, getBadgeImage } from '../utils/badges';
import { markBadgeAsShown } from '../services/storage';

const { width } = Dimensions.get('window');

export default function BadgeUnlockModal() {
  const { newlyUnlockedBadges, clearUnlockedBadge } = useAppStore();

  // Get the first badge in the queue
  const currentBadgeId = newlyUnlockedBadges[0];
  const badgeDef = BADGE_DEFINITIONS.find(b => b.id === currentBadgeId);

  // Trigger Haptics when a new badge appears
  useEffect(() => {
    if (currentBadgeId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [currentBadgeId]);

  if (!currentBadgeId || !badgeDef) return null;

  const handleClose = async () => {
    // Light vibration on button press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Mark as shown in storage
    await markBadgeAsShown(currentBadgeId);
    
    // Remove from Zustand store (this might trigger the next badge in queue)
    clearUnlockedBadge(currentBadgeId);
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Blurred Background */}
      <BlurView intensity={25} tint="dark" style={styles.absoluteOverlay}>
        
        {/* Animated Card - Slides up from bottom */}
        <Animated.View 
          entering={SlideInDown.springify().damping(15)} 
          style={styles.modal}
        >
          
          {/* Animated Badge - Zooms in */}
          <Animated.View 
            entering={ZoomIn.delay(200).springify()}
            style={styles.iconContainer}
          >
            <Image
              source={getBadgeImage(badgeDef.imageId)}
              style={styles.badgeImage}
              contentFit="contain"
            />
          </Animated.View>
          
          {/* Text fades in slightly later */}
          <Animated.View entering={FadeIn.delay(300)} style={styles.textContainer}>
            <Text style={styles.title}>Badge Unlocked! 🎉</Text>
            <Text style={styles.badgeName}>{badgeDef.name}</Text>
            <Text style={styles.description}>{badgeDef.description}</Text>
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Awesome!</Text>
          </TouchableOpacity>

        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  absoluteOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)', // Fallback for Android if blur is low support
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 140,
    height: 140,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9CA3AF', // Gray-400
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  badgeName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2937', // Gray-900
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280', // Gray-500
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#00D084',
    borderRadius: 20,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#00D084',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});