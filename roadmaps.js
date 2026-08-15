// ============================================
// MINDHAVEN - Recovery Roadmaps Module
// ============================================

// Roadmaps State
const Roadmaps = {
    data: null,
    definitions: null
};

// Initialize Roadmaps Module
function initializeRoadmaps() {
    console.log('🗺️ Initializing Recovery Roadmaps...');
    loadRoadmapsData();
    initializeRoadmapDefinitions();
    console.log('✅ Recovery Roadmaps initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadRoadmapsData() {
    if (MindHaven.userData.roadmaps) {
        Roadmaps.data = MindHaven.userData.roadmaps;
    } else {
        Roadmaps.data = initializeRoadmapsStructure();
    }
}

function initializeRoadmapsStructure() {
    return {
        active: null,
        progress: {
            anxiety: { stage: 0, progress: 0, startDate: null, completedStages: [] },
            depression: { stage: 0, progress: 0, startDate: null, completedStages: [] },
            burnout: { stage: 0, progress: 0, startDate: null, completedStages: [] },
            loneliness: { stage: 0, progress: 0, startDate: null, completedStages: [] },
            adhd: { stage: 0, progress: 0, startDate: null, completedStages: [] },
            ocd: { stage: 0, progress: 0, startDate: null, completedStages: [] },
            academic: { stage: 0, progress: 0, startDate: null, completedStages: [] }
        },
        history: []
    };
}

function saveRoadmapsData() {
    MindHaven.userData.roadmaps = Roadmaps.data;
    saveUserData();
}

// ============================================
// ROADMAP DEFINITIONS
// ============================================

function initializeRoadmapDefinitions() {
    Roadmaps.definitions = {
        anxiety: {
            name: 'Anxiety Recovery',
            icon: '😰',
            color: '#B8A7D1',
            description: 'A structured journey to understand and manage anxiety',
            stages: [
                {
                    stage: 1,
                    name: 'Stabilize',
                    description: 'Learn to manage immediate anxiety symptoms',
                    milestones: [
                        { id: 'a1-1', title: 'Complete anxiety assessment', completed: false },
                        { id: 'a1-2', title: 'Practice breathing exercises 5 times', completed: false },
                        { id: 'a1-3', title: 'Identify 3 anxiety triggers', completed: false },
                        { id: 'a1-4', title: 'Create emergency coping plan', completed: false }
                    ],
                    suggestedTools: ['breathing', 'grounding', 'safetyplan'],
                    estimatedDays: 7
                },
                {
                    stage: 2,
                    name: 'Understand',
                    description: 'Learn about anxiety and your personal patterns',
                    milestones: [
                        { id: 'a2-1', title: 'Read Anxiety Hub content', completed: false },
                        { id: 'a2-2', title: 'Identify thought patterns', completed: false },
                        { id: 'a2-3', title: 'Track anxiety for 2 weeks', completed: false },
                        { id: 'a2-4', title: 'Complete pattern analysis', completed: false }
                    ],
                    suggestedTools: ['journaling', 'patterns', 'profile'],
                    estimatedDays: 14
                },
                {
                    stage: 3,
                    name: 'Build Skills',
                    description: 'Develop effective coping strategies',
                    milestones: [
                        { id: 'a3-1', title: 'Practice 3 different coping techniques', completed: false },
                        { id: 'a3-2', title: 'Complete 10 journal entries', completed: false },
                        { id: 'a3-3', title: 'Build support circle', completed: false },
                        { id: 'a3-4', title: 'Establish daily routine', completed: false }
                    ],
                    suggestedTools: ['journaling', 'supportcircle', 'goals'],
                    estimatedDays: 21
                },
                {
                    stage: 4,
                    name: 'Reconnect',
                    description: 'Rebuild connections and activities',
                    milestones: [
                        { id: 'a4-1', title: 'Reach out to 3 people', completed: false },
                        { id: 'a4-2', title: 'Resume one enjoyable activity', completed: false },
                        { id: 'a4-3', title: 'Join a group or community', completed: false },
                        { id: 'a4-4', title: 'Share experience with someone', completed: false }
                    ],
                    suggestedTools: ['supportcircle', 'goals'],
                    estimatedDays: 14
                },
                {
                    stage: 5,
                    name: 'Grow',
                    description: 'Maintain progress and thrive',
                    milestones: [
                        { id: 'a5-1', title: 'Maintain 30-day check-in streak', completed: false },
                        { id: 'a5-2', title: 'Help someone else', completed: false },
                        { id: 'a5-3', title: 'Set long-term wellness goals', completed: false },
                        { id: 'a5-4', title: 'Create relapse prevention plan', completed: false }
                    ],
                    suggestedTools: ['goals', 'habits', 'profile'],
                    estimatedDays: 30
                }
            ]
        },
        depression: {
            name: 'Depression Recovery',
            icon: '🌧️',
            color: '#8FAACF',
            description: 'A gentle path toward healing and hope',
            stages: [
                {
                    stage: 1,
                    name: 'Stabilize',
                    description: 'Focus on basic self-care and safety',
                    milestones: [
                        { id: 'd1-1', title: 'Complete depression assessment', completed: false },
                        { id: 'd1-2', title: 'Create safety plan if needed', completed: false },
                        { id: 'd1-3', title: 'Establish sleep routine', completed: false },
                        { id: 'd1-4', title: 'Practice one self-care activity daily', completed: false }
                    ],
                    suggestedTools: ['safetyplan', 'calmspace', 'low-energy'],
                    estimatedDays: 7
                },
                {
                    stage: 2,
                    name: 'Understand',
                    description: 'Learn about depression and your experience',
                    milestones: [
                        { id: 'd2-1', title: 'Read Depression Hub content', completed: false },
                        { id: 'd2-2', title: 'Journal about feelings 5 times', completed: false },
                        { id: 'd2-3', title: 'Identify energy patterns', completed: false },
                        { id: 'd2-4', title: 'Track mood for 2 weeks', completed: false }
                    ],
                    suggestedTools: ['journaling', 'profile', 'low-energy'],
                    estimatedDays: 14
                },
                {
                    stage: 3,
                    name: 'Build Skills',
                    description: 'Develop gentle coping strategies',
                    milestones: [
                        { id: 'd3-1', title: 'Practice 2 grounding techniques', completed: false },
                        { id: 'd3-2', title: 'Complete 7 journal entries', completed: false },
                        { id: 'd3-3', title: 'Try one new activity', completed: false },
                        { id: 'd3-4', title: 'Build support network', completed: false }
                    ],
                    suggestedTools: ['grounding', 'journaling', 'supportcircle'],
                    estimatedDays: 21
                },
                {
                    stage: 4,
                    name: 'Reconnect',
                    description: 'Gently rebuild connections',
                    milestones: [
                        { id: 'd4-1', title: 'Connect with one person', completed: false },
                        { id: 'd4-2', title: 'Spend time in nature', completed: false },
                        { id: 'd4-3', title: 'Revisit one hobby', completed: false },
                        { id: 'd4-4', title: 'Practice self-compassion daily', completed: false }
                    ],
                    suggestedTools: ['supportcircle', 'calmspace'],
                    estimatedDays: 14
                },
                {
                    stage: 5,
                    name: 'Grow',
                    description: 'Build resilience and maintain wellness',
                    milestones: [
                        { id: 'd5-1', title: 'Maintain consistent self-care', completed: false },
                        { id: 'd5-2', title: 'Set meaningful goals', completed: false },
                        { id: 'd5-3', title: 'Practice gratitude regularly', completed: false },
                        { id: 'd5-4', title: 'Create wellness maintenance plan', completed: false }
                    ],
                    suggestedTools: ['goals', 'journaling', 'profile'],
                    estimatedDays: 30
                }
            ]
        },
        burnout: {
            name: 'Burnout Recovery',
            icon: '🔥',
            color: '#FFB74D',
            description: 'Recover from exhaustion and rediscover balance',
            stages: [
                {
                    stage: 1,
                    name: 'Stabilize',
                    description: 'Prioritize rest and immediate relief',
                    milestones: [
                        { id: 'b1-1', title: 'Complete burnout assessment', completed: false },
                        { id: 'b1-2', title: 'Reduce commitments by 50%', completed: false },
                        { id: 'b1-3', title: 'Get 7+ hours sleep for 3 days', completed: false },
                        { id: 'b1-4', title: 'Practice low-energy mode', completed: false }
                    ],
                    suggestedTools: ['low-energy', 'calmspace', 'student'],
                    estimatedDays: 7
                },
                {
                    stage: 2,
                    name: 'Understand',
                    description: 'Identify burnout sources and patterns',
                    milestones: [
                        { id: 'b2-1', title: 'Identify main stressors', completed: false },
                        { id: 'b2-2', title: 'Review workload boundaries', completed: false },
                        { id: 'b2-3', title: 'Journal about exhaustion patterns', completed: false },
                        { id: 'b2-4', title: 'Assess work-life balance', completed: false }
                    ],
                    suggestedTools: ['journaling', 'patterns', 'student'],
                    estimatedDays: 14
                },
                {
                    stage: 3,
                    name: 'Build Skills',
                    description: 'Develop sustainable work habits',
                    milestones: [
                        { id: 'b3-1', title: 'Set clear boundaries', completed: false },
                        { id: 'b3-2', title: 'Practice regular breaks', completed: false },
                        { id: 'b3-3', title: 'Delegate or say no to requests', completed: false },
                        { id: 'b3-4', title: 'Create recharge routine', completed: false }
                    ],
                    suggestedTools: ['goals', 'habits', 'journaling'],
                    estimatedDays: 21
                },
                {
                    stage: 4,
                    name: 'Reconnect',
                    description: 'Rebuild energy and engagement',
                    milestones: [
                        { id: 'b4-1', title: 'Reconnect with one passion', completed: false },
                        { id: 'b4-2', title: 'Socialize without work talk', completed: false },
                        { id: 'b4-3', title: 'Engage in creative activity', completed: false },
                        { id: 'b4-4', title: 'Practice mindfulness', completed: false }
                    ],
                    suggestedTools: ['calmspace', 'supportcircle'],
                    estimatedDays: 14
                },
                {
                    stage: 5,
                    name: 'Grow',
                    description: 'Build sustainable lifestyle',
                    milestones: [
                        { id: 'b5-1', title: 'Maintain work-life balance', completed: false },
                        { id: 'b5-2', title: 'Regularly reassess commitments', completed: false },
                        { id: 'b5-3', title: 'Practice ongoing self-care', completed: false },
                        { id: 'b5-4', title: 'Help others avoid burnout', completed: false }
                    ],
                    suggestedTools: ['goals', 'habits', 'profile'],
                    estimatedDays: 30
                }
            ]
        },
        loneliness: {
            name: 'Loneliness Recovery',
            icon: '💙',
            color: '#8FAACF',
            description: 'Build meaningful connections and belonging',
            stages: [
                {
                    stage: 1,
                    name: 'Stabilize',
                    description: 'Accept feelings and practice self-compassion',
                    milestones: [
                        { id: 'l1-1', title: 'Acknowledge loneliness without judgment', completed: false },
                        { id: 'l1-2', title: 'Practice self-compassion exercise', completed: false },
                        { id: 'l1-3', title: 'Use loneliness companion tool', completed: false },
                        { id: 'l1-4', title: 'Complete daily check-in for 3 days', completed: false }
                    ],
                    suggestedTools: ['coping', 'journaling', 'checkin'],
                    estimatedDays: 7
                },
                {
                    stage: 2,
                    name: 'Understand',
                    description: 'Explore your social needs and barriers',
                    milestones: [
                        { id: 'l2-1', title: 'Identify social needs', completed: false },
                        { id: 'l2-2', title: 'Recognize social barriers', completed: false },
                        { id: 'l2-3', title: 'Journal about connection desires', completed: false },
                        { id: 'l2-4', title: 'Read Loneliness Hub content', completed: false }
                    ],
                    suggestedTools: ['journaling', 'mentalhealth', 'profile'],
                    estimatedDays: 14
                },
                {
                    stage: 3,
                    name: 'Build Skills',
                    description: 'Develop social confidence and skills',
                    milestones: [
                        { id: 'l3-1', title: 'Practice one social skill', completed: false },
                        { id: 'l3-2', title: 'Initiate one conversation', completed: false },
                        { id: 'l3-3', title: 'Join one online community', completed: false },
                        { id: 'l3-4', title: 'Attend one social event', completed: false }
                    ],
                    suggestedTools: ['supportcircle', 'goals'],
                    estimatedDays: 21
                },
                {
                    stage: 4,
                    name: 'Reconnect',
                    description: 'Rebuild and deepen connections',
                    milestones: [
                        { id: 'l4-1', title: 'Reach out to 3 old friends', completed: false },
                        { id: 'l4-2', title: 'Build support circle', completed: false },
                        { id: 'l4-3', title: 'Have one meaningful conversation', completed: false },
                        { id: 'l4-4', title: 'Practice vulnerability', completed: false }
                    ],
                    suggestedTools: ['supportcircle', 'journaling'],
                    estimatedDays: 14
                },
                {
                    stage: 5,
                    name: 'Grow',
                    description: 'Maintain connections and help others',
                    milestones: [
                        { id: 'l5-1', title: 'Maintain regular social contact', completed: false },
                        { id: 'l5-2', title: 'Support someone else', completed: false },
                        { id: 'l5-3', title: 'Contribute to community', completed: false },
                        { id: 'l5-4', title: 'Practice ongoing connection', completed: false }
                    ],
                    suggestedTools: ['supportcircle', 'goals', 'profile'],
                    estimatedDays: 30
                }
            ]
        },
        adhd: {
            name: 'ADHD Management',
            icon: '🧠',
            color: '#FFB74D',
            description: 'Build systems that work with your brain',
            stages: [
                {
                    stage: 1,
                    name: 'Stabilize',
                    description: 'Reduce overwhelm and establish basics',
                    milestones: [
                        { id: 'ad1-1', title: 'Complete ADHD assessment', completed: false },
                        { id: 'ad1-2', title: 'Reduce task list to 3 items', completed: false },
                        { id: 'ad1-3', title: 'Use micro-goals for 5 days', completed: false },
                        { id: 'ad1-4', title: 'Establish one routine', completed: false }
                    ],
                    suggestedTools: ['goals', 'low-energy', 'coping'],
                    estimatedDays: 7
                },
                {
                    stage: 2,
                    name: 'Understand',
                    description: 'Learn about ADHD and your patterns',
                    milestones: [
                        { id: 'ad2-1', title: 'Read ADHD Hub content', completed: false },
                        { id: 'ad2-2', title: 'Identify peak focus times', completed: false },
                        { id: 'ad2-3', title: 'Track distraction triggers', completed: false },
                        { id: 'ad2-4', title: 'Journal about ADHD experience', completed: false }
                    ],
                    suggestedTools: ['mentalhealth', 'journaling', 'patterns'],
                    estimatedDays: 14
                },
                {
                    stage: 3,
                    name: 'Build Skills',
                    description: 'Develop ADHD-friendly strategies',
                    milestones: [
                        { id: 'ad3-1', title: 'Use time-blocking for 1 week', completed: false },
                        { id: 'ad3-2', title: 'Build body doubling habit', completed: false },
                        { id: 'ad3-3', title: 'Create reminder system', completed: false },
                        { id: 'ad3-4', title: 'Practice 3 focus techniques', completed: false }
                    ],
                    suggestedTools: ['goals', 'habits', 'journaling'],
                    estimatedDays: 21
                },
                {
                    stage: 4,
                    name: 'Reconnect',
                    description: 'Build support and reduce shame',
                    milestones: [
                        { id: 'ad4-1', title: 'Share ADHD with one person', completed: false },
                        { id: 'ad4-2', title: 'Join ADHD community', completed: false },
                        { id: 'ad4-3', title: 'Practice self-acceptance', completed: false },
                        { id: 'ad4-4', title: 'Build accountability partner', completed: false }
                    ],
                    suggestedTools: ['supportcircle', 'journaling'],
                    estimatedDays: 14
                },
                {
                    stage: 5,
                    name: 'Grow',
                    description: 'Optimize systems and thrive',
                    milestones: [
                        { id: 'ad5-1', title: 'Maintain effective systems', completed: false },
                        { id: 'ad5-2', title: 'Advocate for needs', completed: false },
                        { id: 'ad5-3', title: 'Help others with ADHD', completed: false },
                        { id: 'ad5-4', title: 'Celebrate neurodiversity', completed: false }
                    ],
                    suggestedTools: ['goals', 'profile', 'supportcircle'],
                    estimatedDays: 30
                }
            ]
        },
        ocd: {
            name: 'OCD Management',
            icon: '🔄',
            color: '#B8A7D1',
            description: 'Break free from obsessive-compulsive cycles',
            stages: [
                {
                    stage: 1,
                    name: 'Stabilize',
                    description: 'Manage immediate symptoms and distress',
                    milestones: [
                        { id: 'o1-1', title: 'Complete OCD assessment', completed: false },
                        { id: 'o1-2', title: 'Practice grounding 5 times', completed: false },
                        { id: 'o1-3', title: 'Delay one compulsion by 5 minutes', completed: false },
                        { id: 'o1-4', title: 'Use breathing for anxiety', completed: false }
                    ],
                    suggestedTools: ['grounding', 'breathing', 'coping'],
                    estimatedDays: 7
                },
                {
                    stage: 2,
                    name: 'Understand',
                    description: 'Learn about OCD and your patterns',
                    milestones: [
                        { id: 'o2-1', title: 'Read OCD Hub content', completed: false },
                        { id: 'o2-2', title: 'Identify obsessions and compulsions', completed: false },
                        { id: 'o2-3', title: 'Track OCD patterns for 1 week', completed: false },
                        { id: 'o2-4', title: 'Journal about OCD experience', completed: false }
                    ],
                    suggestedTools: ['mentalhealth', 'journaling', 'patterns'],
                    estimatedDays: 14
                },
                {
                    stage: 3,
                    name: 'Build Skills',
                    description: 'Develop ERP and coping skills',
                    milestones: [
                        { id: 'o3-1', title: 'Practice exposure exercise', completed: false },
                        { id: 'o3-2', title: 'Delay compulsions 3 times', completed: false },
                        { id: 'o3-3', title: 'Use mindfulness for urges', completed: false },
                        { id: 'o3-4', title: 'Challenge intrusive thoughts', completed: false }
                    ],
                    suggestedTools: ['journaling', 'grounding', 'calmspace'],
                    estimatedDays: 21
                },
                {
                    stage: 4,
                    name: 'Reconnect',
                    description: 'Reduce isolation and build support',
                    milestones: [
                        { id: 'o4-1', title: 'Share OCD with trusted person', completed: false },
                        { id: 'o4-2', title: 'Join OCD support community', completed: false },
                        { id: 'o4-3', title: 'Practice self-compassion', completed: false },
                        { id: 'o4-4', title: 'Reduce OCD-related avoidance', completed: false }
                    ],
                    suggestedTools: ['supportcircle', 'journaling'],
                    estimatedDays: 14
                },
                {
                    stage: 5,
                    name: 'Grow',
                    description: 'Maintain progress and prevent relapse',
                    milestones: [
                        { id: 'o5-1', title: 'Maintain ERP practice', completed: false },
                        { id: 'o5-2', title: 'Handle setbacks effectively', completed: false },
                        { id: 'o5-3', title: 'Support others with OCD', completed: false },
                        { id: 'o5-4', title: 'Create relapse prevention plan', completed: false }
                    ],
                    suggestedTools: ['journaling', 'profile', 'supportcircle'],
                    estimatedDays: 30
                }
            ]
        },
        academic: {
            name: 'Academic Stress Recovery',
            icon: '📚',
            color: '#8FAACF',
            description: 'Manage academic pressure and find balance',
            stages: [
                {
                    stage: 1,
                    name: 'Stabilize',
                    description: 'Reduce immediate academic stress',
                    milestones: [
                        { id: 'ac1-1', title: 'Complete academic stress assessment', completed: false },
                        { id: 'ac1-2', title: 'Prioritize and reduce commitments', completed: false },
                        { id: 'ac1-3', title: 'Use study sessions effectively', completed: false },
                        { id: 'ac1-4', title: 'Practice stress management', completed: false }
                    ],
                    suggestedTools: ['student', 'coping', 'breathing'],
                    estimatedDays: 7
                },
                {
                    stage: 2,
                    name: 'Understand',
                    description: 'Identify academic stress patterns',
                    milestones: [
                        { id: 'ac2-1', title: 'Track study patterns for 1 week', completed: false },
                        { id: 'ac2-2', title: 'Identify stress triggers', completed: false },
                        { id: 'ac2-3', title: 'Assess workload realistically', completed: false },
                        { id: 'ac2-4', title: 'Journal about academic stress', completed: false }
                    ],
                    suggestedTools: ['student', 'journaling', 'patterns'],
                    estimatedDays: 14
                },
                {
                    stage: 3,
                    name: 'Build Skills',
                    description: 'Develop effective study habits',
                    milestones: [
                        { id: 'ac3-1', title: 'Use time-blocking for studying', completed: false },
                        { id: 'ac3-2', title: 'Practice Pomodoro technique', completed: false },
                        { id: 'ac3-3', title: 'Break tasks into smaller steps', completed: false },
                        { id: 'ac3-4', title: 'Set realistic academic goals', completed: false }
                    ],
                    suggestedTools: ['student', 'goals', 'habits'],
                    estimatedDays: 21
                },
                {
                    stage: 4,
                    name: 'Reconnect',
                    description: 'Balance academics with life',
                    milestones: [
                        { id: 'ac4-1', title: 'Schedule non-academic time', completed: false },
                        { id: 'ac4-2', title: 'Connect with peers socially', completed: false },
                        { id: 'ac4-3', title: 'Engage in non-academic hobby', completed: false },
                        { id: 'ac4-4', title: 'Practice self-care during exams', completed: false }
                    ],
                    suggestedTools: ['supportcircle', 'calmspace', 'goals'],
                    estimatedDays: 14
                },
                {
                    stage: 5,
                    name: 'Grow',
                    description: 'Maintain balance and thrive academically',
                    milestones: [
                        { id: 'ac5-1', title: 'Maintain work-life balance', completed: false },
                        { id: 'ac5-2', title: 'Use effective study strategies', completed: false },
                        { id: 'ac5-3', title: 'Help peers with study tips', completed: false },
                        { id: 'ac5-4', title: 'Celebrate academic achievements', completed: false }
                    ],
                    suggestedTools: ['student', 'goals', 'profile'],
                    estimatedDays: 30
                }
            ]
        }
    };
}

// ============================================
// ROADMAP MANAGEMENT
// ============================================

function startRoadmap(roadmapType) {
    const definition = Roadmaps.definitions[roadmapType];
    if (!definition) return;
    
    Roadmaps.data.active = {
        type: roadmapType,
        currentStage: 1,
        startDate: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 86 * 24 * 60 * 60 * 1000).toISOString(), // ~86 days
        progress: 0,
        milestones: definition.stages[0].milestones.map(m => ({ ...m })),
        customGoals: []
    };
    
    Roadmaps.data.progress[roadmapType] = {
        stage: 1,
        progress: 0,
        startDate: new Date().toISOString(),
        completedStages: []
    };
    
    saveRoadmapsData();
    
    showGentleMessage(`Started ${definition.name} roadmap. You're in Stage 1: ${definition.stages[0].name}`);
}

