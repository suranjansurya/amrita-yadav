import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingHearts({ count = 10, isMobile = false }) {
  const heartsGroup = useRef();
  const actualCount = isMobile ? 5 : count;

  // Create 3D Heart geometry via ExtrudeGeometry
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 2,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  const heartMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFB6C1'),
      emissive: new THREE.Color('#FF8DA1'),
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });
  }, []);

  const heartsData = useMemo(() => {
    return Array.from({ length: actualCount }).map((_, i) => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 8 - 2,
      z: (Math.random() - 0.5) * 8 - 1,
      scale: 0.2 + Math.random() * 0.25,
      speed: 0.3 + Math.random() * 0.4,
      rotSpeed: (Math.random() - 0.5) * 0.5,
    }));
  }, [actualCount]);

  useFrame(({ clock }) => {
    if (!heartsGroup.current) return;
    const t = clock.getElapsedTime();

    heartsGroup.current.children.forEach((child, i) => {
      const data = heartsData[i];
      if (data) {
        child.position.y += data.speed * 0.01;
        child.position.x = data.x + Math.sin(t * 0.8 + i) * 0.3;
        child.rotation.z = Math.sin(t * data.rotSpeed + i) * 0.2;

        // Reset if float out of top bound
        if (child.position.y > 7) {
          child.position.y = -5;
        }
      }
    });
  });

  return (
    <group ref={heartsGroup}>
      {heartsData.map((h, i) => (
        <mesh
          key={i}
          geometry={heartGeometry}
          material={heartMaterial}
          position={[h.x, h.y, h.z]}
          scale={[h.scale, h.scale, h.scale]}
          rotation={[Math.PI, 0, 0]}
        />
      ))}
    </group>
  );
}
