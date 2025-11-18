# 📖 Hướng Dẫn Cài Đặt Chi Tiết

## Prerequisites
- Google Chrome (Chromium-based)
- Kết nối internet

## Bước 1: Tải Extension

Extension nằm trong thư mục `extension/` tại root của repository.

Cấu trúc:
```
stz-ex-volume/
├── extension/
│   ├── manifest.json
│   ├── src/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   ├── popup.js
│   │   ├── content-script.js
│   │   └── background.js
│   └── ...
├── README.md
└── ...
```

## Bước 2: Mở Chrome Extension Manager

### Cách 1: Sử Dụng URL
1. Mở Chrome
2. Nhập vào thanh địa chỉ: `chrome://extensions/`
3. Nhấn Enter

### Cách 2: Sử Dụng Menu
1. Nhấp menu ≡ (3 dòng) góc trên phải Chrome
2. Chọn "Settings" → "Extensions" → "Manage extensions"

## Bước 3: Bật Developer Mode

Tại trang Extensions Manager:
1. Tìm "Developer mode" ở góc trên phải
2. **Bật** nó (toggle sẽ chuyển sang xanh)

## Bước 4: Load Extension

1. Nhấp nút **"Load unpacked"** (sẽ xuất hiện sau khi bật Developer mode)
2. Một cửa sổ "Choose Folder" sẽ mở
3. **Điều hướng đến thư mục `extension/`**
   - Tìm file `manifest.json` trong thư mục này
   - Chọn thư mục `extension/` (không phải thư mục con)
4. Nhấp **"Select Folder"** hoặc **"Open"**

✅ Extension sẽ được load thành công!

## Bước 5: Kiểm Tra Cài Đặt

Sau khi load:
- Extension sẽ xuất hiện trong danh sách tại `chrome://extensions/`
- Tên: **"STZ Ex Volume Checker"**
- Icon sẽ hiển thị ở góc trên phải thanh công cụ Chrome
- Bên cạnh icon, bạn sẽ thấy nó được tích ✅

## Bước 6: Sử Dụng Extension

### Mở Extension
- Nhấp icon extension ở góc trên phải Chrome
- Popup sẽ mở ra

### Sử Dụng
1. **Nhập từ khóa:**
   - Nhập trực tiếp vào textarea
   - Hoặc upload file txt

2. **Cài đặt (tùy chọn):**
   - Điều chỉnh delay (5-10s mặc định)

3. **Kiểm tra:**
   - Mở https://searchvolume.com/
   - Nhấp "Kiểm Tra Search Volume"
   - Extension sẽ tự động chạy

## 🆘 Xử Sự Cố

### Extension không hiện icon
**Vấn đề:** Icon extension không thấy ở góc trên phải

**Giải pháp:**
1. Mở `chrome://extensions/`
2. Tìm "STZ Ex Volume Checker"
3. Đảm bảo nó được **bật** (toggle xanh)
4. Nếu cần, ghim icon:
   - Nhấp "Pin" icon bên cạnh tên extension

### Lỗi "Manifest parsing error"
**Vấn đề:** Extension không load, có lỗi manifest

**Giải pháp:**
1. Xóa extension
2. Kiểm tra file `manifest.json` không có lỗi syntax
3. Load lại extension

### Extension load nhưng không chạy
**Vấn đề:** Extension load nhưng không làm gì khi nhấp

**Giải pháp:**
1. Mở Chrome DevTools (F12)
2. Vào tab "Console"
3. Kiểm tra lỗi
4. Reload extension (F5 hoặc re-load)

### Content script không chạy trên website
**Vấn đề:** Popup đó nhưng script không tương tác website

**Giải pháp:**
1. Reload trang searchvolume.com (F5)
2. Đảm bảo URL là https://searchvolume.com/
3. Reload extension trong `chrome://extensions/`

## 📋 Yêu Cầu Hệ Thống

- **OS:** Windows, macOS, Linux
- **Browser:** Google Chrome 88+
- **RAM:** 100MB+
- **Disk:** 5MB+ free space
- **Internet:** Required

## 🔐 Quyền Hạn Được Yêu Cầu

Khi cài đặt, Chrome sẽ hỏi quyền:
- ✅ **Storage:** Lưu cài đặt & lịch sử
- ✅ **Active Tab:** Tương tác tab hiện tại
- ✅ **Scripting:** Chạy script trên website
- ✅ **Downloads:** Tải file CSV

Tất cả quyền này cần thiết cho extension hoạt động.

## 🔄 Cập Nhật Extension

Để cập nhật extension:

1. Mở `chrome://extensions/`
2. Xóa phiên bản cũ nếu muốn (tùy chọn)
3. Repeat Bước 4 ở trên với phiên bản mới
4. Browser sẽ tự động thay thế extension cũ

## ❌ Gỡ Cài Đặt

Để xóa extension:

1. Mở `chrome://extensions/`
2. Tìm "STZ Ex Volume Checker"
3. Nhấp nút "Remove" / "Trash" icon
4. Xác nhận xóa

Extension sẽ bị gỡ và icon sẽ biến mất.

## 💡 Tips

- **Ghim extension:** Nhấp "Pin" icon để dễ dàng truy cập
- **Check log:** Mở popup và scroll xuống để xem log chi tiết
- **Save settings:** Cài đặt được lưu tự động
- **History:** Lịch sử được giữ trong browser storage

## ✨ Hoàn Tất!

Bạn đã sẵn sàng sử dụng STZ Ex Volume Checker 🎉

Nếu có vấn đề, kiểm tra:
1. URL extension là `chrome://extensions/`
2. Developer mode đã bật
3. Folder chọn đúng là `extension/` (có `manifest.json`)

---

**Phiên bản:** 1.0.0
**Cập nhật cuối:** November 2024
