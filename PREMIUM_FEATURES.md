# 🌟 Herb Pro - Premium Features Documentation

## Overview

Herb Pro is the premium tier that unlocks advanced features, exclusive badges, and enhanced personalization.

**Pricing:**
- **Monthly:** $4.99/month
- **Annual:** $29.99/year (Save 50%!)

---

## ✅ Premium Features

### 1. 🌙 **Dark Mode**
- **Status:** ✅ Implemented
- **Location:** Settings → Theme toggle
- **Code:** [app/(tabs)/settings.tsx:80-110](app/(tabs)/settings.tsx#L80-L110)

**Free Users:**
- Can only use light mode
- See "Theme ⭐ (Premium)" label
- Get upgrade prompt when trying to enable

**Premium Users:**
- Full dark mode access
- Toggle anytime in settings
- Persists across app restarts

**Implementation:**
```typescript
// Premium check before enabling dark mode
if (!isPremium && value) {
  Alert.alert(
    'Premium Feature',
    'Dark mode is available in Herb Pro...',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Upgrade', onPress: () => setShowPaywall(true) }
    ]
  );
  return;
}
```

---

### 2. 🏆 **50+ Premium Badges**
- **Status:** ✅ Implemented
- **Location:** Badges tab
- **Code:** [app/(tabs)/badges.tsx:113-147](app/(tabs)/badges.tsx#L113-L147)

**Free Users:**
- ~10 basic badges unlocked
- See premium badges with 🔒 lock icon
- Get "Premium Badge" alert when tapping locked badges

**Premium Users:**
- Access to all 50+ badges
- No locks on premium badges
- Exclusive achievements and milestones

**Badge Categories:**
| Category | Free Badges | Premium Badges | Total |
|----------|-------------|----------------|-------|
| Sobriety | 3 | 5 | 8 |
| T-Break | 2 | 4 | 6 |
| Usage | 2 | 8 | 10 |
| Time | 1 | 6 | 7 |
| Variety | 1 | 5 | 6 |
| Special | 1 | 12 | 13 |
| **TOTAL** | **~10** | **~40** | **50+** |

**Implementation:**
```typescript
const isPremiumBadge = def?.isPremium || false;
const isLocked = !isUnlocked && isPremiumBadge && !isPremium;

if (isLocked) {
  Alert.alert(
    'Premium Badge',
    'This badge is part of Herb Pro. Upgrade to unlock 40+ premium badges!',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Upgrade', onPress: () => router.push('/(tabs)/settings') }
    ]
  );
}
```

---

### 3. 📊 **Advanced Mood Analytics**
- **Status:** ✅ Implemented
- **Location:** Stats tab → Mood & Feelings
- **Code:** [app/(tabs)/stats.tsx:47-67](app/(tabs)/stats.tsx#L47-L67)

**Free Users:**
- Basic usage statistics only
- Session counts, totals, averages
- Simple charts

**Premium Users:**
- Full Mood & Feelings analytics tab
- Mood distribution charts
- Mood over time trends
- Correlation with usage patterns
- Craving intensity tracking
- Trigger pattern analysis

**Charts Included:**
1. **Mood Over Time** - Line chart showing mood trends
2. **Mood Distribution** - Pie chart of mood categories
3. **Cravings Timeline** - Track craving intensity
4. **Usage vs Mood Correlation** - See how usage affects mood
5. **Daily Patterns** - Time-of-day mood analysis

---

### 4. ☁️ **Cloud Backup** (Coming Soon)
- **Status:** 🚧 Planned
- **Target:** Q1 2026

**Features:**
- Auto-backup to iCloud/Google Drive
- Cross-device sync
- Data restore on reinstall
- Export to CSV

---

### 5. 🎨 **Custom Themes** (Coming Soon)
- **Status:** 🚧 Planned
- **Target:** Q2 2026

**Features:**
- Custom color schemes
- Personalized mascot levels
- UI customization
- Accent color selection

---

## 🔓 Premium Unlock Flow

### User Journey

```
┌──────────────────────────────────┐
│  User tries premium feature      │
│  (Dark mode, premium badge, etc) │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│  Alert: "This is a premium       │
│  feature. Upgrade to unlock!"    │
│  [Cancel] [Upgrade]              │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│  User taps "Upgrade"             │
│  → Routes to Settings            │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│  Settings page                   │
│  Shows "🚀 Upgrade to Herb Pro"  │
│  User taps button                │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│  PaywallModal opens              │
│  (RevenueCat native UI)          │
│  Shows subscription options      │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│  User selects plan & purchases   │
│  - Monthly: $4.99                │
│  - Annual: $29.99                │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│  Purchase completes              │
│  PremiumContext updates:         │
│  isPremium = true                │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│  ✅ All premium features unlock  │
│  - Dark mode enabled             │
│  - Premium badges unlocked       │
│  - Mood analytics accessible     │
│  - Settings shows "ACTIVE" badge │
└──────────────────────────────────┘
```

---

## 💻 Technical Implementation

### Premium Context

**Location:** [src/context/PremiumContext.tsx](src/context/PremiumContext.tsx)

**Hook Usage:**
```typescript
import { usePremium } from '../src/context/PremiumContext';

function MyComponent() {
  const { isPremium, isLoading } = usePremium();

  if (isLoading) return <LoadingSpinner />;

  return (
    <View>
      {isPremium ? (
        <PremiumFeature />
      ) : (
        <UpgradePrompt />
      )}
    </View>
  );
}
```

**Available Properties:**
```typescript
interface PremiumContextType {
  isPremium: boolean;              // Current premium status
  isLoading: boolean;              // Loading state
  isInTrial: boolean;              // If user is in trial period
  customerInfo: CustomerInfo;      // RevenueCat customer data
  subscriptionDetails: object;     // Subscription info

  checkPremiumStatus: () => void;  // Refresh premium status
  purchasePackage: (pkg) => void;  // Purchase a package
  restorePurchases: () => void;    // Restore previous purchases
}
```

### RevenueCat Configuration

**Product IDs:**
- **iOS:**
  - `herb_pro_monthly` - $4.99/month
  - `herb_pro_annual` - $29.99/year

- **Android:**
  - `herb_pro_monthly` - $4.99/month
  - `herb_pro_annual` - $29.99/year

**Entitlement ID:** `Herb Pro`

**API Keys:**
- iOS: `appl_xxxxxxxxxx` (get from RevenueCat dashboard)
- Android: `goog_xxxxxxxxxx` (get from RevenueCat dashboard)

---

## 📊 Premium Gates Summary

| Feature | Free | Premium | Gate Location |
|---------|------|---------|---------------|
| **Dark Mode** | ❌ | ✅ | settings.tsx:94-103 |
| **Basic Badges** | ✅ (~10) | ✅ | - |
| **Premium Badges** | ❌ (locked) | ✅ (~40) | badges.tsx:125-136 |
| **Usage Stats** | ✅ | ✅ | - |
| **Mood Analytics** | ❌ | ✅ | stats.tsx:50 |
| **Session Tracking** | ✅ (unlimited) | ✅ | - |
| **T-Break Management** | ✅ | ✅ | - |
| **Recovery Mode** | ✅ | ✅ | - |
| **Notifications** | ✅ | ✅ | - |

---

## 🎯 Premium Value Proposition

### For Users:
1. **Enhanced Experience:** Dark mode for night usage
2. **More Achievement:** 5x more badges to unlock
3. **Deeper Insights:** Understand mood patterns
4. **Future Access:** All upcoming features included
5. **Support Development:** Help keep the app ad-free

### For Business:
- **ARR Potential:** At 10,000 users with 5% conversion:
  - 500 subscribers × $29.99/year = $14,995/year
  - Or 500 × $4.99/month = $29,940/year

- **LTV:** Average user subscribes for 12 months:
  - Monthly: $4.99 × 12 = $59.88
  - Annual: $29.99 × 1 = $29.99

---

## 🔄 Subscription Management

### User Options:

**Settings Page:**
- Free users: "🚀 Upgrade to Herb Pro" button
- Premium users: "⭐ Herb Pro ACTIVE" badge
- Premium users: "⚙️ Manage Subscription" button

**Customer Center (Premium Users Only):**
- View subscription details
- Change plan (monthly ↔ annual)
- Update payment method
- Cancel subscription
- Contact support

**Restore Purchases:**
- Available in PaywallModal
- Restores subscription on new device
- Works across iOS/Android (same account)

---

## 🧪 Testing Premium Features

### Sandbox Testing:

**iOS:**
1. Create sandbox tester account in App Store Connect
2. Sign out of real Apple ID on device
3. Install app
4. Try to purchase → Sign in with sandbox account
5. Complete purchase (won't charge real money)
6. Verify premium features unlock

**Android:**
1. Add test account in Play Console
2. Join internal testing track
3. Install test build
4. Purchase subscription (won't charge real money)
5. Verify premium features unlock

### Production Testing:

1. Build production app
2. Install on device
3. Complete real purchase
4. Verify features unlock
5. Test subscription management
6. Test restore purchases
7. Cancel subscription → features lock after expiry

---

## 📈 Future Premium Features (Roadmap)

### Q1 2026
- [ ] Cloud backup & sync
- [ ] Export data to CSV
- [ ] Advanced streak tracking
- [ ] Custom goals and reminders

### Q2 2026
- [ ] Custom themes & colors
- [ ] Widgets (iOS/Android)
- [ ] Apple Watch companion
- [ ] Social features (optional friend tracking)

### Q3 2026
- [ ] AI insights and recommendations
- [ ] Strain database and effects
- [ ] Tolerance calculator
- [ ] Health milestone tracking

---

## 💡 Best Practices

### When to Show Upgrade Prompts:
✅ **Good Times:**
- User tries to enable dark mode
- User taps locked premium badge
- User tries to access mood analytics tab
- After 10 sessions logged (engaged user)
- After first badge unlocked (achievement moment)

❌ **Bad Times:**
- On app open (annoying)
- During onboarding (too soon)
- After error/crash (poor timing)
- More than once per day

### Messaging:
- Focus on value, not features
- "Unlock deeper insights" > "Get premium"
- Show what they'll gain, not what they're missing
- Time-limited offers for engagement

---

## 🆘 Support & Troubleshooting

### Common Issues:

**"Premium didn't unlock after purchase"**
- Solution: Tap "Restore Purchases" in settings
- Reason: Network issue during sync

**"I was charged but don't have premium"**
- Solution: Check App Store/Play Store purchase history
- Then: Restore purchases in app
- Support: Contact RevenueCat support

**"Can't change subscription plan"**
- Solution: Use Customer Center in settings
- Alternative: Manage via App Store/Play Store

---

**Premium features are fully implemented and ready to monetize!** 🚀

Just configure RevenueCat dashboard and you're ready to launch.

---

Generated by Claude Code
Last Updated: December 13, 2025
