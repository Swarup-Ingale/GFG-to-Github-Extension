document.addEventListener('DOMContentLoaded', () => {
    const tokenInput = document.getElementById('token');
    const repoInput = document.getElementById('repo');
    const saveBtn = document.getElementById('save');
    const statusDiv = document.getElementById('status');

    // Load existing settings
    chrome.storage.local.get(['githubToken', 'repoName'], (result) => {
        if (result.githubToken) tokenInput.value = result.githubToken;
        if (result.repoName) repoInput.value = result.repoName;
    });

    // Save settings on click
    saveBtn.addEventListener('click', () => {
        chrome.storage.local.set({
            githubToken: tokenInput.value.trim(),
            repoName: repoInput.value.trim()
        }, () => {
            statusDiv.textContent = 'Settings saved successfully!';
            setTimeout(() => { statusDiv.textContent = ''; }, 2000);
        });
    });
});