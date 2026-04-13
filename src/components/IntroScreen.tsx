import React, { useState } from 'react';
import { motion } from 'motion/react';

interface IntroScreenProps {
  onStart: () => void;
}

type Phase = 'idle' | 'arriving' | 'boarding' | 'departing' | 'exiting';

/* ── Upgraded Pixel Character ── */
const PixelCharacter: React.FC<{ walking?: boolean; flip?: boolean; style?: React.CSSProperties }> = ({ walking, flip, style }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    transform: flip ? 'scaleX(-1)' : 'scaleX(1)',
    animation: walking ? 'charWalk 0.35s steps(2) infinite' : 'charIdle 2s ease-in-out infinite',
    filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.25))',
    ...style,
  }}>
    <div style={{ width: 22, height: 12, background: 'var(--scene-char-hair)', borderRadius: '8px 8px 2px 2px', position: 'relative' }}>
      <div style={{ position: 'absolute', right: -1, top: 1, width: 7, height: 5, background: 'var(--scene-flower-1)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: 3, bottom: 0, width: 16, height: 3, background: 'var(--scene-char-hair)', filter: 'brightness(0.85)' }} />
    </div>
    <div style={{ width: 18, height: 14, background: 'var(--scene-char-skin)', borderRadius: '3px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 4, top: 4, width: 3, height: 4, background: '#3a2520', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 4, top: 4, width: 3, height: 4, background: '#3a2520', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: 5, top: 4, width: 1, height: 1, background: '#fff', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 5, top: 4, width: 1, height: 1, background: '#fff', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: 1, bottom: 2, width: 5, height: 3, background: 'rgba(255,150,140,0.45)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 1, bottom: 2, width: 5, height: 3, background: 'rgba(255,150,140,0.45)', borderRadius: '50%' }} />
    </div>
    <div style={{ width: 20, height: 16, background: 'var(--scene-char-dress)', borderRadius: '3px 3px 6px 6px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 10, height: 4, background: '#fff', borderRadius: '0 0 50% 50%' }} />
    </div>
    <div style={{ display: 'flex', gap: 4 }}>
      <div style={{ width: 6, height: 6, background: '#8b6550', borderRadius: '0 0 3px 3px' }} />
      <div style={{ width: 6, height: 6, background: '#8b6550', borderRadius: '0 0 3px 3px' }} />
    </div>
  </div>
);

/* ── Upgraded Pixel Bus ── */
const PixelBus: React.FC = () => (
  <div style={{ width: 200, height: 100, position: 'relative', filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.2))' }}>
    {/* Body */}
    <div style={{
      width: '100%', height: 70, background: 'linear-gradient(180deg, var(--scene-bus) 0%, var(--scene-bus-dark) 100%)',
      borderRadius: '10px 10px 4px 4px', position: 'absolute', top: 0,
      border: '3px solid rgba(0,0,0,0.12)',
      boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.2), inset 0 -4px 0 rgba(0,0,0,0.1)',
    }}>
      {/* Stripe */}
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,0.3)' }} />
      {/* Windows */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 10px', justifyContent: 'flex-start' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 32, height: 24, background: 'rgba(200,230,255,0.85)',
            border: '2px solid rgba(0,0,0,0.1)', borderRadius: '3px',
            boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.4)',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: 3, left: 3, width: 8, height: 5, background: 'rgba(255,255,255,0.4)', borderRadius: '1px' }} />
          </div>
        ))}
      </div>
      {/* Door */}
      <div style={{
        position: 'absolute', right: 16, top: 5, width: 24, height: 56,
        background: 'rgba(200,230,255,0.6)', borderRadius: '4px',
        border: '2px solid rgba(0,0,0,0.1)',
        boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.3)',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.1)' }} />
      </div>
      {/* Route sign */}
      <div style={{
        position: 'absolute', left: 8, bottom: 3,
        background: 'rgba(255,255,255,0.9)', padding: '1px 6px', borderRadius: '2px',
        fontFamily: 'var(--font-pixel)', fontSize: '0.35rem', color: 'var(--scene-bus-dark)',
      }}>
        BUS
      </div>
      {/* Headlights */}
      <div style={{ position: 'absolute', right: 2, top: 10, width: 5, height: 8, background: '#fde68a', borderRadius: '2px', boxShadow: '0 0 6px rgba(253,230,138,0.5)' }} />
      <div style={{ position: 'absolute', right: 2, bottom: 14, width: 5, height: 5, background: '#fca5a5', borderRadius: '2px' }} />
    </div>
    {/* Wheels with hub */}
    {[28, null].map((_, i) => (
      <div key={i} style={{ position: 'absolute', bottom: 0, [i === 0 ? 'left' : 'right']: 28, width: 24, height: 24, background: '#444', borderRadius: '50%', border: '3px solid #666' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 8, height: 8, background: '#888', borderRadius: '50%' }} />
      </div>
    ))}
    {/* Fender/bumpers */}
    <div style={{ position: 'absolute', bottom: 6, left: -3, width: 5, height: 14, background: '#aaa', borderRadius: '3px' }} />
    <div style={{ position: 'absolute', bottom: 6, right: -3, width: 5, height: 14, background: '#aaa', borderRadius: '3px' }} />
    {/* Exhaust */}
    <div style={{ position: 'absolute', bottom: 8, left: -8, width: 6, height: 4, background: '#999', borderRadius: '2px' }} />
  </div>
);

