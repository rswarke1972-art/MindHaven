// ============================================
// MINDHAVEN - Life Assessment Center Module
// ============================================

// Assessment State
const Assessment = {
    currentQuiz: null,
    currentQuestion: 0,
    answers: [],
    history: []
};

// Assessment Dimensions
const assessmentDimensions = {
    emotional: {
        id: 'emotional',
        name: 'Emotional Wellbeing',
        icon: '💚',
        color: '#A8C3A1',
        questions: [
            'I feel able to handle my emotions',
            'I can recognize when I need support',
            'I have healthy ways to express feelings',
            'I feel hopeful about the future',
            'I can accept difficult emotions when they arise'
        ]
    },
    anxiety: {
        id: 'anxiety',
        name: 'Anxiety Level',
        icon: '😰',
        color: '#B8A7D1',
        questions: [
            'I feel worried most of the time',
            'My worries interfere with daily activities',
            'I experience physical symptoms of anxiety',
            'I avoid situations due to anxiety',
            'I feel unable to control my worrying'
        ]
    },
    stress: {
        id: 'stress',
        name: 'Stress Level',
        icon: '🌪️',
        color: '#FFB74D',
        questions: [
            'I feel overwhelmed by responsibilities',
            'I have difficulty relaxing',
            'I feel pressure from multiple sources',
            'I have physical symptoms of stress',
            'I feel like I can\'t keep up with demands'
        ]
    },
    depression: {
        id: 'depression',
        name: 'Depression Indicators',
        icon: '🌧️',
        color: '#8FAACF',
        questions: [
            'I feel sad or empty most days',
            'I have lost interest in activities I enjoyed',
            'I have changes in appetite or sleep',
            'I feel worthless or guilty',
            'I have difficulty concentrating'
        ]
    },
    sleep: {
        id: 'sleep',
        name: 'Sleep Quality',
        icon: '🌙',
        color: '#B8A7D1',
        questions: [
            'I get enough sleep each night',
            'My sleep is restful',
            'I have a consistent sleep schedule',
            'I wake up feeling refreshed',
            'I rarely have trouble falling asleep'
        ]
    },
    physical: {
        id: 'physical',
        name: 'Physical Wellbeing',
        icon: '💪',
        color: '#7CB8A6',
        questions: [
            'I engage in regular physical activity',
            'I eat nourishing meals regularly',
            'I stay hydrated throughout the day',
            'I listen to my body\'s needs',
            'I have energy for daily activities'
        ]
    },
    social: {
        id: 'social',
        name: 'Social Connection',
        icon: '🫂',
        color: '#E57373',
        questions: [
            'I have people I can talk to',
            'I feel connected to others',
            'I have a support system',
            'I can reach out when I need help',
            'I feel understood by others'
        ]
    },
    purpose: {
        id: 'purpose',
        name: 'Purpose & Meaning',
        icon: '✨',
        color: '#FFB74D',
        questions: [
            'I feel my life has meaning',
            'I have goals I\'m working toward',
            'I feel aligned with my values',
            'I have a sense of purpose',
            'I feel motivated by my interests'
        ]
    },
    selfEsteem: {
        id: 'selfEsteem',
        name: 'Self-Esteem',
        icon: '💜',
        color: '#9C27B0',
        questions: [
            'I feel worthy of love and respect',
            'I accept myself as I am',
            'I acknowledge my strengths',
            'I am kind to myself when I make mistakes',
            'I feel confident in my abilities'
        ]
    },
    academic: {
        id: 'academic',
        name: 'Academic/Work Wellbeing',
        icon: '📚',
        color: '#8FAACF',
        questions: [
            'I feel capable in my academic/work responsibilities',
            'I can manage my workload effectively',
            'I have a healthy work-life balance',
            'I feel motivated to learn/work',
            'I have support in my academic/work environment'
        ]
    }
};

