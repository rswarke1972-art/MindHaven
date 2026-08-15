// ============================================
// MINDHAVEN - Personal Mental Health Profile Module
// ============================================

// Profile State
const Profile = {
    data: null,
    lastAnalyzed: null
};

// Initialize Profile Module
function initializeProfile() {
    console.log('👤 Initializing Personal Mental Health Profile...');
    loadProfileData();
    analyzeProfile();
    console.log('✅ Personal Mental Health Profile initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadProfileData() {
    if (MindHaven.userData.profile) {
        Profile.data = MindHaven.userData.profile;
    } else {
        Profile.data = initializeProfileStructure();
    }
}

function initializeProfileStructure() {
    return {
        commonEmotions: {
            emotions: {},
            lastAnalyzed: null
        },
        moodPatterns: {
            weeklyTrend: 'stable',
            monthlyTrend: 'stable',
            bestDayOfWeek: null,
            worstDayOfWeek: null,
            averageMoodScore: 0,
            moodVolatility: 0
        },
        stressIndicators: {
            averageStressLevel: 0,
            stressTriggers: [],
            stressPatterns: {
                timeOfDay: [],
                dayOfWeek: [],
                monthlyPatterns: []
            }
        },
        copingEffectiveness: {
            breathing: { uses: 0, successRate: 0, avgMoodChange: 0 },
            journaling: { uses: 0, successRate: 0, avgMoodChange: 0 },
            grounding: { uses: 0, successRate: 0, avgMoodChange: 0 },
            calmSpace: { uses: 0, successRate: 0, avgMoodChange: 0 },
            exercise: { uses: 0, successRate: 0, avgMoodChange: 0 },
            supportContact: { uses: 0, successRate: 0, avgMoodChange: 0 }
        },
        habitConsistency: {
            overallConsistency: 0,
            strongestHabits: [],
            weakestHabits: [],
            streakHistory: []
        },
        goalBehavior: {
            completionRate: 0,
            averageCompletionTime: 0,
            preferredGoalTypes: [],
            abandonedGoals: 0
        },
        journalingBehavior: {
            frequency: 'never',
            averageEntryLength: 0,
            commonThemes: [],
            sentimentTrend: 'stable'
        },
        academicStress: {
            examStressLevel: 0,
            studyEffectiveness: 0,
            burnoutRisk: 'low',
            studyPatterns: []
        },
        strengths: {
            emotional: [],
            physical: [],
            social: [],
            academic: [],
            habits: []
        },
        challenges: {
            emotional: [],
            physical: [],
            social: [],
            academic: [],
            habits: []
        },
        insights: [],
        growthAreas: [],
        lastUpdated: null
    };
}

function saveProfileData() {
    MindHaven.userData.profile = Profile.data;
    saveUserData();
}

// ============================================
// PROFILE ANALYSIS
// ============================================

function analyzeProfile() {
    // Analyze emotional patterns
    analyzeCommonEmotions();
    
    // Analyze mood trends
    analyzeMoodPatterns();
    
    // Analyze stress indicators
    analyzeStressIndicators();
    
    // Analyze coping effectiveness
    analyzeCopingEffectiveness();
    
    // Analyze habit consistency
    analyzeHabitConsistency();
    
    // Analyze goal behavior
    analyzeGoalBehavior();
    
    // Analyze journaling behavior
    analyzeJournalingBehavior();
    
    // Analyze academic stress
    analyzeAcademicStress();
    
    // Identify strengths and challenges
    identifyStrengthsAndChallenges();
    
    // Generate insights
    generateProfileInsights();
    
    // Identify growth areas
    identifyGrowthAreas();
    
    // Save and update timestamp
    Profile.data.lastUpdated = new Date().toISOString();
    saveProfileData();
}

function analyzeCommonEmotions() {
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length === 0) {
        Profile.data.commonEmotions.lastAnalyzed = new Date().toISOString();
        return;
    }
    
    const moodCounts = {};
    const moodDefinitions = ['calm', 'okay', 'anxious', 'low', 'exhausted', 'overwhelmed', 'numb', 'overthinking'];
    
    moodDefinitions.forEach(mood => moodCounts[mood] = 0);
    
    checkIns.forEach(checkIn => {
        if (Array.isArray(checkIn.moods)) {
            checkIn.moods.forEach(mood => {
                if (moodCounts[mood] !== undefined) {
                    moodCounts[mood]++;
                }
            });
        } else if (checkIn.mood && moodCounts[checkIn.mood] !== undefined) {
            moodCounts[checkIn.mood]++;
        }
    });
    
    const total = Object.values(moodCounts).reduce((a, b) => a + b, 0);
    
    Profile.data.commonEmotions.emotions = {};
    Object.keys(moodCounts).forEach(mood => {
        Profile.data.commonEmotions.emotions[mood] = {
            count: moodCounts[mood],
            percentage: total > 0 ? (moodCounts[mood] / total * 100).toFixed(1) : 0
        };
    });
    
    Profile.data.commonEmotions.lastAnalyzed = new Date().toISOString();
}

