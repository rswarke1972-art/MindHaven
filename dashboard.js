// ============================================
// MINDHAVEN - Dashboard Module
// ============================================

// Dashboard State
const Dashboard = {
    selectedMoods: [],
    selectedTags: [],
    moodIntensity: 5,
    emotionalWeather: {
        stress: '-',
        energy: '-',
        mood: '-',
        sleep: '-'
    }
};

// Daily Encouragement Messages
const encouragementMessages = [
    "Getting through today is enough.",
    "You do not need to solve everything today.",
    "Small steps still count.",
    "Your feelings are valid.",
    "It's okay to rest.",
    "You are not alone in this.",
    "Tomorrow is a new beginning.",
    "Be gentle with yourself.",
    "Progress, not perfection.",
    "You're doing better than you think.",
    "One breath at a time.",
    "You have gotten through difficult days before.",
    "This feeling is temporary.",
    "You deserve rest without guilt.",
    "Your worth is not measured by productivity.",
    "It is okay to not be okay right now.",
    "You are worthy of care and support.",
    "Taking breaks is productive.",
    "You are stronger than you know.",
    "This moment will pass.",
    "You are allowed to have bad days.",
    "Your struggles do not define you.",
    "Healing is not linear.",
    "You are doing the best you can.",
    "It is okay to ask for help.",
    "You deserve kindness, especially from yourself.",
    "Rest is not laziness.",
    "You are enough, exactly as you are.",
    "Your feelings matter.",
    "You do not have to have it all figured out.",
    "It is okay to take things one moment at a time.",
    "You are worthy of love and belonging.",
    "Your mental health matters.",
    "You are not a burden.",
    "It is okay to set boundaries.",
    "You deserve peace.",
    "You are allowed to feel what you feel.",
    "You are not behind in life.",
    "You are on your own timeline.",
    "You are allowed to say no.",
    "You deserve to feel safe.",
    "You are allowed to prioritize yourself.",
    "You are worthy of happiness.",
    "It is okay to take time for yourself.",
    "You are not defined by your productivity.",
    "You are allowed to be imperfect.",
    "You deserve compassion.",
    "You are allowed to make mistakes.",
    "You are worthy of forgiveness.",
    "It is okay to feel overwhelmed.",
    "You are allowed to feel lost sometimes.",
    "You are worthy of guidance.",
    "It is okay to feel uncertain.",
    "You are allowed to feel afraid.",
    "You are worthy of courage.",
    "It is okay to feel sad.",
    "You are allowed to feel angry.",
    "You are worthy of understanding.",
    "It is okay to feel tired.",
    "You are allowed to feel exhausted.",
    "You are worthy of rest.",
    "It is okay to feel anxious.",
    "You are allowed to feel worried.",
    "You are worthy of peace.",
    "It is okay to feel happy.",
    "You are allowed to feel joy.",
    "You are worthy of celebration.",
    "It is okay to feel excited.",
    "You are allowed to feel hopeful.",
    "You are worthy of optimism.",
    "It is okay to feel grateful.",
    "You are allowed to feel thankful.",
    "You are worthy of appreciation.",
    "It is okay to feel loved.",
    "You are allowed to feel loving.",
    "You are worthy of connection.",
    "It is okay to feel peaceful.",
    "You are allowed to feel calm.",
    "You are worthy of tranquility.",
    "It is okay to feel strong.",
    "You are allowed to feel powerful.",
    "You are worthy of confidence.",
    "It is okay to feel weak.",
    "You are allowed to feel vulnerable.",
    "You are worthy of support.",
    "It is okay to feel human.",
    "You are allowed to feel real.",
    "You are worthy of authenticity.",
    "It is okay to be yourself.",
    "You are allowed to grow.",
    "You are worthy of evolution.",
    "It is okay to change.",
    "You are allowed to transform.",
    "You are worthy of becoming.",
    "It is okay to be in process.",
    "You are allowed to be unfinished.",
    "You are worthy of patience.",
    "It is okay to take your time.",
    "You are allowed to go at your own pace.",
    "You are worthy of grace.",
    "It is okay to be gentle.",
    "You are allowed to be kind.",
    "You are worthy of tenderness.",
    "It is okay to be soft.",
    "You are allowed to be sensitive.",
    "You are worthy of protection.",
    "It is okay to be careful.",
    "You are allowed to be cautious.",
    "You are worthy of safety.",
    "It is okay to be brave.",
    "You are allowed to be courageous.",
    "You are worthy of adventure.",
    "It is okay to explore.",
    "You are allowed to discover.",
    "You are worthy of wonder.",
    "It is okay to be curious.",
    "You are allowed to learn.",
    "You are worthy of wisdom.",
    "It is okay to be wise.",
    "You are allowed to know.",
    "You are worthy of understanding.",
    "It is okay to be understood.",
    "You are allowed to be seen.",
    "You are worthy of recognition.",
    "It is okay to be acknowledged.",
    "You are allowed to be validated.",
    "You are worthy of affirmation.",
    "It is okay to be celebrated.",
    "You are allowed to be appreciated.",
    "You are worthy of gratitude.",
    "It is okay to be thankful.",
    "You are allowed to be blessed.",
    "You are worthy of abundance.",
    "It is okay to have enough.",
    "You are allowed to receive.",
    "You are worthy of generosity.",
    "It is okay to be generous.",
    "You are allowed to give.",
    "You are worthy of contribution.",
    "It is okay to matter.",
    "You are allowed to make a difference.",
    "You are worthy of impact.",
    "It is okay to be significant.",
    "You are allowed to be important.",
    "You are worthy of value.",
    "It is okay to be valuable.",
    "You are allowed to be precious.",
    "You are worthy of love.",
    "It is okay to be loved.",
    "You are allowed to love.",
    "You are worthy of belonging.",
    "It is okay to belong.",
    "You are allowed to fit in.",
    "You are worthy of acceptance.",
    "It is okay to be accepted.",
    "You are allowed to be included.",
    "You are worthy of inclusion.",
    "It is okay to be part of something.",
    "You are allowed to contribute.",
    "You are worthy of participation.",
    "It is okay to be involved.",
    "You are allowed to engage.",
    "You are worthy of engagement.",
    "It is okay to be present.",
    "You are allowed to be here.",
    "You are worthy of presence.",
    "It is okay to be alive.",
    "You are allowed to live.",
    "You are worthy of life.",
    "It is okay to be you.",
    "You are allowed to exist.",
    "You are worthy of existence.",
    "It is okay to be real.",
    "You are allowed to be authentic.",
    "You are worthy of truth.",
    "It is okay to be honest.",
    "You are allowed to be sincere.",
    "You are worthy of integrity.",
    "It is okay to be whole.",
    "You are allowed to be complete.",
    "You are worthy of completeness.",
    "It is okay to be enough.",
    "You are allowed to be sufficient.",
    "You are worthy of sufficiency.",
    "It is okay to be worthy.",
    "You are allowed to deserve.",
    "You are worthy of deserving.",
    "It is okay to be deserving.",
    "You are allowed to merit.",
    "You are worthy of merit.",
    "It is okay to earn.",
    "You are allowed to achieve.",
    "You are worthy of achievement.",
    "It is okay to succeed.",
    "You are allowed to accomplish.",
    "You are worthy of accomplishment.",
    "It is okay to complete.",
    "You are allowed to finish.",
    "You are worthy of completion.",
    "It is okay to be done.",
    "You are allowed to move on.",
    "You are worthy of transition.",
    "It is okay to change.",
    "You are allowed to evolve.",
    "You are worthy of evolution.",
    "It is okay to grow.",
    "You are allowed to develop.",
    "You are worthy of development.",
    "It is okay to mature.",
    "You are allowed to ripen.",
    "You are worthy of ripening.",
    "It is okay to blossom.",
    "You are allowed to flower.",
    "You are worthy of flowering.",
    "It is okay to bloom.",
    "You are allowed to shine.",
    "You are worthy of radiance.",
    "It is okay to glow.",
    "You are allowed to sparkle.",
    "You are worthy of brilliance.",
    "It is okay to be bright.",
    "You are allowed to illuminate.",
    "You are worthy of illumination.",
    "It is okay to light up.",
    "You are allowed to inspire.",
    "You are worthy of inspiration.",
    "It is okay to uplift.",
    "You are allowed to encourage.",
    "You are worthy of encouragement.",
    "It is okay to support.",
    "You are allowed to help.",
    "You are worthy of help.",
    "It is okay to be helped.",
    "You are allowed to receive help.",
    "You are worthy of receiving.",
    "It is okay to take.",
    "You are allowed to accept.",
    "You are worthy of acceptance.",
    "It is okay to embrace.",
    "You are allowed to welcome.",
    "You are worthy of welcome.",
    "It is okay to invite.",
    "You are allowed to include.",
    "You are worthy of inclusion.",
    "It is okay to connect.",
    "You are allowed to relate.",
    "You are worthy of relationship.",
    "It is okay to bond.",
    "You are allowed to attach.",
    "You are worthy of attachment.",
    "It is okay to love deeply.",
    "You are allowed to care deeply.",
    "You are worthy of deep care.",
    "It is okay to feel intensely.",
    "You are allowed to experience fully.",
    "You are worthy of full experience.",
    "It is okay to be alive fully.",
    "You are allowed to live fully.",
    "You are worthy of full life.",
    "It is okay to be human completely.",
    "You are allowed to be real entirely.",
    "You are worthy of complete authenticity.",
    "It is okay to be yourself wholly.",
    "You are allowed to be you completely.",
    "You are worthy of complete selfhood.",
    "It is okay to be you.",
    "You are allowed to exist as you are.",
    "You are worthy of your existence.",
    "It is okay to be here.",
    "You are allowed to be present.",
    "You are worthy of your presence.",
    "It is okay to be now.",
    "You are allowed to be in this moment.",
    "You are worthy of this moment.",
    "It is okay to be alive now.",
    "You are allowed to live now.",
    "You are worthy of living now.",
    "It is okay to be present now.",
    "You are allowed to be here now.",
    "You are worthy of being here now.",
    "It is okay to be you now.",
    "You are allowed to be yourself now.",
    "You are worthy of being yourself now.",
    "It is okay to be authentic now.",
    "You are allowed to be real now.",
    "You are worthy of being real now.",
    "It is okay to be true now.",
    "You are allowed to be honest now.",
    "You are worthy of being honest now.",
    "It is okay to be genuine now.",
    "You are allowed to be sincere now.",
    "You are worthy of being sincere now.",
    "It is okay to be whole now.",
    "You are allowed to be complete now.",
    "You are worthy of being complete now.",
    "It is okay to be enough now.",
    "You are allowed to be sufficient now.",
    "You are worthy of being sufficient now.",
    "It is okay to be worthy now.",
    "You are allowed to deserve now.",
    "You are worthy of deserving now.",
    "It is okay to be deserving now.",
    "You are allowed to merit now.",
    "You are worthy of meriting now.",
    "It is okay to earn now.",
    "You are allowed to achieve now.",
    "You are worthy of achieving now.",
    "It is okay to succeed now.",
    "You are allowed to accomplish now.",
    "You are worthy of accomplishing now.",
    "It is okay to complete now.",
    "You are allowed to finish now.",
    "You are worthy of finishing now.",
    "It is okay to be done now.",
    "You are allowed to move on now.",
    "You are worthy of moving on now.",
    "It is okay to transition now.",
    "You are allowed to change now.",
    "You are worthy of changing now.",
    "It is okay to evolve now.",
    "You are allowed to grow now.",
    "You are worthy of growing now.",
    "It is okay to develop now.",
    "You are allowed to mature now.",
    "You are worthy of maturing now.",
    "It is okay to ripen now.",
    "You are allowed to blossom now.",
    "You are worthy of blossoming now.",
    "It is okay to flower now.",
    "You are allowed to bloom now.",
    "You are worthy of blooming now.",
    "It is okay to shine now.",
    "You are allowed to radiate now.",
    "You are worthy of radiating now.",
    "It is okay to glow now.",
    "You are allowed to sparkle now.",
    "You are worthy of sparkling now.",
    "It is okay to be bright now.",
    "You are allowed to illuminate now.",
    "You are worthy of illuminating now.",
    "It is okay to light up now.",
    "You are allowed to inspire now.",
    "You are worthy of inspiring now.",
    "It is okay to uplift now.",
    "You are allowed to encourage now.",
    "You are worthy of encouraging now.",
    "It is okay to support now.",
    "You are allowed to help now.",
    "You are worthy of helping now.",
    "It is okay to be helped now.",
    "You are allowed to receive help now.",
    "You are worthy of receiving help now.",
    "It is okay to take now.",
    "You are allowed to accept now.",
    "You are worthy of accepting now.",
    "It is okay to embrace now.",
    "You are allowed to welcome now.",
    "You are worthy of welcoming now.",
    "It is okay to invite now.",
    "You are allowed to include now.",
    "You are worthy of including now.",
    "It is okay to connect now.",
    "You are allowed to relate now.",
    "You are worthy of relating now.",
    "It is okay to bond now.",
    "You are allowed to attach now.",
    "You are worthy of attaching now.",
    "It is okay to love deeply now.",
    "You are allowed to care deeply now.",
    "You are worthy of caring deeply now.",
    "It is okay to feel intensely now.",
    "You are allowed to experience fully now.",
    "You are worthy of experiencing fully now.",
    "It is okay to be alive fully now.",
    "You are allowed to live fully now.",
    "You are worthy of living fully now.",
    "It is okay to be human completely now.",
    "You are allowed to be real entirely now.",
    "You are worthy of being real entirely now.",
    "It is okay to be yourself wholly now.",
    "You are allowed to be you completely now.",
    "You are worthy of being you completely now.",
    "It is okay to be you.",
    "You are allowed to exist.",
    "You are worthy of existence."
];

