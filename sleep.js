// ============================================
// MINDHAVEN - Sleep Tracker Module
// ============================================

// Sleep State
const Sleep = {
    records: [],
    currentRecord: null
};

// Initialize Sleep Tracker Module
function initializeSleep() {
    console.log('😴 Initializing Sleep Tracker...');
    loadSleepData();
    setupSleepUI();
    console.log('✅ Sleep Tracker initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadSleepData() {
    const savedData = localStorage.getItem('mindhaven_sleep');
    if (savedData) {
        Sleep.records = JSON.parse(savedData);
    }
    
    // Also load from userData
    if (MindHaven.userData.sleep) {
        Sleep.records = MindHaven.userData.sleep;
    }
}

function saveSleepData() {
    localStorage.setItem('mindhaven_sleep', JSON.stringify(Sleep.records));
    
    MindHaven.userData.sleep = Sleep.records;
    saveUserData();
}

// ============================================
// SLEEP RECORDING
// ============================================

function startNewSleepRecord() {
    Sleep.currentRecord = {
        id: generateId(),
        date: new Date().toISOString(),
        bedtime: '',
        wakeTime: '',
        sleepQuality: 5,
        hoursSlept: 0,
        factors: [],
        notes: ''
    };
    
    showSleepModal();
}

function showSleepModal() {
    const modal = document.createElement('div');
    modal.id = 'sleepModal';
    modal.className = 'sleep-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>😴 Log Your Sleep</h2>
                <button class="close-btn" onclick="closeSleepModal()">×</button>
            </div>
            <div class="sleep-form">
                <div class="form-section">
                    <h3>Date</h3>
                    <input type="date" id="sleepDate" value="${new Date().toISOString().split('T')[0]}">
                </div>
                
                <div class="form-section">
                    <h3>Bedtime</h3>
                    <input type="time" id="sleepBedtime" value="${Sleep.currentRecord.bedtime}">
                </div>
                
                <div class="form-section">
                    <h3>Wake Time</h3>
                    <input type="time" id="sleepWakeTime" value="${Sleep.currentRecord.wakeTime}">
                </div>
                
                <div class="form-section">
                    <h3>Sleep Quality</h3>
                    <div class="quality-slider">
                        <input type="range" id="sleepQuality" min="1" max="10" value="${Sleep.currentRecord.sleepQuality}" oninput="document.getElementById('qualityValue').textContent = this.value + '/10'">
                        <span id="qualityValue">${Sleep.currentRecord.sleepQuality}/10</span>
                    </div>
                    <div class="quality-labels">
                        <span>Poor</span>
                        <span>Excellent</span>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>Factors Affecting Sleep</h3>
                    <div class="factors-grid" id="factorsGrid">
                        <label class="factor-checkbox">
                            <input type="checkbox" value="stress"> Stress/Anxiety
                        </label>
                        <label class="factor-checkbox">
                            <input type="checkbox" value="caffeine"> Caffeine
                        </label>
                        <label class="factor-checkbox">
                            <input type="checkbox" value="alcohol"> Alcohol
                        </label>
                        <label class="factor-checkbox">
                            <input type="checkbox" value="exercise"> Exercise
                        </label>
                        <label class="factor-checkbox">
                            <input type="checkbox" value="screens"> Screens
                        </label>
                        <label class="factor-checkbox">
                            <input type="checkbox" value="noise"> Noise
                        </label>
                        <label class="factor-checkbox">
                            <input type="checkbox" value="temperature"> Temperature
                        </label>
                        <label class="factor-checkbox">
                            <input type="checkbox" value="medication"> Medication
                        </label>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>Notes</h3>
                    <textarea id="sleepNotes" rows="3" placeholder="Any additional notes about your sleep...">${Sleep.currentRecord.notes}</textarea>
                </div>
                
                <div class="form-actions">
                    <button class="secondary-btn" onclick="closeSleepModal()">Cancel</button>
                    <button class="primary-btn" onclick="saveSleepRecord()">Save Sleep Log</button>
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
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(modal);
}

function saveSleepRecord() {
    const date = document.getElementById('sleepDate').value;
    const bedtime = document.getElementById('sleepBedtime').value;
    const wakeTime = document.getElementById('sleepWakeTime').value;
    const sleepQuality = parseInt(document.getElementById('sleepQuality').value);
    const notes = document.getElementById('sleepNotes').value.trim();
    
    // Collect factors
    const factors = [];
    document.querySelectorAll('#factorsGrid input:checked').forEach(checkbox => {
        factors.push(checkbox.value);
    });
    
    // Calculate hours slept
    let hoursSlept = 0;
    if (bedtime && wakeTime) {
        hoursSlept = calculateHoursSlept(bedtime, wakeTime);
    }
    
    Sleep.currentRecord = {
        ...Sleep.currentRecord,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        bedtime,
        wakeTime,
        sleepQuality,
        hoursSlept,
        factors,
        notes
    };
    
    Sleep.records.push(Sleep.currentRecord);
    saveSleepData();
    
    closeSleepModal();
    showGentleMessage('Sleep log saved. Tracking your sleep patterns can help improve your rest.');
    
    renderSleepHistory();
    renderSleepStats();
}

function calculateHoursSlept(bedtime, wakeTime) {
    const [bedHours, bedMins] = bedtime.split(':').map(Number);
    const [wakeHours, wakeMins] = wakeTime.split(':').map(Number);
    
    let bedDate = new Date();
    bedDate.setHours(bedHours, bedMins, 0, 0);
    
    let wakeDate = new Date();
    wakeDate.setHours(wakeHours, wakeMins, 0, 0);
    
    // If wake time is before bedtime, assume it's the next day
    if (wakeDate <= bedDate) {
        wakeDate.setDate(wakeDate.getDate() + 1);
    }
    
    const diffMs = wakeDate - bedDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.round(diffHours * 10) / 10;
}

function closeSleepModal() {
    const modal = document.getElementById('sleepModal');
    if (modal) modal.remove();
    Sleep.currentRecord = null;
}

// ============================================
// SLEEP HISTORY & STATS
// ============================================

function renderSleepHistory() {
    const container = document.getElementById('sleepHistory');
    if (!container) return;
    
    if (Sleep.records.length === 0) {
        container.innerHTML = '<p class="empty-state">No sleep logs yet. Start by logging your first night\'s sleep.</p>';
        return;
    }
    
    const sortedRecords = [...Sleep.records].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    sortedRecords.forEach(record => {
        const date = new Date(record.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        const qualityColor = record.sleepQuality >= 7 ? '#A8C3A1' : 
                           record.sleepQuality >= 5 ? '#8FAACF' : '#E57373';
        
        html += `
            <div class="sleep-record-card">
                <div class="record-header">
                    <span class="record-date">${date}</span>
                    <button class="delete-btn" onclick="deleteSleepRecord('${record.id}')">🗑️</button>
                </div>
                <div class="record-quality" style="background: ${qualityColor}">
                    Quality: ${record.sleepQuality}/10
                </div>
                <div class="record-times">
                    <span>🌙 ${record.bedtime || 'Not logged'}</span>
                    <span>☀️ ${record.wakeTime || 'Not logged'}</span>
                </div>
                <div class="record-hours">
                    <strong>Hours Slept:</strong> ${record.hoursSlept}h
                </div>
                ${record.factors.length > 0 ? `
                    <div class="record-factors">
                        <strong>Factors:</strong> ${record.factors.join(', ')}
                    </div>
                ` : ''}
                ${record.notes ? `<div class="record-notes">${record.notes}</div>` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderSleepStats() {
    const container = document.getElementById('sleepStats');
    if (!container) return;
    
    if (Sleep.records.length === 0) {
        container.innerHTML = '<p class="empty-state">Log some sleep data to see your patterns.</p>';
        return;
    }
    
    const avgHours = Sleep.records.reduce((sum, r) => sum + r.hoursSlept, 0) / Sleep.records.length;
    const avgQuality = Sleep.records.reduce((sum, r) => sum + r.sleepQuality, 0) / Sleep.records.length;
    
    // Calculate factor frequency
    const factorCounts = {};
    Sleep.records.forEach(record => {
        record.factors.forEach(factor => {
            factorCounts[factor] = (factorCounts[factor] || 0) + 1;
        });
    });
    
    let html = `
        <div class="sleep-stats-grid">
            <div class="stat-card">
                <h3>Average Sleep</h3>
                <span class="stat-value">${avgHours.toFixed(1)}h</span>
            </div>
            <div class="stat-card">
                <h3>Average Quality</h3>
                <span class="stat-value">${avgQuality.toFixed(1)}/10</span>
            </div>
            <div class="stat-card">
                <h3>Total Logs</h3>
                <span class="stat-value">${Sleep.records.length}</span>
            </div>
        </div>
        
        ${Object.keys(factorCounts).length > 0 ? `
            <div class="stats-breakdown">
                <h3>Common Factors</h3>
                <div class="factors-breakdown">
                    ${Object.entries(factorCounts).map(([factor, count]) => {
                        const percent = ((count / Sleep.records.length) * 100).toFixed(0);
                        return `
                            <div class="breakdown-item">
                                <span class="breakdown-label">${factor}</span>
                                <div class="breakdown-bar">
                                    <div class="breakdown-fill" style="width: ${percent}%"></div>
                                </div>
                                <span class="breakdown-count">${count} (${percent}%)</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        ` : ''}
    `;
    
    container.innerHTML = html;
}

function deleteSleepRecord(id) {
    if (!confirm('Are you sure you want to delete this sleep record?')) return;
    
    Sleep.records = Sleep.records.filter(r => r.id !== id);
    saveSleepData();
    renderSleepHistory();
    renderSleepStats();
    showGentleMessage('Sleep record deleted.');
}

// ============================================
// UI SETUP
// ============================================

function setupSleepUI() {
    addSleepToNavigation();
    renderSleepHistory();
    renderSleepStats();
}

function addSleepToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="sleep"]')) return;
    
    const sleepItem = document.createElement('button');
    sleepItem.className = 'nav-item';
    sleepItem.setAttribute('onclick', "navigateTo('sleep')");
    sleepItem.setAttribute('role', 'menuitem');
    sleepItem.textContent = '😴 Sleep';
    
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(sleepItem, crisisBtn);
    } else {
        navMenu.appendChild(sleepItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.startNewSleepRecord = startNewSleepRecord;
window.closeSleepModal = closeSleepModal;
window.saveSleepRecord = saveSleepRecord;
window.deleteSleepRecord = deleteSleepRecord;
window.renderSleepHistory = renderSleepHistory;
window.renderSleepStats = renderSleepStats;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeSleep();
});
