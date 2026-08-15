// ============================================
// MINDHAVEN - Enhanced Daily Check-In System
// ============================================

// Daily Check-In State
const DailyCheckIn = {
    morningQuestions: [
        "How did you sleep last night?",
        "What are you looking forward to today?",
        "How is your energy level right now?",
        "What's one thing you want to accomplish today?",
        "How are you feeling about the day ahead?"
    ],
    eveningQuestions: [
        "What went well today?",
        "What challenged you today?",
        "What are you grateful for today?",
        "How did you take care of yourself today?",
        "What will you do differently tomorrow?"
    ],
    customMorningQuestions: [],
    customEveningQuestions: [],
    morningCheckIns: [],
    eveningCheckIns: [],
    currentCheckInType: null,
    currentAnswers: {},
    currentQuestions: [],
    currentQuestionIndex: 0
};

// Initialize Daily Check-In System
function initializeDailyCheckIn() {
    console.log('🌅 Initializing Enhanced Daily Check-In System...');
    loadDailyCheckInData();
    setupDailyCheckInUI();
    checkPendingCheckIn();
    console.log('✅ Enhanced Daily Check-In System initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadDailyCheckInData() {
    const savedData = localStorage.getItem('mindhaven_daily_checkin');
    if (savedData) {
        const data = JSON.parse(savedData);
        DailyCheckIn.morningQuestions = data.morningQuestions || DailyCheckIn.morningQuestions;
        DailyCheckIn.eveningQuestions = data.eveningQuestions || DailyCheckIn.eveningQuestions;
        DailyCheckIn.customMorningQuestions = data.customMorningQuestions || [];
        DailyCheckIn.customEveningQuestions = data.customEveningQuestions || [];
        DailyCheckIn.morningCheckIns = data.morningCheckIns || [];
        DailyCheckIn.eveningCheckIns = data.eveningCheckIns || [];
    }
    
    if (MindHaven.userData.dailyCheckIn) {
        DailyCheckIn.morningCheckIns = MindHaven.userData.dailyCheckIn.morningCheckIns || [];
        DailyCheckIn.eveningCheckIns = MindHaven.userData.dailyCheckIn.eveningCheckIns || [];
    }
}

function saveDailyCheckInData() {
    const data = {
        morningQuestions: DailyCheckIn.morningQuestions,
        eveningQuestions: DailyCheckIn.eveningQuestions,
        customMorningQuestions: DailyCheckIn.customMorningQuestions,
        customEveningQuestions: DailyCheckIn.customEveningQuestions,
        morningCheckIns: DailyCheckIn.morningCheckIns,
        eveningCheckIns: DailyCheckIn.eveningCheckIns
    };
    
    localStorage.setItem('mindhaven_daily_checkin', JSON.stringify(data));
    
    MindHaven.userData.dailyCheckIn = {
        morningCheckIns: DailyCheckIn.morningCheckIns,
        eveningCheckIns: DailyCheckIn.eveningCheckIns
    };
    saveUserData();
}

// ============================================
// CHECK-IN TYPE DETECTION
// ============================================

function checkPendingCheckIn() {
    const now = new Date();
    const hour = now.getHours();
    const today = now.toDateString();
    
    const isMorningTime = hour >= 5 && hour < 12;
    const isEveningTime = hour >= 18 && hour < 23;
    
    const morningDone = DailyCheckIn.morningCheckIns.some(checkIn => 
        new Date(checkIn.date).toDateString() === today
    );
    
    const eveningDone = DailyCheckIn.eveningCheckIns.some(checkIn => 
        new Date(checkIn.date).toDateString() === today
    );
    
    if (isMorningTime && !morningDone) {
        showCheckInReminder('morning');
    } else if (isEveningTime && !eveningDone) {
        showCheckInReminder('evening');
    }
}

function showCheckInReminder(type) {
    const lastReminder = localStorage.getItem(`mindhaven_checkin_reminder_${type}`);
    const now = new Date().getTime();
    
    if (lastReminder && (now - parseInt(lastReminder)) < 3600000) {
        return;
    }
    
    const message = type === 'morning' 
        ? "Good morning! Time for your morning check-in. How are you starting your day?"
        : "Good evening! Time for your evening reflection. How was your day?";
    
    showGentleMessage(message);
    localStorage.setItem(`mindhaven_checkin_reminder_${type}`, now.toString());
}

// ============================================
// CHECK-IN FLOW
// ============================================

function startCheckIn(type) {
    DailyCheckIn.currentCheckInType = type;
    DailyCheckIn.currentAnswers = {};
    
    const questions = type === 'morning' 
        ? [...DailyCheckIn.morningQuestions, ...DailyCheckIn.customMorningQuestions]
        : [...DailyCheckIn.eveningQuestions, ...DailyCheckIn.customEveningQuestions];
    
    showCheckInModal(type, questions);
}

function showCheckInModal(type, questions) {
    const modal = document.createElement('div');
    modal.className = 'checkin-modal';
    modal.id = 'checkinModal';
    
    const title = type === 'morning' ? '☀️ Morning Check-In' : '🌙 Evening Reflection';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn" onclick="closeCheckInModal()">×</button>
            </div>
            <div class="checkin-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="checkinProgressFill" style="width: 0%"></div>
                </div>
                <span class="progress-text" id="checkinProgressText">0 / ${questions.length}</span>
            </div>
            <div class="checkin-question" id="checkinQuestion"></div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        padding: 20px;
    `;
    
    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        background: var(--bg-card);
        padding: 32px;
        border-radius: 16px;
        max-width: 600px;
        width: 100%;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(modal);
    
    DailyCheckIn.currentQuestions = questions;
    DailyCheckIn.currentQuestionIndex = 0;
    
    renderCheckInQuestion();
}

function renderCheckInQuestion() {
    const questionContainer = document.getElementById('checkinQuestion');
    const progressFill = document.getElementById('checkinProgressFill');
    const progressText = document.getElementById('checkinProgressText');
    
    if (!questionContainer) return;
    
    const totalQuestions = DailyCheckIn.currentQuestions.length;
    const currentIndex = DailyCheckIn.currentQuestionIndex;
    
    const progress = (currentIndex / totalQuestions) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${currentIndex} / ${totalQuestions}`;
    
    if (currentIndex >= totalQuestions) {
        completeCheckIn();
        return;
    }
    
    const question = DailyCheckIn.currentQuestions[currentIndex];
    const savedAnswer = DailyCheckIn.currentAnswers[question] || '';
    
    questionContainer.innerHTML = `
        <div class="question-content">
            <p class="question-text">${question}</p>
            <textarea 
                class="checkin-answer" 
                id="checkinAnswer"
                rows="4" 
                placeholder="Share your thoughts..."
            >${savedAnswer}</textarea>
            <div class="question-actions">
                <button class="secondary-btn" onclick="closeCheckInModal()">Cancel</button>
                <button class="primary-btn" onclick="submitCheckInAnswer()">
                    ${currentIndex === totalQuestions - 1 ? 'Complete' : 'Next'}
                </button>
            </div>
        </div>
    `;
}

function submitCheckInAnswer() {
    const answerInput = document.getElementById('checkinAnswer');
    if (!answerInput) return;
    
    const question = DailyCheckIn.currentQuestions[DailyCheckIn.currentQuestionIndex];
    const answer = answerInput.value.trim();
    
    DailyCheckIn.currentAnswers[question] = answer;
    
    DailyCheckIn.currentQuestionIndex++;
    renderCheckInQuestion();
}

function completeCheckIn() {
    const checkIn = {
        id: generateId(),
        date: new Date().toISOString(),
        type: DailyCheckIn.currentCheckInType,
        answers: DailyCheckIn.currentAnswers
    };
    
    if (DailyCheckIn.currentCheckInType === 'morning') {
        DailyCheckIn.morningCheckIns.push(checkIn);
    } else {
        DailyCheckIn.eveningCheckIns.push(checkIn);
    }
    
    saveDailyCheckInData();
    
    closeCheckInModal();
    
    const message = DailyCheckIn.currentCheckInType === 'morning'
        ? 'Morning check-in complete! Have a great day!'
        : 'Evening reflection complete. Rest well tonight!';
    
    showGentleMessage(message);
    
    // Update streak
    updateCheckInStreak();
}

function closeCheckInModal() {
    const modal = document.getElementById('checkinModal');
    if (modal) modal.remove();
    
    DailyCheckIn.currentCheckInType = null;
    DailyCheckIn.currentAnswers = {};
    DailyCheckIn.currentQuestions = [];
    DailyCheckIn.currentQuestionIndex = 0;
}

// ============================================
// STREAK TRACKING
// ============================================

function updateCheckInStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Calculate streak based on both morning and evening check-ins
    const allCheckIns = [...DailyCheckIn.morningCheckIns, ...DailyCheckIn.eveningCheckIns];
    const uniqueDays = new Set(allCheckIns.map(c => new Date(c.date).toDateString()));
    
    let streak = 0;
    let currentDate = new Date();
    
    while (uniqueDays.has(currentDate.toDateString())) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    MindHaven.userData.stats.checkInStreak = streak;
    saveUserData();
}

