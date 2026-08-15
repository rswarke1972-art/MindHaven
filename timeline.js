// ============================================
// MINDHAVEN - Emotional Timeline Module
// ============================================

// Timeline State
const Timeline = {
    data: null,
    filteredEvents: [],
    currentView: 'all', // all, week, month
    currentFilter: 'all' // all, checkin, journal, assessment, goal, habit, achievement, roadmap, emergency, support, milestone, insight, pattern
};

// Initialize Timeline Module
function initializeTimeline() {
    console.log('📅 Initializing Emotional Timeline...');
    loadTimelineData();
    populateTimeline();
    console.log('✅ Emotional Timeline initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadTimelineData() {
    if (MindHaven.userData.timeline) {
        Timeline.data = MindHaven.userData.timeline;
    } else {
        Timeline.data = initializeTimelineStructure();
    }
}

function initializeTimelineStructure() {
    return {
        events: [],
        milestones: [],
        stats: {
            totalEvents: 0,
            eventsByType: {},
            eventsByCategory: {},
            averageMoodByMonth: {},
            mostActiveMonths: [],
            longestStreaks: []
        },
        filters: {
            types: [],
            categories: [],
            dateRange: { start: null, end: null },
            mood: []
        },
        lastUpdated: null
    };
}

function saveTimelineData() {
    MindHaven.userData.timeline = Timeline.data;
    saveUserData();
}

// ============================================
// TIMELINE POPULATION
// ============================================

function populateTimeline() {
    // Clear existing events
    Timeline.data.events = [];
    Timeline.data.milestones = [];
    
    // Populate from check-ins
    populateCheckInEvents();
    
    // Populate from journal entries
    populateJournalEvents();
    
    // Populate from assessments
    populateAssessmentEvents();
    
    // Populate from goals
    populateGoalEvents();
    
    // Populate from habits
    populateHabitEvents();
    
    // Populate from achievements
    populateAchievementEvents();
    
    // Populate from roadmaps
    populateRoadmapEvents();
    
    // Populate from emergency activations
    populateEmergencyEvents();
    
    // Populate from support circle
    populateSupportEvents();
    
    // Populate from patterns
    populatePatternEvents();
    
    // Populate from profile insights
    populateInsightEvents();
    
    // Sort events by date
    Timeline.data.events.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update statistics
    updateTimelineStats();
    
    // Save
    Timeline.data.lastUpdated = new Date().toISOString();
    saveTimelineData();
}

function populateCheckInEvents() {
    const checkIns = MindHaven.userData.checkIns || [];
    
    checkIns.forEach(checkIn => {
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
        
        let moodScore = 0;
        let mood = null;
        
        if (Array.isArray(checkIn.moods)) {
            checkIn.moods.forEach(m => {
                if (moodScores[m]) moodScore += moodScores[m];
            });
            moodScore /= checkIn.moods.length;
            mood = checkIn.moods[0];
        } else if (checkIn.mood && moodScores[checkIn.mood]) {
            moodScore = moodScores[checkIn.mood];
            mood = checkIn.mood;
        }
        
        Timeline.data.events.push({
            id: generateId(),
            type: 'checkin',
            date: checkIn.timestamp || checkIn.date,
            title: 'Daily Check-in',
            description: `Mood: ${mood || 'Not specified'}`,
            data: { mood, notes: checkIn.notes },
            mood: mood,
            moodScore: moodScore,
            category: 'wellness',
            importance: 'medium'
        });
    });
}

function populateJournalEvents() {
    const journalEntries = MindHaven.userData.journalEntries || [];
    
    journalEntries.forEach(entry => {
        const preview = entry.content.length > 50 ? entry.content.substring(0, 50) + '...' : entry.content;
        
        Timeline.data.events.push({
            id: generateId(),
            type: 'journal',
            date: entry.date,
            title: 'Journal Entry',
            description: preview,
            data: { prompt: entry.prompt, content: entry.content, mood: entry.mood },
            mood: entry.mood || null,
            category: 'reflection',
            importance: 'medium'
        });
    });
}

function populateAssessmentEvents() {
    const assessments = MindHaven.userData.assessments || {};
    const lifeAssessments = assessments.lifeAssessments || [];
    
    lifeAssessments.forEach(assessment => {
        const avgScore = Object.values(assessment.scores || {}).reduce((a, b) => a + b, 0) / Object.keys(assessment.scores || {}).length;
        
        Timeline.data.events.push({
            id: generateId(),
            type: 'assessment',
            date: assessment.date,
            title: 'Life Assessment',
            description: `Overall score: ${avgScore.toFixed(1)}/5`,
            data: { scores: assessment.scores, type: assessment.type },
            mood: null,
            moodScore: avgScore,
            category: 'wellness',
            importance: 'high'
        });
    });
}

function populateGoalEvents() {
    const goals = MindHaven.userData.goals || {};
    const completedGoals = goals.completedGoals || [];
    const activeGoals = goals.activeGoals || [];
    
    completedGoals.forEach(goal => {
        Timeline.data.events.push({
            id: generateId(),
            type: 'goal',
            date: goal.completedAt,
            title: 'Goal Completed',
            description: goal.title,
            data: { category: goal.category, milestones: goal.milestones },
            mood: null,
            category: 'achievement',
            importance: 'high'
        });
    });
    
    activeGoals.forEach(goal => {
        Timeline.data.events.push({
            id: generateId(),
            type: 'goal',
            date: goal.createdAt,
            title: 'Goal Started',
            description: goal.title,
            data: { category: goal.category, milestones: goal.milestones, status: goal.status },
            mood: null,
            category: 'achievement',
            importance: 'medium'
        });
    });
}

function populateHabitEvents() {
    const goals = MindHaven.userData.goals || {};
    const habits = goals.habits || [];
    
    habits.forEach(habit => {
        habit.completions.forEach(completionDate => {
            Timeline.data.events.push({
                id: generateId(),
                type: 'habit',
                date: completionDate,
                title: 'Habit Completed',
                description: habit.name,
                data: { habitId: habit.id, frequency: habit.frequency, streak: habit.streak },
                mood: null,
                category: 'achievement',
                importance: 'low'
            });
        });
    });
}

function populateAchievementEvents() {
    const achievements = MindHaven.userData.achievements || [];
    
    achievements.forEach(achievementId => {
        // This is a simplified approach - in production, we'd track when achievements were unlocked
        Timeline.data.events.push({
            id: generateId(),
            type: 'achievement',
            date: new Date().toISOString(), // Placeholder - would need actual unlock date
            title: 'Achievement Unlocked',
            description: achievementId,
            data: { achievementId },
            mood: null,
            category: 'achievement',
            importance: 'high'
        });
    });
}

function populateRoadmapEvents() {
    const roadmaps = MindHaven.userData.roadmaps || {};
    const history = roadmaps.history || [];
    const active = roadmaps.active;
    
    history.forEach(entry => {
        Timeline.data.events.push({
            id: generateId(),
            type: 'roadmap',
            date: entry.startDate,
            title: 'Roadmap Started',
            description: entry.type,
            data: { type: entry.type, finalStage: entry.finalStage, completed: entry.completed },
            mood: null,
            category: 'growth',
            importance: 'high'
        });
        
        if (entry.completed) {
            Timeline.data.events.push({
                id: generateId(),
                type: 'roadmap',
                date: entry.endDate,
                title: 'Roadmap Completed',
                description: entry.type,
                data: { type: entry.type, finalStage: entry.finalStage },
                mood: null,
                category: 'growth',
                importance: 'high'
            });
        }
    });
    
    if (active) {
        Timeline.data.events.push({
            id: generateId(),
            type: 'roadmap',
            date: active.startDate,
            title: 'Roadmap Started',
            description: active.type,
            data: { type: active.type, currentStage: active.currentStage, progress: active.progress },
            mood: null,
            category: 'growth',
            importance: 'high'
        });
    }
}

function populateEmergencyEvents() {
    const emergency = MindHaven.userData.emergency || {};
    const activations = emergency.activations || [];
    
    activations.forEach(activation => {
        Timeline.data.events.push({
            id: generateId(),
            type: 'emergency',
            date: activation.date,
            title: 'Emergency Support Accessed',
            description: activation.reason || 'Crisis support needed',
            data: { groundingUsed: activation.groundingUsed },
            mood: null,
            category: 'crisis',
            importance: 'high'
        });
    });
}

function populateSupportEvents() {
    const support = MindHaven.userData.support || {};
    const circle = support.circle || [];
    
    circle.forEach(contact => {
        Timeline.data.events.push({
            id: generateId(),
            type: 'support',
            date: contact.addedAt || new Date().toISOString(),
            title: 'Support Contact Added',
            description: contact.name,
            data: { contactId: contact.id, isEmergency: contact.isEmergency },
            mood: null,
            category: 'support',
            importance: 'medium'
        });
    });
}

function populatePatternEvents() {
    const profile = MindHaven.userData.profile || {};
    const triggerPatterns = profile.triggerPatterns || {};
    const patterns = triggerPatterns.patterns || [];
    
    patterns.forEach(pattern => {
        Timeline.data.events.push({
            id: generateId(),
            type: 'pattern',
            date: pattern.firstDetected,
            title: 'Pattern Detected',
            description: pattern.description,
            data: { type: pattern.type, trigger: pattern.trigger, effect: pattern.effect, confidence: pattern.confidence },
            mood: null,
            category: 'insight',
            importance: 'medium'
        });
    });
}

function populateInsightEvents() {
    const profile = MindHaven.userData.profile || {};
    const insights = profile.insights || [];
    
    insights.forEach(insight => {
        Timeline.data.events.push({
            id: generateId(),
            type: 'insight',
            date: insight.createdAt,
            title: 'Personal Insight Generated',
            description: insight.text,
            data: { type: insight.type, confidence: insight.confidence },
            mood: null,
            category: 'insight',
            importance: 'medium'
        });
    });
}

function updateTimelineStats() {
    const events = Timeline.data.events;
    
    Timeline.data.stats.totalEvents = events.length;
    
    // Count by type
    Timeline.data.stats.eventsByType = {};
    events.forEach(event => {
        Timeline.data.stats.eventsByType[event.type] = (Timeline.data.stats.eventsByType[event.type] || 0) + 1;
    });
    
    // Count by category
    Timeline.data.stats.eventsByCategory = {};
    events.forEach(event => {
        Timeline.data.stats.eventsByCategory[event.category] = (Timeline.data.stats.eventsByCategory[event.category] || 0) + 1;
    });
    
    // Average mood by month
    const moodByMonth = {};
    events.forEach(event => {
        if (event.moodScore) {
            const date = new Date(event.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            
            if (!moodByMonth[monthKey]) {
                moodByMonth[monthKey] = { total: 0, count: 0 };
            }
            moodByMonth[monthKey].total += event.moodScore;
            moodByMonth[monthKey].count++;
        }
    });
    
    Object.keys(moodByMonth).forEach(month => {
        Timeline.data.stats.averageMoodByMonth[month] = moodByMonth[month].total / moodByMonth[month].count;
    });
    
    // Most active months
    const eventsByMonth = {};
    events.forEach(event => {
        const date = new Date(event.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        eventsByMonth[monthKey] = (eventsByMonth[monthKey] || 0) + 1;
    });
    
    Timeline.data.stats.mostActiveMonths = Object.entries(eventsByMonth)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([month, count]) => ({ month, count }));
}

// ============================================
// TIMELINE FILTERING
// ============================================

function filterTimeline(type, value) {
    if (type === 'view') {
        Timeline.currentView = value;
    } else if (type === 'filter') {
        Timeline.currentFilter = value;
    }
    
    applyFilters();
    renderTimelineDashboard();
}

function applyFilters() {
    const now = new Date();
    let startDate = null;
    
    // Apply view filter (time range)
    if (Timeline.currentView === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (Timeline.currentView === 'month') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    // Apply type filter
    Timeline.filteredEvents = Timeline.data.events.filter(event => {
        // Time filter
        if (startDate && new Date(event.date) < startDate) {
            return false;
        }
        
        // Type filter
        if (Timeline.currentFilter !== 'all' && event.type !== Timeline.currentFilter) {
            return false;
        }
        
        return true;
    });
}

function searchTimeline(query) {
    const lowerQuery = query.toLowerCase();
    
    Timeline.filteredEvents = Timeline.data.events.filter(event => {
        return event.title.toLowerCase().includes(lowerQuery) ||
               event.description.toLowerCase().includes(lowerQuery);
    });
    
    renderTimelineDashboard();
}

// ============================================
// TIMELINE DASHBOARD
// ============================================

function renderTimelineDashboard() {
    const container = document.getElementById('timeline-dashboard');
    if (!container) return;
    
    applyFilters();
    
    let html = `
        <div class="timeline-dashboard">
            <div class="timeline-header">
                <h2>Emotional Timeline</h2>
                <p>Your mental wellness journey over time</p>
                <button class="secondary-btn" onclick="populateTimeline(); renderTimelineDashboard();">🔄 Refresh</button>
            </div>
            
            <div class="timeline-controls">
                <div class="view-controls">
                    <button class="view-btn ${Timeline.currentView === 'all' ? 'active' : ''}" onclick="filterTimeline('view', 'all')">All Time</button>
                    <button class="view-btn ${Timeline.currentView === 'week' ? 'active' : ''}" onclick="filterTimeline('view', 'week')">This Week</button>
                    <button class="view-btn ${Timeline.currentView === 'month' ? 'active' : ''}" onclick="filterTimeline('view', 'month')">This Month</button>
                </div>
                
                <div class="filter-controls">
                    <select class="filter-select" onchange="filterTimeline('filter', this.value)">
                        <option value="all" ${Timeline.currentFilter === 'all' ? 'selected' : ''}>All Events</option>
                        <option value="checkin" ${Timeline.currentFilter === 'checkin' ? 'selected' : ''}>Check-ins</option>
                        <option value="journal" ${Timeline.currentFilter === 'journal' ? 'selected' : ''}>Journal</option>
                        <option value="assessment" ${Timeline.currentFilter === 'assessment' ? 'selected' : ''}>Assessments</option>
                        <option value="goal" ${Timeline.currentFilter === 'goal' ? 'selected' : ''}>Goals</option>
                        <option value="habit" ${Timeline.currentFilter === 'habit' ? 'selected' : ''}>Habits</option>
                        <option value="achievement" ${Timeline.currentFilter === 'achievement' ? 'selected' : ''}>Achievements</option>
                        <option value="roadmap" ${Timeline.currentFilter === 'roadmap' ? 'selected' : ''}>Roadmaps</option>
                        <option value="emergency" ${Timeline.currentFilter === 'emergency' ? 'selected' : ''}>Emergency</option>
                        <option value="pattern" ${Timeline.currentFilter === 'pattern' ? 'selected' : ''}>Patterns</option>
                        <option value="insight" ${Timeline.currentFilter === 'insight' ? 'selected' : ''}>Insights</option>
                    </select>
                </div>
                
                <div class="search-controls">
                    <input type="search" class="timeline-search" placeholder="Search timeline..." oninput="searchTimeline(this.value)">
                </div>
            </div>
            
            <div class="timeline-stats">
                ${renderTimelineStats()}
            </div>
            
            <div class="timeline-content">
                ${renderTimelineEvents()}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderTimelineStats() {
    const stats = Timeline.data.stats;
    
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-value">${stats.totalEvents}</span>
                <span class="stat-label">Total Events</span>
            </div>
            <div class="stat-card">
                <span class="stat-value">${Object.keys(stats.eventsByType).length}</span>
                <span class="stat-label">Event Types</span>
            </div>
            <div class="stat-card">
                <span class="stat-value">${stats.mostActiveMonths.length > 0 ? stats.mostActiveMonths[0].month : 'N/A'}</span>
                <span class="stat-label">Most Active Month</span>
            </div>
        </div>
    `;
}

function renderTimelineEvents() {
    const events = Timeline.filteredEvents;
    
    if (events.length === 0) {
        return '<p class="empty-state">No events to display. Try adjusting filters or continue using MindHaven to build your timeline.</p>';
    }
    
    let html = '<div class="timeline-events">';
    
    // Group events by date
    const eventsByDate = {};
    events.forEach(event => {
        const date = new Date(event.date).toDateString();
        if (!eventsByDate[date]) {
            eventsByDate[date] = [];
        }
        eventsByDate[date].push(event);
    });
    
    // Render events grouped by date
    Object.keys(eventsByDate).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
        const dateEvents = eventsByDate[date];
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        
        html += `
            <div class="timeline-date-group">
                <div class="timeline-date-header">
                    <h3>${formattedDate}</h3>
                </div>
                <div class="timeline-date-events">
                    ${dateEvents.map(event => renderTimelineEvent(event)).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

function renderTimelineEvent(event) {
    const typeIcons = {
        checkin: '📊',
        journal: '📔',
        assessment: '📋',
        goal: '🎯',
        habit: '✅',
        achievement: '🏆',
        roadmap: '🗺️',
        emergency: '🆘',
        support: '👥',
        pattern: '🔍',
        insight: '💡'
    };
    
    const categoryColors = {
        wellness: '#A8C3A1',
        reflection: '#8FAACF',
        achievement: '#FFB74D',
        growth: '#B8A7D1',
        crisis: '#E57373',
        support: '#7CB8A6',
        insight: '#FFB74D'
    };
    
    const icon = typeIcons[event.type] || '📌';
    const color = categoryColors[event.category] || '#8FAACF';
    const importanceClass = event.importance === 'high' ? 'high-importance' : event.importance === 'medium' ? 'medium-importance' : '';
    
    return `
        <div class="timeline-event ${importanceClass}" style="border-left-color: ${color}">
            <div class="event-header">
                <span class="event-icon">${icon}</span>
                <span class="event-type">${event.type}</span>
                <span class="event-time">${new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h4 class="event-title">${event.title}</h4>
            <p class="event-description">${event.description}</p>
            ${event.mood ? `<span class="event-mood">Mood: ${event.mood}</span>` : ''}
            ${event.moodScore ? `<span class="event-mood-score">Score: ${event.moodScore.toFixed(1)}/5</span>` : ''}
        </div>
    `;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.initializeTimeline = initializeTimeline;
window.populateTimeline = populateTimeline;
window.filterTimeline = filterTimeline;
window.searchTimeline = searchTimeline;
window.renderTimelineDashboard = renderTimelineDashboard;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeTimeline();
});
