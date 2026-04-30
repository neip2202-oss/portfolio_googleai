import fs from 'fs';
let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. renderAbout
c = c.replace(
  /const renderAbout = \(\) => \([\s\S]*?<div className=\{`transition-opacity duration-500 \$\{isVisible \? 'opacity-100' : 'opacity-0'\}`\}>/,
  `const renderAbout = () => (
    <div className={\`transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'}\`}>
      <SyncButton tabName="메인" />`
);

// 2. renderResume
c = c.replace(
  /const renderResume = \(\) => \([\s\S]*?<div id="resume-export-area" className=\{`pt-24 pb-24 transition-opacity duration-500 \$\{isVisible \? 'opacity-100' : 'opacity-0'\} bg-\[#FAFAFA\] min-h-screen`\}>/,
  `const renderResume = () => (
    <div id="resume-export-area" className={\`pt-24 pb-24 transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'} bg-[#FAFAFA] min-h-screen\`}>
      <SyncButton tabName="이력서" />`
);

// 3. renderPortfolio
c = c.replace(
  /const renderPortfolio = \(\) => \([\s\S]*?<div className=\{`pt-24 transition-opacity duration-500 \$\{isVisible \? 'opacity-100' : 'opacity-0'\} bg-white min-h-screen`\}>/,
  `const renderPortfolio = () => (
    <div className={\`pt-24 transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'} bg-white min-h-screen\`}>
      <SyncButton tabName="포트폴리오" />`
);

// 4. renderPlayHistory
c = c.replace(
  /return \([\s\S]*?<div className=\{`pt-24 transition-opacity duration-500 \$\{isVisible \? 'opacity-100' : 'opacity-0'\} bg-\[#FAFAFA\] min-h-screen`\}>[\s\S]*?<div className="max-w-6xl mx-auto px-6 mb-32">/,
  `return (
      <div className={\`pt-24 transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'} bg-[#FAFAFA] min-h-screen\`}>
        <SyncButton tabName="플레이 기록" />
        <div className="max-w-6xl mx-auto px-6 mb-32">`
);

fs.writeFileSync('src/App.tsx', c);
console.log('Regex injection succeeded');
