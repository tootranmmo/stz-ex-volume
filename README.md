# STZ Ex Volume Checker

Extension Chrome tự động kiểm tra search volume từ khóa trên **searchvolume.com**.

## 📋 Tính Năng

### Giao Diện
- ✅ Sidebar responsive, màu sắc tươi sáng
- ✅ Hỗ trợ textarea để nhập danh sách từ khóa
- ✅ Hỗ trợ upload file txt
- ✅ Hiển thị tiến trộ chi tiết
- ✅ Lịch sử kiểm tra

### Tính Năng Chính
- ✅ Tự động mở trang https://searchvolume.com/
- ✅ Nhập từ khóa tự động (100 từ khóa/lần)
- ✅ Chọn quốc gia (Vietnam)
- ✅ Nhấn nút "Get Search Volume"
- ✅ Tải xuống kết quả CSV
- ✅ Xóa từ khóa và lặp lại
- ✅ Delay ngẫu nhiên 5-10 giây
- ✅ Xử lý lỗi toàn diện
- ✅ Nút Stop để dừng bất cứ lúc nào

## 📦 Cấu Trúc Thư Mục

```
extension/
├── manifest.json          # Cấu hình extension
├── src/
│   ├── popup.html        # Giao diện chính
│   ├── popup.css         # Styles
│   ├── popup.js          # Logic popup
│   ├── content-script.js # Tương tác với website
│   ├── background.js     # Service worker
│   └── icons/            # (Tùy chọn) Icon extension
└── README.md             # Tài liệu này
```

## 🚀 Cách Cài Đặt

### Phương Pháp 1: Cài Đặt Thủ Công (Dev Mode)

1. **Mở Chrome Extension Manager:**
   - Nhập `chrome://extensions/` vào thanh địa chỉ
   - Bật "Developer mode" (góc trên phải)

2. **Tải Extension:**
   - Nhấp "Load unpacked"
   - Chọn thư mục `extension/`
   - Extension sẽ xuất hiện trong danh sách

3. **Sử Dụng:**
   - Nhấp icon extension ở góc trên phải
   - Popup sẽ hiển thị

## 💻 Cách Sử Dụng

### Bước 1: Nhập Từ Khóa
- **Cách 1:** Nhập trực tiếp vào textarea (mỗi từ khóa một dòng)
- **Cách 2:** Upload file txt có sẵn

### Bước 2: Cải Đặt (Tùy Chọn)
- Điều chỉnh độ trễ ngẫu nhiên (mặc định: 5-10 giây)
- Chọn thư mục lưu CSV (nếu cần)

### Bước 3: Kiểm Tra Volume
1. Mở https://searchvolume.com/ trong tab mới
2. Nhấp nút **"Kiểm Tra Search Volume"**
3. Extension sẽ tự động:
   - Nhập từ khóa (100/lần)
   - Chọn Vietnam
   - Nhấn Get Search Volume
   - Tải CSV
   - Xóa từ khóa
   - Lặp lại cho batch tiếp theo

### Bước 4: Dừng (Nếu Cần)
- Nhấp nút **"Dừng Kiểm Tra"** để dừng quá trình

## 📊 Tiến Trình & Lịch Sử

- **Tiến Trộ:** Hiển thị % đã hoàn thành
- **Lịch Sử:** Lưu tất cả session kiểm tra
- **Log:** Xem chi tiết mỗi bước thực hiện

## ⚙️ Cấu Hình

```javascript
// Mặc định
delayMin: 5 giây
delayMax: 10 giây
keywordsPerBatch: 100 từ khóa
```

Có thể điều chỉnh trong popup.

## 🔐 Quyền Hạn

Extension yêu cầu:
- `storage` - Lưu cài đặt & lịch sử
- `activeTab` - Tương tác tab hiện tại
- `scripting` - Chạy script trên website
- `tabs` - Quản lý tabs
- `downloads` - Tải file CSV

## 🐛 Troubleshooting

### Lỗi: "Keyword input field not found"
- **Nguyên nhân:** Bạn chưa mở https://searchvolume.com/
- **Giải pháp:** Mở trang này rồi retry

### Lỗi: "Timeout waiting for results"
- **Nguyên nhân:** Website đang tải chậm
- **Giải pháp:** Tăng timeout hoặc retry batch

### CSV không tải được
- **Nguyên nhân:** Trình duyệt chặn tải file
- **Giải pháp:** Kiểm tra cài đặt downloads trong Chrome

### Extension không chạy script
- **Nguyên nhân:** Content script chưa load
- **Giải pháp:** Tải lại extension hoặc F5 trang

## 📝 Tính Năng Sắp Tới

- [ ] Chọn thư mục lưu file custom
- [ ] Export lịch sử dưới dạng JSON
- [ ] Proxy rotation support
- [ ] Captcha detection
- [ ] Multi-language support

## 🤝 Đóng Góp

Mọi feedback và đóng góp đều được hoan nghênh!

## 📄 License

MIT License - Tự do sử dụng & phát triển

---

**Version:** 1.0.0
**Last Updated:** November 2024
