import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GlowingStars({ count = 120, isMobile = false }) {
  const pointsRef = useRef();
  const actualCount = isMobile ? 60 : count;

  const [positions, scales, offsets] = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const scl = new Float32Array(actualCount);
    const off = new Float32Array(actualCount);

    for (let i = 0; i < actualCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16 + 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;

      scl[i] = 0.05 + Math.random() * 0.12;
      off[i] = Math.random() * Math.PI * 2;
    }

    return [pos, scl, off];
  }, [actualCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();

    // Slow rotation of starfield
    pointsRef.current.rotation.y = t * 0.015;
    pointsRef.current.rotation.x = Math.sin(t * 0.01) * 0.02;
  });

  return (
    <group ref={pointsRef}>
      {Array.from({ length: actualCount }).map((_, i) => (
        <mesh key={i} position={[positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]]}>
          <sphereGeometry args={[scales[i], 8, 8]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}
