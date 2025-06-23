import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import fs from "fs"
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-content-css",
      buildStart() {
        // Ensure src directory exists
        const srcDir = resolve(__dirname, "src")
        if (!fs.existsSync(srcDir)) {
          fs.mkdirSync(srcDir, { recursive: true })
        }

        // Create content.css in src if it doesn't exist
        const contentCssPath = resolve(__dirname, "src/content.css")
        if (!fs.existsSync(contentCssPath)) {
          const cssContent = `/* LeetBuddy Extension Styles */
.leetbuddy-sidebar {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  width: 400px !important;
  height: 100vh !important;
  z-index: 10000 !important;
  background: white !important;
  border-left: 1px solid #e5e7eb !important;
  box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1) !important;
  transform: translateX(100%) !important;
  transition: transform 0.3s ease-in-out !important;
}

.leetbuddy-sidebar.open {
  transform: translateX(0) !important;
}

.leetbuddy-toggle {
  position: fixed !important;
  top: 50% !important;
  right: 20px !important;
  z-index: 10001 !important;
  background: #3b82f6 !important;
  color: white !important;
  border: none !important;
  border-radius: 50% !important;
  width: 56px !important;
  height: 56px !important;
  cursor: pointer !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s !important;
  font-size: 20px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.leetbuddy-toggle:hover {
  background: #2563eb !important;
  transform: scale(1.05) !important;
}

/* Basic utility classes */
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
.justify-start { justify-content: flex-start; }
.flex-col { flex-direction: column; }
.flex-1 { flex: 1 1 0%; }
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mt-1 { margin-top: 0.25rem; }
.w-4 { width: 1rem; }
.w-5 { width: 1.25rem; }
.w-6 { width: 1.5rem; }
.w-8 { width: 2rem; }
.w-full { width: 100%; }
.w-80 { width: 20rem; }
.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }
.h-6 { height: 1.5rem; }
.h-8 { height: 2rem; }
.h-full { height: 100%; }
.max-w-xs { max-width: 20rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.text-white { color: rgb(255 255 255); }
.text-gray-500 { color: rgb(107 114 128); }
.text-gray-600 { color: rgb(75 85 99); }
.text-gray-700 { color: rgb(55 65 81); }
.text-gray-800 { color: rgb(31 41 55); }
.text-blue-600 { color: rgb(37 99 235); }
.text-blue-800 { color: rgb(30 64 175); }
.text-green-600 { color: rgb(22 163 74); }
.text-green-800 { color: rgb(22 101 52); }
.text-yellow-800 { color: rgb(133 77 14); }
.text-red-800 { color: rgb(153 27 27); }
.bg-white { background-color: rgb(255 255 255); }
.bg-gray-50 { background-color: rgb(249 250 251); }
.bg-gray-100 { background-color: rgb(243 244 246); }
.bg-gray-200 { background-color: rgb(229 231 235); }
.bg-blue-50 { background-color: rgb(239 246 255); }
.bg-blue-100 { background-color: rgb(219 234 254); }
.bg-blue-600 { background-color: rgb(37 99 235); }
.bg-green-50 { background-color: rgb(240 253 244); }
.bg-green-100 { background-color: rgb(220 252 231); }
.bg-yellow-50 { background-color: rgb(254 252 232); }
.bg-yellow-100 { background-color: rgb(254 249 195); }
.bg-red-100 { background-color: rgb(254 226 226); }
.border { border-width: 1px; }
.border-b { border-bottom-width: 1px; }
.border-t { border-top-width: 1px; }
.border-gray-200 { border-color: rgb(229 231 235); }
.border-gray-300 { border-color: rgb(209 213 219); }
.border-yellow-200 { border-color: rgb(254 240 138); }
.rounded { border-radius: 0.25rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-full { border-radius: 9999px; }
.overflow-y-auto { overflow-y: auto; }
.resize-none { resize: none; }
.cursor-pointer { cursor: pointer; }
.hover\\:bg-gray-100:hover { background-color: rgb(243 244 246); }
.hover\\:bg-blue-700:hover { background-color: rgb(29 78 216); }
.hover\\:text-gray-700:hover { color: rgb(55 65 81); }
.focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.focus\\:ring-2:focus { box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5); }
.focus\\:ring-blue-500:focus { box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5); }
.disabled\\:opacity-50:disabled { opacity: 0.5; }
.disabled\\:cursor-not-allowed:disabled { cursor: not-allowed; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.whitespace-pre-wrap { white-space: pre-wrap; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }

@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}
.animate-bounce { animation: bounce 1s infinite; }
`
          fs.writeFileSync(contentCssPath, cssContent)
          console.log("✅ Created src/content.css")
        }
      },
      writeBundle() {
        // Copy content.css to dist after build
        const srcCss = resolve(__dirname, "src/content.css")
        const distCss = resolve(__dirname, "dist/content.css")

        if (fs.existsSync(srcCss)) {
          fs.copyFileSync(srcCss, distCss)
          console.log("✅ Copied content.css to dist/")
        }
      },
    },
    viteStaticCopy({
      targets: [
        { src: 'src/popup.html', dest: '.' },
        { src: 'src/sidebar.html', dest: '.' }
      ]
    })
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup.html"),
        sidebar: resolve(__dirname, "src/sidebar.html"),
        content: resolve(__dirname, "src/content.js"),
        background: resolve(__dirname, "src/background.js"),
        sidebarjs: resolve(__dirname, "src/sidebar.jsx")
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "[name][extname]",
      },
    },
    target: "es2015",
    minify: false,
  },
  define: {
    "process.env": {},
  },
})
