# 🏗️ Architecture - Background Service Automation

## System Overview

The STZ Ex Volume Checker extension has been refactored to run all automation in a background service worker, with the sidebar serving as a UI-only interface.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Chrome Extension Architecture                 │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────┐
    │   User Opens Sidebar     │
    │   (side-panel.html)      │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────────────────┐
    │        Sidebar UI (side-panel.js)               │
    │  - Keyword input                                │
    │  - Settings (delays)                            │
    │  - Progress display                             │
    │  - Log output                                   │
    │  - History list                                 │
    └────────┬─────────────────────────┬──────────────┘
             │                         │
             │ Port Connection         │ Session Status
             │ (chrome.runtime.connect) │ Updates
             │                         │
             ▼                         ▼
    ┌──────────────────────────────────────────────────────────┐
    │   Background Service Worker (background.js)              │
    │                                                          │
    │   BackgroundAutomationService:                          │
    │   - Session Management                                 │
    │   - Batch Processing (100 keywords at a time)           │
    │   - Port/Message Management                            │
    │   - Keep-Alive (chrome.alarms)                         │
    │                                                          │
    │   Message Handlers:                                     │
    │   - 'startAutomation' → runs automation               │
    │   - 'stopAutomation' → stops session                  │
    │   - 'getStatus' → returns current status              │
    │                                                          │
    │   Broadcasting:                                         │
    │   - Sends 'sessionMessage' to all connected ports      │
    │   - Sends 'sessionStatus' to all connected ports       │
    └────────┬──────────────────────────────────────────────┬──┘
             │                                              │
             │ Sends message to Content Script              │ Broadcasts
             │ (chrome.tabs.sendMessage)                    │ to Sidebar
             │                                              │
             ▼                                              ▼
    ┌──────────────────────────────┐          ┌─────────────────────┐
    │  Content Script              │          │  Sidebar Receives   │
    │  (content-script.js)        │          │  - Progress Updates │
    │                              │          │  - Status Messages  │
    │  WebsiteAutomation:         │          │  - Log Entries      │
    │  - addKeywords()             │          │  - Batch Info       │
    │  - selectCountry()           │          └─────────────────────┘
    │  - getSearchVolume()        │
    │  - downloadCSV()            │
    │  - clearAllKeywords()       │
    │                              │
    │  Returns result to          │
    │  background service         │
    └──────────────────────────────┘
            │
            ▼
    ┌──────────────────────────────────────────┐
    │    searchvolume.com Website              │
    │    - Input keyword                       │
    │    - Select country (Vietnam)            │
    │    - Click "Get Search Volume"           │
    │    - Download CSV                        │
    │    - Clear keywords                      │
    └──────────────────────────────────────────┘
```

## 🔄 Message Flow Sequence

### Starting Automation

```
1. User enters keywords in sidebar
2. User clicks "Check Volume" button
   ↓
3. sidebar.startChecking():
   - Gets keywords from textarea
   - Checks if user is on searchvolume.com
   - Clears textarea
   - Sends message to background service:
     {
       action: 'startAutomation',
       tabId: 123,
       keywords: ['keyword1', 'keyword2', ...],
       delayMin: 5,
       delayMax: 10
     }
   ↓
4. background.js receives message via onMessage listener
   ↓
5. automationService.runAutomation(tabId, keywords, delayMin, delayMax):
   - Creates session
   - Starts keep-alive alarm
   - Begins processBatches()
   ↓
6. For each batch (100 keywords):
   - Sends message to content script:
     {
       action: 'automateVolumeCheck',
       keywords: [batch of keywords],
       delayMin: 5,
       delayMax: 10
     }
   ↓
7. content-script.js processes batch:
   - Adds keywords one by one
   - Selects country (Vietnam)
   - Gets search volume
   - Downloads CSV
   - Clears keywords
   - Sends result back to background
   ↓
