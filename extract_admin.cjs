const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');
const adminPanelStart = code.indexOf('function AdminPanel() {');
let adminPanelEnd = code.indexOf('function ProductDetails(', adminPanelStart);
let adminCode = code.slice(adminPanelStart, adminPanelEnd);

fs.writeFileSync('admin_panel.jsx', `import React, {useState, useEffect} from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
const ProductContext = React.createContext();
` + adminCode);

console.log('Saved admin_panel.jsx');
