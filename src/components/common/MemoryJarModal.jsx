import React, { useState, useEffect } from 'react';
import {
  fetchJarMemories,
  fetchMemories,
  saveUserFavoriteMemory,
  fetchUserFavoriteMemories,
  deleteUserFavoriteMemory,
} from '../../lib/supabase';
import { Heart, Sparkles, X, Gift, RefreshCw, BookmarkCheck, Trash2, Calendar, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

const SWEET_MESSAGES_FALLBACK = [
  { id: 'sw-1', title: 'A Sweet Reminder ❤️', message: 'You are the quiet magic in every single day.', category: '🌸 Cute' },
  { id: 'sw-2', title: 'Always Special ✨', message: 'Some souls bring warmth simply by existing.', category: '✨ Beautiful' },
  { id: 'sw-3', title: 'Little Thoughts 🌙', message: 'No matter how busy life gets, you remain my favorite thought.', category: '🌙 Late Night' },
];

export function MemoryJarModal({ isOpen, onClose, currentUser }) {
  const [jarMemories, setJarMemories] = useState([]);
  const [timelineMemories, setTimelineMemories] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [viewMode, setViewMode] = useState('jar'); // 'jar' | 'favorites'

  useEffect(() => {
    if (isOpen) {
      loadJarData();
    }
  }, [isOpen]);

  const loadJarData = async () => {
    setIsLoading(true);
    try {
      const jData = await fetchJarMemories({ includeInactive: false });
      const tData = await fetchMemories({ includeHidden: false });
      const fData = await fetchUserFavoriteMemories(currentUser?.userId || 'usr-amritayadav');

      setJarMemories(jData);
      setTimelineMemories(tData);
      setUserFavorites(fData);
    } catch (e) {
      console.warn('[MemoryJarModal] Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerHeartConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFB6C1', '#FF69B4', '#FFD1DC', '#FFF0F5'],
    });
  };

  const handlePickMemory = () => {
    setIsShaking(true);
    setSaveSuccessMsg('');

    setTimeout(() => {
      setIsShaking(false);
      const available = jarMemories.length > 0 ? jarMemories : SWEET_MESSAGES_FALLBACK;
      const randIdx = Math.floor(Math.random() * available.length);
      setSelectedNote(available[randIdx]);
      triggerHeartConfetti();
    }, 600);
  };

  const handleSurpriseMe = () => {
    setIsShaking(true);
    setSaveSuccessMsg('');

    setTimeout(() => {
      setIsShaking(false);

      const pool = [
        ...jarMemories,
        ...timelineMemories.map((t) => ({
          id: t.id,
          title: t.title,
          message: t.short_description,
          category: t.category,
          memory_date: t.memory_date,
        })),
        ...SWEET_MESSAGES_FALLBACK,
      ];

      if (pool.length > 0) {
        const randIdx = Math.floor(Math.random() * pool.length);
        setSelectedNote(pool[randIdx]);
        triggerHeartConfetti();
      }
    }, 600);
  };

  const handleSaveFavorite = async () => {
    if (!selectedNote) return;

    try {
      await saveUserFavoriteMemory({
        user_id: currentUser?.userId || 'usr-amritayadav',
        memory_id: selectedNote.id,
        memory_data: selectedNote,
      });

      setSaveSuccessMsg('Saved to your favorites ❤️');
      const updatedFavs = await fetchUserFavoriteMemories(currentUser?.userId || 'usr-amritayadav');
      setUserFavorites(updatedFavs);

      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (e) {
      console.warn('[MemoryJarModal] Error saving favorite:', e);
    }
  };

  const handleDeleteFavorite = async (favId) => {
    await deleteUserFavoriteMemory(currentUser?.userId || 'usr-amritayadav', favId);
    const updatedFavs = await fetchUserFavoriteMemories(currentUser?.userId || 'usr-amritayadav');
    setUserFavorites(updatedFavs);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-lg animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-center relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Close Memory Jar"
        >
          <X size={18} />
        </button>

        {/* View Mode Toggle: Favorites Screen */}
        {viewMode === 'favorites' ? (
          <div className="space-y-6 text-left animate-fadeIn">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <button
                onClick={() => setViewMode('jar')}
                className="px-3.5 py-1.5 rounded-full bg-pink-100 text-pink-950 text-xs font-bold uppercase tracking-wider flex items-center space-x-1 hover:bg-pink-200"
              >
                <ArrowLeft size={13} />
                <span>Back to Jar</span>
              </button>

              <span className="font-heading font-bold text-sm text-pink-950">
                ❤️ My Saved Memories ({userFavorites.length})
              </span>
            </div>

            {userFavorites.length === 0 ? (
              <div className="py-12 text-center text-pink-600 font-semibold text-sm">
                You haven't saved any favorite memories yet. ❤️
              </div>
            ) : (
              <div className="space-y-3">
                {userFavorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200 flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-heading font-bold text-sm text-pink-950">
                          {fav.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-bold">
                          {fav.category || '❤️ Love'}
                        </span>
                      </div>
                      <p className="font-body text-xs text-pink-900 italic">"{fav.message}"</p>
                      {fav.memory_date && (
                        <span className="text-[10px] text-pink-600 font-semibold block">Date: {fav.memory_date}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteFavorite(fav.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Main Jar Visual & Interaction Screen */
          <div className="space-y-6">
            
            {/* Header */}
            <div className="space-y-1 text-center">
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Heart size={13} className="fill-pink-400" />
                <span>Love & Memories</span>
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose">
                Our Little Memory Jar 🫙❤️
              </h2>
              <p className="font-script text-xl text-pink-700">
                Pick a little memory...
              </p>
            </div>

            {/* Glassmorphic Jar Graphic */}
            <div className="relative py-4 flex flex-col items-center">
              <div className={`w-36 h-48 sm:w-40 sm:h-52 rounded-3xl bg-gradient-to-b from-white/70 to-pink-100/60 border-2 border-pink-200 shadow-xl backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden transition-transform ${
                isShaking ? 'animate-bounce scale-105 border-pink-400' : ''
              }`}>
                {/* Jar Lid */}
                <div className="absolute top-0 w-24 h-4 rounded-b-xl bg-pink-300/80 border-b border-pink-400 shadow-xs" />

                {/* Floating Heart Particles inside Jar */}
                <div className="flex flex-wrap items-center justify-center gap-2 px-4 pt-6">
                  <span className="animate-pulse text-lg">❤️</span>
                  <span className="animate-ping text-sm text-pink-400">✨</span>
                  <span className="animate-pulse text-xl text-rose-500">🌸</span>
                  <span className="animate-bounce text-sm">💕</span>
                  <span className="animate-pulse text-lg text-pink-600">🥰</span>
                </div>

                <div className="mt-4 text-[11px] font-extrabold text-pink-700 uppercase tracking-widest bg-white/70 px-3 py-1 rounded-full border border-pink-200">
                  Memory Jar
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handlePickMemory}
                disabled={isShaking}
                className="px-5 py-3 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <Sparkles size={14} />
                <span>Pick a Memory ✨</span>
              </button>

              <button
                type="button"
                onClick={handleSurpriseMe}
                disabled={isShaking}
                className="px-4 py-3 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5"
              >
                <Gift size={14} />
                <span>Surprise Me 🎁</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('favorites')}
                className="px-4 py-3 rounded-full bg-pink-50 border border-pink-200 text-pink-800 font-bold text-xs uppercase tracking-wider hover:bg-pink-100 transition-colors"
              >
                My Favorites ❤️
              </button>
            </div>

            {/* Selected Memory Note Overlay */}
            {selectedNote && (
              <div className="p-6 rounded-3xl bg-pink-50/90 border-2 border-pink-300 shadow-lg text-left space-y-3 animate-scaleUp relative">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-pink-200 text-pink-900 text-xs font-bold">
                    {selectedNote.category || '❤️ Love'}
                  </span>

                  {selectedNote.memory_date && (
                    <span className="text-xs text-pink-700 font-semibold flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{selectedNote.memory_date}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-extrabold text-xl text-pink-950">
                  {selectedNote.title || 'Our Little Memory ❤️'}
                </h3>

                <p className="font-script text-xl text-pink-800 leading-relaxed italic">
                  "{selectedNote.message || selectedNote.short_description}"
                </p>

                {saveSuccessMsg && (
                  <p className="text-xs font-bold text-green-700 flex items-center space-x-1 animate-bounce">
                    <BookmarkCheck size={14} />
                    <span>{saveSuccessMsg}</span>
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-pink-200">
                  <button
                    type="button"
                    onClick={handleSaveFavorite}
                    className="px-4 py-2 rounded-full bg-white border border-pink-300 text-pink-950 font-bold text-xs uppercase tracking-wider hover:bg-pink-100 flex items-center space-x-1 shadow-xs"
                  >
                    <Heart size={13} className="fill-rose-400 text-rose-500" />
                    <span>Save</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePickMemory}
                    className="px-4 py-2 rounded-full bg-pink-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-pink-600 flex items-center space-x-1 shadow-xs"
                  >
                    <RefreshCw size={13} />
                    <span>Pick Another</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
