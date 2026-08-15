// ============================================
// MINDHAVEN - Decision Support Center Module
// ============================================

// Decisions State
const Decisions = {
    history: [],
    outcomes: [],
    frameworks: {}
};

// Decision Frameworks
const decisionFrameworks = {
    prosCons: {
        id: 'prosCons',
        name: 'Pros & Cons',
        icon: '⚖️',
        description: 'List advantages and disadvantages of each option',
        fields: ['option', 'pros', 'cons']
    },
    weighted: {
        id: 'weighted',
        name: 'Weighted Decision',
        icon: '📊',
        description: 'Rate options against important criteria',
        fields: ['criteria', 'options', 'weights']
    },
    worstCase: {
        id: 'worstCase',
        name: 'Worst Case Scenario',
        icon: '🛡️',
        description: 'Plan for the worst and best outcomes',
        fields: ['decision', 'worstCase', 'bestCase', 'mitigation']
    },
    values: {
        id: 'values',
        name: 'Values-Based',
        icon: '💎',
        description: 'Align decision with your core values',
        fields: ['values', 'alignment']
    },
    tenTenTen: {
        id: 'tenTenTen',
        name: '10-10-10 Rule',
        icon: '⏰',
        description: 'How will you feel in 10 minutes, 10 months, 10 years?',
        fields: ['decision', 'tenMinutes', 'tenMonths', 'tenYears']
    },
    trusted: {
        id: 'trusted',
        name: 'Trusted Advisor',
        icon: '👥',
        description: 'What would someone you trust advise?',
        fields: ['decision', 'advisor', 'advice']
    }
};

