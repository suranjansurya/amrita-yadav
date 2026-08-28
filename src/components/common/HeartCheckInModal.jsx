import React, { useState, useEffect } from 'react';
import { useTimeBasedGreeting } from '../../hooks/useTimeBasedGreeting';
import { saveOrUpdateHeartCheckIn, saveUserActivity, getTodayDateKey } from '../../lib/supabase';
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

  const uId = currentUser?.userId || 'amritayadav';
  const todayKey = getTodayDateKey();

  // Restore Partial Completion Progress for Today
  useEffect(() => {
    try {
      const draftStr = localStorage.getItem(`amrita_daily_checkin_draft_${uId}_${todayKey}`);
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        if (draft) {
          if (draft.step) setStep(draft.step);
          if (draft.selectedMood) setSelectedMood(draft.selectedMood);
          if (draft.selectedDay) setSelectedDay(draft.selectedDay);
          if (draft.selectedNeed) setSelectedNeed(draft.selectedNeed);
          if (draft.heartWord) setHeartWord(draft.heartWord);
          if (draft.sharedMessage) setSharedMessage(draft.sharedMessage);
        }
      } else {
        // Track checkin started
        saveUserActivity({
          event_type: 'daily_checkin_started',
          title: '❤️ Daily Check-in Started',
          description: `User @${uId} started daily check-in for date ${todayKey}`,
          metadata: { checkin_date: todayKey, username: uId },
          user_id: uId,
        });
      }
    } catch (e) {
      console.warn('[HeartCheckIn] Draft restore warning:', e);
    }
  }, [uId, todayKey]);

  // Helper to save partial progress
  const saveDraft = (nextStep, moodVal, dayVal, needVal, wordVal, msgVal) => {
    try {
      const draft = {
        step: nextStep,
        selectedMood: moodVal !== undefined ? moodVal : selectedMood,
        selectedDay: dayVal !== undefined ? dayVal : selectedDay,
        selectedNeed: needVal !== undefined ? needVal : selectedNeed,
        heartWord: wordVal !== undefined ? wordVal : heartWord,
        sharedMessage: msgVal !== undefined ? msgVal : sharedMessage,
        checkin_date: todayKey,
      };
      localStorage.setItem(`amrita_daily_checkin_draft_${uId}_${todayKey}`, JSON.stringify(draft));
    } catch (e) {
      console.warn('[HeartCheckIn] Save draft warning:', e);
    }
  };

  const handleNextStep = () => {
    setValidationError('');

    if (step === 1) {
      if (!selectedMood) {
        setValidationError('Please select how you feel today ❤️');
        return;
      }
      saveDraft(2, selectedMood, selectedDay, selectedNeed, heartWord, sharedMessage);
      saveUserActivity({
        event_type: 'daily_question_answered',
        title: '💬 Question 1 Answered',
        description: `Q1: How are you feeling today? -> ${selectedMood}`,
        metadata: { question: 'How are you feeling today?', answer: selectedMood, checkin_date: todayKey },
        user_id: uId,
      });
    }

    if (step === 2) {
      if (!selectedDay) {
        setValidationError('Please select how your day was ✨');
        return;
      }
      saveDraft(3, selectedMood, selectedDay, selectedNeed, heartWord, sharedMessage);
      saveUserActivity({
        event_type: 'daily_question_answered',
        title: '💬 Question 2 Answered',
        description: `Q2: How does your day feel so far? -> ${selectedDay}`,
        metadata: { question: 'How does your day feel so far?', answer: selectedDay, checkin_date: todayKey },
        user_id: uId,
      });
    }

    if (step === 3) {
      if (!selectedNeed) {
        setValidationError('Please select what you need right now 💕');
        return;
      }
      saveDraft(4, selectedMood, selectedDay, selectedNeed, heartWord, sharedMessage);
      saveUserActivity({
        event_type: 'daily_question_answered',
        title: '💬 Question 3 Answered',
        description: `Q3: What does your heart need right now? -> ${selectedNeed}`,
        metadata: { question: 'What does your heart need right now?', answer: selectedNeed, checkin_date: todayKey },
        user_id: uId,
      });
    }

    if (step === 4) {
      saveDraft(5, selectedMood, selectedDay, selectedNeed, heartWord, sharedMessage);
      saveUserActivity({
        event_type: 'daily_question_answered',
        title: '💬 Question 4 Answered',
        description: `Q4: One word for your heart today -> ${heartWord || 'Peace'}`,
        metadata: { question: 'If you could pick one word for your heart today...', answer: heartWord || 'Peace', checkin_date: todayKey },
        user_id: uId,
      });
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
      const prevStep = step - 1;
      setStep(prevStep);
      saveDraft(prevStep, selectedMood, selectedDay, selectedNeed, heartWord, sharedMessage);
    }
  };

  const handleSubmitCheckIn = async () => {
    setIsSubmitting(true);

    try {
      // Save Consolidated Heart Check-in Record
      await saveOrUpdateHeartCheckIn({
        user_id: uId,
        mood: selectedMood,
        day_feeling: selectedDay,
        current_need: selectedNeed,
        heart_word: heartWord,
        shared_message: sharedMessage,
      });

      // Save Q5 activity
      saveUserActivity({
        event_type: 'daily_question_answered',
        title: '💬 Question 5 Answered',
        description: `Q5: Message -> ${sharedMessage || 'Stepping into world ❤️'}`,
        metadata: { question: 'Anything you want to leave here before you enter?', answer: sharedMessage || 'Stepping into world ❤️', checkin_date: todayKey },
        user_id: uId,
      });

      // Mark Daily Check-in Completed for Today & Clear Draft
      localStorage.setItem(`amrita_daily_checkin_completed_${uId}_${todayKey}`, 'true');
      sessionStorage.setItem(`amrita_daily_checkin_completed_${uId}_${todayKey}`, 'true');
      localStorage.removeItem(`amrita_daily_checkin_draft_${uId}_${todayKey}`);

      // Log Completion Activity
      saveUserActivity({
        event_type: 'daily_checkin_completed',
        title: '❤️ Daily Check-in Completed',
        description: `User @${uId} completed daily check-in for date ${todayKey}`,
        metadata: { checkin_date: todayKey, username: uId },
        user_id: uId,
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
              <Heart size={32} className="fill-pink-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-pink-950">
                Welcome back, {currentUser?.displayName || 'Amrita'} ❤️
              </h3>
              <p className="font-script text-2xl text-pink-800 leading-relaxed px-4">
                "{MOOD_RESPONSES[selectedMood] || 'Your heart is safe here. Step inside... ✨'}"
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-pink-700 animate-pulse block">
                Entering your little world... ✨
              </span>
            </div>
          </div>
        ) : (
          /* Multi-Step Onboarding Questionnaire (Steps 1 to 5) */
          <div className="space-y-6">
            
            {/* Step Indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-pink-700 border-b border-pink-100 pb-3">
              <span className="flex items-center space-x-1">
                <Heart size={14} className="fill-pink-400 text-pink-400" />
                <span>Daily Heart Check-in ({todayKey})</span>
              </span>
              <span>Step {step} of 5</span>
            </div>

            {/* Welcome Banner Header */}
            <div className="space-y-1">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-pink-950">
                Welcome back, {currentUser?.displayName || 'Amrita'} ❤️
              </h2>
              <p className="text-xs text-pink-700 font-semibold">
                Before you enter my little world today... how is your heart?
              </p>
            </div>

            {/* Step 1: Mood Question */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-heading font-bold text-base text-pink-900">
                  1. How are you feeling today?
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setSelectedMood(m);
                        saveDraft(1, m, selectedDay, selectedNeed, heartWord, sharedMessage);
                      }}
                      className={`p-3.5 rounded-2xl text-left font-bold text-xs transition-all flex items-center justify-between ${
                        selectedMood === m
                          ? 'bg-pink-500 text-white shadow-md scale-[1.01]'
                          : 'bg-pink-50 text-pink-900 border border-pink-100 hover:bg-pink-100'
                      }`}
                    >
                      <span>{m}</span>
                      {selectedMood === m && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Day Feeling Question */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-heading font-bold text-base text-pink-900">
                  2. How does your day feel so far?
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {DAY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDay(d);
                        saveDraft(2, selectedMood, d, selectedNeed, heartWord, sharedMessage);
                      }}
                      className={`p-3.5 rounded-2xl text-left font-bold text-xs transition-all flex items-center justify-between ${
                        selectedDay === d
                          ? 'bg-pink-500 text-white shadow-md scale-[1.01]'
                          : 'bg-pink-50 text-pink-900 border border-pink-100 hover:bg-pink-100'
                      }`}
                    >
                      <span>{d}</span>
                      {selectedDay === d && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Current Need Question */}
            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-heading font-bold text-base text-pink-900">
                  3. What does your heart need right now?
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {NEED_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setSelectedNeed(n);
                        saveDraft(3, selectedMood, selectedDay, n, heartWord, sharedMessage);
                      }}
                      className={`p-3.5 rounded-2xl text-left font-bold text-xs transition-all flex items-center justify-between ${
                        selectedNeed === n
                          ? 'bg-pink-500 text-white shadow-md scale-[1.01]'
                          : 'bg-pink-50 text-pink-900 border border-pink-100 hover:bg-pink-100'
                      }`}
                    >
                      <span>{n}</span>
                      {selectedNeed === n && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Heart Word Question */}
            {step === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-heading font-bold text-base text-pink-900">
                  4. If you could pick one word for your heart today...
                </h3>
                <input
                  type="text"
                  value={heartWord}
                  onChange={(e) => {
                    setHeartWord(e.target.value);
                    saveDraft(4, selectedMood, selectedDay, selectedNeed, e.target.value, sharedMessage);
                  }}
                  placeholder="e.g. Peaceful, Hopeful, Tired, Soft..."
                  className="w-full p-4 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 font-bold text-sm text-center focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            )}

            {/* Step 5: Shared Message Question */}
            {step === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-heading font-bold text-base text-pink-900">
                  5. Anything you want to leave here before you enter?
                </h3>
                <textarea
                  rows={3}
                  value={sharedMessage}
                  onChange={(e) => {
                    setSharedMessage(e.target.value);
                    saveDraft(5, selectedMood, selectedDay, selectedNeed, heartWord, e.target.value);
                  }}
                  placeholder="Write a quiet message... (Optional)"
                  className="w-full p-4 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                />
              </div>
            )}

            {validationError && (
              <p className="text-xs font-bold text-rose-600 animate-bounce">{validationError}</p>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-full bg-pink-100 text-pink-950 font-bold text-xs flex items-center space-x-1 hover:bg-pink-200"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <span>{step === 5 ? (isSubmitting ? 'Saving...' : 'Enter My World ❤️') : 'Next Question'}</span>
                {step < 5 && <ArrowRight size={14} />}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
