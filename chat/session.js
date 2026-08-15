// ============================================
// MINDHAVEN - Local Chat Session & History Manager
// ============================================

const MindHavenSession = {
    storageKey: 'mindhaven_chat_history',
    maxMessages: 100,

    /**
     * Retrieves saved chat messages
     * @returns {Array} Array of message objects [{id, sender, content, timestamp, actions}]
     */
    getHistory() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.warn('Could not read chat history:', err);
            return [];
        }
    },

    /**
     * Saves message to history
     * @param {Object} message - { id, sender, content, timestamp, actions }
     */
    saveMessage(message) {
        try {
            const history = this.getHistory();
            history.push(message);

            // Trim to max message limit
            if (history.length > this.maxMessages) {
                history.splice(0, history.length - this.maxMessages);
            }

            localStorage.setItem(this.storageKey, JSON.stringify(history));
        } catch (err) {
            console.warn('Could not save message:', err);
        }
    },

    /**
     * Clears all local chat history
     */
    clearHistory() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (err) {
            console.warn('Could not clear chat history:', err);
        }
    },

    /**
     * Exports chat transcript as text file download
     */
    exportTranscript() {
        const history = this.getHistory();
        if (history.length === 0) return;

        let text = `MindHaven Chat Companion Transcript\nExported: ${new Date().toLocaleString()}\n----------------------------------------\n\n`;

        history.forEach(m => {
            const time = new Date(m.timestamp || Date.now()).toLocaleTimeString();
            const sender = m.sender === 'user' ? 'User' : 'Haven AI';
            text += `[${time}] ${sender}:\n${m.content}\n\n`;
        });

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MindHaven-Chat-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

window.MindHavenSession = MindHavenSession;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MindHavenSession };
}