// Initialize Decisions Module
function initializeDecisions() {
    console.log('🤔 Initializing Decision Support Center...');
    loadDecisionsData();
    setupDecisionsUI();
    console.log('✅ Decision Support Center initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadDecisionsData() {
    if (MindHaven.userData.decisions) {
        Decisions.history = MindHaven.userData.decisions.history || [];
        Decisions.outcomes = MindHaven.userData.decisions.outcomes || [];
        Decisions.frameworks = MindHaven.userData.decisions.frameworks || {};
    }
}

function saveDecisionsData() {
    MindHaven.userData.decisions = {
        history: Decisions.history,
        outcomes: Decisions.outcomes,
        frameworks: Decisions.frameworks
    };
    saveUserData();
}

// ============================================
// DECISION MAKING
// ============================================

function createDecision(frameworkId, data) {
    const framework = decisionFrameworks[frameworkId];
    if (!framework) return;
    
    const decision = {
        id: generateId(),
        framework: frameworkId,
        frameworkName: framework.name,
        data: data,
        createdAt: new Date().toISOString(),
        status: 'pending'
    };
    
    Decisions.history.push(decision);
    saveDecisionsData();
    
    return decision;
}

function recordOutcome(decisionId, outcome, satisfaction) {
    const decision = Decisions.history.find(d => d.id === decisionId);
    if (!decision) return;
    
    const outcomeRecord = {
        decisionId: decisionId,
        decisionTitle: decision.data.decision || decision.data.option || 'Decision',
        outcome: outcome,
        satisfaction: satisfaction,
        recordedAt: new Date().toISOString()
    };
    
    decision.status = 'completed';
    decision.outcome = outcome;
    decision.satisfaction = satisfaction;
    decision.completedAt = new Date().toISOString();
    
    Decisions.outcomes.push(outcomeRecord);
    saveDecisionsData();
    
    return outcomeRecord;
}

// ============================================
// DECISION DASHBOARD
// ============================================

function renderDecisionsDashboard() {
    const container = document.getElementById('decisions-dashboard');
    if (!container) return;
    
    let html = `
        <div class="decisions-dashboard">
            <div class="frameworks-section">
                <h2>Choose a Framework</h2>
                <div class="frameworks-grid">
                    ${Object.values(decisionFrameworks).map(fw => `
                        <button class="framework-card" onclick="showDecisionFramework('${fw.id}')">
                            <span class="framework-icon">${fw.icon}</span>
                            <span class="framework-name">${fw.name}</span>
                            <span class="framework-desc">${fw.description}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="recent-decisions">
                <h2>Recent Decisions</h2>
                <div class="decisions-list">
                    ${renderRecentDecisions()}
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderRecentDecisions() {
    const recent = Decisions.history.slice(-5).reverse();
    
    if (recent.length === 0) {
        return '<p class="empty-state">No decisions recorded yet. Start with a framework above.</p>';
    }
    
    return recent.map(decision => {
        const title = decision.data.decision || decision.data.option || decision.data.values || 'Decision';
        const statusClass = decision.status === 'completed' ? 'completed' : 'pending';
        
        return `
            <div class="decision-item ${statusClass}">
                <div class="decision-info">
                    <span class="decision-framework">${decision.frameworkName}</span>
                    <span class="decision-title">${title}</span>
                    <span class="decision-date">${new Date(decision.createdAt).toLocaleDateString()}</span>
                </div>
                ${decision.status === 'pending' ? `
                    <button class="secondary-btn" onclick="recordDecisionOutcome('${decision.id}')">Record Outcome</button>
                ` : `
                    <span class="decision-satisfaction">Satisfaction: ${decision.satisfaction}/5</span>
                `}
            </div>
        `;
    }).join('');
}

// ============================================
// FRAMEWORK MODALS
// ============================================

function showDecisionFramework(frameworkId) {
    const framework = decisionFrameworks[frameworkId];
    if (!framework) return;
    
    let formHtml = '';
    
    switch(frameworkId) {
        case 'prosCons':
            formHtml = renderProsConsForm();
            break;
        case 'weighted':
            formHtml = renderWeightedForm();
            break;
        case 'worstCase':
            formHtml = renderWorstCaseForm();
            break;
        case 'values':
            formHtml = renderValuesForm();
            break;
        case 'tenTenTen':
            formHtml = renderTenTenTenForm();
            break;
        case 'trusted':
            formHtml = renderTrustedForm();
            break;
    }
    
    const modal = document.createElement('div');
    modal.className = 'decision-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-icon">${framework.icon}</span>
                <h2>${framework.name}</h2>
                <p>${framework.description}</p>
            </div>
            <form onsubmit="handleDecisionSubmit(event, '${frameworkId}')">
                ${formHtml}
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.decision-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Save Decision</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function renderProsConsForm() {
    return `
        <div class="form-group">
            <label>Decision/Option</label>
            <input type="text" id="decisionOption" required placeholder="What are you deciding?">
        </div>
        <div class="form-group">
            <label>Pros (one per line)</label>
            <textarea id="decisionPros" rows="4" placeholder="Advantages..."></textarea>
        </div>
        <div class="form-group">
            <label>Cons (one per line)</label>
            <textarea id="decisionCons" rows="4" placeholder="Disadvantages..."></textarea>
        </div>
    `;
}

function renderWeightedForm() {
    return `
        <div class="form-group">
            <label>Decision</label>
            <input type="text" id="weightedDecision" required placeholder="What are you deciding?">
        </div>
        <div class="form-group">
            <label>Criteria (one per line, with importance)</label>
            <textarea id="weightedCriteria" rows="4" placeholder="Cost (5)&#10;Time (3)&#10;Impact (8)"></textarea>
            <small>Number in parentheses = importance weight (1-10)</small>
        </div>
        <div class="form-group">
            <label>Options (one per line)</label>
            <textarea id="weightedOptions" rows="4" placeholder="Option A&#10;Option B&#10;Option C"></textarea>
        </div>
    `;
}

function renderWorstCaseForm() {
    return `
        <div class="form-group">
            <label>Decision</label>
            <input type="text" id="worstCaseDecision" required placeholder="What are you deciding?">
        </div>
        <div class="form-group">
            <label>Worst Case Scenario</label>
            <textarea id="worstCase" rows="3" placeholder="What's the worst that could happen?"></textarea>
        </div>
        <div class="form-group">
            <label>Best Case Scenario</label>
            <textarea id="bestCase" rows="3" placeholder="What's the best that could happen?"></textarea>
        </div>
        <div class="form-group">
            <label>Mitigation Plan</label>
            <textarea id="mitigation" rows="3" placeholder="How can you handle the worst case?"></textarea>
        </div>
    `;
}

function renderValuesForm() {
    return `
        <div class="form-group">
            <label>Decision</label>
            <input type="text" id="valuesDecision" required placeholder="What are you deciding?">
        </div>
        <div class="form-group">
            <label>Your Core Values (one per line)</label>
            <textarea id="coreValues" rows="4" placeholder="Honesty&#10;Kindness&#10;Growth&#10;Family"></textarea>
        </div>
        <div class="form-group">
            <label>Alignment Assessment</label>
            <textarea id="alignment" rows="4" placeholder="How does each option align with your values?"></textarea>
        </div>
    `;
}

function renderTenTenTenForm() {
    return `
        <div class="form-group">
            <label>Decision</label>
            <input type="text" id="tenDecision" required placeholder="What are you deciding?">
        </div>
        <div class="form-group">
            <label>How will you feel in 10 minutes?</label>
            <textarea id="tenMinutes" rows="2" placeholder="Immediate feelings..."></textarea>
        </div>
        <div class="form-group">
            <label>How will you feel in 10 months?</label>
            <textarea id="tenMonths" rows="2" placeholder="Medium-term feelings..."></textarea>
        </div>
        <div class="form-group">
            <label>How will you feel in 10 years?</label>
            <textarea id="tenYears" rows="2" placeholder="Long-term feelings..."></textarea>
        </div>
    `;
}

function renderTrustedForm() {
    return `
        <div class="form-group">
            <label>Decision</label>
            <input type="text" id="trustedDecision" required placeholder="What are you deciding?">
        </div>
        <div class="form-group">
            <label>Trusted Advisor</label>
            <input type="text" id="advisor" placeholder="Who do you trust?">
        </div>
        <div class="form-group">
            <label>What would they advise?</label>
            <textarea id="advice" rows="4" placeholder="Their perspective..."></textarea>
        </div>
    `;
}

function handleDecisionSubmit(event, frameworkId) {
    event.preventDefault();
    
    let data = {};
    
    switch(frameworkId) {
        case 'prosCons':
            data = {
                option: document.getElementById('decisionOption').value,
                pros: document.getElementById('decisionPros').value.split('\n').filter(p => p.trim()),
                cons: document.getElementById('decisionCons').value.split('\n').filter(c => c.trim())
            };
            break;
        case 'weighted':
            data = {
                decision: document.getElementById('weightedDecision').value,
                criteria: document.getElementById('weightedCriteria').value.split('\n').filter(c => c.trim()),
                options: document.getElementById('weightedOptions').value.split('\n').filter(o => o.trim())
            };
            break;
        case 'worstCase':
            data = {
                decision: document.getElementById('worstCaseDecision').value,
                worstCase: document.getElementById('worstCase').value,
                bestCase: document.getElementById('bestCase').value,
                mitigation: document.getElementById('mitigation').value
            };
            break;
        case 'values':
            data = {
                decision: document.getElementById('valuesDecision').value,
                values: document.getElementById('coreValues').value.split('\n').filter(v => v.trim()),
                alignment: document.getElementById('alignment').value
            };
            break;
        case 'tenTenTen':
            data = {
                decision: document.getElementById('tenDecision').value,
                tenMinutes: document.getElementById('tenMinutes').value,
                tenMonths: document.getElementById('tenMonths').value,
                tenYears: document.getElementById('tenYears').value
            };
            break;
        case 'trusted':
            data = {
                decision: document.getElementById('trustedDecision').value,
                advisor: document.getElementById('advisor').value,
                advice: document.getElementById('advice').value
            };
            break;
    }
    
    createDecision(frameworkId, data);
    
    event.target.closest('.decision-modal').remove();
    renderDecisionsDashboard();
}

function recordDecisionOutcome(decisionId) {
    const decision = Decisions.history.find(d => d.id === decisionId);
    if (!decision) return;
    
    const modal = document.createElement('div');
    modal.className = 'decision-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Record Outcome</h2>
            <p>How did this decision turn out?</p>
            <form onsubmit="handleOutcomeSubmit(event, '${decisionId}')">
                <div class="form-group">
                    <label>What happened?</label>
                    <textarea id="outcomeText" rows="4" required placeholder="Describe the outcome..."></textarea>
                </div>
                <div class="form-group">
                    <label>Satisfaction (1-5)</label>
                    <select id="satisfaction">
                        <option value="1">1 - Very Dissatisfied</option>
                        <option value="2">2 - Dissatisfied</option>
                        <option value="3">3 - Neutral</option>
                        <option value="4">4 - Satisfied</option>
                        <option value="5">5 - Very Satisfied</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.decision-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Save Outcome</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function handleOutcomeSubmit(event, decisionId) {
    event.preventDefault();
    
    const outcome = document.getElementById('outcomeText').value;
    const satisfaction = parseInt(document.getElementById('satisfaction').value);
    
    recordOutcome(decisionId, outcome, satisfaction);
    
    event.target.closest('.decision-modal').remove();
    renderDecisionsDashboard();
}

// ============================================
// UI SETUP
// ============================================

function setupDecisionsUI() {
    addDecisionsToNavigation();
}

function addDecisionsToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="decisions"]')) return;
    
    const decisionsItem = document.createElement('button');
    decisionsItem.className = 'nav-item';
    decisionsItem.setAttribute('onclick', "navigateTo('decisions')");
    decisionsItem.setAttribute('role', 'menuitem');
    decisionsItem.textContent = '🤔 Decisions';
    
    const goalsBtn = navMenu.querySelector('.nav-item[onclick*="goals"]');
    if (goalsBtn) {
        navMenu.insertBefore(decisionsItem, goalsBtn.nextSibling);
    } else {
        navMenu.appendChild(decisionsItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.createDecision = createDecision;
window.recordOutcome = recordOutcome;
window.renderDecisionsDashboard = renderDecisionsDashboard;
window.showDecisionFramework = showDecisionFramework;
window.handleDecisionSubmit = handleDecisionSubmit;
window.recordDecisionOutcome = recordDecisionOutcome;
window.handleOutcomeSubmit = handleOutcomeSubmit;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeDecisions();
});
