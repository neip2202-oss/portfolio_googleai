import React, { useState, useEffect } from 'react';
import { ArrowDown, Mail, Phone, ChevronRight, Download, ArrowLeft, Briefcase, GraduationCap, Award, MapPin, Calendar, Heart, Gamepad2, Clock, Monitor, Smartphone, ArrowRight, Search, Puzzle, FileText, Zap, Bot, Rocket, ExternalLink, PenTool, Database, LayoutTemplate, Target, BrainCircuit, Play, Globe, Home, Box, ChevronUp, Image as ImageIcon, PlayCircle, ChevronLeft, Settings, Unlock, Plus, CheckCircle } from 'lucide-react';
import { useContent } from './hooks/useContent';

const iconsMapping: Record<string, any> = { ArrowDown, Mail, Phone, ChevronRight, Download, ArrowLeft, Briefcase, GraduationCap, Award, MapPin, Calendar, Heart, Gamepad2, Clock, Monitor, Smartphone, ArrowRight, Search, Puzzle, FileText, Zap, Bot, Rocket, ExternalLink, PenTool, Database, LayoutTemplate, Target, BrainCircuit, Play, Globe, Home, Box, ChevronUp, ImageIcon, PlayCircle, ChevronLeft, Settings, Unlock, Plus, CheckCircle };

// -------------------------------------------------------------
// 컴포넌트 외부 분리
// -------------------------------------------------------------
const EditableText: React.FC<any> = ({ value, onChange, as = 'input', className = '', placeholder = '', isAdmin }) => {
  if (!isAdmin) return <span className={className}>{value}</span>;
  
  const adminClasses = `w-full bg-emerald-50/30 border border-dashed border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 my-1 text-black font-normal transition-all ${className}`;
  
  if (as === 'textarea') {
    return <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`${adminClasses} resize-y min-h-[80px]`} placeholder={placeholder} onClick={e => e.stopPropagation()} />;
  }
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={adminClasses} placeholder={placeholder} onClick={e => e.stopPropagation()} />;
};

const MarkdownRenderer: React.FC<any> = ({ content }) => {
  const createMarkup = () => {
    let html = content || '';
    html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-2xl my-6 border border-gray-200 shadow-sm" />');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-emerald-600 font-bold hover:underline">$1</a>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-3 border-b border-gray-100 pb-2">$1</h3>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="text-black font-black">$1</strong>');
    html = html.replace(/^- (.*$)/gim, '<li class="ml-5 list-disc marker:text-emerald-500 mb-1">$1</li>');
    html = html.replace(/\n/g, '<br/>');
    return { __html: html };
  };
  return <div className="markdown-body text-gray-600 leading-relaxed text-sm md:text-base" dangerouslySetInnerHTML={createMarkup()} />;
};


