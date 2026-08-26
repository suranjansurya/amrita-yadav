import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles } from 'lucide-react';

export function Section47SoulmateCallback() {
  const lines = [
    { text: 'Some connections are simply felt.', delay: 0.3 },
    { text: 'Some people simply feel like home.', delay: 0.8 },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              SOULMATE × SOULBOUND
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

          <MotionWrapper delay={1.4} type="scaleUp">
            <GlassCard className="py-8 px-10 border-2 border-pink-300/80 bg-white/85 shadow-2xl">
              <span className="font-script text-3xl sm:text-4xl text-pink-600 block mb-1">
                Amrita
              </span>
              <h3 className="font-heading font-bold text-3xl sm:text-5xl text-gradient-rose glow-text-title">
                “Somewhere between coincidence and connection... you became someone special.”
              </h3>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
