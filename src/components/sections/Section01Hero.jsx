import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section01Hero({ onEnter, enterGlow }) {
  const handleEnterClick = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
    });

    onEnter();
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-12 z-10 text-center select-none">
      <div />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="font-script text-3xl sm:text-4xl md:text-5xl text-pink-700/90 glow-text-subtle mb-2"
        >
          Welcome to the world of
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-gradient-rose glow-text-title my-2"
        >
          AMRITA YADAV
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="font-body text-base sm:text-lg md:text-xl text-pink-900/80 font-medium max-w-xl mx-auto mt-4 px-4 leading-relaxed tracking-wide"
        >
          “A little world made for one special soul.”
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-10 sm:mt-12"
        >
          <button
            onClick={handleEnterClick}
            className={`glass-button px-8 py-4 sm:px-10 sm:py-5 rounded-full text-base sm:text-lg font-bold tracking-widest text-pink-950 uppercase flex items-center space-x-3 transition-all duration-500 ${
              enterGlow ? 'ring-4 ring-pink-300 scale-105 shadow-2xl' : ''
            }`}
          >
            <Sparkles className="w-5 h-5 text-pink-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>✨ ENTER MY WORLD</span>
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="flex flex-col items-center text-pink-700 text-xs tracking-widest uppercase animate-bounce mt-8"
      >
        <span className="mb-1 font-semibold">Scroll to begin</span>
        <ArrowDown size={16} />
      </motion.div>
    </section>
  );
}