/* ── Fluffy Cloud ── */
const Cloud: React.FC<{ top: string; delay: string; size: number }> = ({ top, delay, size }) => (
  <div style={{
    position: 'absolute', top, animation: `cloudDrift 30s linear infinite`, animationDelay: delay,
  }}>
    <div style={{ width: size, height: size * 0.4, background: 'rgba(255,255,255,0.85)', borderRadius: '50%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -size * 0.15, left: size * 0.2, width: size * 0.4, height: size * 0.35, background: 'rgba(255,255,255,0.85)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: -size * 0.1, right: size * 0.15, width: size * 0.35, height: size * 0.3, background: 'rgba(255,255,255,0.85)', borderRadius: '50%' }} />
    </div>
  </div>
);

/* ── Detailed Tree ── */
const Tree: React.FC<{ left: string; bottom: string; scale?: number; variant?: number }> = ({ left, bottom, scale = 1, variant = 0 }) => (
  <div style={{ position: 'absolute', left, bottom, transform: `scale(${scale})`, transformOrigin: 'bottom center', filter: 'drop-shadow(2px 3px 1px rgba(0,0,0,0.15))' }}>
    {variant === 1 ? (
      <>
        <div style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderBottom: '22px solid var(--scene-tree-dark)', margin: '0 auto', position: 'relative', top: 8 }} />
        <div style={{ width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderBottom: '24px solid var(--scene-tree)', margin: '0 auto', position: 'relative', top: 2 }} />
        <div style={{ width: 8, height: 14, background: 'var(--scene-tree-trunk)', margin: '0 auto', borderRadius: '0 0 2px 2px' }} />
      </>
    ) : (
      <>
        <div style={{ width: 44, height: 36, background: 'var(--scene-tree)', borderRadius: '50% 50% 12% 12%', position: 'relative', top: 5 }}>
          <div style={{ position: 'absolute', width: '80%', height: '40%', top: 3, left: '10%', background: 'var(--scene-tree-light)', borderRadius: '50%', opacity: 0.45 }} />
        </div>
        <div style={{ width: 10, height: 18, background: 'var(--scene-tree-trunk)', margin: '0 auto', borderRadius: '0 0 3px 3px' }} />
      </>
    )}
  </div>
);

/* ── Detailed Building ── */
const SceneBuilding: React.FC<{ left: string; width: number; height: number; bottom: string; wallColor: string; roofColor: string }> = ({ left, width, height, bottom, wallColor, roofColor }) => (
  <div style={{ position: 'absolute', left, bottom, width, filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.15))' }}>
    {/* Roof */}
    <div style={{
      width: '108%', marginLeft: '-4%', height: 0,
      borderLeft: `${width * 0.54}px solid transparent`,
      borderRight: `${width * 0.54}px solid transparent`,
      borderBottom: `22px solid ${roofColor}`,
    }} />
    <div style={{ width: '104%', marginLeft: '-2%', height: 3, background: 'rgba(0,0,0,0.08)' }} />
    {/* Wall */}
    <div style={{
      width: '100%', height, background: wallColor,
      border: '2px solid rgba(0,0,0,0.08)', borderTop: 'none',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
    }}>
      <div style={{ display: 'flex', gap: 5, padding: '6px 5px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Array.from({ length: Math.floor(width / 22) * 2 }).map((_, i) => (
          <div key={i} style={{
            width: 14, height: 12, background: 'rgba(200,220,240,0.6)',
            border: '2px solid rgba(0,0,0,0.08)', borderRadius: '1px',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.3)',
          }}>
            <div style={{ width: 3, height: 3, background: 'rgba(255,255,255,0.4)', margin: '2px', borderRadius: '1px' }} />
          </div>
        ))}
      </div>
      {/* Door */}
      <div style={{
        width: 16, height: 22, background: '#9e7e5a', margin: '0 auto',
        borderRadius: '3px 3px 0 0', border: '2px solid rgba(0,0,0,0.12)',
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.1)',
      }}>
        <div style={{ position: 'absolute', right: 3, top: '50%', width: 2, height: 2, background: '#c8a040', borderRadius: '50%' }} />
      </div>
    </div>
  </div>
);

