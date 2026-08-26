import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart } from 'lucide-react';

export function Section46MostImportantMessage() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Heart size={14} className="text-pink-600 fill-pink-300 animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Emotional Peak
            </span>
          </div>
        </MotionWrapper>

        <div className="space-y-6 max-w-2xl mx-auto w-full">
          <MotionWrapper delay={0.4} type="fadeInUp">
            <GlassCard className="py-6 px-10 border border-white/80">
              <p className="font-heading text-2xl sm:text-4xl text-pink-950 font-bold">
                "You're not just a part of this little world."
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={1.1} type="scaleUp">
            <GlassCard className="py-10 px-10 border-2 border-pink-300/90 bg-white/90 shadow-2xl">
              <span className="font-script text-4xl text-pink-600 block mb-2">
                Amrita
              </span>
              <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-gradient-rose glow-text-title">
                “You are the reason I created it.”
              </h1>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
