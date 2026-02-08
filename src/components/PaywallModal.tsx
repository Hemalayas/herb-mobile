import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePremium } from '../context/PremiumContext';
import { getOfferings, purchasePackage } from '../services/revenueCat';
import type { PurchasesPackage } from 'react-native-purchases';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseComplete?: () => void;
}

export default function PaywallModal({
  visible,
  onClose,
  onPurchaseComplete,
}: PaywallModalProps) {
  const { checkPremiumStatus } = usePremium();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [annualPackage, setAnnualPackage] = useState<PurchasesPackage | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'monthly' | 'annual'>('annual');

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (visible) {
      loadOfferings();
    }
  }, [visible]);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      const offerings = await getOfferings();

      if (!offerings) {
        Alert.alert('Error', 'Unable to load subscription options');
        onClose();
        return;
      }

      // Find monthly and annual packages
      const monthly = offerings.availablePackages.find(
        (pkg) => pkg.packageType === 'MONTHLY'
      );
      const annual = offerings.availablePackages.find(
        (pkg) => pkg.packageType === 'ANNUAL'
      );

      setMonthlyPackage(monthly || null);
      setAnnualPackage(annual || null);
    } catch (error) {
      console.error('Error loading offerings:', error);
      Alert.alert('Error', 'Failed to load subscription options');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    const pkg = selectedPackage === 'monthly' ? monthlyPackage : annualPackage;

    if (!pkg) {
      Alert.alert('Error', 'Selected package not available');
      return;
    }

    try {
      setPurchasing(true);
      const result = await purchasePackage(pkg);

      if (result?.userCancelled) {
        // User cancelled - just close
        return;
      }

      if (result?.customerInfo) {
        // Success!
        await checkPremiumStatus();
        Alert.alert(
          'Welcome to Herb Pro! 🎉',
          'Your premium features are now unlocked!',
          [
            {
              text: 'Continue',
              onPress: () => {
                onPurchaseComplete?.();
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, isDark && styles.containerDark]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.textDark]}>
            Herb Pro
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00D084" />
            </View>
          ) : (
            <>
              {/* Features List */}
              <View style={styles.featuresContainer}>
                <Text style={[styles.featuresTitle, isDark && styles.textDark]}>
                  Unlock Premium Features
                </Text>

                <Feature
                  icon="moon"
                  title="Dark Mode"
                  description="Easy on the eyes, day or night"
                  isDark={isDark}
                />
                <Feature
                  icon="trophy"
                  title="Exclusive Badges"
                  description="40+ premium achievement badges"
                  isDark={isDark}
                />
                <Feature
                  icon="stats-chart"
                  title="Advanced Analytics"
                  description="Detailed insights and trends"
                  isDark={isDark}
                />
                <Feature
                  icon="heart"
                  title="Mood Tracking"
                  description="Track and understand your patterns"
                  isDark={isDark}
                />
              </View>

              {/* Subscription Options */}
              <View style={styles.packagesContainer}>
                {/* Annual Package */}
                {annualPackage && (
                  <TouchableOpacity
                    style={[
                      styles.packageCard,
                      selectedPackage === 'annual' && styles.packageCardSelected,
                      isDark && styles.packageCardDark,
                    ]}
                    onPress={() => setSelectedPackage('annual')}
                  >
                    <View style={styles.bestValueBadge}>
                      <Text style={styles.bestValueText}>BEST VALUE</Text>
                    </View>
                    <View style={styles.packageHeader}>
                      <Text style={[styles.packageTitle, isDark && styles.textDark]}>
                        Annual
                      </Text>
                      <Text style={[styles.packagePrice, isDark && styles.textDark]}>
                        ${(annualPackage.product.price / 12).toFixed(2)}/mo
                      </Text>
                    </View>
                    <Text style={[styles.packageSubtext, isDark && styles.subtextDark]}>
                      ${annualPackage.product.price}/year • Save 50%
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Monthly Package */}
                {monthlyPackage && (
                  <TouchableOpacity
                    style={[
                      styles.packageCard,
                      selectedPackage === 'monthly' && styles.packageCardSelected,
                      isDark && styles.packageCardDark,
                    ]}
                    onPress={() => setSelectedPackage('monthly')}
                  >
                    <View style={styles.packageHeader}>
                      <Text style={[styles.packageTitle, isDark && styles.textDark]}>
                        Monthly
                      </Text>
                      <Text style={[styles.packagePrice, isDark && styles.textDark]}>
                        ${monthlyPackage.product.price}/mo
                      </Text>
                    </View>
                    <Text style={[styles.packageSubtext, isDark && styles.subtextDark]}>
                      Billed monthly
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Subscribe Button */}
              <TouchableOpacity
                style={[styles.subscribeButton, purchasing && styles.subscribeButtonDisabled]}
                onPress={handlePurchase}
                disabled={purchasing}
              >
                {purchasing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.subscribeButtonText}>
                    Start 3-Day Free Trial
                  </Text>
                )}
              </TouchableOpacity>

              {/* Fine Print */}
              <Text style={[styles.finePrint, isDark && styles.subtextDark]}>
                After your free trial, you'll be charged{' '}
                {selectedPackage === 'annual'
                  ? `$${annualPackage?.product.price}/year`
                  : `$${monthlyPackage?.product.price}/month`}
                . Cancel anytime in your account settings.
              </Text>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

interface FeatureProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  isDark: boolean;
}

function Feature({ icon, title, description, isDark }: FeatureProps) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={24} color="#00D084" />
      </View>
      <View style={styles.featureText}>
        <Text style={[styles.featureTitle, isDark && styles.textDark]}>{title}</Text>
        <Text style={[styles.featureDescription, isDark && styles.subtextDark]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  featuresContainer: {
    marginTop: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e6f9f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  packagesContainer: {
    marginTop: 32,
    gap: 12,
  },
  packageCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packageCardDark: {
    backgroundColor: '#2a2a2a',
  },
  packageCardSelected: {
    borderColor: '#00D084',
    backgroundColor: '#e6f9f3',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#00D084',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestValueText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00D084',
  },
  packageSubtext: {
    fontSize: 14,
    color: '#666',
  },
  subscribeButton: {
    backgroundColor: '#00D084',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  finePrint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
  },
  textDark: {
    color: '#fff',
  },
  subtextDark: {
    color: '#999',
  },
});