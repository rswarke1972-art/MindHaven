// ============================================
// MINDHAVEN - Resource Library Module
// ============================================

// Resource Library State
const Resources = {
    categories: {
        anxiety: {
            name: 'Anxiety Management',
            icon: '😰',
            color: '#8FAACF',
            resources: [
                {
                    title: 'Deep Breathing Techniques',
                    description: 'Learn breathing exercises to reduce anxiety symptoms.',
                    type: 'exercise',
                    action: 'navigateTo(\'breathing\')'
                },
                {
                    title: 'Grounding Exercises',
                    description: '5-4-3-2-1 technique to stay present during anxiety.',
                    type: 'technique',
                    content: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.'
                },
                {
                    title: 'Progressive Muscle Relaxation',
                    description: 'Tense and release muscle groups to reduce physical tension.',
                    type: 'technique',
                    content: 'Start at your toes and work up, tensing each muscle group for 5 seconds then releasing.'
                }
            ]
        },
        depression: {
            name: 'Depression Support',
            icon: '💙',
            color: '#A8C3A1',
            resources: [
                {
                    title: 'Behavioral Activation',
                    description: 'Small activities to boost mood and energy.',
                    type: 'technique',
                    content: 'Schedule one pleasant activity each day, even if you don\'t feel like it.'
                },
                {
                    title: 'Gratitude Practice',
                    description: 'Focus on positive aspects to shift perspective.',
                    type: 'exercise',
                    action: 'navigateTo(\'gratitude\')'
                },
                {
                    title: 'Thought Challenging',
                    description: 'CBT techniques to address negative thoughts.',
                    type: 'exercise',
                    action: 'navigateTo(\'cbt\')'
                }
            ]
        },
        sleep: {
            name: 'Sleep Hygiene',
            icon: '😴',
            color: '#7CB8A6',
            resources: [
                {
                    title: 'Sleep Schedule',
                    description: 'Maintain consistent sleep and wake times.',
                    type: 'technique',
                    content: 'Go to bed and wake up at the same time daily, even on weekends.'
                },
                {
                    title: 'Screen Time Management',
                    description: 'Reduce blue light exposure before bed.',
                    type: 'technique',
                    content: 'Avoid screens for at least 1 hour before bedtime.'
                },
                {
                    title: 'Relaxation Routine',
                    description: 'Create a calming pre-sleep routine.',
                    type: 'technique',
                    content: 'Try reading, gentle stretching, or meditation before bed.'
                }
            ]
        },
        stress: {
            name: 'Stress Management',
            icon: '🌿',
            color: '#B8A7D1',
            resources: [
                {
                    title: 'Time Management',
                    description: 'Prioritize tasks and break them into smaller steps.',
                    type: 'technique',
                    content: 'Use the Eisenhower Matrix: urgent vs important.'
                },
                {
                    title: 'Mindfulness Meditation',
                    description: 'Practice present-moment awareness.',
                    type: 'exercise',
                    action: 'navigateTo(\'calmspace\')'
                },
                {
                    title: 'Physical Activity',
                    description: 'Exercise to reduce stress hormones.',
                    type: 'technique',
                    content: 'Even a 10-minute walk can help reduce stress.'
                }
            ]
        },
        crisis: {
            name: 'Crisis Resources',
            icon: '🆘',
            color: '#E57373',
            resources: [
                {
                    title: 'Crisis Hotlines',
                    description: '24/7 support for mental health emergencies.',
                    type: 'external',
                    action: 'navigateTo(\'crisis\')'
                },
                {
                    title: 'Safety Planning',
                    description: 'Create a plan for difficult moments.',
                    type: 'exercise',
                    action: 'navigateTo(\'crisis\')'
                },
                {
                    title: 'Grounding for Crisis',
                    description: 'Quick techniques to manage overwhelming feelings.',
                    type: 'technique',
                    content: 'Focus on your breath, name 5 things you see, splash cold water on your face.'
                }
            ]
        },
        selfcare: {
            name: 'Self-Care',
            icon: '💖',
            color: '#FFB74D',
            resources: [
                {
                    title: 'Basic Self-Care',
                    description: 'Foundation of mental wellness.',
                    type: 'technique',
                    content: 'Eat regularly, stay hydrated, get enough sleep, move your body.'
                },
                {
                    title: 'Setting Boundaries',
                    description: 'Protect your energy and time.',
                    type: 'technique',
                    content: 'Learn to say no to things that drain you without guilt.'
                },
                {
                    title: 'Journaling',
                    description: 'Process thoughts and emotions through writing.',
                    type: 'exercise',
                    action: 'navigateTo(\'journal\')'
                }
            ]
        }
    },
    favorites: []
};

