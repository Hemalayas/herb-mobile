# 📦 Herb App - Complete Submission Package

## Overview

This package contains everything you need to submit **Herb - Cannabis Tracker** to the App Store and Google Play Store.

---

## 📁 What's Included

### Configuration Files
- ✅ **app.json** - Complete app configuration with bundle IDs, permissions, and metadata
- ✅ **eas.json** - EAS Build configuration for iOS and Android
- ✅ **package.json** - All dependencies (already exists)

### Documentation
- 📘 **QUICK_START_SUBMISSION.md** - Fast-track guide (START HERE!)
- 📗 **SUBMISSION_CHECKLIST.md** - Complete step-by-step checklist
- 📕 **STORE_LISTING_IOS.md** - All App Store copy and requirements
- 📙 **STORE_LISTING_ANDROID.md** - All Play Store copy and requirements
- 📸 **SCREENSHOTS.md** - Screenshot specifications and guide
- 🎨 **ICON_GUIDE.md** - App icon generation instructions

### Legal Documents (In-App)
- ✅ **app/privacy-policy.tsx** - Privacy policy screen
- ✅ **app/terms-of-service.tsx** - Terms of service screen
- ✅ **app/age-verification.tsx** - Age gate (21+)

---

## 🚀 Quick Start (4-8 Hours Total)

### 1️⃣ Create Icons (30 min)
```bash
# See: ICON_GUIDE.md
# Need: 1024x1024 icon.png and 432x432 adaptive-icon.png
```

### 2️⃣ Take Screenshots (1 hour)
```bash
# See: SCREENSHOTS.md
# Need: 6-8 screenshots per platform
```

### 3️⃣ Build App (30 min)
```bash
npm install -g eas-cli
eas login
eas build --platform all
```

### 4️⃣ Submit to Stores (2 hours)
```bash
# iOS: Upload to App Store Connect
# Android: Upload to Play Console
# See: QUICK_START_SUBMISSION.md
```

### 5️⃣ Wait for Review (1-7 days)
- iOS: Typically 1-3 days
- Android: Typically 1-7 days

---

## 📊 Project Status

### ✅ Completed
- [x] App functionality complete
- [x] Age verification implemented (21+)
- [x] Privacy Policy screen
- [x] Terms of Service screen
- [x] Dark mode support
- [x] Local data storage (SQLite)
- [x] Badge system
- [x] Recovery mode
- [x] Mood tracking
- [x] Session logging
- [x] Analytics/stats
- [x] app.json configuration
- [x] eas.json configuration
- [x] Store listing copy (iOS & Android)
- [x] Screenshot specifications
- [x] Icon guidelines

### ⏳ To Do Before Submission
- [ ] Create app icons (1024x1024 and 432x432)
- [ ] Take screenshots (6-8 per platform)
- [ ] Build production builds (iOS and Android)
- [ ] Set up Apple Developer account ($99/year)
- [ ] Set up Google Play Developer account ($25 one-time)
- [ ] Create App Store Connect listing
- [ ] Create Play Console listing
- [ ] Upload builds and metadata
- [ ] Submit for review

### 🔜 Post-Launch (After Approval)
- [ ] Enable RevenueCat subscriptions (Herb Pro)
- [ ] Monitor crash reports
- [ ] Respond to user reviews
- [ ] Gather feedback for v1.1
- [ ] Marketing and promotion

---

## 📝 Store Listing Summary

### App Details
**Name:** Herb - Cannabis Tracker
**Subtitle:** Track Your Cannabis Journey (27 chars)
**Category:** Health & Fitness
**Age Rating:** 17+ (Cannabis content)
**Price:** Free (with In-App Purchases - Coming Soon)

### Bundle Identifiers
**iOS:** `com.hemalayas.herb`
**Android:** `com.hemalayas.herb`

### Version
**Version:** 1.0.0
**iOS Build Number:** 1
**Android Version Code:** 1

---

## 🎨 Assets Needed

### App Icons
| Platform | Size | File | Status |
|----------|------|------|--------|
| iOS | 1024 x 1024 | assets/icon.png | ⏳ Create |
| Android | 512 x 512 | (auto-generated from icon.png) | ⏳ Create |
| Android Adaptive | 432 x 432 | assets/adaptive-icon.png | ⏳ Create |

**Guide:** See ICON_GUIDE.md

