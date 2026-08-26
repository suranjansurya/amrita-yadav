import React, { useState } from 'react';
import { unsentCardsData } from '../../data/unsentCardsData';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Heart, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section31UnsentWords() {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (card) => {
    setActiveCard(card);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4'],
    });
  };

  return (
    <section className="relative min-h-screen w-full px-4 py-24 z-10 text-center select-none">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Heart size={14} className="text-pink-600 fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              Unsent Thoughts
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-pink-950 mb-3">
            Cards Never Sent
          </h2>
          <p className="font-body text-sm sm:text-base text-pink-800/80 max-w-md mx-auto mb-10">
            Tap a card to open an unsent thought written for Amrita.
          </p>
        </MotionWrapper>

        {/* Grid of 8 Unsent Word Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {unsentCardsData.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="group p-6 rounded-3xl cursor-pointer bg-white/60 hover:bg-white/90 border border-white/80 hover:border-pink-300 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between min-h-[160px] backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-pink-700 bg-pink-100 px-3 py-0.5 rounded-full">
                  {card.number}
                </span>
                <Sparkles size={14} className="text-pink-400 group-hover:animate-spin" />
              </div>

              <p className="font-heading font-semibold text-base sm:text-lg text-pink-950 mt-4 leading-snug">
                "{card.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Opened Unsent Card Modal */}
        {activeCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-sm animate-fadeIn">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl max-w-md w-full border-2 border-pink-300 shadow-2xl relative bg-white/95 text-center">
              <button
                onClick={() => setActiveCard(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200"
              >
                <X size={16} />
              </button>

              <span className="font-heading font-bold text-sm text-pink-600 bg-pink-100 px-3 py-1 rounded-full mb-3 inline-block">
                Thought #{activeCard.number}
              </span>

              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-pink-950 mb-4 leading-relaxed">
                "{activeCard.text}"
              </h3>

              <p className="font-script text-2xl text-pink-700">
                Created with care for Amrita
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
