# Events Studio - Code Snippets & Quick Enhancements

## 📋 Copy-Paste Code for Common Additions

All snippets are production-ready. Just copy and paste into your HTML.

---

## 1. ADD TESTIMONIALS SECTION

**Where to insert**: After pricing section, before team section

```html
<!-- ===== TESTIMONIALS SECTION ===== -->
<section id="testimonials" class="alternate-bg">
    <div class="container-wide">
        <div class="section-header">
            <p class="section-subtitle">Client Stories</p>
            <h2>Loved by Our Couples</h2>
            <div class="section-divider"></div>
            <p class="section-description">
                Don't just take our word for it. Here's what our couples say about their experience.
            </p>
        </div>

        <div class="pricing-grid" style="max-width: none;">
            <!-- Testimonial 1 -->
            <div class="package-card" style="border: 1px solid var(--color-border); background: var(--color-dark-secondary);">
                <p style="text-align: left; margin-bottom: 1.5rem; line-height: 1.8; font-size: 1rem; color: #d0d0d0; border-left: 3px solid var(--color-accent); padding-left: 1.5rem;">
                    "Alexander and his team didn't just photograph our wedding—they told our story. The cinematic film is something we watch over and over. Every couple should experience this level of artistry!"
                </p>
                <p style="color: var(--color-accent); font-weight: 600; margin-bottom: 0.25rem;">Sarah & Michael Johnson</p>
                <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">June 2023</p>
                <p style="color: var(--color-accent);">⭐⭐⭐⭐⭐</p>
            </div>

            <!-- Testimonial 2 -->
            <div class="package-card" style="border: 1px solid var(--color-border); background: var(--color-dark-secondary);">
                <p style="text-align: left; margin-bottom: 1.5rem; line-height: 1.8; font-size: 1rem; color: #d0d0d0; border-left: 3px solid var(--color-accent); padding-left: 1.5rem;">
                    "Best investment we made for our wedding. The team was professional, creative, and made us feel comfortable the entire day. The photos are absolutely stunning."
                </p>
                <p style="color: var(--color-accent); font-weight: 600; margin-bottom: 0.25rem;">Jennifer & Tom Rodriguez</p>
                <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">August 2023</p>
                <p style="color: var(--color-accent);">⭐⭐⭐⭐⭐</p>
            </div>

            <!-- Testimonial 3 -->
            <div class="package-card" style="border: 1px solid var(--color-border); background: var(--color-dark-secondary);">
                <p style="text-align: left; margin-bottom: 1.5rem; line-height: 1.8; font-size: 1rem; color: #d0d0d0; border-left: 3px solid var(--color-accent); padding-left: 1.5rem;">
                    "Sofia and the team captured the emotion and beauty of our day perfectly. The attention to detail is remarkable. We can't recommend them enough!"
                </p>
                <p style="color: var(--color-accent); font-weight: 600; margin-bottom: 0.25rem;">Emma & David Chen</p>
                <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">April 2024</p>
                <p style="color: var(--color-accent);">⭐⭐⭐⭐⭐</p>
            </div>
        </div>
    </div>
</section>
```

---

## 2. ADD GOOGLE ANALYTICS

**Where to insert**: Inside `<head>` tag, before closing `</head>`

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Steps**:
1. Go to https://analytics.google.com
2. Create property for your domain
3. Copy your property ID (starts with "G-")
4. Replace "G-XXXXXXXXXX" with your ID

---

## 3. ADD NEWSLETTER SIGNUP

**Where to insert**: In footer, before copyright section

```html
<div style="background: var(--color-dark-secondary); padding: 2rem; border-radius: 6px; border: 1px solid var(--color-border); margin-bottom: 2rem; grid-column: 1 / -1;">
    <h4 style="margin-bottom: 0.5rem;">Newsletter</h4>
    <p style="color: var(--color-text-muted); margin-bottom: 1.5rem; font-size: 0.9rem;">
        Get photography tips and inspiration delivered to your inbox.
    </p>
    <form id="newsletterForm" style="display: flex; gap: 1rem;">
        <input 
            type="email" 
            placeholder="Your email address" 
            required
            style="flex: 1; padding: 0.8rem; border: 1px solid var(--color-border); background: var(--color-dark); color: white; border-radius: 4px; font-family: 'Poppins', sans-serif;"
        >
        <button 
            type="submit"
            style="padding: 0.8rem 2rem; background: var(--color-accent); color: var(--color-dark); border: none; border-radius: 4px; font-weight: 600; cursor: pointer; transition: all 0.3s; white-space: nowrap;"
            onmouseover="this.style.background='var(--color-accent-hover)'; this.style.transform='translateY(-2px)'"
            onmouseout="this.style.background='var(--color-accent)'; this.style.transform='translateY(0)'"
        >
            Subscribe
        </button>
    </form>
</div>

<script>
    document.getElementById('newsletterForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        // Send to your email service (Mailchimp, ConvertKit, etc.)
        alert('Thanks for subscribing! Check your email for confirmation.');
        this.reset();
    });
</script>
```

