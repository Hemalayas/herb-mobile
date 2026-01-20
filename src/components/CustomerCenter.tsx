import React from 'react';
import { Alert, Platform } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';

interface CustomerCenterProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * CustomerCenter component using RevenueCat's built-in Customer Center UI
 *
 * Customer Center provides users with a self-service portal to:
 * - View their subscription details
 * - Manage billing and payment methods
 * - Change subscription plans
 * - Cancel or pause subscriptions
 * - Contact support
 * - View purchase history
 *
 * The UI is fully managed by RevenueCat and updates automatically.
 *
 * Note: Customer Center requires iOS 15.0+ or Android 5.0+
 */
export default function CustomerCenter({ visible, onClose }: CustomerCenterProps) {
  React.useEffect(() => {
    if (visible) {
      presentCustomerCenter();
    }
  }, [visible]);

  const presentCustomerCenter = async () => {
    try {
      // Check if Customer Center is available on this platform/version
      const isSupported = Platform.OS === 'ios' || Platform.OS === 'android';

      if (!isSupported) {
        Alert.alert(
          'Not Available',
          'Customer Center is only available on iOS and Android devices.',
          [{ text: 'OK', onPress: onClose }]
        );
        return;
      }

      await RevenueCatUI.presentCustomerCenter();

      console.log('ℹ️ Customer Center closed');
      onClose();
    } catch (error) {
      console.error('❌ Error presenting Customer Center:', error);
      Alert.alert(
        'Error',
        'Failed to load subscription management. Please try again.',
        [{ text: 'OK', onPress: onClose }]
      );
      onClose();
    }
  };

  // No UI needed - RevenueCat manages the entire Customer Center
  return null;
}
