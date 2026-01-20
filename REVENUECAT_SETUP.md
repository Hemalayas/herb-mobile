# RevenueCat Monetization Setup Guide

Complete guide to integrate RevenueCat subscriptions into the Herb app.

## 📋 Table of Contents
1. [Package Installation](#package-installation)
2. [RevenueCat Dashboard Setup](#revenuecat-dashboard-setup)
3. [App Store Connect Setup (iOS)](#app-store-connect-setup-ios)
4. [Google Play Console Setup (Android)](#google-play-console-setup-android)
5. [Code Integration](#code-integration)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## 1. Package Installation

### Install RevenueCat SDK

```bash
cd herb-mobile
npx expo install react-native-purchases
```

### Update package.json

Ensure this is in your dependencies:
```json
{
  "dependencies": {
    "react-native-purchases": "^7.0.0"
  }
}
```

---

## 2. RevenueCat Dashboard Setup

### Step 1: Create RevenueCat Account
1. Go to [RevenueCat](https://www.revenuecat.com/)
2. Sign up for a free account
3. Create a new project named "Herb"

### Step 2: Create Products in RevenueCat
1. Navigate to **Products** in the left sidebar
2. Click **+ New**
3. Create two products:

**Monthly Subscription:**
- Identifier: `herb_premium_monthly`
- Display Name: `Herb Premium Monthly`
- Type: `Subscription`

**Annual Subscription:**
- Identifier: `herb_premium_annual`
- Display Name: `Herb Premium Annual`
- Type: `Subscription`

### Step 3: Create Entitlement
1. Navigate to **Entitlements**
2. Click **+ New Entitlement**
3. Identifier: `premium` (or keep existing `Herb Pro`)
4. Add both products to this entitlement

### Step 4: Create Offering
1. Navigate to **Offerings**
2. Click **+ New Offering**
3. Identifier: `default`
4. Add both packages:
   - Monthly package (herb_premium_monthly)
   - Annual package (herb_premium_annual)
5. Make this the **Current Offering**

### Step 5: Get API Keys
1. Navigate to **API Keys** in the left sidebar
2. Copy:
   - iOS API Key (starts with `appl_`)
   - Android API Key (starts with `goog_`)

3. Update `src/services/revenueCat.ts`:
```typescript
const REVENUECAT_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

---

## 3. App Store Connect Setup (iOS)

### Step 1: Create App in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click **My Apps** → **+** → **New App**
3. Fill in app details:
   - Platform: iOS
   - Name: Herb
   - Primary Language: English
   - Bundle ID: (your bundle ID)
   - SKU: com.yourcompany.herb

### Step 2: Create Subscription Group
1. In your app, go to **Features** → **In-App Purchases**
2. Click **Manage** next to Subscription Groups
3. Click **+** to create new subscription group
4. Name: "Herb Premium"
5. Reference Name: herb_premium_group

### Step 3: Create Subscriptions

**Monthly Subscription:**
1. Click **+** next to the subscription group
2. Reference Name: `Herb Premium Monthly`
3. Product ID: `herb_premium_monthly` ⚠️ MUST MATCH REVENUECAT
4. Subscription Duration: 1 Month
5. Price: $4.99
6. Free Trial: 3 days
7. Subscription Localizations:
   - Display Name: "Herb Premium Monthly"
   - Description: "Monthly subscription to Herb Premium features"

**Annual Subscription:**
1. Click **+** next to the subscription group
2. Reference Name: `Herb Premium Annual`
3. Product ID: `herb_premium_annual` ⚠️ MUST MATCH REVENUECAT
4. Subscription Duration: 1 Year
5. Price: $29.99
6. Free Trial: 3 days
7. Subscription Localizations:
   - Display Name: "Herb Premium Annual"
   - Description: "Annual subscription to Herb Premium features (Save 50%!)"

### Step 4: Submit for Review
1. Fill in **Subscription Information**:
   - Subscription Review Information
   - App Store Promotion (optional)
2. Click **Save**
3. Submit for review (can take 24-48 hours)

### Step 5: Link to RevenueCat
1. In RevenueCat dashboard, go to your project
2. Click **App Settings** → **Apple App Store**
3. Enter your **Team ID** (found in App Store Connect → Membership)
4. Enter **Shared Secret**:
   - In App Store Connect → My Apps → [Your App]
   - App Information → App-Specific Shared Secret
   - Generate if needed, copy to RevenueCat
5. Click **Save**

---

## 4. Google Play Console Setup (Android)

### Step 1: Create App in Google Play Console
1. Go to [Google Play Console](https://play.google.com/console/)
2. Click **Create app**
3. Fill in details:
   - App name: Herb
   - Default language: English
   - App or game: App
   - Free or paid: Free

### Step 2: Create Subscriptions

1. Navigate to **Monetization** → **Subscriptions**
2. Click **Create subscription**

**Monthly Subscription:**
- Product ID: `herb_premium_monthly` ⚠️ MUST MATCH REVENUECAT
- Name: Herb Premium Monthly
- Description: Monthly subscription with all premium features
- Billing period: 1 month
- Price: $4.99
- Free trial: 3 days
- Grace period: 3 days (recommended)

**Annual Subscription:**
- Product ID: `herb_premium_annual` ⚠️ MUST MATCH REVENUECAT
- Name: Herb Premium Annual
- Description: Annual subscription with all premium features (Save 50%)
- Billing period: 1 year
- Price: $29.99
- Free trial: 3 days
- Grace period: 3 days (recommended)

### Step 3: Link to RevenueCat
1. In Google Play Console, go to **Setup** → **API access**
2. Click **Link** on "Google Play Android Developer API"
3. Create a service account or use existing
4. Grant **Finance permissions**
5. Download JSON key file

6. In RevenueCat dashboard:
   - Go to **App Settings** → **Google Play Store**
   - Upload the JSON key file
   - Enter your app's package name
   - Click **Save**

---

## 5. Code Integration

### Update App Root (_layout.tsx)

Wrap your app with PremiumProvider:

```typescript
import { PremiumProvider } from '../src/context/PremiumContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PremiumProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="premium-paywall" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
      </PremiumProvider>
    </ThemeProvider>
  );
}
```

### Update Home Screen (index.tsx)

Replace `useState(false)` with actual premium status:

```typescript
import { usePremium } from '../../src/context/PremiumContext';

export default function HomeScreen() {
  const { isPremium } = usePremium();
  // Remove: const [isPremium, setIsPremium] = useState(false);

  // Rest of code...
}
```

### Update Badges Screen (badges.tsx)

```typescript
import { usePremium } from '../../src/context/PremiumContext';

export default function BadgesScreen() {
  const { isPremium, showPaywall } = usePremium();
  // Remove: const [isPremium, setIsPremium] = useState(false);

  // Add tap handler for locked badges:
  const handleLockedBadgeTap = () => {
    showPaywall('feature');
    router.push('/premium-paywall');
  };

  // Rest of code...
}
```

### Update Stats Screen (stats.tsx)

```typescript
import { usePremium } from '../../src/context/PremiumContext';

export default function StatsScreen() {
  const { isPremium, showPaywall } = usePremium();
  // Remove: const [isPremium, setIsPremium] = useState(false);

  // Add tap handler for locked stats:
  const handleLockedStatTap = () => {
    showPaywall('feature');
    router.push('/premium-paywall');
  };

  // Rest of code...
}
```

### Update Premium Paywall (premium-paywall.tsx)

The screen needs full RevenueCat integration. Key changes:

1. Import RevenueCat functions
2. Load offerings on mount
3. Implement purchase flow
4. Handle restore purchases
5. Show proper pricing from RevenueCat

See the full implementation in the file I attempted to create earlier.

---

## 6. Testing

### Sandbox Testing (iOS)

1. **Create Sandbox Tester:**
   - App Store Connect → Users and Access → Sandbox Testers
   - Add new tester with unique email

2. **Sign Out of Production:**
   - Settings → App Store → Sign Out

3. **Test Purchase:**
   - Run app in simulator/device
   - Attempt purchase
   - Sign in with sandbox tester when prompted
   - Verify 3-day trial starts
   - Verify premium features unlock

4. **Test Restore:**
   - Delete app
   - Reinstall
   - Tap "Restore Purchases"
   - Verify premium restored

### Sandbox Testing (Android)

1. **Add License Testers:**
   - Google Play Console → Setup → License Testing
   - Add test Gmail accounts

2. **Create Internal Test Track:**
   - Release → Testing → Internal testing
   - Create release
   - Upload AAB
   - Add testers

3. **Test Purchase:**
   - Install from internal test track
   - Attempt purchase
   - Should see "Test" badge on purchase dialog
   - Verify no actual charge
   - Verify premium features unlock

### Reset Test Purchases

**iOS:**
- Settings → App Store → Sandbox Account → Manage
- Clear purchase history

**Android:**
- Purchases automatically reset after ~5 minutes
- Or use "android.test.purchased" as product ID for instant reset

---

## 7. Troubleshooting

### Common Issues

**"No offerings found"**
- Check RevenueCat dashboard has Current Offering set
- Verify products are added to offering
- Verify products match exactly in App/Play Store

**"Product IDs don't match"**
- Ensure EXACT match:
  - RevenueCat product ID
  - App Store/Play Store product ID
  - Code reference to product ID

**"Purchase fails immediately"**
- iOS: Check sandbox tester is signed in
- Android: Check app is installed from test track
- Verify subscription is "Ready to Submit" in stores

**"Restore doesn't work"**
- iOS: User must use same Apple ID
- Android: User must use same Google account
- Check RevenueCat dashboard shows purchase

**"Premium status doesn't update"**
- Check internet connection
- Call `checkPremiumStatus()` after purchase
- Verify entitlement ID matches (`Herb Pro` or `premium`)

### Debug Logging

Enable debug logs in development:

```typescript
// In src/services/revenueCat.ts
if (__DEV__) {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
}
```

Check Xcode/Android Studio console for detailed logs.

### Support Resources

- RevenueCat Docs: https://docs.revenuecat.com/
- RevenueCat Discord: https://discord.gg/revenuecat
- Support Email: support@revenuecat.com

---

## 8. Pre-Launch Checklist

Before submitting to stores:

- [ ] RevenueCat API keys added to code
- [ ] Products created in App Store Connect (iOS)
- [ ] Products created in Google Play Console (Android)
- [ ] Products linked to RevenueCat
- [ ] Subscriptions approved in both stores
- [ ] Test purchases work in sandbox
- [ ] Restore purchases works
- [ ] Premium features lock/unlock properly
- [ ] Privacy Policy updated with subscription terms
- [ ] Terms of Service updated
- [ ] App Store/Play Store screenshots show premium features
- [ ] Store listings mention subscription pricing

---

## 9. Post-Launch Monitoring

### RevenueCat Dashboard

Monitor these metrics:
- **Active Subscriptions**: Current paying users
- **MRR**: Monthly Recurring Revenue
- **Churn Rate**: % of users canceling
- **Trial Conversion**: % of trials converting to paid

### Optimize Pricing

After 1-2 months:
1. Review conversion rates
2. Consider A/B testing prices
3. Add promotional offers
4. Implement win-back campaigns

---

## Need Help?

If you encounter issues during setup:

1. Check this guide thoroughly
2. Review RevenueCat docs: https://docs.revenuecat.com/
3. Check RevenueCat status: https://status.revenuecat.com/
4. Contact RevenueCat support (they're very responsive!)

Good luck with your launch! 🚀
