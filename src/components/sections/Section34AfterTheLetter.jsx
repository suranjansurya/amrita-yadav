import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles } from 'lucide-react';

export function Section34AfterTheLetter() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '5s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Journey Continues
            </span>
          </div>
        </MotionWrapper>

        <div className="space-y-6 max-w-xl mx-auto w-full">
          <MotionWrapper delay={0.4} type="fadeInUp">
            <GlassCard className="py-5 px-8 border border-white/80">
              <p className="font-heading text-2xl sm:text-3xl text-pink-950 font-semibold">
                "The words are over."
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.9} type="fadeInUp">
            <GlassCard className="py-5 px-8 border border-white/80">
              <p className="font-heading text-2xl sm:text-3xl text-pink-950 font-semibold">
                "But the feeling isn't."
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={1.4} type="scaleUp">
            <GlassCard className="py-6 px-10 border-2 border-pink-300/80 bg-white/85 shadow-2xl">
              <span className="font-script text-3xl text-pink-600 block mb-1">
                Amrita
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-5xl text-gradient-rose glow-text-title">
                “There's still one place left.”
              </h2>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
