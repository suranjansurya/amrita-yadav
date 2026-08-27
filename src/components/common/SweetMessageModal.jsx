import React, { useState, useEffect } from 'react';
import { getRandomSweetMessage, getTodaysMessage } from '../../data/sweetMessagesData';
import { Sparkles, Heart, RefreshCw, X, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SweetMessageModal({ isOpen, onClose }) {
  const [currentMsg, setCurrentMsg] = useState(null);
  const [recentIds, setRecentIds] = useState([]);
  const [isChanging, setIsChanging] = useState(false);
  const [isTodaysMsg, setIsTodaysMsg] = useState(false);

  useEffect(() => {
    if (isOpen && !currentMsg) {
      // Default to Today's Special Message on first open
      const todays = getTodaysMessage();
      setCurrentMsg(todays);
      setRecentIds([todays.id]);
      setIsTodaysMsg(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fetchNextMessage = () => {
    setIsChanging(true);

    // Stardust confetti burst
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
    });

    setTimeout(() => {
      // Retrieve current mood from localStorage if saved in Phase 12
      const localHistory = JSON.parse(localStorage.getItem('amrita_mood_history') || '[]');
      const currentMood = localHistory[0]?.mood || null;

      const next = getRandomSweetMessage({ recentIds, mood: currentMood });
      setCurrentMsg(next);
      setIsTodaysMsg(false);

      setRecentIds((prev) => {
        const nextIds = [...prev, next.id];
        return nextIds.length > 8 ? nextIds.slice(1) : nextIds;
      });

      setIsChanging(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border-2 border-pink-300 shadow-2xl relative bg-white/95 text-center transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Close Message"
        >
          <X size={18} />
        </button>

        {/* Top Header Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-pink-100/80 text-pink-800 text-xs font-bold uppercase tracking-wider mb-4">
          {isTodaysMsg ? (
            <>
              <Calendar size={13} className="text-pink-600" />
              <span>Today's Special Message</span>
            </>
          ) : (
            <>
              <Sparkles size={13} className="text-pink-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>A Sweet Thought For You</span>
            </>
          )}
        </div>

        {/* Floating Message Card */}
        <div className="my-6 min-h-[120px] flex flex-col items-center justify-center">
          <div
            className={`transition-all duration-300 transform ${
              isChanging ? 'scale-90 opacity-0 blur-sm' : 'scale-100 opacity-100'
            }`}
          >
            <div className="relative inline-block mb-3">
              <div className="absolute inset-0 bg-pink-200/80 rounded-full blur-xl animate-pulse" />
              <Heart size={32} className="relative text-pink-500 fill-pink-300 mx-auto" />
            </div>

            <p className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose leading-relaxed px-2">
              "{currentMsg?.text}"
            </p>
          </div>
        </div>

        {/* Action Button: "Another One 💗" */}
        <button
          onClick={fetchNextMessage}
          disabled={isChanging}
          className="w-full py-4 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 focus:outline-none"
        >
          <RefreshCw size={16} className={isChanging ? 'animate-spin' : ''} />
          <span>Another One 💗</span>
        </button>

      </div>
    </div>
  );
}
