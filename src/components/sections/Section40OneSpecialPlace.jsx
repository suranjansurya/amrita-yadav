import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart } from 'lucide-react';

export function Section40OneSpecialPlace() {
  const lines = [
    { text: "Everyone has a place in someone's story.", delay: 0.3 },
    { text: 'Some people get a paragraph.', delay: 0.8 },
    { text: 'Some get a chapter.', delay: 1.3 },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Heart size={14} className="text-pink-600 fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Story Itself
            </span>
          </div>
        </MotionWrapper>

        <div className="space-y-5 max-w-2xl mx-auto w-full">
          {lines.map((line, idx) => (
            <MotionWrapper key={idx} delay={line.delay} type="fadeInUp">
              <GlassCard className="py-5 px-8 border border-white/80">
                <p className="font-heading text-2xl sm:text-3xl text-pink-950 font-semibold leading-relaxed">
                  "{line.text}"
                </p>
              </GlassCard>
            </MotionWrapper>
          ))}

          <MotionWrapper delay={1.8} type="fadeInUp">
            <p className="font-heading text-xl text-pink-800 italic">
              "And some..."
            </p>
          </MotionWrapper>

          <MotionWrapper delay={2.3} type="scaleUp">
            <GlassCard className="py-8 px-10 border-2 border-pink-300/90 bg-white/85 shadow-2xl">
              <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-gradient-rose glow-text-title mb-2">
                “...become part of the story itself.”
              </h2>
              <span className="font-script text-4xl sm:text-5xl text-pink-700 block mt-2">
                Amrita.
              </span>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
