const fs = require('fs');
const p = 'd:/portfolio/portfolio_googleai/src/App.tsx';
let c = fs.readFileSync(p, 'utf8');

// 모든 img 태그에 referrerPolicy="no-referrer" 주입
c = c.replace(/<img /g, '<img referrerPolicy="no-referrer" ');

// 중복된 경우 정리
c = c.replace(/(referrerPolicy="no-referrer"\s*)+/g, 'referrerPolicy="no-referrer" ');

fs.writeFileSync(p, c);
console.log('Successfully injected referrerPolicy to App.tsx');
