import React from 'react';
import './SectionTitle.css';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = 'left',
}) => (
  <div className={`section-title section-title--${align}`}>
    <h2 className="section-title__heading">{title}</h2>
    {subtitle && <p className="section-title__sub">{subtitle}</p>}
  </div>
);

export default SectionTitle;
