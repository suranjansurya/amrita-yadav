import React, { useState } from 'react';
import { openWhenData } from '../../data/openWhenData';
import { saveUserActivity, saveUserFavoriteMemory } from '../../lib/supabase';
import { Mail, Heart, Sparkles, X, ArrowLeft, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export function OpenWhenModal({ isOpen, onClose }) {
  const [selectedEnvelope, setSelectedEnvelope] = useState(null);
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);
  const [keptStatus, setKeptStatus] = useState(false);

  if (!isOpen) return null;

  const handleOpenEnvelope = (env) => {
    setIsOpeningAnim(true);
    setSelectedEnvelope(env);
    setKeptStatus(false);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
    });

    // Phase 32 Activity Tracking
    saveUserActivity({
      event_type: 'open_when_opened',
      title: '💌 Opened Letter: ' + env.title,
      description: `Opened: ${env.title}`,
      metadata: {
        question: `Open When... ${env.title}`,
        answer: env.content,
      },
    });

    setTimeout(() => {
      setIsOpeningAnim(false);
    }, 600);
  };

  const handleKeepFavorite = async () => {
    if (!selectedEnvelope) return;
    try {
      await saveUserFavoriteMemory({
        user_id: 'usr-amritayadav',
        memory_id: selectedEnvelope.id,
        memory_data: {
          title: selectedEnvelope.title,
          short_description: selectedEnvelope.content,
          category: '💌 Open When Letter',
        },
      });
      setKeptStatus(true);
      setTimeout(() => setKeptStatus(false), 3000);
    } catch (e) {
      console.warn('[OpenWhenModal] Save favorite error:', e);
    }
  };

  const handleBackToEnvelopes = () => {
    setSelectedEnvelope(null);
    setKeptStatus(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border-2 border-pink-300 shadow-2xl relative bg-white/95 text-center transition-all duration-300">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Close Open When"
        >
          <X size={18} />
        </button>

        {/* 1. Selection Grid View (5 Envelopes) */}
        {!selectedEnvelope ? (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Mail size={13} className="text-pink-600" />
                <span>Special Letters</span>
              </div>
              
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose">
                Open When... 💌
              </h2>
              <p className="font-script text-xl text-pink-700 mt-1">
                Pick the letter that matches how you feel right now.
              </p>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {openWhenData.map((env) => (
                <button
                  key={env.id}
                  onClick={() => handleOpenEnvelope(env)}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-pink-50/80 to-pink-100/80 border border-pink-200/80 hover:border-pink-300 hover:shadow-md hover:scale-[1.02] transition-all flex items-center justify-between text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-pink-200/60 text-pink-700 flex items-center justify-center group-hover:bg-pink-300/80 transition-colors">
                      <Mail size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-pink-800 block">
                        Open When...
                      </span>
                      <span className="font-heading font-bold text-base text-pink-950">
                        {env.title}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-pink-600 opacity-80 group-hover:opacity-100">
                    Open →
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 2. Unfolded Letter Reader View */
          <div className="space-y-6 animate-scaleUp">
            <button
              onClick={handleBackToEnvelopes}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-800 text-xs font-bold hover:bg-pink-200 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>All Envelopes</span>
            </button>

            {isOpeningAnim ? (
              <div className="py-12 space-y-3">
                <Mail size={36} className="mx-auto text-pink-500 animate-bounce" />
                <p className="font-script text-xl text-pink-800">Unfolding your letter...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-b from-pink-50/90 to-pink-100/50 border border-pink-200/80 shadow-inner text-left space-y-3">
                  <div className="flex items-center justify-between border-b border-pink-200/60 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-800">
                      Open When... {selectedEnvelope.title}
                    </span>
                    <Sparkles size={16} className="text-pink-500" />
                  </div>

                  <p className="font-script text-2xl text-pink-950 leading-relaxed italic pt-1 whitespace-pre-line">
                    "{selectedEnvelope.content}"
                  </p>
                </div>

                {keptStatus && (
                  <p className="text-xs font-bold text-green-700 animate-bounce">
                    Saved to your favorites ❤️
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleKeepFavorite}
                    className="flex-1 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1 hover:bg-pink-200 transition-colors"
                  >
                    <Heart size={14} className="fill-rose-500 text-rose-500" />
                    <span>❤️ Keep this</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToEnvelopes}
                    className="flex-1 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                  >
                    Close Letter ✨
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
