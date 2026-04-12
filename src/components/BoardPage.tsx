import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabaseFetch, hasContent, safeSerialize } from '../utils/supabase';
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
  isAdmin: boolean;
}

/** Hook to load data from Supabase with initialData fallback */
function useContent<T>(key: string, initial: T): [T, (v: T) => void] {
  const [data, setData] = useState<T>(initial);

  useEffect(() => {
    supabaseFetch(`site_content?key=eq.${key}&select=value`)
      .then((rows) => {
        if (rows && rows.length > 0 && hasContent(rows[0].value)) {
          setData(rows[0].value as T);
        }
      })
      .catch(() => {});
  }, [key]);

  const update = (newData: T) => {
    setData(newData);
    const serializable = safeSerialize(newData);
    supabaseFetch('site_content', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({ key, value: serializable, updated_at: new Date().toISOString() }),
    }).catch(console.error);
  };

  return [data, update];
}

const BoardPage: React.FC<BoardPageProps> = ({ onBack, onNavigate, isAdmin }) => {
  const [hero, setHero] = useContent<HeroContent>('hero_content', DEFAULT_HERO);
  const [projects] = useContent<Project[]>('projects_data', DEFAULT_PROJECTS);
  const [history] = useContent<GameHistory>('history_data', DEFAULT_GAME_HISTORY);
  const [about] = useContent<AboutContent>('about_content', DEFAULT_ABOUT);
  const [historyTab, setHistoryTab] = useState<'online' | 'mobile' | 'package'>('online');

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
        <button className="page-back-btn" onClick={onBack}>
          ← MAP
        </button>
        <div className="page-nav-logo" onClick={onBack}>SOLIP'S WORLD</div>
        <ul className="page-nav-links">
          <li><button className="page-nav-link" onClick={() => onNavigate('about')}>About</button></li>
          <li><button className="page-nav-link" onClick={() => onNavigate('projects')}>Projects</button></li>
          <li><a className="page-nav-link" href="mailto:solip.dev@email.com">Contact</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="board-hero">
        <motion.h1
          className="board-hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {hero.titleLine1}
          <span>{hero.titleLine2}</span>
        </motion.h1>
        <motion.p
          className="board-hero-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {hero.description}
        </motion.p>
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

      {/* Interactive GIF area */}
      <section style={{
        padding: '4rem 2rem',
        display: 'flex',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(108, 63, 181, 0.15) 0%, transparent 70%)',
      }}>
        <motion.div
          style={{
            width: '100%',
            maxWidth: 800,
            height: 300,
            background: 'var(--pixel-surface)',
            border: '3px solid var(--pixel-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated pixel art pattern */}
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.8rem',
            color: 'var(--pixel-accent)',
            textAlign: 'center',
            lineHeight: 2,
          }}>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✧ ✦ ✧ GAME DESIGN ✧ ✦ ✧
            </motion.div>
            <div style={{ fontSize: '3rem', margin: '1rem 0' }}>🎮</div>
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              style={{ color: 'var(--pixel-primary)', fontSize: '0.6rem' }}
            >
              SYSTEM × LEVEL × NARRATIVE × BALANCE
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Project Preview */}
      <section className="section">
        <div className="section-title">PROJECTS</div>
        <div className="section-subtitle">주요 프로젝트</div>
        <div className="project-grid">
          {projects.slice(0, 4).map((project, i) => (
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

      {/* Philosophy */}
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
            기능 하나를 만들더라도, 그 의도와<br />
            사용자 경험을 먼저 고려합니다.<br />
            정작 지켜보는 편이자 뒤에서<br />
            정리 이해를 돕는 편이지만 종차는다고 감사합니다.
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i} style={{ color: 'var(--pixel-text-dim)', marginBottom: '1rem', lineHeight: 1.8 }}>
              {p}
            </p>
          ))}
        </div>
        <motion.div
          style={{
            flex: '0 0 200px',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--pixel-primary), var(--pixel-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            boxShadow: '0 0 60px rgba(255, 107, 203, 0.3)',
          }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🎯
        </motion.div>
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
          {history[historyTab].map((game) => (
            <div key={game.id} className="history-item">
              <span className="history-name">{game.name}</span>
              <span className="history-hours">{game.hours}h</span>
            </div>
          ))}
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
        borderTop: '1px solid rgba(108, 63, 181, 0.2)',
      }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: 'var(--pixel-text-dim)' }}>
          © 2024 LEE SOLIP — GAME DESIGN PORTFOLIO
        </div>
      </footer>
    </motion.div>
  );
};

export default BoardPage;
