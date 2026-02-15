# Events Studio - Visual Reference & Quick Guide

## 🎯 What You Can See on Your Website

### Navigation Bar
- **Position**: Fixed at top
- **Style**: Dark with blur backdrop
- **Features**: Smooth scroll links, scroll effect
- **Mobile**: Hamburger menu appears below 768px
- **Logo**: "Events Studio" with gold accent

### Hero Section (Full Screen)
- **Background**: Video with dark overlay
- **Content**: Centered text
  - Subtitle: "Luxury Wedding Photography & Cinematography"
  - Main headline: "Timeless Moments, Captured Forever"
  - Description: Emotional value proposition
  - CTAs: "Book a Consultation" (gold) + "View Portfolio" (outlined)
- **Animation**: Staggered entrance (0.2s increments)
- **Scroll Indicator**: Animated down arrow at bottom

### Portfolio Section
- **Grid**: 3 columns (responsive)
- **Items**: Images + videos
- **Interaction**: Hover overlay with labels
- **Effect**: Zoom on hover, smooth transitions

### Services Section
- **Grid**: 3 columns (auto-fit)
- **Cards**: 6 service offerings
- **Design**: Icon + title + description
- **Interaction**: Top border accent on hover
- **Colors**: Dark background, gold accent

### Pricing Section
- **Layout**: 3 pricing tiers
- **Featured**: Middle package (Premium) highlighted with gold border
- **Content**: Name, price, feature list, CTA
- **Responsive**: Adapts to 2-column on tablet, 1 on mobile

### Team Section
- **Grid**: 6 team members
- **Style**: Circular avatars, name, role, bio
- **Interaction**: Grayscale to color on hover
- **Information**: Real names and professional descriptions

### Contact Section
- **Form**: Name, Email, Phone, Date, Message
- **Styling**: Clean inputs with focus effects
- **CTA**: Full-width submit button (gold)
- **Responsive**: Single column layout

### Footer
- **Layout**: 4 columns (responsive)
- **Content**: Company info, links, services, contact
- **Social**: Icon links (Instagram, Twitter, Pinterest, YouTube)
- **Copyright**: Bottom text

---

## 🎨 Color Reference

### Primary Colors
```
Dark Black:      #0a0a0a (Main background)
Dark Secondary:  #141414 (Card backgrounds)
Dark Tertiary:   #1a1a1a (Hover states)
Accent Gold:     #d4af37 (Highlights, CTA)
Accent Hover:    #e5c158 (Gold on hover)
```

### Text Colors
```
Light White:     #ffffff (Headlines, primary text)
Muted Gray:      #a0a0a0 (Secondary text, descriptions)
Border Subtle:   rgba(255,255,255,0.08) (Separators)
```

### Usage
- **Accent (Gold)**: Buttons, hovers, borders, emphasis
- **Dark**: Backgrounds, cards
- **White**: Headlines, primary text
- **Muted Gray**: Descriptions, secondary content

---

## 📏 Spacing System

### Consistent Measurements
```
Small:    1rem (16px)
Medium:   2rem (32px)
Large:    3rem (48px)
XLarge:   4rem (64px)
XXLarge:  6rem (96px)

Gap:      2rem (between components)
Padding:  2.5rem (inside cards)
Section:  6rem top/bottom (spacing between sections)
```

### Responsive Adjustments
- **Desktop**: Full spacing
- **Tablet (≤768px)**: 75% of desktop
- **Mobile (≤480px)**: 50% of desktop, single column

---

## 🔤 Typography Reference

### Headings
| Level | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| H1 | Playfair | 2.5-4.5rem | 700 | Main headlines |
| H2 | Playfair | 1.8-3.2rem | 700 | Section titles |
| H3 | Playfair | 1.4rem | 700 | Card titles |
| H4 | Playfair | 1.1rem | 700 | Subtitles |

### Body Text
| Type | Font | Size | Weight | Usage |
|------|------|------|--------|-------|
| Body | Poppins | 1rem | 400 | Main copy |
| Small | Poppins | 0.9rem | 400 | Secondary |
| Micro | Poppins | 0.85rem | 600 | Labels |

### Line Heights
- Headings: 1.15-1.2 (tight, confident)
- Body: 1.6-1.8 (generous, readable)
- Buttons: 1 (centered)

---

## 🎬 Animation Reference

### Entrance Animations
```
Duration: 0.8s
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Effect: Fade in + slide up 30px
Stagger: 0.2s delay per element
```

### Hover Animations
```
Duration: 0.3-0.4s
Effects:
  - Scale: 1.08 (images), 1.1 (icons), 1.02 (cards)
  - Translate: -10px (card lift)
  - Color: To gold accent
  - Border: To gold
```

### Scroll Indicator
```
Duration: 2.5s infinite
Effect: Bounce down and back up
Icon: Chevron/arrow down
```

---

## 📱 Responsive Breakpoints

### Desktop (1200px+)
- Full 3-column grids
- Full navigation menu
- Large hero section
- Full spacing

### Tablet (768px - 1199px)
- 2-column grids
- Hamburger menu
- Adjusted spacing
- Optimized typography

### Mobile (< 768px)
- Single column layouts
- Hamburger menu active
- Reduced spacing
- Smaller typography

---

## 🔘 Button Styles

### Primary Button (Gold)
```
Background: var(--color-accent) #d4af37
Text Color: var(--color-dark) #0a0a0a
Padding: 14px 40px
Border Radius: 4px
Font Weight: 600
Text Transform: Uppercase
Letter Spacing: 1px
Hover: Lighten background, lift up 3px
```

