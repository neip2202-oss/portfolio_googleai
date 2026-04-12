/**
 * SOLIP'S WORLD — Interactive Game Portfolio
 * Main Application Router & State Manager
 */

import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import IntroScreen from './components/IntroScreen';
import MapHub from './components/MapHub';
import BoardPage from './components/BoardPage';
import AboutPage from './components/AboutPage';
import ProjectsPage from './components/ProjectsPage';
import AdminSystem from './components/AdminSystem';
import AudioSystem from './components/AudioSystem';

type Page = 'intro' | 'map' | 'board' | 'about' | 'projects';

const ADMIN_PASSWORD = '0000';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('intro');
  const [isAdmin, setIsAdmin] = useState(false);

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
            isAdmin={isAdmin}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            key="about"
            onBack={handleBackToMap}
            onNavigate={handlePageNavigate}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsPage
            key="projects"
            onBack={handleBackToMap}
            onNavigate={handlePageNavigate}
          />
        )}
      </AnimatePresence>

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
