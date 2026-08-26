import React, { useState } from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export function WordCloud3D({ onSelectWord }) {
  const words = [
    { text: 'I care.', detail: 'Because genuine care does not need to be loud.' },
    { text: 'You matter.', detail: 'More than ordinary words can explain.' },
    { text: 'I notice the little things.', detail: 'Every small habit and quiet laugh.' },
    { text: 'I remember.', detail: 'Certain moments associated with you stay warm.' },
    { text: 'I appreciate you.', detail: 'For simply being you.' },
    { text: 'You make me smile.', detail: 'Even on the quietest days.' },
    { text: 'You feel familiar.', detail: 'Like a home you knew before finding.' },
    { text: "You're important.", detail: 'A special part of this world.' },
    { text: "You're special.", detail: 'Impossible to replicate or replace.' },
    { text: 'Somehow, you became part of my world.', detail: 'And now it feels complete.' },
  ];

  const [selectedWord, setSelectedWord] = useState(null);

  const handleClickWord = (w) => {
    setSelectedWord(w);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4'],
    });
    if (onSelectWord) onSelectWord(w);
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* 3D Floating Word Cloud Grid */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto my-6">
        {words.map((w, idx) => (
          <button
            key={idx}
            onClick={() => handleClickWord(w)}
            className="glass-panel px-5 py-3 rounded-full text-pink-950 font-heading font-semibold text-base sm:text-xl border border-white/80 shadow-md hover:shadow-xl hover:scale-110 hover:border-pink-300 transition-all duration-300 focus:outline-none"
          >
            "{w.text}"
          </button>
        ))}
      </div>

      {/* Selected Word Reflection Card */}
      {selectedWord && (
        <MotionWrapper type="scaleUp" className="mt-4 max-w-md w-full">
          <GlassCard className="p-6 border-2 border-pink-300 bg-white/90 shadow-2xl text-center">
            <span className="font-script text-3xl text-pink-600 block mb-1">
              Words I Never Said
            </span>
            <h3 className="font-heading font-bold text-2xl text-pink-950 mb-2">
              "{selectedWord.text}"
            </h3>
            <p className="font-body text-sm text-pink-800 italic">
              {selectedWord.detail}
            </p>
          </GlassCard>
        </MotionWrapper>
      )}
    </div>
  );
}
