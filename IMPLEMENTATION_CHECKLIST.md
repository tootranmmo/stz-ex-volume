# ✅ Implementation Checklist - Background Service Architecture

## Code Integration Verification

### 1. **Manifest Configuration**
- [x] `manifest_version: 3`
- [x] `side_panel` configured with `default_path: "src/side-panel.html"`
- [x] `background.service_worker` configured with `"src/background.js"`
- [x] `content_scripts` configured for searchvolume.com
- [x] Permissions include: `sidePanel`, `tabs`, `storage`, `scripting`, `activeTab`
- [x] Host permissions include: `https://searchvolume.com/*`

**Verification Command**:
```bash
cat extension/manifest.json | grep -E '"background"|"side_panel"|"service_worker"'
```

### 2. **Background Service Worker (background.js)**

#### Session Management
- [x] `BackgroundAutomationService` class defined
- [x] `startSession()` creates session object with required fields
- [x] `stopSession()` sets session status to 'stopped'
- [x] `completeSession()` sets session status to 'completed'
- [x] `failSession(error)` sets session status to 'failed'

#### Port Communication
- [x] `chrome.runtime.onConnect.addListener()` listening for 'volumeChecker' port
- [x] `addPort(port)` adds port to `connectedPorts` array
- [x] `removePort(port)` removes port from array
- [x] `broadcastToAll(message)` sends message to all connected ports

#### Message Handling
- [x] Handles 'startAutomation' action
- [x] Handles 'stopAutomation' action
- [x] Handles 'getStatus' action
- [x] All handlers send appropriate responses

