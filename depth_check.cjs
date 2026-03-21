const fs = require('fs');
const lines = fs.readFileSync('admin_panel.jsx', 'utf8').split('\n');

let depth = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i] || '';
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  depth += opens;
  depth -= closes;
  
  if (depth < 0) {
    console.log('Depth dropped below 0 at line:', i + 1, line);
    depth = 0; // reset to avoid cascading
  }
}
console.log('Final depth:', depth);
