const fs = require('fs');
const parser = require('@babel/parser');

const code = fs.readFileSync('admin_panel.jsx', 'utf8');
try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log("No syntax errors found in AdminPanel!");
} catch (e) {
  console.log("Syntax Error at line", e.loc.line, "col", e.loc.column);
  console.log(e.message);
  
  const lines = code.split('\n');
  const start = Math.max(0, e.loc.line - 5);
  const end = Math.min(lines.length, e.loc.line + 5);
  for (let i = start; i < end; i++) {
    const prefix = (i + 1 === e.loc.line) ? '>>> ' : '    ';
    console.log(prefix + (i + 1) + ': ' + lines[i]);
  }
}