// Initialize Assessment Module
function initializeAssessment() {
    console.log('📊 Initializing Life Assessment Center...');
    loadAssessmentHistory();
    setupAssessmentUI();
    console.log('✅ Life Assessment Center initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadAssessmentHistory() {
    const savedHistory = localStorage.getItem('mindhaven_assessment_history');
    if (savedHistory) {
        Assessment.history = JSON.parse(savedHistory);
    }
    
    // Also load from userData
    if (MindHaven.userData.assessments && MindHaven.userData.assessments.lifeAssessments) {
        Assessment.history = MindHaven.userData.assessments.lifeAssessments;
    }
}

function saveAssessmentHistory() {
    localStorage.setItem('mindhaven_assessment_history', JSON.stringify(Assessment.history));
    
    // Also save to userData
    MindHaven.userData.assessments.lifeAssessments = Assessment.history;
    MindHaven.userData.assessments.assessmentHistory = Assessment.history;
    saveUserData();
}

// ============================================
// ASSESSMENT QUIZ
// ============================================

function startAssessment(dimensionId = null) {
    if (dimensionId) {
        // Start single dimension assessment
        const dimension = assessmentDimensions[dimensionId];
        if (!dimension) return;
        
        Assessment.currentQuiz = {
            type: 'single',
            dimension: dimensionId,
            questions: dimension.questions
        };
    } else {
        // Start full wellness assessment
        Assessment.currentQuiz = {
            type: 'full',
            questions: getAllAssessmentQuestions()
        };
    }
    
    Assessment.currentQuestion = 0;
    Assessment.answers = [];
    
    // Show assessment modal
    showAssessmentModal();
}

function getAllAssessmentQuestions() {
    const allQuestions = [];
    Object.values(assessmentDimensions).forEach(dimension => {
        dimension.questions.forEach(question => {
            allQuestions.push({
                question: question,
                dimension: dimension.id
            });
        });
    });
    return allQuestions;
}

function showAssessmentModal() {
    // Remove existing modal if present
    closeAssessmentModal();
    
    const modal = document.createElement('div');
    modal.id = 'assessmentModal';
    modal.className = 'assessment-modal';
    modal.innerHTML = `
        <div class="assessment-modal-content">
            <div class="assessment-header">
                <h2>Life Assessment</h2>
                <p class="assessment-subtitle">Answer honestly. There are no wrong answers.</p>
            </div>
            <div class="assessment-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="assessmentProgressFill" style="width: 0%"></div>
                </div>
                <span class="progress-text" id="assessmentProgressText">0 / 0</span>
            </div>
            <div class="assessment-question" id="assessmentQuestion">
                <!-- Question will be rendered here -->
            </div>
            <div class="assessment-actions">
                <button class="secondary-btn" onclick="closeAssessmentModal()">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Render first question
    renderAssessmentQuestion();
}

function renderAssessmentQuestion() {
    const questionContainer = document.getElementById('assessmentQuestion');
    const progressFill = document.getElementById('assessmentProgressFill');
    const progressText = document.getElementById('assessmentProgressText');
    
    if (!questionContainer) return;
    
    const totalQuestions = Assessment.currentQuiz.questions.length;
    const currentQuestion = Assessment.currentQuestion;
    
    // Update progress
    const progress = (currentQuestion / totalQuestions) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${currentQuestion} / ${totalQuestions}`;
    
    // Get question text
    let questionText;
    if (Assessment.currentQuiz.type === 'full') {
        questionText = Assessment.currentQuiz.questions[currentQuestion].question;
    } else {
        questionText = Assessment.currentQuiz.questions[currentQuestion];
    }
    
    // Render question
    questionContainer.innerHTML = `
        <div class="question-content">
            <p class="question-text">${questionText}</p>
            <div class="answer-options">
                <button class="answer-btn" onclick="submitAnswer(1)">Strongly Disagree</button>
                <button class="answer-btn" onclick="submitAnswer(2)">Disagree</button>
                <button class="answer-btn" onclick="submitAnswer(3)">Neutral</button>
                <button class="answer-btn" onclick="submitAnswer(4)">Agree</button>
                <button class="answer-btn" onclick="submitAnswer(5)">Strongly Agree</button>
            </div>
        </div>
    `;
}

function submitAnswer(answer) {
    // Save answer
    Assessment.answers.push({
        questionIndex: Assessment.currentQuestion,
        answer: answer
    });
    
    // Move to next question or complete
    Assessment.currentQuestion++;
    
    if (Assessment.currentQuestion >= Assessment.currentQuiz.questions.length) {
        completeAssessment();
    } else {
        renderAssessmentQuestion();
    }
}

function completeAssessment() {
    // Calculate scores
    const scores = calculateAssessmentScores();
    
    // Save assessment
    const assessmentResult = {
        id: generateId(),
        date: new Date().toISOString(),
        type: Assessment.currentQuiz.type,
        scores: scores,
        answers: Assessment.answers
    };
    
    Assessment.history.push(assessmentResult);
    saveAssessmentHistory();
    
    // Show results
    showAssessmentResults(scores);
}

function calculateAssessmentScores() {
    const scores = {};
    
    if (Assessment.currentQuiz.type === 'full') {
        // Calculate scores by dimension
        Object.keys(assessmentDimensions).forEach(dimensionId => {
            const dimensionQuestions = Assessment.currentQuiz.questions.filter(
                q => q.dimension === dimensionId
            );
            
            let totalScore = 0;
            let count = 0;
            
            dimensionQuestions.forEach((q, index) => {
                const answerIndex = Assessment.currentQuiz.questions.indexOf(q);
                const answer = Assessment.answers[answerIndex].answer;
                totalScore += answer;
                count++;
            });
            
            scores[dimensionId] = count > 0 ? totalScore / count : 0;
        });
    } else {
        // Single dimension score
        const dimensionId = Assessment.currentQuiz.dimension;
        let totalScore = 0;
        Assessment.answers.forEach(a => {
            totalScore += a.answer;
        });
        scores[dimensionId] = totalScore / Assessment.answers.length;
    }
    
    return scores;
}

function showAssessmentResults(scores) {
    const questionContainer = document.getElementById('assessmentQuestion');
    const actionsContainer = document.querySelector('.assessment-actions');
    
    if (!questionContainer) return;
    
    // Update header
    const header = document.querySelector('.assessment-header');
    if (header) {
        header.innerHTML = `
            <h2>Assessment Results</h2>
            <p class="assessment-subtitle">Your wellness snapshot</p>
        `;
    }
    
    // Hide progress
    const progress = document.querySelector('.assessment-progress');
    if (progress) progress.style.display = 'none';
    
    // Render results
    let html = '<div class="assessment-results">';
    
    Object.keys(scores).forEach(dimensionId => {
        const dimension = assessmentDimensions[dimensionId];
        const score = scores[dimensionId];
        const percentage = (score / 5) * 100;
        
        let scoreLabel = 'Low';
        let scoreColor = '#E57373';
        
        if (score >= 4) {
            scoreLabel = 'Strong';
            scoreColor = '#A8C3A1';
        } else if (score >= 3) {
            scoreLabel = 'Good';
            scoreColor = '#8FAACF';
        } else if (score >= 2) {
            scoreLabel = 'Moderate';
            scoreColor = '#FFB74D';
        }
        
        html += `
            <div class="result-item">
                <div class="result-header">
                    <span class="result-icon">${dimension.icon}</span>
                    <span class="result-name">${dimension.name}</span>
                </div>
                <div class="result-score">
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${percentage}%; background: ${scoreColor}"></div>
                    </div>
                    <span class="score-label" style="color: ${scoreColor}">${scoreLabel}</span>
                </div>
                <div class="result-recommendation">
                    ${getRecommendation(dimensionId, score)}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    questionContainer.innerHTML = html;
    
    // Update actions
    if (actionsContainer) {
        actionsContainer.innerHTML = `
            <button class="secondary-btn" onclick="closeAssessmentModal()">Close</button>
            <button class="primary-btn" onclick="viewAssessmentHistory()">View History</button>
        `;
    }
}

function getRecommendation(dimensionId, score) {
    const recommendations = {
        emotional: score < 3 ? 'Consider journaling or talking to someone you trust.' : 'Continue practicing emotional awareness.',
        anxiety: score < 3 ? 'Try the Anxiety Hub and breathing exercises.' : 'Your anxiety management seems effective.',
        stress: score < 3 ? 'Consider using the Stress & Burnout resources.' : 'You\'re managing stress well.',
        depression: score < 2 ? 'Please reach out to a mental health professional.' : score < 3 ? 'Consider the Depression Hub for support.' : 'Your mood seems stable.',
        sleep: score < 3 ? 'Try the Calm Space for better sleep hygiene.' : 'Your sleep habits look good.',
        physical: score < 3 ? 'Start with small, achievable physical activities.' : 'Great job taking care of your body.',
        social: score < 3 ? 'Consider reaching out to one person today.' : 'You have good social connections.',
        purpose: score < 3 ? 'Reflect on what gives your life meaning.' : 'You have a strong sense of purpose.',
        selfEsteem: score < 3 ? 'Practice self-compassion exercises.' : 'Your self-esteem is healthy.',
        academic: score < 3 ? 'Consider breaking tasks into smaller steps.' : 'You\'re managing your responsibilities well.'
    };
    
    return recommendations[dimensionId] || 'Continue your current approach.';
}

function closeAssessmentModal() {
    const modal = document.getElementById('assessmentModal');
    if (modal) {
        modal.remove();
    }
    Assessment.currentQuiz = null;
    Assessment.currentQuestion = 0;
    Assessment.answers = [];
}

function viewAssessmentHistory() {
    closeAssessmentModal();
    navigateTo('assessment');
}

// ============================================
// ASSESSMENT DASHBOARD
// ============================================

function renderAssessmentDashboard() {
    const container = document.getElementById('assessment-dashboard');
    if (!container) return;
    
    if (Assessment.history.length === 0) {
        container.innerHTML = `
            <div class="assessment-empty">
                <span class="empty-icon">📊</span>
                <h3>No assessments yet</h3>
                <p>Take your first assessment to see your wellness snapshot.</p>
                <button class="primary-btn" onclick="startAssessment()">Start Full Assessment</button>
            </div>
        `;
        return;
    }
    
    // Get latest assessment
    const latest = Assessment.history[Assessment.history.length - 1];
    
    let html = `
        <div class="assessment-dashboard">
            <div class="latest-assessment">
                <h3>Latest Assessment</h3>
                <p class="assessment-date">${new Date(latest.date).toLocaleDateString()}</p>
                ${renderAssessmentScores(latest.scores)}
                <button class="primary-btn" onclick="startAssessment()">Retake Assessment</button>
            </div>
            
            <div class="dimension-assessments">
                <h3>Quick Assessments</h3>
                <div class="dimension-grid">
                    ${Object.values(assessmentDimensions).map(dimension => `
                        <button class="dimension-card" onclick="startAssessment('${dimension.id}')" style="border-color: ${dimension.color}">
                            <span class="dimension-icon">${dimension.icon}</span>
                            <span class="dimension-name">${dimension.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="assessment-history">
                <h3>Assessment History</h3>
                <div class="history-list">
                    ${Assessment.history.slice(-5).reverse().map(assessment => `
                        <div class="history-item">
                            <span class="history-date">${new Date(assessment.date).toLocaleDateString()}</span>
                            <span class="history-type">${assessment.type === 'full' ? 'Full' : 'Quick'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderAssessmentScores(scores) {
    let html = '<div class="assessment-scores">';
    
    Object.keys(scores).forEach(dimensionId => {
        const dimension = assessmentDimensions[dimensionId];
        const score = scores[dimensionId];
        const percentage = (score / 5) * 100;
        
        html += `
            <div class="mini-score">
                <span class="mini-icon">${dimension.icon}</span>
                <div class="mini-bar">
                    <div class="mini-fill" style="width: ${percentage}%; background: ${dimension.color}"></div>
                </div>
                <span class="mini-value">${score.toFixed(1)}/5</span>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// ============================================
// UI SETUP
// ============================================

function setupAssessmentUI() {
    // Add assessment section to navigation if not present
    addAssessmentToNavigation();
}

function addAssessmentToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    // Check if already added
    if (document.querySelector('.nav-item[onclick*="assessment"]')) return;
    
    const assessmentItem = document.createElement('button');
    assessmentItem.className = 'nav-item';
    assessmentItem.setAttribute('onclick', "navigateTo('assessment')");
    assessmentItem.setAttribute('role', 'menuitem');
    assessmentItem.textContent = '📊 Assessment';
    
    // Insert before crisis button
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(assessmentItem, crisisBtn);
    } else {
        navMenu.appendChild(assessmentItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.startAssessment = startAssessment;
window.submitAnswer = submitAnswer;
window.closeAssessmentModal = closeAssessmentModal;
window.viewAssessmentHistory = viewAssessmentHistory;
window.renderAssessmentDashboard = renderAssessmentDashboard;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeAssessment();
});
