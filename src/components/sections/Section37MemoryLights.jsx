import React, { useState } from 'react';
import { memoryLightsData } from '../../data/memoryLightsData';
import { MemoryTree3D } from '../3d/MemoryTree3D';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section37MemoryLights() {
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [activeMemory, setActiveMemory] = useState(null);

  const handleDiscoverLight = (mem) => {
    if (!discoveredIds.includes(mem.id)) {
      setDiscoveredIds([...discoveredIds, mem.id]);
    }
    setActiveMemory(mem);

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4'],
    });
  };

  const isAllCollected = discoveredIds.length === 10;

  return (
    <section className="relative min-h-screen w-full px-4 py-24 z-10 text-center select-none">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        
        {/* Header & Tree Progress Counter */}
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '5s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              MEMORY LIGHTS ILLUMINATED: {discoveredIds.length} / 10
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-pink-950 mb-3">
            The Memory Tree
          </h2>
          <p className="font-body text-sm sm:text-base text-pink-800/80 max-w-md mx-auto mb-6">
            Tap the glowing memory lights to send them to the tree.
          </p>
        </MotionWrapper>

        {/* 3D Memory Tree Component Responsive to Light Count */}
        <MotionWrapper delay={0.3} type="scaleUp" className="w-full flex justify-center mb-6">
          <MemoryTree3D lightCount={discoveredIds.length} />
        </MotionWrapper>

        {/* 10 Memory Light Targets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full max-w-4xl mb-8">
          {memoryLightsData.map((mem) => {
            const isFound = discoveredIds.includes(mem.id);

            return (
              <button
                key={mem.id}
                onClick={() => handleDiscoverLight(mem)}
                className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center focus:outline-none ${
                  isFound
                    ? 'bg-white/90 border-2 border-pink-300 shadow-lg ring-2 ring-pink-200'
                    : 'bg-white/50 border border-white/80 hover:bg-white/70 shadow-sm animate-pulse'
                }`}
              >
                <span className="text-2xl mb-1">{mem.symbol}</span>
                <span className="font-heading font-bold text-xs text-pink-950 truncate max-w-[110px]">
                  Memory #{mem.id}
                </span>
                {isFound && <CheckCircle2 size={14} className="text-pink-600 mt-1" />}
              </button>
            );
          })}
        </div>

        {/* Active Memory Modal */}
        {activeMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-sm animate-fadeIn">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border-2 border-pink-300 shadow-2xl relative bg-white/95 text-center">
              <button
                onClick={() => setActiveMemory(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200"
              >
                <X size={16} />
              </button>

              <span className="text-4xl block mb-2">{activeMemory.symbol}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 block mb-1">
                Memory #{activeMemory.id}
              </span>
              <h3 className="font-heading font-bold text-2xl text-pink-950 mb-3">
                "{activeMemory.text}"
              </h3>
            </div>
          </div>
        )}

        {/* Illumination Reveal Statements */}
        {isAllCollected && (
          <MotionWrapper type="scaleUp" className="w-full max-w-2xl my-6">
            <GlassCard className="p-8 border-2 border-pink-300 bg-white/85 shadow-2xl">
              <span className="font-script text-3xl text-pink-600 block mb-1">
                The Tree Fully Illuminates
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-pink-950 mb-2">
                "Maybe memories aren't meant to stay in the past."
              </h3>
              <p className="font-heading font-extrabold text-2xl sm:text-4xl text-gradient-rose glow-text-title">
                “Maybe some become part of who we are.”
              </p>
            </GlassCard>
          </MotionWrapper>
        )}

      </div>
    </section>
  );
}
