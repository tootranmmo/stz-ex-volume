# 🔧 Tài Liệu Kỹ Thuật - STZ Ex Volume Checker

## 📋 Tổng Quan Kiến Trúc

```
STZ Ex Volume Checker (Extension)
│
├─── Popup Interface (popup.html)
│    └─── UI Components (popup.css)
│         └─── Business Logic (popup.js)
│
├─── Content Script (content-script.js)
│    └─── Automation Logic
│         └─── XPath Selectors
│
├─── Background Worker (background.js)
│    └─── Message Handling
│         └─── Download Management
│
└─── Storage (Chrome Storage API)
     ├─── Settings
     ├─── History
     └─── Configuration
```

## 📦 Cấu Trúc File

```
extension/
├── manifest.json                 # Chrome Extension Config
│   ├── metadata (name, version)
│   ├── permissions
│   ├── host_permissions
│   ├── scripts
│   └── icons
│
├── src/
│   ├── popup.html               # Main UI
│   │   ├── Input Section
│   │   ├── Status Section
│   │   ├── Settings Section
│   │   ├── Action Section
│   │   ├── History Section
│   │   └── Log Section
│   │
│   ├── popup.css                # Styling
│   │   ├── Color Scheme
│   │   ├── Responsive Design
│   │   ├── Animations
│   │   └── Component Styles
│   │
│   ├── popup.js                 # Main Logic
│   │   ├── VolumeChecker Class
│   │   ├── Event Handlers
│   │   ├── UI Updates
│   │   ├── File Management
│   │   └── History Management
│   │
│   ├── content-script.js        # Website Automation
│   │   ├── WebsiteAutomation Class
│   │   ├── XPath Utilities
│   │   ├── DOM Interactions
│   │   ├── Keywords Input
│   │   ├── Country Selection
│   │   ├── Volume Retrieval
│   │   ├── CSV Download
│   │   └── Message Listener
│   │
│   └── background.js            # Service Worker
│       ├── Installation Handler
│       ├── Message Handler
│       ├── Download Manager
│       └── Tab Updates
│
└── README.md, INSTALLATION_GUIDE.md, USAGE_GUIDE.md
```

## 🎯 Main Classes & Methods

### VolumeChecker (popup.js)

```javascript
class VolumeChecker {
    // Properties
    keywords: string[]              // Danh sách từ khóa
    isRunning: boolean             // Trạng thái chạy
    delayMin/Max: number           // Delay settings
    history: object[]              // Lịch sử kiểm tra

    // DOM References
    keywordTextarea                // Input textarea
    checkVolumBtn                  // Main button
    logContainer                   // Log display

    // Core Methods
    startChecking()                // Bắt đầu quy trình
    stopChecking()                 // Dừng quy trình
    processBatches()               // Xử lý batches
    runAutomation()                // Gọi content script
    completeChecking()             // Hoàn thành

    // UI Methods
    updateProgressUI()             // Cập nhật progress bar
    updateStatusText()             // Cập nhật trạng thái
    addLog()                       // Thêm log

    // File Methods
    getKeywordsFromInput()         // Lấy từ khóa
    handleFileUpload()             // Xử lý upload file
    clearTextarea()                // Xóa textarea

    // Settings Methods
    saveSettings()                 // Lưu cài đặt
    loadSettings()                 // Tải cài đặt
    chooseFolder()                 // Chọn thư mục

    // History Methods
    addToHistory()                 // Thêm vào lịch sử
    loadHistory()                  // Tải lịch sử
    renderHistory()                // Render lịch sử
    clearHistory()                 // Xóa lịch sử
}
```

### WebsiteAutomation (content-script.js)

```javascript
class WebsiteAutomation {
    // Core Methods
    processKeywordBatch()          // Main automation flow
    addKeywords()                  // Nhập từ khóa
    selectCountry()                // Chọn quốc gia
    getSearchVolume()              // Lấy volume
    downloadCSV()                  // Tải CSV
    clearAllKeywords()             // Xóa từ khóa

    // DOM Methods
    getElementByXpath()            // XPath selector
    getAllElementsByXpath()        // XPath multi-select
    setInputValue()                // Set input value
    clickButton()                  // Click button

    // Utility Methods
    waitForResultsToLoad()         // Wait for results
    sleep()                        // Delay
}
```

## 🔌 Chrome APIs Used

### 1. Storage API
```javascript
// Save
chrome.storage.local.set({
    delayMin: 5,
    volumeCheckerHistory: [...],
    saveFolder: '/path'
});

// Load
chrome.storage.local.get(['delayMin'], (result) => {
    // Handle result
});
```

### 2. Tabs API
```javascript
// Query tabs
chrome.tabs.query({ url: 'https://searchvolume.com/*' }, (tabs) => {
    // Use tabs
});

// Send message
chrome.tabs.sendMessage(tabId, {
    action: 'automateVolumeCheck',
    keywords: [...],
    delayMin: 5,
    delayMax: 10
}, (response) => {
    // Handle response
});

// Create tab
chrome.tabs.create({ url: 'https://searchvolume.com/' });
```

### 3. Runtime API
```javascript
// Receive message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'automateVolumeCheck') {
        // Process
        sendResponse(result);
    }
    return true; // Async response
});
```

### 4. Downloads API
```javascript
chrome.downloads.download({
    url: url,
    filename: 'search-volume-{timestamp}.csv',
    saveAs: false
}, (downloadId) => {
    // Handle download
});
```

## 🎨 Color Scheme

```
Primary:     #00D4FF (Cyan) - Main actions
Primary Dark: #0098CC (Dark Cyan)
Secondary:   #FF6B9D (Pink) - Secondary actions
Success:     #00C853 (Green) - Success/completion
Danger:      #FF5252 (Red) - Errors/stop
Warning:     #FFB300 (Orange) - Warnings/delays
Background:  #F5F7FA (Light Gray)
Surface:     #FFFFFF (White)
Text Dark:   #2C3E50 (Dark)
Text Light:  #7F8C8D (Gray)
```

