const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Swap CTA buttons
c = c.replace(
  /<div className="flex justify-center gap-4">[\s\S]*?<button onClick={\(\) => handleNavClick\('portfolio'\)}(.*?)>([\s\S]*?)<\/button>[\s\S]*?<button onClick={\(\) => handleNavClick\('resume'\)}(.*?)>([\s\S]*?)<\/button>[\s\S]*?<\/div>/,
  `<div className="flex justify-center gap-4">
            <button onClick={() => handleNavClick('resume')} $3>$4</button>
            <button onClick={() => handleNavClick('portfolio')} $1>$2</button>
          </div>`
);

// 2. How I Work iconImg
c = c.replace(
  /<span className="text-sm font-bold text-gray-300 mb-6 block">{item\.step}<\/span>\s*<IconComp className={`w-8 h-8 \${item\.color} mb-4`} strokeWidth={2} \/>/,
  `<span className="text-sm font-bold text-gray-300 mb-6 block">{item.step}</span>
                {item.iconImg ? (
                  <img src={item.iconImg} alt={item.title} className="w-12 h-12 mb-4 object-contain" />
                ) : (
                  <IconComp className={\`w-8 h-8 \${item.color} mb-4\`} strokeWidth={2} />
                )}
                {isAdmin && (
                  <label className="text-[10px] font-bold text-blue-500 hover:text-blue-700 cursor-pointer block mb-4 border border-dashed border-blue-200 rounded p-1.5 text-center bg-blue-50/50 hover:bg-blue-100 transition-colors w-max">
                    + 커스텀 아이콘 첨부
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (b64) => { const n = [...workProcessData]; n[i].iconImg = b64; setWorkProcessData(n); })} />
                  </label>
                )}`
);

// 3. Resume Logline
c = c.replace(
  /<EditableText isAdmin={isAdmin} value={aboutData\.logline \|\| '"의도를 구조로 만들고, 구조를 명확히 완성하는 기획자"'} onChange={\(v: string\) => setAboutData\(\{...aboutData, logline: v\}\)} className="text-emerald-600 font-extrabold mb-8 text-lg md:text-xl tracking-tight block w-full" placeholder="한 줄 소개글 \(로그라인\)" \/>/,
  `{isAdmin ? (
               <EditableText isAdmin={isAdmin} value={aboutData.logline || "'의도를 구조로' 만들고 '구조를 결과로' 완성하는 기획자"} onChange={(v: string) => setAboutData({...aboutData, logline: v})} className="text-emerald-600 font-extrabold mb-8 text-lg md:text-xl tracking-tight block w-full" placeholder="한 줄 소개글 (로그라인)" />
            ) : (
               <div className="font-extrabold mb-8 text-lg md:text-xl tracking-tight text-gray-700 w-full whitespace-pre-wrap leading-relaxed">
                  {(aboutData.logline || "'의도를 구조로' 만들고 '구조를 결과로' 완성하는 기획자").split(/'([^']+)'/).map((part: string, index: number) => 
                     index % 2 === 1 ? <span key={index} className="text-emerald-600 text-2xl md:text-3xl font-black">'{part}'</span> : part
                  )}
               </div>
            )}`
);

// 4 & 5. Timeline dot fix & iconImg attachment
c = c.replace(
  /<div className={`absolute left-\[-24px\] top-1\.5 w-3\.5 h-3\.5 rounded-full border-2 border-white z-10 \${item\.type === 'career' \? 'bg-blue-500' : 'bg-gray-400 shadow-sm'}`}><\/div>\s*<div className="pl-4">/g,
  `{item.iconImg ? (
                                  <img src={item.iconImg} alt="icon" className="absolute left-[-28px] top-1 w-6 h-6 rounded-full border border-gray-200 bg-white object-cover z-10 shadow-sm" />
                               ) : (
                                  <div className={\`absolute left-[-24px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white z-10 bg-blue-500 shadow-sm\`}></div>
                               )}
                               <div className="pl-4">
                                 {isAdmin && (
                                   <label className="text-[10px] text-blue-500 hover:text-blue-700 cursor-pointer mb-2 inline-block bg-blue-50 px-2 py-0.5 rounded border border-dashed border-blue-200 hover:bg-blue-100 transition-colors">
                                     + 타임라인 아이콘 이미지 첨부
                                     <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (b64) => { const n = [...timelineLeftData]; n[idx].iconImg = b64; setTimelineLeftData(n); })} />
                                   </label>
                                 )}`
);

fs.writeFileSync('src/App.tsx', c);
