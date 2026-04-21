import React from 'react';

interface TagProps {
  label: string;
  variant?: 'default' | 'accent';
}

const Tag: React.FC<TagProps> = ({ label, variant = 'default' }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 10px',
      fontSize: 'var(--text-caption)',
      fontWeight: 500,
      borderRadius: 'var(--radius-full)',
      border: '1px solid',
      borderColor: variant === 'accent' ? 'var(--color-accent)' : 'var(--color-border)',
      color: variant === 'accent' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
      background: variant === 'accent' ? 'var(--color-accent-light)' : 'transparent',
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </span>
);

export default Tag;
