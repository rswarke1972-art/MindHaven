// ============================================
// MINDHAVEN - Daily Reflection Prompts Module
// ============================================

// Reflection State
const Reflection = {
    entries: [],
    currentPrompt: null,
    prompts: {
        morning: [
            'What are you grateful for this morning?',
            'What would make today a good day?',
            'How are you feeling right now?',
            'What is one thing you want to accomplish today?',
            'What self-care will you prioritize today?',
            'What are you looking forward to?',
            'How can you be kind to yourself today?',
            'What positive affirmation do you need to hear?'
        ],
        evening: [
            'What went well today?',
            'What challenged you today?',
            'What are you grateful for today?',
            'What did you learn today?',
            'How did you take care of yourself today?',
            'What made you smile today?',
            'What would you do differently today?',
            'What are you proud of today?'
        ],
        gratitude: [
            'Who made a positive difference in your life today?',
            'What simple pleasure did you enjoy?',
            'What about yourself are you thankful for?',
            'What challenge revealed something to be grateful for?',
            'What opportunity are you grateful for?'
        ],
        growth: [
            'What did you learn about yourself today?',
            'How did you grow today?',
            'What fear did you face today?',
            'What mistake taught you something valuable?',
            'How did you step out of your comfort zone?'
        ],
        calm: [
            'What brought you peace today?',
            'When did you feel most at ease?',
            'What helped you stay grounded?',
            'What moment of stillness did you experience?',
            'What calmed your mind today?'
        ]
    }
};

// Initialize Reflection Module
function initializeReflection() {
    console.log('📝 Initializing Daily Reflection Prompts...');
    loadReflectionData();
    setupReflectionUI();
    generateDailyPrompt();
    console.log('✅ Daily Reflection Prompts initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadReflectionData() {
    const savedData = localStorage.getItem('mindhaven_reflection');
    if (savedData) {
        Reflection.entries = JSON.parse(savedData);
    }
    
    // Also load from userData
    if (MindHaven.userData.reflection) {
        Reflection.entries = MindHaven.userData.reflection;
    }
}

function saveReflectionData() {
    localStorage.setItem('mindhaven_reflection', JSON.stringify(Reflection.entries));
    
    MindHaven.userData.reflection = Reflection.entries;
    saveUserData();
}

// ============================================
// PROMPT GENERATION
// ============================================

function generateDailyPrompt() {
    const hour = new Date().getHours();
    let category;
    
    if (hour < 12) {
        category = 'morning';
    } else if (hour < 18) {
        category = 'evening';
    } else {
        category = 'evening';
    }
    
    const prompts = Reflection.prompts[category];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    Reflection.currentPrompt = {
        category,
        text: prompts[randomIndex],
        date: new Date().toISOString()
    };
    
    renderDailyPrompt();
}

function getPromptByCategory(category) {
    const prompts = Reflection.prompts[category];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
}

function refreshPrompt() {
    generateDailyPrompt();
    showGentleMessage('New reflection prompt generated.');
}

// ============================================
// REFLECTION ENTRIES
// ============================================

function saveReflectionEntry() {
    const answer = document.getElementById('reflectionAnswer').value.trim();
    if (!answer) {
        showGentleMessage('Please write your reflection.');
        return;
    }
    
    const entry = {
        id: generateId(),
        date: new Date().toISOString(),
        prompt: Reflection.currentPrompt.text,
        category: Reflection.currentPrompt.category,
        answer,
        mood: getCurrentMood()
    };
    
    Reflection.entries.push(entry);
    saveReflectionData();
    
    document.getElementById('reflectionAnswer').value = '';
    showGentleMessage('Reflection saved. Thank you for taking time to reflect.');
    
    renderReflectionHistory();
    generateDailyPrompt();
}

function getCurrentMood() {
    const checkIns = MindHaven.userData.checkIns || [];
    if (checkIns.length > 0) {
        const latest = checkIns[checkIns.length - 1];
        return latest.mood || latest.moods ? latest.moods[0] : 'unknown';
    }
    return 'unknown';
}

function deleteReflectionEntry(id) {
    if (!confirm('Are you sure you want to delete this reflection?')) return;
    
    Reflection.entries = Reflection.entries.filter(e => e.id !== id);
    saveReflectionData();
    renderReflectionHistory();
    showGentleMessage('Reflection deleted.');
}

// ============================================
// UI RENDERING
// ============================================

function renderDailyPrompt() {
    const container = document.getElementById('dailyPrompt');
    if (!container) return;
    
    if (!Reflection.currentPrompt) {
        container.innerHTML = '<p class="empty-state">Loading prompt...</p>';
        return;
    }
    
    const categoryIcons = {
        morning: '🌅',
        evening: '🌙',
        gratitude: '🙏',
        growth: '🌱',
        calm: '🧘'
    };
    
    const icon = categoryIcons[Reflection.currentPrompt.category] || '💭';
    
    container.innerHTML = `
        <div class="prompt-card">
            <div class="prompt-header">
                <span class="prompt-icon">${icon}</span>
                <span class="prompt-category">${Reflection.currentPrompt.category}</span>
            </div>
            <div class="prompt-text">${Reflection.currentPrompt.text}</div>
            <div class="prompt-actions">
                <button class="secondary-btn" onclick="refreshPrompt()">🔄 New Prompt</button>
            </div>
        </div>
    `;
}

function renderReflectionHistory() {
    const container = document.getElementById('reflectionHistory');
    if (!container) return;
    
    if (Reflection.entries.length === 0) {
        container.innerHTML = '<p class="empty-state">No reflections yet. Start by answering today\'s prompt.</p>';
        return;
    }
    
    const sortedEntries = [...Reflection.entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    sortedEntries.forEach(entry => {
        const date = new Date(entry.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        const categoryIcons = {
            morning: '🌅',
            evening: '🌙',
            gratitude: '🙏',
            growth: '🌱',
            calm: '🧘'
        };
        
        const icon = categoryIcons[entry.category] || '💭';
        
        html += `
            <div class="reflection-entry-card">
                <div class="entry-header">
                    <span class="entry-date">${date}</span>
                    <button class="delete-btn" onclick="deleteReflectionEntry('${entry.id}')">🗑️</button>
                </div>
                <div class="entry-prompt">
                    <span class="prompt-icon">${icon}</span>
                    ${entry.prompt}
                </div>
                <div class="entry-answer">${entry.answer}</div>
                ${entry.mood && entry.mood !== 'unknown' ? `
                    <div class="entry-mood">Mood: ${entry.mood}</div>
                ` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// UI SETUP
// ============================================

function setupReflectionUI() {
    addReflectionToNavigation();
    renderDailyPrompt();
    renderReflectionHistory();
}

function addReflectionToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="reflection"]')) return;
    
    const reflectionItem = document.createElement('button');
    reflectionItem.className = 'nav-item';
    reflectionItem.setAttribute('onclick', "navigateTo('reflection')");
    reflectionItem.setAttribute('role', 'menuitem');
    reflectionItem.textContent = '📝 Reflect';
    
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(reflectionItem, crisisBtn);
    } else {
        navMenu.appendChild(reflectionItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.refreshPrompt = refreshPrompt;
window.saveReflectionEntry = saveReflectionEntry;
window.deleteReflectionEntry = deleteReflectionEntry;
window.renderDailyPrompt = renderDailyPrompt;
window.renderReflectionHistory = renderReflectionHistory;
window.getPromptByCategory = getPromptByCategory;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeReflection();
});
