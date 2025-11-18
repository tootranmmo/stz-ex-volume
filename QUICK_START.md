# ⚡ Quick Start - STZ Ex Volume Checker

## 🎯 5-Minute Setup

### Step 1: Load Extension (2 min)

```
1. Open: chrome://extensions/
2. Toggle "Developer mode" (top right)
3. Click "Load unpacked"
4. Select: stz-ex-volume/extension/
5. Done! ✅
```

### Step 2: Open Sidebar (1 min)

```
1. Click extension icon (right corner)
2. Sidebar opens on right side
3. Ready to use!
```

### Step 3: Enter Keywords (1 min)

```
Method 1 - Direct input:
  • Paste keywords in textarea
  • One keyword per line

Method 2 - Upload file:
  • Create file.txt with keywords
  • Click "Upload TXT"
  • Select file
```

### Step 4: Start Checking (1 min)

```
1. Open: https://searchvolume.com/
2. Click "▶ Kiểm Tra" button
3. Sidebar handles everything:
   ✓ Adds keywords
   ✓ Selects Vietnam
   ✓ Gets volume
   ✓ Downloads CSV
   ✓ Clears & repeats
4. Done! ✅
```

## 📱 Sidebar vs Popup

**This version: Sidebar** ✅

- Opens as right-side panel
- Click icon to toggle
- Full viewport height
- Resizable by user
- See website + sidebar

**Legacy: Popup** (still available)

- Small fixed window
- Limited space
- Blocks content

## 🔑 Key Files

```
extension/
├── manifest.json              ← Extension config
├── src/
│   ├── side-panel.html       ← Sidebar UI
│   ├── side-panel.css        ← Styling
│   ├── side-panel.js         ← Logic
│   ├── content-script.js     ← Website interaction
│   ├── background.js         ← Background worker
│   └── icons/                ← Icons (3 sizes)
└── ...
```

## 🎮 Basic Usage

### Input Keywords

**Option A: Paste**
```
laptop gaming
keyboard mechanical
mouse wireless
monitor 4k
headphone bluetooth
```

**Option B: Upload**
```
Create file.txt with keywords
Upload via "Upload TXT" button
```

### Configure (Optional)

```
⚙️ Settings:
  • Delay Min: 5 (sec)
  • Delay Max: 10 (sec)

Good values:
  • Slow: 10-15s (safe)
  • Normal: 5-10s (default)
  • Fast: 2-5s (risky)
```

### Run Check

```
1. Open searchvolume.com
2. Click "▶ Kiểm Tra"
3. Watch progress:
   📊 Tiến Trộ - shows %, status
   📦 Log - shows live events
4. CSV files auto-download
5. Check "Lịch Sử" for results
```

### Stop Anytime

```
Click "⏹ Dừng" button
CSV files still downloaded
Session saved to history
```

## 📊 Sidebar Layout

```
┌─────────────────────────┐
│ Header (fixed)          │  ← Title
├─────────────────────────┤
│                         │
│ Main Content (scrollable)
│ • Keywords input        │
│ • Status & progress     │  ← Scrollable
│ • Settings              │
│ • History               │
│                         │
├─────────────────────────┤
│ Log (fixed)             │  ← Live log
└─────────────────────────┘
```

## 💾 CSV Output

**Downloaded to:** Downloads folder

**Filename format:** `search-volume-{timestamp}.csv`

**Content:**
```
Keyword,Search Volume,CPC,Competition
laptop gaming,12000,2.5,HIGH
keyboard mechanical,8500,1.8,MEDIUM
...
```

**Tip:** Organize CSV files in a folder for easy access

## 📜 History

All sessions saved:
- Timestamp
- Keyword count
- Batch processed
- Status (completed/stopped)

Click entry to view details

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Icon doesn't click** | Reload extension (chrome://extensions/) |
| **Sidebar won't open** | Chrome 114+? Close/open sidebar |
| **Content script error** | Refresh searchvolume.com tab |
| **CSV not downloading** | Check browser download settings |
| **Progress stuck** | Click "Dừng" and retry |

## 📚 Full Documentation

- **README.md** - Project overview
- **INSTALLATION_GUIDE.md** - Detailed setup
- **USAGE_GUIDE.md** - Complete features
- **SIDEBAR_GUIDE.md** - Sidebar specifics
- **TECHNICAL_DOCS.md** - Architecture

## 🚀 Pro Tips

### 1. Batch Processing
```
Process in chunks:
• 100-500 keywords per session (fast)
• 500-1000 keywords split into 2-3 sessions (safe)
• 1000+ keywords split into multiple sessions

Avoids blocking from website
```

### 2. Optimize Delay
```
If getting blocked → increase delay
If too slow → decrease delay

Start at 5-10s, adjust based on results
```

### 3. Organize Results
```
1. Create folder: "/Downloads/Volume Checks"
2. Create subfolder per date/project
3. Move CSV files there
4. Easy to find later

Example:
  /Volume Checks/
    /2024-11-18/
    /2024-11-19/
    /2024-11-20/
```

### 4. Monitor Logs
```
Log shows real-time progress:
✓ Completed actions (green)
✗ Errors (red)
⏳ Delays (orange)
ℹ Info (cyan)

Scroll to see all messages
```

## ❓ FAQ

**Q: Is it safe?**
A: Yes! Uses official Chrome APIs. No data sent anywhere.

**Q: Will I get blocked?**
A: With 5-10s delay, unlikely. Website has rate limits.

**Q: Can I check 10,000 keywords?**
A: Yes, split into multiple sessions. Each session processes 100 keywords at a time.

**Q: Where are CSV files saved?**
A: Browser's Download folder. You can move them after.

**Q: Can I use multiple extensions?**
A: Yes, but use different delays to avoid conflicts.

**Q: What's the difference between popup & sidebar?**
A: Sidebar is better - more space, see website + panel at same time.

## 📞 Need Help?

1. Check INSTALLATION_GUIDE.md for setup
2. Check USAGE_GUIDE.md for features
3. Check SIDEBAR_GUIDE.md for sidebar-specific issues
4. Check TECHNICAL_DOCS.md for technical details

## ✅ Ready to Go!

You're all set! Now:

1. ✅ Extension installed
2. ✅ Sidebar configured
3. ✅ Documentation ready
4. 🚀 Start checking volumes!

---

**Version:** 1.0.0 (Sidebar Edition)
**Updated:** November 2024
**Chrome:** 114+ required
**Time to setup:** ~5 minutes
