document.addEventListener('DOMContentLoaded', () => {
    const tokenInput = document.getElementById('token');
    const repoInput = document.getElementById('repo');
    const saveBtn = document.getElementById('save');
    const statusDiv = document.getElementById('status');
    const themeSelect = document.getElementById('themeSelect');

    // Load existing settings and theme
    chrome.storage.local.get(['githubToken', 'repoName', 'extensionTheme'], (result) => {
        if (result.githubToken) tokenInput.value = result.githubToken;
        if (result.repoName) repoInput.value = result.repoName;

        const savedTheme = result.extensionTheme || 'dark';
        themeSelect.value = savedTheme;
        document.body.setAttribute('data-theme', savedTheme);
    });

    // Real-time Theme Switching
    themeSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        document.body.setAttribute('data-theme', selectedTheme);

        // Save theme preference instantly
        chrome.storage.local.set({ extensionTheme: selectedTheme });
    });

    // Save Settings with Animation
    saveBtn.addEventListener('click', () => {
        // UI Animation State
        saveBtn.classList.add('saving');
        saveBtn.textContent = 'Saving...';
        statusDiv.textContent = '';

        chrome.storage.local.set({
            githubToken: tokenInput.value.trim(),
            repoName: repoInput.value.trim()
        }, () => {
            // Restore UI after synthetic delay for smooth UX
            setTimeout(() => {
                saveBtn.classList.remove('saving');
                saveBtn.textContent = 'Save Configuration';
                statusDiv.textContent = 'Settings saved successfully ✓';

                setTimeout(() => { statusDiv.textContent = ''; }, 2500);
            }, 600);
        });
    });
});