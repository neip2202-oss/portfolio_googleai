import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EditorPopupProps {
  isOpen: boolean;
  value: string;
  onSave: (value: string) => void;
  onClose: () => void;
  title?: string;
  mediaMode?: boolean; // for image/video/gif fields
}

const TOOLBAR_ACTIONS = [
  { label: 'H1', md: '# ', icon: 'H1' },
  { label: 'H2', md: '## ', icon: 'H2' },
  { label: 'H3', md: '### ', icon: 'H3' },
  { label: 'Bold', md: '**', wrap: true, icon: 'B' },
  { label: 'Italic', md: '*', wrap: true, icon: 'I' },
  { label: 'Link', md: '[텍스트](URL)', icon: '🔗' },
  { label: 'Image', md: '![설명](이미지URL)', icon: '🖼️' },
  { label: 'GIF', md: '[gif](GIF_URL)', icon: '🎞️' },
  { label: 'Video', md: '[video](비디오URL)', icon: '🎬' },
  { label: 'List', md: '- ', icon: '•' },
];

/** Simple markdown preview renderer */
const renderPreview = (md: string): React.ReactNode[] => {
  return md.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <h4 key={i} style={{ color: 'var(--pixel-accent)', margin: '0.5rem 0', fontWeight: 700 }}>{line.slice(4)}</h4>;
    if (line.startsWith('## ')) return <h3 key={i} style={{ color: 'var(--pixel-primary)', margin: '0.5rem 0', fontWeight: 700, fontSize: '1.1rem' }}>{line.slice(3)}</h3>;
    if (line.startsWith('# ')) return <h2 key={i} style={{ color: '#fff', margin: '0.5rem 0', fontWeight: 800, fontSize: '1.3rem' }}>{line.slice(2)}</h2>;
    if (line.match(/!\[([^\]]*)\]\(([^)]+)\)/)) {
      const m = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)!;
      return <img key={i} src={m[2]} alt={m[1]} style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', border: '1px solid var(--pixel-border)', margin: '0.5rem 0' }} />;
    }
    if (line.match(/\[video\]\(([^)]+)\)/i)) {
      const m = line.match(/\[video\]\(([^)]+)\)/i)!;
      return <video key={i} src={m[1]} controls style={{ maxWidth: '100%', maxHeight: 200, margin: '0.5rem 0' }} />;
    }
    if (line.match(/\[gif\]\(([^)]+)\)/i)) {
      const m = line.match(/\[gif\]\(([^)]+)\)/i)!;
      return <img key={i} src={m[1]} alt="GIF" style={{ maxWidth: '100%', maxHeight: 200, margin: '0.5rem 0' }} />;
    }
    if (line.trim() === '') return <br key={i} />;
    // Bold/italic inline
    let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    return <p key={i} style={{ margin: '0.2rem 0', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: processed }} />;
  });
};

const EditorPopup: React.FC<EditorPopupProps> = ({ isOpen, value, onSave, onClose, title = '콘텐츠 편집', mediaMode = false }) => {
  const [content, setContent] = useState(value);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset content when popup opens
  React.useEffect(() => {
    if (isOpen) setContent(value);
  }, [isOpen, value]);

  const insertAtCursor = (text: string, wrap = false) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end);

    let newText: string;
    if (wrap && selected) {
      newText = content.substring(0, start) + text + selected + text + content.substring(end);
    } else {
      newText = content.substring(0, start) + text + content.substring(end);
    }
    setContent(newText);
    // Refocus
    setTimeout(() => {
      ta.focus();
      const newPos = wrap ? start + text.length + selected.length + text.length : start + text.length;
      ta.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (mediaMode) {
        // For media-only fields, just set the URL directly
        setContent(dataUrl);
      } else {
        // For text fields, insert markdown
        if (file.type.startsWith('video/')) {
          insertAtCursor(`[video](${dataUrl})`);
        } else {
          insertAtCursor(`![${file.name}](${dataUrl})`);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="admin-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ zIndex: 300 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--pixel-bg-alt)',
              border: '3px solid var(--pixel-border)',
              padding: '1.5rem',
              width: '92%',
              maxWidth: 700,
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 0 60px rgba(108, 63, 181, 0.4)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--pixel-yellow)', letterSpacing: '2px', margin: 0 }}>
                ✏️ {title}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setShowPreview(!showPreview)} style={{
                  fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', padding: '6px 12px',
                  background: showPreview ? 'var(--pixel-accent)' : 'var(--pixel-surface)',
                  color: showPreview ? '#000' : 'var(--pixel-text)', border: '2px solid var(--pixel-border)', cursor: 'pointer',
                }}>
                  {showPreview ? '편집' : '미리보기'}
                </button>
                <button onClick={onClose} style={{
                  fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', padding: '6px 12px',
                  background: 'none', color: 'var(--pixel-primary)', border: '2px solid var(--pixel-border)', cursor: 'pointer',
                }}>
                  ✕
                </button>
              </div>
            </div>

            {/* Toolbar */}
            {!showPreview && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '0.75rem', borderBottom: '1px solid var(--pixel-border)', paddingBottom: '0.75rem' }}>
                {TOOLBAR_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => insertAtCursor(action.md, action.wrap)}
                    title={action.label}
                    style={{
                      fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', padding: '4px 8px',
                      background: 'var(--pixel-surface)', color: 'var(--pixel-text)',
                      border: '1px solid var(--pixel-border)', cursor: 'pointer',
                    }}
                  >
                    {action.icon}
                  </button>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="파일 업로드"
                  style={{
                    fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', padding: '4px 8px',
                    background: 'var(--pixel-primary)', color: '#000',
                    border: '1px solid var(--pixel-border)', cursor: 'pointer',
                  }}
                >
                  📎 첨부
                </button>
                <input ref={fileInputRef} type="file" accept="image/*,video/*,.gif" style={{ display: 'none' }} onChange={handleFileUpload} />
              </div>
            )}

            {/* Content Area */}
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              {showPreview ? (
                <div style={{ padding: '1rem', color: 'var(--pixel-text)', lineHeight: 1.8 }}>
                  {mediaMode && content.startsWith('data:') ? (
                    content.startsWith('data:video') ? (
                      <video src={content} controls style={{ maxWidth: '100%', maxHeight: 300 }} />
                    ) : (
                      <img src={content} alt="Preview" style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }} />
                    )
                  ) : (
                    renderPreview(content)
                  )}
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{
                    width: '100%', height: '100%', minHeight: '250px',
                    background: 'var(--pixel-bg)', color: 'var(--pixel-text)',
                    border: '2px solid var(--pixel-border)', padding: '1rem',
                    fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                    lineHeight: 1.8, resize: 'vertical',
                  }}
                  placeholder={mediaMode ? '이미지/비디오 URL을 입력하거나 파일을 첨부하세요...' : '마크다운을 입력하세요...\n\n# 제목\n## 소제목\n**볼드** *이탤릭*\n![이미지](URL)\n[gif](URL)\n[video](URL)'}
                />
              )}
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--pixel-border)' }}>
              <button onClick={onClose} style={{
                fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', padding: '10px 20px',
                background: 'transparent', color: 'var(--pixel-text-dim)', border: '2px solid var(--pixel-border)', cursor: 'pointer',
              }}>
                취소
              </button>
              <button onClick={() => { onSave(content); onClose(); }} style={{
                fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', padding: '10px 20px',
                background: 'var(--pixel-green)', color: '#000', border: '2px solid var(--pixel-green)', cursor: 'pointer',
              }}>
                💾 저장
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditorPopup;
