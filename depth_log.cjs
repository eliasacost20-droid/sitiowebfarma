const fs = require('fs');
const lines = fs.readFileSync('admin_panel.jsx', 'utf8').split('\n');

let depth = 0;
for (let i = 129; i < lines.length; i++) {
  const line = lines[i] || '';
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  depth += opens;
  depth -= closes;
  console.log(`L${i+1} [D:${depth}]: ${line.trim()}`);
}
