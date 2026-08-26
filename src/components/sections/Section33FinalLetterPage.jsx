import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart, Sparkles } from 'lucide-react';

export function Section33FinalLetterPage() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Heart size={14} className="text-pink-600 fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Closing Reflection
            </span>
          </div>
        </MotionWrapper>

        {/* Minimal Final Statements */}
        <div className="space-y-6 max-w-xl mx-auto w-full mb-10">
          <MotionWrapper delay={0.4} type="fadeInUp">
            <p className="font-heading text-xl text-pink-800 italic">
              "One last thing..."
            </p>
          </MotionWrapper>

          <MotionWrapper delay={0.9} type="scaleUp">
            <GlassCard className="py-8 px-10 border-2 border-pink-300/90 bg-white/90 shadow-2xl">
              <span className="font-script text-3xl sm:text-4xl text-pink-600 block mb-2">
                Amrita
              </span>
              <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-gradient-rose glow-text-title">
                “Thank you for being you.”
              </h2>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={1.5} type="fadeInUp">
            <div className="space-y-2 pt-4">
              <p className="font-heading text-2xl text-pink-950 font-semibold">"That's it."</p>
              <p className="font-heading text-2xl text-pink-950 font-bold">"That's everything."</p>
            </div>
          </MotionWrapper>
        </div>

        {/* Secret Handwritten Signature */}
        <MotionWrapper delay={2.1} type="fadeIn">
          <div className="pt-6 border-t border-pink-200/80 max-w-md mx-auto">
            <p className="font-script text-3xl sm:text-4xl text-pink-700 leading-snug">
              Always,<br />
              with a little more care than words can explain.
            </p>
          </div>
        </MotionWrapper>

        {/* Transition to Phase 9 */}
        <MotionWrapper delay={2.7} type="fadeIn" className="mt-12">
          <div className="flex items-center space-x-2 text-pink-800 text-sm font-semibold">
            <Sparkles size={16} className="text-pink-500 animate-spin" style={{ animationDuration: '5s' }} />
            <span>The journey isn't over.</span>
          </div>
        </MotionWrapper>

      </div>
    </section>
  );
}
