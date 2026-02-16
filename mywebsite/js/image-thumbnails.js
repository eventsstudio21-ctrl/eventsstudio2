/**
 * Image Thumbnail Generator and Manager for Events Studio
 * Creates optimized thumbnails and compressed versions for faster loading
 */

class ThumbnailGenerator {
    constructor(options = {}) {
        this.options = {
            thumbnailWidth: options.thumbnailWidth || 200,
            thumbnailHeight: options.thumbnailHeight || 200,
            thumbnailQuality: options.thumbnailQuality || 0.7,
            compressedQuality: options.compressedQuality || 0.8,
            enableWebP: options.enableWebP !== false,
            enableAVIF: options.enableAVIF !== false,
            storagePrefix: options.storagePrefix || 'events_thumb_',
            cacheExpiry: options.cacheExpiry || 7 * 24 * 60 * 60 * 1000, // 7 days
            ...options
        };
        
        this.cache = new Map();
        this.supportedFormats = this.getSupportedFormats();
        this.init();
    }
    
    init() {
        this.loadCacheFromStorage();
        this.cleanupExpiredCache();
    }
    
    /**
     * Check browser support for modern image formats
     */
    getSupportedFormats() {
        const formats = {
            webp: false,
            avif: false
        };
        
        // Check WebP support
        const webp = new Image();
        webp.onload = webp.onerror = () => {
            formats.webp = (webp.height === 2);
        };
        webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        
        // Check AVIF support
        const avif = new Image();
        avif.onload = avif.onerror = () => {
            formats.avif = (avif.height === 2);
        };
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        
        return formats;
    }
    
