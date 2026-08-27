import React, { useState } from 'react';
import { ALLOWED_MOODS, MOOD_DETAILS, saveJournalEntry } from '../../lib/supabase';
import { Heart, Sparkles, BookOpen, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function JournalModal({ isOpen, onClose }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await saveJournalEntry({
        mood: selectedMood,
        journalText: journalText,
      });

      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
      });

      setIsSaved(true);

      setTimeout(() => {
        setIsSubmitting(false);
        setIsSaved(false);
        setSelectedMood(null);
        setJournalText('');
        onClose();
      }, 2500);
    } catch (err) {
      console.error('[JournalModal] Save error:', err);
      setErrorMessage('Oops, save nahi ho paya. Ek baar phir try karo. ❤️');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border-2 border-pink-300 shadow-2xl relative bg-white/95 text-center transition-all duration-300">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Close Journal"
        >
          <X size={18} />
        </button>

        {/* Success Confirmation View */}
        {isSaved ? (
          <div className="py-8 flex flex-col items-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-heading font-bold text-2xl text-pink-950">
              Your little thought has been saved. 💌
            </h3>
            <p className="font-script text-xl text-pink-800 italic">
              "Your memories will stay safe in this little world..."
            </p>
          </div>
        ) : (
          /* Main Journal Entry Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-800 text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen size={13} className="text-pink-600" />
                <span>Personal Diary</span>
              </div>
              
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose">
                My Little Journal 💌
              </h2>
              <p className="font-script text-xl text-pink-700 mt-1">
                Jo dil mein ho, yahan likh sakti ho... 💗
              </p>
            </div>

            {/* Optional Mood Selection Bar (4 Allowed Moods) */}
            <div className="text-left space-y-2">
              <label className="font-heading font-semibold text-xs text-pink-900 uppercase tracking-wider block">
                How are you feeling right now? (Optional)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ALLOWED_MOODS.map((moodKey) => {
                  const details = MOOD_DETAILS[moodKey];
                  const isSelected = selectedMood === moodKey;

                  return (
                    <button
                      key={moodKey}
                      type="button"
                      onClick={() => setSelectedMood(isSelected ? null : moodKey)}
                      className={`p-2.5 rounded-2xl border transition-all text-center focus:outline-none ${
                        isSelected
                          ? 'bg-white border-2 border-pink-400 shadow-md ring-2 ring-pink-200 scale-105'
                          : 'bg-white/70 border-pink-100 hover:bg-white text-pink-900'
                      }`}
                    >
                      <span className="text-xl block">{details.emoji}</span>
                      <span className="text-[10px] font-bold block truncate mt-0.5">
                        {details.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Textarea Input */}
            <div className="text-left space-y-1.5">
              <label className="font-heading font-semibold text-xs text-pink-900 uppercase tracking-wider block">
                Aaj kya feel kar rahi ho? 🌸
              </label>
              <div className="relative">
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value.slice(0, 500))}
                  placeholder="Write something from your heart... 💗"
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-white/90 border border-pink-200 text-pink-950 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none shadow-inner"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-pink-400 font-semibold">
                  {journalText.length} / 500
                </span>
              </div>
            </div>

            {/* Error Message Toast */}
            {errorMessage && (
              <p className="text-xs font-semibold text-rose-600 animate-bounce">
                {errorMessage}
              </p>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={!journalText.trim() || isSubmitting}
              className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl focus:outline-none ${
                journalText.trim() && !isSubmitting
                  ? 'bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white hover:scale-102 hover:shadow-2xl cursor-pointer'
                  : 'bg-pink-200 text-pink-400 cursor-not-allowed opacity-70'
              }`}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Save to My Journal ❤️'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
