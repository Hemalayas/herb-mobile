# App Store & Play Store Submission Checklist

## 📋 Complete Pre-Submission Checklist

Use this master checklist to ensure you have everything ready for successful App Store and Google Play Store submissions.

---

## 🎯 Phase 1: Pre-Development (Account Setup)

### Apple Developer Account
- [ ] Enrolled in Apple Developer Program ($99/year)
- [ ] Account verified and active
- [ ] Agreed to latest agreements in App Store Connect
- [ ] Payment and tax information completed

### Google Play Developer Account
- [ ] Registered for Google Play Console ($25 one-time fee)
- [ ] Account verified
- [ ] Payment profile set up
- [ ] Tax information provided

### Expo/EAS Account
- [ ] Expo account created at expo.dev
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged in: `eas login`
- [ ] Project configured: `eas build:configure`

### RevenueCat (In-App Purchases)
- [ ] RevenueCat account created
- [ ] API keys obtained
- [ ] iOS App Store integration configured
- [ ] Google Play integration configured
- [ ] Products/subscriptions configured

---

## 🎨 Phase 2: Assets & Content Preparation

### App Icons
- [ ] Master icon created (1024 x 1024 PNG)
- [ ] Saved to `assets/icon.png`
- [ ] Android adaptive icon created (432 x 432 PNG)
- [ ] Saved to `assets/adaptive-icon.png`
- [ ] Icon looks good at all sizes (tested 20px - 1024px)
- [ ] Icon works on light and dark backgrounds
- [ ] Icon follows design guidelines (see ICON_GUIDE.md)

### Splash Screen
- [ ] Splash screen image created
- [ ] Saved to `assets/splash-icon.png`
- [ ] Background color set to #00D084 in app.json
- [ ] Tested on iOS and Android

