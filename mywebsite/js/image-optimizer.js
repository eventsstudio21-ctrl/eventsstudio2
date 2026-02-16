/**
 * Advanced Image Optimization System for Events Studio
 * Features: Smart preloading, lazy loading, progressive loading, blur-up effects
 */

class ImageOptimizer {
    constructor(options = {}) {
        this.options = {
            preloadCount: options.preloadCount || 6,
            lazyRootMargin: options.lazyRootMargin || '200px',
            blurUpQuality: options.blurUpQuality || 20,
            enableProgressive: options.enableProgressive !== false,
            enablePreloading: options.enablePreloading !== false,
            enableLazyLoading: options.enableLazyLoading !== false,
            ...options
        };
        
        this.imageCache = new Map();
        this.observer = null;
        this.preloadedImages = new Set();
        this.loadingImages = new Set();
        
        this.init();
    }
    
    init() {
        if (this.options.enableLazyLoading) {
            this.setupLazyLoading();
        }
        
        if (this.options.enablePreloading) {
            this.setupSmartPreloading();
        }
        
        if (this.options.enableProgressive) {
            this.setupProgressiveLoading();
        }
    }
    
    /**
     * Create blur-up placeholder for progressive loading
     */
    createBlurPlaceholder(src, width, height) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 20; // Small thumbnail size
            canvas.height = (height / width) * 20;
            
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const blurDataUrl = canvas.toDataURL('image/jpeg', this.options.blurUpQuality / 100);
                resolve(blurDataUrl);
            };
            img.src = src;
        });
    }
    
    /**
     * Setup progressive loading with blur-up effect
     */
    setupProgressiveLoading() {
        const progressiveImages = document.querySelectorAll('[data-progressive]');
        
        progressiveImages.forEach(async (img) => {
            const fullSrc = img.dataset.src || img.src;
            const width = img.dataset.width || img.naturalWidth || 400;
            const height = img.dataset.height || img.naturalHeight || 300;
            
            // Create blur placeholder
            const blurPlaceholder = await this.createBlurPlaceholder(fullSrc, width, height);
            
            // Set initial blur state
            img.style.filter = 'blur(10px)';
            img.style.transition = 'filter 0.6s ease-out';
            img.src = blurPlaceholder;
            
            // Load full image
            const fullImg = new Image();
            fullImg.onload = () => {
                img.src = fullSrc;
                setTimeout(() => {
                    img.style.filter = 'blur(0)';
                }, 100);
            };
            fullImg.src = fullSrc;
        });
    }
    
    /**
     * Setup intersection observer for lazy loading
     */
    setupLazyLoading() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: this.options.lazyRootMargin,
            threshold: 0.1
        });
        
        // Observe all lazy images
        document.querySelectorAll('[data-lazy]').forEach(img => {
            this.observer.observe(img);
        });
    }
    
    /**
     * Load individual image with caching
     */
    async loadImage(img) {
        const src = img.dataset.src || img.src;
        
        if (this.imageCache.has(src)) {
            img.src = this.imageCache.get(src);
            return;
        }
        
        if (this.loadingImages.has(src)) {
            return; // Already loading
        }
        
        this.loadingImages.add(src);
        
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            
            this.imageCache.set(src, objectUrl);
            img.src = objectUrl;
            
            // Add fade-in effect
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.4s ease-in';
            
            img.onload = () => {
                img.style.opacity = '1';
            };
            
        } catch (error) {
            console.error('Failed to load image:', src, error);
            img.src = img.dataset.fallback || src;
        } finally {
            this.loadingImages.delete(src);
        }
    }
    
    /**
     * Smart preloading based on user behavior and viewport
     */
    setupSmartPreloading() {
        // Preload critical images immediately
        this.preloadCriticalImages();
        
        // Preload images on hover
        this.setupHoverPreloading();
        
        // Preload images based on scroll direction
        this.setupScrollBasedPreloading();
        
        // Preload images on idle
        this.setupIdlePreloading();
    }
    
    /**
     * Preload critical above-the-fold images
     */
    preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('[data-critical]');
        const preloadPromises = [];
        
        criticalImages.slice(0, this.options.preloadCount).forEach(img => {
            const src = img.dataset.src || img.src;
            if (!this.preloadedImages.has(src)) {
                preloadPromises.push(this.preloadImage(src));
                this.preloadedImages.add(src);
            }
        });
        
        return Promise.all(preloadPromises);
    }
    
    /**
     * Preload images on hover for instant interaction
     */
    setupHoverPreloading() {
        document.addEventListener('mouseover', (e) => {
            const galleryItem = e.target.closest('.gallery-item-modern, .slide');
            if (galleryItem) {
                const img = galleryItem.querySelector('img');
                if (img) {
                    const src = img.dataset.src || img.src;
                    if (!this.preloadedImages.has(src)) {
                        this.preloadImage(src);
                        this.preloadedImages.add(src);
                    }
                }
            }
        }, { passive: true });
    }
    
    /**
     * Preload images based on scroll direction
     */
    setupScrollBasedPreloading() {
        let lastScrollY = window.scrollY;
        let scrollTimer;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const currentScrollY = window.scrollY;
                const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
                
                this.preloadImagesInScrollDirection(scrollDirection);
                lastScrollY = currentScrollY;
            }, 100);
        }, { passive: true });
    }
    
    /**
     * Preload images in scroll direction
     */
    preloadImagesInScrollDirection(direction) {
        const images = document.querySelectorAll('.gallery-item-modern img, .slide img');
        const viewport = this.getViewportInfo();
        
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const src = img.dataset.src || img.src;
            
            if (this.preloadedImages.has(src)) return;
            
            let shouldPreload = false;
            
            if (direction === 'down') {
                shouldPreload = rect.top > viewport.top && rect.top < viewport.bottom + 500;
            } else {
                shouldPreload = rect.bottom < viewport.bottom && rect.bottom > viewport.top - 500;
            }
            
            if (shouldPreload) {
                this.preloadImage(src);
                this.preloadedImages.add(src);
            }
        });
    }
    
    /**
     * Preload images during browser idle time
     */
    setupIdlePreloading() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.preloadNextImages();
            });
        } else {
            setTimeout(() => {
                this.preloadNextImages();
            }, 1000);
        }
    }
    
    /**
     * Preload next batch of images
     */
    preloadNextImages() {
        const images = document.querySelectorAll('.gallery-item-modern img, .slide img');
        const unpreloaded = Array.from(images).filter(img => {
            const src = img.dataset.src || img.src;
            return !this.preloadedImages.has(src);
        });
        
        const toPreload = unpreloaded.slice(0, this.options.preloadCount);
        const preloadPromises = toPreload.map(img => {
            const src = img.dataset.src || img.src;
            this.preloadedImages.add(src);
            return this.preloadImage(src);
        });
        
        Promise.all(preloadPromises).then(() => {
            if (unpreloaded.length > this.options.preloadCount) {
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => {
                        this.preloadNextImages();
                    });
                } else {
                    setTimeout(() => {
                        this.preloadNextImages();
                    }, 2000);
                }
            }
        });
    }
    
    /**
     * Preload single image
     */
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            if (this.imageCache.has(src)) {
                resolve(this.imageCache.get(src));
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            
            link.onload = () => {
                const img = new Image();
                img.onload = () => {
                    this.imageCache.set(src, src);
                    resolve(src);
                };
                img.onerror = reject;
                img.src = src;
            };
            
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
    
    /**
     * Get viewport information
     */
    getViewportInfo() {
        return {
            top: 0,
            bottom: window.innerHeight,
            left: 0,
            right: window.innerWidth
        };
    }
    
    /**
     * Add new image to optimization system
     */
    addImage(img, options = {}) {
        if (options.lazy) {
            img.setAttribute('data-lazy', 'true');
            if (this.observer) {
                this.observer.observe(img);
            }
        }
        
        if (options.progressive) {
            img.setAttribute('data-progressive', 'true');
        }
        
        if (options.critical) {
            img.setAttribute('data-critical', 'true');
        }
        
        if (options.src) {
            img.setAttribute('data-src', options.src);
        }
        
        if (options.fallback) {
            img.setAttribute('data-fallback', options.fallback);
        }
    }
    
    /**
     * Clear image cache
     */
    clearCache() {
        this.imageCache.forEach((url) => {
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
        this.imageCache.clear();
        this.preloadedImages.clear();
        this.loadingImages.clear();
    }
    
    /**
     * Get optimization statistics
     */
    getStats() {
        return {
            cachedImages: this.imageCache.size,
            preloadedImages: this.preloadedImages.size,
            loadingImages: this.loadingImages.size
        };
    }
}

// Initialize and export
window.ImageOptimizer = ImageOptimizer;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageOptimizer = new ImageOptimizer({
            preloadCount: 6,
            lazyRootMargin: '200px',
            blurUpQuality: 20,
            enableProgressive: true,
            enablePreloading: true,
            enableLazyLoading: true
        });
    });
} else {
    window.imageOptimizer = new ImageOptimizer({
        preloadCount: 6,
        lazyRootMargin: '200px',
        blurUpQuality: 20,
        enableProgressive: true,
        enablePreloading: true,
        enableLazyLoading: true
    });
}
