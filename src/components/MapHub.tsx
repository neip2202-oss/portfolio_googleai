import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';

type Page = 'map' | 'board' | 'about' | 'projects';

interface MapHubProps {
  onNavigate: (page: Page) => void;
  onContact: () => void;
}

/* ── Building data (positions & IDs preserved exactly) ── */
const BUILDINGS = [
  {
    id: 'board' as Page, label: 'Board', emoji: '📋',
    x: 72, y: 18, w: 110, h: 80,
    desc: '기획 철학 & 이력',
    roofColor: 'var(--scene-roof-2)',
    wallColor: 'var(--scene-building-2)',
    awningColor: '#8aab8a',
  },
  {
    id: 'projects' as Page, label: 'Projects', emoji: '🏰',
    x: 15, y: 15, w: 120, h: 90,
    desc: '프로젝트 모음',
    roofColor: 'var(--scene-roof-1)',
    wallColor: 'var(--scene-building-1)',
    awningColor: '#d49a8a',
  },
  {
    id: 'about' as Page, label: 'About Me', emoji: '🏠',
    x: 60, y: 60, w: 100, h: 75,
    desc: '자기소개 & 경력',
    roofColor: 'var(--scene-roof-3)',
    wallColor: 'var(--scene-building-3)',
    awningColor: '#e0a88a',
  },
  {
    id: 'contact' as any, label: 'Contact', emoji: '📮',
    x: 20, y: 62, w: 90, h: 65,
    desc: '연락하기',
    roofColor: 'var(--scene-roof-4)',
    wallColor: 'var(--scene-building-4)',
    awningColor: '#a898c8',
  },
];

/* ═══════ DECORATIVE SUB-COMPONENTS ═══════ */

