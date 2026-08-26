import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function SecretDoor3D({ isOpen = false, onOpenDoor, className = '' }) {
  const mountRef = useRef(null);
  const doorPanelRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 1. Lighting System
    const amb = new THREE.AmbientLight('#FFF0F5', 1.2);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight('#FFE4E1', 1.5);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const doorPointLight = new THREE.PointLight('#FFD1DC', 3.0, 8);
    doorPointLight.position.set(0, 0, 1.5);
    scene.add(doorPointLight);

    // 2. Door Frame Group
    const doorGroup = new THREE.Group();
    scene.add(doorGroup);

    // Outer Frame (Rose Gold Metallic Bevels)
    const frameGeom = new THREE.BoxGeometry(2.4, 3.8, 0.2);
    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E5A9B4'),
      metalness: 0.8,
      roughness: 0.2,
    });
    const doorFrame = new THREE.Mesh(frameGeom, frameMat);
    doorGroup.add(doorFrame);

    // Door Glass Panel (Hinged at left edge)
    const panelGroup = new THREE.Group();
    panelGroup.position.set(-1.0, 0, 0.1); // Pivot point at left edge

    const panelGeom = new THREE.BoxGeometry(2.0, 3.4, 0.08);
    const panelMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFF5F8'),
      emissive: new THREE.Color('#FFD1DC'),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      transmission: 0.6,
    });
    const doorPanel = new THREE.Mesh(panelGeom, panelMat);
    doorPanel.position.set(1.0, 0, 0); // Center relative to pivot
    panelGroup.add(doorPanel);

    // Rose Gold Handle
    const handleGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: '#D9889E', metalness: 0.9, roughness: 0.1 });
    const doorHandle = new THREE.Mesh(handleGeom, handleMat);
    doorHandle.position.set(1.7, 0, 0.1);
    panelGroup.add(doorHandle);

    doorGroup.add(panelGroup);
    doorPanelRef.current = panelGroup;

    // Glowing Stardust inside Doorway
    const lightGeom = new THREE.PlaneGeometry(1.9, 3.3);
    const lightMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.9 });
    const lightBacking = new THREE.Mesh(lightGeom, lightMat);
    lightBacking.position.set(0, 0, -0.05);
    doorGroup.add(lightBacking);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      // Smooth 3D Door opening rotation
      if (isOpen && panelGroup.rotation.y > -Math.PI * 0.65) {
        panelGroup.rotation.y -= 0.03;
        doorPointLight.intensity += 0.08;
      } else if (!isOpen && panelGroup.rotation.y < 0) {
        panelGroup.rotation.y += 0.03;
      }

      doorGroup.position.y = Math.sin(t * 1.2) * 0.06;

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
  }, [isOpen]);

  return (
    <div
      ref={mountRef}
      onClick={onOpenDoor}
      className={`w-72 h-80 sm:w-96 sm:h-[420px] cursor-pointer select-none relative ${className}`}
    />
  );
}
