// ============================================
// MINDHAVEN - Goal and Habit Ecosystem Module
// ============================================

// Goals State
const Goals = {
    activeGoals: [],
    completedGoals: [],
    habits: [],
    habitStreaks: {},
    microGoals: []
};

// Initialize Goals Module
function initializeGoals() {
    console.log('🎯 Initializing Goal and Habit Ecosystem...');
    loadGoalsData();
    setupGoalsUI();
    console.log('✅ Goal and Habit Ecosystem initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadGoalsData() {
    // Load from userData
    if (MindHaven.userData.goals) {
        Goals.activeGoals = MindHaven.userData.goals.activeGoals || [];
        Goals.completedGoals = MindHaven.userData.goals.completedGoals || [];
        Goals.habits = MindHaven.userData.goals.habits || [];
        Goals.habitStreaks = MindHaven.userData.goals.habitStreaks || {};
        Goals.microGoals = MindHaven.userData.goals.microGoals || [];
    }
}

function saveGoalsData() {
    MindHaven.userData.goals = {
        activeGoals: Goals.activeGoals,
        completedGoals: Goals.completedGoals,
        habits: Goals.habits,
        habitStreaks: Goals.habitStreaks,
        microGoals: Goals.microGoals
    };
    saveUserData();
}

// ============================================
// GOAL MANAGEMENT
// ============================================

function createGoal(title, category = 'general', deadline = null, milestones = []) {
    const goal = {
        id: generateId(),
        title: title,
        category: category,
        deadline: deadline,
        milestones: milestones,
        completedMilestones: [],
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    Goals.activeGoals.push(goal);
    saveGoalsData();
    
    return goal;
}

function completeGoal(goalId) {
    const goalIndex = Goals.activeGoals.findIndex(g => g.id === goalId);
    if (goalIndex === -1) return;
    
    const goal = Goals.activeGoals[goalIndex];
    goal.status = 'completed';
    goal.completedAt = new Date().toISOString();
    
    // Move to completed goals
    Goals.completedGoals.push(goal);
    Goals.activeGoals.splice(goalIndex, 1);
    
    saveGoalsData();
    
    // Check for achievement
    unlockAchievement('first-goal');
    
    return goal;
}

function updateGoalProgress(goalId, milestoneIndex) {
    const goal = Goals.activeGoals.find(g => g.id === goalId);
    if (!goal) return;
    
    if (!goal.completedMilestones.includes(milestoneIndex)) {
        goal.completedMilestones.push(milestoneIndex);
        
        // Check if all milestones complete
        if (goal.completedMilestones.length === goal.milestones.length) {
            completeGoal(goalId);
        }
        
        saveGoalsData();
    }
}

function deleteGoal(goalId) {
    const index = Goals.activeGoals.findIndex(g => g.id === goalId);
    if (index !== -1) {
        Goals.activeGoals.splice(index, 1);
        saveGoalsData();
    }
}

// ============================================
// HABIT MANAGEMENT
// ============================================

function createHabit(name, frequency = 'daily', reminderTime = null) {
    const habit = {
        id: generateId(),
        name: name,
        frequency: frequency,
        reminderTime: reminderTime,
        createdAt: new Date().toISOString(),
        completions: [],
        streak: 0
    };
    
    Goals.habits.push(habit);
    Goals.habitStreaks[habit.id] = 0;
    saveGoalsData();
    
    return habit;
}

function completeHabit(habitId) {
    const habit = Goals.habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = new Date().toDateString();
    
    // Check if already completed today
    if (habit.completions.includes(today)) return;
    
    habit.completions.push(today);
    
    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (habit.completions.includes(yesterday.toDateString())) {
        habit.streak++;
    } else if (!habit.completions.includes(today)) {
        habit.streak = 1;
    }
    
    Goals.habitStreaks[habitId] = habit.streak;
    saveGoalsData();
    
    // Check for achievements
    if (habit.streak === 7) unlockAchievement('7-day-habit');
    if (habit.streak === 30) unlockAchievement('30-day-habit');
}

function deleteHabit(habitId) {
    const index = Goals.habits.findIndex(h => h.id === habitId);
    if (index !== -1) {
        Goals.habits.splice(index, 1);
        delete Goals.habitStreaks[habitId];
        saveGoalsData();
    }
}

// ============================================
// MICRO-GOALS (ADHD/DEPRESSION FRIENDLY)
// ============================================

function createMicroGoal(title) {
    const microGoal = {
        id: generateId(),
        title: title,
        createdAt: new Date().toISOString(),
        completed: false
    };
    
    Goals.microGoals.push(microGoal);
    saveGoalsData();
    
    return microGoal;
}

function completeMicroGoal(microGoalId) {
    const microGoal = Goals.microGoals.find(m => m.id === microGoalId);
    if (!microGoal || microGoal.completed) return;
    
    microGoal.completed = true;
    microGoal.completedAt = new Date().toISOString();
    
    saveGoalsData();
    
    // Clean up completed micro-goals older than 7 days
    cleanupOldMicroGoals();
}

function deleteMicroGoal(microGoalId) {
    const index = Goals.microGoals.findIndex(m => m.id === microGoalId);
    if (index !== -1) {
        Goals.microGoals.splice(index, 1);
        saveGoalsData();
    }
}

function cleanupOldMicroGoals() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    Goals.microGoals = Goals.microGoals.filter(mg => {
        if (mg.completed && mg.completedAt) {
            return new Date(mg.completedAt) > sevenDaysAgo;
        }
        return true;
    });
    
    saveGoalsData();
}

function getMicroGoalSuggestions() {
    return [
        'Drink a glass of water',
        'Open my notes for 2 minutes',
        'Text one person',
        'Put on comfortable clothes',
        'Step outside for 1 minute',
        'Eat something nourishing',
        'Take 3 deep breaths',
        'Write one sentence',
        'Do one stretching exercise',
        'Make my bed',
        'Wash one dish',
        'Put away one item'
    ];
}

// ============================================
// GOAL DASHBOARD
// ============================================

function renderGoalsDashboard() {
    const container = document.getElementById('goals-dashboard');
    if (!container) return;
    
    let html = `
        <div class="goals-dashboard">
            <div class="goals-section">
                <div class="section-header">
                    <h2>Active Goals</h2>
                    <button class="primary-btn" onclick="showCreateGoalModal()">+ New Goal</button>
                </div>
                <div class="goals-list">
                    ${renderActiveGoals()}
                </div>
            </div>
            
            <div class="habits-section">
                <div class="section-header">
                    <h2>Daily Habits</h2>
                    <button class="primary-btn" onclick="showCreateHabitModal()">+ New Habit</button>
                </div>
                <div class="habits-list">
                    ${renderHabits()}
                </div>
            </div>
            
            <div class="micro-goals-section">
                <div class="section-header">
                    <h2>Micro Goals</h2>
                    <button class="secondary-btn" onclick="showMicroGoalSuggestions()">💡 Suggestions</button>
                </div>
                <div class="micro-goals-list">
                    ${renderMicroGoals()}
                </div>
                <button class="primary-btn" onclick="showCreateMicroGoalModal()">+ Add Micro Goal</button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderActiveGoals() {
    if (Goals.activeGoals.length === 0) {
        return '<p class="empty-state">No active goals. Create your first goal!</p>';
    }
    
    return Goals.activeGoals.map(goal => {
        const progress = goal.milestones.length > 0 
            ? (goal.completedMilestones.length / goal.milestones.length) * 100 
            : 0;
        
        return `
            <div class="goal-card">
                <div class="goal-header">
                    <h3>${goal.title}</h3>
                    <span class="goal-category">${goal.category}</span>
                </div>
                ${goal.milestones.length > 0 ? `
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">${goal.completedMilestones.length}/${goal.milestones.length} milestones</span>
                    </div>
                ` : ''}
                <div class="goal-milestones">
                    ${goal.milestones.map((milestone, index) => `
                        <label class="milestone-checkbox">
                            <input type="checkbox" 
                                   ${goal.completedMilestones.includes(index) ? 'checked' : ''} 
                                   onchange="updateGoalProgress('${goal.id}', ${index})"
                                   ${goal.status === 'completed' ? 'disabled' : ''}>
                            <span>${milestone}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="goal-actions">
                    <button class="secondary-btn" onclick="deleteGoal('${goal.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderHabits() {
    if (Goals.habits.length === 0) {
        return '<p class="empty-state">No habits yet. Start building positive habits!</p>';
    }
    
    const today = new Date().toDateString();
    
    return Goals.habits.map(habit => {
        const completedToday = habit.completions.includes(today);
        
        return `
            <div class="habit-card ${completedToday ? 'completed' : ''}">
                <div class="habit-info">
                    <h3>${habit.name}</h3>
                    <span class="habit-streak">🔥 ${habit.streak} day streak</span>
                </div>
                <button class="habit-complete-btn ${completedToday ? 'completed' : ''}" 
                        onclick="completeHabit('${habit.id}')"
                        ${completedToday ? 'disabled' : ''}>
                    ${completedToday ? '✓ Done' : 'Complete'}
                </button>
                <button class="habit-delete-btn" onclick="deleteHabit('${habit.id}')">✕</button>
            </div>
        `;
    }).join('');
}

function renderMicroGoals() {
    const active = Goals.microGoals.filter(mg => !mg.completed);
    const completed = Goals.microGoals.filter(mg => mg.completed).slice(0, 5);
    
    let html = '<div class="micro-goals-active">';
    
    if (active.length === 0) {
        html += '<p class="empty-state">No active micro goals. Add one!</p>';
    } else {
        active.forEach(mg => {
            html += `
                <label class="micro-goal-item">
                    <input type="checkbox" onchange="completeMicroGoal('${mg.id}')">
                    <span>${mg.title}</span>
                </label>
            `;
        });
    }
    
    html += '</div>';
    
    if (completed.length > 0) {
        html += '<div class="micro-goals-completed">';
        html += '<h4>Recently Completed</h4>';
        completed.forEach(mg => {
            html += `
                <div class="micro-goal-item completed">
                    <span>✓ ${mg.title}</span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    return html;
}

// ============================================
// MODALS
// ============================================

function showCreateGoalModal() {
    const modal = document.createElement('div');
    modal.className = 'goal-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Create New Goal</h2>
            <form onsubmit="handleCreateGoal(event)">
                <div class="form-group">
                    <label>Goal Title</label>
                    <input type="text" id="goalTitle" required placeholder="What do you want to achieve?">
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select id="goalCategory">
                        <option value="general">General</option>
                        <option value="mental-health">Mental Health</option>
                        <option value="physical">Physical</option>
                        <option value="social">Social</option>
                        <option value="academic">Academic/Work</option>
                        <option value="creative">Creative</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Milestones (optional, one per line)</label>
                    <textarea id="goalMilestones" rows="4" placeholder="Break your goal into smaller steps..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.goal-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Create Goal</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function handleCreateGoal(event) {
    event.preventDefault();
    
    const title = document.getElementById('goalTitle').value;
    const category = document.getElementById('goalCategory').value;
    const milestonesText = document.getElementById('goalMilestones').value;
    
    const milestones = milestonesText
        .split('\n')
        .map(m => m.trim())
        .filter(m => m.length > 0);
    
    createGoal(title, category, null, milestones);
    
    event.target.closest('.goal-modal').remove();
    renderGoalsDashboard();
}

function showCreateHabitModal() {
    const modal = document.createElement('div');
    modal.className = 'goal-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Create New Habit</h2>
            <form onsubmit="handleCreateHabit(event)">
                <div class="form-group">
                    <label>Habit Name</label>
                    <input type="text" id="habitName" required placeholder="What habit do you want to build?">
                </div>
                <div class="form-group">
                    <label>Frequency</label>
                    <select id="habitFrequency">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.goal-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Create Habit</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function handleCreateHabit(event) {
    event.preventDefault();
    
    const name = document.getElementById('habitName').value;
    const frequency = document.getElementById('habitFrequency').value;
    
    createHabit(name, frequency);
    
    event.target.closest('.goal-modal').remove();
    renderGoalsDashboard();
}

function showCreateMicroGoalModal() {
    const modal = document.createElement('div');
    modal.className = 'goal-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add Micro Goal</h2>
            <form onsubmit="handleCreateMicroGoal(event)">
                <div class="form-group">
                    <label>Micro Goal</label>
                    <input type="text" id="microGoalTitle" required placeholder="A tiny, achievable goal...">
                </div>
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.goal-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Add</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function handleCreateMicroGoal(event) {
    event.preventDefault();
    
    const title = document.getElementById('microGoalTitle').value;
    
    createMicroGoal(title);
    
    event.target.closest('.goal-modal').remove();
    renderGoalsDashboard();
}

function showMicroGoalSuggestions() {
    const suggestions = getMicroGoalSuggestions();
    
    const modal = document.createElement('div');
    modal.className = 'goal-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Micro Goal Suggestions</h2>
            <div class="suggestions-list">
                ${suggestions.map(s => `
                    <button class="suggestion-btn" onclick="selectMicroGoalSuggestion('${s}')">${s}</button>
                `).join('')}
            </div>
            <button class="secondary-btn" onclick="this.closest('.goal-modal').remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function selectMicroGoalSuggestion(suggestion) {
    createMicroGoal(suggestion);
    document.querySelector('.goal-modal').remove();
    renderGoalsDashboard();
}

// ============================================
// UI SETUP
// ============================================

function setupGoalsUI() {
    addGoalsToNavigation();
}

function addGoalsToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="goals"]')) return;
    
    const goalsItem = document.createElement('button');
    goalsItem.className = 'nav-item';
    goalsItem.setAttribute('onclick', "navigateTo('goals')");
    goalsItem.setAttribute('role', 'menuitem');
    goalsItem.textContent = '🎯 Goals';
    
    const assessmentBtn = navMenu.querySelector('.nav-item[onclick*="assessment"]');
    if (assessmentBtn) {
        navMenu.insertBefore(goalsItem, assessmentBtn.nextSibling);
    } else {
        navMenu.appendChild(goalsItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.createGoal = createGoal;
window.completeGoal = completeGoal;
window.updateGoalProgress = updateGoalProgress;
window.deleteGoal = deleteGoal;
window.createHabit = createHabit;
window.completeHabit = completeHabit;
window.deleteHabit = deleteHabit;
window.createMicroGoal = createMicroGoal;
window.completeMicroGoal = completeMicroGoal;
window.deleteMicroGoal = deleteMicroGoal;
window.renderGoalsDashboard = renderGoalsDashboard;
window.showCreateGoalModal = showCreateGoalModal;
window.handleCreateGoal = handleCreateGoal;
window.showCreateHabitModal = showCreateHabitModal;
window.handleCreateHabit = handleCreateHabit;
window.showCreateMicroGoalModal = showCreateMicroGoalModal;
window.handleCreateMicroGoal = handleCreateMicroGoal;
window.showMicroGoalSuggestions = showMicroGoalSuggestions;
window.selectMicroGoalSuggestion = selectMicroGoalSuggestion;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeGoals();
});
