import React, { useState, useEffect } from 'react';
import { gardenDiscoveriesData } from '../../data/gardenDiscoveriesData';
import { Sparkles, Heart, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function GardenDiscoveryToast({ activeDiscovery, onDismiss, discoveredList = [] }) {
  const [completeRewardShown, setCompleteRewardShown] = useState(false);

  const totalCount = gardenDiscoveriesData.length;
  const currentCount = discoveredList.length;
  const isComplete = currentCount >= totalCount;

  useEffect(() => {
    if (isComplete && !completeRewardShown) {
      setCompleteRewardShown(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
      });
    }
  }, [isComplete, completeRewardShown]);

  return (
    <>
      {/* 1. Subtle Discovery Counter Indicator Pill */}
      <div className="fixed top-6 right-6 z-30 select-none">
        <div className="glass-panel px-4 py-2 rounded-full border border-pink-200 shadow-md bg-white/80 flex items-center space-x-2 text-xs font-bold text-pink-950">
          <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>✨ {currentCount} / {totalCount} little discoveries</span>
        </div>
      </div>

      {/* 2. Active Discovery Message Toast */}
      {activeDiscovery && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 animate-fadeIn select-none">
          <div className="glass-panel p-5 rounded-3xl border-2 border-pink-300 shadow-2xl bg-white/95 text-center relative">
            <button
              onClick={onDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none"
            >
              <X size={14} />
            </button>

            <span className="text-3xl block mb-1">{activeDiscovery.symbol}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-pink-600 block mb-1">
              {activeDiscovery.name}
            </span>
            <p className="font-heading font-bold text-base text-pink-950">
              "{activeDiscovery.message}"
            </p>
          </div>
        </div>
      )}

      {/* 3. Final Complete Discovery Reward Banner */}
      {isComplete && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-scaleUp select-none">
          <div className="glass-panel px-6 py-3 rounded-full border-2 border-pink-300 shadow-xl bg-white/95 text-center flex items-center space-x-2">
            <Heart size={16} className="text-pink-600 fill-pink-400 animate-pulse" />
            <span className="font-heading font-bold text-sm text-pink-950">
              You found all the little surprises. ❤️
            </span>
          </div>
        </div>
      )}
    </>
  );
}
