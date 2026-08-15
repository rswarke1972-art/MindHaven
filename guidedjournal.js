// ============================================
// MINDHAVEN - Advanced Guided Journal Module
// ============================================

// Guided Journal State
const GuidedJournal = {
    pathways: [],
    moodTags: [],
    themes: {},
    streaks: {},
    analytics: {},
    currentPathway: null
};

// Journal Pathways
const journalPathways = {
    gratitude: {
        id: 'gratitude',
        name: 'Gratitude Practice',
        icon: '🙏',
        description: 'Focus on appreciation and positive aspects of life',
        prompts: [
            'What are three things you\'re grateful for today?',
            'Who made you smile today and why?',
            'What simple pleasure did you enjoy?',
            'What challenge revealed something to be grateful for?',
            'What about your body are you thankful for?'
        ]
    },
    anxiety: {
        id: 'anxiety',
        name: 'Anxiety Release',
        icon: '🌊',
        description: 'Process and release anxious thoughts',
        prompts: [
            'What\'s on your mind right now?',
            'What\'s the worst that could actually happen?',
            'What evidence do you have that this will happen?',
            'What would you tell a friend with this worry?',
            'What\'s one small step you can take?'
        ]
    },
    morning: {
        id: 'morning',
        name: 'Morning Intention',
        icon: '🌅',
        description: 'Set positive intentions for the day',
        prompts: [
            'How do you want to feel today?',
            'What\'s one thing you want to accomplish?',
            'What self-care will you prioritize?',
            'What challenge might you face and how will you handle it?',
            'What are you looking forward to?'
        ]
    },
    evening: {
        id: 'evening',
        name: 'Evening Reflection',
        icon: '🌙',
        description: 'Reflect on your day and prepare for rest',
        prompts: [
            'What went well today?',
            'What challenged you today?',
            'What did you learn about yourself?',
            'What are you proud of?',
            'How can you make tomorrow better?'
        ]
    },
    growth: {
        id: 'growth',
        name: 'Growth & Learning',
        icon: '🌱',
        description: 'Reflect on personal growth and lessons',
        prompts: [
            'What did you learn recently?',
            'How have you grown in the past month?',
            'What mistake taught you something valuable?',
            'What skill are you developing?',
            'What would your past self be proud of?'
        ]
    },
    selfCompassion: {
        id: 'selfCompassion',
        name: 'Self-Compassion',
        icon: '💜',
        description: 'Practice kindness toward yourself',
        prompts: [
            'What would you tell a friend who had your day?',
            'What are you being hard on yourself about?',
            'What can you forgive yourself for?',
            'What do you need right now?',
            'How can you be kinder to yourself today?'
        ]
    }
};

// Mood Tags
const moodTagOptions = [
    { id: 'grateful', emoji: '🙏', label: 'Grateful' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'calm', emoji: '😌', label: 'Calm' },
    { id: 'sad', emoji: '😢', label: 'Sad' },
    { id: 'hopeful', emoji: '✨', label: 'Hopeful' },
    { id: 'frustrated', emoji: '😤', label: 'Frustrated' },
    { id: 'proud', emoji: '😊', label: 'Proud' },
    { id: 'tired', emoji: '😴', label: 'Tired' },
    { id: 'excited', emoji: '🎉', label: 'Excited' },
    { id: 'overwhelmed', emoji: '😵', label: 'Overwhelmed' }
];

