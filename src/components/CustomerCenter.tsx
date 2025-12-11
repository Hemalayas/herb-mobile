import React from 'react';
import { Alert, Platform } from 'react-native';
import RevenueCatUI, { CUSTOMER_CENTER_RESULT } from 'react-native-purchases-ui';

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

      const result = await RevenueCatUI.presentCustomerCenter();

      // Handle customer center result
      switch (result) {
        case CUSTOMER_CENTER_RESULT.RESTORED:
          console.log('✅ Purchases restored from Customer Center');
          Alert.alert(
            'Purchases Restored',
            'Your purchases have been successfully restored.',
            [{ text: 'OK', onPress: onClose }]
          );
          break;

        case CUSTOMER_CENTER_RESULT.CLOSED:
          console.log('ℹ️ Customer Center closed');
          onClose();
          break;

        case CUSTOMER_CENTER_RESULT.ERROR:
          console.error('❌ Customer Center error');
          Alert.alert(
            'Error',
            'Something went wrong. Please try again.',
            [{ text: 'OK', onPress: onClose }]
          );
          onClose();
          break;

        default:
          onClose();
          break;
      }
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
