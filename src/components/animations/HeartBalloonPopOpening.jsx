import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export function HeartBalloonPopOpening({ onComplete }) {
  const [stage, setStage] = useState('float'); // 'float' | 'popping' | 'massPop' | 'finalHeart' | 'done'
  const [balloons, setBalloons] = useState([]);
  const [poppedIds, setPoppedIds] = useState(new Set());
  const [heartParticles, setHeartParticles] = useState([]);

  useEffect(() => {
    // Generate 50 Heart-Shaped Balloons with strings and 3D glossy gradients
    const colors = [
      { top: '#FFF0F5', main: '#FFB6C1', shadow: '#E5A9B4' },
      { top: '#FFFFFF', main: '#FFD1DC', shadow: '#D9889E' },
      { top: '#FFF5F8', main: '#F8C3D3', shadow: '#C9778F' },
      { top: '#FDE8E9', main: '#F9A8D4', shadow: '#DB7093' },
      { top: '#FFF0F5', main: '#FFC0CB', shadow: '#E89BB1' },
    ];

    const initialBalloons = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 92 + 4, // 4vw to 96vw
      startY: Math.random() * 30 + 105, // 105vh to 135vh
      size: Math.random() * 34 + 38, // 38px to 72px
      colorScheme: colors[i % colors.length],
      rotation: Math.random() * 24 - 12,
      duration: Math.random() * 2 + 4.0, // 4s to 6s
      delay: Math.random() * 0.6,
      wave: i < 12 ? 1 : i < 24 ? 2 : i < 34 ? 3 : 4, // Waves 1-3 individual/group, Wave 4 Mass Pop
    }));

    setBalloons(initialBalloons);

    // Timeline Sequence:
    // 0 - 1.5s: Floating upward
    // 1.5s: Wave 1 Pops
    const t1 = setTimeout(() => {
      popWave(1, initialBalloons);
      setStage('popping');
    }, 1500);

    // 2.2s: Wave 2 Pops
    const t2 = setTimeout(() => {
      popWave(2, initialBalloons);
    }, 2200);

    // 2.9s: Wave 3 Pops
    const t3 = setTimeout(() => {
      popWave(3, initialBalloons);
    }, 2900);

    // 3.5s: MASS HEART POP WAVE (Wave 4)
    const t4 = setTimeout(() => {
      setStage('massPop');
      popWave(4, initialBalloons);

      confetti({
        particleCount: 110,
        spread: 120,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#FFB6C1', '#FFD1DC', '#F5E1A4', '#FFF0F5', '#FAFAFA'],
      });
    }, 3500);

    // 4.5s: Final Center Heart Forms & Pulses 2 Times
    const t5 = setTimeout(() => {
      setStage('finalHeart');
    }, 4500);

    // 5.8s: Complete & Remove Overlay
    const t6 = setTimeout(() => {
      setStage('done');
      if (onComplete) onComplete();
    }, 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  const popWave = (waveNumber, allBalloons) => {
    const targetBalloons = allBalloons.filter((b) => b.wave === waveNumber);
    const targetIds = targetBalloons.map((b) => b.id);

    setPoppedIds((prev) => {
      const next = new Set(prev);
      targetIds.forEach((id) => next.add(id));
      return next;
    });

    // Spawn tiny heart particles & sparkles for popped heart balloons
    const newParticles = [];
    targetBalloons.forEach((b) => {
      for (let p = 0; p < 8; p++) {
        newParticles.push({
          id: `${b.id}-${p}-${Date.now()}`,
          x: b.x + (Math.random() * 6 - 3),
          y: 35 + Math.random() * 25,
          color: b.colorScheme.main,
          symbol: p % 3 === 0 ? '❤️' : p % 3 === 1 ? '✨' : '💗',
          vx: (Math.random() - 0.5) * 80,
          vy: (Math.random() - 0.5) * 80,
        });
      }
    });

    setHeartParticles((prev) => [...prev, ...newParticles]);
  };

  if (stage === 'done') return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none">
      {/* 50 Floating Heart-Shaped Balloons with Strings */}
      {stage !== 'finalHeart' &&
        balloons.map((b) => {
          const isPopped = poppedIds.has(b.id);
          const gradId = `balloon-grad-${b.id}`;

          return (
            <div
              key={b.id}
              className={`absolute transition-all duration-300 ${
                isPopped ? 'scale-150 opacity-0 blur-sm' : 'animate-float-up opacity-95'
              }`}
              style={{
                left: `${b.x}%`,
                bottom: `-80px`,
                width: `${b.size}px`,
                height: `${b.size * 1.3}px`,
                animationDuration: `${b.duration}s`,
                animationDelay: `${b.delay}s`,
                transform: `rotate(${b.rotation}deg)`,
              }}
            >
              <svg
                viewBox="0 0 32 44"
                className="w-full h-full filter drop-shadow-lg overflow-visible"
              >
                <defs>
                  {/* 3D Glossy Radial Gradient */}
                  <radialGradient id={gradId} cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor={b.colorScheme.top} />
                    <stop offset="50%" stopColor={b.colorScheme.main} />
                    <stop offset="100%" stopColor={b.colorScheme.shadow} />
                  </radialGradient>
                </defs>

                {/* 1. Actual Heart-Shaped Balloon Body */}
                <path
                  d="M 16 28 C 14.2 26.5 3.5 17.5 3.5 11 C 3.5 6.2 7.2 2.5 12 2.5 C 14.5 2.5 15.8 3.8 16 4.8 C 16.2 3.8 17.5 2.5 20 2.5 C 24.8 2.5 28.5 6.2 28.5 11 C 28.5 17.5 17.8 26.5 16 28 Z"
                  fill={`url(#${gradId})`}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="0.8"
                />

                {/* 2. 3D Glossy Specular Highlight Shine Lobe */}
                <ellipse
                  cx="9.5"
                  cy="7.5"
                  rx="3.5"
                  ry="2.2"
                  fill="rgba(255, 255, 255, 0.75)"
                  transform="rotate(-25 9.5 7.5)"
                />

                {/* 3. Balloon Knot at Bottom Tip */}
                <polygon
                  points="14.5,28 17.5,28 16,30.5"
                  fill={b.colorScheme.shadow}
                />

                {/* 4. Thin Wavy Balloon String */}
                <path
                  d="M 16 30.5 Q 13 36 16 40 T 15 46"
                  fill="none"
                  stroke="rgba(229, 169, 180, 0.75)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          );
        })}

      {/* Tiny Heart & Sparkle Particles from Popped Balloons */}
      {heartParticles.map((sp) => (
        <div
          key={sp.id}
          className="absolute text-sm sm:text-base animate-ping opacity-90 transition-transform duration-500"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            transform: `translate(${sp.vx}px, ${sp.vy}px)`,
          }}
        >
          {sp.symbol}
        </div>
      ))}

      {/* Final Large 3D Heart Formation & Double Pulse */}
      {stage === 'finalHeart' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center animate-scale-pulse-double">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-300/80 rounded-full blur-3xl" />

              {/* Large Glossy 3D Heart */}
              <svg
                viewBox="0 0 32 36"
                className="relative w-36 h-36 sm:w-48 sm:h-48 filter drop-shadow-2xl overflow-visible"
              >
                <defs>
                  <radialGradient id="final-heart-grad" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="45%" stopColor="#FFB6C1" />
                    <stop offset="100%" stopColor="#E5A9B4" />
                  </radialGradient>
                </defs>

                <path
                  d="M 16 28 C 14.2 26.5 3.5 17.5 3.5 11 C 3.5 6.2 7.2 2.5 12 2.5 C 14.5 2.5 15.8 3.8 16 4.8 C 16.2 3.8 17.5 2.5 20 2.5 C 24.8 2.5 28.5 6.2 28.5 11 C 28.5 17.5 17.8 26.5 16 28 Z"
                  fill="url(#final-heart-grad)"
                  stroke="rgba(255, 255, 255, 0.7)"
                  strokeWidth="1"
                />

                <ellipse
                  cx="9.5"
                  cy="7.5"
                  rx="3.5"
                  ry="2.2"
                  fill="rgba(255, 255, 255, 0.85)"
                  transform="rotate(-25 9.5 7.5)"
                />
              </svg>
            </div>

            <span className="font-script text-4xl sm:text-5xl text-pink-800 mt-2 font-bold tracking-wide glow-text-title">
              Amrita Yadav
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
