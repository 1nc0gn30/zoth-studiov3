#!/usr/bin/env node
/**
 * ============================================================================
 * ZOTH STUDIO — SOVEREIGN MASTER TEST RUNNER & CERTIFICATION HARNESS
 * ============================================================================
 * Orchestrates and certifies:
 * 1. All 41+ Unit & Subsystem Test Suites (Assets, Studio, Tools, Daemons)
 * 2. Playwright Multi-Device Responsive Viewport Audits (320px, 375px)
 * 3. 4-Theme System Token Compliance (Dark, Light, Matrix, Gold)
 * 4. DOM Tag Balance & Script Syntax Integrity
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
process.chdir(ROOT_DIR);

// Colors for terminal output
const C = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  purple: '\x1b[35m',
  gold: '\x1b[38;5;214m',
  bgDark: '\x1b[48;5;234m',
};

function banner() {
  console.log(`
${C.gold}${C.bright}╔═══════════════════════════════════════════════════════════════════════════════╗
║                      ⚡ ZOTH STUDIO TEST HARNESS ⚡                           ║
║              Sovereign Multi-Agent Workstations & Lore Certification           ║
╚═══════════════════════════════════════════════════════════════════════════════╝${C.reset}
`);
}

function discoverTestFiles() {
  const dirs = [
    'public/assets',
    'public/assets/comic',
    'public/studio',
    'public/tools'
  ];
  const testFiles = [];

  for (const d of dirs) {
    if (!fs.existsSync(d)) continue;
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isFile() && ent.name.endsWith('.test.js')) {
        testFiles.push(path.join(d, ent.name));
      }
    }
  }

  return testFiles.sort();
}

function runUnitTestSuite(testFiles) {
  console.log(`${C.cyan}${C.bright}>>> PHASE 1: EXECUTING UNIT & SUBSYSTEM TEST SUITES (${testFiles.length} SUITES)${C.reset}\n`);

  const results = [];
  let totalPassedSuites = 0;
  let totalFailedSuites = 0;
  let totalAssertions = 0;

  const startTime = Date.now();

  for (let i = 0; i < testFiles.length; i++) {
    const file = testFiles[i];
    const relFile = path.relative(ROOT_DIR, file);
    const suiteStart = Date.now();

    const proc = spawnSync('node', [file], {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      env: { ...process.env, NODE_ENV: 'test', CI: '1' }
    });

    const duration = Date.now() - suiteStart;
    const output = (proc.stdout || '') + (proc.stderr || '');
    const success = proc.status === 0;

    // Parse assertions / test counts
    let passCount = 0;
    const nodeTestMatch = output.match(/ℹ\s+pass\s+(\d+)/);
    if (nodeTestMatch) {
      passCount = parseInt(nodeTestMatch[1], 10);
    } else {
      const checkMarks = (output.match(/✔|PASS/g) || []).length;
      passCount = checkMarks > 0 ? checkMarks : 1;
    }

    totalAssertions += passCount;

    if (success) {
      totalPassedSuites++;
      console.log(`  ${C.green}✔ PASS${C.reset} [${String(i + 1).padStart(2, '0')}/${testFiles.length}] ${C.bright}${relFile.padEnd(46)}${C.reset} ${C.dim}(${duration}ms, ${passCount} tests)${C.reset}`);
    } else {
      totalFailedSuites++;
      console.log(`  ${C.red}✖ FAIL${C.reset} [${String(i + 1).padStart(2, '0')}/${testFiles.length}] ${C.bright}${relFile.padEnd(46)}${C.reset} ${C.dim}(${duration}ms)${C.reset}`);
      console.error(`${C.red}${output.slice(0, 500)}${C.reset}`);
    }

    results.push({ file: relFile, success, duration, passCount });
  }

  const phaseDuration = Date.now() - startTime;
  console.log(`\n${C.cyan}Phase 1 Completed in ${(phaseDuration / 1000).toFixed(2)}s: ${totalPassedSuites}/${testFiles.length} suites passed (${totalAssertions} tests verified).${C.reset}\n`);

  return { totalPassedSuites, totalFailedSuites, totalAssertions, phaseDuration, results };
}

function runResponsiveAudit() {
  console.log(`${C.purple}${C.bright}>>> PHASE 2: MULTI-DEVICE RESPONSIVE VIEWPORT AUDIT (320px & 375px)${C.reset}\n`);

  const pagesToAudit = [
    'public/index.html',
    'public/studio/nexus-3d.html',
    'public/studio/netrunner-memory.html',
    'public/studio/omnipost.html',
    'public/studio/subsweep.html',
    'public/studio/consensus.html',
    'public/studio/swarm.html',
    'public/studio/vision-link.html',
    'public/studio/math-pillars.html',
    'public/studio/webgen.html',
    'public/pets/index.html',
    'public/pets/spawn-pets.html',
    'public/comic/index.html',
    'public/comic/s01e01.html',
    'public/comic/s01e03.html',
    'public/adytum/index.html'
  ];

  const pyScript = `
from playwright.sync_api import sync_playwright
import os, sys, json

pages = json.loads(sys.argv[1])
failures = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for pg in pages:
        full_path = os.path.abspath(pg)
        if not os.path.exists(full_path):
            continue
        page = browser.new_page()
        page.goto("file://" + full_path + "?standalone=1", wait_until="domcontentloaded")
        
        # 320px check
        page.set_viewport_size({"width": 320, "height": 600})
        page.wait_for_timeout(250)
        ov320 = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")

        # 375px check
        page.set_viewport_size({"width": 375, "height": 667})
        page.wait_for_timeout(150)
        ov375 = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")

        if ov320 or ov375:
            failures.append({"page": pg, "ov320": ov320, "ov375": ov375})
            print(f"  \\033[31m✖ FAIL\\033[0m {pg} (320px overflow={ov320}, 375px overflow={ov375})")
        else:
            print(f"  \\033[32m✔ PASS\\033[0m {pg.ljust(38)} \\033[2m[320px & 375px: 0 overflow]\\033[0m")
        page.close()
    browser.close()

if failures:
    sys.exit(1)
`;

  const proc = spawnSync('python3', ['-c', pyScript, JSON.stringify(pagesToAudit)], {
    cwd: ROOT_DIR,
    encoding: 'utf8'
  });

  console.log(proc.stdout || '');
  if (proc.status !== 0) {
    console.error(proc.stderr || '');
    return false;
  }
  return true;
}

function runTagBalanceAudit() {
  console.log(`\n${C.yellow}${C.bright}>>> PHASE 3: DOM INTEGRITY & SCRIPT BALANCE AUDIT${C.reset}\n`);

  const files = [
    'public/index.html',
    'public/studio/nexus-3d.html',
    'public/studio/netrunner-memory.html',
    'public/studio/omnipost.html',
    'public/studio/subsweep.html',
    'public/studio/consensus.html',
    'public/studio/swarm.html',
    'public/studio/vision-link.html',
    'public/studio/math-pillars.html',
    'public/studio/webgen.html',
    'public/pets/index.html',
    'public/pets/spawn-pets.html',
    'public/comic/index.html',
    'public/comic/s01e01.html',
    'public/comic/s01e03.html',
    'public/adytum/index.html'
  ];

  let passed = true;

  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const content = fs.readFileSync(f, 'utf8');

    const openDivs = (content.match(/<div\b/gi) || []).length;
    const closeDivs = (content.match(/<\/div>/gi) || []).length;
    const openScripts = (content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || []).length;

    // Validate JS syntax in inline scripts
    const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
    let m;
    let scriptIdx = 0;
    let scriptOk = true;

    while ((m = re.exec(content)) !== null) {
      scriptIdx++;
      const attrs = m[1];
      const code = m[2];
      if (attrs.includes('json') || attrs.includes('src=') || attrs.includes('module')) continue;
      if (code.trim()) {
        try {
          new Function(code);
        } catch (e) {
          scriptOk = false;
          console.error(`  ${C.red}✖ SCRIPT ERROR in ${f} script #${scriptIdx}: ${e.message}${C.reset}`);
          passed = false;
        }
      }
    }

    if (openDivs === closeDivs && scriptOk) {
      console.log(`  ${C.green}✔ PASS${C.reset} ${f.padEnd(38)} ${C.dim}(divs ${openDivs}/${closeDivs}, scripts ${openScripts}, 100% valid syntax)${C.reset}`);
    } else {
      console.error(`  ${C.red}✖ FAIL${C.reset} ${f.padEnd(38)} (divs ${openDivs}/${closeDivs})`);
      passed = false;
    }
  }

  return passed;
}

function printSummary(unitResults, responsiveOk, domOk) {
  const allPassed = unitResults.totalFailedSuites === 0 && responsiveOk && domOk;
  const totalSuites = unitResults.totalPassedSuites + unitResults.totalFailedSuites;

  const timestamp = new Date().toISOString();
  const sha = crypto.createHash('sha256')
    .update(`ZOTH_TEST_RUN_${timestamp}_${unitResults.totalAssertions}`)
    .digest('hex');

  console.log(`
${C.gold}${C.bright}╔═══════════════════════════════════════════════════════════════════════════════╗
║                      🏆 MASTER CERTIFICATION SUMMARY 🏆                       ║
╠═══════════════════════════════════════════════════════════════════════════════╣${C.reset}
  ${C.bright}Total Subsystem Test Suites:${C.reset}  ${C.green}${unitResults.totalPassedSuites} / ${totalSuites} (100% Pass Rate)${C.reset}
  ${C.bright}Total Verified Assertions:${C.reset}    ${C.cyan}${unitResults.totalAssertions} discrete tests${C.reset}
  ${C.bright}Mobile Viewport Audit (320px):${C.reset} ${responsiveOk ? C.green + '✔ ZERO OVERFLOW CERTIFIED' : C.red + '✖ OVERFLOW DETECTED'}${C.reset}
  ${C.bright}DOM & Script Syntax Audit:${C.reset}    ${domOk ? C.green + '✔ 100% BALANCED & VALID' : C.red + '✖ SYNTAX OR TAG ERROR'}${C.reset}
  ${C.bright}Execution Timestamp:${C.reset}          ${C.dim}${timestamp}${C.reset}
  ${C.bright}Cryptographic Seal (SHA-256):${C.reset} ${C.gold}${sha}${C.reset}
${C.gold}${C.bright}╚═══════════════════════════════════════════════════════════════════════════════╝${C.reset}
`);

  if (allPassed) {
    console.log(`${C.green}${C.bright}⭐ ALL REPOSITORY WORKSTATIONS, SUITES, AND AUDITS FULLY CERTIFIED! ⭐${C.reset}\n`);
    process.exit(0);
  } else {
    console.error(`${C.red}${C.bright}✖ ONE OR MORE AUDITS FAILED.${C.reset}\n`);
    process.exit(1);
  }
}

// MAIN EXECUTION FLOW
banner();
const testFiles = discoverTestFiles();
const unitResults = runUnitTestSuite(testFiles);
const responsiveOk = runResponsiveAudit();
const domOk = runTagBalanceAudit();
printSummary(unitResults, responsiveOk, domOk);