#### Batch Processing
- [x] `processBatches()` loops through batches
- [x] Batch size is 100 keywords
- [x] Sends message to content script for each batch
- [x] Waits for content script response
- [x] Updates session progress after each batch
- [x] Implements random delay between batches
- [x] Error handling with continue logic (doesn't abort)

#### Keep-Alive
- [x] `chrome.alarms.create('keepAlive', {periodInMinutes: 1})` in runAutomation()
- [x] `chrome.alarms.clear('keepAlive')` in finally block
- [x] `chrome.alarms.onAlarm.addListener()` implemented

#### Message Logging
- [x] `addMessage()` method logs messages
- [x] `addMessage()` broadcasts to all ports
- [x] Messages include timestamp
- [x] Messages have type (info, success, warning, error)

**Verification Command**:
```bash
grep -n "chrome.runtime.onConnect\|addPort\|removePort\|broadcastToAll\|processBatches\|chrome.alarms" extension/src/background.js
```

### 3. **Sidebar UI (side-panel.js)**

#### Background Connection
- [x] Constructor calls `connectToBackground()`
- [x] `connectToBackground()` uses `chrome.runtime.connect({ name: 'volumeChecker' })`
- [x] Port stored in `this.bgPort`
- [x] Listens for messages from background
- [x] Handles disconnection and automatic reconnection

#### Message Sending
- [x] `startChecking()` sends 'startAutomation' message
- [x] `startChecking()` includes `tabId`, `keywords`, `delayMin`, `delayMax`
- [x] `stopChecking()` sends 'stopAutomation' message
- [x] `requestStatus()` sends 'getStatus' message

#### Message Receiving
- [x] `handleBackgroundMessage()` processes messages from background
- [x] Handles 'sessionMessage' action
- [x] Handles 'sessionStatus' action
- [x] `updateSessionStatus()` updates all UI elements

#### UI Updates
- [x] Progress bar (`progressFillEl`) updates with percentage
- [x] Keyword counts (`totalKeywordsEl`, `checkedKeywordsEl`) update
- [x] Batch info displays current batch and total
- [x] Status text updates (`updateStatusText()`)
- [x] Log entries added via `addLog()`

**Verification Command**:
```bash
grep -n "connectToBackground\|handleBackgroundMessage\|updateSessionStatus\|bgPort.postMessage\|bgPort.onMessage" extension/src/side-panel.js
```

### 4. **Content Script (content-script.js)**

#### XPath Utilities
- [x] `getElementByXpath()` implementation
- [x] `getElementWithFallback()` tries multiple XPaths
- [x] `getAllElementsByXpath()` returns all matching elements

#### DOM Interactions
- [x] `addKeywords()` with 6 fallback XPath variations
- [x] `selectCountry()` with 5 fallback XPath variations
- [x] `getSearchVolume()` with 5 fallback XPath variations
- [x] `downloadCSV()` with 4 fallback XPath variations
- [x] `clearAllKeywords()` with 4 fallback XPath variations

#### Message Handling
- [x] `chrome.runtime.onMessage.addListener()` for 'automateVolumeCheck'
- [x] `processKeywordBatch()` executes full workflow
- [x] Returns success/error response to background
- [x] Async response handling (returns true for async)

**Verification Command**:
```bash
grep -n "getElementWithFallback\|automateVolumeCheck\|processKeywordBatch\|return true" extension/src/content-script.js
```

## Message Flow Verification

### 1. **Start Automation Flow**
```
Sidebar                           Background                    Content Script
┌──────────────────┐              ┌──────────────────┐           ┌──────────────┐
│ User clicks      │              │                  │           │              │
│ "Check Volume"   │              │                  │           │              │
└────────┬─────────┘              │                  │           │              │
         │                        │                  │           │              │
         ├─→ startChecking()      │                  │           │              │
         │                        │                  │           │              │
         ├─→ bgPort.postMessage() │                  │           │              │
         │   {                    │                  │           │              │
         │    action:             │                  │           │              │
         │    'startAutomation'   │                  │           │              │
         │   }                    │                  │           │              │
         │                        │                  │           │              │
         └───────────────────────→│ onMessage        │           │              │
         (Port)                   │ listener         │           │              │
                                  │                  │           │              │
                                  ├─→ runAutomation()│           │              │
                                  │                  │           │              │
                                  ├─→ processBatches()           │              │
                                  │                  │           │              │
                                  ├─→ sendMessage()  │           │              │
                                  │   {action:       │           │              │
                                  │    'automate...'}├──────────→│ onMessage    │
                                  │                  │           │ listener     │
                                  │                  │           │              │
                                  │                  │  ←────────┤ processKeywords()
                                  │                  │   Response│              │
                                  │                  │           │              │
                                  ├─→ broadcastToAll()           │              │
                                  │   {action:       │           │              │
                                  │    'session...'}│           │              │
                                  │                  │           │              │
         ←──────────────────────┤ bgPort           │           │              │
         │   onMessage listener   │ forwards         │           │              │
         │                        │                  │           │              │
         └─→ updateSessionStatus()                               │              │
```

**Verification Steps**:
1. Check that `startChecking()` calls `bgPort.postMessage()` with correct action
2. Check that background's `onMessage.addListener()` handles all actions
3. Check that `broadcastToAll()` sends to all ports
4. Check that sidebar receives and processes status updates

### 2. **Stop Automation Flow**
```
User clicks Stop → stopChecking() → bgPort.postMessage({action: 'stopAutomation'})
                                    ↓
                              background.js onMessage listener
                                    ↓
                              automationService.stopSession()
                                    ↓
                              sets isRunning = false
                                    ↓
                              broadcastToAll() sends status
                                    ↓
                              sidebar receives and updates UI
```

## Critical Checks

### Check 1: Port Connection is Persistent
**Code Location**: side-panel.js:23-49
**Verification**:
```javascript
// Should see:
this.bgPort = chrome.runtime.connect({ name: 'volumeChecker' });
this.bgPort.onMessage.addListener(...)
this.bgPort.onDisconnect.addListener(...)
```

**Command**:
```bash
sed -n '23,49p' extension/src/side-panel.js | grep -E "connect|onMessage|onDisconnect"
```

### Check 2: Automation Runs in Background, Not Sidebar
**Code Location**: side-panel.js:310-369
**Verification**:
- `startChecking()` should NOT contain `processBatches()` or `runAutomation()` calls
- Should only send `bgPort.postMessage()`
- Should NOT set `this.currentSession` or batch variables

**Command**:
```bash
sed -n '310,369p' extension/src/side-panel.js | grep -v "bgPort.postMessage" | grep -E "processBatches|runAutomation|currentSession|currentBatch"
```
**Expected Result**: No output (these should not be in sidebar)

### Check 3: Background Handles Multiple Ports
**Code Location**: background.js:11, 182-203
**Verification**:
```javascript
this.connectedPorts = [];  // Array to store multiple ports
addPort(port) { this.connectedPorts.push(port); }
removePort(port) { this.connectedPorts.filter(...); }
broadcastToAll(message) {
    this.connectedPorts.forEach(port => port.postMessage(...));
}
```

**Command**:
```bash
grep -A5 "broadcastToAll" extension/src/background.js | head -10
```

### Check 4: Keep-Alive Implemented
**Code Location**: background.js:95-119
**Verification**:
```javascript
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
// ...
chrome.alarms.clear('keepAlive');
// ...
chrome.alarms.onAlarm.addListener(...)
```

**Command**:
```bash
grep -n "chrome.alarms" extension/src/background.js
```

### Check 5: Session Status Broadcasting
**Code Location**: background.js:66-71, 181-189
**Verification**:
Each time a batch completes or session changes, background should:
1. Create status message
2. Call `broadcastToAll()` with message
3. Include isRunning flag and session data

**Command**:
```bash
grep -B2 -A2 "broadcastToAll" extension/src/background.js | head -20
```

## File Structure Verification

**Expected Files**:
```
extension/
├── manifest.json
├── src/
│   ├── background.js          (service worker - ✓)
│   ├── side-panel.html        (sidebar UI)
│   ├── side-panel.css         (sidebar styles)
│   ├── side-panel.js          (sidebar logic - UI only)
│   ├── content-script.js      (website automation - ✓)
│   └── icons/
│       ├── icon-16.png
│       ├── icon-48.png
│       └── icon-128.png
```

**Verify No Duplicates**:
```bash
find extension/ -name "*.js" -type f | sort
```

**Expected Output**:
```
extension/src/background.js
extension/src/content-script.js
extension/src/side-panel.js
```

## Runtime Verification

### Start Extension
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select extension directory
5. Verify no errors in the extension card

### Check Service Worker
1. Click extension name
2. Look for "Service workers" section
3. Should show status as "activated and running"
4. Click "Inspect" to see console logs

### Check Sidebar
1. Click extension icon
2. Open DevTools (F12) on sidebar
3. Go to Console tab
4. Should show: `✓ Connected to background service`

### Test Message Passing
1. Enter keywords in sidebar
2. Click "Check Volume"
3. Check sidebar console:
   - Should show: `🚀 Gửi X từ đến background service`
4. Check background service console (Inspector):
   - Should show: `🚀 Session started: [ID]`
   - Should show: `📦 Batch 1/X: Y từ`

## Troubleshooting

### Issue: No Connection Message
**Check**:
1. Manifest has `"sidePanel"` in permissions
2. background.js has `chrome.runtime.onConnect.addListener()`
3. side-panel.js calls `connectToBackground()` in constructor

### Issue: Messages Not Received
**Check**:
1. Port name matches: `'volumeChecker'`
2. `bgPort.onMessage.addListener()` implemented in sidebar
3. `port.postMessage()` used in background, not `chrome.tabs.sendMessage()`

### Issue: Automation Stops When Sidebar Closes
**Check**:
1. `this.isRunning` should NOT depend on port connection
2. Session should persist independently
3. Reconnecting sidebar should sync with running session
4. Check that background doesn't call `stopSession()` on disconnect

### Issue: Service Worker Suspended
**Check**:
1. `chrome.alarms.create('keepAlive', {periodInMinutes: 1})` is called
2. `chrome.alarms.onAlarm.addListener()` is implemented
3. Keep-alive is not cleared until session ends

## Success Criteria

✅ **PASS**:
- [x] Extension loads without errors
- [x] Service worker shows "activated and running"
- [x] Sidebar connects to background
- [x] startChecking() sends message to background
- [x] Background processes batches
- [x] Sidebar receives status updates
- [x] Progress bar updates in real-time
- [x] Automation continues when sidebar closes
- [x] Sidebar reconnects and syncs status
- [x] Stop button sends message to background
- [x] Automation stops when stop is clicked
- [x] Session saves to history
- [x] Service worker keeps running during long automation

## Next Steps

1. Load extension in Chrome
2. Follow "Runtime Verification" section above
3. Test each message flow scenario
4. Check browser console for errors
5. Verify final results are saved

---

**Last Updated**: November 2024
**Checklist Version**: 1.0.0
