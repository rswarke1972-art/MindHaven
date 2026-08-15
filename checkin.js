// ============================================
// MINDHAVEN - Check-In Module
// ============================================

// Check-In State
const CheckIn = {
    currentMood: null,
    currentNotes: '',
    moodHistory: []
};

// Mood Definitions with colors and descriptions
const moodDefinitions = {
    calm: {
        emoji: '😌',
        color: '#A8C3A1',
        description: 'Feeling peaceful and centered',
        suggestions: ['Continue your mindfulness practice', 'Share your calm with others', 'Reflect on what brought you peace']
    },
    okay: {
        emoji: '🙂',
        color: '#8FAACF',
        description: 'Feeling stable and balanced',
        suggestions: ['Maintain your routine', 'Check in with a friend', 'Practice gratitude']
    },
    anxious: {
        emoji: '😟',
        color: '#B8A7D1',
        description: 'Feeling worried or uneasy',
        suggestions: ['Try breathing exercises', 'Write down your worries', 'Use grounding techniques']
    },
    low: {
        emoji: '😞',
        color: '#7CB8A6',
        description: 'Feeling down or sad',
        suggestions: ['Be gentle with yourself', 'Reach out to someone', 'Allow yourself to rest']
    },
    exhausted: {
        emoji: '😴',
        color: '#D6D6D6',
        description: 'Feeling very tired',
        suggestions: ['Prioritize rest', 'Reduce your commitments', 'Practice sleep hygiene']
    },
    overwhelmed: {
        emoji: '😵',
        color: '#E57373',
        description: 'Feeling like too much is happening',
        suggestions: ['Break tasks into smaller steps', 'Say no to new commitments', 'Ask for help']
    },
    numb: {
        emoji: '😶',
        color: '#90A4AE',
        description: 'Feeling disconnected or empty',
        suggestions: ['Try gentle movement', 'Connect with your senses', 'Be patient with yourself']
    },
    overthinking: {
        emoji: '💭',
        color: '#FFB74D',
        description: 'Thoughts are racing or stuck',
        suggestions: ['Try the overthinking breaker', 'Write your thoughts down', 'Focus on the present moment']
    }
};

// Initialize Check-In Module
function initializeCheckIn() {
    console.log('📊 Initializing Check-In module...');
    loadMoodHistory();
    setupCheckInListeners();
    console.log('✅ Check-In module initialized');
}

// ============================================
// MOOD TRACKING
// ============================================

function setupCheckInListeners() {
    // Mood buttons are already handled in dashboard.js
    // This module provides additional check-in functionality
}

function recordMood(mood, notes = '') {
    const checkInData = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        mood: mood,
        notes: notes,
        emotionalWeather: Dashboard.emotionalWeather
    };
    
    CheckIn.moodHistory.push(checkInData);
    
    // Save to user data
    MindHaven.userData.checkIns.push(checkInData);
    saveUserData();
    
    return checkInData;
}

function loadMoodHistory() {
    CheckIn.moodHistory = MindHaven.userData.checkIns || [];
}

// ============================================
// MOOD ANALYSIS
// ============================================

function getMoodTrends(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentMoods = CheckIn.moodHistory.filter(
        entry => new Date(entry.timestamp) >= cutoffDate
    );
    
    if (recentMoods.length === 0) {
        return {
            average: null,
            mostCommon: null,
            trend: 'insufficient-data'
        };
    }
    
    // Count mood occurrences
    const moodCounts = {};
    recentMoods.forEach(entry => {
        if (Array.isArray(entry.moods)) {
            entry.moods.forEach(mood => {
                moodCounts[mood] = (moodCounts[mood] || 0) + 1;
            });
        } else if (entry.mood) {
            moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        }
    });
    
    // Find most common mood
    let mostCommon = null;
    let maxCount = 0;
    for (const mood in moodCounts) {
        if (moodCounts[mood] > maxCount) {
            maxCount = moodCounts[mood];
            mostCommon = mood;
        }
    }
    
    // Determine trend
    const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
    const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
    
    const firstHalfAvg = calculateMoodAverage(firstHalf);
    const secondHalfAvg = calculateMoodAverage(secondHalf);
    
    let trend = 'stable';
    if (secondHalfAvg > firstHalfAvg + 0.5) {
        trend = 'improving';
    } else if (secondHalfAvg < firstHalfAvg - 0.5) {
        trend = 'declining';
    }
    
    return {
        average: calculateMoodAverage(recentMoods),
        mostCommon: mostCommon,
        trend: trend,
        moodCounts: moodCounts
    };
}

function calculateMoodAverage(entries) {
    if (entries.length === 0) return 0;
    
    // Simple mood scoring (higher = better)
    const moodScores = {
        calm: 5,
        okay: 4,
        anxious: 2,
        low: 2,
        exhausted: 1,
        overwhelmed: 1,
        numb: 2,
        overthinking: 2
    };
    
    let totalScore = 0;
    let count = 0;
    
    entries.forEach(entry => {
        if (Array.isArray(entry.moods)) {
            entry.moods.forEach(mood => {
                if (moodScores[mood]) {
                    totalScore += moodScores[mood];
                    count++;
                }
            });
        } else if (entry.mood && moodScores[entry.mood]) {
            totalScore += moodScores[entry.mood];
            count++;
        }
    });
    
    return count > 0 ? totalScore / count : 0;
}

// ============================================
// MOOD SUGGESTIONS
// ============================================

function getMoodSuggestions(mood) {
    const moodData = moodDefinitions[mood];
    if (moodData && moodData.suggestions) {
        return moodData.suggestions;
    }
    return ['Take a deep breath', 'Be kind to yourself', 'Reach out if needed'];
}

// ============================================
// CHECK-IN HISTORY
// ============================================

function getCheckInHistory(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return CheckIn.moodHistory.filter(
        entry => new Date(entry.timestamp) >= cutoffDate
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function getCheckInStats() {
    const history = CheckIn.moodHistory;
    
    if (history.length === 0) {
        return {
            totalCheckIns: 0,
            longestStreak: 0,
            currentStreak: 0,
            averagePerWeek: 0
        };
    }
    
    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const sortedHistory = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    let lastDate = null;
    sortedHistory.forEach(entry => {
        const entryDate = new Date(entry.timestamp).toDateString();
        
        if (lastDate === null) {
            tempStreak = 1;
        } else {
            const lastDateObj = new Date(lastDate);
            const entryDateObj = new Date(entryDate);
            const diffDays = Math.floor((entryDateObj - lastDateObj) / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 1) {
                tempStreak++;
            } else {
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
                tempStreak = 1;
            }
        }
        
        lastDate = entryDate;
    });
    
    if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
    }
    
    // Calculate current streak
    const today = new Date().toDateString();
    const recentEntries = sortedHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        const diffDays = Math.floor((new Date() - entryDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 1;
    });
    
    if (recentEntries.length > 0) {
        currentStreak = recentEntries.length;
    }
    
    // Calculate average per week
    const weeks = Math.max(1, Math.ceil((new Date() - new Date(sortedHistory[0].timestamp)) / (1000 * 60 * 60 * 24 * 7)));
    const averagePerWeek = history.length / weeks;
    
    return {
        totalCheckIns: history.length,
        longestStreak: longestStreak,
        currentStreak: currentStreak,
        averagePerWeek: averagePerWeek.toFixed(1)
    };
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

// Make functions available globally
window.recordMood = recordMood;
window.getMoodTrends = getMoodTrends;
window.getMoodSuggestions = getMoodSuggestions;
window.getCheckInHistory = getCheckInHistory;
window.getCheckInStats = getCheckInStats;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeCheckIn();
});
