import React from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { photoConfig } from '../../data/photoConfig';

export function PhotoFrameControls({
  autoRotate,
  onToggleAutoRotate,
  onResetRotation,
  frameStyle,
  onChangeFrameStyle,
}) {
  return (
    <div className="glass-panel rounded-full p-2 flex items-center space-x-2 shadow-2xl border border-white/90 max-w-md mx-auto">
      {/* Auto-Rotate Play/Pause Toggle */}
      <button
        onClick={onToggleAutoRotate}
        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
          autoRotate
            ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md'
            : 'bg-white/70 text-pink-950 hover:bg-white'
        }`}
        title={autoRotate ? 'Pause 3D Auto-Rotation' : 'Play 3D Auto-Rotation'}
      >
        {autoRotate ? <Pause size={14} /> : <Play size={14} />}
        <span>{autoRotate ? 'Auto Rotate: ON' : 'Auto Rotate: OFF'}</span>
      </button>

      {/* Reset Rotation Button */}
      <button
        onClick={onResetRotation}
        className="p-2.5 rounded-full bg-white/70 text-pink-950 hover:bg-white transition-colors focus:outline-none"
        title="Reset 3D Orientation"
      >
        <RotateCcw size={15} />
      </button>

      {/* Frame Style Selector */}
      <div className="flex items-center space-x-1 pl-1 border-l border-pink-200/60">
        {photoConfig.styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onChangeFrameStyle(style.id)}
            className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
              frameStyle === style.id
                ? 'bg-pink-200/90 text-pink-950 font-bold shadow-sm'
                : 'text-pink-800/80 hover:text-pink-950 hover:bg-white/50'
            }`}
            title={`Switch to ${style.label}`}
          >
            <span>{style.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
