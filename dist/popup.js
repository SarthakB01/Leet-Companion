import { c as createLucideIcon$1, a as createRoot, j as jsxRuntimeExports, r as reactExports } from "./assets/createLucideIcon-64a3ef39.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const Key = createLucideIcon$1("Key", [
  ["circle", { cx: "7.5", cy: "15.5", r: "5.5", key: "yqb3hr" }],
  ["path", { d: "m21 2-9.6 9.6", key: "1j0ho8" }],
  ["path", { d: "m15.5 7.5 3 3L22 7l-3-3", key: "1rn1fs" }]
]);
const Settings = createLucideIcon$1("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Target = createLucideIcon$1("Target", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
]);
const TrendingUp = createLucideIcon$1("TrendingUp", [
  ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
  ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }]
]);
function Popup() {
  const [stats, setStats] = reactExports.useState({
    problemsSolvedToday: 0,
    recentTopics: [],
    suggestedTopic: "Arrays"
  });
  const [apiKey, setApiKey] = reactExports.useState("");
  const [showSettings, setShowSettings] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (typeof window.chrome !== "undefined" && window.chrome.storage) {
      window.chrome.storage.local.get(["stats", "openaiApiKey"], (result) => {
        if (result.stats) {
          setStats(result.stats);
        }
        if (result.openaiApiKey) {
          setApiKey(result.openaiApiKey);
          setShowSettings(!!result.openaiApiKey);
        } else {
          setShowSettings(true);
        }
      });
    }
  }, []);
  const saveApiKey = () => {
    if (typeof window.chrome !== "undefined" && window.chrome.storage) {
      window.chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
        alert("API key saved!");
        setShowSettings(false);
      });
    }
  };
  const openLeetCode = () => {
    if (typeof window.chrome !== "undefined" && window.chrome.tabs) {
      window.chrome.tabs.create({ url: "https://leetcode.com/problemset/" });
    }
  };
  if (!apiKey || showSettings) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-80 p-4 bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Settings" }),
        apiKey && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSettings(false), className: "text-gray-500 hover:text-gray-700", children: "×" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "inline w-4 h-4 mr-1" }),
            "Groq API Key"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              value: apiKey,
              onChange: (e) => setApiKey(e.target.value),
              placeholder: "sk-...",
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [
            "Get your free API key from ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://console.groq.com/keys", target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 underline", children: "Groq Console" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: saveApiKey,
            className: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors",
            children: "Save API Key"
          }
        )
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-80 p-4 bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: "LB" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-gray-800", children: "LeetBuddy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSettings(true), className: "p-1 text-gray-500 hover:text-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-50 p-3 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-green-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-green-800", children: "Today's Progress" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-green-600 mt-1", children: [
          stats.problemsSolvedToday,
          " problems solved"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 p-3 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-5 h-5 text-blue-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-blue-800", children: "Suggested Practice" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-blue-600 mt-1", children: stats.suggestedTopic })
      ] }),
      stats.recentTopics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-gray-700 mb-2", children: "Recent Topics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: stats.recentTopics.map((topic, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full", children: topic }, index)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: openLeetCode,
          className: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors",
          children: "Open LeetCode"
        }
      ),
      !apiKey && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-50 border border-yellow-200 p-3 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-yellow-800", children: "⚠️ Configure your OpenAI API key in settings to use the AI assistant" }) })
    ] })
  ] });
}
const container = document.getElementById("popup-root");
if (container) {
  const root = createRoot(container);
  root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(Popup, {}));
}
