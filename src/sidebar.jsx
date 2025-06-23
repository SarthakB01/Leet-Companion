// sidebar.jsx – Polished LeetBuddy sidebar UI
"use client"

import { useState, useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import { Send, X, Lightbulb, Code, HelpCircle, RefreshCw } from "lucide-react"
import ReactMarkdown from "react-markdown"

function Sidebar() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingContext, setIsLoadingContext] = useState(true)
  const [problemData, setProblemData] = useState(null)
  const [apiKey, setApiKey] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (chrome?.storage) {
      chrome.storage.local.get(["openaiApiKey"], (r) => {
        if (r.openaiApiKey) setApiKey(r.openaiApiKey)
      })
    }
    loadProblemData()
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  function handleMessage(e) {
    if (e.data?.type !== "PROBLEM_DATA") return
    hydrateProblem(e.data.data)
  }

  function loadProblemData() {
    setIsLoadingContext(true)
    if (!chrome?.runtime) return setIsLoadingContext(false)
    chrome.runtime.sendMessage({ type: "GET_PROBLEM_DATA" }, (res) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError)
        return setIsLoadingContext(false)
      }
      hydrateProblem(res?.data)
    })
  }

  function hydrateProblem(data) {
    setProblemData(data ?? null)
    setIsLoadingContext(false)
    if (data?.title) {
      setMessages([
        {
          type: "assistant",
          content: `👋 Hey! I notice you're solving **${data.title}**.  \nI can provide hints, explanations or help debug code. What can I do for you?`,
        },
      ])
    } else {
      setMessages([
        {
          type: "assistant",
          content:
            "Hi! I couldn't read the current LeetCode problem. Try refreshing the page or press the ↻ button above.",
        },
      ])
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function sendMessage() {
    if (!inputValue.trim() || isLoading) return
    if (!apiKey) {
      alert("Please add your OpenAI API key in the extension settings.")
      return
    }

    const userPayload = { type: "user", content: inputValue.trim() }
    setMessages((prev) => [...prev, userPayload])
    setInputValue("")
    setIsLoading(true)

    const systemPrompt = problemData
      ? `You are LeetBuddy, an AI assistant that helps with LeetCode. Current problem: "${problemData.title}" (${problemData.difficulty}). Description (truncated): ${problemData.description?.slice(
          0,
          400,
        )}`
      : "You are LeetBuddy, an AI assistant that helps with LeetCode questions."

    const chatHistory = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-7).map((m) => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: userPayload.content },
    ]

    chrome.runtime.sendMessage(
      { type: "OPENAI_REQUEST", data: { messages: chatHistory, apiKey } },
      (res) => {
        setIsLoading(false)
        if (chrome.runtime.lastError || !res?.success) {
          console.error(res?.error ?? chrome.runtime.lastError)
          setMessages((prev) => [
            ...prev,
            { type: "assistant", content: "🙈 Sorry, something went wrong. Try again." },
          ])
          return
        }
        setMessages((prev) => [...prev, { type: "assistant", content: res.data }])
      },
    )
  }

  function handleEnter(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickActions = [
    { Icon: Lightbulb, text: "Hint", fill: "Give me a hint for this problem." },
    { Icon: Code, text: "Approach", fill: "What's an efficient approach?" },
    { Icon: HelpCircle, text: "Complexity", fill: "Time & space complexity?" },
  ]

  const reloadContext = () => loadProblemData()
  const closeSidebar = () => {
    if (window.parent !== window) window.parent.postMessage({ type: "CLOSE_SIDEBAR" }, "*")
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "#fff",
      fontFamily: "Inter, system-ui, sans-serif",
      boxShadow: "0 0 16px 0 rgba(0,0,0,0.10)"
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px 12px 24px",
        borderBottom: "1px solid #eee",
        fontWeight: 700,
        fontSize: "1.1rem"
      }}>
        {problemData?.title || "LeetCompanion"}
        <span style={{
          marginLeft: 12,
          padding: "2px 10px",
          borderRadius: 12,
          background: "#FFA116",
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.85rem"
        }}>{problemData?.difficulty || "Unknown"}</span>
      </div>

      {/* Problem Info */}
      <div style={{
        background: "#fafafa",
        margin: "16px 24px 8px 24px",
        padding: "12px",
        borderRadius: 10,
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)",
        fontSize: "0.95rem",
        maxHeight: 100,
        overflowY: "auto"
      }}>
        {problemData?.description || "No description available."}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: "flex",
        gap: 8,
        margin: "0 24px 12px 24px"
      }}>
        {quickActions.map((action, i) => (
          <button key={i} style={{
            border: "1px solid #FFA116",
            background: "#fff",
            color: "#FFA116",
            borderRadius: 16,
            padding: "4px 12px",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer"
          }} onClick={() => setInputValue(action.fill)} disabled={isLoading}>
            <action.Icon className="w-3 h-3" /> {action.text}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div style={{
        flex: "1 1 0%",
        overflowY: "auto",
        margin: "0 24px",
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
            background: msg.type === "user" ? "#FFA116" : "#f5f5f5",
            color: msg.type === "user" ? "#fff" : "#222",
            borderRadius: 14,
            padding: "10px 16px",
            maxWidth: "75%",
            boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)"
          }}>
            {msg.type === "assistant" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 24px 16px 24px",
        borderTop: "1px solid #eee",
        background: "#fff"
      }}>
        <input
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: 16,
            padding: "8px 14px",
            fontSize: "1rem",
            marginRight: 8
          }}
          placeholder="Type your question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleEnter}
          disabled={isLoading || !apiKey}
        />
        <button
          style={{
            background: "#FFA116",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
          onClick={sendMessage}
          disabled={isLoading || !inputValue.trim() || !apiKey}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

const container = document.getElementById("sidebar-root")
if (container) {
  const root = createRoot(container)
  root.render(<Sidebar />)
}
