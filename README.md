# LeetBuddy – Chrome Extension for LeetCode Hints

LeetBuddy is a lightweight Chrome Extension that shows helpful hints when you're solving LeetCode problems. It's perfect for beginners who want guidance without spoiling the solution.

## Features

- Shows curated problem-specific hints on Leetcode problem pages
- Easy toggle via popup
- Auto-injects hints into LeetCode’s interface
- Easy setup with no external dependencies

---

## How It Works

LeetBuddy uses a content script to detect the current problem being viewed on LeetCode. Based on the problem slug from the URL, it displays a curated hint in a floating hint box on the page. Users can enable or disable hints globally through the extension popup, with settings persisted using Chrome’s local storage.

---

##  Installation

1. Download this repository
2. Go to `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load Unpacked**
5. Select the `leetbuddy` folder
6. Open any LeetCode problem page – a hint will appear!

---

##  Tech Stack

- HTML, CSS, JavaScript
- Chrome Extensions (Manifest V3)
- Local storage API

---

## File structure
```bash
leetbuddy/
├── manifest.json
├── popup.html
├── popup.js
├── popup.css
├── content.js
├── hints.js
├── styles.css
└── icon.png
```


##  Coming Soon

- GPT-powered dynamic hints (AI version)
- Support for more coding platforms
- In-page toggle button

---

