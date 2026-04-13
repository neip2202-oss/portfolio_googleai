import React, { useState } from 'react';
import EditorPopup from './EditorPopup';

interface EditableFieldProps {
  value: string;
  onChange: (val: string) => void;
  isAdmin: boolean;
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  mediaMode?: boolean;
  editorTitle?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  isAdmin,
  tagName: Tag = 'div',
  className,
  style,
  multiline = false,
  mediaMode = false,
  editorTitle,
}) => {
  const [showEditor, setShowEditor] = useState(false);

  if (!isAdmin) {
    if (mediaMode && value) {
      if (value.startsWith('data:video') || value.endsWith('.mp4') || value.endsWith('.webm')) {
        return <video src={value} controls style={{ ...style, maxWidth: '100%', objectFit: 'contain' }} />;
      }
      return <img src={value} alt="" style={{ ...style, maxWidth: '100%', objectFit: 'cover' }} />;
    }
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  // Admin mode: show clickable element that opens popup
  return (
    <>
      <Tag
        className={className}
        style={{
          ...style,
          cursor: 'pointer',
          outline: '1px dashed rgba(255, 107, 203, 0.4)',
          outlineOffset: '2px',
          position: 'relative',
        }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          setShowEditor(true);
        }}
        title="클릭하여 편집"
      >
        {mediaMode ? (
          value ? (
            value.startsWith('data:video') ? (
              <video src={value} style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }} />
            ) : (
              <img src={value} alt="" style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'cover' }} />
            )
          ) : (
            <span style={{ color: 'var(--pixel-text-dim)', fontStyle: 'italic' }}>📎 클릭하여 미디어 추가</span>
          )
        ) : (
          value || <span style={{ color: 'var(--pixel-text-dim)', fontStyle: 'italic' }}>클릭하여 편집</span>
        )}
      </Tag>
      <EditorPopup
        isOpen={showEditor}
        value={value}
        onSave={onChange}
        onClose={() => setShowEditor(false)}
        title={editorTitle || (mediaMode ? '미디어 편집' : multiline ? '텍스트 편집' : '텍스트 편집')}
        mediaMode={mediaMode}
      />
    </>
  );
};
