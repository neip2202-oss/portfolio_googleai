import React from 'react';
import SectionTitle from '../components/SectionTitle';
import { useReveal } from '../hooks/useReveal';
import { profile } from '../data/profile';
import { skills } from '../data/skills';
import './AboutSection.css';

const AboutSection: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section id="about" className="section" ref={ref}>
      <div className={`section__inner reveal ${isVisible ? 'visible' : ''}`}>
        <SectionTitle title="About" subtitle={profile.nameEn + ' · ' + profile.role} />

        <div className="about__grid">
          {/* 소개 텍스트 */}
          <div className="about__text">
            {profile.about.map((p, i) => (
              <p key={i} className="about__paragraph">{p}</p>
            ))}
            {/* Philosophy 흡수 */}
            <blockquote className="about__philosophy">
              {profile.philosophy}
            </blockquote>
          </div>

          {/* 사이드: 경력 + 스킬 */}
          <aside className="about__aside">
            {/* 경력 */}
            <div className="about__block">
              <h3 className="about__block-title">Career</h3>
              {profile.career.map((c, i) => (
                <div key={i} className="about__career-item">
                  <span className="about__career-period">{c.period}</span>
                  <strong className="about__career-company">{c.company}</strong>
                  <span className="about__career-role">{c.role}</span>
                </div>
              ))}
            </div>

            {/* 스킬 */}
            <div className="about__block">
              <h3 className="about__block-title">Skills & Tools</h3>
              <div className="about__skills">
                {skills.map((s) => (
                  <span key={s.name} className="about__skill-tag">{s.name}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
