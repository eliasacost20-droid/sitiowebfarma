const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Undo at FavoritesPage
// Look for FavoritesPage and its end.
const favPageStart = code.indexOf('function FavoritesPage(');
let favPageEnd = code.indexOf('function ReviewsModal(', favPageStart);
// Inside FavoritesPage, I injected 2 extra divs: 
//      )}
//      </div>
//     </div>
//    </div>
//  </div>
//  );
//}
let favPageCode = code.slice(favPageStart, favPageEnd);
let oldFavPageEnd = `      )}
      </div>
     </div>
    </div>
  </div>
  );
}`;
let newFavPageEnd = `      )}
      </div>
    </div>
  );
}`;

favPageCode = favPageCode.replace(oldFavPageEnd, newFavPageEnd);
code = code.slice(0, favPageStart) + favPageCode + code.slice(favPageEnd);

// 2. Fix AdminPanel ending (around line 760)
// It currently ends with:
//      )}
//      </div>
//    </div>
//  );
//}
//
// And we know it originally needed 2 more divs.
// Wait, AdminPanel's bannersUI string ended with:
//                      {slides.length === 0 && (
//                         <tr><td colSpan="3" ...>...</td></tr>
//                      )}
//                    </tbody>
//                  </table>
//                </div>
//             </div>
//          </div>
//       </div>
//       )}
//       </div>
//    </div>
//  );
//}
const adminPanelStart = code.indexOf('function AdminPanel() {');
let adminPanelEnd = code.indexOf('function ProductDetails(', adminPanelStart);

let adminCode = code.slice(adminPanelStart, adminPanelEnd);

const oldAdminEnd = `      )}
      </div>
    </div>
  );
}`;
const newAdminEnd = `      )}
      </div>
     </div>
    </div>
  </div>
  );
}`;

adminCode = adminCode.replace(oldAdminEnd, newAdminEnd);
code = code.slice(0, adminPanelStart) + adminCode + code.slice(adminPanelEnd);

fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx fixed manually.');
