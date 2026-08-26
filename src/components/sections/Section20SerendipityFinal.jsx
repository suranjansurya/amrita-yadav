import React, { useState } from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section20SerendipityFinal() {
  const [discoveredSecrets, setDiscoveredSecrets] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);

  const serendipitySecrets = [
    {
      id: 'star-unplanned',
      symbol: '⭐',
      title: 'The Unplanned Star',
      message: 'Some of the best things in life are the ones we never planned.',
    },
    {
      id: 'crystal-sky',
      symbol: '🔮',
      title: 'The Same Sky',
      message: 'Two journeys that started separately, now walking the same sky.',
    },
    {
      id: 'petal-joy',
      symbol: '🌸',
      title: 'Unexpected Joy',
      message: 'Serendipity is finding joy you were never looking for.',
    },
  ];

  const handleDiscover = (item) => {
    if (!discoveredSecrets.includes(item.id)) {
      setDiscoveredSecrets([...discoveredSecrets, item.id]);
    }
    setActiveMessage(item.message);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4'],
    });
  };

  const finalLines = [
    { text: 'Some paths are meant to cross.', delay: 0.3 },
    { text: 'Some crossings are meant to be remembered.', delay: 0.8 },
    { text: 'Some connections simply feel different.', delay: 1.3 },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        {/* Hidden Interactive Star / Crystal Triggers */}
        <MotionWrapper type="fadeInUp">
          <span className="font-script text-3xl sm:text-4xl text-pink-600 mb-2 block">
            Hidden Whispers of Serendipity
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-pink-950 mb-6">
            Tap to Reveal Secret Reflections
          </h2>

          <div className="flex items-center justify-center space-x-6 mb-8">
            {serendipitySecrets.map((item) => {
              const isFound = discoveredSecrets.includes(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => handleDiscover(item)}
                  className={`p-4 rounded-full transition-all duration-300 transform hover:scale-125 focus:outline-none ${
                    isFound ? 'bg-white/90 ring-2 ring-pink-300 shadow-lg' : 'bg-white/50 animate-bounce'
                  }`}
                  title={item.title}
                >
                  <span className="text-3xl filter drop-shadow-md">{item.symbol}</span>
                </button>
              );
            })}
          </div>

          {activeMessage && (
            <div className="glass-panel p-4 rounded-2xl max-w-md mx-auto mb-10 border border-pink-200 shadow-md animate-fadeIn">
              <p className="font-heading text-lg text-pink-950 font-semibold italic">
                "{activeMessage}"
              </p>
            </div>
          )}
        </MotionWrapper>

        {/* Final Phase 5 Lines */}
        <div className="space-y-6 max-w-2xl mx-auto w-full mt-6">
          {finalLines.map((line, idx) => (
            <MotionWrapper key={idx} delay={line.delay} type="fadeInUp">
              <GlassCard className="py-5 px-8 border border-white/80">
                <p className="font-heading text-2xl sm:text-3xl text-pink-950 font-semibold leading-relaxed">
                  "{line.text}"
                </p>
              </GlassCard>
            </MotionWrapper>
          ))}

          {/* Blooming White Lotus Ending */}
          <MotionWrapper delay={1.9} type="scaleUp">
            <div className="pt-8 flex flex-col items-center">
              <span className="text-6xl animate-pulse-glow mb-3 select-none">🪷</span>
              <p className="font-script text-3xl text-pink-700">
                Serendipity × Amrita Yadav
              </p>
            </div>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
