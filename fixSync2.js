import fs from 'fs';
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  `const handleSyncStatus = (e: any) => {
      const ts = new Date(e.detail.syncedAt).getTime();
      setLastSyncedTs(prev => {
        if (ts > prev) {
          const date = new Date(ts);
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          const hh = String(date.getHours()).padStart(2, '0');
          const min = String(date.getMinutes()).padStart(2, '0');
          setLastSynced(\`\${mm}-\${dd} \${hh}:\${min}\`);
          return ts;
        }
        return prev;
      });
    };`,
  `const handleSyncStatus = (e: any) => {
      const ts = new Date(e.detail.syncedAt).getTime();
      // Use a pure mutable ref on the window object to bypass React's async batching issues completely
      if (!window.__globalMaxSync || ts > window.__globalMaxSync) {
        window.__globalMaxSync = ts;
        const date = new Date(ts);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        setLastSynced(\`\${mm}-\${dd} \${hh}:\${min}\`);
      }
    };`
);

fs.writeFileSync('src/App.tsx', c);
console.log('Fixed sync status race condition using window object');
