// ============================================
// MINDHAVEN - Low Energy Mode Module
// ============================================

// Low Energy Mode State
const LowEnergy = {
    active: false,
    preferences: {
        simplifiedUI: true,
        reducedText: true,
        tinyGoals: true,
        shortPrompts: true,
        minimalAnimations: true
    },
    history: []
};

// Initialize Low Energy Mode
function initializeLowEnergy() {
    console.log('🔋 Initializing Low Energy Mode...');
    loadLowEnergyState();
    setupLowEnergyUI();
    console.log('✅ Low Energy Mode initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadLowEnergyState() {
    const savedState = localStorage.getItem('mindhaven_low_energy');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        LowEnergy.active = parsed.active || false;
        LowEnergy.preferences = { ...LowEnergy.preferences, ...parsed.preferences };
        LowEnergy.history = parsed.history || [];
    }
    
    // Apply state if active
    if (LowEnergy.active) {
        applyLowEnergyMode();
    }
}

function saveLowEnergyState() {
    const state = {
        active: LowEnergy.active,
        preferences: LowEnergy.preferences,
        history: LowEnergy.history
    };
    localStorage.setItem('mindhaven_low_energy', JSON.stringify(state));
    
    // Also save to userData for integration
    MindHaven.userData.lowEnergy = state;
    saveUserData();
}

// ============================================
// LOW ENERGY MODE TOGGLE
// ============================================

function toggleLowEnergyMode() {
    LowEnergy.active = !LowEnergy.active;
    
    if (LowEnergy.active) {
        activateLowEnergyMode();
    } else {
        deactivateLowEnergyMode();
    }
    
    saveLowEnergyState();
}

function activateLowEnergyMode() {
    // Log activation
    LowEnergy.history.push({
        timestamp: new Date().toISOString(),
        action: 'activated',
        mood: getCurrentMood()
    });
    
    // Apply UI changes
    applyLowEnergyMode();
    
    // Show gentle message
    showGentleMessage('Low Energy Mode activated. Take it easy today.');
    
    // Update UI toggle
    updateLowEnergyToggle();
}

function deactivateLowEnergyMode() {
    // Log deactivation
    LowEnergy.history.push({
        timestamp: new Date().toISOString(),
        action: 'deactivated'
    });
    
    // Remove UI changes
    removeLowEnergyMode();
    
    // Show gentle message
    showGentleMessage('Low Energy Mode deactivated. Welcome back.');
    
    // Update UI toggle
    updateLowEnergyToggle();
}

function getCurrentMood() {
    // Get current mood from check-in if available
    const checkIns = MindHaven.userData.checkIns || [];
    if (checkIns.length > 0) {
        const latest = checkIns[checkIns.length - 1];
        return latest.mood || latest.moods ? latest.moods[0] : 'unknown';
    }
    return 'unknown';
}

// ============================================
// UI APPLICATION
// ============================================

function applyLowEnergyMode() {
    document.body.classList.add('low-energy-mode');
    
    // Apply preferences
    if (LowEnergy.preferences.simplifiedUI) {
        simplifyUI();
    }
    
    if (LowEnergy.preferences.reducedText) {
        reduceText();
    }
    
    if (LowEnergy.preferences.minimalAnimations) {
        reduceAnimations();
    }
    
    // Add low energy banner
    showLowEnergyBanner();
}

function removeLowEnergyMode() {
    document.body.classList.remove('low-energy-mode');
    
    // Remove simplifications
    removeSimplifiedUI();
    removeReducedText();
    removeReducedAnimations();
    
    // Hide banner
    hideLowEnergyBanner();
}

function simplifyUI() {
    // Hide non-essential elements
    const elementsToHide = [
        '.quick-access-card',
        '.weather-card',
        '.encouragement-card',
        '.achievements-section',
        '.insights-section',
        '.gratitude-streak-card',
        '.gratitude-prompt-card',
        '.mood-stats-card',
        '.progress-dashboard-card',
        '.checkin-customization-card'
    ];
    
    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('low-energy-hidden');
        });
    });
    
    // Simplify mood selector
    const moodSelector = document.getElementById('moodSelector');
    if (moodSelector) {
        moodSelector.classList.add('low-energy-simplified');
    }
    
    // Simplify gratitude inputs - show only one field
    const gratitudeInputs = document.querySelectorAll('.gratitude-input-group');
    if (gratitudeInputs.length > 1) {
        gratitudeInputs.forEach((input, index) => {
            if (index > 0) {
                input.classList.add('low-energy-hidden');
            }
        });
    }
    
    // Simplify check-in questions - show only first
    const checkinQuestions = document.querySelectorAll('.question-content');
    if (checkinQuestions.length > 1) {
        checkinQuestions.forEach((question, index) => {
            if (index > 0) {
                question.classList.add('low-energy-hidden');
            }
        });
    }
}

function removeSimplifiedUI() {
    const elementsToRestore = [
        '.quick-access-card',
        '.weather-card',
        '.encouragement-card',
        '.achievements-section',
        '.insights-section',
        '.gratitude-streak-card',
        '.gratitude-prompt-card',
        '.mood-stats-card',
        '.progress-dashboard-card',
        '.checkin-customization-card'
    ];
    
    elementsToRestore.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.remove('low-energy-hidden');
        });
    });
    
    const moodSelector = document.getElementById('moodSelector');
    if (moodSelector) {
        moodSelector.classList.remove('low-energy-simplified');
    }
    
    // Restore gratitude inputs
    const gratitudeInputs = document.querySelectorAll('.gratitude-input-group');
    gratitudeInputs.forEach(input => {
        input.classList.remove('low-energy-hidden');
    });
    
    // Restore check-in questions
    const checkinQuestions = document.querySelectorAll('.question-content');
    checkinQuestions.forEach(question => {
        question.classList.remove('low-energy-hidden');
    });
}

