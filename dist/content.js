var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
console.log("LeetBuddy content script loaded");
class LeetBuddyContent {
  constructor() {
    this.sidebarOpen = false;
    this.currentProblem = null;
    this.maxRetries = 10;
    this.retryDelay = 1e3;
    this.init();
  }
  init() {
    return __async(this, null, function* () {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.setup());
      } else {
        this.setup();
      }
    });
  }
  setup() {
    return __async(this, null, function* () {
      console.log("Setting up LeetBuddy...");
      yield this.extractProblemDataWithRetries();
      this.createToggleButton();
      this.createSidebar();
      this.observeUrlChanges();
    });
  }
  // Watch for URL changes in SPA
  observeUrlChanges() {
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log("URL changed, re-extracting problem data...");
        setTimeout(() => this.extractProblemDataWithRetries(), 1e3);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  extractProblemDataWithRetries() {
    return __async(this, null, function* () {
      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        console.log(`LeetBuddy: Attempt ${attempt} to extract problem data`);
        const problemData = yield this.extractProblemData();
        if (problemData.title !== "Current LeetCode Problem" && problemData.description !== "Problem description not found") {
          console.log("LeetBuddy: Successfully extracted problem data", problemData);
          this.currentProblem = problemData;
          window.leetBuddyCurrentProblem = problemData;
          return problemData;
        }
        if (attempt < this.maxRetries) {
          console.log(`LeetBuddy: Attempt ${attempt} failed, retrying in ${this.retryDelay}ms...`);
          yield this.sleep(this.retryDelay);
        }
      }
      console.warn("LeetBuddy: Failed to extract problem data after all attempts");
      const fallbackData = this.getFallbackProblemData();
      this.currentProblem = fallbackData;
      window.leetBuddyCurrentProblem = fallbackData;
      return fallbackData;
    });
  }
  extractProblemData() {
    return __async(this, null, function* () {
      var _a, _b, _c;
      try {
        const titleSelectors = [
          '[data-cy="question-title"]',
          'h1[class*="title"]',
          ".text-title-large",
          ".text-lg.font-medium",
          "h1",
          '[class*="question-title"]',
          ".css-v3d350",
          'div[class*="title"] h1',
          ".question-title h1"
        ];
        const descriptionSelectors = [
          '[data-track-load="description_content"]',
          ".elfjS .content__u3I1",
          ".content__u3I1",
          ".question-content",
          '[class*="question-content"]',
          ".elfjS",
          ".xFUwe",
          ".question-detail-main-tabs .tab-pane.active",
          '[class*="description"]',
          ".problem-description"
        ];
        const difficultySelectors = [
          "[diff]",
          "[data-degree]",
          ".text-difficulty-easy",
          ".text-difficulty-medium",
          ".text-difficulty-hard",
          ".css-10o4wqw",
          '[class*="difficulty"]',
          ".text-olive",
          ".text-yellow",
          ".text-pink",
          '[class*="Easy"]',
          '[class*="Medium"]',
          '[class*="Hard"]'
        ];
        const tagSelectors = [
          '[data-cy="topic-tag"]',
          ".topic-tag",
          '[class*="topic-tag"]',
          '[class*="tag"]',
          ".rounded-full.px-2.py-1",
          'a[href*="/tag/"]'
        ];
        const titleElement = this.findElementBySelectors(titleSelectors);
        const title = ((_a = titleElement == null ? void 0 : titleElement.textContent) == null ? void 0 : _a.trim()) || "Current LeetCode Problem";
        const descriptionElement = this.findElementBySelectors(descriptionSelectors);
        let description = "Problem description not found";
        if (descriptionElement) {
          const textContent = (_b = descriptionElement.textContent) == null ? void 0 : _b.trim();
          if (textContent && textContent.length > 20) {
            description = textContent.length > 800 ? textContent.substring(0, 800) + "..." : textContent;
          }
        }
        const difficultyElement = this.findElementBySelectors(difficultySelectors);
        let difficulty = "Unknown";
        if (difficultyElement) {
          const diffText = (_c = difficultyElement.textContent) == null ? void 0 : _c.trim();
          if (diffText) {
            difficulty = diffText;
          } else {
            const className = difficultyElement.className;
            if (className.includes("easy") || className.includes("olive") || className.includes("Easy"))
              difficulty = "Easy";
            else if (className.includes("medium") || className.includes("yellow") || className.includes("Medium"))
              difficulty = "Medium";
            else if (className.includes("hard") || className.includes("pink") || className.includes("Hard"))
              difficulty = "Hard";
          }
        }
        const tagElements = this.findElementsBySelectors(tagSelectors);
        const tags = Array.from(tagElements).map((tag) => {
          var _a2;
          return (_a2 = tag.textContent) == null ? void 0 : _a2.trim();
        }).filter(Boolean).filter((tag) => tag.length > 0 && tag.length < 50);
        const problemData = {
          title,
          description,
          difficulty,
          tags,
          url: window.location.href,
          timestamp: Date.now()
        };
        console.log("LeetBuddy: Extracted problem data", problemData);
        return problemData;
      } catch (error) {
        console.error("LeetBuddy: Error extracting problem data", error);
        return this.getFallbackProblemData();
      }
    });
  }
  findElementBySelectors(selectors) {
    var _a;
    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector);
        if (element && ((_a = element.textContent) == null ? void 0 : _a.trim())) {
          console.log(`Found element with selector: ${selector}`);
          return element;
        }
      } catch (e) {
        console.warn(`Invalid selector: ${selector}`, e);
      }
    }
    return null;
  }
  findElementsBySelectors(selectors) {
    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          return elements;
        }
      } catch (e) {
        console.warn(`Invalid selector: ${selector}`, e);
      }
    }
    return [];
  }
  getFallbackProblemData() {
    const urlMatch = window.location.pathname.match(/\/problems\/([^\/]+)/);
    const problemSlug = urlMatch ? urlMatch[1] : "unknown";
    return {
      title: `LeetCode Problem: ${problemSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
      description: `Problem URL: ${window.location.href}

Unable to extract problem description. Please refresh the page or check the LeetCode problem directly.`,
      difficulty: "Unknown",
      tags: [],
      url: window.location.href,
      timestamp: Date.now(),
      fallback: true
    };
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  createToggleButton() {
    const existingButton = document.getElementById("leetbuddy-toggle");
    if (existingButton) {
      existingButton.remove();
    }
    const button = document.createElement("button");
    button.id = "leetbuddy-toggle";
    button.className = "leetbuddy-toggle";
    button.innerHTML = "🤖";
    button.title = "Open LeetBuddy Assistant";
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      cursor: pointer;
      font-size: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: all 0.2s ease;
    `;
    button.addEventListener("mouseenter", () => {
      button.style.transform = "scale(1.1)";
      button.style.background = "#0056b3";
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
      button.style.background = "#007bff";
    });
    button.addEventListener("click", () => {
      this.toggleSidebar();
    });
    document.body.appendChild(button);
    console.log("Toggle button created");
  }
  createSidebar() {
    const existingSidebar = document.getElementById("leetbuddy-sidebar");
    if (existingSidebar) {
      existingSidebar.remove();
    }
    const sidebar = document.createElement("div");
    sidebar.id = "leetbuddy-sidebar";
    sidebar.className = "leetbuddy-sidebar";
    sidebar.style.cssText = `
      position: fixed;
      top: 0;
      width: 400px;
      height: 100vh;
      background: white;
      border-left: 1px solid #ccc;
      z-index: 9999;
      transition: right 0.3s ease;
      box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    `;
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("dist/sidebar.html");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    sidebar.appendChild(iframe);
    document.body.appendChild(sidebar);
    iframe.onload = () => {
      console.log("Sidebar iframe loaded");
      setTimeout(() => {
        if (this.currentProblem) {
          iframe.contentWindow.postMessage(
            {
              type: "PROBLEM_DATA",
              data: this.currentProblem
            },
            "*"
          );
        }
      }, 1e3);
    };
    console.log("Sidebar created");
  }
  toggleSidebar() {
    const sidebar = document.getElementById("leetbuddy-sidebar");
    if (!sidebar)
      return;
    this.sidebarOpen = !this.sidebarOpen;
    if (this.sidebarOpen) {
      sidebar.classList.add("open");
      console.log("Sidebar opened");
      if (!this.currentProblem || Date.now() - this.currentProblem.timestamp > 3e4) {
        this.extractProblemDataWithRetries();
      }
    } else {
      sidebar.classList.remove("open");
      console.log("Sidebar closed");
    }
  }
}
const leetBuddy = new LeetBuddyContent();
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[LeetBuddy Content Script] Received message:", request);
    if (request.type === "GET_PROBLEM_DATA") {
      console.log("[LeetBuddy Content Script] Responding with problem data:", window.leetBuddyCurrentProblem);
      sendResponse({
        success: true,
        data: window.leetBuddyCurrentProblem || leetBuddy.getFallbackProblemData()
      });
      return true;
    }
    if (request.type === "REFRESH_PROBLEM_DATA") {
      leetBuddy.extractProblemDataWithRetries().then((data) => {
        sendResponse({ success: true, data });
      }).catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
      return true;
    }
    if (request.type === "TOGGLE_SIDEBAR") {
      leetBuddy.toggleSidebar();
      sendResponse({ success: true });
      return true;
    }
  });
}
window.leetBuddyToggle = () => {
  leetBuddy.toggleSidebar();
};
