import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import mapBg from '../assets/map-bg.png';

type Page = 'map' | 'board' | 'about' | 'projects';

interface MapHubProps {
  onNavigate: (page: Page) => void;
  onContact: () => void;
}

/* ── Building data (positions & IDs PRESERVED EXACTLY) ── */
const BUILDINGS = [
  {
    id: 'board' as Page, label: 'Board', emoji: '📋',
    x: 72, y: 18, w: 110, h: 80,
    desc: '기획 철학 & 이력',
    wallColor: '#d5e8d4', roofColor: '#5a7a5a', accent: '#7aaa7a', sign: '📋 BOARD',
  },
  {
    id: 'projects' as Page, label: 'Projects', emoji: '🏰',
    x: 15, y: 15, w: 120, h: 90,
    desc: '프로젝트 모음',
    wallColor: '#e8c8b8', roofColor: '#8a5a4a', accent: '#c47a60', sign: '🏰 PROJECTS',
  },
  {
    id: 'about' as Page, label: 'About Me', emoji: '🏠',
    x: 60, y: 60, w: 100, h: 75,
    desc: '자기소개 & 경력',
    wallColor: '#e8d8c8', roofColor: '#b07050', accent: '#d4956a', sign: '🏠 ABOUT',
  },
  {
    id: 'contact' as any, label: 'Contact', emoji: '📮',
    x: 20, y: 62, w: 90, h: 65,
    desc: '연락하기',
    wallColor: '#d0c8e0', roofColor: '#6a5a8a', accent: '#9a88b8', sign: '📮 CONTACT',
  },
];

/* ── Pixel Character ── */
const PixelCharacter: React.FC<{ walking?: boolean; flip?: boolean }> = ({ walking, flip }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    transform: flip ? 'scaleX(-1)' : 'scaleX(1)',
    animation: walking ? 'charWalk 0.35s steps(2) infinite' : 'charIdle 2s ease-in-out infinite',
    filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.3))',
    imageRendering: 'pixelated' as any,
  }}>
    <div style={{ width: 24, height: 13, background: '#5D4037', borderRadius: '8px 8px 2px 2px', position: 'relative', border: '2px solid #3a2520' }}>
      <div style={{ position: 'absolute', right: -2, top: 0, width: 8, height: 6, background: '#ff6b8a', borderRadius: '50%', border: '1px solid #d45070' }} />
    </div>
    <div style={{ width: 20, height: 15, background: '#ffddbf', borderRadius: '3px', position: 'relative', border: '2px solid #c9a080', marginTop: -2 }}>
      <div style={{ position: 'absolute', left: 4, top: 4, width: 3, height: 4, background: '#2a1520', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 4, top: 4, width: 3, height: 4, background: '#2a1520', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: 5, top: 4, width: 1, height: 1, background: '#fff', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 5, top: 4, width: 1, height: 1, background: '#fff', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: 1, bottom: 2, width: 5, height: 3, background: 'rgba(255,120,120,0.4)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 1, bottom: 2, width: 5, height: 3, background: 'rgba(255,120,120,0.4)', borderRadius: '50%' }} />
    </div>
    <div style={{ width: 22, height: 18, background: '#ff8ba7', borderRadius: '3px 3px 6px 6px', position: 'relative', border: '2px solid #d06080', marginTop: -2 }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 10, height: 4, background: '#fff', borderRadius: '0 0 50% 50%' }} />
    </div>
    <div style={{ display: 'flex', gap: 4, marginTop: -1 }}>
      <div style={{ width: 7, height: 6, background: '#6d4030', borderRadius: '0 0 3px 3px', border: '1px solid #4a2520' }} />
      <div style={{ width: 7, height: 6, background: '#6d4030', borderRadius: '0 0 3px 3px', border: '1px solid #4a2520' }} />
    </div>
  </div>
);

