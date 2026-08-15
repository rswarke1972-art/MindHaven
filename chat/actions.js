// ============================================
// MINDHAVEN - Controlled Action Registry & UI Bridge
// ============================================

const MindHavenActions = {
    /**
     * Map of safe, deterministic UI actions
     */
    registry: {
        'coping_tool': {
            'box_breathing': { label: '🫁 Start Box Breathing', fn: () => typeof openCopingTool === 'function' && openCopingTool('breathing') },
            'breathing': { label: '🫁 Deep Breathing', fn: () => typeof openCopingTool === 'function' && openCopingTool('breathing') },
            'grounding_54321': { label: '🌱 5-4-3-2-1 Grounding', fn: () => typeof openCopingTool === 'function' && openCopingTool('grounding') },
            'grounding': { label: '🌱 Grounding Exercise', fn: () => typeof openCopingTool === 'function' && openCopingTool('grounding') },
            'tipp': { label: '❄️ TIPP Distress Skill', fn: () => typeof openCopingTool === 'function' && openCopingTool('tipp') },
            'pmr': { label: '🧘 Muscle Relaxation', fn: () => typeof openCopingTool === 'function' && openCopingTool('pmr') },
            'cbt_reframe': { label: '💭 CBT Thought Record', fn: () => typeof openCopingTool === 'function' && openCopingTool('cbt') },
            'cbt': { label: '💭 Thought Reframe', fn: () => typeof openCopingTool === 'function' && openCopingTool('cbt') },
            'emotion_wheel': { label: '🎯 Emotion Wheel', fn: () => typeof openCopingTool === 'function' && openCopingTool('emotion-wheel') }
        },
        'navigate': {
            'safetyplan': { label: '🛡️ Open Safety Plan', fn: () => typeof navigateTo === 'function' && navigateTo('safetyplan') },
            'journal': { label: '📔 Open Journal', fn: () => typeof navigateTo === 'function' && navigateTo('journal') },
            'dashboard': { label: '🏠 Log Daily Check-in', fn: () => typeof navigateTo === 'function' && navigateTo('dashboard') },
            'crisis': { label: '🚨 Crisis Support Hotlines', fn: () => typeof navigateTo === 'function' && navigateTo('crisis') },
            'calmspace': { label: '🧘 Calm Space', fn: () => typeof navigateTo === 'function' && navigateTo('calmspace') },
            'mentalhealth': { label: '📚 Learn & Articles', fn: () => typeof navigateTo === 'function' && navigateTo('mentalhealth') },
            'insights': { label: '📊 View Mood Insights', fn: () => typeof navigateTo === 'function' && navigateTo('insights') }
        }
    },

    /**
     * Parses raw response string for action tags: [ACTION:type:id]
     * @param {string} text - Message text from bot
     * @returns {Object} { cleanText, actions: Array<{type, id, label}> }
     */
    parseActionTokens(text) {
        if (!text) return { cleanText: '', actions: [] };

        const actionRegex = /\[ACTION:([a-zA-Z0-9_]+):([a-zA-Z0-9_]+)\]/g;
        const actions = [];
        let match;

        while ((match = actionRegex.exec(text)) !== null) {
            const type = match[1];
            const id = match[2];

            if (this.registry[type] && this.registry[type][id]) {
                actions.push({
                    type: type,
                    id: id,
                    label: this.registry[type][id].label
                });
            }
        }

        // Remove tokens from displaying in prose text
        const cleanText = text.replace(actionRegex, '').trim();

        return { cleanText, actions };
    },

    /**
     * Safely executes an action from the registry
     * @param {string} type 
     * @param {string} id 
     */
    executeAction(type, id) {
        console.log(`⚡ MindHaven executing safe action: ${type} -> ${id}`);
        if (this.registry[type] && this.registry[type][id]) {
            try {
                this.registry[type][id].fn();
            } catch (err) {
                console.error(`Error executing action ${type}:${id}`, err);
            }
        } else {
            console.warn(`Action ${type}:${id} not found in registry`);
        }
    }
};

window.MindHavenActions = MindHavenActions;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MindHavenActions };
}
