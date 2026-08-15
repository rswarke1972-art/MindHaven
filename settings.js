// ============================================
// MINDHAVEN - Settings Module
// ============================================

// Initialize Settings Module
function initializeSettings() {
    console.log('⚙️ Initializing Settings module...');
    setupSettingsListeners();
    setupDarkModeSchedule();
    updateDarkModeScheduleUI();
    initializeTheme();
    console.log('✅ Settings module initialized');
}

// ============================================
// SETTINGS LISTENERS
// ============================================

function setupSettingsListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Reduced motion toggle
    const reducedMotionToggle = document.getElementById('reducedMotionToggle');
    if (reducedMotionToggle) {
        reducedMotionToggle.addEventListener('click', toggleReducedMotion);
    }
    
    // Ambient sounds toggle
    const ambientSoundsToggle = document.getElementById('ambientSoundsToggle');
    if (ambientSoundsToggle) {
        ambientSoundsToggle.addEventListener('click', toggleAmbientSounds);
    }
    
    // Clear data button
    const clearDataBtn = document.querySelector('.danger-btn');
    if (clearDataBtn && clearDataBtn.textContent.includes('Clear')) {
        clearDataBtn.addEventListener('click', clearAllData);
    }
}

// ============================================
// DARK MODE
// ============================================

function toggleDarkMode() {
    MindHaven.settings.darkMode = !MindHaven.settings.darkMode;
    saveSettings();
    applySettings();
}

// Dark Mode Scheduling
function setupDarkModeSchedule() {
    if (!MindHaven.settings.darkModeSchedule) return;
    
    const schedule = MindHaven.settings.darkModeSchedule;
    if (!schedule.enabled) return;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const startTime = schedule.startTime || 20 * 60; // Default 8 PM
    const endTime = schedule.endTime || 7 * 60; // Default 7 AM
    
    // Check if current time is within dark mode hours
    let shouldBeDark = false;
    
    if (startTime < endTime) {
        // Same day (e.g., 10 PM to 6 AM next day doesn't apply here)
        shouldBeDark = currentTime >= startTime && currentTime < endTime;
    } else {
        // Crosses midnight (e.g., 8 PM to 7 AM)
        shouldBeDark = currentTime >= startTime || currentTime < endTime;
    }
    
    if (shouldBeDark && !MindHaven.settings.darkMode) {
        MindHaven.settings.darkMode = true;
        saveSettings();
        applySettings();
    } else if (!shouldBeDark && MindHaven.settings.darkMode && !schedule.manualOverride) {
        MindHaven.settings.darkMode = false;
        saveSettings();
        applySettings();
    }
}

function toggleDarkModeSchedule() {
    if (!MindHaven.settings.darkModeSchedule) {
        MindHaven.settings.darkModeSchedule = {
            enabled: true,
            startTime: 20 * 60, // 8 PM in minutes
            endTime: 7 * 60 // 7 AM in minutes
        };
    } else {
        MindHaven.settings.darkModeSchedule.enabled = !MindHaven.settings.darkModeSchedule.enabled;
    }
    
    saveSettings();
    applySettings();
    updateDarkModeScheduleUI();
    setupDarkModeSchedule();
}

