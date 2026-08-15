// ============================================
// MINDHAVEN - Unified Streak System
// ============================================

// Streak State
const Streaks = {
    moodTracking: { current: 0, longest: 0, lastDate: null },
    gratitude: { current: 0, longest: 0, lastDate: null },
    journal: { current: 0, longest: 0, lastDate: null },
    checkIn: { current: 0, longest: 0, lastDate: null },
    overall: { current: 0, longest: 0 }
};

// Initialize Streak System
function initializeStreaks() {
    console.log('🔥 Initializing Unified Streak System...');
    loadStreakData();
    calculateAllStreaks();
    renderStreakDashboard();
    console.log('✅ Unified Streak System initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadStreakData() {
    const savedData = localStorage.getItem('mindhaven_streaks');
    if (savedData) {
        const data = JSON.parse(savedData);
        Streaks = { ...Streaks, ...data };
    }
    
    // Also load from userData
    if (MindHaven.userData.streaks) {
        Streaks = { ...Streaks, ...MindHaven.userData.streaks };
    }
}

function saveStreakData() {
    localStorage.setItem('mindhaven_streaks', JSON.stringify(Streaks));
    
    MindHaven.userData.streaks = Streaks;
    saveUserData();
}

// ============================================
// STREAK CALCULATION
// ============================================

function calculateAllStreaks() {
    calculateMoodStreak();
    calculateGratitudeStreak();
    calculateJournalStreak();
    calculateCheckInStreak();
    calculateOverallStreak();
}

function calculateMoodStreak() {
    const checkIns = MindHaven.userData.checkIns || [];
    const dates = [...new Set(checkIns.map(c => new Date(c.date).toDateString()))];
    
    const { current, longest } = calculateStreakFromDates(dates);
    
    Streaks.moodTracking = {
        current,
        longest: Math.max(Streaks.moodTracking.longest, longest),
        lastDate: dates.length > 0 ? dates[dates.length - 1] : null
    };
}

function calculateGratitudeStreak() {
    const gratitudeEntries = MindHaven.userData.gratitude?.entries || [];
    const dates = [...new Set(gratitudeEntries.map(e => new Date(e.date).toDateString()))];
    
    const { current, longest } = calculateStreakFromDates(dates);
    
    Streaks.gratitude = {
        current,
        longest: Math.max(Streaks.gratitude.longest, longest),
        lastDate: dates.length > 0 ? dates[dates.length - 1] : null
    };
}

function calculateJournalStreak() {
    const journalEntries = MindHaven.userData.journalEntries || [];
    const dates = [...new Set(journalEntries.map(j => new Date(j.date).toDateString()))];
    
    const { current, longest } = calculateStreakFromDates(dates);
    
    Streaks.journal = {
        current,
        longest: Math.max(Streaks.journal.longest, longest),
        lastDate: dates.length > 0 ? dates[dates.length - 1] : null
    };
}

function calculateCheckInStreak() {
    const morningCheckIns = MindHaven.userData.dailyCheckIn?.morningCheckIns || [];
    const eveningCheckIns = MindHaven.userData.dailyCheckIn?.eveningCheckIns || [];
    
    const morningDates = [...new Set(morningCheckIns.map(c => new Date(c.date).toDateString()))];
    const eveningDates = [...new Set(eveningCheckIns.map(c => new Date(c.date).toDateString()))];
    
    const allDates = [...new Set([...morningDates, ...eveningDates])];
    
    const { current, longest } = calculateStreakFromDates(allDates);
    
    Streaks.checkIn = {
        current,
        longest: Math.max(Streaks.checkIn.longest, longest),
        lastDate: allDates.length > 0 ? allDates[allDates.length - 1] : null
    };
}

function calculateStreakFromDates(dates) {
    if (dates.length === 0) return { current: 0, longest: 0 };
    
    // Sort dates
    const sortedDates = dates.sort((a, b) => new Date(a) - new Date(b));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;
    
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    // Check if streak is still active
    if (sortedDates.includes(today)) {
        currentStreak = 1;
        tempStreak = 1;
        prevDate = new Date(today);
    } else if (sortedDates.includes(yesterdayStr)) {
        currentStreak = 1;
        tempStreak = 1;
        prevDate = new Date(yesterdayStr);
    } else {
        // Streak broken
        currentStreak = 0;
    }
    
    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        
        if (prevDate) {
            const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }
        
        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }
        
        prevDate = currentDate;
    }
    
    // If current streak is still active, continue counting backwards
    if (currentStreak > 0) {
        tempStreak = 1;
        prevDate = sortedDates.includes(today) ? new Date(today) : new Date(yesterdayStr);
        
        for (let i = sortedDates.length - 2; i >= 0; i--) {
            const currentDate = new Date(sortedDates[i]);
            const diffDays = Math.floor((prevDate - currentDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                tempStreak++;
                prevDate = currentDate;
            } else {
                break;
            }
        }
        
        currentStreak = tempStreak;
    }
    
    return { current: currentStreak, longest: Math.max(longestStreak, longestStreak) };
}

