// ============================================
// MINDHAVEN - Coping Toolkit Module
// ============================================

// Coping Tools State
const Coping = {
    activeTool: null,
    breathingInterval: null,
    groundingStep: 0,
    overthinkingWorry: '',
    lowEnergyTasks: []
};

// Low Energy Tasks
const lowEnergyTasks = [
    { id: 1, task: 'Sit up in bed', completed: false },
    { id: 2, task: 'Drink water', completed: false },
    { id: 3, task: 'Wash face', completed: false },
    { id: 4, task: 'Open curtains', completed: false },
    { id: 5, task: 'Take one deep breath', completed: false },
    { id: 6, task: 'Eat something', completed: false },
    { id: 7, task: 'Change clothes', completed: false },
    { id: 8, task: 'Text someone safe', completed: false }
];

// Overthinking Questions
const overthinkingQuestions = [
    'What evidence supports this thought?',
    'What evidence may not support this thought?',
    'What would you tell a friend in this situation?',
    'What feels most painful about this thought?',
    'Is there another way to look at this?',
    'What would happen if you let this thought go?'
];

// Loneliness Prompts
const lonelinessPrompts = [
    'What kind of connection would feel nourishing right now?',
    'Who is someone safe you could reach out to?',
    'What small step toward connection feels doable?',
    'Remember: You are worthy of connection.',
    'What activities make you feel less alone?',
    'How can you be gentle with yourself while feeling lonely?'
];

// Initialize Coping Module
function initializeCoping() {
    console.log('🧰 Initializing Coping Toolkit...');
    console.log('✅ Coping Toolkit initialized');
}

// ============================================
// PANIC RELIEF MODE
// ============================================

