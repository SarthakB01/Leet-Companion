import fs from "fs"
import path from "path"

const distDir = path.join(process.cwd(), "dist")

// Ensure content.css exists
const contentCssPath = path.join(distDir, "content.css")
if (!fs.existsSync(contentCssPath)) {
  const basicCss = `
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
`
  fs.writeFileSync(contentCssPath, basicCss)
  console.log("✅ Created content.css")
}

// Check all required files exist
const requiredFiles = ["background.js", "content.js", "content.css", "popup.html", "sidebar.html"]
const missingFiles = []

requiredFiles.forEach((file) => {
  const filePath = path.join(distDir, file)
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file)
  }
})

if (missingFiles.length > 0) {
  console.error("❌ Missing files:", missingFiles)
  process.exit(1)
} else {
  console.log("✅ All required files present")
}

console.log("📁 Files in dist directory:")
const distFiles = fs.readdirSync(distDir)
distFiles.forEach((file) => {
  console.log(`   - ${file}`)
})