// Initialize Resource Library Module
function initializeResources() {
    console.log('📚 Initializing Resource Library...');
    loadFavorites();
    setupResourcesUI();
    console.log('✅ Resource Library initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadFavorites() {
    const savedData = localStorage.getItem('mindhaven_resource_favorites');
    if (savedData) {
        Resources.favorites = JSON.parse(savedData);
    }
}

function saveFavorites() {
    localStorage.setItem('mindhaven_resource_favorites', JSON.stringify(Resources.favorites));
}

// ============================================
// RESOURCE MANAGEMENT
// ============================================

function toggleFavorite(categoryId, resourceIndex) {
    const favoriteKey = `${categoryId}-${resourceIndex}`;
    const index = Resources.favorites.indexOf(favoriteKey);
    
    if (index > -1) {
        Resources.favorites.splice(index, 1);
        showGentleMessage('Removed from favorites.');
    } else {
        Resources.favorites.push(favoriteKey);
        showGentleMessage('Added to favorites.');
    }
    
    saveFavorites();
    renderResources();
}

function isFavorite(categoryId, resourceIndex) {
    const favoriteKey = `${categoryId}-${resourceIndex}`;
    return Resources.favorites.includes(favoriteKey);
}

// ============================================
// UI RENDERING
// ============================================

function renderResources() {
    const container = document.getElementById('resourcesLibrary');
    if (!container) return;
    
    let html = '';
    
    Object.entries(Resources.categories).forEach(([categoryId, category]) => {
        html += `
            <div class="resource-category">
                <div class="category-header" style="color: ${category.color}">
                    <span class="category-icon">${category.icon}</span>
                    <h3>${category.name}</h3>
                </div>
                <div class="resource-list">
                    ${category.resources.map((resource, index) => `
                        <div class="resource-item">
                            <div class="resource-header">
                                <span class="resource-type">${resource.type}</span>
                                <button class="favorite-btn ${isFavorite(categoryId, index) ? 'active' : ''}" onclick="toggleFavorite('${categoryId}', ${index})">
                                    ${isFavorite(categoryId, index) ? '❤️' : '🤍'}
                                </button>
                            </div>
                            <h4 class="resource-title">${resource.title}</h4>
                            <p class="resource-description">${resource.description}</p>
                            ${resource.content ? `
                                <div class="resource-content">
                                    <strong>Tip:</strong> ${resource.content}
                                </div>
                            ` : ''}
                            ${resource.action ? `
                                <button class="secondary-btn" onclick="${resource.action}">Try Now</button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderFavorites() {
    const container = document.getElementById('favoritesList');
    if (!container) return;
    
    if (Resources.favorites.length === 0) {
        container.innerHTML = '<p class="empty-state">No favorites yet. Click the heart icon on any resource to save it here.</p>';
        return;
    }
    
    let html = '';
    Resources.favorites.forEach(favoriteKey => {
        const [categoryId, resourceIndex] = favoriteKey.split('-');
        const category = Resources.categories[categoryId];
        const resource = category.resources[parseInt(resourceIndex)];
        
        html += `
            <div class="resource-item favorite-item">
                <div class="resource-header">
                    <span class="resource-type">${resource.type}</span>
                    <button class="favorite-btn active" onclick="toggleFavorite('${categoryId}', ${resourceIndex})">❤️</button>
                </div>
                <h4 class="resource-title">${resource.title}</h4>
                <p class="resource-description">${resource.description}</p>
                ${resource.content ? `
                    <div class="resource-content">
                        <strong>Tip:</strong> ${resource.content}
                    </div>
                ` : ''}
                ${resource.action ? `
                    <button class="secondary-btn" onclick="${resource.action}">Try Now</button>
                ` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// UI SETUP
// ============================================

function setupResourcesUI() {
    addResourcesToNavigation();
    renderResources();
    renderFavorites();
}

function addResourcesToNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    if (document.querySelector('.nav-item[onclick*="resources"]')) return;
    
    const resourcesItem = document.createElement('button');
    resourcesItem.className = 'nav-item';
    resourcesItem.setAttribute('onclick', "navigateTo('resources')");
    resourcesItem.setAttribute('role', 'menuitem');
    resourcesItem.textContent = '📚 Resources';
    
    const crisisBtn = navMenu.querySelector('.crisis-btn');
    if (crisisBtn) {
        navMenu.insertBefore(resourcesItem, crisisBtn);
    } else {
        navMenu.appendChild(resourcesItem);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.toggleFavorite = toggleFavorite;
window.renderResources = renderResources;
window.renderFavorites = renderFavorites;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeResources();
});
