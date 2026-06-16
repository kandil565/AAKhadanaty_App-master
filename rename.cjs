const fs = require('fs');
const files = [
  'index.html',
  'README.md',
  'src/components/Footer.tsx',
  'src/components/Navbar.tsx',
  'src/contexts/LanguageContext.tsx',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/AAKhadanaty/g, 'Siyana Plus');
  content = content.replace(/أخدماتي/g, 'صيانة بلس');
  content = content.replace(/خدماتي/g, 'صيانة بلس');
  
  // Also maybe some specific ones if any remaining
  content = content.replace(/aakhadanaty/gi, 'siyanaplus');
  fs.writeFileSync(file, content, 'utf8');
});
console.log('Renaming complete');
