import React, { useState, useEffect } from 'react';
import { fetchJustForYouData } from '../../lib/supabase';
import { useTimeBasedGreeting } from '../../hooks/useTimeBasedGreeting';
import {
  Heart,
  Sparkles,
  X,
  Gift,
  Archive,
  BookOpen,
  Lock,
  Compass,
  Play,
  Pause,
  Moon,
  Sun,
  Smile,
  LogOut,
  BookmarkCheck,
  Music,
} from 'lucide-react';

export function JustForYouModal({
  isOpen,
  onClose,
  currentUser,
  audioState,
  onOpenHeartCheckIn,
  onOpenSurprise,
  onOpenConstellation,
  onOpenSecretUnlock,
  onOpenJournal,
}) {
  const { greeting, period } = useTimeBasedGreeting();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOpenedDailySurprise, setHasOpenedDailySurprise] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPersonalSpace();
    }
  }, [isOpen]);

  const loadPersonalSpace = async () => {
    setIsLoading(true);
    try {
      const uId = currentUser?.userId || 'usr-amritayadav';
      const res = await fetchJustForYouData(uId);
      setData(res);

      const todayStr = new Date().toDateString();
      const surpriseKey = `amrita_daily_surprise_${uId}_${todayStr}`;
      setHasOpenedDailySurprise(Boolean(localStorage.getItem(surpriseKey)));
    } catch (e) {
      console.warn('[JustForYouModal] Load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDailySurpriseClick = () => {
    const uId = currentUser?.userId || 'usr-amritayadav';
    const todayStr = new Date().toDateString();
    localStorage.setItem(`amrita_daily_surprise_${uId}_${todayStr}`, 'true');
    setHasOpenedDailySurprise(true);
    if (onOpenSurprise) onOpenSurprise();
  };

  if (!isOpen) return null;

  const stats = data?.stats || {};
  const constellationStats = data?.constellationStats || {};
  const latestHeart = data?.latestHeart;
  const latestJournal = data?.latestJournal;
  const todayMessage = data?.todayMessage;
  const nextSecret = data?.nextSecret;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/45 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-3xl w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-pink-950 text-left relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Back to My World"
        >
          <X size={18} />
        </button>

        {/* 1. Header & Personal Greeting */}
        <div className="space-y-2 mb-6 border-b border-pink-100 pb-4">
          <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold uppercase tracking-wider inline-block">
            💌 Just For You Personal Space
          </span>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose">
            {greeting}, Amrita ❤️
          </h2>
          <p className="text-xs text-pink-700 font-semibold">
            A little corner made just for you... ❤️
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-pink-600 font-semibold text-sm animate-pulse">
            Opening your personal space... ✨
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 2. Message of the Day Card */}
            {todayMessage && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100 border border-pink-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-pink-800 uppercase tracking-wider block">
                  💌 {todayMessage.title || "Today's Little Message"}
                </span>
                <p className="font-script text-2xl text-pink-950 leading-relaxed italic">
                  "{todayMessage.message}"
                </p>
              </div>
            )}

            {/* 3. Today's Feeling & Quick Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Today's Feeling Card */}
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-2">
                <span className="text-xs font-bold text-pink-800 uppercase block">
                  ❤️ How you're feeling today
                </span>

                {latestHeart ? (
                  <div className="space-y-1">
                    <span className="font-heading font-bold text-base text-pink-950 flex items-center space-x-1.5">
                      <span>{latestHeart.mood}</span>
                    </span>
                    <p className="text-xs text-pink-700 italic">"{latestHeart.heart_word || latestHeart.day_feeling || 'Checked in today ❤️'}"</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-pink-700 font-semibold">You haven't checked in yet today.</p>
                    <button
                      onClick={onOpenHeartCheckIn}
                      className="px-4 py-2 rounded-full bg-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-xs hover:bg-pink-600"
                    >
                      ❤️ Check In Now
                    </button>
                  </div>
                )}
              </div>

              {/* 🎁 Today's Surprise Card */}
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-2">
                <span className="text-xs font-bold text-pink-800 uppercase block">
                  🎁 Today's Surprise
                </span>

                {hasOpenedDailySurprise ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-pink-900">✨ You've already opened today's surprise.</p>
                    <button
                      onClick={onOpenSurprise}
                      className="text-xs font-bold text-pink-600 hover:text-pink-900 underline"
                    >
                      Surprise Me Again →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-pink-700 font-semibold">A little surprise is waiting for you today!</p>
                    <button
                      onClick={handleOpenDailySurpriseClick}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-xs hover:scale-105 transition-all"
                    >
                      ✨ Open Today's Surprise
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* 4. Your Little Stats Grid (Real User Data Only) */}
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-sm text-pink-900 uppercase tracking-wider">
                Your Little Stats ❤️
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-100 text-center">
                  <span className="text-[11px] font-bold text-pink-700 block uppercase">Check-ins</span>
                  <span className="font-extrabold text-xl text-pink-950 mt-0.5 block">{stats.checkinCount || 0}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-100 text-center">
                  <span className="text-[11px] font-bold text-pink-700 block uppercase">Saved Memories</span>
                  <span className="font-extrabold text-xl text-pink-950 mt-0.5 block">{stats.savedCount || 0}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-100 text-center">
                  <span className="text-[11px] font-bold text-pink-700 block uppercase">Digital Hugs</span>
                  <span className="font-extrabold text-xl text-pink-950 mt-0.5 block">{stats.hugCount || 0}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-100 text-center">
                  <span className="text-[11px] font-bold text-pink-700 block uppercase">Sky Stars</span>
                  <span className="font-extrabold text-xl text-pink-950 mt-0.5 block">{stats.starCount || 0}</span>
                </div>
              </div>
            </div>

            {/* 5. Phase 27 Next Secret & Phase 28 Sky Progress */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Next Secret */}
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-2">
                <span className="text-xs font-bold text-pink-800 uppercase block">
                  🔐 Next Secret Unlock
                </span>

                {nextSecret ? (
                  <div className="space-y-1">
                    <span className="font-heading font-bold text-sm text-pink-950">{nextSecret.name}</span>
                    <p className="text-xs text-pink-700 font-semibold">Requirement: {nextSecret.reqVal} of type {nextSecret.reqType}</p>
                    <button
                      onClick={onOpenSecretUnlock}
                      className="text-xs font-bold text-pink-600 hover:text-pink-900 underline block pt-1"
                    >
                      View Unlock Progress →
                    </button>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-pink-900">✨ You've discovered all secret unlocks!</p>
                )}
              </div>

              {/* Sky Progress */}
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-2">
                <span className="text-xs font-bold text-pink-800 uppercase block">
                  🌌 Our Little Sky Progress
                </span>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-pink-950">
                    {constellationStats.discoveredStars} / {constellationStats.totalStars} stars discovered
                  </p>
                  <p className="text-xs text-pink-700 font-semibold">
                    {constellationStats.completedConstellations} / {constellationStats.totalConstellations} constellations completed
                  </p>
                  <button
                    onClick={onOpenConstellation}
                    className="text-xs font-bold text-pink-600 hover:text-pink-900 underline block pt-1"
                  >
                    Explore the Sky 🌌 →
                  </button>
                </div>
              </div>

            </div>

            {/* 6. Journal Preview & Music Moment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Journal Preview */}
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-2">
                <span className="text-xs font-bold text-pink-800 uppercase block">
                  📖 Your Latest Journal Entry
                </span>

                {latestJournal ? (
                  <div className="space-y-1">
                    <p className="text-xs text-pink-900 font-bold italic">"{latestJournal.journal_text}"</p>
                    <span className="text-[11px] text-pink-600 block">{latestJournal.date}</span>
                    <button
                      onClick={onOpenJournal}
                      className="text-xs font-bold text-pink-600 hover:text-pink-900 underline block pt-1"
                    >
                      Open Journal 📖 →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-pink-700 font-semibold">Your first thought is waiting here...</p>
                    <button
                      onClick={onOpenJournal}
                      className="text-xs font-bold text-pink-600 hover:text-pink-900 underline block pt-1"
                    >
                      Write in Journal 📖 →
                    </button>
                  </div>
                )}
              </div>

              {/* Music Moment */}
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-2">
                <span className="text-xs font-bold text-pink-800 uppercase block">
                  🎵 A Song For This Moment
                </span>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-pink-950">Mere Nishan 🎵</p>
                  <button
                    onClick={() => audioState && audioState.togglePlay()}
                    className="px-4 py-2 rounded-full bg-pink-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-xs hover:bg-pink-600"
                  >
                    {audioState?.isPlaying ? <Pause size={13} /> : <Play size={13} />}
                    <span>{audioState?.isPlaying ? 'Pause Song' : 'Play Song'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Navigation Close */}
            <div className="text-center pt-4 border-t border-pink-100">
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
