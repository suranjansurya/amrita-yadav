import React from 'react';
import { gardenDiscoveriesData } from '../../data/gardenDiscoveriesData';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export function InteractiveGardenOverlay({ onTriggerDiscovery, discoveredList = [] }) {

  const handleInteract = (item) => {
    // Fire stardust sparkles & hearts
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
    });

    onTriggerDiscovery(item);
  };

  return (
    <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden select-none">
      
      {/* 1. White Lotus Interactive Trigger (Center Bottom) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto">
        <button
          onClick={() => handleInteract(gardenDiscoveriesData[0])}
          className="p-3 rounded-full bg-white/40 hover:bg-white/90 text-pink-700 shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center space-x-1 border border-pink-200 backdrop-blur-sm focus:outline-none animate-pulse"
          title="White Lotus 🤍"
        >
          <span className="text-xl">🤍</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-950 hidden sm:inline">
            Lotus
          </span>
        </button>
      </div>

      {/* 2. Glowing Rose (Top Right) */}
      <div className="absolute top-28 right-16 pointer-events-auto">
        <button
          onClick={() => handleInteract(gardenDiscoveriesData[1])}
          className="w-10 h-10 rounded-full bg-white/50 hover:bg-white/95 text-pink-600 shadow-md hover:scale-110 transition-all flex items-center justify-center border border-pink-200 focus:outline-none animate-bounce"
          style={{ animationDuration: '4s' }}
          title="Glowing Rose 🌸"
        >
          <span className="text-lg">🌸</span>
        </button>
      </div>

      {/* 3. Blush Tulip (Mid Left) */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 pointer-events-auto">
        <button
          onClick={() => handleInteract(gardenDiscoveriesData[2])}
          className="w-10 h-10 rounded-full bg-white/50 hover:bg-white/95 text-pink-600 shadow-md hover:scale-110 transition-all flex items-center justify-center border border-pink-200 focus:outline-none animate-bounce"
          style={{ animationDuration: '5s' }}
          title="Blush Tulip 🌷"
        >
          <span className="text-lg">🌷</span>
        </button>
      </div>

      {/* 4. Dream Butterfly (Upper Right) */}
      <div className="absolute top-1/3 right-1/4 pointer-events-auto">
        <button
          onClick={() => handleInteract(gardenDiscoveriesData[3])}
          className="w-10 h-10 rounded-full bg-white/50 hover:bg-white/95 text-pink-600 shadow-md hover:scale-110 transition-all flex items-center justify-center border border-pink-200 focus:outline-none animate-pulse"
          title="Dream Butterfly 🦋"
        >
          <span className="text-lg">🦋</span>
        </button>
      </div>

      {/* 5. Floating Star (Top Left) */}
      <div className="absolute top-36 left-24 pointer-events-auto">
        <button
          onClick={() => handleInteract(gardenDiscoveriesData[4])}
          className="w-9 h-9 rounded-full bg-white/50 hover:bg-white/95 text-pink-600 shadow-md hover:scale-110 transition-all flex items-center justify-center border border-pink-200 focus:outline-none animate-spin"
          style={{ animationDuration: '10s' }}
          title="Floating Star ⭐"
        >
          <span className="text-base">⭐</span>
        </button>
      </div>

    </div>
  );
}