// Initialize Guided Journal Module
function initializeGuidedJournal() {
    console.log('📔 Initializing Advanced Guided Journal...');
    loadGuidedJournalData();
    setupGuidedJournalUI();
    console.log('✅ Advanced Guided Journal initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadGuidedJournalData() {
    if (MindHaven.userData.journal) {
        GuidedJournal.pathways = MindHaven.userData.journal.pathways || [];
        GuidedJournal.moodTags = MindHaven.userData.journal.moodTags || [];
        GuidedJournal.themes = MindHaven.userData.journal.themes || {};
        GuidedJournal.streaks = MindHaven.userData.journal.streaks || {};
        GuidedJournal.analytics = MindHaven.userData.journal.analytics || {};
    }
}

function saveGuidedJournalData() {
    MindHaven.userData.journal = {
        pathways: GuidedJournal.pathways,
        moodTags: GuidedJournal.moodTags,
        themes: GuidedJournal.themes,
        streaks: GuidedJournal.streaks,
        analytics: GuidedJournal.analytics
    };
    saveUserData();
}

// ============================================
// PATHWAY JOURNALING
// ============================================

function startPathway(pathwayId) {
    const pathway = journalPathways[pathwayId];
    if (!pathway) return;
    
    GuidedJournal.currentPathway = pathwayId;
    
    // Show pathway modal
    showPathwayModal(pathway);
}

function showPathwayModal(pathway) {
    const modal = document.createElement('div');
    modal.className = 'guided-journal-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-icon">${pathway.icon}</span>
                <h2>${pathway.name}</h2>
                <p>${pathway.description}</p>
            </div>
            <div class="pathway-prompts">
                ${pathway.prompts.map((prompt, index) => `
                    <div class="prompt-item" data-index="${index}">
                        <p class="prompt-text">${prompt}</p>
                        <textarea class="prompt-response" rows="3" placeholder="Your response..."></textarea>
                    </div>
                `).join('')}
            </div>
            <div class="mood-tags-section">
                <h3>How are you feeling?</h3>
                <div class="mood-tags-selector">
                    ${moodTagOptions.map(tag => `
                        <button class="mood-tag-btn" data-tag="${tag.id}" onclick="toggleMoodTag('${tag.id}')">
                            ${tag.emoji} ${tag.label}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="modal-actions">
                <button class="secondary-btn" onclick="closePathwayModal()">Cancel</button>
                <button class="primary-btn" onclick="savePathwayEntry()">Save Entry</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function toggleMoodTag(tagId) {
    const btn = document.querySelector(`.mood-tag-btn[data-tag="${tagId}"]`);
    if (!btn) return;
    
    btn.classList.toggle('selected');
}

function savePathwayEntry() {
    if (!GuidedJournal.currentPathway) return;
    
    const pathway = journalPathways[GuidedJournal.currentPathway];
    
    // Collect responses
    const responses = [];
    document.querySelectorAll('.prompt-item').forEach(item => {
        const index = parseInt(item.dataset.index);
        const response = item.querySelector('.prompt-response').value;
        responses.push({
            prompt: pathway.prompts[index],
            response: response
        });
    });
    
    // Collect mood tags
    const selectedTags = [];
    document.querySelectorAll('.mood-tag-btn.selected').forEach(btn => {
        selectedTags.push(btn.dataset.tag);
    });
    
    // Create entry
    const entry = {
        id: generateId(),
        pathway: GuidedJournal.currentPathway,
        pathwayName: pathway.name,
        responses: responses,
        moodTags: selectedTags,
        createdAt: new Date().toISOString()
    };
    
    GuidedJournal.pathways.push(entry);
    
    // Update mood tags
    selectedTags.forEach(tag => {
        GuidedJournal.moodTags.push({
            tag: tag,
            entryId: entry.id,
            timestamp: entry.createdAt
        });
    });
    
    // Update streak
    updateJournalStreak();
    
    saveGuidedJournalData();
    
    closePathwayModal();
    
    // Update journal UI
    if (typeof updateJournalUI === 'function') {
        updateJournalUI();
    }
}

function closePathwayModal() {
    const modal = document.querySelector('.guided-journal-modal');
    if (modal) modal.remove();
    GuidedJournal.currentPathway = null;
}

// ============================================
// JOURNAL ANALYTICS
// ============================================

function updateJournalStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentEntries = GuidedJournal.pathways.filter(entry => {
        const entryDate = new Date(entry.createdAt).toDateString();
        return entryDate === today || entryDate === yesterday.toDateString();
    });
    
    if (recentEntries.some(e => new Date(e.createdAt).toDateString() === today)) {
        if (recentEntries.some(e => new Date(e.createdAt).toDateString() === yesterday.toDateString())) {
            GuidedJournal.streaks.current = (GuidedJournal.streaks.current || 0) + 1;
        } else {
            GuidedJournal.streaks.current = 1;
        }
    }
}

function getJournalAnalytics() {
    const totalEntries = GuidedJournal.pathways.length;
    const pathwayCounts = {};
    const moodCounts = {};
    
    GuidedJournal.pathways.forEach(entry => {
        // Count by pathway
        pathwayCounts[entry.pathway] = (pathwayCounts[entry.pathway] || 0) + 1;
        
        // Count by mood
        entry.moodTags.forEach(tag => {
            moodCounts[tag] = (moodCounts[tag] || 0) + 1;
        });
    });
    
    return {
        totalEntries,
        pathwayCounts,
        moodCounts,
        currentStreak: GuidedJournal.streaks.current || 0,
        longestStreak: GuidedJournal.streaks.longest || 0
    };
}

// ============================================
// UI ENHANCEMENTS
// ============================================

function setupGuidedJournalUI() {
    addPathwaySelectorToJournal();
}

function addPathwaySelectorToJournal() {
    const journalSection = document.getElementById('journal-section');
    if (!journalSection) return;
    
    // Check if already added
    if (document.getElementById('pathwaySelector')) return;
    
    const journalContent = journalSection.querySelector('.section-content');
    if (!journalContent) return;
    
    const selectorDiv = document.createElement('div');
    selectorDiv.id = 'pathwaySelector';
    selectorDiv.className = 'pathway-selector';
    selectorDiv.innerHTML = `
        <h3>Guided Journal Pathways</h3>
        <div class="pathways-grid">
            ${Object.values(journalPathways).map(pathway => `
                <button class="pathway-card" onclick="startPathway('${pathway.id}')">
                    <span class="pathway-icon">${pathway.icon}</span>
                    <span class="pathway-name">${pathway.name}</span>
                    <span class="pathway-desc">${pathway.description}</span>
                </button>
            `).join('')}
        </div>
    `;
    
    // Insert before the existing journal content
    const existingContent = journalContent.querySelector('.journal-container');
    if (existingContent) {
        journalContent.insertBefore(selectorDiv, existingContent);
    } else {
        journalContent.appendChild(selectorDiv);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.startPathway = startPathway;
window.toggleMoodTag = toggleMoodTag;
window.savePathwayEntry = savePathwayEntry;
window.closePathwayModal = closePathwayModal;
window.getJournalAnalytics = getJournalAnalytics;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeGuidedJournal();
});
