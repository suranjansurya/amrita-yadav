import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function SerendipityPaths3D({ progress = 0.5, className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 320;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 6.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 1. Path A Geometry (Bezier Curve 1)
    const curveA = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-3.5, -2.0, -1.0),
      new THREE.Vector3(-1.8, -0.5, 0.5),
      new THREE.Vector3(-0.5, 0.5, 0.5),
      new THREE.Vector3(0, 0, 0)
    );

    // 2. Path B Geometry (Bezier Curve 2)
    const curveB = new THREE.CubicBezierCurve3(
      new THREE.Vector3(3.5, -2.0, -1.0),
      new THREE.Vector3(1.8, -0.5, 0.5),
      new THREE.Vector3(0.5, 0.5, 0.5),
      new THREE.Vector3(0, 0, 0)
    );

    // Path Lines
    const pointsA = curveA.getPoints(50);
    const geomA = new THREE.BufferGeometry().setFromPoints(pointsA);
    const matA = new THREE.LineBasicMaterial({ color: '#FFD1DC', transparent: true, opacity: 0.65 });
    const lineA = new THREE.Line(geomA, matA);
    scene.add(lineA);

    const pointsB = curveB.getPoints(50);
    const geomB = new THREE.BufferGeometry().setFromPoints(pointsB);
    const matB = new THREE.LineBasicMaterial({ color: '#F5E1A4', transparent: true, opacity: 0.65 });
    const lineB = new THREE.Line(geomB, matB);
    scene.add(lineB);

    // Traveling Particles along Paths
    const pMatA = new THREE.MeshStandardMaterial({
      color: '#FFF5F8',
      emissive: '#FFB6C1',
      emissiveIntensity: 2.0,
    });
    const pMatB = new THREE.MeshStandardMaterial({
      color: '#FFFBFD',
      emissive: '#F5D061',
      emissiveIntensity: 2.0,
    });

    const sphereGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const travelerA = new THREE.Mesh(sphereGeom, pMatA);
    const travelerB = new THREE.Mesh(sphereGeom, pMatB);
    scene.add(travelerA);
    scene.add(travelerB);

    // Intersection Expansion Wave (Ring)
    const ringGeom = new THREE.RingGeometry(0.1, 1.8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#FFD1DC',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const expansionWave = new THREE.Mesh(ringGeom, ringMat);
    scene.add(expansionWave);

    // Lighting
    const amb = new THREE.AmbientLight('#FFF0F5', 1.2);
    scene.add(amb);

    const pointLight = new THREE.PointLight('#FFD1DC', 2.0, 8);
    scene.add(pointLight);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const p = Math.max(0, Math.min(1, progress));

      // Calculate position along curve based on scroll progress and time offset
      const tA = (p * 0.8 + Math.sin(t * 0.8) * 0.05) % 1.0;
      const tB = (p * 0.8 + Math.cos(t * 0.8) * 0.05) % 1.0;

      const posA = curveA.getPoint(tA);
      const posB = curveB.getPoint(tB);

      travelerA.position.copy(posA);
      travelerB.position.copy(posB);

      // Light wave expands when paths cross near center (p > 0.45)
      if (p > 0.4) {
        const waveScale = (p - 0.4) * 3.5;
        expansionWave.scale.set(waveScale, waveScale, waveScale);
        ringMat.opacity = Math.max(0, 0.8 - (p - 0.4) * 1.2);
      } else {
        ringMat.opacity = 0;
      }

      pointLight.position.set((posA.x + posB.x) / 2, (posA.y + posB.y) / 2, (posA.z + posB.z) / 2);

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
      className={`w-72 h-72 sm:w-96 sm:h-80 select-none pointer-events-none relative ${className}`}
    />
  );
}