---

## 4. ADD STATS/NUMBERS SECTION

**Where to insert**: After hero section, before portfolio

```html
<!-- ===== STATS SECTION ===== -->
<section style="padding: 4rem 2rem; background: var(--color-dark-secondary); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
    <div class="container-wide">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 2rem; text-align: center;">
            <div>
                <p style="font-size: 2.5rem; font-weight: 700; color: var(--color-accent); margin-bottom: 0.5rem;">500+</p>
                <p style="color: var(--color-text-muted); font-size: 0.9rem;">Couples Served</p>
            </div>
            <div>
                <p style="font-size: 2.5rem; font-weight: 700; color: var(--color-accent); margin-bottom: 0.5rem;">15+</p>
                <p style="color: var(--color-text-muted); font-size: 0.9rem;">Years Experience</p>
            </div>
            <div>
                <p style="font-size: 2.5rem; font-weight: 700; color: var(--color-accent); margin-bottom: 0.5rem;">48</p>
                <p style="color: var(--color-text-muted); font-size: 0.9rem;">Awards Won</p>
            </div>
            <div>
                <p style="font-size: 2.5rem; font-weight: 700; color: var(--color-accent); margin-bottom: 0.5rem;">98%</p>
                <p style="color: var(--color-text-muted); font-size: 0.9rem;">Satisfaction Rate</p>
            </div>
        </div>
    </div>
</section>
```

---

## 5. ADD ACCORDION FAQ

**Where to insert**: After services section

```html
<!-- ===== FAQ SECTION ===== -->
<section id="faq" class="alternate-bg">
    <div class="container-wide">
        <div class="section-header">
            <p class="section-subtitle">Common Questions</p>
            <h2>Frequently Asked Questions</h2>
            <div class="section-divider"></div>
        </div>

        <div style="max-width: 700px; margin: 3rem auto 0;">
            <!-- FAQ Item 1 -->
            <div class="accordion-item" style="border-bottom: 1px solid var(--color-border); padding: 1.5rem 0; cursor: pointer;" onclick="this.classList.toggle('active')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4 style="margin: 0;">How far in advance should we book?</h4>
                    <span style="color: var(--color-accent); font-size: 1.3rem;">+</span>
                </div>
                <p class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s; color: var(--color-text-muted); margin-top: 1rem;">
                    We recommend booking 6-12 months in advance, especially for peak season (May-September). However, we do take on last-minute bookings depending on availability.
                </p>
            </div>

            <!-- FAQ Item 2 -->
            <div class="accordion-item" style="border-bottom: 1px solid var(--color-border); padding: 1.5rem 0; cursor: pointer;" onclick="this.classList.toggle('active')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4 style="margin: 0;">What's included in the packages?</h4>
                    <span style="color: var(--color-accent); font-size: 1.3rem;">+</span>
                </div>
                <p class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s; color: var(--color-text-muted); margin-top: 1rem;">
                    All packages include full-day coverage, professional editing, and digital delivery. Premium and Platinum include cinematography films. See our pricing section for detailed breakdowns.
                </p>
            </div>

            <!-- FAQ Item 3 -->
            <div class="accordion-item" style="border-bottom: 1px solid var(--color-border); padding: 1.5rem 0; cursor: pointer;" onclick="this.classList.toggle('active')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4 style="margin: 0;">How long does it take to receive photos?</h4>
                    <span style="color: var(--color-accent); font-size: 1.3rem;">+</span>
                </div>
                <p class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s; color: var(--color-text-muted); margin-top: 1rem;">
                    Final gallery delivery typically takes 4-6 weeks. We provide sneak peeks 1-2 weeks after your wedding. Cinematic films are typically delivered in 8-10 weeks.
                </p>
            </div>
        </div>
    </div>
</section>

<style>
    .accordion-item.active .accordion-content {
        max-height: 200px !important;
    }
</style>
```

