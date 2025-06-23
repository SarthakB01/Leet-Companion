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
import { c as createLucideIcon$1, a as createRoot, j as jsxRuntimeExports, r as reactExports } from "./assets/createLucideIcon-64a3ef39.js";
const Bot = createLucideIcon$1("Bot", [
  [
    "rect",
    { width: "18", height: "10", x: "3", y: "11", rx: "2", key: "1ofdy3" }
  ],
  ["circle", { cx: "12", cy: "5", r: "2", key: "f1ur92" }],
  ["path", { d: "M12 7v4", key: "xawao1" }],
  ["line", { x1: "8", x2: "8", y1: "16", y2: "16", key: "h6x27f" }],
  ["line", { x1: "16", x2: "16", y1: "16", y2: "16", key: "5lty7f" }]
]);
const Code = createLucideIcon$1("Code", [
  ["polyline", { points: "16 18 22 12 16 6", key: "z7tu5w" }],
  ["polyline", { points: "8 6 2 12 8 18", key: "1eg1df" }]
]);
const HelpCircle = createLucideIcon$1("HelpCircle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
const Lightbulb = createLucideIcon$1("Lightbulb", [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
]);
const RefreshCw = createLucideIcon$1("RefreshCw", [
  [
    "path",
    { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }
  ],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  [
    "path",
    { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }
  ],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
const Send = createLucideIcon$1("Send", [
  ["path", { d: "m22 2-7 20-4-9-9-4Z", key: "1q3vgg" }],
  ["path", { d: "M22 2 11 13", key: "nzbqef" }]
]);
const X = createLucideIcon$1("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
function Sidebar() {
  const [messages, setMessages] = reactExports.useState([]);
  const [inputValue, setInputValue] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [problemData, setProblemData] = reactExports.useState(null);
  const [apiKey, setApiKey] = reactExports.useState("");
  const [isLoadingContext, setIsLoadingContext] = reactExports.useState(true);
  const messagesEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (typeof window.chrome !== "undefined" && window.chrome.storage) {
      window.chrome.storage.local.get(["openaiApiKey"], (result) => {
        if (result.openaiApiKey) {
          setApiKey(result.openaiApiKey);
        }
      });
    }
    loadProblemData();
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  const handleMessage = (event) => {
    if (event.data.type === "PROBLEM_DATA") {
      console.log("Sidebar received problem data via postMessage:", event.data.data);
      setProblemData(event.data.data);
      setIsLoadingContext(false);
      if (event.data.data && event.data.data.title) {
        setMessages([
          {
            type: "assistant",
            content: `Hi! I'm your LeetBuddy assistant. I can see you're working on "${event.data.data.title}". I can help you with hints, explanations, debugging, or any questions about this problem. What would you like to know?`
          }
        ]);
      }
    }
  };
  const loadProblemData = () => {
    setIsLoadingContext(true);
    if (chrome && chrome.runtime) {
      chrome.runtime.sendMessage({ type: "GET_PROBLEM_DATA" }, (response) => {
        console.log("Sidebar received response from background:", response);
        if (chrome.runtime.lastError) {
          console.error("Chrome runtime error:", chrome.runtime.lastError);
          setIsLoadingContext(false);
          return;
        }
        if (response && response.success && response.data && response.data.title) {
          setProblemData(response.data);
          setIsLoadingContext(false);
          setMessages([
            {
              type: "assistant",
              content: `Hi! I'm your LeetBuddy assistant. I can see you're working on "${response.data.title}". I can help you with hints, explanations, debugging, or any questions about this problem. What would you like to know?`
            }
          ]);
        } else {
          console.log("No valid problem data received:", response);
          setIsLoadingContext(false);
          setMessages([
            {
              type: "assistant",
              content: "Hi! I'm your LeetBuddy assistant. I'm having trouble reading the current problem. Please try refreshing the context or make sure you're on a LeetCode problem page."
            }
          ]);
        }
      });
    } else {
      console.error("Chrome runtime not available");
      setIsLoadingContext(false);
    }
  };
  reactExports.useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    var _a;
    (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  };
  const sendMessage = () => __async(this, null, function* () {
    if (!inputValue.trim() || isLoading)
      return;
    if (!apiKey) {
      alert("Please configure your OpenAI API key in the extension popup");
      return;
    }
    const userMessage = { type: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);
    try {
      const systemPrompt = problemData ? `You are LeetBuddy, an AI assistant helping with LeetCode problems. Current problem: "${problemData.title}" (${problemData.difficulty}). Description: ${problemData.description.substring(0, 500)}... Provide helpful hints, explanations, and guidance without giving away the complete solution. Keep responses concise and helpful.` : "You are LeetBuddy, an AI assistant for LeetCode problems. Help with hints, explanations, and debugging.";
      const messagesArray = [
        { role: "system", content: systemPrompt },
        ...messages.slice(-5).map((msg) => ({
          // Keep last 5 messages for context
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content
        })),
        { role: "user", content: currentInput }
      ];
      if (typeof window.chrome !== "undefined" && window.chrome.runtime) {
        window.chrome.runtime.sendMessage(
          {
            type: "OPENAI_REQUEST",
            data: { messages: messagesArray, apiKey }
          },
          (response) => {
            setIsLoading(false);
            if (window.chrome.runtime.lastError) {
              console.error("Chrome runtime error:", window.chrome.runtime.lastError);
              setMessages((prev) => [
                ...prev,
                {
                  type: "assistant",
                  content: "Sorry, I encountered a connection error. Please try again."
                }
              ]);
              return;
            }
            if (response && response.success) {
              setMessages((prev) => [
                ...prev,
                {
                  type: "assistant",
                  content: response.data
                }
              ]);
            } else {
              setMessages((prev) => [
                ...prev,
                {
                  type: "assistant",
                  content: `Sorry, I encountered an error: ${(response == null ? void 0 : response.error) || "Unknown error"}`
                }
              ]);
            }
          }
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "Sorry, I encountered an error processing your request."
        }
      ]);
    }
  });
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const closeSidebar = () => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "CLOSE_SIDEBAR" }, "*");
    }
  };
  const quickActions = [
    { icon: Lightbulb, text: "Give me a hint", action: () => setInputValue("Give me a hint for this problem") },
    { icon: Code, text: "Explain approach", action: () => setInputValue("What's the best approach to solve this?") },
    { icon: HelpCircle, text: "Time complexity", action: () => setInputValue("What's the time and space complexity?") }
  ];
  const reloadContext = () => {
    loadProblemData();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-white shadow-lg rounded-l-lg border-l-4 border-blue-600", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 bg-yellow-50 border-b border-yellow-200 text-xs text-yellow-900 font-mono overflow-x-auto max-h-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "DEBUG: problemData" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: reloadContext,
            className: "px-2 py-1 bg-yellow-200 text-yellow-900 rounded text-xs font-bold ml-2 flex items-center gap-1 hover:bg-yellow-300 transition-colors",
            disabled: isLoadingContext,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-3 h-3 ${isLoadingContext ? "animate-spin" : ""}` }),
              "Reload"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: "10px" }, children: isLoadingContext ? "Loading..." : JSON.stringify(problemData, null, 2) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-blue-600 bg-gradient-to-r from-blue-600 to-blue-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-7 h-7 text-white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-white text-lg tracking-wide", children: "LeetBuddy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: closeSidebar, className: "p-1 text-white hover:text-blue-100 rounded transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-blue-50 border-b border-blue-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-base text-blue-900 truncate", children: isLoadingContext ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse text-blue-400", children: "Loading problem..." }) : problemData ? problemData.title : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: "No problem data" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `px-2 py-1 text-xs rounded-full font-semibold ${(problemData == null ? void 0 : problemData.difficulty) === "Easy" ? "bg-green-100 text-green-800" : (problemData == null ? void 0 : problemData.difficulty) === "Medium" ? "bg-yellow-100 text-yellow-800" : (problemData == null ? void 0 : problemData.difficulty) === "Hard" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`,
            children: isLoadingContext ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", children: "..." }) : problemData ? problemData.difficulty : "Unknown"
          }
        ),
        ((problemData == null ? void 0 : problemData.tags) || []).slice(0, 2).map((tag, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-semibold", children: tag }, index))
      ] })
    ] }),
    isLoadingContext && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-700 font-medium text-lg", children: "Loading problem context..." })
    ] }),
    !isLoadingContext && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-blue-100 bg-blue-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-700 mb-2 font-semibold", children: "Quick actions:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: quickActions.map((action, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed",
          onClick: action.action,
          disabled: isLoading,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(action.icon, { className: "w-3 h-3" }),
            " ",
            action.text
          ]
        },
        index
      )) })
    ] }),
    !isLoadingContext && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 bg-white", children: [
      messages.length > 0 ? messages.map((msg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-lg px-4 py-2 max-w-xs whitespace-pre-wrap shadow text-sm ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`, children: msg.content }) }, idx)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-center mt-8", children: "Start a conversation to get help with this problem!" }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-100 rounded-lg px-4 py-2 shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-600 rounded-full animate-bounce" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-600 rounded-full animate-bounce", style: { animationDelay: "0.1s" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-600 rounded-full animate-bounce", style: { animationDelay: "0.2s" } })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
    ] }),
    !isLoadingContext && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t border-blue-100 bg-blue-50 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          className: "flex-1 border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 text-sm",
          placeholder: problemData ? "Type your question..." : "No problem context available",
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          onKeyDown: handleKeyPress,
          disabled: isLoading || !apiKey
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: sendMessage,
          className: "bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          disabled: isLoading || !inputValue.trim() || !apiKey,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
        }
      )
    ] })
  ] });
}
const container = document.getElementById("sidebar-root");
if (container) {
  const root = createRoot(container);
  root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}));
}
