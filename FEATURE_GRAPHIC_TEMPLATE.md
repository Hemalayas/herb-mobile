# Android Feature Graphic Template

## 📐 Specifications

**Dimensions:** 1024 x 500 pixels
**Format:** JPG or 24-bit PNG (no transparency)
**File Size:** Under 1MB
**Color Space:** sRGB

---

## 🎨 Design Template

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Herb Raccoon    HERB                                  │
│   Mascot]         Cannabis Tracker                      │
│                                                         │
│                   Track Mindfully. Live Better. 🌿      │
│                                                         │
└─────────────────────────────────────────────────────────┘
   ← 1024 px →
   ↑ 500 px ↓
```

### Design Recommendation 1: Mascot + Title

**Left Side (400px):**
- Herb raccoon mascot (level2.png or level3.png)
- Centered vertically
- Size: ~350 x 350 px

**Right Side (624px):**
- App name: "HERB" in large bold font
- Subtitle: "Cannabis Tracker" in medium weight
- Tagline: "Track Mindfully. Live Better. 🌿"
- Background: Green gradient (#00D084 → #00A06A)

---

### Design Recommendation 2: Feature Highlights

**Background:**
- Solid green (#00D084) or gradient

**Content (Centered):**
- Top: "HERB" in large white text
- Middle: 3 feature icons in a row
  - 📊 Analytics
  - 🏆 Achievements
  - 💚 Recovery
- Bottom: "Track Your Cannabis Journey"

---

### Design Recommendation 3: Screenshot Montage

**Background:**
- Green (#00D084)

**Content:**
- 2-3 phone screenshots side-by-side
- Slight rotation/perspective for visual interest
- Overlapping composition
- White glow/shadow for depth

---

## 🛠️ How to Create

### Option 1: Canva (Easiest)

1. Go to canva.com
2. Click "Custom size" → 1024 x 500 px
3. Add green rectangle background (#00D084)
4. Upload Herb raccoon from `assets/level2.png` or `level3.png`
5. Add text:
   - Font: Bold sans-serif (Montserrat, Poppins, Roboto)
   - "HERB" - 80pt, white
   - "Cannabis Tracker" - 40pt, white
   - "Track Mindfully. Live Better." - 24pt, white
6. Arrange elements with spacing
7. Download as PNG or JPG

---

### Option 2: Figma (Professional)

1. Create 1024 x 500 frame
2. Add background:
   - Rectangle fill with linear gradient
   - #00D084 (left) → #00A06A (right)
3. Import raccoon image:
   - Place on left side
   - Resize to ~350px
   - Add subtle drop shadow
4. Add text layers:
   - "HERB" - 72pt, Bold, White
   - "Cannabis Tracker" - 36pt, Medium, White/90% opacity
   - Tagline - 20pt, Regular, White/80% opacity
5. Align and space elements
6. Export as PNG (1024 x 500)

---

### Option 3: Photoshop

1. New document: 1024 x 500 px, 72 DPI, RGB
2. Create green gradient background layer
3. Place raccoon image on left
4. Add text layers with styles
5. Add effects (shadows, glows) for depth
6. Flatten and export as JPG (quality 90%)

---

## 🎨 Design Elements

### Colors
**Primary Green:** #00D084
**Dark Green:** #00A06A
**White:** #FFFFFF
**Text Shadow:** rgba(0, 0, 0, 0.3)

### Fonts
**Recommended:**
- Montserrat (free, clean, modern)
- Poppins (free, friendly, rounded)
- Roboto (free, Google standard)
- Inter (free, excellent readability)

**Font Weights:**
- App name ("HERB"): Bold or Black
- Subtitle: Medium or Semi-Bold
- Tagline: Regular or Medium

### Spacing
- Margins: 40px from edges
- Between elements: 20-30px
- Text line height: 1.2-1.4x

---

## ✅ Design Checklist

### Content
- [ ] App name visible: "HERB" or "Herb - Cannabis Tracker"
- [ ] Mascot/branding included
- [ ] Tagline or feature highlights
- [ ] Visually appealing composition

### Technical
- [ ] Exactly 1024 x 500 pixels
- [ ] File size under 1MB
- [ ] JPG or PNG format
- [ ] sRGB color space
- [ ] Text is legible (not too small)
- [ ] No blurry/pixelated elements

### Branding
- [ ] Uses brand green (#00D084)
- [ ] Matches app icon style
- [ ] Herb raccoon mascot featured
- [ ] Professional and polished look

### Compliance
- [ ] No screenshots of UI (save for phone screenshots section)
- [ ] No misleading claims
- [ ] Age-appropriate (17+ content okay)
- [ ] Represents actual app features

---

## 📏 Safe Zones

Some devices may crop edges of feature graphic:
- **Critical content zone:** Center 924 x 400 px
- **Keep text/logo:** Within center 800 x 350 px
- **Safe margins:** 50px from all edges

---

## 🖼️ Example Layouts

### Layout 1: Mascot Left, Text Right
```
┌──────────────────────────────────────────┐
│                                          │
│  🦝        HERB                          │
│  [Raccoon] Cannabis Tracker              │
│  [Image]   Track Mindfully. Live Better. │
│                                          │
└──────────────────────────────────────────┘
```

### Layout 2: Centered Title + Icons
```
┌──────────────────────────────────────────┐
│                 HERB                     │
│          Cannabis Tracker                │
│                                          │
│      📊        🏆        💚              │
│   Analytics  Badges   Recovery           │
└──────────────────────────────────────────┘
```

### Layout 3: Floating Screenshots
```
┌──────────────────────────────────────────┐
│       HERB - Cannabis Tracker            │
│                                          │
│  [Phone1]  [Phone2]  [Phone3]            │
│    (Angled screenshots with shadows)     │
└──────────────────────────────────────────┘
```

---

## 🚀 Quick Create Commands

### Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# macOS: brew install imagemagick

# Create gradient background
convert -size 1024x500 gradient:#00D084-#00A06A feature-bg.png

# Add mascot and text (requires further ImageMagick commands)
# Or use GUI tool for easier editing
```