/* ── Upgraded Pixel Character ── */
const PixelCharacter: React.FC<{ walking?: boolean; flip?: boolean }> = ({ walking, flip }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    transform: flip ? 'scaleX(-1)' : 'scaleX(1)',
    animation: walking ? 'charWalk 0.35s steps(2) infinite' : 'charIdle 2s ease-in-out infinite',
    filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.25))',
  }}>
    {/* Hair with ribbon */}
    <div style={{ width: 22, height: 12, background: 'var(--scene-char-hair)', borderRadius: '8px 8px 2px 2px', position: 'relative' }}>
      <div style={{ position: 'absolute', right: -1, top: 1, width: 7, height: 5, background: 'var(--scene-flower-1)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: 3, bottom: 0, width: 16, height: 3, background: 'var(--scene-char-hair)', filter: 'brightness(0.85)' }} />
    </div>
    {/* Face */}
    <div style={{ width: 18, height: 14, background: 'var(--scene-char-skin)', borderRadius: '3px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 4, top: 4, width: 3, height: 4, background: '#3a2520', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 4, top: 4, width: 3, height: 4, background: '#3a2520', borderRadius: '50%' }} />
      {/* Eye shine */}
      <div style={{ position: 'absolute', left: 5, top: 4, width: 1, height: 1, background: '#fff', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 5, top: 4, width: 1, height: 1, background: '#fff', borderRadius: '50%' }} />
      {/* Blush */}
      <div style={{ position: 'absolute', left: 1, bottom: 2, width: 5, height: 3, background: 'rgba(255,150,140,0.45)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 1, bottom: 2, width: 5, height: 3, background: 'rgba(255,150,140,0.45)', borderRadius: '50%' }} />
    </div>
    {/* Dress with collar */}
    <div style={{ width: 20, height: 16, background: 'var(--scene-char-dress)', borderRadius: '3px 3px 6px 6px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 10, height: 4, background: '#fff', borderRadius: '0 0 50% 50%' }} />
    </div>
    {/* Shoes */}
    <div style={{ display: 'flex', gap: 4 }}>
      <div style={{ width: 6, height: 6, background: '#8b6550', borderRadius: '0 0 3px 3px' }} />
      <div style={{ width: 6, height: 6, background: '#8b6550', borderRadius: '0 0 3px 3px' }} />
    </div>
  </div>
);

/* ── Detailed Tree (multiple types) ── */
const MapTree: React.FC<{ x: number; y: number; s?: number; variant?: number }> = ({ x, y, s = 1, variant = 0 }) => (
  <div style={{
    position: 'absolute', left: `${x}%`, top: `${y}%`,
    transform: `scale(${s})`, transformOrigin: 'bottom center', pointerEvents: 'none',
    filter: 'drop-shadow(2px 3px 1px rgba(0,0,0,0.15))',
  }}>
    {variant === 1 ? (
      /* Pine tree */
      <>
        <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: '20px solid var(--scene-tree-dark)', margin: '0 auto', position: 'relative', top: 8 }} />
        <div style={{ width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderBottom: '22px solid var(--scene-tree)', margin: '0 auto', position: 'relative', top: 2 }} />
        <div style={{ width: 8, height: 10, background: 'var(--scene-tree-trunk)', margin: '0 auto', borderRadius: '0 0 2px 2px' }} />
      </>
    ) : variant === 2 ? (
      /* Fruit tree */
      <>
        <div style={{ width: 36, height: 30, background: 'var(--scene-tree)', borderRadius: '50%', position: 'relative', top: 5 }}>
          <div style={{ position: 'absolute', top: 5, left: 6, width: 5, height: 5, background: '#ff6b6b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 12, right: 7, width: 5, height: 5, background: '#ff6b6b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: 8, left: 14, width: 5, height: 5, background: '#ff8a80', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: '100%', height: '50%', top: 0, background: 'var(--scene-tree-light)', borderRadius: '50% 50% 0 0', opacity: 0.4 }} />
        </div>
        <div style={{ width: 10, height: 14, background: 'var(--scene-tree-trunk)', margin: '0 auto', borderRadius: '0 0 3px 3px' }} />
      </>
    ) : (
      /* Round tree */
      <>
        <div style={{ width: 34, height: 28, background: 'var(--scene-tree)', borderRadius: '50%', position: 'relative', top: 5 }}>
          <div style={{ position: 'absolute', width: '85%', height: '45%', top: 2, left: '8%', background: 'var(--scene-tree-light)', borderRadius: '50%', opacity: 0.5 }} />
        </div>
        <div style={{ width: 10, height: 14, background: 'var(--scene-tree-trunk)', margin: '0 auto', borderRadius: '0 0 3px 3px' }} />
      </>
    )}
  </div>
);

/* ── Flower cluster ── */
const Flowers: React.FC<{ x: number; y: number; colors?: string[] }> = ({
  x, y, colors = ['var(--scene-flower-1)', 'var(--scene-flower-2)', 'var(--scene-flower-3)']
}) => (
  <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, display: 'flex', gap: 4, pointerEvents: 'none' }}>
    {colors.map((c, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 7, height: 7, background: c, borderRadius: '50%', boxShadow: `inset -1px -1px 0 rgba(0,0,0,0.15)` }} />
        <div style={{ width: 2, height: 7, background: '#5a9e4e' }} />
      </div>
    ))}
  </div>
);

/* ── Bush ── */
const Bush: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <div style={{
    position: 'absolute', left: `${x}%`, top: `${y}%`, pointerEvents: 'none',
    filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.12))',
  }}>
    <div style={{ width: 28 * s, height: 18 * s, background: 'radial-gradient(ellipse, var(--scene-tree-light) 30%, var(--scene-tree) 90%)', borderRadius: '50% 50% 40% 40%' }} />
  </div>
);

/* ── White picket fence ── */
const Fence: React.FC<{ x: number; y: number; width: number }> = ({ x, y, width }) => (
  <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width, height: 16, pointerEvents: 'none' }}>
    {/* Rails */}
    <div style={{ position: 'absolute', top: 4, width: '100%', height: 2, background: 'var(--scene-fence)', boxShadow: '0 1px 0 rgba(0,0,0,0.08)' }} />
    <div style={{ position: 'absolute', top: 10, width: '100%', height: 2, background: 'var(--scene-fence)', boxShadow: '0 1px 0 rgba(0,0,0,0.08)' }} />
    {/* Pickets */}
    {Array.from({ length: Math.floor(width / 7) }).map((_, i) => (
      <div key={i} style={{ position: 'absolute', left: i * 7, top: 0, width: 4, height: 14, background: 'var(--scene-fence)', borderRadius: '2px 2px 0 0', boxShadow: '1px 0 0 rgba(0,0,0,0.06)' }} />
    ))}
  </div>
);

