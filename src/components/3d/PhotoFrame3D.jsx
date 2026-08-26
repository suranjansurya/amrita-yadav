import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PhotoFrameControls } from '../common/PhotoFrameControls';

export function PhotoFrame3D({
  image = '/images/amrita.jpg',
  autoRotate = true,
  frameStyle = 'rounded',
  rotationSpeed = 0.15,
  showControls = true,
  className = '',
}) {
  const mountRef = useRef(null);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [activeStyle, setActiveStyle] = useState(frameStyle);
  const rotYRef = useRef(0);
  const rotXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Setup Three.js WebGL Renderer, Scene, Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Lighting System
    const ambientLight = new THREE.AmbientLight('#FFF0F5', 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight('#FFE4E1', 1.6);
    dirLight1.position.set(3, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight('#F5E1A4', 0.9);
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    const framePointLight = new THREE.PointLight('#FFD1DC', 2.8, 6);
    framePointLight.position.set(0, 0, 1.8);
    scene.add(framePointLight);

    // 3. Main Frame Group
    const frameGroup = new THREE.Group();
    scene.add(frameGroup);

    // 4. Create Texture & Material for the Front Photo Face
    const photoTexture = new THREE.Texture();
    photoTexture.colorSpace = THREE.SRGBColorSpace;

    const photoMaterial = new THREE.MeshBasicMaterial({
      map: photoTexture,
      side: THREE.FrontSide,
      transparent: false,
    });

    // Load Image directly using HTMLImageElement -> THREE.Texture
    const loadPhotoTexture = (targetUrl) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        photoTexture.image = img;
        photoTexture.minFilter = THREE.LinearFilter;
        photoTexture.magFilter = THREE.LinearFilter;

        // Preserve aspect ratio inside 2.1 x 2.7 frame without stretching
        const imgAspect = img.width / img.height;
        const planeAspect = 2.1 / 2.7;

        if (imgAspect > planeAspect) {
          photoTexture.repeat.set(planeAspect / imgAspect, 1);
          photoTexture.offset.set((1 - planeAspect / imgAspect) / 2, 0);
        } else {
          photoTexture.repeat.set(1, imgAspect / planeAspect);
          photoTexture.offset.set(0, (1 - imgAspect / planeAspect) / 2);
        }

        photoTexture.needsUpdate = true;
        photoMaterial.needsUpdate = true;
        console.log('[3D PhotoFrame] Successfully loaded photo texture:', targetUrl);
      };

      img.onerror = (err) => {
        console.warn('[3D PhotoFrame] Error loading photo from:', targetUrl, err);
        if (targetUrl !== '/amrita.jpg' && targetUrl !== 'amrita.jpg') {
          loadPhotoTexture('/amrita.jpg');
        }
      };

      img.src = targetUrl;
    };

    const initialSrc = image || '/images/amrita.jpg';
    loadPhotoTexture(initialSrc);

    // 5. 3D Frame Geometry Styles Construction
    let frameMesh, glassMesh;
    const createFrameGeometry = (style) => {
      // Clear previous frame meshes
      while (frameGroup.children.length > 0) {
        const child = frameGroup.children[0];
        if (child.geometry) child.geometry.dispose();
        frameGroup.remove(child);
      }

      if (style === 'heart') {
        // Heart-Inspired Frame Geometry
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.5);
        shape.bezierCurveTo(0, 0.5, 0.4, 1.1, 1.0, 0.7);
        shape.bezierCurveTo(1.6, 0.3, 1.2, -0.4, 0, -1.2);
        shape.bezierCurveTo(-1.2, -0.4, -1.6, 0.3, -1.0, 0.7);
        shape.bezierCurveTo(-0.4, 1.1, 0, 0.5, 0, 0.5);

        const geom = new THREE.ExtrudeGeometry(shape, {
          depth: 0.12,
          bevelEnabled: true,
          bevelSize: 0.05,
          bevelThickness: 0.05,
          bevelSegments: 4,
        });
        geom.center();

        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#D9889E'),
          metalness: 0.7,
          roughness: 0.2,
        });
        frameMesh = new THREE.Mesh(geom, mat);
      } else if (style === 'crystal') {
        // Crystal Prismatic Frame Geometry
        const shape = new THREE.Shape();
        const w = 1.3, h = 1.6, r = 0.15;
        shape.moveTo(-w + r, -h);
        shape.lineTo(w - r, -h);
        shape.quadraticCurveTo(w, -h, w, -h + r);
        shape.lineTo(w, h - r);
        shape.quadraticCurveTo(w, h, w - r, h);
        shape.lineTo(-w + r, h);
        shape.quadraticCurveTo(-w, h, -w, h - r);
        shape.lineTo(-w, -h + r);
        shape.quadraticCurveTo(-w, -h, -w + r, -h);

        const geom = new THREE.ExtrudeGeometry(shape, {
          depth: 0.15,
          bevelEnabled: true,
          bevelSize: 0.08,
          bevelThickness: 0.08,
          bevelSegments: 5,
        });
        geom.center();

        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#FFF0F5'),
          emissive: new THREE.Color('#FFD1DC'),
          emissiveIntensity: 0.4,
          metalness: 0.1,
          roughness: 0.1,
        });
        frameMesh = new THREE.Mesh(geom, mat);
      } else {
        // Rounded Premium Frame Geometry (Default)
        const shape = new THREE.Shape();
        const w = 1.25, h = 1.55, r = 0.2;
        shape.moveTo(-w + r, -h);
        shape.lineTo(w - r, -h);
        shape.quadraticCurveTo(w, -h, w, -h + r);
        shape.lineTo(w, h - r);
        shape.quadraticCurveTo(w, h, w - r, h);
        shape.lineTo(-w + r, h);
        shape.quadraticCurveTo(-w, h, -w, h - r);
        shape.lineTo(-w, -h + r);
        shape.quadraticCurveTo(-w, -h, -w + r, -h);

        const geom = new THREE.ExtrudeGeometry(shape, {
          depth: 0.1,
          bevelEnabled: true,
          bevelSize: 0.04,
          bevelThickness: 0.04,
          bevelSegments: 4,
        });
        geom.center();

        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#E5A9B4'),
          metalness: 0.8,
          roughness: 0.25,
        });
        frameMesh = new THREE.Mesh(geom, mat);
      }

      frameGroup.add(frameMesh);

      // Photo Mesh Pane (Clear Z Position in Front of Frame Backing)
      const photoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(2.1, 2.7),
        photoMaterial
      );
      photoPlane.position.z = 0.11;
      frameGroup.add(photoPlane);

      // Glass Cover Pane (Non-blocking clear protective sheen)
      const glassGeom = new THREE.PlaneGeometry(2.2, 2.8);
      const glassMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFFFFF'),
        transparent: true,
        opacity: 0.08,
        roughness: 0.1,
        metalness: 0.1,
        depthWrite: false,
      });
      glassMesh = new THREE.Mesh(glassGeom, glassMat);
      glassMesh.position.z = 0.12;
      frameGroup.add(glassMesh);

      // Subtle Soft Shadow Plane Below Frame
      const shadowMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 0.6),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color('#D9889E'),
          transparent: true,
          opacity: 0.25,
        })
      );
      shadowMesh.position.set(0, -1.8, -0.2);
      shadowMesh.rotation.x = -Math.PI / 3;
      frameGroup.add(shadowMesh);
    };

    createFrameGeometry(activeStyle);

    // 6. Mouse & Touch Drag Interaction Handlers
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      rotYRef.current += deltaX * 0.008;
      rotXRef.current += deltaY * 0.008;
      rotXRef.current = Math.max(-0.6, Math.min(0.6, rotXRef.current));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
      const deltaY = e.touches[0].clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      rotYRef.current += deltaX * 0.008;
      rotXRef.current += deltaY * 0.008;
      rotXRef.current = Math.max(-0.6, Math.min(0.6, rotXRef.current));
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const el = container;
    el.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // 7. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      // Auto-rotation if enabled and not currently dragging
      if (isAutoRotating && !isDraggingRef.current) {
        rotYRef.current += delta * rotationSpeed * 1.2;
      }

      // Smooth floating oscillation
      frameGroup.position.y = Math.sin(t * 1.2) * 0.08;
      frameGroup.rotation.y = rotYRef.current;
      frameGroup.rotation.x = rotXRef.current;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      el.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [image, isAutoRotating, activeStyle, rotationSpeed]);

  const handleReset = () => {
    rotYRef.current = 0;
    rotXRef.current = 0;
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-72 h-80 sm:w-96 sm:h-[420px] cursor-grab active:cursor-grabbing touch-none relative"
      />

      {/* Frame Controls Bar */}
      {showControls && (
        <div className="mt-4 z-20">
          <PhotoFrameControls
            autoRotate={isAutoRotating}
            onToggleAutoRotate={() => setIsAutoRotating(!isAutoRotating)}
            onResetRotation={handleReset}
            frameStyle={activeStyle}
            onChangeFrameStyle={(styleId) => setActiveStyle(styleId)}
          />
        </div>
      )}
    </div>
  );
}
