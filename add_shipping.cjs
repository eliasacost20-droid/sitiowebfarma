const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add to formData state (initialization)
code = code.replace(
  /price_brl: '', image: '', badge: ''/g,
  "price_brl: '', image: '', badge: '', shipping_title: '', shipping_desc: ''"
);

// 2. Add to handleEdit mapping
code = code.replace(
  /price_brl: prod\.price_brl \|\| '',/g,
  "price_brl: prod.price_brl || '', shipping_title: prod.shipping_title || '', shipping_desc: prod.shipping_desc || '',"
);

// 3. Insert into the form before category
const formRegex = /<div>\s*<label className=\"block text-sm font-bold text-slate-700 mb-1\">Categoría<\/label>/;
const newForm = `<div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Título de Envío (Opcional)</label>
              <input name="shipping_title" value={formData.shipping_title} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: Envío Express Garantizado" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Detalle de Envío (Opcional)</label>
              <textarea name="shipping_desc" value={formData.shipping_desc} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: Llega hoy si compras antes de las 18:00hs."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Categoría</label>`;
code = code.replace(formRegex, newForm);

// 4. Update UI rendering (search for t('Envio_Express'))
code = code.replace(
  /<span className="font-bold text-slate-800 block mb-0\.5">\{t\('Envio_Express'\)\}<\/span>/g,
  `<span className="font-bold text-slate-800 block mb-0.5">{product.shipping_title || t('Envio_Express')}</span>`
);

code = code.replace(
  /<p className="text-sm text-slate-600 leading-relaxed">\{t\('Llega_hoy'\)\} <span className="font-bold text-blue-600">\{t\('Envio_gratis'\)\}<\/span> \{t\('en_Gran_Asuncion'\)\}<\/p>/g,
  `<p className="text-sm text-slate-600 leading-relaxed">
                          {product.shipping_desc ? (
                            product.shipping_desc
                          ) : (
                            <>{t('Llega_hoy')} <span className="font-bold text-blue-600">{t('Envio_gratis')}</span> {t('en_Gran_Asuncion')}</>
                          )}
                        </p>`
);

// If the regex failed because it was formatted differently, let me use a more robust regex or simple split.
fs.writeFileSync('src/App.jsx', code);
console.log('Done!');
