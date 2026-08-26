import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, Heart } from 'lucide-react';

export function Section42JourneyRecap() {
  const recapItems = [
    { phase: 'Phase 1', symbol: '🪷', label: 'The Dream World Base' },
    { phase: 'Phase 2', symbol: '☁️', label: 'The Cinematic Opening' },
    { phase: 'Phase 3', symbol: '✨', label: '3D Amrita Photo Frame' },
    { phase: 'Phase 4', symbol: '💫', label: 'Soulmate × Soulbound' },
    { phase: 'Phase 5', symbol: '🌟', label: 'Serendipity & Crossing Paths' },
    { phase: 'Phase 6', symbol: '🌸', label: '50 Reasons You Are Special' },
    { phase: 'Phase 7', symbol: '🗝️', label: 'The Secret Dream World' },
    { phase: 'Phase 8', symbol: '✉️', label: 'The Written Letter' },
    { phase: 'Phase 9', symbol: '🌳', label: 'The Memory Tree Sanctuary' },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-6">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Journey Montage
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-gradient-rose glow-text-title mb-8">
            Every Step Led to This Moment
          </h2>
        </MotionWrapper>

        {/* Glowing Memory Montage Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-3 w-full mb-12">
          {recapItems.map((item, idx) => (
            <MotionWrapper key={idx} delay={idx * 0.1} type="scaleUp">
              <div className="glass-panel p-3 rounded-2xl border border-white/80 flex flex-col items-center justify-center text-center shadow-md hover:scale-110 transition-transform">
                <span className="text-3xl mb-1">{item.symbol}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700">{item.phase}</span>
                <span className="text-[10px] font-semibold text-pink-950 truncate max-w-[80px]">{item.label}</span>
              </div>
            </MotionWrapper>
          ))}
        </div>

      </div>
    </section>
  );
}
