import React from 'react';
import { motion } from 'motion/react';

type Page = 'map' | 'board' | 'about' | 'projects';

interface MapHubProps {
  onNavigate: (page: Page) => void;
  onContact: () => void;
}

const MAP_OBJECTS = [
  {
    id: 'projects' as Page,
    label: 'Projects',
    emoji: '🏰',
    x: '12%',
    y: '18%',
    floatDelay: '0s',
    color: '#6366f1',
  },
  {
    id: 'board' as Page,
    label: 'Board',
    emoji: '📋',
    x: '42%',
    y: '35%',
    floatDelay: '0.8s',
    color: '#ff6bcb',
  },
  {
    id: 'about' as Page,
    label: 'About Me',
    emoji: '🏠',
    x: '68%',
    y: '25%',
    floatDelay: '1.5s',
    color: '#4ade80',
  },
  {
    id: 'contact' as any,
    label: 'Contact',
    emoji: '📮',
    x: '25%',
    y: '60%',
    floatDelay: '2s',
    color: '#51e2f5',
  },
];

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 4 + 2,
  delay: Math.random() * 4,
}));

const MapHub: React.FC<MapHubProps> = ({ onNavigate, onContact }) => {
  const handleClick = (id: string) => {
    if (id === 'contact') {
      onContact();
    } else {
      onNavigate(id as Page);
    }
  };

  return (
    <motion.div
      className="map-hub scanlines"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
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

      {/* Header */}
      <div className="map-header">
        <div className="map-logo">SOLIP'S WORLD</div>
      </div>

      {/* Map Objects */}
      <div className="map-container">
        {MAP_OBJECTS.map((obj, i) => (
          <motion.div
            key={obj.id}
            className="map-object"
            style={{
              left: obj.x,
              top: obj.y,
              '--float-delay': obj.floatDelay,
            } as React.CSSProperties}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2 + i * 0.15,
              type: 'spring',
              stiffness: 200,
            }}
            onClick={() => handleClick(obj.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
          >
            <div
              className="map-object-icon"
              style={{
                filter: `drop-shadow(0 0 12px ${obj.color})`,
              }}
            >
              <span style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>{obj.emoji}</span>
            </div>
            <div className="map-object-label">{obj.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MapHub;
