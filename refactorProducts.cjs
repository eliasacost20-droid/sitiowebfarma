const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Context creation
if (!content.includes('export const ProductContext = React.createContext();')) {
    content = content.replace("const productsData = [", "export const ProductContext = React.createContext();\n\nconst initialProductsData = [");
}

// 2. Inject Context usage in specific components
const componentsToInject = ['Navbar', 'ProductDetails', 'FeaturedProducts', 'FullCatalog'];
componentsToInject.forEach(comp => {
  // Find function Signature
  const r = new RegExp(`(function ${comp}\\([^{]*\\)\\s*\\{[\\s\\S]*?)(const \\{ t \\})`);
  content = content.replace(r, `$1const { products } = React.useContext(ProductContext);\n  $2`);
  // And replace productsData with products inside this component's block? 
  // We can just globally replace productsData with products AFTER replacing initialProductsData
});

// Since the whole file used productsData except for initialProductsData, let's just do a direct string replace
content = content.replace(/productsData/g, 'products');
// Put initialProductsData back
content = content.replace(/const initialproducts = \[/, 'const initialProductsData = [');

// 3. Inject state in App and wrap with Provider
const appRegex = /(function App\(\)\s*\{[\s\S]*?const \{ t \} = useTranslation\(\);)(\s*const \[selectedProduct, setSelectedProduct\] = useState\(null\);)/;
content = content.replace(appRegex, `$1\n  const [products, setProducts] = useState(initialProductsData);$2`);

const returnRegex = /(return\s*\(\s*)(<div className="min-h-screen bg-slate-50)/;
content = content.replace(returnRegex, `$1<ProductContext.Provider value={{ products, setProducts }}>\n    $2`);

// We also need to close the Provider at the very end of App
const endAppRegex = /(<\/div>\s*)\)(;\s*\n\})/m;
if (!content.includes('</ProductContext.Provider>')) {
  content = content.replace(endAppRegex, `$1</ProductContext.Provider>\n  )$2`);
}

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log("Refactored to ProductContext");
