import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminSystemProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onLogin: (password: string) => boolean;
}

const AdminSystem: React.FC<AdminSystemProps> = ({ isAdmin, onToggleAdmin, onLogin }) => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLockClick = () => {
    if (isAdmin) {
      onToggleAdmin();
    } else {
      setShowModal(true);
      setPassword('');
      setError(false);
    }
  };

  const handleSubmit = () => {
    const success = onLogin(password);
    if (success) {
      setShowModal(false);
      setPassword('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') setShowModal(false);
  };

  return (
    <>
      {/* Lock Button */}
      <motion.button
        className={`admin-lock ${isAdmin ? 'active' : ''}`}
        onClick={handleLockClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isAdmin ? 'Admin Mode ON' : 'Admin Login'}
      >
        {isAdmin ? '🔓' : '🔒'}
      </motion.button>

      {/* Admin Badge */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              right: '5rem',
              zIndex: 90,
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.5rem',
              color: 'var(--pixel-yellow)',
              background: 'var(--pixel-surface)',
              border: '2px solid var(--pixel-yellow)',
              padding: '8px 16px',
              letterSpacing: '2px',
              boxShadow: 'var(--pixel-glow-gold)',
            }}
          >
            ADMIN MODE
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="admin-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>관리자 인증</h3>
              <p style={{
                fontFamily: 'var(--font-retro)',
                fontSize: '1.1rem',
                color: 'var(--pixel-text-dim)',
                textAlign: 'center',
                marginBottom: '1rem',
              }}>
                비밀번호를 입력하세요
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="••••"
                style={error ? { borderColor: '#ef4444', boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' } : {}}
              />
              {error && (
                <p style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.5rem',
                  color: '#ef4444',
                  textAlign: 'center',
                  marginBottom: '1rem',
                }}>
                  WRONG PASSWORD
                </p>
              )}
              <div className="admin-modal-actions">
                <button className="admin-modal-btn cancel" onClick={() => setShowModal(false)}>
                  취소
                </button>
                <button className="admin-modal-btn confirm" onClick={handleSubmit}>
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSystem;
