import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart } from 'lucide-react';

export function Section49FinalDedication() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        {/* Title: FOR AMRITA */}
        <MotionWrapper type="scaleUp">
          <div className="relative my-4 inline-block">
            <div className="absolute inset-0 bg-pink-300/70 rounded-full blur-3xl" />
            <h1 className="relative font-heading font-extrabold text-6xl sm:text-8xl md:text-9xl tracking-wider text-gradient-rose glow-text-title px-4 py-2">
              FOR AMRITA
            </h1>
          </div>
        </MotionWrapper>

        {/* Dedication Subtitle */}
        <MotionWrapper delay={0.4} type="fadeInUp">
          <p className="font-heading text-xl sm:text-2xl text-pink-900 font-semibold mb-6">
            "With all the little things that make you, you."
          </p>
        </MotionWrapper>

        <MotionWrapper delay={0.8} type="fadeInUp">
          <GlassCard className="py-6 px-10 border border-white/80 max-w-xl mx-auto mb-10">
            <p className="font-heading text-2xl sm:text-3xl text-pink-950 font-bold italic">
              "Always special. Always unforgettable. Always you."
            </p>
          </GlassCard>
        </MotionWrapper>

        {/* Final Cherished Lines */}
        <div className="space-y-4 max-w-xl mx-auto w-full mb-10">
          <MotionWrapper delay={1.4} type="fadeInUp">
            <p className="font-heading text-xl text-pink-900">"Some people are met."</p>
          </MotionWrapper>

          <MotionWrapper delay={1.9} type="fadeInUp">
            <p className="font-heading text-xl text-pink-900">"Some people are remembered."</p>
          </MotionWrapper>

          <MotionWrapper delay={2.4} type="scaleUp">
            <GlassCard className="py-8 px-10 border-2 border-pink-300/90 bg-white/90 shadow-2xl">
              <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-gradient-rose glow-text-title">
                “And some... are simply cherished.”
              </h2>
              <span className="font-script text-4xl sm:text-5xl text-pink-700 block mt-2">
                Amrita.
              </span>
            </GlassCard>
          </MotionWrapper>
        </div>

        {/* Personal Handwritten Signature */}
        <MotionWrapper delay={3.0} type="fadeIn">
          <div className="pt-6 border-t border-pink-200/80 max-w-md mx-auto flex flex-col items-center">
            <p className="font-script text-3xl sm:text-4xl text-pink-800 leading-snug">
              Made especially for you. ❤️
            </p>
            <span className="font-body text-xs uppercase font-bold tracking-widest text-pink-700 mt-1">
              — with care
            </span>
          </div>
        </MotionWrapper>

      </div>
    </section>
  );
}