// Initialize Dashboard
function initializeDashboard() {
    console.log('🏠 Initializing Dashboard...');
    loadDailyCheckIn();
    updateEmotionalWeather();
    setDailyEncouragement();
    initializeMoodSelector();
    initializeIntensitySlider();
    initializeTagInput();
    console.log('✅ Dashboard initialized');
}

// ============================================
// MOOD SELECTOR
// ============================================

function initializeMoodSelector() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            toggleMoodSelection(this, mood);
        });
    });
}

function toggleMoodSelection(button, mood) {
    button.classList.toggle('selected');
    
    if (Dashboard.selectedMoods.includes(mood)) {
        Dashboard.selectedMoods = Dashboard.selectedMoods.filter(m => m !== mood);
    } else {
        Dashboard.selectedMoods.push(mood);
    }
    
    // Show/hide intensity slider based on mood selection
    const intensitySection = document.getElementById('moodIntensitySection');
    if (Dashboard.selectedMoods.length > 0) {
        intensitySection.style.display = 'block';
    } else {
        intensitySection.style.display = 'none';
    }
}

function initializeIntensitySlider() {
    const intensitySlider = document.getElementById('moodIntensity');
    const intensityValue = document.getElementById('intensityValue');
    
    if (intensitySlider && intensityValue) {
        intensitySlider.addEventListener('input', function() {
            intensityValue.textContent = this.value;
        });
    }
}

