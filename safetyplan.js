// ============================================
// MINDHAVEN - Safety Plan Builder Module
// ============================================

// Safety Plan State
const SafetyPlan = {
    currentPlan: null,
    versions: []
};

// Initialize Safety Plan Module
function initializeSafetyPlan() {
    console.log('🛡️ Initializing Safety Plan Builder...');
    loadSafetyPlanData();
    setupSafetyPlanUI();
    console.log('✅ Safety Plan Builder initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadSafetyPlanData() {
    if (MindHaven.userData.support && MindHaven.userData.support.safetyPlan) {
        SafetyPlan.currentPlan = MindHaven.userData.support.safetyPlan.currentPlan;
        SafetyPlan.versions = MindHaven.userData.support.safetyPlan.versions || [];
    }
}

function saveSafetyPlanData() {
    if (!MindHaven.userData.support) {
        MindHaven.userData.support = {};
    }
    MindHaven.userData.support.safetyPlan = {
        currentPlan: SafetyPlan.currentPlan,
        versions: SafetyPlan.versions
    };
    saveUserData();
}

// ============================================
// SAFETY PLAN MANAGEMENT
// ============================================

function createSafetyPlan(data) {
    const plan = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    SafetyPlan.currentPlan = plan;
    SafetyPlan.versions.push(plan);
    saveSafetyPlanData();
    
    return plan;
}

function updateSafetyPlan(updates) {
    if (!SafetyPlan.currentPlan) return;
    
    Object.assign(SafetyPlan.currentPlan, updates);
    SafetyPlan.currentPlan.updatedAt = new Date().toISOString();
    
    // Save as new version
    const newVersion = { ...SafetyPlan.currentPlan };
    SafetyPlan.versions.push(newVersion);
    
    saveSafetyPlanData();
}

// ============================================
// SAFETY PLAN DASHBOARD
// ============================================

function renderSafetyPlanDashboard() {
    const container = document.getElementById('safety-plan-dashboard');
    if (!container) return;
    
    if (!SafetyPlan.currentPlan) {
        container.innerHTML = `
            <div class="safety-plan-empty">
                <span class="empty-icon">🛡️</span>
                <h2>Create Your Safety Plan</h2>
                <p>A safety plan helps you prepare for difficult moments and know who to contact when you need support.</p>
                <button class="primary-btn" onclick="showSafetyPlanWizard()">Create Safety Plan</button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="safety-plan-dashboard">
            <div class="plan-header">
                <h2>Your Safety Plan</h2>
                <p class="last-updated">Last updated: ${new Date(SafetyPlan.currentPlan.updatedAt).toLocaleDateString()}</p>
                <button class="secondary-btn" onclick="showSafetyPlanWizard()">Update Plan</button>
            </div>
            
            <div class="plan-sections">
                ${renderWarningSigns()}
                ${renderCopingStrategies()}
                ${renderSupportContacts()}
                ${renderProfessionalContacts()}
                ${renderEnvironmentSafety()}
                ${renderReasonsForLiving()}
            </div>
            
            <div class="plan-actions">
                <button class="primary-btn" onclick="showSafetyPlanWizard()">Update Plan</button>
                <button class="secondary-btn" onclick="exportSafetyPlan()">Export Plan</button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderWarningSigns() {
    const signs = SafetyPlan.currentPlan.warningSigns || [];
    return `
        <div class="plan-section">
            <h3>⚠️ Warning Signs</h3>
            <p class="section-desc">Thoughts, feelings, or behaviors that indicate you may need support</p>
            <div class="plan-content">
                ${signs.length > 0 ? signs.map(sign => `<p>• ${sign}</p>`).join('') : '<p class="empty">No warning signs added yet</p>'}
            </div>
        </div>
    `;
}

function renderCopingStrategies() {
    const strategies = SafetyPlan.currentPlan.copingStrategies || [];
    return `
        <div class="plan-section">
            <h3>🧘 Coping Strategies</h3>
            <p class="section-desc">Activities that help you feel better</p>
            <div class="plan-content">
                ${strategies.length > 0 ? strategies.map(s => `<p>• ${s}</p>`).join('') : '<p class="empty">No coping strategies added yet</p>'}
            </div>
        </div>
    `;
}

function renderSupportContacts() {
    const contacts = SafetyPlan.currentPlan.supportContacts || [];
    return `
        <div class="plan-section">
            <h3>👥 People I Can Contact</h3>
            <p class="section-desc">Friends, family, or others who can help</p>
            <div class="plan-content">
                ${contacts.length > 0 ? contacts.map(c => `<p>• ${c.name} - ${c.phone || c.contact}</p>`).join('') : '<p class="empty">No support contacts added yet</p>'}
            </div>
        </div>
    `;
}

function renderProfessionalContacts() {
    const contacts = SafetyPlan.currentPlan.professionalContacts || [];
    return `
        <div class="plan-section">
            <h3>🏥 Professional Contacts</h3>
            <p class="section-desc">Therapists, doctors, or crisis lines</p>
            <div class="plan-content">
                ${contacts.length > 0 ? contacts.map(c => `<p>• ${c.name} - ${c.phone || c.contact}</p>`).join('') : '<p class="empty">No professional contacts added yet</p>'}
            </div>
        </div>
    `;
}

function renderEnvironmentSafety() {
    const steps = SafetyPlan.currentPlan.environmentSafety || [];
    return `
        <div class="plan-section">
            <h3>🏠 Making My Environment Safe</h3>
            <p class="section-desc">Steps to remove or secure harmful items</p>
            <div class="plan-content">
                ${steps.length > 0 ? steps.map(s => `<p>• ${s}</p>`).join('') : '<p class="empty">No safety steps added yet</p>'}
            </div>
        </div>
    `;
}

function renderReasonsForLiving() {
    const reasons = SafetyPlan.currentPlan.reasonsForLiving || [];
    return `
        <div class="plan-section">
            <h3>💚 Reasons for Living</h3>
            <p class="section-desc">What keeps you going and gives you hope</p>
            <div class="plan-content">
                ${reasons.length > 0 ? reasons.map(r => `<p>• ${r}</p>`).join('') : '<p class="empty">No reasons added yet</p>'}
            </div>
        </div>
    `;
}

// ============================================
// SAFETY PLAN WIZARD
// ============================================

function showSafetyPlanWizard() {
    const modal = document.createElement('div');
    modal.className = 'safety-plan-modal';
    modal.innerHTML = `
        <div class="modal-content wizard-content">
            <h2>Create Your Safety Plan</h2>
            <p class="wizard-intro">This wizard will guide you through creating a personalized safety plan. Take your time and be honest with yourself.</p>
            
            <div class="wizard-steps">
                <div class="wizard-step active" data-step="1">
                    <h3>Step 1: Warning Signs</h3>
                    <p>What thoughts, feelings, or behaviors tell you that you're not doing well?</p>
                    <textarea id="warningSigns" rows="4" placeholder="One warning sign per line...">${(SafetyPlan.currentPlan?.warningSigns || []).join('\n')}</textarea>
                </div>
                
                <div class="wizard-step" data-step="2">
                    <h3>Step 2: Coping Strategies</h3>
                    <p>What activities help you feel better when you're struggling?</p>
                    <textarea id="copingStrategies" rows="4" placeholder="One strategy per line...">${(SafetyPlan.currentPlan?.copingStrategies || []).join('\n')}</textarea>
                </div>
                
                <div class="wizard-step" data-step="3">
                    <h3>Step 3: Support Contacts</h3>
                    <p>Who can you reach out to for support? (Name - Phone/Contact)</p>
                    <textarea id="supportContacts" rows="4" placeholder="One contact per line...">${(SafetyPlan.currentPlan?.supportContacts || []).map(c => `${c.name} - ${c.phone || c.contact}`).join('\n')}</textarea>
                </div>
                
                <div class="wizard-step" data-step="4">
                    <h3>Step 4: Professional Contacts</h3>
                    <p>Who are your professional support contacts? (Name - Phone/Contact)</p>
                    <textarea id="professionalContacts" rows="4" placeholder="One contact per line...">${(SafetyPlan.currentPlan?.professionalContacts || []).map(c => `${c.name} - ${c.phone || c.contact}`).join('\n')}</textarea>
                </div>
                
                <div class="wizard-step" data-step="5">
                    <h3>Step 5: Environment Safety</h3>
                    <p>What steps can you take to make your environment safer?</p>
                    <textarea id="environmentSafety" rows="4" placeholder="One step per line...">${(SafetyPlan.currentPlan?.environmentSafety || []).join('\n')}</textarea>
                </div>
                
                <div class="wizard-step" data-step="6">
                    <h3>Step 6: Reasons for Living</h3>
                    <p>What gives you hope and keeps you going?</p>
                    <textarea id="reasonsForLiving" rows="4" placeholder="One reason per line...">${(SafetyPlan.currentPlan?.reasonsForLiving || []).join('\n')}</textarea>
                </div>
            </div>
            
            <div class="wizard-progress">
                <div class="progress-dots">
                    ${[1, 2, 3, 4, 5, 6].map(i => `<span class="dot ${i === 1 ? 'active' : ''}" data-step="${i}"></span>`).join('')}
                </div>
            </div>
            
            <div class="wizard-actions">
                <button class="secondary-btn" id="prevBtn" onclick="prevWizardStep()" disabled>Previous</button>
                <button class="primary-btn" id="nextBtn" onclick="nextWizardStep()">Next</button>
                <button class="primary-btn" id="finishBtn" onclick="finishSafetyPlan()" style="display: none;">Save Plan</button>
                <button class="secondary-btn" onclick="closeSafetyPlanWizard()">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    SafetyPlan.currentWizardStep = 1;
}

let currentWizardStep = 1;

function nextWizardStep() {
    if (currentWizardStep < 6) {
        document.querySelector(`.wizard-step[data-step="${currentWizardStep}"]`).classList.remove('active');
        document.querySelector(`.dot[data-step="${currentWizardStep}"]`).classList.remove('active');
        currentWizardStep++;
        document.querySelector(`.wizard-step[data-step="${currentWizardStep}"]`).classList.add('active');
        document.querySelector(`.dot[data-step="${currentWizardStep}"]`).classList.add('active');
        
        document.getElementById('prevBtn').disabled = currentWizardStep === 1;
        
        if (currentWizardStep === 6) {
            document.getElementById('nextBtn').style.display = 'none';
            document.getElementById('finishBtn').style.display = 'inline-block';
        }
    }
}

function prevWizardStep() {
    if (currentWizardStep > 1) {
        document.querySelector(`.wizard-step[data-step="${currentWizardStep}"]`).classList.remove('active');
        document.querySelector(`.dot[data-step="${currentWizardStep}"]`).classList.remove('active');
        currentWizardStep--;
        document.querySelector(`.wizard-step[data-step="${currentWizardStep}"]`).classList.add('active');
        document.querySelector(`.dot[data-step="${currentWizardStep}"]`).classList.add('active');
        
        document.getElementById('prevBtn').disabled = currentWizardStep === 1;
        
        document.getElementById('nextBtn').style.display = 'inline-block';
        document.getElementById('finishBtn').style.display = 'none';
    }
}

function closeSafetyPlanWizard() {
    const modal = document.querySelector('.safety-plan-modal');
    if (modal) modal.remove();
    currentWizardStep = 1;
}

function finishSafetyPlan() {
    const warningSigns = document.getElementById('warningSigns').value.split('\n').filter(s => s.trim());
    const copingStrategies = document.getElementById('copingStrategies').value.split('\n').filter(s => s.trim());
    const supportContacts = document.getElementById('supportContacts').value.split('\n').filter(s => s.trim()).map(c => {
        const parts = c.split(' - ');
        return { name: parts[0], phone: parts[1] };
    });
    const professionalContacts = document.getElementById('professionalContacts').value.split('\n').filter(s => s.trim()).map(c => {
        const parts = c.split(' - ');
        return { name: parts[0], phone: parts[1] };
    });
    const environmentSafety = document.getElementById('environmentSafety').value.split('\n').filter(s => s.trim());
    const reasonsForLiving = document.getElementById('reasonsForLiving').value.split('\n').filter(s => s.trim());
    
    const planData = {
        warningSigns,
        copingStrategies,
        supportContacts,
        professionalContacts,
        environmentSafety,
        reasonsForLiving
    };
    
    if (SafetyPlan.currentPlan) {
        updateSafetyPlan(planData);
    } else {
        createSafetyPlan(planData);
    }
    
    closeSafetyPlanWizard();
    renderSafetyPlanDashboard();
    
    showGentleMessage('Safety plan saved successfully.');
}

function exportSafetyPlan() {
    if (!SafetyPlan.currentPlan) return;
    
    const text = `
MY SAFETY PLAN
Created: ${new Date(SafetyPlan.currentPlan.createdAt).toLocaleDateString()}
Last Updated: ${new Date(SafetyPlan.currentPlan.updatedAt).toLocaleDateString()}

WARNING SIGNS
${(SafetyPlan.currentPlan.warningSigns || []).map(s => `• ${s}`).join('\n')}

COPING STRATEGIES
${(SafetyPlan.currentPlan.copingStrategies || []).map(s => `• ${s}`).join('\n')}

SUPPORT CONTACTS
${(SafetyPlan.currentPlan.supportContacts || []).map(c => `• ${c.name} - ${c.phone || c.contact}`).join('\n')}

PROFESSIONAL CONTACTS
${(SafetyPlan.currentPlan.professionalContacts || []).map(c => `• ${c.name} - ${c.phone || c.contact}`).join('\n')}

ENVIRONMENT SAFETY
${(SafetyPlan.currentPlan.environmentSafety || []).map(s => `• ${s}`).join('\n')}

REASONS FOR LIVING
${(SafetyPlan.currentPlan.reasonsForLiving || []).map(r => `• ${r}`).join('\n')}
    `.trim();
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safety-plan.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// UI SETUP
// ============================================

function setupSafetyPlanUI() {
    addSafetyPlanToNavigation();
}

function addSafetyPlanToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="safetyplan"]')) return;
    
    const safetyItem = document.createElement('button');
    safetyItem.className = 'nav-item';
    safetyItem.setAttribute('onclick', "navigateTo('safetyplan')");
    safetyItem.setAttribute('role', 'menuitem');
    safetyItem.textContent = '🛡️ Safety Plan';
    
    const supportBtn = navMenu.querySelector('.nav-item[onclick*="supportcircle"]');
    if (supportBtn) {
        navMenu.insertBefore(safetyItem, supportBtn.nextSibling);
    } else {
        navMenu.appendChild(safetyItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.createSafetyPlan = createSafetyPlan;
window.updateSafetyPlan = updateSafetyPlan;
window.renderSafetyPlanDashboard = renderSafetyPlanDashboard;
window.showSafetyPlanWizard = showSafetyPlanWizard;
window.nextWizardStep = nextWizardStep;
window.prevWizardStep = prevWizardStep;
window.closeSafetyPlanWizard = closeSafetyPlanWizard;
window.finishSafetyPlan = finishSafetyPlan;
window.exportSafetyPlan = exportSafetyPlan;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeSafetyPlan();
});
