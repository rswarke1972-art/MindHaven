# MindHaven Intelligence Layer - Data Schema Design

## Overview
This document defines the data schema extensions for the 5 new intelligence systems.

## System 1: Personal Mental Health Profile

### Data Location
`userData.profile`

### Schema Structure
```javascript
profile: {
    // Emotional Analysis
    commonEmotions: {
        // Most frequent emotions from check-ins
        emotions: {
            calm: { count: 0, percentage: 0 },
            anxious: { count: 0, percentage: 0 },
            low: { count: 0, percentage: 0 },
            // ... all mood types
        },
        lastAnalyzed: null
    },
    
    // Mood Trends
    moodPatterns: {
        weeklyTrend: 'stable' | 'improving' | 'declining',
        monthlyTrend: 'stable' | 'improving' | 'declining',
        bestDayOfWeek: null,
        worstDayOfWeek: null,
        averageMoodScore: 0,
        moodVolatility: 0
    },
    
    // Stress & Anxiety Indicators
    stressIndicators: {
        averageStressLevel: 0,
        stressTriggers: [],
        stressPatterns: {
            timeOfDay: [],
            dayOfWeek: [],
            monthlyPatterns: []
        }
    },
    
    // Coping Tool Effectiveness
    copingEffectiveness: {
        breathing: { uses: 0, successRate: 0, avgMoodChange: 0 },
        journaling: { uses: 0, successRate: 0, avgMoodChange: 0 },
        grounding: { uses: 0, successRate: 0, avgMoodChange: 0 },
        calmSpace: { uses: 0, successRate: 0, avgMoodChange: 0 },
        // ... other tools
    },
    
    // Habit Consistency
    habitConsistency: {
        overallConsistency: 0,
        strongestHabits: [],
        weakestHabits: [],
        streakHistory: []
    },
    
    // Goal Completion Behavior
    goalBehavior: {
        completionRate: 0,
        averageCompletionTime: 0,
        preferredGoalTypes: [],
        abandonedGoals: 0
    },
    
    // Journaling Behavior
    journalingBehavior: {
        frequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily',
        averageEntryLength: 0,
        commonThemes: [],
        sentimentTrend: 'stable' | 'improving' | 'declining'
    },
    
    // Academic Stress Indicators
    academicStress: {
        examStressLevel: 0,
        studyEffectiveness: 0,
        burnoutRisk: 'low' | 'medium' | 'high',
        studyPatterns: []
    },
    
    // Wellness Strengths
    strengths: {
        emotional: [],
        physical: [],
        social: [],
        academic: [],
        habits: []
    },
    
    // Wellness Challenges
    challenges: {
        emotional: [],
        physical: [],
        social: [],
        academic: [],
        habits: []
    },
    
    // Personalized Insights
    insights: [
        {
            id: 'string',
            text: 'string',
            type: 'strength' | 'challenge' | 'pattern' | 'recommendation',
            confidence: 0,
            createdAt: 'ISODate',
            supportingData: {}
        }
    ],
    
    // Growth Areas
    growthAreas: [
        {
            area: 'string',
            currentLevel: 0,
            targetLevel: 0,
            recommendations: []
        }
    ],
    
    // Last Updated
    lastUpdated: null
}
```

## System 2: Trigger & Pattern Detection Engine

### Data Location
`userData.profile.triggerPatterns`

### Schema Structure
```javascript
triggerPatterns: {
    // Detected Patterns
    patterns: [
        {
            id: 'string',
            type: 'correlation' | 'sequence' | 'cyclical',
            trigger: 'string',
            effect: 'string',
            description: 'string',
            confidence: 0, // 0-1
            strength: 0, // 0-1
            frequency: 0,
            examples: [],
            firstDetected: 'ISODate',
            lastObserved: 'ISODate'
        }
    ],
    
    // Correlations
    correlations: {
        sleepMood: { correlation: 0, confidence: 0, sampleSize: 0 },
        journalingMood: { correlation: 0, confidence: 0, sampleSize: 0 },
        exerciseMood: { correlation: 0, confidence: 0, sampleSize: 0 },
        socialMood: { correlation: 0, confidence: 0, sampleSize: 0 },
        studyStress: { correlation: 0, confidence: 0, sampleSize: 0 },
        habitMood: { correlation: 0, confidence: 0, sampleSize: 0 }
    },
    
    // Time-based Patterns
    timePatterns: {
        daily: {
            morning: { avgMood: 0, avgStress: 0 },
            afternoon: { avgMood: 0, avgStress: 0 },
            evening: { avgMood: 0, avgStress: 0 },
            night: { avgMood: 0, avgStress: 0 }
        },
        weekly: {
            monday: { avgMood: 0, avgStress: 0 },
            tuesday: { avgMood: 0, avgStress: 0 },
            // ... other days
        },
        monthly: {
            firstWeek: { avgMood: 0, avgStress: 0 },
            secondWeek: { avgMood: 0, avgStress: 0 },
            thirdWeek: { avgMood: 0, avgStress: 0 },
            fourthWeek: { avgMood: 0, avgStress: 0 }
        }
    },
    
    // Sequence Patterns
    sequences: [
        {
            id: 'string',
            events: [
                { type: 'string', value: 'string', timeOffset: 0 }
            ],
            confidence: 0,
            occurrences: 0
        }
    ],
    
    // Last Analysis
    lastAnalyzed: null
}
```

