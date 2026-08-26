import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ReasonCard3D({ reason, isDiscovered, onDiscover }) {
  const handleClick = () => {
    if (!isDiscovered) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4'],
      });
    }
    onDiscover(reason);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative p-5 rounded-2xl cursor-pointer select-none transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${
        isDiscovered
          ? 'bg-white/85 border-2 border-pink-300 shadow-xl backdrop-blur-md ring-4 ring-pink-100/60'
          : 'bg-white/50 border border-white/80 shadow-md hover:bg-white/70 hover:shadow-lg backdrop-blur-sm'
      }`}
    >
      {/* Number Badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`font-heading font-extrabold text-lg px-3 py-0.5 rounded-full ${
            isDiscovered
              ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm'
              : 'bg-pink-200/70 text-pink-950 font-bold'
          }`}
        >
          {reason.number}
        </span>

        {isDiscovered ? (
          <CheckCircle2 size={18} className="text-pink-600 fill-pink-100" />
        ) : (
          <Sparkles size={16} className="text-pink-400 group-hover:animate-spin" />
        )}
      </div>

      {/* Title */}
      <h3 className="font-heading font-bold text-lg sm:text-xl text-pink-950 mb-1 leading-snug">
        {reason.title}
      </h3>

      {/* Message Reveal */}
      <p
        className={`font-body text-xs sm:text-sm text-pink-900/90 leading-relaxed transition-opacity duration-300 ${
          isDiscovered ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
        }`}
      >
        "{reason.message}"
      </p>
    </div>
  );
}
