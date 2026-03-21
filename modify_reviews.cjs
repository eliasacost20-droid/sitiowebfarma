const fs = require('fs');
const parser = require('@babel/parser');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Initial Data
const initialReviewsCode = `
const initialReviewsData = [
  { id: 1, productId: 1, author: "María Gómez", avatar: "", rating: 5, date: "Hace 2 días", text: "Excelente producto, me llegó súper rápido y en perfectas condiciones. Muy recomendado para quienes buscan calidad." },
  { id: 2, productId: 1, author: "Carlos Ruiz", avatar: "", rating: 4, date: "Hace 1 semana", text: "Muy buena calidad, cumple lo que promete. El precio me pareció justo comparado con la competencia." }
];
`;
if (!code.includes('initialReviewsData')) {
  code = code.replace('const initialSlidesData = [', initialReviewsCode + '\nconst initialSlidesData = [');
}

// 2. Context state
if (!code.includes('const [reviews, setReviews] = useState(initialReviewsData);')) {
  code = code.replace(
    'const [slides, setSlides] = useState(initialSlidesData);',
    'const [slides, setSlides] = useState(initialSlidesData); const [reviews, setReviews] = useState(initialReviewsData);'
  );
  code = code.replace(
    'value={{ products, setProducts, slides, setSlides }}',
    'value={{ products, setProducts, slides, setSlides, reviews, setReviews }}'
  );
}

// 3. AdminPanel Tabs
code = code.replace(
  /<button onClick=\{\(\) => setActiveTab\('banners'\)\}.*?Anuncios y Carrusel<\/button>/,
  `$&
         <button onClick={() => setActiveTab('reviews')} className={\`px-6 py-2.5 rounded-xl font-bold transition-all \${activeTab === 'reviews' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}\`}>Control de Reseñas</button>`
);

// 4. AdminPanel Review section
if(!code.includes("activeTab === 'reviews'")) {
  const reviewsAdminPanel = `

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
                       <th className="p-4">ID Prod</th>
                       <th className="p-4">Comentario</th>
                       <th className="p-4">Acciones</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {reviews.map(r => (
                       <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="p-4 font-bold text-sm text-slate-800">{r.author}</td>
                         <td className="p-4 font-bold text-teal-600">{r.productId}</td>
                         <td className="p-4 text-xs text-slate-600 max-w-md truncate">{r.text}</td>
                         <td className="p-4">
                           <button onClick={() => {
                             if(window.confirm('¿Borrar reseña inapropiada?')) {
                               setReviews(reviews.filter(rev => rev.id !== r.id));
                             }
                           }} className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold">
                              Borrar
                           </button>
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
    </div>
  );
}`;

  code = code.replace(/      \)\}\n    <\/div>\n  \);\n\}/, reviewsAdminPanel);
}

// 5. Update Admin context pull
code = code.replace(
  'const { products, setProducts, slides, setSlides } = React.useContext(ProductContext);',
  'const { products, setProducts, slides, setSlides, reviews, setReviews } = React.useContext(ProductContext);'
);

// 6. Update ReviewsModal context pull
let reviewsLocalStateRegex = /const \[reviews, setReviews\] = useState\(\[\s*\{[\s\S]*?\}\s*\]\);/;
if (reviewsLocalStateRegex.test(code)) {
  code = code.replace(reviewsLocalStateRegex, `const { reviews, setReviews } = React.useContext(ProductContext);\n  const productReviews = reviews.filter(r => r.productId === product.id);`);
}

// 7. Update ReviewsModal properties
code = code.replace(/\{product\.reviews \+ reviews\.length - 2\} valoraciones/g, '{product.reviews + productReviews.length} valoraciones');
code = code.replace(/\{reviews\.map\(\(r\) => \(/g, '{productReviews.map((r) => (');

// 8. Profanity check in handleReviewSubmit
const oldSubmit = `    const newReview = {
      id: Date.now(),
      author: \`\${userProfile.nombre} \${userProfile.apellido}\`,
      avatar: userProfile.avatar,
      rating: reviewForm.rating,
      date: "Ahora",
      text: reviewForm.text
    };
    setReviews([newReview, ...reviews]);`;

const badWords = ["puto", "puta", "mierda", "carajo", "boludo", "pelotudo", "idiota", "estupido", "estupida", "pendejo", "concha", "verga", "culo"];
const profanityCheck = `
    const textLower = reviewForm.text.toLowerCase();
    const groserias = ${JSON.stringify(badWords)};
    const holdsBadWord = groserias.some(word => {
       const regex = new RegExp('\\\\b' + word + '\\\\b', 'i');
       return regex.test(textLower);
    });

    if (holdsBadWord) {
      alert("¡Epa rey! Nada de groserías por acá. Escribí bien o no comentés.");
      return;
    }

    const newReview = {
      id: Date.now(),
      productId: product.id,
      author: \`\${userProfile.nombre} \${userProfile.apellido}\`,
      avatar: userProfile.avatar,
      rating: reviewForm.rating,
      date: "Ahora",
      text: reviewForm.text
    };
    setReviews([newReview, ...reviews]);`;
code = code.replace(oldSubmit, profanityCheck);

// Save with safety check
try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  fs.writeFileSync('src/App.jsx', code);
  console.log('Successfully updated reviews feature.');
} catch (e) {
  console.log('SYNTAX ERROR generated by script.');
  console.log('Error:', e.message);
  console.log('Line:', e.loc.line);
}
