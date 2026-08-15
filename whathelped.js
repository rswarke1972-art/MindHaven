// ============================================
// MINDHAVEN - What Helped Before Engine
// ============================================

// WhatHelped State
const WhatHelped = {
    data: null,
    lastAnalyzed: null
};

// Initialize WhatHelped Module
function initializeWhatHelped() {
    console.log('💡 Initializing What Helped Before Engine...');
    loadWhatHelpedData();
    analyzeWhatHelped();
    console.log('✅ What Helped Before Engine initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadWhatHelpedData() {
    if (MindHaven.userData.profile && MindHaven.userData.profile.copingEffectiveness) {
        WhatHelped.data = MindHaven.userData.profile.copingEffectiveness;
    } else {
        WhatHelped.data = initializeWhatHelpedStructure();
    }
}

function initializeWhatHelpedStructure() {
    return {
        history: [],
        toolRankings: {
            highAnxiety: [],
            lowMood: [],
            overwhelm: [],
            stress: [],
            numbness: [],
            exhaustion: []
        },
        recommendations: [],
        toolSummary: {
            breathing: { totalUses: 0, avgImprovement: 0, successRate: 0 },
            journaling: { totalUses: 0, avgImprovement: 0, successRate: 0 },
            grounding: { totalUses: 0, avgImprovement: 0, successRate: 0 },
            calmSpace: { totalUses: 0, avgImprovement: 0, successRate: 0 },
            supportContact: { totalUses: 0, avgImprovement: 0, successRate: 0 },
            exercise: { totalUses: 0, avgImprovement: 0, successRate: 0 },
            microGoals: { totalUses: 0, avgImprovement: 0, successRate: 0 },
            lowEnergyMode: { totalUses: 0, avgImprovement: 0, successRate: 0 }
        },
        lastUpdated: null
    };
}

function saveWhatHelpedData() {
    if (!MindHaven.userData.profile) {
        MindHaven.userData.profile = {};
    }
    MindHaven.userData.profile.copingEffectiveness = WhatHelped.data;
    saveUserData();
}

// ============================================
// COPING EFFECTIVENESS ANALYSIS
// ============================================

function analyzeWhatHelped() {
    // Analyze check-ins for mood improvements
    analyzeMoodImprovements();
    
    // Analyze tool usage from local storage
    analyzeToolUsage();
    
    // Generate tool rankings by situation
    generateToolRankings();
    
    // Generate personalized recommendations
    generateRecommendations();
    
    // Save and update timestamp
    WhatHelped.data.lastUpdated = new Date().toISOString();
    saveWhatHelpedData();
}

function analyzeMoodImprovements() {
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length < 2) return;
    
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
    
    const sortedCheckIns = [...checkIns].sort((a, b) => new Date(a.timestamp || a.date) - new Date(b.timestamp || b.date));
    
    // Track mood improvements between consecutive check-ins
    for (let i = 1; i < sortedCheckIns.length; i++) {
        const prev = sortedCheckIns[i - 1];
        const curr = sortedCheckIns[i];
        
        let prevScore = 0;
        let currScore = 0;
        let prevMood = null;
        let currMood = null;
        
        if (Array.isArray(prev.moods)) {
            prev.moods.forEach(mood => {
                if (moodScores[mood]) prevScore += moodScores[mood];
            });
            prevScore /= prev.moods.length;
            prevMood = prev.moods[0];
        } else if (prev.mood && moodScores[prev.mood]) {
            prevScore = moodScores[prev.mood];
            prevMood = prev.mood;
        }
        
        if (Array.isArray(curr.moods)) {
            curr.moods.forEach(mood => {
                if (moodScores[mood]) currScore += moodScores[mood];
            });
            currScore /= curr.moods.length;
            currMood = curr.moods[0];
        } else if (curr.mood && moodScores[curr.mood]) {
            currScore = moodScores[curr.mood];
            currMood = curr.mood;
        }
        
        const moodChange = currScore - prevScore;
        const timeDiff = (new Date(curr.timestamp || curr.date) - new Date(prev.timestamp || prev.date)) / (1000 * 60); // minutes
        
        // Determine effectiveness
        let effectiveness = 'none';
        if (moodChange > 1) effectiveness = 'high';
        else if (moodChange > 0.3) effectiveness = 'medium';
        else if (moodChange < -0.3) effectiveness = 'low';
        
        // Infer tool from journal entries between check-ins
        const toolUsed = inferToolUsage(prev.timestamp || prev.date, curr.timestamp || curr.date);
        
        if (toolUsed) {
            recordCopingEvent({
                date: curr.timestamp || curr.date,
                initialMood: prevMood,
                moodScore: prevScore,
                toolUsed: toolUsed,
                postMood: currMood,
                postMoodScore: currScore,
                moodChange: moodChange,
                timeToImprovement: timeDiff,
                effectiveness: effectiveness,
                context: {
                    stressLevel: prevMood === 'overwhelmed' || prevMood === 'anxious' ? 4 : 2,
                    anxietyLevel: prevMood === 'anxious' || prevMood === 'overthinking' ? 4 : 2,
                    timeOfDay: getTimeOfDay(new Date(curr.timestamp || curr.date)),
                    dayOfWeek: getDayOfWeek(new Date(curr.timestamp || curr.date))
                }
            });
        }
    }
}

