import React from 'react';
import SectionTitle from '../components/SectionTitle';
import { useReveal } from '../hooks/useReveal';
import { workStyles } from '../data/workStyle';
import './HowIWorkSection.css';

const HowIWorkSection: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section id="how-i-work" className="section section--alt" ref={ref}>
      <div className={`section__inner reveal ${isVisible ? 'visible' : ''}`}>
        <SectionTitle title="How I Work" subtitle="이렇게 일합니다" />
        <div className="work__grid">
          {workStyles.map((w, i) => (
            <div key={i} className="work-card">
              <div className="work-card__number">{String(i + 1).padStart(2, '0')}</div>
              <span className="work-card__icon">{w.icon}</span>
              <h3 className="work-card__title">{w.title}</h3>
              <p className="work-card__desc">{w.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowIWorkSection;
