import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';

type Page = 'map' | 'board' | 'about' | 'projects';

interface MapHubProps {
  onNavigate: (page: Page) => void;
  onContact: () => void;
}

/* ── Building data ── */
const BUILDINGS = [
  {
    id: 'board' as Page, label: 'Board', emoji: '📋',
    x: 72, y: 18, w: 110, h: 80,
    desc: '기획 철학 & 이력',
    roofColor: '#e74c3c',
  },
  {
    id: 'projects' as Page, label: 'Projects', emoji: '🏰',
    x: 15, y: 15, w: 120, h: 90,
    desc: '프로젝트 모음',
    roofColor: '#8e44ad',
  },
  {
    id: 'about' as Page, label: 'About Me', emoji: '🏠',
    x: 60, y: 60, w: 100, h: 75,
    desc: '자기소개 & 경력',
    roofColor: '#27ae60',
  },
  {
    id: 'contact' as any, label: 'Contact', emoji: '📮',
    x: 20, y: 62, w: 90, h: 65,
    desc: '연락하기',
    roofColor: '#2980b9',
  },
];

/* ── Pixel Character (same as IntroScreen) ── */
const PixelCharacter: React.FC<{ walking?: boolean; flip?: boolean }> = ({ walking, flip }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    transform: flip ? 'scaleX(-1)' : 'scaleX(1)',
    animation: walking ? 'charWalk 0.35s steps(2) infinite' : 'charIdle 2s ease-in-out infinite',
  }}>
    <div style={{ width: 18, height: 10, background: 'var(--scene-char-hair)', borderRadius: '6px 6px 0 0' }} />
    <div style={{ width: 14, height: 12, background: 'var(--scene-char-skin)', borderRadius: '2px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 3, top: 4, width: 2, height: 2, background: '#333', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 3, top: 4, width: 2, height: 2, background: '#333', borderRadius: '50%' }} />
    </div>
    <div style={{ width: 16, height: 14, background: 'var(--scene-char-dress)', borderRadius: '2px 2px 4px 4px' }} />
    <div style={{ display: 'flex', gap: 3 }}>
      <div style={{ width: 5, height: 8, background: '#555', borderRadius: '0 0 2px 2px' }} />
      <div style={{ width: 5, height: 8, background: '#555', borderRadius: '0 0 2px 2px' }} />
    </div>
  </div>
);

/* ── Tree decoration ── */
const MapTree: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <div style={{
    position: 'absolute', left: `${x}%`, top: `${y}%`,
    transform: `scale(${s})`, transformOrigin: 'bottom center', pointerEvents: 'none',
  }}>
    <div style={{ width: 30, height: 25, background: 'var(--scene-tree)', borderRadius: '50%', position: 'relative', top: 4 }} />
    <div style={{ width: 8, height: 12, background: 'var(--scene-tree-trunk)', margin: '0 auto' }} />
  </div>
);

