// ============================================
// MINDHAVEN - Student Support Hub Module
// ============================================

// Student State
const Student = {
    studySessions: [],
    examSchedule: [],
    academicGoals: [],
    burnoutAssessments: [],
    currentSession: null
};

// Initialize Student Module
function initializeStudent() {
    console.log('📚 Initializing Student Support Hub...');
    loadStudentData();
    setupStudentUI();
    console.log('✅ Student Support Hub initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadStudentData() {
    if (MindHaven.userData.student) {
        Student.studySessions = MindHaven.userData.student.studySessions || [];
        Student.examSchedule = MindHaven.userData.student.examSchedule || [];
        Student.academicGoals = MindHaven.userData.student.academicGoals || [];
        Student.burnoutAssessments = MindHaven.userData.student.burnoutAssessments || [];
    }
}

function saveStudentData() {
    MindHaven.userData.student = {
        studySessions: Student.studySessions,
        examSchedule: Student.examSchedule,
        academicGoals: Student.academicGoals,
        burnoutAssessments: Student.burnoutAssessments
    };
    saveUserData();
}

// ============================================
// STUDY SESSIONS
// ============================================

function startStudySession(subject, duration = 25) {
    Student.currentSession = {
        id: generateId(),
        subject: subject,
        duration: duration,
        startTime: new Date().toISOString(),
        completed: false
    };
    
    showStudyTimer(Student.currentSession);
}

function showStudyTimer(session) {
    const modal = document.createElement('div');
    modal.className = 'study-modal';
    modal.id = 'studyTimerModal';
    modal.innerHTML = `
        <div class="modal-content study-timer-content">
            <div class="study-header">
                <span class="study-icon">📚</span>
                <h2>Study Session</h2>
                <p class="study-subject">${session.subject}</p>
            </div>
            <div class="timer-display">
                <span class="timer-minutes">${session.duration}</span>
                <span class="timer-label">minutes</span>
            </div>
            <div class="study-tips">
                <p>💡 Tip: Take short breaks every 25 minutes</p>
                <p>🎯 Focus on one task at a time</p>
            </div>
            <div class="study-actions">
                <button class="secondary-btn" onclick="cancelStudySession()">Cancel</button>
                <button class="primary-btn" onclick="completeStudySession()">Complete Session</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function cancelStudySession() {
    const modal = document.getElementById('studyTimerModal');
    if (modal) modal.remove();
    Student.currentSession = null;
}

function completeStudySession() {
    if (!Student.currentSession) return;
    
    Student.currentSession.endTime = new Date().toISOString();
    Student.currentSession.completed = true;
    
    Student.studySessions.push(Student.currentSession);
    saveStudentData();
    
    cancelStudySession();
    
    // Show completion message
    showGentleMessage('Great job! Study session completed.');
    
    // Update UI
    renderStudentDashboard();
}

// ============================================
// EXAM SCHEDULE
// ============================================

function addExam(name, date, subject) {
    const exam = {
        id: generateId(),
        name: name,
        date: date,
        subject: subject,
        createdAt: new Date().toISOString()
    };
    
    Student.examSchedule.push(exam);
    saveStudentData();
    
    renderStudentDashboard();
}

function removeExam(examId) {
    const index = Student.examSchedule.findIndex(e => e.id === examId);
    if (index !== -1) {
        Student.examSchedule.splice(index, 1);
        saveStudentData();
        renderStudentDashboard();
    }
}

// ============================================
// ACADEMIC GOALS
// ============================================

function addAcademicGoal(title, deadline, category) {
    const goal = {
        id: generateId(),
        title: title,
        deadline: deadline,
        category: category,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    Student.academicGoals.push(goal);
    saveStudentData();
    
    renderStudentDashboard();
}

function completeAcademicGoal(goalId) {
    const goal = Student.academicGoals.find(g => g.id === goalId);
    if (goal) {
        goal.completed = true;
        goal.completedAt = new Date().toISOString();
        saveStudentData();
        renderStudentDashboard();
    }
}

function removeAcademicGoal(goalId) {
    const index = Student.academicGoals.findIndex(g => g.id === goalId);
    if (index !== -1) {
        Student.academicGoals.splice(index, 1);
        saveStudentData();
        renderStudentDashboard();
    }
}

// ============================================
// BURNOUT ASSESSMENT
// ============================================

function takeBurnoutAssessment() {
    const modal = document.createElement('div');
    modal.className = 'student-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Academic Burnout Check</h2>
            <p>Rate how much you agree with each statement (1-5)</p>
            <form onsubmit="handleBurnoutAssessment(event)">
                <div class="burnout-questions">
                    ${getBurnoutQuestions().map((q, i) => `
                        <div class="burnout-question">
                            <p class="question-text">${q}</p>
                            <div class="rating-options">
                                ${[1, 2, 3, 4, 5].map(n => `
                                    <label class="rating-option">
                                        <input type="radio" name="q${i}" value="${n}" required>
                                        <span>${n}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.student-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Submit</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function getBurnoutQuestions() {
    return [
        'I feel exhausted by my academic workload',
        'I\'ve lost interest in subjects I used to enjoy',
        'I feel cynical about my studies',
        'I struggle to concentrate during study sessions',
        'I feel overwhelmed by deadlines and expectations',
        'My grades are declining despite my efforts',
        'I avoid studying or attending classes',
        'I feel like my academic efforts don\'t matter'
    ];
}

function handleBurnoutAssessment(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    let totalScore = 0;
    const questions = getBurnoutQuestions();
    
    for (let i = 0; i < questions.length; i++) {
        const value = parseInt(formData.get(`q${i}`));
        totalScore += value;
    }
    
    const maxScore = questions.length * 5;
    const percentage = (totalScore / maxScore) * 100;
    
    let riskLevel = 'Low';
    let color = '#A8C3A1';
    let recommendation = 'You\'re managing your academic stress well. Keep up the good work!';
    
    if (percentage >= 70) {
        riskLevel = 'High';
        color = '#E57373';
        recommendation = 'Consider reaching out to a counselor or academic advisor. Your burnout risk is high.';
    } else if (percentage >= 50) {
        riskLevel = 'Moderate';
        color = '#FFB74D';
        recommendation = 'Take steps to reduce your workload and prioritize self-care.';
    }
    
    const assessment = {
        id: generateId(),
        score: totalScore,
        percentage: percentage,
        riskLevel: riskLevel,
        recommendation: recommendation,
        date: new Date().toISOString()
    };
    
    Student.burnoutAssessments.push(assessment);
    saveStudentData();
    
    event.target.closest('.student-modal').remove();
    
    // Show results
    showBurnoutResults(assessment);
}

function showBurnoutResults(assessment) {
    const modal = document.createElement('div');
    modal.className = 'student-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Burnout Assessment Results</h2>
            <div class="burnout-results">
                <div class="result-score" style="color: ${assessment.riskLevel === 'High' ? '#E57373' : assessment.riskLevel === 'Moderate' ? '#FFB74D' : '#A8C3A1'}">
                    ${assessment.riskLevel} Risk
                </div>
                <p class="result-recommendation">${assessment.recommendation}</p>
                <div class="result-tips">
                    <h3>Quick Tips:</h3>
                    <ul>
                        <li>Take regular breaks during study sessions</li>
                        <li>Prioritize sleep and physical activity</li>
                        <li>Connect with peers for support</li>
                        <li>Consider talking to a counselor if needed</li>
                    </ul>
                </div>
            </div>
            <button class="primary-btn" onclick="this.closest('.student-modal').remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ============================================
// STUDENT DASHBOARD
// ============================================

function renderStudentDashboard() {
    const container = document.getElementById('student-dashboard');
    if (!container) return;
    
    let html = `
        <div class="student-dashboard">
            <div class="quick-actions">
                <button class="action-card" onclick="showStartStudyModal()">
                    <span class="action-icon">⏱️</span>
                    <span class="action-label">Start Study Session</span>
                </button>
                <button class="action-card" onclick="takeBurnoutAssessment()">
                    <span class="action-icon">🔥</span>
                    <span class="action-label">Burnout Check</span>
                </button>
                <button class="action-card" onclick="showAddExamModal()">
                    <span class="action-icon">📅</span>
                    <span class="action-label">Add Exam</span>
                </button>
                <button class="action-card" onclick="showAddGoalModal()">
                    <span class="action-icon">🎯</span>
                    <span class="action-label">Add Goal</span>
                </button>
            </div>
            
            <div class="student-sections">
                <div class="student-section">
                    <h3>Upcoming Exams</h3>
                    <div class="exams-list">
                        ${renderExamsList()}
                    </div>
                </div>
                
                <div class="student-section">
                    <h3>Academic Goals</h3>
                    <div class="goals-list">
                        ${renderAcademicGoals()}
                    </div>
                </div>
                
                <div class="student-section">
                    <h3>Study Statistics</h3>
                    <div class="study-stats">
                        ${renderStudyStats()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderExamsList() {
    const upcoming = Student.examSchedule
        .filter(e => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    if (upcoming.length === 0) {
        return '<p class="empty-state">No upcoming exams scheduled.</p>';
    }
    
    return upcoming.map(exam => {
        const daysUntil = Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24));
        const urgencyClass = daysUntil <= 3 ? 'urgent' : daysUntil <= 7 ? 'soon' : 'normal';
        
        return `
            <div class="exam-item ${urgencyClass}">
                <div class="exam-info">
                    <span class="exam-name">${exam.name}</span>
                    <span class="exam-subject">${exam.subject}</span>
                    <span class="exam-date">${new Date(exam.date).toLocaleDateString()}</span>
                </div>
                <span class="exam-days">${daysUntil} days</span>
                <button class="remove-btn" onclick="removeExam('${exam.id}')">✕</button>
            </div>
        `;
    }).join('');
}

function renderAcademicGoals() {
    const active = Student.academicGoals.filter(g => !g.completed);
    
    if (active.length === 0) {
        return '<p class="empty-state">No active academic goals. Add one above!</p>';
    }
    
    return active.map(goal => {
        const daysUntil = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
        
        return `
            <div class="academic-goal-item">
                <label class="goal-checkbox">
                    <input type="checkbox" onchange="completeAcademicGoal('${goal.id}')">
                    <span class="goal-title">${goal.title}</span>
                </label>
                <div class="goal-meta">
                    <span class="goal-category">${goal.category}</span>
                    ${daysUntil !== null ? `<span class="goal-deadline">${daysUntil} days left</span>` : ''}
                </div>
                <button class="remove-btn" onclick="removeAcademicGoal('${goal.id}')">✕</button>
            </div>
        `;
    }).join('');
}

function renderStudyStats() {
    const totalSessions = Student.studySessions.length;
    const totalMinutes = Student.studySessions.reduce((sum, s) => {
        if (s.startTime && s.endTime) {
            const duration = (new Date(s.endTime) - new Date(s.startTime)) / (1000 * 60);
            return sum + duration;
        }
        return sum + (s.duration || 0);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `
        <div class="stat-item">
            <span class="stat-value">${totalSessions}</span>
            <span class="stat-label">Sessions</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${hours}h ${minutes}m</span>
            <span class="stat-label">Total Time</span>
        </div>
    `;
}

// ============================================
// MODALS
// ============================================

function showStartStudyModal() {
    const modal = document.createElement('div');
    modal.className = 'student-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Start Study Session</h2>
            <form onsubmit="handleStartStudy(event)">
                <div class="form-group">
                    <label>Subject</label>
                    <input type="text" id="studySubject" required placeholder="e.g., Mathematics">
                </div>
                <div class="form-group">
                    <label>Duration (minutes)</label>
                    <select id="studyDuration">
                        <option value="25">25 minutes (Pomodoro)</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.student-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Start</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function handleStartStudy(event) {
    event.preventDefault();
    
    const subject = document.getElementById('studySubject').value;
    const duration = parseInt(document.getElementById('studyDuration').value);
    
    event.target.closest('.student-modal').remove();
    startStudySession(subject, duration);
}

function showAddExamModal() {
    const modal = document.createElement('div');
    modal.className = 'student-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add Exam</h2>
            <form onsubmit="handleAddExam(event)">
                <div class="form-group">
                    <label>Exam Name</label>
                    <input type="text" id="examName" required placeholder="e.g., Midterm Exam">
                </div>
                <div class="form-group">
                    <label>Subject</label>
                    <input type="text" id="examSubject" required placeholder="e.g., Physics">
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="examDate" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.student-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Add</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function handleAddExam(event) {
    event.preventDefault();
    
    const name = document.getElementById('examName').value;
    const subject = document.getElementById('examSubject').value;
    const date = document.getElementById('examDate').value;
    
    addExam(name, date, subject);
    
    event.target.closest('.student-modal').remove();
}

function showAddGoalModal() {
    const modal = document.createElement('div');
    modal.className = 'student-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add Academic Goal</h2>
            <form onsubmit="handleAddGoal(event)">
                <div class="form-group">
                    <label>Goal</label>
                    <input type="text" id="goalTitle" required placeholder="e.g., Complete chapter 5">
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select id="goalCategory">
                        <option value="Study">Study</option>
                        <option value="Assignment">Assignment</option>
                        <option value="Project">Project</option>
                        <option value="Exam Prep">Exam Prep</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Deadline (optional)</label>
                    <input type="date" id="goalDeadline">
                </div>
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.student-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Add</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function handleAddGoal(event) {
    event.preventDefault();
    
    const title = document.getElementById('goalTitle').value;
    const category = document.getElementById('goalCategory').value;
    const deadline = document.getElementById('goalDeadline').value || null;
    
    addAcademicGoal(title, deadline, category);
    
    event.target.closest('.student-modal').remove();
}

// ============================================
// UI SETUP
// ============================================

function setupStudentUI() {
    addStudentToNavigation();
}

function addStudentToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="student"]')) return;
    
    const studentItem = document.createElement('button');
    studentItem.className = 'nav-item';
    studentItem.setAttribute('onclick', "navigateTo('student')");
    studentItem.setAttribute('role', 'menuitem');
    studentItem.textContent = '📚 Student';
    
    const decisionsBtn = navMenu.querySelector('.nav-item[onclick*="decisions"]');
    if (decisionsBtn) {
        navMenu.insertBefore(studentItem, decisionsBtn.nextSibling);
    } else {
        navMenu.appendChild(studentItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.startStudySession = startStudySession;
window.cancelStudySession = cancelStudySession;
window.completeStudySession = completeStudySession;
window.addExam = addExam;
window.removeExam = removeExam;
window.addAcademicGoal = addAcademicGoal;
window.completeAcademicGoal = completeAcademicGoal;
window.removeAcademicGoal = removeAcademicGoal;
window.takeBurnoutAssessment = takeBurnoutAssessment;
window.handleBurnoutAssessment = handleBurnoutAssessment;
window.renderStudentDashboard = renderStudentDashboard;
window.showStartStudyModal = showStartStudyModal;
window.handleStartStudy = handleStartStudy;
window.showAddExamModal = showAddExamModal;
window.handleAddExam = handleAddExam;
window.showAddGoalModal = showAddGoalModal;
window.handleAddGoal = handleAddGoal;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeStudent();
});
