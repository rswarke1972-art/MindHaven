// ============================================
// MINDHAVEN - User Privacy & Context Manager
// ============================================

const MindHavenContext = {
    // Default context sharing permissions (privacy-first)
    permissions: {
        includeMood: true,
        includeJournal: false, // Default OFF for privacy
        includeCoping: true,
        includeHistory: false
    },

    /**
     * Loads permissions from localStorage or defaults
     */
    init() {
        try {
            const saved = localStorage.getItem('mindhaven_context_permissions');
            if (saved) {
                this.permissions = { ...this.permissions, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Could not load context permissions:', e);
        }
    },

    /**
     * Saves user context permissions
     * @param {Object} newPermissions 
     */
    updatePermissions(newPermissions) {
        this.permissions = { ...this.permissions, ...newPermissions };
        try {
            localStorage.setItem('mindhaven_context_permissions', JSON.stringify(this.permissions));
        } catch (e) {}
    },

    /**
     * Builds contextual prompt fragment based on allowed permissions
     * @returns {string} Context text to append to system prompt
     */
    buildUserContextPrompt() {
        const parts = [];

        // Access global MindHaven state if available
        const state = (typeof MindHaven !== 'undefined') ? MindHaven.userData : null;
        if (!state) return '';

        // 1. Current Mood Check-in Context
        if (this.permissions.includeMood && state.checkIns && state.checkIns.length > 0) {
            const latestCheckIn = state.checkIns[state.checkIns.length - 1];
            parts.push(`Recent Mood Check-in: User reported feeling "${latestCheckIn.mood || 'okay'}" (intensity ${latestCheckIn.intensity || 5}/10)${latestCheckIn.note ? ` with note: "${latestCheckIn.note}"` : ''}.`);
        }

        // 2. Recent Coping Tools Context
        if (this.permissions.includeCoping && state.stats) {
            if (state.stats.copingToolsUsed > 0) {
                parts.push(`User Activity: Has used MindHaven coping tools ${state.stats.copingToolsUsed} times.`);
            }
        }

        // 3. Optional Journal Context (ONLY if explicitly enabled by user)
        if (this.permissions.includeJournal && state.journalEntries && state.journalEntries.length > 0) {
            const latestJournal = state.journalEntries[state.journalEntries.length - 1];
            if (latestJournal && latestJournal.content) {
                const snippet = latestJournal.content.slice(0, 150);
                parts.push(`Latest Journal Snippet (User Shared): "${snippet}..."`);
            }
        }

        if (parts.length === 0) return '';

        return `\nCURRENT USER CONTEXT (Shared with consent):\n- ${parts.join('\n- ')}\n`;
    }
};

// Auto-initialize permissions on module load
MindHavenContext.init();

window.MindHavenContext = MindHavenContext;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MindHavenContext };
}
