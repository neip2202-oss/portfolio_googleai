import fs from 'fs';
let c = fs.readFileSync('src/hooks/useContent.ts', 'utf8');

// 1. Fix Missed Synchronous Events with setTimeout
c = c.replace(
  `if (localUpdatedAt) window.dispatchEvent(new CustomEvent('sync-status', { detail: { syncedAt: localUpdatedAt } }));`,
  `if (localUpdatedAt) {
                 setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('sync-status', { detail: { syncedAt: localUpdatedAt } }));
                 }, 50);
              }`
);

// 2. Guarantee event dispatch even if the network fails and falls into catch block
c = c.replace(
  `window.dispatchEvent(new CustomEvent('app-network-status', { detail: { isOffline: true } }));`,
  `window.dispatchEvent(new CustomEvent('app-network-status', { detail: { isOffline: true } }));
        if (localUpdatedAt) {
           window.dispatchEvent(new CustomEvent('sync-status', { detail: { syncedAt: localUpdatedAt } }));
        }`
);

fs.writeFileSync('src/hooks/useContent.ts', c);
console.log('Fixed cache event dispatches');
