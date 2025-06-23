import { build } from "vite"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function buildExtension() {
  try {
    console.log("Building LeetBuddy extension...")

    // Build the extension
    await build()

    // Copy CSS file to dist
    const srcCSS = path.join(process.cwd(), "src", "styles.css")
    const distCSS = path.join(process.cwd(), "dist", "content.css")

    if (fs.existsSync(srcCSS)) {
      fs.copyFileSync(srcCSS, distCSS)
      console.log("CSS file copied to dist/")
    }

    console.log("✅ Extension built successfully!")
    console.log("📁 Files in dist directory:")

    const distFiles = fs.readdirSync(path.join(process.cwd(), "dist"))
    distFiles.forEach((file) => {
      console.log(`   - ${file}`)
    })

    // Post-build script to fix HTML script references
    function fixHtmlScript(htmlPath, oldScript, newScript) {
      const fullPath = path.join(__dirname, htmlPath)
      if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8')
        const updated = content.replace(oldScript, newScript)
        if (content !== updated) {
          fs.writeFileSync(fullPath, updated, 'utf8')
          console.log(`✅ Fixed script reference in ${htmlPath}`)
        }
      }
    }

    fixHtmlScript('dist/popup.html', 'src="./popup.jsx"', 'src="./popup.js"')
    fixHtmlScript('dist/sidebar.html', 'src="./sidebar.jsx"', 'src="./sidebar.js"')

    // Inject sidebarjs.js script tag if not present
    const distSidebarHtml = path.join(__dirname, 'dist/sidebar.html')
    if (fs.existsSync(distSidebarHtml)) {
      let sidebarHtml = fs.readFileSync(distSidebarHtml, 'utf8')
      if (!sidebarHtml.includes('sidebarjs.js')) {
        sidebarHtml = sidebarHtml.replace('</body>', '    <script src="sidebarjs.js" type="module"></script>\n</body>')
        fs.writeFileSync(distSidebarHtml, sidebarHtml, 'utf8')
        console.log('✅ Injected sidebarjs.js script tag into dist/sidebar.html')
      }
    }
  } catch (error) {
    console.error("❌ Build failed:", error)
    process.exit(1)
  }
}

buildExtension()