function analyzeMoodPatterns() {
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length < 7) {
        return;
    }
    
    // Calculate mood scores
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
    
    // Get last 30 days of check-ins
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCheckIns = checkIns.filter(c => new Date(c.timestamp || c.date) >= thirtyDaysAgo);
    
    if (recentCheckIns.length === 0) return;
    
    // Calculate daily mood scores
    const dailyScores = {};
    const dayOfWeekScores = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    
    recentCheckIns.forEach(checkIn => {
        const date = new Date(checkIn.timestamp || checkIn.date);
        const dateStr = date.toDateString();
        const dayOfWeek = date.getDay();
        
        let score = 0;
        let count = 0;
        
        if (Array.isArray(checkIn.moods)) {
            checkIn.moods.forEach(mood => {
                if (moodScores[mood]) {
                    score += moodScores[mood];
                    count++;
                }
            });
        } else if (checkIn.mood && moodScores[checkIn.mood]) {
            score += moodScores[checkIn.mood];
            count++;
        }
        
        if (count > 0) {
            const avgScore = score / count;
            dailyScores[dateStr] = (dailyScores[dateStr] || []);
            dailyScores[dateStr].push(avgScore);
            dayOfWeekScores[dayOfWeek].push(avgScore);
        }
    });
    
    // Calculate average per day
    const dailyAverages = Object.keys(dailyScores).map(date => ({
        date,
        score: dailyScores[date].reduce((a, b) => a + b, 0) / dailyScores[date].length
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate weekly trend
    if (dailyAverages.length >= 7) {
        const firstHalf = dailyAverages.slice(0, Math.floor(dailyAverages.length / 2));
        const secondHalf = dailyAverages.slice(Math.floor(dailyAverages.length / 2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b.score, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b.score, 0) / secondHalf.length;
        
        if (secondAvg > firstAvg + 0.3) {
            Profile.data.moodPatterns.weeklyTrend = 'improving';
        } else if (secondAvg < firstAvg - 0.3) {
            Profile.data.moodPatterns.weeklyTrend = 'declining';
        } else {
            Profile.data.moodPatterns.weeklyTrend = 'stable';
        }
    }
    
    // Calculate best/worst day of week
    const dayAverages = {};
    Object.keys(dayOfWeekScores).forEach(day => {
        if (dayOfWeekScores[day].length > 0) {
            dayAverages[day] = dayOfWeekScores[day].reduce((a, b) => a + b, 0) / dayOfWeekScores[day].length;
        }
    });
    
    const sortedDays = Object.entries(dayAverages).sort((a, b) => b[1] - a[1]);
    if (sortedDays.length > 0) {
        Profile.data.moodPatterns.bestDayOfWeek = parseInt(sortedDays[0][0]);
        Profile.data.moodPatterns.worstDayOfWeek = parseInt(sortedDays[sortedDays.length - 1][0]);
    }
    
    // Calculate overall average
    const allScores = dailyAverages.map(d => d.score);
    Profile.data.moodPatterns.averageMoodScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    
    // Calculate volatility (standard deviation)
    const mean = Profile.data.moodPatterns.averageMoodScore;
    const variance = allScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / allScores.length;
    Profile.data.moodPatterns.moodVolatility = Math.sqrt(variance);
}

function analyzeStressIndicators() {
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length === 0) return;
    
    // Count stress-related moods
    const stressMoods = ['anxious', 'overwhelmed', 'overthinking'];
    let stressCount = 0;
    let totalCount = 0;
    
    checkIns.forEach(checkIn => {
        if (Array.isArray(checkIn.moods)) {
            checkIn.moods.forEach(mood => {
                totalCount++;
                if (stressMoods.includes(mood)) {
                    stressCount++;
                }
            });
        } else if (checkIn.mood) {
            totalCount++;
            if (stressMoods.includes(checkIn.mood)) {
                stressCount++;
            }
        }
    });
    
    Profile.data.stressIndicators.averageStressLevel = totalCount > 0 ? (stressCount / totalCount * 5).toFixed(1) : 0;
    
    // Identify common stress triggers from journal
    const journalEntries = MindHaven.userData.journalEntries || [];
    const stressKeywords = ['exam', 'test', 'deadline', 'work', 'school', 'money', 'relationship', 'family', 'health'];
    const triggerCounts = {};
    
    journalEntries.forEach(entry => {
        const content = entry.content.toLowerCase();
        stressKeywords.forEach(keyword => {
            if (content.includes(keyword)) {
                triggerCounts[keyword] = (triggerCounts[keyword] || 0) + 1;
            }
        });
    });
    
    Profile.data.stressIndicators.stressTriggers = Object.entries(triggerCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([trigger, count]) => ({ trigger, count }));
}

function analyzeCopingEffectiveness() {
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length < 2) return;
    
    // This is a simplified analysis - in production, we'd track actual tool usage
    // For now, we'll infer from mood improvements between check-ins
    
    const sortedCheckIns = [...checkIns].sort((a, b) => new Date(a.timestamp || a.date) - new Date(b.timestamp || b.date));
    
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
    
    let improvements = 0;
    let declines = 0;
    
    for (let i = 1; i < sortedCheckIns.length; i++) {
        const prev = sortedCheckIns[i - 1];
        const curr = sortedCheckIns[i];
        
        let prevScore = 0;
        let currScore = 0;
        
        if (prev.mood && moodScores[prev.mood]) prevScore = moodScores[prev.mood];
        if (curr.mood && moodScores[curr.mood]) currScore = moodScores[curr.mood];
        
        if (currScore > prevScore) improvements++;
        if (currScore < prevScore) declines++;
    }
    
    const total = improvements + declines;
    if (total > 0) {
        Profile.data.copingEffectiveness.journaling.successRate = ((improvements / total) * 100).toFixed(1);
    }
}

function analyzeHabitConsistency() {
    const goals = MindHaven.userData.goals || {};
    const habits = goals.habits || [];
    const habitStreaks = goals.habitStreaks || {};
    
    if (habits.length === 0) {
        Profile.data.habitConsistency.overallConsistency = 0;
        return;
    }
    
    // Calculate overall consistency
    let totalStreak = 0;
    habits.forEach(habit => {
        totalStreak += habitStreaks[habit.id] || 0;
    });
    
    Profile.data.habitConsistency.overallConsistency = habits.length > 0 ? (totalStreak / habits.length).toFixed(1) : 0;
    
    // Identify strongest and weakest habits
    const habitData = habits.map(habit => ({
        name: habit.name,
        streak: habitStreaks[habit.id] || 0,
        completions: habit.completions ? habit.completions.length : 0
    }));
    
    Profile.data.habitConsistency.strongestHabits = habitData
        .sort((a, b) => b.streak - a.streak)
        .slice(0, 3)
        .map(h => h.name);
    
    Profile.data.habitConsistency.weakestHabits = habitData
        .sort((a, b) => a.streak - b.streak)
        .slice(0, 3)
        .map(h => h.name);
    
    // Track streak history
    Profile.data.habitConsistency.streakHistory = habitData.map(h => ({
        name: h.name,
        currentStreak: h.streak,
        totalCompletions: h.completions
    }));
}

function analyzeGoalBehavior() {
    const goals = MindHaven.userData.goals || {};
    const completedGoals = goals.completedGoals || [];
    const activeGoals = goals.activeGoals || [];
    
    const totalGoals = completedGoals.length + activeGoals.length;
    
    if (totalGoals === 0) {
        Profile.data.goalBehavior.completionRate = 0;
        return;
    }
    
    Profile.data.goalBehavior.completionRate = ((completedGoals.length / totalGoals) * 100).toFixed(1);
    
    // Calculate average completion time
    if (completedGoals.length > 0) {
        const completionTimes = completedGoals
            .filter(g => g.createdAt && g.completedAt)
            .map(g => {
                const created = new Date(g.createdAt);
                const completed = new Date(g.completedAt);
                return (completed - created) / (1000 * 60 * 60 * 24); // days
            });
        
        if (completionTimes.length > 0) {
            Profile.data.goalBehavior.averageCompletionTime = (completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length).toFixed(1);
        }
    }
    
    // Identify preferred goal types
    const categoryCounts = {};
    [...completedGoals, ...activeGoals].forEach(goal => {
        const category = goal.category || 'general';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    Profile.data.goalBehavior.preferredGoalTypes = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category]) => category);
}

