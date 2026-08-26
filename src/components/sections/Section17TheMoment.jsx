import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart } from 'lucide-react';

export function Section17TheMoment() {
  const lines = [
    { text: 'Some connections are not forced. They simply happen.', delay: 0.3 },
    { text: 'Some people arrive unexpectedly...', delay: 0.8 },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeIn">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Heart size={14} className="text-pink-600 fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              UNEXPECTED HARMONY
            </span>
          </div>
        </MotionWrapper>

        <div className="space-y-6 max-w-2xl mx-auto w-full">
          {lines.map((line, idx) => (
            <MotionWrapper key={idx} delay={line.delay} type="fadeInUp">
              <GlassCard className="py-6 px-8 border border-white/80">
                <p className="font-heading text-2xl sm:text-3xl text-pink-950 font-semibold leading-relaxed">
                  "{line.text}"
                </p>
              </GlassCard>
            </MotionWrapper>
          ))}

          {/* Highlight Statement */}
          <MotionWrapper delay={1.4} type="scaleUp">
            <GlassCard className="py-8 px-10 border-2 border-pink-300/80 bg-white/70 shadow-2xl">
              <span className="font-script text-3xl sm:text-4xl text-pink-600 block mb-2">
                Amrita
              </span>
              <h2 className="font-heading font-bold text-4xl sm:text-6xl text-gradient-rose glow-text-title">
                “...and somehow become important.”
              </h2>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
