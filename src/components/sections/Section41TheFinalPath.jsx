import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section41TheFinalPath({ onContinueToPhase10 }) {
  const handleContinue = () => {
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4'],
    });

    if (onContinueToPhase10) {
      onContinueToPhase10();
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '5s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Gateway Ahead
            </span>
          </div>
        </MotionWrapper>

        {/* Text Reveals */}
        <div className="space-y-6 max-w-2xl mx-auto w-full mb-10">
          <MotionWrapper delay={0.4} type="fadeInUp">
            <GlassCard className="py-6 px-10 border border-white/80">
              <p className="font-heading text-3xl sm:text-4xl text-pink-950 font-bold">
                "One last thing remains."
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.9} type="scaleUp">
            <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-gradient-rose glow-text-title">
              “Are you ready?”
            </h2>
          </MotionWrapper>
        </div>

        {/* CONTINUE Button */}
        <MotionWrapper delay={1.5} type="fadeIn">
          <button
            onClick={handleContinue}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-base uppercase tracking-widest shadow-2xl hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 focus:outline-none"
          >
            <span>CONTINUE</span>
            <Sparkles size={18} />
          </button>
        </MotionWrapper>

      </div>
    </section>
  );
}
