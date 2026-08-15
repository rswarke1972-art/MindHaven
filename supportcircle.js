// ============================================
// MINDHAVEN - Support Circle Builder Module
// ============================================

// Support Circle State
const SupportCircle = {
    circle: [],
    emergencyContacts: []
};

// Initialize Support Circle Module
function initializeSupportCircle() {
    console.log('🫂 Initializing Support Circle Builder...');
    loadSupportCircleData();
    setupSupportCircleUI();
    console.log('✅ Support Circle Builder initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadSupportCircleData() {
    if (MindHaven.userData.support) {
        SupportCircle.circle = MindHaven.userData.support.circle || [];
        SupportCircle.emergencyContacts = MindHaven.userData.support.emergencyContacts || [];
    }
}

function saveSupportCircleData() {
    MindHaven.userData.support = {
        circle: SupportCircle.circle,
        emergencyContacts: SupportCircle.emergencyContacts,
        safetyPlan: MindHaven.userData.support.safetyPlan || {}
    };
    saveUserData();
}

// ============================================
// SUPPORT CIRCLE MANAGEMENT
// ============================================

function addContact(name, relationship, phone, email, notes) {
    const contact = {
        id: generateId(),
        name: name,
        relationship: relationship,
        phone: phone,
        email: email,
        notes: notes,
        isEmergency: false,
        createdAt: new Date().toISOString()
    };
    
    SupportCircle.circle.push(contact);
    saveSupportCircleData();
    
    return contact;
}

function removeContact(contactId) {
    const index = SupportCircle.circle.findIndex(c => c.id === contactId);
    if (index !== -1) {
        SupportCircle.circle.splice(index, 1);
        saveSupportCircleData();
        renderSupportCircleDashboard();
    }
}

function updateContact(contactId, updates) {
    const contact = SupportCircle.circle.find(c => c.id === contactId);
    if (contact) {
        Object.assign(contact, updates);
        saveSupportCircleData();
        renderSupportCircleDashboard();
    }
}

function setAsEmergency(contactId) {
    const contact = SupportCircle.circle.find(c => c.id === contactId);
    if (contact) {
        contact.isEmergency = !contact.isEmergency;
        
        if (contact.isEmergency) {
            if (!SupportCircle.emergencyContacts.includes(contactId)) {
                SupportCircle.emergencyContacts.push(contactId);
            }
        } else {
            const index = SupportCircle.emergencyContacts.indexOf(contactId);
            if (index !== -1) {
                SupportCircle.emergencyContacts.splice(index, 1);
            }
        }
        
        saveSupportCircleData();
        renderSupportCircleDashboard();
    }
}

// ============================================
// SUPPORT CIRCLE DASHBOARD
// ============================================

function renderSupportCircleDashboard() {
    const container = document.getElementById('support-circle-dashboard');
    if (!container) return;
    
    let html = `
        <div class="support-circle-dashboard">
            <div class="circle-section">
                <div class="section-header">
                    <h2>My Support Circle</h2>
                    <button class="primary-btn" onclick="showAddContactModal()">+ Add Contact</button>
                </div>
                <div class="contacts-list">
                    ${renderContactsList()}
                </div>
            </div>
            
            <div class="emergency-section">
                <div class="section-header">
                    <h2>Emergency Contacts</h2>
                    <p class="section-subtitle">People to contact in crisis</p>
                </div>
                <div class="emergency-contacts-list">
                    ${renderEmergencyContacts()}
                </div>
            </div>
            
            <div class="tips-section">
                <h2>Building Your Support Circle</h2>
                <div class="tips-grid">
                    <div class="tip-card">
                        <span class="tip-icon">👥</span>
                        <h3>Diverse Network</h3>
                        <p>Include people with different roles - friends, family, professionals, mentors.</p>
                    </div>
                    <div class="tip-card">
                        <span class="tip-icon">💬</span>
                        <h3>Clear Communication</h3>
                        <p>Let people know how they can support you and what you need.</p>
                    </div>
                    <div class="tip-card">
                        <span class="tip-icon">🔄</span>
                        <h3>Mutual Support</h3>
                        <p>Healthy relationships involve give and take.</p>
                    </div>
                    <div class="tip-card">
                        <span class="tip-icon">📱</span>
                        <h3>Easy Access</h3>
                        <p>Keep contact info accessible when you need it most.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderContactsList() {
    if (SupportCircle.circle.length === 0) {
        return `
            <div class="empty-state">
                <span class="empty-icon">🫂</span>
                <p>No contacts in your support circle yet.</p>
                <p>Add people you trust and can turn to for support.</p>
            </div>
        `;
    }
    
    return SupportCircle.circle.map(contact => {
        return `
            <div class="contact-card ${contact.isEmergency ? 'emergency' : ''}">
                <div class="contact-header">
                    <div class="contact-info">
                        <span class="contact-name">${contact.name}</span>
                        <span class="contact-relationship">${contact.relationship}</span>
                    </div>
                    <div class="contact-actions">
                        <button class="icon-btn" onclick="setAsEmergency('${contact.id}')" title="Toggle Emergency" ${contact.isEmergency ? 'class="active"' : ''}>
                            🚨
                        </button>
                        <button class="icon-btn" onclick="editContact('${contact.id}')" title="Edit">
                            ✏️
                        </button>
                        <button class="icon-btn" onclick="removeContact('${contact.id}')" title="Remove">
                            🗑️
                        </button>
                    </div>
                </div>
                ${contact.phone ? `<div class="contact-detail">📞 ${contact.phone}</div>` : ''}
                ${contact.email ? `<div class="contact-detail">✉️ ${contact.email}</div>` : ''}
                ${contact.notes ? `<div class="contact-notes">📝 ${contact.notes}</div>` : ''}
            </div>
        `;
    }).join('');
}

function renderEmergencyContacts() {
    const emergencyContacts = SupportCircle.circle.filter(c => c.isEmergency);
    
    if (emergencyContacts.length === 0) {
        return `
            <p class="empty-state">No emergency contacts set. Mark contacts as emergency to add them here.</p>
        `;
    }
    
    return emergencyContacts.map(contact => {
        return `
            <div class="emergency-contact-card">
                <div class="emergency-info">
                    <span class="emergency-name">${contact.name}</span>
                    <span class="emergency-relationship">${contact.relationship}</span>
                </div>
                ${contact.phone ? `
                    <a href="tel:${contact.phone}" class="emergency-call-btn">
                        📞 Call ${contact.phone}
                    </a>
                ` : ''}
            </div>
        `;
    }).join('');
}

// ============================================
// MODALS
// ============================================

function showAddContactModal() {
    const modal = document.createElement('div');
    modal.className = 'support-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add to Support Circle</h2>
            <form onsubmit="handleAddContact(event)">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" id="contactName" required placeholder="Full name">
                </div>
                <div class="form-group">
                    <label>Relationship *</label>
                    <select id="contactRelationship" required>
                        <option value="">Select relationship...</option>
                        <option value="Family">Family</option>
                        <option value="Friend">Friend</option>
                        <option value="Partner">Partner/Spouse</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Therapist">Therapist/Counselor</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Support Group">Support Group</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" id="contactPhone" placeholder="Phone number">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="contactEmail" placeholder="Email address">
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="contactNotes" rows="3" placeholder="How can they support you? Best times to reach them?"></textarea>
                </div>
                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="isEmergency">
                        <span>Mark as emergency contact</span>
                    </label>
                </div>
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.support-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Add Contact</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function handleAddContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const relationship = document.getElementById('contactRelationship').value;
    const phone = document.getElementById('contactPhone').value || null;
    const email = document.getElementById('contactEmail').value || null;
    const notes = document.getElementById('contactNotes').value || null;
    const isEmergency = document.getElementById('isEmergency').checked;
    
    const contact = addContact(name, relationship, phone, email, notes);
    
    if (isEmergency) {
        setAsEmergency(contact.id);
    }
    
    event.target.closest('.support-modal').remove();
    renderSupportCircleDashboard();
}

function editContact(contactId) {
    const contact = SupportCircle.circle.find(c => c.id === contactId);
    if (!contact) return;
    
    const modal = document.createElement('div');
    modal.className = 'support-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Edit Contact</h2>
            <form onsubmit="handleEditContact(event, '${contactId}')">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" id="editContactName" required value="${contact.name}">
                </div>
                <div class="form-group">
                    <label>Relationship *</label>
                    <select id="editContactRelationship" required>
                        <option value="Family" ${contact.relationship === 'Family' ? 'selected' : ''}>Family</option>
                        <option value="Friend" ${contact.relationship === 'Friend' ? 'selected' : ''}>Friend</option>
                        <option value="Partner" ${contact.relationship === 'Partner' ? 'selected' : ''}>Partner/Spouse</option>
                        <option value="Mentor" ${contact.relationship === 'Mentor' ? 'selected' : ''}>Mentor</option>
                        <option value="Therapist" ${contact.relationship === 'Therapist' ? 'selected' : ''}>Therapist/Counselor</option>
                        <option value="Colleague" ${contact.relationship === 'Colleague' ? 'selected' : ''}>Colleague</option>
                        <option value="Support Group" ${contact.relationship === 'Support Group' ? 'selected' : ''}>Support Group</option>
                        <option value="Other" ${contact.relationship === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" id="editContactPhone" value="${contact.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="editContactEmail" value="${contact.email || ''}">
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="editContactNotes" rows="3">${contact.notes || ''}</textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="secondary-btn" onclick="this.closest('.support-modal').remove()">Cancel</button>
                    <button type="submit" class="primary-btn">Save Changes</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function handleEditContact(event, contactId) {
    event.preventDefault();
    
    const updates = {
        name: document.getElementById('editContactName').value,
        relationship: document.getElementById('editContactRelationship').value,
        phone: document.getElementById('editContactPhone').value || null,
        email: document.getElementById('editContactEmail').value || null,
        notes: document.getElementById('editContactNotes').value || null
    };
    
    updateContact(contactId, updates);
    
    event.target.closest('.support-modal').remove();
}

// ============================================
// UI SETUP
// ============================================

function setupSupportCircleUI() {
    addSupportCircleToNavigation();
}

function addSupportCircleToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="supportcircle"]')) return;
    
    const supportItem = document.createElement('button');
    supportItem.className = 'nav-item';
    supportItem.setAttribute('onclick', "navigateTo('supportcircle')");
    supportItem.setAttribute('role', 'menuitem');
    supportItem.textContent = '🫂 Support';
    
    const studentBtn = navMenu.querySelector('.nav-item[onclick*="student"]');
    if (studentBtn) {
        navMenu.insertBefore(supportItem, studentBtn.nextSibling);
    } else {
        navMenu.appendChild(supportItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.addContact = addContact;
window.removeContact = removeContact;
window.updateContact = updateContact;
window.setAsEmergency = setAsEmergency;
window.renderSupportCircleDashboard = renderSupportCircleDashboard;
window.showAddContactModal = showAddContactModal;
window.handleAddContact = handleAddContact;
window.editContact = editContact;
window.handleEditContact = handleEditContact;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeSupportCircle();
});
