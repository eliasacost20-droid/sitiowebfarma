const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Line 891 (Big price in Product Details)
code = code.replace(
  '<span className="text-xl text-teal-500 font-bold align-top mr-1">Gs.</span>{product.price} <span className="text-sm font-bold text-slate-400 ml-2 bg-slate-100 px-2 py-1 rounded-xl">R$ {product.price_brl}</span>',
  '<span className="text-xl text-teal-500 font-bold align-top mr-1">Gs.</span>{product.price} <span className="text-slate-300 mx-3 font-normal">|</span> <span className="text-xl text-teal-500 font-bold align-top mr-1">R$</span>{product.price_brl}'
);

// 2. Line 941 (Related Products big price)
code = code.replace(
  '<span className="text-2xl font-black text-teal-600">Gs. {relProd.price}</span> <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">R$ {relProd.price_brl}</span>',
  '<span className="text-2xl font-black text-teal-600">Gs. {relProd.price}</span> <span className="text-slate-300 mx-2 text-xl font-normal">|</span> <span className="text-2xl font-black text-teal-600">R$ {relProd.price_brl}</span>'
);

// 3. Catalog cards (Lines 1039, 1292, 1433, 1967)
code = code.replace(
  /Gs\. \{product\.price\} <span className="text-\[10px\] bg-slate-100 text-slate-500 px-1\.5 py-0\.5 rounded-md ml-1 whitespace-nowrap">R\$ \{product\.price_brl\}<\/span>/g,
  'Gs. {product.price} <span className="text-slate-300 mx-1 font-normal">|</span> R$ {product.price_brl}'
);

fs.writeFileSync('src/App.jsx', code);
console.log('Price sizes matched!');
