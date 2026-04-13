/**
 * SOLIP'S WORLD — Interactive Game Portfolio
 * Main Application Router & State Manager
 */

import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import IntroScreen from './components/IntroScreen';
import MapHub from './components/MapHub';
import BoardPage from './components/BoardPage';
import AboutPage from './components/AboutPage';
import ProjectsPage from './components/ProjectsPage';
import AdminSystem from './components/AdminSystem';
import AudioSystem from './components/AudioSystem';

type Page = 'intro' | 'map' | 'board' | 'about' | 'projects';
type Theme = 'day' | 'night' | 'white';

const ADMIN_PASSWORD = '0000';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('intro');
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState<Theme>('day');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'day') return 'night';
      if (prev === 'night') return 'white';
      return 'day';
    });
  }, []);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleIntroStart = useCallback(() => {
    navigateTo('map');
  }, [navigateTo]);

  const handleMapNavigate = useCallback((page: Page) => {
    navigateTo(page);
  }, [navigateTo]);

  const handleContact = useCallback(() => {
    window.location.href = 'mailto:solip.dev@email.com';
  }, []);

  const handleBackToMap = useCallback(() => {
    navigateTo('map');
  }, [navigateTo]);

  const handleGoIntro = useCallback(() => {
    navigateTo('intro');
  }, [navigateTo]);

  const handlePageNavigate = useCallback((page: string) => {
    navigateTo(page as Page);
  }, [navigateTo]);

  const handleAdminLogin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const handleAdminToggle = useCallback(() => {
    setIsAdmin(false);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {currentPage === 'intro' && (
          <IntroScreen key="intro" onStart={handleIntroStart} />
        )}

        {currentPage === 'map' && (
          <MapHub
            key="map"
            onNavigate={handleMapNavigate}
            onContact={handleContact}
          />
        )}

        {currentPage === 'board' && (
          <BoardPage
            key="board"
            onBack={handleBackToMap}
            onNavigate={handlePageNavigate}
            onGoIntro={handleGoIntro}
            isAdmin={isAdmin}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            key="about"
            onBack={handleBackToMap}
            onGoIntro={handleGoIntro}
            onNavigate={handlePageNavigate}
            isAdmin={isAdmin}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsPage
            key="projects"
            onBack={handleBackToMap}
            onGoIntro={handleGoIntro}
            onNavigate={handlePageNavigate}
            isAdmin={isAdmin}
          />
        )}
      </AnimatePresence>

      {/* Floating Theme Toggle - position depends on page */}
      <button 
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          ...(currentPage === 'map' || currentPage === 'intro'
            ? { top: '1.5rem', right: '1.5rem' }
            : { bottom: '1.5rem', left: '4.5rem' }),
          zIndex: 100,
          background: 'var(--pixel-surface)',
          border: '2px solid var(--pixel-border)',
          color: 'var(--pixel-text)',
          padding: '8px 12px',
          fontFamily: 'var(--font-pixel)',
          fontSize: '0.6rem',
          cursor: 'pointer'
        }}
      >
        {theme === 'day' ? '☀️ DAY' : theme === 'night' ? '🌙 NIGHT' : '⬜ WHITE'}
      </button>

      {/* Floating MAP CTA (always follows on content pages) */}
      {(currentPage === 'board' || currentPage === 'about' || currentPage === 'projects') && (
        <button
          onClick={handleBackToMap}
          style={{
            position: 'fixed',
            bottom: '5rem',
            right: '1.5rem',
            zIndex: 90,
            background: 'var(--pixel-accent)',
            color: 'var(--pixel-bg)',
            border: '2px solid var(--pixel-border)',
            padding: '12px 24px',
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.8rem',
            boxShadow: 'var(--pixel-glow-cyan)',
            cursor: 'pointer',
            borderRadius: '24px'
          }}
        >
          🗺️ MAP
        </button>
      )}

      {/* Admin system - always visible except on intro */}
      {currentPage !== 'intro' && (
        <>
          <AdminSystem
            isAdmin={isAdmin}
            onToggleAdmin={handleAdminToggle}
            onLogin={handleAdminLogin}
          />
          <AudioSystem />
        </>
      )}
    </>
  );
};

export default App;
