// ============================================
// MINDHAVEN - Trigger Tracking Module
// ============================================

// Trigger State
const Triggers = {
    records: [],
    categories: {
        social: { name: 'Social', icon: '👥', color: '#A8C3A1' },
        work: { name: 'Work/School', icon: '💼', color: '#8FAACF' },
        health: { name: 'Health', icon: '🏥', color: '#E57373' },
        financial: { name: 'Financial', icon: '💰', color: '#FFB74D' },
        relationship: { name: 'Relationship', icon: '❤️', color: '#E57373' },
        environment: { name: 'Environment', icon: '🏠', color: '#7CB8A6' },
        internal: { name: 'Internal', icon: '🧠', color: '#B8A7D1' },
        other: { name: 'Other', icon: '📌', color: '#9E9E9E' }
    },
    severityLevels: {
        1: { name: 'Mild', color: '#A8C3A1' },
        2: { name: 'Moderate', color: '#FFB74D' },
        3: { name: 'Significant', color: '#E57373' },
        4: { name: 'Severe', color: '#C62828' },
        5: { name: 'Extreme', color: '#8B0000' }
    }
};

// Initialize Trigger Tracking Module
function initializeTriggers() {
    console.log('🎯 Initializing Trigger Tracking...');
    loadTriggerData();
    setupTriggersUI();
    console.log('✅ Trigger Tracking initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadTriggerData() {
    const savedData = localStorage.getItem('mindhaven_triggers');
    if (savedData) {
        Triggers.records = JSON.parse(savedData);
    }
    
    // Also load from userData
    if (MindHaven.userData.triggers) {
        Triggers.records = MindHaven.userData.triggers;
    }
}

function saveTriggerData() {
    localStorage.setItem('mindhaven_triggers', JSON.stringify(Triggers.records));
    
    MindHaven.userData.triggers = Triggers.records;
    saveUserData();
}

// ============================================
// TRIGGER RECORDING
// ============================================

function startNewTriggerRecord() {
    showTriggerModal();
}

function showTriggerModal() {
    const modal = document.createElement('div');
    modal.id = 'triggerModal';
    modal.className = 'trigger-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🎯 Log a Trigger</h2>
                <button class="close-btn" onclick="closeTriggerModal()">×</button>
            </div>
            <div class="trigger-form">
                <div class="form-section">
                    <h3>What triggered you?</h3>
                    <textarea id="triggerDescription" rows="3" placeholder="Describe what happened..."></textarea>
                </div>
                
                <div class="form-section">
                    <h3>Category</h3>
                    <div class="category-grid" id="categoryGrid">
                        ${Object.entries(Triggers.categories).map(([id, cat]) => `
                            <button class="category-btn" data-category="${id}" onclick="selectCategory('${id}')" style="border-color: ${cat.color}">
                                <span class="category-icon">${cat.icon}</span>
                                <span class="category-name">${cat.name}</span>
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="selectedCategory" value="">
                </div>
                
                <div class="form-section">
                    <h3>Severity</h3>
                    <div class="severity-grid" id="severityGrid">
                        ${Object.entries(Triggers.severityLevels).map(([id, level]) => `
                            <button class="severity-btn" data-severity="${id}" onclick="selectSeverity('${id}')" style="background: ${level.color}">
                                <span class="severity-number">${id}</span>
                                <span class="severity-name">${level.name}</span>
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="selectedSeverity" value="">
                </div>
                
                <div class="form-section">
                    <h3>Physical Symptoms</h3>
                    <textarea id="triggerSymptoms" rows="2" placeholder="Any physical reactions (e.g., racing heart, sweating)..."></textarea>
                </div>
                
                <div class="form-section">
                    <h3>How did you cope?</h3>
                    <textarea id="triggerCoping" rows="2" placeholder="What did you do to manage this trigger?"></textarea>
                </div>
                
                <div class="form-section">
                    <h3>Notes</h3>
                    <textarea id="triggerNotes" rows="2" placeholder="Any additional notes..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button class="secondary-btn" onclick="closeTriggerModal()">Cancel</button>
                    <button class="primary-btn" onclick="saveTriggerRecord()">Save Trigger</button>
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
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(modal);
}

function selectCategory(categoryId) {
    document.getElementById('selectedCategory').value = categoryId;
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const selectedBtn = document.querySelector(`.category-btn[data-category="${categoryId}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
}

function selectSeverity(severityId) {
    document.getElementById('selectedSeverity').value = severityId;
    
    document.querySelectorAll('.severity-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.opacity = '0.5';
    });
    
    const selectedBtn = document.querySelector(`.severity-btn[data-severity="${severityId}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
        selectedBtn.style.opacity = '1';
    }
}

function saveTriggerRecord() {
    const description = document.getElementById('triggerDescription').value.trim();
    const category = document.getElementById('selectedCategory').value;
    const severity = document.getElementById('selectedSeverity').value;
    const symptoms = document.getElementById('triggerSymptoms').value.trim();
    const coping = document.getElementById('triggerCoping').value.trim();
    const notes = document.getElementById('triggerNotes').value.trim();
    
    if (!description) {
        showGentleMessage('Please describe what triggered you.');
        return;
    }
    
    if (!category) {
        showGentleMessage('Please select a category.');
        return;
    }
    
    if (!severity) {
        showGentleMessage('Please select a severity level.');
        return;
    }
    
    const record = {
        id: generateId(),
        date: new Date().toISOString(),
        description,
        category,
        severity: parseInt(severity),
        symptoms,
        coping,
        notes
    };
    
    Triggers.records.push(record);
    saveTriggerData();
    
    closeTriggerModal();
    showGentleMessage('Trigger logged successfully. Awareness is the first step to managing triggers.');
    
    renderTriggerHistory();
    renderTriggerStats();
}

function closeTriggerModal() {
    const modal = document.getElementById('triggerModal');
    if (modal) modal.remove();
}

// ============================================
// TRIGGER HISTORY & STATS
// ============================================

function renderTriggerHistory() {
    const container = document.getElementById('triggerHistory');
    if (!container) return;
    
    if (Triggers.records.length === 0) {
        container.innerHTML = '<p class="empty-state">No triggers logged yet. Start by logging your first trigger.</p>';
        return;
    }
    
    const sortedRecords = [...Triggers.records].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    sortedRecords.forEach(record => {
        const date = new Date(record.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        const category = Triggers.categories[record.category];
        const severity = Triggers.severityLevels[record.severity];
        
        html += `
            <div class="trigger-record-card">
                <div class="record-header">
                    <span class="record-date">${date}</span>
                    <button class="delete-btn" onclick="deleteTriggerRecord('${record.id}')">🗑️</button>
                </div>
                <div class="record-category" style="color: ${category.color}">
                    ${category.icon} ${category.name}
                </div>
                <div class="record-severity" style="background: ${severity.color}">
                    Severity: ${severity.name} (${record.severity}/5)
                </div>
                <div class="record-description">${record.description}</div>
                ${record.symptoms ? `<div class="record-symptoms"><strong>Symptoms:</strong> ${record.symptoms}</div>` : ''}
                ${record.coping ? `<div class="record-coping"><strong>Coping:</strong> ${record.coping}</div>` : ''}
                ${record.notes ? `<div class="record-notes"><strong>Notes:</strong> ${record.notes}</div>` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderTriggerStats() {
    const container = document.getElementById('triggerStats');
    if (!container) return;
    
    if (Triggers.records.length === 0) {
        container.innerHTML = '<p class="empty-state">Log some triggers to see your patterns.</p>';
        return;
    }
    
    // Calculate category distribution
    const categoryCounts = {};
    Triggers.records.forEach(record => {
        categoryCounts[record.category] = (categoryCounts[record.category] || 0) + 1;
    });
    
    // Calculate severity distribution
    const severityCounts = {};
    Triggers.records.forEach(record => {
        severityCounts[record.severity] = (severityCounts[record.severity] || 0) + 1;
    });
    
    let html = `
        <div class="trigger-stats-grid">
            <div class="stat-card">
                <h3>Total Triggers</h3>
                <span class="stat-value">${Triggers.records.length}</span>
            </div>
            <div class="stat-card">
                <h3>Most Common Category</h3>
                <span class="stat-value">${getMostCommonCategory()}</span>
            </div>
            <div class="stat-card">
                <h3>Average Severity</h3>
                <span class="stat-value">${getAverageSeverity().toFixed(1)}/5</span>
            </div>
        </div>
        
        <div class="stats-breakdown">
            <h3>By Category</h3>
            <div class="category-breakdown">
                ${Object.entries(categoryCounts).map(([id, count]) => {
                    const cat = Triggers.categories[id];
                    const percent = ((count / Triggers.records.length) * 100).toFixed(0);
                    return `
                        <div class="breakdown-item">
                            <span class="breakdown-label">${cat.icon} ${cat.name}</span>
                            <div class="breakdown-bar">
                                <div class="breakdown-fill" style="width: ${percent}%; background: ${cat.color}"></div>
                            </div>
                            <span class="breakdown-count">${count} (${percent}%)</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function getMostCommonCategory() {
    const categoryCounts = {};
    Triggers.records.forEach(record => {
        categoryCounts[record.category] = (categoryCounts[record.category] || 0) + 1;
    });
    
    let maxCount = 0;
    let mostCommon = 'other';
    
    Object.entries(categoryCounts).forEach(([id, count]) => {
        if (count > maxCount) {
            maxCount = count;
            mostCommon = id;
        }
    });
    
    const cat = Triggers.categories[mostCommon];
    return `${cat.icon} ${cat.name}`;
}

function getAverageSeverity() {
    if (Triggers.records.length === 0) return 0;
    
    const total = Triggers.records.reduce((sum, record) => sum + record.severity, 0);
    return total / Triggers.records.length;
}

function deleteTriggerRecord(id) {
    if (!confirm('Are you sure you want to delete this trigger record?')) return;
    
    Triggers.records = Triggers.records.filter(r => r.id !== id);
    saveTriggerData();
    renderTriggerHistory();
    renderTriggerStats();
    showGentleMessage('Trigger record deleted.');
}

// ============================================
// UI SETUP
// ============================================

function setupTriggersUI() {
    addTriggersToNavigation();
    renderTriggerHistory();
    renderTriggerStats();
}

function addTriggersToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="triggers"]')) return;
    
    const triggersItem = document.createElement('button');
    triggersItem.className = 'nav-item';
    triggersItem.setAttribute('onclick', "navigateTo('triggers')");
    triggersItem.setAttribute('role', 'menuitem');
    triggersItem.textContent = '🎯 Triggers';
    
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(triggersItem, crisisBtn);
    } else {
        navMenu.appendChild(triggersItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.startNewTriggerRecord = startNewTriggerRecord;
window.closeTriggerModal = closeTriggerModal;
window.selectCategory = selectCategory;
window.selectSeverity = selectSeverity;
window.saveTriggerRecord = saveTriggerRecord;
window.deleteTriggerRecord = deleteTriggerRecord;
window.renderTriggerHistory = renderTriggerHistory;
window.renderTriggerStats = renderTriggerStats;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeTriggers();
});
