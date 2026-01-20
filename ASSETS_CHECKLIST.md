# 📋 App Store Assets Checklist

## Quick Reference for All Required Assets

---

## 🎨 App Icons

### iOS App Icon
- [x] **Size:** 1024 x 1024 px
- [x] **Format:** PNG (no transparency)
- [x] **Location:** `assets/icon.png`
- [x] **Status:** ⏳ **NEED TO CREATE**
- [x] **Guide:** [ICON_GUIDE.md](ICON_GUIDE.md)

**Design:**
- Herb raccoon mascot on green background
- Circular design with #00D084 green
- No rounded corners (iOS adds automatically)

---

### Android Adaptive Icon
- [x] **Foreground:** 432 x 432 px (PNG with transparency)
- [x] **Location:** `assets/adaptive-icon.png`
- [x] **Background:** #00D084 (solid green)
- [x] **Safe Zone:** Center 264 x 264 px
- [x] **Status:** ⏳ **NEED TO CREATE**
- [x] **Guide:** [ICON_GUIDE.md](ICON_GUIDE.md)

**Design:**
- Raccoon centered in safe zone
- Transparent background (green set in app.json)
- Works with circle, square, squircle shapes

---

## 📸 Screenshots

### iOS iPhone 6.7" (REQUIRED)
**Dimensions:** 1290 x 2796 px (Portrait)

| # | Screen | Description | Status |
|---|--------|-------------|--------|
| 1 | Home Screen | Session list, + button, mascot | ⏳ Capture |
| 2 | Session Entry | Detailed entry modal | ⏳ Capture |
| 3 | Usage Stats | Charts and analytics | ⏳ Capture |
| 4 | Mood Analytics | Mood tracking graph | ⏳ Capture |
| 5 | Badges | Achievement collection | ⏳ Capture |
| 6 | Recovery Mode | Sobriety tracking | ⏳ Capture |
| 7 | Dark Mode (opt) | Same as #1 or #3 in dark | ⏳ Capture |

**Guide:** [SCREENSHOTS.md](SCREENSHOTS.md)

---

### iOS iPhone 6.5" (REQUIRED)
**Dimensions:** 1242 x 2688 px (Portrait)

- [ ] Same 6-7 screenshots as above
- [ ] Resize or recapture at this size
- [ ] **Status:** ⏳ **NEED TO CREATE**

---

### Android Phone
**Dimensions:** 1440 x 2560 px (Recommended) or 1080 x 1920 px

| # | Screen | Description | Status |
|---|--------|-------------|--------|
| 1 | Home Screen | Session list, + button, mascot | ⏳ Capture |
| 2 | Session Entry | Detailed entry modal | ⏳ Capture |
| 3 | Usage Stats | Charts and analytics | ⏳ Capture |
| 4 | Mood Analytics | Mood tracking graph | ⏳ Capture |
| 5 | Badges | Achievement collection | ⏳ Capture |
| 6 | Recovery Mode | Sobriety tracking | ⏳ Capture |

**Minimum:** 2 screenshots
**Recommended:** 6-8 screenshots
**Guide:** [SCREENSHOTS.md](SCREENSHOTS.md)

---

### Android Feature Graphic (REQUIRED)
- [ ] **Size:** 1024 x 500 px
- [ ] **Format:** JPG or PNG (24-bit, no transparency)
- [ ] **Status:** ⏳ **NEED TO CREATE**
- [ ] **Guide:** [FEATURE_GRAPHIC_TEMPLATE.md](FEATURE_GRAPHIC_TEMPLATE.md)

