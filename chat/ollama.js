// ============================================
// MINDHAVEN - Ollama API & Streaming Integration
// ============================================

const MindHavenOllama = {
    endpoint: 'http://localhost:11434',
    selectedModel: null,
    availableModels: [],
    status: 'offline', // 'connected' | 'connecting' | 'offline'

    // Priority chain for Qwen auto-detection
    preferredModels: [
        'qwen2.5:latest',
        'qwen2.5:7b',
        'qwen2.5:3b',
        'qwen:latest',
        'qwen2.5',
        'qwen'
    ],

    /**
     * Initializes Ollama connection and picks best model
     * @param {string} customEndpoint - Optional custom endpoint URL
     * @param {string} userPreferredModel - Saved model preference from settings
     * @returns {Promise<Object>} Status object { status, model, models }
     */
    async connect(customEndpoint = null, userPreferredModel = null) {
        if (customEndpoint) {
            this.endpoint = customEndpoint.replace(/\/+$/, '');
        }

        this.status = 'connecting';
        this.notifyStatusChange();

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const res = await fetch(`${this.endpoint}/api/tags`, {
                method: 'GET',
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            this.availableModels = (data.models || []).map(m => m.name || m.model);

            if (this.availableModels.length === 0) {
                this.status = 'offline';
                this.selectedModel = null;
                this.notifyStatusChange();
                return { status: 'offline', model: null, models: [] };
            }

            // Model resolution hierarchy
            let chosen = null;

            // 1. User setting explicitly selected model (if available in tags)
            if (userPreferredModel && this.availableModels.includes(userPreferredModel)) {
                chosen = userPreferredModel;
            }

            // 2. Scan Qwen preference chain
            if (!chosen) {
                for (const pref of this.preferredModels) {
                    const match = this.availableModels.find(m => m.toLowerCase() === pref.toLowerCase() || m.toLowerCase().startsWith(pref.toLowerCase()));
                    if (match) {
                        chosen = match;
                        break;
                    }
                }
            }

            // 3. Fallback to any model containing 'qwen' or 'llama' or first available
            if (!chosen) {
                chosen = this.availableModels.find(m => m.toLowerCase().includes('qwen')) ||
                         this.availableModels.find(m => m.toLowerCase().includes('llama')) ||
                         this.availableModels[0];
            }

            this.selectedModel = chosen;
            this.status = 'connected';
            this.notifyStatusChange();

            return {
                status: 'connected',
                model: this.selectedModel,
                models: this.availableModels
            };

        } catch (err) {
            console.warn('🕊️ MindHaven Ollama unreachable:', err.message);
            this.status = 'offline';
            this.selectedModel = null;
            this.notifyStatusChange();
            return { status: 'offline', model: null, models: [] };
        }
    },

    /**
     * Sends chat messages stream to Ollama /api/chat
     * @param {Array} messages - Array of message objects [{role, content}]
     * @param {Function} onChunk - Callback for incremental text chunks
     * @param {AbortSignal} signal - Optional abort signal
     */
    async streamChat(messages, onChunk, signal = null) {
        if (this.status !== 'connected' || !this.selectedModel) {
            throw new Error('Ollama is not connected');
        }

        const payload = {
            model: this.selectedModel,
            messages: messages,
            stream: true,
            options: {
                temperature: 0.7,
                top_p: 0.9
            }
        };

        const response = await fetch(`${this.endpoint}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: signal
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.message && parsed.message.content) {
                            onChunk(parsed.message.content, false);
                        }
                        if (parsed.done) {
                            onChunk('', true);
                        }
                    } catch (e) {
                        // Ignore parse errors on incomplete lines
                    }
                }
            }
        }

        if (buffer.trim()) {
            try {
                const parsed = JSON.parse(buffer);
                if (parsed.message && parsed.message.content) {
                    onChunk(parsed.message.content, true);
                }
            } catch (e) {}
        }
    },

    /**
     * Observer pattern for status updates
     */
    statusListeners: [],
    onStatusChange(callback) {
        this.statusListeners.push(callback);
    },
    notifyStatusChange() {
        this.statusListeners.forEach(cb => cb(this.status, this.selectedModel, this.availableModels));
    }
};

window.MindHavenOllama = MindHavenOllama;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MindHavenOllama };
}