function completeMilestone(roadmapType, milestoneId) {
    const active = Roadmaps.data.active;
    if (!active || active.type !== roadmapType) return;
    
    const milestone = active.milestones.find(m => m.id === milestoneId);
    if (!milestone || milestone.completed) return;
    
    milestone.completed = true;
    milestone.completedAt = new Date().toISOString();
    
    // Update progress
    const totalMilestones = active.milestones.length;
    const completedMilestones = active.milestones.filter(m => m.completed).length;
    active.progress = (completedMilestones / totalMilestones) * 100;
    
    Roadmaps.data.progress[roadmapType].progress = active.progress;
    
    // Check if stage is complete
    const definition = Roadmaps.definitions[roadmapType];
    const currentStageDef = definition.stages[active.currentStage - 1];
    const stageMilestones = active.milestones.filter(m => currentStageDef.milestones.some(cm => cm.id === m.id));
    const stageCompleted = stageMilestones.every(m => m.completed);
    
    if (stageCompleted) {
        Roadmaps.data.progress[roadmapType].completedStages.push(active.currentStage);
        
        if (active.currentStage < 5) {
            active.currentStage++;
            Roadmaps.data.progress[roadmapType].stage = active.currentStage;
            
            // Add next stage milestones
            const nextStageDef = definition.stages[active.currentStage - 1];
            active.milestones = [
                ...active.milestones,
                ...nextStageDef.milestones.map(m => ({ ...m }))
            ];
            
            showGentleMessage(`Stage ${active.currentStage - 1} complete! Moving to Stage ${active.currentStage}: ${nextStageDef.name}`);
        } else {
            // Roadmap complete
            completeRoadmap(roadmapType);
        }
    }
    
    saveRoadmapsData();
}

