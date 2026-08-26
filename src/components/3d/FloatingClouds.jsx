import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingClouds({ count = 8, isMobile = false }) {
  const cloudGroup = useRef();
  const actualCount = isMobile ? Math.min(count, 4) : count;

  const cloudClusters = useMemo(() => {
    return Array.from({ length: actualCount }).map((_, i) => {
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 10 + 2;
      const z = -4 - Math.random() * 8;
      const scale = 1.2 + Math.random() * 1.8;
      const speed = 0.05 + Math.random() * 0.08;

      // Each cloud cluster is composed of 4-6 overlapping soft spheres
      const spheres = Array.from({ length: 5 }).map(() => ({
        offset: [
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.8,
        ],
        size: 0.8 + Math.random() * 0.7,
      }));

      return { x, y, z, scale, speed, spheres, initialX: x };
    });
  }, [actualCount]);

  const cloudMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      emissive: new THREE.Color('#FFEBF0'),
      emissiveIntensity: 0.4,
      roughness: 0.9,
      transparent: true,
      opacity: 0.45,
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!cloudGroup.current) return;

    cloudGroup.current.children.forEach((cloud, idx) => {
      const data = cloudClusters[idx];
      if (data) {
        cloud.position.x = data.initialX + Math.sin(t * data.speed + idx) * 2.5;
        cloud.position.y = data.y + Math.cos(t * data.speed * 0.7 + idx) * 0.4;
      }
    });
  });

  return (
    <group ref={cloudGroup}>
      {cloudClusters.map((cloud, idx) => (
        <group key={idx} position={[cloud.x, cloud.y, cloud.z]} scale={cloud.scale}>
          {cloud.spheres.map((s, sIdx) => (
            <mesh key={sIdx} position={s.offset} material={cloudMaterial}>
              <sphereGeometry args={[s.size, 12, 12]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
