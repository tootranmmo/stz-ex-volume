# 🧪 Background Service Testing Guide

## Overview

This guide helps verify that the STZ Ex Volume Checker extension runs automation in the background service worker, independent of the sidebar UI state.

## ✅ Key Features to Test

### 1. **Sidebar Connection to Background Service**
- [ ] Open extension sidebar
- [ ] Check console logs show: `✓ Connected to background service`
- [ ] Check that `bgPort` is established in side-panel.js
- [ ] Sidebar reconnects automatically if disconnected

### 2. **Start Automation (Send to Background)**
- [ ] Enter keywords in sidebar textarea
- [ ] Click "Check Volume" button
- [ ] Verify sidebar shows: `🚀 Gửi X từ đến background service`
- [ ] Verify `startAutomation` message is sent to background
- [ ] Sidebar status changes to "Đang chạy..."

### 3. **Background Service Runs Automation**
- [ ] Open DevTools → Background Service Worker console (chrome://extensions → Details → Inspect)
- [ ] Verify session starts: `🚀 Session started: [timestamp]`
- [ ] Verify batches are processed: `📦 Batch 1/X: Y từ`
- [ ] Verify CSV downloads are requested: `✓ Batch X hoàn thành`
- [ ] Automation continues even if sidebar is closed

### 4. **Sidebar Receives Status Updates**
- [ ] While automation runs, sidebar shows real-time progress
- [ ] Progress bar updates
- [ ] Batch count increases
- [ ] Log messages appear in sidebar
- [ ] Status shows "Đang chạy..." while background runs

### 5. **Sidebar Can Be Closed (Automation Continues!)**
- [ ] Click sidebar close button while automation is running
- [ ] **Important**: Automation should NOT stop
- [ ] Open sidebar again → should reconnect and show current progress
- [ ] Verify no messages like "Disconnected from background"
- [ ] Automation completes in background

### 6. **Session Completion**
- [ ] When background finishes, sidebar receives completion status
- [ ] Sidebar shows: `✅ Hoàn thành! X từ trong Ys`
- [ ] Status changes to "Hoàn thành"
- [ ] History is updated with session record
- [ ] Session is saved to Chrome storage

### 7. **Stop Automation from Sidebar**
- [ ] Start automation
- [ ] Click "Stop" button in sidebar
- [ ] Confirm the dialog
- [ ] Verify sidebar shows: `⏹ Gửi lệnh dừng đến background service`
- [ ] Verify background receives: `stopAutomation` message
- [ ] Automation stops in background service
- [ ] Session status changes to "Đã dừng"

### 8. **Service Worker Keep-Alive**
- [ ] Start long automation session (100+ keywords)
- [ ] Check that background service doesn't get suspended
- [ ] Verify `chrome.alarms` is managing keep-alive pings
- [ ] Open DevTools → Application → Service Workers → verify status

### 9. **Multiple Sidebar Reconnections**
- [ ] Start automation
- [ ] Close sidebar
- [ ] Wait 2-3 seconds
- [ ] Open sidebar again
- [ ] Verify it reconnects: `✓ Connected to background service`
- [ ] Sidebar syncs with current background status
- [ ] Progress bar shows latest values from background

### 10. **Error Handling**
- [ ] If content script fails, sidebar receives error message
- [ ] Background continues trying next batch (with 5s delay)
- [ ] Error messages appear in sidebar log
- [ ] Session status reflects errors but continues

## 🔍 How to Verify (Step by Step)

### Step 1: Load Extension
```
1. Open chrome://extensions/
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select extension folder
5. Verify extension appears with 🧩 icon
```

### Step 2: Open Sidebar Console
```
1. Click extension icon
2. Open DevTools (F12)
3. Go to "Console" tab
4. Check for connection messages
```

### Step 3: Open Background Service Worker Console
```
1. chrome://extensions/
2. Find "STZ Ex Volume Checker"
3. Click "Inspect" (in background section)
4. New window opens with background service logs
```

### Step 4: Start Test
```
1. Go to https://searchvolume.com/
2. Open extension sidebar (click icon)
3. Enter test keywords (e.g., "test keyword 1", "test keyword 2")
4. Click "Check Volume"
5. Watch both consoles for messages
```

### Step 5: Test Close Sidebar
```
1. While automation runs, close sidebar
2. Check if background automation continues
3. Open sidebar again
4. Verify status is in sync
```

## 📊 Expected Console Output

### Sidebar Console (side-panel.js)
```
✓ Connected to background service
🚀 Gửi 2 từ đến background service
```

### Background Service Console (background.js)
```
Connection established: volumeChecker
🚀 Session started: 1234567890123
📦 Batch 1/1: 2 từ
✓ Batch 1 hoàn thành
✅ Hoàn thành! 2 từ
Session completed
```

## 🐛 Troubleshooting

### Issue: Sidebar Shows "Chưa kết nối background service"
**Solution**:
- Reload extension (chrome://extensions → Refresh icon)
- Check background service is running
- Verify manifest.json has correct background configuration

### Issue: "Cannot send message to disconnected port"
**Solution**:
- Background service crashed
- Reload extension
- Check background service errors (Inspect button)

### Issue: Sidebar Doesn't Receive Status Updates
**Solution**:
- Verify bgPort is properly connected
- Check handleBackgroundMessage() is firing
- Verify background is sending sessionStatus messages
- Check port.postMessage() in broadcastToAll()

### Issue: Automation Stops When Sidebar Closes
**This Should NOT Happen!**
- **Root cause**: Port disconnection shouldn't stop background
- **Fix**: Verify background.js keeps automation running even if all ports disconnect
- **Check**: `this.isRunning` should persist even if `this.connectedPorts` is empty

### Issue: Multiple Browser Tabs Show Duplicate Logs
**Solution**:
- This is normal - each sidebar instance is a port
- All ports receive the same messages
- Can be filtered by checking port.name

## ✨ Success Criteria

✅ **PASS**:
- Sidebar starts automation and sends to background
- Background processes all batches
- Sidebar can be closed without stopping automation
- Sidebar reconnects and syncs status
- Final results saved to history

❌ **FAIL**:
- Automation stops when sidebar closes
- Sidebar doesn't receive status updates
- Background service crashes during run
- Port messages cause errors

## 📝 Testing Checklist

- [ ] Extension loads without errors
- [ ] Sidebar connects to background service
- [ ] Automation sends to background (not running in sidebar)
- [ ] Background service logs show batch processing
- [ ] Sidebar can be closed mid-automation
- [ ] Sidebar reconnects and syncs status
- [ ] Automation completes and saves to history
- [ ] Stop button sends stop message to background
- [ ] Error handling works (failed batches retry)
- [ ] Service worker stays alive during long runs

## 🚀 Performance Notes

**Expected Behavior**:
- With 100 keywords: ~10-15 seconds per batch
- Random delays: 5-10 seconds between batches
- Total time for 500 keywords: ~2-3 minutes
- Background service should NOT be suspended by Chrome

**Monitoring**:
- Open chrome://extensions/ → Details → View details
- Check "Service workers" section
- Should show "activated and running"

---

**Last Updated**: November 2024
**Extension Version**: 1.0.0 with Background Service Optimization