function calculateOverallStreak() {
    // Overall streak is the minimum of all individual streaks
    const individualStreaks = [
        Streaks.moodTracking.current,
        Streaks.gratitude.current,
        Streaks.journal.current,
        Streaks.checkIn.current
    ];
    
    // Filter out zeros (activities not started)
    const activeStreaks = individualStreaks.filter(s => s > 0);
    
    const overallCurrent = activeStreaks.length > 0 ? Math.min(...activeStreaks) : 0;
    
    // Calculate longest overall streak from historical data
    const overallLongest = Math.max(
        Streaks.moodTracking.longest,
        Streaks.gratitude.longest,
        Streaks.journal.longest,
        Streaks.checkIn.longest
    );
    
    Streaks.overall = {
        current: overallCurrent,
        longest: Math.max(Streaks.overall.longest, overallLongest)
    };
}

// ============================================
// STREAK RECORDING
// ============================================

function recordActivity(type) {
    const today = new Date().toDateString();
    
    switch (type) {
        case 'mood':
            Streaks.moodTracking.lastDate = today;
            break;
        case 'gratitude':
            Streaks.gratitude.lastDate = today;
            break;
        case 'journal':
            Streaks.journal.lastDate = today;
            break;
        case 'checkin':
            Streaks.checkIn.lastDate = today;
            break;
    }
    
    calculateAllStreaks();
    saveStreakData();
    renderStreakDashboard();
    
    // Check for streak achievements
    checkStreakAchievements();
}

function checkStreakAchievements() {
    // Check for various streak milestones
    if (Streaks.overall.current === 7) {
        unlockAchievement('week-streak');
    }
    if (Streaks.overall.current === 30) {
        unlockAchievement('month-streak');
    }
    if (Streaks.overall.current === 100) {
        unlockAchievement('century-streak');
    }
    
    if (Streaks.moodTracking.current === 30) {
        unlockAchievement('mood-master');
    }
    if (Streaks.gratitude.current === 30) {
        unlockAchievement('grateful-month');
    }
    if (Streaks.journal.current === 30) {
        unlockAchievement('journal-keeper');
    }
}

// ============================================
// STREAK DASHBOARD
// ============================================

function renderStreakDashboard() {
    const container = document.getElementById('streakDashboard');
    if (!container) return;
    
    let html = `
        <div class="streak-overview-card">
            <h2>Overall Wellness Streak</h2>
            <div class="overall-streak-display">
                <span class="streak-number-large">${Streaks.overall.current}</span>
                <span class="streak-label-large">days</span>
            </div>
            <p class="streak-subtitle">Longest: ${Streaks.overall.longest} days</p>
        </div>
        
        <div class="streak-grid">
            <div class="streak-card mood-streak">
                <span class="streak-icon">😌</span>
                <h3>Mood Tracking</h3>
                <div class="streak-values">
                    <span class="current-streak">${Streaks.moodTracking.current}</span>
                    <span class="streak-divider">/</span>
                    <span class="longest-streak">${Streaks.moodTracking.longest}</span>
                </div>
                <p class="streak-label">current / longest</p>
            </div>
            
            <div class="streak-card gratitude-streak">
                <span class="streak-icon">🙏</span>
                <h3>Gratitude</h3>
                <div class="streak-values">
                    <span class="current-streak">${Streaks.gratitude.current}</span>
                    <span class="streak-divider">/</span>
                    <span class="longest-streak">${Streaks.gratitude.longest}</span>
                </div>
                <p class="streak-label">current / longest</p>
            </div>
            
            <div class="streak-card journal-streak">
                <span class="streak-icon">📔</span>
                <h3>Journal</h3>
                <div class="streak-values">
                    <span class="current-streak">${Streaks.journal.current}</span>
                    <span class="streak-divider">/</span>
                    <span class="longest-streak">${Streaks.journal.longest}</span>
                </div>
                <p class="streak-label">current / longest</p>
            </div>
            
            <div class="streak-card checkin-streak">
                <span class="streak-icon">🌅</span>
                <h3>Daily Check-In</h3>
                <div class="streak-values">
                    <span class="current-streak">${Streaks.checkIn.current}</span>
                    <span class="streak-divider">/</span>
                    <span class="longest-streak">${Streaks.checkIn.longest}</span>
                </div>
                <p class="streak-label">current / longest</p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ============================================
// UI SETUP
// ============================================

function setupStreaksUI() {
    addStreaksToNavigation();
}

function addStreaksToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="streaks"]')) return;
    
    const streaksItem = document.createElement('button');
    streaksItem.className = 'nav-item';
    streaksItem.setAttribute('onclick', "navigateTo('streaks')");
    streaksItem.setAttribute('role', 'menuitem');
    streaksItem.textContent = '🔥 Streaks';
    
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(streaksItem, crisisBtn);
    } else {
        navMenu.appendChild(streaksItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.recordActivity = recordActivity;
window.calculateAllStreaks = calculateAllStreaks;
window.renderStreakDashboard = renderStreakDashboard;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeStreaks();
});
