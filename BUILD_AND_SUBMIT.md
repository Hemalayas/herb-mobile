# 🚀 Build & Submit Guide - Herb App

Complete guide to build and submit Herb to the App Store and Google Play with RevenueCat subscriptions.

## 📦 Prerequisites

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS project
eas build:configure
```

---

## Part 1: RevenueCat Setup (Do This First!)

### 1. Create RevenueCat Account
1. Go to https://www.revenuecat.com/
2. Sign up (free for first $2,500 MRR)
3. Create new project: "Herb"

### 2. Get Your API Keys
1. In RevenueCat dashboard → **API Keys**
2. Copy your keys:
   - iOS: `appl_xxxxxxxxxx`
   - Android: `goog_xxxxxxxxxx`

3. Update `src/services/revenueCat.ts`:
```typescript
const REVENUECAT_API_KEY = 'appl_YOUR_IOS_KEY_HERE'; // Line 11
```

---

## Part 2: iOS App Store Setup

### Step 1: Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com/
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - **Platform**: iOS
   - **Name**: Herb - Cannabis Tracker
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: `com.hemalayas.herb` (should auto-populate)
   - **SKU**: `herb-cannabis-tracker-1`
   - **User Access**: Full Access

### Step 2: Create Subscription Group

1. In your app → **In-App Purchases**
2. Click **Manage** next to "Subscription Groups"
3. Click **+** → Create new group
4. **Reference Name**: Herb Premium
5. Click **Create**

### Step 3: Create Monthly Subscription

1. Click **+** next to subscription group
2. Fill in:
   - **Reference Name**: Herb Premium Monthly
   - **Product ID**: `herb_premium_monthly` ⚠️ EXACT MATCH
   - **Subscription Duration**: 1 Month
   - **Subscription Prices**: $4.99 USD
   - **Free Trial**: 3 days

3. **Subscription Localizations** (English):
   - **Display Name**: Herb Premium Monthly
   - **Description**: Monthly subscription with all premium features including 50+ badges, dark mode, and advanced analytics.

4. **Review Information**:
   - Screenshot showing subscription features
   - Review notes: "Monthly subscription unlocks all premium features"

5. Click **Save**

### Step 4: Create Annual Subscription

1. Click **+** next to subscription group
2. Fill in:
   - **Reference Name**: Herb Premium Annual
   - **Product ID**: `herb_premium_annual` ⚠️ EXACT MATCH
   - **Subscription Duration**: 1 Year
   - **Subscription Prices**: $29.99 USD
   - **Free Trial**: 3 days

3. **Subscription Localizations** (English):
   - **Display Name**: Herb Premium Annual
   - **Description**: Annual subscription with all premium features. Save 50% compared to monthly!

4. Click **Save**

### Step 5: Submit Subscriptions for Review

1. Click **Submit** on each subscription
2. Subscriptions must be approved before you can test (24-48 hours)

### Step 6: Link App Store Connect to RevenueCat

1. In RevenueCat dashboard → **Project Settings** → **Apple App Store**
2. Enter **Team ID**:
   - Found in App Store Connect → Membership
3. Enter **Shared Secret**:
   - App Store Connect → My Apps → [Herb] → **App Information**
   - Scroll to **App-Specific Shared Secret**
   - Click **Generate** if needed
   - Copy and paste into RevenueCat
4. Click **Save**

---

## Part 3: Build iOS App

### Step 1: Update EAS Configuration

Create/update `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "bundleIdentifier": "com.hemalayas.herb"
      },
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

### Step 2: Build for iOS

```bash
# Production build for App Store
eas build --platform ios --profile production

# This will:
# - Create optimized production build
# - Upload to EAS servers
# - Generate .ipa file
# - Takes 10-20 minutes
```

### Step 3: Submit to App Store

**Option A: Automatic (Recommended)**
```bash
eas submit --platform ios --profile production
```

**Option B: Manual**
1. Download .ipa from EAS dashboard
2. Open Xcode → **Organizer**
3. Drag .ipa file
4. Click **Distribute App**
5. Select **App Store Connect**
6. Follow prompts

### Step 4: Complete App Store Listing

1. Go to App Store Connect → Your App
2. Click **+VERSION** → Create 1.0.0

**App Information:**
- **Subtitle**: Track mindfully, live better
- **Category**: Health & Fitness
- **Secondary Category**: Lifestyle
- **Content Rights**: No

