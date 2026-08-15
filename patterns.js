// ============================================
// MINDHAVEN - Trigger & Pattern Detection Engine
// ============================================

// Patterns State
const Patterns = {
    data: null,
    lastAnalyzed: null
};

// Initialize Patterns Module
function initializePatterns() {
    console.log('🔍 Initializing Trigger & Pattern Detection Engine...');
    loadPatternsData();
    analyzePatterns();
    console.log('✅ Trigger & Pattern Detection Engine initialized');
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadPatternsData() {
    if (MindHaven.userData.profile && MindHaven.userData.profile.triggerPatterns) {
        Patterns.data = MindHaven.userData.profile.triggerPatterns;
    } else {
        Patterns.data = initializePatternsStructure();
    }
}

function initializePatternsStructure() {
    return {
        patterns: [],
        correlations: {
            sleepMood: { correlation: 0, confidence: 0, sampleSize: 0 },
            journalingMood: { correlation: 0, confidence: 0, sampleSize: 0 },
            exerciseMood: { correlation: 0, confidence: 0, sampleSize: 0 },
            socialMood: { correlation: 0, confidence: 0, sampleSize: 0 },
            studyStress: { correlation: 0, confidence: 0, sampleSize: 0 },
            habitMood: { correlation: 0, confidence: 0, sampleSize: 0 }
        },
        timePatterns: {
            daily: {
                morning: { avgMood: 0, avgStress: 0, count: 0 },
                afternoon: { avgMood: 0, avgStress: 0, count: 0 },
                evening: { avgMood: 0, avgStress: 0, count: 0 },
                night: { avgMood: 0, avgStress: 0, count: 0 }
            },
            weekly: {
                monday: { avgMood: 0, avgStress: 0, count: 0 },
                tuesday: { avgMood: 0, avgStress: 0, count: 0 },
                wednesday: { avgMood: 0, avgStress: 0, count: 0 },
                thursday: { avgMood: 0, avgStress: 0, count: 0 },
                friday: { avgMood: 0, avgStress: 0, count: 0 },
                saturday: { avgMood: 0, avgStress: 0, count: 0 },
                sunday: { avgMood: 0, avgStress: 0, count: 0 }
            },
            monthly: {
                firstWeek: { avgMood: 0, avgStress: 0, count: 0 },
                secondWeek: { avgMood: 0, avgStress: 0, count: 0 },
                thirdWeek: { avgMood: 0, avgStress: 0, count: 0 },
                fourthWeek: { avgMood: 0, avgStress: 0, count: 0 }
            }
        },
        sequences: [],
        lastAnalyzed: null
    };
}

function savePatternsData() {
    if (!MindHaven.userData.profile) {
        MindHaven.userData.profile = {};
    }
    MindHaven.userData.profile.triggerPatterns = Patterns.data;
    saveUserData();
}

// ============================================
// PATTERN ANALYSIS
// ============================================

function analyzePatterns() {
    // Analyze correlations
    analyzeCorrelations();
    
    // Analyze time patterns
    analyzeTimePatterns();
    
    // Detect sequences
    detectSequences();
    
    // Discover patterns
    discoverPatterns();
    
    // Save and update timestamp
    Patterns.data.lastAnalyzed = new Date().toISOString();
    savePatternsData();
}

function analyzeCorrelations() {
    const checkIns = MindHaven.userData.checkIns || [];
    const journalEntries = MindHaven.userData.journalEntries || [];
    const goals = MindHaven.userData.goals || {};
    const student = MindHaven.userData.student || {};
    
    if (checkIns.length < 5) return;
    
    // Analyze journaling vs mood correlation
    analyzeJournalingMoodCorrelation(journalEntries, checkIns);
    
    // Analyze habit completion vs mood correlation
    analyzeHabitMoodCorrelation(goals.habits || [], checkIns);
    
    // Analyze study vs stress correlation
    analyzeStudyStressCorrelation(student.studySessions || [], student.burnoutAssessments || [], checkIns);
    
    // Analyze social interactions vs mood
    analyzeSocialMoodCorrelation(checkIns);
}

function analyzeJournalingMoodCorrelation(journalEntries, checkIns) {
    if (journalEntries.length < 3 || checkIns.length < 5) return;
    
    // Find check-ins on days with journaling vs without
    const journalDays = new Set(journalEntries.map(e => new Date(e.date).toDateString()));
    
    const journalDayMoods = [];
    const nonJournalDayMoods = [];
    
    const moodScores = {
        calm: 5,
        okay: 4,
        anxious: 2,
        low: 2,
        exhausted: 1,
        overwhelmed: 1,
        numb: 2,
        overthinking: 2
    };
    
    checkIns.forEach(checkIn => {
        const date = new Date(checkIn.timestamp || checkIn.date).toDateString();
        let score = 0;
        
        if (Array.isArray(checkIn.moods)) {
            checkIn.moods.forEach(mood => {
                if (moodScores[mood]) score += moodScores[mood];
            });
            score /= checkIn.moods.length;
        } else if (checkIn.mood && moodScores[checkIn.mood]) {
            score = moodScores[checkIn.mood];
        }
        
        if (journalDays.has(date)) {
            journalDayMoods.push(score);
        } else {
            nonJournalDayMoods.push(score);
        }
    });
    
    if (journalDayMoods.length >= 3 && nonJournalDayMoods.length >= 3) {
        const journalAvg = journalDayMoods.reduce((a, b) => a + b, 0) / journalDayMoods.length;
        const nonJournalAvg = nonJournalDayMoods.reduce((a, b) => a + b, 0) / nonJournalDayMoods.length;
        
        // Simple correlation: difference in averages
        const correlation = (journalAvg - nonJournalAvg) / 5; // Normalize to -1 to 1
        const confidence = Math.min(journalDayMoods.length, nonJournalDayMoods.length) / 10;
        
        Patterns.data.correlations.journalingMood = {
            correlation: correlation.toFixed(2),
            confidence: Math.min(confidence, 1).toFixed(2),
            sampleSize: journalDayMoods.length + nonJournalDayMoods.length
        };
        
        // Add pattern if significant
        if (Math.abs(correlation) > 0.3) {
            addPattern('correlation', 'journaling', 'mood', 
                correlation > 0 ? 'Journaling is associated with better mood' : 'Journaling is associated with lower mood',
                Math.abs(correlation),
                confidence
            );
        }
    }
}

function analyzeHabitMoodCorrelation(habits, checkIns) {
    if (habits.length === 0 || checkIns.length < 5) return;
    
    const moodScores = {
        calm: 5,
        okay: 4,
        anxious: 2,
        low: 2,
        exhausted: 1,
        overwhelmed: 1,
        numb: 2,
        overthinking: 2
    };
    
    // For each habit, check mood on days it was completed
    habits.forEach(habit => {
        if (!habit.completions || habit.completions.length < 3) return;
        
        const completionDays = new Set(habit.completions);
        const habitDayMoods = [];
        const nonHabitDayMoods = [];
        
        checkIns.forEach(checkIn => {
            const date = new Date(checkIn.timestamp || checkIn.date).toDateString();
            let score = 0;
            
            if (Array.isArray(checkIn.moods)) {
                checkIn.moods.forEach(mood => {
                    if (moodScores[mood]) score += moodScores[mood];
                });
                score /= checkIn.moods.length;
            } else if (checkIn.mood && moodScores[checkIn.mood]) {
                score = moodScores[checkIn.mood];
            }
            
            if (completionDays.has(date)) {
                habitDayMoods.push(score);
            } else {
                nonHabitDayMoods.push(score);
            }
        });
        
        if (habitDayMoods.length >= 3 && nonHabitDayMoods.length >= 3) {
            const habitAvg = habitDayMoods.reduce((a, b) => a + b, 0) / habitDayMoods.length;
            const nonHabitAvg = nonHabitDayMoods.reduce((a, b) => a + b, 0) / nonHabitDayMoods.length;
            
            const correlation = (habitAvg - nonHabitAvg) / 5;
            
            if (Math.abs(correlation) > 0.3) {
                addPattern('correlation', habit.name, 'mood',
                    correlation > 0 ? `Completing "${habit.name}" is associated with better mood` : `Completing "${habit.name}" is associated with lower mood`,
                    Math.abs(correlation),
                    Math.min(habitDayMoods.length, nonHabitDayMoods.length) / 10
                );
            }
        }
    });
    
    // Overall habit correlation
    const allHabitCompletions = habits.flatMap(h => h.completions || []);
    if (allHabitCompletions.length >= 3) {
        Patterns.data.correlations.habitMood.sampleSize = allHabitCompletions.length;
    }
}

function analyzeStudyStressCorrelation(studySessions, burnoutAssessments, checkIns) {
    if (studySessions.length < 3 || checkIns.length < 5) return;
    
    const stressMoods = ['anxious', 'overwhelmed', 'overthinking'];
    const studyDays = new Set(studySessions.map(s => new Date(s.date).toDateString()));
    
    let studyDayStress = 0;
    let studyDayCount = 0;
    let nonStudyDayStress = 0;
    let nonStudyDayCount = 0;
    
    checkIns.forEach(checkIn => {
        const date = new Date(checkIn.timestamp || checkIn.date).toDateString();
        let hasStress = false;
        
        if (Array.isArray(checkIn.moods)) {
            hasStress = checkIn.moods.some(m => stressMoods.includes(m));
        } else if (checkIn.mood) {
            hasStress = stressMoods.includes(checkIn.mood);
        }
        
        if (studyDays.has(date)) {
            if (hasStress) studyDayStress++;
            studyDayCount++;
        } else {
            if (hasStress) nonStudyDayStress++;
            nonStudyDayCount++;
        }
    });
    
    if (studyDayCount >= 3 && nonStudyDayCount >= 3) {
        const studyStressRate = studyDayStress / studyDayCount;
        const nonStudyStressRate = nonStudyDayStress / nonStudyDayCount;
        
        const correlation = (studyStressRate - nonStudyStressRate);
        
        Patterns.data.correlations.studyStress = {
            correlation: correlation.toFixed(2),
            confidence: Math.min(studyDayCount, nonStudyDayCount) / 10,
            sampleSize: studyDayCount + nonStudyDayCount
        };
        
        if (Math.abs(correlation) > 0.2) {
            addPattern('correlation', 'study', 'stress',
                correlation > 0 ? 'Study sessions are associated with higher stress' : 'Study sessions are associated with lower stress',
                Math.abs(correlation),
                Math.min(studyDayCount, nonStudyDayCount) / 10
            );
        }
    }
}

function analyzeSocialMoodCorrelation(checkIns) {
    // Analyze if reaching out to support circle correlates with mood
    const support = MindHaven.userData.support || {};
    const circle = support.circle || [];
    
    if (circle.length === 0 || checkIns.length < 5) return;
    
    // This is a simplified analysis - in production, we'd track actual social interactions
    // For now, we'll infer from journal entries mentioning social keywords
    const journalEntries = MindHaven.userData.journalEntries || [];
    const socialKeywords = ['friend', 'family', 'talk', 'call', 'meet', 'social', 'connect', 'together'];
    
    const socialDays = new Set();
    journalEntries.forEach(entry => {
        const content = entry.content.toLowerCase();
        if (socialKeywords.some(keyword => content.includes(keyword))) {
            socialDays.add(new Date(entry.date).toDateString());
        }
    });
    
    if (socialDays.size < 3) return;
    
    const moodScores = {
        calm: 5,
        okay: 4,
        anxious: 2,
        low: 2,
        exhausted: 1,
        overwhelmed: 1,
        numb: 2,
        overthinking: 2
    };
    
    const socialDayMoods = [];
    const nonSocialDayMoods = [];
    
    checkIns.forEach(checkIn => {
        const date = new Date(checkIn.timestamp || checkIn.date).toDateString();
        let score = 0;
        
        if (Array.isArray(checkIn.moods)) {
            checkIn.moods.forEach(mood => {
                if (moodScores[mood]) score += moodScores[mood];
            });
            score /= checkIn.moods.length;
        } else if (checkIn.mood && moodScores[checkIn.mood]) {
            score = moodScores[checkIn.mood];
        }
        
        if (socialDays.has(date)) {
            socialDayMoods.push(score);
        } else {
            nonSocialDayMoods.push(score);
        }
    });
    
    if (socialDayMoods.length >= 3 && nonSocialDayMoods.length >= 3) {
        const socialAvg = socialDayMoods.reduce((a, b) => a + b, 0) / socialDayMoods.length;
        const nonSocialAvg = nonSocialDayMoods.reduce((a, b) => a + b, 0) / nonSocialDayMoods.length;
        
        const correlation = (socialAvg - nonSocialAvg) / 5;
        
        Patterns.data.correlations.socialMood = {
            correlation: correlation.toFixed(2),
            confidence: Math.min(socialDayMoods.length, nonSocialDayMoods.length) / 10,
            sampleSize: socialDayMoods.length + nonSocialDayMoods.length
        };
        
        if (Math.abs(correlation) > 0.3) {
            addPattern('correlation', 'social', 'mood',
                correlation > 0 ? 'Social interactions are associated with better mood' : 'Social interactions are associated with lower mood',
                Math.abs(correlation),
                Math.min(socialDayMoods.length, nonSocialDayMoods.length) / 10
            );
        }
    }
}

function analyzeTimePatterns() {
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length < 7) return;
    
    const moodScores = {
        calm: 5,
        okay: 4,
        anxious: 2,
        low: 2,
        exhausted: 1,
        overwhelmed: 1,
        numb: 2,
        overthinking: 2
    };
    
    const stressMoods = ['anxious', 'overwhelmed', 'overthinking'];
    
    // Analyze daily patterns
    checkIns.forEach(checkIn => {
        const date = new Date(checkIn.timestamp || checkIn.date);
        const hour = date.getHours();
        const dayOfWeek = date.getDay();
        const dayOfMonth = date.getDate();
        
        let moodScore = 0;
        let hasStress = false;
        
        if (Array.isArray(checkIn.moods)) {
            checkIn.moods.forEach(mood => {
                if (moodScores[mood]) moodScore += moodScores[mood];
                if (stressMoods.includes(mood)) hasStress = true;
            });
            moodScore /= checkIn.moods.length;
        } else if (checkIn.mood) {
            moodScore = moodScores[checkIn.mood] || 0;
            hasStress = stressMoods.includes(checkIn.mood);
        }
        
        // Time of day
        let timeOfDay;
        if (hour >= 5 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
        else timeOfDay = 'night';
        
        const daily = Patterns.data.timePatterns.daily[timeOfDay];
        daily.avgMood = (daily.avgMood * daily.count + moodScore) / (daily.count + 1);
        daily.avgStress = (daily.avgStress * daily.count + (hasStress ? 1 : 0)) / (daily.count + 1);
        daily.count++;
        
        // Day of week
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const weekly = Patterns.data.timePatterns.weekly[days[dayOfWeek]];
        weekly.avgMood = (weekly.avgMood * weekly.count + moodScore) / (weekly.count + 1);
        weekly.avgStress = (weekly.avgStress * weekly.count + (hasStress ? 1 : 0)) / (weekly.count + 1);
        weekly.count++;
        
        // Week of month
        const weekOfMonth = Math.ceil(dayOfMonth / 7);
        const weekKeys = ['firstWeek', 'secondWeek', 'thirdWeek', 'fourthWeek'];
        const monthly = Patterns.data.timePatterns.monthly[weekKeys[Math.min(weekOfMonth - 1, 3)]];
        monthly.avgMood = (monthly.avgMood * monthly.count + moodScore) / (monthly.count + 1);
        monthly.avgStress = (monthly.avgStress * monthly.count + (hasStress ? 1 : 0)) / (monthly.count + 1);
        monthly.count++;
    });
    
    // Detect significant time patterns
    detectTimePatternSignificance();
}

function detectTimePatternSignificance() {
    const daily = Patterns.data.timePatterns.daily;
    const weekly = Patterns.data.timePatterns.weekly;
    
    // Find best and worst times of day
    const times = ['morning', 'afternoon', 'evening', 'night'];
    const sortedByMood = times.sort((a, b) => daily[b].avgMood - daily[a].avgMood);
    
    if (daily[sortedByMood[0]].count >= 3 && daily[sortedByMood[3]].count >= 3) {
        const diff = daily[sortedByMood[0]].avgMood - daily[sortedByMood[3]].avgMood;
        if (diff > 1) {
            addPattern('time', sortedByMood[3], 'low mood',
                `Mood tends to be lower in the ${sortedByMood[3]}`,
                diff / 5,
                Math.min(daily[sortedByMood[0]].count, daily[sortedByMood[3]].count) / 10
            );
        }
    }
    
    // Find best and worst days of week
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const sortedDays = days.sort((a, b) => weekly[b].avgMood - weekly[a].avgMood);
    
    if (weekly[sortedDays[0]].count >= 3 && weekly[sortedDays[6]].count >= 3) {
        const diff = weekly[sortedDays[0]].avgMood - weekly[sortedDays[6]].avgMood;
        if (diff > 1) {
            addPattern('time', sortedDays[6], 'low mood',
                `Mood tends to be lower on ${sortedDays[6]}`,
                diff / 5,
                Math.min(weekly[sortedDays[0]].count, weekly[sortedDays[6]].count) / 10
            );
        }
    }
}

function detectSequences() {
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length < 10) return;
    
    // Look for recurring sequences of moods
    const sortedCheckIns = [...checkIns].sort((a, b) => new Date(a.timestamp || a.date) - new Date(b.timestamp || b.date));
    
    const moodScores = {
        calm: 5,
        okay: 4,
        anxious: 2,
        low: 2,
        exhausted: 1,
        overwhelmed: 1,
        numb: 2,
        overthinking: 2
    };
    
    // Detect 3-day sequences
    const sequences = {};
    
    for (let i = 0; i < sortedCheckIns.length - 2; i++) {
        const day1 = sortedCheckIns[i];
        const day2 = sortedCheckIns[i + 1];
        const day3 = sortedCheckIns[i + 2];
        
        let score1 = 0, score2 = 0, score3 = 0;
        
        if (day1.mood && moodScores[day1.mood]) score1 = moodScores[day1.mood];
        if (day2.mood && moodScores[day2.mood]) score2 = moodScores[day2.mood];
        if (day3.mood && moodScores[day3.mood]) score3 = moodScores[day3.mood];
        
        const sequenceKey = `${score1.toFixed(0)}-${score2.toFixed(0)}-${score3.toFixed(0)}`;
        
        if (!sequences[sequenceKey]) {
            sequences[sequenceKey] = { count: 0, examples: [] };
        }
        sequences[sequenceKey].count++;
        sequences[sequenceKey].examples.push({
            date: new Date(day1.timestamp || day1.date).toLocaleDateString(),
            moods: [day1.mood, day2.mood, day3.mood]
        });
    }
    
    // Find recurring sequences
    Object.entries(sequences).forEach(([key, data]) => {
        if (data.count >= 2) {
            const [s1, s2, s3] = key.split('-').map(Number);
            
            // Check if it's a declining sequence
            if (s1 > s2 && s2 > s3 && (s1 - s3) >= 2) {
                addPattern('sequence', 'declining mood', '3-day pattern',
                    'Recurring pattern of declining mood over 3 days',
                    data.count / sortedCheckIns.length,
                    data.count / 10
                );
            }
            
            // Check if it's an improving sequence
            if (s1 < s2 && s2 < s3 && (s3 - s1) >= 2) {
                addPattern('sequence', 'improving mood', '3-day pattern',
                    'Recurring pattern of improving mood over 3 days',
                    data.count / sortedCheckIns.length,
                    data.count / 10
                );
            }
        }
    });
}