/* ── Bus Stop with bench ── */
const BusStop: React.FC<{ left: string; bottom: string }> = ({ left, bottom }) => (
  <div style={{ position: 'absolute', left, bottom, zIndex: 5, filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.15))' }}>
    {/* Shelter roof */}
    <div style={{
      width: 58, height: 8,
      background: 'repeating-linear-gradient(90deg, #e07060 0, #e07060 6px, #f0a090 6px, #f0a090 12px)',
      borderRadius: '3px', marginLeft: -8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }} />
    {/* Shelter post */}
    <div style={{ width: 5, height: 38, background: '#999', margin: '0 auto', boxShadow: '1px 0 0 rgba(0,0,0,0.1)' }} />
    {/* Bench */}
    <div style={{ width: 36, height: 4, background: '#c4956a', borderRadius: '2px', marginTop: -10, marginLeft: -5, boxShadow: '0 1px 0 rgba(0,0,0,0.1)' }} />
    {/* Sign */}
    <div style={{
      position: 'absolute', top: 8, left: -12, width: 64, height: 18,
      background: '#5ab87a', borderRadius: '3px', border: '2px solid #4a9a6a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-pixel)', fontSize: '0.3rem', color: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      🚌 BUS STOP
    </div>
  </div>
);

/* ── Billboard ── */
const Billboard: React.FC = () => (
  <div style={{ position: 'absolute', right: '8%', top: '12%', width: 220, height: 130, zIndex: 3 }}>
    {/* Outer frame */}
    <div style={{
      width: '100%', height: '100%', background: '#333',
      border: '5px solid #666', borderRadius: '6px', overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 0 25px rgba(255,139,167,0.25), inset 0 0 15px rgba(0,0,0,0.4), 4px 6px 0 rgba(0,0,0,0.2)',
    }}>
      {/* Pixel frame inner border */}
      <div style={{ position: 'absolute', inset: 3, border: '2px solid #888', borderRadius: '3px', zIndex: 1, pointerEvents: 'none' }} />
      {/* Screen content */}
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, var(--scene-flower-1) 0%, var(--scene-flower-3) 50%, var(--scene-flower-2) 100%)',
        animation: 'billboardGlow 4s ease-in-out infinite alternate',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#fff', textAlign: 'center', lineHeight: 2, textShadow: '1px 1px 0 rgba(0,0,0,0.3)' }}>
          GAME DESIGN<br />PORTFOLIO
        </div>
      </div>
      {/* Scanline effect */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)', pointerEvents: 'none' }} />
    </div>
    {/* Support poles */}
    <div style={{ width: 6, height: 35, background: '#777', position: 'absolute', bottom: -35, left: 30, boxShadow: '1px 0 0 rgba(0,0,0,0.1)' }} />
    <div style={{ width: 6, height: 35, background: '#777', position: 'absolute', bottom: -35, right: 30, boxShadow: '1px 0 0 rgba(0,0,0,0.1)' }} />
  </div>
);

/* ── Flowers ── */
const Flowers: React.FC<{ left: string; bottom: string }> = ({ left, bottom }) => (
  <div style={{ position: 'absolute', left, bottom, display: 'flex', gap: 5, pointerEvents: 'none' }}>
    {['var(--scene-flower-1)', 'var(--scene-flower-2)', 'var(--scene-flower-4)'].map((c, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 6, height: 6, background: c, borderRadius: '50%' }} />
        <div style={{ width: 2, height: 6, background: '#5a9e4e' }} />
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════ */
/* ── Main Intro Screen ── */
/* ── ALL LOGIC PRESERVED EXACTLY ── */
/* ══════════════════════════════════════ */
const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [phase, setPhase] = useState<Phase>('idle');

  const startSequence = () => {
    if (phase !== 'idle') return;
    setPhase('arriving');
    setTimeout(() => setPhase('boarding'), 2200);
    setTimeout(() => setPhase('departing'), 3400);
    setTimeout(() => setPhase('exiting'), 4800);
    setTimeout(onStart, 5500);
  };

  const roadY = '25%';
  const charBottom = '26%';

  const busLeft = (() => {
    switch (phase) {
      case 'idle': return '-220px';
      case 'arriving': return 'calc(30% - 100px)';
      case 'boarding': return 'calc(30% - 100px)';
      case 'departing': case 'exiting': return '110vw';
    }
  })();

  const busTransition = (() => {
    switch (phase) {
      case 'arriving': return 'left 2s cubic-bezier(0.25,0.46,0.45,0.94)';
      case 'departing': case 'exiting': return 'left 1.4s cubic-bezier(0.55,0.06,0.68,0.19)';
      default: return 'none';
    }
  })();

  const charLeft = phase === 'boarding' || phase === 'departing' || phase === 'exiting'
    ? 'calc(30% + 10px)'
    : '42%';

  const charOpacity = phase === 'departing' || phase === 'exiting' ? 0 : 1;
  const isWalking = phase === 'arriving' || phase === 'boarding';
  const charFlip = phase === 'boarding';

  return (
    <motion.div
      style={{
        position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden',
        cursor: phase === 'idle' ? 'pointer' : 'default',
        transition: 'transform 0.7s ease-in',
        transform: phase === 'exiting' ? 'translateX(-100vw)' : 'translateX(0)',
      }}
      onClick={startSequence}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Sky (layered gradient with warm tones) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, var(--scene-sky-top) 0%, var(--scene-sky-mid, var(--scene-sky-bot)) 40%, var(--scene-sky-bot) 62%, var(--scene-ground) 62%, var(--scene-ground-dark) 100%)`,
      }} />

      {/* Grass texture */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%',
        background: `
          radial-gradient(ellipse 2px 5px, rgba(130,190,120,0.2) 0%, transparent 100%) 0 0 / 14px 18px,
          radial-gradient(ellipse 2px 4px, rgba(150,200,130,0.15) 0%, transparent 100%) 7px 9px / 14px 18px
        `,
        pointerEvents: 'none',
      }} />

      {/* Sun */}
      <div style={{
        position: 'absolute', top: '6%', left: '12%', width: 50, height: 50,
        background: 'radial-gradient(circle, #fde68a 40%, rgba(253,230,138,0) 70%)',
        borderRadius: '50%', boxShadow: '0 0 40px rgba(253,230,138,0.4)',
      }} />

      {/* Fluffy Clouds */}
      <Cloud top="6%" delay="0s" size={130} />
      <Cloud top="14%" delay="-10s" size={90} />
      <Cloud top="3%" delay="-20s" size={110} />
      <Cloud top="18%" delay="-5s" size={70} />

      {/* Background buildings */}
      <SceneBuilding left="3%" width={95} height={70} bottom={roadY} wallColor="var(--scene-building-1)" roofColor="var(--scene-roof-1)" />
      <SceneBuilding left="60%" width={115} height={90} bottom={roadY} wallColor="var(--scene-building-4)" roofColor="var(--scene-roof-4)" />
      <SceneBuilding left="82%" width={85} height={65} bottom={roadY} wallColor="var(--scene-building-2)" roofColor="var(--scene-roof-2)" />

      {/* Billboard */}
      <Billboard />

      {/* Trees */}
      <Tree left="-2%" bottom={roadY} scale={0.95} variant={0} />
      <Tree left="50%" bottom={roadY} scale={0.75} variant={1} />
      <Tree left="96%" bottom={roadY} scale={1} variant={0} />
      <Tree left="38%" bottom={roadY} scale={0.6} variant={0} />

      {/* Flowers on ground */}
      <Flowers left="20%" bottom="16%" />
      <Flowers left="55%" bottom="14%" />
      <Flowers left="75%" bottom="18%" />

      {/* Sidewalk */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: `calc(${roadY} + 50px)`, height: 12,
        background: 'var(--scene-sidewalk, #e8ddd0)', borderBottom: '2px solid rgba(0,0,0,0.06)',
      }} />

      {/* Road */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: roadY, height: 50,
        background: 'linear-gradient(180deg, var(--scene-road) 0%, var(--scene-road-edge, var(--scene-road)) 100%)',
        borderTop: '3px solid rgba(0,0,0,0.1)', borderBottom: '3px solid rgba(0,0,0,0.15)',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
      }}>
        {/* Center line dashes */}
        <div style={{
          position: 'absolute', top: '45%', left: 0, right: 0, height: 3,
          background: 'repeating-linear-gradient(90deg, var(--scene-road-line) 0, var(--scene-road-line) 28px, transparent 28px, transparent 48px)',
        }} />
        {/* Road edge lines */}
        <div style={{ position: 'absolute', top: 3, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ position: 'absolute', bottom: 3, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.15)' }} />
      </div>

      {/* Bus Stop */}
      <BusStop left="28%" bottom="calc(25% + 50px)" />

      {/* Character (position logic PRESERVED EXACTLY) */}
      <div style={{
        position: 'absolute', left: charLeft, bottom: charBottom,
        transition: 'left 1s ease-in-out, opacity 0.4s ease',
        opacity: charOpacity, zIndex: 8,
        transform: 'scale(1.8)', transformOrigin: 'bottom center',
      }}>
        <PixelCharacter walking={isWalking} flip={charFlip} />
      </div>

      {/* Bus (position logic PRESERVED EXACTLY) */}
      <div style={{
        position: 'absolute', left: busLeft, bottom: charBottom,
        transition: busTransition, zIndex: 10,
      }}>
        <PixelBus />
      </div>

      {/* Title Overlay (PRESERVED EXACTLY) */}
      <div style={{
        position: 'absolute', top: '10%', left: 0, right: 0, textAlign: 'center', zIndex: 20,
        opacity: phase === 'idle' ? 1 : 0, transition: 'opacity 0.5s',
        pointerEvents: 'none',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div style={{
            fontFamily: 'var(--font-pixel)', fontSize: 'clamp(2rem, 6vw, 4rem)',
            color: '#fff', textShadow: '3px 3px 0 rgba(0,0,0,0.2), 0 0 20px var(--pixel-primary)',
            letterSpacing: '4px',
          }}>
            SOLIP'S
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div style={{
            fontFamily: 'var(--font-pixel)', fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            color: '#fff', textShadow: '4px 4px 0 rgba(0,0,0,0.2), 0 0 30px var(--pixel-accent)',
            letterSpacing: '8px', marginTop: '-0.5rem',
          }}>
            WORLD
          </div>
        </motion.div>
      </div>

      {/* PRESS TO START (PRESERVED EXACTLY) */}
      <div style={{
        position: 'absolute', bottom: '8%', left: 0, right: 0, textAlign: 'center', zIndex: 20,
        opacity: phase === 'idle' ? 1 : 0, transition: 'opacity 0.3s',
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div style={{
            fontFamily: 'var(--font-pixel)', fontSize: 'clamp(0.6rem, 2vw, 0.9rem)',
            color: 'var(--pixel-yellow)', letterSpacing: '3px',
            animation: 'blink 1.2s ease-in-out infinite',
            textShadow: 'var(--pixel-glow-gold)',
          }}>
            PRESS TO START
          </div>
        </motion.div>
      </div>

      {/* Footer (PRESERVED EXACTLY) */}
      <div style={{
        position: 'absolute', bottom: '1.5%', left: '2%', right: '2%',
        display: 'flex', justifyContent: 'space-between', zIndex: 20,
        opacity: phase === 'idle' ? 0.7 : 0, transition: 'opacity 0.3s',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#fff' }}>LEE SOLIP</div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.45rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            게임의 세상을 넓을 수 있다고 믿는 게임 기획자
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#fff' }}>
          GAME DESIGN PORTFOLIO
        </div>
      </div>

      {/* CSS Keyframes (PRESERVED EXACTLY) */}
      <style>{`
        @keyframes charWalk {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes charIdle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes cloudDrift {
          from { transform: translateX(-150px); }
          to { transform: translateX(calc(100vw + 150px)); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes billboardGlow {
          0% { filter: brightness(0.85) hue-rotate(0deg); }
          100% { filter: brightness(1.15) hue-rotate(25deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default IntroScreen;