**Privacy:**
- **Privacy Policy URL**: https://yourwebsite.com/privacy
- **Data Collection**: Configure based on actual data collected

**Pricing:**
- **Price**: Free
- **Availability**: All countries (or specific ones)

**App Privacy:**
Answer questions about:
- Health & Fitness data (Yes - usage tracking)
- Identifiers (Yes - user ID for RevenueCat)
- Usage Data (Yes - analytics)

**Screenshots Required:**
- 6.7" (iPhone 14 Pro Max): 3-10 screenshots
- 6.5" (iPhone 11 Pro Max): 3-10 screenshots
- 5.5" (iPhone 8 Plus): Optional

**App Preview:**
- Optional but recommended
- 30 second video showing app features

**Description:**
```
Transform your relationship with cannabis through mindful tracking and insights.

FEATURES:
• Track sessions with detailed information
• Multiple consumption methods (Joint, Bong, Pen, Edible, Dab)
• Mood & feelings tracking
• T-Break management with countdown timer
• Recovery mode for sobriety journey
• Beautiful dark mode

PREMIUM FEATURES:
• 50+ Achievement Badges
• Advanced Statistics & Analytics
• Weekly Insights Dashboard
• Unlimited Tracking
• Priority Support

Start your mindful journey today with a 3-day free trial!

Terms: https://yourwebsite.com/terms
Privacy: https://yourwebsite.com/privacy
```

**Keywords:**
cannabis, tracker, weed, marijuana, journal, sobriety, t-break, mindful, wellness, health

**Support URL**: https://yourwebsite.com/support
**Marketing URL**: https://yourwebsite.com

### Step 5: Submit for Review

1. Click **Add for Review**
2. **Export Compliance**: No (if not using encryption)
3. **Advertising Identifier**: Yes (for RevenueCat)
4. Click **Submit to App Review**

**Review Time**: 24-72 hours typically

---

## Part 4: Android Google Play Setup

### Step 1: Create App in Google Play Console

1. Go to https://play.google.com/console/
2. Click **Create app**
3. Fill in:
   - **App name**: Herb - Cannabis Tracker
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
4. Accept policies
5. Click **Create app**

### Step 2: Set Up In-App Products

1. Go to **Monetization** → **Subscriptions**
2. Click **Create subscription**

**Monthly Subscription:**
- **Product ID**: `herb_premium_monthly` ⚠️ EXACT MATCH
- **Name**: Herb Premium Monthly
- **Description**: Monthly subscription with all premium features
- **Billing period**: 1 month
- **Default price**: $4.99
- **Free trial**: 3 days
- **Grace period**: 3 days (recommended)
- **Status**: Active

**Annual Subscription:**
- **Product ID**: `herb_premium_annual` ⚠️ EXACT MATCH
- **Name**: Herb Premium Annual
- **Description**: Annual subscription with all premium features (Save 50%)
- **Billing period**: 1 year
- **Default price**: $29.99
- **Free trial**: 3 days
- **Grace period**: 3 days
- **Status**: Active

### Step 3: Link Google Play to RevenueCat

1. In Google Play Console → **Setup** → **API access**
2. Click **Link** on Google Play Android Developer API
3. Create service account:
   - Go to Google Cloud Console
   - Create new service account
   - Download JSON key file
4. Grant permissions:
   - Finance data (required)
   - Order management
5. In RevenueCat dashboard → **Google Play Store**:
   - Upload JSON key file
   - Enter package name: `com.hemalayas.herb`
   - Click **Save**

### Step 4: Build Android App

```bash
# Production build for Google Play
eas build --platform android --profile production

# This creates an AAB file for Play Store
```

### Step 5: Create Release

1. In Play Console → **Production** → **Create new release**
2. Upload AAB file from EAS build
3. **Release name**: 1.0.0
4. **Release notes**:
```
Initial release of Herb - Cannabis Tracker

Features:
• Track cannabis sessions with detailed logging
• Mood and feelings tracking
• T-Break management
• Recovery mode
• Dark mode support
• Premium subscription with 50+ badges and advanced analytics
```

### Step 6: Complete Store Listing

**App details:**
- **App name**: Herb - Cannabis Tracker
- **Short description**: Track mindfully, live better
- **Full description**: (Same as iOS)
- **App icon**: 512x512px
- **Feature graphic**: 1024x500px

