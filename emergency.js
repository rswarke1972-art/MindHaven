// ============================================
// MINDHAVEN - Emergency Support Center Module
// ============================================

// Emergency State
const Emergency = {
    currentFlow: null,
    activeSteps: [],
    history: []
};

// Emergency Flow Definitions
const emergencyFlows = {
    panic: {
        id: 'panic',
        name: 'Panic Attack',
        icon: '😨',
        color: '#E57373',
        steps: [
            { type: 'instruction', text: 'You are safe right now. This feeling is temporary.' },
            { type: 'breathing', duration: 4, text: 'Breathe in for 4 seconds' },
            { type: 'hold', duration: 4, text: 'Hold for 4 seconds' },
            { type: 'breathe-out', duration: 4, text: 'Breathe out for 4 seconds' },
            { type: 'instruction', text: 'Feel your feet on the ground. You are here.' },
            { type: 'grounding', text: 'Name 5 things you can see' },
            { type: 'instruction', text: 'You\'ve gotten through this before. You can do it again.' },
            { type: 'resource', text: 'If you need more help, call 988 (US) or your local crisis line.' }
        ]
    },
    anxiety: {
        id: 'anxiety',
        name: 'Anxiety Spike',
        icon: '😰',
        color: '#B8A7D1',
        steps: [
            { type: 'instruction', text: 'This anxiety spike will pass. Let\'s work through it together.' },
            { type: 'breathing', duration: 5, text: 'Deep breath in for 5 seconds' },
            { type: 'hold', duration: 2, text: 'Hold briefly' },
            { type: 'breathe-out', duration: 7, text: 'Slow breath out for 7 seconds' },
            { type: 'instruction', text: 'What triggered this? Can you name it?' },
            { type: 'instruction', text: 'Is this danger real or imagined?' },
            { type: 'instruction', text: 'What would you tell a friend in this situation?' },
            { type: 'resource', text: 'Consider using the Anxiety Hub for more tools.' }
        ]
    },
    selfHarm: {
        id: 'self-harm',
        name: 'Self-Harm Urge',
        icon: '💜',
        color: '#9C27B0',
        steps: [
            { type: 'instruction', text: 'You matter. Your pain is real, and you deserve support.' },
            { type: 'instruction', text: 'This urge will pass. Let\'s wait it out together.' },
            { type: 'grounding', text: 'Hold an ice cube in your hand' },
            { type: 'instruction', text: 'Wait 5 minutes before doing anything' },
            { type: 'grounding', text: 'Splash cold water on your face' },
            { type: 'instruction', text: 'Contact someone you trust' },
            { type: 'resource', text: 'Call or text 988 (US Crisis Lifeline)' },
            { type: 'resource', text: 'Text HOME to 741741 (Crisis Text Line)' }
        ]
    },
    suicidal: {
        id: 'suicidal',
        name: 'Suicidal Thoughts',
        icon: '🕊️',
        color: '#E57373',
        steps: [
            { type: 'instruction', text: 'You are not alone. People care about you.' },
            { type: 'instruction', text: 'These thoughts are temporary. Help is available.' },
            { type: 'resource', text: 'Call 988 immediately (US Crisis Lifeline)' },
            { type: 'resource', text: 'Go to emergency room or call 911' },
            { type: 'instruction', text: 'Remove any harmful objects from your area' },
            { type: 'instruction', text: 'Contact someone you trust right now' },
            { type: 'resource', text: 'International resources: iasp.info/resources/Crisis_Centres/' }
        ]
    },
    breakdown: {
        id: 'breakdown',
        name: 'Emotional Breakdown',
        icon: '😢',
        color: '#8FAACF',
        steps: [
            { type: 'instruction', text: 'It\'s okay to not be okay right now.' },
            { type: 'instruction', text: 'Let yourself feel these emotions.' },
            { type: 'breathing', duration: 4, text: 'Slow, gentle breath' },
            { type: 'instruction', text: 'Cry if you need to. It\'s healing.' },
            { type: 'instruction', text: 'Wrap yourself in a blanket' },
            { type: 'instruction', text: 'This will pass. You will get through this.' },
            { type: 'resource', text: 'When ready, try the Calm Space.' }
        ]
    },
    sleep: {
        id: 'sleep',
        name: 'Can\'t Sleep',
        icon: '🌙',
        color: '#B8A7D1',
        steps: [
            { type: 'instruction', text: 'Not being able to sleep is frustrating but not dangerous.' },
            { type: 'instruction', text: 'Get out of bed if you\'ve been lying awake for 20 minutes' },
            { type: 'instruction', text: 'Do a quiet, calming activity' },
            { type: 'breathing', duration: 4, text: '4-7-8 breathing: 4 in, 7 hold, 8 out' },
            { type: 'instruction', text: 'Avoid screens and bright lights' },
            { type: 'instruction', text: 'Try the Calm Space ambient sounds' },
            { type: 'instruction', text: 'You will sleep eventually. Rest is still rest.' }
        ]
    },
    stress: {
        id: 'stress',
        name: 'Extreme Stress',
        icon: '🌪️',
        color: '#FFB74D',
        steps: [
            { type: 'instruction', text: 'You are overwhelmed. Let\'s break this down.' },
            { type: 'instruction', text: 'What is the ONE most important thing right now?' },
            { type: 'instruction', text: 'Everything else can wait.' },
            { type: 'breathing', duration: 5, text: 'Deep breath to reset' },
            { type: 'instruction', text: 'Can you ask for help with one thing?' },
            { type: 'instruction', text: 'What can you let go of for now?' },
            { type: 'resource', text: 'Try the Decision Support Center for help prioritizing.' }
        ]
    }
};