function discoverPatterns() {
    const checkIns = MindHaven.userData.checkIns || [];
    const journalEntries = MindHaven.userData.journalEntries || [];
    
    if (checkIns.length < 7) return;
    
    // Detect cyclical patterns (weekly, monthly)
    detectCyclicalPatterns();
    
    // Detect trigger patterns from journal
    detectTriggerPatterns(journalEntries);
}

function detectCyclicalPatterns() {
    const checkIns = MindHaven.userData.checkIns || [];
    
    if (checkIns.length < 14) return; // Need at least 2 weeks
    
    const moodScores = {
        calm: 5,
        okay: 4,
        anxious: 2,
        low: 2,
        exhausted: 1,
        overwhelmed: 1,
        numb: 2,
        overthinking: 2
    };
    
    // Group by day of week
    const dayOfWeekData = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    
    checkIns.forEach(checkIn => {
        const date = new Date(checkIn.timestamp || checkIn.date);
        const dayOfWeek = date.getDay();
        
        let score = 0;
        if (checkIn.mood && moodScores[checkIn.mood]) {
            score = moodScores[checkIn.mood];
        }
        
        dayOfWeekData[dayOfWeek].push(score);
    });
    
    // Check for weekly cyclical pattern
    const dayAverages = Object.keys(dayOfWeekData).map(day => ({
        day: parseInt(day),
        avg: dayOfWeekData[day].length > 0 ? dayOfWeekData[day].reduce((a, b) => a + b, 0) / dayOfWeekData[day].length : 0
    }));
    
    // Check if there's a consistent pattern (e.g., weekends better)
    const weekendAvg = (dayAverages[0].avg + dayAverages[6].avg) / 2;
    const weekdayAvg = (dayAverages[1].avg + dayAverages[2].avg + dayAverages[3].avg + dayAverages[4].avg + dayAverages[5].avg) / 5;
    
    if (Math.abs(weekendAvg - weekdayAvg) > 1) {
        if (weekendAvg > weekdayAvg) {
            addPattern('cyclical', 'weekend', 'better mood',
                'Mood tends to be better on weekends',
                Math.abs(weekendAvg - weekdayAvg) / 5,
                0.7
            );
        } else {
            addPattern('cyclical', 'weekday', 'better mood',
                'Mood tends to be better on weekdays',
                Math.abs(weekendAvg - weekdayAvg) / 5,
                0.7
            );
        }
    }
}