function completeRoadmap(roadmapType) {
    const active = Roadmaps.data.active;
    if (!active || active.type !== roadmapType) return;
    
    active.progress = 100;
    active.completedAt = new Date().toISOString();
    
    // Add to history
    Roadmaps.data.history.push({
        id: generateId(),
        type: roadmapType,
        startDate: active.startDate,
        endDate: active.completedAt,
        finalStage: active.currentStage,
        completed: true,
        milestonesCompleted: active.milestones.filter(m => m.completed).length
    });
    
    // Clear active
    Roadmaps.data.active = null;
    
    saveRoadmapsData();
    
    showGentleMessage('Congratulations! You completed the recovery roadmap!');
    
    // Check for achievement
    unlockAchievement('roadmap-complete');
}

function abandonRoadmap() {
    if (!Roadmaps.data.active) return;
    
    const type = Roadmaps.data.active.type;
    
    Roadmaps.data.history.push({
        id: generateId(),
        type: type,
        startDate: Roadmaps.data.active.startDate,
        endDate: new Date().toISOString(),
        finalStage: Roadmaps.data.active.currentStage,
        completed: false,
        milestonesCompleted: Roadmaps.data.active.milestones.filter(m => m.completed).length
    });
    
    Roadmaps.data.active = null;
    
    saveRoadmapsData();
    
    showGentleMessage('Roadmap abandoned. You can start again anytime.');
}

