// background.js - Background service worker for Chrome Extension
console.log("LeetBuddy background script loaded")

chrome.runtime.onInstalled.addListener(() => {
  console.log("LeetBuddy extension installed")
})

// Handle messages from popup and sidebar
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request.type, request)

  if (request.type === "OPENAI_REQUEST") {
    handleOpenAIRequest(request.data)
      .then((response) => sendResponse({ success: true, data: response }))
      .catch((error) => sendResponse({ success: false, error: error.message }))
    return true // Keep message channel open for async response
  }

  if (request.type === "GET_PROBLEM_DATA") {
    // Forward the request to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
          console.log("Background forwarding response:", response)
          if (chrome.runtime.lastError) {
            console.error("Error forwarding message:", chrome.runtime.lastError)
            sendResponse({ success: false, error: chrome.runtime.lastError.message })
          } else {
            sendResponse(response)
          }
        })
      } else {
        sendResponse({ success: false, error: "No active tab found" })
      }
    })
    return true // Keep message channel open for async response
  }

  if (request.type === "REFRESH_PROBLEM_DATA") {
    // Forward the request to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
          console.log("Background forwarding refresh response:", response)
          if (chrome.runtime.lastError) {
            console.error("Error forwarding refresh message:", chrome.runtime.lastError)
            sendResponse({ success: false, error: chrome.runtime.lastError.message })
          } else {
            sendResponse(response)
          }
        })
      } else {
        sendResponse({ success: false, error: "No active tab found" })
      }
    })
    return true // Keep message channel open for async response
  }
})

async function handleOpenAIRequest(data) {
  const { messages, apiKey } = data

  if (!apiKey) {
    throw new Error("OpenAI API key not configured")
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`)
    }

    const result = await response.json()
    return result.choices[0].message.content
  } catch (error) {
    console.error("Groq API request failed:", error)
    throw error
  }
}

// Handle tab updates to refresh problem data
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('leetcode.com/problems/')) {
    // Send a message to content script to refresh data
    chrome.tabs.sendMessage(tabId, { type: "REFRESH_PROBLEM_DATA" }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Tab update message failed (normal if content script not ready):", chrome.runtime.lastError.message)
      }
    })
  }
})