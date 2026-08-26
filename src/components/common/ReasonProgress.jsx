import React from 'react';
import { Sparkles, Shuffle, ArrowRight } from 'lucide-react';

export function ReasonProgress({
  discoveredCount = 0,
  totalCount = 50,
  onSurpriseMe,
  onDiscoverNext,
}) {
  const percent = Math.min(100, Math.round((discoveredCount / totalCount) * 100));

  return (
    <div className="glass-panel p-4 rounded-3xl border border-white/90 shadow-2xl max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Progress Bar & Counter */}
      <div className="w-full sm:w-auto flex-1">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-pink-950 mb-1.5">
          <span className="flex items-center space-x-1">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>REASONS DISCOVERED</span>
          </span>
          <span className="text-pink-700 font-extrabold text-sm">{discoveredCount} / {totalCount}</span>
        </div>

        <div className="w-full bg-pink-100/80 rounded-full h-3 p-0.5 border border-pink-200">
          <div
            className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSurpriseMe}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 focus:outline-none"
        >
          <Shuffle size={14} />
          <span>✨ Surprise Me</span>
        </button>

        <button
          onClick={onDiscoverNext}
          className="p-2 rounded-full bg-white/80 text-pink-950 hover:bg-white transition-all shadow-sm focus:outline-none"
          title="Discover Another Reason"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
