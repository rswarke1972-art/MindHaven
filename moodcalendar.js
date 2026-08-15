// ============================================
// MINDHAVEN - Mood Calendar Module
// ============================================

// Mood Calendar State
const MoodCalendar = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    view: 'month', // 'month' or 'week'
    selectedDate: null
};

// Mood Colors for Calendar
const moodColors = {
    calm: '#A8C3A1',
    okay: '#8FAACF',
    anxious: '#FFB74D',
    low: '#B8A7D1',
    exhausted: '#E57373',
    overwhelmed: '#E57373',
    numb: '#9E9E9E',
    overthinking: '#FFB74D'
};

// Initialize Mood Calendar
function initializeMoodCalendar() {
    console.log('📅 Initializing Mood Calendar...');
    renderMoodCalendar();
    setupCalendarNavigation();
    console.log('✅ Mood Calendar initialized');
}

// ============================================
// CALENDAR RENDERING
// ============================================

function renderMoodCalendar() {
    const calendarContainer = document.getElementById('moodCalendarContainer');
    if (!calendarContainer) return;
    
    if (MoodCalendar.view === 'month') {
        renderMonthView(calendarContainer);
    } else {
        renderWeekView(calendarContainer);
    }
    
    renderMoodStatistics();
}

function renderMonthView(container) {
    const month = MoodCalendar.currentMonth;
    const year = MoodCalendar.currentYear;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    let html = `
        <div class="calendar-header">
            <button class="calendar-nav-btn" onclick="navigateCalendar(-1)">❮</button>
            <h2>${monthNames[month]} ${year}</h2>
            <button class="calendar-nav-btn" onclick="navigateCalendar(1)">❯</button>
        </div>
        <div class="calendar-view-toggle">
            <button class="view-btn ${MoodCalendar.view === 'month' ? 'active' : ''}" onclick="setCalendarView('month')">Month</button>
            <button class="view-btn ${MoodCalendar.view === 'week' ? 'active' : ''}" onclick="setCalendarView('week')">Week</button>
        </div>
        <div class="calendar-grid">
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
    `;
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const moodData = getMoodForDate(dateStr);
        
        html += `
            <div class="calendar-day ${moodData ? 'has-mood' : ''}" 
                 style="${moodData ? `background: ${moodData.color}` : ''}"
                 onclick="showDayDetails('${dateStr}')"
                 title="${moodData ? moodData.moods.join(', ') : 'No entry'}">
                <span class="day-number">${day}</span>
                ${moodData ? `<span class="mood-indicator">${moodData.emoji}</span>` : ''}
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function renderWeekView(container) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        weekDates.push(date);
    }
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    let html = `
        <div class="calendar-header">
            <button class="calendar-nav-btn" onclick="navigateWeek(-1)">❮</button>
            <h2>This Week</h2>
            <button class="calendar-nav-btn" onclick="navigateWeek(1)">❯</button>
        </div>
        <div class="calendar-view-toggle">
            <button class="view-btn ${MoodCalendar.view === 'month' ? 'active' : ''}" onclick="setCalendarView('month')">Month</button>
            <button class="view-btn ${MoodCalendar.view === 'week' ? 'active' : ''}" onclick="setCalendarView('week')">Week</button>
        </div>
        <div class="week-view">
    `;
    
    weekDates.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        const moodData = getMoodForDate(dateStr);
        const isToday = date.toDateString() === today.toDateString();
        
        html += `
            <div class="week-day ${isToday ? 'today' : ''}" onclick="showDayDetails('${dateStr}')">
                <div class="week-day-header">
                    <span class="week-day-name">${dayNames[date.getDay()]}</span>
                    <span class="week-day-date">${date.getDate()}</span>
                </div>
                <div class="week-day-mood" style="${moodData ? `background: ${moodData.color}` : 'background: var(--bg-secondary)'}">
                    ${moodData ? `<span class="mood-emoji">${moodData.emoji}</span>` : '<span class="no-mood">No entry</span>'}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ============================================
// MOOD DATA RETRIEVAL
// ============================================

function getMoodForDate(dateStr) {
    const checkIns = MindHaven.userData.checkIns || [];
    const dayCheckIns = checkIns.filter(checkIn => {
        const checkInDate = new Date(checkIn.date).toISOString().split('T')[0];
        return checkInDate === dateStr;
    });
    
    if (dayCheckIns.length === 0) return null;
    
    // Get the most recent check-in for the day
    const latestCheckIn = dayCheckIns[dayCheckIns.length - 1];
    
    // Determine dominant mood
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
    
    // Use the first mood as the primary mood for coloring
    const primaryMood = latestCheckIn.moods[0];
    
    return {
        moods: latestCheckIn.moods,
        emoji: moodEmojis[primaryMood] || '😐',
        color: moodColors[primaryMood] || '#9E9E9E',
        intensity: latestCheckIn.intensity || 5,
        notes: latestCheckIn.notes || '',
        tags: latestCheckIn.tags || []
    };
}

// ============================================
// CALENDAR NAVIGATION
// ============================================

function navigateCalendar(direction) {
    MoodCalendar.currentMonth += direction;
    
    if (MoodCalendar.currentMonth > 11) {
        MoodCalendar.currentMonth = 0;
        MoodCalendar.currentYear++;
    } else if (MoodCalendar.currentMonth < 0) {
        MoodCalendar.currentMonth = 11;
        MoodCalendar.currentYear--;
    }
    
    renderMoodCalendar();
}

function navigateWeek(direction) {
    const today = new Date();
    today.setDate(today.getDate() + (direction * 7));
    MoodCalendar.currentMonth = today.getMonth();
    MoodCalendar.currentYear = today.getFullYear();
    renderMoodCalendar();
}

function setCalendarView(view) {
    MoodCalendar.view = view;
    renderMoodCalendar();
}

// ============================================
// DAY DETAILS
// ============================================

function showDayDetails(dateStr) {
    const moodData = getMoodForDate(dateStr);
    const date = new Date(dateStr);
    const dateDisplay = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
    });
    
    const modal = document.createElement('div');
    modal.className = 'day-details-modal';
    
    if (moodData) {
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
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${dateDisplay}</h2>
                    <button class="close-btn" onclick="this.closest('.day-details-modal').remove()">×</button>
                </div>
                <div class="day-moods">
                    ${moodData.moods.map(mood => `
                        <span class="mood-tag" style="background: ${moodColors[mood] || '#9E9E9E'}">
                            ${moodEmojis[mood] || '😐'} ${mood}
                        </span>
                    `).join('')}
                </div>
                <div class="day-intensity">
                    <span class="intensity-label">Intensity:</span>
                    <span class="intensity-value">${moodData.intensity}/10</span>
                </div>
                ${moodData.notes ? `<div class="day-notes"><strong>Notes:</strong> ${moodData.notes}</div>` : ''}
                ${moodData.tags && moodData.tags.length > 0 ? `
                    <div class="day-tags">
                        ${moodData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${dateDisplay}</h2>
                    <button class="close-btn" onclick="this.closest('.day-details-modal').remove()">×</button>
                </div>
                <p class="no-entry-message">No mood entry recorded for this day.</p>
            </div>
        `;
    }
    
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
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(modal);
}

