import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useContent } from '../hooks/useContent';
import { EditableField } from './Editable';
import {
  DEFAULT_HERO,
  DEFAULT_PROJECTS,
  DEFAULT_GAME_HISTORY,
  DEFAULT_ABOUT,
  type HeroContent,
  type Project,
  type GameHistory,
  type AboutContent,
} from '../data/defaults';

interface BoardPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onGoIntro: () => void;
  isAdmin: boolean;
}

const BoardPage: React.FC<BoardPageProps> = ({ onBack, onNavigate, onGoIntro, isAdmin }) => {
  const [hero, setHero] = useContent<HeroContent>('hero_content', DEFAULT_HERO);
  const [projects] = useContent<Project[]>('projects_data', DEFAULT_PROJECTS);
  const [history, setHistory] = useContent<GameHistory>('history_data', DEFAULT_GAME_HISTORY);
  const [about, setAbout] = useContent<AboutContent>('about_content', DEFAULT_ABOUT);
  const [gifUrl, setGifUrl] = useContent<string>('board_gif_url', 'https://picsum.photos/seed/cyberpunk/800/400');
  const [historyTab, setHistoryTab] = useState<'online' | 'mobile' | 'package'>('online');

  const updateHero = (key: keyof HeroContent, value: string) => {
    setHero(prev => ({ ...prev, [key]: value }));
  };

  const updateHistory = (tab: 'online' | 'mobile' | 'package', index: number, key: string, value: string | number) => {
    setHistory(prev => {
      const newTab = [...prev[tab]];
      newTab[index] = { ...newTab[index], [key]: value };
      return { ...prev, [tab]: newTab };
    });
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
          <li><button className="page-nav-link active">Board</button></li>
          <li><button className="page-nav-link" onClick={() => onNavigate('about')}>About</button></li>
          <li><button className="page-nav-link" onClick={() => onNavigate('projects')}>Projects</button></li>
          <li><a className="page-nav-link" href="mailto:solip.dev@email.com">Contact</a></li>
        </ul>
      </nav>

      {/* ─── Hero: Full viewport, single clear message ─── */}
      <section className="board-hero">
        <motion.div
          style={{ marginBottom: '1rem', fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: 'var(--pixel-accent)', letterSpacing: '3px' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        >
          GAME DESIGNER PORTFOLIO
        </motion.div>
        <motion.h1
          className="board-hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <EditableField value={hero.titleLine1} onChange={(v) => updateHero('titleLine1', v)} isAdmin={isAdmin} editorTitle="히어로 타이틀 1" />
          <span>
            <EditableField value={hero.titleLine2} onChange={(v) => updateHero('titleLine2', v)} isAdmin={isAdmin} editorTitle="히어로 타이틀 2" />
          </span>
        </motion.h1>
        <motion.div
          className="board-hero-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <EditableField value={hero.description} onChange={(v) => updateHero('description', v)} isAdmin={isAdmin} multiline editorTitle="히어로 설명" />
        </motion.div>
        <motion.div
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button className="board-hero-cta" onClick={() => onNavigate('projects')}>
            Projects →
          </button>
          <button
            className="board-hero-cta"
            style={{ background: 'transparent', color: 'var(--pixel-accent)', border: '2px solid var(--pixel-accent)', boxShadow: 'none' }}
            onClick={() => onNavigate('about')}
          >
            About Me
          </button>
        </motion.div>
      </section>

      {/* ─── Showreel / Key Visual ─── */}
      <section style={{ padding: '0 2rem 6rem', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ width: '100%' }}>
          <EditableField
            value={gifUrl}
            onChange={(v) => setGifUrl(v)}
            isAdmin={isAdmin}
            mediaMode
            editorTitle="프로젝트 영상/GIF"
            style={{
              width: '100%', height: 420, objectFit: 'cover',
              border: '3px solid var(--pixel-border)', borderRadius: '8px', display: 'block',
            }}
          />
        </div>
      </section>

      {/* ─── Featured Projects (최대 3개, 핵심만) ─── */}
      <section style={{ padding: '6rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-title">FEATURED PROJECTS</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="section-subtitle" style={{ marginBottom: 0 }}>대표 프로젝트</div>
            <button
              className="board-hero-cta"
              style={{ padding: '8px 16px', fontSize: '0.6rem', background: 'transparent', color: 'var(--pixel-accent)', border: '2px solid var(--pixel-border)', boxShadow: 'none' }}
              onClick={() => onNavigate('projects')}
            >
              View All →
            </button>
          </div>
        </div>
        <div className="project-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {projects.slice(0, 3).map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => onNavigate('projects')}
            >
              <div className="project-card-img" style={{ backgroundImage: `url(${project.image})` }} />
              <div className="project-card-body">
                <div className="project-card-category">{project.category}</div>
                <div className="project-card-title">{project.title}</div>
                <div className="project-card-desc" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description}
                </div>
                <div className="project-card-tags">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Philosophy: 한 줄 철학 + 간결한 설명 ─── */}
      <section style={{ padding: '6rem 2rem', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div className="section-title" style={{ textAlign: 'center' }}>PHILOSOPHY</div>
        <h2 style={{
          fontFamily: 'var(--font-body)', fontSize: 'clamp(1.3rem, 3vw, 2rem)',
          fontWeight: 800, color: '#fff', lineHeight: 1.7, marginBottom: '2rem',
        }}>
          <EditableField value={about.subtitle} onChange={(v) => setAbout(prev => ({...prev, subtitle: v}))} isAdmin={isAdmin} multiline editorTitle="철학 제목" />
        </h2>
        {about.paragraphs.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            style={{ color: 'var(--pixel-text)', marginBottom: '1.25rem', lineHeight: 1.9, fontSize: '1.05rem' }}
          >
            <EditableField value={p} onChange={(v) => {
              const newP = [...about.paragraphs]; newP[i] = v;
              setAbout(prev => ({...prev, paragraphs: newP}));
            }} isAdmin={isAdmin} multiline editorTitle={`문단 ${i+1}`} />
          </motion.div>
        ))}
      </section>

      {/* ─── Game History ─── */}
      <section style={{ padding: '6rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-title">PLAY HISTORY</div>
        <div className="section-subtitle">게임 플레이 이력</div>
        <div className="history-tabs">
          {(['online', 'mobile', 'package'] as const).map((tab) => (
            <button key={tab} className={`history-tab ${historyTab === tab ? 'active' : ''}`} onClick={() => setHistoryTab(tab)}>
              {tab === 'online' ? 'Online' : tab === 'mobile' ? 'Mobile' : 'Package'}
            </button>
          ))}
        </div>
        <motion.div className="history-list" key={historyTab}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        >
          {history[historyTab].map((game, idx) => (
            <div key={game.id} className="history-item">
              <span className="history-name">
                <EditableField value={game.name} onChange={(v) => updateHistory(historyTab, idx, 'name', v)} isAdmin={isAdmin} />
              </span>
              <span className="history-hours">
                <EditableField value={game.hours.toString()} onChange={(v) => updateHistory(historyTab, idx, 'hours', Number(v) || 0)} isAdmin={isAdmin} />h
              </span>
            </div>
          ))}
          {isAdmin && (
            <button onClick={() => setHistory(prev => ({
              ...prev, [historyTab]: [...prev[historyTab], { id: Date.now().toString(), name: 'New Game', hours: 0 }]
            }))} style={{ background: 'var(--pixel-primary)', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-pixel)', fontSize: '0.6rem' }}>
              + 추가
            </button>
          )}
        </motion.div>
      </section>

      {/* ─── Contact CTA ─── */}
      <div className="contact-cta">
        <div className="contact-title">LET'S WORK TOGETHER</div>
        <div className="contact-desc">
          함께하고 싶은 이야기가 있다면 편하게 연락해 주세요.
        </div>
        <a className="contact-btn" href="mailto:solip.dev@email.com">Contact →</a>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--pixel-border)' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: 'var(--pixel-text-dim)' }}>
          © 2026 LEE SOLIP — GAME DESIGN PORTFOLIO
        </div>
      </footer>
    </motion.div>
  );
};

export default BoardPage;
