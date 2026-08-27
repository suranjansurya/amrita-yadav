import React, { useState, useEffect } from 'react';
import { fetchSurprisePool, saveUserFavoriteMemory } from '../../lib/supabase';
import { Heart, Sparkles, X, Gift, Music, Lock, Unlock, Play, ArrowLeft, BookmarkCheck, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

const BEAUTIFUL_QUOTES = [
  'Some souls make the world softer just by being in it. ✨',
  'You are the calm in every storm and the smile in every thought. 🌸',
  'No matter where life takes us, you will always be my favorite place. ❤️',
  'The sweetest things in life are simple: a gentle word, a quiet moment, and you. 🌷',
];

const COMFORT_RESPONSES = {
  '😴 Tired': "You've done enough for today. Take a breath and be gentle with yourself. 🌙❤️",
  '😔 Low': "Not every day has to be a good day. It's okay to slow down and just be. 🤍",
  '😐 Okay': "Everything doesn't have to be perfect. You are doing just fine. 🌸",
  '😌 Peaceful': "Keep this peaceful little feeling close to your heart today. ✨",
  '😊 Happy': "Keep that beautiful smile going—it brightens everything around you! ❤️",
};

export function SurpriseMeModal({ isOpen, onClose, currentUser, audioState, onTriggerGarden }) {
  const [pool, setPool] = useState({ jarMemories: [], timelineMemories: [], latestHeart: null });
  const [isLoading, setIsLoading] = useState(true);

  const [isAnimating, setIsAnimating] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [currentSurprise, setCurrentSurprise] = useState(null);
  const [lastSurpriseType, setLastSurpriseType] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSurpriseData();
    }
  }, [isOpen]);

  const loadSurpriseData = async () => {
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

    // Avoid immediate consecutive repetition if alternatives exist
    let chosenType = types[Math.floor(Math.random() * types.length)];
    if (chosenType === lastSurpriseType && types.length > 1) {
      chosenType = types.find((t) => t !== lastSurpriseType) || chosenType;
    }
    setLastSurpriseType(chosenType);

    if (chosenType === 'sweet') {
      setCurrentSurprise({
        type: 'sweet',
        badge: '💌 Sweet Message',
        title: 'Just for you... 💌',
        message: 'No matter what happens today, remember that you are deeply cherished.',
      });
    } else if (chosenType === 'memory' && dataPool.timelineMemories.length > 0) {
      const randMem = dataPool.timelineMemories[Math.floor(Math.random() * dataPool.timelineMemories.length)];
      setCurrentSurprise({
        type: 'memory',
        badge: '❤️ Memory',
        title: `Remember this? ❤️ ${randMem.title}`,
        message: randMem.short_description,
        date: randMem.memory_date,
        image: randMem.image_url,
      });
    } else if (chosenType === 'jar' && dataPool.jarMemories.length > 0) {
      const randJar = dataPool.jarMemories[Math.floor(Math.random() * dataPool.jarMemories.length)];
      setCurrentSurprise({
        type: 'jar',
        badge: '🫙 Memory Jar Note',
        title: randJar.title,
        message: randJar.message,
        date: randJar.memory_date,
      });
    } else if (chosenType === 'quote') {
      const q = BEAUTIFUL_QUOTES[Math.floor(Math.random() * BEAUTIFUL_QUOTES.length)];
      setCurrentSurprise({
        type: 'quote',
        badge: '🌸 Beautiful Quote',
        title: 'A Little Thought ✨',
        message: q,
      });
    } else if (chosenType === 'hug') {
      setCurrentSurprise({
        type: 'hug',
        badge: '🤗 Digital Hug',
        title: 'Come here... 🤗❤️',
        message: 'Sending you a warm, gentle hug across the screen. You are never alone. ❤️',
      });
    } else if (chosenType === 'explosion') {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFB6C1', '#FF69B4', '#FFD1DC', '#FFF0F5'],
      });
      setCurrentSurprise({
        type: 'explosion',
        badge: '✨ Heart Explosion',
        title: 'Love Shower! ✨❤️',
        message: 'Because you deserve a little extra love today. ❤️',
      });
    } else if (chosenType === 'comfort') {
      const moodVal = dataPool.latestHeart?.mood || '😊 Happy';
      const cMsg = COMFORT_RESPONSES[moodVal] || COMFORT_RESPONSES['😊 Happy'];
      setCurrentSurprise({
        type: 'comfort',
        badge: '🌙 Comfort Message',
        title: 'Thinking of you... 🌙',
        message: cMsg,
      });
    } else if (chosenType === 'music') {
      if (audioState && !audioState.isPlaying) {
        audioState.startAudio();
      }
      setCurrentSurprise({
        type: 'music',
        badge: '🎵 Music Moment',
        title: 'A Melody For You 🎵',
        message: 'Maybe this song is exactly what you need right now... Mere Nishan. ✨',
      });
    } else {
      setCurrentSurprise({
        type: 'secret',
        badge: '🔐 Secret Message',
        title: '🔐 You found something...',
        message: 'You have a quiet light that makes everything around you feel calm and special. ✨',
      });
    }
  };

  const handleSaveSurprise = async () => {
    if (!currentSurprise) return;

    try {
      await saveUserFavoriteMemory({
        user_id: currentUser?.userId || 'usr-amritayadav',
        memory_id: `surprise-${Date.now()}`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-lg animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-center relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Back to My World"
        >
          <X size={18} />
        </button>

        {/* 1. Countdown Animation View */}
        {isAnimating ? (
          <div className="py-12 space-y-6 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner">
              <Gift size={32} className="animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-pink-950">
                Wait... something special is coming... ❤️
              </h3>
              <p className="font-heading font-extrabold text-5xl text-gradient-rose">
                {countdown}
              </p>
            </div>
          </div>
        ) : (
          /* 2. Revealed Surprise View */
          <div className="space-y-6 animate-scaleUp text-left">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <span className="px-3.5 py-1 rounded-full bg-pink-100 text-pink-800 font-bold text-xs uppercase tracking-wider flex items-center space-x-1">
                <Gift size={13} />
                <span>{currentSurprise?.badge || '🎁 Surprise'}</span>
              </span>

              <span className="text-xs font-bold text-pink-600">Phase 25 Active</span>
            </div>

            {/* Hug Visual Animation */}
            {currentSurprise?.type === 'hug' && (
              <div className="relative py-6 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-pink-200/80 animate-ping absolute inset-0 m-auto" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white flex items-center justify-center relative z-10 shadow-lg">
                  <Heart size={40} className="fill-white animate-bounce" />
                </div>
              </div>
            )}

            {/* Memory Image if available */}
            {currentSurprise?.image && (
              <div className="rounded-2xl overflow-hidden shadow-md max-h-48 w-full bg-pink-50">
                <img src={currentSurprise.image} alt="Memory" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Surprise Content */}
            <div className="space-y-3">
              <h2 className="font-heading font-extrabold text-2xl text-pink-950">
                {currentSurprise?.title}
              </h2>

              <p className="font-script text-2xl text-pink-800 leading-relaxed italic bg-pink-50/60 p-4 rounded-2xl border border-pink-100">
                "{currentSurprise?.message}"
              </p>

              {currentSurprise?.type === 'music' && (
                <div className="pt-2">
                  <button
                    onClick={() => audioState && audioState.togglePlay()}
                    className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-md hover:bg-pink-600"
                  >
                    <Play size={14} />
                    <span>{audioState?.isPlaying ? 'Pause Song 🎵' : 'Play Mere Nishan 🎵'}</span>
                  </button>
                </div>
              )}
            </div>

            {saveMsg && (
              <p className="text-xs font-bold text-green-700 flex items-center space-x-1 animate-bounce">
                <BookmarkCheck size={14} />
                <span>{saveMsg}</span>
              </p>
            )}

            {/* Navigation Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-pink-100">
              <button
                type="button"
                onClick={handleSaveSurprise}
                className="px-4 py-2.5 rounded-full bg-white border border-pink-300 text-pink-950 font-bold text-xs uppercase tracking-wider hover:bg-pink-100 flex items-center space-x-1 shadow-xs"
              >
                <Heart size={13} className="fill-rose-400 text-rose-500" />
                <span>Keep this</span>
              </button>

              <button
                type="button"
                onClick={() => triggerNewSurprise(pool)}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-1"
              >
                <RefreshCw size={13} />
                <span>Surprise Me Again</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-pink-600 hover:text-pink-900 underline focus:outline-none"
              >
                ← Back to My World
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
