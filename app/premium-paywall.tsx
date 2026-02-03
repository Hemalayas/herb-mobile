import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/context/ThemeContext';
import { useAppStore } from '../src/store/appStore';
import { usePremium } from '../src/context/PremiumContext';
import PaywallModal from '../src/components/PaywallModal';
import { useState } from 'react';

interface PremiumFeature {
  icon: string;
  title: string;
  description: string;
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: '🏆',
    title: '50+ Achievement Badges',
    description: 'Unlock exclusive badges for your journey',
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    description: 'Easy on the eyes, day or night',
  },
  {
    icon: '📊',
    title: 'Advanced Statistics',
    description: 'Deep insights into your patterns and trends',
  },
  {
    icon: '♾️',
    title: 'Unlimited Tracking',
    description: 'No limits on sessions or mood entries',
  },
  {
    icon: '☁️',
    title: 'Cloud Backup',
    description: 'Never lose your data (coming soon)',
  },
];

export default function PremiumPaywallScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { updateSettings } = useAppStore();
  const { isPremium, isLoading } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleContinueFree = async () => {
    await updateSettings({ hasCompletedOnboarding: true });
    router.replace('/(tabs)');
  };

  const handleStartTrial = () => {
    setShowPaywall(true);
  };

  // If user is already premium, redirect to main app
  if (isPremium && !isLoading) {
    handleContinueFree();
    return null;
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={require('../assets/level2.png')}
            style={styles.mascot}
            resizeMode="contain"
          />

          <View style={styles.comingSoonBadge}>
            <LinearGradient
              colors={['#FCD34D', '#F59E0B'] as const}
              style={styles.comingSoonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.comingSoonText}>COMING SOON</Text>
            </LinearGradient>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            Unlock Premium
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Get the most out of your mindful journey
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {premiumFeatures.map((feature, index) => (
            <View
              key={index}
              style={[styles.featureCard, { backgroundColor: theme.card }]}
            >
              <View style={[styles.featureIconContainer, { backgroundColor: theme.primary + '15' }]}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing Section */}
        <View style={[styles.pricingCard, { backgroundColor: theme.card }]}>
          <LinearGradient
            colors={[theme.primary + '20', theme.primary + '05'] as [string, string]}
            style={styles.pricingGradient}
          >
            <Text style={[styles.pricingTitle, { color: theme.text }]}>
              Premium Pricing
            </Text>
            <View style={styles.pricingOptions}>
              <View style={styles.pricingOption}>
                <Text style={[styles.pricingAmount, { color: theme.primary }]}>
                  $4.99
                </Text>
                <Text style={[styles.pricingPeriod, { color: theme.textSecondary }]}>
                  /month
                </Text>
              </View>
              <Text style={[styles.pricingOr, { color: theme.textSecondary }]}>
                or
              </Text>
              <View style={styles.pricingOption}>
                <Text style={[styles.pricingAmount, { color: theme.primary }]}>
                  $29.99
                </Text>
                <Text style={[styles.pricingPeriod, { color: theme.textSecondary }]}>
                  /year
                </Text>
                <View style={[styles.saveBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.saveText}>Save 50%</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Small Print */}
        <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>
          Premium features launching soon. Be the first to know!
        </Text>
      </ScrollView>

      {/* Bottom CTA Section */}
      <View style={[styles.ctaContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        {/* Premium Trial Button */}
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={handleStartTrial}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[theme.primary, theme.primary + 'DD'] as [string, string]}
            style={styles.premiumButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.premiumButtonText}>
              Start Premium
            </Text>
            <Text style={styles.premiumButtonSubtext}>
              Unlock all features
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Free Version Button */}
        <TouchableOpacity
          style={[styles.freeButton, { backgroundColor: theme.card }]}
          onPress={handleContinueFree}
          activeOpacity={0.7}
        >
          <Text style={[styles.freeButtonText, { color: theme.text }]}>
            Continue with Free Version
          </Text>
        </TouchableOpacity>
      </View>

      {/* Paywall Modal */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPurchaseComplete={handleContinueFree}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 200,
    paddingHorizontal: 20,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mascot: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  comingSoonBadge: {
    marginBottom: 16,
  },
  comingSoonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  pricingCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  pricingGradient: {
    padding: 24,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  pricingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pricingOption: {
    alignItems: 'center',
    position: 'relative',
  },
  pricingAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  pricingPeriod: {
    fontSize: 14,
    marginTop: 4,
  },
  pricingOr: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveBadge: {
    position: 'absolute',
    top: -8,
    right: -20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    gap: 12,
  },
  buttonWrapper: {
    width: '100%',
  },
  premiumButton: {
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
  premiumButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  premiumButtonSubtext: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  freeButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  freeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