### Screenshots
| Platform | Device | Dimensions | Quantity | Status |
|----------|--------|------------|----------|--------|
| iOS | iPhone 6.7" | 1290 x 2796 | 6-8 | ⏳ Capture |
| iOS | iPhone 6.5" | 1242 x 2688 | 6-8 | ⏳ Capture |
| Android | Phone | 1440 x 2560 | 6-8 | ⏳ Capture |

**Guide:** See SCREENSHOTS.md

### Feature Graphic (Android Only)
| Asset | Dimensions | Status |
|-------|------------|--------|
| Feature Graphic | 1024 x 500 | ⏳ Create |

---

## 📖 Documentation Index

### For Quick Submission
1. **Start Here:** [QUICK_START_SUBMISSION.md](QUICK_START_SUBMISSION.md)
   - Fast-track guide with commands
   - 4-8 hour timeline
   - Essential steps only

### For Complete Details
2. **Full Checklist:** [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md)
   - Every single step
   - Pre-flight checks
   - Post-launch tasks

### For Store Listings
3. **iOS Copy:** [STORE_LISTING_IOS.md](STORE_LISTING_IOS.md)
   - App name, subtitle, description
   - Keywords and categories
   - Screenshots requirements
   - App Review notes

4. **Android Copy:** [STORE_LISTING_ANDROID.md](STORE_LISTING_ANDROID.md)
   - Short and full descriptions
   - Content rating guidance
   - Feature graphic specs
   - Review tips

### For Assets
5. **Screenshots:** [SCREENSHOTS.md](SCREENSHOTS.md)
   - Exact dimensions per device
   - Content plan for each screenshot
   - How to capture and edit
   - Text overlay guidelines

6. **Icons:** [ICON_GUIDE.md](ICON_GUIDE.md)
   - All required sizes
   - Design guidelines
   - Generation tools
   - Adaptive icon specs

---

## 🔧 Configuration Files

### app.json
Located at root: `app.json`

