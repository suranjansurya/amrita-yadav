import React from 'react';
import { WordCloud3D } from '../3d/WordCloud3D';
import { MotionWrapper } from '../animations/MotionWrapper';
import { Sparkles } from 'lucide-react';

export function Section30WordsINeverSaid() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '5s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-950">
              UNSPOKEN FEELINGS
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-pink-950 mb-2">
            WORDS I NEVER SAID
          </h2>

          <p className="font-body text-sm sm:text-base text-pink-800/80 max-w-md mx-auto mb-8">
            "Some things are easier to feel than to say." Tap any phrase to reveal its meaning.
          </p>
        </MotionWrapper>

        {/* 3D Floating Word Cloud */}
        <MotionWrapper delay={0.4} type="scaleUp" className="w-full">
          <WordCloud3D />
        </MotionWrapper>

      </div>
    </section>
  );
}