function inferToolUsage(startDate, endDate) {
    const journalEntries = MindHaven.userData.journalEntries || [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Find journal entries between check-ins
    const entriesBetween = journalEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
    });
    
    if (entriesBetween.length === 0) return 'journaling'; // Default assumption
    
    const content = entriesBetween.map(e => e.content.toLowerCase()).join(' ');
    
    // Infer tool based on keywords
    if (content.includes('breath') || content.includes('inhale') || content.includes('exhale')) {
        return 'breathing';
    } else if (content.includes('ground') || content.includes('5-4-3-2-1') || content.includes('senses')) {
        return 'grounding';
    } else if (content.includes('calm') || content.includes('ambience') || content.includes('relax')) {
        return 'calmSpace';
    } else if (content.includes('friend') || content.includes('family') || content.includes('talk') || content.includes('call')) {
        return 'supportContact';
    } else if (content.includes('walk') || content.includes('exercise') || content.includes('move') || content.includes('stretch')) {
        return 'exercise';
    } else if (content.includes('small') || content.includes('tiny') || content.includes('micro') || content.includes('step')) {
        return 'microGoals';
    } else if (content.includes('tired') || content.includes('exhausted') || content.includes('low energy')) {
        return 'lowEnergyMode';
    }
    
    return 'journaling';
}

function recordCopingEvent(event) {
    // Add to history
    WhatHelped.data.history.push({
        id: generateId(),
        ...event
    });
    
    // Update tool summary
    const tool = event.toolUsed;
    if (!WhatHelped.data.toolSummary[tool]) {
        WhatHelped.data.toolSummary[tool] = { totalUses: 0, avgImprovement: 0, successRate: 0 };
    }
    
    const summary = WhatHelped.data.toolSummary[tool];
    summary.totalUses++;
    
    // Update average improvement
    summary.avgImprovement = ((summary.avgImprovement * (summary.totalUses - 1)) + event.moodChange) / summary.totalUses;
    
    // Update success rate
    const successes = WhatHelped.data.history.filter(h => h.toolUsed === tool && (h.effectiveness === 'high' || h.effectiveness === 'medium')).length;
    summary.successRate = (successes / summary.totalUses) * 100;
    
    // Keep only last 100 history entries
    if (WhatHelped.data.history.length > 100) {
        WhatHelped.data.history = WhatHelped.data.history.slice(-100);
    }
}

