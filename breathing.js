// ============================================
// MINDHAVEN - Guided Breathing Exercises Module
// ============================================

// Breathing State
const Breathing = {
    active: false,
    currentExercise: null,
    phase: 'inhale',
    timeRemaining: 0,
    interval: null,
    history: []
};

// Breathing Exercises
const breathingExercises = {
    '4-7-8': {
        name: '4-7-8 Breathing',
        description: 'A calming breath technique to reduce anxiety and promote sleep',
        inhale: 4,
        hold: 7,
        exhale: 8,
        cycles: 4,
        icon: '🌬️'
    },
    'box': {
        name: 'Box Breathing',
        description: 'Equal breathing pattern for stress reduction and focus',
        inhale: 4,
        hold: 4,
        exhale: 4,
        holdAfter: 4,
        cycles: 4,
        icon: '📦'
    },
    '4-2-4': {
        name: '4-2-4 Breathing',
        description: 'Quick calming technique for immediate stress relief',
        inhale: 4,
        hold: 2,
        exhale: 4,
        cycles: 5,
        icon: '💨'
    },
    '5-5': {
        name: '5-5 Breathing',
        description: 'Simple balanced breathing for relaxation',
        inhale: 5,
        exhale: 5,
        cycles: 6,
        icon: '🧘'
    }
};

