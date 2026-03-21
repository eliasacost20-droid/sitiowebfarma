const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const components = [
    'MainArea', 'CatalogCTA', 'Footer', 'TrustFooter', 
    'App', 'HeroCarousel', 'PopularCategories', 
    'FeaturedProducts', 'ProductDetails', 'FullCatalog', 
    'CartModal', 'PrivacyPolicy', 'TermsAndConditions', 
    'FavoritesPage', 'ReviewsModal'
];

components.forEach(comp => {
  const idx = content.indexOf(`function ${comp}(`);
  if (idx === -1) {
     console.log('not found:', comp);
     return;
  }
  
  let bracketDepth = 0;
  let foundArgsStart = false;
  let i = idx;
  for (; i < content.length; i++) {
     if (content[i] === '(') {
        if (!foundArgsStart) foundArgsStart = true;
        bracketDepth++;
     } else if (content[i] === ')') {
        bracketDepth--;
        if (foundArgsStart && bracketDepth === 0) {
           break;
        }
     }
  }
  
  let bodyStart = -1;
  for (let j = i + 1; j < content.length; j++) {
     if (content[j] === '{') {
         bodyStart = j;
         break;
     }
  }
  
  if (bodyStart !== -1) {
     // Ensure we don't inject multiple times if ran multiple times
     const nextText = content.slice(bodyStart + 1, bodyStart + 40);
     if (!nextText.includes('useTranslation')) {
        content = content.slice(0, bodyStart + 1) + '\n  const { t } = useTranslation();' + content.slice(bodyStart + 1);
     }
  }
});

fs.writeFileSync('src/App.jsx', content);
console.log('Fixed t injection');