function getRecommendedRoadmap() {
    // Analyze user data to recommend appropriate roadmap
    const assessments = MindHaven.userData.assessments || {};
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (assessments.lifeAssessments && assessments.lifeAssessments.length > 0) {
        const latest = assessments.lifeAssessments[assessments.lifeAssessments.length - 1];
        const scores = latest.scores || {};
        
        // Find lowest scoring dimension
        let lowestScore = 5;
        let lowestDimension = null;
        
        Object.entries(scores).forEach(([dimension, score]) => {
            if (score < lowestScore) {
                lowestScore = score;
                lowestDimension = dimension;
            }
        });
        
        // Map dimension to roadmap
        const dimensionMap = {
            anxiety: 'anxiety',
            depression: 'depression',
            stress: 'burnout',
            social: 'loneliness',
            academic: 'academic'
        };
        
        if (dimensionMap[lowestDimension]) {
            return dimensionMap[lowestDimension];
        }
    }
    
    // Fall back to check-in analysis
    const moodCounts = {};
    checkIns.forEach(checkIn => {
        const mood = checkIn.mood || (Array.isArray(checkIn.moods) ? checkIn.moods[0] : null);
        if (mood) {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        }
    });
    
    const mostCommon = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    if (mostCommon) {
        const moodMap = {
            anxious: 'anxiety',
            overthinking: 'anxiety',
            low: 'depression',
            numb: 'depression',
            overwhelmed: 'burnout',
            exhausted: 'burnout'
        };
        
        if (moodMap[mostCommon[0]]) {
            return moodMap[mostCommon[0]];
        }
    }
    
    return null;
}

