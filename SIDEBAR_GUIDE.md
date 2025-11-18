# 📱 Hướng Dẫn Sidebar - STZ Ex Volume Checker

## 🎯 Tổng Quan

Extension hiện đã chuyển từ **popup nhỏ** sang **sidebar rộng** chuyên dụng. Đây là cải thiện lớn cho trải nghiệm người dùng.

## 📊 Popup vs Sidebar

| Tính Năng | Popup | Sidebar (Mới) |
|-----------|-------|---------------|
| **Kích thước** | 420x700px (giới hạn) | Variable (rộng hơn) |
| **Vị trí** | Icon corner popup | Right side panel |
| **Tương tác** | Nhỏ gọn | Full screen |
| **Scroll** | Có giới hạn | Smooth scrolling |
| **Resize** | Không có | User can resize |
| **Multi-tasking** | Khó | Dễ (xem website + sidebar) |

## 🚀 Cách Sử Dụng Sidebar

### Bước 1: Cài Đặt Extension

1. Mở `chrome://extensions/`
2. Bật "Developer mode"
3. Nhấp "Load unpacked"
4. Chọn thư mục `extension/`

### Bước 2: Mở Sidebar

**Cách 1: Click Icon Extension**
- Nhấp icon extension ở góc trên phải Chrome
- Sidebar sẽ mở ở bên phải màn hình
- Sidebar sẽ ghi nhớ trạng thái (mở/đóng)

**Cách 2: Keyboard Shortcut (Tùy chọn)**
- Hiện tại: Click icon
- Trong tương lai: Có thể thêm hotkey

### Bước 3: Sử Dụng

Sidebar hoạt động giống popup nhưng với:
- ✅ Không gian rộng hơn
- ✅ Hiển thị tốt hơn trên màn hình lớn
- ✅ Có thể resize chiều rộng
- ✅ Xem website + sidebar cùng lúc

## 🎨 Giao Diện Sidebar

```
┌─────────────────────┐
│  STZ Ex Volume      │ ← Header (fixed)
│  Checker            │
├─────────────────────┤
│                     │
│  📝 Từ Khóa          │
│  ├─ Textarea        │
│  ├─ File Upload     │
│  └─ Buttons         │
│                     │
│  📊 Tiến Trộ        │
│  ├─ Status Info     │
│  ├─ Progress Bar    │
│  └─ Batch Info      │
│                     │
│  ⚙️ Cài Đặt         │
│  ├─ Delay Settings  │
│                     │
│  [▶ Kiểm Tra]       │
│                     │
│  📜 Lịch Sử         │
│  ├─ History Items   │
│                     │
├─────────────────────┤
│  📋 Log (fixed)     │ ← Footer (fixed)
│  └─ Log entries     │
└─────────────────────┘
```

## 💡 Tính Năng Sidebar

### 1. Fixed Header
- Luôn hiển thị tiêu đề
- Dễ nhận biết
- Không cuộn khi scroll

### 2. Scrollable Content
- Nội dung chính có thể scroll
- Tất cả chức năng vẫn có
- Responsive design

### 3. Fixed Footer (Log)
- Log section luôn ở dưới
- Xem log messages in real-time
- Không cần scroll xuống

### 4. Responsive
- Hoạt động trên chiều rộng từ 380px+
- Auto-adjust layout trên màn hình nhỏ
- Touch-friendly trên thiết bị cảm ứng

### 5. Smooth Scrolling
- Scrollbar mảnh gọn (6px)
- Themed colors (cyan primary)
- Smooth behavior

## ⌨️ Keyboard Shortcuts

Hiện tại sidebar không có keyboard shortcut riêng, nhưng sắp tới sẽ có:

```
Ctrl+Shift+V (Proposed) - Toggle sidebar
Ctrl+Shift+Z (Proposed) - Quick check
```

Tạm thời dùng click icon extension.

## 🔧 Cấu Hình Sidebar

Sidebar sử dụng các file:
- `side-panel.html` - Giao diện
- `side-panel.css` - Styling
- `side-panel.js` - Logic

Tất cả tính năng từ popup giữ nguyên.

## 🎯 Lợi Ích

### Cho Người Dùng
- ✅ Giao diện chuyên dụng
- ✅ Không bị che che nội dung web
- ✅ Nhìn website + sidebar cùng lúc
- ✅ Dễ sử dụng trong thời gian dài
- ✅ Better for batch processing

### Cho Developers
- ✅ Chrome Side Panel API (Modern)
- ✅ Cleaner UX pattern
- ✅ Better mobile support
- ✅ Extensible design

## 📱 Mobile / Tablet

Sidebar hoạt động trên:
- **Desktop Chrome** ✅ (Best experience)
- **Tablet Chrome** ✅ (Good)
- **Mobile Chrome** ⚠️ (Limited due to screen size)

Trên mobile, sidebar sẽ chiếm toàn bộ màn hình (vì không gian hẹp).

## 🐛 Troubleshooting

### Sidebar không mở
1. Kiểm tra Chrome version 114+ (Side Panel API requirement)
2. Reload extension tại `chrome://extensions/`
3. Check DevTools console (F12) có error không

### Sidebar quá rộng / hẹp
- Kéo viền sidebar để resize
- Mặc định: ~380px width
- Sidebar sẽ nhớ kích thước

### Sidebar bị mất
- Reload tab
- Click icon extension lại
- Sidebar sẽ mở lại

## 🔄 Migration từ Popup

Nếu bạn đã dùng version popup cũ:

1. **Settings** được lưu tự động - không mất
2. **History** được lưu tự động - vẫn có
3. **Keywords** - Cần nhập lại (mỗi session)

Dữ liệu Chrome Storage được giữ nguyên!

## 📊 Sidebar Layout Details

### Header
```
Height: 50px (fixed)
Background: Cyan gradient
Text: Extension name + subtitle
```

### Content
```
Flex: 1 (fill available space)
Overflow: auto (scrollable)
Padding: 12px
```

### Footer (Log)
```
Height: 200px (fixed)
Background: Dark theme
Scrollable: Yes
```

## 🎨 CSS Variables

Sidebar sử dụng CSS variables giống popup:

```css
--primary-color: #00D4FF (Cyan)
--secondary-color: #FF6B9D (Pink)
--success-color: #00C853 (Green)
--danger-color: #FF5252 (Red)
--warning-color: #FFB300 (Orange)
```

## 🔐 Permissions

Sidebar không yêu cầu thêm quyền:
- Giữ nguyên quyền từ popup
- Thêm `sidePanel` permission cho API

## 📝 Notes

- Sidebar là **primary UI** từ giờ (thay popup)
- popup.html và popup.js vẫn tồn tại (backup)
- Tất cả logic được sao chép sang side-panel.js
- Storage data hoàn toàn tương thích

## 🎁 Tương Lai

Có thể thêm:
- Keyboard shortcuts
- Sidebar resize memory
- Custom width settings
- Dark mode toggle
- Notification support

---

**Version**: 1.0.0 (Sidebar)
**Last Updated**: November 2024
**Chrome Version**: 114+ required
