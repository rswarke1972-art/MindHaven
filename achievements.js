// ============================================
// MINDHAVEN - Gentle Achievement System
// ============================================

// Achievement Definitions
const achievementDefinitions = {
    'first-step': {
        id: 'first-step',
        icon: '🌱',
        title: 'First Step',
        description: 'Complete your first check-in',
        category: 'check-in'
    },
    'hydrated-heart': {
        id: 'hydrated-heart',
        icon: '💧',
        title: 'Hydrated Heart',
        description: 'Complete a hydration suggestion',
        category: 'self-care'
    },
    'grounded': {
        id: 'grounded',
        icon: '🧠',
        title: 'Grounded',
        description: 'Try a grounding exercise',
        category: 'coping'
    },
    'first-reflection': {
        id: 'first-reflection',
        icon: '📔',
        title: 'First Reflection',
        description: 'Write your first journal entry',
        category: 'journal'
    },
    'rested': {
        id: 'rested',
        icon: '🌙',
        title: 'Rested',
        description: 'Use calm space',
        category: 'self-care'
    },
    '7-day-streak': {
        id: '7-day-streak',
        icon: '🌱',
        title: '7-Day Streak',
        description: 'Visit MindHaven 7 days in a row',
        category: 'consistency'
    },
    'connected': {
        id: 'connected',
        icon: '🫶',
        title: 'Connected',
        description: 'Reach out to someone',
        category: 'social'
    },
    'peaceful-mind': {
        id: 'peaceful-mind',
        icon: '🧘',
        title: 'Peaceful Mind',
        description: 'Use 5 different coping tools',
        category: 'coping'
    },
    'consistent-checker': {
        id: 'consistent-checker',
        icon: '📊',
        title: 'Consistent Checker',
        description: 'Complete 7 check-ins',
        category: 'check-in'
    },
    'journal-keeper': {
        id: 'journal-keeper',
        icon: '📔',
        title: 'Journal Keeper',
        description: 'Write 5 journal entries',
        category: 'journal'
    },
    'breathing-master': {
        id: 'breathing-master',
        icon: '🫁',
        title: 'Breathing Master',
        description: 'Complete 10 breathing exercises',
        category: 'coping'
    },
    '30-day-streak': {
        id: '30-day-streak',
        icon: '🌟',
        title: '30-Day Streak',
        description: 'Visit MindHaven 30 days in a row',
        category: 'consistency'
    },
    // NEW: Low Energy Mode achievements
    'low-energy-start': {
        id: 'low-energy-start',
        icon: '🔋',
        title: 'Energy Saver',
        description: 'Use low energy mode for the first time',
        category: 'self-care'
    },
    'low-energy-streak': {
        id: 'low-energy-streak',
        icon: '🔋',
        title: 'Conservative Energy',
        description: 'Use low energy mode 5 times',
        category: 'self-care'
    },
    // NEW: Emergency Support achievements
    'emergency-prepared': {
        id: 'emergency-prepared',
        icon: '🆘',
        title: 'Prepared',
        description: 'Complete an emergency support flow',
        category: 'safety'
    },
    // NEW: Assessment achievements
    'first-assessment': {
        id: 'first-assessment',
        icon: '📊',
        title: 'Self-Aware',
        description: 'Complete your first life assessment',
        category: 'growth'
    },
    'assessment-tracker': {
        id: 'assessment-tracker',
        icon: '📈',
        title: 'Growth Tracker',
        description: 'Complete 3 life assessments',
        category: 'growth'
    },
    // NEW: Goal achievements
    'first-goal': {
        id: 'first-goal',
        icon: '🎯',
        title: 'Goal Setter',
        description: 'Create your first goal',
        category: 'growth'
    },
    'goal-achiever': {
        id: 'goal-achiever',
        icon: '🏆',
        title: 'Goal Achiever',
        description: 'Complete 3 goals',
        category: 'growth'
    },
    'habit-builder': {
        id: 'habit-builder',
        icon: '🔥',
        title: 'Habit Builder',
        description: 'Reach a 7-day habit streak',
        category: 'growth'
    },
    // NEW: Decision achievements
    'first-decision': {
        id: 'first-decision',
        icon: '🤔',
        title: 'Decisive',
        description: 'Use a decision framework',
        category: 'growth'
    },
    'decision-maker': {
        id: 'decision-maker',
        icon: '⚖️',
        title: 'Decision Maker',
        description: 'Complete 5 decisions',
        category: 'growth'
    },
    // NEW: Guided Journal achievements
    'guided-journey': {
        id: 'guided-journey',
        icon: '📔',
        title: 'Guided Journey',
        description: 'Complete a guided journal pathway',
        category: 'journal'
    },
    'grateful-heart': {
        id: 'grateful-heart',
        icon: '🙏',
        title: 'Grateful Heart',
        description: 'Use the gratitude pathway 3 times',
        category: 'journal'
    },
    // NEW: Student achievements
    'study-session': {
        id: 'study-session',
        icon: '📚',
        title: 'Focused Study',
        description: 'Complete a study session',
        category: 'growth'
    },
    'study-streak': {
        id: 'study-streak',
        icon: '🎓',
        title: 'Dedicated Student',
        description: 'Complete 5 study sessions',
        category: 'growth'
    },
    // NEW: Support Circle achievements
    'support-builder': {
        id: 'support-builder',
        icon: '🫂',
        title: 'Support Builder',
        description: 'Add your first support contact',
        category: 'social'
    },
    'circle-complete': {
        id: 'circle-complete',
        icon: '👥',
        title: 'Circle Complete',
        description: 'Add 5 support contacts',
        category: 'social'
    },
    // NEW: Safety Plan achievements
    'safety-planner': {
        id: 'safety-planner',
        icon: '🛡️',
        title: 'Safety Planner',
        description: 'Create your safety plan',
        category: 'safety'
    }
};