**Key Settings:**
- App name: "Herb - Cannabis Tracker"
- Bundle ID: com.hemalayas.herb (iOS and Android)
- Version: 1.0.0
- Orientation: portrait
- Icon paths configured
- Splash screen configured (#00D084 green)
- Permissions: VIBRATE only (Android)

**Update Before Build:**
- `YOUR_REVENUECAT_API_KEY` → Your RevenueCat key
- `YOUR_EAS_PROJECT_ID` → Your Expo project ID

### eas.json
Located at root: `eas.json`

**Profiles:**
- **development:** For local testing with simulator
- **preview:** For internal testing (APK/IPA)
- **production:** For App Store/Play Store submission

**Update Before Submit:**
- iOS: `appleId`, `ascAppId`, `appleTeamId`
- Android: `serviceAccountKeyPath`

---

## 🌍 Distribution Strategy

### Countries/Regions to Target (Legal Cannabis)

**North America:**
- 🇺🇸 United States
- 🇨🇦 Canada
- 🇲🇽 Mexico

**Europe:**
- 🇳🇱 Netherlands
- 🇩🇪 Germany
- 🇪🇸 Spain
- 🇵🇹 Portugal
- 🇨🇭 Switzerland
- 🇧🇪 Belgium
- 🇨🇿 Czech Republic

**South America:**
- 🇺🇾 Uruguay

**Asia:**
- 🇹🇭 Thailand

**Oceania:**
- 🇦🇺 Australia (select states only - research first)

**IMPORTANT:** Research cannabis laws in each region before enabling. Laws change frequently!

---

## 💰 Monetization (Coming Soon)

### Herb Pro Subscription
Currently marked "Coming Soon" in app.

**Planned Pricing:**
- Monthly: $4.99/month
- Yearly: $39.99/year (33% savings)
- Lifetime: $79.99 one-time

**Features (when enabled):**
- Advanced analytics and trends
- Data export (CSV, JSON, PDF)
- Unlimited historical data
- Custom goals and reminders
- Priority support

**Setup Required:**
1. Configure products in App Store Connect
2. Configure products in Google Play Console
3. Set up in RevenueCat dashboard
4. Test purchases in sandbox
5. Enable in app (remove "Coming Soon")

---

## 🔒 Privacy & Compliance

### Data Storage
✅ **100% Local Storage**
- All data stored in SQLite on device
- No cloud sync (unless user exports manually)
- No third-party analytics
- No user tracking

### Third-Party Services
- **RevenueCat:** Subscription management only (when enabled)
- **No other services:** No analytics, ads, or tracking

### Legal Requirements Met
✅ Age verification (21+)
✅ Privacy Policy (in-app and hosted)
✅ Terms of Service (in-app)
✅ Cannabis legal disclaimers
✅ Medical disclaimers
✅ No facilitation of sales

---

## 🐛 Known Issues / Limitations

### Current Limitations
- No data export yet (Herb Pro feature)
- No cloud backup (local only)
- No social features
- No reminders/notifications (coming soon)

### Tested On
- ✅ iOS 13.4+ (latest tested: iOS 17)
- ✅ Android 8.0+ (API 26+)
- ✅ iPhone SE (smallest screen)
- ✅ iPhone 15 Pro Max (largest screen)
- ✅ Various Android devices

### Not Yet Tested
- ⏳ iPad (app works but not optimized)
- ⏳ Android tablets

---

## 📈 Success Metrics (Post-Launch)

### Week 1 Goals
- 100 downloads
- 4+ star rating
- No critical bugs reported
- < 1% crash rate

### Month 1 Goals
- 500 downloads
- 50+ active users
- 4.5+ star rating
- User feedback for v1.1

### Month 3 Goals
- 2,000 downloads
- 200+ active users
- Featured in "New Apps We Love" (goal)
- Herb Pro subscriptions enabled

---

## 🆘 Support Resources

### Official Documentation
- **Apple:** https://developer.apple.com/
- **Google Play:** https://developer.android.com/distribute
- **Expo:** https://docs.expo.dev/
- **RevenueCat:** https://docs.revenuecat.com/

### Community
- **Expo Discord:** https://chat.expo.dev/
- **Reddit:** r/reactnative, r/expo, r/androiddev, r/iOSProgramming
- **Stack Overflow:** #expo, #react-native, #eas

### Contact
- **App Store Review:** Via App Store Connect
- **Play Store Review:** Via Play Console Help
- **Expo Support:** support@expo.dev

---

## ✅ Final Pre-Launch Checklist

**Before you start submission process:**

### Legal
- [ ] Age 21+ requirement enforced
- [ ] Privacy Policy accessible in app
- [ ] Terms of Service accessible in app
- [ ] Legal disclaimers present
- [ ] Only distributing in legal regions

### Technical
- [ ] App tested on iOS 13.4+
- [ ] App tested on Android 8.0+
- [ ] No crashes on launch
- [ ] No crashes during normal use
- [ ] All features working
- [ ] Data persists after restart

### Assets
- [ ] App icon created (1024x1024)
- [ ] Adaptive icon created (432x432)
- [ ] 6-8 screenshots per platform
- [ ] Feature graphic created (Android)
- [ ] All assets at exact dimensions

### Metadata
- [ ] App description written
- [ ] Keywords optimized
- [ ] Support URL ready
- [ ] Privacy Policy URL hosted
- [ ] Screenshots show working features

### Accounts
- [ ] Apple Developer account active
- [ ] Google Play Developer account active
- [ ] Expo account set up
- [ ] RevenueCat configured (optional)

**If all checked → START SUBMISSION! 🚀**

---

## 🎯 Estimated Timeline

| Milestone | Time |
|-----------|------|
| Create assets (icons, screenshots) | 2-4 hours |
| Build app (iOS + Android) | 30-60 minutes |
| Set up store listings | 2-3 hours |
| Submit for review | 5 minutes |
| **Total prep time** | **4-8 hours** |
| **Review time (iOS)** | **1-3 days** |
| **Review time (Android)** | **1-7 days** |
| **LIVE IN STORES** | **~1 week** |

---

## 🎉 Next Steps

1. **Read:** [QUICK_START_SUBMISSION.md](QUICK_START_SUBMISSION.md) for fast-track guide
2. **Create:** App icons (see ICON_GUIDE.md)
3. **Capture:** Screenshots (see SCREENSHOTS.md)
4. **Build:** Production builds with EAS
5. **Submit:** Follow checklists in SUBMISSION_CHECKLIST.md
6. **Monitor:** Check review status daily
7. **Launch:** Celebrate when approved! 🎊

---

## 📞 Questions?

Everything you need is in this package:
- Quick start: QUICK_START_SUBMISSION.md
- Full details: SUBMISSION_CHECKLIST.md
- iOS copy: STORE_LISTING_IOS.md
- Android copy: STORE_LISTING_ANDROID.md
- Screenshots: SCREENSHOTS.md
- Icons: ICON_GUIDE.md

**You've got this! 🌿✨**

---

**Track mindfully. Live better.** 🦝💚

---

*Last updated: December 12, 2024*
*Version: 1.0.0*
*Status: Ready for submission*
