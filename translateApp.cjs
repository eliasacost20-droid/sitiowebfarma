const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// Inject i18n import
if (!content.includes("useTranslation")) {
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useTranslation } from 'react-i18next';\nimport './i18n';");
}


// Replace Google Translate useEffect and Navbar changeLanguage
const i18nNavbarLangChange = `
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = i18n.language;

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };
`;

content = content.replace(/const \[langOpen, setLangOpen\][^]+?const searchResults = productsData\.filter/m, i18nNavbarLangChange + '\n  // Filter products based on search\n  const searchResults = productsData.filter');

// Remove the global useEffect for Google Translate from App
content = content.replace(/useEffect\(\(\) => \{\s*const addGoogleTranslate = \(\) => \{[^]+?\}\s*\}, \[\]\);/g, '');

// Clean the dummy #google_translate_element div from Navbar
content = content.replace(/\{\/\* Selector de idioma Custom \*\/\}\s*<div id="google_translate_element" style=\{\{ display: 'none' \}\}\><\/div>/g, '{/* Selector de idioma Custom */}');

const trMap = {
    '"Buscar medicamentos, vitaminas, cuidado personal..."': 't("Buscar_medicamentos")',
    '>No encontramos "': '>t("No_encontramos") + " \\""',
    '>Intentá con otra palabra o marca<': '>{t("Intenta_con")}<',
    '>Español<': '>{t("Espanol")}<',
    '>Português<': '>{t("Portugues")}<',
    '>Cuida tu salud con confianza<': '>{t("Cuida_tu_salud")}<',
    '>Hasta 30% de descuento en vitaminas y suplementos seleccionados. Envío gratis en tu primera compra.<': '>{t("Hasta_30")}<',
    '>Ver Ofertas<': '>{t("Ver_Ofertas")}<',
    '>Cuidado de la Piel Premium<': '>{t("Cuidado_Piel")}<',
    '>Descubre las mejores marcas dermatológicas para mantener tu piel radiante y saludable todo el año.<': '>{t("Descubre_marcas")}<',
    '>Descubrir Dermo<': '>{t("Descubrir_Dermo")}<',
    '>Oferta Especial ✨<': '>{t("Oferta_Especial")}<',
    '>Categorías Populares<': '>{t("Categorias_Populares")}<',
    '>Destacados del Mes<': '>{t("Destacados_Mes")}<',
    '>Los productos top que no te pueden faltar<': '>{t("Productos_top")}<',
    '"Precio"': 't("Precio")',
    '>¿Buscás algo más específico\?<': '>{t("Buscas_algo")}<',
    '>Contamos con más de 10,000 productos en stock. Filtrado por categorías para que encuentres rápidamente lo que necesitás.<': '>{t("Contamos_con")}<',
    '>Ver Catálogo Completo<': '>{t("Ver_Catalogo")}<',
    '>Volver a la tienda<': '>{t("Volver")}<',
    '>Beneficios clave:<': '>{t("Beneficios_clave")}<',
    '>Precio Final<': '>{t("Precio_Final")}<',
    '>Lo Quiero Ya<': '>{t("Lo_Quiero_Ya")}<',
    '>Envío Express Garantizado<': '>{t("Envio_Express")}<',
    '>Llega hoy si comprás antes de las 18:00 hs.<': '>{t("Llega_hoy")}<',
    '>Envío gratis<': '>{t("Envio_gratis")}<',
    '>en Gran Asunción.<': '>{t("en_Gran_Asuncion")}<',
    '>Clientes que vieron esto también compraron<': '>{t("Clientes_vieron")}<',
    '>Catálogo<': '>{t("Catalogo")}<',
    '>Stock y Variedad<': '>{t("Stock_Variedad")}<',
    '>No hay productos en esta categoría por ahora.<': '>{t("No_hay_productos")}<',
    '>Entrega Rápida<': '>{t("Entrega_Rapida")}<',
    '>"Entregas veloces en zona céntrica."': 't("Entregas_veloces")',
    '>Pagos Seguros<': '>{t("Pagos_Seguros")}<',
    '"Transacciones protegidas nivel banco."': 't("Transacciones")',
    '>Atención Farmacéutica<': '>{t("Atencion_Farmaceutica")}<',
    '"Farmacéuticos disponibles 24/7 para vos."': 't("Farmaceuticos_disponibles")',
    '>Privacidad<': '>{t("Privacidad")}<',
    '>Términos<': '>{t("Terminos")}<',
    '>Tu Carrito<': '>{t("Tu_Carrito")}<',
    "?'Tu Carrito' : 'Finalizar Pedido'": "? t('Tu_Carrito') : t('Finalizar_Pedido')",
    '>Finalizar Pedido<': '>{t("Finalizar_Pedido")}<',
    '>Tu carrito está vacío<': '>{t("Carrito_vacio")}<',
    '>Agregá unos cuantos productos para empezar.<': '>{t("Agrega_cuantos")}<',
    '>Nombre \*<': '>{t("Nombre")}<',
    '>Apellidos<': '>{t("Apellidos")}<',
    '>Teléfono \(WhatsApp\) \*<': '>{t("Telefono")}<',
    '>Ciudad \*<': '>{t("Ciudad")}<',
    '>Dirección exacta / Calle \*<': '>{t("Direccion")}<',
    '>Notas del pedido \(opcional\)<': '>{t("Notas")}<',
    '"Enviar ubicación exacta"': 't("Enviar_ubicacion")',
    '>Ubicación exacta adjunta al pedido.<': '>{t("Ubicacion_exacta")}<',
    '>Política de Privacidad<': '>{t("Politica_Privacidad")}<',
    '>Términos y Condiciones<': '>{t("Terminos_Condiciones")}<',
    '>Volver al Inicio<': '>{t("Volver_Inicio")}<',
    '>Mis Favoritos<': '>{t("Mis_Favoritos")}<',
    '>Tus productos guardados, listos para sumar al carrito.<': '>{t("Tus_productos")}<',
    '>Tu lista está vacía<': '>{t("Tu_lista_vacia")}<',
    '>Navegá por nuestro catálogo y tocá el corazoncito para guardar acá los productos que más te gustan.<': '>{t("Navega_por")}<',
    '>Explorar Catálogo<': '>{t("Explorar_Catalogo")}<'
};

for (const [key, value] of Object.entries(trMap)) {
    content = content.split(key).join(value);
}

// Update the translations in components by calling useTranslation at top level
const componentsToUpdate = [
    'function MainArea', 
    'function CatalogCTA', 
    'function Footer', 
    'function TrustFooter', 
    'function App', 
    'function HeroCarousel',
    'function PopularCategories',
    'function FeaturedProducts',
    'function ProductDetails',
    'function FullCatalog',
    'function CartModal',
    'function PrivacyPolicy',
    'function TermsAndConditions',
    'function FavoritesPage',
    'function ReviewsModal'
];

componentsToUpdate.forEach(comp => {
  if (content.includes(comp) && comp !== 'function Navbar') {
      content = content.replace(new RegExp(`(${comp}[^\\{]*?\\{)`), `$1\n  const { t } = useTranslation();`);
  }
});

// Category names and placeholders
content = content.replace(/placeholder="Buscar medicamentos, vitaminas, cuidado personal..."/g, 'placeholder={t("Buscar_medicamentos")}');

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.jsx translated successfully');
