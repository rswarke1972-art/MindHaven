// ============================================
// MINDHAVEN - Private Journal Module
// ============================================

// Journal State
const Journal = {
    currentPrompt: '',
    prompts: [
        "What feels heavy today?",
        "What helped today?",
        "What am I afraid of right now?",
        "What do I wish someone understood?",
        "What's one thing I'm grateful for?",
        "What would make today a little better?",
        "What do I need right now?",
        "What's a small win from today?",
        "What am I looking forward to?",
        "What would I tell my younger self?",
        "What boundaries do I need to set?",
        "What's something that made me smile?",
        "What do I need to let go of?",
        "What's a gentle way I can care for myself today?",
        "What would help me feel more grounded?",
        "What emotion feels most present right now?",
        "What's something I'm proud of myself for?",
        "What would I like to remember about today?",
        "What's a challenge I'm facing?",
        "What support do I need right now?",
        "What's something I learned recently?",
        "What's a memory that brings me comfort?",
        "What's something I want to forgive myself for?",
        "What would my ideal day look like?",
        "What's something I'm curious about?",
        "What's a quality I appreciate in myself?",
        "What's something that's been on my mind?",
        "What would help me feel more connected?",
        "What's a belief I want to challenge?",
        "What's something I want to create space for?",
        "What's a gentle step I can take today?",
        "What's something I want to celebrate?",
        "What's a fear I want to acknowledge?",
        "What's something that brings me peace?",
        "What's a hope I want to hold onto?",
        "What's something I want to be patient with?",
        "What's a way I can be kind to myself today?",
        "What's something I want to understand better?",
        "What's a boundary I want to honor?",
        "What's something I want to release?",
        "What's a moment of joy I experienced recently?",
        "What's something I want to nurture in myself?",
        "What's a thought I want to explore?",
        "What's something I want to accept?",
        "What's a way I can show myself love today?",
        "What's something I want to forgive?",
        "What's a strength I want to acknowledge?",
        "What's something I want to invite into my life?",
        "What's a comfort I can offer myself?",
        "What's something I want to let be?",
        "What's a gentle reminder I need to hear?",
        "What's something I want to appreciate about my journey?",
        "What's a way I can honor my feelings?",
        "What's something I want to trust about myself?",
        "What's a moment of growth I want to acknowledge?",
        "What's something I want to be curious about?",
        "What's a way I can practice self-compassion?",
        "What's something I want to celebrate about my resilience?",
        "What's a hope I want to hold space for?",
        "What's something I want to be gentle with?",
        "What's a way I can connect with my inner wisdom?",
        "What's something I want to acknowledge about my needs?",
        "What's a moment of clarity I experienced?",
        "What's something I want to validate about my experience?",
        "What's a way I can honor my body today?",
        "What's something I want to appreciate about my mind?",
        "What's a gentle truth I want to remember?",
        "What's something I want to make peace with?",
        "What's a way I can nurture my spirit?",
        "What's something I want to recognize about my capacity?",
        "What's a moment of grace I experienced?",
        "What's something I want to be patient with in myself?",
        "What's a way I can honor my unique path?",
        "What's something I want to celebrate about my courage?",
        "What's a hope I want to nurture?",
        "What's something I want to trust about the future?",
        "What's a gentle way I can support myself today?",
        "What's something I want to acknowledge about my growth?",
        "What's a way I can practice self-acceptance?",
        "What's something I want to appreciate about my humanity?",
        "What's a moment of connection I experienced?",
        "What's something I want to validate about my feelings?",
        "What's a gentle reminder I want to give myself?",
        "What's something I want to make space for?",
        "What's a way I can practice self-care today?",
        "What's something I want to appreciate about my journey?",
        "What's a moment of insight I had?",
        "What's something I want to trust about myself?",
        "What's a gentle step I can take toward healing?",
        "What's something I want to celebrate about my authenticity?",
        "What's a hope I want to hold in my heart?",
        "What's something I want to be patient with in my life?",
        "What's a way I can honor my authentic self?",
        "What's something I want to acknowledge about my courage?",
        "What's a moment of connection I want to remember?",
        "What's something I want to validate about my needs?",
        "What's a gentle reminder I want to hold close?",
        "What's something I want to make space for in my life?",
        "What's a way I can practice self-compassion today?",
        "What's something I want to appreciate about my growth?",
        "What's a moment of insight I want to explore?",
        "What's something I want to trust about my ability to cope?",
        "What's a gentle step I can take toward peace?",
        "What's something I want to celebrate about my journey?",
        "What's a hope I want to hold in my heart?",
        "What's something I want to be gentle with today?",
        "What's a way I can honor my feelings with kindness?",
        "What's something I want to acknowledge about my worthiness?",
        "What's a moment of joy I want to remember?",
        "What's something I want to validate about my experience?",
        "What's a gentle truth I want to believe about myself?",
        "What's a way I can support my mental wellbeing?",
        "What's something I want to appreciate about my capacity to grow?",
        "What's a moment of resilience I want to acknowledge?",
        "What's something I want to trust about my healing journey?",
        "What's a gentle reminder I want to carry forward?",
        "What's something I want to make peace with in my past?",
        "What's a way I can care for my emotional needs?",
        "What's something I want to appreciate about my unique perspective?",
        "What's a moment of learning I want to celebrate?",
        "What's something I want to trust about my future?",
        "What's a gentle step I can take toward self-acceptance?",
        "What's something I want to celebrate about my authenticity?",
        "What's a hope I want to hold for myself?",
        "What's something I want to be kind to myself about?",
        "What's a way I can honor my boundaries with love?",
        "What's something I want to acknowledge about my strength?",
        "What's a moment of peace I experienced recently?",
        "What's something I want to validate about my emotions?",
        "What's a gentle truth I want to remember?",
        "What's a way I can nurture my emotional wellbeing?",
        "What's something I want to appreciate about my ability to feel?",
        "What's a moment of growth I want to recognize?",
        "What's something I want to trust about my ability to change?",
        "What's a gentle reminder I want to live by?",
        "What's something I want to make peace with in my mind?",
        "What's a way I can practice radical self-acceptance?",
        "What's something I want to appreciate about my unique gifts?",
        "What's a moment of breakthrough I want to acknowledge?",
        "What's something I want to trust about the unfolding of my life?",
        "What's a gentle step I can take toward freedom?",
        "What's something I want to celebrate about my courage to heal?",
        "What's a hope I want to hold for my wellbeing?",
        "What's something I want to be kind to myself about today?",
        "What's a way I can honor my truth with compassion?",
        "What's something I want to acknowledge about my inner strength?",
        "What's a moment of love I experienced?",
        "What's something I want to validate about my capacity to feel deeply?",
        "What's a gentle truth I want to integrate?",
        "What's a way I can nurture my soul today?",
        "What's something I want to appreciate about my ability to transform?",
        "What's a moment of awakening I had?",
        "What's something I want to trust about my purpose?",
        "What's a gentle step I can take toward fulfillment?",
        "What's something I want to celebrate about my journey of becoming?",
        "What's a hope I want to hold in my consciousness?",
        "What's something I want to be patient with in my unfolding?",
        "What's a way I can honor my essence with love?",
        "What's something I want to acknowledge about my divine nature?",
        "What's a moment of bliss I want to remember?",
        "What's something I want to validate about my connection to all?",
        "What's a gentle truth I want to live from?",
        "What's a way I can support my highest self?",
        "What's something I want to appreciate about my infinite potential?",
        "What's a moment of enlightenment I experienced?",
        "What's something I want to trust about the universe?",
        "What's a gentle step I can take toward unity?",
        "What's something I want to celebrate about my existence?",
        "What's a hope I want to hold for all beings?",
        "What's something I want to be gentle with in my consciousness?",
        "What's a way I can honor my oneness with all?",
        "What's something I want to acknowledge about my eternal nature?",
        "What's a moment of transcendence I felt?",
        "What's something I want to trust about the divine plan?",
        "What's a gentle step I can take toward awakening?",
        "What's something I want to celebrate about my spiritual journey?",
        "What's a hope I want to hold for the world?",
        "What's something I want to be gentle with in my spiritual practice?",
        "What's a way I can honor my sacredness?",
        "What's something I want to acknowledge about my connection to source?",
        "What's a moment of divine love I experienced?",
        "What's something I want to validate about my spiritual path?",
        "What's a gentle truth I want to realize?",
        "What's a way I can support my spiritual evolution?",
        "What's something I want to appreciate about my soul's journey?",
        "What's a moment of communion I had?",
        "What's something I want to trust about divine timing?",
        "What's a gentle step I can take toward complete acceptance?",
        "What's something I want to celebrate about my being?",
        "What's a hope I want to hold for eternity?",
        "What's something I want to be gentle with in my existence?",
        "What's a way I can honor my truth?",
        "What's something I want to acknowledge about my reality?",
        "What's a moment of pure being I experienced?",
        "What's something I want to trust about the nature of existence?",
        "What's a gentle step I can take toward liberation?",
        "What's something I want to celebrate about my consciousness?",
        "What's a hope I want to hold for all consciousness?",
        "What's something I want to be gentle with in my awareness?",
        "What's a way I can honor my presence?",
        "What's something I want to acknowledge about my awareness?",
        "What's a moment of pure awareness I experienced?",
        "What's something I want to trust about the nature of awareness?",
        "What's a gentle step I can take toward realization?",
        "What's something I want to celebrate about my awakening?",
        "What's a hope I want to hold for all souls?",
        "What's something I want to be gentle with in my realization?",
        "What's a way I can honor my awakening?",
        "What's something I want to acknowledge about my enlightenment?",
        "What's a moment of pure consciousness I experienced?",
        "What's something I want to trust about the ultimate reality?",
        "What's a gentle step I can take toward complete awakening?",
        "What's something I want to celebrate about my journey home?",
        "What's a hope I want to hold for all journeys?",
        "What's something I want to be gentle with in my homecoming?",
        "What's a way I can honor my return to source?",
        "What's something I want to acknowledge about my eternal home?",
        "What's a moment of homecoming I experienced?",
        "What's something I want to trust about the journey home?",
        "What's a gentle step I can take toward complete homecoming?",
        "What's something I want to celebrate about my return?",
        "What's a hope I want to hold for all returns?",
        "What's something I want to be gentle with in my return?",
        "What's a way I can honor my completion?",
        "What's something I want to acknowledge about my fulfillment?",
        "What's a moment of completion I experienced?",
        "What's something I want to trust about the perfection of completion?",
        "What's a gentle step I can take toward wholeness?",
        "What's something I want to celebrate about my wholeness?",
        "What's a hope I want to hold for all wholeness?",
        "What's something I want to be gentle with in my wholeness?",
        "What's a way I can honor my completeness?",
        "What's something I want to acknowledge about my perfection?",
        "What's a moment of perfection I experienced?",
        "What's something I want to trust about the perfection of all?",
        "What's a gentle step I can take toward complete trust?",
        "What's something I want to celebrate about my divine trust?",
        "What's a hope I want to hold for all trust?",
        "What's something I want to be gentle with in my trust?",
        "What's a way I can honor my complete trust?",
        "What's something I want to acknowledge about my eternal trust?",
        "What's a moment of complete trust I experienced?",
        "What's something I want to trust about the perfection of trust?",
        "What's a gentle step I can take toward complete surrender?",
        "What's something I want to celebrate about my surrender?",
        "What's a hope I want to hold for all surrender?",
        "What's something I want to be gentle with in my surrender?",
        "What's a way I can honor my complete surrender?",
        "What's something I want to acknowledge about my eternal surrender?",
        "What's a moment of complete surrender I experienced?",
        "What's something I want to trust about the perfection of surrender?",
        "What's a gentle step I can take toward complete love?",
        "What's something I want to celebrate about my love?",
        "What's a hope I want to hold for all love?",
        "What's something I want to be gentle with in my love?",
        "What's a way I can honor my complete love?",
        "What's something I want to acknowledge about my eternal love?",
        "What's a moment of complete love I experienced?",
        "What's something I want to trust about the perfection of love?",
        "What's a gentle step I can take toward complete peace?",
        "What's something I want to celebrate about my peace?",
        "What's a hope I want to hold for all peace?",
        "What's something I want to be gentle with in my peace?",
        "What's a way I can honor my complete peace?",
        "What's something I want to acknowledge about my eternal peace?",
        "What's a moment of complete peace I experienced?",
        "What's something I want to trust about the perfection of peace?",
        "What's a gentle step I can take toward complete joy?",
        "What's something I want to celebrate about my joy?",
        "What's a hope I want to hold for all joy?",
        "What's something I want to be gentle with in my joy?",
        "What's a way I can honor my complete joy?",
        "What's something I want to acknowledge about my eternal joy?",
        "What's a moment of complete joy I experienced?",
        "What's something I want to trust about the perfection of joy?"
    ]
};

