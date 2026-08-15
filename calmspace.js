// ============================================
// MINDHAVEN - Calm Space Module
// ============================================

// Calm Space State
const CalmSpace = {
    currentAmbience: null,
    audioContext: null,
    audioNodes: {},
    isPlaying: false,
    breathingInterval: null,
    currentQuoteIndex: 0
};

// Calm Quotes
const calmQuotes = [
    "This moment is temporary. You will get through this.",
    "Breathe. You're doing the best you can.",
    "It's okay to not be okay right now.",
    "One breath at a time. One moment at a time.",
    "You are stronger than you think.",
    "This too shall pass.",
    "Be gentle with yourself today.",
    "You are worthy of peace and rest.",
    "Take things one small step at a time.",
    "You don't have to figure everything out today."
];

// Ambience Configurations
const ambienceConfig = {
    rain: {
        name: 'Rain',
        icon: '🌧️',
        color: '#8FAACF',
        description: 'Gentle rainfall to soothe your mind'
    },
    forest: {
        name: 'Forest',
        icon: '🍃',
        color: '#A8C3A1',
        description: 'Peaceful nature sounds'
    },
    ocean: {
        name: 'Ocean',
        icon: '🌊',
        color: '#7CB8A6',
        description: 'Calming ocean waves'
    },
    fireplace: {
        name: 'Fireplace',
        icon: '🔥',
        color: '#FFB74D',
        description: 'Warm crackling fire'
    },
    night: {
        name: 'Night Sky',
        icon: '🌙',
        color: '#B8A7D1',
        description: 'Peaceful night ambience'
    }
};

// Initialize Calm Space Module
function initializeCalmSpace() {
    console.log('🧘 Initializing Calm Space...');
    loadAmbiencePreference();
    setRandomQuote();
    initializeVolumeSlider();
    console.log('✅ Calm Space initialized');
}

// ============================================
// AMBIENCE CONTROL
// ============================================

