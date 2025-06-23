"use client"

import { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { Settings, TrendingUp, Target, Key } from "lucide-react"

function Popup() {
  const [stats, setStats] = useState({
    problemsSolvedToday: 0,
    recentTopics: [],
    suggestedTopic: "Arrays",
  })
  const [apiKey, setApiKey] = useState("")
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Load stats and API key from storage
    if (typeof window.chrome !== "undefined" && window.chrome.storage) {
      window.chrome.storage.local.get(["stats", "openaiApiKey"], (result) => {
        if (result.stats) {
          setStats(result.stats)
        }
        if (result.openaiApiKey) {
          setApiKey(result.openaiApiKey)
          // Only hide settings if API key is present
          setShowSettings(!!result.openaiApiKey)
        } else {
          setShowSettings(true)
        }
      })
    }
  }, [])

  const saveApiKey = () => {
    if (typeof window.chrome !== "undefined" && window.chrome.storage) {
      window.chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
        alert("API key saved!")
        setShowSettings(false)
      })
    }
  }

  const openLeetCode = () => {
    if (typeof window.chrome !== "undefined" && window.chrome.tabs) {
      window.chrome.tabs.create({ url: "https://leetcode.com/problemset/" })
    }
  }

  // Always show settings if API key is missing
  if (!apiKey || showSettings) {
    return (
      <div className="w-80 p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          {apiKey && (
            <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key className="inline w-4 h-4 mr-1" />
              Groq API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Get your free API key from <a href='https://console.groq.com/keys' target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>Groq Console</a></p>
          </div>

          <button
            onClick={saveApiKey}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save API Key
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">LB</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">LeetBuddy</h1>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-1 text-gray-500 hover:text-gray-700">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Today's Progress</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.problemsSolvedToday} problems solved</p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Suggested Practice</span>
          </div>
          <p className="text-lg font-semibold text-blue-600 mt-1">{stats.suggestedTopic}</p>
        </div>

        {stats.recentTopics.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Recent Topics</h3>
            <div className="flex flex-wrap gap-2">
              {stats.recentTopics.map((topic, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={openLeetCode}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Open LeetCode
        </button>

        {!apiKey && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Configure your OpenAI API key in settings to use the AI assistant
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const container = document.getElementById("popup-root")
if (container) {
  const root = createRoot(container)
  root.render(<Popup />)
}
