import React from 'react';
import { PhotoFrame3D } from '../3d/PhotoFrame3D';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart, Sparkles } from 'lucide-react';

export function Section26SecretGardenCenter() {
  const lines = [
    { text: 'Some people become special quietly.', delay: 0.3 },
    { text: 'Not in one moment.', delay: 0.8 },
    { text: 'But in many little moments.', delay: 1.3 },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Heart size={15} className="text-pink-600 fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Garden Pedestal
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-gradient-rose glow-text-title mb-2">
            AMRITA YADAV
          </h2>

          <p className="font-body text-sm sm:text-base text-pink-800/80 max-w-md mx-auto mb-6">
            Floating inside the quiet heart of the Secret Garden.
          </p>
        </MotionWrapper>

        {/* Reusable 3D Rotating Photo Frame */}
        <MotionWrapper delay={0.4} type="scaleUp" className="w-full flex justify-center mb-6">
          <PhotoFrame3D
            image="/images/amrita.jpg"
            autoRotate={true}
            frameStyle="rounded"
            rotationSpeed={0.15}
            showControls={true}
          />
        </MotionWrapper>

        {/* Story Text Reveals */}
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

          {/* Highlight Climax Line */}
          <MotionWrapper delay={1.8} type="scaleUp">
            <GlassCard className="py-8 px-10 border-2 border-pink-300/90 bg-white/85 shadow-2xl">
              <span className="font-script text-3xl sm:text-4xl text-pink-600 block mb-2">
                Amrita
              </span>
              <h2 className="font-heading font-bold text-4xl sm:text-6xl text-gradient-rose glow-text-title">
                “And somehow... they become impossible to call ordinary.”
              </h2>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