function setAmbience(ambienceType) {
    // Update UI
    document.querySelectorAll('.ambience-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const activeCard = document.querySelector(`.ambience-card.${ambienceType}-card`);
    if (activeCard) {
        activeCard.classList.add('active');
    }
    
    CalmSpace.currentAmbience = ambienceType;
    
    // Save preference
    localStorage.setItem('mindhaven_ambience', ambienceType);
    
    // Update audio if playing
    if (CalmSpace.isPlaying) {
        stopAudio();
        if (MindHaven.settings.ambientSounds) {
            playAudio(ambienceType);
        }
    }
    
    // Update breathing circle color
    updateBreathingCircleColor(ambienceType);
}

function loadAmbiencePreference() {
    const savedAmbience = localStorage.getItem('mindhaven_ambience');
    if (savedAmbience && ambienceConfig[savedAmbience]) {
        setAmbience(savedAmbience);
    }
}

function updateBreathingCircleColor(ambienceType) {
    const circle = document.getElementById('breathingCircle');
    if (!circle) return;
    
    const config = ambienceConfig[ambienceType];
    if (config) {
        circle.style.background = `linear-gradient(135deg, ${config.color}, ${config.color}99)`;
    }
}

// ============================================
// BREATHING EXERCISE
// ============================================

function startBreathingExercise() {
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    
    if (!circle || !text) return;
    
    // Clear any existing interval
    if (CalmSpace.breathingInterval) {
        clearInterval(CalmSpace.breathingInterval);
    }
    
    let phase = 0;
    const phases = [
        { text: 'Breathe In', duration: 4000, scale: 1.15 },
        { text: 'Hold', duration: 4000, scale: 1.15 },
        { text: 'Breathe Out', duration: 4000, scale: 1.0 }
    ];
    
    function runBreathingCycle() {
        const currentPhase = phases[phase];
        text.textContent = currentPhase.text;
        circle.style.transform = `scale(${currentPhase.scale})`;
        circle.style.transition = `transform ${currentPhase.duration / 1000}s ease-in-out`;
        
        phase = (phase + 1) % phases.length;
    }
    
    runBreathingCycle();
    CalmSpace.breathingInterval = setInterval(runBreathingCycle, 4000);
    
    // Track usage
    MindHaven.userData.stats.copingToolsUsed++;
    saveUserData();
    
    // Check for rested achievement
    unlockAchievement('rested');
}

function stopBreathingExercise() {
    if (CalmSpace.breathingInterval) {
        clearInterval(CalmSpace.breathingInterval);
        CalmSpace.breathingInterval = null;
    }
    
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    
    if (circle) {
        circle.style.transform = 'scale(1)';
    }
    if (text) {
        text.textContent = 'Breathe';
    }
}

// ============================================
// CALM QUOTES
// ============================================

function setRandomQuote() {
    const quoteElement = document.getElementById('calmQuote');
    if (!quoteElement) return;
    
    const randomIndex = Math.floor(Math.random() * calmQuotes.length);
    quoteElement.textContent = `"${calmQuotes[randomIndex]}"`;
    CalmSpace.currentQuoteIndex = randomIndex;
}

function getNextQuote() {
    CalmSpace.currentQuoteIndex = (CalmSpace.currentQuoteIndex + 1) % calmQuotes.length;
    const quoteElement = document.getElementById('calmQuote');
    if (quoteElement) {
        quoteElement.textContent = `"${calmQuotes[CalmSpace.currentQuoteIndex]}"`;
    }
}

// ============================================
// AUDIO SYSTEM (Web Audio API)
// ============================================

function initializeAudioContext() {
    if (!CalmSpace.audioContext) {
        CalmSpace.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function toggleAudio() {
    if (CalmSpace.isPlaying) {
        stopAudio();
    } else {
        if (MindHaven.settings.ambientSounds && CalmSpace.currentAmbience) {
            playAudio(CalmSpace.currentAmbience);
        } else {
            showGentleMessage('Please enable ambient sounds in settings and select an ambience');
        }
    }
}

function playAudio(ambienceType) {
    if (!MindHaven.settings.ambientSounds) {
        showGentleMessage('Enable ambient sounds in settings first');
        return;
    }
    
    initializeAudioContext();
    
    if (CalmSpace.audioContext.state === 'suspended') {
        CalmSpace.audioContext.resume();
    }
    
    // Generate ambient sound using Web Audio API
    generateAmbientSound(ambienceType);
    
    CalmSpace.isPlaying = true;
    updateAudioButton();
}

function stopAudio() {
    // Stop all audio nodes
    Object.values(CalmSpace.audioNodes).forEach(node => {
        if (node.stop) {
            node.stop();
        }
        if (node.disconnect) {
            node.disconnect();
        }
    });
    
    CalmSpace.audioNodes = {};
    CalmSpace.isPlaying = false;
    updateAudioButton();
}

function generateAmbientSound(type) {
    const ctx = CalmSpace.audioContext;
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    
    const volumeSlider = document.getElementById('volumeSlider');
    const volume = volumeSlider ? volumeSlider.value / 100 : 0.5;
    masterGain.gain.value = volume;
    
    CalmSpace.audioNodes.masterGain = masterGain;
    
    switch(type) {
        case 'rain':
            generateRainSound(ctx, masterGain);
            break;
        case 'forest':
            generateForestSound(ctx, masterGain);
            break;
        case 'ocean':
            generateOceanSound(ctx, masterGain);
            break;
        case 'fireplace':
            generateFireplaceSound(ctx, masterGain);
            break;
        case 'night':
            generateNightSound(ctx, masterGain);
            break;
    }
}

function generateRainSound(ctx, masterGain) {
    // Create white noise for rain
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    // Filter to make it sound like rain
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    
    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    whiteNoise.start();
    
    CalmSpace.audioNodes.whiteNoise = whiteNoise;
    CalmSpace.audioNodes.filter = filter;
    CalmSpace.audioNodes.gain = gain;
}

function generateForestSound(ctx, masterGain) {
    // Similar to rain but with different filtering
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 1;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.2;
    
    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    whiteNoise.start();
    
    CalmSpace.audioNodes.whiteNoise = whiteNoise;
    CalmSpace.audioNodes.filter = filter;
    CalmSpace.audioNodes.gain = gain;
}

function generateOceanSound(ctx, masterGain) {
    // Pink noise for ocean
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
    }
    
    const pinkNoise = ctx.createBufferSource();
    pinkNoise.buffer = noiseBuffer;
    pinkNoise.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.1;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    pinkNoise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    pinkNoise.start();
    lfo.start();
    
    CalmSpace.audioNodes.pinkNoise = pinkNoise;
    CalmSpace.audioNodes.filter = filter;
    CalmSpace.audioNodes.gain = gain;
    CalmSpace.audioNodes.lfo = lfo;
    CalmSpace.audioNodes.lfoGain = lfoGain;
}

function generateFireplaceSound(ctx, masterGain) {
    // Crackling fire using filtered noise with modulation
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 8;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 400;
    
    const crackleLfo = ctx.createOscillator();
    crackleLfo.frequency.value = 15;
    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0.3;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.25;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    crackleLfo.connect(crackleGain);
    crackleGain.connect(gain.gain);
    
    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    whiteNoise.start();
    lfo.start();
    crackleLfo.start();
    
    CalmSpace.audioNodes.whiteNoise = whiteNoise;
    CalmSpace.audioNodes.filter = filter;
    CalmSpace.audioNodes.gain = gain;
    CalmSpace.audioNodes.lfo = lfo;
    CalmSpace.audioNodes.lfoGain = lfoGain;
    CalmSpace.audioNodes.crackleLfo = crackleLfo;
    CalmSpace.audioNodes.crackleGain = crackleGain;
}

function generateNightSound(ctx, masterGain) {
    // Very subtle ambient night sound
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.15;
    
    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    whiteNoise.start();
    
    CalmSpace.audioNodes.whiteNoise = whiteNoise;
    CalmSpace.audioNodes.filter = filter;
    CalmSpace.audioNodes.gain = gain;
}

function updateAudioButton() {
    const button = document.getElementById('audioToggle');
    if (button) {
        if (CalmSpace.isPlaying) {
            button.textContent = '🔊 Stop Sound';
        } else {
            button.textContent = '🔇 Play Sound';
        }
    }
}

// ============================================
// VOLUME CONTROL
// ============================================

function initializeVolumeSlider() {
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            if (CalmSpace.audioNodes.masterGain) {
                CalmSpace.audioNodes.masterGain.gain.value = this.value / 100;
            }
        });
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.setAmbience = setAmbience;
window.startBreathingExercise = startBreathingExercise;
window.stopBreathingExercise = stopBreathingExercise;
window.toggleAudio = toggleAudio;
window.getNextQuote = getNextQuote;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeCalmSpace();
});
