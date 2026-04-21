import React from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import './Header.css';

const NAV_ITEMS = [
  { id: 'hero', label: 'Main' },
  { id: 'about', label: 'About' },
  { id: 'strengths', label: 'Strengths' },
  { id: 'projects', label: 'Projects' },
  { id: 'how-i-work', label: 'How I Work' },
  { id: 'contact', label: 'Contact' },
];

const Header: React.FC = () => {
  const sectionIds = NAV_ITEMS.map((n) => n.id);
  const active = useScrollSpy(sectionIds);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__logo" href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>
          SOLIP
        </a>
        <nav className="header__nav">
          {NAV_ITEMS.filter((n) => n.id !== 'hero').map((item) => (
            <button
              key={item.id}
              className={`header__link ${active === item.id ? 'header__link--active' : ''}`}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
