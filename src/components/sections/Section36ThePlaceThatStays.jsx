import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart, Sparkles } from 'lucide-react';

export function Section36ThePlaceThatStays() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Heart size={14} className="text-pink-600 fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Dream Sanctuary
            </span>
          </div>
        </MotionWrapper>

        {/* Large 3D Title: THE PLACE THAT STAYS */}
        <MotionWrapper delay={0.4} type="scaleUp">
          <div className="relative my-4 inline-block">
            <div className="absolute inset-0 bg-pink-200/60 rounded-full blur-3xl" />
            <h1 className="relative font-heading font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-wider text-gradient-rose glow-text-title px-4 py-2">
              THE PLACE THAT STAYS
            </h1>
          </div>
        </MotionWrapper>

        <MotionWrapper delay={0.8} type="fadeInUp">
          <GlassCard className="py-5 px-8 max-w-xl mx-auto border border-white/80 mt-2">
            <p className="font-heading text-2xl sm:text-3xl text-pink-950 font-semibold italic">
              "Somewhere between a memory and a feeling."
            </p>
          </GlassCard>
        </MotionWrapper>

        <MotionWrapper delay={1.2} type="fadeIn">
          <div className="mt-8 flex items-center space-x-2 text-pink-700 font-script text-3xl">
            <Sparkles size={18} className="text-pink-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Where memories blossom into stardust.</span>
          </div>
        </MotionWrapper>

      </div>
    </section>
  );
}
