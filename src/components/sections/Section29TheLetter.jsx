import React, { useState } from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section29TheLetter() {
  const [activeKeyword, setActiveKeyword] = useState(null);

  const keywordExplanations = {
    important: 'Because some people simply become important.',
    little: 'Because the smallest moments can mean the most.',
    different: 'Because not everyone feels the same.',
    special: 'Because some people cannot be replaced.',
    care: "Because genuine care doesn't need to be loud.",
  };

  const handleKeywordClick = (word) => {
    setActiveKeyword({ word, text: keywordExplanations[word] });
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.5 } });
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 select-none">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Letter Container Paper */}
        <MotionWrapper type="scaleUp">
          <GlassCard className="p-8 sm:p-12 border-2 border-pink-200 bg-white/95 shadow-2xl rounded-3xl relative text-left">
            
            {/* Header / Salutation */}
            <div className="border-b border-pink-200/80 pb-4 mb-6">
              <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-gradient-rose glow-text-title">
                Dear Amrita,
              </h2>
            </div>

            {/* Letter Body Paragraphs */}
            <div className="space-y-4 font-heading text-lg sm:text-2xl text-pink-950 leading-relaxed font-semibold">
              <p>
                Maybe I don't always know how to put certain feelings into words.
              </p>
              
              <p>
                Some people become{' '}
                <span
                  onClick={() => handleKeywordClick('important')}
                  className="underline decoration-pink-400 decoration-2 cursor-pointer hover:text-pink-600 transition-colors"
                >
                  important
                </span>{' '}
                slowly.
              </p>

              <p>
                Not because of one big moment, but because of many{' '}
                <span
                  onClick={() => handleKeywordClick('little')}
                  className="underline decoration-pink-400 decoration-2 cursor-pointer hover:text-pink-600 transition-colors"
                >
                  little
                </span>{' '}
                ones.
              </p>

              <p className="italic text-pink-900/90 pl-4 border-l-2 border-pink-300">
                A conversation here. A smile there. A random moment that somehow stays.
              </p>

              <p>
                And before you realize it, someone has quietly become a special part of your world.
              </p>

              <p>
                That's what makes you{' '}
                <span
                  onClick={() => handleKeywordClick('different')}
                  className="underline decoration-pink-400 decoration-2 cursor-pointer hover:text-pink-600 transition-colors"
                >
                  different
                </span>
                .
              </p>

              <p>
                You don't have to do anything extraordinary to matter.
              </p>

              <p className="font-bold text-pink-950">
                You simply being you is already enough to make a difference.
              </p>

              <p>
                And if I ever fail to say it properly, I hope this little world says it for me.
              </p>

              <p className="text-2xl sm:text-3xl text-gradient-rose font-extrabold pt-2">
                You are genuinely{' '}
                <span
                  onClick={() => handleKeywordClick('special')}
                  className="underline decoration-pink-400 decoration-2 cursor-pointer hover:text-pink-600 transition-colors"
                >
                  special
                </span>
                .
              </p>
            </div>

            {/* Sign-off */}
            <div className="mt-8 pt-6 border-t border-pink-200/80 flex items-center justify-between">
              <span className="font-script text-3xl text-pink-700">
                — From someone who{' '}
                <span
                  onClick={() => handleKeywordClick('care')}
                  className="underline decoration-pink-400 cursor-pointer"
                >
                  cares
                </span>
              </span>
              <Heart size={20} className="text-pink-600 fill-pink-300" />
            </div>

          </GlassCard>
        </MotionWrapper>

        {/* Keyword Interactive Reflection Modal */}
        {activeKeyword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-sm animate-fadeIn">
            <div className="glass-panel p-6 rounded-3xl max-w-md w-full border-2 border-pink-300 shadow-2xl relative bg-white/95 text-center">
              <button
                onClick={() => setActiveKeyword(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200"
              >
                <X size={16} />
              </button>

              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 block mb-1">
                Reflective Keyword
              </span>
              <h3 className="font-heading font-bold text-3xl text-pink-950 mb-3 capitalize">
                "{activeKeyword.word}"
              </h3>
              <p className="font-body text-base text-pink-900 leading-relaxed italic">
                "{activeKeyword.text}"
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