function updateDarkModeScheduleUI() {
    const toggle = document.getElementById('darkModeScheduleToggle');
    const options = document.getElementById('darkModeScheduleOptions');
    const startTimeInput = document.getElementById('darkModeStartTime');
    const endTimeInput = document.getElementById('darkModeEndTime');
    
    if (!toggle || !options) return;
    
    const schedule = MindHaven.settings.darkModeSchedule;
    
    if (schedule && schedule.enabled) {
        toggle.classList.add('active');
        options.classList.add('visible');
        
        if (startTimeInput && schedule.startTime) {
            const hours = Math.floor(schedule.startTime / 60);
            const minutes = schedule.startTime % 60;
            startTimeInput.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
        
        if (endTimeInput && schedule.endTime) {
            const hours = Math.floor(schedule.endTime / 60);
            const minutes = schedule.endTime % 60;
            endTimeInput.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
    } else {
        toggle.classList.remove('active');
        options.classList.remove('visible');
    }
}

function updateDarkModeScheduleTime(type, value) {
    if (!MindHaven.settings.darkModeSchedule) {
        MindHaven.settings.darkModeSchedule = {
            enabled: true,
            startTime: 20 * 60,
            endTime: 7 * 60
        };
    }
    
    const [hours, minutes] = value.split(':').map(Number);
    MindHaven.settings.darkModeSchedule[type] = hours * 60 + minutes;
    
    saveSettings();
    setupDarkModeSchedule();
}

// Check dark mode schedule every minute
setInterval(setupDarkModeSchedule, 60000);

// ============================================
// THEME CUSTOMIZATION
// ============================================

const themes = {
    default: {
        name: 'Default',
        primary: '#A8C3A1',
        secondary: '#8FAACF',
        accent: '#E57373'
    },
    ocean: {
        name: 'Ocean',
        primary: '#7CB8A6',
        secondary: '#8FAACF',
        accent: '#5B9BD5'
    },
    sunset: {
        name: 'Sunset',
        primary: '#FFB74D',
        secondary: '#E57373',
        accent: '#FF7043'
    },
    lavender: {
        name: 'Lavender',
        primary: '#B8A7D1',
        secondary: '#A8C3A1',
        accent: '#E57373'
    },
    forest: {
        name: 'Forest',
        primary: '#7CB8A6',
        secondary: '#A8C3A1',
        accent: '#8FAACF'
    }
};

function setTheme(themeName) {
    const theme = themes[themeName] || themes.default;
    
    MindHaven.settings.theme = themeName;
    saveSettings();
    applyTheme(theme);
    updateThemeUI(themeName);
}

function updateThemeUI(themeName) {
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(themeName)) {
            btn.classList.add('active');
        }
    });
}

function applyTheme(theme) {
    const root = document.documentElement;
    
    // Set CSS variables for theme colors
    root.style.setProperty('--accent-primary', theme.primary);
    root.style.setProperty('--accent-secondary', theme.secondary);
    root.style.setProperty('--accent-gentle', theme.accent);
}

function initializeTheme() {
    const currentTheme = MindHaven.settings.theme || 'default';
    const theme = themes[currentTheme] || themes.default;
    applyTheme(theme);
    updateThemeUI(currentTheme);
}

// ============================================
// REDUCED MOTION
// ============================================

function toggleReducedMotion() {
    MindHaven.settings.reducedMotion = !MindHaven.settings.reducedMotion;
    saveSettings();
    applySettings();
}

// ============================================
// AMBIENT SOUNDS
// ============================================

function toggleAmbientSounds() {
    MindHaven.settings.ambientSounds = !MindHaven.settings.ambientSounds;
    saveSettings();
    applySettings();
    
    if (!MindHaven.settings.ambientSounds && CalmSpace.isPlaying) {
        stopAudio();
    }
}

// ============================================
// TEXT SIZE
// ============================================

function setTextSize(size) {
    MindHaven.settings.textSize = size;
    saveSettings();
    applySettings();
}

// ============================================
// SLEEP FRIENDLY MODE
// ============================================

function toggleSleepFriendly() {
    MindHaven.settings.sleepFriendly = !MindHaven.settings.sleepFriendly;
    saveSettings();
    applySettings();
    
    if (MindHaven.settings.sleepFriendly) {
        // Apply sleep-friendly styling
        document.body.style.filter = 'brightness(0.8)';
    } else {
        document.body.style.filter = '';
    }
}

// ============================================
// CLEAR ALL DATA
// ============================================

