// ============================================
// MINDHAVEN - Gratitude Journal Module
// ============================================

// Gratitude State
const Gratitude = {
    entries: [],
    currentEntry: {
        thing1: '',
        thing2: '',
        thing3: '',
        note: ''
    },
    streak: 0,
    longestStreak: 0
};

// Initialize Gratitude Module
function initializeGratitude() {
    console.log('🙏 Initializing Gratitude Journal...');
    loadGratitudeData();
    setupGratitudeUI();
    updateGratitudeStreakDisplay();
    console.log('✅ Gratitude Journal initialized');
}

function updateGratitudeStreakDisplay() {
    const streakElement = document.getElementById('gratitudeStreak');
    const longestStreakElement = document.getElementById('gratitudeLongestStreak');
    
    if (streakElement) {
        streakElement.textContent = Gratitude.streak;
    }
    if (longestStreakElement) {
        longestStreakElement.textContent = Gratitude.longestStreak;
    }
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadGratitudeData() {
    // Load from localStorage
    const savedGratitude = localStorage.getItem('mindhaven_gratitude');
    if (savedGratitude) {
        const data = JSON.parse(savedGratitude);
        Gratitude.entries = data.entries || [];
        Gratitude.streak = data.streak || 0;
        Gratitude.longestStreak = data.longestStreak || 0;
    }
    
    // Also load from userData
    if (MindHaven.userData.gratitude) {
        Gratitude.entries = MindHaven.userData.gratitude.entries || [];
        Gratitude.streak = MindHaven.userData.gratitude.streak || 0;
        Gratitude.longestStreak = MindHaven.userData.gratitude.longestStreak || 0;
    }
}

function saveGratitudeData() {
    const data = {
        entries: Gratitude.entries,
        streak: Gratitude.streak,
        longestStreak: Gratitude.longestStreak
    };
    
    localStorage.setItem('mindhaven_gratitude', JSON.stringify(data));
    
    // Also save to userData
    MindHaven.userData.gratitude = data;
    saveUserData();
}

// ============================================
// GRATITUDE ENTRY
// ============================================

function saveGratitudeEntry() {
    const thing1 = document.getElementById('gratitude1')?.value.trim();
    const thing2 = document.getElementById('gratitude2')?.value.trim();
    const thing3 = document.getElementById('gratitude3')?.value.trim();
    const note = document.getElementById('gratitudeNote')?.value.trim();
    
    if (!thing1 || !thing2 || !thing3) {
        showGentleMessage('Please fill in all three things you\'re grateful for');
        return;
    }
    
    const entry = {
        id: generateId(),
        date: new Date().toISOString(),
        things: [thing1, thing2, thing3],
        note: note
    };
    
    Gratitude.entries.push(entry);
    
    // Update streak
    updateGratitudeStreak();
    
    saveGratitudeData();
    
    // Update streak display
    updateGratitudeStreakDisplay();
    
    // Clear form
    document.getElementById('gratitude1').value = '';
    document.getElementById('gratitude2').value = '';
    document.getElementById('gratitude3').value = '';
    document.getElementById('gratitudeNote').value = '';
    
    // Show confirmation
    showGentleMessage('Gratitude entry saved! Practicing gratitude helps shift focus to the positive.');
    
    // Update UI
    renderGratitudeHistory();
    
    // Check for achievements
    if (Gratitude.streak === 7) {
        unlockAchievement('grateful-week');
    }
    if (Gratitude.streak === 30) {
        unlockAchievement('grateful-month');
    }
}

function updateGratitudeStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if there's an entry for today
    const todayEntry = Gratitude.entries.find(e => 
        new Date(e.date).toDateString() === today
    );
    
    // Check if there's an entry for yesterday
    const yesterdayEntry = Gratitude.entries.find(e => 
        new Date(e.date).toDateString() === yesterday.toDateString()
    );
    
    if (todayEntry) {
        if (yesterdayEntry) {
            Gratitude.streak++;
        } else {
            // Check if this is the first entry or streak was broken
            const lastEntry = Gratitude.entries[Gratitude.entries.length - 2];
            if (lastEntry) {
                const lastEntryDate = new Date(lastEntry.date);
                const daysDiff = Math.floor((new Date(todayEntry.date) - lastEntryDate) / (1000 * 60 * 60 * 24));
                if (daysDiff === 1) {
                    Gratitude.streak++;
                } else if (daysDiff > 1) {
                    Gratitude.streak = 1;
                }
            } else {
                Gratitude.streak = 1;
            }
        }
        
        // Update longest streak
        if (Gratitude.streak > Gratitude.longestStreak) {
            Gratitude.longestStreak = Gratitude.streak;
        }
    }
}