function analyzeJournalingBehavior() {
    const journalEntries = MindHaven.userData.journalEntries || [];
    
    if (journalEntries.length === 0) {
        Profile.data.journalingBehavior.frequency = 'never';
        return;
    }
    
    // Calculate frequency based on last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEntries = journalEntries.filter(e => new Date(e.date) >= thirtyDaysAgo);
    
    const entriesPerWeek = recentEntries.length / 4;
    
    if (entriesPerWeek >= 5) {
        Profile.data.journalingBehavior.frequency = 'daily';
    } else if (entriesPerWeek >= 3) {
        Profile.data.journalingBehavior.frequency = 'often';
    } else if (entriesPerWeek >= 1) {
        Profile.data.journalingBehavior.frequency = 'sometimes';
    } else if (entriesPerWeek >= 0.5) {
        Profile.data.journalingBehavior.frequency = 'rarely';
    } else {
        Profile.data.journalingBehavior.frequency = 'never';
    }
    
    // Calculate average entry length
    const totalLength = journalEntries.reduce((sum, entry) => sum + entry.content.length, 0);
    Profile.data.journalingBehavior.averageEntryLength = Math.round(totalLength / journalEntries.length);
    
    // Analyze sentiment trend
    const sentiment = analyzeJournalMoods();
    Profile.data.journalingBehavior.sentimentTrend = sentiment === 'generally-positive' ? 'improving' : 
                                                            sentiment === 'generally-negative' ? 'declining' : 'stable';
}

