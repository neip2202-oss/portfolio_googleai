import React from 'react';

interface EditableFieldProps {
  value: string;
  onChange: (val: string) => void;
  isAdmin: boolean;
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  isAdmin,
  tagName: Tag = 'div',
  className,
  style,
  multiline = false,
}) => {
  if (isAdmin) {
    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
          style={{ ...style, width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.1)', color: 'inherit', border: '1px dashed var(--pixel-primary)' }}
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        style={{ ...style, width: '100%', background: 'rgba(255,255,255,0.1)', color: 'inherit', border: '1px dashed var(--pixel-primary)' }}
      />
    );
  }

  // Allow basic markdown links [text](url) and images ![alt](url) using simple regex replacement, or just plain text if not markdown
  // For this simple editable, just return text (we will handle markdown content separately for project descriptions)
  return <Tag className={className} style={style}>{value}</Tag>;
};
