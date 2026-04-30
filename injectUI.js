import fs from 'fs';
let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Footer CTA Update (Last Synced & Version)
c = c.replace(
  '© {new Date().getFullYear()} 이솔잎 (Lee Solip). All rights reserved.',
  `© {new Date().getFullYear()} 이솔잎 (Lee Solip). All rights reserved.
          <div className="flex items-center justify-center gap-2 mt-2 text-xs opacity-70">
            <span>v1.0.1</span>
            <span>•</span>
            <span>Last Synced: {lastSynced || 'Unknown'}</span>
          </div>`
);

// 2. Nav top spacing and Admin Warning Banner
c = c.replace(
  '<nav className="print:hidden fixed w-full top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">',
  `{isAdmin && serverStatus === 'offline' && (
         <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-[11px] font-bold py-1.5 text-center z-[100] shadow-md flex items-center justify-center gap-1.5">
            ⚠️ 현재 서버가 불안정하여 변경사항이 실시간으로 저장되지 않을 수 있습니다.
         </div>
      )}
      <nav className={\`print:hidden fixed w-full \${isAdmin && serverStatus === 'offline' ? 'top-7' : 'top-0'} z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all\`}>`
);

// 3. Server Status Badge next to Edit Mode button
c = c.replace(
  '<div className="w-px h-4 bg-gray-200 ml-2"></div>',
  `<div className="w-px h-4 bg-gray-200 mx-2"></div>
            {/* 서버 상태 배지 */}
            <div className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-colors \${serverStatus === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}\`}>
               <span className="relative flex h-2 w-2">
                 {serverStatus === 'online' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                 <span className={\`relative inline-flex rounded-full h-2 w-2 \${serverStatus === 'online' ? 'bg-emerald-500' : 'bg-yellow-500'}\`}></span>
               </span>
               <span className="tracking-wide">{serverStatus === 'online' ? 'ONLINE' : 'OFFLINE'}</span>
            </div>`
);

fs.writeFileSync('src/App.tsx', c);
console.log('UI Indicators injected successfully');
