import React, { useState, useEffect } from 'react';
import {
  fetchConstellations,
  getUserStarDiscoveries,
  saveUserStarDiscovery,
  saveUserFavoriteMemory,
  evaluateUserProgress,
} from '../../lib/supabase';
import { Star, Sparkles, X, Heart, Lock, Unlock, Moon, Award, Compass, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ConstellationModal({ isOpen, onClose, currentUser }) {
  const [constellations, setConstellations] = useState([]);
  const [discoveredStarIds, setDiscoveredStarIds] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [selectedStar, setSelectedStar] = useState(null);
  const [completedConstellation, setCompletedConstellation] = useState(null);
  const [activeTab, setActiveTab] = useState('sky'); // 'sky' | 'discoveries'
  const [saveMsg, setSaveMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadConstellationData();
    }
  }, [isOpen]);

  const loadConstellationData = async () => {
    setIsLoading(true);
    try {
      const uId = currentUser?.userId || 'usr-amritayadav';
      const [cData, dData, pData] = await Promise.all([
        fetchConstellations({ includeInactive: false }),
        getUserStarDiscoveries(uId),
        evaluateUserProgress(uId),
      ]);

      setConstellations(cData);
      setDiscoveredStarIds(dData);
      setUserProgress(pData);
    } catch (e) {
      console.warn('[ConstellationModal] Load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const isStarLocked = (star) => {
    if (star.type !== 'locked') return false;
    const reqVal = star.reqVal || 1;
    const userVal = userProgress[star.reqType] || 0;
    return userVal < reqVal;
  };

  const handleSelectStar = async (star, constGroup) => {
    const uId = currentUser?.userId || 'usr-amritayadav';

    if (isStarLocked(star)) {
      setSelectedStar({
        ...star,
        isLockedNotice: true,
      });
      return;
    }

    setSelectedStar(star);
    setSaveMsg('');

    // Save star discovery
    const updated = await saveUserStarDiscovery(uId, star.id);
    setDiscoveredStarIds(updated);

    // Check if whole constellation is completed
    const allStarIds = constGroup.stars.map((s) => s.id);
    const isNowComplete = allStarIds.every((id) => updated.includes(id));

    if (isNowComplete) {
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FFB6C1', '#FF69B4', '#E6E6FA'],
      });
      setCompletedConstellation(constGroup);
    }
  };

  const handleSaveFavorite = async () => {
    if (!selectedStar) return;
    try {
      await saveUserFavoriteMemory({
        user_id: currentUser?.userId || 'usr-amritayadav',
        memory_id: selectedStar.id,
        memory_data: {
          title: selectedStar.name,
          short_description: selectedStar.message,
          category: '🌌 Constellation Star',
        },
      });
      setSaveMsg('Saved to your favorites ❤️');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      console.warn('[ConstellationModal] Save favorite error:', e);
    }
  };

  const handleFindAnotherStar = () => {
    setActiveTab('sky');
    for (const c of constellations) {
      for (const s of c.stars) {
        if (!discoveredStarIds.includes(s.id) && !isStarLocked(s)) {
          handleSelectStar(s, c);
          return;
        }
      }
    }
  };

  if (!isOpen) return null;

  const allStars = constellations.flatMap((c) => c.stars);
  const totalStars = allStars.length;
  const discoveredCount = discoveredStarIds.length;
  const discoveredStarList = allStars.filter((s) => discoveredStarIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/60 backdrop-blur-lg animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-4xl w-full border-2 border-pink-300 shadow-2xl bg-slate-950/95 text-white text-left relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none transition-colors"
          title="Back to My World"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles size={22} className="text-pink-400 animate-spin" />
              <h2 className="font-heading font-extrabold text-2xl text-pink-200">
                Our Little Sky 🌌
              </h2>
            </div>
            <p className="text-xs text-pink-300 font-semibold">
              Every little star has something waiting for you.
            </p>
          </div>

          {/* Top-Right Progress Pill: ⭐ 7 / 25 */}
          <div className="flex items-center space-x-3 text-xs font-bold text-pink-200 bg-white/10 px-4 py-2 rounded-full border border-white/10">
            <span className="flex items-center space-x-1">
              <Star size={14} className="fill-pink-400 text-pink-400" />
              <strong className="text-white text-sm">{discoveredCount} / {totalStars}</strong>
            </span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setActiveTab('sky')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'sky' ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-pink-300'
            }`}
          >
            🌌 Sky View
          </button>
          <button
            onClick={() => setActiveTab('discoveries')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'discoveries' ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-pink-300'
            }`}
          >
            ✨ My Discoveries ({discoveredCount})
          </button>
        </div>

        {/* Tab 1: Interactive Sky View */}
        {activeTab === 'sky' && (
          <div>
            {isLoading ? (
              <div className="py-20 text-center text-pink-300 font-semibold text-sm animate-pulse">
                Lighting up the stars... ✨
              </div>
            ) : (
              <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-slate-950 via-purple-950/40 to-slate-950 border border-pink-500/20 overflow-hidden shadow-inner flex items-center justify-center">
                
                {/* SVG Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {constellations.map((c) =>
                    c.stars.map((s, idx) => {
                      if (idx === 0) return null;
                      const prev = c.stars[idx - 1];
                      const sDiscovered = discoveredStarIds.includes(s.id);
                      const pDiscovered = discoveredStarIds.includes(prev.id);

                      return (
                        <line
                          key={`line-${s.id}`}
                          x1={`${prev.x}%`}
                          y1={`${prev.y}%`}
                          x2={`${s.x}%`}
                          y2={`${s.y}%`}
                          stroke={sDiscovered && pDiscovered ? '#FFB6C1' : 'rgba(255, 255, 255, 0.15)'}
                          strokeWidth={sDiscovered && pDiscovered ? '2' : '1'}
                          strokeDasharray={sDiscovered && pDiscovered ? 'none' : '4'}
                        />
                      );
                    })
                  )}
                </svg>

                {/* Interactive Stars Grid */}
                {constellations.map((c) =>
                  c.stars.map((star) => {
                    const isDiscovered = discoveredStarIds.includes(star.id);
                    const locked = isStarLocked(star);

                    return (
                      <button
                        key={star.id}
                        onClick={() => handleSelectStar(star, c)}
                        style={{ left: `${star.x}%`, top: `${star.y}%` }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none cursor-pointer"
                        title={star.name}
                      >
                        <div className={`relative flex items-center justify-center transition-transform hover:scale-125 ${
                          isDiscovered ? 'scale-110' : 'scale-100'
                        }`}>
                          <div className={`absolute rounded-full animate-ping ${
                            isDiscovered ? 'w-8 h-8 bg-pink-400/40' : locked ? 'w-4 h-4 bg-gray-500/20' : 'w-5 h-5 bg-white/20'
                          }`} />
                          
                          {locked ? (
                            <Lock size={13} className="text-gray-400" />
                          ) : (
                            <Star
                              size={isDiscovered ? 22 : 16}
                              className={`transition-colors ${
                                isDiscovered
                                  ? 'fill-pink-300 text-pink-300 shadow-lg'
                                  : 'fill-white/70 text-white/70 hover:fill-pink-200'
                              }`}
                            />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-bold text-pink-300/80 pointer-events-none">
                  <span>Tap any glowing star to reveal its secret message ✨</span>
                  <span>Constellation Sky</span>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={handleFindAnotherStar}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <Compass size={14} />
                <span>✨ Find Another Star</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-pink-400 hover:text-pink-200 underline focus:outline-none"
              >
                ← Back to My World
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: ✨ My Discoveries View */}
        {activeTab === 'discoveries' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-heading font-bold text-lg text-pink-200 border-b border-white/10 pb-2">
              Your Discovered Stars ({discoveredStarList.length})
            </h3>

            {discoveredStarList.length === 0 ? (
              <div className="py-12 text-center text-pink-300 font-semibold text-sm">
                You haven't discovered any stars yet. Explore the sky! 🌌✨
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {discoveredStarList.map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                    <span className="font-heading font-bold text-sm text-pink-300 flex items-center space-x-1">
                      <Star size={14} className="fill-pink-400 text-pink-400" />
                      <span>{s.name}</span>
                    </span>
                    <p className="text-xs text-white/90 italic">"{s.message}"</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-white/10 text-right">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-pink-400 hover:text-pink-200 underline focus:outline-none"
              >
                ← Back to My World
              </button>
            </div>
          </div>
        )}

        {/* Modal 1: Revealed Star Content Reader */}
        {selectedSecret && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full bg-white text-pink-950 border-2 border-pink-300 shadow-2xl text-center space-y-4 animate-scaleUp">
              
              {selectedSecret.isLockedNotice ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner">
                    <Lock size={28} />
                  </div>
                  <h3 className="font-heading font-extrabold text-xl text-pink-950">
                    🔒 This star is waiting for you...
                  </h3>
                  <p className="text-xs font-bold text-pink-800 bg-pink-50 p-4 rounded-2xl border border-pink-100">
                    Complete requirement: <strong>{selectedSecret.reqVal}</strong> of type <em>{selectedSecret.reqType}</em> to unlock! ❤️
                  </p>
                  <button
                    onClick={() => setSelectedSecret(null)}
                    className="w-full py-2.5 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider"
                  >
                    Got It 🌸
                  </button>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner">
                    <Star size={28} className="fill-pink-500" />
                  </div>

                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold uppercase tracking-wider">
                    {selectedSecret.name}
                  </span>

                  <h3 className="font-heading font-extrabold text-2xl text-pink-950">
                    ✨ You found something...
                  </h3>

                  <p className="font-script text-2xl text-pink-800 leading-relaxed italic bg-pink-50 p-4 rounded-2xl border border-pink-100">
                    "{selectedSecret.message}"
                  </p>

                  {saveMsg && <p className="text-xs font-bold text-green-700 animate-bounce">{saveMsg}</p>}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveFavorite}
                      className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1"
                    >
                      <Heart size={13} className="fill-rose-500 text-rose-500" />
                      <span>❤️ Save This</span>
                    </button>

                    <button
                      onClick={() => setSelectedSecret(null)}
                      className="w-1/2 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md"
                    >
                      Close ✨
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

        {/* Modal 2: Constellation Completion Reward Banner */}
        {completedConstellation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full bg-white text-pink-950 border-2 border-pink-300 shadow-2xl text-center space-y-4 animate-scaleUp">
              <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner">
                <Award size={28} />
              </div>

              <h3 className="font-heading font-extrabold text-2xl text-pink-950">
                {completedConstellation.rewardTitle || '✨ A constellation has come alive!'}
              </h3>

              <p className="font-script text-2xl text-pink-800 leading-relaxed italic bg-pink-50 p-4 rounded-2xl border border-pink-100">
                "{completedConstellation.rewardMessage}"
              </p>

              <button
                onClick={() => setCompletedConstellation(null)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Claim Reward ❤️
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
