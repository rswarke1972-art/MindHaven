// ============================================
// MINDHAVEN - Rule-Based Offline Companion Module
// ============================================

const MindHavenFallback = {
    /**
     * Pattern matching rules for offline self-care responses
     */
    patterns: [
        {
            keywords: ['anxious', 'anxiety', 'panic', 'overwhelmed', 'scared', 'fear'],
            response: `I hear how overwhelming things feel right now. Take a gentle breath with me.

When anxiety peaks, calming the body's nervous system helps slow down racing thoughts. Would you like to try box breathing or grounding?

[ACTION:coping_tool:box_breathing] [ACTION:coping_tool:grounding_54321]`
        },
        {
            keywords: ['thought', 'reframe', 'cbt', 'negative', 'overthinking', 'mind racing'],
            response: `Thoughts can feel very heavy when they repeat in our minds. Remember: thoughts are mental events, not immutable facts.

Let's examine and reframe what you are experiencing using our CBT Thought Record tool:

[ACTION:coping_tool:cbt_reframe] [ACTION:coping_tool:emotion_wheel]`
        },
        {
            keywords: ['ground', 'grounding', 'derealization', 'numb', 'disconnected'],
            response: `Let's bring your awareness gently back to the physical present.

Look around your room right now:
• Notice 5 things you can see.
• 4 things you can physically touch.
• 3 sounds you can hear.
• 2 scents you can smell.
• 1 taste or deep breath.

You can also use our guided interactive grounding tool:

[ACTION:coping_tool:grounding_54321]`
        },
        {
            keywords: ['sleep', 'insomnia', 'night', 'tired', 'rest', 'bed'],
            response: `Winding down when your mind is active can be challenging. Try softening your shoulders, unclenching your jaw, and lowering the screen brightness.

Here are quiet tools to help you relax:

[ACTION:coping_tool:pmr] [ACTION:navigate:calmspace]`
        },
        {
            keywords: ['sad', 'low', 'depressed', 'crying', 'lonely', 'burnt out', 'burnout'],
            response: `Thank you for sharing how you feel. It is completely okay to feel low or drained today. You don't have to force yourself to be productive.

Give yourself space for rest and gentleness today:

[ACTION:navigate:journal] [ACTION:navigate:dashboard]`
        },
        {
            keywords: ['ollama', 'setup', 'qwen', 'connect', 'offline', 'ai model'],
            response: `ℹ️ **Ollama Setup Guide**

MindHaven works seamlessly offline! To enable local Qwen AI power:
1. Download & install **Ollama** from [ollama.com](https://ollama.com).
2. Open terminal and run: \`ollama run qwen2.5\`
3. Ensure CORS is enabled if needed: set \`OLLAMA_ORIGINS="*"\`
4. Refresh MindHaven and you will see 🟢 Qwen connected!`
        }
    ],

    /**
     * Default response when no keyword matches
     */
    defaultResponse: `I am here with you. While I am running in Offline Companion mode right now, you can still use all of MindHaven's interactive coping tools, journal, and calm spaces.

How can I best support you right now?

[ACTION:coping_tool:box_breathing] [ACTION:coping_tool:grounding_54321] [ACTION:navigate:journal]`,

    /**
     * Generates offline response based on user text
     * @param {string} userText 
     * @returns {string} Response string with action tokens
     */
    getResponse(userText) {
        if (!userText) return this.defaultResponse;

        const lower = userText.toLowerCase();

        for (const rule of this.patterns) {
            if (rule.keywords.some(k => lower.includes(k))) {
                return rule.response;
            }
        }

        return this.defaultResponse;
    }
};

window.MindHavenFallback = MindHavenFallback;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MindHavenFallback };
}
