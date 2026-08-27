import React, { useState, useEffect } from 'react';
import { fetchSurprisePool, saveUserFavoriteMemory, saveUserActivity } from '../../lib/supabase';
import { Gift, Sparkles, X, Heart, Music, MessageCircle, Moon, Zap, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SurpriseMeModal({ isOpen, onClose, currentUser, audioState }) {
  const [pool, setPool] = useState({ jarMemories: [], timelineMemories: [], latestHeart: null });
  const [currentSurprise, setCurrentSurprise] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [lastSurpriseType, setLastSurpriseType] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSurprisePool();
    }
  }, [isOpen]);

  const loadSurprisePool = async () => {
    setIsLoading(true);
    try {
      const pData = await fetchSurprisePool(currentUser?.userId || 'usr-amritayadav');
      setPool(pData);
      triggerNewSurprise(pData);
    } catch (e) {
      console.warn('[SurpriseMeModal] Load pool error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerNewSurprise = (dataPool = pool) => {
    setIsAnimating(true);
    setSaveMsg('');
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          generateSurprise(dataPool);
          setIsAnimating(false);
          return 0;
        }
        return prev - 1;
      });
    }, 400);
  };

  const generateSurprise = (dataPool) => {
    const types = ['sweet', 'quote', 'hug', 'explosion', 'music', 'secret', 'comfort'];
    if (dataPool.timelineMemories.length > 0) types.push('memory');
    if (dataPool.jarMemories.length > 0) types.push('jar');

    let chosenType = types[Math.floor(Math.random() * types.length)];
    if (chosenType === lastSurpriseType && types.length > 1) {
      const filtered = types.filter((t) => t !== lastSurpriseType);
      chosenType = filtered[Math.floor(Math.random() * filtered.length)];
    }
    setLastSurpriseType(chosenType);

    let surpriseObj = null;

    if (chosenType === 'sweet') {
      surpriseObj = {
        type: 'sweet',
        badge: '💌 Sweet Message',
        icon: <MessageCircle className="text-pink-500" size={24} />,
        title: 'A Little Sweet Note ❤️',
        message: 'You have a gentle way of bringing warmth into every room you enter. Never lose your sparkle. ✨',
      };
    } else if (chosenType === 'memory' && dataPool.timelineMemories.length > 0) {
      const mem = dataPool.timelineMemories[Math.floor(Math.random() * dataPool.timelineMemories.length)];
      surpriseObj = {
        type: 'memory',
        badge: '❤️ Memory',
        icon: <Heart className="text-rose-500 fill-rose-400" size={24} />,
        title: mem.title,
        message: mem.short_description || mem.full_description,
        extraDate: mem.memory_date,
      };
    } else if (chosenType === 'jar' && dataPool.jarMemories.length > 0) {
      const jar = dataPool.jarMemories[Math.floor(Math.random() * dataPool.jarMemories.length)];
      surpriseObj = {
        type: 'jar',
        badge: '🫙 Memory Jar',
        icon: <Sparkles className="text-amber-500" size={24} />,
        title: jar.title,
        message: jar.message,
      };
    } else if (chosenType === 'quote') {
      const quotes = [
        '“Some souls make the world a gentler place just by being in it.”',
        '“You are capable of creating magic in the quietest moments.”',
        '“Soft hearts hold the greatest strength.”',
      ];
      surpriseObj = {
        type: 'quote',
        badge: '🌸 Beautiful Quote',
        icon: <Smile className="text-pink-500" size={24} />,
        title: 'Thought for You 🌸',
        message: quotes[Math.floor(Math.random() * quotes.length)],
      };
    } else if (chosenType === 'hug') {
      surpriseObj = {
        type: 'hug',
        badge: '🤗 Digital Hug',
        icon: <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={24} />,
        title: 'Warm Digital Hug 🤗',
        message: 'Sending you the biggest, coziest digital hug right across the sky. Hold on tight! ❤️',
      };
    } else if (chosenType === 'explosion') {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFB6C1', '#FF69B4', '#FFC0CB', '#E6E6FA'],
      });
      surpriseObj = {
        type: 'explosion',
        badge: '✨ Heart Explosion',
        icon: <Zap className="text-amber-400 fill-amber-300" size={24} />,
        title: 'Sparkle Burst! ✨',
        message: 'A sudden burst of love and sparkles just to make you smile today! 🌸🥰',
      };
    } else if (chosenType === 'music') {
      if (audioState && !audioState.isPlaying) {
        audioState.togglePlay();
      }
      surpriseObj = {
        type: 'music',
        badge: '🎵 Music Moment',
        icon: <Music className="text-purple-500" size={24} />,
        title: 'Mere Nishan Playing 🎵',
        message: 'Let this soft melody wrap around your thoughts and bring you peace. 🎵❤️',
      };
    } else if (chosenType === 'comfort') {
      surpriseObj = {
        type: 'comfort',
        badge: '🌙 Comfort Message',
        icon: <Moon className="text-indigo-400" size={24} />,
        title: 'Restful Peace 🌙',
        message: 'Take a slow, deep breath... let go of whatever felt heavy today. You are doing great. ❤️',
      };
    } else {
      surpriseObj = {
        type: 'secret',
        badge: '🔐 Secret Message',
        icon: <Sparkles className="text-pink-500" size={24} />,
        title: 'Secret Little Note 🔐',
        message: 'This little world was built with so much care just to remind you how special you are. ✨',
      };
    }

    setCurrentSurprise(surpriseObj);

    // Track total surprises opened in localStorage
    const uId = currentUser?.userId || 'usr-amritayadav';
    const sCount = Number(localStorage.getItem(`amrita_surprise_count_${uId}`) || '0') + 1;
    localStorage.setItem(`amrita_surprise_count_${uId}`, sCount.toString());

    // Phase 32 Activity Tracking
    saveUserActivity({
      event_type: 'surprise_opened',
      title: '🎁 Opened Surprise',
      description: `Opened: ${surpriseObj.badge}`,
      metadata: {
        question: 'Surprise Opened',
        answer: `${surpriseObj.badge} • ${surpriseObj.title}: ${surpriseObj.message}`,
      },
      user_id: uId,
    });
  };

  const handleSaveFavorite = async () => {
    if (!currentSurprise) return;
    try {
      await saveUserFavoriteMemory({
        user_id: currentUser?.userId || 'usr-amritayadav',
        memory_id: `surp-${Date.now()}`,
        memory_data: {
          title: currentSurprise.title,
          short_description: currentSurprise.message,
          category: currentSurprise.badge,
        },
      });
      setSaveMsg('Saved to your favorites ❤️');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      console.warn('[SurpriseMeModal] Save favorite error:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-pink-950 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Back to My World"
        >
          <X size={18} />
        </button>

        <div className="space-y-2 mb-4">
          <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner">
            <Gift size={28} />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-pink-950">
            🎁 Surprise Me
          </h2>
          <p className="text-xs font-semibold text-pink-700">
            You never know what's waiting for you... ✨
          </p>
        </div>

        {isAnimating || isLoading ? (
          <div className="py-12 space-y-4">
            <div className="text-4xl font-extrabold text-pink-600 animate-bounce">
              {countdown > 0 ? countdown : '✨'}
            </div>
            <p className="text-xs font-bold text-pink-800 uppercase tracking-widest animate-pulse">
              Preparing your surprise...
            </p>
          </div>
        ) : currentSurprise ? (
          <div className="space-y-4 animate-scaleUp">
            <span className="px-3.5 py-1 rounded-full bg-pink-100 text-pink-800 font-bold text-xs uppercase tracking-wider inline-flex items-center space-x-1.5 shadow-xs">
              {currentSurprise.icon}
              <span>{currentSurprise.badge}</span>
            </span>

            <div className="p-5 rounded-2xl bg-pink-50/80 border border-pink-200/80 shadow-xs space-y-2">
              <h3 className="font-heading font-bold text-lg text-pink-950">
                {currentSurprise.title}
              </h3>
              <p className="font-script text-2xl text-pink-900 leading-relaxed italic">
                "{currentSurprise.message}"
              </p>
              {currentSurprise.extraDate && (
                <span className="text-[11px] font-semibold text-pink-600 block">
                  {currentSurprise.extraDate}
                </span>
              )}
            </div>

            {saveMsg && (
              <p className="text-xs font-bold text-green-700 animate-bounce">
                {saveMsg}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveFavorite}
                className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1 hover:bg-pink-200 transition-colors"
              >
                <Heart size={14} className="fill-rose-500 text-rose-500" />
                <span>❤️ Keep this</span>
              </button>

              <button
                type="button"
                onClick={() => triggerNewSurprise(pool)}
                className="w-1/2 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center justify-center space-x-1"
              >
                <Sparkles size={14} />
                <span>✨ Surprise Again</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-pink-600 hover:text-pink-900 underline block mx-auto pt-2"
            >
              ← Back to My World
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
