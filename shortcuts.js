// ============================================
// MINDHAVEN - Keyboard Shortcuts Module
// ============================================

// Keyboard Shortcuts State
const Shortcuts = {
    enabled: true,
    shortcuts: {
        // Navigation
        'Alt+H': { action: () => navigateTo('dashboard'), description: 'Go to Home' },
        'Alt+G': { action: () => navigateTo('gratitude'), description: 'Go to Gratitude' },
        'Alt+J': { action: () => navigateTo('journal'), description: 'Go to Journal' },
        'Alt+B': { action: () => navigateTo('breathing'), description: 'Go to Breathing' },
        'Alt+C': { action: () => navigateTo('cbt'), description: 'Go to CBT' },
        'Alt+T': { action: () => navigateTo('triggers'), description: 'Go to Triggers' },
        'Alt+S': { action: () => navigateTo('sleep'), description: 'Go to Sleep' },
        'Alt+R': { action: () => navigateTo('reflection'), description: 'Go to Reflection' },
        'Alt+I': { action: () => navigateTo('insights'), description: 'Go to Insights' },
        'Alt+P': { action: () => navigateTo('settings'), description: 'Go to Settings' },
        
        // Actions
        'Alt+N': { action: () => startNewGratitudeEntry(), description: 'New Gratitude Entry' },
        'Alt+K': { action: () => startNewJournalEntry(), description: 'New Journal Entry' },
        'Alt+L': { action: () => startNewBreathingExercise(), description: 'Start Breathing Exercise' },
        'Alt+M': { action: () => startNewThoughtRecord(), description: 'New CBT Thought Record' },
        'Alt+O': { action: () => toggleNavMenu(), description: 'Toggle Navigation Menu' },
        
        // System
        'Alt+D': { action: () => toggleDarkMode(), description: 'Toggle Dark Mode' },
        'Alt+Q': { action: () => toggleLowEnergyMode(), description: 'Toggle Low Energy Mode' },
        'Alt+?': { action: () => showShortcutsModal(), description: 'Show Keyboard Shortcuts' },
        'Escape': { action: () => closeAllModals(), description: 'Close All Modals' }
    }
};

// Initialize Keyboard Shortcuts Module
function initializeShortcuts() {
    console.log('⌨️ Initializing Keyboard Shortcuts...');
    loadShortcutsSettings();
    setupKeyboardListeners();
    updateShortcutsUI();
    console.log('✅ Keyboard Shortcuts initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadShortcutsSettings() {
    const saved = localStorage.getItem('mindhaven_shortcuts_enabled');
    if (saved !== null) {
        Shortcuts.enabled = JSON.parse(saved);
    }
    
    // Also check settings
    if (MindHaven.settings.keyboardShortcuts !== undefined) {
        Shortcuts.enabled = MindHaven.settings.keyboardShortcuts;
    }
}

function saveShortcutsSettings() {
    localStorage.setItem('mindhaven_shortcuts_enabled', JSON.stringify(Shortcuts.enabled));
    
    MindHaven.settings.keyboardShortcuts = Shortcuts.enabled;
    saveSettings();
}

// ============================================
// KEYBOARD LISTENERS
// ============================================

function setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
        if (!Shortcuts.enabled) return;
        
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }
        
        const key = e.key;
        const altKey = e.altKey;
        const ctrlKey = e.ctrlKey;
        const shiftKey = e.shiftKey;
        
        // Build shortcut key string
        let shortcut = '';
        if (altKey) shortcut += 'Alt+';
        if (ctrlKey) shortcut += 'Ctrl+';
        if (shiftKey) shortcut += 'Shift+';
        shortcut += key;
        
        // Check if this shortcut is registered
        if (Shortcuts.shortcuts[shortcut]) {
            e.preventDefault();
            Shortcuts.shortcuts[shortcut].action();
            showGentleMessage(`Shortcut: ${Shortcuts.shortcuts[shortcut].description}`);
        }
    });
}

// ============================================
// SHORTCUT ACTIONS
// ============================================

function toggleShortcuts() {
    Shortcuts.enabled = !Shortcuts.enabled;
    saveShortcutsSettings();
    updateShortcutsUI();
    
    if (Shortcuts.enabled) {
        showGentleMessage('Keyboard shortcuts enabled. Press Alt+? to see all shortcuts.');
    } else {
        showGentleMessage('Keyboard shortcuts disabled.');
    }
}

function updateShortcutsUI() {
    const toggle = document.getElementById('shortcutsToggle');
    if (!toggle) return;
    
    if (Shortcuts.enabled) {
        toggle.classList.add('active');
    } else {
        toggle.classList.remove('active');
    }
}

function showShortcutsModal() {
    const modal = document.createElement('div');
    modal.id = 'shortcutsModal';
    modal.className = 'shortcuts-modal';
    
    let shortcutsHTML = '';
    Object.entries(Shortcuts.shortcuts).forEach(([key, shortcut]) => {
        shortcutsHTML += `
            <div class="shortcut-item">
                <span class="shortcut-key">${key}</span>
                <span class="shortcut-description">${shortcut.description}</span>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>⌨️ Keyboard Shortcuts</h2>
                <button class="close-btn" onclick="closeShortcutsModal()">×</button>
            </div>
            <div class="shortcuts-list">
                ${shortcutsHTML}
            </div>
            <div class="modal-footer">
                <p class="note">Note: Shortcuts don't work when typing in input fields.</p>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        padding: 20px;
    `;
    
    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        background: var(--bg-card);
        padding: 32px;
        border-radius: 16px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(modal);
}

function closeShortcutsModal() {
    const modal = document.getElementById('shortcutsModal');
    if (modal) modal.remove();
}

function closeAllModals() {
    // Close all modals
    const modals = document.querySelectorAll('[id$="Modal"]');
    modals.forEach(modal => modal.remove());
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.toggleShortcuts = toggleShortcuts;
window.updateShortcutsUI = updateShortcutsUI;
window.showShortcutsModal = showShortcutsModal;
window.closeShortcutsModal = closeShortcutsModal;
window.closeAllModals = closeAllModals;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeShortcuts();
});
