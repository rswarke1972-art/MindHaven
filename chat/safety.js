// ============================================
// MINDHAVEN - Safety Classifier & Crisis Layer
// ============================================

const MindHavenSafety = {
    // Crisis keywords and phrases requiring immediate deterministic intervention
    crisisKeywords: [
        'suicide', 'suicidal', 'kill myself', 'ending my life', 'want to die',
        'end it all', 'hurt myself', 'self harm', 'self-harm', 'overdose',
        'cutting myself', 'can\'t go on living', 'better off dead', 'no reason to live'
    ],

    // Medical advice keywords to trigger reminder disclaimer
    medicalKeywords: [
        'diagnose me', 'prescription', 'medication dosage', 'psychiatric diagnosis',
        'cure my depression', 'medical treatment'
    ],

    /**
     * Pre-evaluates user prompt before sending to LLM
     * @param {string} text - User message content
     * @returns {Object} { isCrisis: boolean, isMedical: boolean, overrideResponse: Object|null }
     */
    evaluatePreResponse(text) {
        if (!text || typeof text !== 'string') {
            return { isCrisis: false, isMedical: false, overrideResponse: null };
        }

        const lowerText = text.toLowerCase().trim();

        // 1. Check for severe crisis / self-harm triggers
        const hasCrisisTrigger = this.crisisKeywords.some(keyword => lowerText.includes(keyword));

        if (hasCrisisTrigger) {
            return {
                isCrisis: true,
                isMedical: false,
                overrideResponse: {
                    sender: 'bot',
                    isCrisisOverride: true,
                    content: `💚 **I hear that you are going through immense pain right now, but please know that you are not alone.**

Because your safety and well-being are what matter most, I want to connect you immediately with people who can support you right this moment:

• **988 Suicide & Crisis Lifeline**: Call or text **988** (Available 24/7, free and confidential in the US/Canada).
• **Crisis Text Line**: Text **HOME** to **741741**.
• **International Resources**: If you are outside the US, please contact your local emergency services or visit a crisis hotline.

You can also view your saved Safety Plan and international hotlines directly in MindHaven:
[ACTION:navigate:crisis] [ACTION:navigate:safetyplan]`,
                    timestamp: new Date().toISOString()
                }
            };
        }

        // 2. Check for medical advice request triggers
        const hasMedicalTrigger = this.medicalKeywords.some(keyword => lowerText.includes(keyword));

        return {
            isCrisis: false,
            isMedical: hasMedicalTrigger,
            overrideResponse: null
        };
    },

    /**
     * Validates post-response output from LLM to ensure safety compliance
     * @param {string} responseText 
     * @returns {string} Cleaned response text
     */
    validatePostResponse(responseText) {
        if (!responseText) return '';

        // Strip any accidental raw script tags or iframe injections
        let sanitized = responseText
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

        return sanitized;
    },

    /**
     * Standard disclaimer for wellness companion status
     */
    getWellnessDisclaimer() {
        return "MindHaven is a self-care wellness companion. It is not a clinical service, medical provider, or emergency helpline.";
    }
};

window.MindHavenSafety = MindHavenSafety;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MindHavenSafety };
}
