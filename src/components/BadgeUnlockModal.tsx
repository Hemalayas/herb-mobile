import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAppStore } from '../store/appStore';
import { BADGE_DEFINITIONS, getBadgeImage } from '../utils/badges';
import { markBadgeAsShown } from '../services/storage';

export default function BadgeUnlockModal() {
  const { newlyUnlockedBadges, clearUnlockedBadge } = useAppStore();

  const currentBadgeId = newlyUnlockedBadges[0];
  const badgeDef = BADGE_DEFINITIONS.find(b => b.id === currentBadgeId);

  if (!currentBadgeId || !badgeDef) return null;

  const handleClose = async () => {
    // Mark this badge as shown so it won't appear again on app restart
    await markBadgeAsShown(currentBadgeId);
    clearUnlockedBadge(currentBadgeId);
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Image
              source={getBadgeImage(badgeDef.imageId)}
              style={styles.badgeImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>Badge Unlocked! 🎉</Text>
          <Text style={styles.badgeName}>{badgeDef.name}</Text>
          <Text style={styles.description}>{badgeDef.description}</Text>
          
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  iconContainer: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00D084',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#00D084',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});