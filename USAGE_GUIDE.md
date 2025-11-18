# 🎯 Hướng Dẫn Chi Tiết Sử Dụng STZ Ex Volume Checker

## 📌 Giao Diện Chính

```
┌─────────────────────────────────────────┐
│    STZ Ex Volume Checker                │
│    Kiểm tra Search Volume Tự Động        │
├─────────────────────────────────────────┤
│                                         │
│  📝 NHẬP TỪ KHÓA                        │
│  ├─ Textarea: Nhập từ khóa (1 dòng/từ) │
│  ├─ Upload: Tải file txt                │
│  └─ [Xóa Nội Dung]                      │
│                                         │
│  📊 TIẾN TRÌNH                         │
│  ├─ Tổng từ khóa: 500                  │
│  ├─ Đã kiểm tra: 250                   │
│  ├─ Trạng thái: Đang chạy...            │
│  ├─ [████████░░░░░░░░░░] 50%            │
│  └─ Batch 3/5: 100 từ khóa              │
│                                         │
│  ⚙️ CÀI ĐẶT                            │
│  ├─ Thư mục lưu CSV                     │
│  └─ Delay: Min 5s - Max 10s             │
│                                         │
│  [▶ Kiểm Tra Search Volume]             │
│                                         │
│  📜 LỊCH SỬ KIỂM TRA                    │
│  └─ [Lịch sử các session trước]         │
│                                         │
│  🖨️ LOG                                 │
│  └─ Chi tiết từng bước thực hiện        │
└─────────────────────────────────────────┘
```

## 🚀 Quy Trình Từng Bước

### Bước 1: Chuẩn Bị Từ Khóa

**Cách 1: Nhập Trực Tiếp**
```
1. Mở STZ Ex Volume Checker popup
2. Tìm ô "Danh sách từ khóa"
3. Nhập từ khóa (mỗi từ một dòng):

   laptop gaming
   keyboard mechanical
   mouse wireless
   monitor 4k
   ...
```

**Cách 2: Upload File TXT**
```
1. Tạo file txt với danh sách từ khóa
   (Lưu ý: mỗi từ khóa trên một dòng)

2. Trong popup, click "Upload file TXT"
3. Chọn file từ máy của bạn
4. File sẽ được tải vào textarea tự động
```

### Bước 2: Cài Đặt Độ Trễ (Tùy Chọn)

```
1. Mở phần "Cài Đặt"
2. Điều chỉnh Delay:
   - Min: 5 giây (mặc định)
   - Max: 10 giây (mặc định)

3. Ví dụ cài đặt khác:
   - Chậm: Min 10s, Max 20s
   - Nhanh: Min 2s, Max 5s

⚠️ Lưu ý: Delay quá ngắn có thể bị website chặn!
```

### Bước 3: Mở Website Target

```
1. Mở tab mới: Ctrl+T (hoặc Cmd+T)
2. Nhập: https://searchvolume.com/
3. Nhấn Enter
4. Đợi trang load hoàn toàn (1-2 giây)
```

### Bước 4: Bắt Đầu Kiểm Tra

```
1. Quay lại popup STZ Ex Volume Checker
2. Nhấp nút "▶ Kiểm Tra Search Volume"
3. Popup sẽ yêu cầu xác nhận (nếu chưa mở website)
4. Kiểm tra sẽ bắt đầu tự động
```

### Bước 5: Theo Dõi Tiến Trình

```
Trong quá trình kiểm tra, bạn sẽ thấy:

📊 TIẾN TRỘ:
┌──────────────────────────────────┐
│ Tổng từ khóa:    500             │
│ Đã kiểm tra:     250             │
│ Trạng thái:      Đang chạy...     │
│ [████████░░░░░░░░░░] 50%         │
│ Batch 3/5 - 100 từ khóa           │
└──────────────────────────────────┘

LOG:
[10:30:45] 📦 Batch 1/5: Xử lý 100 từ khóa
[10:31:00] ✓ Added 100 keywords
[10:31:05] ✓ Selected country: Vietnam
[10:31:10] ✓ Clicked Get Search Volume button
[10:31:15] ✓ Download CSV button found
[10:31:20] ✓ Clicked Download CSV button
[10:31:25] ✓ Cleared all keywords
[10:31:30] ⏳ Chờ 7s trước batch tiếp theo...
```

### Bước 6: Kết Thúc

