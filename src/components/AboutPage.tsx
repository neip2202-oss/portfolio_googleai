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

  const safeCareer = resume.career || [];
  const safeSkills = resume.skills || [];
  const safeExperience = resume.experience || [];
  const safeEducation = resume.education || [];
  const safeAwards = resume.awards || [];
  const safeSelfIntro = resume.selfIntroduction || [];

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

      {/* ─── Profile: 이미지 + 인적사항 (2-column) ─── */}
      <section style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: 900, margin: '0 auto', display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', padding: '8rem 2rem 4rem' }}>
        {/* Left: Photo */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--pixel-primary)', boxShadow: 'var(--pixel-glow-pink)', flexShrink: 0 }}>
            <EditableField value={resume.image} onChange={(v) => updateField('image', v)} isAdmin={isAdmin} mediaMode editorTitle="프로필 이미지"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </motion.div>

        {/* Right: Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ flex: '1 1 350px' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--pixel-accent)', letterSpacing: '3px', marginBottom: '0.5rem' }}>
            ABOUT ME
          </div>
          <h1 style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.3 }}>
            <EditableField value={resume.name} onChange={(v) => updateField('name', v)} isAdmin={isAdmin} editorTitle="이름" />
          </h1>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--pixel-primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
            <EditableField value={resume.oneLineIntro} onChange={(v) => updateField('oneLineIntro', v)} isAdmin={isAdmin} editorTitle="한 줄 소개" />
          </div>

          {/* Compact info table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.4rem 1.25rem', fontSize: '0.95rem' }}>
            {[
              ['생년월일', resume.dob, 'dob'],
              ['이메일', resume.email, 'email'],
              ['노션', resume.notion, 'notion'],
            ].map(([label, value, key]) => (
              <React.Fragment key={key as string}>
                <span style={{ color: 'var(--pixel-text-dim)', whiteSpace: 'nowrap' }}>{label as string}</span>
                <span style={{ color: 'var(--pixel-text)' }}>
                  {isAdmin ? (
                    <EditableField value={value as string} onChange={(v) => updateField(key as keyof ResumeData, v)} isAdmin={isAdmin} />
                  ) : key === 'email' ? (
                    <a href={`mailto:${value}`} style={{ color: 'var(--pixel-accent)', textDecoration: 'none' }}>{value as string}</a>
                  ) : key === 'notion' ? (
                    <a href={`https://${value}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pixel-accent)', textDecoration: 'none' }}>{value as string}</a>
                  ) : (value as string)}
                </span>
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Logline: 중앙 정렬, 한 문장 강조 ─── */}
      <section style={{ padding: '5rem 2rem', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', color: '#fff', lineHeight: 1.8 }}>
          "<EditableField value={resume.summary} onChange={(v) => updateField('summary', v)} isAdmin={isAdmin} multiline editorTitle="로그라인" />"
        </h2>
      </section>

      {/* ─── Skills: 태그 클라우드 ─── */}
      <section style={{ padding: '4rem 2rem', maxWidth: 900, margin: '0 auto' }}>
        <div className="section-title">SKILLS & TOOLS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.5rem' }}>
          {safeSkills.map((skill, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 200 }}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--pixel-surface)', border: '2px solid var(--pixel-border)', padding: '6px 14px', fontSize: '0.9rem' }}>
              <span>{skill.icon}</span>
              {isAdmin ? (
                <input value={skill.name} onChange={(e) => { const n = [...safeSkills]; n[i] = { ...n[i], name: e.target.value }; updateField('skills', n); }}
                  style={{ background: 'transparent', border: 'none', color: '#fff', width: '70px' }} />
              ) : (<span style={{ color: '#fff' }}>{skill.name}</span>)}
              {isAdmin && <button onClick={() => updateField('skills', safeSkills.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#f44', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>}
            </motion.div>
          ))}
          {isAdmin && <button onClick={() => updateField('skills', [...safeSkills, { name: 'New', icon: '⚙️' }])}
            style={{ background: 'var(--pixel-primary)', color: '#fff', padding: '6px 14px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-pixel)', fontSize: '0.55rem' }}>+ 추가</button>}
        </div>
      </section>

      {/* ─── Career Timeline (Bettina 스타일: 역할→회사→설명) ─── */}
      <section style={{ padding: '5rem 2rem', maxWidth: 900, margin: '0 auto' }}>
        <div className="section-title">CAREER</div>
        <div className="section-subtitle" style={{ marginBottom: '2.5rem' }}>경력</div>
        <div className="timeline">
          {safeCareer.map((item, i) => (
            <motion.div key={item.id} className="timeline-item"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.12 }}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-period">
                  <EditableField value={item.period} onChange={(v) => { const n = [...safeCareer]; n[i] = { ...n[i], period: v }; updateField('career', n); }} isAdmin={isAdmin} editorTitle="기간" />
                </div>
                <div className="timeline-role">
                  <EditableField value={item.role} onChange={(v) => { const n = [...safeCareer]; n[i] = { ...n[i], role: v }; updateField('career', n); }} isAdmin={isAdmin} editorTitle="직급" />
                </div>
                <div className="timeline-company">
                  <EditableField value={item.company} onChange={(v) => { const n = [...safeCareer]; n[i] = { ...n[i], company: v }; updateField('career', n); }} isAdmin={isAdmin} editorTitle="회사" />
                </div>
                <div className="timeline-desc">
                  <EditableField value={item.description} onChange={(v) => { const n = [...safeCareer]; n[i] = { ...n[i], description: v }; updateField('career', n); }} isAdmin={isAdmin} multiline editorTitle="설명" />
                </div>
                {item.details && item.details.length > 0 && (
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                    {item.details.map((d, j) => <li key={j} style={{ color: 'var(--pixel-text-dim)', fontSize: '0.9rem', marginBottom: '0.15rem' }}>{d}</li>)}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {isAdmin && <button onClick={() => updateField('career', [...safeCareer, { id: Date.now().toString(), company: '회사명', role: '직급', period: '20XX - 현재', description: '설명', details: [] }])}
          style={{ background: 'var(--pixel-primary)', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer', marginTop: '1rem', fontFamily: 'var(--font-pixel)', fontSize: '0.6rem' }}>+ 경력 추가</button>}
      </section>

      {/* ─── Project Experience: 카드형 ─── */}
      <section style={{ padding: '5rem 2rem', maxWidth: 900, margin: '0 auto' }}>
        <div className="section-title">PROJECT EXPERIENCE</div>
        <div className="section-subtitle" style={{ marginBottom: '2rem' }}>프로젝트 경험</div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {safeExperience.map((exp, i) => (
            <motion.div key={i} className="about-card" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.08 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div className="about-card-title" style={{ marginBottom: 0 }}>
                  <EditableField value={exp.title} onChange={(v) => { const n = [...safeExperience]; n[i] = { ...n[i], title: v }; updateField('experience', n); }} isAdmin={isAdmin} />
                </div>
                <div className="about-card-period" style={{ marginBottom: 0 }}>
                  <EditableField value={exp.period} onChange={(v) => { const n = [...safeExperience]; n[i] = { ...n[i], period: v }; updateField('experience', n); }} isAdmin={isAdmin} />
                </div>
              </div>
              <div className="about-card-desc">
                <EditableField value={exp.description} onChange={(v) => { const n = [...safeExperience]; n[i] = { ...n[i], description: v }; updateField('experience', n); }} isAdmin={isAdmin} multiline />
              </div>
            </motion.div>
          ))}
        </div>
        {isAdmin && <button onClick={() => updateField('experience', [...safeExperience, { title: '새 경험', period: '20XX', description: '설명', details: [] }])}
          style={{ background: 'var(--pixel-primary)', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer', marginTop: '0.75rem' }}>+ 경험 추가</button>}
      </section>

      {/* ─── Education & Awards: 병렬 2-column ─── */}
      <section style={{ padding: '5rem 2rem', maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
        {/* Education */}
        <div>
          <div className="section-title">EDUCATION</div>
          <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>교육</div>
          {safeEducation.map((edu, i) => (
            <div key={i} className="about-card">
              <div className="about-card-title">
                <EditableField value={edu.title} onChange={(v) => { const n = [...safeEducation]; n[i] = { ...n[i], title: v }; updateField('education', n); }} isAdmin={isAdmin} />
              </div>
              <div className="about-card-period">
                <EditableField value={edu.period} onChange={(v) => { const n = [...safeEducation]; n[i] = { ...n[i], period: v }; updateField('education', n); }} isAdmin={isAdmin} />
              </div>
              <div className="about-card-desc">
                <EditableField value={edu.description} onChange={(v) => { const n = [...safeEducation]; n[i] = { ...n[i], description: v }; updateField('education', n); }} isAdmin={isAdmin} />
              </div>
            </div>
          ))}
        </div>

        {/* Awards */}
        <div>
          <div className="section-title">AWARDS</div>
          <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>수상 및 자격</div>
          {safeAwards.map((award, i) => (
            <div key={i} className="about-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div className="about-card-title" style={{ marginBottom: 0 }}>
                  <EditableField value={award.title} onChange={(v) => { const n = [...safeAwards]; n[i] = { ...n[i], title: v }; updateField('awards', n); }} isAdmin={isAdmin} />
                </div>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--pixel-yellow)' }}>
                  <EditableField value={award.year} onChange={(v) => { const n = [...safeAwards]; n[i] = { ...n[i], year: v }; updateField('awards', n); }} isAdmin={isAdmin} />
                </span>
              </div>
              <div className="about-card-period">
                <EditableField value={award.organization} onChange={(v) => { const n = [...safeAwards]; n[i] = { ...n[i], organization: v }; updateField('awards', n); }} isAdmin={isAdmin} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Self Introduction (탭 형태) ─── */}
      <section style={{ padding: '5rem 2rem', maxWidth: 900, margin: '0 auto' }}>
        <div className="section-title">SELF INTRODUCTION</div>
        <div className="section-subtitle" style={{ marginBottom: '1.5rem' }}>자기소개서</div>
        <div className="history-tabs" style={{ marginBottom: '1.5rem' }}>
          {safeSelfIntro.map((section, i) => (
            <button key={i} className={`history-tab ${selfIntroTab === i ? 'active' : ''}`} onClick={() => setSelfIntroTab(i)}>{section.title}</button>
          ))}
          {isAdmin && <button className="history-tab" onClick={() => updateField('selfIntroduction', [...safeSelfIntro, { title: '새 섹션', body: '내용을 입력하세요.' }])}>+ 추가</button>}
        </div>
        {safeSelfIntro[selfIntroTab] && (
          <motion.div key={selfIntroTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            style={{ background: 'var(--pixel-surface)', border: '2px solid var(--pixel-border)', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--pixel-primary)', marginBottom: '1rem' }}>
              <EditableField value={safeSelfIntro[selfIntroTab].title} onChange={(v) => { const n = [...safeSelfIntro]; n[selfIntroTab] = { ...n[selfIntroTab], title: v }; updateField('selfIntroduction', n); }} isAdmin={isAdmin} editorTitle="섹션 제목" />
            </h3>
            <div style={{ color: 'var(--pixel-text)', lineHeight: 2, fontSize: '1rem' }}>
              <EditableField value={safeSelfIntro[selfIntroTab].body} onChange={(v) => { const n = [...safeSelfIntro]; n[selfIntroTab] = { ...n[selfIntroTab], body: v }; updateField('selfIntroduction', n); }} isAdmin={isAdmin} multiline editorTitle="자기소개서" />
            </div>
          </motion.div>
        )}
      </section>

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
