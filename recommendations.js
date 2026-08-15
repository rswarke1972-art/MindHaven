// ============================================
// MINDHAVEN - Personalized Recommendations Module
// ============================================

// Recommendations State
const Recommendations = {
    currentRecommendations: [],
    dismissed: []
};

// Initialize Recommendations Module
function initializeRecommendations() {
    console.log('💡 Initializing Personalized Recommendations...');
    loadDismissedRecommendations();
    setupRecommendationsUI();
    generateRecommendations();
    console.log('✅ Personalized Recommendations initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadDismissedRecommendations() {
    const savedData = localStorage.getItem('mindhaven_dismissed_recommendations');
    if (savedData) {
        Recommendations.dismissed = JSON.parse(savedData);
    }
}

function saveDismissedRecommendations() {
    localStorage.setItem('mindhaven_dismissed_recommendations', JSON.stringify(Recommendations.dismissed));
}

// ============================================
// RECOMMENDATION GENERATION
// ============================================

function generateRecommendations() {
    Recommendations.currentRecommendations = [];
    
    // Analyze mood patterns
    analyzeMoodPatterns();
    
    // Analyze sleep patterns
    analyzeSleepPatterns();
    
    // Analyze trigger patterns
    analyzeTriggerPatterns();
    
    // Analyze activity patterns
    analyzeActivityPatterns();
    
    // Generate general wellness recommendations
    generateWellnessRecommendations();
    
    renderRecommendations();
}

function analyzeMoodPatterns() {
    const checkIns = MindHaven.userData.checkIns || [];
    if (checkIns.length < 3) return;
    
    const recentMoods = checkIns.slice(-7).map(c => c.mood || c.moods?.[0]);
    const negativeMoods = ['anxious', 'sad', 'stressed', 'overwhelmed', 'angry', 'frustrated'];
    
    const negativeCount = recentMoods.filter(m => negativeMoods.includes(m)).length;
    
    if (negativeCount >= 4) {
        addRecommendation({
            type: 'mood',
            priority: 'high',
            title: 'Consider a Breathing Exercise',
            description: 'You\'ve been feeling stressed lately. Try a guided breathing exercise to help calm your mind.',
            action: 'navigateTo(\'breathing\')',
            icon: '🌬️'
        });
    }
    
    if (negativeCount >= 3) {
        addRecommendation({
            type: 'mood',
            priority: 'medium',
            title: 'Practice Gratitude',
            description: 'Taking time to appreciate the good things can help shift your perspective.',
            action: 'navigateTo(\'gratitude\')',
            icon: '🙏'
        });
    }
}

function analyzeSleepPatterns() {
    const sleepRecords = MindHaven.userData.sleep || [];
    if (sleepRecords.length < 3) return;
    
    const recentSleep = sleepRecords.slice(-7);
    const avgQuality = recentSleep.reduce((sum, r) => sum + r.sleepQuality, 0) / recentSleep.length;
    const avgHours = recentSleep.reduce((sum, r) => sum + r.hoursSlept, 0) / recentSleep.length;
    
    if (avgQuality < 5) {
        addRecommendation({
            type: 'sleep',
            priority: 'high',
            title: 'Improve Your Sleep Quality',
            description: 'Your sleep quality has been below average. Consider establishing a bedtime routine and reducing screen time before bed.',
            action: 'navigateTo(\'sleep\')',
            icon: '😴'
        });
    }
    
    if (avgHours < 6) {
        addRecommendation({
            type: 'sleep',
            priority: 'medium',
            title: 'Get More Rest',
            description: 'You\'re averaging less than 6 hours of sleep. Aim for 7-9 hours for better mental health.',
            action: 'navigateTo(\'sleep\')',
            icon: '😴'
        });
    }
}

function analyzeTriggerPatterns() {
    const triggers = MindHaven.userData.triggers || [];
    if (triggers.length < 3) return;
    
    const recentTriggers = triggers.slice(-10);
    const severitySum = recentTriggers.reduce((sum, t) => sum + t.severity, 0);
    const avgSeverity = severitySum / recentTriggers.length;
    
    if (avgSeverity >= 4) {
        addRecommendation({
            type: 'trigger',
            priority: 'high',
            title: 'Work on Coping Strategies',
            description: 'Your triggers have been severe lately. Consider using CBT techniques to develop better coping mechanisms.',
            action: 'navigateTo(\'cbt\')',
            icon: '🧠'
        });
    }
    
    const categoryCounts = {};
    recentTriggers.forEach(t => {
        categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });
    
    const mostCommon = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
    if (mostCommon && mostCommon[1] >= 3) {
        const categoryNames = {
            social: 'social situations',
            work: 'work/school',
            health: 'health concerns',
            financial: 'financial stress',
            relationship: 'relationship issues',
            environment: 'your environment',
            internal: 'internal thoughts',
            other: 'various factors'
        };
        
        addRecommendation({
            type: 'trigger',
            priority: 'medium',
            title: 'Address Your Triggers',
            description: `You've been frequently triggered by ${categoryNames[mostCommon[0]] || mostCommon[0]}. Consider what strategies might help in these situations.`,
            action: 'navigateTo(\'triggers\')',
            icon: '🎯'
        });
    }
}

function analyzeActivityPatterns() {
    const gratitude = MindHaven.userData.gratitude || [];
    const journal = MindHaven.userData.journalEntries || [];
    const checkIns = MindHaven.userData.checkIns || [];
    
    const lastGratitude = gratitude.length > 0 ? new Date(gratitude[gratitude.length - 1].date) : null;
    const lastJournal = journal.length > 0 ? new Date(journal[journal.length - 1].date) : null;
    const lastCheckIn = checkIns.length > 0 ? new Date(checkIns[checkIns.length - 1].date) : null;
    
    const now = new Date();
    const daysSinceGratitude = lastGratitude ? Math.floor((now - lastGratitude) / (1000 * 60 * 60 * 24)) : 999;
    const daysSinceJournal = lastJournal ? Math.floor((now - lastJournal) / (1000 * 60 * 60 * 24)) : 999;
    const daysSinceCheckIn = lastCheckIn ? Math.floor((now - lastCheckIn) / (1000 * 60 * 60 * 24)) : 999;
    
    if (daysSinceGratitude >= 3) {
        addRecommendation({
            type: 'activity',
            priority: 'low',
            title: 'Practice Gratitude',
            description: `It's been ${daysSinceGratitude} days since your last gratitude entry. Taking time to appreciate the good things can boost your mood.`,
            action: 'navigateTo(\'gratitude\')',
            icon: '🙏'
        });
    }
    
    if (daysSinceJournal >= 3) {
        addRecommendation({
            type: 'activity',
            priority: 'low',
            title: 'Write in Your Journal',
            description: `It's been ${daysSinceJournal} days since your last journal entry. Writing can help process your thoughts and emotions.`,
            action: 'navigateTo(\'journal\')',
            icon: '📝'
        });
    }
    
    if (daysSinceCheckIn >= 2) {
        addRecommendation({
            type: 'activity',
            priority: 'medium',
            title: 'Complete Your Daily Check-In',
            description: `It's been ${daysSinceCheckIn} days since your last check-in. Regular check-ins help track your emotional patterns.`,
            action: 'navigateTo(\'dashboard\')',
            icon: '📊'
        });
    }
}

function generateWellnessRecommendations() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
        addRecommendation({
            type: 'wellness',
            priority: 'low',
            title: 'Morning Mindfulness',
            description: 'Start your day with intention. Try a breathing exercise or journaling to set a positive tone.',
            action: 'navigateTo(\'breathing\')',
            icon: '🌅'
        });
    } else if (hour >= 18) {
        addRecommendation({
            type: 'wellness',
            priority: 'low',
            title: 'Evening Reflection',
            description: 'Take a moment to reflect on your day. What went well? What are you grateful for?',
            action: 'navigateTo(\'reflection\')',
            icon: '🌙'
        });
    }
}

