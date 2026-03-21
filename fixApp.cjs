const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

const componentsToUpdate = [
    'function MainArea', 
    'function CatalogCTA', 
    'function Footer', 
    'function TrustFooter', 
    'function App', 
    'function HeroCarousel',
    'function PopularCategories',
    'function FeaturedProducts',
    'function ProductDetails',
    'function FullCatalog',
    'function CartModal',
    'function PrivacyPolicy',
    'function TermsAndConditions',
    'function FavoritesPage',
    'function ReviewsModal'
];

// Revert the bad injection
content = content.replace(/\s*const \{ t \} = useTranslation\(\);\s*/g, ' ');

// Apply it right after the closing parenthesis and opening brace of the function declarations
componentsToUpdate.forEach(comp => {
  // We look for function Name(...) {
  const regex = new RegExp(`(${comp}\\([^{]*\\)\\s*\\{)`);
  content = content.replace(regex, `$1\n  const { t } = useTranslation();`);
});

fs.writeFileSync(appPath, content, 'utf8');
console.log('Fixed syntax in App.jsx');
