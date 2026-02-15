// Performance optimizations for 60fps
'use strict';

// Image optimization and lazy loading
const setupImageOptimization = () => {
    // Add loaded class to images when they finish loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                img.classList.add('error');
            });
        }
    });
    
    // Preload critical images
    const criticalImages = document.querySelectorAll('.hero img, .navbar-brand img');
    criticalImages.forEach(img => {
        img.setAttribute('loading', 'eager');
        img.setAttribute('decoding', 'sync');
    });
};

// Disable animations on low-end devices
const isLowEndDevice = () => {
    return navigator.hardwareConcurrency <= 2 || 
           navigator.deviceMemory <= 4 ||
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Request Animation Frame for smooth 60fps
let rafId;
const requestTick = (callback) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(callback);
};

// Optimized scroll handling with throttling
let scrollTimeout;
const handleScroll = () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            // Always keep navbar visible, just change style
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Handle scroll to top button visibility - removed
        
        scrollTimeout = null;
    }, 16); // ~60fps
};

// Passive event listeners for better performance
window.addEventListener('scroll', handleScroll, { passive: true });

// Fix navigation links immediately - don't wait for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded - Setting up navigation links');
    
    // Setup image optimization
    setupImageOptimization();
    
    // Add smooth scrolling to all anchor links
    setupNavigationLinks();
    
    // Advanced scroll animations with different directions
    const animationClasses = [
        'fade-in', 'fade-out', 'fade-left', 'fade-right', 
        'fade-up', 'fade-down', 'scale-fade', 'rotate-fade', 'scroll-fade'
    ];
    
    // Create observers for different animation types
    const createObserver = (className, options = {}) => {
        return new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    // Add visible class for fade-in animations
                    if (className.includes('fade-in') || className.includes('fade-up') || 
                        className.includes('fade-down') || className.includes('fade-left') || 
                        className.includes('fade-right') || className.includes('scale-fade') || 
                        className.includes('rotate-fade') || className.includes('scroll-fade')) {
                        element.classList.add('visible');
                    }
                    
                    // Handle fade-out when scrolling down
                    if (className.includes('fade-out') && entry.boundingClientRect.top < 0) {
                        element.classList.add('visible');
                    } else if (className.includes('fade-out') && entry.boundingClientRect.top > 0) {
                        element.classList.remove('visible');
                    }
                } else {
                    // Remove visible class for fade-out when scrolling up
                    if (className.includes('fade-out') && entry.boundingClientRect.top > window.innerHeight) {
                        element.classList.remove('visible');
                    }
                }
            });
        }, {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '50px 0px'
        });
    };

    // Apply animations to different elements based on their position and type
    function applyScrollAnimations() {
        // Portfolio section - alternating left/right animations
        document.querySelectorAll('#portfolio .animated-item').forEach((item, index) => {
            item.classList.add(index % 2 === 0 ? 'fade-left' : 'fade-right');
            createObserver('fade-left').observe(item);
            createObserver('fade-right').observe(item);
        });

        // Services section - scale and rotate animations
        document.querySelectorAll('#services .service-card').forEach((item, index) => {
            const animationClass = index % 3 === 0 ? 'scale-fade' : 'rotate-fade';
            item.classList.add(animationClass);
            createObserver(animationClass).observe(item);
        });

        // Pricing section - fade up animations
        document.querySelectorAll('#pricing .package-card').forEach((item, index) => {
            item.classList.add('fade-up');
            createObserver('fade-up').observe(item);
        });

        // Team section - alternating animations
        document.querySelectorAll('#team .team-member').forEach((item, index) => {
            const animations = ['fade-left', 'fade-right', 'fade-up', 'scale-fade'];
            const animationClass = animations[index % animations.length];
            item.classList.add(animationClass);
            createObserver(animationClass).observe(item);
        });

        // Section headers - fade down animations
        document.querySelectorAll('.section-header').forEach(header => {
            header.classList.add('fade-down');
            createObserver('fade-down').observe(header);
        });

        // Text content - fade in animations
        document.querySelectorAll('p, .section-description').forEach(text => {
            if (!text.closest('.hero')) {
                text.classList.add('fade-in');
                createObserver('fade-in').observe(text);
            }
        });

        // Images - scale fade animations
        document.querySelectorAll('img').forEach(img => {
            if (!img.closest('.hero')) {
                img.classList.add('scale-fade');
                createObserver('scale-fade').observe(img);
            }
        });

        // Buttons and interactive elements - fade up animations
        document.querySelectorAll('.btn, button').forEach(btn => {
            btn.classList.add('fade-up');
            createObserver('fade-up').observe(btn);
        });
    }

    // Initialize animations
    applyScrollAnimations();

    // Enhanced parallax scrolling with fade effects
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero, section');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            const opacity = Math.max(0, 1 - (scrolled / 1000));
            
            element.style.transform = `translateY(${yPos}px)`;
            if (index === 0) { // Only apply opacity to hero
                element.style.opacity = opacity;
            }
        });
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });

    // Enhanced hover effects with smooth transitions
    const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .package-card, .service-card, .team-member');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.style.transform = 'translateY(-5px) scale(1.05)';
            this.style.boxShadow = '0 15px 40px rgba(255, 107, 53, 0.3)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Scroll direction detection for directional animations
    let lastScrollTop = 0;
    let scrollDirection = 'down';
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        
        // Apply fade-out animations when scrolling down
        document.querySelectorAll('.fade-out').forEach(element => {
            const rect = element.getBoundingClientRect();
            if (scrollDirection === 'down' && rect.top < 0) {
                element.classList.add('visible');
            } else if (scrollDirection === 'up' && rect.top > window.innerHeight) {
                element.classList.remove('visible');
            }
        });
    }, { passive: true });
});