**Design:**
- Landscape banner for Play Store
- Mascot + "HERB" text + tagline
- Green background (#00D084)
- High visual appeal

---

## 📝 Store Listing Text

### iOS App Store

#### Basic Info
- [x] **App Name:** Herb - Cannabis Tracker (23 chars) ✅
- [x] **Subtitle:** Track Your Cannabis Journey (27 chars) ✅
- [x] **Category:** Health & Fitness ✅
- [x] **Age Rating:** 17+ (Cannabis) ✅

#### Descriptions
- [x] **Promotional Text:** 169 chars ✅ See STORE_LISTING_IOS.md
- [x] **Description:** 3,197 chars ✅ See STORE_LISTING_IOS.md
- [x] **Keywords:** 98 chars ✅ See STORE_LISTING_IOS.md

#### URLs
- [ ] **Support URL:** ⏳ Your website
- [ ] **Privacy Policy URL:** ⏳ Hosted URL (REQUIRED)
- [ ] **Marketing URL:** ⏳ Optional

**Status:** ✅ Copy written, ⏳ URLs needed

---

### Google Play Store

#### Basic Info
- [x] **App Name:** Herb - Cannabis Tracker (23 chars) ✅
- [x] **Short Description:** 80 chars ✅
- [x] **Category:** Health & Fitness ✅
- [x] **Content Rating:** Mature 17+ ✅

#### Descriptions
- [x] **Full Description:** 3,197 chars ✅ See STORE_LISTING_ANDROID.md
- [x] **Tags:** 5 tags selected ✅

#### URLs
- [ ] **Website:** ⏳ Your website
- [ ] **Email:** ⏳ support@hemalayas.com
- [ ] **Privacy Policy URL:** ⏳ Hosted URL (REQUIRED)

**Status:** ✅ Copy written, ⏳ URLs needed

---

## 🏗️ Builds

### iOS Build
- [ ] **Format:** .ipa file
- [ ] **Method:** `npm run build:ios` or `eas build --platform ios`
- [ ] **Upload To:** App Store Connect via Transporter or EAS Submit
- [ ] **Status:** ⏳ **NOT YET BUILT**

**Requirements:**
- Apple Developer account ($99/year)
- EAS CLI installed
- Credentials configured

---

### Android Build
- [ ] **Format:** .aab file (recommended) or .apk
- [ ] **Method:** `npm run build:android` or `eas build --platform android`
- [ ] **Upload To:** Google Play Console
- [ ] **Status:** ⏳ **NOT YET BUILT**

**Requirements:**
- Google Play Developer account ($25 one-time)
- EAS CLI installed
- Keystore generated

---

## 📄 Legal Documents

### Privacy Policy
- [x] **In-App Screen:** ✅ Created ([app/privacy-policy.tsx](app/privacy-policy.tsx))
- [ ] **Hosted URL:** ⏳ Need to host publicly (REQUIRED for stores)
- [ ] **Accessible From:** Settings → Privacy Policy ✅

**Status:** ✅ Content complete, ⏳ Need hosting

---

### Terms of Service
- [x] **In-App Screen:** ✅ Created ([app/terms-of-service.tsx](app/terms-of-service.tsx))
- [ ] **Hosted URL:** ⏳ Optional but recommended
- [ ] **Accessible From:** Settings → Terms of Service ✅

**Status:** ✅ Content complete, ⏳ Optional hosting

---

### Age Verification
- [x] **Screen:** ✅ Created ([app/age-verification.tsx](app/age-verification.tsx))
- [x] **Requirement:** 21+ age gate ✅
- [x] **Storage:** AsyncStorage ✅
- [x] **Flow:** Age verify → Onboarding → Paywall → App ✅

**Status:** ✅ Complete and working

---

## 🔐 Accounts & Credentials

### Apple Developer Account
- [ ] **Enrolled:** ⏳ Need to enroll ($99/year)
- [ ] **Team ID:** ⏳ Get after enrollment
- [ ] **App Store Connect Access:** ⏳ Set up after enrollment
- [ ] **Certificates:** ⏳ Generate with EAS

**Sign up:** https://developer.apple.com/programs/

---

### Google Play Developer Account
- [ ] **Registered:** ⏳ Need to register ($25 one-time)
- [ ] **Play Console Access:** ⏳ Access after registration
- [ ] **Service Account Key:** ⏳ Generate for EAS submit
- [ ] **Keystore:** ⏳ Generate with EAS

**Sign up:** https://play.google.com/console/signup

---

### Expo/EAS Account
- [ ] **Account Created:** ⏳ Sign up at expo.dev
- [ ] **EAS CLI Installed:** ⏳ `npm install -g eas-cli`
- [ ] **Logged In:** ⏳ `eas login`
- [ ] **Project ID:** ⏳ Get after running `eas build:configure`

**Sign up:** https://expo.dev/

---

### RevenueCat (Optional - For Subscriptions)
- [ ] **Account Created:** ⏳ Sign up at revenuecat.com
- [ ] **API Key:** ⏳ Get from dashboard
- [ ] **iOS App Store Integration:** ⏳ Configure
- [ ] **Google Play Integration:** ⏳ Configure
- [ ] **Products Created:** ⏳ Set up Herb Pro tiers

**Note:** Can be added post-launch. App currently shows "Coming Soon" for premium.

---

## ✅ Master Checklist

### Assets to Create
- [ ] iOS icon (1024x1024)
- [ ] Android adaptive icon (432x432)
- [ ] iOS screenshots 6.7" (6-8 images)
- [ ] iOS screenshots 6.5" (6-8 images)
- [ ] Android screenshots (6-8 images)
- [ ] Android feature graphic (1024x500)

### Text/URLs to Prepare
- [ ] Support website URL
- [ ] Privacy Policy hosted URL (REQUIRED)
- [ ] Support email address
- [ ] Marketing website URL (optional)

### Builds to Generate
- [ ] iOS production build (.ipa)
- [ ] Android production build (.aab)

### Accounts to Set Up
- [ ] Apple Developer ($99/year)
- [ ] Google Play Developer ($25)
- [ ] Expo account (free)
- [ ] RevenueCat (optional)

### Stores to Configure
- [ ] App Store Connect listing
- [ ] Google Play Console listing
- [ ] Upload builds
- [ ] Fill in all metadata
- [ ] Submit for review

---

## 🎯 Priority Order

### High Priority (Must Do Before Submission)
1. ⭐ Create app icons (iOS and Android)
2. ⭐ Take screenshots (6-8 per platform)
3. ⭐ Create feature graphic (Android)
4. ⭐ Host Privacy Policy at public URL
5. ⭐ Set up developer accounts (Apple & Google)
6. ⭐ Build apps (iOS and Android)
7. ⭐ Create store listings
8. ⭐ Submit for review

### Medium Priority (Should Do Soon After)
1. Monitor review status daily
2. Respond to reviewer questions
3. Test downloaded apps from stores
4. Set up crash reporting
5. Plan marketing strategy

### Low Priority (Can Do Later)
1. Enable RevenueCat subscriptions
2. Add analytics (if desired)
3. Build iPad-optimized version
4. Add more languages
5. Create promotional video

---

## 📊 Progress Tracker

### Overall Progress: 60% Complete

| Category | Progress | Status |
|----------|----------|--------|
| App Development | ████████████████████ 100% | ✅ Complete |
| Legal Documents | ████████████████████ 100% | ✅ Complete |
| Documentation | ████████████████████ 100% | ✅ Complete |
| Configuration | ████████████████████ 100% | ✅ Complete |
| Assets | ░░░░░░░░░░░░░░░░░░░░ 0% | ⏳ To Do |
| Builds | ░░░░░░░░░░░░░░░░░░░░ 0% | ⏳ To Do |
| Store Setup | ░░░░░░░░░░░░░░░░░░░░ 0% | ⏳ To Do |

**Estimated Time to Complete:** 4-8 hours of work

---

## 🚀 Quick Links

- **Start Here:** [QUICK_START_SUBMISSION.md](QUICK_START_SUBMISSION.md)
- **Full Checklist:** [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md)
- **iOS Copy:** [STORE_LISTING_IOS.md](STORE_LISTING_IOS.md)
- **Android Copy:** [STORE_LISTING_ANDROID.md](STORE_LISTING_ANDROID.md)
- **Icons Guide:** [ICON_GUIDE.md](ICON_GUIDE.md)
- **Screenshots Guide:** [SCREENSHOTS.md](SCREENSHOTS.md)
- **Feature Graphic:** [FEATURE_GRAPHIC_TEMPLATE.md](FEATURE_GRAPHIC_TEMPLATE.md)
- **Package Overview:** [STORE_SUBMISSION_PACKAGE.md](STORE_SUBMISSION_PACKAGE.md)

---

## ✨ You're Almost There!

The hard work (development, legal, documentation) is done.
Now you just need to:
1. Create visual assets (icons, screenshots)
2. Build the apps
3. Submit to stores

**Follow the guides and you'll be live in ~1 week!** 🎉

---

**Track mindfully. Live better.** 🌿🦝