function clearAllData() {
    const confirmation = confirm('Are you sure you want to delete all your data? This includes:\n\n• Check-in history\n• Journal entries\n• Achievements\n• Settings\n\nThis action cannot be undone.');
    
    if (confirmation) {
        // Clear localStorage
        localStorage.removeItem('mindhaven_settings');
        localStorage.removeItem('mindhaven_userdata');
        localStorage.removeItem('mindhaven_last_visit');
        localStorage.removeItem('mindhaven_ambience');
        localStorage.removeItem('mindhaven_encouragement_' + new Date().toDateString());
        localStorage.removeItem('mindhaven_breathing_count');
        
        // Reset in-memory data
        MindHaven.settings = {
            darkMode: false,
            reducedMotion: false,
            ambientSounds: false,
            textSize: 'medium',
            sleepFriendly: false
        };
        
        MindHaven.userData = {
            checkIns: [],
            journalEntries: [],
            achievements: [],
            stats: {
                daysVisited: 0,
                checkInsCompleted: 0,
                journalEntries: 0,
                copingToolsUsed: 0
            }
        };
        
        // Apply default settings
        applySettings();
        
        // Show confirmation
        showGentleMessage('All data has been cleared. MindHaven has been reset.');
        
        // Navigate to dashboard
        navigateTo('dashboard');
        
        // Reload page to ensure clean state
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

// ============================================
// EXPORT SETTINGS
// ============================================

function exportSettings() {
    exportAllData();
}

function exportAllData() {
    const data = {
        settings: MindHaven.settings,
        userData: MindHaven.userData,
        streaks: typeof Streaks !== 'undefined' ? Streaks : null,
        gratitude: typeof Gratitude !== 'undefined' ? {
            entries: Gratitude.entries,
            streak: Gratitude.streak,
            longestStreak: Gratitude.longestStreak
        } : null,
        dailyCheckIn: typeof DailyCheckIn !== 'undefined' ? {
            morningQuestions: DailyCheckIn.morningQuestions,
            eveningQuestions: DailyCheckIn.eveningQuestions,
            customMorningQuestions: DailyCheckIn.customMorningQuestions,
            customEveningQuestions: DailyCheckIn.customEveningQuestions,
            morningCheckIns: DailyCheckIn.morningCheckIns,
            eveningCheckIns: DailyCheckIn.eveningCheckIns
        } : null,
        exportDate: new Date().toISOString(),
        version: '2.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindhaven-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showGentleMessage('All data exported successfully.');
}

function exportSelectiveData(type) {
    let data = {};
    let filename = '';
    
    switch (type) {
        case 'moods':
            data = {
                checkIns: MindHaven.userData.checkIns || [],
                exportDate: new Date().toISOString(),
                type: 'moods'
            };
            filename = 'mindhaven-moods';
            break;
        case 'journal':
            data = {
                journalEntries: MindHaven.userData.journalEntries || [],
                exportDate: new Date().toISOString(),
                type: 'journal'
            };
            filename = 'mindhaven-journal';
            break;
        case 'gratitude':
            data = typeof Gratitude !== 'undefined' ? {
                entries: Gratitude.entries || [],
                streak: Gratitude.streak,
                longestStreak: Gratitude.longestStreak,
                exportDate: new Date().toISOString(),
                type: 'gratitude'
            } : { entries: [], exportDate: new Date().toISOString(), type: 'gratitude' };
            filename = 'mindhaven-gratitude';
            break;
        case 'checkins':
            data = typeof DailyCheckIn !== 'undefined' ? {
                morningCheckIns: DailyCheckIn.morningCheckIns || [],
                eveningCheckIns: DailyCheckIn.eveningCheckIns || [],
                exportDate: new Date().toISOString(),
                type: 'checkins'
            } : { morningCheckIns: [], eveningCheckIns: [], exportDate: new Date().toISOString(), type: 'checkins' };
            filename = 'mindhaven-checkins';
            break;
        case 'achievements':
            data = {
                achievements: MindHaven.userData.achievements || [],
                stats: MindHaven.userData.stats || {},
                exportDate: new Date().toISOString(),
                type: 'achievements'
            };
            filename = 'mindhaven-achievements';
            break;
        default:
            showGentleMessage('Invalid export type');
            return;
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showGentleMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully.`);
}

// ============================================
// IMPORT SETTINGS
// ============================================

function importSettings(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Handle full backup import
            if (data.userData) {
                MindHaven.userData = { ...MindHaven.userData, ...data.userData };
                saveUserData();
            }
            
            if (data.settings) {
                MindHaven.settings = { ...MindHaven.settings, ...data.settings };
                saveSettings();
                applySettings();
            }
            
            // Handle streaks import
            if (data.streaks && typeof Streaks !== 'undefined') {
                Object.assign(Streaks, data.streaks);
                saveStreakData();
            }
            
            // Handle gratitude import
            if (data.gratitude && typeof Gratitude !== 'undefined') {
                Gratitude.entries = data.gratitude.entries || [];
                Gratitude.streak = data.gratitude.streak || 0;
                Gratitude.longestStreak = data.gratitude.longestStreak || 0;
                saveGratitudeData();
            }
            
            // Handle daily check-in import
            if (data.dailyCheckIn && typeof DailyCheckIn !== 'undefined') {
                DailyCheckIn.morningQuestions = data.dailyCheckIn.morningQuestions || DailyCheckIn.morningQuestions;
                DailyCheckIn.eveningQuestions = data.dailyCheckIn.eveningQuestions || DailyCheckIn.eveningQuestions;
                DailyCheckIn.customMorningQuestions = data.dailyCheckIn.customMorningQuestions || [];
                DailyCheckIn.customEveningQuestions = data.dailyCheckIn.customEveningQuestions || [];
                DailyCheckIn.morningCheckIns = data.dailyCheckIn.morningCheckIns || [];
                DailyCheckIn.eveningCheckIns = data.dailyCheckIn.eveningCheckIns || [];
                saveDailyCheckInData();
            }
            
            // Handle selective imports
            if (data.type === 'moods' && data.checkIns) {
                MindHaven.userData.checkIns = data.checkIns;
                saveUserData();
            }
            
            if (data.type === 'journal' && data.journalEntries) {
                MindHaven.userData.journalEntries = data.journalEntries;
                saveUserData();
            }
            
            if (data.type === 'gratitude' && data.entries && typeof Gratitude !== 'undefined') {
                Gratitude.entries = data.entries;
                Gratitude.streak = data.streak || 0;
                Gratitude.longestStreak = data.longestStreak || 0;
                saveGratitudeData();
            }
            
            if (data.type === 'checkins' && typeof DailyCheckIn !== 'undefined') {
                DailyCheckIn.morningCheckIns = data.morningCheckIns || [];
                DailyCheckIn.eveningCheckIns = data.eveningCheckIns || [];
                saveDailyCheckInData();
            }
            
            if (data.type === 'achievements' && data.achievements) {
                MindHaven.userData.achievements = data.achievements;
                if (data.stats) {
                    MindHaven.userData.stats = data.stats;
                }
                saveUserData();
            }
            
            showGentleMessage('Data imported successfully.');
            
            // Reload to apply changes
            setTimeout(() => {
                location.reload();
            }, 1500);
        } catch (error) {
            console.error('Import error:', error);
            showGentleMessage('Error importing data. Please check the file format.');
        }
    };
    
    reader.readAsText(file);
}

// ============================================
// RESET SETTINGS ONLY
// ============================================

function resetSettings() {
    const confirmation = confirm('Reset all settings to default? Your data (check-ins, journal, achievements) will be preserved.');
    
    if (confirmation) {
        MindHaven.settings = {
            darkMode: false,
            reducedMotion: false,
            ambientSounds: false,
            textSize: 'medium',
            sleepFriendly: false
        };
        
        saveSettings();
        applySettings();
        
        showGentleMessage('Settings reset to default.');
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.toggleDarkMode = toggleDarkMode;
window.toggleDarkModeSchedule = toggleDarkModeSchedule;
window.updateDarkModeScheduleTime = updateDarkModeScheduleTime;
window.updateDarkModeScheduleUI = updateDarkModeScheduleUI;
window.setTheme = setTheme;
window.updateThemeUI = updateThemeUI;
window.themes = themes;
window.toggleReducedMotion = toggleReducedMotion;
window.toggleAmbientSounds = toggleAmbientSounds;
window.setTextSize = setTextSize;
window.toggleSleepFriendly = toggleSleepFriendly;
window.clearAllData = clearAllData;
window.exportSettings = exportSettings;
window.exportAllData = exportAllData;
function saveOllamaSettings() {
    const endpointInput = document.getElementById('ollamaEndpointInput');
    const modelSelect = document.getElementById('ollamaModelSelect');
    
    if (endpointInput) MindHaven.settings.ollamaEndpoint = endpointInput.value.trim();
    if (modelSelect && modelSelect.value) MindHaven.settings.ollamaModel = modelSelect.value;

    try {
        localStorage.setItem('mindhaven_settings', JSON.stringify(MindHaven.settings));
    } catch (e) {}

    if (typeof MindHavenOllama !== 'undefined') {
        MindHavenOllama.connect(MindHaven.settings.ollamaEndpoint, MindHaven.settings.ollamaModel);
    }
}

window.saveOllamaSettings = saveOllamaSettings;
window.resetSettings = resetSettings;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
});