// Initialize Journal Module
function initializeJournal() {
    console.log('📔 Initializing Journal module...');
    loadJournalHistory();
    setJournalPrompt();
    console.log('✅ Journal module initialized');
}

// ============================================
// JOURNAL PROMPTS
// ============================================

function setJournalPrompt() {
    const promptElement = document.getElementById('journalPrompt');
    if (!promptElement) return;
    
    // Get a random prompt
    const randomIndex = Math.floor(Math.random() * Journal.prompts.length);
    Journal.currentPrompt = Journal.prompts[randomIndex];
    promptElement.textContent = Journal.currentPrompt;
}

function getNewPrompt() {
    const promptElement = document.getElementById('journalPrompt');
    if (!promptElement) return;
    
    // Get a different random prompt
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * Journal.prompts.length);
    } while (Journal.prompts[newIndex] === Journal.currentPrompt && Journal.prompts.length > 1);
    
    Journal.currentPrompt = Journal.prompts[newIndex];
    promptElement.textContent = Journal.currentPrompt;
}

// ============================================
// JOURNAL ENTRIES
// ============================================

function saveJournalEntry() {
    const journalEntry = document.getElementById('journalEntry');
    if (!journalEntry) return;
    
    const content = journalEntry.value.trim();
    if (!content) {
        showGentleMessage('Please write something in your journal');
        return;
    }
    
    const entry = {
        id: generateId(),
        date: new Date().toISOString(),
        prompt: Journal.currentPrompt,
        content: content,
        mood: Dashboard.selectedMoods.length > 0 ? Dashboard.selectedMoods : null
    };
    
    // Add to user data
    MindHaven.userData.journalEntries.push(entry);
    MindHaven.userData.stats.journalEntries++;
    saveUserData();
    
    // Clear the textarea
    journalEntry.value = '';
    
    // Show confirmation
    showGentleMessage('Journal entry saved. Your thoughts are safe here.');
    
    // Refresh history
    loadJournalHistory();
    
    // Check for first reflection achievement
    if (MindHaven.userData.stats.journalEntries === 1) {
        unlockAchievement('first-reflection');
    }
    
    // Update insights
    if (typeof updateInsights === 'function') {
        updateInsights();
    }
}

