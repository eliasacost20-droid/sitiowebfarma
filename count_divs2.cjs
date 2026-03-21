const fs = require('fs');
const lines = fs.readFileSync('admin_panel.jsx', 'utf8').split('\n');

let open = 0;
let close = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i] || '';
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  open += opens;
  close += closes;
}
console.log('Total opens:', open);
console.log('Total closes:', close);
console.log('Difference:', open - close);
