import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import {
  initRevenueCat,
  hasHerbPro,
  purchasePackage as purchasePkg,
  restorePurchases as restorePurch,
  getCustomerInfo,
  isInTrialPeriod as checkTrialStatus,
  getSubscriptionDetails,
} from '../services/revenueCat';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  isInTrial: boolean;
  customerInfo: CustomerInfo | null;
  subscriptionDetails: any | null;

  // Functions
  checkPremiumStatus: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  showPaywall: () => void;
  hidePaywall: () => void;

  // Paywall state
  paywallVisible: boolean;
  paywallTrigger: 'onboarding' | 'feature' | 'manual' | null;

  // Dev testing (only works in __DEV__ mode)
  devTogglePremium: () => void;
  isDevOverride: boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within PremiumProvider');
  }
  return context;
};

interface PremiumProviderProps {
  children: ReactNode;
}

export const PremiumProvider: React.FC<PremiumProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInTrial, setIsInTrial] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any | null>(null);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<'onboarding' | 'feature' | 'manual' | null>(null);
  const [isDevOverride, setIsDevOverride] = useState(false);

  // Initialize RevenueCat and check premium status on mount
  useEffect(() => {
    initializePremiumStatus();
    setupPurchaseListeners();

    return () => {
      // Cleanup listeners
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate);
    };
  }, []);

  const initializePremiumStatus = async () => {
    try {
      setIsLoading(true);

      // Initialize RevenueCat
      await initRevenueCat();

      // Check if user has premium
      await checkPremiumStatus();
    } catch (error) {
      console.error('❌ Error initializing premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPremiumStatus = async () => {
    try {
      // Get customer info
      const info = await getCustomerInfo();
      if (info) {
        setCustomerInfo(info);
      }

      // Check premium status
      const premium = await hasHerbPro();
      setIsPremium(premium);

      // Check trial status
      const trial = await checkTrialStatus();
      setIsInTrial(trial);

      // Get subscription details
      const details = await getSubscriptionDetails();
      setSubscriptionDetails(details);

      console.log('✅ Premium status checked:', {
        isPremium: premium,
        isInTrial: trial,
      });
    } catch (error) {
      console.error('❌ Error checking premium status:', error);
      setIsPremium(false);
    }
  };

  const setupPurchaseListeners = () => {
    // Listen for purchase updates
    Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdate);
  };

  const handleCustomerInfoUpdate = async (info: CustomerInfo) => {
    console.log('📱 Customer info updated');
    setCustomerInfo(info);

    // Re-check premium status
    const premium = await hasHerbPro();
    setIsPremium(premium);

    const trial = await checkTrialStatus();
    setIsInTrial(trial);

    const details = await getSubscriptionDetails();
    setSubscriptionDetails(details);
  };

  const purchasePackage = async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const result = await purchasePkg(pkg);

      if (result && !result.userCancelled) {
        // Purchase successful
        await checkPremiumStatus();
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Purchase failed:', error);
      throw error;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      const info = await restorePurch();

      if (info) {
        setCustomerInfo(info);
        await checkPremiumStatus();

        // Check if restoration was successful (user now has premium)
        const premium = await hasHerbPro();
        return premium;
      }

      return false;
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw error;
    }
  };

  const showPaywall = (trigger: 'onboarding' | 'feature' | 'manual' = 'manual') => {
    setPaywallTrigger(trigger);
    setPaywallVisible(true);
  };

  const hidePaywall = () => {
    setPaywallVisible(false);
    setPaywallTrigger(null);
  };

  // DEV ONLY: Toggle premium status for testing
  const devTogglePremium = () => {
    if (__DEV__) {
      setIsDevOverride((prev) => !prev);
      setIsPremium((prev) => !prev);
      console.log('🔧 DEV: Premium toggled to:', !isPremium);
    }
  };

  const value: PremiumContextType = {
    isPremium,
    isLoading,
    isInTrial,
    customerInfo,
    subscriptionDetails,
    checkPremiumStatus,
    purchasePackage,
    restorePurchases,
    showPaywall,
    hidePaywall,
    paywallVisible,
    paywallTrigger,
    devTogglePremium,
    isDevOverride,
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
};
