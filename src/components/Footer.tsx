import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer__inner">
      <p className="footer__copy">© 2026 SOLIP PORTFOLIO</p>
      <nav className="footer__nav">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </footer>
);

export default Footer;