## System 3: What Helped Before Engine

### Data Location
`userData.profile.copingEffectiveness`

### Schema Structure
```javascript
copingEffectiveness: {
    // Historical Effectiveness
    history: [
        {
            id: 'string',
            date: 'ISODate',
            initialMood: 'string',
            moodScore: 0,
            toolUsed: 'string',
            postMood: 'string',
            postMoodScore: 0,
            moodChange: 0,
            timeToImprovement: 0, // minutes
            effectiveness: 'high' | 'medium' | 'low' | 'none',
            context: {
                stressLevel: 0,
                anxietyLevel: 0,
                timeOfDay: 'string',
                dayOfWeek: 'string'
            }
        }
    ],
    
    // Tool Rankings by Situation
    toolRankings: {
        highAnxiety: [
            { tool: 'breathing', successRate: 0, avgImprovement: 0 },
            { tool: 'grounding', successRate: 0, avgImprovement: 0 },
            // ...
        ],
        lowMood: [
            { tool: 'journaling', successRate: 0, avgImprovement: 0 },
            // ...
        ],
        overwhelm: [
            { tool: 'microGoals', successRate: 0, avgImprovement: 0 },
            // ...
        ],
        // ... other situations
    },
    
    // Personal Recommendations
    recommendations: [
        {
            situation: 'string',
            recommendedTools: ['string'],
            confidence: 0,
            basedOnData: 0 // sample size
        }
    ],
    
    // Tool Effectiveness Summary
    toolSummary: {
        breathing: { totalUses: 0, avgImprovement: 0, successRate: 0 },
        journaling: { totalUses: 0, avgImprovement: 0, successRate: 0 },
        grounding: { totalUses: 0, avgImprovement: 0, successRate: 0 },
        calmSpace: { totalUses: 0, avgImprovement: 0, successRate: 0 },
        supportContact: { totalUses: 0, avgImprovement: 0, successRate: 0 },
        exercise: { totalUses: 0, avgImprovement: 0, successRate: 0 },
        // ... other tools
    },
    
    // Last Updated
    lastUpdated: null
}
```

## System 4: Recovery Roadmaps

### Data Location
`userData.roadmaps`

