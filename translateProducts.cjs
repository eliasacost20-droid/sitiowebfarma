const fs = require('fs');

const ptTranslations = {
  // Nombres
  "Vitamina C 1000mg + Zinc": "Vitamina C 1000mg + Zinco",
  "Crema Hidratante Facial": "Creme Hidratante Facial",
  "Protector Solar FPS 50+": "Protetor Solar FPS 50+",
  "Colágeno Hidrolizado": "Colágeno Hidrolisado",
  "Jarabe Pediátrico para la Tos": "Xarope Pediátrico para Tosse",
  "Toallitas Húmedas para Bebé": "Lenços Umedecidos para Bebê",
  "Shampoo Anticaspa Clínico": "Shampoo Anticaspa Clínico",
  "Termómetro Digital de Oído": "Termômetro Digital de Ouvido",
  "Melatonina en Gomitas Relax": "Melatonina em Gomas Relax",
  "Cepillo Dental Ecológico de Bambú": "Escova Dental Ecológica de Bambu",

  // Descripciones
  "Refuerza tu sistema inmunológico. 30 comprimidos recubiertos.": "Fortalece seu sistema imunológico. 30 comprimidos revestidos.",
  "Hidratación profunda 24h para pieles sensibles y secas.": "Hidratação profunda 24h para peles sensíveis e secas.",
  "Toque seco, resistente al agua. Protección UVA/UVB.": "Toque seco, resistente à água. Proteção UVA/UVB.",
  "Polvo sabor frutos rojos. Mejora piel, cabello y articulaciones.": "Pó sabor frutas vermelhas. Melhora pele, cabelo e articulações.",
  "Alivio rápido de la tos y congestión en niños. Expectorante.": "Alívio rápido da tosse e congestão em crianças. Expectorante.",
  "100 unidades extra gruesas y suaves con Aloe Vera y Manzanilla.": "100 unidades extras grossas e macias com Aloe Vera e Camomila.",
  "Tratamiento intensivo contra caspa y picazón del cuero cabelludo.": "Tratamento intensivo contra caspa e coceira no couro cabeludo.",
  "Medición en 1 segundo. Pantalla retroiluminada para uso nocturno.": "Medição em 1 segundo. Tela iluminada para uso noturno.",
  "Suplemento para conciliar el sueño. Sabor mora azul. 60 gomitas.": "Suplemento para dormir melhor. Sabor mirtilo. 60 gomas.",
  "Cerdas suaves y mango 100% biodegradable. Pack familiar x4.": "Cerdas macias e cabo 100% biodegradável. Pack familiar x4.",

  // Features
  "Refuerza defensas": "Reforça defesas",
  "Apto para celíacos": "Apto para celíacos",
  "Sin azúcar añadido": "Sem açúcar",
  "Hipoalergénico": "Hipoalergênico",
  "Libre de parabenos": "Sem parabenos",
  "Textura ligera, no grasa": "Textura leve, não oleosa",
  "Resistente al agua y sudor": "Resistente à água e suor",
  "Toque seco": "Toque seco",
  "Dermatológicamente testeado": "Testado dermatologicamente",
  "Fácil disolución": "Fácil dissolução",
  "Sabor agradable": "Sabor agradável",
  "Alta pureza de origen alemán": "Alta pureza alemã",
  "Sabor cereza": "Sabor cereja",
  "No produce somnolencia": "Não dá sono",
  "Incluye vasito dosificador": "Inclui copinho dosador",
  "Hipoalergénicas": "Hipoalergênicos",
  "0% Alcohol": "0% Álcool",
  "Material extra resistente": "Material extra resistente",
  "Aprobado por dermatólogos": "Aprovado por dermatologistas",
  "Efecto visible en 7 días": "Efeito visível em 7 dias",
  "Para uso diario": "Para uso diário",
  "Resultados ultra rápidos": "Resultados ultra rápidos",
  "Alarma de fiebre": "Alarme de febre",
  "Memoria de 10 lecturas": "Memória de 10 leituras",
  "Fórmula de acción rápida": "Fórmula de ação rápida",
  "Sabor delicioso": "Sabor delicioso",
  "No genera dependencia": "Não causa dependência",
  "Cerdas infundidas con carbón": "Cerdas com carvão",
  "Mango de bambú Moso": "Cabo de bambu Moso",
  "Empaque reciclable": "Embalagem reciclável",

  // Badges
  "Más vendido": "Mais vendido",
  "Nuevo": "Novo",
  "-15%": "-15%",
  "Kids": "Infantil",
  "Promo": "Promo",
  "Eco": "Eco"
};

const esTranslations = {};
for (const key of Object.keys(ptTranslations)) {
  esTranslations[key] = key;
}

// 1. Update i18n.js
let i18nCode = fs.readFileSync('src/i18n.js', 'utf8');

// Insert ES
const esInsertStr = Object.entries(esTranslations).map(([k, v]) => `      ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n') + ',';
i18nCode = i18nCode.replace('translation: {', 'translation: {\n' + esInsertStr);

// Insert PT
const ptInsertStr = Object.entries(ptTranslations).map(([k, v]) => `      ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n') + ',';
i18nCode = i18nCode.replace('translation: {\\n      "Buscar_medicamentos"', 'translation: {\n' + ptInsertStr + '\n      "Buscar_medicamentos"'); 
// Wait, the above replace is fragile.
// Better way: parse JS or just regex.
i18nCode = i18nCode.replace(/pt: \{\s*translation: \{/, 'pt: {\n    translation: {\n' + ptInsertStr);

fs.writeFileSync('src/i18n.js', i18nCode);

// 2. Update App.jsx
let appCode = fs.readFileSync('src/App.jsx', 'utf8');

const jsxReplacements = [
  // ProductDetails
  ['{product.name}</h1>', '{t(product.name)}</h1>'],
  ['{product.desc}</p>', '{t(product.desc)}</p>'],
  ['{product.badge}</span>', '{t(product.badge)}</span>'],
  ['{feat}</span>', '{t(feat)}</span>'],

  // FeaturedProducts / FullCatalog / Favorites / Navbar
  ['{product.name}</h3>', '{t(product.name)}</h3>'],
  ['{product.desc}</p>', '{t(product.desc)}</p>'],
  ['{product.name}</h4>', '{t(product.name)}</h4>'],
  
  // Cart
  ['{item.name}</h4>', '{t(item.name)}</h4>'],
  
  // Badges
  ['{product.badge}\\n                </span>', '{t(product.badge)}\\n                </span>'],
  ['{product.badge}\\n                </span', '{t(product.badge)}\\n                </span']
];

for (const [src, dst] of jsxReplacements) {
  appCode = appCode.split(src).join(dst);
}

// The related products in ProductDetails doesn't have its own t()?
appCode = appCode.split('{relProd.name}</h3>').join('{t(relProd.name)}</h3>');

fs.writeFileSync('src/App.jsx', appCode);
console.log('Product translations injected successfully');
