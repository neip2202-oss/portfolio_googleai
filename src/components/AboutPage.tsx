import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useContent } from '../hooks/useContent';
import { EditableField } from './Editable';
import { DEFAULT_RESUME, type ResumeData } from '../data/defaults';

interface AboutPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onGoIntro: () => void;
  isAdmin: boolean;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack, onNavigate, onGoIntro, isAdmin }) => {
  const [resume, setResume] = useContent<ResumeData>('resume_data', DEFAULT_RESUME);
  const [selfIntroTab, setSelfIntroTab] = useState(0);

  const updateField = (key: keyof ResumeData, value: any) => {
    setResume((prev: ResumeData) => ({ ...prev, [key]: value }));
  };

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
        <div className="page-nav-logo" onClick={onGoIntro}>SOLIP'S WORLD</div>
        <ul className="page-nav-links">
          <li><button className="page-nav-link" onClick={() => onNavigate('board')}>Board</button></li>
          <li><button className="page-nav-link active">About</button></li>
          <li><button className="page-nav-link" onClick={() => onNavigate('projects')}>Projects</button></li>
          <li><a className="page-nav-link" href={`mailto:${resume.email}`}>Contact</a></li>
        </ul>
      </nav>

      {/* === Profile Hero === */}
      <section className="about-hero" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div style={{
            width: 200, height: 200, borderRadius: '50%', overflow: 'hidden',
            border: '4px solid var(--pixel-primary)', boxShadow: 'var(--pixel-glow-pink)',
          }}>
            <EditableField
              value={resume.image}
              onChange={(v) => updateField('image', v)}
              isAdmin={isAdmin}
              mediaMode
              editorTitle="프로필 이미지"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ textAlign: 'left', maxWidth: 500 }}
        >
          <div className="about-name">
            <EditableField value={resume.name} onChange={(v) => updateField('name', v)} isAdmin={isAdmin} editorTitle="이름" />
          </div>
          <div className="about-role" style={{ marginBottom: '0.75rem' }}>
            <EditableField value={resume.oneLineIntro} onChange={(v) => updateField('oneLineIntro', v)} isAdmin={isAdmin} editorTitle="한 줄 소개" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', fontSize: '0.95rem', color: 'var(--pixel-text)' }}>
            <div><span style={{ color: 'var(--pixel-text-dim)' }}>생년월일</span></div>
            <div><EditableField value={resume.dob} onChange={(v) => updateField('dob', v)} isAdmin={isAdmin} /></div>

            <div><span style={{ color: 'var(--pixel-text-dim)' }}>이메일</span></div>
            <div>
              {isAdmin ? (
                <EditableField value={resume.email} onChange={(v) => updateField('email', v)} isAdmin={isAdmin} />
              ) : (
                <a href={`mailto:${resume.email}`} style={{ color: 'var(--pixel-accent)', textDecoration: 'none' }}>{resume.email}</a>
              )}
            </div>

            <div><span style={{ color: 'var(--pixel-text-dim)' }}>노션</span></div>
            <div>
              {isAdmin ? (
                <EditableField value={resume.notion} onChange={(v) => updateField('notion', v)} isAdmin={isAdmin} />
              ) : (
                <a href={`https://${resume.notion}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pixel-accent)', textDecoration: 'none' }}>{resume.notion}</a>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* === Logline === */}
      <div className="about-section" style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="section-title">LOGLINE</div>
        <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: '#fff', lineHeight: 1.8 }}>
          <EditableField value={resume.summary} onChange={(v) => updateField('summary', v)} isAdmin={isAdmin} multiline editorTitle="로그라인" />
        </h2>
      </div>

      {/* === Skills & Tools === */}
      <div className="about-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="section-title">SKILLS & TOOLS</div>
        <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>보유 기술</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {resume.skills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--pixel-surface)', border: '2px solid var(--pixel-border)',
                padding: '8px 16px', fontSize: '0.95rem'
              }}
            >
              <span>{skill.icon}</span>
              {isAdmin ? (
                <input
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...resume.skills];
                    newSkills[i] = { ...newSkills[i], name: e.target.value };
                    updateField('skills', newSkills);
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#fff', width: '80px' }}
                />
              ) : (
                <span style={{ color: '#fff' }}>{skill.name}</span>
              )}
              {isAdmin && (
                <button onClick={() => {
                  const n = resume.skills.filter((_, j) => j !== i);
                  updateField('skills', n);
                }} style={{ background: 'none', border: 'none', color: '#f44', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
              )}
            </motion.div>
          ))}
          {isAdmin && (
            <button
              onClick={() => updateField('skills', [...resume.skills, { name: 'New Skill', icon: '⚙️' }])}
              style={{ background: 'var(--pixel-primary)', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-pixel)', fontSize: '0.6rem' }}
            >
              + 추가
            </button>
          )}
        </div>
      </div>

      {/* === Career Timeline === */}
      <div className="about-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="section-title">CAREER</div>
        <div className="section-subtitle" style={{ marginBottom: '2rem' }}>경력</div>
        <div className="timeline">
          {resume.career.map((item, i) => (
            <motion.div
              key={item.id}
              className="timeline-item"
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-period">
                  <EditableField value={item.period} onChange={(v) => {
                    const n = [...resume.career]; n[i] = { ...n[i], period: v }; updateField('career', n);
                  }} isAdmin={isAdmin} editorTitle="기간" />
                </div>
                <div className="timeline-company">
                  <EditableField value={item.company} onChange={(v) => {
                    const n = [...resume.career]; n[i] = { ...n[i], company: v }; updateField('career', n);
                  }} isAdmin={isAdmin} editorTitle="회사명" />
                </div>
                <div className="timeline-role">
                  <EditableField value={item.role} onChange={(v) => {
                    const n = [...resume.career]; n[i] = { ...n[i], role: v }; updateField('career', n);
                  }} isAdmin={isAdmin} editorTitle="직급/역할" />
                </div>
                <div className="timeline-desc">
                  <EditableField value={item.description} onChange={(v) => {
                    const n = [...resume.career]; n[i] = { ...n[i], description: v }; updateField('career', n);
                  }} isAdmin={isAdmin} multiline editorTitle="설명" />
                </div>
                {item.details.length > 0 && (
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                    {item.details.map((d, j) => (
                      <li key={j} style={{ color: 'var(--pixel-text-dim)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {isAdmin && (
          <button onClick={() => updateField('career', [...resume.career, { id: Date.now().toString(), company: '회사명', role: '직급', period: '20XX.XX - 현재', description: '설명', details: [] }])}
            style={{ background: 'var(--pixel-primary)', color: '#fff', padding: '10px 20px', border: 'none', cursor: 'pointer', marginTop: '1rem', fontFamily: 'var(--font-pixel)', fontSize: '0.6rem' }}>
            + 경력 추가
          </button>
        )}
      </div>

      {/* === Experience === */}
      <div className="about-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="section-title">PROJECT EXPERIENCE</div>
        <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>프로젝트 경험</div>
        {resume.experience.map((exp, i) => (
          <motion.div key={i} className="about-card"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="about-card-title">
              <EditableField value={exp.title} onChange={(v) => { const n = [...resume.experience]; n[i] = { ...n[i], title: v }; updateField('experience', n); }} isAdmin={isAdmin} />
            </div>
            <div className="about-card-period">
              <EditableField value={exp.period} onChange={(v) => { const n = [...resume.experience]; n[i] = { ...n[i], period: v }; updateField('experience', n); }} isAdmin={isAdmin} />
            </div>
            <div className="about-card-desc">
              <EditableField value={exp.description} onChange={(v) => { const n = [...resume.experience]; n[i] = { ...n[i], description: v }; updateField('experience', n); }} isAdmin={isAdmin} multiline />
            </div>
          </motion.div>
        ))}
        {isAdmin && (
          <button onClick={() => updateField('experience', [...resume.experience, { title: '새 경험', period: '20XX', description: '설명', details: [] }])}
            style={{ background: 'var(--pixel-primary)', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
            + 경험 추가
          </button>
        )}
      </div>

      {/* === Education === */}
      <div className="about-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="section-title">EDUCATION</div>
        <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>교육 이력</div>
        {resume.education.map((edu, i) => (
          <motion.div key={i} className="about-card"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="about-card-title">
              <EditableField value={edu.title} onChange={(v) => { const n = [...resume.education]; n[i] = { ...n[i], title: v }; updateField('education', n); }} isAdmin={isAdmin} />
            </div>
            <div className="about-card-period">
              <EditableField value={edu.period} onChange={(v) => { const n = [...resume.education]; n[i] = { ...n[i], period: v }; updateField('education', n); }} isAdmin={isAdmin} />
            </div>
            <div className="about-card-desc">
              <EditableField value={edu.description} onChange={(v) => { const n = [...resume.education]; n[i] = { ...n[i], description: v }; updateField('education', n); }} isAdmin={isAdmin} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* === Awards === */}
      <div className="about-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="section-title">AWARDS & CERTIFICATIONS</div>
        <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>수상 및 자격증</div>
        {resume.awards.map((award, i) => (
          <motion.div key={i} className="about-card"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="about-card-title">
              <EditableField value={award.title} onChange={(v) => { const n = [...resume.awards]; n[i] = { ...n[i], title: v }; updateField('awards', n); }} isAdmin={isAdmin} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className="about-card-period">
                <EditableField value={award.organization} onChange={(v) => { const n = [...resume.awards]; n[i] = { ...n[i], organization: v }; updateField('awards', n); }} isAdmin={isAdmin} />
              </span>
              <span style={{ color: 'var(--pixel-yellow)', fontFamily: 'var(--font-pixel)', fontSize: '0.7rem' }}>
                <EditableField value={award.year} onChange={(v) => { const n = [...resume.awards]; n[i] = { ...n[i], year: v }; updateField('awards', n); }} isAdmin={isAdmin} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* === Self Introduction === */}
      <div className="about-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="section-title">SELF INTRODUCTION</div>
        <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>자기소개서</div>
        <div className="history-tabs" style={{ marginBottom: '1.5rem' }}>
          {resume.selfIntroduction.map((section, i) => (
            <button key={i} className={`history-tab ${selfIntroTab === i ? 'active' : ''}`} onClick={() => setSelfIntroTab(i)}>
              {section.title}
            </button>
          ))}
          {isAdmin && (
            <button className="history-tab" onClick={() => updateField('selfIntroduction', [...resume.selfIntroduction, { title: '새 섹션', body: '내용을 입력하세요.' }])}>
              + 추가
            </button>
          )}
        </div>
        {resume.selfIntroduction[selfIntroTab] && (
          <motion.div key={selfIntroTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            style={{ background: 'var(--pixel-surface)', border: '2px solid var(--pixel-border)', padding: '2rem' }}
          >
            <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: 'var(--pixel-primary)', marginBottom: '1rem' }}>
              <EditableField value={resume.selfIntroduction[selfIntroTab].title} onChange={(v) => {
                const n = [...resume.selfIntroduction]; n[selfIntroTab] = { ...n[selfIntroTab], title: v }; updateField('selfIntroduction', n);
              }} isAdmin={isAdmin} editorTitle="섹션 제목" />
            </h3>
            <div style={{ color: 'var(--pixel-text)', lineHeight: 2, fontSize: '1rem' }}>
              <EditableField value={resume.selfIntroduction[selfIntroTab].body} onChange={(v) => {
                const n = [...resume.selfIntroduction]; n[selfIntroTab] = { ...n[selfIntroTab], body: v }; updateField('selfIntroduction', n);
              }} isAdmin={isAdmin} multiline editorTitle="자기소개서 내용" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--pixel-border)' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: 'var(--pixel-text-dim)' }}>
          © 2026 {resume.name} — {resume.role}
        </div>
      </footer>
    </motion.div>
  );
};

export default AboutPage;