// Navigation link setup function
function setupNavigationLinks() {
    console.log('Setting up navigation links...');
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        console.log('Found anchor:', anchor.getAttribute('href'));
        
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            console.log('Clicked:', targetId, 'Target:', target);
            
            if (target) {
                // Smooth scroll with offset for fixed navbar
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                console.log('Scrolling to position:', targetPosition);
                
                // Use scrollIntoView as primary method
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const navbar = document.getElementById('navbar');
                if (navbar) navbar.classList.remove('mobile-active');
            } else {
                console.error('Target not found:', targetId);
            }
        });
    });
}

// Also set up navigation links immediately in case DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNavigationLinks);
} else {
    setupNavigationLinks();
}

// Gallery Grid Sorting Functionality
function sortGallery() {
    const sortType = document.getElementById('sortSelect').value;
    const galleryGrid = document.getElementById('galleryGrid');
    const items = Array.from(galleryGrid.children);
    
    let sortedItems = [...items];
    
    switch(sortType) {
        case 'name':
            sortedItems.sort((a, b) => {
                const nameA = a.dataset.name.toLowerCase();
                const nameB = b.dataset.name.toLowerCase();
                return nameA.localeCompare(nameB);
            });
            break;
        case 'type':
            sortedItems.sort((a, b) => {
                const typeA = a.dataset.type || '';
                const typeB = b.dataset.type || '';
                return typeA.localeCompare(typeB);
            });
            break;
        case 'date':
            sortedItems.sort((a, b) => {
                const dateA = new Date(a.dataset.date || '2024-01-01');
                const dateB = new Date(b.dataset.date || '2024-01-01');
                return dateA - dateB;
            });
            break;
        default:
            // Keep original order
            sortedItems = items;
            break;
    }
    
    // Clear and re-append sorted items
    galleryGrid.innerHTML = '';
    sortedItems.forEach(item => galleryGrid.appendChild(item));
    
    // Re-initialize lightbox for new items
    initializeLightbox();
}

// Initialize lightbox functionality
function initializeLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay');
            const title = overlay.querySelector('h3').textContent;
            
            openLightbox(img.src, title);
        });
    });
}

function openLightbox(imageSrc, title) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxLabel = document.getElementById('lightboxLabel');
    
    lightboxImage.src = imageSrc;
    lightboxLabel.textContent = title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeLightbox();
    
    // Lightbox close events
    const lightboxClose = document.getElementById('lightboxClose');
    const lightbox = document.getElementById('lightbox');
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
});

// Gallery sorting functionality - Updated for grid
function sortGallery() {
    const sortType = document.getElementById('sortSelect').value;
    const galleryGrid = document.getElementById('galleryGrid');
    const items = Array.from(galleryGrid.children);
    
    let sortedItems = [...items];
    
    switch(sortType) {
        case 'name':
            sortedItems.sort((a, b) => {
                const nameA = a.dataset.name.toLowerCase();
                const nameB = b.dataset.name.toLowerCase();
                return nameA.localeCompare(nameB);
            });
            break;
        case 'type':
            sortedItems.sort((a, b) => {
                const typeA = a.dataset.type || '';
                const typeB = b.dataset.type || '';
                return typeA.localeCompare(typeB);
            });
            break;
        case 'date':
            sortedItems.sort((a, b) => {
                const dateA = new Date(a.dataset.date || '2024-01-01');
                const dateB = new Date(b.dataset.date || '2024-01-01');
                return dateA - dateB;
            });
            break;
        default:
            // Keep original order
            sortedItems = items;
            break;
    }
    
    // Clear and re-append sorted items
    galleryGrid.innerHTML = '';
    sortedItems.forEach(item => galleryGrid.appendChild(item));
    
    // Re-initialize lightbox for new items
    initializeLightbox();
}

