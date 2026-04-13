import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { useContent } from '../hooks/useContent';
import { EditableField } from './Editable';
import { DEFAULT_PROJECTS, type Project } from '../data/defaults';

interface ProjectsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onGoIntro: () => void;
  isAdmin: boolean;
}

/** Simple Markdown renderer: supports # headings, **bold**, *italic*, ![image](url), [link](url), \n newlines */
const renderMarkdown = (md: string): React.ReactNode[] => {
  const lines = md.split('\n');
  return lines.map((line, i) => {
    // Heading
    if (line.startsWith('### ')) return <h4 key={i} style={{ color: 'var(--pixel-accent)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>{line.slice(4)}</h4>;
    if (line.startsWith('## ')) return <h3 key={i} style={{ color: 'var(--pixel-primary)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 700, fontSize: '1.2rem' }}>{line.slice(3)}</h3>;
    if (line.startsWith('# ')) return <h2 key={i} style={{ color: '#fff', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 800, fontSize: '1.4rem' }}>{line.slice(2)}</h2>;

    // Image: ![alt](url)
    const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      return <img key={i} src={imgMatch[2]} alt={imgMatch[1]} style={{ maxWidth: '100%', borderRadius: '4px', margin: '1rem 0', border: '2px solid var(--pixel-border)' }} />;
    }

    // Video embed (mp4 / webm)
    const vidMatch = line.match(/\[video\]\(([^)]+)\)/i);
    if (vidMatch) {
      return <video key={i} src={vidMatch[1]} controls style={{ maxWidth: '100%', margin: '1rem 0', border: '2px solid var(--pixel-border)' }} />;
    }

    // GIF embed (treat as image)
    const gifMatch = line.match(/\[gif\]\(([^)]+)\)/i);
    if (gifMatch) {
      return <img key={i} src={gifMatch[1]} alt="GIF" style={{ maxWidth: '100%', margin: '1rem 0', border: '2px solid var(--pixel-border)' }} />;
    }

    // Bold **text** and italic *text*
    let processed: React.ReactNode = line;
    if (line.includes('**') || line.includes('*')) {
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let keyIdx = 0;
      while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        const italicMatch = remaining.match(/\*(.+?)\*/);
        const match = boldMatch && (!italicMatch || (boldMatch.index! <= italicMatch.index!)) ? boldMatch : italicMatch;
        if (!match || match.index === undefined) {
          parts.push(remaining);
          break;
        }
        if (match.index > 0) parts.push(remaining.slice(0, match.index));
        const isBold = match[0].startsWith('**');
        parts.push(isBold
          ? <strong key={`b${keyIdx}`} style={{ color: '#fff' }}>{match[1]}</strong>
          : <em key={`i${keyIdx}`}>{match[1]}</em>
        );
        remaining = remaining.slice(match.index + match[0].length);
        keyIdx++;
      }
      processed = <>{parts}</>;
    }

    // Link: [text](url)
    if (typeof processed === 'string' && processed.includes('[')) {
      const linkMatch = (processed as string).match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const before = (processed as string).slice(0, linkMatch.index);
        const after = (processed as string).slice(linkMatch.index! + linkMatch[0].length);
        processed = <>{before}<a href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pixel-accent)' }}>{linkMatch[1]}</a>{after}</>;
      }
    }

    if (line.trim() === '') return <br key={i} />;
    return <p key={i} style={{ color: 'var(--pixel-text)', lineHeight: 1.8, marginBottom: '0.3rem' }}>{processed}</p>;
  });
};

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onBack, onNavigate, onGoIntro, isAdmin }) => {
  const [projects, setProjects] = useContent<Project[]>('projects_data', DEFAULT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');

  const openDetail = (project: Project) => {
    setSelectedProject(project);
    setEditingContent(project.content);
  };

  const saveContent = () => {
    if (!selectedProject) return;
    const updated = projects.map(p =>
      p.id === selectedProject.id ? { ...p, content: editingContent } : p
    );
    setProjects(updated);
    setSelectedProject({ ...selectedProject, content: editingContent });
  };

  const updateProjectField = (id: number, field: keyof Project, value: any) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
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
      content: '# 새 프로젝트\n\n프로젝트 상세 내용을 마크다운으로 작성하세요.\n\n## 사용법\n- **볼드** 텍스트\n- *이탤릭* 텍스트\n- ![이미지](URL)\n- [gif](URL)\n- [video](URL)',
    }]);
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
      </section>

      {/* Project Grid (reorderable in admin mode) */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        {isAdmin ? (
          <>
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: 'var(--pixel-primary)', marginBottom: '1rem', textAlign: 'center' }}>
              드래그하여 카드 순서를 변경하세요
            </p>
            <Reorder.Group
              axis="y"
              values={projects}
              onReorder={(newOrder) => setProjects(newOrder)}
              style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}
            >
              {projects.map((project, i) => (
                <Reorder.Item key={project.id} value={project} style={{ cursor: 'grab' }}>
                  <div className="project-card" onClick={() => openDetail(project)}>
                    <div className="project-card-img" style={{ backgroundImage: `url(${project.image})`, position: 'relative' }}>
                      {isAdmin && (
                        <input
                          type="text"
                          value={project.image}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateProjectField(project.id, 'image', e.target.value)}
                          style={{
                            position: 'absolute', bottom: 4, left: 4, right: 4,
                            padding: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff',
                            border: '1px dashed var(--pixel-primary)', fontSize: '0.7rem', zIndex: 2,
                          }}
                          placeholder="Image URL"
                        />
                      )}
                    </div>
                    <div className="project-card-body">
                      <div className="project-card-category">
                        <EditableField value={project.category} onChange={(v) => updateProjectField(project.id, 'category', v)} isAdmin={isAdmin} />
                      </div>
                      <div className="project-card-title">
                        <EditableField value={project.title} onChange={(v) => updateProjectField(project.id, 'title', v)} isAdmin={isAdmin} />
                      </div>
                      <div className="project-card-desc">
                        <EditableField value={project.description} onChange={(v) => updateProjectField(project.id, 'description', v)} isAdmin={isAdmin} multiline />
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button onClick={addProject} style={{
                background: 'var(--pixel-primary)', color: '#fff', padding: '12px 24px',
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font-pixel)', fontSize: '0.7rem',
              }}>
                + 프로젝트 추가
              </button>
            </div>
          </>
        ) : (
          <div className="project-grid">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => openDetail(project)}
              >
                <div className="project-card-img" style={{ backgroundImage: `url(${project.image})` }} />
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
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              style={{
                background: 'var(--pixel-bg-alt)',
                border: '3px solid var(--pixel-border)',
                padding: '2rem',
                maxWidth: 800,
                width: '92%',
                maxHeight: '85vh',
                overflow: 'auto',
                boxShadow: '0 0 60px rgba(108, 63, 181, 0.3)',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: 'var(--pixel-accent)', letterSpacing: '2px' }}>
                  {selectedProject.category}
                </span>
                <button
                  style={{
                    fontFamily: 'var(--font-pixel)', fontSize: '0.65rem',
                    background: 'none', border: 'none', color: 'var(--pixel-primary)', cursor: 'pointer',
                  }}
                  onClick={() => setSelectedProject(null)}
                >
                  ✕ CLOSE
                </button>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#fff', marginBottom: '1.5rem' }}>
                {selectedProject.title}
              </h2>

              {/* Content: Markdown Editor (admin) or Rendered (viewer) */}
              {isAdmin ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: 'var(--pixel-yellow)' }}>
                      마크다운 에디터 — ![img](url), [gif](url), [video](url) 지원
                    </span>
                    <button
                      onClick={saveContent}
                      style={{
                        fontFamily: 'var(--font-pixel)', fontSize: '0.6rem',
                        background: 'var(--pixel-green)', color: '#000', border: 'none',
                        padding: '8px 16px', cursor: 'pointer',
                      }}
                    >
                      💾 저장
                    </button>
                  </div>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    style={{
                      width: '100%', minHeight: '300px',
                      background: 'var(--pixel-bg)', color: 'var(--pixel-text)',
                      border: '2px solid var(--pixel-border)', padding: '1rem',
                      fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                      lineHeight: 1.8, resize: 'vertical',
                    }}
                  />
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--pixel-border)', paddingTop: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: 'var(--pixel-text-dim)', marginBottom: '0.5rem', display: 'block' }}>미리보기</span>
                    {renderMarkdown(editingContent)}
                  </div>
                </div>
              ) : (
                <div>{renderMarkdown(selectedProject.content)}</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--pixel-border)' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: 'var(--pixel-text-dim)' }}>
          © 2024 LEE SOLIP — PROJECTS
        </div>
      </footer>
    </motion.div>
  );
};

export default ProjectsPage;
