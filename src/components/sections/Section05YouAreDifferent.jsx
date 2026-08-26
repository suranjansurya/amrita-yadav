import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles } from 'lucide-react';

export function Section05YouAreDifferent() {
  const statements = [
    { text: 'Your presence feels different.', delay: 0.2 },
    { text: 'Your words stay longer than conversations.', delay: 0.6 },
    { text: 'Being around you feels natural.', delay: 1.0 },
    { text: 'Somehow, you became important.', delay: 1.4 },
    { text: 'Not because you tried to be special.', delay: 1.8 },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center">
      <div className="max-w-4xl mx-auto w-full">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/60 border border-pink-200 shadow-sm mb-6">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Soulbound Connection
            </span>
          </div>
          
          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-gradient-rose glow-text-title mb-12">
            YOU'RE DIFFERENT
          </h2>
        </MotionWrapper>

        {/* 5 Sequential Statements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {statements.map((st, idx) => (
            <MotionWrapper key={idx} delay={st.delay} type="fadeInUp">
              <GlassCard className="p-6 sm:p-8 flex items-center justify-center min-h-[130px] border border-white/80 hover:border-pink-300">
                <p className="font-heading font-semibold text-xl sm:text-2xl text-pink-950 leading-snug">
                  "{st.text}"
                </p>
              </GlassCard>
            </MotionWrapper>
          ))}
        </div>

        {/* Final Visually Powerful Statement */}
        <MotionWrapper delay={2.2} type="scaleUp">
          <GlassCard className="p-8 sm:p-12 border-2 border-pink-300/90 bg-white/70 shadow-2xl">
            <span className="font-script text-3xl sm:text-4xl text-pink-600 block mb-2">
              Amrita
            </span>
            <h2 className="font-heading font-bold text-4xl sm:text-6xl md:text-7xl text-gradient-rose glow-text-title">
              “But because you simply are.”
            </h2>
          </GlassCard>
        </MotionWrapper>

      </div>
    </section>
  );
}
