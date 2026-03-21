const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Line 891 (Product Details)
const search1 = '<span className="text-xl text-teal-500 font-bold align-top mr-1">Gs.</span>{product.price} <span className="text-slate-300 mx-3 font-normal">|</span> <span className="text-xl text-teal-500 font-bold align-top mr-1">R$</span>{product.price_brl}';
const rep1 = `{product.price && <><span className="text-xl text-teal-500 font-bold align-top mr-1">Gs.</span>{product.price}</>}
                {product.price && product.price_brl && <span className="text-slate-300 mx-3 font-normal">|</span>}
                {product.price_brl && <><span className="text-xl text-teal-500 font-bold align-top mr-1">R$</span>{product.price_brl}</>}`;
code = code.replace(search1, rep1);

// 2. Line 941 (Related Products)
const search2 = '<span className="text-2xl font-black text-teal-600">Gs. {relProd.price}</span> <span className="text-slate-300 mx-2 text-xl font-normal">|</span> <span className="text-2xl font-black text-teal-600">R$ {relProd.price_brl}</span>';
const rep2 = `{relProd.price && <span className="text-2xl font-black text-teal-600">Gs. {relProd.price}</span>}
                  {relProd.price && relProd.price_brl && <span className="text-slate-300 mx-2 text-xl font-normal">|</span>}
                  {relProd.price_brl && <span className="text-2xl font-black text-teal-600">R$ {relProd.price_brl}</span>}`;
code = code.replace(search2, rep2);

// 3. Catalog cards
const search3 = 'Gs. {product.price} <span className="text-slate-300 mx-1 font-normal">|</span> R$ {product.price_brl}';
const rep3 = `{product.price ? \`Gs. \${product.price}\` : ''} 
                            {product.price && product.price_brl ? <span className="text-slate-300 mx-1 font-normal">|</span> : ''} 
                            {product.price_brl ? \`R$ \${product.price_brl}\` : ''}`;

code = code.replace(new RegExp(search3.replace(/[.*+?^$()|[\]\\]/g, '\\$&'), 'g'), rep3);

// Don't forget Admin Panel table representation 
// <div className="font-black text-teal-600">Gs. {p.price}</div><div className="text-xs text-slate-400 font-bold">R$ {p.price_brl}</div>
const search4 = '<div className="font-black text-teal-600">Gs. {p.price}</div><div className="text-xs text-slate-400 font-bold">R$ {p.price_brl}</div>';
const rep4 = `{p.price && <div className="font-black text-teal-600">Gs. {p.price}</div>} {p.price_brl && <div className="text-xs text-slate-400 font-bold">R$ {p.price_brl}</div>}`;
code = code.replace(search4, rep4);

fs.writeFileSync('src/App.jsx', code);
console.log('Conditional prices applied!');
