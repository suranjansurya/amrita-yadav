import React, { useState } from 'react';
import { feelingsData } from '../../data/feelingsData';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Mail } from 'lucide-react';

export function Section04TheFeeling({ onOpenOpenWhen }) {
  const [activeCardId, setActiveCardId] = useState(null);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10">
      <div className="max-w-6xl mx-auto w-full text-center">
        
        <MotionWrapper type="fadeInUp">
          <span className="font-script text-3xl sm:text-4xl text-pink-600 mb-2 block">
            Essence of Connection
          </span>
          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-pink-950 mb-4">
            The Feelings You Inspire
          </h2>
          <p className="font-body text-sm sm:text-base text-pink-800/80 max-w-lg mx-auto mb-8">
            Tap or hover over each element to discover what spending time in your warmth feels like.
          </p>

          {/* Phase 19 Trigger Button: Open When... 💌 */}
          {onOpenOpenWhen && (
            <div className="mb-10">
              <button
                onClick={onOpenOpenWhen}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2 focus:outline-none"
              >
                <Mail size={14} />
                <span>Open When... 💌</span>
              </button>
            </div>
          )}
        </MotionWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {feelingsData.map((item, idx) => {
            const isActive = activeCardId === item.id;

            return (
              <MotionWrapper key={item.id} delay={idx * 0.15} type="fadeInUp">
                <GlassCard
                  onClick={() => setActiveCardId(isActive ? null : item.id)}
                  onMouseEnter={() => setActiveCardId(item.id)}
                  glow={isActive}
                  className="cursor-pointer text-left h-full flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl p-2.5 bg-white/70 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-pink-700/80 bg-pink-100/60 px-3 py-1 rounded-full">
                        {item.subtitle}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-2xl sm:text-3xl text-pink-950 mb-2 group-hover:text-pink-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-4 border-t border-pink-200/50">
                    <p className="font-body text-sm sm:text-base text-pink-900/90 leading-relaxed italic">
                      "{item.description}"
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