function initializeTagInput() {
    const tagInput = document.getElementById('tagInput');
    if (tagInput) {
        tagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addMoodTag();
            }
        });
    }
}

function addMoodTag() {
    const tagInput = document.getElementById('tagInput');
    if (!tagInput) return;
    
    const tag = tagInput.value.trim().toLowerCase();
    if (!tag) return;
    
    if (!Dashboard.selectedTags.includes(tag)) {
        Dashboard.selectedTags.push(tag);
        renderSelectedTags();
    }
    
    tagInput.value = '';
}

function removeMoodTag(tag) {
    Dashboard.selectedTags = Dashboard.selectedTags.filter(t => t !== tag);
    renderSelectedTags();
}

function renderSelectedTags() {
    const tagsContainer = document.getElementById('selectedTags');
    if (!tagsContainer) return;
    
    if (Dashboard.selectedTags.length === 0) {
        tagsContainer.innerHTML = '';
        return;
    }
    
    tagsContainer.innerHTML = Dashboard.selectedTags.map(tag => `
        <span class="tag">
            ${tag}
            <button class="tag-remove" onclick="removeMoodTag('${tag}')">×</button>
        </span>
    `).join('');
}

function toggleMoodHistory() {
    const historySection = document.getElementById('moodHistory');
    const toggleBtn = document.querySelector('.mood-history-toggle');
    
    if (!historySection) return;
    
    if (historySection.style.display === 'none') {
        historySection.style.display = 'block';
        toggleBtn.textContent = 'Hide Mood History';
        renderMoodHistory();
    } else {
        historySection.style.display = 'none';
        toggleBtn.textContent = 'View Mood History';
    }
}