// ============================================
// GRATITUDE HISTORY
// ============================================

function renderGratitudeHistory() {
    const historyContainer = document.getElementById('gratitudeHistoryList');
    if (!historyContainer) return;
    
    if (Gratitude.entries.length === 0) {
        historyContainer.innerHTML = '<p class="empty-state">No gratitude entries yet. Start by listing three things you\'re grateful for today!</p>';
        return;
    }
    
    // Show last 30 entries, most recent first
    const recentEntries = Gratitude.entries.slice(-30).reverse();
    
    historyContainer.innerHTML = recentEntries.map(entry => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
        
        return `
            <div class="gratitude-history-item">
                <div class="gratitude-history-date">${dateStr}</div>
                <ul class="gratitude-list">
                    <li>🙏 ${entry.things[0]}</li>
                    <li>🙏 ${entry.things[1]}</li>
                    <li>🙏 ${entry.things[2]}</li>
                </ul>
                ${entry.note ? `<div class="gratitude-history-note">${entry.note}</div>` : ''}
            </div>
        `;
    }).join('');
}

function toggleGratitudeHistory() {
    const historySection = document.getElementById('gratitudeHistory');
    const toggleBtn = document.querySelector('.gratitude-history-toggle');
    
    if (!historySection) return;
    
    if (historySection.style.display === 'none') {
        historySection.style.display = 'block';
        toggleBtn.textContent = 'Hide History';
        renderGratitudeHistory();
    } else {
        historySection.style.display = 'none';
        toggleBtn.textContent = 'View History';
    }
}

// ============================================
// GRATITUDE PROMPTS
// ============================================

const gratitudePrompts = [
    "What made you smile today?",
    "Who are you grateful to have in your life?",
    "What simple pleasure did you enjoy?",
    "What challenge revealed something to be grateful for?",
    "What about your body are you thankful for?",
    "What opportunity are you grateful for?",
    "What memory brings you joy?",
    "What skill or ability are you thankful for?",
    "What in nature are you grateful for?",
    "What comfort are you thankful for?"
];

function getRandomGratitudePrompt() {
    const randomIndex = Math.floor(Math.random() * gratitudePrompts.length);
    return gratitudePrompts[randomIndex];
}

function setGratitudePrompt() {
    const promptElement = document.getElementById('gratitudePrompt');
    if (promptElement) {
        promptElement.textContent = getRandomGratitudePrompt();
    }
}

// ============================================
// UI SETUP
// ============================================

function setupGratitudeUI() {
    // Add gratitude section to navigation if not present
    addGratitudeToNavigation();
    
    // Set initial prompt
    setGratitudePrompt();
}

function addGratitudeToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    // Check if already added
    if (document.querySelector('.nav-item[onclick*="gratitude"]')) return;
    
    const gratitudeItem = document.createElement('button');
    gratitudeItem.className = 'nav-item';
    gratitudeItem.setAttribute('onclick', "navigateTo('gratitude')");
    gratitudeItem.setAttribute('role', 'menuitem');
    gratitudeItem.textContent = '🙏 Gratitude';
    
    // Insert before crisis button
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(gratitudeItem, crisisBtn);
    } else {
        navMenu.appendChild(gratitudeItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.saveGratitudeEntry = saveGratitudeEntry;
window.toggleGratitudeHistory = toggleGratitudeHistory;
window.renderGratitudeHistory = renderGratitudeHistory;
window.getRandomGratitudePrompt = getRandomGratitudePrompt;
window.setGratitudePrompt = setGratitudePrompt;
window.updateGratitudeStreakDisplay = updateGratitudeStreakDisplay;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeGratitude();
});