function reduceText() {
    // Add class for reduced text
    document.body.classList.add('low-energy-text');
}

function removeReducedText() {
    document.body.classList.remove('low-energy-text');
}

function reduceAnimations() {
    document.body.classList.add('low-energy-animations');
}

function removeReducedAnimations() {
    document.body.classList.remove('low-energy-animations');
}

// ============================================
// LOW ENERGY BANNER
// ============================================

function showLowEnergyBanner() {
    // Remove existing banner if present
    hideLowEnergyBanner();
    
    const banner = document.createElement('div');
    banner.id = 'lowEnergyBanner';
    banner.className = 'low-energy-banner';
    banner.innerHTML = `
        <div class="low-energy-banner-content">
            <span class="low-energy-icon">🔋</span>
            <span class="low-energy-text">Low Energy Mode Active</span>
            <button class="low-energy-close" onclick="toggleLowEnergyMode()" aria-label="Exit Low Energy Mode">✕</button>
        </div>
    `;
    
    document.body.appendChild(banner);
}

function hideLowEnergyBanner() {
    const banner = document.getElementById('lowEnergyBanner');
    if (banner) {
        banner.remove();
    }
}

// ============================================
// LOW ENERGY SUGGESTIONS
// ============================================

function getLowEnergySuggestions() {
    return [
        {
            icon: '💧',
            text: 'Drink water',
            tiny: true
        },
        {
            icon: '🌤',
            text: 'Open a window',
            tiny: true
        },
        {
            icon: '🛋',
            text: 'Sit down for 2 minutes',
            tiny: true
        },
        {
            icon: '📱',
            text: 'Put phone down for 5 minutes',
            tiny: true
        },
        {
            icon: '🫁',
            text: 'Take 3 deep breaths',
            tiny: true
        }
    ];
}

function getLowEnergyJournalPrompts() {
    return [
        'One thing that\'s okay right now:',
        'Something small that helped:',
        'What would feel gentle?',
        'A tiny win from today:',
        'What do you need right now?'
    ];
}

function getLowEnergyGoals() {
    return [
        'Open notes for 5 minutes',
        'Drink one glass of water',
        'Text one person',
        'Step outside for 2 minutes',
        'Write one sentence',
        'Do one stretching exercise',
        'Put on comfortable clothes',
        'Eat something nourishing'
    ];
}

// ============================================
// PREFERENCES MANAGEMENT
// ============================================

function updateLowEnergyPreference(preference, value) {
    LowEnergy.preferences[preference] = value;
    
    if (LowEnergy.active) {
        // Re-apply mode with new preferences
        removeLowEnergyMode();
        applyLowEnergyMode();
    }
    
    saveLowEnergyState();
}

// ============================================
// UI SETUP
// ============================================

function setupLowEnergyUI() {
    // Add low energy toggle to settings if not present
    addLowEnergyToggleToSettings();
    
    // Add quick toggle to dashboard
    addLowEnergyQuickToggle();
}

function addLowEnergyToggleToSettings() {
    const settingsCard = document.querySelector('.settings-card');
    if (!settingsCard) return;
    
    // Check if already added
    if (document.getElementById('lowEnergySetting')) return;
    
    const settingItem = document.createElement('div');
    settingItem.className = 'setting-item';
    settingItem.id = 'lowEnergySetting';
    settingItem.innerHTML = `
        <div class="setting-info">
            <h3>Low Energy Mode</h3>
            <p>Simplified interface for difficult days</p>
        </div>
        <button class="toggle-btn ${LowEnergy.active ? 'active' : ''}" onclick="toggleLowEnergyMode()" id="lowEnergyToggle" aria-label="Toggle Low Energy Mode">
            <span class="toggle-slider"></span>
        </button>
    `;
    
    settingsCard.appendChild(settingItem);
}

function addLowEnergyQuickToggle() {
    const dashboardSection = document.getElementById('dashboard-section');
    if (!dashboardSection) return;
    
    // Check if already added
    if (document.getElementById('lowEnergyQuickToggle')) return;
    
    const checkinCard = document.querySelector('.checkin-card');
    if (!checkinCard) return;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'lowEnergyQuickToggle';
    toggleBtn.className = 'low-energy-quick-toggle';
    toggleBtn.onclick = toggleLowEnergyMode;
    toggleBtn.setAttribute('aria-label', 'Toggle Low Energy Mode');
    toggleBtn.innerHTML = '🔋 Low Energy';
    
    checkinCard.appendChild(toggleBtn);
}

function updateLowEnergyToggle() {
    const toggle = document.getElementById('lowEnergyToggle');
    if (toggle) {
        if (LowEnergy.active) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }
    }
    
    const quickToggle = document.getElementById('lowEnergyQuickToggle');
    if (quickToggle) {
        if (LowEnergy.active) {
            quickToggle.classList.add('active');
            quickToggle.innerHTML = '🔋 Low Energy ON';
        } else {
            quickToggle.classList.remove('active');
            quickToggle.innerHTML = '🔋 Low Energy';
        }
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.toggleLowEnergyMode = toggleLowEnergyMode;
window.activateLowEnergyMode = activateLowEnergyMode;
window.deactivateLowEnergyMode = deactivateLowEnergyMode;
window.getLowEnergySuggestions = getLowEnergySuggestions;
window.getLowEnergyJournalPrompts = getLowEnergyJournalPrompts;
window.getLowEnergyGoals = getLowEnergyGoals;
window.updateLowEnergyPreference = updateLowEnergyPreference;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeLowEnergy();
});
