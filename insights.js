// ============================================
// MINDHAVEN - Emotional Insights Module
// ============================================

// Insights State
const Insights = {
    patterns: [],
    suggestions: []
};

// Initialize Insights Module
function initializeInsights() {
    console.log('📊 Initializing Insights module...');
    analyzePatterns();
    generateSuggestions();
    displayInsights();
    renderProgressDashboard();
    console.log('✅ Insights module initialized');
}

// ============================================
// PATTERN ANALYSIS
// ============================================

function analyzePatterns() {
    const checkIns = MindHaven.userData.checkIns || [];
    const journalEntries = MindHaven.userData.journalEntries || [];
    
    Insights.patterns = [];
    
    if (checkIns.length < 3) {
        Insights.patterns.push({
            type: 'info',
            icon: '📊',
            message: 'Complete more check-ins to see your emotional patterns emerge.'
        });
        return;
    }
    
    // Analyze mood trends
    const moodTrends = getMoodTrends(7);
    
    if (moodTrends.trend === 'declining') {
        Insights.patterns.push({
            type: 'warning',
            icon: '⚠️',
            message: 'Your mood has been lower lately. This is okay, but consider reaching out for support.'
        });
    } else if (moodTrends.trend === 'improving') {
        Insights.patterns.push({
            type: 'positive',
            icon: '🌱',
            message: 'Your mood has been improving. Keep doing what you\'re doing!'
        });
    }
    
    // Analyze stress levels
    const recentStress = checkIns.slice(-7).filter(checkIn => {
        if (Array.isArray(checkIn.moods)) {
            return checkIn.moods.includes('anxious') || checkIn.moods.includes('overwhelmed');
        }
        return false;
    });
    
    if (recentStress.length >= 4) {
        Insights.patterns.push({
            type: 'warning',
            icon: '😰',
            message: 'Stress has been higher lately. Consider using coping tools more frequently.'
        });
    }
    
    // Analyze energy levels
    const recentLowEnergy = checkIns.slice(-7).filter(checkIn => {
        if (Array.isArray(checkIn.moods)) {
            return checkIn.moods.includes('exhausted') || checkIn.moods.includes('low');
        }
        return false;
    });
    
    if (recentLowEnergy.length >= 4) {
        Insights.patterns.push({
            type: 'info',
            icon: '😴',
            message: 'Energy has been lower. Rest is productive. Consider the low energy mode.'
        });
    }
    
    // Analyze journal sentiment
    const journalSentiment = analyzeJournalMoods();
    if (journalSentiment === 'generally-negative') {
        Insights.patterns.push({
            type: 'gentle',
            icon: '💜',
            message: 'Your journal entries have been reflecting difficult emotions. You\'re not alone.'
        });
    } else if (journalSentiment === 'generally-positive') {
        Insights.patterns.push({
            type: 'positive',
            icon: '💚',
            message: 'Your journal entries show more positive moments. Celebrate this!'
        });
    }
    
    // Check-in consistency
    const checkInStats = getCheckInStats();
    if (checkInStats.currentStreak >= 3) {
        Insights.patterns.push({
            type: 'positive',
            icon: '🔥',
            message: `You're on a ${checkInStats.currentStreak}-day check-in streak!`
        });
    }
    
    // NEW: Analyze assessment trends
    analyzeAssessmentPatterns();
    
    // NEW: Analyze goal progress
    analyzeGoalPatterns();
    
    // NEW: Analyze habit streaks
    analyzeHabitPatterns();
    
    // NEW: Analyze guided journal mood tags
    analyzeGuidedJournalPatterns();
    
    // NEW: Analyze student burnout
    analyzeStudentPatterns();
    
    // If no patterns found
    if (Insights.patterns.length === 0) {
        Insights.patterns.push({
            type: 'info',
            icon: '📊',
            message: 'Your patterns are stable. Continue checking in to see more insights.'
        });
    }
}

// ============================================
// NEW PATTERN ANALYSIS FUNCTIONS
// ============================================

