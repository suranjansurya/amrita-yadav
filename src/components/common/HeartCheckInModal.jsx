import React, { useState } from 'react';
import { useTimeBasedGreeting } from '../../hooks/useTimeBasedGreeting';
import { saveOrUpdateHeartCheckIn } from '../../lib/supabase';
import { Heart, Sparkles, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const MOOD_OPTIONS = ['😊 Happy', '😌 Peaceful', '😐 Okay', '😔 Low', '😴 Tired'];
const DAY_OPTIONS = ['🌟 Amazing', '😊 Good', '😐 Normal', '😮💨 Difficult'];
const NEED_OPTIONS = [
  '💌 A sweet message',
  '🎵 Music',
  '🌷 Something beautiful',
  '📖 Read something',
  '🤗 Just a little care',
];

const MOOD_RESPONSES = {
  '😊 Happy': 'That smile better stay with you today. ✨❤️',
  '😌 Peaceful': 'Keep this peaceful little feeling close. 🌸',
  '😐 Okay': "That's okay. You don't have to be amazing every day. ❤️",
  '😔 Low': "It's okay to have difficult days. You don't have to hide how you feel here. 🤍",
  '😴 Tired': 'Take a breath... you can slow down here. 🌙❤️',
};

export function HeartCheckInModal({ currentUser, onComplete }) {
  const { greetingText } = useTimeBasedGreeting();

  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedNeed, setSelectedNeed] = useState('');
  const [heartWord, setHeartWord] = useState('');
  const [sharedMessage, setSharedMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleNextStep = () => {
    setValidationError('');

    if (step === 1 && !selectedMood) {
      setValidationError('Please select how you feel today ❤️');
      return;
    }
    if (step === 2 && !selectedDay) {
      setValidationError('Please select how your day was ✨');
      return;
    }
    if (step === 3 && !selectedNeed) {
      setValidationError('Please select what you need right now 💕');
      return;
    }

    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmitCheckIn();
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmitCheckIn = async () => {
    setIsSubmitting(true);
    try {
      await saveOrUpdateHeartCheckIn({
        user_id: currentUser?.userId || 'usr-amritayadav',
        mood: selectedMood,
        day_feeling: selectedDay,
        current_need: selectedNeed,
        heart_word: heartWord,
        shared_message: sharedMessage,
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
      });

      setShowResponse(true);

      setTimeout(() => {
        onComplete();
      }, 3500);
    } catch (e) {
      console.warn('[HeartCheckIn] Submission error:', e);
      setShowResponse(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-lg animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-center relative transition-all">
        
        {/* Render Final Personalized Response Screen */}
        {showResponse ? (
          <div className="py-8 space-y-6 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} className="text-pink-500" />
            </div>

            <div className="space-y-3">
              <p className="font-heading font-extrabold text-2xl sm:text-3xl text-pink-950">
                Thank you for telling me. ❤️
              </p>
              <p className="font-script text-2xl text-pink-700">
                "{MOOD_RESPONSES[selectedMood] || 'Welcome to your little dream world. ✨'}"
              </p>
            </div>

            <div className="pt-4 border-t border-pink-100 text-xs font-bold text-pink-500 uppercase tracking-widest animate-pulse">
              Now come in... your little world is waiting for you. ✨
            </div>
          </div>
        ) : (
          /* Render 5-Step Question Flow */
          <div className="space-y-6">
            
            {/* Header Greeting & Progress Indicator */}
            <div className="flex items-center justify-between border-b border-pink-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-100/70 px-3 py-1 rounded-full">
                {greetingText}
              </span>

              <div className="flex items-center space-x-1 text-xs font-bold text-pink-600">
                <Heart size={14} className="fill-pink-400" />
                <span>♡ {step} / 5</span>
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[220px] flex flex-col justify-center">
              
              {/* Step 1: Mood */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-heading font-extrabold text-2xl text-pink-950">
                    Aaj tum kaisi ho? ❤️
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {MOOD_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedMood(opt)}
                        className={`p-3.5 rounded-2xl border text-sm font-bold transition-all text-left flex items-center justify-between ${
                          selectedMood === opt
                            ? 'bg-pink-500 text-white border-pink-500 shadow-md scale-102'
                            : 'bg-pink-50/60 border-pink-200 text-pink-950 hover:bg-pink-100/60'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedMood === opt && <Heart size={14} className="fill-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Day */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-heading font-extrabold text-2xl text-pink-950">
                    Aaj ka din kaisa raha? ✨
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {DAY_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedDay(opt)}
                        className={`p-3.5 rounded-2xl border text-sm font-bold transition-all text-left flex items-center justify-between ${
                          selectedDay === opt
                            ? 'bg-pink-500 text-white border-pink-500 shadow-md scale-102'
                            : 'bg-pink-50/60 border-pink-200 text-pink-950 hover:bg-pink-100/60'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedDay === opt && <Heart size={14} className="fill-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Current Need */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-heading font-extrabold text-2xl text-pink-950">
                    Abhi tumhe kya chahiye? 💕
                  </h3>
                  <div className="space-y-2 pt-2">
                    {NEED_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedNeed(opt)}
                        className={`w-full p-3.5 rounded-2xl border text-sm font-bold transition-all text-left flex items-center justify-between ${
                          selectedNeed === opt
                            ? 'bg-pink-500 text-white border-pink-500 shadow-md scale-102'
                            : 'bg-pink-50/60 border-pink-200 text-pink-950 hover:bg-pink-100/60'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedNeed === opt && <Heart size={14} className="fill-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Heart Word (Optional) */}
              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-pink-950">
                    Ek word mein batao... abhi dil mein kya hai? ❤️
                  </h3>
                  <p className="text-xs text-pink-700 italic mb-2">(Optional)</p>
                  <input
                    type="text"
                    value={heartWord}
                    onChange={(e) => setHeartWord(e.target.value)}
                    placeholder="Type what's in your heart..."
                    className="w-full p-4 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 font-bold text-center text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              )}

              {/* Step 5: Share Message (Optional) */}
              {step === 5 && (
                <div className="space-y-3 animate-fadeIn">
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-pink-950">
                    Kya tum kuch share karna chahti ho? 💌
                  </h3>
                  <p className="text-xs text-pink-700 italic mb-1">(Optional)</p>
                  <textarea
                    rows={3}
                    value={sharedMessage}
                    onChange={(e) => setSharedMessage(e.target.value)}
                    placeholder="Anything you want to tell me..."
                    className="w-full p-4 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                  />
                </div>
              )}

            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <p className="text-xs font-bold text-rose-600 animate-bounce">
                {validationError}
              </p>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-pink-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider hover:bg-pink-200 flex items-center space-x-1 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center space-x-1.5 ml-auto"
              >
                <span>{step === 5 ? 'Enter My World ❤️' : 'Continue'}</span>
                {step < 5 ? <ArrowRight size={14} /> : <Sparkles size={14} />}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
