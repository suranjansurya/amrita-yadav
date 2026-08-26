import React, { useState } from 'react';
import { Envelope3D } from '../3d/Envelope3D';
import { MotionWrapper } from '../animations/MotionWrapper';
import { Sparkles, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section28LetterEntrance({ onOpenLetter }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4'],
    });

    if (onOpenLetter) {
      setTimeout(() => {
        onOpenLetter();
      }, 1400);
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Mail size={14} className="text-pink-600" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              A Private Message
            </span>
          </div>

          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-gradient-rose glow-text-title mb-2">
            "A letter I never knew how to write."
          </h2>

          <p className="font-body text-sm sm:text-base text-pink-800/80 max-w-md mx-auto mb-6">
            "So I made you a little world instead."
          </p>
        </MotionWrapper>

        {/* 3D Envelope */}
        <MotionWrapper delay={0.4} type="scaleUp" className="w-full flex justify-center">
          <Envelope3D isOpen={isOpen} onOpenEnvelope={handleOpenEnvelope} />
        </MotionWrapper>

        {/* Open Button */}
        <MotionWrapper delay={0.8} type="fadeIn">
          <button
            onClick={handleOpenEnvelope}
            className="mt-6 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 focus:outline-none"
          >
            <Sparkles size={16} />
            <span>OPEN THE LETTER</span>
          </button>
        </MotionWrapper>

      </div>
    </section>
  );
}
