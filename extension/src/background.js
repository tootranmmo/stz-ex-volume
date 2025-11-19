// ============================================
// STZ Ex Volume Checker - Background Service Worker
// ============================================

// Create automation service instance
class BackgroundAutomationService {
    constructor() {
        this.isRunning = false;
        this.currentSession = null;
        this.activeTabId = null;
        this.connectedPorts = [];
    }

    startSession(keywords, delayMin, delayMax) {
        this.currentSession = {
            id: Date.now(),
            keywords: keywords,
            delayMin: delayMin,
            delayMax: delayMax,
            startTime: new Date(),
            currentBatch: 0,
            totalBatches: Math.ceil(keywords.length / 100),
            processedKeywords: 0,
            batchesCompleted: 0,
            status: 'running',
            messages: []
        };

        this.isRunning = true;
        console.log('🚀 Session started:', this.currentSession.id);
        return this.currentSession.id;
    }

    stopSession() {
        if (this.currentSession) {
            this.currentSession.status = 'stopped';
            this.isRunning = false;
            console.log('⏹ Session stopped');
        }
    }

    completeSession() {
        if (this.currentSession) {
            this.currentSession.status = 'completed';
            this.isRunning = false;
            console.log('✅ Session completed');
        }
    }

    failSession(error) {
        if (this.currentSession) {
            this.currentSession.status = 'failed';
            this.currentSession.error = error;
            this.isRunning = false;
            console.log('❌ Session failed:', error);
        }
    }

    addMessage(message, type = 'info') {
        if (this.currentSession) {
            const timestamp = new Date().toLocaleTimeString('vi-VN');
            const logEntry = `[${timestamp}] ${message}`;
            this.currentSession.messages.push({ text: logEntry, type });

            // Broadcast to all connected ports
            this.broadcastToAll({
                action: 'sessionMessage',
                message: logEntry,
                type: type,
                sessionId: this.currentSession.id
            });
        }
    }

    getSessionStatus() {
        if (!this.currentSession) {
            return { isRunning: false, session: null };
        }

        return {
            isRunning: this.isRunning,
            session: {
                id: this.currentSession.id,
                status: this.currentSession.status,
                currentBatch: this.currentSession.currentBatch,
                totalBatches: this.currentSession.totalBatches,
                processedKeywords: this.currentSession.processedKeywords,
                totalKeywords: this.currentSession.keywords.length,
                batchesCompleted: this.currentSession.batchesCompleted,
                messages: this.currentSession.messages.slice(-20)
            }
        };
    }

    async runAutomation(tabId, keywords, delayMin, delayMax) {
        this.activeTabId = tabId;
        const sessionId = this.startSession(keywords, delayMin, delayMax);

        try {
            // Keep service worker alive
            chrome.alarms.create('keepAlive', { periodInMinutes: 1 });

            await this.processBatches(tabId, keywords, delayMin, delayMax);

            this.completeSession();
            this.addMessage(`✅ Hoàn thành! ${this.currentSession.processedKeywords} từ`, 'success');

            // Save to history
            await this.saveSessionToHistory();

            return { success: true, sessionId };
        } catch (error) {
            this.failSession(error.message);
            this.addMessage(`❌ Error: ${error.message}`, 'error');
            throw error;
        } finally {
            chrome.alarms.clear('keepAlive');
        }
    }