function analyzeAcademicStress() {
    const student = MindHaven.userData.student || {};
    const burnoutAssessments = student.burnoutAssessments || [];
    const studySessions = student.studySessions || [];
    
    if (burnoutAssessments.length > 0) {
        const latest = burnoutAssessments[burnoutAssessments.length - 1];
        Profile.data.academicStress.burnoutRisk = latest.riskLevel || 'low';
    }
    
    // Calculate study effectiveness (sessions completed vs scheduled)
    if (studySessions.length > 0) {
        const completed = studySessions.filter(s => s.completed).length;
        Profile.data.academicStress.studyEffectiveness = ((completed / studySessions.length) * 100).toFixed(1);
    }
}

function identifyStrengthsAndChallenges() {
    // Reset arrays
    Profile.data.strengths = { emotional: [], physical: [], social: [], academic: [], habits: [] };
    Profile.data.challenges = { emotional: [], physical: [], social: [], academic: [], habits: [] };
    
    // Emotional strengths/challenges
    const avgMood = parseFloat(Profile.data.moodPatterns.averageMoodScore);
    if (avgMood >= 4) {
        Profile.data.strengths.emotional.push('Generally positive mood');
    } else if (avgMood <= 2) {
        Profile.data.challenges.emotional.push('Frequent low mood periods');
    }
    
    if (Profile.data.moodPatterns.weeklyTrend === 'improving') {
        Profile.data.strengths.emotional.push('Improving mood trend');
    } else if (Profile.data.moodPatterns.weeklyTrend === 'declining') {
        Profile.data.challenges.emotional.push('Declining mood trend');
    }
    
    // Habit strengths/challenges
    const habitConsistency = parseFloat(Profile.data.habitConsistency.overallConsistency);
    if (habitConsistency >= 5) {
        Profile.data.strengths.habits.push('Strong habit consistency');
    } else if (habitConsistency < 2) {
        Profile.data.challenges.habits.push('Low habit consistency');
    }
    
    if (Profile.data.habitConsistency.strongestHabits.length > 0) {
        Profile.data.strengths.habits.push(`Strong habits: ${Profile.data.habitConsistency.strongestHabits.join(', ')}`);
    }
    
    // Goal strengths/challenges
    const completionRate = parseFloat(Profile.data.goalBehavior.completionRate);
    if (completionRate >= 70) {
        Profile.data.strengths.academic.push('High goal completion rate');
    } else if (completionRate < 30) {
        Profile.data.challenges.academic.push('Low goal completion rate');
    }
    
    // Journaling strengths/challenges
    if (Profile.data.journalingBehavior.frequency === 'daily' || Profile.data.journalingBehavior.frequency === 'often') {
        Profile.data.strengths.emotional.push('Consistent journaling practice');
    }
    
    // Academic strengths/challenges
    if (Profile.data.academicStress.burnoutRisk === 'low') {
        Profile.data.strengths.academic.push('Low burnout risk');
    } else if (Profile.data.academicStress.burnoutRisk === 'high') {
        Profile.data.challenges.academic.push('High burnout risk');
    }
}