/* ── Bench ── */
const Bench: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, pointerEvents: 'none', filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.15))' }}>
    <div style={{ width: 26, height: 8, background: '#c4956a', borderRadius: '2px 2px 0 0', border: '1px solid rgba(0,0,0,0.1)' }} />
    <div style={{ width: 30, height: 5, background: '#d4a57a', borderRadius: '2px', boxShadow: '0 1px 0 rgba(0,0,0,0.1)' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
      <div style={{ width: 3, height: 5, background: '#8B6914' }} />
      <div style={{ width: 3, height: 5, background: '#8B6914' }} />
    </div>
  </div>
);

/* ── Pond with lily pads ── */
const Pond: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, pointerEvents: 'none' }}>
    <div style={{
      width: 75, height: 48, borderRadius: '50%',
      background: 'radial-gradient(ellipse, var(--scene-water) 50%, var(--scene-water-deep) 100%)',
      border: '3px solid var(--scene-ground-dark)',
      boxShadow: 'inset 0 3px 8px rgba(255,255,255,0.35), 2px 3px 0 rgba(0,0,0,0.1)',
      position: 'relative',
    }}>
      {/* Water reflection */}
      <div style={{ position: 'absolute', left: 12, top: 10, width: 22, height: 5, background: 'rgba(255,255,255,0.35)', borderRadius: '50%', transform: 'rotate(-10deg)' }} />
      {/* Lily pads */}
      <div style={{ position: 'absolute', right: 10, top: 12, width: 12, height: 10, background: '#6aaa5e', borderRadius: '50%', border: '1px solid #5a9a4e' }}>
        <div style={{ position: 'absolute', top: 2, left: 4, width: 4, height: 4, background: 'var(--scene-flower-1)', borderRadius: '50%' }} />
      </div>
      <div style={{ position: 'absolute', left: 20, bottom: 6, width: 10, height: 8, background: '#7bb86a', borderRadius: '50%', border: '1px solid #6aa85a' }} />
      {/* Sparkle */}
      <div style={{ position: 'absolute', left: 35, top: 8, width: 3, height: 3, background: 'rgba(255,255,255,0.7)', borderRadius: '50%', animation: 'sparkle 2s ease-in-out infinite' }} />
    </div>
  </div>
);

/* ── Signpost ── */
const Signpost: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, pointerEvents: 'none', filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.15))' }}>
    <div style={{
      width: 40, height: 18, background: 'var(--scene-building-1)', border: '2px solid var(--scene-tree-trunk)',
      borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-pixel)', fontSize: '0.25rem', color: 'var(--scene-tree-trunk)', transform: 'rotate(-3deg)',
    }}>{text}</div>
    <div style={{ width: 4, height: 14, background: 'var(--scene-tree-trunk)', margin: '-1px auto 0', borderRadius: '0 0 2px 2px' }} />
  </div>
);

