import React from 'react';
import { MotionWrapper } from '../animations/MotionWrapper';
import { RotateCcw, Sparkles } from 'lucide-react';

export function Section50FinalControls() {
  const handleReplay = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleStayHere = () => {
    // Keep user in final view smoothly
  };

  return (
    <section className="relative py-16 w-full flex flex-col items-center justify-center px-4 z-10 text-center select-none">
      <MotionWrapper type="fadeInUp" className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleReplay}
          className="px-8 py-3.5 rounded-full bg-white/80 hover:bg-white text-pink-950 font-bold text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 border border-pink-200 focus:outline-none"
        >
          <RotateCcw size={16} />
          <span>Replay the Journey ↺</span>
        </button>

        <button
          onClick={handleStayHere}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2 focus:outline-none"
        >
          <Sparkles size={16} />
          <span>Stay Here ✨</span>
        </button>
      </MotionWrapper>
    </section>
  );
}
