import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';

export function Section02Welcome() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 py-20 z-10 text-center">
      <div className="max-w-3xl mx-auto w-full">
        <GlassCard className="flex flex-col items-center justify-center p-8 sm:p-14 border border-white/80">
          
          <MotionWrapper delay={0.2} type="fadeInUp">
            <span className="font-script text-3xl sm:text-4xl text-pink-600 mb-3 block">
              Step Into Serenity
            </span>
          </MotionWrapper>

          <MotionWrapper delay={0.5} type="fadeInUp">
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-pink-950 leading-tight mb-4">
              Welcome to your little world.
            </h2>
          </MotionWrapper>

          <MotionWrapper delay={0.9} type="fadeInUp">
            <p className="font-body text-base sm:text-xl text-pink-900/80 font-medium max-w-xl mx-auto mb-8">
              A place made for one special soul.
            </p>
          </MotionWrapper>

          <MotionWrapper delay={1.4} type="scaleUp">
            <div className="relative my-4 inline-block">
              <div className="absolute inset-0 bg-pink-200/60 rounded-full blur-3xl" />
              <h1 className="relative font-heading font-extrabold text-6xl sm:text-8xl md:text-9xl tracking-wider text-gradient-rose glow-text-title px-6 py-2">
                YOU.
              </h1>
            </div>
          </MotionWrapper>

          <MotionWrapper delay={1.8} type="fadeIn">
            <p className="font-script text-2xl sm:text-3xl text-pink-700 mt-6">
              Where every detail whispers your name.
            </p>
          </MotionWrapper>

        </GlassCard>
      </div>
    </section>
  );
}
