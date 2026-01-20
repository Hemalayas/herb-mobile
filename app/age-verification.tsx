import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AGE_VERIFIED_KEY = '@age_verified';

export default function AgeVerificationScreen() {
  const theme = useTheme();
  const router = useRouter();

  const handleAgeConfirm = async (isOfAge: boolean) => {
    if (isOfAge) {
      try {
        await AsyncStorage.setItem(AGE_VERIFIED_KEY, 'true');
        router.replace('/onboarding');
      } catch (error) {
        console.error('Error saving age verification:', error);
      }
    } else {
      Alert.alert(
        'Age Requirement',
        'You must be 21 years or older to use this app. Cannabis use is restricted to adults only.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* App Icon/Mascot */}
        <Image
          source={require('../assets/level1.png')}
          style={styles.mascot}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={[styles.title, { color: theme.text }]}>
          Age Verification Required
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          To use this app, you must confirm that you are of legal age to consume cannabis in your jurisdiction.
        </Text>

        {/* Legal Notice */}
        <View style={[styles.noticeCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.noticeIcon]}>⚠️</Text>
          <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
            This app is intended for adults 21 years of age or older. Cannabis laws vary by location.
            It is your responsibility to ensure compliance with local laws.
          </Text>
        </View>

        {/* Question */}
        <Text style={[styles.question, { color: theme.text }]}>
          Are you 21 years of age or older?
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => handleAgeConfirm(true)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[theme.primary, theme.primary + 'DD'] as [string, string]}
              style={styles.yesButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.yesButtonText}>Yes, I'm 21+</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.noButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => handleAgeConfirm(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.noButtonText, { color: theme.textSecondary }]}>
              No, I'm under 21
            </Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>
          By continuing, you acknowledge that you have read and agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: 160,
    height: 160,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  noticeCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  noticeIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  buttonWrapper: {
    width: '100%',
  },
  yesButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  yesButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  noButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  noButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
  },
});
