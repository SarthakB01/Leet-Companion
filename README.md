# LeetCompanion – Your AI-Powered LeetCode Sidekick

## Overview

**LeetCompanion** is a Chrome extension that brings the power of AI directly to your LeetCode problem-solving workflow. With seamless integration, a modern UI, and real-time hints and explanations powered by Groq’s Llama 3 model, LeetCompanion is the perfect coding companion for anyone looking to level up their LeetCode practice.

---

## Key Features

- **Instant AI Help:** Get hints, explanations, and debugging assistance for any LeetCode problem, right on the problem page.
- **Context-Aware Sidebar:** Automatically displays the current problem’s title, description, difficulty, and tags.
- **Groq API Integration:** Uses the Llama 3 70B model via Groq’s API for fast, high-quality responses.
- **User API Key:** Securely uses your own Groq API key, set via the extension popup.
- **Quick Actions:** One-click prompts for common requests like “Give me a hint” or “Explain approach.”
- **Modern UI:** Built with React and Tailwind CSS for a clean, responsive experience.
- **Manifest v3 & CSP Compliant:** Fully compatible with Chrome’s latest extension standards and security policies.

---

## How It Works

### 1. Content Script
- Injects a floating toggle button and sidebar container into every LeetCode problem page.
- Extracts problem data (title, description, difficulty, tags) using robust DOM selectors.
- Listens for URL changes to update context on single-page navigation.

### 2. Sidebar (React App)
- Renders inside an iframe for isolation and security.
- Loads the current problem’s context and displays it at the top.
- Provides a chat interface for interacting with the AI assistant.
- Handles quick actions and displays conversation history.

### 3. Popup (API Key Management)
- Accessible from the Chrome toolbar.
- Lets users securely enter and save their Groq API key.
- Shows basic stats and settings.

### 4. Background Script
- Acts as a bridge for messaging between the popup, content script, and sidebar.
- Handles all API requests to Groq, ensuring the API key is never exposed to the page context.

### 5. Build & Security
- Uses Vite for fast, modern bundling.
- All scripts (including React) are bundled—no external scripts, fully CSP compliant.
- Post-build scripts ensure the correct script tags are injected and all resources are in place.

---

## User Experience

1. **Install LeetCompanion** from the Chrome Web Store or load it unpacked.
2. **Click the LeetCompanion icon** in your Chrome toolbar to open the popup.
3. **Paste your Groq API key** (get one from [Groq Console](https://console.groq.com/keys)) and save.
4. **Go to any LeetCode problem page.**
5. **Click the 🤖 toggle button** to open the sidebar.
6. **Ask for hints, explanations, or debugging help**—or use the quick action buttons.
7. **Get instant, context-aware responses** from the AI, tailored to the problem you’re working on.

---

## Technical Challenges & Solutions

- **Content Security Policy (CSP):**  
  All scripts are bundled locally; no CDN dependencies. This avoids CSP violations and ensures the extension works out-of-the-box.
- **SPA Navigation on LeetCode:**  
  Uses a MutationObserver to detect URL changes and update the sidebar context without requiring a page reload.
- **API Key Security:**  
  The API key is stored in Chrome’s extension storage and never exposed to the page or network requests outside the extension context.
- **Build Process:**  
  Vite is configured to output all necessary bundles, and a post-build script injects the correct script tags into the final HTML.

---

## Example Use Cases

- **Stuck on a problem?**  
  Open the sidebar and ask for a hint or explanation.
- **Want to understand time complexity?**  
  Use the quick action or type your question for an instant breakdown.
- **Need to debug your approach?**  
  Paste your logic or ask the AI for common pitfalls on the current problem.

---

## Conclusion

**LeetCompanion** transforms your LeetCode workflow by embedding a powerful AI assistant right where you need it. With seamless integration, modern UI, and robust security, it’s the perfect coding companion for anyone looking to level up their problem-solving skills.