function detectTriggerPatterns(journalEntries) {
    if (journalEntries.length < 5) return;
    
    // Look for recurring themes that correlate with low mood
    const triggerKeywords = {
        'work': ['work', 'job', 'boss', 'colleague', 'deadline', 'meeting'],
        'school': ['school', 'class', 'exam', 'test', 'study', 'homework', 'professor'],
        'money': ['money', 'bill', 'debt', 'financial', 'expense', 'budget'],
        'relationship': ['relationship', 'partner', 'boyfriend', 'girlfriend', 'friend', 'family', 'argument'],
        'health': ['health', 'sick', 'pain', 'doctor', 'hospital', 'medication'],
        'sleep': ['sleep', 'tired', 'exhausted', 'insomnia', 'nightmare']
    };
    
    const checkIns = MindHaven.userData.checkIns || [];
    const moodScores = {
        calm: 5,
        okay: 4,
        anxious: 2,
        low: 2,
        exhausted: 1,
        overwhelmed: 1,
        numb: 2,
        overthinking: 2
    };
    
    Object.entries(triggerKeywords).forEach(([trigger, keywords]) => {
        const triggerDays = new Set();
        
        journalEntries.forEach(entry => {
            const content = entry.content.toLowerCase();
            if (keywords.some(keyword => content.includes(keyword))) {
                triggerDays.add(new Date(entry.date).toDateString());
            }
        });
        
        if (triggerDays.size < 3) return;
        
        // Check mood on trigger days vs non-trigger days
        const triggerDayMoods = [];
        const nonTriggerDayMoods = [];
        
        checkIns.forEach(checkIn => {
            const date = new Date(checkIn.timestamp || checkIn.date).toDateString();
            let score = 0;
            
            if (checkIn.mood && moodScores[checkIn.mood]) {
                score = moodScores[checkIn.mood];
            }
            
            if (triggerDays.has(date)) {
                triggerDayMoods.push(score);
            } else {
                nonTriggerDayMoods.push(score);
            }
        });
        
        if (triggerDayMoods.length >= 3 && nonTriggerDayMoods.length >= 3) {
            const triggerAvg = triggerDayMoods.reduce((a, b) => a + b, 0) / triggerDayMoods.length;
            const nonTriggerAvg = nonTriggerDayMoods.reduce((a, b) => a + b, 0) / nonTriggerDayMoods.length;
            
            if (triggerAvg < nonTriggerAvg - 0.5) {
                addPattern('trigger', trigger, 'lower mood',
                    `Mentions of ${trigger} in journal are associated with lower mood`,
                    (nonTriggerAvg - triggerAvg) / 5,
                    Math.min(triggerDayMoods.length, nonTriggerDayMoods.length) / 10
                );
            }
        }
    });
}

