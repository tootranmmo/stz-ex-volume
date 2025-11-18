// ============================================
// STZ Ex Volume Checker - Content Script
// ============================================

class WebsiteAutomation {
    constructor() {
        this.isProcessing = false;
    }

    // ===== Xpath Utilities =====
    getElementByXpath(xpath) {
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        return result.singleNodeValue;
    }

    getAllElementsByXpath(xpath) {
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        const elements = [];
        for (let i = 0; i < result.snapshotLength; i++) {
            elements.push(result.snapshotItem(i));
        }
        return elements;
    }

    // ===== DOM Interactions =====
    async setInputValue(xpath, value) {
        const element = this.getElementByXpath(xpath);
        if (!element) {
            throw new Error(`Input element not found: ${xpath}`);
        }

        element.focus();
        element.value = '';
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));

        // Type characters to trigger autocomplete
        for (let char of value) {
            element.value += char;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            await this.sleep(20);
        }

        element.dispatchEvent(new Event('change', { bubbles: true }));
        await this.sleep(100);
    }

    async clickButton(xpath) {
        const button = this.getElementByXpath(xpath);
        if (!button) {
            throw new Error(`Button not found: ${xpath}`);
        }

        button.click();
        await this.sleep(100);
    }

    // ===== Keywords Input =====
    async addKeywords(keywords) {
        const keywordInput = this.getElementByXpath(
            "//input[@id='tags-input::r7R1::input' and @data-scope='tags-input' and @data-part='input']"
        );

        if (!keywordInput) {
            throw new Error('Keyword input field not found. Make sure you\'re on https://searchvolume.com/');
        }

        for (let keyword of keywords) {
            keywordInput.focus();
            keywordInput.value = keyword;
            keywordInput.dispatchEvent(new Event('input', { bubbles: true }));

            // Press Enter to add keyword
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            keywordInput.dispatchEvent(enterEvent);

            await this.sleep(200);

            // Clear input for next keyword
            keywordInput.value = '';
            keywordInput.dispatchEvent(new Event('input', { bubbles: true }));
            await this.sleep(100);
        }

        console.log(`✓ Added ${keywords.length} keywords`);
    }

    // ===== Country Selection =====
    async selectCountry(country = 'Vietnam') {
        const countryInput = this.getElementByXpath(
            "//input[@id='combobox::r0::input' and @data-scope='combobox' and @data-part='input']"
        );

        if (!countryInput) {
            throw new Error('Country input field not found');
        }

        await this.setInputValue(
            "//input[@id='combobox::r0::input' and @data-scope='combobox' and @data-part='input']",
            country
        );

        // Wait for dropdown and select option
        await this.sleep(500);

        const options = this.getAllElementsByXpath(
            "//div[@role='option' and contains(text(), 'Vietnam')]"
        );

        if (options.length > 0) {
            options[0].click();
        }

        await this.sleep(300);
        console.log(`✓ Selected country: ${country}`);
    }

    // ===== Get Search Volume =====
    async getSearchVolume() {
        const submitButton = this.getElementByXpath("//button[@id='submit']");

        if (!submitButton) {
            throw new Error('Submit button not found');
        }

        submitButton.click();
        console.log('✓ Clicked Get Search Volume button');

        // Wait for results to load
        await this.sleep(2000);
        await this.waitForResultsToLoad();
    }

    async waitForResultsToLoad(timeout = 15000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            // Check if CSV download button is available
            const csvButton = this.getElementByXpath("//button[@title='Download CSV']");
            if (csvButton) {
                return true;
            }

            await this.sleep(500);
        }

        throw new Error('Timeout waiting for results to load');
    }

    // ===== Download CSV =====
    async downloadCSV() {
        const csvButton = this.getElementByXpath("//button[@title='Download CSV']");

        if (!csvButton) {
            throw new Error('Download CSV button not found');
        }

        csvButton.click();
        console.log('✓ Clicked Download CSV button');

        // Wait for download to start
        await this.sleep(1000);
    }

    // ===== Clear Keywords =====
    async clearAllKeywords() {
        const clearButton = this.getElementByXpath("//button[@title='Clear all keywords']");

        if (!clearButton) {
            throw new Error('Clear keywords button not found');
        }

        clearButton.click();
        console.log('✓ Cleared all keywords');

        await this.sleep(500);
    }

    // ===== Main Automation Flow =====
    async processKeywordBatch(keywords, delayMin = 5, delayMax = 10) {
        try {
            console.log(`Processing batch of ${keywords.length} keywords`);

            // Step 1: Add keywords
            console.log('Step 1: Adding keywords...');
            await this.addKeywords(keywords);

            // Random delay
            const delay = Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
            await this.sleep(delay * 1000);

            // Step 2: Select country
            console.log('Step 2: Selecting country...');
            await this.selectCountry('Vietnam');

            // Random delay
            const delay2 = Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
            await this.sleep(delay2 * 1000);

            // Step 3: Get search volume
            console.log('Step 3: Getting search volume...');
            await this.getSearchVolume();

            // Random delay
            const delay3 = Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
            await this.sleep(delay3 * 1000);

            // Step 4: Download CSV
            console.log('Step 4: Downloading CSV...');
            await this.downloadCSV();

            // Step 5: Clear keywords
            console.log('Step 5: Clearing keywords...');
            await this.clearAllKeywords();

            return {
                success: true,
                message: `Successfully processed ${keywords.length} keywords`,
                keywordsProcessed: keywords.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                keywordsProcessed: 0
            };
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== Message Handler =====
const automation = new WebsiteAutomation();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'automateVolumeCheck') {
        console.log('Received request to automate volume check');
        console.log('Keywords:', request.keywords);

        automation.processKeywordBatch(
            request.keywords,
            request.delayMin,
            request.delayMax
        ).then(result => {
            sendResponse(result);
        }).catch(error => {
            sendResponse({
                success: false,
                error: error.message
            });
        });

        // Return true to indicate we'll send response asynchronously
        return true;
    }
});

console.log('Content script loaded for searchvolume.com');