// Tools used tracking
const toolsUsed = new Set();

// Initialize Achievements Module
function initializeAchievements() {
    console.log('🎮 Initializing Achievements module...');
    updateAchievementsUI();
    updateStatsDisplay();
    console.log('✅ Achievements module initialized');
}

// ============================================
// ACHIEVEMENT UNLOCKING
// ============================================

function unlockAchievement(achievementId) {
    if (!MindHaven.userData.achievements.includes(achievementId)) {
        MindHaven.userData.achievements.push(achievementId);
        saveUserData();
        
        // Show notification
        showAchievementNotification(achievementId);
        
        // Update UI if visible
        if (MindHaven.currentSection === 'achievements') {
            updateAchievementsUI();
        }
    }
}

function showAchievementNotification(achievementId) {
    const achievement = achievementDefinitions[achievementId];
    if (!achievement) return;
    
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${achievement.icon}</span>
            <div class="notification-text">
                <p class="notification-title">Achievement Unlocked!</p>
                <p class="notification-name">${achievement.title}</p>
            </div>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, var(--accent-gentle), var(--soft-teal));
        color: white;
        padding: 20px 24px;
        border-radius: 16px;
        box-shadow: var(--shadow-medium);
        z-index: 2000;
        animation: slideInRight 0.5s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 4000);
}

// ============================================
// TRACK TOOLS USED
// ============================================

function trackToolUsed(toolName) {
    toolsUsed.add(toolName);
    
    if (toolsUsed.size >= 5) {
        unlockAchievement('peaceful-mind');
    }
}

// ============================================
// UPDATE ACHIEVEMENTS UI
// ============================================

function updateAchievementsUI() {
    const achievementsList = document.getElementById('achievementsList');
    if (!achievementsList) return;
    
    let html = '';
    
    // Sort achievements: unlocked first, then locked
    const sortedAchievements = Object.values(achievementDefinitions).sort((a, b) => {
        const aUnlocked = MindHaven.userData.achievements.includes(a.id);
        const bUnlocked = MindHaven.userData.achievements.includes(b.id);
        
        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0;
    });
    
    sortedAchievements.forEach(achievement => {
        const isUnlocked = MindHaven.userData.achievements.includes(achievement.id);
        
        html += `
            <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-info">
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                </div>
                <span class="achievement-status">${isUnlocked ? '✅' : '🔒'}</span>
            </div>
        `;
    });
    
    achievementsList.innerHTML = html;
}

