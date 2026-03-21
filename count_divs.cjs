const fs = require('fs');
const lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');

let open = 0;
let close = 0;

for (let i = 545; i <= 766; i++) {
  const line = lines[i] || '';
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  open += opens;
  close += closes;
  
  if (opens !== closes && line.trim() !== '') {
    console.log(`L${i+1}: open +${opens} close +${closes} -> diff = ${open - close}. Line: ${line.trim()}`);
  }
}
console.log('Total opens:', open);
console.log('Total closes:', close);
console.log('Difference:', open - close);