### Screenshots
**iOS (iPhone 6.7" - REQUIRED):**
- [ ] Screenshot 1: Home screen (1290 x 2796)
- [ ] Screenshot 2: Session entry (1290 x 2796)
- [ ] Screenshot 3: Usage stats (1290 x 2796)
- [ ] Screenshot 4: Mood analytics (1290 x 2796)
- [ ] Screenshot 5: Badges (1290 x 2796)
- [ ] Screenshot 6: Recovery mode (1290 x 2796)
- [ ] Screenshot 7: Dark mode (optional)
- [ ] Screenshot 8: Settings (optional)

**iOS (iPhone 6.5" - REQUIRED):**
- [ ] All screenshots resized to 1242 x 2688

**Android (Phone):**
- [ ] Screenshot 1-6: Same content (1080 x 1920 or 1440 x 2560)
- [ ] Minimum 2 screenshots (ideally 6-8)

**Android Feature Graphic:**
- [ ] Feature graphic created (1024 x 500 JPG/PNG)

### Store Listing Copy
- [ ] App name finalized: "Herb - Cannabis Tracker"
- [ ] iOS subtitle written (30 chars)
- [ ] Android short description written (80 chars)
- [ ] Full description written (4000 chars max)
- [ ] Keywords researched and optimized
- [ ] Promotional text written (iOS, 170 chars)
- [ ] What's New text written (560 chars)
- [ ] Copy reviewed for spelling/grammar
- [ ] Legal disclaimers included

### Legal Documents
- [ ] Privacy Policy written
- [ ] Privacy Policy hosted at public URL
- [ ] Privacy Policy accessible in-app (Settings)
- [ ] Terms of Service written
- [ ] Terms of Service accessible in-app (Settings)
- [ ] Age verification implemented (21+)
- [ ] Cannabis legal disclaimers included

---

## 🛠️ Phase 3: App Development & Testing

### Core Functionality
- [ ] Age verification working (21+)
- [ ] Session logging functional (quick and detailed)
- [ ] Stats/analytics displaying correctly
- [ ] Badge system working
- [ ] Recovery mode functional
- [ ] Mood tracking working
- [ ] Dark mode implemented
- [ ] Settings all functional
- [ ] Data persistence working (SQLite)
- [ ] No placeholder/lorem ipsum text

### Navigation & UI
- [ ] All screens accessible
- [ ] Navigation flow logical
- [ ] Back buttons working
- [ ] Tab bar functional
- [ ] Animations smooth (fade, slide, shift)
- [ ] UI matches design specifications
- [ ] Theme switching works (light/dark)
- [ ] Status bar styled correctly

### Data & Storage
- [ ] Local SQLite database working
- [ ] Data persists after app restart
- [ ] No data loss on app updates
- [ ] Age verification persists
- [ ] Settings persist
- [ ] Session data saves correctly
- [ ] Mood entries save correctly
- [ ] Badge progress saves

### Permissions
- [ ] Only required permissions requested
- [ ] Permission descriptions clear and accurate
- [ ] iOS: NSUserTrackingUsageDescription in app.json
- [ ] Android: Only VIBRATE permission (if using haptics)
- [ ] No unnecessary location/camera/microphone requests

### Performance
- [ ] App starts in < 3 seconds
- [ ] No crashes on launch
- [ ] No crashes during normal use
- [ ] Smooth scrolling in lists
- [ ] Charts render efficiently
- [ ] No memory leaks
- [ ] Battery usage reasonable
- [ ] Works on low-end devices

### Testing
**iOS:**
- [ ] Tested on iOS 13.4+ (minimum supported)
- [ ] Tested on iPhone SE (smallest screen)
- [ ] Tested on iPhone 15 Pro Max (largest screen)
- [ ] Tested on iPad (if supporting tablets)
- [ ] Tested in light mode
- [ ] Tested in dark mode
- [ ] Tested fresh install
- [ ] Tested app update scenario

**Android:**
- [ ] Tested on Android 8.0+ (API 26+)
- [ ] Tested on small phone (5" screen)
- [ ] Tested on large phone (6.7" screen)
- [ ] Tested on tablet (optional)
- [ ] Tested on different manufacturers (Samsung, Pixel, etc.)
- [ ] Tested different launcher shapes (circle, square, squircle)
- [ ] Tested light mode
- [ ] Tested dark mode

### Edge Cases
- [ ] Works with no internet connection (local-only app)
- [ ] Handles empty states gracefully (no sessions, no badges)
- [ ] Handles large datasets (100+ sessions)
- [ ] Date boundaries work (midnight, year change)
- [ ] Currency formatting correct
- [ ] Number formatting correct (decimals, commas)
- [ ] Long text doesn't break UI (strain names, notes)

---

## 📦 Phase 4: Build & Configuration

### app.json Configuration
- [ ] App name: "Herb - Cannabis Tracker"
- [ ] Slug: "herb-cannabis-tracker"
- [ ] Version: "1.0.0"
- [ ] iOS bundle ID: "com.hemalayas.herb"
- [ ] Android package: "com.hemalayas.herb"
- [ ] iOS build number: "1"
- [ ] Android version code: 1
- [ ] Icon path correct: "./assets/icon.png"
- [ ] Adaptive icon path correct
- [ ] Splash screen configured
- [ ] Orientation: "portrait"
- [ ] User interface style: "automatic"
- [ ] Permissions listed correctly
- [ ] Plugins configured (expo-router, expo-sqlite, purchases)

### EAS Build Configuration
**eas.json (create if not exists):**
```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.hemalayas.herb",
        "buildNumber": "1"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

- [ ] eas.json created and configured
- [ ] iOS credentials generated: `eas credentials`
- [ ] Android keystore generated: `eas credentials`
- [ ] Service account key downloaded (Android)

### Environment Variables
- [ ] RevenueCat API key configured
- [ ] No hardcoded secrets in code
- [ ] .env files in .gitignore
- [ ] Production environment variables set

### Build Process
**iOS:**
```bash
eas build --platform ios --profile production
```
- [ ] iOS build successful
- [ ] .ipa file downloaded
- [ ] Build tested on physical device (TestFlight)

**Android:**
```bash
eas build --platform android --profile production
```
- [ ] Android build successful
- [ ] .aab or .apk downloaded
- [ ] Build tested on physical device

---

## 🍎 Phase 5: App Store Connect (iOS) Submission

### App Store Connect Setup
- [ ] Logged into appstoreconnect.apple.com
- [ ] Created new app
- [ ] Bundle ID matches app.json: "com.hemalayas.herb"
- [ ] App name: "Herb - Cannabis Tracker"
- [ ] Primary language: English
- [ ] SKU: herb-cannabis-tracker-ios

### App Information
- [ ] App name: "Herb - Cannabis Tracker"
- [ ] Subtitle: "Track Your Cannabis Journey" (27 chars)
- [ ] Category: Health & Fitness
- [ ] Secondary category: Lifestyle (optional)
- [ ] Age rating: 17+ (Cannabis references)
- [ ] License agreement: Standard EULA

### Pricing & Availability
- [ ] Price: Free
- [ ] Availability: Select countries (legal jurisdictions only)
- [ ] Pre-order: No
- [ ] App Store distribution: All regions where available

### Version Information (1.0)
- [ ] Version number: 1.0.0
- [ ] Copyright: © 2024 Hemalayas
- [ ] Promotional text (170 chars) entered
- [ ] Description (4000 chars) entered
- [ ] Keywords (100 chars) entered
- [ ] Support URL entered
- [ ] Marketing URL entered (optional)
- [ ] What's New text entered (560 chars)

### Screenshots & Previews
- [ ] iPhone 6.7" screenshots uploaded (2-10 images)
- [ ] iPhone 6.5" screenshots uploaded (2-10 images)
- [ ] iPad screenshots uploaded (if supporting tablets)
- [ ] App preview video uploaded (optional but recommended)
- [ ] Screenshots in correct order (best first)

### General App Information
- [ ] App icon (1024 x 1024) uploaded
- [ ] Age rating questionnaire completed
- [ ] Privacy Policy URL entered
- [ ] User privacy choices URL (if applicable)

### App Review Information
- [ ] First name, last name, phone, email entered
- [ ] Sign-in required: No (app has no login)
- [ ] Demo account: N/A (no account needed)
- [ ] Notes for reviewer entered (see STORE_LISTING_IOS.md)
- [ ] Attachments uploaded (if needed)

### Build Upload
- [ ] Build uploaded via Xcode or Transporter
- [ ] Build appears in "Build" section
- [ ] Build selected for this version
- [ ] Export compliance: No encryption (if true)

### In-App Purchases (if ready)
- [ ] Herb Pro Monthly subscription created ($4.99)
- [ ] Herb Pro Yearly subscription created ($39.99)
- [ ] Herb Pro Lifetime purchase created ($79.99)
- [ ] All IAP screenshots uploaded
- [ ] All IAP descriptions written
- [ ] IAP pricing set
- [ ] IAP submitted for review

### Final Checks
- [ ] All required fields filled
- [ ] No validation errors
- [ ] Privacy nutrition label completed
- [ ] App reviewed one final time
- [ ] Ready to submit!

### Submit for Review
- [ ] Clicked "Submit for Review"
- [ ] Confirmation received
- [ ] Status: "Waiting for Review"
- [ ] Email notifications set up
- [ ] Monitoring status daily

---

## 🤖 Phase 6: Google Play Console (Android) Submission

### Play Console Setup
- [ ] Logged into play.google.com/console
- [ ] Created new app
- [ ] App name: "Herb - Cannabis Tracker"
- [ ] Default language: English
- [ ] App/Game: Application
- [ ] Free/Paid: Free

### Store Settings
**Main Store Listing:**
- [ ] App name: "Herb - Cannabis Tracker" (30 chars)
- [ ] Short description: 80 chars entered
- [ ] Full description: 4000 chars entered
- [ ] App icon (512 x 512) uploaded
- [ ] Feature graphic (1024 x 500) uploaded
- [ ] Phone screenshots uploaded (minimum 2, ideally 6-8)
- [ ] 7" tablet screenshots (optional)
- [ ] 10" tablet screenshots (optional)
- [ ] Promotional video YouTube URL (optional)

**Store Listing Contact Details:**
- [ ] Email: support@hemalayas.com
- [ ] Phone: (optional)
- [ ] Website: https://herb.hemalayas.com

**Categorization:**
- [ ] App category: Health & Fitness
- [ ] Tags: 5 tags selected
- [ ] Content rating questionnaire completed
- [ ] Expected rating: Mature 17+

### App Content
**Privacy Policy:**
- [ ] Privacy Policy URL entered (REQUIRED)

**App Access:**
- [ ] All or some functionality restricted: No (full access without login)

**Ads:**
- [ ] Contains ads: No
- [ ] Ads declaration completed

**Content Ratings:**
- [ ] IARC questionnaire completed
- [ ] Rating certificate received
- [ ] Mature 17+ rating confirmed

**Target Audience:**
- [ ] Target age group: 18 and over (or 21+)
- [ ] Appeal to children: No

**News Apps:**
- [ ] Is this a news app?: No

**COVID-19 Contact Tracing:**
- [ ] COVID-19 contact tracing/status app: No

**Data Safety:**
- [ ] Data safety form completed
- [ ] Data collection: None (local storage only)
- [ ] Data sharing: None
- [ ] Security practices: Data encrypted in transit (if applicable)
- [ ] Data deletion: Users can request deletion (local data)

**Government Apps:**
- [ ] Government app: No

### App Releases
**Production Track:**
- [ ] Countries/regions selected (legal jurisdictions only)
- [ ] Release name: 1.0.0
- [ ] Release notes entered
- [ ] APK/AAB uploaded
- [ ] No errors or warnings

**Internal Testing (Recommended First):**
- [ ] Internal test track created
- [ ] Test APK/AAB uploaded
- [ ] Email addresses added for testers
- [ ] Tested by internal team
- [ ] No critical bugs found

**Closed Testing (Optional):**
- [ ] Closed test track created (optional)
- [ ] Opt-in URL shared with beta testers
- [ ] Feedback collected

### App Bundle/APK
- [ ] App bundle (.aab) uploaded (recommended)
- [ ] OR APK (.apk) uploaded
- [ ] File size optimized (under 150MB)
- [ ] Target SDK: 34 (Android 14)
- [ ] Minimum SDK: 26 (Android 8.0)
- [ ] All ABIs included (arm64-v8a, armeabi-v7a, x86, x86_64)
- [ ] No security vulnerabilities detected

### In-App Products (if ready)
- [ ] Herb Pro Monthly subscription created
- [ ] Herb Pro Yearly subscription created
- [ ] Herb Pro Lifetime purchase created
- [ ] All products priced
- [ ] All products described
- [ ] All products activated

### Pricing & Distribution
- [ ] Countries: Selected (legal jurisdictions)
- [ ] Pricing: Free
- [ ] Content rating: Mature 17+
- [ ] Distributed on: Google Play for Android

### Final Checks
- [ ] All required sections completed
- [ ] No errors in dashboard
- [ ] Review guidelines read
- [ ] App policy compliance verified
- [ ] Ready to publish!

### Submit to Review
- [ ] Clicked "Send for Review" or "Publish"
- [ ] Confirmation received
- [ ] Status: "Pending Publication" or "In Review"
- [ ] Monitoring status daily

---

## 🚀 Phase 7: Post-Submission

### Monitoring
**iOS:**
- [ ] Check App Store Connect daily for status updates
- [ ] Respond to App Review team if contacted (within 24 hours)
- [ ] Check email for notifications
- [ ] Estimated review time: 1-3 days (sometimes longer)

**Android:**
- [ ] Check Play Console daily for status updates
- [ ] Respond to Google Play team if contacted
- [ ] Check email for notifications
- [ ] Estimated review time: 1-7 days

### If Approved ✅
**iOS:**
- [ ] App appears in App Store
- [ ] Test download from App Store
- [ ] Verify all features working
- [ ] Share App Store link
- [ ] Celebrate! 🎉

**Android:**
- [ ] App appears in Google Play
- [ ] Test download from Play Store
- [ ] Verify all features working
- [ ] Share Play Store link
- [ ] Celebrate! 🎉

### If Rejected ❌
**Common Rejection Reasons:**
1. **Cannabis Content**
   - Solution: Emphasize tracking/wellness, add disclaimers
   - Resubmit with clearer messaging

2. **Privacy Policy Issues**
   - Solution: Ensure URL is accessible, update in-app policy
   - Resubmit with corrected URL

3. **Misleading Features**
   - Solution: Update screenshots to show only working features
   - Remove "Coming Soon" from screenshots

4. **Age Rating Mismatch**
   - Solution: Ensure 17+ rating selected, update questionnaire

5. **Technical Issues**
   - Solution: Fix crashes/bugs, test thoroughly
   - Upload new build and resubmit

**Response Process:**
- [ ] Read rejection reason carefully
- [ ] Fix issues identified
- [ ] Update build if needed (increment version/build number)
- [ ] Update metadata if needed
- [ ] Reply to reviewer with explanation
- [ ] Resubmit for review
- [ ] Be patient and professional

---

## 📈 Phase 8: Post-Launch

### Week 1
- [ ] Monitor crash reports (Sentry, Firebase, etc.)
- [ ] Respond to user reviews (within 24-48 hours)
- [ ] Track download numbers
- [ ] Check search rankings
- [ ] Fix any critical bugs immediately
- [ ] Prepare hotfix release if needed

### Month 1
- [ ] Analyze user feedback
- [ ] Review analytics (retention, engagement)
- [ ] Plan feature updates
- [ ] A/B test store listing (screenshots, description)
- [ ] Build community (social media, support channels)
- [ ] Consider marketing campaigns

### Ongoing
- [ ] Regular updates (monthly or quarterly)
- [ ] Respond to all reviews
- [ ] Monitor app store policies for changes
- [ ] Keep dependencies updated
- [ ] Test on new OS versions
- [ ] Adapt to user requests/feedback
- [ ] Maintain 4+ star rating

### Version Updates
**When to update build number:**
- Bug fixes
- Minor features
- Performance improvements

**When to update version number:**
- Major features (1.0 → 1.1)
- UI redesigns (1.x → 2.0)
- Breaking changes

**Update Process:**
1. Increment version in app.json
2. Build new version: `eas build --platform all`
3. Test new build
4. Upload to App Store Connect / Play Console
5. Update "What's New" text
6. Submit for review
7. Monitor for issues

---

## ✅ Pre-Flight Final Checklist

**Before clicking "Submit for Review":**

### Legal
- [ ] Age verification working (21+)
- [ ] Privacy Policy accessible
- [ ] Terms of Service accessible
- [ ] Legal disclaimers present
- [ ] Only distributing in legal jurisdictions

### Technical
- [ ] No crashes
- [ ] No critical bugs
- [ ] All features working
- [ ] Tested on multiple devices
- [ ] Performance acceptable
- [ ] Data persistence working

### Store Listing
- [ ] All metadata accurate
- [ ] Screenshots show working features
- [ ] Icon looks professional
- [ ] Description compelling
- [ ] Keywords optimized
- [ ] Contact info correct

### Compliance
- [ ] Content rating appropriate (17+)
- [ ] No prohibited content
- [ ] Follows platform guidelines
- [ ] Privacy nutrition label complete (iOS)
- [ ] Data safety form complete (Android)

### Final Test
- [ ] Download test build
- [ ] Go through full user flow
- [ ] Pretend you're a new user
- [ ] Everything works as expected?
- [ ] Would you approve this app?

**If YES to all above → SUBMIT! 🚀**

---

## 📞 Support Resources

### Documentation
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policy:** https://play.google.com/about/developer-content-policy/
- **Expo Documentation:** https://docs.expo.dev/
- **RevenueCat Docs:** https://docs.revenuecat.com/

### Community
- **Expo Discord:** https://chat.expo.dev/
- **Reddit:** r/reactnative, r/expo
- **Stack Overflow:** #expo, #react-native

### Contact
- **App Review (iOS):** Contact via App Store Connect
- **Play Console Support:** Contact via Play Console Help
- **Expo Support:** support@expo.dev

---

## 🎉 You're Ready to Launch!

Use this checklist to ensure a smooth submission process. Remember:
- **Test thoroughly** before submitting
- **Be patient** during review (1-7 days typical)
- **Respond quickly** if contacted by review team
- **Monitor feedback** after launch
- **Iterate and improve** based on user feedback

Good luck with your launch! 🌿✨

**Track mindfully. Live better.** 🦝💚
