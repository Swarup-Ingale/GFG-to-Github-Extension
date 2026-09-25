chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'pushToGitHub') {
        chrome.storage.local.get(['githubToken', 'repoName'], (result) => {
            if (!result.githubToken || !result.repoName) {
                console.error("GFG Sync: GitHub Token or Repo Name not set.");
                return;
            }
            pushToGitHubAPI(request.data, result.githubToken, result.repoName);
        });
    }
});

const getExtension = (lang) => {
    const l = lang.toLowerCase();
    if (l.includes('c++') || l.includes('cpp')) return 'cpp';
    if (l.includes('java')) return 'java';
    if (l.includes('python')) return 'py';
    if (l.includes('c#')) return 'cs';
    if (l.includes('javascript') || l.includes('js')) return 'js';
    if (l.includes('c')) return 'c';
    return 'txt';
};

async function pushToGitHubAPI(data, token, repoName) {
    const safeTitle = data.title.replace(/[^a-zA-Z0-9_-]/g, "");
    const ext = getExtension(data.language);

    // Folder Structure: Difficulty/ProblemTitle/ProblemTitle.ext
    const basePath = `${data.difficulty}/${safeTitle}`;
    const codeFilePath = `${basePath}/${safeTitle}.${ext}`;
    const readmeFilePath = `${basePath}/README.md`;

    const readmeContent = `<h2><a href="#">${data.title}</a></h2>\n<h3>Difficulty: ${data.difficulty}</h3><hr>\n${data.description}`;

    await uploadOrUpdateFile(token, repoName, readmeFilePath, readmeContent, `Add README for ${data.title}`);
    await uploadOrUpdateFile(token, repoName, codeFilePath, data.code, `Add ${data.language} solution for ${data.title}`);
}

async function uploadOrUpdateFile(token, repo, path, content, commitMessage) {
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    let sha = null;

    // 1. Check if file exists to get its SHA (required for updating existing files)
    try {
        const getRes = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        if (getRes.ok) {
            const getJson = await getRes.json();
            sha = getJson.sha;
        }
    } catch (e) {
        console.log(`Checking file existence failed, assuming new file for ${path}`);
    }

    // 2. Safely encode content to Base64 (handles Unicode characters in problem descriptions)
    const bytesToBase64 = (bytes) => {
        const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
        return btoa(binString);
    };
    const base64Content = bytesToBase64(new TextEncoder().encode(content));

    const putBody = {
        message: commitMessage,
        content: base64Content
    };
    if (sha) putBody.sha = sha;

    // 3. Upload or update the file
    try {
        const putRes = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(putBody)
        });

        if (putRes.ok) {
            console.log(`GFG Sync: Successfully pushed ${path}`);
        } else {
            console.error(`GFG Sync: Failed to push ${path}`, await putRes.text());
        }
    } catch (e) {
        console.error(`GFG Sync: Error pushing ${path}`, e);
    }
}