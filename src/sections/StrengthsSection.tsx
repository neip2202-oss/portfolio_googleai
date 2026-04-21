import React from 'react';
import SectionTitle from '../components/SectionTitle';
import { useReveal } from '../hooks/useReveal';
import { strengths } from '../data/skills';
import './StrengthsSection.css';

const StrengthsSection: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section id="strengths" className="section section--alt" ref={ref}>
      <div className={`section__inner reveal ${isVisible ? 'visible' : ''}`}>
        <SectionTitle title="What I Do" subtitle="핵심 역량" />
        <div className="strengths__grid">
          {strengths.map((s, i) => (
            <div key={i} className="strength-card">
              <span className="strength-card__icon">{s.icon}</span>
              <h3 className="strength-card__title">{s.title}</h3>
              <p className="strength-card__desc">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StrengthsSection;
