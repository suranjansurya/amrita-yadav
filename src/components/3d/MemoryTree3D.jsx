import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function MemoryTree3D({ lightCount = 0, className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 1. Lighting System
    const amb = new THREE.AmbientLight('#FFF0F5', 1.0 + lightCount * 0.1);
    scene.add(amb);

    const treePointLight = new THREE.PointLight('#FFD1DC', 2.0 + lightCount * 0.3, 10);
    treePointLight.position.set(0, 0.5, 1);
    scene.add(treePointLight);

    // 2. Tree Group
    const treeGroup = new THREE.Group();
    treeGroup.position.set(0, -1.2, 0);
    scene.add(treeGroup);

    // Trunk Geometry
    const trunkGeom = new THREE.CylinderGeometry(0.18, 0.35, 2.2, 16);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: '#E5A9B4',
      roughness: 0.4,
      metalness: 0.2,
    });
    const trunkMesh = new THREE.Mesh(trunkGeom, trunkMat);
    trunkMesh.position.y = 1.1;
    treeGroup.add(trunkMesh);

    // Foliage Spheres (Soft Pink & White Clusters)
    const folMat = new THREE.MeshPhysicalMaterial({
      color: '#FFF5F8',
      emissive: '#FFD1DC',
      emissiveIntensity: 0.3 + lightCount * 0.1,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });

    const clusterPositions = [
      [0, 2.4, 0, 1.2],
      [-0.7, 2.0, 0.2, 0.9],
      [0.7, 2.1, -0.2, 0.9],
      [0, 2.7, 0.1, 0.8],
      [-0.4, 2.5, -0.3, 0.7],
      [0.4, 2.4, 0.3, 0.7],
    ];

    clusterPositions.forEach(([x, y, z, r]) => {
      const folMesh = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), folMat);
      folMesh.position.set(x, y, z);
      treeGroup.add(folMesh);
    });

    // Hanging Starlight Orbs (Illuminates based on lightCount)
    const orbGeom = new THREE.SphereGeometry(0.08, 12, 12);
    const orbMat = new THREE.MeshStandardMaterial({
      color: '#FFFBFD',
      emissive: '#F5D061',
      emissiveIntensity: 2.5,
    });

    for (let i = 0; i < Math.min(10, lightCount); i++) {
      const angle = (i / 10) * Math.PI * 2;
      const orb = new THREE.Mesh(orbGeom, orbMat);
      orb.position.set(
        Math.sin(angle) * 0.9,
        1.8 + Math.cos(i) * 0.3,
        Math.cos(angle) * 0.9
      );
      treeGroup.add(orb);
    }

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      treeGroup.rotation.y = Math.sin(t * 0.2) * 0.1;
      treeGroup.position.y = -1.2 + Math.sin(t * 0.8) * 0.05;
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
  }, [lightCount]);

  return (
    <div
      ref={mountRef}
      className={`w-72 h-80 sm:w-96 sm:h-[420px] select-none pointer-events-none relative ${className}`}
    />
  );
}