    async processBatches(tabId, keywords, delayMin, delayMax) {
        const totalBatches = Math.ceil(keywords.length / 100);

        for (let batch = 0; batch < totalBatches; batch++) {
            if (!this.isRunning) {
                this.addMessage('⏹ Stopped by user', 'warning');
                break;
            }

            const startIdx = batch * 100;
            const endIdx = Math.min(startIdx + 100, keywords.length);
            const batchKeywords = keywords.slice(startIdx, endIdx);

            this.currentSession.currentBatch = batch;

            this.addMessage(`📦 Batch ${batch + 1}/${totalBatches}: ${batchKeywords.length} từ`, 'info');

            try {
                const result = await this.sendToContentScript(tabId, {
                    action: 'automateVolumeCheck',
                    keywords: batchKeywords,
                    delayMin,
                    delayMax
                });

                if (result.success) {
                    this.currentSession.processedKeywords += batchKeywords.length;
                    this.currentSession.batchesCompleted += 1;

                    this.addMessage(`✓ Batch ${batch + 1} hoàn thành`, 'success');

                    if (batch < totalBatches - 1) {
                        const delay = Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
                        this.addMessage(`⏳ Chờ ${delay}s...`, 'warning');
                        await this.sleep(delay * 1000);
                    }
                } else {
                    throw new Error(result.error || 'Batch failed');
                }
            } catch (error) {
                this.addMessage(`⚠️ Batch ${batch + 1} error: ${error.message}`, 'error');
                await this.sleep(5000);
            }
        }
    }

    sendToContentScript(tabId, message) {
        return new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tabId, message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (response) {
                    resolve(response);
                } else {
                    reject(new Error('No response'));
                }
            });
        });
    }

    broadcastToAll(message) {
        this.connectedPorts.forEach(port => {
            try {
                port.postMessage(message);
            } catch (error) {
                console.warn('Failed to send message:', error);
            }
        });
    }

    addPort(port) {
        this.connectedPorts.push(port);
        // Send current status immediately
        port.postMessage({
            action: 'sessionStatus',
            data: this.getSessionStatus()
        });
        console.log('Port connected, total:', this.connectedPorts.length);
    }

    removePort(port) {
        this.connectedPorts = this.connectedPorts.filter(p => p !== port);
        console.log('Port disconnected, remaining:', this.connectedPorts.length);
    }

    async saveSessionToHistory() {
        if (!this.currentSession) return;

        const result = await chrome.storage.local.get('volumeCheckerHistory');
        const history = result.volumeCheckerHistory || [];

        const sessionRecord = {
            id: this.currentSession.id,
            timestamp: new Date().toLocaleString('vi-VN'),
            totalKeywords: this.currentSession.keywords.length,
            processedKeywords: this.currentSession.processedKeywords,
            batchesCompleted: this.currentSession.batchesCompleted,
            status: this.currentSession.status,
            duration: Math.round((new Date() - this.currentSession.startTime) / 1000)
        };

        history.unshift(sessionRecord);
        if (history.length > 20) history.pop();

        await chrome.storage.local.set({ volumeCheckerHistory: history });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global service instance
const automationService = new BackgroundAutomationService();

console.log('Background service worker loaded');

// ===== Installation Handler =====
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Extension installed');
        chrome.storage.local.set({
            volumeCheckerHistory: [],
            delayMin: 5,
            delayMax: 10
        });
    }
});

// ===== Action Icon Click =====
chrome.action.onClicked.addListener(async (tab) => {
    try {
        await chrome.sidePanel.open({ tabId: tab.id });
        console.log('Side panel opened');
    } catch (error) {
        console.error('Error opening side panel:', error);
    }
});

// ===== Port-based Communication =====
chrome.runtime.onConnect.addListener((port) => {
    console.log('Connection established:', port.name);

    if (port.name === 'volumeChecker') {
        automationService.addPort(port);

        // Handle messages from side panel
        port.onMessage.addListener((message) => {
            console.log('Message received:', message.action);

            switch (message.action) {
                case 'startAutomation':
                    automationService.runAutomation(
                        message.tabId,
                        message.keywords,
                        message.delayMin,
                        message.delayMax
                    ).catch(error => {
                        console.error('Automation error:', error);
                    });
                    break;

                case 'stopAutomation':
                    automationService.stopSession();
                    break;

                case 'getStatus':
                    port.postMessage({
                        action: 'sessionStatus',
                        data: automationService.getSessionStatus()
                    });
                    break;

                default:
                    console.log('Unknown action:', message.action);
            }
        });

        // Handle port disconnect
        port.onDisconnect.addListener(() => {
            automationService.removePort(port);
        });
    }
});

// ===== Keep Service Worker Alive =====
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
        console.log('Keep alive ping');
    }
});

console.log('Background service worker ready');
