import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart, Sparkles } from 'lucide-react';

export function Section21ReasonsHero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper delay={0.3} type="fadeIn">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Heart size={14} className="text-pink-600 fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              50 Little Pieces of Appreciation
            </span>
          </div>
        </MotionWrapper>

        {/* Large 3D Title: 50 REASONS */}
        <MotionWrapper delay={0.6} type="scaleUp">
          <div className="relative my-4 inline-block">
            <div className="absolute inset-0 bg-pink-200/60 rounded-full blur-3xl" />
            <h1 className="relative font-heading font-extrabold text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-wider text-gradient-rose glow-text-title px-4 py-2">
              50 REASONS
            </h1>
          </div>
        </MotionWrapper>

        <MotionWrapper delay={1.0} type="fadeInUp">
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-pink-950 mb-6">
            Why you're so special.
          </h2>
        </MotionWrapper>

        {/* Sequential Intro Cards */}
        <div className="space-y-4 max-w-xl mx-auto w-full">
          <MotionWrapper delay={1.4} type="fadeInUp">
            <GlassCard className="py-4 px-8 border border-white/80">
              <p className="font-heading text-xl sm:text-2xl text-pink-900 font-medium">
                "Not because you're perfect..."
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={1.9} type="scaleUp">
            <GlassCard className="py-6 px-10 border-2 border-pink-300/80 bg-white/80 shadow-xl">
              <span className="font-script text-3xl text-pink-600 block mb-1">
                Amrita
              </span>
              <h3 className="font-heading font-bold text-3xl sm:text-5xl text-gradient-rose glow-text-title">
                “But because you're you.”
              </h3>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
