import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart, BookOpen } from 'lucide-react';

export function Section08WhatYouMean({ onOpenJournal }) {
  const lines = [
    { text: 'You are more than a name in my story.', delay: 0.3 },
    { text: 'You became a feeling.', delay: 0.8 },
    { text: 'You became comfort.', delay: 1.3 },
    { text: 'You became someone I genuinely care about.', delay: 1.8 },
  ];

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 py-24 z-10 text-center">
      <div className="max-w-4xl mx-auto w-full">
        
        <MotionWrapper type="fadeIn">
          <div className="flex items-center justify-center space-x-2 text-pink-600 mb-6">
            <Heart size={16} className="fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-800">
              WHAT YOU MEAN TO ME
            </span>
            <Heart size={16} className="fill-pink-300" />
          </div>
        </MotionWrapper>

        <div className="space-y-6 sm:space-y-8">
          {lines.map((line, idx) => (
            <MotionWrapper key={idx} delay={line.delay} type="fadeInUp">
              <GlassCard className="py-6 px-8 max-w-2xl mx-auto border border-white/75">
                <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-pink-950 font-semibold leading-relaxed">
                  "{line.text}"
                </p>
              </GlassCard>
            </MotionWrapper>
          ))}

          {/* Final Emotional Highlight Statement */}
          <MotionWrapper delay={2.3} type="scaleUp">
            <GlassCard className="py-10 px-8 max-w-2xl mx-auto border-2 border-pink-300/80 bg-white/70 shadow-2xl space-y-4">
              <span className="font-script text-3xl sm:text-4xl text-pink-600 block mb-1">
                Amrita
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl text-gradient-rose glow-text-title">
                “Someone I would never want to call ordinary.”
              </h2>

              {/* Phase 18 Journal Trigger Button */}
              {onOpenJournal && (
                <div className="pt-4">
                  <button
                    onClick={onOpenJournal}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2 focus:outline-none"
                  >
                    <BookOpen size={16} />
                    <span>Open My Journal 💌</span>
                  </button>
                </div>
              )}
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
