import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTimeBasedGreeting } from '../../hooks/useTimeBasedGreeting';
import { TypewriterText } from '../common/TypewriterText';

export function Section01Hero({ onEnter, enterGlow }) {
  const { icon, text, liveTime } = useTimeBasedGreeting();

  const handleEnterClick = () => {
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
    });

    onEnter();
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-10 z-10 text-center select-none">
      
      {/* 1. Time-Based Greeting & Live Clock Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-white/80 border border-pink-200 shadow-md backdrop-blur-md"
      >
        <span className="text-xl animate-pulse">{icon}</span>
        <span className="font-heading font-bold text-xs sm:text-sm text-pink-950 uppercase tracking-wider">
          {text}
        </span>
        <span className="text-pink-300">|</span>
        <div className="flex items-center space-x-1 text-xs font-semibold text-pink-800">
          <Clock size={13} className="text-pink-600" />
          <span>{liveTime}</span>
        </div>
      </motion.div>

      {/* Main Center Composition */}
      <div className="max-w-4xl mx-auto flex flex-col items-center my-auto">
        
        {/* 2. Personal Typewriter Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mb-4"
        >
          <TypewriterText text="Welcome to your little dream world, Amrita. ❤️" />
        </motion.div>

        {/* 3. Hero Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-gradient-rose glow-text-title my-2"
        >
          AMRITA YADAV
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="font-body text-base sm:text-lg md:text-xl text-pink-900/80 font-medium max-w-xl mx-auto mt-2 px-4 leading-relaxed tracking-wide"
        >
          “A little world made for one special soul.”
        </motion.p>

        {/* 4. Upgraded Enter Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-8 sm:mt-10"
        >
          <button
            onClick={handleEnterClick}
            className={`glass-button px-8 py-4 sm:px-10 sm:py-5 rounded-full text-base sm:text-lg font-bold tracking-widest text-pink-950 uppercase flex items-center space-x-3 transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl ${
              enterGlow ? 'ring-4 ring-pink-300 scale-105 shadow-2xl' : ''
            }`}
          >
            <Sparkles className="w-5 h-5 text-pink-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Enter My Little World ✨</span>
          </button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="flex flex-col items-center text-pink-700 text-xs tracking-widest uppercase animate-bounce mt-4"
      >
        <span className="mb-1 font-semibold">Scroll to begin</span>
        <ArrowDown size={16} />
      </motion.div>
    </section>
  );
}
