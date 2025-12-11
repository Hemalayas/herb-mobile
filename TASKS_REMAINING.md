# Herb Mobile - Remaining Tasks for Launch

## ✅ Completed Tasks

1. **Pushed backup to GitHub** - Branch: `feature/badges-system-backup-20251211`
2. **Removed duplicate settings** - Cleaned up Average Session Cost setting
3. **Made session images larger and configurable** - Now 200x200 with inline styling
4. **Enhanced log modals** - Added gradients, improved inputs, better UX
5. **Improved homepage designs** - Added gradients and visual polish
6. **Redesigned stats page** - Enhanced with gradients, better typography, shadows
7. **Integrated RevenueCat** - SDK installed, service created, paywall component ready

## 🚀 Remaining Tasks for Launch

### 1. RevenueCat Configuration
**Priority: HIGH**
- [ ] Sign up for RevenueCat account at https://www.revenuecat.com/
- [ ] Create iOS and Android apps in RevenueCat dashboard
- [ ] Configure products/subscriptions in App Store Connect and Google Play Console
- [ ] Add API keys to `src/services/revenueCat.ts` (lines 9-12)
- [ ] Test subscriptions in sandbox environment
- [ ] Add paywall trigger (e.g., settings button, feature limits)

**Files to modify:**
- `src/services/revenueCat.ts` - Add your API keys
- `app/(tabs)/settings.tsx` - Add "Upgrade to Premium" button

**Example integration in settings:**
```typescript
import PaywallModal from '../../src/components/PaywallModal';
const [showPaywall, setShowPaywall] = useState(false);

// Add button
<TouchableOpacity
  style={[styles.settingRow, { backgroundColor: theme.card }]}
  onPress={() => setShowPaywall(true)}
>
  <Text style={[styles.settingLabel, { color: theme.text }]}>
    ⭐ Upgrade to Premium
  </Text>
</TouchableOpacity>

// Add modal
<PaywallModal
  visible={showPaywall}
  onClose={() => setShowPaywall(false)}
  onPurchaseComplete={() => {
    // Refresh app state
  }}
/>
```

---

### 2. Onboarding Screens
**Priority: HIGH**
- [ ] Create onboarding flow (3-5 screens)
- [ ] Add welcome screen with app overview
- [ ] Add permissions screen (notifications, tracking)
- [ ] Add goal setting screen
- [ ] Add AsyncStorage flag to track first launch
- [ ] Navigate to onboarding on first app open

**Suggested structure:**
```
src/screens/onboarding/
  - WelcomeScreen.tsx
  - PermissionsScreen.tsx
  - GoalSettingScreen.tsx
  - OnboardingNavigator.tsx
```

**Key features:**
- Swipeable carousel (use `react-native-snap-carousel` or similar)
- Skip button
- Progress indicators
- Animated transitions

---

### 3. Authentication System
**Priority: HIGH**
- [ ] Install auth packages:
  ```bash
  npm install @react-native-firebase/auth @react-native-firebase/app
  npm install @react-native-google-signin/google-signin
  npm install @invertase/react-native-apple-authentication
  ```
- [ ] Create AuthContext for managing auth state
- [ ] Create login/register screens
- [ ] Integrate Google Sign-In
- [ ] Integrate Apple Sign-In (iOS only)
- [ ] Add email/password authentication
- [ ] Link auth user ID with RevenueCat
- [ ] Add logout functionality

**Files to create:**
```
src/context/AuthContext.tsx
src/screens/auth/
  - LoginScreen.tsx
  - RegisterScreen.tsx
  - ForgotPasswordScreen.tsx
src/services/auth.ts
```

**Firebase setup required:**
1. Create Firebase project
2. Add iOS and Android apps
3. Download google-services.json (Android) and GoogleService-Info.plist (iOS)
4. Enable authentication providers in Firebase Console
5. Configure OAuth consent screens

---

### 4. Independent Mood Tracking
**Priority: MEDIUM**
- [ ] Add mood quick-selector widget to all 3 home screens
- [ ] Store mood separately from sessions (can track without logging session)
- [ ] Add mood history to database schema
- [ ] Create mood entry interface

**UI Design:**
- Float a mood selector at bottom of home screens
- Simple emoji row: 😊 😐 😔 😰 😤
- Quick tap to log current mood
- Optional note field

**Database changes needed:**
```typescript
// Add to database.ts
interface MoodEntry {
  id: string;
  timestamp: number;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry';
  intensity?: number; // 1-10
  note?: string;
  craving?: boolean;
}
```

---

### 5. Mood/Feelings Stats Tab
**Priority: MEDIUM**
- [ ] Add new tab to stats page for mood tracking
- [ ] Create mood timeline graph
- [ ] Add mood distribution pie chart
- [ ] Show correlation between usage and mood
- [ ] Add cravings tracker
- [ ] Show trigger patterns

**Graphs to add:**
1. Mood over time (line chart)
2. Mood distribution (pie chart)
3. Cravings frequency (bar chart)
4. Usage vs mood correlation
5. Time of day patterns

**File to modify:**
- `app/(tabs)/stats.tsx` - Add tab navigation

---

### 6. Testing & Polish
**Priority: HIGH**
- [ ] Test all user flows
- [ ] Test on both iOS and Android
- [ ] Test different screen sizes
- [ ] Test dark/light mode
- [ ] Test with no data (empty states)
- [ ] Test offline functionality
- [ ] Fix any crashes or bugs
- [ ] Performance optimization
- [ ] Memory leak checks

