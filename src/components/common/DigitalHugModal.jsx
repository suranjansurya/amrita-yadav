import React, { useState, useEffect, useRef } from 'react';
import {
  fetchUserHeartHistory,
  getUserHugCount,
  incrementUserHugCount,
  fetchComfortMessages,
} from '../../lib/supabase';
import { Heart, Moon, X, RefreshCw, Sun, Pause, Play, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

const MOOD_HUG_MESSAGES = {
  '😊 Happy': 'Keep that beautiful smile going. ✨❤️',
  '😌 Peaceful': 'Stay in this peaceful little moment. 🌸',
  '😐 Okay': "Some days are simply okay. And that's perfectly okay. ❤️",
  '😔 Low': "You don't have to pretend you're okay here. Take a breath. I'm sending you a hug. 🤍",
  '😴 Tired': 'Enough for today. Rest a little and be gentle with yourself. 🌙',
};

const COMFORT_FALLBACK_MESSAGES = [
  "You don't have to have everything figured out today. 🤍",
  "One difficult moment doesn't define your whole day. 🌙",
  'Be gentle with your heart—you are doing better than you think. 🌸',
  'Leave the heavy parts of today behind. Tomorrow is a brand new breath. ✨',
];

export function DigitalHugModal({ isOpen, onClose, currentUser }) {
  const [activeTab, setActiveTab] = useState('hug'); // 'hug' | 'comfort'
  const [hugCount, setHugCount] = useState(0);
  const [userMood, setUserMood] = useState('😊 Happy');
  const [comfortMsgs, setComfortMsgs] = useState([]);
  const [currentComfortIdx, setCurrentComfortIdx] = useState(0);

  // Hug Animation State
  const [isHugging, setIsHugging] = useState(false);

  // Guided Breathing State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // 'Inhale' | 'Hold' | 'Exhale'
  const [breathCircleScale, setBreathCircleScale] = useState(1);

  const breathTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadHugData();
    }
    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [isOpen]);

  const loadHugData = async () => {
    try {
      const uId = currentUser?.userId || 'usr-amritayadav';
      const [count, hData, cData] = await Promise.all([
        getUserHugCount(uId),
        fetchUserHeartHistory(uId),
        fetchComfortMessages({ includeInactive: false }),
      ]);

      setHugCount(count);
      if (hData.length > 0 && hData[0].mood) {
        setUserMood(hData[0].mood);
      }
      setComfortMsgs(cData.length > 0 ? cData : COMFORT_FALLBACK_MESSAGES.map((m) => ({ message: m })));

      triggerHugEffect();
    } catch (e) {
      console.warn('[DigitalHugModal] Load error:', e);
    }
  };

  const triggerHugEffect = async () => {
    setIsHugging(true);
    const uId = currentUser?.userId || 'usr-amritayadav';
    const newCount = await incrementUserHugCount(uId);
    setHugCount(newCount);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFB6C1', '#FF69B4', '#FFF0F5'],
    });

    setTimeout(() => {
      setIsHugging(false);
    }, 2000);
  };

  // Guided Breathing Animation Controller (Inhale 4s -> Hold 2s -> Exhale 4s)
  const startBreathing = () => {
    setIsBreathing(true);
    runBreathingCycle();
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    setBreathPhase('Inhale');
    setBreathCircleScale(1);
  };

  const runBreathingCycle = () => {
    let step = 0;
    setBreathPhase('Breathe In...');
    setBreathCircleScale(1.4);

    breathTimerRef.current = setInterval(() => {
      step = (step + 1) % 10; // 10 second total loop (4s in, 2s hold, 4s out)
      if (step < 4) {
        setBreathPhase('Breathe In...');
        setBreathCircleScale(1.4);
      } else if (step < 6) {
        setBreathPhase('Hold...');
        setBreathCircleScale(1.4);
      } else {
        setBreathPhase('Breathe Out...');
        setBreathCircleScale(1);
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/45 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-center relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Back to My World"
        >
          <X size={18} />
        </button>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <button
            onClick={() => { setActiveTab('hug'); stopBreathing(); }}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'hug' ? 'bg-pink-500 text-white shadow-md' : 'bg-pink-100 text-pink-800'
            }`}
          >
            <Heart size={13} className="fill-white" />
            <span>🤗 Digital Hug</span>
          </button>

          <button
            onClick={() => { setActiveTab('comfort'); triggerHugEffect(); }}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'comfort' ? 'bg-pink-500 text-white shadow-md' : 'bg-pink-100 text-pink-800'
            }`}
          >
            <Moon size={13} />
            <span>🌙 Comfort Mode</span>
          </button>
        </div>

        {/* Tab 1: Digital Hug 🤗 */}
        {activeTab === 'hug' && (
          <div className="space-y-6 text-center animate-fadeIn">
            
            {/* Animated Glowing Heart Hug Visual */}
            <div className="relative py-8 flex flex-col items-center justify-center">
              <div className={`w-32 h-32 rounded-full bg-pink-200/80 absolute inset-0 m-auto transition-transform duration-1000 ${
                isHugging ? 'animate-ping scale-150 bg-rose-300/60' : ''
              }`} />

              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white flex flex-col items-center justify-center relative z-10 shadow-xl transform transition-transform hover:scale-110">
                <Heart size={52} className={`fill-white transition-transform ${isHugging ? 'animate-bounce' : ''}`} />
              </div>
            </div>

            {/* Emotional Hug Message & Counter */}
            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose">
                {isHugging ? 'Come here... 🤗❤️' : 'Feel a little better? ❤️'}
              </h2>

              <p className="font-script text-2xl text-pink-800 leading-relaxed italic bg-pink-50/70 p-4 rounded-2xl border border-pink-100">
                "{MOOD_HUG_MESSAGES[userMood] || 'Sending you the biggest little hug. ❤️'}"
              </p>

              <p className="text-xs font-bold text-pink-700 bg-pink-100/70 py-1.5 px-4 rounded-full inline-block">
                You've received <strong className="text-pink-950">{hugCount}</strong> little hugs here. 🤗❤️
              </p>
            </div>

            {/* Hug Action Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={triggerHugEffect}
                disabled={isHugging}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <Heart size={14} className="fill-white" />
                <span>🤗 Send Me a Hug Again</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('comfort')}
                className="px-5 py-3 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5"
              >
                <Moon size={14} />
                <span>🌙 Comfort Mode</span>
              </button>
            </div>

            <div className="pt-2">
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

        {/* Tab 2: 🌙 Comfort Mode & Guided Breathing */}
        {activeTab === 'comfort' && (
          <div className="space-y-6 text-center animate-fadeIn">
            
            <div className="space-y-1">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-pink-950">
                Take a little moment for yourself. 🌙
              </h2>
              <p className="text-xs text-pink-700 font-semibold">
                Slow down your thoughts with guided calm breathing
              </p>
            </div>

            {/* Guided Breathing Circle Animation */}
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <div
                style={{ transform: `scale(${breathCircleScale})` }}
                className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 border-2 border-pink-400 shadow-xl flex items-center justify-center transition-transform duration-1000"
              >
                <span className="font-heading font-extrabold text-sm text-pink-950 animate-pulse">
                  {isBreathing ? breathPhase : 'Ready'}
                </span>
              </div>

              <div className="flex gap-2">
                {!isBreathing ? (
                  <button
                    onClick={startBreathing}
                    className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-pink-600 flex items-center space-x-1"
                  >
                    <Play size={13} />
                    <span>Start Breathing 🌙</span>
                  </button>
                ) : (
                  <button
                    onClick={stopBreathing}
                    className="px-5 py-2.5 rounded-full bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-rose-600 flex items-center space-x-1"
                  >
                    <Pause size={13} />
                    <span>Stop Guided Breathing</span>
                  </button>
                )}
              </div>
            </div>

            {/* Comfort Message Rotating Card */}
            {comfortMsgs.length > 0 && (
              <div className="p-5 rounded-2xl bg-pink-50/70 border border-pink-100 shadow-xs space-y-2 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-800 block">
                  Gentle Comfort Message
                </span>
                <p className="font-script text-xl text-pink-950 italic">
                  "{comfortMsgs[currentComfortIdx]?.message || comfortMsgs[0]?.message}"
                </p>

                {comfortMsgs.length > 1 && (
                  <button
                    onClick={() => setCurrentComfortIdx((prev) => (prev + 1) % comfortMsgs.length)}
                    className="text-[11px] font-bold text-pink-600 hover:text-pink-900 underline block pt-1"
                  >
                    Next Comfort Message →
                  </button>
                )}
              </div>
            )}

            <div className="pt-2">
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