function loadJournalHistory() {
    const historyContainer = document.getElementById('journalHistory');
    if (!historyContainer) return;
    
    const entries = MindHaven.userData.journalEntries || [];
    
    if (entries.length === 0) {
        historyContainer.innerHTML = '<p class="empty-state">No entries yet. Start writing whenever you\'re ready.</p>';
        return;
    }
    
    // Sort by date descending
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Show last 10 entries
    const recentEntries = sortedEntries.slice(0, 10);
    
    let html = '';
    recentEntries.forEach(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const preview = entry.content.length > 100 
            ? entry.content.substring(0, 100) + '...' 
            : entry.content;
        
        html += `
            <div class="journal-entry-item" onclick="viewJournalEntry('${entry.id}')">
                <div class="journal-entry-date">${formattedDate}</div>
                <div class="journal-entry-prompt">${entry.prompt || 'Free writing'}</div>
                <div class="journal-entry-preview">${preview}</div>
            </div>
        `;
    });
    
    historyContainer.innerHTML = html;
}

function viewJournalEntry(entryId) {
    const entry = MindHaven.userData.journalEntries.find(e => e.id === entryId);
    if (!entry) return;
    
    const historyContainer = document.getElementById('journalHistory');
    if (!historyContainer) return;
    
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    historyContainer.innerHTML = `
        <div class="journal-entry-full">
            <div class="journal-entry-header">
                <h3>${formattedDate}</h3>
                <button class="secondary-btn" onclick="loadJournalHistory()">Back to History</button>
            </div>
            ${entry.prompt ? `<p class="journal-entry-prompt-full">Prompt: ${entry.prompt}</p>` : ''}
            <div class="journal-entry-content-full">${entry.content}</div>
            <div class="journal-entry-actions">
                <button class="danger-btn" onclick="deleteJournalEntry('${entry.id}')">Delete Entry</button>
            </div>
        </div>
    `;
}

