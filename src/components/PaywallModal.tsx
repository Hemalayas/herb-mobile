import React, { useState } from 'react';
import { Alert } from 'react-native';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { usePremium } from '../context/PremiumContext';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseComplete?: () => void;
}

/**
 * PaywallModal component using RevenueCat's built-in Paywall UI
 *
 * This component uses RevenueCat's managed paywall which:
 * - Automatically displays your configured offerings
 * - Handles purchase flow and errors
 * - Includes restore purchases functionality
 * - Updates with remote config changes (no app update needed)
 * - Follows platform design guidelines
 *
 * To configure your paywall:
 * 1. Go to RevenueCat dashboard
 * 2. Navigate to Paywalls section
 * 3. Create and customize your paywall
 * 4. Attach it to your offering
 */
export default function PaywallModal({
  visible,
  onClose,
  onPurchaseComplete,
}: PaywallModalProps) {
  const { checkPremiumStatus } = usePremium();
  const [isPresenting, setIsPresenting] = useState(false);

  React.useEffect(() => {
    if (visible && !isPresenting) {
      presentPaywall();
    }
  }, [visible]);

  const presentPaywall = async () => {
    if (isPresenting) return;

    try {
      setIsPresenting(true);
      const paywallResult = await RevenueCatUI.presentPaywall();

      // Handle paywall result
      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          console.log('✅ Purchase successful or restored');

          // Refresh premium status
          await checkPremiumStatus();

          Alert.alert(
            paywallResult === PAYWALL_RESULT.PURCHASED ? 'Welcome to Herb Pro! 🎉' : 'Restored Successfully!',
            paywallResult === PAYWALL_RESULT.PURCHASED
              ? 'Your premium features are now unlocked!'
              : 'Your purchases have been restored',
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
          break;

        case PAYWALL_RESULT.CANCELLED:
          console.log('ℹ️ User cancelled paywall');
          onClose();
          break;

        case PAYWALL_RESULT.NOT_PRESENTED:
          console.warn('⚠️ Paywall not presented');
          Alert.alert(
            'Unavailable',
            'Subscriptions are not available at the moment. Please try again later.',
            [{ text: 'OK', onPress: onClose }]
          );
          break;

        case PAYWALL_RESULT.ERROR:
          console.error('❌ Paywall error');
          Alert.alert(
            'Error',
            'Something went wrong. Please try again.',
            [{ text: 'OK', onPress: onClose }]
          );
          break;
      }
    } catch (error) {
      console.error('❌ Error presenting paywall:', error);
      Alert.alert(
        'Error',
        'Failed to load subscription options. Please try again.',
        [{ text: 'OK', onPress: onClose }]
      );
      onClose();
    } finally {
      setIsPresenting(false);
    }
  };

  // No UI needed - RevenueCat manages the entire paywall
  return null;
}
