import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section27FinalSecretReveal({ onExitGarden }) {
  const handleContinue = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4'],
    });

    if (onExitGarden) {
      onExitGarden();
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Secret World Unveiled
            </span>
          </div>
        </MotionWrapper>

        {/* Text Reveals */}
        <div className="space-y-6 max-w-2xl mx-auto w-full mb-10">
          <MotionWrapper delay={0.4} type="fadeInUp">
            <GlassCard className="py-6 px-10 border border-white/80">
              <p className="font-heading text-3xl sm:text-4xl text-pink-950 font-bold">
                "You found the secret world."
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.9} type="fadeInUp">
            <p className="font-heading text-xl text-pink-800 italic">
              "But maybe..."
            </p>
          </MotionWrapper>

          <MotionWrapper delay={1.4} type="scaleUp">
            <GlassCard className="py-8 px-10 border-2 border-pink-300/90 bg-white/85 shadow-2xl">
              <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-gradient-rose glow-text-title">
                “You were always meant to find it.”
              </h2>
            </GlassCard>
          </MotionWrapper>
        </div>

        {/* Secret Exit Button */}
        <MotionWrapper delay={2.0} type="fadeIn">
          <button
            onClick={handleContinue}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 focus:outline-none"
          >
            <span>Continue the journey</span>
            <ArrowRight size={16} />
          </button>
        </MotionWrapper>

      </div>
    </section>
  );
}
