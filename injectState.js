import fs from 'fs';
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  `const [toast, setToast] = useState({ show: false, message: '', type: 'error' });`,
  `const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  
  // 상태 변수 복구
  const [serverStatus, setServerStatus] = useState<'online'|'offline'>('online');
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    const handleNetStatus = (e: any) => setServerStatus(e.detail.isOffline ? 'offline' : 'online');
    window.addEventListener('app-network-status', handleNetStatus);
    return () => window.removeEventListener('app-network-status', handleNetStatus);
  }, []);

  useEffect(() => {
    const handleSyncStatus = (e: any) => {
      const ts = new Date(e.detail.syncedAt).getTime();
      // @ts-ignore
      if (!window.__globalMaxSync || ts > window.__globalMaxSync) {
        // @ts-ignore
        window.__globalMaxSync = ts;
        const date = new Date(ts);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        setLastSynced(\`\${mm}-\${dd} \${hh}:\${min}\`);
      }
    };
    window.addEventListener('sync-status', handleSyncStatus);
    return () => window.removeEventListener('sync-status', handleSyncStatus);
  }, []);`
);

fs.writeFileSync('src/App.tsx', c);
console.log('States restored successfully!');
