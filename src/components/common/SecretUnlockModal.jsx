import React, { useState, useEffect } from 'react';
import { fetchSecretUnlocks, evaluateUserProgress } from '../../lib/supabase';
import { Lock, Unlock, Sparkles, X, Gift, Heart, ArrowLeft, Eye, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SecretUnlockModal({ isOpen, onClose, currentUser }) {
  const [unlocks, setUnlocks] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedSecret, setSelectedSecret] = useState(null);
  const [helpRequirement, setHelpRequirement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSecretSystem();
    }
  }, [isOpen]);

  const loadSecretSystem = async () => {
    setIsLoading(true);
    try {
      const uId = currentUser?.userId || 'usr-amritayadav';
      const [uData, pData] = await Promise.all([
        fetchSecretUnlocks({ includeInactive: false }),
        evaluateUserProgress(uId),
      ]);

      setUnlocks(uData);
      setProgress(pData);
    } catch (e) {
      console.warn('[SecretUnlockModal] Load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getRequirementProgress = (reqType) => {
    return progress[reqType] || 0;
  };

  const isUnlocked = (u) => {
    const currentVal = getRequirementProgress(u.reqType);
    return currentVal >= (u.reqVal || 1);
  };

  const unlockedCount = unlocks.filter(isUnlocked).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/45 backdrop-blur-md animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-2xl w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-left relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Back to My World"
        >
          <X size={18} />
        </button>

        {/* Modal Header & Journey Progress Summary */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shadow-inner">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-pink-950">
                🔐 Little Secrets
              </h2>
              <p className="text-xs text-pink-700 font-semibold">
                Some things are meant to be discovered... ✨
              </p>
            </div>
          </div>

          {/* Journey Summary Pill */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-heading font-bold text-xs uppercase text-pink-900 tracking-wider">
                Your Journey ❤️
              </span>
              <p className="text-xs font-semibold text-pink-700">
                Unlocked: <strong className="text-pink-950 text-sm">{unlockedCount} / {unlocks.length}</strong>
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-white text-pink-800 font-bold text-xs shadow-xs border border-pink-200">
              {unlockedCount === unlocks.length ? '✨ All Unlocked!' : 'Keep Exploring 🌸'}
            </span>
          </div>
        </div>

        {/* 10 Milestone Secret Cards Grid */}
        {isLoading ? (
          <div className="py-12 text-center text-pink-600 font-semibold text-sm animate-pulse">
            Checking your secret milestones... ✨
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unlocks.map((u) => {
              const unlocked = isUnlocked(u);
              const currentVal = getRequirementProgress(u.reqType);

              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    unlocked
                      ? 'bg-pink-50/90 border-pink-300 shadow-sm hover:shadow-md'
                      : 'bg-gray-50/70 border-gray-200 opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-heading font-bold text-base text-pink-950">
                      {u.name}
                    </span>

                    <span className={`p-1.5 rounded-full text-xs font-bold ${
                      unlocked ? 'bg-pink-100 text-pink-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {unlocked ? <Unlock size={14} /> : <Lock size={14} />}
                    </span>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px] font-bold text-pink-800">
                      <span>{unlocked ? '🔓 Unlocked! ❤️' : '🔒 Locked'}</span>
                      <span>{Math.min(currentVal, u.reqVal)} / {u.reqVal}</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-pink-100 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, (currentVal / u.reqVal) * 100)}%` }}
                        className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {unlocked ? (
                      <button
                        onClick={() => setSelectedSecret(u)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-xs hover:scale-102 transition-all flex items-center justify-center space-x-1"
                      >
                        <Sparkles size={13} />
                        <span>✨ Open Secret</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setHelpRequirement(u)}
                        className="w-full py-2 rounded-xl bg-pink-100 text-pink-800 font-bold text-xs uppercase tracking-wider hover:bg-pink-200 transition-colors flex items-center justify-center space-x-1"
                      >
                        <HelpCircle size={13} />
                        <span>How to unlock?</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal 1: Secret Content Reader */}
        {selectedSecret && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-md">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full bg-white border-2 border-pink-300 shadow-2xl text-center space-y-4 animate-scaleUp">
              <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles size={28} />
              </div>

              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold uppercase tracking-wider">
                {selectedSecret.name}
              </span>

              <h3 className="font-heading font-extrabold text-2xl text-pink-950">
                {selectedSecret.title || 'Secret Unlocked! ❤️'}
              </h3>

              <p className="font-script text-2xl text-pink-800 leading-relaxed italic bg-pink-50 p-4 rounded-2xl border border-pink-100">
                "{selectedSecret.message}"
              </p>

              {selectedSecret.image && (
                <div className="rounded-2xl overflow-hidden shadow-md max-h-48 w-full">
                  <img src={selectedSecret.image} alt="Secret" className="w-full h-full object-cover" />
                </div>
              )}

              <button
                onClick={() => setSelectedSecret(null)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Close Secret ✨
              </button>
            </div>
          </div>
        )}

        {/* Modal 2: Requirement Help Details */}
        {helpRequirement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-md">
            <div className="glass-panel p-6 rounded-3xl max-w-sm w-full bg-white border-2 border-pink-300 shadow-2xl text-center space-y-4 animate-scaleUp">
              <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
                <Lock size={22} />
              </div>

              <h3 className="font-heading font-extrabold text-lg text-pink-950">
                How to Unlock {helpRequirement.name}?
              </h3>

              <p className="text-xs text-pink-800 font-semibold bg-pink-50 p-4 rounded-2xl border border-pink-100">
                Complete requirement: <strong>{helpRequirement.reqVal}</strong> of type <em>{helpRequirement.reqType}</em>. Keep checking in daily! ❤️
              </p>

              <button
                onClick={() => setHelpRequirement(null)}
                className="w-full py-2.5 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider"
              >
                Got It 🌸
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