// ============================================
// ROADMAP DASHBOARD
// ============================================

function renderRoadmapsDashboard() {
    const container = document.getElementById('roadmaps-dashboard');
    if (!container) return;
    
    const active = Roadmaps.data.active;
    const recommended = getRecommendedRoadmap();
    
    let html = `
        <div class="roadmaps-dashboard">
            <div class="roadmaps-header">
                <h2>Recovery Roadmaps</h2>
                <p>Structured journeys to support your mental wellness</p>
            </div>
            
            ${active ? renderActiveRoadmap(active) : renderRoadmapSelection(recommended)}
            
            <div class="roadmaps-section">
                <h3>Available Roadmaps</h3>
                ${renderAvailableRoadmaps()}
            </div>
            
            ${Roadmaps.data.history.length > 0 ? `
                <div class="roadmaps-section">
                    <h3>History</h3>
                    ${renderRoadmapHistory()}
                </div>
            ` : ''}
        </div>
    `;
    
    container.innerHTML = html;
}

function renderActiveRoadmap(active) {
    const definition = Roadmaps.definitions[active.type];
    const currentStageDef = definition.stages[active.currentStage - 1];
    
    return `
        <div class="active-roadmap">
            <div class="roadmap-header">
                <span class="roadmap-icon">${definition.icon}</span>
                <div class="roadmap-info">
                    <h3>${definition.name}</h3>
                    <p>Stage ${active.currentStage}/5: ${currentStageDef.name}</p>
                </div>
                <button class="secondary-btn" onclick="abandonRoadmap(); renderRoadmapsDashboard();">Leave Roadmap</button>
            </div>
            
            <div class="roadmap-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${active.progress}%"></div>
                </div>
                <span class="progress-text">${active.progress.toFixed(0)}% complete</span>
            </div>
            
            <div class="roadmap-stage">
                <h4>${currentStageDef.name}</h4>
                <p>${currentStageDef.description}</p>
                
                <div class="stage-milestones">
                    ${currentStageDef.milestones.map(milestone => {
                        const activeMilestone = active.milestones.find(m => m.id === milestone.id);
                        const isCompleted = activeMilestone && activeMilestone.completed;
                        return `
                            <label class="milestone-checkbox ${isCompleted ? 'completed' : ''}">
                                <input type="checkbox" 
                                       ${isCompleted ? 'checked' : ''} 
                                       onchange="completeMilestone('${active.type}', '${milestone.id}')"
                                       ${isCompleted ? 'disabled' : ''}>
                                <span>${milestone.title}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
                
                <div class="stage-tools">
                    <p><strong>Suggested tools:</strong></p>
                    <div class="tool-suggestions">
                        ${currentStageDef.suggestedTools.map(tool => `
                            <button class="tool-suggestion-btn" onclick="launchRoadmapTool('${tool}')">${formatToolName(tool)}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="roadmap-stages-overview">
                <h4>All Stages</h4>
                <div class="stages-list">
                    ${definition.stages.map((stage, index) => {
                        const isCurrent = index + 1 === active.currentStage;
                        const isPast = index + 1 < active.currentStage;
                        return `
                            <div class="stage-item ${isCurrent ? 'current' : ''} ${isPast ? 'completed' : ''}">
                                <span class="stage-number">${index + 1}</span>
                                <span class="stage-name">${stage.name}</span>
                                ${isPast ? '<span class="stage-status">✓</span>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderRoadmapSelection(recommended) {
    return `
        <div class="roadmap-selection">
            ${recommended ? `
                <div class="recommendation-card">
                    <h3>Recommended for You</h3>
                    <p>Based on your data, we recommend starting with:</p>
                    <button class="primary-btn" onclick="startRoadmap('${recommended}'); renderRoadmapsDashboard();">
                        ${Roadmaps.definitions[recommended].icon} ${Roadmaps.definitions[recommended].name}
                    </button>
                </div>
            ` : `
                <div class="empty-state">
                    <p>Choose a roadmap to begin your structured recovery journey.</p>
                </div>
            `}
        </div>
    `;
}

function renderAvailableRoadmaps() {
    let html = '<div class="roadmaps-grid">';
    
    Object.entries(Roadmaps.definitions).forEach(([type, definition]) => {
        const progress = Roadmaps.data.progress[type];
        const hasProgress = progress && progress.stage > 0;
        
        html += `
            <div class="roadmap-card" style="border-color: ${definition.color}">
                <span class="roadmap-card-icon">${definition.icon}</span>
                <h4>${definition.name}</h4>
                <p>${definition.description}</p>
                ${hasProgress ? `
                    <p class="roadmap-progress-text">Progress: Stage ${progress.stage}/5</p>
                ` : ''}
                <button class="primary-btn" onclick="startRoadmap('${type}'); renderRoadmapsDashboard();">
                    ${hasProgress ? 'Continue' : 'Start'}
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

function renderRoadmapHistory() {
    let html = '<div class="history-list">';
    
    Roadmaps.data.history.slice(-5).reverse().forEach(entry => {
        const definition = Roadmaps.definitions[entry.type];
        html += `
            <div class="history-item">
                <span class="history-icon">${definition.icon}</span>
                <div class="history-info">
                    <span class="history-name">${definition.name}</span>
                    <span class="history-dates">${new Date(entry.startDate).toLocaleDateString()} - ${new Date(entry.endDate).toLocaleDateString()}</span>
                </div>
                <span class="history-status ${entry.completed ? 'completed' : 'abandoned'}">
                    ${entry.completed ? '✓ Completed' : '✕ Abandoned'}
                </span>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

function launchRoadmapTool(tool) {
    const toolMappings = {
        breathing: () => navigateTo('coping', 'breathing'),
        grounding: () => navigateTo('coping', 'grounding'),
        safetyplan: () => navigateTo('safetyplan'),
        journaling: () => navigateTo('journal'),
        patterns: () => navigateTo('patterns'),
        profile: () => navigateTo('profile'),
        lowEnergy: () => navigateTo('coping', 'low-energy'),
        calmSpace: () => navigateTo('calmspace'),
        supportcircle: () => navigateTo('supportcircle'),
        goals: () => navigateTo('goals'),
        habits: () => navigateTo('goals'),
        coping: () => navigateTo('coping'),
        mentalhealth: () => navigateTo('mentalhealth'),
        student: () => navigateTo('student'),
        checkin: () => navigateTo('dashboard')
    };
    
    const launch = toolMappings[tool];
    if (launch) {
        launch();
    }
}

function formatToolName(tool) {
    const names = {
        breathing: 'Breathing',
        grounding: 'Grounding',
        safetyplan: 'Safety Plan',
        journaling: 'Journaling',
        patterns: 'Patterns',
        profile: 'Profile',
        lowEnergy: 'Low Energy',
        calmSpace: 'Calm Space',
        supportcircle: 'Support Circle',
        goals: 'Goals',
        habits: 'Habits',
        coping: 'Coping Tools',
        mentalhealth: 'Mental Health Hub',
        student: 'Student Hub',
        checkin: 'Check-in'
    };
    return names[tool] || tool;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.initializeRoadmaps = initializeRoadmaps;
window.startRoadmap = startRoadmap;
window.completeMilestone = completeMilestone;
window.abandonRoadmap = abandonRoadmap;
window.getRecommendedRoadmap = getRecommendedRoadmap;
window.renderRoadmapsDashboard = renderRoadmapsDashboard;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeRoadmaps();
});