Extension sẽ tự động:
- ✅ Xử lý tất cả batches
- ✅ Tải xuống tất cả CSV
- ✅ Cập nhật lịch sử
- ✅ Hiển thị thông báo hoàn thành

```
[11:15:45] ✅ Kiểm tra hoàn thành!
           Đã xử lý 500 từ khóa trong 45m
```

## 🎮 Chi Tiết Các Tính Năng

### 📝 Nhập Từ Khóa

| Tính Năng | Mô Tả |
|-----------|-------|
| **Textarea** | Nhập trực tiếp từ khóa, mỗi từ một dòng |
| **Upload TXT** | Chọn file .txt từ máy tính |
| **Xóa Nội Dung** | Xóa tất cả text trong textarea |

**Ví dụ:**
```
laptop gaming 15 inch
keyboard mechanical cherry
mouse wireless logitech
monitor curved 144hz
headphone bluetooth noise cancelling
```

### 📊 Tiến Trộ & Thống Kê

**Hiển thị thông tin:**
- `Tổng từ khóa` - Số lượng từ khóa sẽ kiểm tra
- `Đã kiểm tra` - Số từ khóa đã xử lý
- `Trạng thái` - Sẵn sàng / Đang chạy / Hoàn thành
- `Progress Bar` - Thanh tiến độ trực quan
- `Batch Info` - Batch hiện tại và tổng batch

**Công thức tính batch:**
```
Tổng batch = Ceil(Tổng từ khóa / 100)
Batch 1: từ khóa 1-100
Batch 2: từ khóa 101-200
Batch 3: từ khóa 201-300
...
```

### ⚙️ Cài Đặt

**Delay Ngẫu nhiên:**
- Mục đích: Tránh bị website phát hiện & chặn
- Được áp dụng giữa các tác vụ
- Mặc định: 5-10 giây

**Thư Mục Lưu CSV:**
- Hiện tại: Downloads mặc định
- Trong tương lai: Custom folder selection

### 🎯 Nút Điều Khiển

| Nút | Chức Năng |
|-----|-----------|
| **Kiểm Tra** | Bắt đầu quá trình kiểm tra |
| **Dừng** | Dừng quá trình (hiện lên khi chạy) |
| **Xóa Nội Dung** | Xóa text từ khóa |
| **Chọn Thư Mục** | Chọn nơi lưu CSV (phát triển) |
| **Xóa Lịch Sử** | Xóa lịch sử kiểm tra |
| **Xóa Lịch Sử** | Xóa tất cả lịch sử |

### 📜 Lịch Sử Kiểm Tra

**Mỗi mục lịch sử chứa:**
```
┌─────────────────────────────────┐
│ Batch #1234567890               │
│ 2024-11-18 10:30:45             │
├─────────────────────────────────┤
│ 📊 250/500 từ khóa              │
│ 📦 3 batch | ⚠ Dừng             │
└─────────────────────────────────┘
```

**Thông tin:**
- ID & Timestamp
- Từ khóa đã xử lý / Tổng số
- Batch hoàn thành
- Trạng thái (Hoàn thành / Dừng)

### 🖨️ Log Console

Extension ghi lại tất cả hoạt động:

```
[10:30:45] Extension đã sẵn sàng
[10:31:00] 📦 Batch 1/5: Xử lý 100 từ khóa
[10:31:05] ✓ Added 100 keywords
[10:31:05] ✓ Selected country: Vietnam
[10:31:10] ✓ Clicked Get Search Volume button
[10:31:15] Timeout waiting for results to load
[10:31:20] ❌ Lỗi ở batch 1: Timeout waiting...
[10:31:25] ⏳ Chờ 5s trước retry...
[10:31:30] ✓ Cleared all keywords
[10:32:00] ⏳ Chờ 8s trước batch tiếp theo...
[10:32:08] 📦 Batch 2/5: Xử lý 100 từ khóa
[10:32:13] ✓ Added 100 keywords
[10:32:18] ✓ Selected country: Vietnam
[10:32:23] ✓ Clicked Get Search Volume button
[10:32:28] ✓ Download CSV button found
[10:32:33] ✓ Clicked Download CSV button
[10:32:38] ✓ Cleared all keywords
...
[11:15:45] ✅ Kiểm tra hoàn thành! Đã xử lý 500 từ khóa trong 45m
```