function analyzeAssessmentPatterns() {
    if (!MindHaven.userData.assessments || !MindHaven.userData.assessments.lifeAssessments) return;
    
    const assessments = MindHaven.userData.assessments.lifeAssessments;
    if (assessments.length < 2) return;
    
    const latest = assessments[assessments.length - 1];
    const previous = assessments[assessments.length - 2];
    
    // Compare emotional wellbeing scores
    if (latest.scores.emotional && previous.scores.emotional) {
        const diff = latest.scores.emotional - previous.scores.emotional;
        if (diff >= 0.5) {
            Insights.patterns.push({
                type: 'positive',
                icon: '📈',
                message: 'Your emotional wellbeing assessment has improved!'
            });
        } else if (diff <= -0.5) {
            Insights.patterns.push({
                type: 'gentle',
                icon: '📉',
                message: 'Emotional wellbeing has decreased. Be gentle with yourself.'
            });
        }
    }
}

function analyzeGoalPatterns() {
    if (!MindHaven.userData.goals) return;
    
    const activeGoals = MindHaven.userData.goals.activeGoals || [];
    const completedGoals = MindHaven.userData.goals.completedGoals || [];
    
    if (activeGoals.length > 5) {
        Insights.patterns.push({
            type: 'info',
            icon: '🎯',
            message: 'You have many active goals. Consider focusing on fewer at a time.'
        });
    }
    
    if (completedGoals.length >= 3) {
        Insights.patterns.push({
            type: 'positive',
            icon: '🏆',
            message: `You've completed ${completedGoals.length} goals. Great progress!`
        });
    }
}

function analyzeHabitPatterns() {
    if (!MindHaven.userData.goals || !MindHaven.userData.goals.habitStreaks) return;
    
    const habitStreaks = MindHaven.userData.goals.habitStreaks;
    const streakValues = Object.values(habitStreaks);
    
    const longStreaks = streakValues.filter(s => s >= 7).length;
    if (longStreaks > 0) {
        Insights.patterns.push({
            type: 'positive',
            icon: '🔥',
            message: `You have ${longStreaks} habit${longStreaks > 1 ? 's' : ''} with 7+ day streaks!`
        });
    }
}

function analyzeGuidedJournalPatterns() {
    if (!MindHaven.userData.journal || !MindHaven.userData.journal.moodTags) return;
    
    const moodTags = MindHaven.userData.journal.moodTags;
    const recentTags = moodTags.slice(-20);
    
    const gratefulCount = recentTags.filter(t => t.tag === 'grateful').length;
    const anxiousCount = recentTags.filter(t => t.tag === 'anxious').length;
    
    if (gratefulCount >= 5) {
        Insights.patterns.push({
            type: 'positive',
            icon: '🙏',
            message: 'Your journal shows many moments of gratitude. This is wonderful.'
        });
    }
    
    if (anxiousCount >= 8) {
        Insights.patterns.push({
            type: 'gentle',
            icon: '💜',
            message: 'Journaling shows frequent anxiety. Consider the anxiety pathway.'
        });
    }
}

function analyzeStudentPatterns() {
    if (!MindHaven.userData.student) return;
    
    const burnoutAssessments = MindHaven.userData.student.burnoutAssessments || [];
    if (burnoutAssessments.length > 0) {
        const latest = burnoutAssessments[burnoutAssessments.length - 1];
        if (latest.riskLevel === 'High') {
            Insights.patterns.push({
                type: 'warning',
                icon: '🔥',
                message: 'Academic burnout risk is high. Consider reaching out for support.'
            });
        }
    }
    
    const studySessions = MindHaven.userData.student.studySessions || [];
    if (studySessions.length >= 5) {
        Insights.patterns.push({
            type: 'positive',
            icon: '📚',
            message: `You've completed ${studySessions.length} study sessions. Keep it up!`
        });
    }
}

// ============================================
// SUGGESTION GENERATION
// ============================================

