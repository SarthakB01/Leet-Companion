// sidebar.jsx - React component for sidebar UI
"use client"

import { useState, useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import { Send, X, Bot, User, Lightbulb, Code, HelpCircle, RefreshCw } from "lucide-react"

function Sidebar() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [problemData, setProblemData] = useState(null)
  const [apiKey, setApiKey] = useState("")
  const [isLoadingContext, setIsLoadingContext] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Load API key from storage
    if (typeof window.chrome !== "undefined" && window.chrome.storage) {
      window.chrome.storage.local.get(["openaiApiKey"], (result) => {
        if (result.openaiApiKey) {
          setApiKey(result.openaiApiKey)
        }
      })
    }

    // Load problem data
    loadProblemData()

    // Listen for messages from parent window (content script)
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const handleMessage = (event) => {
    if (event.data.type === 'PROBLEM_DATA') {
      console.log("Sidebar received problem data via postMessage:", event.data.data)
      setProblemData(event.data.data)
      setIsLoadingContext(false)
      
      if (event.data.data && event.data.data.title) {
        setMessages([
          {
            type: "assistant",
            content: `Hi! I'm your LeetBuddy assistant. I can see you're working on "${event.data.data.title}". I can help you with hints, explanations, debugging, or any questions about this problem. What would you like to know?`,
          },
        ])
      }
    }
  }

  const loadProblemData = () => {
    setIsLoadingContext(true)
    
    // Request problem data via chrome.runtime.sendMessage
    if (chrome && chrome.runtime) {
      chrome.runtime.sendMessage({ type: "GET_PROBLEM_DATA" }, (response) => {
        console.log("Sidebar received response from background:", response)
        
        if (chrome.runtime.lastError) {
          console.error("Chrome runtime error:", chrome.runtime.lastError)
          setIsLoadingContext(false)
          return
        }

        if (response && response.success && response.data && response.data.title) {
          setProblemData(response.data)
          setIsLoadingContext(false)
          setMessages([
            {
              type: "assistant",
              content: `Hi! I'm your LeetBuddy assistant. I can see you're working on "${response.data.title}". I can help you with hints, explanations, debugging, or any questions about this problem. What would you like to know?`,
            },
          ])
        } else {
          console.log("No valid problem data received:", response)
          setIsLoadingContext(false)
          // Set fallback message
          setMessages([
            {
              type: "assistant",
              content: "Hi! I'm your LeetBuddy assistant. I'm having trouble reading the current problem. Please try refreshing the context or make sure you're on a LeetCode problem page.",
            },
          ])
        }
      })
    } else {
      console.error("Chrome runtime not available")
      setIsLoadingContext(false)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return
    if (!apiKey) {
      alert("Please configure your OpenAI API key in the extension popup")
      return
    }

    const userMessage = { type: "user", content: inputValue }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      // Prepare context for the AI
      const systemPrompt = problemData
        ? `You are LeetBuddy, an AI assistant helping with LeetCode problems. Current problem: "${problemData.title}" (${problemData.difficulty}). Description: ${problemData.description.substring(0, 500)}... Provide helpful hints, explanations, and guidance without giving away the complete solution. Keep responses concise and helpful.`
        : "You are LeetBuddy, an AI assistant for LeetCode problems. Help with hints, explanations, and debugging."

      const messagesArray = [
        { role: "system", content: systemPrompt },
        ...messages.slice(-5).map((msg) => ({
          // Keep last 5 messages for context
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: currentInput },
      ]

      // Send request to background script
      if (typeof window.chrome !== "undefined" && window.chrome.runtime) {
        window.chrome.runtime.sendMessage(
          {
            type: "OPENAI_REQUEST",
            data: { messages: messagesArray, apiKey },
          },
          (response) => {
            setIsLoading(false)
            if (window.chrome.runtime.lastError) {
              console.error("Chrome runtime error:", window.chrome.runtime.lastError)
              setMessages((prev) => [
                ...prev,
                {
                  type: "assistant",
                  content: "Sorry, I encountered a connection error. Please try again.",
                },
              ])
              return
            }

            if (response && response.success) {
              setMessages((prev) => [
                ...prev,
                {
                  type: "assistant",
                  content: response.data,
                },
              ])
            } else {
              setMessages((prev) => [
                ...prev,
                {
                  type: "assistant",
                  content: `Sorry, I encountered an error: ${response?.error || "Unknown error"}`,
                },
              ])
            }
          },
        )
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        },
      ])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const closeSidebar = () => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "CLOSE_SIDEBAR" }, "*")
    }
  }

  const quickActions = [
    { icon: Lightbulb, text: "Give me a hint", action: () => setInputValue("Give me a hint for this problem") },
    { icon: Code, text: "Explain approach", action: () => setInputValue("What's the best approach to solve this?") },
    { icon: HelpCircle, text: "Time complexity", action: () => setInputValue("What's the time and space complexity?") },
  ]

  // Reload context function
  const reloadContext = () => {
    loadProblemData()
  }

  return (
    <div className="h-full flex flex-col bg-white shadow-lg rounded-l-lg border-l-4 border-blue-600">
      {/* Debug section - show problem data */}
      <div className="p-2 bg-yellow-50 border-b border-yellow-200 text-xs text-yellow-900 font-mono overflow-x-auto max-h-32">
        <div className="flex items-center justify-between mb-1">
          <span>DEBUG: problemData</span>
          <button 
            onClick={reloadContext} 
            className="px-2 py-1 bg-yellow-200 text-yellow-900 rounded text-xs font-bold ml-2 flex items-center gap-1 hover:bg-yellow-300 transition-colors"
            disabled={isLoadingContext}
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingContext ? 'animate-spin' : ''}`} />
            Reload
          </button>
        </div>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '10px' }}>
          {isLoadingContext ? "Loading..." : JSON.stringify(problemData, null, 2)}
        </pre>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-600 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="flex items-center space-x-2">
          <Bot className="w-7 h-7 text-white" />
          <h2 className="font-bold text-white text-lg tracking-wide">LeetBuddy</h2>
        </div>
        <button onClick={closeSidebar} className="p-1 text-white hover:text-blue-100 rounded transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Problem Info */}
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h3 className="font-semibold text-base text-blue-900 truncate">
          {isLoadingContext ? (
            <span className="animate-pulse text-blue-400">Loading problem...</span>
          ) : problemData ? (
            problemData.title
          ) : (
            <span className="text-red-600">No problem data</span>
          )}
        </h3>
        <div className="flex items-center space-x-2 mt-2">
          <span
            className={`px-2 py-1 text-xs rounded-full font-semibold ${
              problemData?.difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : problemData?.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : problemData?.difficulty === "Hard"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {isLoadingContext ? (
              <span className="animate-pulse">...</span>
            ) : problemData ? (
              problemData.difficulty
            ) : (
              "Unknown"
            )}
          </span>
          {(problemData?.tags || []).slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-semibold">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Loading spinner if still loading context */}
      {isLoadingContext && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <div className="text-blue-700 font-medium text-lg">Loading problem context...</div>
        </div>
      )}

      {/* Quick Actions */}
      {!isLoadingContext && (
        <div className="p-4 border-b border-blue-100 bg-blue-50">
          <p className="text-sm text-blue-700 mb-2 font-semibold">Quick actions:</p>
          <div className="flex gap-2 flex-wrap">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={action.action}
                disabled={isLoading}
              >
                <action.icon className="w-3 h-3" /> {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {!isLoadingContext && (
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-lg px-4 py-2 max-w-xs whitespace-pre-wrap shadow text-sm ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                  {msg.content}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center mt-8">Start a conversation to get help with this problem!</div>
          )}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 rounded-lg px-4 py-2 shadow">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      {!isLoadingContext && (
        <div className="p-4 border-t border-blue-100 bg-blue-50 flex gap-2">
          <input
            type="text"
            className="flex-1 border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 text-sm"
            placeholder={problemData ? "Type your question..." : "No problem context available"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading || !apiKey}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !inputValue.trim() || !apiKey}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

const container = document.getElementById("sidebar-root")
if (container) {
  const root = createRoot(container)
  root.render(<Sidebar />)
}