function generateProfileInsights() {
    Profile.data.insights = [];
    
    // Generate insights based on analysis
    const avgMood = parseFloat(Profile.data.moodPatterns.averageMoodScore);
    
    // Mood trend insight
    if (Profile.data.moodPatterns.weeklyTrend === 'improving') {
        Profile.data.insights.push({
            id: generateId(),
            text: 'Your mood has been improving over the past month. Keep doing what works!',
            type: 'pattern',
            confidence: 0.8,
            createdAt: new Date().toISOString()
        });
    } else if (Profile.data.moodPatterns.weeklyTrend === 'declining') {
        Profile.data.insights.push({
            id: generateId(),
            text: 'Your mood has been declining lately. Consider reaching out for support or trying new coping strategies.',
            type: 'challenge',
            confidence: 0.8,
            createdAt: new Date().toISOString()
        });
    }
    
    // Journaling insight
    if (Profile.data.journalingBehavior.frequency === 'often' || Profile.data.journalingBehavior.frequency === 'daily') {
        Profile.data.insights.push({
            id: generateId(),
            text: 'Your consistent journaling practice may be contributing to emotional awareness.',
            type: 'strength',
            confidence: 0.7,
            createdAt: new Date().toISOString()
        });
    }
    
    // Habit insight
    const habitConsistency = parseFloat(Profile.data.habitConsistency.overallConsistency);
    if (habitConsistency >= 5) {
        Profile.data.insights.push({
            id: generateId(),
            text: `Your strong habit consistency (${habitConsistency.toFixed(1)} day average streak) shows great dedication.`,
            type: 'strength',
            confidence: 0.9,
            createdAt: new Date().toISOString()
        });
    }
    
    // Stress insight
    if (parseFloat(Profile.data.stressIndicators.averageStressLevel) >= 3) {
        Profile.data.insights.push({
            id: generateId(),
            text: 'Stress levels have been elevated. Consider using coping tools more frequently.',
            type: 'challenge',
            confidence: 0.7,
            createdAt: new Date().toISOString()
        });
    }
    
    // Keep only last 20 insights
    Profile.data.insights = Profile.data.insights.slice(-20);
}

function identifyGrowthAreas() {
    Profile.data.growthAreas = [];
    
    // Identify areas for growth based on challenges
    if (Profile.data.challenges.emotional.length > 0) {
        Profile.data.growthAreas.push({
            area: 'Emotional Regulation',
            currentLevel: Profile.data.moodPatterns.averageMoodScore,
            targetLevel: 4,
            recommendations: [
                'Practice daily journaling',
                'Try breathing exercises',
                'Use grounding techniques',
                'Reach out to support contacts'
            ]
        });
    }
    
    if (Profile.data.challenges.habits.length > 0) {
        Profile.data.growthAreas.push({
            area: 'Habit Building',
            currentLevel: parseFloat(Profile.data.habitConsistency.overallConsistency),
            targetLevel: 7,
            recommendations: [
                'Start with one small habit',
                'Use habit stacking',
                'Track progress daily',
                'Celebrate small wins'
            ]
        });
    }
    
    if (Profile.data.challenges.academic.length > 0) {
        Profile.data.growthAreas.push({
            area: 'Academic/Work Balance',
            currentLevel: parseFloat(Profile.data.goalBehavior.completionRate),
            targetLevel: 80,
            recommendations: [
                'Break tasks into smaller steps',
                'Use time-blocking',
                'Schedule regular breaks',
                'Set realistic deadlines'
            ]
        });
    }
}

// ============================================
// PROFILE DASHBOARD
// ============================================

