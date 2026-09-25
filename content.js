console.log("GFG to GitHub Sync: Content script loaded and watching.");

// 1. Securely Inject the Main World script (Bypasses CSP)
const injectScript = document.createElement('script');
injectScript.src = chrome.runtime.getURL('inject.js');
injectScript.onload = function () { this.remove(); };
(document.head || document.documentElement).appendChild(injectScript);

// 2. The Polling Strategy (Now injects a button instead of auto-pushing)
setInterval(() => {
    const titleEl = document.querySelector('.problem-title, div[class^="problems_header_content"] h3, h3');
    if (!titleEl) return;

    let isSuccess = false;
    const pageText = document.body.innerText.toLowerCase();

    if (pageText.includes('problem solved successfully')) {
        isSuccess = true;
    } else if (titleEl.parentElement && titleEl.parentElement.innerText.toLowerCase().includes('solved')) {
        isSuccess = true;
    }

    // If solved and the button isn't already there, inject it
    if (isSuccess && !document.getElementById('gfg-github-push-btn')) {
        injectPushButton(titleEl);
    }
}, 2000);

// 3. Inject the LeetPush-style Button
function injectPushButton(anchorElement) {
    const btn = document.createElement('button');
    btn.id = "gfg-github-push-btn";
    btn.innerText = "Push to GitHub";
    btn.style.cssText = `
        margin-left: 15px;
        background-color: #2ea44f;
        color: white;
        border: 1px solid rgba(27, 31, 35, 0.15);
        border-radius: 6px;
        padding: 5px 12px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
        box-shadow: 0 1px 0 rgba(27, 31, 35, 0.1);
    `;

    btn.onmouseover = () => btn.style.backgroundColor = '#2c974b';
    btn.onmouseout = () => btn.style.backgroundColor = '#2ea44f';

    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        btn.innerText = "Pushing...";
        btn.style.backgroundColor = "#dbab09"; // Yellow for loading
        await extractAndPushData(btn);
    });

    anchorElement.appendChild(btn);
}

// 4. Extract and Format Data
async function extractAndPushData(btn) {
    try {
        const titleEl = document.querySelector('.problem-title, div[class^="problems_header_content"] h3, h3');
        const title = titleEl ? titleEl.innerText.replace(/Solved/gi, '').trim() : 'Unknown_Problem';

        let difficulty = 'Unknown';
        const pageText = document.body.innerText;
        const diffMatch = pageText.match(/Difficulty:\s*(Basic|Easy|Medium|Hard)/i);
        if (diffMatch) {
            difficulty = diffMatch[1];
        } else {
            const diffBadge = document.querySelector('[class*="difficultyBadge"], .problem-difficulty');
            if (diffBadge) difficulty = diffBadge.innerText.trim();
        }

        const descEl = document.querySelector('.problem-statement, .problems_problem_content__Xm_eO, [class*="ProblemDescription"]');
        const descriptionHTML = descEl ? descEl.innerHTML : 'Description not found';

        let language = 'Unknown';
        const langSelectors = ['.language-dropdown .selected', '.problems_language_dropdown', 'button[aria-haspopup="listbox"]', '.dropdown-toggle', '.ant-select-selection-item'];
        for (let sel of langSelectors) {
            const el = document.querySelector(sel);
            if (el) { language = el.innerText.trim(); break; }
        }

        if (language === 'Unknown') {
            const allText = document.body.innerText.toLowerCase();
            if (allText.includes('gcc')) language = 'C';
            else if (allText.includes('g++') || allText.includes('c++')) language = 'C++';
            else if (allText.includes('java')) language = 'Java';
            else if (allText.includes('python')) language = 'Python';
        }

        if (language.toLowerCase().includes('c++')) language = 'C++';
        else if (language.toLowerCase().includes('c (gcc')) language = 'C';

        let code = await fetchCodeFromInject();

        // Prevent pushing empty files
        if (!code || code.trim() === '') {
            btn.innerText = "Failed: Editor Empty";
            btn.style.backgroundColor = "#cb2431"; // Red
            setTimeout(() => { btn.innerText = "Push to GitHub"; btn.style.backgroundColor = "#2ea44f"; }, 3000);
            return;
        }

        const payload = {
            title: title,
            difficulty: difficulty,
            description: descriptionHTML,
            language: language,
            code: code
        };

        chrome.runtime.sendMessage({ action: 'pushToGitHub', data: payload });

        // Optimistic UI update
        btn.innerText = "Pushed Successfully ✓";
        btn.style.backgroundColor = "#28a745";

    } catch (error) {
        console.error("GFG Sync: Failed to extract data", error);
        btn.innerText = "Error!";
        btn.style.backgroundColor = "#cb2431";
    }
}

// 5. Trigger the Custom Event handshake with inject.js
function fetchCodeFromInject() {
    return new Promise((resolve) => {
        const listener = function (e) {
            document.removeEventListener('GFG_RES_CODE', listener);
            resolve(e.detail);
        };
        document.addEventListener('GFG_RES_CODE', listener);
        document.dispatchEvent(new Event('GFG_REQ_CODE'));

        setTimeout(() => {
            document.removeEventListener('GFG_RES_CODE', listener);
            resolve("");
        }, 2000);
    });
}