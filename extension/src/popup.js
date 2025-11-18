// ============================================
// STZ Ex Volume Checker - Popup Script
// ============================================

class VolumeChecker {
    constructor() {
        this.keywords = [];
        this.currentBatch = 0;
        this.totalBatches = 0;
        this.isRunning = false;
        this.saveFolder = '';
        this.delayMin = 5;
        this.delayMax = 10;
        this.history = [];
        this.currentSession = null;

        this.initElements();
        this.attachEventListeners();
        this.loadSettings();
        this.loadHistory();
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
        this.saveFolderEl = document.getElementById('save-folder');
        this.chooseFolderBtn = document.getElementById('choose-folder');
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
        this.chooseFolderBtn.addEventListener('click', () => this.chooseFolder());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        this.delayMinEl.addEventListener('change', () => this.saveSettings());
        this.delayMaxEl.addEventListener('change', () => this.saveSettings());
    }

    // ===== UI Update Methods =====
    updateProgressUI() {
        const total = this.keywords.length;
        const checked = this.currentBatch * 100;
        const percentage = total > 0 ? Math.min(100, (checked / total) * 100) : 0;

        this.totalKeywordsEl.textContent = total;
        this.checkedKeywordsEl.textContent = checked;
        this.progressFillEl.style.width = percentage + '%';
        this.progressTextEl.textContent = percentage.toFixed(0) + '%';

        if (this.totalBatches > 0) {
            this.currentBatchEl.textContent = this.currentBatch + 1;
            this.totalBatchesEl.textContent = this.totalBatches;
            this.batchKeywordsCountEl.textContent = Math.min(100, this.keywords.length - this.currentBatch * 100);
            this.batchInfoEl.style.display = 'block';
        }
    }

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
        if (confirm('Bạn có chắc muốn xóa nội dung?')) {
            this.keywordTextarea.value = '';
            this.addLog('Nội dung đã được xóa', 'info');
        }
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            this.keywordTextarea.value = content;
            this.addLog(`File "${file.name}" đã được tải lên (${content.split('\n').length} từ khóa)`, 'success');
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
            delayMax: this.delayMax,
            saveFolder: this.saveFolder
        });
        this.addLog('Cài đặt đã được lưu', 'success');
    }

    loadSettings() {
        chrome.storage.local.get(['delayMin', 'delayMax', 'saveFolder'], (result) => {
            this.delayMin = result.delayMin || 5;
            this.delayMax = result.delayMax || 10;
            this.saveFolder = result.saveFolder || '';

            this.delayMinEl.value = this.delayMin;
            this.delayMaxEl.value = this.delayMax;
            if (this.saveFolder) {
                this.saveFolderEl.value = this.saveFolder;
            }
        });
    }

    chooseFolder() {
        // Simulated folder selection
        this.addLog('Tính năng chọn thư mục sẽ được cập nhật', 'warning');
        alert('Tính năng chọn thư mục đang phát triển.\nHiện tại tệp CSV sẽ được lưu vào thư mục Downloads mặc định của trình duyệt.');
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

        // Keep only last 20 items
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
            this.historyList.innerHTML = '<p class="empty-message">Chưa có lịch sử</p>';
            return;
        }

        this.historyList.innerHTML = this.history.map(item => `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-item-title">Batch #${item.id}</span>
                    <span class="history-item-time">${item.timestamp}</span>
                </div>
                <div class="history-item-detail">
                    📊 ${item.processedKeywords}/${item.totalKeywords} từ khóa |
                    📦 ${item.batchesCompleted} batch |
                    <span style="color: ${item.status === 'completed' ? '#00C853' : '#FFB300'}">
                        ${item.status === 'completed' ? '✓ Hoàn thành' : '⚠ Dừng'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    clearHistory() {
        if (confirm('Bạn có chắc muốn xóa tất cả lịch sử?')) {
            this.history = [];
            chrome.storage.local.set({ volumeCheckerHistory: [] });
            this.renderHistory();
            this.addLog('Lịch sử đã được xóa', 'info');
        }
    }

    // ===== Main Processing =====
    async startChecking() {
        this.keywords = this.getKeywordsFromInput();

        if (this.keywords.length === 0) {
            alert('Vui lòng nhập từ khóa hoặc tải file txt');
            return;
        }

        // Check if user is on the website
        const tabs = await chrome.tabs.query({ url: 'https://searchvolume.com/*' });
        if (tabs.length === 0) {
            const confirmed = confirm(
                'Bạn cần mở trang https://searchvolume.com/ trước.\n\n' +
                'Nhấp OK để mở trang này.'
            );
            if (confirmed) {
                chrome.tabs.create({ url: 'https://searchvolume.com/' });
            }
            return;
        }

        this.isRunning = true;
        this.currentBatch = 0;
        this.totalBatches = Math.ceil(this.keywords.length / 100);
        this.currentSession = {
            startTime: new Date(),
            totalKeywords: this.keywords.length,
            processedKeywords: 0,
            batchesCompleted: 0,
            csvFiles: []
        };

        this.checkVolumBtn.style.display = 'none';
        this.stopBtn.style.display = 'block';
        this.updateStatusText('running');
        this.addLog(`Bắt đầu kiểm tra ${this.keywords.length} từ khóa (${this.totalBatches} batch)`, 'success');

        await this.processBatches(tabs[0].id);
    }

    async processBatches(tabId) {
        while (this.currentBatch < this.totalBatches && this.isRunning) {
            const startIdx = this.currentBatch * 100;
            const endIdx = Math.min(startIdx + 100, this.keywords.length);
            const batchKeywords = this.keywords.slice(startIdx, endIdx);

            this.addLog(`📦 Batch ${this.currentBatch + 1}/${this.totalBatches}: Xử lý ${batchKeywords.length} từ khóa`, 'info');

            try {
                // Inject content script and run automation
                await this.runAutomation(tabId, batchKeywords);

                this.currentSession.processedKeywords += batchKeywords.length;
                this.currentSession.batchesCompleted += 1;
                this.currentBatch += 1;
                this.updateProgressUI();

                // Random delay between batches
                if (this.currentBatch < this.totalBatches) {
                    const delay = this.getRandomDelay();
                    this.addLog(`⏳ Chờ ${delay}s trước batch tiếp theo...`, 'warning');
                    await this.sleep(delay * 1000);
                }
            } catch (error) {
                this.addLog(`❌ Lỗi ở batch ${this.currentBatch + 1}: ${error.message}`, 'error');
                await this.sleep(5000);
            }
        }

        if (this.isRunning) {
            this.completeChecking();
        }
    }

    async runAutomation(tabId, keywords) {
        return new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(
                tabId,
                { action: 'automateVolumeCheck', keywords, delayMin: this.delayMin, delayMax: this.delayMax },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else if (response && response.success) {
                        resolve(response);
                    } else {
                        reject(new Error(response?.error || 'Lỗi không xác định'));
                    }
                }
            );
        });
    }

    completeChecking() {
        this.isRunning = false;
        this.checkVolumBtn.style.display = 'block';
        this.stopBtn.style.display = 'none';
        this.updateStatusText('completed');

        const duration = Math.round((new Date() - this.currentSession.startTime) / 1000);
        const message = `✅ Kiểm tra hoàn thành! Đã xử lý ${this.currentSession.processedKeywords} từ khóa trong ${duration}s`;
        this.addLog(message, 'success');

        this.currentSession.status = 'completed';
        this.addToHistory(this.currentSession);

        // Clear input
        this.keywordTextarea.value = '';
    }

    stopChecking() {
        if (confirm('Bạn có chắc muốn dừng kiểm tra?')) {
            this.isRunning = false;
            this.checkVolumBtn.style.display = 'block';
            this.stopBtn.style.display = 'none';
            this.updateStatusText('stopped');

            const message = `⏹ Kiểm tra đã dừng! Đã xử lý ${this.currentSession.processedKeywords}/${this.currentSession.totalKeywords} từ khóa`;
            this.addLog(message, 'warning');

            this.currentSession.status = 'stopped';
            this.addToHistory(this.currentSession);
        }
    }

    // ===== Utilities =====
    getRandomDelay() {
        return Math.floor(Math.random() * (this.delayMax - this.delayMin + 1) + this.delayMin);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== Initialize Extension =====
document.addEventListener('DOMContentLoaded', () => {
    window.volumeChecker = new VolumeChecker();
});