function analyzeToolUsage() {
    // Analyze breathing exercise usage
    const breathingCount = parseInt(localStorage.getItem('mindhaven_breathing_count') || '0');
    if (breathingCount > 0) {
        WhatHelped.data.toolSummary.breathing.totalUses = Math.max(WhatHelped.data.toolSummary.breathing.totalUses, breathingCount);
    }
    
    // Analyze low energy mode usage
    const lowEnergyCount = parseInt(localStorage.getItem('mindhaven_low_energy_count') || '0');
    if (lowEnergyCount > 0) {
        WhatHelped.data.toolSummary.lowEnergyMode.totalUses = Math.max(WhatHelped.data.toolSummary.lowEnergyMode.totalUses, lowEnergyCount);
    }
}

function generateToolRankings() {
    const history = WhatHelped.data.history;
    
    if (history.length < 5) return;
    
    // Group by initial mood situation
    const situations = {
        highAnxiety: { mood: ['anxious', 'overthinking'], tools: {} },
        lowMood: { mood: ['low', 'numb'], tools: {} },
        overwhelm: { mood: ['overwhelmed', 'exhausted'], tools: {} },
        stress: { mood: ['anxious', 'overwhelmed'], tools: {} },
        numbness: { mood: ['numb', 'exhausted'], tools: {} },
        exhaustion: { mood: ['exhausted'], tools: {} }
    };
    
    // Categorize events by situation
    history.forEach(event => {
        Object.entries(situations).forEach(([situation, data]) => {
            if (data.mood.includes(event.initialMood)) {
                if (!data.tools[event.toolUsed]) {
                    data.tools[event.toolUsed] = { successes: 0, total: 0, totalImprovement: 0 };
                }
                data.tools[event.toolUsed].total++;
                data.tools[event.toolUsed].totalImprovement += event.moodChange;
                if (event.effectiveness === 'high' || event.effectiveness === 'medium') {
                    data.tools[event.toolUsed].successes++;
                }
            }
        });
    });
    
    // Generate rankings for each situation
    Object.entries(situations).forEach(([situation, data]) => {
        const rankings = Object.entries(data.tools)
            .map(([tool, stats]) => ({
                tool,
                successRate: stats.total > 0 ? (stats.successes / stats.total * 100) : 0,
                avgImprovement: stats.total > 0 ? (stats.totalImprovement / stats.total) : 0
            }))
            .filter(r => r.total > 0)
            .sort((a, b) => b.successRate - a.successRate);
        
        WhatHelped.data.toolRankings[situation] = rankings.slice(0, 5);
    });
}

function generateRecommendations() {
    WhatHelped.data.recommendations = [];
    
    const toolRankings = WhatHelped.data.toolRankings;
    
    // Generate recommendations for each situation
    Object.entries(toolRankings).forEach(([situation, rankings]) => {
        if (rankings.length === 0) return;
        
        const topTools = rankings.slice(0, 3).map(r => r.tool);
        const avgSuccessRate = rankings.reduce((sum, r) => sum + r.successRate, 0) / rankings.length;
        
        WhatHelped.data.recommendations.push({
            situation: formatSituationName(situation),
            recommendedTools: topTools,
            confidence: avgSuccessRate / 100,
            basedOnData: rankings.reduce((sum, r) => sum + r.total, 0)
        });
    });
}

function formatSituationName(situation) {
    const names = {
        highAnxiety: 'High Anxiety',
        lowMood: 'Low Mood',
        overwhelm: 'Feeling Overwhelmed',
        stress: 'High Stress',
        numbness: 'Feeling Numb',
        exhaustion: 'Exhaustion'
    };
    return names[situation] || situation;
}

function getTimeOfDay(date) {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    else if (hour >= 12 && hour < 17) return 'afternoon';
    else if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

function getDayOfWeek(date) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
}

// ============================================
// RECOMMENDATION ENGINE
// ============================================

function getRecommendationsForCurrentMood(currentMood) {
    const situation = mapMoodToSituation(currentMood);
    const recommendation = WhatHelped.data.recommendations.find(r => r.situation === situation);
    
    if (!recommendation || recommendation.recommendedTools.length === 0) {
        return getDefaultRecommendations(currentMood);
    }
    
    return recommendation.recommendedTools.map(tool => ({
        tool,
        confidence: recommendation.confidence,
        dataPoints: recommendation.basedOnData
    }));
}

