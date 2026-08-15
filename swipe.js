// ============================================
// MINDHAVEN - Swipe Navigation Module
// ============================================

// Swipe Navigation State
const SwipeNav = {
    enabled: true,
    startX: 0,
    startY: 0,
    threshold: 100, // Minimum swipe distance
    sections: [
        'dashboard',
        'gratitude',
        'journal',
        'breathing',
        'cbt',
        'triggers',
        'sleep',
        'reflection',
        'recommendations',
        'resources',
        'insights',
        'settings'
    ],
    currentIndex: 0
};

// Initialize Swipe Navigation Module
function initializeSwipeNav() {
    console.log('👆 Initializing Swipe Navigation...');
    loadSwipeNavSettings();
    setupSwipeListeners();
    updateSwipeNavUI();
    console.log('✅ Swipe Navigation initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadSwipeNavSettings() {
    const saved = localStorage.getItem('mindhaven_swipe_enabled');
    if (saved !== null) {
        SwipeNav.enabled = JSON.parse(saved);
    }
    
    // Also check settings
    if (MindHaven.settings.swipeNavigation !== undefined) {
        SwipeNav.enabled = MindHaven.settings.swipeNavigation;
    }
}

function saveSwipeNavSettings() {
    localStorage.setItem('mindhaven_swipe_enabled', JSON.stringify(SwipeNav.enabled));
    
    MindHaven.settings.swipeNavigation = SwipeNav.enabled;
    saveSettings();
}

// ============================================
// SWIPE LISTENERS
// ============================================

function setupSwipeListeners() {
    if (!SwipeNav.enabled) return;
    
    const app = document.getElementById('app');
    if (!app) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    app.addEventListener('touchstart', (e) => {
        if (!SwipeNav.enabled) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    app.addEventListener('touchend', (e) => {
        if (!SwipeNav.enabled) return;
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    }, { passive: true });
}

function handleSwipe(startX, startY, endX, endY) {
    const diffX = endX - startX;
    const diffY = endY - startY;
    
    // Check if swipe is horizontal enough
    if (Math.abs(diffX) < SwipeNav.threshold) return;
    
    // Check if swipe is more horizontal than vertical
    if (Math.abs(diffY) > Math.abs(diffX)) return;
    
    // Determine swipe direction
    if (diffX > 0) {
        // Swipe right - go to previous section
        navigateToPreviousSection();
    } else {
        // Swipe left - go to next section
        navigateToNextSection();
    }
}

// ============================================
// NAVIGATION
// ============================================

function getCurrentSectionIndex() {
    const currentSection = document.querySelector('.section.active');
    if (!currentSection) return 0;
    
    const sectionId = currentSection.id.replace('-section', '');
    const index = SwipeNav.sections.indexOf(sectionId);
    return index >= 0 ? index : 0;
}

function navigateToNextSection() {
    const currentIndex = getCurrentSectionIndex();
    const nextIndex = (currentIndex + 1) % SwipeNav.sections.length;
    navigateTo(SwipeNav.sections[nextIndex]);
    
    showSwipeIndicator('left');
}

function navigateToPreviousSection() {
    const currentIndex = getCurrentSectionIndex();
    const prevIndex = currentIndex === 0 ? SwipeNav.sections.length - 1 : currentIndex - 1;
    navigateTo(SwipeNav.sections[prevIndex]);
    
    showSwipeIndicator('right');
}

function showSwipeIndicator(direction) {
    const indicator = document.createElement('div');
    indicator.className = `swipe-indicator swipe-${direction}`;
    indicator.innerHTML = direction === 'left' ? '→' : '←';
    
    indicator.style.cssText = `
        position: fixed;
        top: 50%;
        ${direction === 'left' ? 'right: 20px;' : 'left: 20px;'}
        transform: translateY(-50%);
        font-size: 3rem;
        color: var(--accent-primary);
        opacity: 0;
        animation: swipeFade 0.5s ease;
        z-index: 5000;
        pointer-events: none;
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.remove();
    }, 500);
}

// ============================================
// SETTINGS
// ============================================

function toggleSwipeNav() {
    SwipeNav.enabled = !SwipeNav.enabled;
    saveSwipeNavSettings();
    updateSwipeNavUI();
    
    if (SwipeNav.enabled) {
        setupSwipeListeners();
        showGentleMessage('Swipe navigation enabled. Swipe left/right to navigate.');
    } else {
        showGentleMessage('Swipe navigation disabled.');
    }
}

function updateSwipeNavUI() {
    const toggle = document.getElementById('swipeNavToggle');
    if (!toggle) return;
    
    if (SwipeNav.enabled) {
        toggle.classList.add('active');
    } else {
        toggle.classList.remove('active');
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.toggleSwipeNav = toggleSwipeNav;
window.updateSwipeNavUI = updateSwipeNavUI;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeSwipeNav();
});
