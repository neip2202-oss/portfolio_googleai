import React, { useState } from 'react';
import { motion } from 'motion/react';

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
    ...style,
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

/* ── Pixel Bus ── */
const PixelBus: React.FC = () => (
  <div style={{ width: 200, height: 100, position: 'relative' }}>
    {/* Body */}
    <div style={{
      width: '100%', height: 70, background: 'var(--scene-bus)', borderRadius: '8px 8px 4px 4px',
      position: 'absolute', top: 0, border: '3px solid rgba(0,0,0,0.15)',
      boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.15)',
    }}>
      {/* Windows */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 10px', justifyContent: 'flex-start' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 32, height: 24, background: 'rgba(200,230,255,0.8)',
            border: '2px solid rgba(0,0,0,0.1)', borderRadius: '2px',
          }} />
        ))}
      </div>
      {/* Door */}
      <div style={{
        position: 'absolute', right: 18, top: 6, width: 22, height: 55,
        background: 'rgba(200,230,255,0.5)', borderRadius: '3px', border: '2px solid rgba(0,0,0,0.1)',
      }} />
      {/* Route sign */}
      <div style={{
        position: 'absolute', left: 10, bottom: 4, fontFamily: 'var(--font-pixel)',
        fontSize: '0.4rem', color: '#fff', letterSpacing: '1px',
      }}>
        BUS
      </div>
    </div>
    {/* Wheels */}
    <div style={{ position: 'absolute', bottom: 0, left: 28, width: 22, height: 22, background: '#333', borderRadius: '50%', border: '3px solid #555' }} />
    <div style={{ position: 'absolute', bottom: 0, right: 28, width: 22, height: 22, background: '#333', borderRadius: '50%', border: '3px solid #555' }} />
    {/* Bumpers */}
    <div style={{ position: 'absolute', bottom: 8, left: -4, width: 6, height: 12, background: '#888', borderRadius: '2px' }} />
    <div style={{ position: 'absolute', bottom: 8, right: -4, width: 6, height: 12, background: '#888', borderRadius: '2px' }} />
  </div>
);

/* ── Cloud ── */
const Cloud: React.FC<{ top: string; delay: string; size: number }> = ({ top, delay, size }) => (
  <div style={{
    position: 'absolute', top, width: size, height: size * 0.5,
    background: 'rgba(255,255,255,0.6)', borderRadius: '50%',
    animation: `cloudDrift 25s linear infinite`, animationDelay: delay,
    filter: 'blur(2px)',
  }} />
);