// ============================================
// UPDATE STATS DISPLAY
// ============================================

function updateStatsDisplay() {
    const daysVisited = document.getElementById('daysVisited');
    const checkInsCompleted = document.getElementById('checkInsCompleted');
    const journalEntries = document.getElementById('journalEntries');
    const copingToolsUsed = document.getElementById('copingToolsUsed');
    
    if (daysVisited) {
        daysVisited.textContent = MindHaven.userData.stats.daysVisited;
    }
    
    if (checkInsCompleted) {
        checkInsCompleted.textContent = MindHaven.userData.stats.checkInsCompleted;
    }
    
    if (journalEntries) {
        journalEntries.textContent = MindHaven.userData.stats.journalEntries;
    }
    
    if (copingToolsUsed) {
        copingToolsUsed.textContent = MindHaven.userData.stats.copingToolsUsed;
    }
}

// ============================================
// CHECK FOR ACHIEVEMENTS
// ============================================

function checkAchievements() {
    // Check for consistent checker
    if (MindHaven.userData.stats.checkInsCompleted >= 7) {
        unlockAchievement('consistent-checker');
    }
    
    // Check for journal keeper
    if (MindHaven.userData.stats.journalEntries >= 5) {
        unlockAchievement('journal-keeper');
    }
    
    // Check for breathing master (tracked separately)
    const breathingCount = parseInt(localStorage.getItem('mindhaven_breathing_count') || '0');
    if (breathingCount >= 10) {
        unlockAchievement('breathing-master');
    }
    
    // NEW: Check for low energy achievements
    const lowEnergyCount = parseInt(localStorage.getItem('mindhaven_low_energy_count') || '0');
    if (lowEnergyCount >= 1) {
        unlockAchievement('low-energy-start');
    }
    if (lowEnergyCount >= 5) {
        unlockAchievement('low-energy-streak');
    }
    
    // NEW: Check for assessment achievements
    if (MindHaven.userData.assessments && MindHaven.userData.assessments.lifeAssessments) {
        const assessmentCount = MindHaven.userData.assessments.lifeAssessments.length;
        if (assessmentCount >= 1) {
            unlockAchievement('first-assessment');
        }
        if (assessmentCount >= 3) {
            unlockAchievement('assessment-tracker');
        }
    }
    
    // NEW: Check for goal achievements
    if (MindHaven.userData.goals) {
        const activeGoals = MindHaven.userData.goals.activeGoals || [];
        const completedGoals = MindHaven.userData.goals.completedGoals || [];
        const habitStreaks = MindHaven.userData.goals.habitStreaks || {};
        
        if (activeGoals.length + completedGoals.length >= 1) {
            unlockAchievement('first-goal');
        }
        if (completedGoals.length >= 3) {
            unlockAchievement('goal-achiever');
        }
        
        const longStreaks = Object.values(habitStreaks).filter(s => s >= 7).length;
        if (longStreaks > 0) {
            unlockAchievement('habit-builder');
        }
    }
    
    // NEW: Check for decision achievements
    if (MindHaven.userData.decisions && MindHaven.userData.decisions.history) {
        const decisionCount = MindHaven.userData.decisions.history.length;
        if (decisionCount >= 1) {
            unlockAchievement('first-decision');
        }
        if (decisionCount >= 5) {
            unlockAchievement('decision-maker');
        }
    }
    
    // NEW: Check for guided journal achievements
    if (MindHaven.userData.journal && MindHaven.userData.journal.pathways) {
        const pathways = MindHaven.userData.journal.pathways;
        if (pathways.length >= 1) {
            unlockAchievement('guided-journey');
        }
        
        const gratitudeCount = pathways.filter(p => p.pathway === 'gratitude').length;
        if (gratitudeCount >= 3) {
            unlockAchievement('grateful-heart');
        }
    }
    
    // NEW: Check for student achievements
    if (MindHaven.userData.student && MindHaven.userData.student.studySessions) {
        const studyCount = MindHaven.userData.student.studySessions.length;
        if (studyCount >= 1) {
            unlockAchievement('study-session');
        }
        if (studyCount >= 5) {
            unlockAchievement('study-streak');
        }
    }
    
    // NEW: Check for support circle achievements
    if (MindHaven.userData.support && MindHaven.userData.support.circle) {
        const circleSize = MindHaven.userData.support.circle.length;
        if (circleSize >= 1) {
            unlockAchievement('support-builder');
        }
        if (circleSize >= 5) {
            unlockAchievement('circle-complete');
        }
    }
    
    // NEW: Check for safety plan achievement
    if (MindHaven.userData.support && MindHaven.userData.support.safetyPlan) {
        if (MindHaven.userData.support.safetyPlan.currentPlan) {
            unlockAchievement('safety-planner');
        }
    }
}

