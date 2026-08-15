// ============================================
// MINDHAVEN - Smart Search Module
// ============================================

// Search State
const Search = {
    currentQuery: '',
    results: []
};

// Search Index (populated dynamically)
const searchIndex = {
    pages: [
        { id: 'dashboard', title: 'Dashboard', keywords: ['home', 'dashboard', 'check-in', 'mood', 'daily', 'weather'], section: 'dashboard' },
        { id: 'anxiety', title: 'Anxiety Hub', keywords: ['anxiety', 'panic', 'worry', 'fear', 'nervous', 'overthinking'], section: 'mentalhealth', subsection: 'anxiety' },
        { id: 'depression', title: 'Depression Hub', keywords: ['depression', 'sad', 'low', 'hopeless', 'burnout', 'numb'], section: 'mentalhealth', subsection: 'depression' },
        { id: 'loneliness', title: 'Loneliness Hub', keywords: ['loneliness', 'alone', 'isolated', 'connection', 'social'], section: 'mentalhealth', subsection: 'loneliness' },
        { id: 'adhd', title: 'ADHD Hub', keywords: ['adhd', 'focus', 'attention', 'dopamine', 'executive', 'procrastination'], section: 'mentalhealth', subsection: 'adhd' },
        { id: 'ocd', title: 'OCD Hub', keywords: ['ocd', 'obsessive', 'compulsive', 'intrusive', 'uncertainty'], section: 'mentalhealth', subsection: 'ocd' },
        { id: 'stress', title: 'Stress & Burnout', keywords: ['stress', 'burnout', 'overwhelmed', 'pressure', 'exhausted'], section: 'mentalhealth', subsection: 'stress' },
        { id: 'panic-relief', title: 'Panic Relief', keywords: ['panic', 'attack', 'emergency', 'calm', 'breathe'], section: 'coping', subsection: 'panic' },
        { id: 'calm-down', title: 'Calm Down Mode', keywords: ['calm', 'relax', 'peaceful', 'ambience', 'sounds'], section: 'calmspace' },
        { id: 'overthinking', title: 'Overthinking Breaker', keywords: ['overthinking', 'worry', 'thoughts', 'ruminate'], section: 'coping', subsection: 'overthinking' },
        { id: 'low-energy', title: 'Low Energy Mode', keywords: ['low energy', 'depression', 'tired', 'exhausted', 'motivation'], section: 'coping', subsection: 'low-energy' },
        { id: 'loneliness-companion', title: 'Loneliness Companion', keywords: ['loneliness', 'connection', 'reach out', 'social'], section: 'coping', subsection: 'loneliness' },
        { id: 'breathing', title: 'Breathing Guide', keywords: ['breathing', 'breath', 'breathe', 'relax', 'calm'], section: 'coping', subsection: 'breathing' },
        { id: 'grounding', title: 'Grounding Exercise', keywords: ['grounding', '5-4-3-2-1', 'senses', 'present'], section: 'coping', subsection: 'grounding' },
        { id: 'journal', title: 'Journal', keywords: ['journal', 'write', 'reflect', 'diary', 'thoughts'], section: 'journal' },
        { id: 'insights', title: 'Emotional Insights', keywords: ['insights', 'patterns', 'trends', 'analysis'], section: 'insights' },
        { id: 'achievements', title: 'Achievements', keywords: ['achievement', 'progress', 'streak', 'goals'], section: 'achievements' },
        { id: 'crisis', title: 'Crisis Support', keywords: ['crisis', 'emergency', 'help', 'suicide', 'hotline'], section: 'crisis' },
        { id: 'settings', title: 'Settings', keywords: ['settings', 'preferences', 'dark mode', 'theme'], section: 'settings' },
        // NEW: Search entries for new systems
        { id: 'assessment', title: 'Life Assessment Center', keywords: ['assessment', 'life assessment', 'wellness', 'self-evaluation', 'check-up'], section: 'assessment' },
        { id: 'goals', title: 'Goals & Habits', keywords: ['goals', 'habits', 'tracking', 'progress', 'milestones', 'streaks'], section: 'goals' },
        { id: 'decisions', title: 'Decision Support', keywords: ['decision', 'decisions', 'framework', 'pros cons', 'choice'], section: 'decisions' },
        { id: 'student', title: 'Student Support Hub', keywords: ['student', 'study', 'academic', 'exam', 'burnout', 'school'], section: 'student' },
        { id: 'supportcircle', title: 'Support Circle', keywords: ['support', 'circle', 'contacts', 'network', 'friends', 'family'], section: 'supportcircle' },
        { id: 'safetyplan', title: 'Safety Plan', keywords: ['safety plan', 'crisis plan', 'emergency plan', 'warning signs', 'coping'], section: 'safetyplan' }
    ]
};