function generateSuggestions() {
    Insights.suggestions = [];
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length === 0) {
        Insights.suggestions.push({
            icon: '🌱',
            text: 'Start by completing your first daily check-in'
        });
        return;
    }
    
    // Get most common mood from recent check-ins
    const recentMoods = checkIns.slice(-7);
    const moodCounts = {};
    
    recentMoods.forEach(checkIn => {
        if (Array.isArray(checkIn.moods)) {
            checkIn.moods.forEach(mood => {
                moodCounts[mood] = (moodCounts[mood] || 0) + 1;
            });
        }
    });
    
    // Find most common mood
    let mostCommonMood = null;
    let maxCount = 0;
    for (const mood in moodCounts) {
        if (moodCounts[mood] > maxCount) {
            maxCount = moodCounts[mood];
            mostCommonMood = mood;
        }
    }
    
    // Generate suggestions based on most common mood
    if (mostCommonMood) {
        switch(mostCommonMood) {
            case 'anxious':
            case 'overwhelmed':
                Insights.suggestions.push({
                    icon: '🫁',
                    text: 'Try the breathing exercise to calm your nervous system'
                });
                Insights.suggestions.push({
                    icon: '🌍',
                    text: 'Use the 5-4-3-2-1 grounding technique'
                });
                break;
            case 'low':
            case 'exhausted':
                Insights.suggestions.push({
                    icon: '😔',
                    text: 'Consider using low energy mode for tiny goals'
                });
                Insights.suggestions.push({
                    icon: '🌙',
                    text: 'Rest without guilt - it\'s productive'
                });
                break;
            case 'overthinking':
                Insights.suggestions.push({
                    icon: '🧠',
                    text: 'Try the overthinking breaker tool'
                });
                Insights.suggestions.push({
                    icon: '📔',
                    text: 'Write your thoughts in your journal'
                });
                break;
            case 'numb':
                Insights.suggestions.push({
                    icon: '🌍',
                    text: 'Try grounding exercises to reconnect with your senses'
                });
                Insights.suggestions.push({
                    icon: '🧘',
                    text: 'Spend time in calm space with gentle ambience'
                });
                break;
            default:
                Insights.suggestions.push({
                    icon: '🌱',
                    text: 'Continue your current coping strategies'
                });
        }
    }
    
    // General suggestions
    const journalStats = getJournalStats();
    if (journalStats.thisWeek === 0) {
        Insights.suggestions.push({
            icon: '📔',
            text: 'Try journaling this week to process your thoughts'
        });
    }
    
    const copingToolsUsed = MindHaven.userData.stats.copingToolsUsed;
    if (copingToolsUsed < 3) {
        Insights.suggestions.push({
            icon: '🧰',
            text: 'Explore different coping tools to find what works for you'
        });
    }
    
    // NEW: Suggestions based on new systems
    generateNewSystemSuggestions();
    
    // If no suggestions
    if (Insights.suggestions.length === 0) {
        Insights.suggestions.push({
            icon: '💚',
            text: 'You\'re doing great. Keep taking care of yourself.'
        });
    }
}

// ============================================
// NEW SUGGESTION FUNCTIONS
// ============================================

function generateNewSystemSuggestions() {
    // Assessment suggestions
    if (MindHaven.userData.assessments && MindHaven.userData.assessments.lifeAssessments) {
        const assessments = MindHaven.userData.assessments.lifeAssessments;
        if (assessments.length === 0) {
            Insights.suggestions.push({
                icon: '📊',
                text: 'Take a life assessment to understand your wellness better'
            });
        } else if (assessments.length > 0) {
            const daysSinceLast = (new Date() - new Date(assessments[assessments.length - 1].date)) / (1000 * 60 * 60 * 24);
            if (daysSinceLast > 30) {
                Insights.suggestions.push({
                    icon: '📊',
                    text: 'Consider retaking your life assessment to track progress'
                });
            }
        }
    }
    
    // Goal suggestions
    if (MindHaven.userData.goals && MindHaven.userData.goals.activeGoals) {
        const activeGoals = MindHaven.userData.goals.activeGoals;
        if (activeGoals.length === 0) {
            Insights.suggestions.push({
                icon: '🎯',
                text: 'Set a goal to give yourself something to work toward'
            });
        } else if (activeGoals.length > 0) {
            const microGoals = MindHaven.userData.goals.microGoals || [];
            const completedToday = microGoals.filter(mg => {
                if (mg.completedAt) {
                    return new Date(mg.completedAt).toDateString() === new Date().toDateString();
                }
                return false;
            }).length;
            
            if (completedToday === 0) {
                Insights.suggestions.push({
                    icon: '✨',
                    text: 'Try completing a micro goal today'
                });
            }
        }
    }
    
    // Decision support suggestion
    if (MindHaven.userData.decisions && MindHaven.userData.decisions.history) {
        const decisions = MindHaven.userData.decisions.history;
        const pending = decisions.filter(d => d.status === 'pending');
        if (pending.length > 0) {
            Insights.suggestions.push({
                icon: '🤔',
                text: `You have ${pending.length} decision${pending.length > 1 ? 's' : ''} to record outcomes for`
            });
        }
    }
    
    // Guided journal suggestion
    if (MindHaven.userData.journal && MindHaven.userData.journal.pathways) {
        const pathways = MindHaven.userData.journal.pathways;
        const daysSinceLast = pathways.length > 0 
            ? (new Date() - new Date(pathways[pathways.length - 1].createdAt)) / (1000 * 60 * 60 * 24)
            : Infinity;
        
        if (daysSinceLast > 7) {
            Insights.suggestions.push({
                icon: '📔',
                text: 'Try a guided journal pathway for structured reflection'
            });
        }
    }
    
    // Support circle suggestion
    if (MindHaven.userData.support && MindHaven.userData.support.circle) {
        const circle = MindHaven.userData.support.circle;
        if (circle.length === 0) {
            Insights.suggestions.push({
                icon: '🫂',
                text: 'Build your support circle with people you trust'
            });
        }
    }
    
    // Safety plan suggestion
    if (MindHaven.userData.support && MindHaven.userData.support.safetyPlan) {
        const safetyPlan = MindHaven.userData.support.safetyPlan.currentPlan;
        if (!safetyPlan) {
            Insights.suggestions.push({
                icon: '🛡️',
                text: 'Create a safety plan for difficult moments'
            });
        } else {
            const daysSinceUpdate = (new Date() - new Date(safetyPlan.updatedAt)) / (1000 * 60 * 60 * 24);
            if (daysSinceUpdate > 90) {
                Insights.suggestions.push({
                    icon: '🛡️',
                    text: 'Review and update your safety plan'
                });
            }
        }
    }
}