    /**
     * Generate thumbnail from image URL or file
     */
    async generateThumbnail(source, options = {}) {
        const config = { ...this.options, ...options };
        const cacheKey = this.getCacheKey(source, config);
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            const img = await this.loadImage(source);
            const thumbnail = await this.createThumbnail(img, config);
            const compressed = await this.compressImage(thumbnail, config);
            
            // Cache the result
            this.cache.set(cacheKey, compressed);
            this.saveCacheToStorage(cacheKey, compressed);
            
            return compressed;
        } catch (error) {
            console.error('Failed to generate thumbnail:', error);
            return source; // Fallback to original
        }
    }
    
    /**
     * Load image from URL or File
     */
    loadImage(source) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => resolve(img);
            img.onerror = reject;
            
            if (source instanceof File) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(source);
            } else {
                img.src = source;
            }
        });
    }
    
    /**
     * Create thumbnail canvas
     */
    createThumbnail(img, config) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate dimensions maintaining aspect ratio
        const aspectRatio = img.width / img.height;
        let width = config.thumbnailWidth;
        let height = config.thumbnailHeight;
        
        if (aspectRatio > 1) {
            height = width / aspectRatio;
        } else {
            width = height * aspectRatio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image with high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        return canvas;
    }
    
    /**
     * Compress image to optimal format
     */
    async compressImage(canvas, config) {
        const formats = [];
        
        // Add WebP if supported and enabled
        if (this.supportedFormats.webp && config.enableWebP) {
            formats.push({
                type: 'image/webp',
                quality: config.thumbnailQuality,
                extension: '.webp'
            });
        }
        
        // Add AVIF if supported and enabled
        if (this.supportedFormats.avif && config.enableAVIF) {
            formats.push({
                type: 'image/avif',
                quality: config.thumbnailQuality,
                extension: '.avif'
            });
        }
        
        // Always include JPEG as fallback
        formats.push({
            type: 'image/jpeg',
            quality: config.compressedQuality,
            extension: '.jpg'
        });
        
        // Try formats in order of preference
        for (const format of formats) {
            try {
                const dataUrl = canvas.toDataURL(format.type, format.quality);
                return {
                    url: dataUrl,
                    format: format.type,
                    extension: format.extension,
                    size: this.getDataUrlSize(dataUrl)
                };
            } catch (error) {
                console.warn(`Failed to create ${format.type} thumbnail:`, error);
                continue;
            }
        }
        
        throw new Error('Failed to create thumbnail in any format');
    }
    
    /**
     * Generate multiple thumbnail sizes
     */
    async generateMultipleThumbnails(source, sizes = []) {
        const thumbnails = {};
        const defaultSizes = [
            { name: 'small', width: 100, height: 100 },
            { name: 'medium', width: 200, height: 200 },
            { name: 'large', width: 400, height: 400 }
        ];
        
        const targetSizes = sizes.length > 0 ? sizes : defaultSizes;
        
        for (const size of targetSizes) {
            try {
                thumbnails[size.name] = await this.generateThumbnail(source, {
                    thumbnailWidth: size.width,
                    thumbnailHeight: size.height
                });
            } catch (error) {
                console.error(`Failed to generate ${size.name} thumbnail:`, error);
            }
        }
        
        return thumbnails;
    }
    
    /**
     * Batch process multiple images
     */
    async batchProcess(sources, options = {}) {
        const results = [];
        const batchSize = options.batchSize || 5;
        
        for (let i = 0; i < sources.length; i += batchSize) {
            const batch = sources.slice(i, i + batchSize);
            const batchPromises = batch.map(source => 
                this.generateThumbnail(source, options)
                    .then(thumbnail => ({ source, thumbnail, success: true }))
                    .catch(error => ({ source, error, success: false }))
            );
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            
            // Small delay between batches to prevent blocking
            if (i + batchSize < sources.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        return results;
    }
    
    /**
     * Get cache key for storage
     */
    getCacheKey(source, config) {
        const sourceStr = source instanceof File ? source.name : source;
        const configStr = JSON.stringify({
            width: config.thumbnailWidth,
            height: config.thumbnailHeight,
            quality: config.thumbnailQuality
        });
        return `${this.options.storagePrefix}${btoa(sourceStr + configStr)}`;
    }
    
    /**
     * Save cache to localStorage
     */
    saveCacheToStorage(key, data) {
        try {
            const cacheData = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }
    
    /**
     * Load cache from localStorage
     */
    loadCacheFromStorage() {
        try {
            const keys = Object.keys(localStorage).filter(key => 
                key.startsWith(this.options.storagePrefix)
            );
            
            keys.forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    const cacheData = JSON.parse(item);
                    this.cache.set(key, cacheData.data);
                }
            });
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
        }
    }
    
    /**
     * Clean up expired cache entries
     */
    cleanupExpiredCache() {
        const now = Date.now();
        const keysToDelete = [];
        
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.options.storagePrefix)) {
                try {
                    const item = localStorage.getItem(key);
                    if (item) {
                        const cacheData = JSON.parse(item);
                        if (now - cacheData.timestamp > this.options.cacheExpiry) {
                            keysToDelete.push(key);
                        }
                    }
                } catch (error) {
                    keysToDelete.push(key);
                }
            }
        });
        
        keysToDelete.forEach(key => {
            localStorage.removeItem(key);
            this.cache.delete(key);
        });
    }
    
    /**
     * Get data URL size in bytes
     */
    getDataUrlSize(dataUrl) {
        const base64 = dataUrl.split(',')[1];
        return Math.round(base64.length * 0.75);
    }
    
    /**
     * Clear all cache
     */
    clearCache() {
        const keys = Object.keys(localStorage).filter(key => 
            key.startsWith(this.options.storagePrefix)
        );
        
        keys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        this.cache.clear();
    }
    
    /**
     * Get cache statistics
     */
    getCacheStats() {
        const stats = {
            entries: this.cache.size,
            totalSize: 0,
            formats: {}
        };
        
        this.cache.forEach(data => {
            stats.totalSize += data.size || 0;
            const format = data.format || 'unknown';
            stats.formats[format] = (stats.formats[format] || 0) + 1;
        });
        
        return stats;
    }
}

// Export and auto-initialize
window.ThumbnailGenerator = ThumbnailGenerator;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.thumbnailGenerator = new ThumbnailGenerator({
            thumbnailWidth: 200,
            thumbnailHeight: 200,
            thumbnailQuality: 0.7,
            compressedQuality: 0.8,
            enableWebP: true,
            enableAVIF: true,
            storagePrefix: 'events_thumb_',
            cacheExpiry: 7 * 24 * 60 * 60 * 1000
        });
    });
} else {
    window.thumbnailGenerator = new ThumbnailGenerator({
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        thumbnailQuality: 0.7,
        compressedQuality: 0.8,
        enableWebP: true,
        enableAVIF: true,
        storagePrefix: 'events_thumb_',
        cacheExpiry: 7 * 24 * 60 * 60 * 1000
    });
}
