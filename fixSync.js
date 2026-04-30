import fs from 'fs';
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  "const [lastSynced, setLastSynced] = useState<string | null>(null);",
  `const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [lastSyncedTs, setLastSyncedTs] = useState<number>(0);`
);

c = c.replace(
  `const handleSyncStatus = (e: any) => {
      const date = new Date(e.detail.syncedAt);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      setLastSynced(\`\${mm}-\${dd} \${hh}:\${min}\`);
    };`,
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
    };`
);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx updated with max timestamp logic');