// ============================================
// DISPLAY INSIGHTS
// ============================================

function displayInsights() {
    const insightsList = document.getElementById('insightsList');
    const suggestionsList = document.getElementById('suggestionsList');
    
    if (insightsList) {
        if (Insights.patterns.length === 0) {
            insightsList.innerHTML = '<p class="empty-state">Check in daily to see your emotional patterns emerge.</p>';
        } else {
            let html = '';
            Insights.patterns.forEach(pattern => {
                const bgColor = getPatternColor(pattern.type);
                html += `
                    <div class="insight-item" style="background: ${bgColor}11; border-left: 4px solid ${bgColor};">
                        <span class="insight-icon">${pattern.icon}</span>
                        <span class="insight-text">${pattern.message}</span>
                    </div>
                `;
            });
            insightsList.innerHTML = html;
        }
    }
    
    if (suggestionsList) {
        if (Insights.suggestions.length === 0) {
            suggestionsList.innerHTML = '<p class="empty-state">Based on your patterns, we\'ll share gentle suggestions here.</p>';
        } else {
            let html = '';
            Insights.suggestions.forEach(suggestion => {
                html += `
                    <div class="suggestion-item">
                        <span class="suggestion-icon">${suggestion.icon}</span>
                        <span class="suggestion-text">${suggestion.text}</span>
                    </div>
                `;
            });
            suggestionsList.innerHTML = html;
        }
    }
    
    // Display mood chart
    displayMoodChart();
}

function getPatternColor(type) {
    switch(type) {
        case 'warning':
            return '#E57373';
        case 'positive':
            return '#A8C3A1';
        case 'gentle':
            return '#B8A7D1';
        case 'info':
        default:
            return '#8FAACF';
    }
}

// ============================================
// MOOD CHART
// ============================================

