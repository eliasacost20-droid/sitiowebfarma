const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add Import
if (!code.includes("import { supabase }")) {
  code = code.replace(/import React.*?;/, "$&\nimport { supabase } from './supabase';");
}

// 2. Add useEffect to fetch data on mount
const fetchCode = `
  useEffect(() => {
    async function loadData() {
      const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (prods) setProducts(prods);
      const { data: bals } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
      if (bals) setSlides(bals);
      const { data: revs } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (revs) setReviews(revs);
    }
    loadData();
  }, []);
`;
if (!code.includes("async function loadData()")) {
  code = code.replace(/const \[reviews, setReviews\] = useState\(initialReviewsData\);/, "const [reviews, setReviews] = useState([]);\n" + fetchCode);
  code = code.replace(/const \[products, setProducts\] = useState\(initialProductsData\);/, "const [products, setProducts] = useState([]);");
  code = code.replace(/const \[slides, setSlides\] = useState\(initialSlidesData\);/, "const [slides, setSlides] = useState([]);");
}

// 3. AdminPanel - Product handleSave
code = code.replace(/const handleSave =.*?\{[\s\S]*?e\.preventDefault\(\);[\s\S]*?if \(editingId\) \{[\s\S]*?setProducts\(products\.map[\s\S]*?\);[\s\S]*?\} else \{[\s\S]*?setProducts\(\[\{.*?\}, \.\.\.products\]\);[\s\S]*?\}[\s\S]*?setFormData[\s\S]*?setEditingId\(null\);\n  \};/m, 
`const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { data, error } = await supabase.from('products').update(formData).eq('id', editingId).select().single();
      if (!error && data) setProducts(products.map(p => p.id === editingId ? data : p));
    } else {
      const { data, error } = await supabase.from('products').insert(formData).select().single();
      if (!error && data) setProducts([data, ...products]);
    }
    setFormData({ name: '', brand: '', category: '', desc: '', price: '', image: '', badge: '' });
    setEditingId(null);
  };`);

// 4. AdminPanel - Product handleDelete
code = code.replace(/const handleDelete = \(id\) => \{[\s\S]*?if\(window\.confirm[\s\S]*?setProducts.*?\)[\s\S]*?\}[\s\S]*?\};/m,
`const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que querés borrar este producto?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if(!error) setProducts(products.filter(p => p.id !== id));
    }
  };`);

// 5. AdminPanel - Banner handleBannerSave
code = code.replace(/const handleBannerSave = \(e\) => \{[\s\S]*?e\.preventDefault\(\);[\s\S]*?if \(editingBannerId\) \{[\s\S]*?setSlides\(slides\.map[\s\S]*?\);[\s\S]*?\} else \{[\s\S]*?setSlides\(\[\{.*?\}, \.\.\.slides\]\);[\s\S]*?\}[\s\S]*?setBannerData[\s\S]*?setEditingBannerId\(null\);\n  \};/m,
`const handleBannerSave = async (e) => {
    e.preventDefault();
    const payload = { ...bannerData };
    if (payload.productId === '') payload.product_id = null;
    else payload.product_id = payload.productId; // mapping camelCase to snake_case if needed by Supabase, wait actually my table has product_id but form has productId
    
    if (editingBannerId) {
      const { data, error } = await supabase.from('banners').update(payload).eq('id', editingBannerId).select().single();
      if (!error && data) setSlides(slides.map(b => b.id === editingBannerId ? data : b));
    } else {
      const { data, error } = await supabase.from('banners').insert(payload).select().single();
      if (!error && data) setSlides([data, ...slides]);
    }
    setBannerData({ title: '', subtitle: '', cta: '', bgImg: '', color: 'from-amber-900/90 to-amber-800/40', badge: '', productId: '' });
    setEditingBannerId(null);
  };`);

// 6. AdminPanel - Banner handleBannerDelete
code = code.replace(/const handleBannerDelete = \(id\) => \{[\s\S]*?if\(window\.confirm[\s\S]*?setSlides.*?\)[\s\S]*?\}[\s\S]*?\};/m,
`const handleBannerDelete = async (id) => {
    if(window.confirm('¿Seguro que querés borrar este Banner?')) {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if(!error) setSlides(slides.filter(b => b.id !== id));
    }
  };`);

// 7. Modificar AdminPanel Reviews Delete y Reply
code = code.replace(/setReviews\(reviews\.filter\(rev => rev\.id !== r\.id\)\);/g, 
"await supabase.from('reviews').delete().eq('id', r.id); setReviews(reviews.filter(rev => rev.id !== r.id));");

code = code.replace(/setReviews\(reviews\.map\(rev => rev\.id === replyingToReview\.id \? \{ \.\.\.rev, adminReply: replyText \} : rev\)\);/g,
"await supabase.from('reviews').update({ admin_reply: replyText }).eq('id', replyingToReview.id); setReviews(reviews.map(rev => rev.id === replyingToReview.id ? { ...rev, adminReply: replyText } : rev));");


fs.writeFileSync('src/App.jsx', code);
console.log('Integración de Supabase realizada en App.jsx con las modificaciones async completadas.');
