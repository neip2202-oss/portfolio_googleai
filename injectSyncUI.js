import fs from 'fs';
let c = fs.readFileSync('src/App.tsx', 'utf8');

const syncLogic = `
  const handleSyncToDefault = async (tabName: string) => {
    if (!isAdmin || selectedCompany === 'default') return;
    if (!window.confirm(\`현재 '\${tabName}' 탭의 내용이 기본 데이터로 교체됩니다. 계속하시겠습니까?\`)) return;

    let keysToSync: string[] = [];
    let setters: any[] = [];

    if (tabName === '메인') {
      keysToSync = ['aboutData', 'workProcessData', 'timelineLeftData', 'activitiesLeftData', 'activitiesRightData'];
      setters = [setAboutData, setWorkProcessData, setTimelineLeftData, setActivitiesLeftData, setActivitiesRightData];
    } else if (tabName === '포트폴리오' || tabName === '기획서') {
      keysToSync = ['projectsData', 'otherWorksData', 'planData'];
      setters = [setProjectsData, setOtherWorksData, setPlanData];
    } else if (tabName === '이력서' || tabName === '자기소개서') {
      keysToSync = ['coverLetterData', 'workTools', 'collabTools', 'engineTools', 'designTools', 'aiTools', 'certifications'];
      setters = [setCoverLetterData, setWorkTools, setCollabTools, setEngineTools, setDesignTools, setAiTools, setCertifications];
    } else if (tabName === '플레이 기록') {
      keysToSync = ['playHistoryData'];
      setters = [setPlayHistoryData];
    }

    try {
      for (let i = 0; i < keysToSync.length; i++) {
        const key = keysToSync[i];
        const defaultRows = await supabaseFetch(\`site_content?key=eq.\${key}&select=value\`);
        if (defaultRows && defaultRows.length > 0) {
          setters[i](defaultRows[0].value);
        }
      }
      showToast(\`'\${tabName}' 탭이 기본 데이터로 성공적으로 동기화되었습니다.\`, 'success');
    } catch (e) {
      console.error(e);
      showToast('동기화 중 오류가 발생했습니다.', 'error');
    }
  };

  const SyncButton = ({ tabName }: { tabName: string }) => {
    if (!isAdmin || selectedCompany === 'default') return null;
    return (
      <div className="flex justify-end px-6 max-w-6xl mx-auto w-full pt-4 z-10 relative print:hidden mb-2">
        <button 
          onClick={() => handleSyncToDefault(tabName)} 
          className="flex items-center gap-2 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all"
        >
          <Database size={16} />
          [기본 데이터 불러오기]
        </button>
      </div>
    );
  };
`;

c = c.replace('  const handleExportPdf = () => {', syncLogic + '\n  const handleExportPdf = () => {');

// Inject into tabs
c = c.replace(
  `  const renderAbout = () => (
    <div className={\`transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'}\`}>
      
      <section id="hero"`,
  `  const renderAbout = () => (
    <div className={\`transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'}\`}>
      <SyncButton tabName="메인" />
      <section id="hero"`
);

c = c.replace(
  `  const renderResume = () => (
    <div id="resume-export-area" className={\`pt-24 pb-24 transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'} bg-[#FAFAFA] min-h-screen\`}>
      <div className="max-w-5xl mx-auto px-6">`,
  `  const renderResume = () => (
    <div id="resume-export-area" className={\`pt-24 pb-24 transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'} bg-[#FAFAFA] min-h-screen\`}>
      <SyncButton tabName="이력서" />
      <div className="max-w-5xl mx-auto px-6">`
);

c = c.replace(
  `  const renderPortfolio = () => (
    <div className={\`pt-24 transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'} bg-white min-h-screen\`}>
      <div className="max-w-6xl mx-auto px-6 mb-32">`,
  `  const renderPortfolio = () => (
    <div className={\`pt-24 transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'} bg-white min-h-screen\`}>
      <SyncButton tabName="포트폴리오" />
      <div className="max-w-6xl mx-auto px-6 mb-32">`
);

c = c.replace(
  `  const renderPlayHistory = () => {
    const totalGames = playHistoryData.length;
    const pcGames = playHistoryData.filter((g: any) => g.platform === 'PC').length;
    const mobileGames = playHistoryData.filter((g: any) => g.platform === 'Mobile').length;
    const consoleGames = playHistoryData.filter((g: any) => g.platform === 'Console').length;

    return (
      <div className={\`pt-24 transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'} bg-white min-h-screen pb-32\`}>
        <div className="max-w-6xl mx-auto px-6">`,
  `  const renderPlayHistory = () => {
    const totalGames = playHistoryData.length;
    const pcGames = playHistoryData.filter((g: any) => g.platform === 'PC').length;
    const mobileGames = playHistoryData.filter((g: any) => g.platform === 'Mobile').length;
    const consoleGames = playHistoryData.filter((g: any) => g.platform === 'Console').length;

    return (
      <div className={\`pt-24 transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'} bg-white min-h-screen pb-32\`}>
        <SyncButton tabName="플레이 기록" />
        <div className="max-w-6xl mx-auto px-6">`
);

fs.writeFileSync('src/App.tsx', c);
console.log('Sync UI components injected successfully');