function displayMoodChart() {
    const chartContainer = document.getElementById('moodChart');
    if (!chartContainer) return;
    
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length < 3) {
        chartContainer.innerHTML = '<p class="empty-state">Your mood trends will appear here over time.</p>';
        return;
    }
    
    // Get last 14 days of check-ins
    const days = 14;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentCheckIns = checkIns.filter(
        checkIn => new Date(checkIn.date) >= cutoffDate
    );
    
    if (recentCheckIns.length === 0) {
        chartContainer.innerHTML = '<p class="empty-state">Your mood trends will appear here over time.</p>';
        return;
    }
    
    // Create a simple bar chart visualization
    let html = '<div class="mood-chart-bars">';
    
    // Group by date
    const dateGroups = {};
    recentCheckIns.forEach(checkIn => {
        const date = new Date(checkIn.date).toDateString();
        if (!dateGroups[date]) {
            dateGroups[date] = [];
        }
        dateGroups[date].push(checkIn);
    });
    
    // Calculate mood score for each day
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
    
    Object.keys(dateGroups).forEach(date => {
        const dayCheckIns = dateGroups[date];
        let totalScore = 0;
        let count = 0;
        
        dayCheckIns.forEach(checkIn => {
            if (Array.isArray(checkIn.moods)) {
                checkIn.moods.forEach(mood => {
                    if (moodScores[mood]) {
                        totalScore += moodScores[mood];
                        count++;
                    }
                });
            }
        });
        
        const avgScore = count > 0 ? totalScore / count : 3;
        const heightPercent = (avgScore / 5) * 100;
        const barColor = avgScore >= 4 ? '#A8C3A1' : avgScore >= 3 ? '#8FAACF' : '#E57373';
        
        const shortDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        html += `
            <div class="chart-bar-container">
                <div class="chart-bar" style="height: ${heightPercent}%; background: ${barColor};" title="${shortDate}: ${avgScore.toFixed(1)}/5"></div>
                <span class="chart-label">${shortDate}</span>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Add legend
    html += `
        <div class="chart-legend">
            <div class="legend-item">
                <span class="legend-color" style="background: #A8C3A1;"></span>
                <span>Good</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background: #8FAACF;"></span>
                <span>Okay</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background: #E57373;"></span>
                <span>Low</span>
            </div>
        </div>
    `;
    
    chartContainer.innerHTML = html;
}

// ============================================
// PROGRESS DASHBOARD
// ============================================

function renderProgressDashboard() {
    const dashboardContainer = document.getElementById('progressDashboard');
    if (!dashboardContainer) return;
    
    let html = `
        <div class="progress-overview">
            <div class="progress-summary-card">
                <h2>Activity Summary</h2>
                ${renderActivitySummary()}
            </div>
            
            <div class="progress-summary-card">
                <h2>Achievement Progress</h2>
                ${renderAchievementProgress()}
            </div>
        </div>
        
        <div class="progress-charts">
            <div class="progress-chart-card">
                <h2>Weekly Mood Trend</h2>
                ${renderWeeklyMoodChart()}
            </div>
            
            <div class="progress-chart-card">
                <h2>Activity Distribution</h2>
                ${renderActivityDistribution()}
            </div>
        </div>
    `;
    
    dashboardContainer.innerHTML = html;
}

function renderActivitySummary() {
    const checkIns = MindHaven.userData.checkIns || [];
    const journalEntries = MindHaven.userData.journalEntries || [];
    const gratitudeEntries = MindHaven.userData.gratitude?.entries || [];
    const morningCheckIns = MindHaven.userData.dailyCheckIn?.morningCheckIns || [];
    const eveningCheckIns = MindHaven.userData.dailyCheckIn?.eveningCheckIns || [];
    
    const totalCheckIns = checkIns.length;
    const totalJournals = journalEntries.length;
    const totalGratitude = gratitudeEntries.length;
    const totalDailyCheckIns = morningCheckIns.length + eveningCheckIns.length;
    
    return `
        <div class="activity-stats">
            <div class="activity-stat">
                <span class="activity-icon">😌</span>
                <span class="activity-value">${totalCheckIns}</span>
                <span class="activity-label">Mood Check-Ins</span>
            </div>
            <div class="activity-stat">
                <span class="activity-icon">📔</span>
                <span class="activity-value">${totalJournals}</span>
                <span class="activity-label">Journal Entries</span>
            </div>
            <div class="activity-stat">
                <span class="activity-icon">🙏</span>
                <span class="activity-value">${totalGratitude}</span>
                <span class="activity-label">Gratitude Entries</span>
            </div>
            <div class="activity-stat">
                <span class="activity-icon">🌅</span>
                <span class="activity-value">${totalDailyCheckIns}</span>
                <span class="activity-label">Daily Check-Ins</span>
            </div>
        </div>
    `;
}

function renderAchievementProgress() {
    const achievements = MindHaven.userData.achievements || [];
    const totalAchievements = 20; // Total possible achievements
    const unlockedCount = achievements.length;
    const progressPercent = (unlockedCount / totalAchievements) * 100;
    
    return `
        <div class="achievement-progress">
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="achievement-stats">
                <span class="achievement-count">${unlockedCount}/${totalAchievements}</span>
                <span class="achievement-percent">${progressPercent.toFixed(0)}%</span>
            </div>
            <p class="achievement-message">${getAchievementMessage(progressPercent)}</p>
        </div>
    `;
}

function getAchievementMessage(percent) {
    if (percent === 0) return "Start your journey by completing your first check-in!";
    if (percent < 25) return "Great start! Keep exploring the app.";
    if (percent < 50) return "You're making good progress!";
    if (percent < 75) return "Almost halfway there! Keep it up.";
    if (percent < 100) return "So close to completing all achievements!";
    return "Amazing! You've unlocked all achievements!";
}

function renderWeeklyMoodChart() {
    const checkIns = MindHaven.userData.checkIns || [];
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toDateString());
    }
    
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
    
    let html = '<div class="simple-chart">';
    
    last7Days.forEach(date => {
        const dayCheckIns = checkIns.filter(c => new Date(c.date).toDateString() === date);
        let avgScore = 3;
        
        if (dayCheckIns.length > 0) {
            let totalScore = 0;
            let count = 0;
            
            dayCheckIns.forEach(checkIn => {
                if (Array.isArray(checkIn.moods)) {
                    checkIn.moods.forEach(mood => {
                        if (moodScores[mood]) {
                            totalScore += moodScores[mood];
                            count++;
                        }
                    });
                }
            });
            
            avgScore = count > 0 ? totalScore / count : 3;
        }
        
        const heightPercent = (avgScore / 5) * 100;
        const barColor = avgScore >= 4 ? '#A8C3A1' : avgScore >= 3 ? '#8FAACF' : '#E57373';
        const shortDate = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        
        html += `
            <div class="chart-bar-container">
                <div class="chart-bar" style="height: ${heightPercent}%; background: ${barColor};" title="${shortDate}: ${avgScore.toFixed(1)}/5"></div>
                <span class="chart-label">${shortDate}</span>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderActivityDistribution() {
    const checkIns = MindHaven.userData.checkIns || [];
    const journalEntries = MindHaven.userData.journalEntries || [];
    const gratitudeEntries = MindHaven.userData.gratitude?.entries || [];
    const dailyCheckIns = (MindHaven.userData.dailyCheckIn?.morningCheckIns?.length || 0) + 
                        (MindHaven.userData.dailyCheckIn?.eveningCheckIns?.length || 0);
    
    const total = checkIns.length + journalEntries.length + gratitudeEntries.length + dailyCheckIns;
    
    if (total === 0) {
        return '<p class="empty-state">No activity data yet. Start using the app to see your activity distribution!</p>';
    }
    
    const moodPercent = ((checkIns.length / total) * 100).toFixed(0);
    const journalPercent = ((journalEntries.length / total) * 100).toFixed(0);
    const gratitudePercent = ((gratitudeEntries.length / total) * 100).toFixed(0);
    const checkinPercent = ((dailyCheckIns / total) * 100).toFixed(0);
    
    return `
        <div class="activity-distribution">
            <div class="distribution-item">
                <div class="distribution-bar">
                    <div class="distribution-fill" style="width: ${moodPercent}%; background: #A8C3A1;"></div>
                </div>
                <div class="distribution-label">
                    <span>Mood Tracking</span>
                    <span>${moodPercent}%</span>
                </div>
            </div>
            <div class="distribution-item">
                <div class="distribution-bar">
                    <div class="distribution-fill" style="width: ${journalPercent}%; background: #8FAACF;"></div>
                </div>
                <div class="distribution-label">
                    <span>Journal</span>
                    <span>${journalPercent}%</span>
                </div>
            </div>
            <div class="distribution-item">
                <div class="distribution-bar">
                    <div class="distribution-fill" style="width: ${gratitudePercent}%; background: #FFB74D;"></div>
                </div>
                <div class="distribution-label">
                    <span>Gratitude</span>
                    <span>${gratitudePercent}%</span>
                </div>
            </div>
            <div class="distribution-item">
                <div class="distribution-bar">
                    <div class="distribution-fill" style="width: ${checkinPercent}%; background: #7CB8A6;"></div>
                </div>
                <div class="distribution-label">
                    <span>Daily Check-In</span>
                    <span>${checkinPercent}%</span>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// UPDATE FUNCTION
// ============================================

function updateInsights() {
    analyzePatterns();
    generateSuggestions();
    displayInsights();
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.initializeInsights = initializeInsights;
window.updateInsights = updateInsights;
window.renderProgressDashboard = renderProgressDashboard;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Insights are initialized when the section is navigated to
});