// ============================================
// MOOD STATISTICS
// ============================================

function renderMoodStatistics() {
    const statsContainer = document.getElementById('moodStatistics');
    if (!statsContainer) return;
    
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length === 0) {
        statsContainer.innerHTML = '<p class="empty-state">No mood data yet. Start tracking your moods to see statistics!</p>';
        return;
    }
    
    // Calculate statistics
    const moodCounts = {};
    const intensityValues = [];
    
    checkIns.forEach(checkIn => {
        checkIn.moods.forEach(mood => {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        if (checkIn.intensity) {
            intensityValues.push(checkIn.intensity);
        }
    });
    
    // Find most common mood
    let mostCommonMood = null;
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > maxCount) {
            maxCount = count;
            mostCommonMood = mood;
        }
    });
    
    // Calculate average intensity
    const avgIntensity = intensityValues.length > 0
        ? (intensityValues.reduce((a, b) => a + b, 0) / intensityValues.length).toFixed(1)
        : 0;
    
    // Find best and worst days (based on intensity)
    const sortedByIntensity = checkIns
        .filter(c => c.intensity)
        .sort((a, b) => b.intensity - a.intensity);
    
    const bestDay = sortedByIntensity.length > 0 ? sortedByIntensity[0] : null;
    const worstDay = sortedByIntensity.length > 0 ? sortedByIntensity[sortedByIntensity.length - 1] : null;
    
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
    
    let html = `
        <div class="mood-stats-grid">
            <div class="stat-card">
                <h3>Total Entries</h3>
                <span class="stat-value">${checkIns.length}</span>
            </div>
            <div class="stat-card">
                <h3>Most Common Mood</h3>
                <span class="stat-value">${mostCommonMood ? `${moodEmojis[mostCommonMood]} ${mostCommonMood}` : 'N/A'}</span>
            </div>
            <div class="stat-card">
                <h3>Average Intensity</h3>
                <span class="stat-value">${avgIntensity}/10</span>
            </div>
        </div>
    `;
    
    if (bestDay) {
        const bestDate = new Date(bestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        html += `
            <div class="best-worst-mood">
                <div class="best-day">
                    <h4>Best Day</h4>
                    <p>${bestDate} - ${bestDay.moods.map(m => moodEmojis[m]).join(' ')}</p>
                </div>
                <div class="worst-day">
                    <h4>Most Intense Day</h4>
                    <p>${new Date(worstDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${worstDay.moods.map(m => moodEmojis[m]).join(' ')}</p>
                </div>
            </div>
        `;
    }
    
    statsContainer.innerHTML = html;
}

// ============================================
// CALENDAR SETUP
// ============================================

function setupCalendarNavigation() {
    // Add calendar section to navigation if not present
    addCalendarToNavigation();
}

function addCalendarToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    // Check if already added
    if (document.querySelector('.nav-item[onclick*="moodcalendar"]')) return;
    
    const calendarItem = document.createElement('button');
    calendarItem.className = 'nav-item';
    calendarItem.setAttribute('onclick', "navigateTo('moodcalendar')");
    calendarItem.setAttribute('role', 'menuitem');
    calendarItem.textContent = '📅 Mood Calendar';
    
    // Insert before crisis button
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(calendarItem, crisisBtn);
    } else {
        navMenu.appendChild(calendarItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.navigateCalendar = navigateCalendar;
window.navigateWeek = navigateWeek;
window.setCalendarView = setCalendarView;
window.showDayDetails = showDayDetails;
window.renderMoodCalendar = renderMoodCalendar;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeMoodCalendar();
});
