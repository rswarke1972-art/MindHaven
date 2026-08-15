// ============================================
// MINDHAVEN - Mobile Optimizations Module
// ============================================

// Initialize Mobile Module
function initializeMobile() {
    console.log('📱 Initializing Mobile optimizations...');
    setupViewportOptimizations();
    setupTouchOptimizations();
    setupOrientationHandling();
    setupSafeAreaInsets();
    console.log('✅ Mobile optimizations initialized');
}

// ============================================
// VIEWPORT OPTIMIZATIONS
// ============================================

function setupViewportOptimizations() {
    // Prevent zoom on input focus (common mobile issue)
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
        // Keep user-scalable for accessibility but prevent accidental zoom
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }
    
    // Handle resize events
    window.addEventListener('resize', debounce(handleViewportChange, 250));

    // Handle soft keyboard resize via visualViewport API
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            const chatSection = document.getElementById('chat-section');
            if (chatSection && MindHaven.currentSection === 'chat') {
                chatSection.style.height = `${window.visualViewport.height - 60}px`;
                if (typeof MindHavenChatbot !== 'undefined') {
                    MindHavenChatbot.scrollToBottom();
                }
            }
        });
    }
}

function handleViewportChange() {
    // Recalculate any dynamic layouts
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// ============================================
// TOUCH OPTIMIZATIONS
// ============================================

function setupTouchOptimizations() {
    // Prevent double-tap zoom on buttons
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        }, { passive: true });
        
        el.addEventListener('touchend', function() {
            this.style.opacity = '';
        }, { passive: true });
    });
    
    // Add touch feedback to interactive elements
    document.querySelectorAll('.card, .hub-card, .coping-card, .ambience-card').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        el.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });
    
    // Optimize scroll performance
    document.querySelectorAll('.main-content').forEach(el => {
        el.style.touchAction = 'pan-y';
    });
}

// ============================================
// ORIENTATION HANDLING
// ============================================

function setupOrientationHandling() {
    window.addEventListener('orientationchange', debounce(handleOrientationChange, 300));
}

function handleOrientationChange() {
    // Wait for orientation change to complete
    setTimeout(() => {
        // Recalculate viewport
        handleViewportChange();
        
        // Close mobile menu if open
        closeNavMenu();
        
        // Scroll to top of current section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

// ============================================
// SAFE AREA INSETS (Notch support)
// ============================================

function setupSafeAreaInsets() {
    // Add CSS variable for safe area insets
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --safe-area-inset-top: env(safe-area-inset-top, 0px);
            --safe-area-inset-right: env(safe-area-inset-right, 0px);
            --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
            --safe-area-inset-left: env(safe-area-inset-left, 0px);
        }
        
        .nav-bar {
            padding-top: var(--safe-area-inset-top);
        }
        
        .bottom-nav {
            padding-bottom: var(--safe-area-inset-bottom);
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// KEYBOARD HANDLING
// ============================================

function setupKeyboardHandling() {
    // Handle virtual keyboard appearing/disappearing
    const initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
        const currentViewportHeight = window.innerHeight;
        const heightDifference = initialViewportHeight - currentViewportHeight;
        
        // If viewport shrank significantly, keyboard is likely open
        if (heightDifference > 150) {
            document.body.classList.add('keyboard-open');
        } else {
            document.body.classList.remove('keyboard-open');
        }
    });
    
    // Add CSS for keyboard handling
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-open .bottom-nav {
            transform: translateY(100%);
        }
        
        .keyboard-open .main-content {
            padding-bottom: 0;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// ONE-HANDED USAGE OPTIMIZATIONS
// ============================================

function setupOneHandedMode() {
    // Check if user prefers one-handed mode (could be a setting)
    const prefersOneHanded = localStorage.getItem('mindhaven_one_handed') === 'true';
    
    if (prefersOneHanded) {
        document.body.classList.add('one-handed-mode');
        
        // Add CSS for one-handed mode
        const style = document.createElement('style');
        style.textContent = `
            .one-handed-mode .bottom-nav {
                justify-content: flex-start;
                padding-left: 20px;
            }
            
            .one-handed-mode .bottom-nav-item {
                margin-right: 10px;
            }
            
            .one-handed-mode .primary-btn,
            .one-handed-mode .secondary-btn {
                min-width: 100px;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

function setupPerformanceOptimizations() {
    // Lazy load images if any are added later
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Reduce JavaScript execution on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        // Reduce animation complexity
        document.documentElement.setAttribute('data-low-end', 'true');
        
        const style = document.createElement('style');
        style.textContent = `
            [data-low-end="true"] * {
                animation-duration: 0.5s !important;
                transition-duration: 0.2s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

function setupMobileAccessibility() {
    // Increase tap targets for touch devices
    if ('ontouchstart' in window) {
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) and (pointer: coarse) {
                button,
                .mood-btn,
                .hub-card,
                .coping-card,
                .ambience-card,
                .support-item,
                .quick-btn,
                .tag-btn {
                    min-height: 48px;
                    min-width: 48px;
                }
                
                input[type="range"] {
                    height: 48px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Focus management for mobile keyboards
    document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('focus', function() {
            // Scroll element into view smoothly
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
}

// ============================================
// BATTERY AWARENESS
// ============================================

function setupBatteryAwareness() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            function updateBatteryStatus() {
                if (battery.level < 0.2 && !battery.charging) {
                    // Reduce animations to save battery
                    document.documentElement.setAttribute('data-battery-saver', 'true');
                    
                    const style = document.createElement('style');
                    style.textContent = `
                        [data-battery-saver="true"] * {
                            animation: none !important;
                            transition: none !important;
                        }
                    `;
                    document.head.appendChild(style);
                } else {
                    document.documentElement.removeAttribute('data-battery-saver');
                }
            }
            
            updateBatteryStatus();
            battery.addEventListener('levelchange', updateBatteryStatus);
            battery.addEventListener('chargingchange', updateBatteryStatus);
        });
    }
}

// ============================================
// OFFLINE SUPPORT
// ============================================

function setupOfflineSupport() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
        showGentleMessage('You\'re back online!');
    });
    
    window.addEventListener('offline', () => {
        showGentleMessage('You\'re offline. Some features may be limited.');
    });
    
    // Check initial status
    if (!navigator.onLine) {
        showGentleMessage('You\'re offline. Some features may be limited.');
    }
}

// ============================================
// MOBILE-SPECIFIC NAVIGATION
// ============================================

function setupMobileNavigation() {
    // Swipe gestures for navigation (optional enhancement)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 100;
        const diff = touchStartX - touchEndX;
        
        // Only enable swipe navigation if user has enabled it in settings
        if (localStorage.getItem('mindhaven_swipe_nav') === 'true') {
            if (Math.abs(diff) > swipeThreshold) {
                // Could implement swipe navigation between sections
                // For now, this is a placeholder for future enhancement
            }
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeMobile();
    setupKeyboardHandling();
    setupOneHandedMode();
    setupPerformanceOptimizations();
    setupMobileAccessibility();
    setupBatteryAwareness();
    setupOfflineSupport();
    setupMobileNavigation();
    
    // Set initial viewport height variable
    handleViewportChange();
});

// Export functions for potential use in other modules
window.handleViewportChange = handleViewportChange;
