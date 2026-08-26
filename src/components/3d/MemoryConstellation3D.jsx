import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function MemoryConstellation3D({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 340;
    const height = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Constellation Stars Vector Positions
    const starPositions = [
      new THREE.Vector3(-1.8, 1.2, 0),
      new THREE.Vector3(-0.8, 0.4, 0.5),
      new THREE.Vector3(0, 1.5, -0.2),
      new THREE.Vector3(1.1, 0.8, 0.3),
      new THREE.Vector3(1.9, -0.5, -0.4),
      new THREE.Vector3(0.7, -1.2, 0.2),
      new THREE.Vector3(-0.6, -1.4, -0.3),
      new THREE.Vector3(-1.6, -0.6, 0.4),
    ];

    const starMat = new THREE.MeshStandardMaterial({
      color: '#FFFBFD',
      emissive: '#FFB6C1',
      emissiveIntensity: 2.0,
    });
    const starGeom = new THREE.SphereGeometry(0.12, 16, 16);

    starPositions.forEach((pos) => {
      const mesh = new THREE.Mesh(starGeom, starMat);
      mesh.position.copy(pos);
      scene.add(mesh);
    });

    // Constellation Energy Connecting Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: '#FFD1DC',
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
    });

    const lineGeom = new THREE.BufferGeometry().setFromPoints([
      ...starPositions,
      starPositions[0], // Close loop
    ]);
    const constLine = new THREE.Line(lineGeom, lineMat);
    scene.add(constLine);

    // Ambient & Point Light
    const amb = new THREE.AmbientLight('#FFF0F5', 1.2);
    scene.add(amb);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      scene.rotation.y = Math.sin(t * 0.4) * 0.2;
      scene.rotation.x = Math.cos(t * 0.3) * 0.1;
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
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-72 h-72 sm:w-80 sm:h-80 select-none pointer-events-none relative ${className}`}
    />
  );
}
