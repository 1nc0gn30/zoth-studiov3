const fs = require('fs');
const path = require('path');
const ComicAudioPlayer = require('../public/assets/comic/comic-audio-player.js');

console.log("\n🧪 Running Integration & Asset Verification for AZOTH Comic Audio Player...\n");

let pass = 0;
let fail = 0;

function check(desc, cond) {
  if (cond) {
    pass++;
    console.log(`\x1b[32m✔ PASS\x1b[0m: ${desc}`);
  } else {
    fail++;
    console.error(`\x1b[31m✘ FAIL\x1b[0m: ${desc}`);
  }
}

const coreAppDir = path.resolve(__dirname, '..');
const publicDir = path.join(coreAppDir, 'public');

// 1. Verify Audio Files on Disk
const db = ComicAudioPlayer.EPISODES_DB;
for (const [epId, epData] of Object.entries(db)) {
  for (const track of epData.tracks) {
    const audioPath = path.join(publicDir, track.src);
    const exists = fs.existsSync(audioPath);
    check(`Audio file exists for ${epId} ${track.panelLabel} (${track.src})`, exists);
    if (exists) {
      const stats = fs.statSync(audioPath);
      check(`Audio file not empty (${stats.size} bytes): ${track.src}`, stats.size > 1000);
    }
  }
}

// 2. Verify Comic Pages have Audio Player CSS and JS
const comicPages = [
  'index.html',
  's01e01.html',
  's01e02.html',
  's01e03.html',
  'characters.html',
  'soundboard.html',
  'timeline.html',
  'share.html'
];

comicPages.forEach(page => {
  const filePath = path.join(publicDir, 'comic', page);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    check(`${page} links comic-audio-player.css`, content.includes('comic-audio-player.css'));
    check(`${page} loads comic-audio-player.js`, content.includes('comic-audio-player.js'));
  }
});

console.log(`\n========================================================`);
console.log(`Asset & Page Verification: ${pass} passed, ${fail} failed.`);
console.log(`========================================================\n`);

process.exit(fail ? 1 : 0);
