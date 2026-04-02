const fs = require('fs');
const s = fs.readFileSync('postman/EduPro.postman_collection.json','utf8');
let inStr = false, esc = false, depth = 0;
for (let i = 0; i < s.length; i++) {
  const c = s[i];
  if (inStr) {
    if (esc) esc = false;
    else if (c === '\\') esc = true;
    else if (c === '"') inStr = false;
    continue;
  }
  if (c === '"') { inStr = true; continue; }
  if (c === '{' || c === '[') depth++;
  else if (c === '}' || c === ']') {
    depth--;
    if (depth === 0) {
      const tail = s.slice(i + 1).trimStart().slice(0, 120);
      console.log('Depth hit 0 at index', i, 'line', s.slice(0, i + 1).split('\n').length);
      console.log('Next chars:', JSON.stringify(tail));
      break;
    }
  }
}
