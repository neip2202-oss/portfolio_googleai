import React from 'react';
import { useReveal } from '../hooks/useReveal';
import { profile } from '../data/profile';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>(0.1);

  return (
    <section id="hero" className="hero" ref={ref}>
      <div className={`hero__inner ${isVisible ? 'visible' : ''}`}>
        <p className="hero__label">{profile.role}</p>
        <h1 className="hero__title">
          {profile.tagline.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>
        <p className="hero__description">{profile.description}</p>
        <div className="hero__cta">
          <a href="#about" className="hero__btn hero__btn--primary">
            About me
          </a>
          <a href="#projects" className="hero__btn hero__btn--secondary">
            Projects →
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
