# ✅ Pre-Build Checklist - Herb App

Complete this checklist BEFORE running `eas build --platform ios`

## 🔴 CRITICAL - Must Complete First

### 1. RevenueCat API Keys
- [ ] Create RevenueCat account at https://www.revenuecat.com/
- [ ] Create "Herb" project in RevenueCat
- [ ] Copy iOS API key (starts with `appl_`)
- [ ] Update `src/services/revenueCat.ts` line 11:
  ```typescript
  const REVENUECAT_API_KEY = 'appl_YOUR_ACTUAL_KEY_HERE';
  ```
- [ ] Test that key works by running app in development

### 2. App Store Connect Setup
- [ ] Create app in App Store Connect
- [ ] Create subscription group: "Herb Premium"
- [ ] Create monthly subscription (`herb_premium_monthly`, $4.99)
- [ ] Create annual subscription (`herb_premium_annual`, $29.99)
- [ ] Both subscriptions submitted for review (takes 24-48 hours)
- [ ] Link App Store Connect to RevenueCat (Shared Secret)

### 3. Install RevenueCat Package
```bash
npx expo install react-native-purchases
```

### 4. Update App Layout
Add PremiumProvider to `app/_layout.tsx`:

```typescript
import { PremiumProvider } from '../src/context/PremiumContext';

// Wrap your app:
<ThemeProvider>
  <PremiumProvider>
    <Stack>
      {/* your routes */}
    </Stack>
  </PremiumProvider>
</ThemeProvider>
```

### 5. Replace Mock Premium Status

**In `app/(tabs)/index.tsx`:**
```typescript
// REMOVE this line:
// const [isPremium, setIsPremium] = useState(false);

// ADD these lines:
import { usePremium } from '../../src/context/PremiumContext';
const { isPremium } = usePremium();
```

**In `app/(tabs)/badges.tsx`:**
```typescript
// REMOVE this line:
// const [isPremium, setIsPremium] = useState(false);

// ADD these lines:
import { usePremium } from '../../src/context/PremiumContext';
const { isPremium, showPaywall } = usePremium();
```

**In `app/(tabs)/stats.tsx`:**
```typescript
// REMOVE this line:
// const [isPremium, setIsPremium] = useState(false);

// ADD these lines:
import { usePremium } from '../../src/context/PremiumContext';
const { isPremium } = usePremium();
```

---

## 🟡 IMPORTANT - App Store Requirements

### 6. Privacy Policy & Terms
- [ ] Create privacy policy page (or use existing)
- [ ] Create terms of service page (or use existing)
- [ ] Verify links work in app
- [ ] Host on public URL (required by Apple)

### 7. Age Verification
- [ ] App has age gate (21+ for cannabis tracking)
- [ ] Age verification happens before app access
- [ ] Update `app/age-verification.tsx` if needed

### 8. App Assets
- [ ] App icon (1024x1024) - `assets/icon.png`
- [ ] Splash screen - `assets/splash-icon.png`
- [ ] All badge images present in `assets/badges/`
- [ ] Mascot images (level1-5.png)

### 9. Screenshots Prepared
You'll need these AFTER build for App Store:
- [ ] iPhone 6.7" (3-10 screenshots)
- [ ] iPhone 6.5" (3-10 screenshots)
- [ ] Optional: iPhone 5.5"

**Recommended screens to capture:**
1. Home screen with session counter
2. Stats page showing analytics
3. Badges page
4. T-Break timer screen
5. Premium paywall

### 10. App Description
Prepare App Store description (see BUILD_AND_SUBMIT.md)

---

## 🟢 RECOMMENDED - Quality Checks

### 11. Code Quality
- [ ] Remove all `console.log()` statements (or wrap in `__DEV__`)
- [ ] Remove all `TODO` comments
- [ ] Remove debug code
- [ ] Update version number in `app.json` if needed

### 12. Test Core Flows
- [ ] Log a session works
- [ ] Stats calculate correctly
- [ ] Badges unlock properly
- [ ] T-Break timer works
- [ ] Recovery mode works
- [ ] Dark mode works
- [ ] Mood tracking works

