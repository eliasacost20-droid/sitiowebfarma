const fs = require('fs');
const lines = fs.readFileSync('admin_panel.jsx', 'utf8').split('\n');

let depth = 0;
let log = '';
for (let i = 125; i < lines.length; i++) {
  const line = lines[i] || '';
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  depth += opens;
  depth -= closes;
  log += `L${i+1} [D:${depth}]: ${line.trim()}\n`;
}
fs.writeFileSync('log.txt', log);
