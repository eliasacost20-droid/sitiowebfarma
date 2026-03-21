const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

const regex1 = /<h4 className="font-bold text-slate-800 text-sm">\{t\("Envio_Express"\)\}<\/h4>/;
const regex2 = /<p className="text-xs text-slate-600 mt-0.5 font-medium">Llega hoy si comprás antes de las 18:00 hs. <span className="font-bold text-blue-600">\{t\("Envio_gratis"\)\}<\/span> en Gran Asunción.<\/p>/;

code = code.replace(regex1, '<h4 className="font-bold text-slate-800 text-sm">{product.shipping_title || t("Envio_Express")}</h4>');
code = code.replace(regex2, '<p className="text-xs text-slate-600 mt-0.5 font-medium">{product.shipping_desc ? product.shipping_desc : <>Llega hoy si comprás antes de las 18:00 hs. <span className="font-bold text-blue-600">{t("Envio_gratis")}</span> en Gran Asunción.</>}</p>');

fs.writeFileSync('src/App.jsx', code);
console.log('Done!');
