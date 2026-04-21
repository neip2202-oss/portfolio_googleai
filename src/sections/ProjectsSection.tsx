import React from 'react';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import { useReveal } from '../hooks/useReveal';
import { projects } from '../data/projects';
import './ProjectsSection.css';

const ProjectsSection: React.FC = () => {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section id="projects" className="section" ref={ref}>
      <div className={`section__inner reveal ${isVisible ? 'visible' : ''}`}>
        <SectionTitle title="Projects" subtitle="실제 출시한 프로젝트들" />
        <div className="projects__list">
          {projects.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-card__image">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                />
              </div>
              <div className="project-card__content">
                <span className="project-card__genre">{project.genre}</span>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>
                <div className="project-card__roles">
                  {project.roles.map((role) => (
                    <Tag key={role} label={role} />
                  ))}
                </div>
                {project.links.length > 0 && (
                  <div className="project-card__links">
                    {project.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card__link"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