function deleteJournalEntry(entryId) {
    if (!confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
        return;
    }
    
    MindHaven.userData.journalEntries = MindHaven.userData.journalEntries.filter(e => e.id !== entryId);
    MindHaven.userData.stats.journalEntries = Math.max(0, MindHaven.userData.stats.journalEntries - 1);
    saveUserData();
    
    showGentleMessage('Entry deleted.');
    loadJournalHistory();
}

// ============================================
// JOURNAL SEARCH
// ============================================

function searchJournalEntries(query) {
    const entries = MindHaven.userData.journalEntries || [];
    const lowerQuery = query.toLowerCase();
    
    return entries.filter(entry => {
        return entry.content.toLowerCase().includes(lowerQuery) ||
               (entry.prompt && entry.prompt.toLowerCase().includes(lowerQuery));
    });
}

// ============================================
// JOURNAL STATS
// ============================================

function getJournalStats() {
    const entries = MindHaven.userData.journalEntries || [];
    
    if (entries.length === 0) {
        return {
            totalEntries: 0,
            thisWeek: 0,
            thisMonth: 0,
            longestStreak: 0
        };
    }
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeek = entries.filter(e => new Date(e.date) >= weekAgo).length;
    const thisMonth = entries.filter(e => new Date(e.date) >= monthAgo).length;
    
    // Calculate streak
    let longestStreak = 0;
    let currentStreak = 0;
    
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let lastDate = null;
    sortedEntries.forEach(entry => {
        const entryDate = new Date(entry.date).toDateString();
        
        if (lastDate === null) {
            currentStreak = 1;
        } else {
            const lastDateObj = new Date(lastDate);
            const entryDateObj = new Date(entryDate);
            const diffDays = Math.floor((entryDateObj - lastDateObj) / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 1) {
                currentStreak++;
            } else {
                if (currentStreak > longestStreak) {
                    longestStreak = currentStreak;
                }
                currentStreak = 1;
            }
        }
        
        lastDate = entryDate;
    });
    
    if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
    }
    
    return {
        totalEntries: entries.length,
        thisWeek: thisWeek,
        thisMonth: thisMonth,
        longestStreak: longestStreak
    };
}