### Using Online Tools
- **Canva:** https://canva.com (easiest)
- **Photopea:** https://photopea.com (free Photoshop alternative)
- **Pixlr:** https://pixlr.com (simple editor)

---

## 📤 Export Settings

### For Canva
1. Click "Share" → "Download"
2. File type: PNG or JPG
3. Quality: Best
4. Download

### For Figma
1. Select frame
2. Export settings → PNG
3. 1x scale (1024 x 500)
4. Export

### For Photoshop
1. File → Export → Export As
2. Format: JPG or PNG
3. Quality: 90% (JPG) or 8 (PNG)
4. Save

---

## ✅ Final Check

Before uploading to Play Console:

**Dimensions:**
- [ ] Width exactly 1024 pixels
- [ ] Height exactly 500 pixels
- [ ] Aspect ratio 2.048:1

**Content:**
- [ ] App name visible
- [ ] Branding consistent with icon
- [ ] Text is legible
- [ ] No pixelation or blur
- [ ] Represents actual app

**File:**
- [ ] JPG or PNG format
- [ ] Under 1MB file size
- [ ] sRGB color profile
- [ ] No transparency (if JPG)

**Upload:**
1. Go to Play Console
2. Main store listing → Graphic assets
3. Upload feature graphic
4. Preview how it looks
5. Save

---

## 🎨 Pro Tips

1. **Keep it simple:** Don't overcrowd with too many elements
2. **High contrast:** White text on green background works well
3. **Mascot front and center:** Herb raccoon is your brand
4. **Match app icon:** Use same style and colors
5. **Test visibility:** View at small size to ensure text is readable
6. **Update regularly:** Refresh for major updates or seasons

---

## 🖼️ Asset Locations

**Mascot images in your project:**
- `assets/level1.png` - Basic raccoon
- `assets/level2.png` - Medium raccoon
- `assets/level3.png` - Advanced raccoon

**App icon:**
- `assets/icon.png` - Can use for reference

**Screenshots:**
- Take after completing SCREENSHOTS.md guide
- Can incorporate into feature graphic design

---

## ✨ You're Ready!

Create your feature graphic using one of the methods above, then upload to Google Play Console.

**Location in Play Console:**
Main Store Listing → Graphic assets → Feature graphic (1024 x 500)

Good luck! 🌿
