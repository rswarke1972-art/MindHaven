// ============================================
// MINDHAVEN - Main Chatbot Controller
// ============================================

const MindHavenChatbot = {
    isGenerating: false,
    currentAbortController: null,

    /**
     * Initializes the Chatbot UI and connects to Ollama background probe
     */
    async init() {
        console.log('🤖 Initializing MindHaven Chatbot Controller...');

        // Register status change listener for Ollama
        if (typeof MindHavenOllama !== 'undefined') {
            MindHavenOllama.onStatusChange((status, model) => {
                this.updateStatusBadge(status, model);
            });

            // Initial connection probe (non-blocking)
            const userModelPref = (typeof MindHaven !== 'undefined' && MindHaven.settings) 
                ? MindHaven.settings.ollamaModel 
                : null;
            const userEndpoint = (typeof MindHaven !== 'undefined' && MindHaven.settings) 
                ? MindHaven.settings.ollamaEndpoint 
                : null;

            MindHavenOllama.connect(userEndpoint, userModelPref);
        }

        // Render saved transcript
        this.renderTranscript();
    },

    /**
     * Sends user message and manages safety checks, Ollama streaming, or fallback
     * @param {string} userText 
     */
    async sendMessage(userText) {
        if (!userText || !userText.trim() || this.isGenerating) return;

        const cleanInput = userText.trim();

        // 1. Add User Message to Transcript & Session
        const userMsg = {
            id: 'msg_' + Date.now(),
            sender: 'user',
            content: cleanInput,
            timestamp: new Date().toISOString()
        };

        if (typeof MindHavenSession !== 'undefined') {
            MindHavenSession.saveMessage(userMsg);
        }
        this.appendMessageToUI(userMsg);

        // Clear UI Input Field
        const inputEl = document.getElementById('chatInput');
        if (inputEl) inputEl.value = '';

        // 2. Pre-response Safety Check (Deterministic Crisis Classifier)
        if (typeof MindHavenSafety !== 'undefined') {
            const safetyResult = MindHavenSafety.evaluatePreResponse(cleanInput);
            if (safetyResult.isCrisis && safetyResult.overrideResponse) {
                const crisisMsg = safetyResult.overrideResponse;
                if (typeof MindHavenSession !== 'undefined') {
                    MindHavenSession.saveMessage(crisisMsg);
                }
                this.appendMessageToUI(crisisMsg);
                return;
            }
        }

        // 3. Prepare AI Bot Response Container
        this.isGenerating = true;
        this.updateSendButtonState(true);

        const botMsgId = 'msg_' + (Date.now() + 1);
        const botMsgObj = {
            id: botMsgId,
            sender: 'bot',
            content: '',
            timestamp: new Date().toISOString(),
            actions: []
        };

        const botBubbleEl = this.createBotBubbleUI(botMsgId);

        // 4. Determine Route: Ollama Streaming vs. Offline Fallback
        const isOllamaConnected = (typeof MindHavenOllama !== 'undefined' && MindHavenOllama.status === 'connected');

        if (isOllamaConnected) {
            try {
                this.currentAbortController = new AbortController();

                // Build Message Array with System Prompt & Privacy-Scoped Context
                const messages = [];

                let sysContent = (typeof MindHavenPrompts !== 'undefined') 
                    ? MindHavenPrompts.systemPrompt 
                    : 'You are Haven, a mental wellness companion.';

                if (typeof MindHavenContext !== 'undefined') {
                    sysContent += MindHavenContext.buildUserContextPrompt();
                }

                messages.push({ role: 'system', content: sysContent });

                // Add recent chat history (up to last 6 messages)
                if (typeof MindHavenSession !== 'undefined') {
                    const history = MindHavenSession.getHistory().slice(-7, -1);
                    history.forEach(m => {
                        messages.push({
                            role: m.sender === 'user' ? 'user' : 'assistant',
                            content: m.content
                        });
                    });
                }

                messages.push({ role: 'user', content: cleanInput });

                let rawStreamContent = '';

                await MindHavenOllama.streamChat(
                    messages,
                    (chunk, done) => {
                        rawStreamContent += chunk;

                        // Parse actions & update streaming bubble UI
                        const parsed = (typeof MindHavenActions !== 'undefined')
                            ? MindHavenActions.parseActionTokens(rawStreamContent)
                            : { cleanText: rawStreamContent, actions: [] };

                        botMsgObj.content = parsed.cleanText;
                        botMsgObj.actions = parsed.actions;

                        this.updateBotBubbleUI(botMsgId, parsed.cleanText, parsed.actions, !done);

                        if (done) {
                            if (typeof MindHavenSession !== 'undefined') {
                                MindHavenSession.saveMessage(botMsgObj);
                            }
                        }
                    },
                    this.currentAbortController.signal
                );

            } catch (err) {
                console.warn('Ollama streaming error, switching to fallback:', err);
                this.executeFallbackResponse(cleanInput, botMsgId, botMsgObj);
            } finally {
                this.isGenerating = false;
                this.currentAbortController = null;
                this.updateSendButtonState(false);
            }
        } else {
            // Execute Rule-Based Offline Companion Response
            setTimeout(() => {
                this.executeFallbackResponse(cleanInput, botMsgId, botMsgObj);
                this.isGenerating = false;
                this.updateSendButtonState(false);
            }, 400);
        }
    },

    /**
     * Executes offline companion response
     */
    executeFallbackResponse(userText, botMsgId, botMsgObj) {
        const rawFallback = (typeof MindHavenFallback !== 'undefined')
            ? MindHavenFallback.getResponse(userText)
            : 'I am here with you in offline mode. Let us take a breath together.';

        const parsed = (typeof MindHavenActions !== 'undefined')
            ? MindHavenActions.parseActionTokens(rawFallback)
            : { cleanText: rawFallback, actions: [] };

        botMsgObj.content = parsed.cleanText;
        botMsgObj.actions = parsed.actions;

        this.updateBotBubbleUI(botMsgId, parsed.cleanText, parsed.actions, false);

        if (typeof MindHavenSession !== 'undefined') {
            MindHavenSession.saveMessage(botMsgObj);
        }
    },

    /**
     * Renders saved chat transcript
     */
    renderTranscript() {
        const transcriptEl = document.getElementById('chatTranscript');
        if (!transcriptEl) return;

        transcriptEl.innerHTML = '';

        const history = (typeof MindHavenSession !== 'undefined') 
            ? MindHavenSession.getHistory() 
            : [];

        if (history.length === 0) {
            // Welcome message
            this.appendMessageToUI({
                id: 'welcome_msg',
                sender: 'bot',
                content: `👋 **Welcome to MindHaven Companion!**

I am Haven, your gentle self-care & wellness companion. How are you feeling today? You can talk to me about what is on your mind, or choose a quick prompt below.`,
                timestamp: new Date().toISOString(),
                actions: [
                    { type: 'coping_tool', id: 'box_breathing', label: '🫁 Deep Breathing' },
                    { type: 'navigate', id: 'dashboard', label: '🏠 Log Mood' }
                ]
            });
            return;
        }

        history.forEach(msg => this.appendMessageToUI(msg));
        this.scrollToBottom();
    },

    /**
     * Appends message object to transcript DOM
     */
    appendMessageToUI(msg) {
        const transcriptEl = document.getElementById('chatTranscript');
        if (!transcriptEl) return;

        const rowEl = document.createElement('div');
        rowEl.className = `chat-row ${msg.sender}-row`;
        rowEl.id = msg.id;

        const bubbleEl = document.createElement('div');
        bubbleEl.className = `chat-bubble ${msg.sender}-bubble ${msg.isCrisisOverride ? 'crisis-bubble' : ''}`;

        // Format Markdown / line breaks safely
        let htmlContent = this.formatMarkdown(msg.content);

        bubbleEl.innerHTML = `<div class="bubble-text">${htmlContent}</div>`;

        // Render Action Buttons if any
        if (msg.actions && msg.actions.length > 0) {
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'chat-actions-container';

            msg.actions.forEach(act => {
                const btn = document.createElement('button');
                btn.className = 'chat-action-pill';
                btn.textContent = act.label;
                btn.onclick = () => {
                    if (typeof MindHavenActions !== 'undefined') {
                        MindHavenActions.executeAction(act.type, act.id);
                    }
                };
                actionsContainer.appendChild(btn);
            });

            bubbleEl.appendChild(actionsContainer);
        }

        rowEl.appendChild(bubbleEl);
        transcriptEl.appendChild(rowEl);
        this.scrollToBottom();
    },

    /**
     * Creates empty bot streaming bubble element
     */
    createBotBubbleUI(msgId) {
        const transcriptEl = document.getElementById('chatTranscript');
        if (!transcriptEl) return null;

        const rowEl = document.createElement('div');
        rowEl.className = 'chat-row bot-row';
        rowEl.id = msgId;

        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'chat-bubble bot-bubble streaming';
        bubbleEl.innerHTML = `<div class="bubble-text"><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div><div class="chat-actions-container"></div>`;

        rowEl.appendChild(bubbleEl);
        transcriptEl.appendChild(rowEl);
        this.scrollToBottom();
        return bubbleEl;
    },

    /**
     * Updates bot bubble text during stream
     */
    updateBotBubbleUI(msgId, text, actions, isStreaming) {
        const rowEl = document.getElementById(msgId);
        if (!rowEl) return;

        const bubbleEl = rowEl.querySelector('.chat-bubble');
        const textEl = rowEl.querySelector('.bubble-text');
        const actionsContainer = rowEl.querySelector('.chat-actions-container');

        if (bubbleEl) {
            if (isStreaming) {
                bubbleEl.classList.add('streaming');
            } else {
                bubbleEl.classList.remove('streaming');
            }
        }

        if (textEl) {
            textEl.innerHTML = this.formatMarkdown(text) + (isStreaming ? '<span class="cursor-blink">|</span>' : '');
        }

        if (actionsContainer) {
            actionsContainer.innerHTML = '';
            if (actions && actions.length > 0) {
                actions.forEach(act => {
                    const btn = document.createElement('button');
                    btn.className = 'chat-action-pill';
                    btn.textContent = act.label;
                    btn.onclick = () => {
                        if (typeof MindHavenActions !== 'undefined') {
                            MindHavenActions.executeAction(act.type, act.id);
                        }
                    };
                    actionsContainer.appendChild(btn);
                });
            }
        }

        this.scrollToBottom();
    },

    /**
     * Simple markdown formatter (bold, lists, code, links)
     */
    formatMarkdown(text) {
        if (!text) return '';
        let formatted = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `<p>${formatted}</p>`;
    },

    /**
     * Updates status badge UI (🟢, 🟡, 🔴)
     */
    updateStatusBadge(status, model) {
        const badgeEl = document.getElementById('chatStatusBadge');
        if (!badgeEl) return;

        if (status === 'connected') {
            badgeEl.className = 'chat-status-badge status-connected';
            badgeEl.innerHTML = `<span class="status-dot">🟢</span> <span class="status-text">${model || 'Qwen'}</span>`;
        } else if (status === 'connecting') {
            badgeEl.className = 'chat-status-badge status-connecting';
            badgeEl.innerHTML = `<span class="status-dot">🟡</span> <span class="status-text">Connecting...</span>`;
        } else {
            badgeEl.className = 'chat-status-badge status-offline';
            badgeEl.innerHTML = `<span class="status-dot">🔴</span> <span class="status-text">Offline Companion</span>`;
        }
    },

    /**
     * Updates send button UI state during generation
     */
    updateSendButtonState(disabled) {
        const btn = document.getElementById('chatSendBtn');
        if (btn) {
            btn.disabled = disabled;
            btn.innerHTML = disabled ? '⌛' : '➤';
        }
    },

    /**
     * Auto scrolls chat transcript to bottom
     */
    scrollToBottom() {
        const transcriptEl = document.getElementById('chatTranscript');
        if (transcriptEl) {
            transcriptEl.scrollTop = transcriptEl.scrollHeight;
        }
    },

    /**
     * Clears chat session
     */
    clearChat() {
        if (typeof MindHavenSession !== 'undefined') {
            MindHavenSession.clearHistory();
        }
        this.renderTranscript();
    }
};

window.MindHavenChatbot = MindHavenChatbot;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MindHavenChatbot };
}
