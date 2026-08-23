// Unit Tests for Zoth Studio Scroll Reading Progress & Reading Time Meter
const assert = require('assert');
const ReadingProgress = require('./site-opt-reading-progress.js');

console.log('⚡ Starting Scroll Reading Progress & Reading Time Meter Tests...\n');

// 1. Version & Structure Verification
assert.strictEqual(ReadingProgress.VERSION, '2.0.0', 'Must expose VERSION 2.0.0');
assert.ok(ReadingProgress.DEFAULTS, 'Must expose DEFAULTS');
assert.ok(ReadingProgress.THEMES, 'Must expose THEMES dictionary');
console.log('✅ Structure & Version verified.');

// 2. Theme Dictionary Validation
const themes = ['cyber-cyan', 'emerald-matrix', 'amber-fire', 'obsidian-gold', 'minimal'];
themes.forEach(t => {
  assert.ok(ReadingProgress.THEMES[t], `Theme ${t} must exist`);
  assert.ok(ReadingProgress.THEMES[t].gradient, `Theme ${t} must have gradient`);
  assert.ok(ReadingProgress.THEMES[t].accent, `Theme ${t} must have accent`);
  assert.ok(ReadingProgress.THEMES[t].bg, `Theme ${t} must have bg`);
  assert.ok(ReadingProgress.THEMES[t].border, `Theme ${t} must have border`);
});
console.log('✅ All 5 Themes verified.');

// 3. Content Extraction & Reading Time Calculations
const sampleProse = 'Artificial intelligence systems are rapidly evolving across multiple modalities. This comprehensive guide covers neural architectures, distributed training clusters, agentic coordination protocols, and hardware acceleration pipelines for next-generation sovereign AI platforms.';
const wordsInSample = sampleProse.split(/\s+/).length; // 29 words

const stats1 = ReadingProgress.calculateReadingTime(sampleProse);
assert.strictEqual(stats1.words, wordsInSample, 'Word count must match exactly');
assert.strictEqual(stats1.minutes, 1, 'Short text must round to at least 1 min');
assert.strictEqual(stats1.formattedTime, '1 min read');
assert.ok(stats1.badgeText.includes('1 min read'));
console.log(`✅ Basic prose stats validated (${stats1.words} words -> ${stats1.formattedTime}).`);

// 4. HTML Extraction with Code and Images
const sampleHtml = `
  <article>
    <h1>Neural Network Accelerators</h1>
    <p>Modern silicon backplanes leverage massive systolic arrays to accelerate tensor operations.</p>
    <img src="tensor-core.png" alt="Architecture" />
    <pre><code>
      import torch
      model = torch.nn.Linear(1024, 1024).cuda()
    </code></pre>
    <p>Benchmarking shows an 8x reduction in memory transfer latency when utilizing local HBM3 stacks.</p>
    <script>console.log("ignore me");</script>
  </article>
`;

const statsHtml = ReadingProgress.calculateReadingTime(sampleHtml, { wpm: 200, codeWpm: 100, imageSeconds: 12 });
assert.ok(statsHtml.words > 0, 'Must extract words from HTML');
assert.strictEqual(statsHtml.images, 1, 'Must count 1 image');
assert.ok(statsHtml.codeWords > 0, 'Must extract code words');
console.log(`✅ HTML + Image + Code block parsing verified (${statsHtml.words} words, ${statsHtml.images} images, ${statsHtml.minutes} min).`);

// 5. Long Content Multi-Minute Calculation
const longText = Array(1200).fill('sovereign').join(' '); // 1200 words @ 200 wpm = 6 mins
const statsLong = ReadingProgress.calculateReadingTime(longText, { wpm: 200 });
assert.strictEqual(statsLong.words, 1200);
assert.strictEqual(statsLong.minutes, 6);
assert.strictEqual(statsLong.formattedTime, '6 min read');
console.log(`✅ Long content multi-minute test passed (${statsLong.words} words -> ${statsLong.formattedTime}).`);

// 6. Scroll Progress Calculation
const mockContainer = {
  scrollTop: 500,
  scrollHeight: 1500,
  clientHeight: 500
};
// maxScroll = 1500 - 500 = 1000. scrollTop = 500 => 50%
const progress = ReadingProgress.calculateProgress(mockContainer, 6);
assert.strictEqual(progress.percent, 50, 'Progress must be 50%');
assert.strictEqual(progress.isComplete, false);
assert.strictEqual(progress.remainingMinutes, 3, '50% of 6 mins must be 3 mins remaining');
assert.strictEqual(progress.remainingText, '3 min left');
console.log(`✅ Progress math validated (50% progress -> ${progress.remainingText}).`);

// 7. Complete Progress Boundary
const completedContainer = {
  scrollTop: 1000,
  scrollHeight: 1500,
  clientHeight: 500
};
const progressComplete = ReadingProgress.calculateProgress(completedContainer, 6);
assert.strictEqual(progressComplete.percent, 100);
assert.strictEqual(progressComplete.isComplete, true);
assert.strictEqual(progressComplete.remainingMinutes, 0);
assert.strictEqual(progressComplete.remainingText, '🎉 Finished');
console.log('✅ Completion boundary conditions verified.');

// 8. Static HTML Widget Generator
const widget = ReadingProgress.generateHtmlWidget({ theme: 'emerald-matrix', barHeight: '4px' });
assert.ok(widget.includes('id="zoth-progress-bar"'), 'Must generate progress bar element');
assert.ok(widget.includes('linear-gradient(90deg, #10b981'), 'Must include theme gradient');
assert.ok(widget.includes('height:4px'), 'Must apply custom bar height');
console.log('✅ Standalone HTML Widget Generator verified.');

// 9. SSR / Headless Safety for DOM methods
const headlessInit = ReadingProgress.init();
assert.ok(headlessInit, 'Init must safely return controller object in Node/SSR environment');
assert.strictEqual(typeof headlessInit.destroy, 'function');
assert.strictEqual(typeof headlessInit.update, 'function');
console.log('✅ SSR / Headless safety verified.');

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY (100% Zero-Error Verification)!\n');
