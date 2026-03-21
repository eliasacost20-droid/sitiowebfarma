import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useTranslation } from 'react-i18next';
import './i18n';
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
  Trash2,
  User,
  Camera,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

export const ProductContext = React.createContext();

const initialProductsData = [];

const initialSlidesData = [];

const initialReviewsData = [];


export default function App() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (prods) setProducts(prods);
      const { data: bals } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
      if (bals) setSlides(bals.map(b => ({ ...b, productId: b.product_id })));
      const { data: revs } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (revs) setReviews(revs);
    }
    loadData();
  }, []);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [activePage, setActivePage] = useState('home'); // 'home' | 'privacy' | 'terms' | 'catalog' | 'favorites'
  const [isBouncing, setIsBouncing] = useState(false);
  const [catalogCategory, setCatalogCategory] = useState('Todas');
  
  // Control Maestro Admin
  const [adminInputVisible, setAdminInputVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  useEffect(() => {
    let ctrlAPressed = false;
    let timeout;
    
    const handleKeyDown = (e) => {
      // Si toca 'A'
      if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault(); 
        ctrlAPressed = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => { ctrlAPressed = false; }, 3000); 
      } 
      // Si toca 'C' luego de 'A'
      else if (e.ctrlKey && e.key.toLowerCase() === 'c' && ctrlAPressed) {
        e.preventDefault(); 
        setAdminInputVisible(true);
        ctrlAPressed = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, []);

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin123') { 
       setAdminModalOpen(true);
       setAdminInputVisible(false);
       setAdminPassword('');
    } else {
       alert("Contraseña incorrecta rey.");
       setAdminInputVisible(false);
       setAdminPassword('');
    }
  };

  const handleOpenCatalog = (category = 'Todas') => {
    setCatalogCategory(category);
    setActivePage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const decreaseCartQuantity = (productId) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, qty: Math.max(1, item.qty - 1) };
      }
      return item;
    }));
  };

  return (
    <ProductContext.Provider value={{ products, setProducts, slides, setSlides, reviews, setReviews, setSelectedProduct, setAdminModalOpen }}>
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
            initialCategory={catalogCategory}
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
            <PopularCategories onSelectCategory={handleOpenCatalog} />
            <FeaturedProducts 
              onSelectProduct={handleSelectProduct} 
              onAddToCart={addToCart} 
              favoriteItems={favoriteItems}
              onToggleFavorite={toggleFavorite}
            />
            <CatalogCTA onOpenCatalog={() => handleOpenCatalog("Todas")} />
          </main>
        )}
      </div>

      <TrustFooter 
        onOpenPrivacy={() => { setActivePage('privacy'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth'}); }} 
        onOpenTerms={() => { setActivePage('terms'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth'}); }} 
      />

      {cartOpen && (
        <CartModal 
          items={cartItems} 
          onClose={() => setCartOpen(false)} 
          onRemoveItem={removeFromCart} 
          onIncrease={(product) => addToCart(product)}
          onDecrease={decreaseCartQuantity}
        />
      )}

      {adminInputVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleAdminAuth} className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 w-full max-w-sm border border-slate-100 relative">
             <button type="button" onClick={() => setAdminInputVisible(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
               <X className="w-5 h-5" />
             </button>
             <h3 className="font-black text-slate-800 text-2xl text-center flex flex-col items-center gap-2">
               <ShieldCheck className="w-10 h-10 text-teal-600" />
               Acceso Maestro
             </h3>
             <input 
                type="password"
                autoFocus
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="Ingresar contraseña..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all font-medium text-center tracking-widest"
             />
             <button type="submit" className="w-full p-4 rounded-xl bg-teal-600 text-white font-black text-lg hover:bg-teal-700 active:scale-95 transition-all shadow-md">
                Verificar
             </button>
          </form>
        </div>
      )}

      {adminModalOpen && (
        <div className="fixed inset-0 z-[250] flex flex-col p-4 sm:p-8 bg-slate-900/95 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
           <div className="bg-white flex-1 w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 relative">
              <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-sm">
                 <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-3">
                   <ShieldCheck className="w-8 h-8 text-teal-600" />
                   Control Maestro Admin 
                 </h2>
                 <button onClick={() => setAdminModalOpen(false)} className="p-3 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-colors text-slate-400 border border-slate-200 bg-white shadow-sm flex items-center gap-2 font-bold group">
                   <span className="hidden sm:block group-hover:text-rose-500">Cerrar</span>
                   <X className="w-6 h-6" />
                 </button>
              </div>
              <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-slate-50">
                 <div className="max-w-6xl mx-auto">
<AdminPanel />
</div>
              </div>
           </div>
        </div>
      )}
    </div>
  </ProductContext.Provider>
  );
}


function AdminPanel() {
  const { products, setProducts, slides, setSlides, reviews, setReviews, setSelectedProduct, setAdminModalOpen } = React.useContext(ProductContext);
  const [activeTab, setActiveTab] = useState('products');
  
  // Reseñas Modal State
  const [replyingToReview, setReplyingToReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Products state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', desc: '', price: '', price_brl: '', image: '', badge: '', shipping_title: '', shipping_desc: '', features: ''
  });

  // Banners state
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerData, setBannerData] = useState({
    title: '', subtitle: '', cta: '', bgImg: '', color: 'from-amber-900/90 to-amber-800/40', badge: '', productId: ''
  });

  const handleBannerImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("¡Mba'e pio! La imagen pesa más de 2MB. Subí una más liviana rey.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerData({ ...bannerData, bgImg: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSave = async (e) => {
    e.preventDefault();
    const payload = { ...bannerData };
    if (payload.productId === '') payload.product_id = null;
    else payload.product_id = payload.productId; 
    delete payload.productId; 
    
    if (editingBannerId) {
      const { data, error } = await supabase.from('banners').update(payload).eq('id', editingBannerId).select().single();
      if (error) { alert("Error guardando el anuncio: " + error.message); return; }
      if (data) setSlides(slides.map(b => b.id === editingBannerId ? { ...data, productId: data.product_id } : b));
    } else {
      const { data, error } = await supabase.from('banners').insert(payload).select().single();
      if (error) { alert("Error al guardar anuncio: " + error.message); console.error(error); return; }
      if (data) setSlides([{ ...data, productId: data.product_id }, ...slides]);
    }
    setBannerData({ title: '', subtitle: '', cta: '', bgImg: '', color: 'from-amber-900/90 to-amber-800/40', badge: '', productId: '' });
    setEditingBannerId(null);
  };
  
  const handleBannerEdit = (b) => {
    setEditingBannerId(b.id);
    setBannerData({ ...b, productId: b.productId || '' });
    setActiveTab('banners');
  };
  
  const handleBannerDelete = async (id) => {
    if(window.confirm('¿Seguro que querés borrar este Banner?')) {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if(!error) setSlides(slides.filter(b => b.id !== id));
    }
  };


  const formatPrice = (val) => {
    if (!val) return '';
    let raw = String(val).replace(/\D/g, '');
    if (!raw) return '';
    return parseInt(raw, 10).toLocaleString('de-DE'); // 1.000
  };

  const formatBrlPrice = (val) => {
    if (!val) return '';
    let raw = String(val).replace(/\D/g, '');
    if (!raw) return '';
    const num = parseInt(raw, 10) / 100;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handlePriceChange = (e) => {
    setFormData({ ...formData, price: formatPrice(e.target.value) });
  };

  const handleBrlPriceChange = (e) => {
    setFormData({ ...formData, price_brl: formatBrlPrice(e.target.value) });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("¡Mba'e pio! La imagen pesa más de 2MB. Subí una más liviana rey.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setFormData({ 
      name: prod.name || '', 
      brand: prod.brand || '', 
      category: prod.category || '', 
      desc: prod.desc || '', 
      price: prod.price || '', price_brl: prod.price_brl || '', shipping_title: prod.shipping_title || '', shipping_desc: prod.shipping_desc || '', features: Array.isArray(prod.features) ? prod.features.join(', ') : (prod.features || ''), 
      image: prod.image || '',
      badge: prod.badge || ''
    });
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que querés borrar este producto?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if(!error) setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { data, error } = await supabase.from('products').update(formData).eq('id', editingId).select().single();
      if (error) { alert("Error guardando producto: " + error.message); return; }
      if (data) setProducts(products.map(p => p.id === editingId ? data : p));
    } else {
      const { data, error } = await supabase.from('products').insert(formData).select().single();
      if (error) { alert("Error al guardar: " + error.message); return; }
      if (data) setProducts([data, ...products]);
    }
    setFormData({ name: '', brand: '', category: '', desc: '', price: '', price_brl: '', image: '', badge: '', shipping_title: '', shipping_desc: '', features: '' });
    setEditingId(null);
  };

  const handleCancelNew = () => {
    setFormData({ name: '', brand: '', category: '', desc: '', price: '', price_brl: '', image: '', badge: '', shipping_title: '', shipping_desc: '', features: '' });
    setEditingId(null);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
         <button onClick={() => setActiveTab('products')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}>Inventario de Productos</button>
         <button onClick={() => setActiveTab('banners')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'banners' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}>Anuncios y Carrusel</button>
         <button onClick={() => setActiveTab('reviews')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'reviews' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}>Control de Reseñas</button>
      </div>
      
      {activeTab === 'products' && (
<div className="flex flex-col xl:flex-row gap-8 w-full">
      {/* Formulario */}
      <div className="w-full xl:w-1/3">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-0">
          <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-teal-500" />
            {editingId ? 'Editar Producto' : 'Cargar Nuevo Producto'}
          </h4>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nombre</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: Vitamina C..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Marca</label>
                <input required name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: NutriLife" />
              </div>
              <PriceInputContainer formData={formData} handlePriceChange={handlePriceChange} handleBrlPriceChange={handleBrlPriceChange} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Beneficios clave (Separados por coma)</label>
              <textarea name="features" value={formData.features} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: Refuerza defensas, Sin azúcar añadido, Hipoalergénico"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Título de Envío (Opcional)</label>
              <input name="shipping_title" value={formData.shipping_title} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: Envío Express Garantizado" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Detalle de Envío (Opcional)</label>
              <textarea name="shipping_desc" value={formData.shipping_desc} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: Llega hoy si compras antes de las 18:00hs."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Categoría</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400">
                <option value="">Seleccionar...</option>
                <option value="Vitaminas">Vitaminas</option>
                <option value="Cuidado Personal">Cuidado Personal</option>
                <option value="Dermocosmética">Dermocosmética</option>
                <option value="Mamá y Bebé">Mamá y Bebé</option>
                <option value="Primeros Auxilios">Primeros Auxilios</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
              <textarea required name="desc" value={formData.desc} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400 resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Foto del Producto</label>
              <div className="flex items-center gap-3 w-full bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:border-teal-400 transition-all">
                {formData.image && (
                  <img src={formData.image.startsWith('http') || formData.image.startsWith('data') || formData.image.startsWith('/') ? formData.image : '/placeholder.png'} alt="Preview" className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-100 bg-white" />
                )}
                <input required={!formData.image} type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 transition-all cursor-pointer outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Etiqueta (Opcional)</label>
              <input name="badge" value={formData.badge} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: Nuevo, Oferta, -15%" />
            </div>
            <div className="flex gap-2 pt-2">
              {editingId && <button type="button" onClick={handleCancelNew} className="p-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors w-1/3">Cancelar</button>}
              <button type="submit" className={`${editingId ? 'w-2/3' : 'w-full'} p-3 rounded-xl font-black text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm`}>
                {editingId ? 'Guardar Cambios' : '🚀 Cargar Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Lista */}
      <div className="w-full xl:w-2/3">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-800 truncate max-w-[150px]">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{p.price && <div className="font-black text-teal-600">Gs. {p.price}</div>} {p.price_brl && <div className="text-xs text-slate-400 font-bold">R$ {p.price_brl}</div>}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{p.category}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(p)} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg">Editar</button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                   <tr><td colSpan="4" className="p-10 text-center text-slate-400">No hay productos en la tienda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
     </div>
      )}

      {activeTab === 'banners' && (
      <div className="flex flex-col xl:flex-row gap-8 w-full">
         <div className="w-full xl:w-1/3">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-0">
               <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                 <Sparkles className="w-6 h-6 text-teal-500" />
                 {editingBannerId ? 'Editar Anuncio' : 'Crear Anuncio'}
               </h4>
               <form onSubmit={handleBannerSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Título Grande</label>
                    <input required value={bannerData.title} onChange={e => setBannerData({...bannerData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: Mega Oferta..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Subtítulo Descriptivo</label>
                    <textarea required value={bannerData.subtitle} onChange={e => setBannerData({...bannerData, subtitle: e.target.value})} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400 resize-none" placeholder="Llevate todo al 50%..."></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Cinta / Etiqueta</label>
                        <input value={bannerData.badge} onChange={e => setBannerData({...bannerData, badge: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="OFERTA ✨" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Texto del Botón</label>
                        <input required value={bannerData.cta} onChange={e => setBannerData({...bannerData, cta: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ver Mega Promo" />
                     </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Producto Enlazado</label>
                    <select value={bannerData.productId || ''} onChange={e => setBannerData({...bannerData, productId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400 font-bold text-teal-700 text-sm overflow-hidden">
                      <option value="">(Sin Enlazar)</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>Gs. {p.price} | {p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Filtro de Color / Sombra</label>
                    <select required value={bannerData.color} onChange={e => setBannerData({...bannerData, color: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400">
                      <option value="from-teal-900/90 to-teal-800/40">Turquesa BodyLab</option>
                      <option value="from-blue-900/90 to-blue-800/40">Azul Clínico</option>
                      <option value="from-rose-900/90 to-rose-800/40">Rosa Maternal</option>
                      <option value="from-amber-900/90 to-amber-800/40">Ámbar Vitamina</option>
                      <option value="from-slate-900/90 to-slate-800/40">Gris Especial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Foto de Fondo</label>
                    <div className="flex items-center gap-3 w-full bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:border-teal-400 transition-all">
                      {bannerData.bgImg && (
                        <img src={bannerData.bgImg} alt="Preview" className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-100 bg-white" />
                      )}
                      <input required={!bannerData.bgImg} type="file" accept="image/*" onChange={handleBannerImageUpload} className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 transition-all cursor-pointer outline-none" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {editingBannerId && <button type="button" onClick={() => { setBannerData({ title: '', subtitle: '', cta: '', bgImg: '', color: 'from-amber-900/90 to-amber-800/40', badge: ''}); setEditingBannerId(null); }} className="p-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors w-1/3">Cancelar</button>}
                    <button type="submit" className={`${editingBannerId ? 'w-2/3' : 'w-full'} p-3 rounded-xl font-black text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm`}>
                      {editingBannerId ? 'Guardar Cambios' : '🚀 Activar Anuncio'}
                    </button>
                  </div>
               </form>
            </div>
         </div>
         <div className="w-full xl:w-2/3">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                     <tr>
                       <th className="p-4">Anuncio</th>
                       <th className="p-4">Estilo</th>
                       <th className="p-4">Enlace destino</th>
                       <th className="p-4">Acciones</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {slides.map(b => (
                       <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="p-4">
                           <div className="flex items-center gap-3">
                             <div className="w-20 h-10 rounded-lg overflow-hidden relative shrink-0">
                                <img src={b.bgImg} className="absolute inset-0 w-full h-full object-cover" />
                                <div className={`absolute inset-0 bg-gradient-to-r ${b.color}`} />
                             </div>
                             <div className="min-w-0">
                               <p className="font-bold text-sm text-slate-800 truncate">{b.title}</p>
                               <p className="text-xs text-slate-400 truncate">{b.subtitle}</p>
                             </div>
                           </div>
                         </td>
                         <td className="p-4">
                           <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md capitalize">{b.color.split('-')[1]}</span>
                         </td>
                         <td className="p-4">
                           {b.productId ? (
                             <div className="flex flex-col items-start">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Abre el producto:</span>
                                <span className="text-[11px] text-teal-600 font-bold max-w-[130px] truncate">{products.find(p => p.id === b.productId)?.name}</span>
                                <span className="text-[10px] text-slate-500 font-black">Gs. {products.find(p => p.id === b.productId)?.price}</span>
                             </div>
                           ) : (
                             <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-50 px-2 py-1 rounded-full border border-slate-100">Sin Enlace</span>
                           )}
                         </td>
                         <td className="p-4">
                           <div className="flex items-center gap-2 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleBannerEdit(b)} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg">Editar</button>
                             <button onClick={() => handleBannerDelete(b.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                           </div>
                         </td>
                       </tr>
                     ))}
                     {slides.length === 0 && (
                        <tr><td colSpan="4" className="p-10 text-center text-slate-400">No hay banners activos.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
         </div>
      </div>
      )}

      {activeTab === 'reviews' && (
      <div className="flex flex-col gap-8 w-full">
         <div className="w-full">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6">
               <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                 Control de Reseñas
               </h4>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                     <tr>
                       <th className="p-4">Usuario</th>
                       <th className="p-4">Prod ID</th>
                       <th className="p-4">Comentario y Respuesta</th>
                       <th className="p-4">Acciones</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {reviews.map(r => (
                       <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="p-4 font-bold text-sm text-slate-800">{r.author}</td>
                         <td className="p-4">
                           <div className="flex flex-col items-start gap-1">
                             <span className="font-bold text-teal-600 text-sm">ID: {r.productId}</span>
                             <button onClick={() => {
                               const p = products.find(prod => prod.id === r.productId);
                               if(p) {
                                 setSelectedProduct(p);
                                 setAdminModalOpen(false);
                               }
                             }} className="text-[11px] font-bold px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-teal-700 rounded-lg transition-colors cursor-pointer active:scale-95 shadow-sm border border-slate-200 flex items-center">
                               👉 Ir al producto
                             </button>
                           </div>
                         </td>
                         <td className="p-4">
                            <p className="text-xs text-slate-600 max-w-md truncate">{r.text}</p>
                            {r.adminReply && (
                              <div className="bg-teal-50 p-2 rounded-lg border border-teal-100 mt-2 max-w-md">
                                <p className="text-[10px] font-bold text-teal-800 uppercase">Respuesta:</p>
                                <p className="text-xs text-teal-700 italic truncate">{r.adminReply}</p>
                              </div>
                            )}
                         </td>
                         <td className="p-4">
                           <div className="flex flex-col gap-2">
                             <button onClick={() => {
                               setReplyingToReview(r);
                               setReplyText(r.adminReply || '');
                             }} className="p-1 px-2 text-teal-600 hover:bg-teal-50 rounded-lg text-xs font-bold border border-teal-100">
                                Contestar
                             </button>
                             <button onClick={async () => {
                               if(window.confirm('¿Borrar reseña inapropiada?')) {
                                 await supabase.from('reviews').delete().eq('id', r.id); setReviews(reviews.filter(rev => rev.id !== r.id));
                               }
                             }} className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold">
                                Borrar
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                     {reviews.length === 0 && (
                        <tr><td colSpan="4" className="p-10 text-center text-slate-400">No hay reseñas todavía.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
         </div>
      </div>
      )}

      {/* Modal para Contestar */}
      {replyingToReview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-black text-slate-800 mb-2">Responder a {replyingToReview.author}</h3>
            <p className="text-sm text-slate-500 mb-4">Escribí tu respuesta pública que aparecerá debajo del comentario:</p>
            <textarea
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 font-medium transition-all resize-none min-h-[100px]"
              placeholder="Ej: ¡Muchas gracias por tu compra..."
            ></textarea>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setReplyingToReview(null); setReplyText(''); }}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await supabase.from('reviews').update({ admin_reply: replyText }).eq('id', replyingToReview.id); setReviews(reviews.map(rev => rev.id === replyingToReview.id ? { ...rev, adminReply: replyText } : rev));
                  setReplyingToReview(null);
                  setReplyText('');
                }}
                className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition-colors shadow-sm"
              >
                Enviar Respuesta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetails({ product, onBack, onSelectRelated, onAddToCart, isFavorite, onToggleFavorite }) {
  const { t } = useTranslation();
  const { products } = React.useContext(ProductContext);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  // Productos relacionados excluyendo el actual
  const related = products.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in slide-in-from-bottom-8 fade-in duration-500">
      {/* Botón Volver */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold mb-8 transition-colors bg-white/50 hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        {t("Volver")}
      </button>

      {/* Hero del Producto tipo UI moderna */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 md:gap-12">
        
        {/* Foto Grande */}
        <div className="w-full md:w-2/5 relative group">
          <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 relative">
            {product.badge && (
              <span className="absolute top-4 left-4 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl z-10 shadow-lg shadow-teal-500/30">
                {t(product.badge)}
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
            <div className="flex items-center gap-1 text-amber-500 cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsReviewsModalOpen(true)}>
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current opacity-50" />
              <span className="font-bold text-slate-700 ml-2 text-sm">{product.rating}</span>
            </div>
            <span className="text-slate-300">|</span>
            <span 
              onClick={() => setIsReviewsModalOpen(true)}
              className="text-xs text-slate-500 hover:text-teal-600 font-medium cursor-pointer transition-colors"
            >
              Leer {product.reviews} reseñas
            </span>
          </div>

          <p className="text-base text-slate-500 mb-6 leading-relaxed font-medium">{t(product.desc)}</p>

          {/* Características */}
          <div className="mb-6 space-y-3">
            <h3 className="font-bold text-slate-800 text-base">{t("Beneficios_clave")}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(typeof product.features === 'string' ? product.features.split(',').map(s => s.trim()).filter(s => s) : (Array.isArray(product.features) ? product.features : [])).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{t(feat)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-50">
            <div className="flex flex-col w-full sm:w-auto min-w-[140px]">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t("Precio_Final")}</span>
              <span className="text-4xl font-black text-teal-600 tracking-tight">
                {product.price && <><span className="text-xl text-teal-500 font-bold align-top mr-1">Gs.</span>{product.price}</>}
                {product.price && product.price_brl && <span className="text-slate-300 mx-3 font-normal">|</span>}
                {product.price_brl && <><span className="text-xl text-teal-500 font-bold align-top mr-1">R$</span>{product.price_brl}</>}
              </span>
            </div>
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full sm:flex-1 bg-gradient-to-r from-teal-600 to-teal-500 hover:to-teal-400 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {t("Lo_Quiero_Ya")}
            </button>
          </div>

          {/* Entrega Info */}
          <div className="mt-6 bg-blue-50/50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
            <div className="bg-blue-100 p-1.5 rounded-lg shrink-0">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{product.shipping_title || t("Envio_Express")}</h4>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">{product.shipping_desc ? product.shipping_desc : <>Llega hoy si comprás antes de las 18:00 hs. <span className="font-bold text-blue-600">{t("Envio_gratis")}</span> en Gran Asunción.</>}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Relacionados */}
      <div className="mt-24 mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-400" />
          {t("Clientes_vieron")}
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
                <h3 className="text-xl font-bold text-slate-800 leading-tight mb-3 line-clamp-2">{t(relProd.name)}</h3>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  {relProd.price && <span className="text-2xl font-black text-teal-600">Gs. {relProd.price}</span>}
                  {relProd.price && relProd.price_brl && <span className="text-slate-300 mx-2 text-xl font-normal">|</span>}
                  {relProd.price_brl && <span className="text-2xl font-black text-teal-600">R$ {relProd.price_brl}</span>}
                  <div className="bg-teal-50 text-teal-600 p-3 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isReviewsModalOpen && (
        <ReviewsModal product={product} onClose={() => setIsReviewsModalOpen(false)} />
      )}
    </main>
  );
}

// --- Componentes Anteriores ---

function Navbar({ onSelectProduct, cartCount, favoritesCount, onOpenCart, onOpenFavorites, onGoHome, isBouncing }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  const { t, i18n } = useTranslation();
  const { products } = React.useContext(ProductContext);
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = i18n.language;

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  // Filter products based on search
  const searchResults = products.filter(p => 
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
            BodyLab
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
            placeholder={t("Buscar_medicamentos")} 
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
                        <h4 className="font-bold text-slate-800 text-sm truncate">{t(product.name)}</h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{t(product.desc)}</p>
                      </div>
                      <div className="font-black text-teal-600 whitespace-nowrap bg-teal-50 px-3 py-1.5 rounded-xl">
                        {product.price ? `Gs. ${product.price}` : ''} 
                            {product.price && product.price_brl ? <span className="text-slate-300 mx-1 font-normal">|</span> : ''} 
                            {product.price_brl ? `R$ ${product.price_brl}` : ''}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center flex flex-col items-center gap-3">
                  <div className="bg-slate-50 p-3 rounded-full">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">t("No_encontramos") + " \""{searchQuery}"</p>
                  <p className="text-xs text-slate-400">{t("Intenta_con")}</p>
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
          
          {/* Selector de idioma Custom */}
          <div className="relative">
             <button onClick={() => setLangOpen(!langOpen)} className="p-3 bg-white border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center">
                <span className="text-xl leading-none">{currentLang === 'es' ? '🇪🇸' : '🇧🇷'}</span>
             </button>
             {langOpen && (
               <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2 w-36">
                 <button onClick={() => changeLanguage('es')} className={`flex items-center gap-3 p-2 rounded-xl transition-all font-bold text-sm ${currentLang === 'es' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                   <span className="text-lg">🇪🇸</span> Español
                 </button>
                 <button onClick={() => changeLanguage('pt')} className={`flex items-center gap-3 p-2 rounded-xl transition-all font-bold text-sm ${currentLang === 'pt' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                   <span className="text-lg">🇧🇷</span> Português
                 </button>
               </div>
             )}
          </div>

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
  const { t } = useTranslation();
  const { slides, products, setSelectedProduct } = React.useContext(ProductContext);

  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;


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
              {slide.badge && (
                <span className="inline-block py-1 px-3 rounded-xl bg-white/20 text-white backdrop-blur-md text-xs sm:text-sm font-bold mb-3 border border-white/30 shadow-lg">
                  {t(slide.badge)}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 leading-[1.1] shadow-sm tracking-tight drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-lg text-slate-50 mb-6 max-w-xl opacity-90 font-medium drop-shadow line-clamp-2">
                {slide.subtitle}
              </p>
              <button 
                onClick={() => {
                  if (slide.productId) {
                     const p = products.find(prod => prod.id === slide.productId);
                     if (p) setSelectedProduct(p);
                  }
                }}
                className="bg-white text-teal-800 hover:bg-slate-50 hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-2xl flex items-center gap-2 active:scale-95 cursor-pointer relative z-50 pointer-events-auto">
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

function PopularCategories({ onSelectCategory }) {
  const { t } = useTranslation();
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
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t("Categorias_Populares")}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat, idx) => (
          <div 
            key={idx}
            onClick={() => onSelectCategory && onSelectCategory(cat.name)}
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
  const { t } = useTranslation();
  const { products } = React.useContext(ProductContext);
  return (
    <section>
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            {t("Destacados_Mes")}
            <span className="relative flex h-3 w-3 -mt-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium text-lg">{t("Productos_top")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-2 transition-all duration-300 group flex flex-col cursor-pointer"
          >
            {/* Imagen del producto */}
            <div className="relative aspect-[4/3] bg-slate-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
              {product.badge && (
                <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl z-10 shadow-md">
                  {t(product.badge)}
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
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 line-clamp-2">{t(product.name)}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium">{t(product.desc)}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t("Precio")}</span>
                  <span className="text-2xl font-black text-teal-600">
                    {product.price ? `Gs. ${product.price}` : ''} 
                            {product.price && product.price_brl ? <span className="text-slate-300 mx-1 font-normal">|</span> : ''} 
                            {product.price_brl ? `R$ ${product.price_brl}` : ''}
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
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-500 text-white shadow-2xl mt-16 group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
      
      <div className="relative z-10 p-10 sm:p-14 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
        <div className="max-w-xl">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 drop-shadow-md tracking-tight">
            {t("Buscas_algo")}
          </h2>
          <p className="text-teal-50 text-xl font-medium leading-relaxed">
            {t("Contamos_con")}
          </p>
        </div>
        
        <button 
          onClick={onOpenCatalog}
          className="whitespace-nowrap bg-white text-teal-800 hover:bg-slate-50 hover:shadow-2xl px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-3 shadow-xl">
          {t("Ver_Catalogo")}
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}

function FullCatalog({ onSelectProduct, onAddToCart, onBack, initialCategory }) {
  const { t } = useTranslation();
  const { products } = React.useContext(ProductContext);
  const [activeCategory, setActiveCategory] = useState(initialCategory || "Todas");
  
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = ["Todas", ...new Set(products.map(p => p.category))];
  
  const filteredProducts = activeCategory === "Todas" 
    ? products 
    : products.filter(p => p.category === activeCategory);

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
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{t("Stock_Variedad")}</p>
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
              {t(cat)}
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
                  {t(product.badge)}
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
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 line-clamp-2">{t(product.name)}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium">{t(product.desc)}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t("Precio")}</span>
                  <span className="text-2xl font-black text-teal-600">
                    {product.price ? `Gs. ${product.price}` : ''} 
                            {product.price && product.price_brl ? <span className="text-slate-300 mx-1 font-normal">|</span> : ''} 
                            {product.price_brl ? `R$ ${product.price_brl}` : ''}
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
            <p className="text-slate-500 text-lg font-medium">{t("No_hay_productos")}</p>
          </div>
        )}
      </div>
    </main>
  );
}

function TrustFooter({ onOpenPrivacy, onOpenTerms }) {
  const { t } = useTranslation();
  const features = [
    {
      icon: Truck,
      title: t("Entrega_Rapida"),
      desc: t("Entregas_veloces")
    },
    {
      icon: ShieldCheck,
      title: t("Pagos_Seguros"),
      desc: t("Transacciones")
    },
    {
      icon: Stethoscope,
      title: t("Atencion_Farmaceutica"),
      desc: t("Farmaceuticos_disponibles")
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
              BodyLab
            </span>
          </div>
          <p className="text-slate-400 text-sm md:text-base font-medium text-center">
            © {new Date().getFullYear()} BodyLab. Cuidando tu salud con cariño.
          </p>
          <div className="flex gap-6">
            <button onClick={onOpenPrivacy} className="text-slate-400 hover:text-teal-600 transition-colors font-bold text-sm">{t("Privacidad")}</button>
            <button onClick={onOpenTerms} className="text-slate-400 hover:text-teal-600 transition-colors font-bold text-sm">{t("Terminos")}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PrivacyPolicy({ onBack }) {
  const { t } = useTranslation();
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold mb-8 transition-colors bg-white/50 hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        {t("Volver_Inicio")}
      </button>

      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-teal-100 p-3 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{t("Politica_Privacidad")}</h1>
          </div>
          
          <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
            <p className="text-lg text-slate-500">
              En <strong className="text-slate-800">BodyLab</strong>, nos tomamos muy en serio la protección de tus datos personales. Esta política describe cómo recopilamos, usamos y protegemos la información que nos compartís para darte la mejor experiencia posible.
            </p>
            
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-teal-50 text-teal-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                Información que recopilamos
              </h2>
              <p className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                Recopilamos la información estrictamente necesaria cuando completás el formulario para enviar tu pedido por WhatsApp. BodyLab no requiere cuenta de usuario y no guardamos registros, todo es de acceso libre. La información requerida en el carrito se usa únicamente para despachar el producto a tu ubicación y comunicarnos en caso de dudas sobre el envío.
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
  const { t } = useTranslation();
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold mb-8 transition-colors bg-white/50 hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        {t("Volver_Inicio")}
      </button>

      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-amber-100 p-3 rounded-2xl">
              <Sparkles className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{t("Terminos_Condiciones")}</h1>
          </div>
          
          <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
            <p className="text-lg text-slate-500">
              ¡Bienvenido a <strong className="text-slate-800">BodyLab</strong>! Al utilizar y navegar por nuestra plataforma web, estás aceptando cumplir con estos términos de uso en su totalidad. Por favor, dales una leída.
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
              <p>El contenido de las páginas de este sitio web es para información general y uso exclusivo de los clientes de BodyLab. Este contenido está sujeto a actualizaciones, quita de stock o cambios de precio sin previo aviso.</p>
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

function CartModal({ items, onClose, onRemoveItem, onIncrease, onDecrease }) {
  const { t } = useTranslation();
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', pais: 'Paraguay', direccion: '', ciudad: '', notas: '', telefono: ''
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const [locationLink, setLocationLink] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocationLink(`https://maps.google.com/?q=${latitude},${longitude}`);
      setGettingLocation(false);
    }, (error) => {
      alert("No pudimos obtener tu ubicación automáticamente. Revisa los permisos.");
      setGettingLocation(false);
    }, {
      enableHighAccuracy: true, // Fuerza a usar el GPS real del celular en vez de la antena
      timeout: 10000,
      maximumAge: 0
    });
  };

  const totalGs = items.reduce((acc, item) => {
    if (!item.price) return acc;
    const priceNum = parseInt(item.price.replace(/\./g, ''), 10) || 0;
    return acc + (priceNum * item.qty);
  }, 0);

  const totalBrl = items.reduce((acc, item) => {
    if (!item.price_brl) return acc;
    const priceBrl = parseFloat(item.price_brl.replace(/\./g, '').replace(',', '.')) || 0;
    return acc + (priceBrl * item.qty);
  }, 0);

  const formattedTotalGs = totalGs.toLocaleString('es-PY');
  const formattedTotalBrl = totalBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleWhatsApp = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.direccion || !formData.ciudad || !formData.telefono) {
      alert("Por favor completá los campos obligatorios.");
      return;
    }

    let text = `*NUEVO PEDIDO - BodyLab*%0A`;
    text += `===================================%0A%0A`;
    text += `*DATOS DEL CLIENTE*%0A`;
    text += `*Nombre:* ${formData.nombre} ${formData.apellidos}%0A`;
    text += `*Teléfono:* ${formData.telefono}%0A%0A`;
    
    text += `*DATOS DE ENTREGA*%0A`;
    text += `*Ciudad:* ${formData.ciudad}%0A`;
    text += `*Dirección:* ${formData.direccion}%0A`;
    if (locationLink) text += `*Ubicación GPS:* ${locationLink}%0A`;
    if (formData.notas) text += `*Observaciones:* ${formData.notas}%0A%0A`;
    
    text += `*DETALLE DEL PEDIDO*%0A`;
    items.forEach(item => {
      let priceStr = [];
      if (item.price) priceStr.push("Gs. " + item.price);
      if (item.price_brl) priceStr.push("R$ " + item.price_brl);
      text += `- ${item.qty} un. de ${item.name} (${priceStr.join(' | ')} c/u)%0A`;
    });
    
    text += `%0A===================================%0A`;
    let totalStrs = [];
    if (totalGs > 0) totalStrs.push("Gs. " + formattedTotalGs);
    if (totalBrl > 0) totalStrs.push("R$ " + formattedTotalBrl);
    text += `*TOTAL A ABONAR: ${totalStrs.join(' | ')}*%0A`;
    text += `===================================%0A`;

    window.open(`https://wa.me/595982351752?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-white w-full ${step === 'checkout' ? 'max-w-4xl' : 'max-w-2xl'} transition-all duration-500 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh] border border-slate-100 relative`}>
        
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
              {step === 'cart' ? t('Tu_Carrito') : t('Finalizar_Pedido')}
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
                <p className="text-2xl font-black text-slate-800 mb-2">{t("Carrito_vacio")}</p>
                <p className="text-slate-500 font-medium">{t("Agrega_cuantos")}</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map(item => (
                  <li key={item.id} className="flex items-center gap-5 p-4 border border-slate-100 rounded-2xl hover:border-teal-100 hover:shadow-md transition-all bg-white group">
                    <div className="relative shrink-0">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-slate-50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-1 rounded-lg mb-1 inline-block">{item.brand}</span>
                      <h4 className="font-bold text-slate-800 text-lg truncate leading-tight">{t(item.name)}</h4>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1 shrink-0 w-fit">
                          <button 
                            type="button"
                            onClick={() => onDecrease(item.id)}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-teal-600 hover:shadow-sm rounded-lg transition-all"
                          >
                            <span className="text-lg font-black leading-none -mt-0.5">-</span>
                          </button>
                          <span className="w-8 text-center font-bold text-slate-800 text-sm">
                            {item.qty}
                          </span>
                          <button 
                            type="button"
                            onClick={() => onIncrease(item)}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-teal-600 hover:shadow-sm rounded-lg transition-all"
                          >
                            <span className="text-lg font-black leading-none -mt-0.5">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end justify-between self-stretch pt-1 pb-1">
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors outline-none"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="font-black text-teal-600 text-xl whitespace-nowrap bg-teal-50 px-4 py-2 rounded-xl mt-2 grid text-right">
                        {item.price && <span>Gs. {item.price}</span>}
                        {item.price_brl && <span>R$ {item.price_brl}</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <form id="checkout-form" onSubmit={handleWhatsApp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("Nombre")}</label>
                  <input required name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Juan" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("Apellidos")}</label>
                  <input name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Pérez" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("Telefono")}</label>
                  <input required name="telefono" value={formData.telefono} onChange={handleChange} type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" placeholder="098X XXX XXX" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("Ciudad")}</label>
                  <input required name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Asunción" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t("Direccion")}</label>
                <div className="flex gap-2">
                  <input required name="direccion" value={formData.direccion} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" placeholder="Mcal. López y San Martín, Edificio X" />
                  <button 
                    type="button" 
                    onClick={handleGetLocation} 
                    disabled={gettingLocation}
                    className={`shrink-0 flex items-center justify-center gap-2 px-4 rounded-xl border font-bold transition-all ${locationLink ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-slate-800 text-white border-transparent hover:bg-slate-700'}`}
                    title={t("Enviar_ubicacion")}
                  >
                    {gettingLocation ? '...' : locationLink ? '✓ GPS' : '📍 GPS'}
                  </button>
                </div>
                {locationLink && <p className="text-xs text-teal-600 mt-1 font-bold">{t("Ubicacion_exacta")}</p>}
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">{t("Notas")}</label>
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
                  <span className="text-xl font-bold text-slate-600 uppercase tracking-tight">{t("Total_pagar")}</span>
                  <span className="flex flex-col items-end text-3xl font-black text-teal-600 tracking-tight leading-none text-right">
                    {totalGs > 0 && <span><span className="text-xl text-teal-500 font-bold align-top mr-1">Gs.</span>{formattedTotalGs}</span>}
                    {totalBrl > 0 && <span className="text-xl mt-1"><span className="text-base text-teal-500 font-bold align-top mr-1">R$</span>{formattedTotalBrl}</span>}
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
                {t("Enviar_Pedido")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FavoritesPage({ items, onSelectProduct, onAddToCart, onRemove, onBack }) {
  const { t } = useTranslation();
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 font-bold mb-8 transition-colors bg-white/50 hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        {t("Volver_Inicio")}
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
        <div className="bg-rose-50/50 p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm flex-1 relative overflow-hidden w-full">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight flex items-center gap-3 mb-3">
              <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
              {t("Mis_Favoritos")}
            </h1>
            <p className="text-rose-700 text-base sm:text-lg font-medium">{t("Tus_productos")}</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-4">
          <div className="bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Heart className="w-12 h-12 text-rose-300" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">{t("Tu_lista_vacia")}</p>
          <p className="text-slate-500 font-medium max-w-md mx-auto">{t("Navega_por")}</p>
          <button 
            onClick={onBack}
            className="mt-8 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-teal-500/20 active:scale-95"
          >
            {t("Explorar_Catalogo")}
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
                <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 line-clamp-2">{t(product.name)}</h3>
                
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-2xl font-black text-teal-600">
                    {product.price ? `Gs. ${product.price}` : ''} 
                            {product.price && product.price_brl ? <span className="text-slate-300 mx-1 font-normal">|</span> : ''} 
                            {product.price_brl ? `R$ ${product.price_brl}` : ''}
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

function ReviewsModal({ product, onClose }) {
  const { t } = useTranslation();
  const [view, setView] = useState('list'); // 'list' | 'warning' | 'profile' | 'write'
  const { reviews, setReviews } = React.useContext(ProductContext);
  const productReviews = reviews.filter(r => r.productId === product.id);
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('BodyLab_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [profileForm, setProfileForm] = useState({ nombre: '', apellido: '', avatar: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileForm.nombre || !profileForm.apellido || !profileForm.avatar) {
      alert("Por favor completá tu nombre, apellido y subí una foto de perfil. Son obligatorios.");
      return;
    }
    const newUser = { ...profileForm };
    localStorage.setItem('BodyLab_user', JSON.stringify(newUser));
    setUserProfile(newUser);
    setView('write');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.text) return;

    const textLower = reviewForm.text.toLowerCase();
    const badWords = ["puto", "puta", "mierda", "carajo", "boludo", "pelotudo", "idiota", "estupido", "pendejo", "concha", "verga", "culo"];
    if (badWords.some(w => new RegExp('\\b' + w + '\\b', 'i').test(textLower))) {
      alert("¡Epa rey! Nada de groserías por acá. Escribí bien o no comentés.");
      return;
    }

    const newReview = {
      id: Date.now(),
      productId: product.id,
      author: `${userProfile.nombre} ${userProfile.apellido}`,
      avatar: userProfile.avatar,
      rating: reviewForm.rating,
      date: "Ahora",
      text: reviewForm.text
    };
    setReviews([newReview, ...reviews]);
    setView('list');
    setReviewForm({ rating: 5, text: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen no debe superar los 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm({ ...profileForm, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEscribirClick = () => {
    if (userProfile) {
      setView('write');
    } else {
      setView('warning');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border border-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between text-slate-800 bg-slate-50/50">
          <div className="flex items-center gap-3">
            {view !== 'list' && (
              <button onClick={() => setView('list')} className="bg-white p-2 text-slate-400 hover:text-teal-600 rounded-xl shadow-sm border border-slate-200 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="bg-amber-100 p-3 rounded-2xl">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                {view === 'list' ? 'Reseñas' : view === 'warning' ? 'Aviso Importante' : view === 'profile' ? 'Tu Perfil' : 'Escribir Reseña'}
              </h2>
              {view === 'list' && <p className="text-xs text-slate-500 font-bold uppercase mt-1">del producto</p>}
              {view === 'warning' && <p className="text-xs text-rose-500 font-bold uppercase mt-1">Requisito</p>}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {view === 'list' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-amber-500">{product.rating}</span>
                  <div className="flex flex-col">
                    <div className="flex text-amber-500 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-500">{product.reviews + productReviews.length} valoraciones</span>
                  </div>
                </div>
                <button 
                  onClick={handleEscribirClick}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-xl shadow text-sm transition-colors active:scale-95"
                >
                  Escribir reseña
                </button>
              </div>

              <div className="space-y-4">
                {productReviews.map((r) => (
                  <div key={r.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {r.avatar ? (
                          <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full object-cover shadow-sm bg-white" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-black text-sm uppercase shadow-sm">
                            {r.author.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight">{r.author}</p>
                          <p className="text-xs text-slate-400">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'fill-current' : 'opacity-30'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{r.text}</p>
                    {r.adminReply && (
                      <div className="mt-4 bg-teal-50 border border-teal-100 p-3 rounded-xl ml-4 relative">
                        <div className="absolute -left-2 top-4 w-4 h-4 bg-teal-50 border-t border-l border-teal-100 -rotate-45"></div>
                        <p className="text-xs font-black text-teal-800 mb-1 flex items-center gap-1">👑 Respuesta de BodyLab:</p>
                        <p className="text-sm text-teal-700 italic">{r.adminReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'warning' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-8">
              <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-rose-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">¡Registro Obligatorio!</h3>
              <p className="text-slate-600 font-medium max-w-sm mx-auto mb-8 line-clamp-3">
                Para dejar valoraciones y reseñas en nuestra plataforma, necesitás crear tu perfil con nombre, apellido y una <strong className="text-rose-600 font-black">foto obligatoria</strong>. Es por seguridad y para mantener la comunidad real.
              </p>
              <button 
                onClick={() => setView('profile')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-slate-800/20 transition-all active:scale-95"
              >
                Crear mi perfil ahora
              </button>
            </div>
          )}

          {view === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <p className="text-slate-500 font-medium">Completá tus datos por única vez. ¡La foto es obligatoria, rey!</p>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="flex flex-col items-center mb-6">
                  <div className={`relative group cursor-pointer mb-2 rounded-full ${!profileForm.avatar ? 'ring-4 ring-rose-100 ring-offset-2' : 'ring-4 ring-teal-100 ring-offset-2'} transition-all`}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      onChange={handleImageChange}
                      required={!profileForm.avatar}
                    />
                    {profileForm.avatar ? (
                      <img src={profileForm.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center shadow-inner group-hover:bg-slate-100 transition-colors">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                    <span className={`absolute bottom-0 right-0 ${profileForm.avatar ? 'bg-teal-500' : 'bg-rose-500'} text-white p-2 rounded-full shadow-lg border-2 border-white z-0 pointer-events-none group-hover:scale-110 transition-transform`}>
                      <Camera className="w-4 h-4" />
                    </span>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${profileForm.avatar ? 'text-teal-600' : 'text-rose-500'}`}>
                    {profileForm.avatar ? 'Foto lista ✓' : 'Subí tu Foto *'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t("Nombre")}</label>
                    <input required value={profileForm.nombre} onChange={e => setProfileForm({...profileForm, nombre: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all font-medium" placeholder="Juan" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Apellido *</label>
                    <input required value={profileForm.apellido} onChange={e => setProfileForm({...profileForm, apellido: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all font-medium" placeholder="Pérez" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-teal-500/30 transition-all active:scale-95 mt-4">
                  Guardar Perfil y Continuar
                </button>
              </form>
            </div>
          )}

          {view === 'write' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt={userProfile.nombre} className="w-12 h-12 rounded-full object-cover shadow-sm bg-white" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-black text-lg uppercase shadow-sm">
                    {userProfile.nombre.charAt(0)}{userProfile.apellido.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-800 leading-tight">{userProfile.nombre} {userProfile.apellido}</p>
                  <button onClick={() => setView('profile')} className="text-xs text-teal-600 font-bold hover:underline">Editar perfil</button>
                </div>
              </div>

              <form onSubmit={handleReviewSubmit} className="flex-1 flex flex-col">
                <div className="mb-6 flex flex-col items-center">
                  <p className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">¿Qué te pareció el producto?</p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(i => (
                      <button 
                        key={i} 
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: i})}
                        className="p-1 hover:scale-110 transition-transform active:scale-95"
                      >
                        <Star className={`w-10 h-10 ${i <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} transition-colors`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 min-h-[120px] mb-4">
                  <textarea 
                    required 
                    value={reviewForm.text} 
                    onChange={e => setReviewForm({...reviewForm, text: e.target.value})}
                    className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all resize-none font-medium text-slate-700"
                    placeholder="Escribí tu opinión sobre el producto. ¿Cumplió tus expectativas? ¿Lo recomendarías?"
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 mt-auto">
                  <MessageSquare className="w-5 h-5" />
                  Publicar Reseña
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
function PriceInputContainer({ formData, handlePriceChange, handleBrlPriceChange }) {
  const [currency, setCurrency] = useState('GS');
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-bold text-slate-700">Precio</label>
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button type="button" onClick={() => setCurrency('GS')} className={`px-2 py-1 flex-1 text-[10px] uppercase font-bold rounded-md transition-all ${currency === 'GS' ? 'bg-white text-teal-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>Gs.</button>
          <button type="button" onClick={() => setCurrency('BRL')} className={`px-2 py-1 flex-1 text-[10px] uppercase font-bold rounded-md transition-all ${currency === 'BRL' ? 'bg-white text-teal-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>R$</button>
        </div>
      </div>
      {currency === 'GS' ? (
        <input required value={formData.price} onChange={handlePriceChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400 font-bold text-teal-600" placeholder="1.000" />
      ) : (
        <input required value={formData.price_brl} onChange={handleBrlPriceChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400 font-bold text-teal-600" placeholder="0,00" />
      )}
    </div>
  );
}
