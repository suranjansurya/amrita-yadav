import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Envelope3D({ isOpen = false, onOpenEnvelope, className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 320;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.5);

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

    const envelopePointLight = new THREE.PointLight('#FFD1DC', 3.0, 6);
    scene.add(envelopePointLight);

    // 2. Envelope Group
    const envGroup = new THREE.Group();
    scene.add(envGroup);

    // Envelope Body Box
    const envGeom = new THREE.BoxGeometry(2.4, 1.6, 0.08);
    const envMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF5F8'),
      roughness: 0.3,
      metalness: 0.05,
    });
    const envBody = new THREE.Mesh(envGeom, envMat);
    envGroup.add(envBody);

    // Envelope Flap (Triangle hinged at top edge)
    const flapGroup = new THREE.Group();
    flapGroup.position.set(0, 0.8, 0.04);

    const flapShape = new THREE.Shape();
    flapShape.moveTo(-1.2, 0);
    flapShape.lineTo(1.2, 0);
    flapShape.lineTo(0, -0.9);
    flapShape.closePath();

    const flapGeom = new THREE.ShapeGeometry(flapShape);
    const flapMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FDE8E9'),
      side: THREE.DoubleSide,
      roughness: 0.3,
    });
    const flapMesh = new THREE.Mesh(flapGeom, flapMat);
    flapGroup.add(flapMesh);
    envGroup.add(flapGroup);

    // Rose Gold Wax Seal
    const sealGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24);
    const sealMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D9889E'),
      metalness: 0.8,
      roughness: 0.2,
    });
    const sealMesh = new THREE.Mesh(sealGeom, sealMat);
    sealMesh.rotation.x = Math.PI / 2;
    sealMesh.position.set(0, 0, 0.06);
    flapGroup.add(sealMesh);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      // Open flap rotation
      if (isOpen && flapGroup.rotation.x < Math.PI * 0.8) {
        flapGroup.rotation.x += 0.04;
        envGroup.position.z += 0.01;
      }

      envGroup.position.y = Math.sin(t * 1.2) * 0.06;
      envGroup.rotation.y = Math.sin(t * 0.4) * 0.1;

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
      onClick={onOpenEnvelope}
      className={`w-72 h-72 sm:w-80 sm:h-80 cursor-pointer select-none relative ${className}`}
    />
  );
}
