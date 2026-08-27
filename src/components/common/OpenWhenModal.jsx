import React, { useState } from 'react';
import { openWhenData } from '../../data/openWhenData';
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

    setTimeout(() => {
      setIsOpeningAnim(false);
    }, 600);
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
                Jab bhi dil kare, ek chhota sa message tumhare liye.
              </p>
            </div>

            {/* 5 Envelopes Stack */}
            <div className="space-y-3">
              {openWhenData.map((env) => (
                <button
                  key={env.id}
                  onClick={() => handleOpenEnvelope(env)}
                  aria-label={env.title}
                  className="w-full p-4 rounded-2xl bg-white/80 border border-pink-200 hover:bg-white hover:border-pink-300 shadow-sm hover:shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-between group text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl p-2 bg-pink-50 rounded-xl group-hover:scale-110 transition-transform">
                      {env.symbol}
                    </span>
                    <span className="font-heading font-bold text-sm text-pink-950">
                      {env.title}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                    <Mail size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 2. Opened Letter Card View */
          <div className="space-y-6 animate-scaleUp">
            <div className="text-center">
              <span className="text-4xl block mb-2">{selectedEnvelope.symbol}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 block mb-1">
                {selectedEnvelope.title}
              </span>
            </div>

            {/* Opened Letter Paper Container */}
            <div className={`p-6 sm:p-8 rounded-3xl bg-pink-50/70 border border-pink-200 shadow-inner relative transition-transform ${
              isOpeningAnim ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100'
            }`}>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-pink-300">
                <Heart size={20} className="fill-pink-200" />
              </div>

              <p className="font-heading font-extrabold text-xl sm:text-2xl text-pink-950 leading-relaxed pt-2">
                "{selectedEnvelope.message}"
              </p>
            </div>

            {/* Action Buttons: "Keep this with you ❤️" & "Back ✨" */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => setKeptStatus(true)}
                className={`w-full sm:w-1/2 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 focus:outline-none ${
                  keptStatus
                    ? 'bg-green-600 text-white'
                    : 'bg-gradient-to-r from-pink-400 to-rose-400 text-white hover:scale-105 shadow-md'
                }`}
              >
                {keptStatus ? (
                  <>
                    <Check size={14} />
                    <span>Kept in Heart ❤️</span>
                  </>
                ) : (
                  <>
                    <Heart size={14} className="fill-white" />
                    <span>Keep this with you ❤️</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBackToEnvelopes}
                className="w-full sm:w-1/2 py-3.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors focus:outline-none"
              >
                <ArrowLeft size={14} />
                <span>Back ✨</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