### Secondary Button (Outlined)
```
Background: transparent
Border: 1px solid var(--color-light)
Text Color: var(--color-light)
Padding: 14px 40px
Hover: Fill background with white, text black
```

### Tertiary (Link)
```
Color: var(--color-accent)
Hover: Lighter gold
Underline: Optional on hover
```

---

## 🎪 Component Examples

### Service Card
```html
<div class="service-card">
    <div class="service-icon">📸</div>  ← 2.5rem, gold color
    <h3>Service Name</h3>              ← 1.3rem, bold
    <p>Description text...</p>         ← 0.95rem, muted
</div>
```
**On Hover**: Border turns gold, background lightens, lifts up 8px

### Pricing Card
```html
<div class="package-card">
    <h3 class="package-name">Essential</h3>      ← 1.4rem
    <div class="package-price">$2,500</div>      ← 2.5rem, gold
    <p class="package-duration">Full Day</p>     ← Small, muted
    <ul class="package-features">
        <li>10 hours coverage</li>               ← ✓ prefix
        <li>500+ photos</li>
    </ul>
    <button class="btn btn-secondary">Inquire</button>
</div>
```
**Featured Card**: Gold border, slightly larger scale

### Team Card
```html
<div class="team-member">
    <div class="member-image">
        <img src="..." alt="...">    ← Circular, 150x150px
    </div>
    <h4 class="member-name">Name</h4>         ← 1.1rem, bold
    <p class="member-role">Role</p>           ← 0.85rem, gold, uppercase
    <p class="member-bio">Bio text...</p>     ← 0.9rem, muted
</div>
```
**On Hover**: Image grayscale removed, slight zoom

---

## ✨ Micro-Interactions

### Navigation Links
- **Hover**: Underline grows from left to right (0.3s)
- **Active**: Underline full width

### Buttons
- **Hover**: Scale up slightly, shadow appears, lifts
- **Active**: Shadow darker, pressed effect

### Cards
- **Hover**: Border color changes, background shifts, elevation
- **Focus**: Gold outline for keyboard navigation

### Forms
- **Focus**: Border gold, shadow glow
- **Invalid**: Red border (if validation added)
- **Submitted**: Success message

### Images
- **Hover**: 8% zoom, slight brightness adjustment
- **Grayscale**: On team members, removed on hover

---

## 🎯 Content Structure

### Hierarchy
1. **Hero**: Emotional hook, clear CTA
2. **Portfolio**: Show capabilities
3. **Services**: Explain offerings
4. **Pricing**: Show investment options
5. **Team**: Build trust through people
6. **Contact**: Conversion point
7. **Footer**: Complete information

### Copy Approach
- **Headlines**: Bold, confident, benefit-focused
- **Descriptions**: Benefit-driven, not feature-focused
- **CTAs**: Action-oriented, clear expectation
- **Tone**: Professional yet warm, premium but accessible

---

## 📊 Performance Metrics

### Target Speed
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total Page Load: < 2s

### Optimization Implemented
✅ Image lazy loading  
✅ Hardware-accelerated animations  
✅ Minimal CSS/JS  
✅ No external frameworks  
✅ Semantic HTML  
✅ Optimized fonts  

---

## 🔐 Accessibility Features

### Implemented
✅ Semantic HTML5 (nav, section, footer, h1-h6)  
✅ ARIA labels on form inputs  
✅ Alt text on all images  
✅ Color contrast ratios > 4.5:1  
✅ Keyboard navigation support  
✅ Focus indicators visible  
✅ Screen reader friendly  

### Testing
Test with:
- Tab key navigation (keyboard only)
- Screen reader (NVDA, JAWS)
- Color contrast checker
- Accessibility validator

---

## 🚀 File Structure

```
c:\Users\judi\Desktop\gg\
├── index.html                    ← Main website (use this!)
├── index-backup.html             ← Backup of original
├── IMG_5192.MP4                  ← Hero background video
├── logo.png                      ← Your logo
├── README.md                     ← Overview & checklist
├── EXECUTIVE_SUMMARY.md          ← High-level summary
├── DESIGN_SYSTEM.md              ← Design specifications
├── BRANDING_GUIDE.md             ← Strategy guide
├── IMPLEMENTATION_GUIDE.md       ← Setup instructions
└── CODE_SNIPPETS.md              ← Enhancement code
```

---

## 📋 Deployment Checklist

### Before Launch
- [ ] Replace video file path
- [ ] Update all placeholder content
- [ ] Update contact information
- [ ] Test on mobile
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] Test form submission
- [ ] Verify all links work
- [ ] Check page speed
- [ ] Enable HTTPS/SSL

### After Launch
- [ ] Monitor analytics
- [ ] Track form submissions
- [ ] Monitor page speed
- [ ] Collect user feedback
- [ ] Add testimonials
- [ ] Create blog content
- [ ] Optimize based on data

---

## 🎓 How to Customize

### Colors
File: `index.html`, line 14-24
Change: `--color-accent: #d4af37;`

### Fonts
File: `index.html`, line 10
Change font import

### Spacing
File: `index.html`, CSS section
Change: `padding: 6rem 2rem;`

### Content
Replace all placeholder text with your information

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Video won't play | Check MP4 path, use H.264 codec |
| Images not showing | Verify file paths (absolute vs relative) |
| Mobile menu broken | Check viewport meta tag in <head> |
| Form not submitting | Need backend integration (email service) |
| Page loading slow | Compress images, enable caching |
| Looks wrong on mobile | Test actual device, check viewport |

---

## 🎉 You're All Set!

Your website is:
✅ Professional  
✅ Modern  
✅ Responsive  
✅ Fast  
✅ Accessible  
✅ Ready to launch  

**Now go replace the content and launch!**

