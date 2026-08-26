import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart } from 'lucide-react';

export function Section45FinalMessage() {
  const lines = [
    { text: "I don't know if words can ever completely explain what someone means.", delay: 0.3 },
    { text: 'Sometimes a person simply becomes special.', delay: 0.8 },
    { text: 'Not because of one perfect moment... But because of hundreds of small ones.', delay: 1.3 },
    { text: 'Every conversation. Every smile. Every little memory. Every moment that somehow stayed.', delay: 1.8 },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <span className="font-script text-4xl text-pink-700 block mb-4">
            Amrita,
          </span>
        </MotionWrapper>

        <div className="space-y-5 max-w-2xl mx-auto w-full">
          {lines.map((line, idx) => (
            <MotionWrapper key={idx} delay={line.delay} type="fadeInUp">
              <GlassCard className="py-5 px-8 border border-white/80">
                <p className="font-heading text-xl sm:text-3xl text-pink-950 font-semibold leading-relaxed">
                  "{line.text}"
                </p>
              </GlassCard>
            </MotionWrapper>
          ))}

          {/* Climax Statement */}
          <MotionWrapper delay={2.3} type="scaleUp">
            <GlassCard className="py-8 px-10 border-2 border-pink-300/90 bg-white/85 shadow-2xl">
              <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-gradient-rose glow-text-title">
                “And somewhere along the way... You became genuinely important.”
              </h2>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