function addPattern(type, trigger, effect, description, strength, confidence) {
    // Check if similar pattern already exists
    const existing = Patterns.data.patterns.find(p => 
        p.type === type && p.trigger === trigger && p.effect === effect
    );
    
    if (existing) {
        existing.strength = Math.max(existing.strength, strength);
        existing.confidence = Math.min(existing.confidence + 0.1, 1);
        existing.lastObserved = new Date().toISOString();
        existing.frequency++;
    } else {
        Patterns.data.patterns.push({
            id: generateId(),
            type,
            trigger,
            effect,
            description,
            confidence: Math.min(confidence, 1),
            strength,
            frequency: 1,
            examples: [],
            firstDetected: new Date().toISOString(),
            lastObserved: new Date().toISOString()
        });
    }
}

// ============================================
// PATTERNS DASHBOARD
// ============================================

function renderPatternsDashboard() {
    const container = document.getElementById('patterns-dashboard');
    if (!container) return;
    
    let html = `
        <div class="patterns-dashboard">
            <div class="patterns-header">
                <h2>Trigger & Pattern Detection</h2>
                <p class="patterns-updated">Last analyzed: ${Patterns.data.lastAnalyzed ? new Date(Patterns.data.lastAnalyzed).toLocaleDateString() : 'Never'}</p>
                <button class="secondary-btn" onclick="analyzePatterns(); renderPatternsDashboard();">🔄 Re-analyze</button>
            </div>
            
            <div class="patterns-sections">
                <div class="patterns-section">
                    <h3>📊 Detected Patterns</h3>
                    ${renderDetectedPatterns()}
                </div>
                
                <div class="patterns-section">
                    <h3>🔗 Correlations</h3>
                    ${renderCorrelations()}
                </div>
                
                <div class="patterns-section">
                    <h3>⏰ Time Patterns</h3>
                    ${renderTimePatterns()}
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderDetectedPatterns() {
    const patterns = Patterns.data.patterns;
    
    if (patterns.length === 0) {
        return '<p class="empty-state">No patterns detected yet. Continue using MindHaven to discover patterns.</p>';
    }
    
    let html = '<div class="patterns-list">';
    patterns.slice(-10).reverse().forEach(pattern => {
        const icon = pattern.type === 'correlation' ? '🔗' : pattern.type === 'sequence' ? '🔄' : pattern.type === 'cyclical' ? '📈' : pattern.type === 'trigger' ? '⚡' : '📊';
        const strengthPercent = pattern.strength * 100;
        const confidencePercent = pattern.confidence * 100;
        
        html += `
            <div class="pattern-card">
                <div class="pattern-header">
                    <span class="pattern-icon">${icon}</span>
                    <span class="pattern-type">${pattern.type}</span>
                </div>
                <p class="pattern-description">${pattern.description}</p>
                <div class="pattern-metrics">
                    <span class="pattern-metric">Strength: ${strengthPercent.toFixed(0)}%</span>
                    <span class="pattern-metric">Confidence: ${confidencePercent.toFixed(0)}%</span>
                    <span class="pattern-metric">Frequency: ${pattern.frequency}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    return html;
}

