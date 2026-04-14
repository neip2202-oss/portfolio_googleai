import React, { useState } from 'react';
import { motion } from 'motion/react';
import introBg from '../assets/intro-bg.png';

interface IntroScreenProps {
  onStart: () => void;
}

type Phase = 'idle' | 'arriving' | 'boarding' | 'departing' | 'exiting';

/* ── Pixel Character ── */
const PixelCharacter: React.FC<{ walking?: boolean; flip?: boolean; style?: React.CSSProperties }> = ({ walking, flip, style }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    transform: flip ? 'scaleX(-1)' : 'scaleX(1)',
    animation: walking ? 'charWalk 0.35s steps(2) infinite' : 'charIdle 2s ease-in-out infinite',
    filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.3))',
    imageRendering: 'pixelated' as any,
    ...style,
  }}>
    {/* Hair with ribbon */}
    <div style={{ width: 24, height: 13, background: '#5D4037', borderRadius: '8px 8px 2px 2px', position: 'relative', border: '2px solid #3a2520' }}>
      <div style={{ position: 'absolute', right: -2, top: 0, width: 8, height: 6, background: '#ff6b8a', borderRadius: '50%', border: '1px solid #d45070' }} />
    </div>
    {/* Face */}
    <div style={{ width: 20, height: 15, background: '#ffddbf', borderRadius: '3px', position: 'relative', border: '2px solid #c9a080', marginTop: -2 }}>
      <div style={{ position: 'absolute', left: 4, top: 4, width: 3, height: 4, background: '#2a1520', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 4, top: 4, width: 3, height: 4, background: '#2a1520', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: 5, top: 4, width: 1, height: 1, background: '#fff', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 5, top: 4, width: 1, height: 1, background: '#fff', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: 1, bottom: 2, width: 5, height: 3, background: 'rgba(255,120,120,0.4)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', right: 1, bottom: 2, width: 5, height: 3, background: 'rgba(255,120,120,0.4)', borderRadius: '50%' }} />
    </div>
    {/* Dress */}
    <div style={{ width: 22, height: 18, background: '#ff8ba7', borderRadius: '3px 3px 6px 6px', position: 'relative', border: '2px solid #d06080', marginTop: -2 }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 10, height: 4, background: '#fff', borderRadius: '0 0 50% 50%', border: '1px solid #ddd' }} />
    </div>
    {/* Shoes */}
    <div style={{ display: 'flex', gap: 4, marginTop: -1 }}>
      <div style={{ width: 7, height: 6, background: '#6d4030', borderRadius: '0 0 3px 3px', border: '1px solid #4a2520' }} />
      <div style={{ width: 7, height: 6, background: '#6d4030', borderRadius: '0 0 3px 3px', border: '1px solid #4a2520' }} />
    </div>
  </div>
);

/* ── Pixel Bus ── */
const PixelBus: React.FC = () => (
  <div style={{ width: 210, height: 110, position: 'relative', filter: 'drop-shadow(3px 4px 2px rgba(0,0,0,0.3))', imageRendering: 'pixelated' as any }}>
    {/* Body */}
    <div style={{
      width: '100%', height: 75, background: 'linear-gradient(180deg, #e8a87c 0%, #c88a60 100%)',
      borderRadius: '8px 8px 3px 3px', position: 'absolute', top: 0,
      border: '3px solid #6a4030',
      boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.15)',
    }}>
      {/* Color stripe */}
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, height: 8, background: 'rgba(255,255,255,0.25)', borderTop: '2px solid rgba(0,0,0,0.1)', borderBottom: '2px solid rgba(0,0,0,0.1)' }} />
      {/* Windows */}
      <div style={{ display: 'flex', gap: 5, padding: '7px 8px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 35, height: 26, background: 'linear-gradient(180deg, #c8e8f8 0%, #a0c8e0 100%)',
            border: '3px solid #4a3020', borderRadius: '3px', position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 6, background: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: '#4a3020' }} />
          </div>
        ))}
      </div>
      {/* Door */}
      <div style={{
        position: 'absolute', right: 14, top: 4, width: 26, height: 62,
        background: 'linear-gradient(180deg, #b0d8e8 0%, #90b8d0 100%)',
        borderRadius: '3px', border: '3px solid #4a3020',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: '#4a3020' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: '#4a3020' }} />
      </div>
      {/* Route label */}
      <div style={{ position: 'absolute', left: 6, bottom: 2, background: '#fff', padding: '1px 5px', borderRadius: '2px', border: '1px solid #4a3020', fontFamily: 'var(--font-pixel)', fontSize: '0.3rem', color: '#4a3020' }}>
        SOLIP
      </div>
      {/* Headlights */}
      <div style={{ position: 'absolute', right: 1, top: 8, width: 6, height: 10, background: '#fde68a', borderRadius: '2px', border: '2px solid #4a3020', boxShadow: '0 0 8px rgba(253,230,138,0.5)' }} />
      <div style={{ position: 'absolute', right: 1, bottom: 12, width: 6, height: 6, background: '#ff8080', borderRadius: '2px', border: '2px solid #4a3020' }} />
    </div>
    {/* Wheels */}
    {[30, null].map((_, i) => (
      <div key={i} style={{
        position: 'absolute', bottom: -2, [i === 0 ? 'left' : 'right']: 28,
        width: 28, height: 28, background: '#333', borderRadius: '50%', border: '3px solid #555',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, background: '#888', borderRadius: '50%', border: '2px solid #666' }} />
      </div>
    ))}
    {/* Bumpers */}
    <div style={{ position: 'absolute', bottom: 6, left: -5, width: 6, height: 16, background: '#999', borderRadius: '3px', border: '2px solid #666' }} />
    <div style={{ position: 'absolute', bottom: 6, right: -5, width: 6, height: 16, background: '#999', borderRadius: '3px', border: '2px solid #666' }} />
    {/* Exhaust pipe */}
    <div style={{ position: 'absolute', bottom: 10, left: -10, width: 8, height: 5, background: '#888', borderRadius: '2px', border: '1px solid #555' }} />
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
      {/* ── Generated pixel art background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${introBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        imageRendering: 'pixelated' as any,
      }} />

      {/* Subtle vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)',
        pointerEvents: 'none',
      }} />

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
            color: '#fff', textShadow: '3px 3px 0 rgba(0,0,0,0.4), 0 0 20px rgba(200,100,200,0.5)',
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
            color: '#fff', textShadow: '4px 4px 0 rgba(0,0,0,0.4), 0 0 30px rgba(100,200,250,0.5)',
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <div style={{
            fontFamily: 'var(--font-pixel)', fontSize: 'clamp(0.6rem, 2vw, 0.9rem)',
            color: 'var(--pixel-yellow)', letterSpacing: '3px',
            animation: 'blink 1.2s ease-in-out infinite',
            textShadow: '0 0 10px rgba(253,224,71,0.6), 2px 2px 0 rgba(0,0,0,0.5)',
          }}>
            ▶ PRESS TO START ◀
          </div>
        </motion.div>
      </div>

      {/* Footer (PRESERVED EXACTLY) */}
      <div style={{
        position: 'absolute', bottom: '1.5%', left: '2%', right: '2%',
        display: 'flex', justifyContent: 'space-between', zIndex: 20,
        opacity: phase === 'idle' ? 0.8 : 0, transition: 'opacity 0.3s',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#fff', textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>LEE SOLIP</div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.45rem', color: 'rgba(255,255,255,0.6)', marginTop: 2, textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}>
            게임의 세상을 넓을 수 있다고 믿는 게임 기획자
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#fff', textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>
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
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </motion.div>
  );
};

export default IntroScreen;
