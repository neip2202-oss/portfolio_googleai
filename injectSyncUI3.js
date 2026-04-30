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

c = c.replace(
  '  const renderAbout = () => (\r\n    <div className={`transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'}`}>',
  '  const renderAbout = () => (\r\n    <div className={`transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'}`}>\r\n      <SyncButton tabName="메인" />'
);

c = c.replace(
  '  const renderResume = () => (\r\n    <div id="resume-export-area" className={`pt-24 pb-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-[#FAFAFA] min-h-screen`}>',
  '  const renderResume = () => (\r\n    <div id="resume-export-area" className={`pt-24 pb-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-[#FAFAFA] min-h-screen`}>\r\n      <SyncButton tabName="이력서" />'
);

c = c.replace(
  '  const renderPortfolio = () => (\r\n    <div className={`pt-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-white min-h-screen`}>',
  '  const renderPortfolio = () => (\r\n    <div className={`pt-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-white min-h-screen`}>\r\n      <SyncButton tabName="포트폴리오" />'
);

c = c.replace(
  '    return (\r\n      <div className={`pt-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-[#FAFAFA] min-h-screen`}>',
  '    return (\r\n      <div className={`pt-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-[#FAFAFA] min-h-screen`}>\r\n        <SyncButton tabName="플레이 기록" />'
);

// Fallback for LF line endings just in case
c = c.replace(
  '  const renderAbout = () => (\n    <div className={`transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'}`}>',
  '  const renderAbout = () => (\n    <div className={`transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'}`}>\n      <SyncButton tabName="메인" />'
);

c = c.replace(
  '  const renderResume = () => (\n    <div id="resume-export-area" className={`pt-24 pb-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-[#FAFAFA] min-h-screen`}>',
  '  const renderResume = () => (\n    <div id="resume-export-area" className={`pt-24 pb-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-[#FAFAFA] min-h-screen`}>\n      <SyncButton tabName="이력서" />'
);

c = c.replace(
  '  const renderPortfolio = () => (\n    <div className={`pt-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-white min-h-screen`}>',
  '  const renderPortfolio = () => (\n    <div className={`pt-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-white min-h-screen`}>\n      <SyncButton tabName="포트폴리오" />'
);

c = c.replace(
  '    return (\n      <div className={`pt-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-[#FAFAFA] min-h-screen`}>',
  '    return (\n      <div className={`pt-24 transition-opacity duration-500 ${isVisible ? \'opacity-100\' : \'opacity-0\'} bg-[#FAFAFA] min-h-screen`}>\n        <SyncButton tabName="플레이 기록" />'
);

fs.writeFileSync('src/App.tsx', c);
console.log('Safe exact string injection succeeded!');