// ============================================
// MOOD ANALYSIS FROM JOURNAL
// ============================================

function analyzeJournalMoods() {
    const entries = MindHaven.userData.journalEntries || [];
    
    if (entries.length === 0) {
        return null;
    }
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'love', 'grateful', 'thankful', 'peaceful', 'calm', 'joy', 'excited', 'proud'];
    const negativeWords = ['sad', 'anxious', 'worried', 'scared', 'angry', 'frustrated', 'tired', 'exhausted', 'overwhelmed', 'stressed', 'lonely', 'hopeless'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    entries.forEach(entry => {
        const content = entry.content.toLowerCase();
        
        positiveWords.forEach(word => {
            if (content.includes(word)) positiveCount++;
        });
        
        negativeWords.forEach(word => {
            if (content.includes(word)) negativeCount++;
        });
    });
    
    const total = positiveCount + negativeCount;
    if (total === 0) return 'neutral';
    
    const positiveRatio = positiveCount / total;
    
    if (positiveRatio > 0.6) return 'generally-positive';
    if (positiveRatio < 0.4) return 'generally-negative';
    return 'mixed';
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.saveJournalEntry = saveJournalEntry;
window.getNewPrompt = getNewPrompt;
window.viewJournalEntry = viewJournalEntry;
window.deleteJournalEntry = deleteJournalEntry;
window.searchJournalEntries = searchJournalEntries;
window.getJournalStats = getJournalStats;
window.analyzeJournalMoods = analyzeJournalMoods;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeJournal();
});
