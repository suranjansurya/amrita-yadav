import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WhiteLotus({ position = [0, -0.5, 0], scale = 1, enterGlow = false, bloomStage = 0 }) {
  const lotusGroupRef = useRef();
  const stamenRef = useRef();

  // Procedural petal geometry generation
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.2, 0.4, 0.35, 1.2, 0, 1.8);
    shape.bezierCurveTo(-0.35, 1.2, -0.2, 0.4, 0, 0);

    const extrudeSettings = {
      steps: 2,
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // Material with dynamic emissive glow depending on bloom stage
  const lotusMaterial = useMemo(() => {
    const glowIntensity = enterGlow ? 0.8 : 0.25 + bloomStage * 0.25;
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFBFD'),
      emissive: new THREE.Color(bloomStage >= 2 ? '#FFE4E1' : '#FFD1DC'),
      emissiveIntensity: Math.min(1.2, glowIntensity),
      roughness: 0.2,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      transmission: 0.3,
      thickness: 0.5,
      side: THREE.DoubleSide,
    });
  }, [enterGlow, bloomStage]);

  const stamenMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F3E5AB'),
      emissive: new THREE.Color('#F5D061'),
      emissiveIntensity: 0.8 + bloomStage * 0.3,
      roughness: 0.3,
    });
  }, [bloomStage]);

  // Dynamic Petal rings layout parameters based on bloom stage
  const petalRings = useMemo(() => {
    const rings = [];
    const spread = 1.0 + bloomStage * 0.25; // Expands outward as bloomStage increases

    // Inner Ring (8 petals)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      rings.push({
        position: [Math.sin(angle) * 0.25 * spread, 0.35, Math.cos(angle) * 0.25 * spread],
        rotation: [0.4 * spread, angle, -0.15],
        scale: [0.65, 0.8, 0.65],
      });
    }

    // Middle Ring (12 petals)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + 0.2;
      rings.push({
        position: [Math.sin(angle) * 0.55 * spread, 0.2, Math.cos(angle) * 0.55 * spread],
        rotation: [0.75 * spread, angle, -0.2],
        scale: [0.85, 0.95, 0.85],
      });
    }

    // Outer Ring (16 petals)
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      rings.push({
        position: [Math.sin(angle) * 0.9 * spread, 0.05, Math.cos(angle) * 0.9 * spread],
        rotation: [1.1 * spread, angle, -0.25],
        scale: [1, 1.1, 1],
      });
    }

    return rings;
  }, [bloomStage]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (lotusGroupRef.current) {
      lotusGroupRef.current.rotation.y = Math.sin(t * 0.15) * 0.12 + t * 0.05;
      lotusGroupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1;
    }

    if (stamenRef.current) {
      stamenRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.05);
    }
  });

  return (
    <group ref={lotusGroupRef} position={position} scale={[scale, scale, scale]}>
      {/* Central Stamen Cluster */}
      <group ref={stamenRef} position={[0, 0.2, 0]}>
        <mesh material={stamenMaterial}>
          <cylinderGeometry args={[0.18, 0.1, 0.25, 16]} />
        </mesh>
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.sin(a) * 0.14, 0.15, Math.cos(a) * 0.14]}
              material={stamenMaterial}
            >
              <sphereGeometry args={[0.03, 8, 8]} />
            </mesh>
          );
        })}
      </group>

      {/* Layered Petals */}
      {petalRings.map((p, idx) => (
        <mesh
          key={idx}
          geometry={petalGeometry}
          material={lotusMaterial}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
        />
      ))}

      {/* Water Lily Base Pad */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 1.4 + bloomStage * 0.2, 32]} />
        <meshStandardMaterial
          color="#E6C2CE"
          roughness={0.5}
          opacity={0.35}
          transparent
        />
      </mesh>

      {/* Core Lotus Glow Light */}
      <pointLight
        color={bloomStage >= 2 ? '#FFF5F8' : '#FFD1DC'}
        intensity={enterGlow ? 4.0 : 2.0 + bloomStage * 0.8}
        distance={6 + bloomStage}
        decay={2}
      />
    </group>
  );
}