function openPanicRelief() {
    const contentArea = document.getElementById('coping-content');
    if (contentArea) {
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = `
            <div class="panic-relief-container">
                <div class="panic-message">
                    <h2>You are safe right now.</h2>
                    <p>This feeling will pass. Focus on your breath.</p>
                </div>
                
                <div class="panic-breathing">
                    <div class="breathing-circle-large" id="panicBreathingCircle">
                        <span class="breathing-text-large" id="panicBreathingText">Breathe</span>
                    </div>
                </div>
                
                <div class="panic-buttons">
                    <button class="primary-btn panic-btn-large" onclick="startPanicBreathing()">
                        Start Guided Breathing
                    </button>
                    <button class="secondary-btn panic-btn-large" onclick="startPanicGrounding()">
                        5-4-3-2-1 Grounding
                    </button>
                    <button class="secondary-btn panic-btn-large" onclick="navigateTo('calmspace')">
                        Go to Calm Space
                    </button>
                </div>
                
                <div class="panic-instructions">
                    <p><strong>Remember:</strong></p>
                    <ul>
                        <li>You are not in danger</li>
                        <li>This will pass</li>
                        <li>You have gotten through this before</li>
                        <li>Take it one breath at a time</li>
                    </ul>
                </div>
            </div>
        `;
        
        contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    Coping.activeTool = 'panic-relief';
    MindHaven.userData.stats.copingToolsUsed++;
    saveUserData();
}

function startPanicBreathing() {
    const circle = document.getElementById('panicBreathingCircle');
    const text = document.getElementById('panicBreathingText');
    
    if (!circle || !text) return;
    
    let phase = 0; // 0: inhale, 1: hold, 2: exhale
    const phases = [
        { text: 'Breathe In', duration: 4000, scale: 1.2 },
        { text: 'Hold', duration: 4000, scale: 1.2 },
        { text: 'Breathe Out', duration: 4000, scale: 1.0 }
    ];
    
    function runBreathingCycle() {
        const currentPhase = phases[phase];
        text.textContent = currentPhase.text;
        circle.style.transform = `scale(${currentPhase.scale})`;
        circle.style.transition = `transform ${currentPhase.duration / 1000}s ease-in-out`;
        
        phase = (phase + 1) % phases.length;
    }
    
    runBreathingCycle();
    Coping.breathingInterval = setInterval(runBreathingCycle, 4000);
}

function startPanicGrounding() {
    navigateTo('coping', 'grounding');
}

// ============================================
// CALM DOWN MODE
// ============================================

function openCalmDown() {
    navigateTo('calmspace');
}

// ============================================
// OVERTHINKING BREAKER
// ============================================

function openOverthinkingBreaker() {
    const contentArea = document.getElementById('coping-content');
    if (contentArea) {
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = `
            <div class="overthinking-container">
                <h2>Overthinking Breaker 🧠</h2>
                <p class="overthinking-subtitle">Let's gently examine this thought together.</p>
                
                <div class="overthinking-input">
                    <label for="worryInput">What's on your mind?</label>
                    <textarea 
                        id="worryInput" 
                        class="journal-textarea"
                        placeholder="Type your worry here... e.g., 'I think my friend hates me.'"
                    ></textarea>
                </div>
                
                <button class="primary-btn" onclick="processOverthinking()">Explore This Thought</button>
                
                <div id="overthinkingQuestions" class="overthinking-questions hidden">
                    <h3>Gentle Reflection</h3>
                    <div id="questionsContainer"></div>
                </div>
            </div>
        `;
        
        contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    Coping.activeTool = 'overthinking';
    MindHaven.userData.stats.copingToolsUsed++;
    saveUserData();
}

function processOverthinking() {
    const worryInput = document.getElementById('worryInput');
    if (!worryInput) return;
    
    const worry = worryInput.value.trim();
    if (!worry) {
        showGentleMessage('Please share what\'s on your mind');
        return;
    }
    
    Coping.overthinkingWorry = worry;
    
    const questionsContainer = document.getElementById('questionsContainer');
    const questionsSection = document.getElementById('overthinkingQuestions');
    
    if (questionsContainer && questionsSection) {
        questionsSection.classList.remove('hidden');
        
        let html = '';
        overthinkingQuestions.forEach((question, index) => {
            html += `
                <div class="question-item">
                    <p class="question-text">${question}</p>
                    <textarea 
                        class="question-answer journal-textarea"
                        id="answer-${index}"
                        placeholder="Take your time..."
                        rows="3"
                    ></textarea>
                </div>
            `;
        });
        
        html += `
            <button class="primary-btn" onclick="saveOverthinkingReflection()">Save Reflection</button>
        `;
        
        questionsContainer.innerHTML = html;
    }
}

function saveOverthinkingReflection() {
    const answers = [];
    overthinkingQuestions.forEach((question, index) => {
        const answerInput = document.getElementById(`answer-${index}`);
        if (answerInput) {
            answers.push({
                question: question,
                answer: answerInput.value
            });
        }
    });
    
    const reflection = {
        id: generateId(),
        date: new Date().toISOString(),
        worry: Coping.overthinkingWorry,
        answers: answers
    };
    
    // Save to journal
    MindHaven.userData.journalEntries.push({
        id: generateId(),
        date: new Date().toISOString(),
        type: 'overthinking-reflection',
        content: JSON.stringify(reflection),
        prompt: 'Overthinking Reflection'
    });
    
    MindHaven.userData.stats.journalEntries++;
    saveUserData();
    
    showGentleMessage('Reflection saved. Thank you for taking time to examine this thought gently.');
    
    // Clear the form
    document.getElementById('worryInput').value = '';
    document.getElementById('overthinkingQuestions').classList.add('hidden');
}

// ============================================
// LOW ENERGY MODE
// ============================================

function openLowEnergyMode() {
    const contentArea = document.getElementById('coping-content');
    if (contentArea) {
        contentArea.classList.remove('hidden');
        
        // Reset tasks
        Coping.lowEnergyTasks = lowEnergyTasks.map(task => ({ ...task, completed: false }));
        
        contentArea.innerHTML = `
            <div class="low-energy-container">
                <h2>Low Energy Mode 😔</h2>
                <p class="low-energy-subtitle">Tiny steps only. No pressure. Be gentle with yourself.</p>
                
                <div class="low-energy-tasks" id="lowEnergyTasks">
                    ${generateLowEnergyTasksHTML()}
                </div>
                
                <div class="low-energy-message">
                    <p>Remember: Even the smallest step is progress. Rest is productive too.</p>
                </div>
            </div>
        `;
        
        contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    Coping.activeTool = 'low-energy';
    MindHaven.userData.stats.copingToolsUsed++;
    saveUserData();
}

function generateLowEnergyTasksHTML() {
    return Coping.lowEnergyTasks.map(task => `
        <div class="low-energy-task ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <button class="task-checkbox" onclick="toggleLowEnergyTask(${task.id})" aria-label="Toggle task">
                ${task.completed ? '✅' : '⬜'}
            </button>
            <span class="task-text">${task.task}</span>
        </div>
    `).join('');
}

function toggleLowEnergyTask(taskId) {
    const task = Coping.lowEnergyTasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        
        const tasksContainer = document.getElementById('lowEnergyTasks');
        if (tasksContainer) {
            tasksContainer.innerHTML = generateLowEnergyTasksHTML();
        }
        
        // Check if all tasks completed
        if (Coping.lowEnergyTasks.every(t => t.completed)) {
            showGentleMessage('Beautiful work. You completed some tiny steps today. 💚');
        }
    }
}

// ============================================
// LONELINESS COMPANION
// ============================================

function openLonelinessCompanion() {
    const contentArea = document.getElementById('coping-content');
    if (contentArea) {
        contentArea.classList.remove('hidden');
        
        const randomPrompt = lonelinessPrompts[Math.floor(Math.random() * lonelinessPrompts.length)];
        
        contentArea.innerHTML = `
            <div class="loneliness-container">
                <h2>Loneliness Companion 🫂</h2>
                <p class="loneliness-subtitle">You are not alone in feeling lonely.</p>
                
                <div class="loneliness-prompt">
                    <div class="prompt-card">
                        <p class="prompt-text">"${randomPrompt}"</p>
                    </div>
                    <button class="secondary-btn" onclick="openLonelinessCompanion()">New Prompt</button>
                </div>
                
                <div class="loneliness-reflection">
                    <label for="lonelinessReflection">Your thoughts:</label>
                    <textarea 
                        id="lonelinessReflection"
                        class="journal-textarea"
                        placeholder="Write whatever feels right..."
                        rows="5"
                    ></textarea>
                    <button class="primary-btn" onclick="saveLonelinessReflection()">Save Reflection</button>
                </div>
                
                <div class="loneliness-suggestions">
                    <h3>Gentle Connection Ideas</h3>
                    <ul>
                        <li>Send a text to someone you haven't spoken to in a while</li>
                        <li>Join an online community with shared interests</li>
                        <li>Spend time in a public place (coffee shop, park)</li>
                        <li>Call a family member just to say hi</li>
                        <li>Write a letter to someone (even if you don't send it)</li>
                    </ul>
                </div>
                
                <div class="loneliness-reminder">
                    <p><strong>Remember:</strong> Loneliness is a feeling, not a fact. You are worthy of connection.</p>
                </div>
            </div>
        `;
        
        contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    Coping.activeTool = 'loneliness';
    MindHaven.userData.stats.copingToolsUsed++;
    saveUserData();
}

function saveLonelinessReflection() {
    const reflectionInput = document.getElementById('lonelinessReflection');
    if (!reflectionInput) return;
    
    const reflection = reflectionInput.value.trim();
    if (!reflection) {
        showGentleMessage('Please share your thoughts');
        return;
    }
    
    MindHaven.userData.journalEntries.push({
        id: generateId(),
        date: new Date().toISOString(),
        type: 'loneliness-reflection',
        content: reflection,
        prompt: 'Loneliness Companion'
    });
    
    MindHaven.userData.stats.journalEntries++;
    saveUserData();
    
    showGentleMessage('Reflection saved. Your thoughts matter.');
    reflectionInput.value = '';
}

// ============================================
// BREATHING GUIDE
// ============================================

function openBreathingGuide() {
    const contentArea = document.getElementById('coping-content');
    if (contentArea) {
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = `
            <div class="breathing-guide-container">
                <h2>Breathing Guide 🫁</h2>
                <p class="breathing-subtitle">Calm your nervous system with controlled breathing.</p>
                
                <div class="breathing-patterns">
                    <button class="breathing-pattern-btn" onclick="startBreathingPattern('4-7-8')">
                        <h3>4-7-8 Breathing</h3>
                        <p>Inhale 4s, Hold 7s, Exhale 8s</p>
                        <p class="pattern-benefit">Great for sleep and anxiety</p>
                    </button>
                    
                    <button class="breathing-pattern-btn" onclick="startBreathingPattern('box')">
                        <h3>Box Breathing</h3>
                        <p>Inhale 4s, Hold 4s, Exhale 4s, Hold 4s</p>
                        <p class="pattern-benefit">Great for focus and stress</p>
                    </button>
                    
                    <button class="breathing-pattern-btn" onclick="startBreathingPattern('4-4-4')">
                        <h3>Simple Breathing</h3>
                        <p>Inhale 4s, Exhale 4s</p>
                        <p class="pattern-benefit">Easy for beginners</p>
                    </button>
                </div>
                
                <div id="breathingExercise" class="breathing-exercise hidden">
                    <div class="breathing-circle" id="guideBreathingCircle">
                        <span class="breathing-text" id="guideBreathingText">Ready</span>
                    </div>
                    <button class="secondary-btn" onclick="stopBreathingExercise()">Stop</button>
                </div>
            </div>
        `;
        
        contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    Coping.activeTool = 'breathing';
    MindHaven.userData.stats.copingToolsUsed++;
    saveUserData();
}

function startBreathingPattern(pattern) {
    const exerciseArea = document.getElementById('breathingExercise');
    const circle = document.getElementById('guideBreathingCircle');
    const text = document.getElementById('guideBreathingText');
    
    if (!exerciseArea || !circle || !text) return;
    
    exerciseArea.classList.remove('hidden');
    
    let phase = 0;
    let phases = [];
    
    switch(pattern) {
        case '4-7-8':
            phases = [
                { text: 'Breathe In', duration: 4000, scale: 1.2 },
                { text: 'Hold', duration: 7000, scale: 1.2 },
                { text: 'Breathe Out', duration: 8000, scale: 1.0 }
            ];
            break;
        case 'box':
            phases = [
                { text: 'Breathe In', duration: 4000, scale: 1.2 },
                { text: 'Hold', duration: 4000, scale: 1.2 },
                { text: 'Breathe Out', duration: 4000, scale: 1.0 },
                { text: 'Hold', duration: 4000, scale: 1.0 }
            ];
            break;
        case '4-4-4':
        default:
            phases = [
                { text: 'Breathe In', duration: 4000, scale: 1.2 },
                { text: 'Breathe Out', duration: 4000, scale: 1.0 }
            ];
            break;
    }
    
    function runBreathingCycle() {
        const currentPhase = phases[phase];
        text.textContent = currentPhase.text;
        circle.style.transform = `scale(${currentPhase.scale})`;
        circle.style.transition = `transform ${currentPhase.duration / 1000}s ease-in-out`;
        
        phase = (phase + 1) % phases.length;
    }
    
    runBreathingCycle();
    Coping.breathingInterval = setInterval(runBreathingCycle, phases.reduce((max, p) => Math.max(max, p.duration), 0));
}

function stopBreathingExercise() {
    if (Coping.breathingInterval) {
        clearInterval(Coping.breathingInterval);
        Coping.breathingInterval = null;
    }
    
    const exerciseArea = document.getElementById('breathingExercise');
    if (exerciseArea) {
        exerciseArea.classList.add('hidden');
    }
}

// ============================================
// GROUNDING EXERCISE
// ============================================

function openGroundingExercise() {
    const contentArea = document.getElementById('coping-content');
    if (contentArea) {
        contentArea.classList.remove('hidden');
        Coping.groundingStep = 0;
        
        contentArea.innerHTML = `
            <div class="grounding-container">
                <h2>5-4-3-2-1 Grounding 🌍</h2>
                <p class="grounding-subtitle">Use your senses to return to the present moment.</p>
                
                <div id="groundingExercise" class="grounding-exercise">
                    ${generateGroundingStepHTML()}
                </div>
            </div>
        `;
        
        contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    Coping.activeTool = 'grounding';
    MindHaven.userData.stats.copingToolsUsed++;
    saveUserData();
    
    // Check for grounded achievement
    unlockAchievement('grounded');
}

function generateGroundingStepHTML() {
    const steps = [
        { number: 5, instruction: 'Name 5 things you can SEE', icon: '👀' },
        { number: 4, instruction: 'Name 4 things you can TOUCH', icon: '✋' },
        { number: 3, instruction: 'Name 3 things you can HEAR', icon: '👂' },
        { number: 2, instruction: 'Name 2 things you can SMELL', icon: '👃' },
        { number: 1, instruction: 'Name 1 thing you can TASTE', icon: '👅' }
    ];
    
    const currentStep = steps[Coping.groundingStep];
    
    if (Coping.groundingStep >= steps.length) {
        return `
            <div class="grounding-complete">
                <h3>Well done! 🎉</h3>
                <p>You've completed the grounding exercise. Take a moment to notice how you feel.</p>
                <button class="primary-btn" onclick="resetGrounding()">Start Over</button>
            </div>
        `;
    }
    
    return `
        <div class="grounding-step">
            <div class="step-number-large">${currentStep.number}</div>
            <p class="step-instruction">${currentStep.instruction}</p>
            <span class="step-icon">${currentStep.icon}</span>
            
            <div class="grounding-input">
                <textarea 
                    id="groundingAnswer"
                    class="journal-textarea"
                    placeholder="List ${currentStep.number} things..."
                    rows="3"
                ></textarea>
            </div>
            
            <button class="primary-btn" onclick="advanceGrounding()">Next Step</button>
        </div>
    `;
}

function advanceGrounding() {
    const answerInput = document.getElementById('groundingAnswer');
    if (answerInput && answerInput.value.trim()) {
        Coping.groundingStep++;
        
        const exerciseArea = document.getElementById('groundingExercise');
        if (exerciseArea) {
            exerciseArea.innerHTML = generateGroundingStepHTML();
        }
    } else {
        showGentleMessage('Try to list at least one thing');
    }
}

function resetGrounding() {
    Coping.groundingStep = 0;
    const exerciseArea = document.getElementById('groundingExercise');
    if (exerciseArea) {
        exerciseArea.innerHTML = generateGroundingStepHTML();
    }
}

// ============================================
// GENERAL COPING TOOL OPENER
// ============================================

function openCopingTool(toolId) {
    if (typeof navigateTo === 'function') {
        navigateTo('coping');
    }

    switch(toolId) {
        case 'panic':
        case 'panic-relief':
            openPanicRelief();
            break;
        case 'calm':
        case 'calm-down':
            openCalmDown();
            break;
        case 'overthinking':
        case 'cbt':
        case 'cbt_reframe':
            openOverthinkingBreaker();
            break;
        case 'low-energy':
            openLowEnergyMode();
            break;
        case 'loneliness':
            openLonelinessCompanion();
            break;
        case 'breathing':
        case 'box_breathing':
            openBreathingGuide();
            break;
        case 'grounding':
        case 'grounding_54321':
            openGroundingExercise();
            break;
        case 'tipp':
            openTIPP();
            break;
        case 'pmr':
            openPMR();
            break;
        case 'emotion-wheel':
        case 'emotion_wheel':
            openEmotionWheel();
            break;
        default:
            openBreathingGuide();
    }
}

function openTIPP() {
    const contentArea = document.getElementById('coping-content');
    if (contentArea) {
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = `
            <div class="tipp-container card">
                <h2>❄️ TIPP Distress Tolerance Skill</h2>
                <p>TIPP skills alter your physiology rapidly to lower extreme emotional arousal.</p>
                <div class="tipp-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:16px;">
                    <div class="tipp-card" style="padding:12px; background:var(--bg-secondary); border-radius:12px;">
                        <h3>T - Temperature</h3>
                        <p>Splash cold water on your face or hold an ice cube to activate the mammalian dive reflex.</p>
                    </div>
                    <div class="tipp-card" style="padding:12px; background:var(--bg-secondary); border-radius:12px;">
                        <h3>I - Intense Exercise</h3>
                        <p>Do 1 minute of jumping jacks or fast walking to burn excess adrenaline.</p>
                    </div>
                    <div class="tipp-card" style="padding:12px; background:var(--bg-secondary); border-radius:12px;">
                        <h3>P - Paced Breathing</h3>
                        <p>Breathe in for 4 seconds, exhale slowly for 6-8 seconds.</p>
                    </div>
                    <div class="tipp-card" style="padding:12px; background:var(--bg-secondary); border-radius:12px;">
                        <h3>P - Paired Muscle Relaxation</h3>
                        <p>Tense a muscle group tight on inhale, release fully on exhale.</p>
                    </div>
                </div>
            </div>`;
    }
}

function openPMR() {
    const contentArea = document.getElementById('coping-content');
    if (contentArea) {
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = `
            <div class="pmr-container card">
                <h2>🧘 Progressive Muscle Relaxation (PMR)</h2>
                <p>Systematically tensing and relaxing muscle groups releases stored physical tension.</p>
                <ol style="margin:16px 0; padding-left:20px; line-height:1.8;">
                    <li><strong>Hands & Arms:</strong> Clench fists tight for 5 seconds... Release and feel the warmth.</li>
                    <li><strong>Shoulders:</strong> Pull shoulders up to ears tight for 5 seconds... Drop them completely.</li>
                    <li><strong>Face:</strong> Scrunch eyes and jaw tight for 5 seconds... Soften facial muscles.</li>
                    <li><strong>Stomach & Core:</strong> Tighten stomach muscles... Breathe out and let go.</li>
                    <li><strong>Legs & Feet:</strong> Curl toes tight... Release and let your body sink into support.</li>
                </ol>
            </div>`;
    }
}

function openEmotionWheel() {
    const contentArea = document.getElementById('coping-content');
    if (contentArea) {
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = `
            <div class="emotion-wheel-container card">
                <h2>🎯 Interactive Emotion Wheel</h2>
                <p>Naming your exact emotion reduces emotional intensity in the brain (affect labeling).</p>
                <div class="emotion-buttons" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">
                    <button class="quick-pill" onclick="alert('Primary Emotion: Fear / Anxiety -> Secondary: Vulnerability or Uncertainty. Try Box Breathing.')">😟 Anxious / Fearful</button>
                    <button class="quick-pill" onclick="alert('Primary Emotion: Anger -> Secondary: Frustration or Hurt. Try TIPP Cold Temperature.')">😡 Angry / Frustrated</button>
                    <button class="quick-pill" onclick="alert('Primary Emotion: Sadness -> Secondary: Grief or Loneliness. Try Gentle Journaling.')">🌧️ Sad / Lonely</button>
                    <button class="quick-pill" onclick="alert('Primary Emotion: Overwhelm -> Secondary: Burnout. Try 5-4-3-2-1 Grounding.')">😵 Overwhelmed</button>
                </div>
            </div>`;
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.openPanicRelief = openPanicRelief;
window.openCalmDown = openCalmDown;
window.openOverthinkingBreaker = openOverthinkingBreaker;
window.openLowEnergyMode = openLowEnergyMode;
window.openLonelinessCompanion = openLonelinessCompanion;
window.openBreathingGuide = openBreathingGuide;
window.openGroundingExercise = openGroundingExercise;
window.openCopingTool = openCopingTool;
window.startPanicBreathing = startPanicBreathing;
window.startPanicGrounding = startPanicGrounding;
window.processOverthinking = processOverthinking;
window.saveOverthinkingReflection = saveOverthinkingReflection;
window.toggleLowEnergyTask = toggleLowEnergyTask;
window.saveLonelinessReflection = saveLonelinessReflection;
window.startBreathingPattern = startBreathingPattern;
window.stopBreathingExercise = stopBreathingExercise;
window.advanceGrounding = advanceGrounding;
window.resetGrounding = resetGrounding;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeCoping();
});
