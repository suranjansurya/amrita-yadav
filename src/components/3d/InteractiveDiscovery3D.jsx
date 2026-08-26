import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function InteractiveDiscovery3D({ onSelectSecret, discoveredIds = [] }) {
  const groupRef = useRef();

  const discoveryItems = [
    { id: 'butterfly', pos: [-3.2, 1.2, 0.5], symbol: '🦋', name: 'Butterfly' },
    { id: 'star', pos: [3.4, 1.8, -0.5], symbol: '✨', name: 'Glowing Star' },
    { id: 'heart', pos: [-2.4, -1.6, 0.2], symbol: '❤️', name: 'Soft Heart' },
    { id: 'lotus', pos: [0, -1.2, 1.0], symbol: '🪷', name: 'White Lotus' },
    { id: 'petal', pos: [2.8, -1.8, 0.4], symbol: '🌸', name: 'Floating Petal' },
  ];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, idx) => {
      child.position.y = discoveryItems[idx].pos[1] + Math.sin(t * 1.2 + idx * 1.5) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {discoveryItems.map((item) => {
        const isDiscovered = discoveredIds.includes(item.id);

        return (
          <group key={item.id} position={item.pos}>
            <Html center distanceFactor={10}>
              <button
                onClick={() => onSelectSecret(item.id)}
                className={`group relative flex flex-col items-center p-3 rounded-full transition-all duration-300 transform hover:scale-125 focus:outline-none ${
                  isDiscovered
                    ? 'bg-white/80 shadow-lg ring-2 ring-pink-300'
                    : 'bg-white/50 hover:bg-white/90 animate-bounce'
                }`}
                title={`Click to inspect ${item.name}`}
              >
                <span className="text-3xl md:text-4xl filter drop-shadow-md select-none">
                  {item.symbol}
                </span>

                {/* Subtle Pulse Ring */}
                <span className="absolute -inset-1 rounded-full bg-pink-300/40 animate-ping opacity-75 group-hover:opacity-100" />
                
                {/* Discovery Tag */}
                <span className="absolute top-12 whitespace-nowrap text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-pink-900 shadow-md opacity-90 group-hover:opacity-100">
                  {isDiscovered ? '✓ Discovered' : 'Tap to reveal'}
                </span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
