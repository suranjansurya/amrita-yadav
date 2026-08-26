import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart } from 'lucide-react';

export function Section43EverythingLeadsHere() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Heart size={14} className="text-pink-600 fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Singular Focus
            </span>
          </div>
        </MotionWrapper>

        <div className="space-y-6 max-w-xl mx-auto w-full">
          <MotionWrapper delay={0.4} type="fadeInUp">
            <p className="font-heading text-2xl sm:text-3xl text-pink-950 font-semibold italic">
              "All of this..."
            </p>
          </MotionWrapper>

          <MotionWrapper delay={0.9} type="fadeInUp">
            <GlassCard className="py-5 px-8 border border-white/80">
              <p className="font-heading text-2xl sm:text-4xl text-pink-950 font-bold">
                "...was made for one person."
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={1.5} type="scaleUp">
            <div className="relative my-4 inline-block">
              <div className="absolute inset-0 bg-pink-300/70 rounded-full blur-3xl" />
              <h1 className="relative font-heading font-extrabold text-7xl sm:text-9xl md:text-[11rem] tracking-wider text-gradient-rose glow-text-title px-4 py-2">
                AMRITA
              </h1>
            </div>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
