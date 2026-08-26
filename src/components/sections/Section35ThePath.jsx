import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { Sparkles, Compass } from 'lucide-react';

export function Section35ThePath() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Compass size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Floating Pathway
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-gradient-rose glow-text-title mb-4">
            Travelling to a Sanctuary
          </h2>

          <p className="font-body text-base sm:text-lg text-pink-800/90 max-w-md mx-auto italic">
            Floating through soft clouds, glowing stars, white lotus petals, and gentle butterflies...
          </p>
        </MotionWrapper>

        <MotionWrapper delay={0.6} type="fadeIn" className="mt-12">
          <div className="flex flex-col items-center space-y-3">
            <span className="text-5xl animate-pulse-glow">🪷</span>
            <div className="w-0.5 h-16 bg-gradient-to-b from-pink-300 via-rose-300 to-transparent rounded-full animate-pulse" />
          </div>
        </MotionWrapper>

      </div>
    </section>
  );
}
