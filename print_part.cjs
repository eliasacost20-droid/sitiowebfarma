const fs = require('fs');
const lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');
console.log(lines.slice(540, 665).join('\n'));