function renderMoodHistory() {
    const historyList = document.getElementById('moodHistoryList');
    if (!historyList) return;
    
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No mood history yet. Start checking in to track your moods!</p>';
        return;
    }
    
    // Show last 30 check-ins, most recent first
    const recentCheckIns = checkIns.slice(-30).reverse();
    
    historyList.innerHTML = recentCheckIns.map(checkIn => {
        const date = new Date(checkIn.date);
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
        const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        
        const moodEmojis = {
            calm: '😌',
            okay: '🙂',
            anxious: '😟',
            low: '😞',
            exhausted: '😴',
            overwhelmed: '😵',
            numb: '😶',
            overthinking: '💭'
        };
        
        const moodDisplay = checkIn.moods.map(m => `${moodEmojis[m] || '😐'} ${m}`).join(', ');
        
        return `
            <div class="mood-history-item">
                <div class="mood-history-header">
                    <span class="mood-history-date">${dateStr} at ${timeStr}</span>
                    <span class="mood-history-intensity">Intensity: ${checkIn.intensity || 5}/10</span>
                </div>
                <div class="mood-history-moods">${moodDisplay}</div>
                ${checkIn.notes ? `<div class="mood-history-notes">${checkIn.notes}</div>` : ''}
                ${checkIn.tags && checkIn.tags.length > 0 ? `
                    <div class="mood-history-tags">
                        ${checkIn.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// ============================================
// DAILY CHECK-IN
// ============================================

function saveDailyCheckIn() {
    if (Dashboard.selectedMoods.length === 0) {
        showGentleMessage('Please select at least one mood');
        return;
    }
    
    // Get intensity value
    const intensitySlider = document.getElementById('moodIntensity');
    const intensity = intensitySlider ? parseInt(intensitySlider.value) : 5;
    
    // Get notes
    const notesInput = document.getElementById('checkinNotes');
    const notes = notesInput ? notesInput.value.trim() : '';
    
    const checkIn = {
        id: generateId(),
        date: new Date().toISOString(),
        moods: Dashboard.selectedMoods,
        intensity: intensity,
        notes: notes,
        tags: [...Dashboard.selectedTags],
        emotionalWeather: Dashboard.emotionalWeather
    };
    
    // Add to user data
    MindHaven.userData.checkIns.push(checkIn);
    MindHaven.userData.stats.checkInsCompleted++;
    saveUserData();
    
    // Reset selection
    Dashboard.selectedMoods = [];
    Dashboard.selectedTags = [];
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset intensity slider
    if (intensitySlider) {
        intensitySlider.value = 5;
        document.getElementById('intensityValue').textContent = '5';
    }
    
    // Reset notes
    if (notesInput) {
        notesInput.value = '';
    }
    
    // Reset tags display
    renderSelectedTags();
    
    // Hide intensity section
    document.getElementById('moodIntensitySection').style.display = 'none';
    
    // Show gentle confirmation
    showGentleMessage('Check-in saved. Thank you for checking in with yourself today.');
    
    // Update emotional weather based on moods
    updateEmotionalWeatherFromMoods(checkIn.moods);
    
    // Check for first check-in achievement
    if (MindHaven.userData.stats.checkInsCompleted === 1) {
        unlockAchievement('first-step');
    }
    
    // Update insights
    if (typeof updateInsights === 'function') {
        updateInsights();
    }
}

function loadDailyCheckIn() {
    const today = new Date().toDateString();
    const todayCheckIn = MindHaven.userData.checkIns.find(
        checkIn => new Date(checkIn.date).toDateString() === today
    );
    
    if (todayCheckIn) {
        // Restore mood selection
        Dashboard.selectedMoods = todayCheckIn.moods;
        todayCheckIn.moods.forEach(mood => {
            const button = document.querySelector(`.mood-btn[data-mood="${mood}"]`);
            if (button) {
                button.classList.add('selected');
            }
        });
    }
}

// ============================================
// EMOTIONAL WEATHER
// ============================================

function updateEmotionalWeather() {
    // Calculate emotional weather from recent check-ins
    const recentCheckIns = MindHaven.userData.checkIns.slice(-7);
    
    if (recentCheckIns.length === 0) {
        return;
    }
    
    // Analyze patterns
    const stressLevels = [];
    const energyLevels = [];
    const moodLevels = [];
    const sleepLevels = [];
    
    recentCheckIns.forEach(checkIn => {
        // Simple analysis based on moods
        const stressMoods = ['anxious', 'overwhelmed', 'overthinking'];
        const lowEnergyMoods = ['exhausted', 'low', 'numb'];
        const lowMoodMoods = ['low', 'numb', 'anxious'];
        
        let stress = 'Low';
        let energy = 'High';
        let mood = 'Good';
        let sleep = 'Good';
        
        if (checkIn.moods.some(m => stressMoods.includes(m))) {
            stress = 'High';
        }
        
        if (checkIn.moods.some(m => lowEnergyMoods.includes(m))) {
            energy = 'Low';
        }
        
        if (checkIn.moods.some(m => lowMoodMoods.includes(m))) {
            mood = 'Low';
        }
        
        stressLevels.push(stress);
        energyLevels.push(energy);
        moodLevels.push(mood);
        sleepLevels.push(sleep);
    });
    
    // Calculate averages
    Dashboard.emotionalWeather.stress = getMostCommon(stressLevels);
    Dashboard.emotionalWeather.energy = getMostCommon(energyLevels);
    Dashboard.emotionalWeather.mood = getMostCommon(moodLevels);
    Dashboard.emotionalWeather.sleep = getMostCommon(sleepLevels);
    
    // Update UI
    document.getElementById('stressLevel').textContent = Dashboard.emotionalWeather.stress;
    document.getElementById('energyLevel').textContent = Dashboard.emotionalWeather.energy;
    document.getElementById('moodLevel').textContent = Dashboard.emotionalWeather.mood;
    document.getElementById('sleepLevel').textContent = Dashboard.emotionalWeather.sleep;
}

function updateEmotionalWeatherFromMoods(moods) {
    const stressMoods = ['anxious', 'overwhelmed', 'overthinking'];
    const lowEnergyMoods = ['exhausted', 'low', 'numb'];
    const lowMoodMoods = ['low', 'numb', 'anxious'];
    
    if (moods.some(m => stressMoods.includes(m))) {
        Dashboard.emotionalWeather.stress = 'High';
    } else if (moods.includes('calm')) {
        Dashboard.emotionalWeather.stress = 'Low';
    }
    
    if (moods.some(m => lowEnergyMoods.includes(m))) {
        Dashboard.emotionalWeather.energy = 'Low';
    } else if (moods.includes('calm') || moods.includes('okay')) {
        Dashboard.emotionalWeather.energy = 'High';
    }
    
    if (moods.some(m => lowMoodMoods.includes(m))) {
        Dashboard.emotionalWeather.mood = 'Low';
    } else if (moods.includes('calm') || moods.includes('okay')) {
        Dashboard.emotionalWeather.mood = 'Good';
    }
    
    // Update UI
    document.getElementById('stressLevel').textContent = Dashboard.emotionalWeather.stress;
    document.getElementById('energyLevel').textContent = Dashboard.emotionalWeather.energy;
    document.getElementById('moodLevel').textContent = Dashboard.emotionalWeather.mood;
    document.getElementById('sleepLevel').textContent = Dashboard.emotionalWeather.sleep;
}

function getMostCommon(arr) {
    const counts = {};
    let maxCount = 0;
    let mostCommon = arr[0];
    
    arr.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
        if (counts[item] > maxCount) {
            maxCount = counts[item];
            mostCommon = item;
        }
    });
    
    return mostCommon;
}

// ============================================
// DAILY ENCOURAGEMENT
// ============================================

function setDailyEncouragement() {
    const today = new Date().toDateString();
    const savedMessage = localStorage.getItem('mindhaven_encouragement_' + today);
    
    if (savedMessage) {
        document.getElementById('dailyEncouragement').textContent = savedMessage;
    } else {
        const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
        const message = encouragementMessages[randomIndex];
        document.getElementById('dailyEncouragement').textContent = message;
        localStorage.setItem('mindhaven_encouragement_' + today, message);
    }
}

// ============================================
// SUPPORT SUGGESTIONS
// ============================================

function initializeSupportSuggestions() {
    const supportItems = document.querySelectorAll('.support-item');
    
    supportItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('.support-text').textContent;
            handleSupportAction(text);
        });
    });
}

function handleSupportAction(action) {
    // Track that user completed a support action
    MindHaven.userData.stats.copingToolsUsed++;
    saveUserData();
    
    showGentleMessage(`Great! ${action} is a gentle step toward taking care of yourself.`);
    
    // Check for hydration achievement
    if (action.includes('water')) {
        unlockAchievement('hydrated-heart');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Utility showGentleMessage is provided globally by app.js

// Initialize support suggestions on load
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.support-item')) {
        initializeSupportSuggestions();
    }
});

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.saveDailyCheckIn = saveDailyCheckIn;
window.toggleMoodSelection = toggleMoodSelection;
window.updateEmotionalWeather = updateEmotionalWeather;
window.setDailyEncouragement = setDailyEncouragement;
window.initializeSupportSuggestions = initializeSupportSuggestions;
window.handleSupportAction = handleSupportAction;
window.showGentleMessage = showGentleMessage;
window.initializeIntensitySlider = initializeIntensitySlider;
window.initializeTagInput = initializeTagInput;
window.addMoodTag = addMoodTag;
window.removeMoodTag = removeMoodTag;
window.renderSelectedTags = renderSelectedTags;
window.toggleMoodHistory = toggleMoodHistory;
window.renderMoodHistory = renderMoodHistory;
