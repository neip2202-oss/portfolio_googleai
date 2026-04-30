import fs from 'fs';

// 1. Update src/utils/supabase.ts
let db = fs.readFileSync('src/utils/supabase.ts', 'utf8');
if (!db.includes('supabaseUploadFile')) {
  db += `\n
export const supabaseUploadFile = async (fileBlob: Blob, filename: string): Promise<string | null> => {
  try {
    const SUPABASE_URL = 'https://wjkgjjsdbftijusbjsie.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqa2dqanNkYmZ0aWp1c2Jqc2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3OTU2MjQsImV4cCI6MjA5MTM3MTYyNH0.9uQVRZ-uDhjdJKD4LcaH3hQlmu6OKt-bOFkN_W0kvkU';
    
    const res = await fetch(\`\${SUPABASE_URL}/storage/v1/object/portfolio_media/\${filename}\`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': \`Bearer \${SUPABASE_ANON_KEY}\`,
        'Content-Type': fileBlob.type,
      },
      body: fileBlob
    });
    if (!res.ok) {
      console.warn('[Storage] Upload failed (Bucket not found). Falling back to WebP Base64.');
      return null;
    }
    return \`\${SUPABASE_URL}/storage/v1/object/public/portfolio_media/\${filename}\`;
  } catch (err) {
    console.error('[Storage] Upload error:', err);
    return null;
  }
};
`;
  fs.writeFileSync('src/utils/supabase.ts', db);
}

// 2. Update src/App.tsx handleFileUpload
let app = fs.readFileSync('src/App.tsx', 'utf8');

const newUploadLogic = `const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64OrUrl: string) => void) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX = 1200; // 1200px 제한 (1단계 최적화)
        
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = Math.round(height * (MAX / width));
            width = MAX;
          } else {
            width = Math.round(width * (MAX / height));
            height = MAX;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // 강제 WebP 60% 압축으로 Base64 크기 극단적 최소화
          const base64 = canvas.toDataURL('image/webp', 0.60);
          
          try {
            // Base64를 Blob으로 변환하여 버킷 전송 시도
            const res = await fetch(base64);
            const blob = await res.blob();
            const filename = \`img_\${Date.now()}_\${Math.random().toString(36).substring(7)}.webp\`;
            
            import('./utils/supabase').then(async ({ supabaseUploadFile }) => {
                const url = await supabaseUploadFile(blob, filename);
                if (url) {
                    callback(url); // 2단계 최적화 (URL 저장 성공)
                } else {
                    callback(base64); // 버킷 미생성 시 1단계 다이어트된 Base64로 폴백
                }
            }).catch(() => callback(base64));
          } catch (e) {
            callback(base64);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {`;

// Replace the old handleFileUpload using Regex
app = app.replace(
  /const handleFileUpload = \([\s\S]*?reader\.readAsDataURL\(file\);\s*\} else \{/,
  newUploadLogic
);

fs.writeFileSync('src/App.tsx', app);
console.log('Upload logic injected successfully');
