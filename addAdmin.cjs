const fs = require('fs');

const adminPanelCode = `
function AdminPanel() {
  const { products, setProducts } = React.useContext(ProductContext);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', desc: '', price: '', image: '', badge: ''
  });

  const formatPrice = (val) => {
    if (!val) return '';
    let raw = String(val).replace(/\\D/g, '');
    if (!raw) return '';
    return parseInt(raw, 10).toLocaleString('de-DE'); // 1.000
  };

  const handlePriceChange = (e) => {
    setFormData({ ...formData, price: formatPrice(e.target.value) });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              <label className="block text-sm font-bold text-slate-700 mb-1">URL de la Foto</label>
              <input required name="image" type="url" value={formData.image} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Etiqueta (Opcional)</label>
              <input name="badge" value={formData.badge} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-teal-400" placeholder="Ej: Nuevo, Oferta, -15%" />
            </div>
            <div className="flex gap-2 pt-2">
              {editingId && <button type="button" onClick={handleCancelNew} className="p-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors w-1/3">Cancelar</button>}
              <button type="submit" className={\`\${editingId ? 'w-2/3' : 'w-full'} p-3 rounded-xl font-black text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm\`}>
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
  );
}
`;

let content = fs.readFileSync('src/App.jsx', 'utf8');

// Insert AdminPanel before ProductDetails
content = content.replace(/(function ProductDetails)/, adminPanelCode + '\n$1');

// Call AdminPanel inside the modal
const constructionRegex = /<div className="max-w-4xl mx-auto">[\s\S]*?Sistema en construcción[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(constructionRegex, '<div className="max-w-6xl mx-auto">\n<AdminPanel />\n</div>');

fs.writeFileSync('src/App.jsx', content);
console.log('AdminPanel injected safely!');
