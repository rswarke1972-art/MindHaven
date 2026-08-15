// ============================================
// MINDHAVEN - PWA Install Experience Module
// ============================================

// PWA Install State
const PWAInstall = {
    deferredPrompt: null,
    isInstallable: false
};

// Initialize PWA Install Module
function initializePWAInstall() {
    console.log('📱 Initializing PWA Install Experience...');
    setupInstallListeners();
    checkPWAInstallability();

    // Wait for service worker to be ready
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            console.log('✅ Service Worker is ready');
            console.log('Service Worker state:', registration.active ? 'active' : 'not active');
        }).catch((error) => {
            console.log('❌ Service Worker not ready:', error);
        });
    }

    console.log('✅ PWA Install Experience initialized');
}

// ============================================
// INSTALL LISTENERS
// ============================================

function setupInstallListeners() {
    // Check if app is already installed (running in standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
    
    if (isStandalone) {
        console.log('App is already installed in standalone mode - skipping install prompt');
        return;
    }
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        PWAInstall.deferredPrompt = e;
        PWAInstall.isInstallable = true;
        console.log('✅ beforeinstallprompt event fired - PWA is installable!');
        
        // Show install prompt after a delay
        setTimeout(() => {
            showInstallPrompt();
        }, 2000); // Show after 2 seconds
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
        PWAInstall.deferredPrompt = null;
        PWAInstall.isInstallable = false;
        showGentleMessage('MindHaven installed successfully! 🎉');
        hideInstallPrompt();
    });
    
    // Check if service worker is ready
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            console.log('✅ Service Worker is ready:', registration);
            console.log('✅ Service Worker state:', registration.active ? 'active' : 'not active');
            
            // If we have a deferred prompt, show it
            if (PWAInstall.deferredPrompt) {
                setTimeout(() => {
                    showInstallPrompt();
                }, 2000);
            }
        }).catch((error) => {
            console.log('❌ Service Worker not ready:', error);
        });
    }
}

// Check if PWA is installable
function checkPWAInstallability() {
    // Check if running in browser (not file://)
    const isFileProtocol = window.location.protocol === 'file:';
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    console.log('🔍 PWA Installability Check:');
    console.log('  Protocol:', window.location.protocol);
    console.log('  Hostname:', window.location.hostname);
    console.log('  HTTPS:', window.location.protocol === 'https:');
    console.log('  Localhost:', isLocalhost);
    console.log('  File Protocol:', isFileProtocol);
    
    if (isFileProtocol) {
        console.log('⚠️  WARNING: Running from file:// protocol - PWA installation will not work!');
        console.log('⚠️  Please serve the app over HTTPS or localhost for PWA installation.');
    }
    
    if (!window.location.protocol === 'https:' && !isLocalhost) {
        console.log('⚠️  WARNING: Not served over HTTPS - PWA installation may not work!');
    }
}

// ============================================
// INSTALL PROMPT UI
// ============================================

function showInstallPrompt() {
    // Check if app is already installed (running in standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
    
    if (isStandalone) {
        console.log('App is in standalone mode - skipping install prompt');
        return;
    }
    
    // Only show prompt if deferred prompt is available (native install)
    if (!PWAInstall.deferredPrompt) {
        console.log('No deferred prompt available - not showing install popup');
        return;
    }
    
    // Remove existing prompt if any
    const existing = document.getElementById('pwaInstallPrompt');
    if (existing) existing.remove();
    
    console.log('Showing native install prompt');
    
    const prompt = document.createElement('div');
    prompt.id = 'pwaInstallPrompt';
    prompt.className = 'pwa-install-prompt';
    
    prompt.innerHTML = `
        <div class="pwa-install-content">
            <div class="pwa-install-icon">🕊️</div>
            <div class="pwa-install-text">
                <h3>Install MindHaven</h3>
                <p>Add MindHaven to your home screen for quick access to your mental wellness tools.</p>
            </div>
            <div class="pwa-install-actions">
                <button class="dismiss-btn" onclick="dismissInstallPrompt()">Not Now</button>
                <button class="install-btn" onclick="installPWA()">Install Now</button>
            </div>
            <button class="close-btn" onclick="dismissInstallPrompt()">×</button>
        </div>
    `;
    
    document.body.appendChild(prompt);
    
    // Animate in
    setTimeout(() => {
        prompt.classList.add('visible');
    }, 100);
}

function hideInstallPrompt() {
    const prompt = document.getElementById('pwaInstallPrompt');
    if (prompt) {
        prompt.classList.remove('visible');
        setTimeout(() => {
            prompt.remove();
        }, 300);
    }
}

function dismissInstallPrompt() {
    // Don't save dismissed state - allow popup to show again on next visit
    hideInstallPrompt();
}

// ============================================
// INSTALL ACTION
// ============================================

function installPWA() {
    if (!PWAInstall.deferredPrompt) {
        showGentleMessage('Installation prompt not available. Please use your browser\'s menu to install.');
        return;
    }
    
    PWAInstall.deferredPrompt.prompt();
    
    PWAInstall.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        PWAInstall.deferredPrompt = null;
    });
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.installPWA = installPWA;
window.dismissInstallPrompt = dismissInstallPrompt;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializePWAInstall();
});
