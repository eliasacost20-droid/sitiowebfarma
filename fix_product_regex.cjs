const fs = require('fs');

let appCode = fs.readFileSync('src/App.jsx', 'utf8');

// Use regex to catch product name with any whitespace before/after
appCode = appCode.replace(/>\s*\{product\.name\}\s*<\/h3>/g, '>{t(product.name)}</h3>');
appCode = appCode.replace(/>\s*\{product\.desc\}\s*<\/p>/g, '>{t(product.desc)}</p>');
appCode = appCode.replace(/>\s*\{product\.name\}\s*<\/h4>/g, '>{t(product.name)}</h4>');
appCode = appCode.replace(/>\s*\{item\.name\}\s*<\/h4>/g, '>{t(item.name)}</h4>');
appCode = appCode.replace(/\{\s*product\.badge\s*\}/g, '{t(product.badge)}');

fs.writeFileSync('src/App.jsx', appCode);
console.log('Regex replacements done');
