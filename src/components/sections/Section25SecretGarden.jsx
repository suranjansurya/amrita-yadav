import React, { useState } from 'react';
import { gardenSecretsData } from '../../data/gardenSecretsData';
import { MemoryConstellation3D } from '../3d/MemoryConstellation3D';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section25SecretGarden() {
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [activeSecret, setActiveSecret] = useState(null);

  const handleDiscover = (secret) => {
    if (!discoveredIds.includes(secret.id)) {
      setDiscoveredIds([...discoveredIds, secret.id]);
    }
    setActiveSecret(secret);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4'],
    });
  };

  const isAllFound = discoveredIds.length === 8;

  return (
    <section className="relative min-h-screen w-full px-4 py-24 z-10 text-center select-none">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        
        {/* Garden Section Header & Progress Counter */}
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '5s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              SECRET DISCOVERIES: {discoveredIds.length} / 8
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-pink-950 mb-3">
            The Secret Garden
          </h2>
          <p className="font-body text-sm sm:text-base text-pink-800/80 max-w-md mx-auto mb-8">
            Tap the glowing objects hidden in the garden to unveil their quiet messages.
          </p>
        </MotionWrapper>

        {/* 8 Hidden Interactive Garden Objects */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mb-12">
          {gardenSecretsData.map((sec) => {
            const isFound = discoveredIds.includes(sec.id);

            return (
              <div
                key={sec.id}
                onClick={() => handleDiscover(sec)}
                className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex flex-col items-center justify-center ${
                  isFound
                    ? 'bg-white/90 border-2 border-pink-300 shadow-xl ring-4 ring-pink-100/60'
                    : 'bg-white/50 border border-white/80 hover:bg-white/70 shadow-md animate-pulse'
                }`}
              >
                <span className="text-4xl mb-2 filter drop-shadow-md">{sec.symbol}</span>
                <span className="font-heading font-bold text-sm text-pink-950">{sec.title}</span>
                {isFound && <CheckCircle2 size={16} className="text-pink-600 mt-2" />}
              </div>
            );
          })}
        </div>

        {/* Active Secret Discovery Modal */}
        {activeSecret && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-sm animate-fadeIn">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border-2 border-pink-300 shadow-2xl relative bg-white/95 text-center">
              <button
                onClick={() => setActiveSecret(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200"
              >
                <X size={16} />
              </button>

              <span className="text-5xl block mb-2">{activeSecret.symbol}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 block mb-1">
                {activeSecret.title}
              </span>
              <h3 className="font-heading font-bold text-2xl text-pink-950 mb-3">
                "{activeSecret.message}"
              </h3>
              <p className="font-body text-xs sm:text-sm text-pink-800 leading-relaxed italic">
                {activeSecret.detail}
              </p>
            </div>
          </div>
        )}

        {/* Hidden Message Wall (Revealed when all 8 found) */}
        {isAllFound && (
          <MotionWrapper type="scaleUp" className="w-full max-w-2xl my-8">
            <GlassCard className="p-8 border-2 border-pink-300 bg-white/80 shadow-2xl">
              <span className="font-script text-3xl text-pink-600 block mb-1">
                Every Little Secret Found
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-4xl text-pink-950 mb-2">
                "You found the little things."
              </h3>
              <p className="font-heading font-semibold text-xl text-gradient-rose glow-text-title">
                “But there was always something more.”
              </p>
            </GlassCard>
          </MotionWrapper>
        )}

        {/* Memory Constellation Section */}
        <div className="mt-12 flex flex-col items-center w-full">
          <MotionWrapper type="fadeInUp">
            <h3 className="font-heading font-bold text-3xl sm:text-4xl text-pink-950 mb-4">
              The Memory Constellation
            </h3>
          </MotionWrapper>

          <MotionWrapper delay={0.3} type="scaleUp">
            <MemoryConstellation3D />
          </MotionWrapper>

          <MotionWrapper delay={0.6} type="fadeInUp" className="max-w-xl mx-auto mt-4">
            <GlassCard className="py-4 px-8 border border-white/80">
              <p className="font-heading text-xl sm:text-2xl text-pink-950 font-semibold italic">
                "Some moments become memories... Some memories become part of you."
              </p>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