// Initialize Breathing Module
function initializeBreathing() {
    console.log('🌬️ Initializing Guided Breathing Exercises...');
    loadBreathingHistory();
    setupBreathingUI();
    console.log('✅ Guided Breathing Exercises initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadBreathingHistory() {
    const savedHistory = localStorage.getItem('mindhaven_breathing_history');
    if (savedHistory) {
        Breathing.history = JSON.parse(savedHistory);
    }
}

function saveBreathingHistory() {
    localStorage.setItem('mindhaven_breathing_history', JSON.stringify(Breathing.history));
}

// ============================================
// BREATHING EXERCISES
// ============================================

function startBreathingExercise(exerciseId) {
    if (Breathing.active) {
        stopBreathingExercise();
    }
    
    const exercise = breathingExercises[exerciseId];
    if (!exercise) return;
    
    Breathing.active = true;
    Breathing.currentExercise = exerciseId;
    Breathing.phase = 'inhale';
    Breathing.timeRemaining = exercise.inhale;
    
    showBreathingModal(exercise);
    runBreathingCycle(exercise);
}

function runBreathingCycle(exercise) {
    let cycle = 0;
    let phase = 'inhale';
    let timeRemaining = exercise.inhale;
    
    Breathing.interval = setInterval(() => {
        timeRemaining--;
        
        if (timeRemaining <= 0) {
            // Move to next phase
            if (phase === 'inhale') {
                if (exercise.hold) {
                    phase = 'hold';
                    timeRemaining = exercise.hold;
                } else {
                    phase = 'exhale';
                    timeRemaining = exercise.exhale;
                }
            } else if (phase === 'hold') {
                if (exercise.holdAfter) {
                    phase = 'holdAfter';
                    timeRemaining = exercise.holdAfter;
                } else {
                    phase = 'exhale';
                    timeRemaining = exercise.exhale;
                }
            } else if (phase === 'holdAfter') {
                phase = 'exhale';
                timeRemaining = exercise.exhale;
            } else if (phase === 'exhale') {
                cycle++;
                if (cycle >= exercise.cycles) {
                    completeBreathingExercise();
                    return;
                }
                phase = 'inhale';
                timeRemaining = exercise.inhale;
            }
        }
        
        Breathing.phase = phase;
        Breathing.timeRemaining = timeRemaining;
        updateBreathingDisplay(phase, timeRemaining, cycle + 1, exercise.cycles);
    }, 1000);
}

function updateBreathingDisplay(phase, timeRemaining, currentCycle, totalCycles) {
    const phaseText = document.getElementById('breathingPhase');
    const timerText = document.getElementById('breathingTimer');
    const cycleText = document.getElementById('breathingCycle');
    const circle = document.getElementById('breathingCircle');
    
    if (phaseText) {
        const phaseLabels = {
            inhale: 'Inhale',
            hold: 'Hold',
            holdAfter: 'Hold',
            exhale: 'Exhale'
        };
        phaseText.textContent = phaseLabels[phase] || phase;
    }
    
    if (timerText) {
        timerText.textContent = timeRemaining;
    }
    
    if (cycleText) {
        cycleText.textContent = `${currentCycle}/${totalCycles}`;
    }
    
    if (circle) {
        const maxTime = Math.max(
            Breathing.currentExercise ? breathingExercises[Breathing.currentExercise].inhale : 4,
            Breathing.currentExercise ? breathingExercises[Breathing.currentExercise].hold || 0 : 0,
            Breathing.currentExercise ? breathingExercises[Breathing.currentExercise].exhale : 4
        );
        
        const scale = phase === 'exhale' ? 0.5 : 1 + (timeRemaining / maxTime) * 0.5;
        circle.style.transform = `scale(${scale})`;
        
        const colors = {
            inhale: '#A8C3A1',
            hold: '#8FAACF',
            holdAfter: '#8FAACF',
            exhale: '#E57373'
        };
        circle.style.background = colors[phase] || '#A8C3A1';
    }
}

function completeBreathingExercise() {
    clearInterval(Breathing.interval);
    Breathing.active = false;
    
    // Log completion
    Breathing.history.push({
        date: new Date().toISOString(),
        exercise: Breathing.currentExercise,
        duration: calculateExerciseDuration(Breathing.currentExercise)
    });
    
    saveBreathingHistory();
    
    showBreathingCompletion();
}

function calculateExerciseDuration(exerciseId) {
    const exercise = breathingExercises[exerciseId];
    if (!exercise) return 0;
    
    const cycleDuration = (exercise.inhale || 0) + (exercise.hold || 0) + (exercise.exhale || 0) + (exercise.holdAfter || 0);
    return cycleDuration * exercise.cycles;
}

function stopBreathingExercise() {
    if (Breathing.interval) {
        clearInterval(Breathing.interval);
    }
    Breathing.active = false;
    
    const modal = document.getElementById('breathingModal');
    if (modal) modal.remove();
}

// ============================================
// MODAL DISPLAY
// ============================================

function showBreathingModal(exercise) {
    const modal = document.createElement('div');
    modal.id = 'breathingModal';
    modal.className = 'breathing-modal';
    
    modal.innerHTML = `
        <div class="breathing-modal-content">
            <div class="breathing-header">
                <h2>${exercise.icon} ${exercise.name}</h2>
                <button class="close-btn" onclick="stopBreathingExercise()">×</button>
            </div>
            <div class="breathing-instructions">
                <p>${exercise.description}</p>
            </div>
            <div class="breathing-display">
                <div class="breathing-circle" id="breathingCircle"></div>
                <div class="breathing-info">
                    <div class="breathing-phase" id="breathingPhase">Inhale</div>
                    <div class="breathing-timer" id="breathingTimer">4</div>
                    <div class="breathing-cycle" id="breathingCycle">1/${exercise.cycles}</div>
                </div>
            </div>
            <div class="breathing-actions">
                <button class="secondary-btn" onclick="stopBreathingExercise()">Stop</button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        padding: 20px;
    `;
    
    const content = modal.querySelector('.breathing-modal-content');
    content.style.cssText = `
        background: var(--bg-card);
        padding: 40px;
        border-radius: 20px;
        max-width: 500px;
        width: 100%;
        text-align: center;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(modal);
}

function showBreathingCompletion() {
    const modal = document.getElementById('breathingModal');
    if (!modal) return;
    
    const content = modal.querySelector('.breathing-modal-content');
    if (content) {
        content.innerHTML = `
            <div class="breathing-completion">
                <div class="completion-icon">✨</div>
                <h2>Well Done!</h2>
                <p>You've completed the breathing exercise.</p>
                <p>Take a moment to notice how you feel.</p>
                <button class="primary-btn" onclick="stopBreathingExercise()">Done</button>
            </div>
        `;
    }
}

// ============================================
// UI SETUP
// ============================================

function setupBreathingUI() {
    addBreathingToNavigation();
    renderBreathingExercises();
}

function addBreathingToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="breathing"]')) return;
    
    const breathingItem = document.createElement('button');
    breathingItem.className = 'nav-item';
    breathingItem.setAttribute('onclick', "navigateTo('breathing')");
    breathingItem.setAttribute('role', 'menuitem');
    breathingItem.textContent = '🌬️ Breathing';
    
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(breathingItem, crisisBtn);
    } else {
        navMenu.appendChild(breathingItem);
    }
}

function renderBreathingExercises() {
    const container = document.getElementById('breathingExercises');
    if (!container) return;
    
    let html = '';
    
    Object.entries(breathingExercises).forEach(([id, exercise]) => {
        html += `
            <div class="breathing-exercise-card">
                <div class="exercise-icon">${exercise.icon}</div>
                <div class="exercise-info">
                    <h3>${exercise.name}</h3>
                    <p>${exercise.description}</p>
                    <div class="exercise-pattern">
                        <span class="pattern-step">Inhale: ${exercise.inhale}s</span>
                        ${exercise.hold ? `<span class="pattern-step">Hold: ${exercise.hold}s</span>` : ''}
                        ${exercise.holdAfter ? `<span class="pattern-step">Hold: ${exercise.holdAfter}s</span>` : ''}
                        <span class="pattern-step">Exhale: ${exercise.exhale}s</span>
                    </div>
                    <p class="exercise-cycles">${exercise.cycles} cycles</p>
                </div>
                <button class="primary-btn" onclick="startBreathingExercise('${id}')">Start</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.startBreathingExercise = startBreathingExercise;
window.stopBreathingExercise = stopBreathingExercise;
window.renderBreathingExercises = renderBreathingExercises;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeBreathing();
});
