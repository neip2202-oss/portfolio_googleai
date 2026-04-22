const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove quotes from logline highlight
c = c.replace(
  /index % 2 === 1 \? <span key=\{index\} className="text-emerald-600 text-2xl md:text-3xl font-black">'\{part\}'<\/span> : part/,
  `index % 2 === 1 ? <span key={index} className="text-emerald-600 text-2xl md:text-3xl font-black">{part}</span> : part`
);

// 2. Add sectionIcons state
if (!c.includes('const [sectionIcons, setSectionIcons]')) {
  c = c.replace(
    /const \[certifications, setCertifications\] = useContent<any>\('certifications', \[[\s\S]*?\]\);/,
    `const [certifications, setCertifications] = useContent<any>('certifications', [
    { id: 1, title: 'CS Leaders (관리사)', date: '2022.05' },
    { id: 2, title: '컴퓨터활용능력 1급', date: '2021.10' }
  ]);

  const [sectionIcons, setSectionIcons] = useContent<any>('sectionIcons', {
    tech: '',
    timeline: '',
    activities: '',
    certifications: ''
  });`
  );
}

// 3. Tech Stacks Header
c = c.replace(
  /<h3 className="text-xl font-extrabold text-gray-900 mb-8 flex items-center gap-2"><Settings className="text-emerald-500"\/> Tech Stacks & Tools<\/h3>/,
  `<h3 className="text-xl font-extrabold text-gray-900 mb-8 flex items-center gap-2 relative group/section">
              {sectionIcons.tech ? <img src={sectionIcons.tech} className="w-6 h-6 object-contain" alt="icon" /> : <Settings className="text-emerald-500 w-6 h-6"/>}
              기술 스택 및 활용 툴
              {isAdmin && (
                <label className="absolute -top-4 -left-4 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-pointer bg-white border border-gray-200 shadow-lg p-1 rounded z-20 text-[10px] text-blue-500 font-bold">
                  + 아이콘 첨부
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (b64) => setSectionIcons({...sectionIcons, tech: b64}))} className="hidden" />
                </label>
              )}
            </h3>`
);

// 4. Timeline Header
c = c.replace(
  /<h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-2 border-b border-gray-200 pb-4">\s*<Briefcase className="text-emerald-500"\/> Timeline\s*<\/h2>/,
  `<h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-2 border-b border-gray-200 pb-4 relative group/section">
                     {sectionIcons.timeline ? <img src={sectionIcons.timeline} className="w-7 h-7 object-contain" alt="icon" /> : <Briefcase className="text-emerald-500 w-7 h-7"/>}
                     경력 및 학력
                     {isAdmin && (
                       <label className="absolute -top-4 -left-4 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-pointer bg-white border border-gray-200 shadow-lg p-1 rounded z-20 text-[10px] text-blue-500 font-bold">
                         + 아이콘 첨부
                         <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (b64) => setSectionIcons({...sectionIcons, timeline: b64}))} className="hidden" />
                       </label>
                     )}
                   </h2>`
);

// 5. Certifications Header
c = c.replace(
  /<h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-4 mt-16">\s*<Award className="text-orange-500"\/> Certifications\s*<\/h2>/,
  `<h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-4 mt-16 relative group/section">
                     {sectionIcons.certifications ? <img src={sectionIcons.certifications} className="w-7 h-7 object-contain" alt="icon" /> : <Award className="text-orange-500 w-7 h-7"/>}
                     자격증
                     {isAdmin && (
                       <label className="absolute -top-4 -left-4 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-pointer bg-white border border-gray-200 shadow-lg p-1 rounded z-20 text-[10px] text-blue-500 font-bold">
                         + 아이콘 첨부
                         <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (b64) => setSectionIcons({...sectionIcons, certifications: b64}))} className="hidden" />
                       </label>
                     )}
                   </h2>`
);

// 6. Activities Header
c = c.replace(
  /<h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-2 border-b border-gray-200 pb-4">\s*<Target className="text-blue-500"\/> Activities & Projects\s*<\/h2>/,
  `<h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-2 border-b border-gray-200 pb-4 relative group/section">
                     {sectionIcons.activities ? <img src={sectionIcons.activities} className="w-7 h-7 object-contain" alt="icon" /> : <Target className="text-blue-500 w-7 h-7"/>}
                     대내외 활동 및 프로젝트
                     {isAdmin && (
                       <label className="absolute -top-4 -left-4 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-pointer bg-white border border-gray-200 shadow-lg p-1 rounded z-20 text-[10px] text-blue-500 font-bold">
                         + 아이콘 첨부
                         <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (b64) => setSectionIcons({...sectionIcons, activities: b64}))} className="hidden" />
                       </label>
                     )}
                   </h2>`
);

fs.writeFileSync('src/App.tsx', c);