// Initialize gallery when DOM is loaded
function smoothScrollTo(element, duration = 800) {
    const targetPosition = element.offsetTop - 80; // Account for fixed navbar
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Show navigation immediately since intro is removed
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.classList.add('show');
        // Start animations immediately
        if (!isLowEndDevice()) {
            startContentAnimations();
        }
    }
});

// Function to start all content animations after intro closes
function startContentAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                requestTick(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                });
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px 0px'
    });

    document.querySelectorAll('.gallery-item, .service-card, .package-card, .team-member').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px) scale(0.9)';
        observer.observe(el);
    });
}

// Modern navigation animations
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((link, index) => {
        // Add hover animations
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
            this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            this.style.textShadow = '0 5px 15px rgba(255, 107, 53, 0.4)';
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '100%';
            ripple.style.height = '100%';
            ripple.style.background = 'radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.textShadow = '';
        });
        
        // Add click animations
        link.addEventListener('click', function(e) {
            // Create particle explosion effect
            createParticleExplosion(e.pageX, e.pageY);
            
            // Add click pulse animation
            this.style.animation = 'navClickPulse 0.6s ease-out';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            const navbarToggler = document.querySelector('.navbar-toggler');
            
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
});

// Particle explosion effect
function createParticleExplosion(x, y) {
    const colors = ['#ff6b35', '#ff8c42', '#ffa500', '#ff6347'];
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.boxShadow = '0 0 10px rgba(255, 107, 53, 0.8)';
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 100 + Math.random() * 100;
        const lifetime = 800 + Math.random() * 400;
        
        particle.style.animation = `particleFly ${lifetime}ms ease-out forwards`;
        particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), lifetime);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes navClickPulse {
        0% {
            transform: scale(1);
            background: linear-gradient(45deg, transparent, rgba(255, 107, 53, 0.1), transparent);
        }
        50% {
            transform: scale(1.1);
            background: linear-gradient(45deg, transparent, rgba(255, 107, 53, 0.2), transparent);
        }
        100% {
            transform: scale(1);
            background: linear-gradient(45deg, transparent, rgba(255, 107, 53, 0.1), transparent);
        }
    }
    
    @keyframes particleFly {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
        }
    }
    
    .nav-link {
        position: relative;
        transition: all 0.3s ease;
        overflow: hidden;
    }
    
    .nav-link::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #ff6b35, #ff8c42);
        transform: translateX(-50%);
        transition: width 0.3s ease;
    }
    
    .nav-link:hover::before {
        width: 80%;
    }
    
    .nav-link.active {
        background: linear-gradient(45deg, rgba(255, 107, 53, 0.1), rgba(255, 140, 66, 0.1));
        border-radius: 8px;
    }
`;
document.head.appendChild(style);

// Mobile menu toggle handled by Bootstrap

// Lightbox functionality for gallery grid
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxLabel = document.getElementById('lightboxLabel');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox && lightboxImage && lightboxLabel && lightboxClose) {
    // Gallery grid items will be handled by initializeLightbox function
    
    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        closeLightbox();
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your inquiry! We will get back to you soon.');
        this.reset();
    });
}

// CTA Buttons functionality
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const text = button.textContent.toLowerCase();
        
        if (text.includes('portfolio')) {
            e.preventDefault();
            document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
        } else if (text.includes('consultation') || text.includes('inquire')) {
            e.preventDefault();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        } else if (text.includes('view')) {
            e.preventDefault();
            // Handle other view buttons
        }
    });
});

// Loading Intro Animation
document.addEventListener('DOMContentLoaded', () => {
    const loadingIntro = document.getElementById('loading-intro');
    
    if (loadingIntro) {
        // Hide intro after animations complete
        setTimeout(() => {
            loadingIntro.classList.add('hide');
            
            // Remove intro from DOM after hide animation
            setTimeout(() => {
                loadingIntro.remove();
            }, 2000);
        }, 5000);
    }
});

// Scroll to Top Button functionality - removed

// =========================== GALLERY ANIMATIONS ===========================
function animateGalleryItems() {
    const animatedItems = document.querySelectorAll('.animated-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px 0px'
    });
    
    animatedItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialize gallery animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateGalleryItems();
});