**Testing checklist:**
- ✅ Session logging (quick and detailed)
- ✅ T-break creation and completion
- ✅ Recovery mode
- ✅ Badge unlocking
- ✅ Stats calculations
- ✅ Settings persistence
- ✅ Theme switching
- ✅ Currency conversion
- ⬜ Authentication flow
- ⬜ Subscription flow
- ⬜ Onboarding
- ⬜ Mood tracking

---

### 7. App Store Preparation
**Priority: HIGH**
- [ ] Create app icon (1024x1024)
- [ ] Create splash screen
- [ ] Create App Store screenshots
- [ ] Write app description
- [ ] Set up App Store Connect listing
- [ ] Set up Google Play Console listing
- [ ] Configure app metadata (privacy policy, support URL)
- [ ] Set up TestFlight for beta testing
- [ ] Submit for review

**Required assets:**
- App icon (various sizes)
- Screenshots (6.5", 5.5" for iOS; various for Android)
- Feature graphic (Android)
- Privacy policy URL
- Terms of service URL
- Support URL/email

---

### 8. Additional Features (Nice to Have)
**Priority: LOW**
- [ ] Social sharing of milestones
- [ ] Friends/community features
- [ ] Strain database with effects
- [ ] Tolerance calculator
- [ ] Cost comparisons (smoking vs vaping vs edibles)
- [ ] Health milestones (REM sleep, lung capacity, etc.)
- [ ] Widget for iOS/Android home screen
- [ ] Apple Watch companion app
- [ ] Export data to CSV
- [ ] Biometric lock/privacy mode

---

## 📁 Project Structure

```
herb-mobile/
├── app/
│   ├── (tabs)/           # Main app tabs
│   │   ├── index.tsx     # Home screen (3 modes)
│   │   ├── stats.tsx     # Stats page ✨ REDESIGNED
│   │   ├── badges.tsx    # Badges collection
│   │   ├── recovery.tsx  # Recovery/T-break management
│   │   └── settings.tsx  # Settings ✨ FIXED
│   └── _layout.tsx       # Root layout with RevenueCat init
├── src/
│   ├── components/
│   │   ├── BadgeUnlockModal.tsx
│   │   ├── PaywallModal.tsx     # ✨ NEW - Subscription paywall
│   │   └── SessionImage.tsx     # ✨ ENHANCED - Configurable
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── services/
│   │   ├── database.ts
│   │   ├── storage.ts
│   │   ├── revenueCat.ts        # ✨ NEW - IAP management
│   │   └── notifications.ts
│   ├── store/
│   │   └── appStore.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── badges.ts
└── assets/              # Icons and images
```

---

## 🔑 Environment Variables Needed

Create a `.env` file (add to .gitignore):

```
# RevenueCat
REVENUECAT_IOS_API_KEY=your_ios_key_here
REVENUECAT_ANDROID_API_KEY=your_android_key_here

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Google Sign-In
GOOGLE_WEB_CLIENT_ID=your_web_client_id

# Support
SUPPORT_EMAIL=support@herbapp.com
PRIVACY_POLICY_URL=https://your-domain.com/privacy
TERMS_URL=https://your-domain.com/terms
```

---

## 📱 Platform-Specific Setup

### iOS
1. Run `cd ios && pod install`
2. Add capabilities in Xcode:
   - In-App Purchase
   - Push Notifications
   - Sign in with Apple
3. Configure Info.plist for permissions
4. Set up App Store Connect

### Android
1. Add google-services.json to `android/app/`
2. Configure build.gradle for Firebase
3. Set up Play Console
4. Generate signing keys for release

---

## 🎨 Design Tokens & Theme

Current theme colors:
- Primary: `#00D084` (green)
- Background (light): `#F9FAFB`
- Background (dark): `#111827`
- Card (light): `#FFFFFF`
- Card (dark): `#1F2937`

All gradients use `theme.primary + transparency` for consistency.

---

## 📊 Current Progress

**Overall: ~60% Complete**

- ✅ Core functionality (session tracking, stats, badges)
- ✅ UI/UX polish (gradients, shadows, typography)
- ✅ RevenueCat integration (base setup)
- ⬜ Authentication (0%)
- ⬜ Onboarding (0%)
- ⬜ Independent mood tracking (0%)
- ⬜ App store submission (0%)
- ⬜ Testing (25%)

---

## 🚨 Critical Path to Launch

1. **Week 1:** Authentication + Onboarding
2. **Week 2:** Mood tracking + Testing
3. **Week 3:** App store assets + Submission
4. **Week 4:** Beta testing + Fixes

---

## 💡 Quick Wins

These can be done quickly for immediate impact:

1. Add "Share milestone" button to badges
2. Add haptic feedback on important actions
3. Add celebration animations on badge unlock
4. Add dark mode preview in settings
5. Add app version number in settings footer
6. Add "Rate us" prompt after 10 sessions
7. Add loading skeletons for better perceived performance

---

## 📞 Need Help?

Resources:
- RevenueCat Docs: https://docs.revenuecat.com/
- Firebase Auth: https://firebase.google.com/docs/auth
- Expo Router: https://docs.expo.dev/router
- React Native: https://reactnative.dev/

---

Generated with Claude Code 🤖
Last updated: December 11, 2025