### Schema Structure
```javascript
roadmaps: {
    // Active Roadmap
    active: {
        type: 'anxiety' | 'depression' | 'burnout' | 'loneliness' | 'adhd' | 'ocd' | 'academic',
        currentStage: 1, // 1-5
        startDate: 'ISODate',
        estimatedCompletion: 'ISODate',
        progress: 0, // 0-100
        milestones: [
            {
                id: 'string',
                title: 'string',
                stage: 1,
                completed: false,
                completedAt: null
            }
        ],
        customGoals: []
    },
    
    // Progress Tracking
    progress: {
        anxiety: { stage: 0, progress: 0, startDate: null, completedStages: [] },
        depression: { stage: 0, progress: 0, startDate: null, completedStages: [] },
        burnout: { stage: 0, progress: 0, startDate: null, completedStages: [] },
        loneliness: { stage: 0, progress: 0, startDate: null, completedStages: [] },
        adhd: { stage: 0, progress: 0, startDate: null, completedStages: [] },
        ocd: { stage: 0, progress: 0, startDate: null, completedStages: [] },
        academic: { stage: 0, progress: 0, startDate: null, completedStages: [] }
    },
    
    // Roadmap History
    history: [
        {
            id: 'string',
            type: 'string',
            startDate: 'ISODate',
            endDate: 'ISODate',
            finalStage: 0,
            completed: false,
            milestonesCompleted: 0
        }
    ],
    
    // Roadmap Definitions
    definitions: {
        anxiety: {
            stages: [
                {
                    stage: 1,
                    name: 'Stabilize',
                    description: 'Learn to manage immediate symptoms',
                    milestones: [
                        'Complete anxiety assessment',
                        'Practice breathing exercises 5 times',
                        'Identify 3 triggers',
                        'Create emergency coping plan'
                    ],
                    suggestedTools: ['breathing', 'grounding', 'safetyplan']
                },
                {
                    stage: 2,
                    name: 'Understand',
                    description: 'Learn about anxiety and your patterns',
                    milestones: [
                        'Read Anxiety Hub content',
                        'Identify thought patterns',
                        'Track anxiety for 2 weeks',
                        'Complete pattern analysis'
                    ],
                    suggestedTools: ['journaling', 'patterns', 'profile']
                },
                {
                    stage: 3,
                    name: 'Build Skills',
                    description: 'Develop coping strategies',
                    milestones: [
                        'Practice 3 different coping techniques',
                        'Complete 10 journal entries',
                        'Build support circle',
                        'Establish daily routine'
                    ],
                    suggestedTools: ['journaling', 'supportcircle', 'goals']
                },
                {
                    stage: 4,
                    name: 'Reconnect',
                    description: 'Rebuild connections and activities',
                    milestones: [
                        'Reach out to 3 people',
                        'Resume one enjoyable activity',
                        'Join a group or community',
                        'Share experience with someone'
                    ],
                    suggestedTools: ['supportcircle', 'goals']
                },
                {
                    stage: 5,
                    name: 'Grow',
                    description: 'Maintain progress and thrive',
                    milestones: [
                        'Maintain 30-day streak',
                        'Help someone else',
                        'Set long-term wellness goals',
                        'Create relapse prevention plan'
                    ],
                    suggestedTools: ['goals', 'habits', 'profile']
                }
            ]
        },
        depression: { /* similar structure */ },
        burnout: { /* similar structure */ },
        loneliness: { /* similar structure */ },
        adhd: { /* similar structure */ },
        ocd: { /* similar structure */ },
        academic: { /* similar structure */ }
    }
}
```

## System 5: Emotional Timeline

### Data Location
`userData.timeline`

### Schema Structure
```javascript
timeline: {
    // All Events
    events: [
        {
            id: 'string',
            type: 'checkin' | 'journal' | 'assessment' | 'goal' | 'habit' | 'achievement' | 
                  'roadmap' | 'emergency' | 'support' | 'milestone' | 'insight' | 'pattern',
            date: 'ISODate',
            title: 'string',
            description: 'string',
            data: {}, // Event-specific data
            mood: 'string',
            moodScore: 0,
            category: 'string',
            importance: 'low' | 'medium' | 'high'
        }
    ],
    
    // Milestones
    milestones: [
        {
            id: 'string',
            title: 'string',
            date: 'ISODate',
            type: 'achievement' | 'breakthrough' | 'challenge' | 'recovery',
            description: 'string',
            relatedEvents: ['string'] // event IDs
        }
    ],
    
    // Statistics
    stats: {
        totalEvents: 0,
        eventsByType: {},
        eventsByCategory: {},
        averageMoodByMonth: {},
        mostActiveMonths: [],
        longestStreaks: []
    },
    
    // Filters
    filters: {
        types: [],
        categories: [],
        dateRange: { start: null, end: null },
        mood: []
    },
    
    // Last Updated
    lastUpdated: null
}
```

## Migration Strategy

### Schema Version Update
Update from `2.0.0` to `3.0.0`

### Migration Steps
1. Initialize new profile structure if not exists
2. Initialize triggerPatterns if not exists
3. Expand copingEffectiveness structure
4. Initialize roadmaps with definitions
5. Initialize timeline structure
6. Migrate existing data to new formats where applicable
7. Backfill historical events for timeline

## Dependency Map

```
Profile (System 1)
  ├─ Depends on: checkIns, journalEntries, assessments, goals, habits, student data
  ├─ Provides data to: Patterns, WhatHelped
  
Patterns (System 2)
  ├─ Depends on: Profile data, checkIns, journal, goals, habits
  ├─ Provides data to: Profile, WhatHelped
  
WhatHelped (System 3)
  ├─ Depends on: Profile, Patterns, checkIns, coping tool usage
  ├─ Provides data to: Profile, Dashboard, Emergency
  
Roadmaps (System 4)
  ├─ Depends on: Profile, Patterns, assessments
  ├─ Provides data to: Timeline, Profile
  
Timeline (System 5)
  ├─ Depends on: All systems
  ├─ Provides data to: Profile, Insights
```

## Implementation Priority
1. Profile (Foundation)
2. Patterns (Builds on Profile)
3. WhatHelped (Builds on Profile + Patterns)
4. Roadmaps (Independent but uses Profile/Patterns)
5. Timeline (Aggregates all data)