function renderCorrelations() {
    const correlations = Patterns.data.correlations;
    
    let html = '<div class="correlations-list">';
    
    Object.entries(correlations).forEach(([key, data]) => {
        if (data.sampleSize === 0) return;
        
        const correlation = parseFloat(data.correlation);
        const confidence = parseFloat(data.confidence);
        const color = correlation > 0.3 ? '#A8C3A1' : correlation < -0.3 ? '#E57373' : '#8FAACF';
        const direction = correlation > 0 ? 'positive' : correlation < 0 ? 'negative' : 'neutral';
        
        html += `
            <div class="correlation-item">
                <div class="correlation-header">
                    <span class="correlation-name">${formatCorrelationName(key)}</span>
                    <span class="correlation-direction" style="color: ${color}">${direction}</span>
                </div>
                <div class="correlation-bar">
                    <div class="correlation-fill" style="width: ${Math.abs(correlation) * 100}%; background: ${color}"></div>
                </div>
                <div class="correlation-details">
                    <span>Correlation: ${correlation.toFixed(2)}</span>
                    <span>Confidence: ${(confidence * 100).toFixed(0)}%</span>
                    <span>Sample: ${data.sampleSize}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (html === '<div class="correlations-list"></div>') {
        return '<p class="empty-state">Not enough data to analyze correlations yet.</p>';
    }
    
    return html;
}

function formatCorrelationName(key) {
    const names = {
        sleepMood: 'Sleep ↔ Mood',
        journalingMood: 'Journaling ↔ Mood',
        exerciseMood: 'Exercise ↔ Mood',
        socialMood: 'Social ↔ Mood',
        studyStress: 'Study ↔ Stress',
        habitMood: 'Habits ↔ Mood'
    };
    return names[key] || key;
}

function renderTimePatterns() {
    const timePatterns = Patterns.data.timePatterns;
    
    let html = '<div class="time-patterns-grid">';
    
    // Daily patterns
    html += '<div class="time-pattern-group"><h4>Daily</h4>';
    Object.entries(timePatterns.daily).forEach(([time, data]) => {
        if (data.count === 0) return;
        html += `
            <div class="time-pattern-item">
                <span class="time-label">${time}</span>
                <div class="time-mood">Mood: ${data.avgMood.toFixed(1)}/5</div>
                <div class="time-stress">Stress: ${(data.avgStress * 100).toFixed(0)}%</div>
            </div>
        `;
    });
    html += '</div>';
    
    // Weekly patterns
    html += '<div class="time-pattern-group"><h4>Weekly</h4>';
    Object.entries(timePatterns.weekly).forEach(([day, data]) => {
        if (data.count === 0) return;
        html += `
            <div class="time-pattern-item">
                <span class="time-label">${day.charAt(0).toUpperCase() + day.slice(1)}</span>
                <div class="time-mood">Mood: ${data.avgMood.toFixed(1)}/5</div>
                <div class="time-stress">Stress: ${(data.avgStress * 100).toFixed(0)}%</div>
            </div>
        `;
    });
    html += '</div>';
    
    html += '</div>';
    
    if (html === '<div class="time-patterns-grid"></div>') {
        return '<p class="empty-state">Not enough data to analyze time patterns yet.</p>';
    }
    
    return html;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.initializePatterns = initializePatterns;
window.analyzePatterns = analyzePatterns;
window.renderPatternsDashboard = renderPatternsDashboard;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializePatterns();
});
