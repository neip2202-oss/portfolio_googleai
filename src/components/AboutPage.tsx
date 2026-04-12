import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabaseFetch, hasContent } from '../utils/supabase';
import { DEFAULT_RESUME, type ResumeData } from '../data/defaults';

interface AboutPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack, onNavigate }) => {
  const [resume, setResume] = useState<ResumeData>(DEFAULT_RESUME);

  useEffect(() => {
    supabaseFetch('site_content?key=eq.resume_data&select=value')
      .then((rows) => {
        if (rows && rows.length > 0 && hasContent(rows[0].value)) {
          setResume(rows[0].value as ResumeData);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div
      className="page-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation */}
      <nav className="page-nav">
        <button className="page-back-btn" onClick={onBack}>← MAP</button>
        <div className="page-nav-logo" onClick={onBack}>SOLIP'S WORLD</div>
        <ul className="page-nav-links">
          <li><button className="page-nav-link active">About</button></li>
          <li><button className="page-nav-link" onClick={() => onNavigate('projects')}>Projects</button></li>
          <li><button className="page-nav-link" onClick={() => onNavigate('board')}>Board</button></li>
        </ul>
      </nav>

      {/* Hero */}
      <div className="about-hero">
        <motion.div
          className="about-name"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {resume.name}
        </motion.div>
        <motion.div
          className="about-role"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {resume.role}
        </motion.div>
        <motion.p
          className="about-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {resume.summary}
        </motion.p>
      </div>

      {/* Experience */}
      <div className="about-section">
        <div className="section-title">EXPERIENCE</div>
        <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>프로젝트 경험</div>
        {resume.experience.map((exp, i) => (
          <motion.div
            key={i}
            className="about-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="about-card-title">{exp.title}</div>
            <div className="about-card-period">{exp.period}</div>
            <div className="about-card-desc">{exp.description}</div>
            {exp.details.length > 0 && (
              <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem' }}>
                {exp.details.map((d, j) => (
                  <li key={j} style={{ color: 'var(--pixel-text-dim)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>

      {/* Education */}
      <div className="about-section">
        <div className="section-title">EDUCATION</div>
        <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>교육 이력</div>
        {resume.education.map((edu, i) => (
          <motion.div
            key={i}
            className="about-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="about-card-title">{edu.title}</div>
            <div className="about-card-period">{edu.period}</div>
            <div className="about-card-desc">{edu.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Awards */}
      <div className="about-section">
        <div className="section-title">AWARDS</div>
        <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>수상 및 자격증</div>
        {resume.awards.map((award, i) => (
          <motion.div
            key={i}
            className="about-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="about-card-title">{award.title}</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span className="about-card-period">{award.organization}</span>
              <span style={{ color: 'var(--pixel-yellow)', fontFamily: 'var(--font-retro)', fontSize: '1.05rem' }}>
                {award.year}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="contact-cta">
        <div className="contact-title">LET'S CONNECT!</div>
        <div className="contact-desc">함께 게임을 만들어요.</div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="contact-btn" href={`mailto:${resume.email}`}>Email →</a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(108, 63, 181, 0.2)' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: 'var(--pixel-text-dim)' }}>
          © 2024 {resume.name} — {resume.role}
        </div>
      </footer>
    </motion.div>
  );
};

export default AboutPage;
