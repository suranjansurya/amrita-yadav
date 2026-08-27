import React from 'react';
import { secretsData } from '../../data/secretsData';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, CheckCircle2, Heart } from 'lucide-react';

export function Section06LittleThings({ onSelectSecret, discoveredIds = [], onOpenSweetMessage }) {
  const progressPercent = Math.round((discoveredIds.length / secretsData.length) * 100);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center">
      <div className="max-w-5xl mx-auto w-full">
        
        <MotionWrapper type="fadeInUp">
          <span className="font-script text-3xl sm:text-4xl text-pink-600 mb-2 block">
            Interactive Garden of Secrets
          </span>
          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-pink-950 mb-4">
            The Little Things
          </h2>
          <p className="font-body text-sm sm:text-base text-pink-800/80 max-w-md mx-auto mb-6">
            Tap the floating symbols in this dream space to unlock hidden messages made just for you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <div className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-full glass-panel border border-white/90 shadow-md">
              <Sparkles size={16} className="text-pink-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-bold uppercase tracking-wider text-pink-950">
                Secrets Discovered: {discoveredIds.length} / {secretsData.length}
              </span>
              <div className="w-16 h-2 bg-pink-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Phase 14 Button: Give Me Something Special ✨ */}
            {onOpenSweetMessage && (
              <button
                onClick={onOpenSweetMessage}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 focus:outline-none"
              >
                <Heart size={14} className="fill-white" />
                <span>Give Me Something Special ✨</span>
              </button>
            )}
          </div>
        </MotionWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {secretsData.map((item, idx) => {
            const isDiscovered = discoveredIds.includes(item.id);

            return (
              <MotionWrapper key={item.id} delay={idx * 0.1} type="fadeInUp">
                <GlassCard
                  onClick={() => onSelectSecret(item.id)}
                  glow={isDiscovered}
                  className="cursor-pointer text-left h-full flex flex-col justify-between group hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl p-3 bg-white/70 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                      {item.symbol}
                    </span>
                    {isDiscovered ? (
                      <span className="inline-flex items-center text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full space-x-1">
                        <CheckCircle2 size={12} />
                        <span>Revealed</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-pink-700 bg-pink-100 px-2.5 py-1 rounded-full animate-pulse">
                        Tap to Unlock
                      </span>
                    )}
                  </div>

                  <div className="mt-6">
                    <h3 className="font-heading font-bold text-xl text-pink-950 group-hover:text-pink-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-pink-700/80 font-medium mt-1">
                      {isDiscovered ? item.tag : 'Hidden Detail'}
                    </p>
                  </div>
                </GlassCard>
              </MotionWrapper>
            );
          })}
        </div>

      </div>
    </section>
  );
}