/* ═══════ MAIN COMPONENT ═══════ */
/* ─ ALL STATE & LOGIC PRESERVED EXACTLY ─ */
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
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Generated pixel art map background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${mapBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        imageRendering: 'pixelated' as any,
      }} />

      {/* Subtle dark overlay for readability */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.12) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Buildings (ALL interaction PRESERVED EXACTLY) ── */}
      {BUILDINGS.map((building) => {
        const isHovered = hoveredBuilding === building.id;
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
              filter: isHovered
                ? `drop-shadow(0 0 15px ${building.accent}) brightness(1.08)`
                : 'drop-shadow(3px 5px 3px rgba(0,0,0,0.35))',
              zIndex: 5,
              imageRendering: 'pixelated' as any,
            }}
            onClick={() => handleBuildingClick(building)}
            onMouseEnter={() => setHoveredBuilding(building.id)}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <div style={{ width: building.w, position: 'relative' }}>
              {/* Chimney */}
              <div style={{
                position: 'absolute', top: -16, right: 16, width: 14, height: 22,
                background: '#8a6a5a', border: '3px solid #4a3020', borderBottom: 'none', zIndex: 1,
              }}>
                <div style={{ width: '100%', height: 5, background: '#6a4a3a', borderBottom: '2px solid #4a3020' }} />
              </div>

              {/* Roof */}
              <div style={{
                width: '120%', marginLeft: '-10%', height: 0, position: 'relative', zIndex: 2,
                borderLeft: `${building.w * 0.6}px solid transparent`,
                borderRight: `${building.w * 0.6}px solid transparent`,
                borderBottom: `30px solid ${building.roofColor}`,
                filter: isHovered ? 'brightness(1.15)' : 'none',
                transition: 'filter 0.3s',
              }} />
              {/* Roof outline (top border) */}
              <div style={{
                width: '120%', marginLeft: '-10%', height: 0, position: 'absolute', top: 0, zIndex: 3,
                borderLeft: `${building.w * 0.6}px solid transparent`,
                borderRight: `${building.w * 0.6}px solid transparent`,
                borderBottom: `30px solid transparent`,
                borderBottomColor: 'transparent',
                filter: 'drop-shadow(0 0 0 #3a2520)',
              }} />
              {/* Roof detail strip */}
              <div style={{ width: '112%', marginLeft: '-6%', height: 5, background: '#4a3020', marginTop: -1 }} />

              {/* Wall */}
              <div style={{
                width: '100%', height: building.h,
                background: building.wallColor,
                border: '3px solid #4a3020',
                borderTop: 'none',
                position: 'relative',
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -3px 0 rgba(0,0,0,0.08)',
              }}>
                {/* Brick texture */}
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.08,
                  background: `repeating-linear-gradient(
                    0deg, transparent, transparent 8px, rgba(0,0,0,0.3) 8px, rgba(0,0,0,0.3) 9px
                  ), repeating-linear-gradient(
                    90deg, transparent, transparent 16px, rgba(0,0,0,0.15) 16px, rgba(0,0,0,0.15) 17px
                  )`,
                  pointerEvents: 'none',
                }} />

                {/* Windows - 2 rows */}
                {[0, 1].map(row => (
                  <div key={row} style={{ display: 'flex', gap: 6, padding: row === 0 ? '6px 8px 2px' : '4px 8px', justifyContent: 'center' }}>
                    {Array.from({ length: Math.max(2, Math.floor(building.w / 35)) }).map((_, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        {/* Window */}
                        <div style={{
                          width: 18, height: 16,
                          background: isHovered ? 'linear-gradient(180deg, #ffe88a 0%, #ffd060 100%)' : 'linear-gradient(180deg, #c0d8e8 0%, #a0c0d8 100%)',
                          border: '2px solid #4a3020', borderRadius: '2px',
                          transition: 'background 0.3s',
                          boxShadow: isHovered ? '0 0 6px rgba(255,230,100,0.6)' : 'none',
                          position: 'relative',
                        }}>
                          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: '#4a3020' }} />
                          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: '#4a3020' }} />
                          <div style={{ position: 'absolute', top: 1, left: 1, width: 4, height: 3, background: 'rgba(255,255,255,0.45)', borderRadius: '1px' }} />
                        </div>
                        {/* Flower box */}
                        {row === 1 && (
                          <div style={{ marginTop: 1, width: 20, height: 4, background: '#8a6a4a', border: '1px solid #5a4030', borderRadius: '1px', display: 'flex', gap: 2, alignItems: 'flex-start', justifyContent: 'center', paddingTop: 0 }}>
                            <div style={{ width: 4, height: 4, background: '#ff8ba7', borderRadius: '50%', marginTop: -3 }} />
                            <div style={{ width: 4, height: 4, background: '#ffd166', borderRadius: '50%', marginTop: -4 }} />
                            <div style={{ width: 4, height: 4, background: '#ff8ba7', borderRadius: '50%', marginTop: -3 }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Door with awning */}
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
                  {/* Awning */}
                  <div style={{
                    width: 34, height: 9, marginBottom: -1,
                    background: `repeating-linear-gradient(90deg, ${building.accent} 0, ${building.accent} 5px, rgba(255,255,255,0.4) 5px, rgba(255,255,255,0.4) 10px)`,
                    borderRadius: '3px 3px 0 0', border: '2px solid #4a3020', borderBottom: 'none',
                  }} />
                  {/* Door */}
                  <div style={{
                    width: 22, height: 30, background: '#6a4a2a', margin: '0 auto',
                    borderRadius: '3px 3px 0 0', border: '3px solid #4a3020', borderBottom: 'none',
                    boxShadow: 'inset -3px 0 0 rgba(0,0,0,0.15), inset 3px 0 0 rgba(255,255,255,0.1)',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', top: 3, left: 2, right: 2, bottom: 8, border: '2px solid #5a3a1a', borderRadius: '2px' }} />
                    <div style={{ position: 'absolute', right: 3, top: '55%', width: 4, height: 4, background: '#c8a040', borderRadius: '50%', border: '1px solid #8a7030' }} />
                  </div>
                </div>
              </div>

              {/* Foundation */}
              <div style={{ width: '106%', marginLeft: '-3%', height: 6, background: '#7a6a5a', border: '2px solid #4a3020', borderTop: 'none', borderRadius: '0 0 2px 2px' }} />
            </div>

            {/* Label sign (wood plank style) */}
            <div style={{
              marginTop: 6, textAlign: 'center',
              background: isHovered ? '#fff8e8' : '#f0e0c8',
              padding: '4px 12px', borderRadius: '3px',
              border: '2px solid #6a4a30',
              fontFamily: 'var(--font-pixel)', fontSize: '0.5rem',
              color: '#4a3020', letterSpacing: '1px',
              transition: 'all 0.3s',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              boxShadow: isHovered ? '0 2px 10px rgba(0,0,0,0.25)' : '1px 2px 0 rgba(0,0,0,0.15)',
            }}>
              {building.label}
            </div>

            {/* Hover tooltip */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 4, textAlign: 'center', fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem', color: '#f0e6ff',
                  background: 'rgba(30,20,50,0.85)', padding: '4px 10px',
                  borderRadius: '4px', border: '2px solid rgba(200,180,230,0.4)',
                  whiteSpace: 'nowrap', backdropFilter: 'blur(4px)',
                }}
              >
                {building.desc}
              </motion.div>
            )}
          </div>
        );
      })}

      {/* ── Character (position logic PRESERVED EXACTLY) ── */}
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
        <div style={{ width: 22, height: 7, background: 'rgba(0,0,0,0.2)', borderRadius: '50%', margin: '-2px auto 0' }} />
      </div>

      {/* ── Navigation arrival flash (PRESERVED) ── */}
      {targetPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(255,255,255,0.8)' }}
        />
      )}

      {/* ── Header (PRESERVED) ── */}
      <div style={{
        position: 'absolute', top: '1.5rem', left: '2rem', zIndex: 20,
        fontFamily: 'var(--font-pixel)', fontSize: '0.75rem',
        color: '#fde047', letterSpacing: '2px',
        textShadow: '2px 2px 0 rgba(0,0,0,0.5), 0 0 10px rgba(253,224,71,0.3)',
      }}>
        SOLIP'S WORLD
      </div>

      {/* ── Minimap indicator (PRESERVED) ── */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 20,
        fontFamily: 'var(--font-pixel)', fontSize: '0.5rem',
        color: '#e0d5f2', letterSpacing: '1px',
        background: 'rgba(30,20,50,0.8)', padding: '6px 12px',
        border: '2px solid rgba(200,180,230,0.3)', borderRadius: '4px',
        backdropFilter: 'blur(4px)',
      }}>
        🗺️ VILLAGE MAP
      </div>

      {/* ── Hint text (PRESERVED) ── */}
      {!isWalking && !targetPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, fontFamily: 'var(--font-pixel)', fontSize: '0.5rem',
            color: '#e0d5f2', letterSpacing: '2px',
            animation: 'blink 2s ease-in-out infinite',
            textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
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
