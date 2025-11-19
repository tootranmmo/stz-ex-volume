// ============================================
// STZ Ex Volume Checker - Side Panel Script
// Communicates with Background Service Worker
// ============================================

class VolumeSidePanel {
    constructor() {
        this.keywords = [];
        this.isRunning = false;
        this.delayMin = 5;
        this.delayMax = 10;
        this.history = [];
        this.bgPort = null; // Connection to background service

        this.initElements();
        this.attachEventListeners();
        this.loadSettings();
        this.loadHistory();
        this.connectToBackground();
    }

    // ===== Background Connection =====
    connectToBackground() {
        try {
            // Establish persistent connection to background service
            this.bgPort = chrome.runtime.connect({ name: 'volumeChecker' });

            console.log('✓ Connected to background service');

            // Listen for messages from background
            this.bgPort.onMessage.addListener((message) => {
                this.handleBackgroundMessage(message);
            });

            // Handle disconnection
            this.bgPort.onDisconnect.addListener(() => {
                console.log('⚠️ Disconnected from background');
                this.bgPort = null;
                // Try to reconnect
                setTimeout(() => this.connectToBackground(), 1000);
            });

            // Request current status
            this.requestStatus();
        } catch (error) {
            console.error('Failed to connect to background:', error);
            this.addLog('Lỗi kết nối background service', 'error');
        }
    }

    handleBackgroundMessage(message) {
        console.log('Message from background:', message.action);

        switch (message.action) {
            case 'sessionMessage':
                this.addLog(message.message, message.type);
                break;

            case 'sessionStatus':
                this.updateSessionStatus(message.data);
                break;

            default:
                console.log('Unknown message:', message.action);
        }
    }

    updateSessionStatus(data) {
        if (!data || !data.session) {
            this.isRunning = false;
            this.updateStatusText('idle');
            return;
        }

        const session = data.session;
        const total = session.totalKeywords;
        const processed = session.processedKeywords;

        // Update progress
        this.totalKeywordsEl.textContent = total;
        this.checkedKeywordsEl.textContent = processed;

        const percentage = total > 0 ? Math.min(100, (processed / total) * 100) : 0;
        this.progressFillEl.style.width = percentage + '%';
        this.progressTextEl.textContent = percentage.toFixed(0) + '%';

        // Update batch info
        if (session.totalBatches > 0) {
            this.currentBatchEl.textContent = session.currentBatch + 1;
            this.totalBatchesEl.textContent = session.totalBatches;
            this.batchKeywordsCountEl.textContent = Math.min(100, total - session.currentBatch * 100);
            this.batchInfoEl.style.display = 'block';
        }

        // Update status
        if (data.isRunning) {
            this.isRunning = true;
            this.checkVolumBtn.style.display = 'none';
            this.stopBtn.style.display = 'block';
            this.updateStatusText('running');
        } else {
            this.isRunning = false;
            this.checkVolumBtn.style.display = 'block';
            this.stopBtn.style.display = 'none';

            if (session.status === 'completed') {
                this.updateStatusText('completed');
            } else if (session.status === 'stopped') {
                this.updateStatusText('stopped');
            } else {
                this.updateStatusText('idle');
            }
        }
    }

    requestStatus() {
        if (this.bgPort) {
            this.bgPort.postMessage({
                action: 'getStatus'
            });
        }
    }

    // ===== Element References =====
    initElements() {
        // Input elements
        this.keywordTextarea = document.getElementById('keywords-textarea');
        this.fileUpload = document.getElementById('file-upload');
        this.clearTextareaBtn = document.getElementById('clear-textarea');

        // Status elements
        this.totalKeywordsEl = document.getElementById('total-keywords');
        this.checkedKeywordsEl = document.getElementById('checked-keywords');
        this.statusTextEl = document.getElementById('status-text');
        this.progressFillEl = document.getElementById('progress-fill');
        this.progressTextEl = document.getElementById('progress-text');
        this.batchInfoEl = document.getElementById('batch-info');
        this.currentBatchEl = document.getElementById('current-batch');
        this.totalBatchesEl = document.getElementById('total-batches');
        this.batchKeywordsCountEl = document.getElementById('batch-keywords-count');

        // Settings elements
        this.delayMinEl = document.getElementById('delay-min');
        this.delayMaxEl = document.getElementById('delay-max');

        // Action buttons
        this.checkVolumBtn = document.getElementById('check-volume-btn');
        this.stopBtn = document.getElementById('stop-btn');

        // History elements
        this.historyList = document.getElementById('history-list');
        this.clearHistoryBtn = document.getElementById('clear-history');

        // Log elements
        this.logContainer = document.getElementById('log-container');
    }

    // ===== Event Listeners =====
    attachEventListeners() {
        this.clearTextareaBtn.addEventListener('click', () => this.clearTextarea());
        this.fileUpload.addEventListener('change', (e) => this.handleFileUpload(e));
        this.checkVolumBtn.addEventListener('click', () => this.startChecking());
        this.stopBtn.addEventListener('click', () => this.stopChecking());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        this.delayMinEl.addEventListener('change', () => this.saveSettings());
        this.delayMaxEl.addEventListener('change', () => this.saveSettings());
    }

