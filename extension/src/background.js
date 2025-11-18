// ============================================
// STZ Ex Volume Checker - Background Service Worker
// ============================================

console.log('Background service worker loaded');

// ===== Event Handlers =====

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Extension installed');
        // Initialize storage
        chrome.storage.local.set({
            volumeCheckerHistory: [],
            delayMin: 5,
            delayMax: 10,
            saveFolder: ''
        });
    }
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'logMessage') {
        console.log('[' + sender.url + ']', request.message);
        sendResponse({ received: true });
    }

    if (request.action === 'downloadCSV') {
        handleCSVDownload(request.data, request.filename);
        sendResponse({ downloaded: true });
    }

    return true;
});

// ===== Download Helper =====
function handleCSVDownload(csvContent, filename) {
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url: url,
        filename: filename || `search-volume-${Date.now()}.csv`,
        saveAs: false
    }, (downloadId) => {
        console.log('Download started with ID:', downloadId);
    });
}

// ===== Tab Update Handler =====
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('searchvolume.com')) {
        console.log('searchvolume.com tab loaded');
    }
});

console.log('Background service worker ready');
