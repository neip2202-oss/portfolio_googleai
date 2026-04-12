import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabaseFetch, hasContent } from '../utils/supabase';
import { DEFAULT_PROJECTS, type Project } from '../data/defaults';

interface ProjectsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onBack, onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    supabaseFetch('site_content?key=eq.projects_data&select=value')
      .then((rows) => {
        if (rows && rows.length > 0 && hasContent(rows[0].value)) {
          setProjects(rows[0].value as Project[]);
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
          <li><button className="page-nav-link" onClick={() => onNavigate('about')}>About</button></li>
          <li><button className="page-nav-link active">Projects</button></li>
          <li><button className="page-nav-link" onClick={() => onNavigate('board')}>Board</button></li>
        </ul>
      </nav>

      {/* Header */}
      <section style={{ paddingTop: '8rem', paddingBottom: '2rem', textAlign: 'center' }}>
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          PROJECTS
        </motion.div>
        <motion.div
          className="section-subtitle"
          style={{ marginBottom: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          게임 기획 프로젝트 모음
        </motion.div>
      </section>

      {/* Project Grid */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="project-grid">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => setSelectedProject(project)}
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
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              style={{
                background: 'var(--pixel-bg-alt)',
                border: '3px solid var(--pixel-border)',
                padding: '2rem',
                maxWidth: 700,
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: '0 0 60px rgba(108, 63, 181, 0.3)',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: 'var(--pixel-accent)' }}>
                  {selectedProject.category}
                </span>
                <button
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.6rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--pixel-primary)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedProject(null)}
                >
                  ✕ CLOSE
                </button>
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>
                {selectedProject.title}
              </h2>
              <p style={{ color: 'var(--pixel-text-dim)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {selectedProject.content}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(108, 63, 181, 0.2)' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: 'var(--pixel-text-dim)' }}>
          © 2024 LEE SOLIP — PROJECTS
        </div>
      </footer>
    </motion.div>
  );
};

export default ProjectsPage;
