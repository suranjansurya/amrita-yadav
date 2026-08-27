import React, { useState, useEffect } from 'react';
import { defaultSecretCode, vaultCardsData } from '../../data/vaultData';
import { Lock, Unlock, Heart, Sparkles, X, KeyRound, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SecretVaultModal({ isOpen, onClose }) {
  const [isUnlocked, setIsUnlocked] = useState(
    sessionStorage.getItem('amrita_vault_unlocked') === 'true'
  );
  const [codeInput, setCodeInput] = useState('');
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [isUnlockingAnim, setIsUnlockingAnim] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('amrita_vault_unlocked') === 'true') {
      setIsUnlocked(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    const cleanInput = codeInput.trim().toLowerCase();
    const targetCode = defaultSecretCode.toLowerCase();

    if (cleanInput === targetCode || cleanInput === 'amrita' || cleanInput === 'soulmate') {
      setIsUnlockingAnim(true);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
      });

      setTimeout(() => {
        sessionStorage.setItem('amrita_vault_unlocked', 'true');
        setIsUnlocked(true);
        setIsUnlockingAnim(false);
        setWrongAttempt(false);
      }, 1200);
    } else {
      setWrongAttempt(true);
      setTimeout(() => setWrongAttempt(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border-2 border-pink-300 shadow-2xl relative bg-white/95 text-center transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Close Secret Vault"
        >
          <X size={18} />
        </button>

        {/* 1. Locked State Screen */}
        {!isUnlocked ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shadow-inner mb-3 transition-transform ${
                isUnlockingAnim ? 'scale-125 rotate-12 bg-pink-200' : ''
              }`}>
                {isUnlockingAnim ? <Unlock size={32} /> : <Lock size={32} />}
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-pink-700 block mb-1">
                Secret Vault 🔐
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose">
                Shhh... you found something special. 🤫❤️
              </h2>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4 max-w-xs mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Enter the secret word..."
                  className={`w-full p-3.5 pl-10 rounded-2xl bg-white border text-pink-950 font-bold text-center text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner ${
                    wrongAttempt ? 'border-pink-400 animate-bounce' : 'border-pink-200'
                  }`}
                />
                <KeyRound size={16} className="absolute left-3.5 top-4 text-pink-400" />
              </div>

              {wrongAttempt && (
                <p className="text-xs font-semibold text-pink-700 animate-pulse">
                  Not this one... try again ✨
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2 focus:outline-none"
              >
                <Sparkles size={16} />
                <span>Unlock ❤️</span>
              </button>
            </form>
          </div>
        ) : (
          /* 2. Unlocked Secret Content Cards View */
          <div className="space-y-6 animate-scaleUp">
            <div className="text-center">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Heart size={13} className="text-pink-600 fill-pink-400" />
                <span>Secret Unlocked</span>
              </div>
              
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose">
                You found the little secret I kept for you. ❤️
              </h2>
              <p className="font-script text-xl text-pink-700 mt-1">
                Tap any secret card below to open it... ✨
              </p>
            </div>

            {/* 4 Hidden Secret Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vaultCardsData.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setActiveCard(card)}
                  className="p-4 rounded-2xl bg-white/80 border border-pink-200 hover:bg-white hover:border-pink-300 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left group focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{card.symbol}</span>
                    <div>
                      <span className="font-heading font-bold text-sm text-pink-950 block">
                        {card.title}
                      </span>
                      <span className="text-[10px] text-pink-700 block">
                        {card.subtitle}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-pink-400 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Card Modal Detail */}
        {activeCard && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md animate-fadeIn">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border-2 border-pink-300 shadow-2xl relative bg-white text-center">
              <button
                onClick={() => setActiveCard(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200"
              >
                <X size={16} />
              </button>

              <span className="text-4xl block mb-2">{activeCard.symbol}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 block mb-1">
                {activeCard.title}
              </span>
              <h3 className="font-heading font-bold text-2xl text-pink-950 mb-3">
                "{activeCard.subtitle}"
              </h3>
              <p className="font-body text-sm sm:text-base text-pink-900 leading-relaxed italic bg-pink-50/70 p-4 rounded-2xl border border-pink-100">
                "{activeCard.content}"
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
