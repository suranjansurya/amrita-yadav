import React, { useEffect } from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section13SoulmateXSoulbound() {
  useEffect(() => {
    // Soft burst of pink & white particles when entering section
    const timer = setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1', '#FAFAFA'],
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full glass-panel border border-white/90 shadow-md mb-8">
            <Heart size={16} className="text-pink-600 fill-pink-300 animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-950">
              The Pinnacle Realization
            </span>
            <Heart size={16} className="text-pink-600 fill-pink-300 animate-pulse" />
          </div>
        </MotionWrapper>

        {/* Combined 3D Typography: SOULMATE × SOULBOUND */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 my-6">
          <MotionWrapper delay={0.3} type="fadeInUp">
            <h1 className="font-heading font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-wider text-gradient-rose glow-text-title">
              SOULMATE
            </h1>
          </MotionWrapper>

          <MotionWrapper delay={0.7} type="scaleUp">
            <span className="font-script text-5xl sm:text-6xl text-pink-600 px-4">
              ×
            </span>
          </MotionWrapper>

          <MotionWrapper delay={1.0} type="fadeInUp">
            <h1 className="font-heading font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-wider text-gradient-rose glow-text-title">
              SOULBOUND
            </h1>
          </MotionWrapper>
        </div>

        {/* Text Reveals */}
        <div className="space-y-6 max-w-2xl mx-auto mt-8">
          <MotionWrapper delay={1.5} type="fadeInUp">
            <GlassCard className="py-6 px-10 border border-white/80">
              <p className="font-heading text-2xl sm:text-4xl text-pink-950 font-semibold leading-relaxed">
                "Maybe some connections aren't meant to be explained..."
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={2.1} type="scaleUp">
            <GlassCard className="py-8 px-10 border-2 border-pink-300/90 bg-white/80 shadow-2xl">
              <span className="font-script text-3xl sm:text-4xl text-pink-600 block mb-2">
                Amrita
              </span>
              <h2 className="font-heading font-bold text-4xl sm:text-6xl text-gradient-rose glow-text-title">
                “...only felt.”
              </h2>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
