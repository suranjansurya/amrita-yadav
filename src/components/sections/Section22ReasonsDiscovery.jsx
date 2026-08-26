import React, { useState } from 'react';
import { reasonsData, bonusReasonsData } from '../../data/reasonsData';
import { ReasonCard3D } from '../common/ReasonCard3D';
import { ReasonProgress } from '../common/ReasonProgress';
import { MotionWrapper } from '../animations/MotionWrapper';
import { Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section22ReasonsDiscovery({ onSelectReason50 }) {
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [activeBonus, setActiveBonus] = useState(null);
  const [milestoneMsg, setMilestoneMsg] = useState(null);

  const handleDiscover = (reason) => {
    if (!discoveredIds.includes(reason.id)) {
      const updated = [...discoveredIds, reason.id];
      setDiscoveredIds(updated);

      // Milestone Popups at 10, 20, 30, 40, 50
      const count = updated.length;
      if (count === 10) setMilestoneMsg('✨ 10 little reasons discovered!');
      else if (count === 20) setMilestoneMsg('🌸 20 reasons unveiled!');
      else if (count === 30) setMilestoneMsg('💫 30 reasons floating in your world!');
      else if (count === 40) setMilestoneMsg('❤️ Almost there... 40 reasons!');
      else if (count === 50) {
        setMilestoneMsg('🎉 All 50 reasons discovered!');
        if (onSelectReason50) onSelectReason50();
      }

      if (milestoneMsg) {
        setTimeout(() => setMilestoneMsg(null), 4000);
      }
    }
  };

  const handleSurpriseMe = () => {
    const undiscovered = reasonsData.filter((r) => !discoveredIds.includes(r.id));
    if (undiscovered.length > 0) {
      const randomReason = undiscovered[Math.floor(Math.random() * undiscovered.length)];
      handleDiscover(randomReason);
    } else {
      // If all 50 discovered, select random reason
      const randomReason = reasonsData[Math.floor(Math.random() * reasonsData.length)];
      handleDiscover(randomReason);
    }
  };

  const handleDiscoverNext = () => {
    handleSurpriseMe();
  };

  return (
    <section className="relative min-h-screen w-full px-4 py-20 z-10 select-none">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        
        {/* Progress System Bar */}
        <div className="w-full sticky top-6 z-30 mb-8">
          <ReasonProgress
            discoveredCount={discoveredIds.length}
            totalCount={50}
            onSurpriseMe={handleSurpriseMe}
            onDiscoverNext={handleDiscoverNext}
          />
        </div>

        {/* Milestone Banner Notification */}
        {milestoneMsg && (
          <div className="glass-panel p-3 px-6 rounded-full bg-white/90 border-2 border-pink-300 shadow-xl mb-6 animate-bounce text-center">
            <span className="font-heading font-bold text-base text-pink-950">{milestoneMsg}</span>
          </div>
        )}

        {/* 5 Hidden Bonus Reasons Targets */}
        <div className="w-full flex items-center justify-center space-x-6 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-700">Bonus Whispers:</span>
          {bonusReasonsData.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setActiveBonus(b);
                confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
              }}
              className="p-3 rounded-full bg-white/60 hover:bg-white/90 shadow-md transition-transform hover:scale-125 focus:outline-none"
              title={b.title}
            >
              <span className="text-2xl">{b.symbol}</span>
            </button>
          ))}
        </div>

        {/* Bonus Reason Modal */}
        {activeBonus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-sm animate-fadeIn">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border-2 border-pink-300 shadow-2xl relative bg-white/95 text-center">
              <button
                onClick={() => setActiveBonus(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200"
              >
                <X size={16} />
              </button>

              <span className="text-4xl block mb-2">{activeBonus.symbol}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 block mb-1">
                {activeBonus.title}
              </span>
              <h3 className="font-heading font-bold text-2xl text-pink-950 mb-3">
                BONUS REASON
              </h3>
              <p className="font-body text-base text-pink-900 leading-relaxed italic">
                "{activeBonus.message}"
              </p>
            </div>
          </div>
        )}

        {/* 50 Reasons Interactive 3D Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {reasonsData.map((reason) => {
            const isFound = discoveredIds.includes(reason.id);

            return (
              <ReasonCard3D
                key={reason.id}
                reason={reason}
                isDiscovered={isFound}
                onDiscover={handleDiscover}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
