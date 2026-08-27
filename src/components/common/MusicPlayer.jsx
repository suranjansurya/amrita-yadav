import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Repeat, ChevronUp, ChevronDown, Heart, AlertCircle } from 'lucide-react';

export function MusicPlayer({ audioState }) {
  const {
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    isLooping,
    trackTitle,
    autoplayBlocked,
    audioError,
    formatTime,
    togglePlay,
    toggleMute,
    changeVolume,
    seek,
    toggleLoop,
  } = audioState;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      
      {/* 1. Autoplay Blocked Prompt Button */}
      {autoplayBlocked && !isPlaying && (
        <button
          onClick={togglePlay}
          className="mb-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 animate-bounce cursor-pointer focus:outline-none"
        >
          <Music size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
          <span>Play our song 🎶❤️</span>
        </button>
      )}

      {/* 2. Audio Loading Error Alert */}
      {audioError && (
        <div className="mb-3 p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center space-x-2 shadow-lg">
          <AlertCircle size={16} className="text-rose-600" />
          <span>Music load nahi ho paaya. Please try again. 🎶</span>
        </div>
      )}

      {/* 3. Main Glassmorphic Mini Player Bar */}
      <div className="glass-panel rounded-full p-2 flex items-center shadow-2xl transition-all duration-300 border border-white/90 bg-white/90">
        
        {/* Play / Pause Toggle Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all focus:outline-none"
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        {/* Track Title & Pulsing Heartbeat / Visualizer */}
        <div className="mx-3 hidden sm:flex flex-col">
          <div className="flex items-center space-x-2">
            {/* Heartbeat Pulsing Icon */}
            <Heart
              size={13}
              className={`text-pink-600 ${isPlaying ? 'fill-pink-400 animate-pulse' : 'opacity-60'}`}
            />
            
            <span className="text-xs font-bold text-pink-950 truncate max-w-[130px]">
              🎵 {trackTitle}
            </span>

            {/* 4 Soft Animated Visualizer Frequency Bars */}
            {isPlaying && (
              <div className="flex items-end space-x-0.5 h-3 ml-1">
                <span className="w-1 bg-pink-400 rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }} />
                <span className="w-1 bg-rose-400 rounded-full animate-bounce h-3" style={{ animationDuration: '0.8s' }} />
                <span className="w-1 bg-pink-500 rounded-full animate-bounce h-1.5" style={{ animationDuration: '0.5s' }} />
                <span className="w-1 bg-rose-300 rounded-full animate-bounce h-2.5" style={{ animationDuration: '0.7s' }} />
              </div>
            )}
          </div>

          {/* Time Progress Display */}
          <div className="flex items-center space-x-2 text-[10px] text-pink-700/90 font-semibold mt-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Mute / Unmute Button */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          className="p-2 text-pink-900 hover:text-pink-600 transition-colors focus:outline-none"
          title={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Loop Mode Toggle Button */}
        <button
          onClick={toggleLoop}
          aria-label="Toggle loop"
          className={`p-2 transition-colors focus:outline-none ${
            isLooping ? 'text-pink-600 font-bold' : 'text-pink-300'
          }`}
          title={isLooping ? 'Looping enabled' : 'Loop disabled'}
        >
          <Repeat size={16} />
        </button>

        {/* Expand / Collapse Control Drawer */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Expand music controls"
          className="p-1 text-pink-800 hover:text-pink-600 focus:outline-none hidden sm:block"
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* 4. Expandable Drawer: Seek Bar & Volume Control */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 glass-panel p-4 rounded-3xl shadow-2xl flex flex-col items-center space-y-3 border border-white/90 bg-white/95 w-64 animate-fadeIn">
          {/* Interactive Progress Seek Bar */}
          <div className="w-full space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-pink-900 uppercase">
              <span>Progress</span>
              <span>{formatTime(currentTime)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              aria-label="Music progress"
              className="w-full h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Volume Control Slider */}
          <div className="w-full space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-pink-900 uppercase">
              <span>Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              aria-label="Music volume"
              className="w-full h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
