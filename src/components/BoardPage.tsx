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

      {/* Hero (Logline) */}
      <section className="board-hero">
        <motion.h1
          className="board-hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <EditableField value={hero.titleLine1} onChange={(v) => updateHero('titleLine1', v)} isAdmin={isAdmin} />
          <span>
            <EditableField value={hero.titleLine2} onChange={(v) => updateHero('titleLine2', v)} isAdmin={isAdmin} />
          </span>
        </motion.h1>
        <motion.div
          className="board-hero-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <EditableField value={hero.description} onChange={(v) => updateHero('description', v)} isAdmin={isAdmin} multiline />
        </motion.div>
        <motion.button
          className="board-hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onClick={() => onNavigate('about')}
        >
          About Me →
        </motion.button>
      </section>

      {/* Project Video/GIF Area */}
      <section style={{
        padding: '2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {isAdmin && (
          <div style={{ marginBottom: '1rem', width: '100%', maxWidth: 800 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--pixel-primary)' }}>GIF/Image URL:</span>
            <input 
              type="text" 
              value={gifUrl} 
              onChange={(e) => setGifUrl(e.target.value)} 
              style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff' }} 
            />
          </div>
        )}
        <motion.div
          style={{
            width: '100%',
            maxWidth: 800,
            height: 400,
            background: `url(${gifUrl}) center/cover no-repeat`,
            backgroundColor: 'var(--pixel-surface)',
            border: '3px solid var(--pixel-border)',
            borderRadius: '8px',
            boxShadow: 'var(--pixel-box-shadow)'
          }}
          whileHover={{ scale: 1.02 }}
        />
      </section>

      {/* 3 Representative Projects */}
      <section className="section">
        <div className="section-title">REPRESENTATIVE PROJECTS</div>
        <div className="section-subtitle">대표 프로젝트</div>
        <div className="project-grid">
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
              <div
                className="project-card-img"
                style={{ backgroundImage: `url(${project.image})` }}
              />
              <div className="project-card-body">
                <div className="project-card-category">{project.category}</div>
                <div className="project-card-title">{project.title}</div>
                <div className="project-card-desc">{project.description}</div>
                <div className="project-card-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="board-hero-cta"
            style={{ background: 'var(--pixel-accent)', boxShadow: '0 4px 0 #2b8a99, var(--pixel-glow-cyan)' }}
            onClick={() => onNavigate('projects')}
          >
            Projects →
          </button>
        </div>
      </section>

      {/* Mini Logline & Philosophy */}
      <section className="section" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div className="section-title">PHILOSOPHY</div>
          <h2 style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}>
            <EditableField value={about.subtitle} onChange={(v) => setAbout(prev => ({...prev, subtitle: v}))} isAdmin={isAdmin} multiline />
          </h2>
          {about.paragraphs.map((p, i) => (
            <div key={i} style={{ color: 'var(--pixel-text-dim)', marginBottom: '1rem', lineHeight: 1.8 }}>
              <EditableField value={p} onChange={(v) => {
                const newP = [...about.paragraphs];
                newP[i] = v;
                setAbout(prev => ({...prev, paragraphs: newP}));
              }} isAdmin={isAdmin} multiline />
            </div>
          ))}
          <button
            className="board-hero-cta"
            style={{ marginTop: '1rem', padding: '10px 20px', fontSize: '0.55rem' }}
            onClick={() => onNavigate('about')}
          >
            About Me →
          </button>
        </div>
      </section>

      {/* Game History */}
      <section className="section">
        <div className="section-title">PLAY HISTORY</div>
        <div className="section-subtitle">게임 플레이 이력</div>
        <div className="history-tabs">
          {(['online', 'mobile', 'package'] as const).map((tab) => (
            <button
              key={tab}
              className={`history-tab ${historyTab === tab ? 'active' : ''}`}
              onClick={() => setHistoryTab(tab)}
            >
              {tab === 'online' ? 'Online Games' : tab === 'mobile' ? 'Mobile Games' : 'Package Games'}
            </button>
          ))}
        </div>
        <motion.div
          className="history-list"
          key={historyTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {history[historyTab].map((game, idx) => (
            <div key={game.id} className="history-item">
              <span className="history-name">
                <EditableField value={game.name} onChange={(v) => updateHistory(historyTab, idx, 'name', v)} isAdmin={isAdmin} />
              </span>
              <span className="history-hours" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <EditableField value={game.hours.toString()} onChange={(v) => updateHistory(historyTab, idx, 'hours', Number(v) || 0)} isAdmin={isAdmin} />h
              </span>
            </div>
          ))}
          {isAdmin && (
            <button 
              onClick={() => {
                setHistory(prev => ({
                  ...prev,
                  [historyTab]: [...prev[historyTab], { id: Date.now().toString(), name: 'New Game', hours: 0 }]
                }));
              }}
              style={{ background: 'var(--pixel-primary)', color: '#fff', padding: '8px', border: 'none', cursor: 'pointer' }}
            >
              + Add
            </button>
          )}
        </motion.div>
      </section>

      {/* Contact CTA */}
      <div className="contact-cta">
        <div className="contact-title">LET'S WORK TOGETHER!</div>
        <div className="contact-desc">
          함께하고 싶은 이야기 있으시다면 편하게 연락주세요.
        </div>
        <a className="contact-btn" href="mailto:solip.dev@email.com">Contact →</a>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        borderTop: '1px solid var(--pixel-border)',
      }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: 'var(--pixel-text-dim)' }}>
          © 2024 LEE SOLIP — GAME DESIGN PORTFOLIO
        </div>
      </footer>
    </motion.div>
  );
};

export default BoardPage;