8. background.js receives result:
   - Updates processedKeywords count
   - Increments batchesCompleted
   - Broadcasts status to all connected ports:
     {
       action: 'sessionStatus',
       data: {
         isRunning: true,
         session: {
           processedKeywords: 100,
           totalKeywords: 200,
           currentBatch: 1,
           totalBatches: 2,
           ...
         }
       }
     }
   ↓
9. sidebar.js receives status update via bgPort.onMessage:
   - Calls updateSessionStatus(data)
   - Updates progress bar
   - Updates keyword counts
   - Updates batch info
```

### Automation Completion

```
When all batches are done:

1. background.js completes session:
   - automationService.completeSession()
   - Saves session to history
   - Broadcasts completion message:
     {
       action: 'sessionStatus',
       data: { isRunning: false, ... }
     }
   ↓
2. sidebar.js receives completion:
   - Updates status to 'completed'
   - Shows "✅ Hoàn thành! X từ trong Ys"
   - Shows "Check Volume" button again
   - Hides "Stop" button
```

### Stopping Automation

```
1. User clicks "Stop" button
2. sidebar.stopChecking() sends message:
   {
     action: 'stopAutomation'
   }
   ↓
3. background.js receives message:
   - automationService.stopSession()
   - Sets isRunning = false
   - Current batch finishes, then stops
   ↓
4. Broadcasts stopped status to sidebar:
   {
     action: 'sessionStatus',
     data: { isRunning: false, session: { status: 'stopped' } }
   }
   ↓
5. sidebar.js updates UI:
   - Status changes to 'stopped'
   - "Check Volume" button reappears
```

### Sidebar Closed/Reopened

```
1. Automation is running in background
2. User closes sidebar (Chrome button)
   - bgPort.onDisconnect fires
   - Port removed from automationService.connectedPorts
   - Background automation CONTINUES (not affected!)
   ↓
3. User opens sidebar again
   - side-panel.js constructor runs
   - connectToBackground() creates new port connection
   - bgPort.onMessage listener is reestablished
   - requestStatus() asks for current session status
   ↓
4. background.js returns current status:
   - sidebar receives up-to-date progress
   - Progress bar updates
   - Log shows latest messages
   - UI is in sync with background
```

## 📦 Key Components

### 1. **Sidebar (side-panel.js)**

**Responsibilities**:
- User input handling (keywords, settings, file upload)
- UI display (progress, status, logs, history)
- Communication with background service

**Key Methods**:
- `connectToBackground()` - Establish port connection
- `startChecking()` - Send automation request to background
- `stopChecking()` - Send stop request to background
- `handleBackgroundMessage()` - Process messages from background
- `updateSessionStatus()` - Update UI based on background status
- `requestStatus()` - Query current background status

**Port Connection**:
```javascript
this.bgPort = chrome.runtime.connect({ name: 'volumeChecker' });
this.bgPort.onMessage.addListener((message) => {
    this.handleBackgroundMessage(message);
});
```

### 2. **Background Service (background.js)**

**Responsibilities**:
- Session management
- Batch processing coordination
- Port/message broadcasting
- Keep-alive management

**Key Methods**:
- `startSession()` - Initialize automation session
- `processBatches()` - Run batches one by one
- `sendToContentScript()` - Send batch to content script
- `addMessage()` - Add log entry and broadcast to ports
- `broadcastToAll()` - Send message to all connected ports
- `addPort()/removePort()` - Manage port connections

**Port Listener**:
```javascript
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'volumeChecker') {
        automationService.addPort(port);
        port.onMessage.addListener((message) => {
            switch(message.action) {
                case 'startAutomation': // ...
                case 'stopAutomation': // ...
                case 'getStatus': // ...
            }
        });
    }
});
```

### 3. **Content Script (content-script.js)**

**Responsibilities**:
- DOM interaction on searchvolume.com
- XPath-based element selection with fallbacks
- Keyword input and form submission
- CSV download triggering

**Key Methods**:
- `addKeywords()` - Add keywords with fallback XPaths
- `selectCountry()` - Select Vietnam from dropdown
- `getSearchVolume()` - Click submit button
- `downloadCSV()` - Trigger CSV download
- `processKeywordBatch()` - Main automation flow

**Message Handler**:
```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'automateVolumeCheck') {
        automation.processKeywordBatch(
            request.keywords,
            request.delayMin,
            request.delayMax
        ).then(result => {
            sendResponse(result);
        });
        return true; // Async response
    }
});
```

## 🔌 Communication Protocols

### Port Messages (Sidebar ↔ Background)

**startAutomation**:
```javascript
{
  action: 'startAutomation',
  tabId: number,
  keywords: string[],
  delayMin: number,
  delayMax: number
}
```

**stopAutomation**:
```javascript
{
  action: 'stopAutomation'
}
```

**getStatus**:
```javascript
{
  action: 'getStatus'
}
```

**sessionMessage** (background → sidebar):
```javascript
{
  action: 'sessionMessage',
  message: string,
  type: 'info'|'success'|'warning'|'error',
  sessionId: number
}
```

**sessionStatus** (background → sidebar):
```javascript
{
  action: 'sessionStatus',
  data: {
    isRunning: boolean,
    session: {
      id: number,
      status: 'running'|'completed'|'stopped'|'failed',
      currentBatch: number,
      totalBatches: number,
      processedKeywords: number,
      totalKeywords: number,
      batchesCompleted: number,
      messages: { text: string, type: string }[]
    }
  }
}
```

### Content Script Messages (Background → Content)

**automateVolumeCheck**:
```javascript
{
  action: 'automateVolumeCheck',
  keywords: string[],
  delayMin: number,
  delayMax: number
}
```

**Response**:
```javascript
{
  success: boolean,
  message?: string,
  error?: string,
  keywordsProcessed?: number
}
```

## ⚡ Keep-Alive Strategy

Since Chrome can suspend service workers, we use `chrome.alarms` to keep it active:

```javascript
// In background.js runAutomation():
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });

