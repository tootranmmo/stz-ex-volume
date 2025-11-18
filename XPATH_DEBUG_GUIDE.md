# 🔍 XPath Debug Guide - Không Thêm Được Từ Khóa

## 🎯 Vấn Đề

Extension không thể thêm từ khóa vào trang searchvolume.com. Nguyên nhân có thể là:
- XPath selectors đã thay đổi (website cập nhật)
- DOM structure khác
- Element IDs/attributes thay đổi

## ✅ Cách Khắc Phục

### Bước 1: Mở Trang Debug

1. Mở https://searchvolume.com/ trên Chrome
2. Nhấn F12 (hoặc Ctrl+Shift+I)
3. Chuyển sang tab "Console"

### Bước 2: Chạy Debugger Script

Copy toàn bộ code dưới đây vào Console:

```javascript
// ============================================
// STZ Ex Volume Checker - XPath Debugger
// ============================================

console.log('🔍 Testing XPath Selectors...\n');

function testXPath(xpath, description) {
    try {
        const result = document.evaluate(
            xpath, document, null,
            XPathResult.FIRST_ORDERED_NODE_TYPE, null
        );
        const element = result.singleNodeValue;

        if (element) {
            console.log(`✅ ${description}`);
            console.log(`   Element:`, element);
            return true;
        } else {
            console.log(`❌ ${description} - NOT FOUND`);
            return false;
        }
    } catch (error) {
        console.log(`⚠️ ${description} - ERROR: ${error.message}`);
        return false;
    }
}

// Test keyword input
console.log('📝 KEYWORD INPUT:\n');
testXPath("//input[@id='tags-input::r7R1::input']", 'Full XPath');
testXPath("//input[@data-scope='tags-input']", 'By data-scope');
testXPath("//input[contains(@id, 'tags-input')]", 'Contains tags-input');

// Test country input
console.log('\n🌍 COUNTRY INPUT:\n');
testXPath("//input[@id='combobox::r0::input']", 'Full XPath');
testXPath("//input[@data-scope='combobox']", 'By data-scope');
testXPath("//input[contains(@id, 'combobox')]", 'Contains combobox');

// Test buttons
console.log('\n🔘 BUTTONS:\n');
testXPath("//button[@id='submit']", 'Submit Button');
testXPath("//button[@title='Download CSV']", 'Download CSV');
testXPath("//button[@title='Clear all keywords']", 'Clear Keywords');

// Manual inspection
console.log('\n🔎 MANUAL INSPECTION:\n');
console.log('All inputs on page:', document.querySelectorAll('input').length);
console.log('All buttons on page:', document.querySelectorAll('button').length);
console.log('\nInputs:', Array.from(document.querySelectorAll('input')).map((el, i) =>
    `${i}: id="${el.id}" placeholder="${el.placeholder}" class="${el.className}"`
));
```

### Bước 3: Xem Kết Quả

Console sẽ hiển thị:
- ✅ Nếu XPath tìm thấy element
- ❌ Nếu XPath không tìm thấy

**Chú ý các XPath có ✅ - đó là cái bạn cần!**

### Bước 4: Nếu Tất Cả Đều ❌

1. Right-click vào input field (nơi nhập từ khóa)
2. Chọn "Inspect" hoặc "Inspect Element"
3. Xem HTML trong DevTools:

```html
<!-- Ví dụ: nó có thể trông như thế -->
<input
  id="search-keywords"
  type="text"
  placeholder="Enter keywords"
  class="input-field"
/>
```

4. Ghi chú:
   - `id=` gì?
   - `class=` gì?
   - `placeholder=` gì?
   - Attributes khác?

### Bước 5: Báo Cáo Findings

Nếu XPath không hoạt động, báo cáo:

```
Keyword Input Field:
├─ ID: ____________________
├─ Class: ____________________
├─ Placeholder: ____________________
├─ Data attributes: ____________________
└─ Other: ____________________

Country Input Field:
├─ ID: ____________________
├─ Class: ____________________
├─ Placeholder: ____________________
└─ Other: ____________________

Buttons:
├─ Submit button - ID/Class: ____________________
├─ Download CSV button - Title/Text: ____________________
└─ Clear keywords button - Title/Text: ____________________
```

## 🛠️ Cách Fix (Nếu XPath Thay Đổi)

Sau khi tìm được working XPath:

### Option 1: Update Code (Nhanh)

1. Mở `content-script.js`
2. Tìm dòng ~73 (keyword input):
   ```javascript
   const keywordInput = this.getElementByXpath(
       "//input[@id='tags-input::r7R1::input'...]"
   );
   ```
3. Thay bằng working XPath của bạn
4. Tương tự cho country input và buttons
5. Reload extension

### Option 2: Multiple XPath Fallback (Robust)

Cập nhật để thử nhiều XPath:

```javascript
async addKeywords(keywords) {
    const xpaths = [
        "//input[@id='tags-input::r7R1::input' and @data-scope='tags-input']",
        "//input[@data-scope='tags-input']",
        "//input[contains(@id, 'tags-input')]",
        "//input[placeholder*='keyword']"
    ];

    let keywordInput = null;
    for (let xpath of xpaths) {
        keywordInput = this.getElementByXpath(xpath);
        if (keywordInput) {
            console.log('✅ Found with:', xpath);
            break;
        }
    }

    if (!keywordInput) {
        throw new Error('Keyword input field not found');
    }

    // ... rest of code
}
```

## 📊 Troubleshooting

### Nếu Console Báo "Not Found"

**Khả năng 1:** Website chưa load xong
```
-> Chờ 3-5 giây, chạy lại code
```

**Khả năng 2:** XPath sai
```
-> Dùng bước 4 để kiểm tra HTML
-> Copy XPath từ DevTools (right-click > Copy XPath)
```

**Khả năng 3:** Website cấu trúc khác
```
-> Thử các XPath alternatives
-> Dùng CSS selector thay vì XPath
```

### CSS Selector Alternative

Nếu XPath không hoạt động, thử CSS selector:

```javascript
// Trong DevTools:
document.querySelector('input[placeholder*="keyword"]')
document.querySelector('input[data-scope="tags-input"]')
document.querySelector('button#submit')
```

## 🔧 Cập Nhật Content Script

Nếu tìm được XPath mới, cập nhật file:
`extension/src/content-script.js`

**Dòng 73:** Keyword input
**Dòng 109:** Country input
**Dòng 116:** Submit button
**Dòng 139:** Download CSV button
**Dòng 153:** Clear keywords button

## 📞 Need More Help?

1. Chạy xpath-debugger.js script (ở extension/src/)
2. Ghi chép output từ Console
3. Compare với expected selectors
4. Update content-script.js nếu cần

## 💡 Pro Tips

**Tip 1: DevTools Console - Find Element**
```javascript
// Find by placeholder
$('[placeholder*="keyword"]')

// Find by ID
$('#tags-input')

// Find by class
$('.keyword-input')
```

**Tip 2: Get XPath từ DevTools**
1. Inspect element
2. Right-click trên HTML
3. "Copy" → "Copy Full XPath"
4. Paste vào script

**Tip 3: Test Element Value**
```javascript
// After finding element:
el.value = 'test keyword'
el.dispatchEvent(new Event('input', {bubbles: true}))
// Should show in input
```

## 🎯 Expected XPaths (Current)

```
Keyword Input:
  //input[@id='tags-input::r7R1::input' and @data-scope='tags-input']

Country Input:
  //input[@id='combobox::r0::input' and @data-scope='combobox']

Submit Button:
  //button[@id='submit']

Download CSV:
  //button[@title='Download CSV']

Clear Keywords:
  //button[@title='Clear all keywords']
```

Nếu đó không hoạt động, hãy follow guide ở trên để tìm cái mới! 🔍

---

**Last Updated:** November 2024
**Version:** 1.0.0