### 13. Premium Features Work
- [ ] Flip card locks for non-premium users
- [ ] Badges show premium lock overlay
- [ ] Stats show premium lock overlay
- [ ] Paywall displays correctly
- [ ] Can navigate to premium-paywall screen

### 14. Error Handling
- [ ] App doesn't crash on bad data
- [ ] Network errors handled gracefully
- [ ] Database errors handled
- [ ] Loading states show properly

---

## 🔵 OPTIONAL - Nice to Have

### 15. Analytics Setup
- [ ] Set up analytics (Amplitude, Mixpanel, etc.)
- [ ] Track key events (session logged, premium upgrade, etc.)

### 16. Crash Reporting
- [ ] Set up Sentry or similar
- [ ] Test crash reporting works

### 17. Push Notifications (Future)
- [ ] Not needed for v1.0
- [ ] Can add later

---

## 🚀 Ready to Build?

### Pre-Build Commands

```bash
# 1. Ensure all dependencies installed
npm install

# 2. Login to EAS
eas login

# 3. Configure EAS (if not done)
eas build:configure

# 4. Verify eas.json looks correct
cat eas.json

# 5. Start the build!
eas build --platform ios --profile production
```

### Build Process

1. **Command runs**: `eas build --platform ios --profile production`
2. **EAS uploads code** to their servers
3. **Build starts** (takes 10-20 minutes)
4. **You'll get a URL** to track build progress
5. **Build completes** - download .ipa or submit directly

### After Build Succeeds

**Option A: Auto-submit to App Store**
```bash
eas submit --platform ios --profile production
```

**Option B: Download IPA**
1. Download from EAS dashboard
2. Upload manually via Xcode or Transporter

---

## ⚠️ Common Issues

### "RevenueCat not initialized"
- Check API key in `src/services/revenueCat.ts`
- Verify `react-native-purchases` is installed
- Check `app.json` has RevenueCat plugin

### "Subscriptions not loading"
- Subscriptions must be approved in App Store Connect
- Can take 24-48 hours
- Test with sandbox account

### "Build fails"
- Check EAS build logs
- Verify all packages compatible
- Check `app.json` configuration
- Ensure no syntax errors

### "Premium features still locked"
For testing, you can temporarily set:
```typescript
const [isPremium, setIsPremium] = useState(true); // Test mode
```

Then switch back to real implementation before production build.

---

## 📝 Notes

### Build Numbers
- iOS build number increments automatically
- Current: `1` in `app.json`
- Each submission needs unique build number

### Version Numbers
- Current version: `1.0.0` in `app.json`
- Semantic versioning: MAJOR.MINOR.PATCH
- Update for each public release

### Environments
- **development**: For local testing
- **preview**: For internal testing
- **production**: For App Store submission

### Time Estimates
- Build time: 10-20 minutes
- App review: 24-72 hours
- Subscription approval: 24-48 hours
- Total time to live: 3-5 days typically

---

## 🎯 Quick Command Reference

```bash
# Build commands
eas build --platform ios                    # Production iOS build
eas build --platform android                # Production Android build
eas build --platform all                    # Both platforms

# Submit commands
eas submit --platform ios                   # Submit iOS to App Store
eas submit --platform android               # Submit Android to Play Store

# Status commands
eas build:list                              # List all builds
eas build:view [BUILD_ID]                   # View specific build
eas build:cancel [BUILD_ID]                 # Cancel running build

# Development
npm start                                    # Start dev server
npm run ios                                  # Run on iOS simulator
npm run android                              # Run on Android emulator
```

---

## ✅ Final Checklist

Before running the build command, verify:

- [ ] RevenueCat API key added to code
- [ ] Subscriptions created in App Store Connect
- [ ] App Store Connect linked to RevenueCat
- [ ] PremiumProvider added to app layout
- [ ] Mock isPremium replaced with usePremium()
- [ ] Privacy policy & terms of service linked
- [ ] All assets present
- [ ] Code tested and working
- [ ] No console.logs or debug code
- [ ] `eas.json` configured
- [ ] Logged into EAS CLI

**If all checked, you're ready to build!** 🎉

```bash
eas build --platform ios --profile production
```

Good luck! 🍀