/* ══════════════════════════════════════ */
/* ── Map Hub ── */
/* ══════════════════════════════════════ */
const MapHub: React.FC<MapHubProps> = ({ onNavigate, onContact }) => {
  const [charPos, setCharPos] = useState({ x: 45, y: 42 });
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  const [targetPage, setTargetPage] = useState<string | null>(null);

  const handleBuildingClick = useCallback((building: typeof BUILDINGS[0]) => {
    if (isWalking) return;

    const targetX = building.x + (building.w / 20);
    const targetY = building.y + (building.h / 15);

    setDirection(targetX > charPos.x ? 'right' : 'left');
    setIsWalking(true);
    setCharPos({ x: targetX, y: targetY });

    const pageId = building.id;

    // Wait for character to arrive then navigate
    setTimeout(() => {
      setIsWalking(false);
      setTargetPage(pageId);
      setTimeout(() => {
        if (pageId === 'contact') {
          onContact();
        } else {
          onNavigate(pageId as Page);
        }
      }, 400);
    }, 1500);
  }, [charPos, isWalking, onNavigate, onContact]);

  return (
    <motion.div
      style={{
        position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ground (top-down grass) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 30% 40%, var(--scene-ground) 0%, transparent 70%),
          radial-gradient(ellipse at 70% 60%, var(--scene-ground) 0%, transparent 70%),
          var(--scene-ground-dark)
        `,
      }} />

      {/* Dirt paths (connecting buildings) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {/* Center to each building */}
        {BUILDINGS.map((b) => (
          <line
            key={b.id}
            x1="48%" y1="48%"
            x2={`${b.x + 5}%`} y2={`${b.y + 8}%`}
            stroke="var(--scene-road)"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.6"
          />
        ))}
        {/* Cross paths */}
        <line x1="18%" y1="25%" x2="75%" y2="25%" stroke="var(--scene-road)" strokeWidth="14" opacity="0.4" />
        <line x1="23%" y1="68%" x2="63%" y2="68%" stroke="var(--scene-road)" strokeWidth="14" opacity="0.4" />
      </svg>

      {/* Decorative trees */}
      {[
        { x: 5, y: 5 }, { x: 90, y: 8 }, { x: 48, y: 5 },
        { x: 3, y: 45 }, { x: 92, y: 45 }, { x: 50, y: 85 },
        { x: 88, y: 80 }, { x: 8, y: 82 }, { x: 40, y: 18 },
      ].map((t, i) => (
        <MapTree key={i} x={t.x} y={t.y} s={0.7 + Math.random() * 0.5} />
      ))}

      {/* Water pond */}
      <div style={{
        position: 'absolute', left: '42%', top: '35%', width: 60, height: 40,
        background: 'var(--scene-water)', borderRadius: '50%', opacity: 0.7,
        boxShadow: '0 0 15px var(--scene-water)',
      }} />

      {/* Buildings */}
      {BUILDINGS.map((building) => {
        const isHovered = hoveredBuilding === building.id;
        const isTarget = targetPage === building.id;
        return (
          <div
            key={building.id}
            style={{
              position: 'absolute',
              left: `${building.x}%`,
              top: `${building.y}%`,
              cursor: isWalking ? 'default' : 'pointer',
              transform: `scale(${isHovered ? 1.05 : 1})`,
              transition: 'transform 0.3s, filter 0.3s',
              filter: isHovered ? `drop-shadow(0 0 12px ${building.roofColor})` : 'none',
              zIndex: 5,
            }}
            onClick={() => handleBuildingClick(building)}
            onMouseEnter={() => setHoveredBuilding(building.id)}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            {/* Building structure */}
            <div style={{ width: building.w, position: 'relative' }}>
              {/* Roof */}
              <div style={{
                width: '110%', marginLeft: '-5%', height: 18,
                background: building.roofColor, borderRadius: '6px 6px 0 0',
                boxShadow: isHovered ? `0 0 20px ${building.roofColor}` : 'none',
                transition: 'box-shadow 0.3s',
              }} />
              {/* Body */}
              <div style={{
                width: '100%', height: building.h,
                background: 'var(--scene-building)',
                border: '3px solid rgba(0,0,0,0.15)',
                position: 'relative',
              }}>
                {/* Windows */}
                <div style={{ display: 'flex', gap: 4, padding: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {Array.from({ length: Math.floor(building.w / 28) * 2 }).map((_, i) => (
                    <div key={i} style={{
                      width: 16, height: 14,
                      background: isHovered ? 'rgba(255,220,100,0.9)' : 'rgba(255,220,100,0.4)',
                      border: '1px solid rgba(0,0,0,0.1)',
                      transition: 'background 0.5s',
                    }} />
                  ))}
                </div>
                {/* Door */}
                <div style={{
                  width: 18, height: 24, background: '#8B6914',
                  position: 'absolute', bottom: 0,
                  left: '50%', transform: 'translateX(-50%)',
                  borderRadius: '4px 4px 0 0', border: '2px solid rgba(0,0,0,0.2)',
                }} />
                {/* Emoji icon */}
                <div style={{
                  position: 'absolute', bottom: -2, right: 4,
                  fontSize: '1.4rem',
                }}>
                  {building.emoji}
                </div>
              </div>
            </div>

            {/* Label sign */}
            <div style={{
              marginTop: 6, textAlign: 'center',
              background: isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
              padding: '4px 10px', borderRadius: '4px',
              border: `2px solid ${building.roofColor}`,
              fontFamily: 'var(--font-pixel)', fontSize: '0.55rem',
              color: '#333', letterSpacing: '1px',
              transition: 'all 0.3s',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              boxShadow: isHovered ? `0 2px 10px rgba(0,0,0,0.2)` : 'none',
            }}>
              {building.label}
            </div>

            {/* Hover description tooltip */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 4, textAlign: 'center', fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem', color: 'var(--pixel-text-dim)',
                  background: 'var(--pixel-surface)', padding: '4px 8px',
                  borderRadius: '4px', border: '1px solid var(--pixel-border)',
                  whiteSpace: 'nowrap',
                }}
              >
                {building.desc}
              </motion.div>
            )}
          </div>
        );
      })}

      {/* Character */}
      <div style={{
        position: 'absolute',
        left: `${charPos.x}%`,
        top: `${charPos.y}%`,
        transform: 'translate(-50%, -50%) scale(1.5)',
        transition: isWalking ? 'left 1.5s ease-in-out, top 1.5s ease-in-out' : 'none',
        zIndex: 15,
        pointerEvents: 'none',
      }}>
        <PixelCharacter walking={isWalking} flip={direction === 'left'} />
        {/* Shadow */}
        <div style={{
          width: 20, height: 6, background: 'rgba(0,0,0,0.2)',
          borderRadius: '50%', margin: '-2px auto 0',
        }} />
      </div>

      {/* Navigation arrival flash */}
      {targetPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute', inset: 0, zIndex: 30,
            background: 'rgba(255,255,255,0.8)',
          }}
        />
      )}

      {/* Header */}
      <div style={{
        position: 'absolute', top: '1.5rem', left: '2rem', zIndex: 20,
        fontFamily: 'var(--font-pixel)', fontSize: '0.75rem',
        color: 'var(--pixel-yellow)', letterSpacing: '2px',
        textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
      }}>
        SOLIP'S WORLD
      </div>

      {/* Minimap indicator */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 20,
        fontFamily: 'var(--font-pixel)', fontSize: '0.5rem',
        color: 'var(--pixel-text-dim)', letterSpacing: '1px',
        background: 'var(--pixel-surface)', padding: '6px 12px',
        border: '2px solid var(--pixel-border)', borderRadius: '4px',
      }}>
        🗺️ VILLAGE MAP
      </div>

      {/* Hint text */}
      {!isWalking && !targetPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, fontFamily: 'var(--font-pixel)', fontSize: '0.5rem',
            color: 'var(--pixel-text-dim)', letterSpacing: '2px',
            animation: 'blink 2s ease-in-out infinite',
          }}
        >
          CLICK A BUILDING TO EXPLORE
        </motion.div>
      )}

      {/* CSS Keyframes */}
      <style>{`
        @keyframes charWalk {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes charIdle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </motion.div>
  );
};

export default MapHub;
