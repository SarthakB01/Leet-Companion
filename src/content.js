// content.js - Content script that runs on LeetCode problem pages
console.log("LeetBuddy content script loaded")

class LeetBuddyContent {
  constructor() {
    this.sidebarOpen = false
    this.currentProblem = null
    this.maxRetries = 10
    this.retryDelay = 1000
    this.init()
  }

  async init() {
    // Wait for page to load
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup())
    } else {
      this.setup()
    }
  }

  async setup() {
    console.log("Setting up LeetBuddy...")
    
    // Try to extract problem data with retries
    await this.extractProblemDataWithRetries()
    
    this.createToggleButton()
    this.createSidebar()
    
    // Watch for URL changes (LeetCode is SPA)
    this.observeUrlChanges()
  }

  // Watch for URL changes in SPA
  observeUrlChanges() {
    let currentUrl = window.location.href
    
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href
        console.log("URL changed, re-extracting problem data...")
        setTimeout(() => this.extractProblemDataWithRetries(), 1000)
      }
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  async extractProblemDataWithRetries() {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      console.log(`LeetBuddy: Attempt ${attempt} to extract problem data`)
      
      const problemData = await this.extractProblemData()
      
      if (problemData.title !== "Current LeetCode Problem" && problemData.description !== "Problem description not found") {
        console.log("LeetBuddy: Successfully extracted problem data", problemData)
        this.currentProblem = problemData
        window.leetBuddyCurrentProblem = problemData
        return problemData
      }
      
      if (attempt < this.maxRetries) {
        console.log(`LeetBuddy: Attempt ${attempt} failed, retrying in ${this.retryDelay}ms...`)
        await this.sleep(this.retryDelay)
      }
    }
    
    console.warn("LeetBuddy: Failed to extract problem data after all attempts")
    const fallbackData = this.getFallbackProblemData()
    this.currentProblem = fallbackData
    window.leetBuddyCurrentProblem = fallbackData
    return fallbackData
  }

  async extractProblemData() {
    try {
      // More comprehensive selectors for LeetCode's current structure
      const titleSelectors = [
        '[data-cy="question-title"]',
        'h1[class*="title"]',
        '.text-title-large',
        '.text-lg.font-medium',
        'h1',
        '[class*="question-title"]',
        '.css-v3d350',
        'div[class*="title"] h1',
        '.question-title h1'
      ]

      const descriptionSelectors = [
        '[data-track-load="description_content"]',
        '.elfjS .content__u3I1',
        '.content__u3I1',
        '.question-content',
        '[class*="question-content"]',
        '.elfjS',
        '.xFUwe',
        '.question-detail-main-tabs .tab-pane.active',
        '[class*="description"]',
        '.problem-description'
      ]

      const difficultySelectors = [
        '[diff]',
        '[data-degree]',
        '.text-difficulty-easy',
        '.text-difficulty-medium', 
        '.text-difficulty-hard',
        '.css-10o4wqw',
        '[class*="difficulty"]',
        '.text-olive', 
        '.text-yellow', 
        '.text-pink',
        '[class*="Easy"]',
        '[class*="Medium"]',
        '[class*="Hard"]'
      ]

      const tagSelectors = [
        '[data-cy="topic-tag"]',
        '.topic-tag',
        '[class*="topic-tag"]',
        '[class*="tag"]',
        '.rounded-full.px-2.py-1',
        'a[href*="/tag/"]'
      ]

      // Extract title
      const titleElement = this.findElementBySelectors(titleSelectors)
      const title = titleElement?.textContent?.trim() || "Current LeetCode Problem"

      // Extract description - get the first few paragraphs
      const descriptionElement = this.findElementBySelectors(descriptionSelectors)
      let description = "Problem description not found"
      
      if (descriptionElement) {
        // Try to get meaningful description text
        const textContent = descriptionElement.textContent?.trim()
        if (textContent && textContent.length > 20) {
          // Take first 800 characters to avoid too much text
          description = textContent.length > 800 ? textContent.substring(0, 800) + "..." : textContent
        }
      }

      // Extract difficulty
      const difficultyElement = this.findElementBySelectors(difficultySelectors)
      let difficulty = "Unknown"
      
      if (difficultyElement) {
        const diffText = difficultyElement.textContent?.trim()
        if (diffText) {
          difficulty = diffText
        } else {
          // Try to determine from class names
          const className = difficultyElement.className
          if (className.includes('easy') || className.includes('olive') || className.includes('Easy')) difficulty = "Easy"
          else if (className.includes('medium') || className.includes('yellow') || className.includes('Medium')) difficulty = "Medium"
          else if (className.includes('hard') || className.includes('pink') || className.includes('Hard')) difficulty = "Hard"
        }
      }

      // Extract tags
      const tagElements = this.findElementsBySelectors(tagSelectors)
      const tags = Array.from(tagElements)
        .map(tag => tag.textContent?.trim())
        .filter(Boolean)
        .filter(tag => tag.length > 0 && tag.length < 50) // Filter reasonable tag lengths

      const problemData = {
        title,
        description,
        difficulty,
        tags,
        url: window.location.href,
        timestamp: Date.now()
      }

      console.log("LeetBuddy: Extracted problem data", problemData)
      return problemData

    } catch (error) {
      console.error("LeetBuddy: Error extracting problem data", error)
      return this.getFallbackProblemData()
    }
  }

  findElementBySelectors(selectors) {
    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector)
        if (element && element.textContent?.trim()) {
          console.log(`Found element with selector: ${selector}`)
          return element
        }
      } catch (e) {
        console.warn(`Invalid selector: ${selector}`, e)
      }
    }
    return null
  }

  findElementsBySelectors(selectors) {
    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector)
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`)
          return elements
        }
      } catch (e) {
        console.warn(`Invalid selector: ${selector}`, e)
      }
    }
    return []
  }

  getFallbackProblemData() {
    // Extract problem ID from URL as fallback
    const urlMatch = window.location.pathname.match(/\/problems\/([^\/]+)/)
    const problemSlug = urlMatch ? urlMatch[1] : "unknown"
    
    return {
      title: `LeetCode Problem: ${problemSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      description: `Problem URL: ${window.location.href}\n\nUnable to extract problem description. Please refresh the page or check the LeetCode problem directly.`,
      difficulty: "Unknown",
      tags: [],
      url: window.location.href,
      timestamp: Date.now(),
      fallback: true
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  createToggleButton() {
    // Remove existing button if it exists
    const existingButton = document.getElementById("leetbuddy-toggle")
    if (existingButton) {
      existingButton.remove()
    }

    const button = document.createElement("button")
    button.id = "leetbuddy-toggle"
    button.className = "leetbuddy-toggle"
    button.innerHTML = "🤖"
    button.title = "Open LeetBuddy Assistant"
    
    // Add some basic styles to make it visible
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
    `

    // Add hover effect
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)'
      button.style.background = '#0056b3'
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)'
      button.style.background = '#007bff'
    })

    button.addEventListener("click", () => {
      this.toggleSidebar()
    })

    document.body.appendChild(button)
    console.log("Toggle button created")
  }

  createSidebar() {
    // Remove existing sidebar if it exists
    const existingSidebar = document.getElementById("leetbuddy-sidebar")
    if (existingSidebar) {
      existingSidebar.remove()
    }

    const sidebar = document.createElement("div")
    sidebar.id = "leetbuddy-sidebar"
    sidebar.className = "leetbuddy-sidebar"
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
    `

    // Create iframe for React app
    const iframe = document.createElement("iframe")
    iframe.src = chrome.runtime.getURL("dist/sidebar.html")
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.border = "none"

    sidebar.appendChild(iframe)
    document.body.appendChild(sidebar)

    // Send problem data to sidebar when it loads
    iframe.onload = () => {
      console.log("Sidebar iframe loaded")
      setTimeout(() => {
        if (this.currentProblem) {
          iframe.contentWindow.postMessage(
            {
              type: "PROBLEM_DATA",
              data: this.currentProblem,
            },
            "*"
          )
        }
      }, 1000)
    }

    console.log("Sidebar created")
  }

  toggleSidebar() {
    const sidebar = document.getElementById("leetbuddy-sidebar")
    const toggleButton = document.getElementById("leetbuddy-toggle")
    if (!sidebar) return

    this.sidebarOpen = !this.sidebarOpen

    if (this.sidebarOpen) {
      sidebar.classList.add("open")
      if (toggleButton) toggleButton.style.display = "none"
      console.log("Sidebar opened")
      
      // Re-extract problem data when opening sidebar if data is stale
      if (!this.currentProblem || Date.now() - this.currentProblem.timestamp > 30000) {
        this.extractProblemDataWithRetries()
      }
    } else {
      sidebar.classList.remove("open")
      if (toggleButton) toggleButton.style.display = "block"
      console.log("Sidebar closed")
    }
  }
}

// Initialize LeetBuddy
const leetBuddy = new LeetBuddyContent()

// Enhanced chrome.runtime.onMessage handler
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[LeetBuddy Content Script] Received message:", request)
    
    if (request.type === "GET_PROBLEM_DATA") {
      console.log("[LeetBuddy Content Script] Responding with problem data:", window.leetBuddyCurrentProblem)
      sendResponse({ 
        success: true,
        data: window.leetBuddyCurrentProblem || leetBuddy.getFallbackProblemData()
      })
      return true
    }
    
    if (request.type === "REFRESH_PROBLEM_DATA") {
      leetBuddy.extractProblemDataWithRetries().then(data => {
        sendResponse({ success: true, data })
      }).catch(error => {
        sendResponse({ success: false, error: error.message })
      })
      return true
    }
    
    if (request.type === "TOGGLE_SIDEBAR") {
      leetBuddy.toggleSidebar()
      sendResponse({ success: true })
      return true
    }
  })
}

// Global function to access from popup
window.leetBuddyToggle = () => {
  leetBuddy.toggleSidebar()
}