**Graphics:**
- Phone screenshots: At least 2
- 7-inch tablet: At least 2
- 10-inch tablet: Optional

**Categorization:**
- **Category**: Health & Fitness
- **Tags**: Wellness, Lifestyle

**Contact details:**
- Email: support@yourapp.com
- Phone: Optional
- Website: https://yourwebsite.com

**Privacy Policy**: https://yourwebsite.com/privacy

### Step 7: Complete Content Rating

1. Go to **Policy** → **App content**
2. Complete questionnaire
3. Categories will likely include:
   - Substance references (Cannabis/Marijuana)
   - Mature content
4. Get ESRB rating (likely: Mature 17+)

### Step 8: Set Up Pricing

1. **Countries**: All (or specific ones)
2. **Price**: Free
3. **Contains ads**: No
4. **In-app purchases**: Yes ($4.99 - $29.99)

### Step 9: Submit for Review

1. Click **Send for review**
2. Review can take 3-7 days

---

## Part 5: Testing Before Launch

### iOS Testing

**TestFlight (Recommended):**
```bash
# Upload to TestFlight
eas submit --platform ios --profile production

# Add testers in App Store Connect
# Testers receive email with TestFlight link
```

**Sandbox Testing:**
1. Create sandbox tester in App Store Connect
2. Sign out of App Store on device
3. Run app, attempt purchase
4. Sign in with sandbox account
5. Verify 3-day trial starts
6. Verify premium features unlock

### Android Testing

**Internal Testing Track:**
1. In Play Console → **Testing** → **Internal testing**
2. Create release
3. Upload AAB
4. Add testers by email
5. Share opt-in link with testers
6. Testers install and test purchases

---

## Part 6: Post-Launch Monitoring

### RevenueCat Dashboard

Monitor daily:
- **Active Subscriptions**: Current subscribers
- **MRR**: Monthly Recurring Revenue
- **Trial Conversion Rate**: % converting to paid
- **Churn Rate**: % canceling

### App Analytics

Track:
- Daily Active Users (DAU)
- Session count
- Feature usage
- Crash reports (Sentry/Crashlytics)

### Customer Support

Set up:
- Support email: support@yourapp.com
- FAQ page
- In-app support link

---

## Part 7: Common Issues & Solutions

### "Subscriptions not showing"
- Verify product IDs match exactly
- Check subscriptions are approved in stores
- Verify RevenueCat configuration
- Check API keys are correct

### "Purchase fails"
- iOS: Verify sandbox tester signed in
- Android: Verify test track installation
- Check internet connection
- Verify subscriptions are "Active"

### "Can't restore purchases"
- User must use same Apple ID/Google account
- Check RevenueCat dashboard shows purchase
- Verify entitlement ID matches code

### "App rejected"
- Cannabis apps: Ensure compliance with store policies
- Add age verification (21+)
- Clearly state it's a tracking tool, not promoting use
- Include disclaimers and educational content

---

## Part 8: Pre-Launch Checklist

### Code Checklist
- [ ] All TODO comments removed
- [ ] Console.logs removed (or use __DEV__)
- [ ] RevenueCat API keys added
- [ ] Privacy Policy linked
- [ ] Terms of Service linked
- [ ] Error handling complete
- [ ] Loading states implemented

### Store Checklist
- [ ] Screenshots prepared (iOS: 3 sizes, Android: 2+)
- [ ] App icon finalized (512x512)
- [ ] Feature graphic (Android)
- [ ] App description written
- [ ] Keywords researched
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Support email set up

### RevenueCat Checklist
- [ ] Products created in both stores
- [ ] Products linked to RevenueCat
- [ ] Entitlement configured
- [ ] Offerings set up
- [ ] API keys added to code
- [ ] Test purchases successful

### Testing Checklist
- [ ] Subscription purchase works
- [ ] Free trial works (3 days)
- [ ] Restore purchases works
- [ ] Premium features lock/unlock
- [ ] Dark mode works
- [ ] All badges tracking correctly
- [ ] Analytics tracking working
- [ ] No crashes in critical flows

---

## Need Help?

### Support Resources
- **Expo Docs**: https://docs.expo.dev/
- **RevenueCat Docs**: https://docs.revenuecat.com/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policy**: https://play.google.com/about/developer-content-policy/

### Quick Commands Reference

```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android

# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

Good luck with your launch! 🚀🌿
