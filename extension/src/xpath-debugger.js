// ============================================
// STZ Ex Volume Checker - XPath Debugger
// Paste this in Chrome DevTools console on https://searchvolume.com/
// ============================================

console.log('🔍 STZ Ex Volume Checker - XPath Debugger');
console.log('=' .repeat(50));

// Function to test XPath
function testXPath(xpath, description) {
    try {
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        const element = result.singleNodeValue;

        if (element) {
            console.log(`✅ ${description}`);
            console.log(`   XPath: ${xpath}`);
            console.log(`   Element:`, element);
            console.log(`   Tag: ${element.tagName}`);
            console.log(`   ID: ${element.id}`);
            console.log(`   Class: ${element.className}`);
            console.log(`   Value: ${element.value || element.textContent}`);
            return true;
        } else {
            console.log(`❌ ${description}`);
            console.log(`   XPath NOT FOUND: ${xpath}`);
            return false;
        }
    } catch (error) {
        console.log(`⚠️ Error testing: ${description}`);
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

console.log('\n📝 Testing Keyword Input Field...');
testXPath(
    "//input[@id='tags-input::r7R1::input' and @data-scope='tags-input' and @data-part='input']",
    'Keyword Input (Full XPath)'
);

console.log('\n🔍 Alternative keyword input selectors to try:');

// Alternative XPaths to try
const keywordXPaths = [
    "//input[@data-scope='tags-input']",
    "//input[@id='tags-input::r7R1::input']",
    "//input[contains(@id, 'tags-input')]",
    "//input[contains(@placeholder, 'keyword')]",
    "//input[contains(@placeholder, 'add keyword')]",
    "//input[placeholder*='keyword' or placeholder*='keywords' or placeholder*='enter']"
];

keywordXPaths.forEach((xpath, idx) => {
    const found = testXPath(xpath, `Alternative ${idx + 1}`);
    if (found) console.log('✨ USE THIS XPATH! ✨\n');
});

console.log('\n🌍 Testing Country Input Field...');
testXPath(
    "//input[@id='combobox::r0::input' and @data-scope='combobox' and @data-part='input']",
    'Country Input (Full XPath)'
);

console.log('\n🔍 Alternative country input selectors:');

const countryXPaths = [
    "//input[@data-scope='combobox']",
    "//input[@id='combobox::r0::input']",
    "//input[contains(@id, 'combobox')]",
    "//input[contains(@placeholder, 'country')]",
    "//input[contains(@placeholder, 'select')]"
];

countryXPaths.forEach((xpath, idx) => {
    const found = testXPath(xpath, `Country Alternative ${idx + 1}`);
    if (found) console.log('✨ USE THIS XPATH! ✨\n');
});

console.log('\n🔘 Testing Buttons...');

const buttonXPaths = {
    'Submit Button': "//button[@id='submit']",
    'Download CSV': "//button[@title='Download CSV']",
    'Clear Keywords': "//button[@title='Clear all keywords']"
};

Object.entries(buttonXPaths).forEach(([name, xpath]) => {
    testXPath(xpath, name);
});

console.log('\n' + '='.repeat(50));
console.log('📝 Manual XPath Search Tips:');
console.log('1. Right-click element → Inspect');
console.log('2. Look at the HTML attributes');
console.log('3. Copy full XPath from DevTools');
console.log('4. Test in console: document.evaluate(xpath, ...)');
console.log('5. Report the working XPath');

console.log('\n💡 To find any element manually:');
console.log('// In DevTools console:');
console.log('document.querySelectorAll("input") // Find all inputs');
console.log('document.querySelectorAll("button") // Find all buttons');
console.log('$$("input[type=text]") // Find text inputs');

console.log('\n🎯 Report format (if XPath doesn\'t work):');
console.log('Tag: <specify tag name>');
console.log('ID: <specify id attribute>');
console.log('Class: <specify class attribute>');
console.log('Placeholder: <specify placeholder text>');
console.log('Other attributes: <specify any unique attributes>');