// Initialize Search Module
function initializeSearch() {
    console.log('🔎 Initializing Search module...');
    console.log('✅ Search module initialized');
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function performSearch(query) {
    Search.currentQuery = query.trim();
    Search.results = [];
    
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (!Search.currentQuery) {
        resultsContainer.innerHTML = '<p class="empty-state">Start typing to search...</p>';
        return;
    }
    
    // Search pages
    const pageResults = searchPages(Search.currentQuery);
    
    // Search mental health content
    const contentResults = searchMentalHealthContent(Search.currentQuery);
    
    // Search journal entries
    const journalResults = searchJournalEntries(Search.currentQuery);
    
    // Combine results
    Search.results = [...pageResults, ...contentResults, ...journalResults];
    
    // Display results
    displaySearchResults();
}

function searchPages(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    // Check for typos using simple fuzzy matching
    searchIndex.pages.forEach(page => {
        const titleMatch = page.title.toLowerCase().includes(lowerQuery);
        const keywordMatch = page.keywords.some(keyword => 
            keyword.toLowerCase().includes(lowerQuery) ||
            fuzzyMatch(keyword.toLowerCase(), lowerQuery)
        );
        
        if (titleMatch || keywordMatch) {
            results.push({
                type: 'page',
                title: page.title,
                section: page.section,
                subsection: page.subsection,
                relevance: titleMatch ? 1 : 0.8
            });
        }
    });
    
    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
}

function fuzzyMatch(str, pattern) {
    // Simple fuzzy matching - checks if pattern characters exist in str in order
    let patternIndex = 0;
    let strIndex = 0;
    
    while (patternIndex < pattern.length && strIndex < str.length) {
        if (pattern[patternIndex] === str[strIndex]) {
            patternIndex++;
        }
        strIndex++;
    }
    
    return patternIndex === pattern.length;
}

// ============================================
// DISPLAY SEARCH RESULTS
// ============================================

function displaySearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (Search.results.length === 0) {
        resultsContainer.innerHTML = '<p class="empty-state">No results found. Try different keywords.</p>';
        return;
    }
    
    let html = '';
    
    // Group results by type
    const groupedResults = {
        page: Search.results.filter(r => r.type === 'page'),
        content: Search.results.filter(r => r.type === 'section' || r.type === 'topic'),
        journal: Search.results.filter(r => r.type === 'journal')
    };
    
    // Display page results
    if (groupedResults.page.length > 0) {
        html += '<h3>Pages</h3>';
        groupedResults.page.forEach(result => {
            html += `
                <div class="search-result-item" onclick="navigateTo('${result.section}'${result.subsection ? `, '${result.subsection}'` : ''})">
                    <span class="result-icon">📄</span>
                    <div class="result-info">
                        <h4>${result.title}</h4>
                        <p class="result-section">${result.section}${result.subsection ? ' → ' + result.subsection : ''}</p>
                    </div>
                </div>
            `;
        });
    }
    
    // Display content results
    if (groupedResults.content.length > 0) {
        html += '<h3>Mental Health Topics</h3>';
        groupedResults.content.forEach(result => {
            html += `
                <div class="search-result-item" onclick="navigateTo('mentalhealth', '${result.topicId}')">
                    <span class="result-icon">${result.icon || '📚'}</span>
                    <div class="result-info">
                        <h4>${result.title}</h4>
                        <p class="result-section">${result.topicId}</p>
                    </div>
                </div>
            `;
        });
    }
    
    // Display journal results
    if (groupedResults.journal.length > 0) {
        html += '<h3>Journal Entries</h3>';
        groupedResults.journal.forEach(result => {
            const date = new Date(result.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            const preview = result.content.length > 50 ? result.content.substring(0, 50) + '...' : result.content;
            
            html += `
                <div class="search-result-item" onclick="navigateTo('journal'); setTimeout(() => viewJournalEntry('${result.id}'), 100);">
                    <span class="result-icon">📔</span>
                    <div class="result-info">
                        <h4>${date}</h4>
                        <p class="result-preview">${preview}</p>
                    </div>
                </div>
            `;
        });
    }
    
    resultsContainer.innerHTML = html;
}

// ============================================
// QUICK SEARCH
// ============================================

function searchFor(term) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = term;
        performSearch(term);
    }
}

// ============================================
// SEARCH SUGGESTIONS
// ============================================

function getSearchSuggestions(query) {
    const suggestions = [];
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.length < 2) return suggestions;
    
    searchIndex.pages.forEach(page => {
        page.keywords.forEach(keyword => {
            if (keyword.toLowerCase().startsWith(lowerQuery)) {
                if (!suggestions.includes(keyword)) {
                    suggestions.push(keyword);
                }
            }
        });
    });
    
    return suggestions.slice(0, 5);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.performSearch = performSearch;
window.searchFor = searchFor;
window.getSearchSuggestions = getSearchSuggestions;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
});
