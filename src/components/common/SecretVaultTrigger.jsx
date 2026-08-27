import React, { useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';

export function SecretVaultTrigger({ onOpenVault }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed left-6 bottom-6 z-40">
      <div className="relative group">
        {/* Subtle Hint Tooltip */}
        <div
          className={`absolute bottom-14 left-0 bg-white/90 text-pink-950 text-[11px] font-semibold px-3 py-1.5 rounded-2xl whitespace-nowrap shadow-xl border border-pink-200 transition-all duration-300 pointer-events-none ${
            showTooltip ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <span>Somewhere in this little world... there's a secret ✨</span>
        </div>

        {/* Floating Hidden Glowing Lock Object */}
        <button
          onClick={onOpenVault}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-10 h-10 rounded-full bg-white/70 hover:bg-white/95 text-pink-600 border border-pink-200 shadow-md hover:shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center focus:outline-none animate-pulse"
          title="Secret Vault 🔐"
        >
          <Lock size={16} />
        </button>
      </div>
    </div>
  );
}
