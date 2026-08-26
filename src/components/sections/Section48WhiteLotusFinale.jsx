import React, { useEffect } from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section48WhiteLotusFinale() {
  useEffect(() => {
    // Grand stardust confetti burst for the lotus finale
    const timer = setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1', '#FAFAFA'],
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        {/* Blooming White Lotus Symbol */}
        <MotionWrapper type="scaleUp">
          <div className="relative my-6 flex flex-col items-center">
            <div className="absolute inset-0 bg-pink-200/80 rounded-full blur-3xl" />
            <span className="relative text-8xl sm:text-9xl animate-pulse-glow mb-4 select-none filter drop-shadow-2xl">
              🪷
            </span>
            <div className="flex items-center space-x-2 text-pink-700 font-script text-3xl sm:text-4xl">
              <Sparkles size={20} className="text-pink-500 animate-spin" style={{ animationDuration: '5s' }} />
              <span>The Blooming Lotus Finale</span>
            </div>
          </div>
        </MotionWrapper>

      </div>
    </section>
  );
}
