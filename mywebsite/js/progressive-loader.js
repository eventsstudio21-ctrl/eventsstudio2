/**
 * Progressive Image Loader with Blur-Up Effects for Events Studio
 * Provides smooth loading experience with placeholder images and transitions
 */

class ProgressiveLoader {
    constructor(options = {}) {
        this.options = {
            blurRadius: options.blurRadius || 3,
            transitionDuration: options.transitionDuration || 600,
            placeholderQuality: options.placeholderQuality || 20,
            enableLowQualityPlaceholder: options.enableLowQualityPlaceholder !== false,
            enableColorPlaceholder: options.enableColorPlaceholder !== false,
            enableSVGPlaceholder: options.enableSVGPlaceholder !== false,
            loadingStrategy: options.loadingStrategy || 'progressive', // 'progressive', 'lazy', 'eager'
            ...options
        };
        
        this.loadedImages = new Set();
        this.loadingImages = new Set();
        this.observer = null;
        this.colorCache = new Map();
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.processExistingImages();
        this.setupMutationObserver();
    }
    
    /**
     * Setup intersection observer for lazy loading
     */
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadProgressiveImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '200px',
                threshold: 0.1
            });
        }
    }
    
    /**
     * Process existing images on the page
     */
    processExistingImages() {
        const images = document.querySelectorAll('img[data-progressive]');
        images.forEach(img => {
            this.setupProgressiveImage(img);
        });
    }
    
    /**
     * Setup mutation observer for dynamically added images
     */
    setupMutationObserver() {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const images = node.querySelectorAll ? 
                                node.querySelectorAll('img[data-progressive]') : [];
                            images.forEach(img => this.setupProgressiveImage(img));
                            
                            if (node.tagName === 'IMG' && node.hasAttribute('data-progressive')) {
                                this.setupProgressiveImage(node);
                            }
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    /**
     * Setup progressive loading for a single image
     */
    setupProgressiveImage(img) {
        const src = img.dataset.src || img.src;
        
        if (!src || this.loadedImages.has(src)) {
            return;
        }
        
        // Add loading class
        img.classList.add('progressive-loading');
        
        // Create placeholder
        this.createPlaceholder(img, src);
        
        // Start loading based on strategy
        if (this.options.loadingStrategy === 'eager') {
            this.loadProgressiveImage(img);
        } else if (this.options.loadingStrategy === 'lazy' && this.observer) {
            this.observer.observe(img);
        } else {
            // Progressive loading with delay
            setTimeout(() => this.loadProgressiveImage(img), 100);
        }
    }
    
    /**
     * Create placeholder for image
     */
    async createPlaceholder(img, src) {
        const placeholder = await this.generatePlaceholder(src, img);
        
        if (placeholder) {
            img.style.transition = `filter ${this.options.transitionDuration}ms ease-out, transform ${this.options.transitionDuration}ms ease-out`;
            img.style.filter = `blur(${this.options.blurRadius}px)`;
            img.style.transform = 'scale(1.05)';
            
            if (typeof placeholder === 'string') {
                img.src = placeholder;
            } else if (placeholder && placeholder.url) {
                img.src = placeholder.url;
            }
        }
    }
    
    /**
     * Generate placeholder image
     */
    async generatePlaceholder(src, img) {
        const strategies = [];
        
        if (this.options.enableLowQualityPlaceholder) {
            strategies.push(() => this.generateLowQualityPlaceholder(src));
        }
        
        if (this.options.enableColorPlaceholder) {
            strategies.push(() => this.generateColorPlaceholder(src));
        }
        
        if (this.options.enableSVGPlaceholder) {
            strategies.push(() => this.generateSVGPlaceholder(img));
        }
        
        // Try strategies in order
        for (const strategy of strategies) {
            try {
                const placeholder = await strategy();
                if (placeholder) {
                    return placeholder;
                }
            } catch (error) {
                console.warn('Placeholder strategy failed:', error);
            }
        }
        
        return null;
    }
    
    /**
     * Generate low quality image placeholder
     */
    async generateLowQualityPlaceholder(src) {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Small canvas for placeholder
                    canvas.width = 40;
                    canvas.height = (img.height / img.width) * 40;
                    
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', this.options.placeholderQuality / 100);
                    resolve(dataUrl);
                };
                
                img.onerror = () => resolve(null);
                img.src = URL.createObjectURL(blob);
            });
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Generate color-based placeholder
     */
    async generateColorPlaceholder(src) {
        if (this.colorCache.has(src)) {
            return this.colorCache.get(src);
        }
        
        try {
            const dominantColor = await this.extractDominantColor(src);
            const colorPlaceholder = this.createColorGradient(dominantColor);
            
            this.colorCache.set(src, colorPlaceholder);
            return colorPlaceholder;
        } catch (error) {
            return this.createColorGradient('#cccccc');
        }
    }
    
    /**
     * Extract dominant color from image
     */
    async extractDominantColor(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = 50;
                canvas.height = 50;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                let r = 0, g = 0, b = 0;
                let count = 0;
                
                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }
                
                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);
                
                resolve(`rgb(${r}, ${g}, ${b})`);
            };
            
            img.onerror = () => resolve('#cccccc');
            img.src = src;
        });
    }
    
    /**
     * Create color gradient placeholder
     */
    createColorGradient(color) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 200;
        canvas.height = 200;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.lightenColor(color, 20));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        return canvas.toDataURL();
    }
    
    /**
     * Generate SVG placeholder
     */
    generateSVGPlaceholder(img) {
        const width = img.width || 400;
        const height = img.height || 300;
        const aspectRatio = width / height;
        
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#f0f0f0;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad)" />
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#999" text-anchor="middle" dy=".3em">
                    Loading...
                </text>
            </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }
    
    /**
     * Load progressive image with transition
     */
    async loadProgressiveImage(img) {
        const src = img.dataset.src || img.src;
        
        if (this.loadingImages.has(src) || this.loadedImages.has(src)) {
            return;
        }
        
        this.loadingImages.add(src);
        
        try {
            const fullImage = new Image();
            
            fullImage.onload = () => {
                // Update image source
                img.src = src;
                
                // Smooth transition
                setTimeout(() => {
                    img.style.filter = 'blur(0)';
                    img.style.transform = 'scale(1)';
                    img.classList.remove('progressive-loading');
                    img.classList.add('progressive-loaded');
                }, 100);
                
                this.loadedImages.add(src);
                this.loadingImages.delete(src);
                
                // Emit custom event
                img.dispatchEvent(new CustomEvent('progressiveLoad', {
                    detail: { src, img }
                }));
            };
            
            fullImage.onerror = () => {
                img.classList.add('progressive-error');
                img.classList.remove('progressive-loading');
                this.loadingImages.delete(src);
                
                // Try fallback
                if (img.dataset.fallback) {
                    img.src = img.dataset.fallback;
                }
            };
            
            fullImage.src = src;
            
        } catch (error) {
            console.error('Failed to load progressive image:', error);
            this.loadingImages.delete(src);
        }
    }
    
    /**
     * Lighten color by percentage
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
    
    /**
     * Add new image to progressive loading
     */
    addImage(img, options = {}) {
        img.setAttribute('data-progressive', 'true');
        
        if (options.src) {
            img.setAttribute('data-src', options.src);
        }
        
        if (options.fallback) {
            img.setAttribute('data-fallback', options.fallback);
        }
        
        if (options.strategy) {
            img.setAttribute('data-strategy', options.strategy);
        }
        
        this.setupProgressiveImage(img);
    }
    
    /**
     * Get loading statistics
     */
    getStats() {
        return {
            loaded: this.loadedImages.size,
            loading: this.loadingImages.size,
            cachedColors: this.colorCache.size
        };
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.loadedImages.clear();
        this.loadingImages.clear();
        this.colorCache.clear();
    }
}

// Export and auto-initialize
window.ProgressiveLoader = ProgressiveLoader;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.progressiveLoader = new ProgressiveLoader({
            blurRadius: 10,
            transitionDuration: 600,
            placeholderQuality: 20,
            enableLowQualityPlaceholder: true,
            enableColorPlaceholder: true,
            enableSVGPlaceholder: true,
            loadingStrategy: 'progressive'
        });
    });
} else {
    window.progressiveLoader = new ProgressiveLoader({
        blurRadius: 10,
        transitionDuration: 600,
        placeholderQuality: 20,
        enableLowQualityPlaceholder: true,
        enableColorPlaceholder: true,
        enableSVGPlaceholder: true,
        loadingStrategy: 'progressive'
    });
}
