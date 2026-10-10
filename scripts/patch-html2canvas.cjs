const fs = require('fs');

const files = [
  'node_modules/html2canvas/dist/html2canvas.js',
  'node_modules/html2canvas/dist/html2canvas.esm.js',
  'node_modules/html2canvas/dist/html2canvas.min.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let s = fs.readFileSync(f, 'utf8');
  const searchStr = 'Attempting to parse an unsupported color function';
  let count = 0;
  while (s.includes(searchStr)) {
    const idx = s.indexOf(searchStr);
    const startIdx = s.lastIndexOf('throw new Error', idx);
    const endIdx = s.indexOf(';', idx);
    if (startIdx !== -1 && endIdx !== -1) {
      s = s.substring(0, startIdx) + 'return 0' + s.substring(endIdx);
      count++;
    } else {
      break;
    }
  }
  if (count > 0) {
    fs.writeFileSync(f, s, 'utf8');
    console.log(`[patch-html2canvas] Successfully patched ${f} (${count} fixes)`);
  }
});
