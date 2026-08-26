import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ConnectionParticles3D({ scrollProgress = 0.5, className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Particle 1 & Particle 2 Mesh (Glowing Spheres)
    const pMat1 = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF5F8'),
      emissive: new THREE.Color('#FFB6C1'),
      emissiveIntensity: 1.5,
    });

    const pMat2 = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFBFD'),
      emissive: new THREE.Color('#F5E1A4'),
      emissiveIntensity: 1.5,
    });

    const sphereGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const particle1 = new THREE.Mesh(sphereGeom, pMat1);
    const particle2 = new THREE.Mesh(sphereGeom, pMat2);

    scene.add(particle1);
    scene.add(particle2);

    // Connection Beam (Line between particles)
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#FFD1DC'),
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
    });

    const lineGeom = new THREE.BufferGeometry();
    const linePositions = new Float32Array(6);
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const connectionLine = new THREE.Line(lineGeom, lineMat);
    scene.add(connectionLine);

    // Soft Ambient Light
    const amb = new THREE.AmbientLight('#FFF0F5', 1.0);
    scene.add(amb);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const p = Math.max(0, Math.min(1, scrollProgress));

      // Calculate distance based on scroll progress (far apart at 0, orbiting close at 1)
      const distance = (1 - p) * 2.8 + 0.6;
      const angle = t * 1.5 + p * Math.PI * 2;

      const x1 = Math.cos(angle) * (distance / 2);
      const y1 = Math.sin(t * 2) * 0.2;
      const z1 = Math.sin(angle) * (distance / 2);

      const x2 = -Math.cos(angle) * (distance / 2);
      const y2 = -Math.sin(t * 2) * 0.2;
      const z2 = -Math.sin(angle) * (distance / 2);

      particle1.position.set(x1, y1, z1);
      particle2.position.set(x2, y2, z2);

      // Update connection line positions
      const arr = connectionLine.geometry.attributes.position.array;
      arr[0] = x1; arr[1] = y1; arr[2] = z1;
      arr[3] = x2; arr[4] = y2; arr[5] = z2;
      connectionLine.geometry.attributes.position.needsUpdate = true;
      lineMat.opacity = Math.min(0.9, p * 1.2);

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
  }, [scrollProgress]);

  return (
    <div
      ref={mountRef}
      className={`w-64 h-64 sm:w-72 sm:h-72 select-none pointer-events-none relative ${className}`}
    />
  );
}
