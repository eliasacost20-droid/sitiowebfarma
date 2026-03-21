const fs = require('fs');
const lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');
const snippet = lines.slice(750, 780).join('\n');
fs.writeFileSync('snippet.json', JSON.stringify({ snippet }));
