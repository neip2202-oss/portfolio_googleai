const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

if (!c.includes('const [activitiesLeftData, setActivitiesLeftData]')) {
  c = c.replace(
    /const \[activitiesRightData, setActivitiesRightData\] = useContent<any>\('activitiesRightData', \[/,
    `const [activitiesLeftData, setActivitiesLeftData] = useContent<any>('activitiesLeftData', [
    { id: 1, year: '2021.05 - 2021.12', title: 'OOO 대학생 서포터즈', badge: '우수 활동자', desc: '마케팅 기획 및 홍보 콘텐츠 제작 우수 활동자 선정' },
  ]);

  const [activitiesRightData, setActivitiesRightData] = useContent<any>('activitiesRightData', [`
  );
}

c = c.replace(
  /activitiesLeft: '',\n\s*activities: '',/,
  `activitiesLeft: '',
    activities: '',`
);

const activitiesLeftJSX = `
                   <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-4 mt-16 relative group/section">
                     {sectionIcons.activitiesLeft ? <img src={sectionIcons.activitiesLeft} className="w-7 h-7 object-contain" alt="icon" /> : <Target className="text-blue-500 w-7 h-7"/>}
                     대내외 활동
                     {isAdmin && (
                       <label className="absolute -top-4 -left-4 opacity-0 group-hover/section:opacity-100 transition-opacity cursor-pointer bg-white border border-gray-200 shadow-lg p-1 rounded z-20 text-[10px] text-blue-500 font-bold">
                         + 아이콘 첨부
                         <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (b64) => setSectionIcons({...sectionIcons, activitiesLeft: b64}))} className="hidden" />
                       </label>
                     )}
                   </h2>
                   <div className="space-y-6">
                       {activitiesLeftData.map((act: any, idx: number) => (
                          <div key={act.id} className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative group/act">
                             {isAdmin && <button onClick={() => { const n=[...activitiesLeftData]; n.splice(idx, 1); setActivitiesLeftData(n); }} className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center font-bold text-sm shadow transition-colors z-20 opacity-0 group-hover/act:opacity-100">✕</button>}
                             <div className="flex flex-col mb-4 gap-2">
                                <div className="w-full">
                                   <EditableText isAdmin={isAdmin} value={act.title} onChange={(v: string) => { const n = [...activitiesLeftData]; n[idx].title = v; setActivitiesLeftData(n); }} className="text-xl font-extrabold text-gray-900 mb-1 block" placeholder="활동 제목" />
                                   <EditableText isAdmin={isAdmin} value={act.year} onChange={(v: string) => { const n = [...activitiesLeftData]; n[idx].year = v; setActivitiesLeftData(n); }} className="text-sm font-bold text-gray-400 block" placeholder="기간 (YYYY.MM - YYYY.MM)" />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                   {(() => {
                                      const tags = act.tags || (act.badge ? [{ id: Date.now(), text: act.badge, color: 0 }] : []);
                                      return (
                                         <>
                                            {tags.map((tag: any, tIdx: number) => {
                                               const p = TAG_COLORS[tag.color] || TAG_COLORS[0];
                                               return (
                                                  <div key={tag.id} className="group/tag relative flex items-center">
                                                     <div className={\`px-2.5 py-1 \${p.bg} \${p.text} text-[11px] font-bold rounded-lg border \${p.border} flex items-center gap-1.5 transition-colors\`}>
                                                        <div className={\`w-1.5 h-1.5 rounded-full \${p.dot}\`}></div>
                                                        <EditableText isAdmin={isAdmin} value={tag.text} onChange={(v: string) => { const n=[...activitiesLeftData]; n[idx].tags[tIdx].text=v; setActivitiesLeftData(n); }} className="bg-transparent uppercase tracking-wide" placeholder="태그명" />
                                                     </div>
                                                     {isAdmin && (
                                                        <div className="hidden group-hover/tag:flex absolute top-full left-0 pt-2 z-20">
                                                           <div className="bg-white shadow-xl border border-gray-200 rounded-lg p-2 flex gap-1.5 relative">
                                                              {TAG_COLORS.map((pal, pIdx) => (
                                                                 <button key={pIdx} onClick={() => { const n=[...activitiesLeftData]; n[idx].tags[tIdx].color=pIdx; setActivitiesLeftData(n); }} className={\`w-5 h-5 rounded-full \${pal.bg} border \${pal.border} \${tag.color === pIdx ? 'ring-2 ring-offset-1 ring-gray-900' : ''}\`} />
                                                              ))}
                                                              <button onClick={() => { const n=[...activitiesLeftData]; n[idx].tags.splice(tIdx, 1); setActivitiesLeftData(n); }} className="w-5 h-5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center font-bold ml-1">✕</button>
                                                           </div>
                                                        </div>
                                                     )}
                                                  </div>
                                               );
                                            })}
                                            {isAdmin && (
                                               <button onClick={() => {
                                                  const n = [...activitiesLeftData];
                                                  if(!n[idx].tags) n[idx].tags = [];
                                                  n[idx].tags.push({ id: Date.now(), text: '새 태그', color: 0 });
                                                  setActivitiesLeftData(n);
                                               }} className="px-2.5 py-1 border border-dashed border-gray-300 text-gray-400 text-[11px] font-bold rounded-lg hover:border-emerald-400 hover:text-emerald-500 transition-colors">+ 태그</button>
                                            )}
                                         </>
                                      );
                                   })()}
                                </div>
                             </div>
                             <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                <EditableText isAdmin={isAdmin} as="textarea" value={act.desc} onChange={(v: string) => { const n = [...activitiesLeftData]; n[idx].desc = v; setActivitiesLeftData(n); }} placeholder="상세 내용" />
                             </div>
                          </div>
                       ))}
                       {isAdmin && (
                          <button onClick={() => setActivitiesLeftData([...activitiesLeftData, { id: Date.now(), year: 'YYYY.MM - YYYY.MM', title: '신규 활동', desc: '설명', tags: [] }])} className="w-full py-4 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-3xl text-sm font-bold hover:bg-emerald-50 transition-colors">
                             + 대내외 활동 추가
                          </button>
                       )}
                   </div>
`;

if (!c.includes('activitiesLeftData.map')) {
  c = c.replace(
    /<h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-4 mt-16 relative group\/section">\s*\{sectionIcons\.certifications \? <img src=\{sectionIcons\.certifications\} className="w-7 h-7 object-contain" alt="icon" \/> : <Award className="text-orange-500 w-7 h-7"\/>\}\s*자격증/,
    activitiesLeftJSX + '\n\n                   <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-4 mt-16 relative group/section">\n                     {sectionIcons.certifications ? <img src={sectionIcons.certifications} className="w-7 h-7 object-contain" alt="icon" /> : <Award className="text-orange-500 w-7 h-7"/>}\n                     자격증'
  );
}

c = c.replace(
  /대내외 활동 및 프로젝트/,
  `프로젝트`
);

fs.writeFileSync('src/App.tsx', c);
