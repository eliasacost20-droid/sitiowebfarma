const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Replace Total calculation
const totalCalcRegex = /const total = items\.reduce\(\(acc, item\) => \{[\s\S]*?\}, 0\);\s*const formattedTotal = total\.toLocaleString\('es-PY'\);/;
const newTotalCalc = `const totalGs = items.reduce((acc, item) => {
    if (!item.price) return acc;
    const priceNum = parseInt(item.price.replace(/\\./g, ''), 10) || 0;
    return acc + (priceNum * item.qty);
  }, 0);

  const totalBrl = items.reduce((acc, item) => {
    if (!item.price_brl) return acc;
    const priceBrl = parseFloat(item.price_brl.replace(/\\./g, '').replace(',', '.')) || 0;
    return acc + (priceBrl * item.qty);
  }, 0);

  const formattedTotalGs = totalGs.toLocaleString('es-PY');
  const formattedTotalBrl = totalBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });`;
code = code.replace(totalCalcRegex, newTotalCalc);

// 2. WhatsApp Cart Items
const wpItemsRegex = /items\.forEach\(item => \{\s*text \+= \`- \$\{item\.qty\} un\. de \$\{item\.name\} \(Gs\. \$\{item\.price\} c\/u\)%0A\`;\s*\}\);/;
const wpNewItems = `items.forEach(item => {
      let priceStr = [];
      if (item.price) priceStr.push("Gs. " + item.price);
      if (item.price_brl) priceStr.push("R$ " + item.price_brl);
      text += \`- \${item.qty} un. de \${item.name} (\${priceStr.join(' | ')} c/u)%0A\`;
    });`;
code = code.replace(wpItemsRegex, wpNewItems);

// 3. WhatsApp Total
const wpTotalRegex = /text \+= \`\*TOTAL A ABONAR: Gs\. \$\{formattedTotal\}\*%0A\`;/;
const wpNewTotal = `let totalStrs = [];
    if (totalGs > 0) totalStrs.push("Gs. " + formattedTotalGs);
    if (totalBrl > 0) totalStrs.push("R$ " + formattedTotalBrl);
    text += \`*TOTAL A ABONAR: \${totalStrs.join(' | ')}*%0A\`;`;
code = code.replace(wpTotalRegex, wpNewTotal);

// 4. Cart UI Items Price representation
const cartUIItemRegex = /<div className=\"font-black text-teal-600 text-xl whitespace-nowrap bg-teal-50 px-4 py-2 rounded-xl mt-2\">Gs\. \{item\.price\}<\/div>/;
const newCartUIItem = `<div className="font-black text-teal-600 text-xl whitespace-nowrap bg-teal-50 px-4 py-2 rounded-xl mt-2 grid text-right">
                        {item.price && <span>Gs. {item.price}</span>}
                        {item.price_brl && <span>R$ {item.price_brl}</span>}
                      </div>`;
code = code.replace(cartUIItemRegex, newCartUIItem);

// 5. Cart UI Total 
const cartTotalRegex = /<span className=\"text-4xl font-black text-teal-600 tracking-tight\">\s*<span className=\"text-2xl text-teal-500 font-bold align-top mr-1\">Gs\.<\/span>\{formattedTotal\}\s*<\/span>/;
const newCartTotal = `<span className="flex flex-col items-end text-3xl font-black text-teal-600 tracking-tight leading-none text-right">
                    {totalGs > 0 && <span><span className="text-xl text-teal-500 font-bold align-top mr-1">Gs.</span>{formattedTotalGs}</span>}
                    {totalBrl > 0 && <span className="text-xl mt-1"><span className="text-base text-teal-500 font-bold align-top mr-1">R$</span>{formattedTotalBrl}</span>}
                  </span>`;
code = code.replace(cartTotalRegex, newCartTotal);

fs.writeFileSync('src/App.jsx', code);
console.log('Cart fixed!');
