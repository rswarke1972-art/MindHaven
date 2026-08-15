// ============================================
// MINDHAVEN - Main Application Controller
// ============================================

// Global State
const MindHaven = {
    currentSection: 'chat',
    currentSubsection: null,
    settings: {
        darkMode: false,
        reducedMotion: false,
        ambientSounds: false,
        textSize: 'medium',
        sleepFriendly: false,
        ollamaEndpoint: 'http://localhost:11434',
        ollamaModel: null
    },
    userData: {
        checkIns: [],
        journalEntries: [],
        achievements: [],
        stats: {
            daysVisited: 0,
            checkInsCompleted: 0,
            journalEntries: 0,
            copingToolsUsed: 0
        },
        safetyPlan: null,
        trustedContact: null
    },
    schemaVersion: '2.0.0'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🕊️ MindHaven initializing...');
    loadSettings();
    loadUserData();
    migrateUserData(); // Schema migration for new features
    initializeNavigation();
    initializeBottomNav();
    trackVisit();
    
    // Default launch chatbot
    if (typeof MindHavenChatbot !== 'undefined') {
        MindHavenChatbot.init();
    }

    console.log('✅ MindHaven initialized successfully');
});

// Context modal helpers
function openContextModal() {
    const modal = document.getElementById('contextModal');
    if (modal) modal.style.display = 'flex';
}

function closeContextModal() {
    const modal = document.getElementById('contextModal');
    if (modal) modal.style.display = 'none';
}

window.openContextModal = openContextModal;
window.closeContextModal = closeContextModal;

// ============================================
// NAVIGATION SYSTEM
// ============================================

function navigateTo(section, subsection = null) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        MindHaven.currentSection = section;
        MindHaven.currentSubsection = subsection;
        
        // Update bottom navigation
        updateBottomNav(section);
        
        // Close mobile menu
        closeNavMenu();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Handle subsection if provided
        if (subsection) {
            handleSubsection(section, subsection);
        }
        
        // Trigger section-specific initialization
        initializeSection(section);
    }
}

function handleSubsection(section, subsection) {
    // Handle subsection navigation for different modules
    switch(section) {
        case 'mentalhealth':
            if (typeof loadMentalHealthTopic === 'function') {
                loadMentalHealthTopic(subsection);
            }
            break;
        case 'coping':
            if (typeof openCopingTool === 'function') {
                openCopingTool(subsection);
            }
            break;
    }
}

function initializeSection(section) {
    // Initialize section-specific functionality
    switch(section) {
        case 'chat':
            if (typeof MindHavenChatbot !== 'undefined') {
                MindHavenChatbot.init();
            }
            break;
        case 'dashboard':
            if (typeof initializeDashboard === 'function') {
                initializeDashboard();
            }
            break;
        case 'journal':
            if (typeof initializeJournal === 'function') {
                initializeJournal();
            }
            break;
        case 'insights':
            if (typeof initializeInsights === 'function') {
                initializeInsights();
            }
            break;
        case 'achievements':
            if (typeof initializeAchievements === 'function') {
                initializeAchievements();
            }
            break;
        case 'calmspace':
            if (typeof initializeCalmSpace === 'function') {
                initializeCalmSpace();
            }
            break;
        case 'assessment':
            if (typeof renderAssessmentDashboard === 'function') {
                renderAssessmentDashboard();
            }
            break;
        case 'goals':
            if (typeof renderGoalsDashboard === 'function') {
                renderGoalsDashboard();
            }
            break;
        case 'decisions':
            if (typeof renderDecisionsDashboard === 'function') {
                renderDecisionsDashboard();
            }
            break;
        case 'student':
            if (typeof renderStudentDashboard === 'function') {
                renderStudentDashboard();
            }
            break;
        case 'supportcircle':
            if (typeof renderSupportCircleDashboard === 'function') {
                renderSupportCircleDashboard();
            }
            break;
        case 'safetyplan':
            if (typeof renderSafetyPlanDashboard === 'function') {
                renderSafetyPlanDashboard();
            }
            break;
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================

function initializeNavigation() {
    const navMenuBtn = document.querySelector('.nav-menu-btn');
    const navMenu = document.getElementById('navMenu');
    
    if (navMenuBtn) {
        navMenuBtn.addEventListener('click', toggleNavMenu);
    }
}

function toggleNavMenu() {
    const navMenu = document.getElementById('navMenu');
    const navMenuBtn = document.querySelector('.nav-menu-btn');
    
    if (navMenu) {
        navMenu.classList.toggle('active');
        
        // Update aria-expanded
        const isExpanded = navMenu.classList.contains('active');
        if (navMenuBtn) {
            navMenuBtn.setAttribute('aria-expanded', isExpanded);
        }
    }
}

function closeNavMenu() {
    const navMenu = document.getElementById('navMenu');
    const navMenuBtn = document.querySelector('.nav-menu-btn');
    
    if (navMenu) {
        navMenu.classList.remove('active');
        if (navMenuBtn) {
            navMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }
}

function getSectionFromNavItem(item) {
    if (!item) return null;
    const dataSec = item.getAttribute('data-section');
    if (dataSec) return dataSec;

    const onclick = item.getAttribute('onclick');
    if (onclick) {
        const match = onclick.match(/'([^']+)'/);
        if (match && match[1]) return match[1];
    }
    return null;
}

function initializeBottomNav() {
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = getSectionFromNavItem(this);
            if (section && section !== 'menu') {
                updateBottomNav(section);
            }
        });
    });
}

