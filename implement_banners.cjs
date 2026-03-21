const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Defino initialSlidesData arriba (antes de export default function App)
const initialSlidesDataCode = `
const initialSlidesData = [
  {
    id: 1,
    title: "Cuida_tu_salud",
    subtitle: "Hasta_30",
    cta: "Ver_Ofertas",
    bgImg: "https://images.unsplash.com/photo-1584308666744-24d5e478dc05?auto=format&fit=crop&q=80&w=2000",
    color: "from-teal-900/90 to-teal-800/40",
    badge: "Oferta_Especial"
  },
  {
    id: 2,
    title: "Cuidado_Piel",
    subtitle: "Descubre_marcas",
    cta: "Descubrir_Dermo",
    bgImg: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=2000",
    color: "from-blue-900/90 to-blue-800/40",
    badge: null
  }
];

export default function App`;
code = code.replace('export default function App', initialSlidesDataCode);

// 2. Agrego slides al contexto en App
code = code.replace(
  'const [products, setProducts] = useState(initialProductsData); const [selectedProduct, setSelectedProduct] = useState(null);',
  'const [products, setProducts] = useState(initialProductsData); const [slides, setSlides] = useState(initialSlidesData); const [selectedProduct, setSelectedProduct] = useState(null);'
);

code = code.replace(
  '<ProductContext.Provider value={{ products, setProducts }}>',
  '<ProductContext.Provider value={{ products, setProducts, slides, setSlides }}>'
);


// 3. Modifico AdminPanel para agregar Tabs
// Reemplazo la primera parte de AdminPanel
const adminPanelStartRegex = /function AdminPanel\(\) \{\s*const \{ products, setProducts \} = React\.useContext\(ProductContext\);\s*const \[editingId, setEditingId\] = useState\(null\);\s*const \[formData, setFormData\] = useState\(\{([^}]+)\}\);/;

const adminPanelNewStart = `function AdminPanel() {
  const { products, setProducts, slides, setSlides } = React.useContext(ProductContext);
  const [activeTab, setActiveTab] = useState('products');
  
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
`;
code = code.replace(adminPanelStartRegex, adminPanelNewStart);

// Ahora envuelvo el return de AdminPanel con las Tabs
const adminPanelReturnRegex = /(return \(\s*)(<div className="flex flex-col xl:flex-row gap-8 w-full">)/;
const tabsCode = `<div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
         <button onClick={() => setActiveTab('products')} className={\`px-6 py-2.5 rounded-xl font-bold transition-all \${activeTab === 'products' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}\`}>Inventario de Productos</button>
         <button onClick={() => setActiveTab('banners')} className={\`px-6 py-2.5 rounded-xl font-bold transition-all \${activeTab === 'banners' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}\`}>Anuncios y Carrusel</button>
      </div>
      
      {activeTab === 'products' && (`;

code = code.replace(adminPanelReturnRegex, `$1${tabsCode}\n$2`);

// Y al final del AdminPanel le pongo el renderizador de Banners
const adminPanelEndRegex = /        <\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/;

const bannersUI = `        </div>
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
                    <button type="submit" className={\`\${editingBannerId ? 'w-2/3' : 'w-full'} p-3 rounded-xl font-black text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm\`}>
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
                                <div className={\`absolute inset-0 bg-gradient-to-r \${b.color}\`} />
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
      </div>
  );
}`;
code = code.replace(adminPanelEndRegex, bannersUI);


// 4. Modificar HeroCarousel
const heroRegex = /function HeroCarousel\(\) \{[\s\S]*?const \[current, setCurrent\] = useState\(0\);/;
const heroNew = `function HeroCarousel() {
  const { t } = useTranslation();
  const { slides } = React.useContext(ProductContext);

  const [current, setCurrent] = useState(0);`;

code = code.replace(heroRegex, heroNew);

// 5. Y la etiqueta del slide que ahora viene parametrizada
const heroSlideLabelRegex = /<span className="inline-block py-1 px-3 rounded-xl bg-white\/20 text-white backdrop-blur-md text-xs sm:text-sm font-bold mb-3 border border-white\/30 shadow-lg">\s*\{t\("Oferta_Especial"\)\}\s*<\/span>/g;
const heroSlideLabelNew = `{slide.badge && (
                <span className="inline-block py-1 px-3 rounded-xl bg-white/20 text-white backdrop-blur-md text-xs sm:text-sm font-bold mb-3 border border-white/30 shadow-lg">
                  {t(slide.badge)}
                </span>
              )}`;
code = code.replace(heroSlideLabelRegex, heroSlideLabelNew);

fs.writeFileSync('src/App.jsx', code);
console.log('AdminPanel Banner Management implemented!');