## 🎬 Quy Trình Tự Động Chi Tiết

Khi nhấp "Kiểm Tra", extension sẽ:

```
┌─────────────────────────────────────────┐
│          AUTOMATION WORKFLOW             │
├─────────────────────────────────────────┤
│                                         │
│ 1️⃣  Chia từ khóa thành batch (100/batch)
│                                         │
│ 2️⃣  For mỗi batch:                     │
│     ├─ Nhập 100 từ khóa                │
│     ├─ Random delay (5-10s)            │
│     ├─ Chọn Vietnam                     │
│     ├─ Random delay (5-10s)            │
│     ├─ Nhấn "Get Search Volume"        │
│     ├─ Đợi 2-15s để kết quả load       │
│     ├─ Nhấn "Download CSV"             │
│     ├─ Xóa tất cả từ khóa              │
│     └─ Random delay (5-10s)            │
│                                         │
│ 3️⃣  Lặp lại cho batch tiếp theo       │
│                                         │
│ 4️⃣  Cập nhật lịch sử & hoàn thành      │
│                                         │
└─────────────────────────────────────────┘
```

## 🛑 Dừng Kiểm Tra

**Cách dừng:**
1. Nhấp nút "⏹ Dừng Kiểm Tra"
2. Xác nhận trong hộp thoại
3. Extension sẽ dừng ngay lập tức

**Kết quả:**
- Batch hiện tại sẽ bị hủy
- Lịch sử sẽ lưu trạng thái "Dừng"
- Có thể tiếp tục sau bằng cách bắt đầu lại

## 📥 CSV Files

**Vị trí lưu:**
- Mặc định: Thư mục Downloads
- Tên file: `search-volume-{timestamp}.csv`

**Nội dung CSV:**
```
Keyword,Search Volume,CPC,Competition
laptop gaming,12000,2.5,HIGH
keyboard mechanical,8500,1.8,MEDIUM
mouse wireless,5200,1.2,LOW
...
```

**Số lượng file:**
- 1 file CSV per batch
- Ví dụ: 500 từ khóa = 5 files CSV

## 🚨 Xử Lý Lỗi

**Các lỗi có thể gặp:**

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|-----------|----------|
| Website không phản hồi | Website chậm/down | Retry hoặc kiểm tra kết nối |
| Keyword input không tìm thấy | Chưa mở website | Mở https://searchvolume.com/ |
| Timeout waiting for results | Website chậm load | Tăng delay hoặc retry |
| Download CSV failed | Trình duyệt chặn | Cho phép downloads |
| Clear button not found | DOM thay đổi | Reload website |

## 💡 Tips & Tricks

### 1️⃣ Tối ưu tốc độ
```
- Giảm delay nếu website nhanh
- Kiểm tra kết nối internet
- Đóng các tab không cần thiết
```

### 2️⃣ Tránh bị chặn
```
- Tăng delay (10-15s)
- Kiểm tra IP không bị ban
- Không chạy quá nhiều extension cùng lúc
```

### 3️⃣ Quản lý file CSV
```
- Tạo thư mục riêng cho kết quả
- Đặt tên file có ý nghĩa
- Backup định kỳ
```

### 4️⃣ Giám sát tiến độ
```
- Kiểm tra log thường xuyên
- Xem lịch sử sau mỗi session
- Ghi chú các batch có lỗi
```

## ❌ Từ Khóa Không Hợp Lệ

**Những từ khóa sẽ bị bỏ qua:**
```
- Trống (empty)
- Chỉ dấu cách (spaces only)
- Ký tự đặc biệt quá nhiều
```

**Format đúng:**
```
✅ laptop gaming
✅ keyword with spaces
✅ special-chars-ok
❌
❌    (chỉ dấu cách)
```

## 🔄 Lặp Lại Quá Trình

**Để kiểm tra lại:**
```
1. Nhấp "Xóa Nội Dung" (tùy chọn)
2. Nhập từ khóa mới
3. Nhấp "Kiểm Tra Search Volume"
4. Quá trình mới sẽ bắt đầu
```

## 📞 Hỗ Trợ & Feedback

Nếu gặp sự cố:
1. Kiểm tra log (cuối popup)
2. Xem INSTALLATION_GUIDE.md
3. Reload extension: `chrome://extensions/`
4. Thử lại

---

**Phiên bản:** 1.0.0
**Cập nhật cuối:** November 2024