function updateBottomNav(activeSection) {
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    bottomNavItems.forEach(item => {
        const section = getSectionFromNavItem(item);
        if (section && section === activeSection) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ============================================
// SETTINGS MANAGEMENT
// ============================================

function loadSettings() {
    const savedSettings = localStorage.getItem('mindhaven_settings');
    if (savedSettings) {
        try {
            MindHaven.settings = { ...MindHaven.settings, ...JSON.parse(savedSettings) };
            applySettings();
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
}

function saveSettings() {
    localStorage.setItem('mindhaven_settings', JSON.stringify(MindHaven.settings));
}

function applySettings() {
    // Apply dark mode
    if (MindHaven.settings.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Apply reduced motion
    if (MindHaven.settings.reducedMotion) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
        document.documentElement.removeAttribute('data-reduced-motion');
    }
    
    // Apply text size
    document.documentElement.setAttribute('data-text-size', MindHaven.settings.textSize);
    
    // Update toggle buttons in settings
    updateSettingsUI();
}

function updateSettingsUI() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        if (MindHaven.settings.darkMode) {
            darkModeToggle.classList.add('active');
        } else {
            darkModeToggle.classList.remove('active');
        }
    }
    
    // Reduced motion toggle
    const reducedMotionToggle = document.getElementById('reducedMotionToggle');
    if (reducedMotionToggle) {
        if (MindHaven.settings.reducedMotion) {
            reducedMotionToggle.classList.add('active');
        } else {
            reducedMotionToggle.classList.remove('active');
        }
    }
    
    // Ambient sounds toggle
    const ambientSoundsToggle = document.getElementById('ambientSoundsToggle');
    if (ambientSoundsToggle) {
        if (MindHaven.settings.ambientSounds) {
            ambientSoundsToggle.classList.add('active');
        } else {
            ambientSoundsToggle.classList.remove('active');
        }
    }
    
    // Text size buttons
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        const size = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (size === MindHaven.settings.textSize) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ============================================
// USER DATA MANAGEMENT
// ============================================

function loadUserData() {
    const savedData = localStorage.getItem('mindhaven_userdata');
    if (savedData) {
        try {
            MindHaven.userData = { ...MindHaven.userData, ...JSON.parse(savedData) };
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
}

function migrateUserData() {
    const currentVersion = localStorage.getItem('mindhaven_schema_version') || '1.0.0';
    
    if (currentVersion === MindHaven.schemaVersion) return;
    
    console.log(`🔄 Migrating user data from ${currentVersion} to ${MindHaven.schemaVersion}...`);
    
    // Initialize new fields with defaults
    MindHaven.userData = {
        ...MindHaven.userData,
        assessments: {
            lifeAssessments: [],
            assessmentHistory: [],
            wellnessScores: {}
        },
        goals: {
            activeGoals: [],
            completedGoals: [],
            habits: [],
            habitStreaks: {},
            microGoals: []
        },
        decisions: {
            history: [],
            outcomes: [],
            frameworks: {}
        },
        journal: {
            pathways: [],
            moodTags: [],
            themes: {},
            streaks: {},
            analytics: {}
        },
        thoughts: {
            challenged: [],
            innerCritic: [],
            distortions: {}
        },
        support: {
            circle: [],
            safetyPlan: MindHaven.userData.safetyPlan || {},
            emergencyContacts: []
        },
        resources: {
            wins: [],
            comfort: [],
            quotes: []
        },
        student: {
            studySessions: [],
            examSchedule: [],
            academicGoals: [],
            burnoutAssessments: []
        },
        profile: {
            commonEmotions: {},
            moodPatterns: [],
            triggerPatterns: {},
            copingEffectiveness: {},
            correlations: {}
        },
        roadmaps: {
            active: null,
            progress: {},
            history: []
        },
        rpg: {
            attributes: {
                resilience: 0,
                selfAwareness: 0,
                consistency: 0,
                courage: 0,
                emotionalRegulation: 0,
                socialConfidence: 0
            },
            experience: 0,
            level: 1,
            companion: {
                name: null,
                stage: 0,
                unlocked: false
            }
        },
        lowEnergy: {
            active: false,
            preferences: {},
            history: []
        },
        emergency: {
            activations: [],
            groundingUsed: [],
            crisisContacts: []
        },
        timeline: {
            events: [],
            milestones: []
        }
    };
    
    // Migrate existing journal entries to new structure
    if (MindHaven.userData.journalEntries && MindHaven.userData.journalEntries.length > 0) {
        MindHaven.userData.journal.pathways = MindHaven.userData.journalEntries.map(entry => ({
            ...entry,
            pathway: 'freeform',
            moodTags: [],
            theme: 'general'
        }));
    }
    
    // Save updated schema version
    localStorage.setItem('mindhaven_schema_version', MindHaven.schemaVersion);
    saveUserData();
    
    console.log('✅ User data migration complete');
}

function saveUserData() {
    localStorage.setItem('mindhaven_userdata', JSON.stringify(MindHaven.userData));
}

function trackVisit() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('mindhaven_last_visit');
    
    if (lastVisit !== today) {
        MindHaven.userData.stats.daysVisited++;
        localStorage.setItem('mindhaven_last_visit', today);
        saveUserData();
        
        // Check for streak achievement
        checkStreakAchievement();
    }
}

function checkStreakAchievement() {
    // Simple streak tracking - could be enhanced
    const visits = MindHaven.userData.stats.daysVisited;
    if (visits === 7) {
        unlockAchievement('7-day-streak');
    }
}

// ============================================
// ACHIEVEMENT SYSTEM
// ============================================

function unlockAchievement(achievementId) {
    if (!MindHaven.userData.achievements.includes(achievementId)) {
        MindHaven.userData.achievements.push(achievementId);
        saveUserData();
        
        // Show gentle notification
        showAchievementNotification(achievementId);
        
        // Update achievements UI if visible
        if (MindHaven.currentSection === 'achievements') {
            if (typeof updateAchievementsUI === 'function') {
                updateAchievementsUI();
            }
        }
    }
}

function showAchievementNotification(achievementId) {
    // Create a gentle notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🌱</span>
            <p>Achievement Unlocked!</p>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--accent-gentle);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-medium);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
    console.error('MindHaven Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('MindHaven Promise Rejection:', event.reason);
});

// Gentle Toast Notification Utility
function showGentleMessage(message) {
    if (!message) return;
    const existing = document.querySelector('.gentle-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'gentle-toast';
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent-primary, #4a7c59);
        color: white;
        padding: 14px 22px;
        border-radius: 12px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        z-index: 9999;
        font-weight: 600;
        font-size: 0.9rem;
        max-width: 90%;
        text-align: center;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.navigateTo = navigateTo;
window.toggleNavMenu = toggleNavMenu;
window.closeNavMenu = closeNavMenu;
window.showGentleMessage = showGentleMessage;
window.generateId = generateId;
window.saveUserData = saveUserData;
window.loadUserData = loadUserData;
window.unlockAchievement = unlockAchievement;

// ============================================
// EXPORT FOR OTHER MODULES
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MindHaven;
}
