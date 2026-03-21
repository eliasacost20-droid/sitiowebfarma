const fs = require('fs');
const lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');
lines.forEach((line, index) => {
  if (line.includes('ProductContext.Provider')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
