import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, ChevronUp, ChevronDown } from 'lucide-react';

export function MusicPlayer({ audioState }) {
  const { isPlaying, isMuted, volume, trackTitle, togglePlay, toggleMute, changeVolume } = audioState;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="glass-panel rounded-full p-2 flex items-center shadow-xl transition-all duration-300 border border-white/80">
        
        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform focus:outline-none"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="mx-3 hidden sm:flex flex-col">
          <div className="flex items-center space-x-1.5">
            <Music size={13} className="text-pink-600 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-semibold text-pink-950 truncate max-w-[140px]">
              {trackTitle}
            </span>
          </div>
          <span className="text-[10px] text-pink-700/80">
            {isPlaying ? 'Playing Ambient Sound' : 'Tap to Start Audio'}
          </span>
        </div>

        <button
          onClick={toggleMute}
          className="p-2 text-pink-900 hover:text-pink-600 transition-colors focus:outline-none"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-pink-800 hover:text-pink-600 focus:outline-none hidden sm:block"
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="absolute bottom-16 right-0 glass-panel p-3 rounded-2xl shadow-2xl flex flex-col items-center space-y-2 border border-white/90 animate-fadeIn">
          <span className="text-[10px] font-semibold text-pink-900 uppercase tracking-wider">Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="w-24 h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>
      )}
    </div>
  );
}
