// Background Music System - Include this in all HTML pages
(function() {
    let audio;
    let isInitialized = false;
    let playAttempts = 0;
    const maxPlayAttempts = 20;
    let autoplayAttempted = false;
    
    function initAudio() {
        if (isInitialized) return;
        
        audio = document.getElementById('bgMusic');
        
        if (!audio) {
            console.error('Background music element not found. Make sure you have <audio id="bgMusic"> in your HTML');
            return;
        }
        
        // Set volume to 3%
        audio.volume = 0.03;
        
        // Restore playback position and state
        const savedTime = sessionStorage.getItem('musicTime');
        const wasPlaying = sessionStorage.getItem('musicPlaying');
        
        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);
        }
        
        // Prevent audio from stopping on page interactions
        audio.addEventListener('pause', function(e) {
            // Only allow pause if user explicitly paused it
            if (!e.target.dataset.userPaused) {
                e.preventDefault();
                setTimeout(() => {
                    audio.play().catch(() => {});
                }, 100);
            }
        });
        
        // Add event listeners for audio state
        audio.addEventListener('play', function() {
            sessionStorage.setItem('musicPlaying', 'true');
            console.log('Background music is playing');
        });
        
        audio.addEventListener('pause', function() {
            if (!audio.dataset.userPaused) {
                sessionStorage.setItem('musicPlaying', 'false');
            }
        });
        
        audio.addEventListener('error', function(e) {
            console.error('Audio error:', e);
        });
        
        isInitialized = true;
        
        // Try to autoplay immediately
        if (!autoplayAttempted) {
            autoplayAttempted = true;
            setTimeout(() => {
                attemptAutoplay();
            }, 500); // Small delay to ensure DOM is ready
        }
    }
    
    function attemptAutoplay() {
        if (playAttempts >= maxPlayAttempts) {
            console.log('Max autoplay attempts reached - will try on user interaction');
            return;
        }
        
        playAttempts++;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Background music started automatically');
                playAttempts = 0; // Reset attempts on success
                sessionStorage.setItem('musicPlaying', 'true');
            }).catch(e => {
                console.log(`Autoplay attempt ${playAttempts} failed:`, e);
                
                if (playAttempts < maxPlayAttempts) {
                    // Try different strategies
                    if (playAttempts <= 5) {
                        // Immediate retry
                        setTimeout(attemptAutoplay, 500);
                    } else if (playAttempts <= 10) {
                        // Longer delay
                        setTimeout(attemptAutoplay, 1000);
                    } else if (playAttempts <= 15) {
                        // Even longer delay
                        setTimeout(attemptAutoplay, 2000);
                    } else {
                        // Final attempt with user interaction fallback
                        setupUserInteractionFallback();
                    }
                }
            });
        }
    }
    
    function setupUserInteractionFallback() {
        console.log('Setting up user interaction fallback for autoplay');
        
        // Try multiple user interaction events
        const events = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'];
        
        function tryPlayOnInteraction(e) {
            if (audio && audio.paused && playAttempts < maxPlayAttempts) {
                audio.play().then(() => {
                    console.log('Music started on user interaction:', e.type);
                    playAttempts = 0;
                    // Remove all event listeners once successful
                    events.forEach(eventType => {
                        document.removeEventListener(eventType, tryPlayOnInteraction);
                    });
                }).catch(error => {
                    console.log('Play on interaction failed:', error);
                });
            }
        }
        
        // Add listeners for various user interactions
        events.forEach(eventType => {
            document.addEventListener(eventType, tryPlayOnInteraction, { once: false, passive: true });
        });
    }
    
    function attemptPlay() {
        if (playAttempts >= maxPlayAttempts) {
            console.log('Max play attempts reached');
            return;
        }
        
        playAttempts++;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Background music started successfully');
                playAttempts = 0; // Reset attempts on success
            }).catch(e => {
                console.log(`Play attempt ${playAttempts} failed:`, e);
                if (playAttempts < maxPlayAttempts) {
                    setTimeout(attemptPlay, 1000);
                }
            });
        }
    }
    
    function saveState() {
        if (audio && isInitialized) {
            sessionStorage.setItem('musicTime', audio.currentTime.toString());
            sessionStorage.setItem('musicPlaying', !audio.paused ? 'true' : 'false');
        }
    }
    
    // Initialize immediately when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAudio);
    } else {
        initAudio();
    }
    
    // Additional initialization when window is fully loaded
    window.addEventListener('load', function() {
        if (!isInitialized) {
            initAudio();
        }
        // Try autoplay again when page is fully loaded
        setTimeout(() => {
            if (audio && audio.paused && playAttempts < maxPlayAttempts) {
                attemptAutoplay();
            }
        }, 1000);
    });
    
    // Save state periodically
    setInterval(saveState, 2000);
    
    // Save state when page is unloading
    window.addEventListener('beforeunload', saveState);
    
    // Handle visibility change (when switching tabs)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            saveState();
        } else if (audio && audio.paused && sessionStorage.getItem('musicPlaying') === 'true') {
            // Resume playing when tab becomes visible again
            attemptPlay();
        }
    });
    
    // Prevent music from stopping on navigation clicks
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && target.href) {
            // Save state before navigation
            saveState();
            // Don't interrupt music for navigation
            e.preventDefault();
            setTimeout(() => {
                window.location.href = target.href;
            }, 100);
        }
    }, true);
    
    // Handle video fullscreen - don't stop background music
    document.addEventListener('fullscreenchange', function() {
        if (audio && !audio.paused && sessionStorage.getItem('musicPlaying') === 'true') {
            // Ensure music continues playing in fullscreen
            setTimeout(() => {
                audio.play().catch(() => {});
            }, 500);
        }
    });
    
    // Global function to control music (optional)
    window.toggleMusic = function() {
        if (!audio || !isInitialized) return;
        
        if (audio.paused) {
            audio.dataset.userPaused = 'false';
            attemptPlay();
        } else {
            audio.dataset.userPaused = 'true';
            audio.pause();
        }
    };
    
    // Make audio accessible globally
    window.getBackgroundMusic = function() {
        return audio;
    };
})();
