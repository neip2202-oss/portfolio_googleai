import fs from 'fs';
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  `  useEffect(() => {
    const handleGlobalToast = (e: any) => {`,
  `  useEffect(() => {
    // 1회성 로컬 캐시 대청소 (Base64 용량 초과 문제 해결)
    if (!localStorage.getItem('cache_purged_v2')) {
       console.log('Purging bloated local cache...');
       const keysToRemove = [];
       for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('cache_')) keysToRemove.push(key);
       }
       keysToRemove.forEach(k => localStorage.removeItem(k));
       localStorage.setItem('cache_purged_v2', 'true');
       console.log('Cache purge complete. Reloading fresh data from server.');
       window.location.reload(); // 즉시 새로고침하여 찌꺼기 없는 상태로 쾌적하게 다시 시작
    }
  }, []);

  useEffect(() => {
    const handleGlobalToast = (e: any) => {`
);

fs.writeFileSync('src/App.tsx', c);
console.log('Cache Purge logic correctly added');
