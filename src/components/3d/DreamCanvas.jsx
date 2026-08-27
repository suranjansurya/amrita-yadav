import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTimeBasedAtmosphere } from '../../hooks/useTimeBasedAtmosphere';

export function DreamCanvas({
  isMobile = false,
  enterGlow = false,
  currentSection = 0,
  onSelectSecret = null,
  discoveredIds = [],
}) {
  const mountRef = useRef(null);
  const atmosphere = useTimeBasedAtmosphere();

  // Determine White Lotus blooming stage (0 to 3) based on active section
  const bloomStage = currentSection >= 13 ? 3 : currentSection >= 11 ? 2 : currentSection >= 9 ? 1 : 0;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#FFF0F5', 0.04 - bloomStage * 0.005);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1 + bloomStage * 0.05;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Lighting System (Dynamic Time-based)
    const ambientLight = new THREE.AmbientLight(
      atmosphere.ambientColor,
      atmosphere.ambientIntensity + bloomStage * 0.1
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(
      atmosphere.dirColor,
      atmosphere.dirIntensity + bloomStage * 0.1
    );
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(
      atmosphere.pointColor,
      2.0 + bloomStage * 0.5,
      8
    );
    pointLight.position.set(0, 0, 1);
    scene.add(pointLight);

    // 3. Procedural 3D White Lotus Symbol
    const lotusGroup = new THREE.Group();
    lotusGroup.position.set(0, -0.4, 0);

    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.2, 0.4, 0.35, 1.2, 0, 1.8);
    petalShape.bezierCurveTo(-0.35, 1.2, -0.2, 0.4, 0, 0);

    const petalGeom = new THREE.ExtrudeGeometry(petalShape, {
      steps: 1,
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    });
    petalGeom.center();

    const lotusMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFBFD'),
      emissive: new THREE.Color(atmosphere.lotusEmissive),
      emissiveIntensity: atmosphere.lotusEmissiveIntensity + bloomStage * 0.1,
      roughness: 0.2,
      metalness: 0.05,
      clearcoat: 0.8,
      transmission: 0.25,
      side: THREE.DoubleSide,
    });

    const stamenMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F3E5AB'),
      emissive: new THREE.Color('#F5D061'),
      emissiveIntensity: 0.8 + bloomStage * 0.2,
      roughness: 0.3,
    });

    const stamenMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.1, 0.25, 16),
      stamenMat
    );
    stamenMesh.position.y = 0.2;
    lotusGroup.add(stamenMesh);

    const spread = 1.0 + bloomStage * 0.2;
    const ringConfigs = [
      { count: 8, radius: 0.25 * spread, y: 0.35, rotX: 0.4 * spread, scale: 0.65 },
      { count: 12, radius: 0.55 * spread, y: 0.2, rotX: 0.75 * spread, scale: 0.85 },
      { count: 16, radius: 0.9 * spread, y: 0.05, rotX: 1.1 * spread, scale: 1.0 },
    ];

    ringConfigs.forEach((cfg) => {
      for (let i = 0; i < cfg.count; i++) {
        const angle = (i / cfg.count) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeom, lotusMat);
        petal.position.set(
          Math.sin(angle) * cfg.radius,
          cfg.y,
          Math.cos(angle) * cfg.radius
        );
        petal.rotation.set(cfg.rotX, angle, -0.2);
        petal.scale.setScalar(cfg.scale);
        lotusGroup.add(petal);
      }
    });

    scene.add(lotusGroup);

    // 4. Volumetric Floating Clouds
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      emissive: new THREE.Color('#FFEBF0'),
      emissiveIntensity: 0.4,
      roughness: 0.9,
      transparent: true,
      opacity: 0.4,
    });

    const cloudCount = isMobile ? 4 : 8;
    const clouds = [];
    for (let i = 0; i < cloudCount; i++) {
      const cluster = new THREE.Group();
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 8 + 2;
      const z = -3 - Math.random() * 6;
      cluster.position.set(x, y, z);

      for (let s = 0; s < 5; s++) {
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7 + Math.random() * 0.5, 12, 12), cloudMat);
        sphere.position.set((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.8);
        cluster.add(sphere);
      }
      cloudGroup.add(cluster);
      clouds.push({ group: cluster, initialX: x, speed: 0.03 + Math.random() * 0.05, y });
    }
    scene.add(cloudGroup);

    // 5. Glowing Starfield (Dynamic Opacity by Time Period)
    const starCount = isMobile ? 60 : 120 + bloomStage * 20;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 24;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 16 + 2;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: '#FFFFFF',
      size: 0.12,
      transparent: true,
      opacity: atmosphere.starOpacity,
    });
    const starPoints = new THREE.Points(starGeom, starMat);
    scene.add(starPoints);

    // 6. Floating 3D Hearts
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0.25, 0.25);
    heartShape.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
    heartShape.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
    heartShape.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95);
    heartShape.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
    heartShape.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
    heartShape.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);

    const heartGeom = new THREE.ExtrudeGeometry(heartShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, steps: 1 });
    heartGeom.center();
    const heartMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFB6C1'),
      emissive: new THREE.Color('#FF8DA1'),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7,
    });

    const heartCount = isMobile ? 4 : 8;
    const heartsGroup = new THREE.Group();
    const heartsData = [];
    for (let i = 0; i < heartCount; i++) {
      const mesh = new THREE.Mesh(heartGeom, heartMat);
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 8 - 2;
      const z = (Math.random() - 0.5) * 6;
      mesh.position.set(x, y, z);
      mesh.rotation.x = Math.PI;
      mesh.scale.setScalar(0.2 + Math.random() * 0.2);
      heartsGroup.add(mesh);
      heartsData.push({ mesh, speed: 0.2 + Math.random() * 0.3, x, initialY: y });
    }
    scene.add(heartsGroup);

    // 7. Atmospheric Gold & Pink Particles
    const particleCount = isMobile ? 80 : 180 + bloomStage * 30;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: '#FFD1DC',
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(pGeom, pMat);
    scene.add(particlePoints);

    // 8. Animation & Parallax Loop
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      if (prefersReducedMotion) return;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const speedMult = prefersReducedMotion ? 0.2 : atmosphere.particleSpeed;

      lotusGroup.rotation.y = Math.sin(t * 0.15 * speedMult) * 0.12 + t * 0.05 * speedMult;
      lotusGroup.position.y = -0.4 + Math.sin(t * 0.8 * speedMult) * 0.08;

      pointLight.intensity = enterGlow ? 4.0 : 2.0 + bloomStage * 0.5;

      clouds.forEach((c, idx) => {
        c.group.position.x = c.initialX + Math.sin(t * c.speed * speedMult + idx) * 2.0;
        c.group.position.y = c.y + Math.cos(t * c.speed * 0.7 * speedMult + idx) * 0.3;
      });

      starPoints.rotation.y = t * 0.01 * speedMult;

      heartsData.forEach((h, idx) => {
        h.mesh.position.y += h.speed * 0.008 * speedMult;
        h.mesh.position.x = h.x + Math.sin(t * 0.8 * speedMult + idx) * 0.2;
        if (h.mesh.position.y > 6) h.mesh.position.y = -5;
      });

      const positions = particlePoints.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += (Math.sin(t + i) * 0.002 + 0.001) * speedMult;
        if (positions[i * 3 + 1] > 8) positions[i * 3 + 1] = -8;
      }
      particlePoints.geometry.attributes.position.needsUpdate = true;

      if (!prefersReducedMotion) {
        camera.position.x += (mouseX - camera.position.x) * 0.04;
        camera.position.y += (-mouseY - camera.position.y) * 0.04;
      }
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMobile, enterGlow, bloomStage, atmosphere]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
