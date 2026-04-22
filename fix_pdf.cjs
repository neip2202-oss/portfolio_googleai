const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

if (!c.includes('import html2canvas')) {
  c = `import html2canvas from 'html2canvas';\nimport { jsPDF } from 'jspdf';\n` + c;
}

// 1. Rename isAdmin state
if (!c.includes('const [isAdminMode, setIsAdminMode]')) {
  c = c.replace(
    /const \[isAdmin, setIsAdmin\] = useState\(false\);/,
    `const [isAdminMode, setIsAdminMode] = useState(false);\n  const [isPreviewingPdf, setIsPreviewingPdf] = useState(false);\n  const [pdfPreviewData, setPdfPreviewData] = useState<string | null>(null);\n  const isAdmin = isPreviewingPdf ? false : isAdminMode;`
  );
}

// 2. Fix setIsAdmin calls
c = c.replace(/setIsAdmin\(false\)/g, 'setIsAdminMode(false)');
c = c.replace(/setIsAdmin\(true\)/g, 'setIsAdminMode(true)');

// 3. Add handleExportPdf function
if (!c.includes('handleExportPdf')) {
  c = c.replace(
    /const handleAdminToggle = \(\) => \{/,
    `const handleExportPdf = async () => {
    setIsPreviewingPdf(true); // Disable admin mode temporarily
    
    // Give React time to re-render without admin UI
    setTimeout(async () => {
      const element = document.getElementById('resume-export-area');
      if (element) {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#FAFAFA' });
        setPdfPreviewData(canvas.toDataURL('image/png'));
      }
      setIsPreviewingPdf(false); // Restore admin mode
    }, 500);
  };

  const handleDownloadPdf = () => {
    if (!pdfPreviewData) return;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // We want to fit the image width to A4 width, and adjust height proportionally.
    // Assuming the image might be longer than 1 page.
    const imgProps = pdf.getImageProperties(pdfPreviewData);
    const ratio = imgProps.width / imgProps.height;
    
    const renderedHeight = pdfWidth / ratio;
    
    let heightLeft = renderedHeight;
    let position = 0;
    
    pdf.addImage(pdfPreviewData, 'PNG', 0, position, pdfWidth, renderedHeight);
    heightLeft -= pdfHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - renderedHeight;
      pdf.addPage();
      pdf.addImage(pdfPreviewData, 'PNG', 0, position, pdfWidth, renderedHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save('resume.pdf');
    setPdfPreviewData(null);
  };

  const handleAdminToggle = () => {`
  );
}

// 4. Wrap renderResume in #resume-export-area
c = c.replace(
  /const renderResume = \(\) => \(\n\s*<div className=\{`pt-24 pb-24 transition-opacity duration-500 \$\{isVisible \? 'opacity-100' : 'opacity-0'\} bg-\[#FAFAFA\] min-h-screen`\}>/,
  `const renderResume = () => (
    <div id="resume-export-area" className={\`pt-24 pb-24 transition-opacity duration-500 \${isVisible ? 'opacity-100' : 'opacity-0'} bg-[#FAFAFA] min-h-screen\`}>`
);

// 5. Add PDF Button to floating buttons
c = c.replace(
  /\{currentTab !== 'about' && \(\n\s*<div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">/,
  `{currentTab !== 'about' && (
         <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
            {currentTab === 'resume' && isAdminMode && (
               <button 
                 onClick={handleExportPdf}
                 disabled={isPreviewingPdf}
                 className="w-14 h-14 md:w-auto md:px-5 bg-red-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-red-600 transition-transform hover:-translate-y-1 group gap-0 md:gap-2 font-bold"
                 title="Export PDF"
               >
                  <Download size={24} className="group-hover:-translate-y-1 transition-transform" /> <span className="hidden md:inline">PDF 출력</span>
               </button>
            )}`
);

// 6. Add PdfPreviewModal to the end of App
if (!c.includes('id="pdf-preview-modal"')) {
  c = c.replace(
    /<\/div>\n\s*\);\n\s*\}\s*$/,
    `      {/* PDF Preview Modal */}
      {pdfPreviewData && (
        <div id="pdf-preview-modal" className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setPdfPreviewData(null)}></div>
          <div className="relative bg-gray-100 w-full max-w-4xl h-full max-h-[90vh] rounded-2xl p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Download className="text-red-500" /> PDF 미리보기</h2>
              <button onClick={() => setPdfPreviewData(null)} className="text-gray-500 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors">✕</button>
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-300 rounded-xl p-4 flex justify-center border border-gray-300 shadow-inner">
              {/* A4 Proportion Container */}
              <div className="bg-white shadow-xl relative w-full max-w-[794px]" style={{ minHeight: '1123px' }}>
                <img src={pdfPreviewData} alt="PDF Preview" className="w-full h-auto block" />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
               <button onClick={() => setPdfPreviewData(null)} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">취소</button>
               <button onClick={handleDownloadPdf} className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg flex items-center gap-2 transition-colors">
                 <Download size={18} /> PDF 저장하기
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`
  );
}

fs.writeFileSync('src/App.tsx', c);
