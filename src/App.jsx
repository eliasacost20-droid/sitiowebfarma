import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  Pill, 
  HeartPulse, 
  Baby, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Stethoscope,
  Menu,
  ArrowRight,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle2,
  Star,
  X,
  Trash2
} from 'lucide-react';

const productsData = [
  {
    id: 1,
    name: "Vitamina C 1000mg + Zinc",
    brand: "NutriLife",
    desc: "Refuerza tu sistema inmunológico. 30 comprimidos recubiertos.",
    price: "45.000",
    image: "/vitamina.png",
    badge: "Más vendido",
    category: "Vitaminas",
    rating: 4.8,
    reviews: 124,
    features: ["Refuerza defensas", "Apto para celíacos", "Sin azúcar añadido"]
  },
  {
    id: 2,
    name: "Crema Hidratante Facial",
    brand: "DermoPure",
    desc: "Hidratación profunda 24h para pieles sensibles y secas.",
    price: "125.000",
    image: "/crema.png",
    badge: "-15%",
    category: "Dermocosmética",
    rating: 4.9,
    reviews: 89,
    features: ["Hipoalergénico", "Libre de parabenos", "Textura ligera, no grasa"]
  },
  {
    id: 3,
    name: "Protector Solar FPS 50+",
    brand: "SunShield",
    desc: "Toque seco, resistente al agua. Protección UVA/UVB.",
    price: "85.500",
    image: "/protector.png",
    badge: null,
    category: "Dermocosmética",
    rating: 4.7,
    reviews: 210,
    features: ["Resistente al agua y sudor", "Toque seco", "Dermatológicamente testeado"]
  },
  {
    id: 4,
    name: "Colágeno Hidrolizado",
    brand: "BioHealth",
    desc: "Polvo sabor frutos rojos. Mejora piel, cabello y articulaciones.",
    price: "150.000",
    image: "/colageno.png",
    badge: "Nuevo",
    category: "Vitaminas",
    rating: 4.6,
    reviews: 45,
    features: ["Fácil disolución", "Sabor agradable", "Alta pureza de origen alemán"]
  },
  {
    id: 5,
    name: "Jarabe Pediátrico para la Tos",
    brand: "PediatriCare",
    desc: "Alivio rápido de la tos y congestión en niños. Expectorante.",
    price: "35.000",
    image: "/jarabe_ninos.png",
    badge: "Kids",
    category: "Primeros Auxilios",
    rating: 4.8,
    reviews: 56,
    features: ["Sabor cereza", "No produce somnolencia", "Incluye vasito dosificador"]
  },
  {
    id: 6,
    name: "Toallitas Húmedas para Bebé",
    brand: "BabySoft",
    desc: "100 unidades extra gruesas y suaves con Aloe Vera y Manzanilla.",
    price: "18.500",
    image: "/toallitas_bebe.png",
    badge: "Promo",
    category: "Mamá y Bebé",
    rating: 4.9,
    reviews: 320,
    features: ["Hipoalergénicas", "0% Alcohol", "Material extra resistente"]
  },
  {
    id: 7,
    name: "Shampoo Anticaspa Clínico",
    brand: "DermoPure",
    desc: "Tratamiento intensivo contra caspa y picazón del cuero cabelludo.",
    price: "72.000",
    image: "/shampoo_caspa.png",
    badge: null,
    category: "Cuidado Personal",
    rating: 4.5,
    reviews: 92,
    features: ["Aprobado por dermatólogos", "Efecto visible en 7 días", "Para uso diario"]
  },
  {
    id: 8,
    name: "Termómetro Digital de Oído",
    brand: "MediTech",
    desc: "Medición en 1 segundo. Pantalla retroiluminada para uso nocturno.",
    price: "180.000",
    image: "/termometro_digital.png",
    badge: null,
    category: "Primeros Auxilios",
    rating: 4.7,
    reviews: 110,
    features: ["Resultados ultra rápidos", "Alarma de fiebre", "Memoria de 10 lecturas"]
  },
  {
    id: 9,
    name: "Melatonina en Gomitas Relax",
    brand: "SleepWell",
    desc: "Suplemento para conciliar el sueño. Sabor mora azul. 60 gomitas.",
    price: "85.000",
    image: "/melatonina_gomas.png",
    badge: "Nuevo",
    category: "Vitaminas",
    rating: 4.8,
    reviews: 245,
    features: ["Fórmula de acción rápida", "Sabor delicioso", "No genera dependencia"]
  },
  {
    id: 10,
    name: "Cepillo Dental Ecológico de Bambú",
    brand: "EcoHealth",
    desc: "Cerdas suaves y mango 100% biodegradable. Pack familiar x4.",
    price: "32.000",
    image: "/cepillo_bambu.png",
    badge: "Eco",
    category: "Cuidado Personal",
    rating: 4.6,
    reviews: 78,
    features: ["Cerdas infundidas con carbón", "Mango de bambú Moso", "Empaque reciclable"]
  }
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [activePage, setActivePage] = useState('home'); // 'home' | 'privacy' | 'terms' | 'catalog' | 'favorites'
  const [isBouncing, setIsBouncing] = useState(false);

  const goHome = () => {
    setActivePage('home');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (product, e) => {
    if (e) e.stopPropagation();
    setFavoriteItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      return exists ? prev.filter(item => item.id !== product.id) : [...prev, product];
    });
  };

  const handleSelectProduct = (product) => {
    setActivePage('home');
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 400);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-teal-200 selection:text-teal-900 flex flex-col">
      <Navbar 
        onSelectProduct={handleSelectProduct} 
        cartCount={cartItems.length} 
        favoritesCount={favoriteItems.length}
        onOpenCart={() => setCartOpen(true)} 
        onOpenFavorites={() => { setActivePage('favorites'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth'}); }}
        onGoHome={goHome} 
        isBouncing={isBouncing} 
      />
      
      <div className="flex-1">
        {activePage === 'privacy' ? (
          <PrivacyPolicy onBack={goHome} />
        ) : activePage === 'terms' ? (
          <TermsAndConditions onBack={goHome} />
        ) : activePage === 'favorites' ? (
          <FavoritesPage 
            items={favoriteItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={addToCart}
            onRemove={toggleFavorite}
            onBack={goHome}
          />
        ) : activePage === 'catalog' ? (
          <FullCatalog 
            onSelectProduct={handleSelectProduct} 
            onAddToCart={addToCart} 
            onBack={goHome} 
            favoriteItems={favoriteItems}
            onToggleFavorite={toggleFavorite}
          />
        ) : selectedProduct ? (
          <ProductDetails 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
            onSelectRelated={(p) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setSelectedProduct(p);
            }}
            onAddToCart={addToCart}
            isFavorite={favoriteItems.some(item => item.id === selectedProduct.id)}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 animate-in fade-in duration-500">
            <HeroCarousel />
            <PopularCategories />
            <FeaturedProducts 
              onSelectProduct={handleSelectProduct} 
              onAddToCart={addToCart} 
              favoriteItems={favoriteItems}
              onToggleFavorite={toggleFavorite}
            />
            <CatalogCTA onOpenCatalog={() => { setActivePage('catalog'); window.scrollTo({ top: 0, behavior: 'smooth'}); }} />
          </main>
        )}
      </div>

      <TrustFooter 
        onOpenPrivacy={() => { setActivePage('privacy'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth'}); }} 
        onOpenTerms={() => { setActivePage('terms'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth'}); }} 
      />

      {cartOpen && (
        <CartModal items={cartItems} onClose={() => setCartOpen(false)} onRemoveItem={removeFromCart} />
      )}
    </div>
  );
}

function ProductDetails({ product, onBack, onSelectRelated, onAddToCart }) {
  // Productos relacionados excluyendo el actual
  const related = productsData.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in slide-in-from-bottom-8 fade-in duration-500">
      {/* Botón Volver */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold mb-8 transition-colors bg-white/50 hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a la tienda
      </button>

      {/* Hero del Producto tipo UI moderna */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 md:gap-12">
        
        {/* Foto Grande */}
        <div className="w-full md:w-2/5 relative group">
          <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 relative">
            {product.badge && (
              <span className="absolute top-4 left-4 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl z-10 shadow-lg shadow-teal-500/30">
                {product.badge}
              </span>
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <button 
            onClick={() => onToggleFavorite(product)}
            className={`absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full hover:shadow-xl transition-all active:scale-95 z-10 ${isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500'}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Info del Producto */}
        <div className="w-full md:w-3/5 flex flex-col pt-2 sm:pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-lg border border-teal-100 cursor-pointer hover:bg-teal-100 transition-colors">
              {product.brand}
            </span>
            <button className="text-slate-400 hover:text-teal-600 transition-colors bg-slate-50 p-2 rounded-full hover:bg-teal-50">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 leading-[1.1] mb-4 tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6 bg-amber-50/50 w-fit px-3 py-1.5 rounded-xl border border-amber-100">
            <div className="flex items-center gap-1 text-amber-500 cursor-pointer hover:scale-105 transition-transform">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current opacity-50" />
              <span className="font-bold text-slate-700 ml-2 text-sm">{product.rating}</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 hover:text-teal-600 font-medium cursor-pointer transition-colors">
              Leer {product.reviews} reseñas
            </span>
          </div>

          <p className="text-base text-slate-500 mb-6 leading-relaxed font-medium">
            {product.desc}
          </p>

          {/* Características */}
          <div className="mb-6 space-y-3">
            <h3 className="font-bold text-slate-800 text-base">Beneficios clave:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features?.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-50">
            <div className="flex flex-col w-full sm:w-auto min-w-[140px]">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Precio Final</span>
              <span className="text-4xl font-black text-teal-600 tracking-tight">
                <span className="text-xl text-teal-500 font-bold align-top mr-1">Gs.</span>{product.price}
              </span>
            </div>
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full sm:flex-1 bg-gradient-to-r from-teal-600 to-teal-500 hover:to-teal-400 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Lo Quiero Ya
            </button>
          </div>

          {/* Entrega Info */}
          <div className="mt-6 bg-blue-50/50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
            <div className="bg-blue-100 p-1.5 rounded-lg shrink-0">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Envío Express Garantizado</h4>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">Llega hoy si comprás antes de las 18:00 hs. <span className="font-bold text-blue-600">Envío gratis</span> en Gran Asunción.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Relacionados */}
      <div className="mt-24 mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-400" />
          Clientes que vieron esto también compraron
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((relProd) => (
            <div 
              key={relProd.id}
              onClick={() => onSelectRelated(relProd)}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[4/3] bg-slate-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
                <img 
                  src={relProd.image} 
                  alt={relProd.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{relProd.brand}</span>
                <h3 className="text-xl font-bold text-slate-800 leading-tight mb-3 line-clamp-2">{relProd.name}</h3>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-2xl font-black text-teal-600">Gs. {relProd.price}</span>
                  <div className="bg-teal-50 text-teal-600 p-3 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// --- Componentes Anteriores ---

function Navbar({ onSelectProduct, cartCount, favoritesCount, onOpenCart, onOpenFavorites, onGoHome, isBouncing }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Filter products based on search
  const searchResults = productsData.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (product) => {
    setSearchQuery('');
    setShowResults(false);
    if (onSelectProduct) {
      onSelectProduct(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onGoHome}>
          <div className="bg-teal-100 p-2 rounded-xl group-hover:bg-teal-200 transition-colors">
            <HeartPulse className="w-8 h-8 text-teal-600" />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-teal-500 tracking-tight">
            FarmaVida
          </span>
        </div>

        {/* Barra de Búsqueda */}
        <div className="hidden md:flex flex-1 max-w-2xl relative group">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Buscar medicamentos, vitaminas, cuidado personal..." 
            className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-100/50 rounded-2xl py-3 pl-12 pr-6 text-slate-700 placeholder-slate-400 transition-all duration-300 outline-none shadow-sm group-hover:shadow-md font-medium"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-teal-500 transition-colors" />
          
          {/* Dropdown de resultados */}
          {showResults && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {searchResults.length > 0 ? (
                <ul className="max-h-[400px] overflow-y-auto p-3 space-y-1">
                  {searchResults.map((product) => (
                    <li 
                      key={product.id}
                      onClick={() => handleSelect(product)}
                      className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group/item border border-transparent hover:border-slate-100"
                    >
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl shadow-sm group-hover/item:scale-105 transition-transform bg-slate-100" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black text-teal-600 mb-0.5 uppercase tracking-widest">{product.brand}</div>
                        <h4 className="font-bold text-slate-800 text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{product.desc}</p>
                      </div>
                      <div className="font-black text-teal-600 whitespace-nowrap bg-teal-50 px-3 py-1.5 rounded-xl">
                        Gs. {product.price}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center flex flex-col items-center gap-3">
                  <div className="bg-slate-50 p-3 rounded-full">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No encontramos "{searchQuery}"</p>
                  <p className="text-xs text-slate-400">Intentá con otra palabra o marca</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors">
            <Search className="w-6 h-6" />
          </button>
          
          <button 
            onClick={onOpenFavorites}
            className="relative p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all flex items-center gap-2 border border-rose-100/50 shadow-sm hover:shadow active:scale-95"
            title="Ver Favoritos"
          >
            <Heart className="w-6 h-6" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm transition-all duration-300 bg-rose-500">
                {favoritesCount}
              </span>
            )}
          </button>

          <button 
            onClick={onOpenCart}
            className={`relative p-3 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl transition-all flex items-center gap-2 border border-teal-100/50 ${isBouncing ? 'animate-bounce scale-110 shadow-lg ring-4 ring-teal-100' : 'shadow-sm hover:shadow active:scale-95'}`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm transition-all duration-300 ${isBouncing ? 'bg-teal-500 scale-125' : 'bg-rose-500'}`}>
                {cartCount}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroCarousel() {
  const slides = [
    {
      title: "Cuida tu salud con confianza",
      subtitle: "Hasta 30% de descuento en vitaminas y suplementos seleccionados. Envío gratis en tu primera compra.",
      cta: "Ver Ofertas",
      bgImg: "https://images.unsplash.com/photo-1584308666744-24d5e478dc05?auto=format&fit=crop&q=80&w=2000",
      color: "from-teal-900/90 to-teal-800/40"
    },
    {
      title: "Cuidado de la Piel Premium",
      subtitle: "Descubre las mejores marcas dermatológicas para mantener tu piel radiante y saludable todo el año.",
      cta: "Descubrir Dermo",
      bgImg: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=2000",
      color: "from-blue-900/90 to-blue-800/40"
    }
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[280px] sm:h-[360px] rounded-3xl overflow-hidden shadow-xl group">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative flex items-center">
            {/* Imagen de fondo con overlay degradado */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bgImg})` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply`} />
            
            {/* Contenido */}
            <div className="relative z-10 px-8 sm:px-16 md:px-24 max-w-3xl">
              <span className="inline-block py-1 px-3 rounded-xl bg-white/20 text-white backdrop-blur-md text-xs sm:text-sm font-bold mb-3 border border-white/30 shadow-lg">
                Oferta Especial ✨
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 leading-[1.1] shadow-sm tracking-tight drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-lg text-slate-50 mb-6 max-w-xl opacity-90 font-medium drop-shadow line-clamp-2">
                {slide.subtitle}
              </p>
              <button className="bg-white text-teal-800 hover:bg-slate-50 hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-2xl flex items-center gap-2 active:scale-95">
                {slide.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Controles Radix-like (Arrows & Dots) */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-slate-800 p-4 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-white/30 hover:shadow-2xl"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-slate-800 p-4 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-white/30 hover:shadow-2xl"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-500 rounded-full h-2.5 shadow-lg ${
              current === index ? 'w-10 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function PopularCategories() {
  const categories = [
    { name: "Cuidado Personal", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-100", border: "hover:border-purple-200" },
    { name: "Vitaminas", icon: Pill, color: "text-amber-500", bg: "bg-amber-100", border: "hover:border-amber-200" },
    { name: "Mamá y Bebé", icon: Baby, color: "text-rose-500", bg: "bg-rose-100", border: "hover:border-rose-200" },
    { name: "Dermocosmética", icon: HeartPulse, color: "text-pink-500", bg: "bg-pink-100", border: "hover:border-pink-200" },
    { name: "Primeros Auxilios", icon: ShieldCheck, color: "text-teal-600", bg: "bg-teal-100", border: "hover:border-teal-200" },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Categorías Populares</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat, idx) => (
          <div 
            key={idx}
            className={`bg-white rounded-3xl p-6 flex flex-col items-center justify-center gap-4 border-2 border-transparent shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${cat.border} group`}
          >
            <div className={`p-4 rounded-2xl ${cat.bg} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
              <cat.icon className={`w-8 h-8 ${cat.color}`} />
            </div>
            <span className="font-bold text-slate-700 text-center group-hover:text-slate-900 transition-colors">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts({ onSelectProduct, onAddToCart }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Destacados del Mes
            <span className="relative flex h-3 w-3 -mt-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium text-lg">Los productos top que no te pueden faltar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productsData.map((product) => (
          <div 
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-2 transition-all duration-300 group flex flex-col cursor-pointer"
          >
            {/* Imagen del producto */}
            <div className="relative aspect-[4/3] bg-slate-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
              {product.badge && (
                <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl z-10 shadow-md">
                  {product.badge}
                </span>
              )}
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Info del producto */}
            <div className="flex-1 flex flex-col">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                {product.brand}
              </span>
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium">
                {product.desc}
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Precio</span>
                  <span className="text-2xl font-black text-teal-600">
                    Gs. {product.price}
                  </span>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onAddToCart(product);
                  }}
                  className="bg-slate-50 text-slate-400 hover:bg-teal-500 hover:text-white p-3.5 rounded-xl transition-all active:scale-95 shadow-sm group-hover:shadow-md border border-slate-100 btn-carrito"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CatalogCTA({ onOpenCatalog }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-500 text-white shadow-2xl mt-16 group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
      
      <div className="relative z-10 p-10 sm:p-14 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
        <div className="max-w-xl">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 drop-shadow-md tracking-tight">
            ¿Buscás algo más específico?
          </h2>
          <p className="text-teal-50 text-xl font-medium leading-relaxed">
            Contamos con más de 10,000 productos en stock. Filtrado por categorías para que encuentres rápidamente lo que necesitás.
          </p>
        </div>
        
        <button 
          onClick={onOpenCatalog}
          className="whitespace-nowrap bg-white text-teal-800 hover:bg-slate-50 hover:shadow-2xl px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-3 shadow-xl">
          Ver Catálogo Completo
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}

function FullCatalog({ onSelectProduct, onAddToCart, onBack }) {
  const [activeCategory, setActiveCategory] = useState("Todas");
  
  const categories = ["Todas", ...new Set(productsData.map(p => p.category))];
  
  const filteredProducts = activeCategory === "Todas" 
    ? productsData 
    : productsData.filter(p => p.category === activeCategory);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
      {/* Header y Filtros (Estilo Limpio de una sola línea) */}
      <div className="bg-white px-5 py-4 sm:px-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-2 sticky top-[88px] z-40 bg-white/95 backdrop-blur-md">
        
        {/* Izquierda: Botón y Título (Sin Lupa) */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={onBack}
            className="flex items-center justify-center text-slate-500 hover:text-teal-600 bg-slate-50 hover:bg-teal-50 w-11 h-11 rounded-[14px] transition-all border border-transparent hover:border-teal-100"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">
              Catálogo
            </h1>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Stock y Variedad</p>
          </div>
        </div>
        
        {/* Derecha: Filtros (Todos en fila) */}
        <div className="flex items-center gap-2 justify-start lg:justify-end w-full overflow-hidden">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap shrink-0 ${
                activeCategory === cat 
                  ? "bg-teal-600 text-white shadow-md shadow-teal-500/20 scale-105" 
                  : "bg-slate-50 text-slate-600 hover:bg-white hover:shadow-sm border border-slate-200 hover:border-teal-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-2 transition-all duration-300 group flex flex-col cursor-pointer"
          >
            {/* Imagen del producto */}
            <div className="relative aspect-[4/3] bg-slate-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
              {product.badge && (
                <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl z-10 shadow-md">
                  {product.badge}
                </span>
              )}
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Info del producto */}
            <div className="flex-1 flex flex-col">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                {product.brand}
              </span>
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium">
                {product.desc}
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Precio</span>
                  <span className="text-2xl font-black text-teal-600">
                    Gs. {product.price}
                  </span>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onAddToCart(product);
                  }}
                  className="bg-slate-50 text-slate-400 hover:bg-teal-500 hover:text-white p-3.5 rounded-xl transition-all active:scale-95 shadow-sm group-hover:shadow-md border border-slate-100 btn-carrito"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-500 text-lg font-medium">No hay productos en esta categoría por ahora.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function TrustFooter({ onOpenPrivacy, onOpenTerms }) {
  const features = [
    {
      icon: Truck,
      title: "Envío Flash",
      desc: "Entregas en menos de 2 horas en zona céntrica."
    },
    {
      icon: ShieldCheck,
      title: "Pagos 100% Seguros",
      desc: "Transacciones encriptadas nivel banco."
    },
    {
      icon: Stethoscope,
      title: "Atención Pro",
      desc: "Farmacéuticos disponibles 24/7 para vos."
    }
  ];

  return (
    <footer className="bg-white border-t border-slate-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features de confianza */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
          {features.map((feat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50/50 hover:bg-teal-50/40 transition-colors border border-transparent hover:border-teal-100">
              <div className="bg-white text-teal-600 p-5 rounded-2xl mb-5 shadow-sm border border-slate-100">
                <feat.icon className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">{feat.title}</h4>
              <p className="text-slate-500 font-medium">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Separador */}
        <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-90">
            <div className="bg-teal-50 p-2 rounded-xl">
              <HeartPulse className="w-6 h-6 text-teal-600" />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">
              FarmaVida
            </span>
          </div>
          <p className="text-slate-400 text-sm md:text-base font-medium text-center">
            © {new Date().getFullYear()} FarmaVida. Cuidando tu salud con cariño.
          </p>
          <div className="flex gap-6">
            <button onClick={onOpenPrivacy} className="text-slate-400 hover:text-teal-600 transition-colors font-bold text-sm">Privacidad</button>
            <button onClick={onOpenTerms} className="text-slate-400 hover:text-teal-600 transition-colors font-bold text-sm">Términos</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PrivacyPolicy({ onBack }) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold mb-8 transition-colors bg-white/50 hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al Inicio
      </button>

      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-teal-100 p-3 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">Política de Privacidad</h1>
          </div>
          
          <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
            <p className="text-lg text-slate-500">
              En <strong className="text-slate-800">FarmaVida</strong>, nos tomamos muy en serio la protección de tus datos personales. Esta política describe cómo recopilamos, usamos y protegemos la información que nos compartís para darte la mejor experiencia posible.
            </p>
            
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-teal-50 text-teal-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                Información que recopilamos
              </h2>
              <p className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                Recopilamos la información estrictamente necesaria cuando completás el formulario para enviar tu pedido por WhatsApp. FarmaVida no requiere cuenta de usuario y no guardamos registros, todo es de acceso libre. La información requerida en el carrito se usa únicamente para despachar el producto a tu ubicación y comunicarnos en caso de dudas sobre el envío.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-teal-50 text-teal-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                Uso de la información
              </h2>
              <p className="mb-4">Toda la data que juntamos la usamos exclusivamente para:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <span>Brindarte una atención al cliente directa.</span>
                </div>
                <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <span>Mejorar nuestra interfaz y catálogo de productos.</span>
                </div>
                <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <span>Procesar tu pedido de manera ultra rápida por WhatsApp.</span>
                </div>
                <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <span>Coordinar los detalles de entrega o retiro.</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-teal-50 text-teal-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                Protección de máxima seguridad
              </h2>
              <p>
                Aunque no usamos cuentas de usuario, implementamos medidas de seguridad para proteger la integridad de nuestra web y asegurar que tu navegación sea rápida, sencilla y sin comprometer tus dispositivos ni tus datos al comunicarte con nosotros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function TermsAndConditions({ onBack }) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold mb-8 transition-colors bg-white/50 hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al Inicio
      </button>

      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-amber-100 p-3 rounded-2xl">
              <Sparkles className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">Términos y Condiciones</h1>
          </div>
          
          <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
            <p className="text-lg text-slate-500">
              ¡Bienvenido a <strong className="text-slate-800">FarmaVida</strong>! Al utilizar y navegar por nuestra plataforma web, estás aceptando cumplir con estos términos de uso en su totalidad. Por favor, dales una leída.
            </p>
            
            <div className="bg-slate-50 border-l-4 border-amber-400 p-5 rounded-r-2xl">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Aviso Importante Médico</h2>
              <p>La información proporcionada en este sitio no reemplaza bajo ningún concepto la consulta con un profesional de la salud. Si tenés dudas sobre síntomas o dosis, contactá a un médico inmediatamente.</p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-slate-300" />
                Uso de la Plataforma
              </h2>
              <p>El contenido de las páginas de este sitio web es para información general y uso exclusivo de los clientes de FarmaVida. Este contenido está sujeto a actualizaciones, quita de stock o cambios de precio sin previo aviso.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-slate-300" />
                Compras, Pedidos y Envíos
              </h2>
              <p>Todos los pedidos realizados a través de la web están sujetos a revisión de disponibilidad y confirmación del precio final en caja. Nuestros tiempos de entrega están optimizados (Envío Flash), pero pueden sufrir tolerancias en caso de temporales, huelgas o fuerza mayor en el tránsito asunceno.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-slate-300" />
                Políticas de Salud y Devolución
              </h2>
              <p>
                En cumplimiento con las normativas sanitarias vigentes del Ministerio de Salud, <strong>los medicamentos y suplementos no tienen cambio ni devolución una vez despachados</strong>, para evitar corte de la cadena de frío o adulteraciones. Solo se admitirán reclamos si se demuestra un defecto de fabricación validado por el laboratorio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CartModal({ items, onClose, onRemoveItem }) {
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', pais: 'Paraguay', direccion: '', ciudad: '', notas: '', telefono: ''
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const total = items.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace('.', ''));
    return acc + (priceNum * item.qty);
  }, 0);

  const formattedTotal = total.toLocaleString('es-PY');

  const handleWhatsApp = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.direccion || !formData.ciudad || !formData.telefono) {
      alert("Por favor completá los campos obligatorios.");
      return;
    }

    let text = `*✨ NUEVO PEDIDO - FarmaVida ✨*%0A%0A`;
    text += `*👤 Cliente:* ${formData.nombre} ${formData.apellidos}%0A`;
    text += `*📱 Teléfono:* ${formData.telefono}%0A`;
    text += `*📍 Dirección:* ${formData.direccion}, ${formData.ciudad} (${formData.pais})%0A`;
    if (formData.notas) text += `*📝 Notas:* ${formData.notas}%0A`;
    text += `%0A*🛍️ Resumen del Pedido:*%0A`;
    
    items.forEach(item => {
      text += `- ${item.qty}x ${item.name} (Gs. ${item.price})%0A`;
    });
    
    text += `%0A*💰 TOTAL A PAGAR: Gs. ${formattedTotal}*%0A`;
    text += `%0A¡Gracias por elegirnos!`;

    window.open(`https://wa.me/59598123456?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border border-slate-100 relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button onClick={() => setStep('cart')} className="bg-white p-2 text-slate-400 hover:text-teal-600 rounded-xl shadow-sm border border-slate-200 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="bg-teal-100 p-3 rounded-2xl">
              <ShoppingCart className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {step === 'cart' ? 'Tu Carrito' : 'Finalizar Pedido'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {step === 'cart' ? (
            items.length === 0 ? (
              <div className="text-center py-10">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <ShoppingCart className="w-12 h-12 text-slate-300" />
                </div>
                <p className="text-2xl font-black text-slate-800 mb-2">Tu carrito está vacío</p>
                <p className="text-slate-500 font-medium">Agregá unos cuantos productos para empezar.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map(item => (
                  <li key={item.id} className="flex items-center gap-5 p-4 border border-slate-100 rounded-2xl hover:border-teal-100 hover:shadow-md transition-all bg-white group">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-slate-50" />
                      <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md z-10 border border-white">
                        x{item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-1 rounded-lg mb-1 inline-block">{item.brand}</span>
                      <h4 className="font-bold text-slate-800 text-lg truncate leading-tight">{item.name}</h4>
                      <p className="text-sm text-slate-500 mt-1 truncate">{item.desc}</p>
                    </div>
                    <div className="text-right flex flex-col items-end justify-between">
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors outline-none"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="font-black text-teal-600 text-xl whitespace-nowrap bg-teal-50 px-4 py-2 rounded-xl mt-2">Gs. {item.price}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <form id="checkout-form" onSubmit={handleWhatsApp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nombre *</label>
                  <input required name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Juan" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Apellidos</label>
                  <input name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Pérez" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono (WhatsApp) *</label>
                  <input required name="telefono" value={formData.telefono} onChange={handleChange} type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" placeholder="098X XXX XXX" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Ciudad *</label>
                  <input required name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Asunción" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Dirección exacta / Calle *</label>
                <input required name="direccion" value={formData.direccion} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Mcal. López y San Martín, Edificio X" />
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Notas del pedido (opcional)</label>
                 <textarea name="notas" value={formData.notas} onChange={handleChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all resize-none" placeholder="Instrucciones especiales para la entrega..."></textarea>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/80">
            {step === 'cart' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold text-slate-600 uppercase tracking-tight">Total a pagar:</span>
                  <span className="text-4xl font-black text-teal-600 tracking-tight">
                    <span className="text-2xl text-teal-500 font-bold align-top mr-1">Gs.</span>{formattedTotal}
                  </span>
                </div>
                <button 
                  onClick={() => setStep('checkout')}
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-teal-500/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-6 h-6" />
                  Finalizar Pedido
                </button>
              </>
            ) : (
              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-[#25D366]/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                Enviar Pedido por WhatsApp
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FavoritesPage({ items, onSelectProduct, onAddToCart, onRemove, onBack }) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 font-bold mb-8 transition-colors bg-white/50 hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al Inicio
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
        <div className="bg-rose-50/50 p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm flex-1 relative overflow-hidden w-full">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight flex items-center gap-3 mb-3">
              <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
              Mis Favoritos
            </h1>
            <p className="text-rose-700 text-base sm:text-lg font-medium">Tus productos guardados, listos para sumar al carrito.</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-4">
          <div className="bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Heart className="w-12 h-12 text-rose-300" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">Tu lista está vacía</p>
          <p className="text-slate-500 font-medium max-w-md mx-auto">Navegá por nuestro catálogo y tocá el corazoncito para guardar acá los productos que más te gustan.</p>
          <button 
            onClick={onBack}
            className="mt-8 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-teal-500/20 active:scale-95"
          >
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <div 
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col cursor-pointer relative"
            >
              <button 
                onClick={(e) => onRemove(product, e)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-rose-500 hover:bg-rose-50 transition-all z-20 shadow-sm border border-slate-100"
                title="Quitar de favoritos"
              >
                <Heart className="w-5 h-5 fill-rose-500" />
              </button>

              <div className="relative aspect-[4/3] bg-slate-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  {product.brand}
                </span>
                <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-2xl font-black text-teal-600">
                    Gs. {product.price}
                  </span>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onAddToCart(product);
                    }}
                    className="bg-slate-50 text-slate-400 hover:bg-teal-500 hover:text-white p-3.5 rounded-xl transition-all active:scale-95 shadow-sm group-hover:shadow-md border border-slate-100"
                    title="Agregar al carrito"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