// Keep-alive handler:
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
        console.log('Keep alive ping'); // Service worker stays alive
    }
});

// After automation completes:
chrome.alarms.clear('keepAlive');
```

This ensures the background service doesn't get suspended during long automation runs.

## 🎯 Session Lifecycle

```
IDLE
  │
  └─→ [User clicks Start] → RUNNING
        ├─→ [Batch 1] → Process 100 keywords
        ├─→ [Batch 2] → Process 100 keywords
        ├─→ ...
        ├─→ [Last Batch] → Process remaining
        │
        └─→ COMPLETED (auto-save to history)
              OR
        └─→ STOPPED (user clicked stop)
              OR
        └─→ FAILED (error occurred)
```

## 🔒 Error Handling

**If batch fails**:
- Message logged to sidebar
- Wait 5 seconds
- Continue to next batch
- Session continues (not aborted)

**If content script unavailable**:
- Rejection caught in processBatches()
- Error message sent to sidebar
- Retry logic implemented

**If background service crashes**:
- Sidebar reconnection handler activates
- `connectToBackground()` retries every 1 second
- On reconnect, `requestStatus()` syncs state

## 📊 State Management

### Background State:
```javascript
this.isRunning = false;              // Is automation active?
this.currentSession = null;          // Current session data
this.activeTabId = null;             // Tab being automated
this.connectedPorts = [];            // Connected sidebar instances
```

### Sidebar State:
```javascript
this.keywords = [];                  // Keywords to process
this.isRunning = false;              // Local running flag
this.delayMin = 5;                   // Min delay between batches
this.delayMax = 10;                  // Max delay between batches
this.history = [];                   // Local history cache
this.bgPort = null;                  // Connection to background
```

## 🚀 Benefits of This Architecture

1. **Independence**: Automation runs in background, unaffected by sidebar state
2. **Reliability**: Service worker keeps running even if user closes sidebar
3. **Scalability**: Multiple sidebar instances can connect to same background
4. **Responsiveness**: Background sends status updates, UI stays in sync
5. **Persistence**: Session data maintained even if sidebar disconnected
6. **Error Recovery**: Automatic reconnection and state recovery

---

**Last Updated**: November 2024
**Version**: 1.0.0
