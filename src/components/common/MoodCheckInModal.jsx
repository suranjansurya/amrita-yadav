import React, { useState } from 'react';
import { ALLOWED_MOODS, MOOD_DETAILS, saveMoodCheckIn } from '../../lib/supabase';
import { Heart, Sparkles, Send, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function MoodCheckInModal({ isOpen, onClose }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await saveMoodCheckIn({
        mood: selectedMood,
        message: message,
      });

      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
      });

      const responseText = MOOD_DETAILS[selectedMood]?.response || 'Thank you for telling me. ❤️';
      setSubmittedResponse(responseText);

      // Smoothly close after 2.5 seconds
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedResponse(null);
        setSelectedMood(null);
        setMessage('');
        onClose();
      }, 2500);
    } catch (err) {
      console.error('[MoodCheckIn] Save error:', err);
      setErrorMessage('Oops, save nahi ho paya. Ek baar phir try karo. ❤️');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border-2 border-pink-300 shadow-2xl relative bg-white/95 text-center transition-all duration-300">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Submitted Success View */}
        {submittedResponse ? (
          <div className="py-8 flex flex-col items-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-heading font-bold text-2xl text-pink-950">
              Thank you for telling me. ❤️
            </h3>
            <p className="font-script text-2xl text-pink-800 italic max-w-sm">
              "{submittedResponse}"
            </p>
          </div>
        ) : (
          /* Main Check-In Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Heart size={13} className="text-pink-600 fill-pink-400" />
                <span>Daily Mood Check-in</span>
              </div>
              
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose">
                Amrita, tum kaisi ho aaj? ❤️
              </h2>
              <p className="font-script text-xl text-pink-700 mt-1">
                Bas honestly bata dena... 💗
              </p>
            </div>

            {/* 4 Allowed Mood Options Grid */}
            <div className="grid grid-cols-2 gap-3">
              {ALLOWED_MOODS.map((moodKey) => {
                const details = MOOD_DETAILS[moodKey];
                const isSelected = selectedMood === moodKey;

                return (
                  <button
                    key={moodKey}
                    type="button"
                    onClick={() => setSelectedMood(moodKey)}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center focus:outline-none ${
                      isSelected
                        ? 'bg-white border-2 border-pink-400 shadow-lg ring-4 ring-pink-200/80 scale-105'
                        : 'bg-white/70 border-pink-100 hover:bg-white hover:border-pink-200 shadow-sm hover:scale-102'
                    }`}
                  >
                    <span className="text-3xl mb-1">{details.emoji}</span>
                    <span className="font-heading font-bold text-sm text-pink-950">
                      {details.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Optional Message Field */}
            <div className="text-left space-y-1.5">
              <label className="font-heading font-semibold text-xs text-pink-900 uppercase tracking-wider block">
                Kuch kehna chahti ho? 💌
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 280))}
                  placeholder="Jo dil mein hai, likh sakti ho..."
                  rows={3}
                  className="w-full p-3.5 rounded-2xl bg-white/90 border border-pink-200 text-pink-950 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none shadow-inner"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-pink-400 font-semibold">
                  {message.length} / 280
                </span>
              </div>
            </div>

            {/* Error Toast */}
            {errorMessage && (
              <p className="text-xs font-semibold text-rose-600 animate-bounce">
                {errorMessage}
              </p>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={!selectedMood || isSubmitting}
              className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl focus:outline-none ${
                selectedMood && !isSubmitting
                  ? 'bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white hover:scale-102 hover:shadow-2xl cursor-pointer'
                  : 'bg-pink-200 text-pink-400 cursor-not-allowed opacity-70'
              }`}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Save My Mood ❤️'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
