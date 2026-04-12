import React from 'react';
import { motion } from 'motion/react';

interface IntroScreenProps {
  onStart: () => void;
}

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 3,
}));

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      className="intro-screen scanlines"
      onClick={onStart}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Stars */}
      <div className="intro-stars">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="intro-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="intro-title">SOLIP'S</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="intro-subtitle">WORLD</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <div className="intro-press">PRESS TO START</div>
      </motion.div>

      {/* Footer */}
      <div className="intro-footer">
        <div>
          <div className="intro-footer-text">LEE SOLIP</div>
          <div className="intro-footer-text" style={{ opacity: 0.5, marginTop: 4 }}>
            게임의 세상을 넓을 수 있다고 믿는 게임 기획자
          </div>
        </div>
        <div className="intro-footer-text">GAME DESIGN PORTFOLIO</div>
      </div>
    </motion.div>
  );
};

export default IntroScreen;
