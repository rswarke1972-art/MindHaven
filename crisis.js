// ============================================
// MINDHAVEN - Crisis Support Module
// ============================================

// Crisis Resources Database
const crisisResources = {
    US: {
        name: 'United States',
        hotlines: [
            { name: 'Suicide & Crisis Lifeline', number: '988', description: '24/7 free, confidential support' },
            { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: '24/7 text support' },
            { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', description: '24/7 support for domestic violence' },
            { name: 'SAMHSA Helpline', number: '1-800-662-4357', description: 'Substance abuse and mental health' }
        ]
    },
    UK: {
        name: 'United Kingdom',
        hotlines: [
            { name: 'Samaritans', number: '116 123', description: '24/7 confidential support' },
            { name: 'NHS 111', number: '111', description: 'Medical advice and support' },
            { name: 'Shout Crisis Text Line', number: 'Text SHOUT to 85258', description: '24/7 text support' },
            { name: 'Domestic Abuse Helpline', number: '0808 2000 247', description: '24/7 domestic abuse support' }
        ]
    },
    Canada: {
        name: 'Canada',
        hotlines: [
            { name: 'Canada Suicide Prevention Service', number: '1-833-456-4566', description: '24/7 suicide prevention' },
            { name: 'Crisis Services Canada', number: '1-833-456-4566', description: '24/7 crisis support' },
            { name: 'Kids Help Phone', number: '1-800-668-6868', description: 'Support for young people' }
        ]
    },
    Australia: {
        name: 'Australia',
        hotlines: [
            { name: 'Lifeline', number: '13 11 14', description: '24/7 crisis support' },
            { name: 'Beyond Blue', number: '1300 22 4636', description: 'Mental health support' },
            { name: 'Suicide Call Back Service', number: '1300 659 467', description: 'Professional suicide prevention' }
        ]
    },
    International: {
        name: 'International Resources',
        hotlines: [
            { name: 'IASP Crisis Resources', url: 'https://www.iasp.info/resources/Crisis_Centres/', description: 'Find help in your country' },
            { name: 'Befrienders Worldwide', url: 'https://www.befrienders.org/', description: 'Global crisis helpline directory' }
        ]
    }
};

// Initialize Crisis Module
function initializeCrisis() {
    console.log('🚨 Initializing Crisis Support module...');
    console.log('✅ Crisis Support module initialized');
}

// ============================================
// CRISIS DETECTION
// ============================================

function checkForCrisisIndicators(text) {
    const crisisKeywords = [
        'suicide', 'kill myself', 'end my life', 'want to die', 'want to die',
        'no point living', 'better off dead', 'end it all', 'hurt myself',
        'self harm', 'cutting', 'overdose', 'don\'t want to be here',
        'no reason to live', 'wish I was dead'
    ];
    
    const lowerText = text.toLowerCase();
    
    for (const keyword of crisisKeywords) {
        if (lowerText.includes(keyword)) {
            return true;
        }
    }
    
    return false;
}

// ============================================
// CRISIS RESPONSE
// ============================================

function showCrisisResponse() {
    // Navigate to crisis section
    navigateTo('crisis');
    
    // Show gentle modal
    const modal = document.createElement('div');
    modal.className = 'crisis-modal';
    modal.innerHTML = `
        <div class="crisis-modal-content">
            <h2>You matter 💚</h2>
            <p>If you're in immediate danger, please call emergency services (911 in US, 999 in UK, 112 in EU).</p>
            <p>There are people who want to help. You don't have to go through this alone.</p>
            <div class="crisis-modal-actions">
                <a href="tel:988" class="primary-btn crisis-btn-large">Call Crisis Lifeline (988)</a>
                <button class="secondary-btn" onclick="this.closest('.crisis-modal').remove()">Continue to Resources</button>
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
    
    const content = modal.querySelector('.crisis-modal-content');
    content.style.cssText = `
        background: var(--bg-card);
        padding: 32px;
        border-radius: 16px;
        max-width: 500px;
        text-align: center;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(modal);
}

// ============================================
// SAFETY PLANNING
// ============================================

function createSafetyPlan() {
    const safetyPlan = {
        id: generateId(),
        date: new Date().toISOString(),
        warningSigns: '',
        copingStrategies: '',
        distractions: '',
        people: '',
        professionals: '',
        emergencyContacts: '',
        safeEnvironment: ''
    };
    
    return safetyPlan;
}

function saveSafetyPlan(plan) {
    MindHaven.userData.safetyPlan = plan;
    saveUserData();
    showGentleMessage('Safety plan saved. Keep it somewhere accessible.');
}

// ============================================
// GROUNDING FOR CRISIS
// ============================================

function crisisGrounding() {
    const modal = document.createElement('div');
    modal.className = 'crisis-grounding-modal';
    modal.innerHTML = `
        <div class="crisis-grounding-content">
            <h2>Right Now, You Are Safe</h2>
            <p class="crisis-grounding-instruction">Focus on this moment only.</p>
            
            <div class="crisis-grounding-steps">
                <div class="crisis-step">
                    <span class="crisis-step-number">1</span>
                    <p>Take a deep breath. Hold it for 4 seconds. Release slowly.</p>
                </div>
                <div class="crisis-step">
                    <span class="crisis-step-number">2</span>
                    <p>Feel your feet on the ground. You are here, right now.</p>
                </div>
                <div class="crisis-step">
                    <span class="crisis-step-number">3</span>
                    <p>Name 3 things you can see around you.</p>
                </div>
                <div class="crisis-step">
                    <span class="crisis-step-number">4</span>
                    <p>This feeling is temporary. It will pass.</p>
                </div>
                <div class="crisis-step">
                    <span class="crisis-step-number">5</span>
                    <p>You have gotten through difficult moments before. You can get through this one too.</p>
                </div>
            </div>
            
            <div class="crisis-grounding-actions">
                <button class="primary-btn" onclick="navigateTo('coping', 'breathing')">Try Breathing Exercise</button>
                <button class="secondary-btn" onclick="this.closest('.crisis-grounding-modal').remove()">Close</button>
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
    
    const content = modal.querySelector('.crisis-grounding-content');
    content.style.cssText = `
        background: var(--bg-card);
        padding: 32px;
        border-radius: 16px;
        max-width: 500px;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(modal);
}

// ============================================
// TRUSTED CONTACT REMINDER
// ============================================

function setTrustedContact() {
    const contact = prompt('Enter the name and phone number of a trusted person:');
    if (contact) {
        MindHaven.userData.trustedContact = contact;
        saveUserData();
        showGentleMessage('Trusted contact saved. Reach out to them when you need support.');
    }
}

function showTrustedContactReminder() {
    if (MindHaven.userData.trustedContact) {
        const modal = document.createElement('div');
        modal.className = 'trusted-contact-modal';
        modal.innerHTML = `
            <div class="trusted-contact-content">
                <h2>Your Trusted Contact</h2>
                <p class="trusted-contact-info">${MindHaven.userData.trustedContact}</p>
                <p>It's okay to reach out to them when you're struggling.</p>
                <div class="trusted-contact-actions">
                    <button class="primary-btn" onclick="this.closest('.trusted-contact-modal').remove()">I Understand</button>
                    <button class="secondary-btn" onclick="setTrustedContact(); this.closest('.trusted-contact-modal').remove();">Update Contact</button>
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
        
        const content = modal.querySelector('.trusted-contact-content');
        content.style.cssText = `
            background: var(--bg-card);
            padding: 32px;
            border-radius: 16px;
            max-width: 400px;
            text-align: center;
            box-shadow: var(--shadow-medium);
        `;
        
        document.body.appendChild(modal);
    } else {
        setTrustedContact();
    }
}

// ============================================
// JOURNAL CRISIS CHECK
// ============================================

function checkJournalForCrisis() {
    const journalEntry = document.getElementById('journalEntry');
    if (!journalEntry) return false;
    
    const content = journalEntry.value;
    if (checkForCrisisIndicators(content)) {
        showCrisisResponse();
        return true;
    }
    
    return false;
}

// ============================================
// CHECK-IN CRISIS CHECK
// ============================================

function checkCheckInForCrisis() {
    // If user selects overwhelming or numb frequently, show gentle resources
    const recentCheckIns = MindHaven.userData.checkIns.slice(-3);
    
    if (recentCheckIns.length >= 2) {
        const concerningMoods = recentCheckIns.filter(checkIn => {
            if (Array.isArray(checkIn.moods)) {
                return checkIn.moods.includes('overwhelmed') || 
                       checkIn.moods.includes('numb') ||
                       checkIn.moods.includes('low');
            }
            return false;
        });
        
        if (concerningMoods.length >= 2) {
            // Show gentle suggestion
            showGentleMessage('It seems like things have been difficult lately. The crisis resources are always available if you need them.');
        }
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.checkForCrisisIndicators = checkForCrisisIndicators;
window.showCrisisResponse = showCrisisResponse;
window.createSafetyPlan = createSafetyPlan;
window.saveSafetyPlan = saveSafetyPlan;
window.crisisGrounding = crisisGrounding;
window.setTrustedContact = setTrustedContact;
window.showTrustedContactReminder = showTrustedContactReminder;
window.checkJournalForCrisis = checkJournalForCrisis;
window.checkCheckInForCrisis = checkCheckInForCrisis;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeCrisis();
    
    // Add crisis check to journal save
    const journalSaveBtn = document.querySelector('#journal-section .primary-btn');
    if (journalSaveBtn) {
        journalSaveBtn.addEventListener('click', function(e) {
            if (checkJournalForCrisis()) {
                e.preventDefault();
            }
        });
    }
});