---

## 6. ADD IMAGE LIGHTBOX

**Where to insert**: Before closing `</body>` tag

```html
<script>
    // Image Lightbox Gallery
    function initLightbox() {
        // Handle gallery items
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                openLightbox(this.src, this.alt);
            });
        });
    }

    function openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
            animation: fadeInUp 0.3s ease-out;
        `;

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            background: none;
            border: 1px solid white;
            color: white;
            font-size: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        `;
        closeBtn.onmouseover = () => {
            closeBtn.style.background = 'rgba(255,255,255,0.1)';
            closeBtn.style.transform = 'scale(1.1)';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'none';
            closeBtn.style.transform = 'scale(1)';
        };

        lightbox.appendChild(img);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', () => lightbox.remove());
    }

    // Initialize on page load
    window.addEventListener('load', initLightbox);
</script>
```

---

## 7. ADD SCROLL-TO-TOP BUTTON

**Where to insert**: Before closing `</body>` tag

```html
<!-- Scroll to Top Button -->
<button id="scrollTopBtn" style="
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--color-dark);
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999;
    transition: all 0.3s;
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
" title="Back to top">↑</button>

<script>
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollTopBtn.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1)';
    });

    scrollTopBtn.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
</script>
```

---

## 8. ADD DARK MODE TOGGLE

**Where to insert**: In navigation section

```html
<!-- Add this button to nav-container, after nav-menu -->
<button id="darkModeToggle" style="
    background: none;
    border: 1px solid var(--color-border);
    color: var(--color-light);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
" title="Toggle theme">🌙</button>

<script>
    const darkModeToggle = document.getElementById('darkModeToggle');
    let isDarkMode = true;

    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            document.body.style.background = 'linear-gradient(135deg, var(--color-dark) 0%, #0f0f0f 100%)';
            darkModeToggle.textContent = '🌙';
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.style.background = '#ffffff';
            document.body.style.color = '#000000';
            darkModeToggle.textContent = '☀️';
            localStorage.setItem('darkMode', 'false');
        }
    });

    // Check local storage on load
    const savedMode = localStorage.getItem('darkMode') !== 'false';
</script>
```

---

## 9. ADD ANIMATED COUNTER

**Where to insert**: In stats section

```javascript
<script>
    function animateCounter(element, target, duration = 2000) {
        let current = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Trigger on scroll into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.animated) {
                const number = parseInt(entry.target.textContent);
                animateCounter(entry.target, number);
                entry.target.animated = true;
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('[data-counter]').forEach(el => {
        observer.observe(el);
    });
</script>

<!-- Use in stats section like this: -->
<!-- <p data-counter style="font-size: 2.5rem; font-weight: 700; color: var(--color-accent); margin-bottom: 0.5rem;">0</p> -->
```

---

## 10. ADD FORM VALIDATION

**Where to insert**: Before contact form closing tag

```html
<script>
    document.getElementById('contactForm')?.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name) {
            alert('Please enter your name');
            return;
        }

        if (!email || !email.includes('@')) {
            alert('Please enter a valid email');
            return;
        }

        if (!message) {
            alert('Please enter your message');
            return;
        }

        // If validation passes
        alert('Thank you for your inquiry! We will get back to you within 24 hours.');
        
        // TODO: Send to backend
        // Example with fetch:
        // fetch('/send-email', {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({name, email, message})
        // }).then(res => res.json()).then(data => console.log(data));

        this.reset();
    });
</script>
```

---

## 11. ADD CONTACT FORM BACKEND (Node.js/Express)

**File: `server.js`**

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configure email service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // Use app-specific password
    }
});