// ============================================
// QUESTION CUSTOMIZATION
// ============================================

function showQuestionCustomization() {
    const modal = document.createElement('div');
    modal.className = 'question-customization-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Customize Check-In Questions</h2>
                <button class="close-btn" onclick="this.closest('.question-customization-modal').remove()">×</button>
            </div>
            
            <div class="question-section">
                <h3>Morning Questions</h3>
                <div id="morningQuestionsList"></div>
                <div class="add-question">
                    <input type="text" id="newMorningQuestion" placeholder="Add a morning question...">
                    <button class="secondary-btn" onclick="addCustomQuestion('morning')">Add</button>
                </div>
            </div>
            
            <div class="question-section">
                <h3>Evening Questions</h3>
                <div id="eveningQuestionsList"></div>
                <div class="add-question">
                    <input type="text" id="newEveningQuestion" placeholder="Add an evening question...">
                    <button class="secondary-btn" onclick="addCustomQuestion('evening')">Add</button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        padding: 20px;
    `;
    
    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        background: var(--bg-card);
        padding: 32px;
        border-radius: 16px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(modal);
    
    renderQuestionLists();
}

function renderQuestionLists() {
    const morningList = document.getElementById('morningQuestionsList');
    const eveningList = document.getElementById('eveningQuestionsList');
    
    if (morningList) {
        const allMorning = [...DailyCheckIn.morningQuestions, ...DailyCheckIn.customMorningQuestions];
        morningList.innerHTML = allMorning.map((q, i) => `
            <div class="question-item ${i < DailyCheckIn.morningQuestions.length ? 'default' : 'custom'}">
                <span>${q}</span>
                ${i >= DailyCheckIn.morningQuestions.length ? 
                    `<button class="remove-btn" onclick="removeCustomQuestion('morning', ${i})">×</button>` : ''}
            </div>
        `).join('');
    }
    
    if (eveningList) {
        const allEvening = [...DailyCheckIn.eveningQuestions, ...DailyCheckIn.customEveningQuestions];
        eveningList.innerHTML = allEvening.map((q, i) => `
            <div class="question-item ${i < DailyCheckIn.eveningQuestions.length ? 'default' : 'custom'}">
                <span>${q}</span>
                ${i >= DailyCheckIn.eveningQuestions.length ? 
                    `<button class="remove-btn" onclick="removeCustomQuestion('evening', ${i})">×</button>` : ''}
            </div>
        `).join('');
    }
}

function addCustomQuestion(type) {
    const inputId = type === 'morning' ? 'newMorningQuestion' : 'newEveningQuestion';
    const input = document.getElementById(inputId);
    
    if (!input || !input.value.trim()) return;
    
    const question = input.value.trim();
    
    if (type === 'morning') {
        DailyCheckIn.customMorningQuestions.push(question);
    } else {
        DailyCheckIn.customEveningQuestions.push(question);
    }
    
    saveDailyCheckInData();
    input.value = '';
    renderQuestionLists();
}

function removeCustomQuestion(type, index) {
    const baseLength = type === 'morning' ? DailyCheckIn.morningQuestions.length : DailyCheckIn.eveningQuestions.length;
    const customIndex = index - baseLength;
    
    if (type === 'morning') {
        DailyCheckIn.customMorningQuestions.splice(customIndex, 1);
    } else {
        DailyCheckIn.customEveningQuestions.splice(customIndex, 1);
    }
    
    saveDailyCheckInData();
    renderQuestionLists();
}

// ============================================
// UI SETUP
// ============================================

function setupDailyCheckInUI() {
    addDailyCheckInToNavigation();
}

function addDailyCheckInToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="dailycheckin"]')) return;
    
    const checkInItem = document.createElement('button');
    checkInItem.className = 'nav-item';
    checkInItem.setAttribute('onclick', "navigateTo('dailycheckin')");
    checkInItem.setAttribute('role', 'menuitem');
    checkInItem.textContent = '🌅 Check-In';
    
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(checkInItem, crisisBtn);
    } else {
        navMenu.appendChild(checkInItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.startCheckIn = startCheckIn;
window.closeCheckInModal = closeCheckInModal;
window.submitCheckInAnswer = submitCheckInAnswer;
window.showQuestionCustomization = showQuestionCustomization;
window.addCustomQuestion = addCustomQuestion;
window.removeCustomQuestion = removeCustomQuestion;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeDailyCheckIn();
});
