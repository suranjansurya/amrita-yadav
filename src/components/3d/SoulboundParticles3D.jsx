import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function SoulboundParticles3D({ progress = 0.5, className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 320;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Particle A (Soft White/Pink Glow) & Particle B (Soft Gold/Pink Glow)
    const pMat1 = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF5F8'),
      emissive: new THREE.Color('#FFB6C1'),
      emissiveIntensity: 2.0,
    });

    const pMat2 = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFBFD'),
      emissive: new THREE.Color('#F5E1A4'),
      emissiveIntensity: 2.0,
    });

    const sphereGeom = new THREE.SphereGeometry(0.22, 20, 20);
    const particleA = new THREE.Mesh(sphereGeom, pMat1);
    const particleB = new THREE.Mesh(sphereGeom, pMat2);

    scene.add(particleA);
    scene.add(particleB);

    // Energy Ring (Torus) formed when connection deepens
    const torusGeom = new THREE.TorusGeometry(0.9, 0.03, 16, 64);
    const torusMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFD1DC'),
      transparent: true,
      opacity: 0,
    });
    const energyRing = new THREE.Mesh(torusGeom, torusMat);
    energyRing.rotation.x = Math.PI / 3;
    scene.add(energyRing);

    // Pulsing Energy Beam Line
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#FFE4E1'),
      transparent: true,
      opacity: 0.8,
      linewidth: 3,
    });
    const lineGeom = new THREE.BufferGeometry();
    const linePositions = new Float32Array(6);
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const connectionBeam = new THREE.Line(lineGeom, lineMat);
    scene.add(connectionBeam);

    // Ambient & Point Lighting
    const ambLight = new THREE.AmbientLight('#FFF0F5', 1.2);
    scene.add(ambLight);

    const glowLight = new THREE.PointLight('#FFD1DC', 3.0, 8);
    scene.add(glowLight);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const p = Math.max(0, Math.min(1, progress));

      // Orbit radius shrinks as progress increases
      const orbitRadius = (1 - p) * 2.5 + 0.7;
      const angle = t * 1.8 + p * Math.PI * 3;

      const xA = Math.cos(angle) * orbitRadius;
      const yA = Math.sin(t * 1.5) * 0.25;
      const zA = Math.sin(angle) * orbitRadius;

      const xB = -Math.cos(angle) * orbitRadius;
      const yB = -Math.sin(t * 1.5) * 0.25;
      const zB = -Math.sin(angle) * orbitRadius;

      particleA.position.set(xA, yA, zA);
      particleB.position.set(xB, yB, zB);

      // Beam Update
      const arr = connectionBeam.geometry.attributes.position.array;
      arr[0] = xA; arr[1] = yA; arr[2] = zA;
      arr[3] = xB; arr[4] = yB; arr[5] = zB;
      connectionBeam.geometry.attributes.position.needsUpdate = true;

      // Ring & Light Intensity
      torusMat.opacity = Math.max(0, (p - 0.3) * 1.4);
      energyRing.rotation.z = t * 0.5;
      glowLight.position.set((xA + xB) / 2, (yA + yB) / 2, (zA + zB) / 2);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [progress]);

  return (
    <div
      ref={mountRef}
      className={`w-72 h-72 sm:w-80 sm:h-80 select-none pointer-events-none relative ${className}`}
    />
  );
}
