import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { getOfferings, purchasePackage, restorePurchases } from '../services/revenueCat';
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

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
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);

  useEffect(() => {
    if (visible) {
      loadOfferings();
    }
  }, [visible]);

  const loadOfferings = async () => {
    setLoading(true);
    const currentOffering = await getOfferings();
    setOffering(currentOffering);
    if (currentOffering && currentOffering.availablePackages.length > 0) {
      // Select monthly package by default
      const monthly = currentOffering.availablePackages.find(
        (pkg) => pkg.packageType === 'MONTHLY'
      );
      setSelectedPackage(monthly || currentOffering.availablePackages[0]);
    }
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setPurchasing(true);
    const result = await purchasePackage(selectedPackage);
    setPurchasing(false);

    if (result && !result.userCancelled) {
      Alert.alert('Success! 🎉', 'Your subscription is now active');
      onPurchaseComplete?.();
      onClose();
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    const customerInfo = await restorePurchases();
    setPurchasing(false);

    if (customerInfo) {
      const hasActiveEntitlements = Object.keys(customerInfo.entitlements.active).length > 0;
      if (hasActiveEntitlements) {
        Alert.alert('Success! 🎉', 'Your purchases have been restored');
        onPurchaseComplete?.();
        onClose();
      } else {
        Alert.alert('No purchases found', 'You don\'t have any active subscriptions to restore');
      }
    }
  };

  const features = [
    { icon: '📊', title: 'Advanced Analytics', description: 'Detailed insights and trends' },
    { icon: '🎯', title: 'Custom Goals', description: 'Set and track personalized goals' },
    { icon: '💾', title: 'Cloud Backup', description: 'Never lose your data' },
    { icon: '🎨', title: 'Premium Themes', description: 'Exclusive color schemes' },
    { icon: '📈', title: 'Export Data', description: 'Export your stats anytime' },
    { icon: '⚡', title: 'Priority Support', description: 'Get help when you need it' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={[theme.primary + '20', 'transparent']}
              style={styles.header}
            >
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={[styles.closeButtonText, { color: theme.text }]}>✕</Text>
              </TouchableOpacity>

              <Text style={[styles.title, { color: theme.text }]}>
                Unlock Premium 🚀
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Get the most out of Herb
              </Text>
            </LinearGradient>

            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <View key={index} style={[styles.featureRow, { backgroundColor: theme.card }]}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <View style={styles.featureText}>
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

            {loading ? (
              <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 32 }} />
            ) : offering && offering.availablePackages.length > 0 ? (
              <View style={styles.packagesContainer}>
                {offering.availablePackages.map((pkg) => {
                  const isSelected = selectedPackage?.identifier === pkg.identifier;
                  return (
                    <TouchableOpacity
                      key={pkg.identifier}
                      style={[
                        styles.packageCard,
                        {
                          backgroundColor: theme.card,
                          borderColor: isSelected ? theme.primary : theme.border,
                          borderWidth: isSelected ? 2 : 1,
                        },
                      ]}
                      onPress={() => setSelectedPackage(pkg)}
                    >
                      <View style={styles.packageInfo}>
                        <Text style={[styles.packageTitle, { color: theme.text }]}>
                          {pkg.product.title}
                        </Text>
                        <Text style={[styles.packageDescription, { color: theme.textSecondary }]}>
                          {pkg.product.description}
                        </Text>
                      </View>
                      <Text style={[styles.packagePrice, { color: theme.primary }]}>
                        {pkg.product.priceString}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <Text style={[styles.errorText, { color: theme.textSecondary }]}>
                No subscriptions available at the moment
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.purchaseButton,
                { backgroundColor: theme.primary, opacity: purchasing ? 0.6 : 1 },
              ]}
              onPress={handlePurchase}
              disabled={purchasing || !selectedPackage}
            >
              {purchasing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.purchaseButtonText}>
                  Start Free Trial
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={purchasing}
            >
              <Text style={[styles.restoreButtonText, { color: theme.textSecondary }]}>
                Restore Purchases
              </Text>
            </TouchableOpacity>

            <Text style={[styles.termsText, { color: theme.textSecondary }]}>
              Cancel anytime. Terms and privacy policy apply.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
  },
  packagesContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
    gap: 12,
  },
  packageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  purchaseButton: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restoreButton: {
    marginHorizontal: 24,
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  termsText: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 24,
    fontSize: 12,
    textAlign: 'center',
  },
  errorText: {
    marginHorizontal: 24,
    marginVertical: 32,
    fontSize: 14,
    textAlign: 'center',
  },
});