## 🔍 XPath Selectors

### Keyword Input
```
//input[@id='tags-input::r7R1::input' and @data-scope='tags-input' and @data-part='input']
```

### Country Input
```
//input[@id='combobox::r0::input' and @data-scope='combobox' and @data-part='input']
```

### Submit Button
```
//button[@id='submit']
```

### Download CSV Button
```
//button[@title='Download CSV']
```

### Clear Keywords Button
```
//button[@title='Clear all keywords']
```

## 📊 Data Structures

### Keywords Array
```javascript
keywords: [
    'laptop gaming',
    'keyboard mechanical',
    'mouse wireless',
    ...
]
```

### History Item
```javascript
{
    id: 1234567890,
    timestamp: '2024-11-18 10:30:45',
    totalKeywords: 500,
    processedKeywords: 250,
    batchesCompleted: 3,
    csvFiles: [
        'search-volume-1234567890.csv',
        'search-volume-1234567891.csv',
        'search-volume-1234567892.csv'
    ],
    status: 'completed' // or 'stopped'
}
```

### Settings Object
```javascript
{
    delayMin: 5,
    delayMax: 10,
    saveFolder: '',
    volumeCheckerHistory: [...]
}
```

## 🔄 Message Flow

### Popup → Content Script
```
popup.js sends:
{
    action: 'automateVolumeCheck',
    keywords: ['keyword1', 'keyword2', ...],
    delayMin: 5,
    delayMax: 10
}

content-script.js receives and sends back:
{
    success: true,
    message: 'Successfully processed 100 keywords',
    keywordsProcessed: 100
}
OR
{
    success: false,
    error: 'Timeout waiting for results'
}
```

### Popup → Background
```
popup.js sends:
{
    action: 'downloadCSV',
    data: 'csv content...',
    filename: 'search-volume-123456.csv'
}

background.js downloads the file
```

## ⚙️ Configuration

### Default Settings
```javascript
const DEFAULT_CONFIG = {
    delayMin: 5,           // seconds
    delayMax: 10,          // seconds
    keywordsPerBatch: 100,
    maxRetries: 3,
    timeoutMs: 15000,
    maxHistoryItems: 20
};
```

### Adjustable Settings
- `delayMin` - Minimum random delay (seconds)
- `delayMax` - Maximum random delay (seconds)
- `saveFolder` - CSV save location

## 🔐 Security & Permissions

### Required Permissions
- `storage` - Local data storage
- `activeTab` - Current tab interaction
- `scripting` - Execute scripts
- `tabs` - Tab management
- `downloads` - File downloads

### Host Permissions
- `https://searchvolume.com/*` - Target website

## 🧪 Testing

### Manual Testing Checklist
- [ ] Install extension successfully
- [ ] Popup opens without errors
- [ ] Settings save and load correctly
- [ ] File upload works
- [ ] Keyword input processing works
- [ ] Start/Stop buttons function
- [ ] Automation runs on target website
- [ ] CSV downloads
- [ ] History records sessions
- [ ] Logs display correctly

### XPath Validation
Before running automation, verify XPaths exist:
```javascript
const xpaths = [
    "//input[@id='tags-input::r7R1::input'...]",
    "//input[@id='combobox::r0::input'...]",
    "//button[@id='submit']",
    "//button[@title='Download CSV']",
    "//button[@title='Clear all keywords']"
];

xpaths.forEach(xpath => {
    const el = document.evaluate(xpath, document, null,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    console.log(`${xpath}: ${el ? '✓' : '✗'}`);
});
```

## 🚀 Performance Optimization

### Current Optimizations
1. Batch processing (100 keywords at a time)
2. Async/await for smooth UI
3. Event delegation for listeners
4. Lazy history loading
5. Efficient XPath caching

### Possible Improvements
1. Web Workers for heavy tasks
2. IndexedDB for larger history
3. Service Worker caching
4. Progressive enhancement
5. Memory optimization

## 📝 Logging System

### Log Levels
```
✓ success  - Green (#00C853)
ℹ info     - Cyan (#00D4FF)
⚠ warning - Orange (#FFB300)
✗ error   - Red (#FF5252)
```

### Log Format
```
[HH:MM:SS] [LEVEL] Message
[10:30:45] [INFO] 📦 Batch 1/5: Xử lý 100 từ khóa
[10:31:05] [SUCCESS] ✓ Added 100 keywords
[10:31:30] [WARNING] ⏳ Chờ 7s trước batch tiếp theo...
[10:32:00] [ERROR] ❌ Timeout waiting for results
```

## 🔧 Development Tips

### Adding New Features
1. Update manifest.json if needed
2. Add UI elements to popup.html
3. Style in popup.css
4. Add logic to popup.js
5. Test thoroughly
6. Update documentation

### Debugging
```javascript
// In popup.js or content-script.js
console.log('Debug message', data);

// In Chrome DevTools
// Popup: Right-click extension icon → Inspect popup
// Content Script: F12 on target website, check Console
// Background: chrome://extensions → Details → Service Worker
```

### Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Script not injecting | Check manifest permissions |
| XPath not found | Verify selector with console |
| Storage not persisting | Check quota limits |
| Delays not working | Ensure async/await properly |
| Buttons not clickable | Check DOM readiness |

## 📚 References

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [XPath Syntax](https://www.w3.org/TR/xpath-10/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Chrome Tabs API](https://developer.chrome.com/docs/extensions/reference/tabs/)

---

**Phiên bản:** 1.0.0
**Cập nhật cuối:** November 2024
