import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, Heart } from 'lucide-react';

export function Section10Soulmate() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        {/* Soft Script Accent */}
        <MotionWrapper delay={0.3} type="fadeIn">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Heart size={14} className="text-pink-600 fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              A Quiet Sanctuary
            </span>
          </div>
        </MotionWrapper>

        {/* Large 3D Typography: SOULMATE */}
        <MotionWrapper delay={0.6} type="scaleUp">
          <div className="relative my-4 inline-block">
            <div className="absolute inset-0 bg-pink-200/60 rounded-full blur-3xl" />
            <h1 className="relative font-heading font-extrabold text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-wider text-gradient-rose glow-text-title px-4 py-2">
              SOULMATE
            </h1>
          </div>
        </MotionWrapper>

        {/* Subtitle */}
        <MotionWrapper delay={1.1} type="fadeInUp">
          <GlassCard className="py-5 px-8 max-w-xl mx-auto border border-white/80 mt-4">
            <p className="font-heading text-2xl sm:text-4xl text-pink-950 font-semibold italic">
              "The person who feels like home."
            </p>
          </GlassCard>
        </MotionWrapper>

        <MotionWrapper delay={1.6} type="fadeIn">
          <p className="font-script text-2xl sm:text-3xl text-pink-700 mt-8">
            Where calm replacing chaos is the only rule.
          </p>
        </MotionWrapper>

      </div>
    </section>
  );
}