/* ── Lamp Post ── */
const LampPost: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, pointerEvents: 'none' }}>
    <div style={{ width: 12, height: 10, background: '#fde68a', borderRadius: '4px 4px 0 0', boxShadow: '0 0 12px rgba(253,230,138,0.4)', border: '2px solid #888' }} />
    <div style={{ width: 4, height: 18, background: '#888', margin: '0 auto' }} />
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
      style={{
        position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Ground: textured grass ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 2px 5px, rgba(130,190,120,0.25) 0%, transparent 100%) 0 0 / 16px 20px,
          radial-gradient(ellipse 2px 4px, rgba(150,200,130,0.2) 0%, transparent 100%) 8px 10px / 16px 20px,
          radial-gradient(ellipse at 25% 35%, var(--scene-ground-accent) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 55%, var(--scene-ground-accent) 0%, transparent 45%),
          radial-gradient(ellipse at 50% 80%, rgba(180,160,130,0.08) 0%, transparent 35%),
          linear-gradient(155deg, var(--scene-ground) 0%, var(--scene-ground-dark) 100%)
        `,
      }} />

      {/* ── Dirt path network ── */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <filter id="pathShadow">
            <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.12" />
          </filter>
        </defs>
        {/* Path edges (darker) */}
        {BUILDINGS.map((b) => (
          <line key={`edge-${b.id}`} x1="48%" y1="48%" x2={`${b.x + 5}%`} y2={`${b.y + 8}%`}
            stroke="var(--scene-road-edge)" strokeWidth="26" strokeLinecap="round" opacity="0.5" />
        ))}
        {/* Main paths */}
        {BUILDINGS.map((b) => (
          <line key={b.id} x1="48%" y1="48%" x2={`${b.x + 5}%`} y2={`${b.y + 8}%`}
            stroke="var(--scene-road)" strokeWidth="20" strokeLinecap="round" opacity="0.7"
            filter="url(#pathShadow)" />
        ))}
        {/* Stone texture on paths */}
        {BUILDINGS.map((b) => (
          <line key={`tex-${b.id}`} x1="48%" y1="48%" x2={`${b.x + 5}%`} y2={`${b.y + 8}%`}
            stroke="var(--scene-road-line)" strokeWidth="20" strokeLinecap="round"
            strokeDasharray="3 8" opacity="0.3" />
        ))}
        {/* Cross paths */}
        <line x1="18%" y1="25%" x2="75%" y2="25%" stroke="var(--scene-road-edge)" strokeWidth="18" opacity="0.35" />
        <line x1="18%" y1="25%" x2="75%" y2="25%" stroke="var(--scene-road)" strokeWidth="14" opacity="0.45" />
        <line x1="23%" y1="68%" x2="63%" y2="68%" stroke="var(--scene-road-edge)" strokeWidth="18" opacity="0.35" />
        <line x1="23%" y1="68%" x2="63%" y2="68%" stroke="var(--scene-road)" strokeWidth="14" opacity="0.45" />
      </svg>

      {/* ── Decorations ── */}
      {/* Trees (varied types) */}
      <MapTree x={4} y={4} s={0.9} variant={0} />
      <MapTree x={90} y={6} s={0.85} variant={1} />
      <MapTree x={48} y={3} s={0.75} variant={2} />
      <MapTree x={2} y={44} s={1} variant={1} />
      <MapTree x={93} y={42} s={0.8} variant={0} />
      <MapTree x={50} y={86} s={0.9} variant={0} />
      <MapTree x={88} y={82} s={0.7} variant={2} />
      <MapTree x={7} y={84} s={0.85} variant={1} />
      <MapTree x={38} y={16} s={0.65} variant={0} />
      <MapTree x={95} y={62} s={0.7} variant={0} />
      <MapTree x={4} y={24} s={0.6} variant={2} />

      {/* Bushes */}
      <Bush x={10} y={40} s={0.8} />
      <Bush x={86} y={30} s={1} />
      <Bush x={55} y={88} s={0.7} />
      <Bush x={35} y={78} s={0.6} />
      <Bush x={78} y={75} s={0.9} />

      {/* Flowers */}
      <Flowers x={30} y={30} colors={['var(--scene-flower-1)', 'var(--scene-flower-2)', 'var(--scene-flower-3)']} />
      <Flowers x={65} y={50} colors={['var(--scene-flower-4)', 'var(--scene-flower-2)', 'var(--scene-flower-1)']} />
      <Flowers x={12} y={55} colors={['var(--scene-flower-2)', 'var(--scene-flower-3)']} />
      <Flowers x={80} y={55} colors={['var(--scene-flower-1)', 'var(--scene-flower-4)']} />
      <Flowers x={45} y={75} colors={['var(--scene-flower-3)', 'var(--scene-flower-1)', 'var(--scene-flower-2)']} />

      {/* Fences */}
      <Fence x={56} y={58} width={50} />
      <Fence x={17} y={58} width={40} />

      {/* Benches */}
      <Bench x={42} y={30} />
      <Bench x={52} y={52} />

      {/* Signpost */}
      <Signpost x={46} y={48} text="VILLAGE" />

      {/* Lamp posts */}
      <LampPost x={35} y={38} />
      <LampPost x={58} y={28} />

      {/* Pond */}
      <Pond x={40} y={33} />

      {/* ── Buildings (ALL interaction preserved) ── */}
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
              filter: isHovered ? `drop-shadow(0 0 15px ${building.awningColor})` : 'drop-shadow(2px 4px 2px rgba(0,0,0,0.2))',
              zIndex: 5,
            }}
            onClick={() => handleBuildingClick(building)}
            onMouseEnter={() => setHoveredBuilding(building.id)}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            {/* Building visual */}
            <div style={{ width: building.w, position: 'relative' }}>
              {/* Chimney */}
              <div style={{ position: 'absolute', top: -12, right: 18, width: 12, height: 18, background: '#a08070', borderRadius: '2px 2px 0 0', zIndex: 1 }}>
                <div style={{ width: '100%', height: 4, background: '#8a6a5a', borderRadius: '2px 2px 0 0' }} />
              </div>

              {/* Roof - triangle shaped */}
              <div style={{
                width: '120%', marginLeft: '-10%', height: 0,
                borderLeft: `${building.w * 0.6}px solid transparent`,
                borderRight: `${building.w * 0.6}px solid transparent`,
                borderBottom: `28px solid ${building.roofColor}`,
                position: 'relative', zIndex: 2,
                filter: isHovered ? `brightness(1.15)` : 'none',
                transition: 'filter 0.3s',
              }}>
              </div>
              {/* Roof overhang shadow */}
              <div style={{ width: '112%', marginLeft: '-6%', height: 4, background: 'rgba(0,0,0,0.12)' }} />

              {/* Wall */}
              <div style={{
                width: '100%', height: building.h,
                background: `linear-gradient(180deg, ${building.wallColor} 0%, color-mix(in srgb, ${building.wallColor} 90%, #000) 100%)`,
                border: '2px solid rgba(0,0,0,0.1)',
                borderTop: 'none',
                position: 'relative',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
              }}>
                {/* Window row */}
                <div style={{ display: 'flex', gap: 6, padding: '8px 8px 4px', justifyContent: 'center' }}>
                  {Array.from({ length: Math.max(2, Math.floor(building.w / 35)) }).map((_, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      {/* Window frame */}
                      <div style={{
                        width: 20, height: 18, background: isHovered ? 'rgba(255,230,130,0.9)' : 'rgba(200,220,240,0.7)',
                        border: '2px solid rgba(0,0,0,0.15)', borderRadius: '2px',
                        transition: 'background 0.4s',
                        boxShadow: isHovered ? '0 0 8px rgba(255,230,130,0.5)' : 'inset 1px 1px 0 rgba(255,255,255,0.4)',
                      }}>
                        {/* Cross pane */}
                        <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', background: 'rgba(0,0,0,0.1)' }} />
                        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 1, background: 'rgba(0,0,0,0.1)' }} />
                        {/* Reflection */}
                        <div style={{ position: 'absolute', top: 2, left: 2, width: 5, height: 4, background: 'rgba(255,255,255,0.4)', borderRadius: '1px' }} />
                      </div>
                      {/* Shutters */}
                      <div style={{ position: 'absolute', left: -4, top: 0, width: 4, height: 18, background: building.awningColor, borderRadius: '2px 0 0 2px', boxShadow: '-1px 0 0 rgba(0,0,0,0.1)' }} />
                      <div style={{ position: 'absolute', right: -4, top: 0, width: 4, height: 18, background: building.awningColor, borderRadius: '0 2px 2px 0', boxShadow: '1px 0 0 rgba(0,0,0,0.1)' }} />
                      {/* Flower box */}
                      <div style={{ marginTop: 2, width: 22, height: 5, background: '#a0785a', borderRadius: '1px', display: 'flex', gap: 3, justifyContent: 'center', paddingTop: 0 }}>
                        <div style={{ width: 4, height: 4, background: 'var(--scene-flower-1)', borderRadius: '50%', marginTop: -3 }} />
                        <div style={{ width: 4, height: 4, background: 'var(--scene-flower-2)', borderRadius: '50%', marginTop: -4 }} />
                        <div style={{ width: 4, height: 4, background: 'var(--scene-flower-1)', borderRadius: '50%', marginTop: -3 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Door with awning */}
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
                  {/* Awning */}
                  <div style={{
                    width: 30, height: 8, marginBottom: -1,
                    background: `repeating-linear-gradient(90deg, ${building.awningColor} 0, ${building.awningColor} 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)`,
                    borderRadius: '3px 3px 0 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }} />
                  {/* Door */}
                  <div style={{
                    width: 20, height: 28, background: '#8B6914', margin: '0 auto',
                    borderRadius: '4px 4px 0 0', border: '2px solid rgba(0,0,0,0.2)',
                    boxShadow: 'inset -2px 0 0 rgba(0,0,0,0.1), inset 2px 0 0 rgba(255,255,255,0.1)',
                    position: 'relative',
                  }}>
                    {/* Door panel */}
                    <div style={{ position: 'absolute', top: 4, left: 3, right: 3, bottom: 10, border: '1px solid rgba(0,0,0,0.1)', borderRadius: '2px' }} />
                    {/* Doorknob */}
                    <div style={{ position: 'absolute', right: 3, top: '55%', width: 3, height: 3, background: '#c8a040', borderRadius: '50%' }} />
                  </div>
                </div>

                {/* Emoji accent */}
                <div style={{ position: 'absolute', bottom: 2, right: 6, fontSize: '1.2rem', opacity: 0.8 }}>
                  {building.emoji}
                </div>
              </div>

              {/* Foundation */}
              <div style={{ width: '104%', marginLeft: '-2%', height: 5, background: '#a09080', borderRadius: '0 0 2px 2px' }} />
            </div>

            {/* Label sign (wood style) */}
            <div style={{
              marginTop: 6, textAlign: 'center',
              background: isHovered ? 'rgba(255,255,255,0.95)' : 'var(--scene-building-1)',
              padding: '4px 10px', borderRadius: '3px',
              border: '2px solid var(--scene-tree-trunk)',
              fontFamily: 'var(--font-pixel)', fontSize: '0.55rem',
              color: '#5a4030', letterSpacing: '1px',
              transition: 'all 0.3s',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              boxShadow: isHovered ? `0 2px 12px rgba(0,0,0,0.2)` : '1px 2px 0 rgba(0,0,0,0.1)',
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
        {/* Shadow */}
        <div style={{
          width: 22, height: 7, background: 'rgba(0,0,0,0.15)',
          borderRadius: '50%', margin: '-2px auto 0',
        }} />
      </div>

      {/* ── Navigation arrival flash (PRESERVED) ── */}
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

      {/* ── Header (PRESERVED) ── */}
      <div style={{
        position: 'absolute', top: '1.5rem', left: '2rem', zIndex: 20,
        fontFamily: 'var(--font-pixel)', fontSize: '0.75rem',
        color: 'var(--pixel-yellow)', letterSpacing: '2px',
        textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
      }}>
        SOLIP'S WORLD
      </div>

      {/* ── Minimap indicator (PRESERVED) ── */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 20,
        fontFamily: 'var(--font-pixel)', fontSize: '0.5rem',
        color: 'var(--pixel-text-dim)', letterSpacing: '1px',
        background: 'var(--pixel-surface)', padding: '6px 12px',
        border: '2px solid var(--pixel-border)', borderRadius: '4px',
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
        @keyframes sparkle {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </motion.div>
  );
};

export default MapHub;
