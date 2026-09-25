# GeeksforGeeks to GitHub Sync 🚀

A lightweight, developer-friendly Chrome extension that seamlessly pushes your successfully solved GeeksforGeeks problems directly to your GitHub repository. 

Building a consistent GitHub commit history while grinding data structures and algorithms shouldn't require manual copying, pasting, and formatting. This extension handles the busywork by injecting a native "Push to GitHub" button right onto the GFG interface.

### ⭐️ Support the Project
If this extension saves you time and helps build your GitHub profile, please consider giving this repository a star! It really helps others find the tool.

## ✨ Features

* **One-Click Sync:** Injects a "Push to GitHub" button next to the problem title after a successful submission.
* **Smart Organization:** Automatically extracts the problem title, difficulty, and your code, saving them into clean language-specific and difficulty-specific folders.
* **Bypasses Strict CSP:** Built with a custom injected script architecture to reliably pull code directly from Monaco, Ace, and CodeMirror editors without violating GeeksforGeeks' Content Security Policy.
* **Beautiful Theming:** Toggle between Dark, Light, and Hacker modes in the extension popup.
* **Failsafe:** Automatically prevents pushing empty files if the editor hasn't fully loaded.

## 🛠️ Installation

Currently, the extension is loaded locally via Chrome's Developer Mode. Follow these simple steps:

**Step 1:** Clone this repository to your local machine:

    git clone https://github.com/Swarup-Ingale/GFG-to-Github-Extension.git

**Step 2:** Open Google Chrome and navigate to `chrome://extensions/`.

**Step 3:** Toggle on **Developer mode** in the top right corner.

**Step 4:** Click **Load unpacked** in the top left corner.

**Step 5:** Select the folder where you cloned this repository. Pin the extension to your toolbar for easy access!

## ⚙️ Configuration

To allow the extension to push code on your behalf, you need a GitHub Personal Access Token.

1. Go to your GitHub **Settings** > **Developer Settings** > **Personal access tokens** > **Tokens (classic)**.
2. Generate a new token and grant it the `repo` scope.
3. Copy the newly generated token.
4. Click the GFG Sync extension icon in your Chrome toolbar.
5. Paste your token and the target repository name (format: `your-username/your-repo-name`).
6. Click **Save Configuration**.

## 🤝 Contributing & Collaborations

GeeksforGeeks updates their UI and DOM classes frequently. If you notice the button stops appearing, or if you want to add support for new features, I would absolutely love your help! 

Contributions, issues, and feature requests are highly welcome. 

* Fork the Project
* Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
* Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
* Push to the Branch (`git push origin feature/AmazingFeature`)
* Open a Pull Request

If you have ideas for larger collaborations or structural improvements, feel free to open an issue so we can discuss it!

## 📝 License

Distributed under the MIT License. See the `LICENSE` file for more information.

## 👨‍💻 Author

**Swarup Ingale**
* **Portfolio:** [swarupingale.pages.dev](https://swarupingale.pages.dev/)
* **LinkedIn:** [Swarup Ingale](https://linkedin.com/in/swarup-ingale-45864b295)
* **GitHub:** [@Swarup-Ingale](https://github.com/Swarup-Ingale)
* **LeetCode:** [SW4LE](https://leetcode.com/u/SW4LE/)
* **GeeksforGeeks:** [swaruping2ptu](https://www.geeksforgeeks.org/profile/swaruping2ptu)