function mapMoodToSituation(mood) {
    const mapping = {
        anxious: 'highAnxiety',
        overthinking: 'highAnxiety',
        low: 'lowMood',
        numb: 'numbness',
        overwhelmed: 'overwhelm',
        exhausted: 'exhaustion'
    };
    return mapping[mood] || 'stress';
}

function getDefaultRecommendations(mood) {
    const defaults = {
        anxious: [
            { tool: 'breathing', confidence: 0.6, dataPoints: 0 },
            { tool: 'grounding', confidence: 0.5, dataPoints: 0 }
        ],
        overthinking: [
            { tool: 'journaling', confidence: 0.6, dataPoints: 0 },
            { tool: 'grounding', confidence: 0.5, dataPoints: 0 }
        ],
        low: [
            { tool: 'journaling', confidence: 0.5, dataPoints: 0 },
            { tool: 'calmSpace', confidence: 0.4, dataPoints: 0 }
        ],
        numb: [
            { tool: 'grounding', confidence: 0.5, dataPoints: 0 },
            { tool: 'microGoals', confidence: 0.4, dataPoints: 0 }
        ],
        overwhelmed: [
            { tool: 'microGoals', confidence: 0.6, dataPoints: 0 },
            { tool: 'breathing', confidence: 0.5, dataPoints: 0 }
        ],
        exhausted: [
            { tool: 'lowEnergyMode', confidence: 0.7, dataPoints: 0 },
            { tool: 'calmSpace', confidence: 0.5, dataPoints: 0 }
        ]
    };
    
    return defaults[mood] || [
        { tool: 'breathing', confidence: 0.5, dataPoints: 0 },
        { tool: 'journaling', confidence: 0.5, dataPoints: 0 }
    ];
}

function launchRecommendedTool(tool) {
    const toolMappings = {
        breathing: () => navigateTo('coping', 'breathing'),
        journaling: () => navigateTo('journal'),
        grounding: () => navigateTo('coping', 'grounding'),
        calmSpace: () => navigateTo('calmspace'),
        supportContact: () => navigateTo('supportcircle'),
        exercise: () => showGentleMessage('Consider going for a walk or doing some stretching'),
        microGoals: () => navigateTo('goals'),
        lowEnergyMode: () => navigateTo('coping', 'low-energy')
    };
    
    const launch = toolMappings[tool];
    if (launch) {
        launch();
    } else {
        showGentleMessage('Tool not available');
    }
}

// ============================================
// WHAT HELPED DASHBOARD
// ============================================

