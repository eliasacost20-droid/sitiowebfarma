const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. formData state
code = code.replace(
  /shipping_title: '', shipping_desc: ''/g,
  "shipping_title: '', shipping_desc: '', features: ''"
);

// 2. handleEdit mapping
code = code.replace(
  /shipping_title: prod\.shipping_title \|\| '', shipping_desc: prod\.shipping_desc \|\| '',/g,
  "shipping_title: prod.shipping_title || '', shipping_desc: prod.shipping_desc || '', features: Array.isArray(prod.features) ? prod.features.join(', ') : (prod.features || ''),"
);

// 3. Add to the Form before "Título de Envío"
const formRegex = /<div>\s*<label className=\"block text-sm font-bold text-slate-700 mb-1\">Título de Envío \(Opcional\)<\/label>/;
const newForm = `<div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Beneficios clave (Separados por coma)</label>
              <textarea name="features" value={formData.features} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: Refuerza defensas, Sin azúcar añadido, Hipoalergénico"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Título de Envío (Opcional)</label>`;
code = code.replace(formRegex, newForm);

// 4. Update the mapping rendering in Product Details.
// The array mapping was:
/*
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features?.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{t(feat)}</span>
                </li>
              ))}
            </ul>
*/
const renderRegex = /<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">\s*\{product\.features\?\.map\(\(feat, idx\) => \([\s\S]*?\}\s*<\/ul>/;
const newRender = `<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(typeof product.features === 'string' ? product.features.split(',').map(s => s.trim()).filter(s => s) : (Array.isArray(product.features) ? product.features : [])).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{t(feat)}</span>
                </li>
              ))}
            </ul>`;
code = code.replace(renderRegex, newRender);

fs.writeFileSync('src/App.jsx', code);
console.log('Benefits panel inserted!');
