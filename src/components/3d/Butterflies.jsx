import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Butterflies({ count = 5, isMobile = false }) {
  const butterfliesGroup = useRef();
  const actualCount = isMobile ? 3 : count;

  const wingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.2, 0.4, 0.5, 0.6, 0.4, 0);
    shape.bezierCurveTo(0.3, -0.3, 0.1, -0.4, 0, 0);

    const geom = new THREE.ShapeGeometry(shape);
    return geom;
  }, []);

  const butterflyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF5F8'),
      emissive: new THREE.Color('#FFB6C1'),
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
      roughness: 0.4,
      transparent: true,
      opacity: 0.85,
    });
  }, []);

  const bData = useMemo(() => {
    return Array.from({ length: actualCount }).map((_, i) => ({
      baseX: (Math.random() - 0.5) * 14,
      baseY: (Math.random() - 0.5) * 6 + 1,
      baseZ: (Math.random() - 0.5) * 6,
      scale: 0.25 + Math.random() * 0.15,
      speed: 0.4 + Math.random() * 0.5,
    }));
  }, [actualCount]);

  useFrame(({ clock }) => {
    if (!butterfliesGroup.current) return;
    const t = clock.getElapsedTime();

    butterfliesGroup.current.children.forEach((bGroup, i) => {
      const data = bData[i];
      if (data) {
        // Path movement
        bGroup.position.x = data.baseX + Math.sin(t * data.speed + i * 2) * 2;
        bGroup.position.y = data.baseY + Math.cos(t * data.speed * 1.3 + i) * 0.8;
        bGroup.position.z = data.baseZ + Math.sin(t * data.speed * 0.8) * 1.2;

        // Wing flapping
        const leftWing = bGroup.children[0];
        const rightWing = bGroup.children[1];
        if (leftWing && rightWing) {
          const flap = Math.sin(t * 12 + i) * 0.75;
          leftWing.rotation.y = flap;
          rightWing.rotation.y = -flap;
        }
      }
    });
  });

  return (
    <group ref={butterfliesGroup}>
      {bData.map((b, i) => (
        <group key={i} position={[b.baseX, b.baseY, b.baseZ]} scale={[b.scale, b.scale, b.scale]}>
          {/* Left Wing */}
          <mesh geometry={wingGeometry} material={butterflyMaterial} rotation={[0, 0, 0.3]} />
          {/* Right Wing */}
          <mesh geometry={wingGeometry} material={butterflyMaterial} rotation={[0, Math.PI, 0.3]} scale={[-1, 1, 1]} />
          {/* Tiny Body */}
          <mesh material={butterflyMaterial} position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
