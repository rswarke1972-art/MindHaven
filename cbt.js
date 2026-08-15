// ============================================
// MINDHAVEN - CBT Thought Records Module
// ============================================

// CBT State
const CBT = {
    records: [],
    currentRecord: null
};

// Initialize CBT Module
function initializeCBT() {
    console.log('🧠 Initializing CBT Thought Records...');
    loadCBTData();
    setupCBTUI();
    console.log('✅ CBT Thought Records initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadCBTData() {
    const savedData = localStorage.getItem('mindhaven_cbt_records');
    if (savedData) {
        CBT.records = JSON.parse(savedData);
    }
    
    // Also load from userData
    if (MindHaven.userData.cbtRecords) {
        CBT.records = MindHaven.userData.cbtRecords;
    }
}

function saveCBTData() {
    localStorage.setItem('mindhaven_cbt_records', JSON.stringify(CBT.records));
    
    MindHaven.userData.cbtRecords = CBT.records;
    saveUserData();
}

// ============================================
// THOUGHT RECORD CREATION
// ============================================

function startNewThoughtRecord() {
    CBT.currentRecord = {
        id: generateId(),
        date: new Date().toISOString(),
        situation: '',
        automaticThought: '',
        emotions: [],
        evidenceFor: [],
        evidenceAgainst: [],
        alternativeThought: '',
        beliefRating: 5,
        outcome: ''
    };
    
    showThoughtRecordModal();
}

function showThoughtRecordModal() {
    const modal = document.createElement('div');
    modal.id = 'cbtModal';
    modal.className = 'cbt-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🧠 CBT Thought Record</h2>
                <button class="close-btn" onclick="closeCBTModal()">×</button>
            </div>
            <div class="cbt-form">
                <div class="form-section">
                    <h3>1. Situation</h3>
                    <p class="form-help">What happened? Where were you? Who was there?</p>
                    <textarea id="cbtSituation" rows="3" placeholder="Describe the situation...">${CBT.currentRecord.situation}</textarea>
                </div>
                
                <div class="form-section">
                    <h3>2. Automatic Thought</h3>
                    <p class="form-help">What went through your mind?</p>
                    <textarea id="cbtAutomaticThought" rows="3" placeholder="What thoughts came up...">${CBT.currentRecord.automaticThought}</textarea>
                </div>
                
                <div class="form-section">
                    <h3>3. Emotions</h3>
                    <p class="form-help">How did this make you feel? Rate intensity (1-10)</p>
                    <div class="emotions-input" id="cbtEmotions">
                        ${renderEmotionInputs()}
                    </div>
                    <button class="secondary-btn" onclick="addEmotionInput()">+ Add Emotion</button>
                </div>
                
                <div class="form-section">
                    <h3>4. Evidence For</h3>
                    <p class="form-help">What facts support this thought?</p>
                    <div class="evidence-list" id="evidenceFor">
                        ${CBT.currentRecord.evidenceFor.map((e, i) => `
                            <div class="evidence-item">
                                <input type="text" value="${e}" placeholder="Evidence that supports the thought...">
                                <button class="remove-btn" onclick="removeEvidence('for', ${i})">×</button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="secondary-btn" onclick="addEvidence('for')">+ Add Evidence</button>
                </div>
                
                <div class="form-section">
                    <h3>5. Evidence Against</h3>
                    <p class="form-help">What facts contradict this thought?</p>
                    <div class="evidence-list" id="evidenceAgainst">
                        ${CBT.currentRecord.evidenceAgainst.map((e, i) => `
                            <div class="evidence-item">
                                <input type="text" value="${e}" placeholder="Evidence that contradicts the thought...">
                                <button class="remove-btn" onclick="removeEvidence('against', ${i})">×</button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="secondary-btn" onclick="addEvidence('against')">+ Add Evidence</button>
                </div>
                
                <div class="form-section">
                    <h3>6. Alternative Thought</h3>
                    <p class="form-help">What's a more balanced way to think about this?</p>
                    <textarea id="cbtAlternativeThought" rows="3" placeholder="A more balanced perspective...">${CBT.currentRecord.alternativeThought}</textarea>
                </div>
                
                <div class="form-section">
                    <h3>7. Belief Rating</h3>
                    <p class="form-help">How much do you believe the automatic thought now? (0-100)</p>
                    <input type="range" id="cbtBeliefRating" min="0" max="100" value="${CBT.currentRecord.beliefRating}" oninput="document.getElementById('beliefValue').textContent = this.value + '%'">
                    <span id="beliefValue">${CBT.currentRecord.beliefRating}%</span>
                </div>
                
                <div class="form-section">
                    <h3>8. Outcome</h3>
                    <p class="form-help">How do you feel now? What did you learn?</p>
                    <textarea id="cbtOutcome" rows="3" placeholder="Reflection on the exercise...">${CBT.currentRecord.outcome}</textarea>
                </div>
                
                <div class="form-actions">
                    <button class="secondary-btn" onclick="closeCBTModal()">Cancel</button>
                    <button class="primary-btn" onclick="saveThoughtRecord()">Save Record</button>
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
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(modal);
}

function renderEmotionInputs() {
    if (CBT.currentRecord.emotions.length === 0) {
        CBT.currentRecord.emotions.push({ name: '', intensity: 5 });
    }
    
    return CBT.currentRecord.emotions.map((emotion, index) => `
        <div class="emotion-item">
            <input type="text" class="emotion-name" value="${emotion.name}" placeholder="Emotion (e.g., anxiety, sadness)">
            <input type="range" class="emotion-intensity" min="1" max="10" value="${emotion.intensity}" oninput="this.nextElementSibling.textContent = this.value">
            <span class="intensity-value">${emotion.intensity}</span>
            <button class="remove-btn" onclick="removeEmotion(${index})">×</button>
        </div>
    `).join('');
}

function addEmotionInput() {
    CBT.currentRecord.emotions.push({ name: '', intensity: 5 });
    document.getElementById('cbtEmotions').innerHTML = renderEmotionInputs();
}

function removeEmotion(index) {
    CBT.currentRecord.emotions.splice(index, 1);
    document.getElementById('cbtEmotions').innerHTML = renderEmotionInputs();
}

function addEvidence(type) {
    if (type === 'for') {
        CBT.currentRecord.evidenceFor.push('');
    } else {
        CBT.currentRecord.evidenceAgainst.push('');
    }
    updateEvidenceList(type);
}

function removeEvidence(type, index) {
    if (type === 'for') {
        CBT.currentRecord.evidenceFor.splice(index, 1);
    } else {
        CBT.currentRecord.evidenceAgainst.splice(index, 1);
    }
    updateEvidenceList(type);
}

function updateEvidenceList(type) {
    const container = document.getElementById(type === 'for' ? 'evidenceFor' : 'evidenceAgainst');
    const evidence = type === 'for' ? CBT.currentRecord.evidenceFor : CBT.currentRecord.evidenceAgainst;
    
    container.innerHTML = evidence.map((e, i) => `
        <div class="evidence-item">
            <input type="text" value="${e}" placeholder="${type === 'for' ? 'Evidence that supports the thought...' : 'Evidence that contradicts the thought...'}">
            <button class="remove-btn" onclick="removeEvidence('${type}', ${i})">×</button>
        </div>
    `).join('');
}

function saveThoughtRecord() {
    // Collect form data
    CBT.currentRecord.situation = document.getElementById('cbtSituation').value.trim();
    CBT.currentRecord.automaticThought = document.getElementById('cbtAutomaticThought').value.trim();
    CBT.currentRecord.alternativeThought = document.getElementById('cbtAlternativeThought').value.trim();
    CBT.currentRecord.beliefRating = parseInt(document.getElementById('cbtBeliefRating').value);
    CBT.currentRecord.outcome = document.getElementById('cbtOutcome').value.trim();
    
    // Collect emotions
    const emotionItems = document.querySelectorAll('.emotion-item');
    CBT.currentRecord.emotions = [];
    emotionItems.forEach(item => {
        const name = item.querySelector('.emotion-name').value.trim();
        const intensity = parseInt(item.querySelector('.emotion-intensity').value);
        if (name) {
            CBT.currentRecord.emotions.push({ name, intensity });
        }
    });
    
    // Collect evidence
    const evidenceForItems = document.querySelectorAll('#evidenceFor .evidence-item input');
    CBT.currentRecord.evidenceFor = [];
    evidenceForItems.forEach(input => {
        if (input.value.trim()) {
            CBT.currentRecord.evidenceFor.push(input.value.trim());
        }
    });
    
    const evidenceAgainstItems = document.querySelectorAll('#evidenceAgainst .evidence-item input');
    CBT.currentRecord.evidenceAgainst = [];
    evidenceAgainstItems.forEach(input => {
        if (input.value.trim()) {
            CBT.currentRecord.evidenceAgainst.push(input.value.trim());
        }
    });
    
    // Save record
    CBT.records.push(CBT.currentRecord);
    saveCBTData();
    
    closeCBTModal();
    showGentleMessage('Thought record saved. Great work on challenging your thoughts!');
    
    renderCBTHistory();
}

function closeCBTModal() {
    const modal = document.getElementById('cbtModal');
    if (modal) modal.remove();
    CBT.currentRecord = null;
}

// ============================================
// CBT HISTORY
// ============================================

function renderCBTHistory() {
    const container = document.getElementById('cbtHistory');
    if (!container) return;
    
    if (CBT.records.length === 0) {
        container.innerHTML = '<p class="empty-state">No thought records yet. Start by creating your first record.</p>';
        return;
    }
    
    const sortedRecords = [...CBT.records].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    sortedRecords.forEach(record => {
        const date = new Date(record.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        html += `
            <div class="cbt-record-card">
                <div class="record-header">
                    <span class="record-date">${date}</span>
                    <button class="delete-btn" onclick="deleteCBTRecord('${record.id}')">🗑️</button>
                </div>
                <div class="record-situation">
                    <strong>Situation:</strong> ${record.situation}
                </div>
                <div class="record-thought">
                    <strong>Thought:</strong> ${record.automaticThought}
                </div>
                <div class="record-alternative">
                    <strong>Alternative:</strong> ${record.alternativeThought}
                </div>
                <div class="record-belief">
                    <strong>Belief changed:</strong> ${record.beliefRating}%
                </div>
                <button class="secondary-btn" onclick="viewCBTRecord('${record.id}')">View Details</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function viewCBTRecord(id) {
    const record = CBT.records.find(r => r.id === id);
    if (!record) return;
    
    CBT.currentRecord = { ...record };
    showThoughtRecordModal();
}

function deleteCBTRecord(id) {
    if (!confirm('Are you sure you want to delete this thought record?')) return;
    
    CBT.records = CBT.records.filter(r => r.id !== id);
    saveCBTData();
    renderCBTHistory();
    showGentleMessage('Thought record deleted.');
}

// ============================================
// UI SETUP
// ============================================

function setupCBTUI() {
    addCBTToNavigation();
    renderCBTHistory();
}

function addCBTToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="cbt"]')) return;
    
    const cbtItem = document.createElement('button');
    cbtItem.className = 'nav-item';
    cbtItem.setAttribute('onclick', "navigateTo('cbt')");
    cbtItem.setAttribute('role', 'menuitem');
    cbtItem.textContent = '🧠 CBT';
    
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(cbtItem, crisisBtn);
    } else {
        navMenu.appendChild(cbtItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.startNewThoughtRecord = startNewThoughtRecord;
window.closeCBTModal = closeCBTModal;
window.saveThoughtRecord = saveThoughtRecord;
window.addEmotionInput = addEmotionInput;
window.removeEmotion = removeEmotion;
window.addEvidence = addEvidence;
window.removeEvidence = removeEvidence;
window.viewCBTRecord = viewCBTRecord;
window.deleteCBTRecord = deleteCBTRecord;
window.renderCBTHistory = renderCBTHistory;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeCBT();
});