function addRecommendation(recommendation) {
    const id = generateId();
    const recWithId = { ...recommendation, id, date: new Date().toISOString() };
    
    // Check if already dismissed
    if (Recommendations.dismissed.includes(id)) return;
    
    // Check for duplicates
    const isDuplicate = Recommendations.currentRecommendations.some(r => 
        r.type === recWithId.type && r.title === recWithId.title
    );
    
    if (!isDuplicate) {
        Recommendations.currentRecommendations.push(recWithId);
    }
}

// ============================================
// UI RENDERING
// ============================================

function renderRecommendations() {
    const container = document.getElementById('recommendationsList');
    if (!container) return;
    
    if (Recommendations.currentRecommendations.length === 0) {
        container.innerHTML = '<p class="empty-state">No recommendations at the moment. Keep tracking your activities to receive personalized suggestions.</p>';
        return;
    }
    
    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sorted = [...Recommendations.currentRecommendations].sort((a, b) => 
        priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    
    let html = '';
    sorted.forEach(rec => {
        const priorityColors = {
            high: '#E57373',
            medium: '#FFB74D',
            low: '#A8C3A1'
        };
        
        html += `
            <div class="recommendation-card" style="border-left: 4px solid ${priorityColors[rec.priority]}">
                <div class="recommendation-header">
                    <span class="recommendation-icon">${rec.icon}</span>
                    <span class="recommendation-priority">${rec.priority}</span>
                    <button class="dismiss-btn" onclick="dismissRecommendation('${rec.id}')">✕</button>
                </div>
                <h3 class="recommendation-title">${rec.title}</h3>
                <p class="recommendation-description">${rec.description}</p>
                <button class="primary-btn" onclick="${rec.action}">Take Action</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function dismissRecommendation(id) {
    Recommendations.dismissed.push(id);
    saveDismissedRecommendations();
    
    Recommendations.currentRecommendations = Recommendations.currentRecommendations.filter(r => r.id !== id);
    renderRecommendations();
    
    showGentleMessage('Recommendation dismissed.');
}

function refreshRecommendations() {
    Recommendations.dismissed = [];
    saveDismissedRecommendations();
    generateRecommendations();
    showGentleMessage('Recommendations refreshed.');
}

// ============================================
// UI SETUP
// ============================================

function setupRecommendationsUI() {
    addRecommendationsToNavigation();
    renderRecommendations();
}

function addRecommendationsToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="recommendations"]')) return;
    
    const recommendationsItem = document.createElement('button');
    recommendationsItem.className = 'nav-item';
    recommendationsItem.setAttribute('onclick', "navigateTo('recommendations')");
    recommendationsItem.setAttribute('role', 'menuitem');
    recommendationsItem.textContent = '💡 Tips';
    
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(recommendationsItem, crisisBtn);
    } else {
        navMenu.appendChild(recommendationsItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.dismissRecommendation = dismissRecommendation;
window.refreshRecommendations = refreshRecommendations;
window.renderRecommendations = renderRecommendations;
window.generateRecommendations = generateRecommendations;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeRecommendations();
});
