# Quick Start: App Submission Guide

## 🚀 Fast Track to App Store & Play Store

This is your condensed, step-by-step guide to get Herb submitted ASAP.

---

## ⚡ Prerequisites (Do First)

### 1. Developer Accounts
```bash
# iOS: Sign up at developer.apple.com ($99/year)
# Android: Sign up at play.google.com/console ($25 one-time)
# Expo: Sign up at expo.dev (free)
```

### 2. Install Tools
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

### 3. Update app.json Values
Replace these placeholders in `app.json`:
- `YOUR_REVENUECAT_API_KEY` → Your RevenueCat key
- `YOUR_EAS_PROJECT_ID` → Your Expo project ID

---

## 📱 Step 1: Create App Icons (30 minutes)

### Option A: Use Existing Mascot (Fastest)
1. Open Figma/Canva
2. Create 1024 x 1024 canvas
3. Add green circle (#00D084)
4. Center raccoon from `assets/level1.png`
5. Export as `assets/icon.png`

### Option B: Use Online Generator
1. Go to https://www.appicon.co/
2. Upload your 1024 x 1024 design
3. Download all sizes
4. Copy to `assets/icon.png`

### Android Adaptive Icon
1. Create 432 x 432 canvas
2. Center raccoon in 264 x 264 safe zone
3. Export as `assets/adaptive-icon.png`

**✅ Checklist:**
- [ ] `assets/icon.png` (1024 x 1024)
- [ ] `assets/adaptive-icon.png` (432 x 432)

---

## 📸 Step 2: Take Screenshots (1 hour)

### Setup Demo Data
```bash
# Start app
npx expo start

# Add demo data:
# - 15-20 sessions over 3 weeks
# - Various moods (great, happy, calm, anxious)
# - Different methods (joint, bong, edible)
# - Unlock 2-3 badges
# - Enable recovery mode (set 7 days ago)
```

### Take Screenshots

**iOS (iPhone 15 Pro Max):**
```bash
# Open simulator
npx expo start → press 'i'

# Device: iPhone 15 Pro Max (6.7")
# Take screenshots: CMD + S

Required screenshots (1290 x 2796):
1. Home screen (light mode)
2. Session entry modal
3. Stats → Usage tab
4. Stats → Mood tab
5. Badges screen
6. Recovery mode active
```

**Android (Pixel 7 Pro):**
```bash
# Open emulator
npx expo start → press 'a'

# Device: Pixel 7 Pro
# Take screenshots: Toolbar → Camera icon

Required screenshots (1440 x 2560):
Same 6 screenshots as iOS
```

### Optional: Add Text Overlays
Use Figma/Canva to add text:
- "Track Sessions Effortlessly"
- "Understand Your Patterns"
- "Earn Achievements"
- etc.

**✅ Checklist:**
- [ ] 6-8 iOS screenshots (1290 x 2796)
- [ ] 6-8 Android screenshots (1440 x 2560)
- [ ] Feature graphic for Android (1024 x 500)

---

## 🏗️ Step 3: Build App (30 minutes)

### Configure Credentials
```bash
# Generate iOS credentials
eas credentials

# Follow prompts to create certificates and provisioning profiles
```

### Build for iOS
```bash
eas build --platform ios --profile production

# Wait 10-20 minutes for build to complete
# Download .ipa when ready
```

### Build for Android
```bash
eas build --platform android --profile production

# Wait 10-20 minutes for build to complete
# Download .aab when ready
```

**✅ Checklist:**
- [ ] iOS build successful (.ipa downloaded)
- [ ] Android build successful (.aab downloaded)
- [ ] Tested on device/simulator

---

## 🍎 Step 4: Submit to App Store (1 hour)

### Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform:** iOS
   - **Name:** Herb - Cannabis Tracker
   - **Primary Language:** English
   - **Bundle ID:** com.hemalayas.herb (create if doesn't exist)
   - **SKU:** herb-cannabis-tracker
   - **User Access:** Full Access

### Upload Build
```bash
# Option 1: Use Transporter app (Mac)
# Download from Mac App Store
# Drag .ipa file to upload

# Option 2: Use EAS Submit
eas submit --platform ios

# Follow prompts
```

### Fill Out App Information

**Version Information:**
- Version: 1.0.0
- Description: Copy from `STORE_LISTING_IOS.md`
- Keywords: `cannabis,weed,marijuana,tracker,sobriety,recovery,t-break,tolerance,consumption,mindful,journal`
- Support URL: Your website
- Privacy Policy URL: Your hosted privacy policy

**Screenshots:**
- Upload all 6-8 iPhone 6.7" screenshots

**App Icon:**
- Upload 1024 x 1024 icon

**Age Rating:**
- Complete questionnaire
- Select: 17+ (Cannabis references)

**App Review Information:**
- Notes: Copy from `STORE_LISTING_IOS.md` → "Notes for Reviewer"

### Submit for Review
1. Click "Add for Review"
2. Select your build
3. Answer export compliance: No
4. Click "Submit for Review"
5. Wait 1-3 days for review

**✅ Checklist:**
- [ ] App created in App Store Connect
- [ ] Build uploaded and selected
- [ ] All metadata filled out
- [ ] Screenshots uploaded
- [ ] Submitted for review

---

## 🤖 Step 5: Submit to Google Play (1 hour)

### Create App in Play Console
1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill in:
   - **App name:** Herb - Cannabis Tracker
   - **Default language:** English (United States)
   - **App or game:** Application
   - **Free or paid:** Free
4. Declare app follows policies
5. Click "Create app"

### Complete Dashboard Tasks

**Store Listing:**
1. Main store listing:
   - Copy text from `STORE_LISTING_ANDROID.md`
   - Upload icon (512 x 512)
   - Upload feature graphic (1024 x 500)
   - Upload screenshots (6-8 images)
2. Save

**App Content:**
1. Privacy Policy → Enter URL
2. App access → "All functionality is available without special access"
3. Ads → "No, my app does not contain ads"
4. Content ratings → Complete questionnaire (expect Mature 17+)
5. Target audience → Age 18+ (or 21+)
6. News app → No
7. COVID-19 → No
8. Data safety → Complete form (no data collection/sharing)

**Set Up App:**
1. App category → Health & Fitness
2. Store presence → Default settings
3. Select countries (legal jurisdictions only)

### Upload Build
1. Go to "Production" → "Create new release"
2. Upload your .aab file
3. Enter release notes (copy from `STORE_LISTING_ANDROID.md`)
4. Save

### Submit for Review
1. Review all sections (green checkmarks)
2. Click "Send for review"
3. Wait 1-7 days for review

**✅ Checklist:**
- [ ] App created in Play Console
- [ ] All dashboard tasks completed
- [ ] Build uploaded
- [ ] All metadata filled out
- [ ] Submitted for review

---

## 📊 Step 6: Monitor & Respond (Ongoing)

### Daily Checks
- [ ] Check App Store Connect for iOS status
- [ ] Check Play Console for Android status
- [ ] Respond to any reviewer questions within 24 hours

### If Approved
- [ ] Test download from actual stores
- [ ] Share app links
- [ ] Monitor reviews
- [ ] Respond to user feedback

### If Rejected
1. Read rejection reason carefully
2. Fix issues (see common issues in `SUBMISSION_CHECKLIST.md`)
3. Update build/metadata as needed
4. Resubmit with explanation
5. Be patient and professional

---

## 🎯 Common Issues & Quick Fixes

### "Privacy Policy URL Not Accessible"
**Fix:**
```bash
# Host your privacy policy at:
# - GitHub Pages (free)
# - Your website
# - Firebase Hosting (free)

# Update in both store listings
```

### "Age Rating Incorrect"
**Fix:**
- iOS: Go to App Information → Age Rating → Select 17+
- Android: App Content → Content ratings → Retake questionnaire

### "Cannabis Content Violation"
**Fix:**
- Emphasize "tracking" and "wellness" in description
- Add clear disclaimers: "Does not facilitate sales"
- Only distribute in legal regions
- Highlight harm reduction aspects

### "Screenshots Show Non-Functional Features"
**Fix:**
- Remove any "Herb Pro" or "Coming Soon" screenshots
- Only show working features
- Re-upload corrected screenshots

### "Misleading Functionality"
**Fix:**
- Ensure all features in screenshots actually work
- Test app thoroughly before submission
- Update descriptions to match current features

---

## ⏱️ Timeline Estimate

| Task | Time Required |
|------|---------------|
| Create app icons | 30 min - 2 hours |
| Take screenshots | 1 - 2 hours |
| Build app (iOS + Android) | 30 min - 1 hour |
| App Store Connect setup | 1 - 2 hours |
| Play Console setup | 1 - 2 hours |
| **Total:** | **4 - 8 hours** |
| **Review time:** | **1 - 7 days** |

---

## 📋 Pre-Submission Final Check

Before hitting "Submit for Review":

**Legal:**
- [ ] Age gate works (21+)
- [ ] Privacy Policy accessible
- [ ] Terms accessible
- [ ] Only in legal regions

**Technical:**
- [ ] No crashes
- [ ] All features work
- [ ] Tested on real devices

**Store:**
- [ ] Metadata complete
- [ ] Screenshots accurate
- [ ] Icon professional
- [ ] Descriptions compelling

**If all checked → SUBMIT! 🚀**

---

## 📞 Need Help?

**Documentation:**
- Full details: See `SUBMISSION_CHECKLIST.md`
- iOS copy: See `STORE_LISTING_IOS.md`
- Android copy: See `STORE_LISTING_ANDROID.md`
- Screenshots: See `SCREENSHOTS.md`
- Icons: See `ICON_GUIDE.md`

**Resources:**
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Play Store Policy: https://play.google.com/about/developer-content-policy/
- Expo Docs: https://docs.expo.dev/

**Support:**
- Expo Discord: https://chat.expo.dev/
- r/reactnative
- r/expo

---

## 🎉 You're Ready!

Follow these steps and you'll have Herb live in the App Store and Play Store within a week!

Good luck! 🌿✨

**Track mindfully. Live better.** 🦝💚
