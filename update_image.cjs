const fs = require('fs');
const path = 'src/data/services.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/(id:\s*"10"[\s\S]*?image:\s*)"data:image[^"]*"/, '$1"/moving.jpg"');
fs.writeFileSync(path, content, 'utf8');
console.log('Replaced successfully');
