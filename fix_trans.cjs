const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const replacements = [
  // HeroCarousel
  ['title: "Cuida tu salud con confianza"', 'title: t("Cuida_tu_salud")'],
  ['subtitle: "Hasta 30% de descuento en vitaminas y suplementos seleccionados. Envío gratis en tu primera compra."', 'subtitle: t("Hasta_30")'],
  ['cta: "Ver Ofertas"', 'cta: t("Ver_Ofertas")'],
  ['title: "Cuidado de la Piel Premium"', 'title: t("Cuidado_Piel")'],
  ['subtitle: "Descubre las mejores marcas dermatológicas para mantener tu piel radiante y saludable todo el año."', 'subtitle: t("Descubre_marcas")'],
  ['cta: "Descubrir Dermo"', 'cta: t("Descubrir_Dermo")'],
  ['Oferta Especial ✨', '{t("Oferta_Especial")}'],

  // FeaturedProducts
  ['Destacados del Mes', '{t("Destacados_Mes")}'],
  ['<span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Precio</span>', '<span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t("Precio")}</span>'],
  
  // CatalogCTA
  ['¿Buscás algo más específico?', '{t("Buscas_algo")}'],
  ['Contamos con más de 10,000 productos en stock. Filtrado por categorías para que encuentres rápidamente lo que necesitás.', '{t("Contamos_con")}'],
  ['Ver Catálogo Completo', '{t("Ver_Catalogo")}'],

  // FullCatalog
  ['Catálogo\\n            </h1>', '{t("Catalogo")}\\n            </h1>'],
  ['{cat}', '{t(cat)}'],

  // TrustFooter
  ['title: "Entrega Rápida"', 'title: t("Entrega_Rapida")'],
  ['desc: "Entregas veloces en zona céntrica."', 'desc: t("Entregas_veloces")'],
  ['desc: t("Transacciones")', 'desc: t("Transacciones")'], // already there
  ['title: "Pagos Seguros"', 'title: t("Pagos_Seguros")'],
  ['title: "Atención Farmacéutica"', 'title: t("Atencion_Farmaceutica")'],

  // CartModal
  ["step === 'cart' ? 'Tu Carrito' : 'Finalizar Pedido'", "step === 'cart' ? t('Tu_Carrito') : t('Finalizar_Pedido')"],
  ['Total a pagar:', '{t("Total_pagar")}'],
  ['Enviar Pedido por WhatsApp', '{t("Enviar_Pedido")}'],

  // Roles in App (Navbar already replaced by the user\'s script? Let\'s check)
  // We'll leave the ones we don't know alone.

  // ProductDetails
  ['Clientes que vieron esto también compraron', '{t("Clientes_vieron")}'],
  ['Volver a la tienda', '{t("Volver")}'],
  ['Lo Quiero Ya', '{t("Lo_Quiero_Ya")}'],

  // Pages Back button
  ['Volver al Inicio', '{t("Volver_Inicio")}'],

  // Favorites
  ['Tu lista está vacía', '{t("Tu_lista_vacia")}'],
  ['Mis Favoritos', '{t("Mis_Favoritos")}'],
  ['Explorar Catálogo', '{t("Explorar_Catalogo")}']
];

for (const [src, dst] of replacements) {
    code = code.split(src).join(dst);
}

fs.writeFileSync('src/App.jsx', code);
console.log('Done translations');
