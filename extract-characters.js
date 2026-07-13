const fs = require('fs');
const path = require('path');

const storiesDir = path.join(__dirname, 'src/data/stories');
const files = ['chapter1.ts', 'chapter2.ts', 'chapter3.ts'];

const speakers = new Set();
const characterIds = new Set();

files.forEach(file => {
  const content = fs.readFileSync(path.join(storiesDir, file), 'utf8');
  
  const speakerRegex = /speaker:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = speakerRegex.exec(content)) !== null) {
    speakers.add(match[1]);
  }
  
  const charIdRegex = /characterId:\s*['"]([^'"]+)['"]/g;
  while ((match = charIdRegex.exec(content)) !== null) {
    characterIds.add(match[1]);
  }
});

console.log(JSON.stringify({
  speakers: Array.from(speakers).sort(),
  characterIds: Array.from(characterIds).sort()
}, null, 2));
