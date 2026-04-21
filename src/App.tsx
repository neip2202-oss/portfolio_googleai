/**
 * SOLIP PORTFOLIO — Single Page Application
 * Main composition: Header → Sections → Footer
 */

import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import StrengthsSection from './sections/StrengthsSection';
import ProjectsSection from './sections/ProjectsSection';
import HowIWorkSection from './sections/HowIWorkSection';
import ContactSection from './sections/ContactSection';

const App: React.FC = () => (
  <>
    <Header />
    <main>
      <HeroSection />
      <AboutSection />
      <StrengthsSection />
      <ProjectsSection />
      <HowIWorkSection />
      <ContactSection />
    </main>
    <Footer />
  </>
);

export default App;
