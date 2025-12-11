import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API Keys - REPLACE THESE WITH YOUR ACTUAL KEYS
const API_KEYS = {
  ios: 'your_ios_api_key_here',
  android: 'your_android_api_key_here',
};

export const initRevenueCat = async () => {
  try {
    if (Platform.OS === 'ios') {
      await Purchases.configure({ apiKey: API_KEYS.ios });
    } else if (Platform.OS === 'android') {
      await Purchases.configure({ apiKey: API_KEYS.android });
    }

    // Enable debug logs in development
    if (__DEV__) {
      await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    console.log('✅ RevenueCat initialized');
  } catch (error) {
    console.error('❌ Error initializing RevenueCat:', error);
  }
};

export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current;
    }
    return null;
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return null;
  }
};

export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<{ customerInfo: CustomerInfo; userCancelled: boolean } | null> => {
  try {
    const { customerInfo, productIdentifier } = await Purchases.purchasePackage(pkg);
    console.log('✅ Purchase successful:', productIdentifier);
    return { customerInfo, userCancelled: false };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('User cancelled purchase');
      return { customerInfo: error.customerInfo, userCancelled: true };
    }
    console.error('❌ Purchase error:', error);
    return null;
  }
};

export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    console.log('✅ Purchases restored');
    return customerInfo;
  } catch (error) {
    console.error('❌ Error restoring purchases:', error);
    return null;
  }
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error getting customer info:', error);
    return null;
  }
};

export const isSubscriptionActive = async (): Promise<boolean> => {
  try {
    const customerInfo = await getCustomerInfo();
    if (!customerInfo) return false;

    // Check if user has any active entitlements
    const entitlements = customerInfo.entitlements.active;
    return Object.keys(entitlements).length > 0;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};

export const identifyUser = async (userId: string) => {
  try {
    await Purchases.logIn(userId);
    console.log('✅ User identified:', userId);
  } catch (error) {
    console.error('❌ Error identifying user:', error);
  }
};

export const logoutUser = async () => {
  try {
    await Purchases.logOut();
    console.log('✅ User logged out');
  } catch (error) {
    console.error('❌ Error logging out user:', error);
  }
};