// Initialize Emergency Module
function initializeEmergency() {
    console.log('🚨 Initializing Emergency Support Center...');
    loadEmergencyHistory();
    setupEmergencyUI();
    console.log('✅ Emergency Support Center initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadEmergencyHistory() {
    const savedHistory = localStorage.getItem('mindhaven_emergency_history');
    if (savedHistory) {
        Emergency.history = JSON.parse(savedHistory);
    }
}

function saveEmergencyHistory() {
    localStorage.setItem('mindhaven_emergency_history', JSON.stringify(Emergency.history));
    
    // Also save to userData
    MindHaven.userData.emergency.activations = Emergency.history;
    saveUserData();
}

// ============================================
// EMERGENCY FLOWS
// ============================================

function startEmergencyFlow(flowId) {
    const flow = emergencyFlows[flowId];
    if (!flow) {
        console.error('Emergency flow not found:', flowId);
        return;
    }
    
    // Log activation
    Emergency.history.push({
        timestamp: new Date().toISOString(),
        flowId: flowId,
        flowName: flow.name
    });
    saveEmergencyHistory();
    
    // Start the flow
    Emergency.currentFlow = flowId;
    Emergency.activeSteps = [...flow.steps];
    
    // Show emergency modal
    showEmergencyModal(flow);
}

function showEmergencyModal(flow) {
    // Remove existing modal if present
    closeEmergencyModal();
    
    const modal = document.createElement('div');
    modal.id = 'emergencyModal';
    modal.className = 'emergency-modal';
    modal.innerHTML = `
        <div class="emergency-modal-content">
            <div class="emergency-header">
                <span class="emergency-icon">${flow.icon}</span>
                <h2>${flow.name} Support</h2>
            </div>
            <div class="emergency-steps" id="emergencySteps">
                <!-- Steps will be rendered here -->
            </div>
            <div class="emergency-actions">
                <button class="secondary-btn" onclick="closeEmergencyModal()">Exit</button>
                <button class="primary-btn emergency-crisis-btn" onclick="navigateTo('crisis')">Crisis Resources</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Render first step
    renderEmergencyStep(0);
}

function renderEmergencyStep(stepIndex) {
    const stepsContainer = document.getElementById('emergencySteps');
    if (!stepsContainer) return;
    
    const step = Emergency.activeSteps[stepIndex];
    if (!step) {
        // Flow complete
        showEmergencyComplete();
        return;
    }
    
    let html = '';
    
    switch(step.type) {
        case 'instruction':
            html = `
                <div class="emergency-step instruction-step">
                    <p class="emergency-text">${step.text}</p>
                    <button class="primary-btn" onclick="nextEmergencyStep(${stepIndex})">Continue</button>
                </div>
            `;
            break;
            
        case 'breathing':
            html = `
                <div class="emergency-step breathing-step">
                    <div class="emergency-breathing-circle">
                        <span class="breathing-text">${step.text}</span>
                    </div>
                    <button class="primary-btn" onclick="nextEmergencyStep(${stepIndex})">Done</button>
                </div>
            `;
            break;
            
        case 'hold':
            html = `
                <div class="emergency-step hold-step">
                    <div class="emergency-breathing-circle hold">
                        <span class="breathing-text">${step.text}</span>
                    </div>
                    <button class="primary-btn" onclick="nextEmergencyStep(${stepIndex})">Done</button>
                </div>
            `;
            break;
            
        case 'breathe-out':
            html = `
                <div class="emergency-step breathe-out-step">
                    <div class="emergency-breathing-circle breathe-out">
                        <span class="breathing-text">${step.text}</span>
                    </div>
                    <button class="primary-btn" onclick="nextEmergencyStep(${stepIndex})">Done</button>
                </div>
            `;
            break;
            
        case 'grounding':
            html = `
                <div class="emergency-step grounding-step">
                    <p class="emergency-text">${step.text}</p>
                    <input type="text" class="emergency-input" placeholder="Type here..." id="emergencyInput">
                    <button class="primary-btn" onclick="nextEmergencyStep(${stepIndex})">Continue</button>
                </div>
            `;
            break;
            
        case 'resource':
            html = `
                <div class="emergency-step resource-step">
                    <p class="emergency-text resource-text">${step.text}</p>
                    <button class="primary-btn" onclick="nextEmergencyStep(${stepIndex})">Continue</button>
                </div>
            `;
            break;
    }
    
    stepsContainer.innerHTML = html;
}

function nextEmergencyStep(currentIndex) {
    renderEmergencyStep(currentIndex + 1);
}

function showEmergencyComplete() {
    const stepsContainer = document.getElementById('emergencySteps');
    if (!stepsContainer) return;
    
    stepsContainer.innerHTML = `
        <div class="emergency-complete">
            <span class="complete-icon">💚</span>
            <h3>You've completed this support flow</h3>
            <p>Remember: You can always come back here if you need support.</p>
            <p class="gentle-reminder">Be gentle with yourself.</p>
        </div>
    `;
}

function closeEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.remove();
    }
    Emergency.currentFlow = null;
    Emergency.activeSteps = [];
}

// ============================================
// QUICK EMERGENCY ACCESS
// ============================================

function showEmergencyQuickAccess() {
    // Remove existing if present
    const existing = document.getElementById('emergencyQuickAccess');
    if (existing) {
        existing.remove();
        return;
    }
    
    const quickAccess = document.createElement('div');
    quickAccess.id = 'emergencyQuickAccess';
    quickAccess.className = 'emergency-quick-access';
    quickAccess.innerHTML = `
        <div class="emergency-quick-content">
            <h3>Emergency Support</h3>
            <div class="emergency-flow-buttons">
                ${Object.values(emergencyFlows).map(flow => `
                    <button class="emergency-flow-btn" onclick="startEmergencyFlow('${flow.id}')" style="border-color: ${flow.color}">
                        <span class="flow-icon">${flow.icon}</span>
                        <span class="flow-name">${flow.name}</span>
                    </button>
                `).join('')}
            </div>
            <button class="close-quick-access" onclick="document.getElementById('emergencyQuickAccess').remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(quickAccess);
}

// ============================================
// UI SETUP
// ============================================

function setupEmergencyUI() {
    // Add emergency quick access button to crisis section
    addEmergencyQuickAccessButton();
}

function addEmergencyQuickAccessButton() {
    const crisisSection = document.getElementById('crisis-section');
    if (!crisisSection) return;
    
    // Check if already added
    if (document.getElementById('emergencyQuickAccessBtn')) return;
    
    const crisisNoticeCard = document.querySelector('.crisis-notice-card');
    if (!crisisNoticeCard) return;
    
    const quickAccessBtn = document.createElement('button');
    quickAccessBtn.id = 'emergencyQuickAccessBtn';
    quickAccessBtn.className = 'primary-btn emergency-quick-btn';
    quickAccessBtn.onclick = showEmergencyQuickAccess;
    quickAccessBtn.textContent = '🚨 Open Emergency Support Center';
    
    crisisNoticeCard.appendChild(quickAccessBtn);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.startEmergencyFlow = startEmergencyFlow;
window.closeEmergencyModal = closeEmergencyModal;
window.nextEmergencyStep = nextEmergencyStep;
window.showEmergencyQuickAccess = showEmergencyQuickAccess;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeEmergency();
});
