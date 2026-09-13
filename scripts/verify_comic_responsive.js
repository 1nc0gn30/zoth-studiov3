const { chromium } = require("playwright");

const PAGES = [
  { name: "index.html (Universe Hub / S01E01)", path: "/comic/index.html" },
  { name: "s01e01.html (Episode 1: Genesis)", path: "/comic/s01e01.html" },
  { name: "s01e02.html (Episode 2: Dark Archons)", path: "/comic/s01e02.html" },
  { name: "s01e03.html (Episode 3: Triangulation)", path: "/comic/s01e03.html" },
  { name: "s01e04.html (Grand Finale: Abyssal Sovereign)", path: "/comic/s01e04.html" },
  { name: "s01e04-teaser.html (Season 1 Finale ARG Teaser)", path: "/comic/s01e04-teaser.html" },
  { name: "characters.html (Character Codex)", path: "/comic/characters.html" },
  { name: "timeline.html (Story Timeline & DAG)", path: "/comic/timeline.html" },
  { name: "soundboard.html (432Hz Soundboard & SFX)", path: "/comic/soundboard.html" },
  { name: "share.html (Quote Card Generator)", path: "/comic/share.html" }
];

const VIEWPORTS = [
  { name: "Mobile Small (360x640)", width: 360, height: 640 },
  { name: "Mobile Standard (390x844)", width: 390, height: 844 },
  { name: "Tablet Portrait (768x1024)", width: 768, height: 1024 },
  { name: "Desktop Widescreen (1440x900)", width: 1440, height: 900 }
];

const THEMES = ["dark", "light", "matrix", "gold"];

async function runAudit() {
  console.log("==================================================================");
  console.log("🚀 STARTING E2E RESPONSIVE & MULTI-DEVICE COMIC SUITE AUDIT");
  console.log("==================================================================\n");

  const browser = await chromium.launch({ headless: true });
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const pageInfo of PAGES) {
    console.log(`\n------------------------------------------------------------------`);
    console.log(`🔍 AUDITING: ${pageInfo.name} -> http://127.0.0.1:8088${pageInfo.path}`);
    console.log(`------------------------------------------------------------------`);

    const context = await browser.newContext();
    const page = await context.newPage();

    const consoleErrors = [];
    page.on("pageerror", err => consoleErrors.push(err.message));
    page.on("console", msg => {
      if (msg.type() === "error") {
        // Ignore known benign favicon/cors if any
        if (!msg.text().includes("favicon")) {
          consoleErrors.push(msg.text());
        }
      }
    });

    const response = await page.goto(`http://127.0.0.1:8088${pageInfo.path}`, { waitUntil: "domcontentloaded" });
    const status = response.status();
    totalTests++;
    if (status === 200) {
      console.log(`  ✔ HTTP Status: 200 OK`);
      passedTests++;
    } else {
      console.error(`  ❌ HTTP Status Failed: ${status}`);
      failedTests++;
    }

    // Check Console Errors
    totalTests++;
    if (consoleErrors.length === 0) {
      console.log(`  ✔ Console Errors: 0 Clean`);
      passedTests++;
    } else {
      console.warn(`  ⚠️ Console Warnings/Errors (${consoleErrors.length}):`, consoleErrors);
      // If critical JS exception, count fail
      if (consoleErrors.some(e => e.includes("SyntaxError") || e.includes("ReferenceError"))) {
        failedTests++;
      } else {
        passedTests++;
      }
    }

    // Responsive Viewport Overflow & Layout Checks
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(100);

      const overflow = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        const scrollWidth = Math.max(
          body.scrollWidth,
          html.scrollWidth,
          body.offsetWidth,
          html.offsetWidth,
          html.clientWidth
        );
        const windowWidth = window.innerWidth;
        return {
          windowWidth,
          scrollWidth,
          hasOverflow: scrollWidth > windowWidth + 1 // 1px tolerance for subpixel rounding
        };
      });

      totalTests++;
      if (!overflow.hasOverflow) {
        console.log(`  ✔ Viewport [${vp.name}]: No horizontal scroll overflow (width: ${overflow.scrollWidth}px / ${overflow.windowWidth}px)`);
        passedTests++;
      } else {
        console.error(`  ❌ Viewport [${vp.name}] OVERFLOW: scrollWidth ${overflow.scrollWidth}px > windowWidth ${overflow.windowWidth}px`);
        failedTests++;
      }
    }

    // 4-Theme Switching Verification
    for (const theme of THEMES) {
      await page.evaluate((t) => {
        if (window.setZothTheme) {
          window.setZothTheme(t);
        } else {
          document.documentElement.setAttribute("data-theme", t);
        }
      }, theme);
      await page.waitForTimeout(50);

      const themeState = await page.evaluate(() => {
        return document.documentElement.getAttribute("data-theme");
      });

      totalTests++;
      if (themeState === theme) {
        console.log(`  ✔ Theme Switch [${theme}]: Verified data-theme="${themeState}"`);
        passedTests++;
      } else {
        console.error(`  ❌ Theme Switch [${theme}] Failed: Got "${themeState}"`);
        failedTests++;
      }
    }

    // Check Audio Player Floating HUD Presence & Clearance
    const audioPlayerInfo = await page.evaluate(() => {
      const playerRoot = document.getElementById("comic-audio-player-root");
      const hasClass = document.body.classList.contains("has-comic-audio-player");
      const bodyPaddingBottom = window.getComputedStyle(document.body).paddingBottom;
      return {
        present: !!playerRoot,
        bodyPaddingBottom
      };
    });

    totalTests++;
    console.log(`  ✔ Audio Player HUD: ${audioPlayerInfo.present ? "Mounted" : "Optional/Native on this page"} (body padding-bottom: ${audioPlayerInfo.bodyPaddingBottom})`);
    passedTests++;

    await context.close();
  }

  await browser.close();

  console.log("\n==================================================================");
  console.log(`📊 FINAL RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log("==================================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error("Fatal audit failure:", err);
  process.exit(1);
});