// ============================================
// TRACK BREATHING EXERCISES
// ============================================

function trackBreathingExercise() {
    let count = parseInt(localStorage.getItem('mindhaven_breathing_count') || '0');
    count++;
    localStorage.setItem('mindhaven_breathing_count', count.toString());
    
    if (count >= 10) {
        unlockAchievement('breathing-master');
    }
}

// ============================================
// ACHIEVEMENT PROGRESS
// ============================================

function getAchievementProgress(achievementId) {
    switch(achievementId) {
        case 'consistent-checker':
            return {
                current: MindHaven.userData.stats.checkInsCompleted,
                target: 7
            };
        case 'journal-keeper':
            return {
                current: MindHaven.userData.stats.journalEntries,
                target: 5
            };
        case 'breathing-master':
            const count = parseInt(localStorage.getItem('mindhaven_breathing_count') || '0');
            return {
                current: count,
                target: 10
            };
        case '7-day-streak':
            const stats = getCheckInStats();
            return {
                current: stats.currentStreak,
                target: 7
            };
        case '30-day-streak':
            const stats30 = getCheckInStats();
            return {
                current: stats30.currentStreak,
                target: 30
            };
        // NEW: Progress for new achievements
        case 'low-energy-streak':
            const lowEnergyCount = parseInt(localStorage.getItem('mindhaven_low_energy_count') || '0');
            return {
                current: lowEnergyCount,
                target: 5
            };
        case 'assessment-tracker':
            const assessmentCount = MindHaven.userData.assessments && MindHaven.userData.assessments.lifeAssessments 
                ? MindHaven.userData.assessments.lifeAssessments.length 
                : 0;
            return {
                current: assessmentCount,
                target: 3
            };
        case 'goal-achiever':
            const completedGoals = MindHaven.userData.goals && MindHaven.userData.goals.completedGoals 
                ? MindHaven.userData.goals.completedGoals.length 
                : 0;
            return {
                current: completedGoals,
                target: 3
            };
        case 'decision-maker':
            const decisionCount = MindHaven.userData.decisions && MindHaven.userData.decisions.history 
                ? MindHaven.userData.decisions.history.length 
                : 0;
            return {
                current: decisionCount,
                target: 5
            };
        case 'grateful-heart':
            const gratitudeCount = MindHaven.userData.journal && MindHaven.userData.journal.pathways 
                ? MindHaven.userData.journal.pathways.filter(p => p.pathway === 'gratitude').length 
                : 0;
            return {
                current: gratitudeCount,
                target: 3
            };
        case 'study-streak':
            const studyCount = MindHaven.userData.student && MindHaven.userData.student.studySessions 
                ? MindHaven.userData.student.studySessions.length 
                : 0;
            return {
                current: studyCount,
                target: 5
            };
        case 'circle-complete':
            const circleSize = MindHaven.userData.support && MindHaven.userData.support.circle 
                ? MindHaven.userData.support.circle.length 
                : 0;
            return {
                current: circleSize,
                target: 5
            };
        default:
            return null;
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.initializeAchievements = initializeAchievements;
window.updateAchievementsUI = updateAchievementsUI;
window.updateStatsDisplay = updateStatsDisplay;
window.trackToolUsed = trackToolUsed;
window.trackBreathingExercise = trackBreathingExercise;
window.checkAchievements = checkAchievements;
window.getAchievementProgress = getAchievementProgress;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeAchievements();
});