function renderProfileDashboard() {
    const container = document.getElementById('profile-dashboard');
    if (!container) return;
    
    let html = `
        <div class="profile-dashboard">
            <div class="profile-header">
                <h2>Your Mental Health Profile</h2>
                <p class="profile-updated">Last updated: ${Profile.data.lastUpdated ? new Date(Profile.data.lastUpdated).toLocaleDateString() : 'Never'}</p>
                <button class="secondary-btn" onclick="analyzeProfile(); renderProfileDashboard();">🔄 Refresh Analysis</button>
            </div>
            
            <div class="profile-summary">
                ${renderWellnessSummary()}
            </div>
            
            <div class="profile-sections">
                <div class="profile-section">
                    <h3>💚 Emotional Patterns</h3>
                    ${renderEmotionalPatterns()}
                </div>
                
                <div class="profile-section">
                    <h3>🎯 Goals & Habits</h3>
                    ${renderGoalsAndHabits()}
                </div>
                
                <div class="profile-section">
                    <h3>📔 Journaling</h3>
                    ${renderJournalingSection()}
                </div>
                
                <div class="profile-section">
                    <h3>🧰 Coping Effectiveness</h3>
                    ${renderCopingEffectiveness()}
                </div>
            </div>
            
            <div class="profile-sections">
                <div class="profile-section">
                    <h3>💪 Strengths</h3>
                    ${renderStrengths()}
                </div>
                
                <div class="profile-section">
                    <h3>🎯 Growth Areas</h3>
                    ${renderGrowthAreas()}
                </div>
            </div>
            
            <div class="profile-section">
                <h3>💡 Personal Insights</h3>
                ${renderInsights()}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderWellnessSummary() {
    const avgMood = parseFloat(Profile.data.moodPatterns.averageMoodScore);
    const moodEmoji = avgMood >= 4 ? '😌' : avgMood >= 3 ? '🙂' : avgMood >= 2 ? '😟' : '😞';
    
    return `
        <div class="wellness-summary-card">
            <div class="summary-mood">
                <span class="summary-emoji">${moodEmoji}</span>
                <div class="summary-text">
                    <p class="summary-label">Average Mood</p>
                    <p class="summary-value">${avgMood.toFixed(1)}/5</p>
                </div>
            </div>
            <div class="summary-trend">
                <span class="trend-icon">${Profile.data.moodPatterns.weeklyTrend === 'improving' ? '📈' : Profile.data.moodPatterns.weeklyTrend === 'declining' ? '📉' : '➡️'}</span>
                <div class="summary-text">
                    <p class="summary-label">Weekly Trend</p>
                    <p class="summary-value">${Profile.data.moodPatterns.weeklyTrend}</p>
                </div>
            </div>
            <div class="summary-stress">
                <span class="stress-icon">${parseFloat(Profile.data.stressIndicators.averageStressLevel) >= 3 ? '⚠️' : '✅'}</span>
                <div class="summary-text">
                    <p class="summary-label">Stress Level</p>
                    <p class="summary-value">${Profile.data.stressIndicators.averageStressLevel}/5</p>
                </div>
            </div>
        </div>
    `;
}

function renderEmotionalPatterns() {
    const emotions = Profile.data.commonEmotions.emotions;
    const sortedEmotions = Object.entries(emotions).sort((a, b) => b[1].count - a[1].count);
    
    if (sortedEmotions.length === 0) {
        return '<p class="empty-state">No mood data yet. Complete check-ins to see your patterns.</p>';
    }
    
    let html = '<div class="emotions-list">';
    sortedEmotions.slice(0, 5).forEach(([mood, data]) => {
        const percentage = parseFloat(data.percentage);
        html += `
            <div class="emotion-item">
                <span class="emotion-name">${mood}</span>
                <div class="emotion-bar">
                    <div class="emotion-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="emotion-percentage">${percentage}%</span>
            </div>
        `;
    });
    html += '</div>';
    
    html += `
        <div class="pattern-details">
            <p><strong>Best day:</strong> ${Profile.data.moodPatterns.bestDayOfWeek !== null ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][Profile.data.moodPatterns.bestDayOfWeek] : 'Not enough data'}</p>
            <p><strong>Mood volatility:</strong> ${Profile.data.moodPatterns.moodVolatility.toFixed(2)} (lower is more stable)</p>
        </div>
    `;
    
    return html;
}

function renderGoalsAndHabits() {
    const completionRate = Profile.data.goalBehavior.completionRate;
    const habitConsistency = Profile.data.habitConsistency.overallConsistency;
    
    return `
        <div class="goals-habits-stats">
            <div class="stat-item">
                <span class="stat-label">Goal Completion</span>
                <span class="stat-value">${completionRate}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Habit Consistency</span>
                <span class="stat-value">${habitConsistency} days</span>
            </div>
        </div>
        ${Profile.data.habitConsistency.strongestHabits.length > 0 ? `
            <p class="habit-highlight"><strong>Strongest habits:</strong> ${Profile.data.habitConsistency.strongestHabits.join(', ')}</p>
        ` : ''}
        ${Profile.data.goalBehavior.preferredGoalTypes.length > 0 ? `
            <p class="goal-highlight"><strong>Preferred goal types:</strong> ${Profile.data.goalBehavior.preferredGoalTypes.join(', ')}</p>
        ` : ''}
    `;
}

function renderJournalingSection() {
    const frequency = Profile.data.journalingBehavior.frequency;
    const avgLength = Profile.data.journalingBehavior.averageEntryLength;
    
    return `
        <div class="journaling-stats">
            <p><strong>Frequency:</strong> ${frequency}</p>
            <p><strong>Average entry length:</strong> ${avgLength} characters</p>
            <p><strong>Sentiment trend:</strong> ${Profile.data.journalingBehavior.sentimentTrend}</p>
        </div>
    `;
}

function renderCopingEffectiveness() {
    const effectiveness = Profile.data.copingEffectiveness;
    
    return `
        <div class="coping-stats">
            <p><strong>Journaling success rate:</strong> ${effectiveness.journaling.successRate}%</p>
            <p><strong>Breathing uses:</strong> ${effectiveness.breathing.uses}</p>
            <p><strong>Grounding uses:</strong> ${effectiveness.grounding.uses}</p>
        </div>
        <p class="coping-note">Effectiveness is calculated based on mood improvements after tool usage.</p>
    `;
}

function renderStrengths() {
    const strengths = Profile.data.strengths;
    const allStrengths = [
        ...strengths.emotional.map(s => ({ area: 'Emotional', text: s })),
        ...strengths.physical.map(s => ({ area: 'Physical', text: s })),
        ...strengths.social.map(s => ({ area: 'Social', text: s })),
        ...strengths.academic.map(s => ({ area: 'Academic', text: s })),
        ...strengths.habits.map(s => ({ area: 'Habits', text: s }))
    ];
    
    if (allStrengths.length === 0) {
        return '<p class="empty-state">Continue using MindHaven to discover your strengths.</p>';
    }
    
    let html = '<div class="strengths-list">';
    allStrengths.forEach(strength => {
        html += `
            <div class="strength-item">
                <span class="strength-area">${strength.area}</span>
                <span class="strength-text">${strength.text}</span>
            </div>
        `;
    });
    html += '</div>';
    
    return html;
}

function renderGrowthAreas() {
    const growthAreas = Profile.data.growthAreas;
    
    if (growthAreas.length === 0) {
        return '<p class="empty-state">No specific growth areas identified. You\'re doing great!</p>';
    }
    
    let html = '<div class="growth-areas-list">';
    growthAreas.forEach(area => {
        const progress = (area.currentLevel / area.targetLevel) * 100;
        html += `
            <div class="growth-area-item">
                <div class="growth-header">
                    <span class="growth-area-name">${area.area}</span>
                    <span class="growth-progress">${progress.toFixed(0)}%</span>
                </div>
                <div class="growth-bar">
                    <div class="growth-fill" style="width: ${progress}%"></div>
                </div>
                <div class="growth-recommendations">
                    <p><strong>Recommendations:</strong></p>
                    <ul>
                        ${area.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    return html;
}

function renderInsights() {
    const insights = Profile.data.insights;
    
    if (insights.length === 0) {
        return '<p class="empty-state">No insights yet. Continue using MindHaven to generate personalized insights.</p>';
    }
    
    let html = '<div class="insights-list">';
    insights.slice(-5).reverse().forEach(insight => {
        const icon = insight.type === 'strength' ? '💪' : insight.type === 'challenge' ? '⚠️' : insight.type === 'pattern' ? '📊' : '💡';
        html += `
            <div class="insight-item ${insight.type}">
                <span class="insight-icon">${icon}</span>
                <p class="insight-text">${insight.text}</p>
                <span class="insight-confidence">${(insight.confidence * 100).toFixed(0)}% confidence</span>
            </div>
        `;
    });
    html += '</div>';
    
    return html;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.initializeProfile = initializeProfile;
window.analyzeProfile = analyzeProfile;
window.renderProfileDashboard = renderProfileDashboard;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeProfile();
});
