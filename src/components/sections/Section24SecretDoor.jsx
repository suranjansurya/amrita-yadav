import React, { useState } from 'react';
import { SecretDoor3D } from '../3d/SecretDoor3D';
import { MotionWrapper } from '../animations/MotionWrapper';
import { Sparkles, Key } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section24SecretDoor({ onEnterGarden }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDoor = () => {
    setIsOpen(true);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
    });

    if (onEnterGarden) {
      setTimeout(() => {
        onEnterGarden();
      }, 1500);
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Key size={14} className="text-pink-600" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Hidden Portal
            </span>
          </div>

          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-gradient-rose glow-text-title mb-2">
            "There's still a little world left to discover."
          </h2>

          <p className="font-body text-sm sm:text-base text-pink-800/80 max-w-md mx-auto mb-6">
            "Some things are better found than explained."
          </p>
        </MotionWrapper>

        {/* 3D Rotating Glass Door */}
        <MotionWrapper delay={0.4} type="scaleUp" className="w-full flex justify-center">
          <SecretDoor3D isOpen={isOpen} onOpenDoor={handleOpenDoor} />
        </MotionWrapper>

        {/* Open Button */}
        <MotionWrapper delay={0.8} type="fadeIn">
          <button
            onClick={handleOpenDoor}
            className="mt-6 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 focus:outline-none"
          >
            <Sparkles size={16} />
            <span>✨ OPEN THE SECRET DOOR</span>
          </button>
        </MotionWrapper>

      </div>
    </section>
  );
}