function renderWhatHelpedDashboard() {
    const container = document.getElementById('whathelped-dashboard');
    if (!container) return;
    
    let html = `
        <div class="whathelped-dashboard">
            <div class="whathelped-header">
                <h2>What Helped Before</h2>
                <p class="whathelped-updated">Last updated: ${WhatHelped.data.lastUpdated ? new Date(WhatHelped.data.lastUpdated).toLocaleDateString() : 'Never'}</p>
                <button class="secondary-btn" onclick="analyzeWhatHelped(); renderWhatHelpedDashboard();">🔄 Re-analyze</button>
            </div>
            
            <div class="whathelped-sections">
                <div class="whathelped-section">
                    <h3>🎯 Tool Effectiveness Summary</h3>
                    ${renderToolSummary()}
                </div>
                
                <div class="whathelped-section">
                    <h3>📊 Recommendations by Situation</h3>
                    ${renderRecommendations()}
                </div>
                
                <div class="whathelped-section">
                    <h3>📈 Recent History</h3>
                    ${renderRecentHistory()}
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderToolSummary() {
    const toolSummary = WhatHelped.data.toolSummary;
    
    let html = '<div class="tool-summary-grid">';
    
    Object.entries(toolSummary).forEach(([tool, data]) => {
        if (data.totalUses === 0) return;
        
        const toolName = formatToolName(tool);
        const successColor = data.successRate >= 60 ? '#A8C3A1' : data.successRate >= 40 ? '#FFB74D' : '#E57373';
        
        html += `
            <div class="tool-summary-card">
                <span class="tool-name">${toolName}</span>
                <div class="tool-metrics">
                    <div class="tool-metric">
                        <span class="metric-label">Uses</span>
                        <span class="metric-value">${data.totalUses}</span>
                    </div>
                    <div class="tool-metric">
                        <span class="metric-label">Success Rate</span>
                        <span class="metric-value" style="color: ${successColor}">${data.successRate.toFixed(0)}%</span>
                    </div>
                    <div class="tool-metric">
                        <span class="metric-label">Avg Improvement</span>
                        <span class="metric-value">${data.avgImprovement.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (html === '<div class="tool-summary-grid"></div>') {
        return '<p class="empty-state">Not enough data yet. Continue using MindHaven to see what works for you.</p>';
    }
    
    return html;
}

function formatToolName(tool) {
    const names = {
        breathing: 'Breathing Exercises',
        journaling: 'Journaling',
        grounding: 'Grounding',
        calmSpace: 'Calm Space',
        supportContact: 'Support Contact',
        exercise: 'Exercise',
        microGoals: 'Micro Goals',
        lowEnergyMode: 'Low Energy Mode'
    };
    return names[tool] || tool;
}

function renderRecommendations() {
    const recommendations = WhatHelped.data.recommendations;
    
    if (recommendations.length === 0) {
        return '<p class="empty-state">Not enough data to generate personalized recommendations yet.</p>';
    }
    
    let html = '<div class="recommendations-list">';
    
    recommendations.forEach(rec => {
        const confidencePercent = rec.confidence * 100;
        const confidenceColor = confidencePercent >= 60 ? '#A8C3A1' : confidencePercent >= 40 ? '#FFB74D' : '#8FAACF';
        
        html += `
            <div class="recommendation-card">
                <div class="recommendation-header">
                    <span class="recommendation-situation">${rec.situation}</span>
                    <span class="recommendation-confidence" style="color: ${confidenceColor}">${confidencePercent.toFixed(0)}% confidence</span>
                </div>
                <div class="recommendation-tools">
                    ${rec.recommendedTools.map(tool => `
                        <button class="recommendation-tool-btn" onclick="launchRecommendedTool('${tool}')">
                            ${formatToolName(tool)}
                        </button>
                    `).join('')}
                </div>
                <span class="recommendation-data">Based on ${rec.basedOnData} data points</span>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

function renderRecentHistory() {
    const history = WhatHelped.data.history;
    
    if (history.length === 0) {
        return '<p class="empty-state">No coping history yet.</p>';
    }
    
    let html = '<div class="history-list">';
    
    history.slice(-10).reverse().forEach(event => {
        const effectivenessColor = event.effectiveness === 'high' ? '#A8C3A1' : event.effectiveness === 'medium' ? '#FFB74D' : event.effectiveness === 'low' ? '#E57373' : '#8FAACF';
        
        html += `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-tool">${formatToolName(event.toolUsed)}</span>
                    <span class="history-effectiveness" style="color: ${effectivenessColor}">${event.effectiveness}</span>
                </div>
                <div class="history-details">
                    <span>${event.initialMood} → ${event.postMood}</span>
                    <span>Change: ${event.moodChange > 0 ? '+' : ''}${event.moodChange.toFixed(2)}</span>
                    <span>${new Date(event.date).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.initializeWhatHelped = initializeWhatHelped;
window.analyzeWhatHelped = analyzeWhatHelped;
window.getRecommendationsForCurrentMood = getRecommendationsForCurrentMood;
window.launchRecommendedTool = launchRecommendedTool;
window.renderWhatHelpedDashboard = renderWhatHelpedDashboard;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeWhatHelped();
});