    // ===== UI Update Methods =====
    updateStatusText(status) {
        const statusMap = {
            'idle': 'Sẵn sàng',
            'running': 'Đang chạy...',
            'completed': 'Hoàn thành',
            'stopped': 'Đã dừng',
            'error': 'Lỗi'
        };
        this.statusTextEl.textContent = statusMap[status] || status;
        this.statusTextEl.className = 'value status-' + status;
    }

    addLog(message, type = 'info') {
        const logEntry = document.createElement('p');
        logEntry.className = 'log-entry log-' + type;
        const timestamp = new Date().toLocaleTimeString('vi-VN');
        logEntry.textContent = `[${timestamp}] ${message}`;
        this.logContainer.appendChild(logEntry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    // ===== File & Text Handling =====
    clearTextarea() {
        if (confirm('Xóa nội dung?')) {
            this.keywordTextarea.value = '';
            this.addLog('Nội dung đã xóa', 'info');
        }
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            this.keywordTextarea.value = content;
            this.addLog(`File "${file.name}" tải lên (${content.split('\n').length} từ khóa)`, 'success');
        };
        reader.onerror = () => {
            this.addLog('Lỗi khi đọc file', 'error');
        };
        reader.readAsText(file);
    }

    getKeywordsFromInput() {
        const text = this.keywordTextarea.value.trim();
        if (!text) return [];

        return text
            .split('\n')
            .map(keyword => keyword.trim())
            .filter(keyword => keyword.length > 0);
    }

    // ===== Settings =====
    saveSettings() {
        this.delayMin = parseInt(this.delayMinEl.value) || 5;
        this.delayMax = parseInt(this.delayMaxEl.value) || 10;

        chrome.storage.local.set({
            delayMin: this.delayMin,
            delayMax: this.delayMax
        });
        this.addLog('Cài đặt đã lưu', 'success');
    }

    loadSettings() {
        chrome.storage.local.get(['delayMin', 'delayMax'], (result) => {
            this.delayMin = result.delayMin || 5;
            this.delayMax = result.delayMax || 10;

            this.delayMinEl.value = this.delayMin;
            this.delayMaxEl.value = this.delayMax;
        });
    }

    // ===== History Management =====
    addToHistory(data) {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('vi-VN'),
            totalKeywords: data.totalKeywords,
            processedKeywords: data.processedKeywords,
            batchesCompleted: data.batchesCompleted,
            csvFiles: data.csvFiles || [],
            status: data.status
        };

        this.history.unshift(historyItem);

        if (this.history.length > 20) {
            this.history.pop();
        }

        chrome.storage.local.set({ volumeCheckerHistory: this.history });
        this.renderHistory();
    }

    loadHistory() {
        chrome.storage.local.get(['volumeCheckerHistory'], (result) => {
            this.history = result.volumeCheckerHistory || [];
            this.renderHistory();
        });
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p class="empty-message">Chưa có</p>';
            return;
        }

        this.historyList.innerHTML = this.history.map(item => `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-item-title">#${item.id}</span>
                    <span class="history-item-time">${item.timestamp}</span>
                </div>
                <div class="history-item-detail">
                    📊 ${item.processedKeywords}/${item.totalKeywords} |
                    📦 ${item.batchesCompleted}B |
                    <span style="color: ${item.status === 'completed' ? '#00C853' : '#FFB300'}">
                        ${item.status === 'completed' ? '✓' : '⚠'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    clearHistory() {
        if (confirm('Xóa tất cả lịch sử?')) {
            this.history = [];
            chrome.storage.local.set({ volumeCheckerHistory: [] });
            this.renderHistory();
            this.addLog('Lịch sử đã xóa', 'info');
        }
    }

    // ===== Main Processing =====
    async startChecking() {
        this.keywords = this.getKeywordsFromInput();

        if (this.keywords.length === 0) {
            alert('Nhập từ khóa hoặc tải file txt');
            return;
        }

        // Check if user is on the website
        const tabs = await chrome.tabs.query({ url: 'https://searchvolume.com/*' });
        if (tabs.length === 0) {
            const confirmed = confirm(
                'Mở https://searchvolume.com/ trước.\n\n' +
                'Nhấp OK để mở.'
            );
            if (confirmed) {
                chrome.tabs.create({ url: 'https://searchvolume.com/' });
            }
            return;
        }

        // Send automation request to BACKGROUND SERVICE
        // Automation runs in background - sidebar can be closed!
        this.addLog(`🚀 Gửi ${this.keywords.length} từ đến background service`, 'success');

        if (!this.bgPort) {
            this.addLog('❌ Chưa kết nối background service', 'error');
            return;
        }

        // Clear textarea
        this.keywordTextarea.value = '';

        // Send message to background - automation will run there!
        this.bgPort.postMessage({
            action: 'startAutomation',
            tabId: tabs[0].id,
            keywords: this.keywords,
            delayMin: this.delayMin,
            delayMax: this.delayMax
        });
    }


    stopChecking() {
        if (confirm('Dừng kiểm tra?')) {
            if (this.bgPort) {
                this.bgPort.postMessage({
                    action: 'stopAutomation'
                });
                this.addLog('⏹ Gửi lệnh dừng đến background service', 'warning');
            } else {
                this.addLog('❌ Chưa kết nối background service', 'error');
            }
        }
    }

    // ===== Utilities =====
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== Initialize Side Panel =====
document.addEventListener('DOMContentLoaded', () => {
    window.volumePanel = new VolumeSidePanel();
});