/* ── Tree ── */
const Tree: React.FC<{ left: string; bottom: string; scale?: number }> = ({ left, bottom, scale = 1 }) => (
  <div style={{ position: 'absolute', left, bottom, transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>
    <div style={{ width: 40, height: 35, background: 'var(--scene-tree)', borderRadius: '50% 50% 10% 10%', position: 'relative', top: 5 }} />
    <div style={{ width: 10, height: 18, background: 'var(--scene-tree-trunk)', margin: '0 auto', borderRadius: '0 0 3px 3px' }} />
  </div>
);

/* ── Building ── */
const Building: React.FC<{ left: string; width: number; height: number; bottom: string; roofColor?: string }> = ({ left, width, height, bottom, roofColor }) => (
  <div style={{ position: 'absolute', left, bottom, width }}>
    <div style={{ width: '100%', height: 15, background: roofColor || 'var(--scene-roof)', borderRadius: '4px 4px 0 0' }} />
    <div style={{ width: '100%', height, background: 'var(--scene-building)', border: '2px solid rgba(0,0,0,0.1)' }}>
      {/* Windows */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Array.from({ length: Math.floor(width / 25) * 2 }).map((_, i) => (
          <div key={i} style={{ width: 14, height: 12, background: 'rgba(255,220,100,0.6)', border: '1px solid rgba(0,0,0,0.1)' }} />
        ))}
      </div>
    </div>
  </div>
);

/* ── Bus Stop ── */
const BusStop: React.FC<{ left: string; bottom: string }> = ({ left, bottom }) => (
  <div style={{ position: 'absolute', left, bottom, zIndex: 5 }}>
    {/* Roof */}
    <div style={{ width: 50, height: 8, background: '#e74c3c', borderRadius: '3px 3px 0 0', marginLeft: -5 }} />
    {/* Pole */}
    <div style={{ width: 6, height: 40, background: '#888', margin: '0 auto' }} />
    {/* Sign */}
    <div style={{
      position: 'absolute', top: 8, left: -8, width: 56, height: 16,
      background: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-pixel)', fontSize: '0.3rem', color: '#fff',
    }}>
      BUS STOP
    </div>
  </div>
);

/* ── Billboard (Video) ── */
const Billboard: React.FC = () => (
  <div style={{
    position: 'absolute', right: '8%', top: '15%', width: 220, height: 130, zIndex: 3,
  }}>
    {/* Frame */}
    <div style={{
      width: '100%', height: '100%', background: '#222', border: '4px solid #555',
      borderRadius: '4px', overflow: 'hidden', position: 'relative',
      boxShadow: '0 0 30px rgba(255,107,203,0.3), inset 0 0 20px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, var(--pixel-primary) 0%, var(--pixel-accent) 50%, var(--pixel-yellow) 100%)',
        animation: 'billboardGlow 4s ease-in-out infinite alternate',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#fff', textAlign: 'center', lineHeight: 2 }}>
          GAME DESIGN<br />PORTFOLIO
        </div>
      </div>
    </div>
    {/* Support poles */}
    <div style={{ width: 6, height: 30, background: '#555', position: 'absolute', bottom: -30, left: 30 }} />
    <div style={{ width: 6, height: 30, background: '#555', position: 'absolute', bottom: -30, right: 30 }} />
  </div>
);

/* ══════════════════════════════════════ */
/* ── Main Intro Screen ── */
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
      {/* Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, var(--scene-sky-top) 0%, var(--scene-sky-bot) 65%, var(--scene-ground) 65%, var(--scene-ground-dark) 100%)`,
      }} />

      {/* Clouds */}
      <Cloud top="8%" delay="0s" size={120} />
      <Cloud top="15%" delay="-8s" size={80} />
      <Cloud top="5%" delay="-16s" size={100} />

      {/* Background buildings */}
      <Building left="5%" width={90} height={70} bottom={roadY} roofColor="#c0392b" />
      <Building left="62%" width={110} height={85} bottom={roadY} roofColor="#8e44ad" />
      <Building left="80%" width={80} height={60} bottom={roadY} roofColor="#27ae60" />

      {/* Billboard */}
      <Billboard />

      {/* Trees */}
      <Tree left="-1%" bottom={roadY} scale={0.9} />
      <Tree left="52%" bottom={roadY} scale={0.7} />
      <Tree left="95%" bottom={roadY} scale={1} />

      {/* Road */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: roadY, height: 50,
        background: 'var(--scene-road)', borderTop: '3px solid rgba(0,0,0,0.2)',
        borderBottom: '3px solid rgba(0,0,0,0.2)',
      }}>
        {/* Road dashes */}
        <div style={{
          position: 'absolute', top: '45%', left: 0, right: 0, height: 3,
          background: 'repeating-linear-gradient(90deg, var(--scene-road-line) 0, var(--scene-road-line) 30px, transparent 30px, transparent 50px)',
        }} />
      </div>

      {/* Bus Stop */}
      <BusStop left="28%" bottom="calc(25% + 50px)" />

      {/* Character */}
      <div style={{
        position: 'absolute', left: charLeft, bottom: charBottom,
        transition: 'left 1s ease-in-out, opacity 0.4s ease',
        opacity: charOpacity, zIndex: 8,
        transform: 'scale(1.8)', transformOrigin: 'bottom center',
      }}>
        <PixelCharacter walking={isWalking} flip={charFlip} />
      </div>

      {/* Bus */}
      <div style={{
        position: 'absolute', left: busLeft, bottom: charBottom,
        transition: busTransition, zIndex: 10,
      }}>
        <PixelBus />
      </div>

      {/* Title Overlay */}
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
            color: '#fff', textShadow: '3px 3px 0 rgba(0,0,0,0.3), 0 0 20px var(--pixel-primary)',
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
            color: '#fff', textShadow: '4px 4px 0 rgba(0,0,0,0.3), 0 0 30px var(--pixel-accent)',
            letterSpacing: '8px', marginTop: '-0.5rem',
          }}>
            WORLD
          </div>
        </motion.div>
      </div>

      {/* PRESS TO START */}
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

      {/* Footer */}
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

      {/* CSS Keyframes (injected via style tag) */}
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
          0% { filter: brightness(0.8) hue-rotate(0deg); }
          100% { filter: brightness(1.2) hue-rotate(30deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default IntroScreen;
