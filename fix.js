import fs from 'fs';
const p = 'src/App.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/<img /g, '<img referrerPolicy="no-referrer" ');
c = c.replace(/(referrerPolicy="no-referrer"\\s*)+/g, 'referrerPolicy="no-referrer" ');
fs.writeFileSync(p, c);
console.log('Done modifying App.tsx');
