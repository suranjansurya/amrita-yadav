import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AtmosphericParticles({ count = 200, isMobile = false }) {
  const pointsRef = useRef();
  const actualCount = isMobile ? 80 : count;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const col = new Float32Array(actualCount * 3);

    const color1 = new THREE.Color('#FFF0F5');
    const color2 = new THREE.Color('#FFD1DC');
    const color3 = new THREE.Color('#F5E1A4');

    for (let i = 0; i < actualCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const rand = Math.random();
      const chosenColor = rand > 0.6 ? color1 : rand > 0.3 ? color2 : color3;
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [actualCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();

    const positionsArr = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < actualCount; i++) {
      positionsArr[i * 3 + 1] += Math.sin(t + i) * 0.003 + 0.001;
      positionsArr[i * 3] += Math.cos(t * 0.5 + i) * 0.002;

      // Wrap around screen bounds
      if (positionsArr[i * 3 + 1] > 9) positionsArr[i * 3 + 1] = -9;
      if (positionsArr[i * 3] > 13) positionsArr[i * 3] = -13;
      if (positionsArr[i * 3] < -13) positionsArr[i * 3] = 13;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
