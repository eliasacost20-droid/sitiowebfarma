const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// The replacement patterns
// Since JS doesn't easily support recursive regex without special tools, we can just replace everything from 'const initialProductsData = [' to the NEXT 'const initial' or 'export default' or 'const ProductContext'

code = code.replace(/const initialProductsData = \[[\s\S]*?\];/m, 'const initialProductsData = [];');
code = code.replace(/const initialSlidesData = \[[\s\S]*?\];/m, 'const initialSlidesData = [];');
code = code.replace(/const initialReviewsData = \[[\s\S]*?\];/m, 'const initialReviewsData = [];');

fs.writeFileSync('src/App.jsx', code);
console.log('Datos de ejemplo purgados correctamente.');
