import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../hooks/useContent';
import { EditableField } from './Editable';
import EditorPopup from './EditorPopup';
import { DEFAULT_PROJECTS, type Project } from '../data/defaults';

interface ProjectsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onGoIntro: () => void;
  isAdmin: boolean;
}

/** Simple Markdown renderer */
const renderMarkdown = (md: string): React.ReactNode[] => {
  return md.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <h4 key={i} style={{ color: 'var(--pixel-accent)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>{line.slice(4)}</h4>;
    if (line.startsWith('## ')) return <h3 key={i} style={{ color: 'var(--pixel-primary)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700, fontSize: '1.2rem' }}>{line.slice(3)}</h3>;
    if (line.startsWith('# ')) return <h2 key={i} style={{ color: '#fff', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 800, fontSize: '1.4rem' }}>{line.slice(2)}</h2>;
    const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) return <img key={i} src={imgMatch[2]} alt={imgMatch[1]} style={{ maxWidth: '100%', borderRadius: '4px', margin: '1rem 0', border: '2px solid var(--pixel-border)' }} />;
    const vidMatch = line.match(/\[video\]\(([^)]+)\)/i);
    if (vidMatch) return <video key={i} src={vidMatch[1]} controls style={{ maxWidth: '100%', margin: '1rem 0', border: '2px solid var(--pixel-border)' }} />;
    const gifMatch = line.match(/\[gif\]\(([^)]+)\)/i);
    if (gifMatch) return <img key={i} src={gifMatch[1]} alt="GIF" style={{ maxWidth: '100%', margin: '1rem 0', border: '2px solid var(--pixel-border)' }} />;
    if (line.trim() === '') return <br key={i} />;
    let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff">$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    return <p key={i} style={{ color: 'var(--pixel-text)', lineHeight: 1.8, marginBottom: '0.3rem' }} dangerouslySetInnerHTML={{ __html: processed }} />;
  });
};

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onBack, onNavigate, onGoIntro, isAdmin }) => {
  const [projects, setProjects] = useContent<Project[]>('projects_data', DEFAULT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingContent, setEditingContent] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const openDetail = (project: Project) => {
    setSelectedProject(project);
  };

  const updateProjectField = (id: number, field: keyof Project, value: any) => {
    const updated = projects.map(p => p.id === id ? { ...p, [field]: value } : p);
    setProjects(updated);
    if (selectedProject?.id === id) {
      setSelectedProject(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const addProject = () => {
    const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
    setProjects([...projects, {
      id: newId,
      title: '새 프로젝트',
      category: '카테고리',
      description: '프로젝트 설명을 입력하세요.',
      tags: ['태그1'],
      image: 'https://picsum.photos/seed/new/800/600',
      color: '#6366f1',
      content: '# 새 프로젝트\n\n프로젝트 상세 내용을 마크다운으로 작성하세요.',
    }]);
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Drag & drop handlers (simple swap approach)
  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newProjects = [...projects];
    const [dragged] = newProjects.splice(dragIdx, 1);
    newProjects.splice(idx, 0, dragged);
    setProjects(newProjects);
    setDragIdx(idx);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
  };

  // Tag editing
  const addTag = (projectId: number) => {
    const p = projects.find(p => p.id === projectId);
    if (!p) return;
    updateProjectField(projectId, 'tags', [...p.tags, '새 태그']);
  };

  const removeTag = (projectId: number, tagIdx: number) => {
    const p = projects.find(p => p.id === projectId);
    if (!p) return;
    updateProjectField(projectId, 'tags', p.tags.filter((_, i) => i !== tagIdx));
  };

  const updateTag = (projectId: number, tagIdx: number, value: string) => {
    const p = projects.find(p => p.id === projectId);
    if (!p) return;
    const newTags = [...p.tags];
    newTags[tagIdx] = value;
    updateProjectField(projectId, 'tags', newTags);
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
          <li><button className="page-nav-link" onClick={() => onNavigate('about')}>About</button></li>
          <li><button className="page-nav-link active">Projects</button></li>
          <li><a className="page-nav-link" href="mailto:solip.dev@email.com">Contact</a></li>
        </ul>
      </nav>

      {/* Header */}
      <section style={{ paddingTop: '8rem', paddingBottom: '2rem', textAlign: 'center' }}>
        <motion.div className="section-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          PROJECTS
        </motion.div>
        <motion.div className="section-subtitle" style={{ marginBottom: 0 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          게임 기획 프로젝트 모음
        </motion.div>
        {isAdmin && (
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: 'var(--pixel-accent)', marginTop: '1rem' }}>
            🖱️ 카드를 드래그하여 순서를 변경하세요
          </p>
        )}
      </section>

      {/* Project Grid - 3 columns */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="project-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              draggable={isAdmin}
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e as any, i)}
              onDragEnd={handleDragEnd}
              style={{
                opacity: dragIdx === i ? 0.5 : 1,
                cursor: isAdmin ? 'grab' : 'pointer',
              }}
            >
              {/* Delete button (admin) */}
              {isAdmin && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                  style={{
                    position: 'absolute', top: 8, right: 8, zIndex: 5,
                    background: '#ef4444', color: '#fff', border: 'none',
                    width: 24, height: 24, cursor: 'pointer', fontSize: '0.7rem',
                  }}
                >✕</button>
              )}

              <div
                className="project-card-img"
                style={{ backgroundImage: `url(${project.image})` }}
                onClick={() => openDetail(project)}
              />
              <div className="project-card-body" onClick={() => openDetail(project)}>
                <div className="project-card-category">
                  {isAdmin ? (
                    <input value={project.category} onChange={(e) => updateProjectField(project.id, 'category', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ background: 'transparent', border: 'none', color: 'var(--pixel-accent)', fontFamily: 'var(--font-pixel)', fontSize: 'inherit', width: '100%' }} />
                  ) : project.category}
                </div>
                <div className="project-card-title">
                  {isAdmin ? (
                    <input value={project.title} onChange={(e) => updateProjectField(project.id, 'title', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 800, fontSize: 'inherit', width: '100%' }} />
                  ) : project.title}
                </div>
                <div className="project-card-desc">{project.description}</div>

                {/* Tags */}
                <div className="project-card-tags" onClick={(e) => e.stopPropagation()}>
                  {project.tags.map((tag, j) => (
                    <span key={j} className="project-tag" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {isAdmin ? (
                        <>
                          <input value={tag} onChange={(e) => updateTag(project.id, j, e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'inherit', width: '60px', fontFamily: 'inherit', fontSize: 'inherit' }} />
                          <button onClick={() => removeTag(project.id, j)}
                            style={{ background: 'none', border: 'none', color: '#f44', cursor: 'pointer', fontSize: '0.7rem', padding: 0 }}>✕</button>
                        </>
                      ) : tag}
                    </span>
                  ))}
                  {isAdmin && (
                    <button onClick={() => addTag(project.id)}
                      style={{ background: 'var(--pixel-accent)', color: '#000', border: 'none', padding: '2px 8px', cursor: 'pointer', fontSize: '0.75rem' }}>+</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {isAdmin && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button onClick={addProject} style={{
              background: 'var(--pixel-primary)', color: '#fff', padding: '12px 24px',
              border: 'none', cursor: 'pointer', fontFamily: 'var(--font-pixel)', fontSize: '0.7rem',
            }}>
              + 프로젝트 추가
            </button>
          </div>
        )}
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelectedProject(null); setEditingContent(false); }}
          >
            <motion.div
              style={{
                background: 'var(--pixel-bg-alt)', border: '3px solid var(--pixel-border)',
                padding: '2rem', maxWidth: 800, width: '92%', maxHeight: '85vh',
                overflow: 'auto', boxShadow: '0 0 60px rgba(108, 63, 181, 0.3)',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: 'var(--pixel-accent)', letterSpacing: '2px' }}>
                  {selectedProject.category}
                </span>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {isAdmin && (
                    <button onClick={() => setEditingContent(true)} style={{
                      fontFamily: 'var(--font-pixel)', fontSize: '0.6rem',
                      background: 'var(--pixel-yellow)', color: '#000', border: 'none', padding: '6px 12px', cursor: 'pointer',
                    }}>
                      ✏️ 편집
                    </button>
                  )}
                  <button onClick={() => { setSelectedProject(null); setEditingContent(false); }} style={{
                    fontFamily: 'var(--font-pixel)', fontSize: '0.65rem',
                    background: 'none', border: 'none', color: 'var(--pixel-primary)', cursor: 'pointer',
                  }}>
                    ✕ CLOSE
                  </button>
                </div>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#fff', marginBottom: '1.5rem' }}>
                {selectedProject.title}
              </h2>
              <div>{renderMarkdown(selectedProject.content)}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor popup for project content */}
      {selectedProject && (
        <EditorPopup
          isOpen={editingContent}
          value={selectedProject.content}
          onSave={(v) => {
            updateProjectField(selectedProject.id, 'content', v);
            setEditingContent(false);
          }}
          onClose={() => setEditingContent(false)}
          title={`프로젝트 편집: ${selectedProject.title}`}
        />
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--pixel-border)' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: 'var(--pixel-text-dim)' }}>
          © 2026 LEE SOLIP — PROJECTS
        </div>
      </footer>
    </motion.div>
  );
};

export default ProjectsPage;
