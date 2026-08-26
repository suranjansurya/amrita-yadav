import React from 'react';

export function GlassCard({ children, className = '', onClick = null, glow = false }) {
  return (
    <div
      onClick={onClick}
      className={`glass-panel glass-panel-hover rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ${
        glow ? 'ring-2 ring-pink-300/80 shadow-pink-200/50 shadow-2xl' : ''
      } ${className}`}
    >
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-white/40 rounded-full blur-2xl pointer-events-none" />
      {children}
    </div>
  );
}