export default function App() {
  // 글로벌 상태 관리
  const [currentTab, setCurrentTab] = useState('about');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [resumeSubTab, setResumeSubTab] = useState('cv'); 
  const [portfolioTab, setPortfolioTab] = useState('main'); 
  const [activeMedia, setActiveMedia] = useState('thumbnail'); 
  const [docSlideIndex, setDocSlideIndex] = useState(0);
  const [homePlayFilter, setHomePlayFilter] = useState('PC'); 
  const [historyPageFilter, setHistoryPageFilter] = useState('All'); 
  const [isVisible, setIsVisible] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // 관리자 모드 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [adminPwd, setAdminPwd] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const showToast = (message: string, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false); 
      showToast('관리자 환경이 종료되었으며, 변경사항은 이미 저장되었습니다.', 'success');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAdminAuth = () => {
    if (adminPwd === '0630') {
      setIsAdmin(true);
      setIsAuthModalOpen(false);
      setAdminPwd('');
      showToast('관리자 환경으로 전환되었습니다.', 'success');
    } else {
      showToast('비밀번호가 올바르지 않습니다.', 'error');
    }
  };

  // -------------------------------------------------------------
  // 사이트 데이터 (CMS State connected via API)
  // -------------------------------------------------------------
  const [aboutData, setAboutData] = useContent<any>('aboutData', {
    title1: '의도를 구조로 만들고,',
    title2: '구조를 명확히 완성하는 기획자',
    desc: '데이터와 사용자 행동을 기반으로 더 나은 선택을 고민하며,\n팀이 같은 방향을 바라볼 수 있도록 명확한 문서를 작성하는 이솔잎입니다.',
    stat1: '8', stat1Label: '기획 입문 기간',
    stat2: '6', stat2Label: '프로젝트 달성',
    stat3: '3', stat3Label: '게임 출시 (Steam)',
    stat4: '5', stat4Label: 'PD 및 팀장 역임'
  });

  const [workProcessData, setWorkProcessData] = useContent<any>('workProcessData', [
    { id: 1, step: '01', iconName: 'Search', title: '문제를 정의합니다', desc: '겉으로 드러난 요청이 아닌, 본질적인 문제를 재정의합니다.', color: 'text-blue-500' },
    { id: 2, step: '02', iconName: 'Puzzle', title: '구조로 설계합니다', desc: '협업 과정에서 문제를 구조적으로 정리하고, 팀이 이해할 수 있는 형태로 풀어냅니다.', color: 'text-emerald-500' },
    { id: 3, step: '03', iconName: 'FileText', title: '문서로 정렬합니다', desc: '팀이 같은 방향을 볼 수 있도록 명확하게 문서화합니다.', color: 'text-gray-500' },
    { id: 4, step: '04', iconName: 'Zap', title: '빠르게 검증합니다', desc: '프로토타입과 테스트를 통해 빠르게 판단하고 개선합니다.', color: 'text-orange-500' },
    { id: 5, step: '05', iconName: 'Bot', title: 'AI로 확장합니다', desc: 'AI를 활용해 반복 작업을 줄이고, 기획의 속도와 깊이를 높입니다.', color: 'text-purple-500' },
    { id: 6, step: '06', iconName: 'Rocket', title: '실행으로 완성합니다', desc: '기획에 그치지 않고, 실제 결과까지 만들어냅니다.', color: 'text-red-500' }
  ]);

  const defaultMarkdown = `### 1. 문제 인식 및 목표\n해당 기획/작업을 진행하게 된 배경, 문제점 또는 목표를 기입합니다.\n\n### 2. 접근 방식 및 해결 구조\n어떤 논리적 구조를 통해 문제를 해결했는지 보여줍니다.\n\n### 3. 최종 성과\n- 성공적인 시스템 도입\n- 정량적 수치 기입`;

  const [projectsData, setProjectsData] = useContent<any>('projectsData', [
    { id: 1, genre: '캐주얼 액션 레이싱', title: 'Super Bumpers', role: ['PD', 'PM', '차량(성장) 기획', '인게임 규칙', 'UI/UX', 'QA'], desc: '속도=공격이라는 단순한 규칙 위에, 차량과 성장을 더해 계속 플레이하게 만드는 구조를 고민했습니다. 구글 스토어와 스팀 출시의 전 과정을 경험했습니다.', outcome: '난이도 밸런싱 최적화로 초기 이탈률 15% 방어', isFeatured: true, imgColor: 'bg-blue-200', links: ['Google Play', 'Steam'], markdown: defaultMarkdown, media: { thumbnail: '', video: '', slides: ['', '', '', '', ''] } },
    { id: 2, genre: '로그라이크 타워 디펜스', title: 'R.T.D (Random Tile Defense)', role: ['PM', '퀘스트 기획', '아이템 기획', '사운드 기획', '맵 제작'], desc: '메이플스토리 월드에서 제작한 로그라이크 타워 디펜스 게임. 랜덤 타일 배치와 전략적 유닛 운용을 기획했습니다.', outcome: '팀 내 리드 역할 수행 및 스팀 런칭 달성', isFeatured: true, imgColor: 'bg-stone-200', links: ['MapleStory World'], markdown: defaultMarkdown, media: { thumbnail: '', video: '', slides: ['', '', '', '', ''] } },
    { id: 3, genre: '턴제 RPG', title: 'Project Zero', role: ['시스템 기획'], desc: 'FGT 참여 및 피드백 기반 전투 시스템 개선', isFeatured: false, imgColor: 'bg-gray-100', links: [], markdown: defaultMarkdown, media: { thumbnail: '', video: '', slides: ['', '', '', '', ''] } },
  ]);

  const [otherWorksData, setOtherWorksData] = useContent<any>('otherWorksData', [
    { id: 101, category: 'AI & Tool', title: 'Excel 밸런싱 시뮬레이터', desc: 'VBA를 활용하여 기획자가 수치만 입력하면 예상 데미지 기댓값을 자동으로 산출해주는 시뮬레이터 제작.', iconName: 'Database', markdown: defaultMarkdown, media: { thumbnail: '', video: '', slides: ['', '', '', '', ''] } },
    { id: 102, category: '역기획서', title: '원신 전투 시스템 역기획', desc: '원소 반응 시스템의 데미지 공식을 역산하고 구조화한 상세 역기획 문서 및 개선 방향 제안.', iconName: 'Search', markdown: defaultMarkdown, media: { thumbnail: '', video: '', slides: ['', '', '', '', ''] } },
  ]);

  const [playHistoryData, setPlayHistoryData] = useContent<any>('playHistoryData', [
    { id: 1, platform: 'PC', title: '발더스 게이트 3', genre: 'CRPG', hours: '300+' },
    { id: 2, platform: 'PC', title: 'Path of Exile', genre: 'ARPG', hours: '800+' },
    { id: 3, platform: 'Mobile', title: '원신 (Genshin Impact)', genre: '오픈월드 ARPG', hours: '1,200+' },
    { id: 4, platform: 'Console', title: '젤다의 전설: 왕국의 눈물', genre: '오픈월드 액션 어드벤처', hours: '200+' },
  ]);

  const [timelineLeftData, setTimelineLeftData] = useContent<any>('timelineLeftData', [
    { id: 1, type: 'career', year: '2020.03 - 2022.02', title: 'OOO 상사 (영업 기획팀)', subtitle: '데이터 기반 기획 업무', desc: '매출 동향 분석 및 파트너사 커뮤니케이션을 통해 기획적 사고와 문제 해결 능력을 배양했습니다.' },
    { id: 2, type: 'education', year: '2015.03 - 2019.02', title: 'OOO 대학교', subtitle: 'OOO 전공', desc: '학사 졸업 (학점: 0.0 / 4.5)' },
  ]);
  
  const [activitiesRightData, setActivitiesRightData] = useContent<any>('activitiesRightData', [
    { id: 1, year: '2022.06 - 2023.04', title: 'OOO 게임 기획 부트캠프', badge: '우수 수료', desc: '8개월간 6개의 팀 프로젝트 기획 및 스팀 런칭 완수. Jira를 활용한 애자일 스프린트 리드.' },
  ]);

  const [coverLetterData, setCoverLetterData] = useContent<any>('coverLetterData', [
    { id: 1, title: '지원 동기 및 기획자로서의 목표', content: '**"선택에 이유를 묻는 단단한 근거가 서비스 성패를 좌우한다."**\n\n단순히 재밌어 보이는 아이디어를 넘어, 논리적 구조로 엮어내고 실제 지표로 증명하는 기획자가 되고자 합니다.' },
  ]);

  const [docTools, setDocTools] = useContent<any>('docTools', [
    { id: 1, name: 'Excel', tooltip: '데이터 모델링 및 수치 밸런싱', iconName: 'Database' },
    { id: 2, name: 'PowerPoint', tooltip: '명확한 제안서 및 플로우차트', iconName: 'LayoutTemplate' },
    { id: 3, name: 'Notion', tooltip: '위키 문서화 및 협업', iconName: 'PenTool' },
  ]);
  const [engineTools, setEngineTools] = useContent<any>('engineTools', [
    { id: 1, name: 'Unity', tooltip: '엔진 내 UI/프리팹 데이터 조작', iconName: 'Box' },
    { id: 2, name: 'Jira', tooltip: '애자일 스프린트 및 백로그 관리', iconName: 'LayoutTemplate' },
  ]);
  const [certifications, setCertifications] = useContent<any>('certifications', [
    { id: 1, title: 'CS Leaders (관리사)', date: '2022.05' },
    { id: 2, title: '컴퓨터활용능력 1급', date: '2021.10' }
  ]);

  const getToolIcon = (name: string) => {
    if(name.toLowerCase().includes('excel')) return Database;
    if(name.toLowerCase().includes('unity')) return Box;
    if(name.toLowerCase().includes('notion')) return PenTool;
    return iconsMapping[name] || LayoutTemplate;
  };

  useEffect(() => {
    setIsVisible(true);
    if (isContactModalOpen || isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    document.documentElement.style.scrollBehavior = 'smooth';
    window.scrollTo(0, 0);
  }, [isContactModalOpen, isAuthModalOpen, currentTab, resumeSubTab, portfolioTab]);

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 100);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setActiveMedia('thumbnail');
    setDocSlideIndex(0);
    handleNavClick('project-detail');
  };

  const handleOtherWorkClick = (work: any) => {
    setSelectedProject({
      ...work,
      role: [work.category],
      imgColor: 'bg-gray-50',
      outcome: '해당 작업물을 통한 기획 전문성 및 생산성 증대 도출',
      links: []
    });
    setActiveMedia('document');
    setDocSlideIndex(0);
    handleNavClick('project-detail');
  };

  const GlobalFooterCTA = () => (
    <div className="bg-white border-t border-gray-100 relative overflow-hidden py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-[#F8F9FA] rounded-[2rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-gray-900">Let's work together!</h2>
            <p className="text-gray-500 font-medium">새로운 세계를 함께 만들어 나가고 싶다면 언제든지 연락주세요.</p>
          </div>
          <button 
            onClick={() => setIsContactModalOpen(true)}
            className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold shadow-lg hover:bg-emerald-500 transition-colors flex items-center gap-3 shrink-0"
          >
            <Mail size={18} /> 연락하기
          </button>
        </div>
        <div className="text-center mt-12 text-sm text-gray-400 font-medium">
          © {new Date().getFullYear()} 이솔잎 (Lee Solip). All rights reserved.
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      <section id="hero" className="min-h-[85vh] flex flex-col justify-center items-center px-6 relative bg-white pt-24 pb-16">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-emerald-50/50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="relative z-10 max-w-5xl text-center w-full mt-10">
          <h1 className="text-5xl md:text-[4.5rem] font-extrabold tracking-tight leading-[1.15] mb-8 text-gray-900">
            <EditableText isAdmin={isAdmin} value={aboutData.title1} onChange={(v: string) => setAboutData({...aboutData, title1: v})} /><br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
              <EditableText isAdmin={isAdmin} value={aboutData.title2} onChange={(v: string) => setAboutData({...aboutData, title2: v})} />
            </span>
          </h1>
          <div className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium whitespace-pre-wrap">
            <EditableText isAdmin={isAdmin} as="textarea" value={aboutData.desc} onChange={(v: string) => setAboutData({...aboutData, desc: v})} />
          </div>

          <div className="inline-flex flex-col md:flex-row items-center justify-center bg-white border border-gray-100 shadow-sm rounded-2xl md:rounded-full divide-y md:divide-y-0 md:divide-x divide-gray-100 mb-12">
            <div className="px-8 py-4 text-center">
              <div className="text-2xl font-black text-gray-900"><EditableText isAdmin={isAdmin} value={aboutData.stat1} onChange={(v: string) => setAboutData({...aboutData, stat1: v})} className="inline-block w-12 text-center" /><span className="text-lg">개월</span></div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1"><EditableText isAdmin={isAdmin} value={aboutData.stat1Label} onChange={(v: string) => setAboutData({...aboutData, stat1Label: v})} className="text-center" /></div>
            </div>
            <div className="px-8 py-4 text-center">
              <div className="text-2xl font-black text-emerald-600"><EditableText isAdmin={isAdmin} value={aboutData.stat2} onChange={(v: string) => setAboutData({...aboutData, stat2: v})} className="inline-block w-12 text-center" /><span className="text-lg">개</span></div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1"><EditableText isAdmin={isAdmin} value={aboutData.stat2Label} onChange={(v: string) => setAboutData({...aboutData, stat2Label: v})} className="text-center" /></div>
            </div>
            <div className="px-8 py-4 text-center">
              <div className="text-2xl font-black text-blue-600"><EditableText isAdmin={isAdmin} value={aboutData.stat3} onChange={(v: string) => setAboutData({...aboutData, stat3: v})} className="inline-block w-12 text-center" /><span className="text-lg">회</span></div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1"><EditableText isAdmin={isAdmin} value={aboutData.stat3Label} onChange={(v: string) => setAboutData({...aboutData, stat3Label: v})} className="text-center" /></div>
            </div>
            <div className="px-8 py-4 text-center">
              <div className="text-2xl font-black text-purple-600"><EditableText isAdmin={isAdmin} value={aboutData.stat4} onChange={(v: string) => setAboutData({...aboutData, stat4: v})} className="inline-block w-12 text-center" /><span className="text-lg">회</span></div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1"><EditableText isAdmin={isAdmin} value={aboutData.stat4Label} onChange={(v: string) => setAboutData({...aboutData, stat4Label: v})} className="text-center" /></div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => handleNavClick('portfolio')} className="px-8 py-4 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 flex items-center gap-2">
              포트폴리오 <ArrowRight size={18} />
            </button>
            <button onClick={() => handleNavClick('resume')} className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-50 transition-all hover:-translate-y-0.5 flex items-center gap-2">
              이력서 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section id="process" className="py-24 bg-[#FAFAFA] scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">How I Work</h2>
            <p className="text-gray-500 font-medium">이렇게 일합니다</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workProcessData.map((item: any, i: number) => {
              const IconComp = iconsMapping[item.iconName] || Search;
              return (
              <div key={item.id} className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <span className="text-sm font-bold text-gray-300 mb-6 block">{item.step}</span>
                <IconComp className={`w-8 h-8 ${item.color} mb-4`} strokeWidth={2} />
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                   <EditableText isAdmin={isAdmin} value={item.title} onChange={(v: string) => { const n = [...workProcessData]; n[i].title = v; setWorkProcessData(n); }} />
                </h3>
                <div className="text-gray-500 text-sm leading-relaxed">
                   <EditableText isAdmin={isAdmin} as="textarea" value={item.desc} onChange={(v: string) => { const n = [...workProcessData]; n[i].desc = v; setWorkProcessData(n); }} />
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      <section id="archive" className="py-24 bg-white border-y border-gray-100 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <span className="text-blue-500 font-bold tracking-wider text-sm uppercase mb-2 flex items-center gap-2">
                 <Gamepad2 size={16}/> Gamer's Archive
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">다양하고 깊은 인사이트</h2>
            </div>
            <button onClick={() => handleNavClick('play-history')} className="text-gray-500 font-bold hover:text-blue-600 flex items-center gap-1 transition-colors">
              모든 플레이 이력 보기 <ChevronRight size={18}/>
            </button>
          </div>
          
          <div className="flex gap-2 mb-8">
             {['PC', 'Mobile', 'Console'].map(platform => (
                <button 
                  key={platform}
                  onClick={() => setHomePlayFilter(platform)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm ${homePlayFilter === platform ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  {platform}
                </button>
             ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {playHistoryData
               .filter((game: any) => game.platform === homePlayFilter)
               .slice(0, 3)
               .map((game: any) => (
               <div key={game.id} className="p-5 md:p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100 hover:border-blue-300 transition-colors flex flex-col justify-center items-center text-center">
                 <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-blue-500 mb-4">
                   {game.platform === 'PC' ? <Monitor size={24}/> : game.platform === 'Mobile' ? <Smartphone size={24}/> : <Gamepad2 size={24}/>}
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{game.title}</h3>
                 <span className="text-xs text-gray-500 font-medium mb-3">{game.genre}</span>
                 <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                   <Clock size={12}/> {game.hours}
                 </span>
               </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-24 bg-[#FAFAFA] scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <span className="text-emerald-500 font-bold tracking-wider text-sm uppercase mb-2 block">Featured</span>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">대표 프로젝트</h2>
            </div>
            <button onClick={() => handleNavClick('portfolio')} className="text-gray-500 font-bold hover:text-emerald-600 flex items-center gap-1 transition-colors">
              전체 보기 <ChevronRight size={18}/>
            </button>
          </div>
          
          <div className="space-y-8">
            {projectsData.filter((p: any) => p.isFeatured).map((project: any) => (
              <div 
                key={project.id} 
                onClick={() => handleProjectClick(project)} 
                className="cursor-pointer group flex flex-col md:flex-row bg-white rounded-3xl border border-gray-200 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-full md:w-[40%] ${project.imgColor} relative flex items-center justify-center min-h-[240px]`}>
                   {project.media?.thumbnail ? (
                      <img src={project.media.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                   ) : (
                      <span className="text-gray-500 font-bold tracking-widest relative z-0">Project Image</span>
                   )}
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-black/30 transition-colors duration-300 z-10"></div>
                   <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-6 py-3 bg-white text-gray-900 rounded-full font-bold shadow-lg flex items-center gap-2 text-sm">
                         상세 보기 <ArrowRight className="w-4 h-4" />
                      </span>
                   </div>
                </div>
                
                <div className="w-full md:w-[60%] p-8 md:p-10 flex flex-col justify-center">
                  <div className="mb-2 text-sm font-bold text-emerald-600">{project.genre}</div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">{project.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{project.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                     {Array.isArray(project.role) ? project.role.map((r: string) => (
                        <span key={r} className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-xs font-bold">{r}</span>
                     )) : <span className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-xs font-bold">{project.role}</span>}
                  </div>

                  {project.links && project.links.length > 0 && (
                     <div className="flex flex-wrap items-center gap-3 mt-auto pt-5 border-t border-gray-100">
                        {project.links.map((link: string) => {
                           let LinkIcon = ExternalLink;
                           if (link.includes('Google Play')) LinkIcon = Play;
                           if (link.includes('Steam')) LinkIcon = Monitor;
                           if (link.includes('MapleStory')) LinkIcon = Globe;
                           return (
                             <span key={link} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-sm hover:border-blue-400 hover:text-blue-600 transition-colors">
                                <LinkIcon size={14} className={link.includes('Steam') ? 'text-gray-900' : link.includes('Play') ? 'text-green-500' : 'text-blue-500'} /> {link}
                             </span>
                           )
                        })}
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <GlobalFooterCTA />

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 p-2 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full z-40">
         {[
            { id: 'hero', label: 'Intro' },
            { id: 'process', label: 'Process' },
            { id: 'archive', label: 'Archive' },
            { id: 'portfolio', label: 'Portfolio' }
         ].map(anchor => (
            <a key={anchor.id} href={`#${anchor.id}`} className="px-5 py-2 text-xs font-bold text-gray-500 hover:text-emerald-600 hover:bg-white rounded-full transition-all uppercase tracking-widest shadow-sm hover:shadow-md">
               {anchor.label}
            </a>
         ))}
      </div>
    </div>
  );

  const renderResume = () => (
    <div className={`pt-24 pb-24 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} bg-[#FAFAFA] min-h-screen`}>
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm mb-10 flex flex-col md:flex-row gap-10 items-center md:items-center">
          <div className="w-40 h-52 md:w-48 md:h-64 bg-gray-100 rounded-[2rem] border border-gray-200 shrink-0 relative overflow-hidden shadow-inner flex items-center justify-center">
             <span className="text-gray-400 font-bold text-sm tracking-widest">Photo</span>
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">이솔잎 <span className="text-2xl text-gray-300 font-bold ml-2">LEE SOLIP</span></h1>
            <p className="text-emerald-600 font-extrabold mb-8 text-lg md:text-xl tracking-tight">"의도를 구조로 만들고, 구조를 명확히 완성하는 기획자"</p>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-10">
              <span className="flex items-center gap-2 text-sm text-gray-500 font-medium px-3 py-2"><Calendar size={16} className="text-gray-400"/> 1996.12.07</span>
              <span className="flex items-center gap-2 text-sm text-gray-500 font-medium px-3 py-2"><MapPin size={16} className="text-gray-400"/> 서울특별시</span>
              <div className="hidden md:block w-px h-5 bg-gray-200 mx-2"></div>
              <a href="tel:010-1234-5678" className="flex items-center gap-2 text-sm text-gray-800 font-bold px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 transition-all rounded-full shadow-sm hover:shadow-md"><Phone size={14}/> 010-1234-5678</a>
              <a href="mailto:solip2202@gmail.com" className="flex items-center gap-2 text-sm text-white font-bold px-5 py-2.5 bg-gray-900 hover:bg-emerald-600 transition-all rounded-full shadow-md"><Mail size={14}/> 이메일 보내기</a>
            </div>

            <div className="space-y-4 text-left border-t border-gray-100 pt-8">
               <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span className="text-xs font-extrabold text-gray-400 uppercase w-48 shrink-0">Document & Collaboration</span>
                  <div className="flex flex-wrap gap-2 items-center">
                     {docTools.map((tool: any, idx: number) => {
                        const IconComp = getToolIcon(tool.iconName || tool.name);
                        return (
                          <div key={tool.id} className="group relative inline-block">
                             {isAdmin ? (
                                <div className="flex flex-col bg-gray-50 border border-emerald-300 rounded p-1">
                                   <EditableText isAdmin={isAdmin} value={tool.name} onChange={(v: string) => { const n=[...docTools]; n[idx].name=v; setDocTools(n); }} className="text-xs font-bold" />
                                   <EditableText isAdmin={isAdmin} value={tool.tooltip} onChange={(v: string) => { const n=[...docTools]; n[idx].tooltip=v; setDocTools(n); }} className="text-[10px]" />
                                </div>
                             ) : (
                                <>
                                 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-help transition-colors hover:border-emerald-400 hover:text-emerald-700 hover:shadow-sm">
                                   <IconComp size={14} className="text-gray-400 group-hover:text-emerald-500" /> {tool.name}
                                 </span>
                                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl z-50">
                                   {tool.tooltip}
                                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                 </div>
                                </>
                             )}
                          </div>
                        )
                     })}
                     {isAdmin && <button onClick={() => setDocTools([...docTools, {id: Date.now(), name: '신규 툴', tooltip: '설명', iconName: 'PenTool'}])} className="text-emerald-600 text-xs font-bold ml-2 hover:bg-emerald-50 px-2 py-1 rounded">+ 추가</button>}
                  </div>
               </div>
               <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span className="text-xs font-extrabold text-gray-400 uppercase w-48 shrink-0">Engine & Tools</span>
                  <div className="flex flex-wrap gap-2 items-center">
                     {engineTools.map((tool: any, idx: number) => {
                        const IconComp = getToolIcon(tool.iconName || tool.name);
                        return (
                          <div key={tool.id} className="group relative inline-block">
                             {isAdmin ? (
                                <div className="flex flex-col bg-gray-50 border border-emerald-300 rounded p-1">
                                   <EditableText isAdmin={isAdmin} value={tool.name} onChange={(v: string) => { const n=[...engineTools]; n[idx].name=v; setEngineTools(n); }} className="text-xs font-bold" />
                                   <EditableText isAdmin={isAdmin} value={tool.tooltip} onChange={(v: string) => { const n=[...engineTools]; n[idx].tooltip=v; setEngineTools(n); }} className="text-[10px]" />
                                </div>
                             ) : (
                                <>
                                 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-help transition-colors hover:border-emerald-400 hover:text-emerald-700 hover:shadow-sm">
                                   <IconComp size={14} className="text-gray-400 group-hover:text-emerald-500" /> {tool.name}
                                 </span>
                                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl z-50">
                                   {tool.tooltip}
                                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                 </div>
                                </>
                             )}
                          </div>
                        )
                     })}
                     {isAdmin && <button onClick={() => setEngineTools([...engineTools, {id: Date.now(), name: '신규 툴', tooltip: '설명', iconName: 'Box'}])} className="text-emerald-600 text-xs font-bold ml-2 hover:bg-emerald-50 px-2 py-1 rounded">+ 추가</button>}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="flex p-1.5 bg-gray-200 rounded-2xl mb-12 shadow-inner">
           <button onClick={() => setResumeSubTab('cv')} className={`flex-1 py-3.5 text-sm font-bold rounded-xl transition-all ${resumeSubTab === 'cv' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>📝 이력서 (Resume)</button>
           <button onClick={() => setResumeSubTab('cover-letter')} className={`flex-1 py-3.5 text-sm font-bold rounded-xl transition-all ${resumeSubTab === 'cover-letter' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>✍️ 자기소개서 (Cover Letter)</button>
        </div>

        {resumeSubTab === 'cv' && (
          <div className="animate-in fade-in duration-300">
             <div className="grid md:grid-cols-12 gap-10 md:gap-16">
                
                <div className="md:col-span-5">
                   <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-2 border-b border-gray-200 pb-4">
                     <Briefcase className="text-emerald-500"/> Timeline
                   </h2>
                   
                   <div className="relative pl-6">
                      <div className="absolute left-[7px] top-0 bottom-0 w-px bg-gray-200"></div>
                      <div className="space-y-10">
                         {timelineLeftData.map((item: any, idx: number) => (
                            <div key={item.id} className="relative">
                               <div className={`absolute left-[-24px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white z-10 ${item.type === 'career' ? 'bg-blue-500' : 'bg-gray-400 shadow-sm'}`}></div>
                               <div className="pl-4">
                                 <EditableText isAdmin={isAdmin} value={item.year} onChange={(v: string) => { const n = [...timelineLeftData]; n[idx].year = v; setTimelineLeftData(n); }} className="text-emerald-600 font-bold text-sm mb-1 block" />
                                 <EditableText isAdmin={isAdmin} value={item.title} onChange={(v: string) => { const n = [...timelineLeftData]; n[idx].title = v; setTimelineLeftData(n); }} className="text-lg font-extrabold text-gray-900 mb-1 block" />
                                 <EditableText isAdmin={isAdmin} value={item.subtitle} onChange={(v: string) => { const n = [...timelineLeftData]; n[idx].subtitle = v; setTimelineLeftData(n); }} className="text-xs font-bold text-gray-500 mb-2 block" />
                                 <EditableText isAdmin={isAdmin} as="textarea" value={item.desc} onChange={(v: string) => { const n = [...timelineLeftData]; n[idx].desc = v; setTimelineLeftData(n); }} className="text-gray-600 text-sm leading-relaxed block" />
                               </div>
                            </div>
                         ))}
                         {isAdmin && (
                            <div className="relative pt-6">
                               <button onClick={() => setTimelineLeftData([...timelineLeftData, { id: Date.now(), type: 'career', year: 'YYYY.MM', title: '신규 경력', subtitle: '직무', desc: '설명' }])} className="w-full py-2 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-50">+ 타임라인 추가</button>
                            </div>
                         )}
                      </div>
                   </div>

                   <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-4 mt-16">
                     <Award className="text-orange-500"/> Certifications
                   </h2>
                   <div className="space-y-3">
                      {certifications.map((cert: any, idx: number) => (
                         <div key={cert.id} className="p-4 bg-white border border-gray-200 rounded-2xl flex justify-between items-center shadow-sm">
                            <EditableText isAdmin={isAdmin} value={cert.title} onChange={(v: string) => { const n=[...certifications]; n[idx].title=v; setCertifications(n); }} className="font-bold text-gray-900 text-sm w-1/2" />
                            <EditableText isAdmin={isAdmin} value={cert.date} onChange={(v: string) => { const n=[...certifications]; n[idx].date=v; setCertifications(n); }} className="text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded text-right" />
                         </div>
                      ))}
                      {isAdmin && (
                         <button onClick={() => setCertifications([...certifications, { id: Date.now(), title: '신규 자격증', date: 'YYYY.MM' }])} className="w-full py-2 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-50">+ 자격증 추가</button>
                      )}
                   </div>
                </div>

                <div className="md:col-span-7">
                   <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-2 border-b border-gray-200 pb-4">
                     <Target className="text-blue-500"/> Activities & Projects
                   </h2>
                   <div className="space-y-6">
                      {activitiesRightData.map((act: any, idx: number) => (
                         <div key={act.id} className="p-6 md:p-8 bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2">
                               <div className="w-full">
                                  <EditableText isAdmin={isAdmin} value={act.title} onChange={(v: string) => { const n = [...activitiesRightData]; n[idx].title = v; setActivitiesRightData(n); }} className="text-xl font-extrabold text-gray-900 mb-1 block" />
                                  <EditableText isAdmin={isAdmin} value={act.year} onChange={(v: string) => { const n = [...activitiesRightData]; n[idx].year = v; setActivitiesRightData(n); }} className="text-sm font-bold text-gray-400 block" />
                               </div>
                               <div className="shrink-0">
                                  <EditableText isAdmin={isAdmin} value={act.badge} onChange={(v: string) => { const n = [...activitiesRightData]; n[idx].badge = v; setActivitiesRightData(n); }} className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100" />
                               </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                               <EditableText isAdmin={isAdmin} as="textarea" value={act.desc} onChange={(v: string) => { const n = [...activitiesRightData]; n[idx].desc = v; setActivitiesRightData(n); }} className="text-gray-600 text-sm leading-relaxed w-full" />
                            </div>
                         </div>
                      ))}
                      {isAdmin && (
                         <button onClick={() => setActivitiesRightData([...activitiesRightData, { id: Date.now(), year: 'YYYY.MM', title: '신규 활동', badge: '태그', desc: '설명' }])} className="w-full p-6 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-3xl font-bold hover:bg-emerald-50">+ 대내외 활동 추가</button>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {resumeSubTab === 'cover-letter' && (
          <div className="space-y-8 animate-in fade-in duration-300">
             {isAdmin && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-800 text-sm font-bold flex flex-col sm:flex-row items-center justify-between gap-4">
                   <span className="flex items-center gap-2"><PenTool size={16}/> 에디터 모드 활성화 됨 (Markdown 문법 적용 가능)</span>
                   <button onClick={() => setCoverLetterData([...coverLetterData, {id: Date.now(), title: '신규 항목', content: '내용을 입력하세요.'}])} className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-emerald-700 transition-colors whitespace-nowrap">+ 항목 추가</button>
                </div>
             )}

            {coverLetterData.map((letter: any, index: number) => (
               <div key={letter.id} className="p-8 md:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm relative">
                  {isAdmin ? (
                     <div className="space-y-4">
                        <EditableText isAdmin={isAdmin} value={letter.title} onChange={(v: string) => { const n = [...coverLetterData]; n[index].title = v; setCoverLetterData(n); }} className="text-xl font-extrabold block" />
                        <EditableText isAdmin={isAdmin} as="textarea" value={letter.content} onChange={(v: string) => { const n = [...coverLetterData]; n[index].content = v; setCoverLetterData(n); }} className="text-sm font-mono bg-gray-900 text-gray-200 p-4 rounded-xl min-h-[150px] w-full block" />
                     </div>
                  ) : (
                     <>
                        <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3 border-b border-gray-100 pb-5 tracking-tight">
                           <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shadow-md">{index + 1}</span>
                           {letter.title}
                        </h3>
                        <MarkdownRenderer content={letter.content} />
                     </>
                  )}
               </div>
            ))}
          </div>
        )}

      </div>
      <div className="mt-20"><GlobalFooterCTA /></div>
    </div>
  );

  const renderPortfolio = () => (
    <div className={`pt-24 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} bg-white min-h-screen`}>
      <div className="max-w-6xl mx-auto px-6 mb-32">
        <div className="mb-10 mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">포트폴리오</h1>
            <p className="text-gray-500">게임 기획부터 런칭까지의 메인 프로젝트와 AI/툴링을 활용한 기타 작업물 아카이브입니다.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-10 border-b border-gray-200 pb-6">
           <button onClick={() => setPortfolioTab('main')} className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${portfolioTab === 'main' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'}`}>메인 프로젝트</button>
           <button onClick={() => setPortfolioTab('other')} className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${portfolioTab === 'other' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'}`}>기타 작업물 (AI & 툴링)</button>
        </div>
        
        {portfolioTab === 'main' && (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
             {projectsData.map((project: any) => (
               <div key={project.id} onClick={() => handleProjectClick(project)} className="cursor-pointer group flex flex-col bg-white border border-gray-200 hover:border-emerald-300 transition-all hover:shadow-xl overflow-hidden rounded-3xl">
                 <div className={`aspect-[4/3] ${project.imgColor} relative overflow-hidden`}>
                    {project.media?.thumbnail ? (
                       <img src={project.media.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                       <div className="flex items-center justify-center h-full text-gray-500 font-bold tracking-widest uppercase">Thumbnail</div>
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors z-10"></div>
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="bg-white/90 text-gray-900 text-sm font-bold px-5 py-2.5 rounded-full backdrop-blur-sm shadow-md flex items-center gap-1.5">자세히 보기 <ArrowRight size={14}/></span>
                    </div>
                 </div>
                 <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">{project.title}</h3>
                    <span className="inline-block self-start px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold mb-4">{Array.isArray(project.role) ? project.role[0] : project.role} 외</span>
                    <p className="text-gray-500 text-sm mt-auto line-clamp-2 leading-relaxed">{project.desc}</p>
                 </div>
               </div>
             ))}

             {isAdmin && (
                <div onClick={() => {
                    const newProj = { id: Date.now(), genre: '신규 장르', title: '새로운 프로젝트', role: ['기획'], desc: '프로젝트 설명 기입', outcome: '성과', isFeatured: false, imgColor: 'bg-gray-100', links: [], markdown: defaultMarkdown, media: { thumbnail:'', video:'', slides:[''] } };
                    setProjectsData([...projectsData, newProj]);
                    handleProjectClick(newProj);
                  }}
                  className="cursor-pointer flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 transition-all rounded-3xl min-h-[350px]"
                >
                   <Plus size={48} className="mb-4 opacity-70" />
                   <span className="font-bold text-lg">신규 프로젝트 추가</span>
                   <span className="text-xs text-gray-400 mt-2 text-center px-6">클릭 시 생성되며 상세 페이지로 이동합니다.</span>
                </div>
             )}
           </div>
        )}

        {portfolioTab === 'other' && (
           <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {otherWorksData.map((work: any) => {
                 const IconComp = iconsMapping[work.iconName] || FileText;
                 return (
                 <div key={work.id} onClick={() => handleOtherWorkClick(work)} className="p-8 rounded-3xl bg-[#FAFAFA] border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                       <IconComp size={26} />
                    </div>
                    <span className="text-xs font-bold text-blue-600 mb-2">{work.category}</span>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-3">{work.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{work.desc}</p>
                    <div className="mt-auto flex items-center gap-1.5 text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                       상세 보기 <ArrowRight size={14} />
                    </div>
                 </div>
              )})}

              {isAdmin && (
                <div onClick={() => {
                    const newWork = { id: Date.now(), category: '신규 카테고리', title: '새로운 작업물', desc: '설명', iconName: 'FileText', markdown: defaultMarkdown, media: { thumbnail:'', video:'', slides:[''] } };
                    setOtherWorksData([...otherWorksData, newWork]);
                    handleOtherWorkClick(newWork);
                  }}
                  className="p-8 rounded-3xl bg-gray-50 border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[250px]"
                >
                   <Plus size={40} className="mb-4 opacity-70" />
                   <span className="font-bold">신규 작업물 추가</span>
                </div>
             )}
           </div>
        )}

      </div>
      <GlobalFooterCTA />
    </div>
  );

  const renderProjectDetail = () => {
    const updateCurrentProject = (field: string, value: any) => {
       const updated = { ...selectedProject, [field]: value };
       setSelectedProject(updated);
       if (portfolioTab === 'main') {
          setProjectsData(projectsData.map((p: any) => p.id === updated.id ? updated : p));
       } else {
          setOtherWorksData(otherWorksData.map((w: any) => w.id === updated.id ? updated : w));
       }
    };

    const updateMedia = (mediaType: string, value: any) => {
       const updatedMedia = { ...selectedProject.media, [mediaType]: value };
       updateCurrentProject('media', updatedMedia);
    };

    return (
      <div className={`pt-24 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} bg-[#FAFAFA] min-h-screen`}>
        <div className="max-w-4xl mx-auto px-6 mb-32">
          <button onClick={() => handleNavClick('portfolio')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 mt-6 transition-colors">
            <ArrowLeft size={20} /> 목록으로 돌아가기
          </button>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-200 shadow-sm">
            <div className="mb-10">
              {isAdmin ? (
                 <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-dashed border-emerald-400">
                    <div className="text-emerald-700 font-bold text-sm">💡 기본 정보 수정</div>
                    <EditableText isAdmin={isAdmin} value={portfolioTab === 'main' ? (Array.isArray(selectedProject?.role) ? selectedProject?.role.join(', ') : selectedProject?.role) : selectedProject?.category} onChange={(v: string) => updateCurrentProject(portfolioTab === 'main' ? 'role' : 'category', portfolioTab === 'main' ? v.split(',').map(s=>s.trim()) : v)} className="font-bold text-sm block" placeholder="역할 또는 카테고리" />
                    <EditableText isAdmin={isAdmin} value={selectedProject?.title} onChange={(v: string) => updateCurrentProject('title', v)} className="text-4xl font-extrabold block" placeholder="프로젝트 제목" />
                    <EditableText isAdmin={isAdmin} as="textarea" value={selectedProject?.desc} onChange={(v: string) => updateCurrentProject('desc', v)} className="text-sm w-full block" placeholder="요약 설명" />
                 </div>
              ) : (
                 <>
                    <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold mb-4">{portfolioTab === 'main' ? (Array.isArray(selectedProject?.role) ? selectedProject?.role.join(', ') : selectedProject?.role) : selectedProject?.category}</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">{selectedProject?.title}</h1>
                    <p className="text-xl text-gray-500">{selectedProject?.desc}</p>
                 </>
              )}
            </div>

            <div className="mb-16">
              <div className={`aspect-[16/9] ${selectedProject?.imgColor || 'bg-gray-100'} rounded-3xl mb-6 flex items-center justify-center text-gray-500 font-bold border border-gray-200 shadow-inner relative overflow-hidden group transition-all duration-500`}>
                 
                 {activeMedia === 'thumbnail' && (
                    <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                       {selectedProject?.media?.thumbnail ? (
                          <img src={selectedProject.media.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                       ) : (
                          <>
                             <ImageIcon size={64} className="text-gray-300 mb-4" />
                             <span className="text-gray-400 font-bold tracking-widest uppercase text-sm">Main Thumbnail</span>
                          </>
                       )}
                       {isAdmin && (
                          <div className="absolute top-4 right-4 z-30 w-full max-w-xs bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-gray-200" onClick={e => e.stopPropagation()}>
                            <div className="text-xs font-bold text-emerald-600 mb-2">🔗 썸네일 이미지 URL 연결</div>
                            <input type="text" placeholder="https://..." value={selectedProject?.media?.thumbnail || ''} onChange={e => updateMedia('thumbnail', e.target.value)} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500" />
                          </div>
                       )}
                    </div>
                 )}

                 {activeMedia === 'gameplay' && (
                    <div className="w-full h-full bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
                       {selectedProject?.media?.video ? (
                          <iframe src={selectedProject.media.video} className="w-full h-full border-none" allowFullScreen></iframe>
                       ) : (
                          <>
                             <PlayCircle size={72} className="text-emerald-500 opacity-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-4" />
                             <span className="font-bold tracking-wide text-gray-300">플레이 영상 재생 영역</span>
                          </>
                       )}
                       {isAdmin && (
                          <div className="absolute top-4 right-4 z-30 w-full max-w-xs bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-gray-200" onClick={e => e.stopPropagation()}>
                            <div className="text-xs font-bold text-emerald-600 mb-2">🔗 플레이 영상 URL (유튜브 embed 등)</div>
                            <input type="text" placeholder="https://..." value={selectedProject?.media?.video || ''} onChange={e => updateMedia('video', e.target.value)} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500" />
                          </div>
                       )}
                    </div>
                 )}

                 {activeMedia === 'document' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white relative animate-in fade-in duration-300">
                       {selectedProject?.media?.slides && selectedProject.media.slides[docSlideIndex] ? (
                          <img src={selectedProject.media.slides[docSlideIndex]} alt="slide" className="w-full h-full object-contain" />
                       ) : (
                          <>
                             <span className="text-2xl font-extrabold text-gray-800 mb-2">상세 기획서 Page {docSlideIndex + 1}</span>
                             <span className="text-gray-400 font-medium">({['기획서 표지', '목차 및 시스템 개요', '핵심 룰 구조도', '밸런스 데이터 테이블', 'UI 와이어프레임'][docSlideIndex] || '추가 페이지'})</span>
                          </>
                       )}
                       
                       <div className="absolute bottom-6 bg-gray-900/80 backdrop-blur text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                          {docSlideIndex + 1} / {(selectedProject?.media?.slides || [1, 2, 3, 4, 5]).length}
                       </div>
                       
                       <button onClick={() => setDocSlideIndex(prev => prev === 0 ? (selectedProject?.media?.slides?.length || 5) - 1 : prev - 1)} className="absolute left-6 w-12 h-12 bg-white border border-gray-200 hover:bg-gray-50 hover:border-emerald-300 rounded-full flex items-center justify-center shadow-md hover:shadow-xl transition-all text-gray-700 hover:text-emerald-600 z-20">
                          <ChevronLeft size={28} />
                       </button>
                       <button onClick={() => setDocSlideIndex(prev => (prev + 1) % (selectedProject?.media?.slides?.length || 5))} className="absolute right-6 w-12 h-12 bg-white border border-gray-200 hover:bg-gray-50 hover:border-emerald-300 rounded-full flex items-center justify-center shadow-md hover:shadow-xl transition-all text-gray-700 hover:text-emerald-600 z-20">
                          <ChevronRight size={28} />
                       </button>

                       {isAdmin && (
                          <div className="absolute top-4 right-4 z-30 w-full max-w-xs bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-gray-200" onClick={e => e.stopPropagation()}>
                            <div className="text-xs font-bold text-emerald-600 mb-2">🔗 현재 슬라이드 이미지 URL ({docSlideIndex + 1}페이지)</div>
                            <input type="text" placeholder="https://..." 
                               value={(selectedProject?.media?.slides && selectedProject.media.slides[docSlideIndex]) || ''} 
                               onChange={e => {
                                  const newSlides = [...(selectedProject.media?.slides || ['', '', '', '', ''])];
                                  newSlides[docSlideIndex] = e.target.value;
                                  updateMedia('slides', newSlides);
                               }} 
                               className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-emerald-500" 
                            />
                            <button onClick={() => {
                                const newSlides = [...(selectedProject.media?.slides || ['', '', '', '', '']), ''];
                                updateMedia('slides', newSlides);
                                setDocSlideIndex(newSlides.length - 1);
                            }} className="w-full mt-2 py-1 bg-emerald-50 text-emerald-600 font-bold text-xs rounded border border-emerald-200">+ 페이지 추가</button>
                          </div>
                       )}
                    </div>
                 )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <button onClick={() => setActiveMedia('thumbnail')} className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${activeMedia === 'thumbnail' ? 'border-gray-900 bg-gray-900 text-white shadow-lg' : 'border-gray-200 bg-white hover:border-gray-400 text-gray-500 hover:text-gray-800'}`}>
                    <ImageIcon size={24} />
                    <span className="font-bold text-sm">대표 이미지</span>
                 </button>
                 <button onClick={() => setActiveMedia('gameplay')} className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${activeMedia === 'gameplay' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg' : 'border-gray-200 bg-white hover:border-emerald-300 text-gray-500 hover:text-emerald-600'}`}>
                    <PlayCircle size={24} />
                    <span className="font-bold text-sm">플레이 영상</span>
                 </button>
                 <button onClick={() => setActiveMedia('document')} className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${activeMedia === 'document' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg' : 'border-gray-200 bg-white hover:border-blue-300 text-gray-500 hover:text-blue-600'}`}>
                    <FileText size={24} />
                    <span className="font-bold text-sm">기획서 슬라이드</span>
                 </button>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-100 pt-10">
               {isAdmin ? (
                  <div className="space-y-4">
                     <div className="text-emerald-700 font-bold text-sm flex items-center gap-2 mb-2">
                        <PenTool size={16}/> 상세 내용 에디터 (Markdown 지원)
                     </div>
                     <EditableText 
                        isAdmin={isAdmin}
                        as="textarea" 
                        value={selectedProject?.markdown} 
                        onChange={(v: string) => updateCurrentProject('markdown', v)} 
                        className="min-h-[400px] font-mono text-sm bg-gray-900 text-gray-200 p-6 rounded-2xl w-full block border-none shadow-inner" 
                     />
                  </div>
               ) : (
                  <MarkdownRenderer content={selectedProject?.markdown} />
               )}
            </div>
          </div>
        </div>
        <GlobalFooterCTA />
      </div>
    );
  };

  const renderPlayHistory = () => {
    const totalGames = playHistoryData.length;
    const pcGames = playHistoryData.filter((g: any) => g.platform === 'PC').length;
    const mobileGames = playHistoryData.filter((g: any) => g.platform === 'Mobile').length;
    const consoleGames = playHistoryData.filter((g: any) => g.platform === 'Console').length;

    return (
      <div className={`pt-24 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} bg-[#FAFAFA] min-h-screen`}>
        <div className="max-w-6xl mx-auto px-6 mb-32">
          <div className="mb-12 mt-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 flex items-center justify-center md:justify-start gap-3">
               <Gamepad2 size={36} className="text-blue-500"/> Gamer's Archive
            </h1>
            <p className="text-gray-500 text-lg">기획자의 시선으로 분석하며 플레이한 게임들의 상세한 인사이트 기록입니다.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
             <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-md">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-2">Total Games</span>
                <div className="text-4xl font-black">{totalGames}<span className="text-lg font-medium ml-1">개</span></div>
             </div>
             <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-2">PC</span>
                <div className="text-3xl font-extrabold text-blue-600">{pcGames}<span className="text-lg font-bold text-gray-400 ml-1">개</span></div>
             </div>
             <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-2">Mobile</span>
                <div className="text-3xl font-extrabold text-emerald-600">{mobileGames}<span className="text-lg font-bold text-gray-400 ml-1">개</span></div>
             </div>
             <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-2">Console</span>
                <div className="text-3xl font-extrabold text-purple-600">{consoleGames}<span className="text-lg font-bold text-gray-400 ml-1">개</span></div>
             </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start border-b border-gray-200 pb-8">
             {['All', 'PC', 'Mobile', 'Console'].map(platform => (
                <button 
                  key={platform}
                  onClick={() => setHistoryPageFilter(platform)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${historyPageFilter === platform ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'}`}
                >
                  {platform}
                </button>
             ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {playHistoryData
              .filter((game: any) => historyPageFilter === 'All' || game.platform === historyPageFilter)
              .map((game: any, index: number) => (
              <div key={game.id} className="p-6 rounded-[1.5rem] bg-white border border-gray-200 hover:shadow-lg transition-shadow flex flex-col group items-center text-center">
                 {isAdmin ? (
                    <div className="w-full space-y-2">
                       <EditableText isAdmin={isAdmin} value={game.title} onChange={(v: string) => { const n = [...playHistoryData]; n[index].title = v; setPlayHistoryData(n); }} className="font-bold text-center block" />
                       <EditableText isAdmin={isAdmin} value={game.platform} onChange={(v: string) => { const n = [...playHistoryData]; n[index].platform = v; setPlayHistoryData(n); }} className="text-xs text-center block" />
                       <EditableText isAdmin={isAdmin} value={game.genre} onChange={(v: string) => { const n = [...playHistoryData]; n[index].genre = v; setPlayHistoryData(n); }} className="text-xs text-center block" />
                       <EditableText isAdmin={isAdmin} value={game.hours} onChange={(v: string) => { const n = [...playHistoryData]; n[index].hours = v; setPlayHistoryData(n); }} className="text-xs text-center block" />
                    </div>
                 ) : (
                    <>
                       <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 mb-4 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
                         {game.platform === 'PC' ? <Monitor size={28}/> : game.platform === 'Mobile' ? <Smartphone size={28}/> : <Gamepad2 size={28}/>}
                       </div>
                       <h3 className="text-lg font-extrabold text-gray-900 leading-tight mb-2">{game.title}</h3>
                       <div className="flex flex-wrap justify-center items-center gap-1 mb-4">
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{game.platform}</span>
                          <span className="text-xs font-bold text-gray-500">{game.genre}</span>
                       </div>
                       <div className="mt-auto">
                          <span className="flex items-center justify-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                            <Clock size={12}/> 누적 {game.hours}
                          </span>
                       </div>
                    </>
                 )}
              </div>
            ))}

            {isAdmin && (
               <div onClick={() => setPlayHistoryData([...playHistoryData, { id: Date.now(), platform: 'PC', title: '신규 게임', genre: '장르', hours: '0' }])} className="p-6 rounded-[1.5rem] bg-gray-50 border-2 border-dashed border-emerald-300 hover:border-emerald-500 text-gray-400 hover:text-emerald-600 transition-colors flex flex-col items-center justify-center cursor-pointer min-h-[200px]">
                  <Plus size={40} className="mb-2 opacity-80" />
                  <span className="font-bold text-sm">신규 기록 추가</span>
               </div>
            )}
          </div>
        </div>
        <GlobalFooterCTA />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-emerald-200 relative">
      
      {toast.show && (
         <div className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-2 animate-in slide-in-from-top-5 duration-300 ${toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-500 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle size={18}/> : <Search size={18}/>}
            <span className="font-bold text-sm tracking-wide">{toast.message}</span>
         </div>
      )}

      <nav className="fixed w-full top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            onClick={() => handleNavClick('about')} 
            className="font-extrabold text-2xl tracking-tighter text-gray-900 cursor-pointer flex items-center gap-1"
          >
            SOLIP<span className="text-emerald-500 text-3xl leading-none">.</span>
          </div>
          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center text-sm font-bold text-gray-500">
            <button onClick={() => handleNavClick('about')} className={`${currentTab === 'about' ? 'text-emerald-600' : 'hover:text-gray-900'} transition-colors`}>About</button>
            <button onClick={() => handleNavClick('resume')} className={`${currentTab === 'resume' ? 'text-emerald-600' : 'hover:text-gray-900'} transition-colors`}>Resume</button>
            <button onClick={() => handleNavClick('portfolio')} className={`${(currentTab === 'portfolio' || currentTab === 'project-detail') ? 'text-emerald-600' : 'hover:text-gray-900'} transition-colors`}>Portfolio</button>
            <button onClick={() => handleNavClick('play-history')} className={`${currentTab === 'play-history' ? 'text-blue-600' : 'hover:text-gray-900'} transition-colors`}>Play History</button>
            
            <button 
               onClick={() => setIsContactModalOpen(true)} 
               className="bg-gray-900 text-white px-5 py-2.5 rounded-full shadow-md hover:bg-emerald-500 transition-colors ml-2 flex items-center gap-2"
            >
               Contact
            </button>

            <div className="w-px h-4 bg-gray-200 ml-2"></div>
            <button 
               onClick={handleAdminToggle} 
               className={`p-2 rounded-full transition-colors flex items-center gap-1 ${isAdmin ? 'bg-emerald-100 text-emerald-700 shadow-inner' : 'text-gray-300 hover:text-gray-600'}`}
               title="관리자 설정"
            >
               {isAdmin ? <Unlock size={18} /> : <Settings size={18} />}
               {isAdmin && <span className="text-xs font-bold mr-1">Edit Mode</span>}
            </button>
          </div>
        </div>
      </nav>

      {currentTab === 'about' && renderAbout()}
      {currentTab === 'resume' && renderResume()}
      {currentTab === 'portfolio' && renderPortfolio()}
      {currentTab === 'project-detail' && renderProjectDetail()}
      {currentTab === 'play-history' && renderPlayHistory()}

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsAuthModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">✕</button>
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Settings className="w-7 h-7 text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Admin Login</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">콘텐츠를 수정하려면 관리자 비밀번호를 입력하세요.</p>
            <div className="space-y-4">
               <input 
                  type="password" 
                  value={adminPwd}
                  onChange={e => setAdminPwd(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdminAuth()}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-center tracking-widest text-lg"
                  placeholder="••••"
                  autoFocus
               />
               <button onClick={handleAdminAuth} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors">접속하기</button>
            </div>
          </div>
        </div>
      )}

      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsContactModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsContactModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">✕</button>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Let's Connect!</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              새로운 세계를 함께 만들어가고 싶습니다.<br/>
              언제든 편하게 연락해 주세요.
            </p>
            <div className="space-y-3">
              <a href="tel:010-1234-5678" className="w-full flex items-center justify-center gap-3 py-4 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-gray-900 font-bold hover:bg-gray-50 hover:border-emerald-300 transition-colors">
                <Phone className="w-5 h-5 text-gray-500" /> 010-1234-5678
              </a>
              <a href="mailto:solip2202@gmail.com" className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-colors shadow-lg">
                <Mail className="w-5 h-5" /> solip2202@gmail.com
              </a>
            </div>
          </div>
        </div>
      )}

      {currentTab !== 'about' && (
         <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
            <button 
              onClick={handleScrollToTop} 
              className="w-12 h-12 bg-white text-gray-600 border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:text-emerald-500 transition-all group"
              title="Scroll to Top"
            >
               <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
            </button>
            <button 
              onClick={() => handleNavClick('about')} 
              className="w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-500 transition-transform hover:-translate-y-1 group"
              title="Go to About (Home)"
            >
               <Home size={24} className="group-hover:scale-110 transition-transform" />
            </button>
         </div>
      )}

      {currentTab === 'about' && (
         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 p-2 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full z-40">
            {[
               { id: 'hero', label: 'Intro' },
               { id: 'process', label: 'Process' },
               { id: 'archive', label: 'Archive' },
               { id: 'portfolio', label: 'Portfolio' }
            ].map(anchor => (
               <a key={anchor.id} href={`#${anchor.id}`} className="px-5 py-2 text-xs font-bold text-gray-500 hover:text-emerald-600 hover:bg-white rounded-full transition-all uppercase tracking-widest shadow-sm hover:shadow-md">
                  {anchor.label}
               </a>
            ))}
         </div>
      )}
    </div>
  );
}
