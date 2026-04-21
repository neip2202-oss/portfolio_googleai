import React from 'react';
import { useReveal } from '../hooks/useReveal';
import { profile } from '../data/profile';
import './ContactSection.css';

const ContactSection: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section id="contact" className="section" ref={ref}>
      <div className={`section__inner section__inner--narrow reveal ${isVisible ? 'visible' : ''}`} style={{ textAlign: 'center' }}>
        <h2 className="contact__title">Contact</h2>
        <p className="contact__subtitle">함께 일하고 싶으시다면, 편하게 연락해주세요.</p>
        <a href={`mailto:${profile.email}`} className="contact__email">
          {profile.email}
        </a>
        <div className="contact__links">
          {Object.entries(profile.links).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__link"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
