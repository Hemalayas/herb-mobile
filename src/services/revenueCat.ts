import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  PurchasesStoreProduct,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// -----------------------------------------------------------------------------
// RevenueCat Configuration
// -----------------------------------------------------------------------------

// ✅ iOS Public SDK key (from RevenueCat -> API keys)
const IOS_API_KEY = 'appl_ylUXQEiTQWRWuacGjhEKjucyrki';

// ✅ Android Public SDK key (from RevenueCat -> API keys)  <-- ADD THIS
const ANDROID_API_KEY = 'goog_jQcUtBktBUqRLecHitWfuIZfAey'; // TODO: paste your goog_... key

// ✅ MUST MATCH RevenueCat entitlement IDENTIFIER exactly (not display name)
const ENTITLEMENT_ID = 'Herb Pro';

// Small helper
const getApiKeyForPlatform = () => {
  const key = Platform.OS === 'ios' ? IOS_API_KEY : ANDROID_API_KEY;

  // Guard so Android doesn’t silently misbehave
  if (Platform.OS === 'android' && (!ANDROID_API_KEY || ANDROID_API_KEY.includes('XXXX'))) {
    throw new Error(
      'RevenueCat Android API key is missing. Paste your goog_... key into ANDROID_API_KEY in src/services/revenueCat.ts'
    );
  }

  return key;
};

/**
 * Initialize RevenueCat SDK
 * Should be called once at app startup
 */
export const initRevenueCat = async () => {
  try {
    const apiKey = getApiKeyForPlatform();

    Purchases.configure({ apiKey });

    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    console.log('✅ RevenueCat initialized successfully', { platform: Platform.OS });
  } catch (error) {
    console.error('❌ Error initializing RevenueCat:', error);
    throw error;
  }
};

/**
 * Get current offerings (products)
 * Returns the current offering which contains packages (monthly, yearly, lifetime)
 */
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    const offerings = await Purchases.getOfferings();

    if (offerings.current) {
      console.log('✅ Offerings loaded:', {
        identifier: offerings.current.identifier,
        packagesCount: offerings.current.availablePackages.length,
      });
      return offerings.current;
    }

    console.warn('⚠️ No current offering found');
    return null;
  } catch (error) {
    console.error('❌ Error fetching offerings:', error);
    return null;
  }
};

/**
 * Purchase a specific package
 */
export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<{ customerInfo: CustomerInfo | null; userCancelled: boolean } | null> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    console.log('✅ Purchase successful:', {
      pkgIdentifier: pkg.identifier,
      productId: pkg.product.identifier,

    });
    return { customerInfo, userCancelled: false };
  } catch (error: any) {
    // RevenueCat sets `userCancelled` for user-initiated cancellations
    if (error?.userCancelled) {
      console.log('ℹ️ User cancelled purchase');
      return { customerInfo: null, userCancelled: true };
    }
    console.error('❌ Purchase error:', error);
    return null;
  }
};

/**
 * Restore previous purchases
 */
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

/**
 * Get current customer info
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('❌ Error getting customer info:', error);
    return null;
  }
};

/**
 * Check if user has active Herb Pro entitlement
 */
export const hasHerbPro = async (): Promise<boolean> => {
  try {
    const customerInfo = await getCustomerInfo();
    if (!customerInfo) return false;

    const herbProEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    if (herbProEntitlement) {
      console.log('✅ User has Herb Pro:', {
        productIdentifier: herbProEntitlement.productIdentifier,
        willRenew: herbProEntitlement.willRenew,
        periodType: herbProEntitlement.periodType,
        isSandbox: herbProEntitlement.isSandbox,
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ Error checking Herb Pro status:', error);
    return false;
  }
};

/**
 * Check if user has any active subscription
 */
export const isSubscriptionActive = async (): Promise<boolean> => {
  try {
    const customerInfo = await getCustomerInfo();
    if (!customerInfo) return false;

    return Object.keys(customerInfo.entitlements.active).length > 0;
  } catch (error) {
    console.error('❌ Error checking subscription status:', error);
    return false;
  }
};

/**
 * Identify user (for cross-platform support)
 */
export const identifyUser = async (userId: string): Promise<CustomerInfo | null> => {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    console.log('✅ User identified:', userId);
    return customerInfo;
  } catch (error) {
    console.error('❌ Error identifying user:', error);
    return null;
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.logOut();

    console.log('✅ User logged out');
    return customerInfo;
  } catch (error) {
    console.error('❌ Error logging out user:', error);
    return null;
  }
};

/**
 * Get subscription details for display
 */
export const getSubscriptionDetails = async () => {
  try {
    const customerInfo = await getCustomerInfo();
    if (!customerInfo) return null;

    const herbPro = customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (!herbPro) return null;

    return {
      productIdentifier: herbPro.productIdentifier,
      willRenew: herbPro.willRenew,
      periodType: herbPro.periodType, // NORMAL, TRIAL, INTRO
      expirationDate: herbPro.expirationDate,
      unsubscribeDetectedAt: herbPro.unsubscribeDetectedAt,
      billingIssueDetectedAt: herbPro.billingIssueDetectedAt,
      isSandbox: herbPro.isSandbox,
    };
  } catch (error) {
    console.error('❌ Error getting subscription details:', error);
    return null;
  }
};

/**
 * Check if user is in trial period
 */
export const isInTrialPeriod = async (): Promise<boolean> => {
  try {
    const details = await getSubscriptionDetails();
    return details?.periodType === 'TRIAL' || false;
  } catch (error) {
    console.error('❌ Error checking trial status:', error);
    return false;
  }
};

/**
 * Get all available products (optional helper)
 */
export const getProducts = async (productIds: string[]): Promise<PurchasesStoreProduct[]> => {
  try {
    const products = await Purchases.getProducts(productIds);
    console.log('✅ Products loaded:', products.length);
    return products;
  } catch (error) {
    console.error('❌ Error getting products:', error);
    return [];
  }
};

/**
 * Set custom attributes for analytics
 */
export const setUserAttributes = async (attributes: Record<string, string | null>) => {
  try {
    await Purchases.setAttributes(attributes);
    console.log('✅ User attributes set');
  } catch (error) {
    console.error('❌ Error setting user attributes:', error);
  }
};

/**
 * Helper to get package by type
 */
export const getPackageByType = (
  offering: PurchasesOffering,
  type: 'MONTHLY' | 'ANNUAL' | 'LIFETIME'
): PurchasesPackage | null => {
  return offering.availablePackages.find((pkg) => pkg.packageType === type) || null;
};
