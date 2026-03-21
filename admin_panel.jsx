import React, {useState, useEffect} from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
const ProductContext = React.createContext();
function AdminPanel() {
  const { products, setProducts, slides, setSlides, reviews, setReviews } = React.useContext(ProductContext);
  const [activeTab, setActiveTab] = useState('products');
  
  // Reseñas Modal State
  const [replyingToReview, setReplyingToReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Products state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', desc: '', price: '', image: '', badge: ''
  });

  // Banners state
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerData, setBannerData] = useState({
    title: '', subtitle: '', cta: '', bgImg: '', color: 'from-amber-900/90 to-amber-800/40', badge: ''
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

  const handleBannerSave = (e) => {
    e.preventDefault();
    if (editingBannerId) {
      setSlides(slides.map(b => b.id === editingBannerId ? { ...bannerData, id: editingBannerId } : b));
    } else {
      const newId = slides.length > 0 ? Math.max(...slides.map(b => b.id)) + 1 : 1;
      setSlides([{ ...bannerData, id: newId }, ...slides]);
    }
    setBannerData({ title: '', subtitle: '', cta: '', bgImg: '', color: 'from-amber-900/90 to-amber-800/40', badge: '' });
    setEditingBannerId(null);
  };
  
  const handleBannerEdit = (b) => {
    setEditingBannerId(b.id);
    setBannerData({ ...b });
  };
  
  const handleBannerDelete = (id) => {
    if(window.confirm('¿Seguro que querés borrar este Banner?')) {
      setSlides(slides.filter(b => b.id !== id));
    }
  };


  const formatPrice = (val) => {
    if (!val) return '';
    let raw = String(val).replace(/\D/g, '');
    if (!raw) return '';
    return parseInt(raw, 10).toLocaleString('de-DE'); // 1.000
  };

  const handlePriceChange = (e) => {
    setFormData({ ...formData, price: formatPrice(e.target.value) });
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
      price: prod.price || '', 
      image: prod.image || '',
      badge: prod.badge || ''
    });
  };

  const handleDelete = (id) => {
    if(window.confirm('¿Seguro que querés borrar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId, rating: p.rating, reviews: p.reviews, features: p.features } : p));
    } else {
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      setProducts([{ ...formData, id: newId, rating: 5.0, reviews: 0, features: [] }, ...products]);
    }
    setFormData({ name: '', brand: '', category: '', desc: '', price: '', image: '', badge: '' });
    setEditingId(null);
  };

  const handleCancelNew = () => {
    setFormData({ name: '', brand: '', category: '', desc: '', price: '', image: '', badge: '' });
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
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Precio (Gs.)</label>
                <input required value={formData.price} onChange={handlePriceChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400 font-bold text-teal-600" placeholder="1.000" />
              </div>
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
                    <td className="p-4 font-black text-teal-600 whitespace-nowrap">Gs. {p.price}</td>
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
                    <label className="block text-sm font-bold text-slate-700 mb-1">Filtro de Color / Sombra</label>
                    <select required value={bannerData.color} onChange={e => setBannerData({...bannerData, color: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400">
                      <option value="from-teal-900/90 to-teal-800/40">Turquesa Farma</option>
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
                           <div className="flex items-center gap-2 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleBannerEdit(b)} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg">Editar</button>
                             <button onClick={() => handleBannerDelete(b.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                           </div>
                         </td>
                       </tr>
                     ))}
                     {slides.length === 0 && (
                        <tr><td colSpan="3" className="p-10 text-center text-slate-400">No hay banners activos.</td></tr>
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
                         <td className="p-4 font-bold text-teal-600">{r.productId}</td>
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
                             <button onClick={() => {
                               if(window.confirm('¿Borrar reseña inapropiada?')) {
                                 setReviews(reviews.filter(rev => rev.id !== r.id));
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
                onClick={() => {
                  setReviews(reviews.map(rev => rev.id === replyingToReview.id ? { ...rev, adminReply: replyText } : rev));
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
    </div>
  );
}

