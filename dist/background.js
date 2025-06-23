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
console.log("LeetBuddy background script loaded");
chrome.runtime.onInstalled.addListener(() => {
  console.log("LeetBuddy extension installed");
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request.type, request);
  if (request.type === "OPENAI_REQUEST") {
    handleOpenAIRequest(request.data).then((response) => sendResponse({ success: true, data: response })).catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
  if (request.type === "GET_PROBLEM_DATA") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
          console.log("Background forwarding response:", response);
          if (chrome.runtime.lastError) {
            console.error("Error forwarding message:", chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse(response);
          }
        });
      } else {
        sendResponse({ success: false, error: "No active tab found" });
      }
    });
    return true;
  }
  if (request.type === "REFRESH_PROBLEM_DATA") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
          console.log("Background forwarding refresh response:", response);
          if (chrome.runtime.lastError) {
            console.error("Error forwarding refresh message:", chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse(response);
          }
        });
      } else {
        sendResponse({ success: false, error: "No active tab found" });
      }
    });
    return true;
  }
});
function handleOpenAIRequest(data) {
  return __async(this, null, function* () {
    var _a;
    const { messages, apiKey } = data;
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }
    try {
      const response = yield fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });
      if (!response.ok) {
        const errorData = yield response.json();
        throw new Error(`Groq API error: ${response.status} - ${((_a = errorData.error) == null ? void 0 : _a.message) || "Unknown error"}`);
      }
      const result = yield response.json();
      return result.choices[0].message.content;
    } catch (error) {
      console.error("Groq API request failed:", error);
      throw error;
    }
  });
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("leetcode.com/problems/")) {
    chrome.tabs.sendMessage(tabId, { type: "REFRESH_PROBLEM_DATA" }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Tab update message failed (normal if content script not ready):", chrome.runtime.lastError.message);
      }
    });
  }
});