// API endpoint for form submission
app.post('/send-email', async (req, res) => {
    const { name, email, phone, date, message } = req.body;

    try {
        // Send to studio
        await transporter.sendMail({
            from: 'noreply@eventsstudio.com',
            to: 'hello@eventsstudio.com',
            subject: `New Inquiry from ${name}`,
            html: `
                <h2>New Inquiry</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Event Date:</strong> ${date || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        // Send confirmation to client
        await transporter.sendMail({
            from: 'noreply@eventsstudio.com',
            to: email,
            subject: 'We Received Your Inquiry',
            html: `
                <h2>Hello ${name},</h2>
                <p>Thank you for reaching out to Events Studio!</p>
                <p>We've received your inquiry and will get back to you within 24 hours.</p>
                <p>Looking forward to creating magic with you!</p>
                <p>Best,<br>The Events Studio Team</p>
            `
        });

        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 12. CUSTOMIZE COLOR SCHEME (QUICK)

**Replace these CSS variables** at the top of `<style>` (line 14):

```css
:root {
    --color-dark: #000000;              /* Change main background */
    --color-dark-secondary: #111111;    /* Change card backgrounds */
    --color-dark-tertiary: #1a1a1a;     /* Change hover states */
    --color-light: #ffffff;              /* Change text color */
    --color-accent: #d4af37;            /* Change accent (gold) */
    --color-accent-hover: #e5c158;      /* Change accent hover */
    --color-text-muted: #a0a0a0;        /* Change secondary text */
    --color-border: rgba(255, 255, 255, 0.08);  /* Change borders */
}
```

---

## 13. CHANGE FONTS

**Replace these** at line 10:

```html
<!-- Option 1: Modern Look -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Option 2: Bold Look -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Bodoni+Moda:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Option 3: Classic Look -->
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Then update the CSS:

```css
body { font-family: 'YourSansSerif', sans-serif; }
h1, h2, h3, h4, h5, h6 { font-family: 'YourSerif', serif; }
```

---

## 14. CREATE WEDDING PLANNING CHECKLIST (Blog Post)

Perfect SEO content for your blog:

```markdown
# The Ultimate Wedding Day Timeline Checklist

## 6 Months Before
- [ ] Choose wedding date
- [ ] Hire photographer/videographer ← (That's you!)
- [ ] Book venue
- [ ] Create budget

## 3 Months Before
- [ ] Finalize guest list
- [ ] Send save-the-dates
- [ ] Book caterer
- [ ] Plan photographer schedule with team

## 1 Month Before
- [ ] RSVP deadline
- [ ] Final guest count
- [ ] Detailed day-of timeline
- [ ] Engagement session (if included)

## Week Before
- [ ] Final walkthrough
- [ ] Confirm all vendors
- [ ] Gather couple questionnaire

## Wedding Day
- [ ] Arrive 30 min early
- [ ] Scout locations
- [ ] Capture preparations
- [ ] Be a guest in their story

## After Wedding
- [ ] Backup all footage
- [ ] Begin editing
- [ ] Deliver in 4-6 weeks
- [ ] Request testimonial

---
```

---

## 15. SEO META TAGS TEMPLATE

**Add to `<head>` section**:

```html
<!-- SEO Meta Tags -->
<meta name="description" content="Luxury wedding photography and cinematography by Events Studio. Award-winning team capturing timeless moments since 2018. Book your consultation today.">
<meta name="keywords" content="wedding photography, wedding videography, cinematic wedding films, luxury photographer">
<meta name="author" content="Events Studio">
<meta name="robots" content="index, follow">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Open Graph Tags (for social sharing) -->
<meta property="og:type" content="website">
<meta property="og:title" content="Events Studio | Luxury Wedding Photography & Cinematography">
<meta property="og:description" content="Award-winning luxury wedding photography and cinematic films. Trusted by 500+ couples.">
<meta property="og:image" content="https://yourdomain.com/featured-image.jpg">
<meta property="og:url" content="https://yourdomain.com">

<!-- Twitter Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Events Studio | Luxury Wedding Photography">
<meta name="twitter:description" content="Luxury wedding photography and cinematography">
<meta name="twitter:image" content="https://yourdomain.com/featured-image.jpg">

<!-- Canonical Tag -->
<link rel="canonical" href="https://yourdomain.com">
```

---

## 🚀 How to Use These Snippets

1. **Copy** the entire code block
2. **Paste** into your HTML at the specified location
3. **Customize** the content (text, links, images)
4. **Test** in browser before deploying
5. **Deploy** to live server

---

## ⚠️ Important Notes

- All snippets use the same color variables (--color-accent, etc.)
- Forms need backend integration for actual submission
- Email services require configuration (Gmail, SendGrid, etc.)
- Always test on mobile before deploying
- Check browser console for any errors

---

**Ready to enhance your website?**  
**Pick the features you want and add them!**

