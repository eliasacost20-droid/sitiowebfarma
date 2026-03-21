const fs = require('fs');
const parser = require('@babel/parser');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Modificar ReviewsModal para mostrar la respuesta del admin.
const reviewsModalTextRegex = /<p className="text-sm text-slate-600 leading-relaxed font-medium">\{r\.text\}<\/p>/g;
const reviewsModalReplica = \`
<p className="text-sm text-slate-600 leading-relaxed font-medium">{r.text}</p>
{r.adminReply && (
  <div className="mt-3 bg-teal-50 border border-teal-100 p-3 rounded-xl ml-4 sm:ml-8 relative">
    <div className="absolute -left-2 top-4 w-4 h-4 bg-teal-50 border-l border-b border-teal-100 rotate-45 transform"></div>
    <p className="text-xs font-black text-teal-800 mb-1 flex items-center gap-1">👑 Respuesta de FarmaVida:</p>
    <p className="text-sm text-teal-700 font-medium">{r.adminReply}</p>
  </div>
)}
\`;
if (!code.includes('r.adminReply')) {
  code = code.replace(reviewsModalTextRegex, reviewsModalReplica);
}

// 2. Modificar el Admin Panel en la tabla de Reviews
// Buscar el <td> del comentario y el de las acciones.
const adminTableTextDesc = /<td className="p-4 text-xs text-slate-600 max-w-md truncate">\{r\.text\}<\/td>/;
const newAdminTableText = \`<td className="p-4 max-w-md">
  <p className="text-xs text-slate-600 truncate mb-1">{r.text}</p>
  {r.adminReply && (
    <div className="bg-teal-50 p-2 rounded-lg border border-teal-100 w-full">
      <p className="text-[10px] font-bold text-teal-800 uppercase">Tu Respuesta:</p>
      <p className="text-xs text-teal-700 italic truncate">{r.adminReply}</p>
    </div>
  )}
</td>\`;
code = code.replace(adminTableTextDesc, newAdminTableText);

const adminTableActionsRegex = /<td className="p-4">\s*<button onClick=\{\(\) => \{\s*if\(window\.confirm\('¿Borrar reseña inapropiada\?'\)\) \{\s*setReviews\(reviews\.filter\(rev => rev\.id !== r\.id\)\);\s*\}\s*\}\} className="[^"]*">\s*Borrar\s*<\/button>\s*<\/td>/;

const newAdminTableActions = \`<td className="p-4">
  <div className="flex flex-col gap-2">
    <button onClick={() => {
      const reply = window.prompt('Escribí tu respuesta para ' + r.author + ':', r.adminReply || '');
      if (reply !== null) {
        setReviews(reviews.map(rev => rev.id === r.id ? { ...rev, adminReply: reply } : rev));
      }
    }} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg text-[11px] font-bold border border-teal-100 transition-colors">
      Contestar
    </button>
    <button onClick={() => {
      if(window.confirm('¿Borrar esta reseña para siempre?')) {
        setReviews(reviews.filter(rev => rev.id !== r.id));
      }
    }} className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold w-full text-center">
      Borrar
    </button>
  </div>
</td>\`;
code = code.replace(adminTableActionsRegex, newAdminTableActions);

// Validamos la sintaxis
try {
  parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  fs.writeFileSync('src/App.jsx', code);
  console.log('Se agregó la función de contestar reseñas.');
} catch (e) {
  console.error('SYNTAX ERROR EN SCRIPT:', e.message);
}
