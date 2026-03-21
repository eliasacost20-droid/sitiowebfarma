const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. formData state updates (we replace everything with price_brl)
code = code.replace(
  "name: '', brand: '', category: '', desc: '', price: '', image: '', badge: ''",
  "name: '', brand: '', category: '', desc: '', price: '', price_brl: '', image: '', badge: ''"
);

code = code.replace(
  "price: prod.price || '',",
  "price: prod.price || '', price_brl: prod.price_brl || '',"
);

// Add BRL handler
const formatPriceRegex = /  const formatPrice = \(val\) => \{([\s\S]*?)  \};/;
const formatPriceCode = `  const formatPrice = (val) => {
    if (!val) return '';
    let raw = String(val).replace(/\\D/g, '');
    if (!raw) return '';
    return parseInt(raw, 10).toLocaleString('de-DE'); // 1.000
  };

  const formatBrlPrice = (val) => {
    if (!val) return '';
    let raw = String(val).replace(/\\D/g, '');
    if (!raw) return '';
    const num = parseInt(raw, 10) / 100;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };`;
code = code.replace(formatPriceRegex, formatPriceCode);

// Add handleBrlPriceChange
const handlePriceChangeRegex = /  const handlePriceChange = \(e\) => \{([\s\S]*?)  \};/;
const handlePriceChangeCode = `  const handlePriceChange = (e) => {
    setFormData({ ...formData, price: formatPrice(e.target.value) });
  };

  const handleBrlPriceChange = (e) => {
    setFormData({ ...formData, price_brl: formatBrlPrice(e.target.value) });
  };`;
code = code.replace(handlePriceChangeRegex, handlePriceChangeCode);


// Replace the grid-cols-2 -> grid-cols-3 and add price_brl input
const gridRegex = /<div className="grid grid-cols-2 gap-4">\s*<div>\s*<label className="block text-sm font-bold text-slate-700 mb-1">Marca<\/label>/;
code = code.replace(gridRegex, `<div className="grid grid-cols-3 gap-4">\n              <div>\n                <label className="block text-sm font-bold text-slate-700 mb-1">Marca</label>`);

const priceGsRegex = /<div>\s*<label className="block text-sm font-bold text-slate-700 mb-1">Precio \(Gs\.\)<\/label>\s*<input required value=\{formData\.price\} onChange=\{handlePriceChange\} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2\.5 outline-none focus:border-teal-400 font-bold text-teal-600" placeholder="1\.000" \/>\s*<\/div>/;
const newPriceBlock = `<div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Precio (Gs.)</label>
                <input required value={formData.price} onChange={handlePriceChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400 font-bold text-teal-600" placeholder="1.000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Precio (R$ BRL)</label>
                <input required value={formData.price_brl} onChange={handleBrlPriceChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400 font-bold text-teal-600" placeholder="0,00" />
              </div>`;
code = code.replace(priceGsRegex, newPriceBlock);

// Display in UI (table)
code = code.replace(
  '<td className="p-4 font-black text-teal-600 whitespace-nowrap">Gs. {p.price}</td>',
  '<td className="p-4"><div className="font-black text-teal-600">Gs. {p.price}</div><div className="text-xs text-slate-400 font-bold">R$ {p.price_brl}</div></td>'
);

code = code.replace(
  /Gs\. \{product\.price\}/g,
  'Gs. {product.price} <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md ml-1 whitespace-nowrap">R$ {product.price_brl}</span>'
);

code = code.replace(
  /<span className="text-2xl font-black text-teal-600">Gs\. \{relProd\.price\}<\/span>/g,
  '<span className="text-2xl font-black text-teal-600">Gs. {relProd.price}</span> <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">R$ {relProd.price_brl}</span>'
);

code = code.replace(
  /<span className="text-xl text-teal-500 font-bold align-top mr-1">Gs\.<\/span>\{product\.price\}/g,
  '<span className="text-xl text-teal-500 font-bold align-top mr-1">Gs.</span>{product.price} <span className="text-sm font-bold text-slate-400 ml-2 bg-slate-100 px-2 py-1 rounded-xl">R$ {product.price_brl}</span>'
);

fs.writeFileSync('src/App.jsx', code);
console.log('BRL implemented!');
