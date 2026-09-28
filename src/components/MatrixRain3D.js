// src/components/MatrixRain3D.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function MatrixRain3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // === Scene ===
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    // === Camera ===
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    container.appendChild(renderer.domElement);

    // === Create Matrix Textures (Glyph Maps) ===
    const glyphCanvas1 = document.createElement('canvas');
    glyphCanvas1.width = 128;
    glyphCanvas1.height = 128;
    const gCtx1 = glyphCanvas1.getContext('2d');
    gCtx1.fillStyle = '#000000';
    gCtx1.fillRect(0, 0, 128, 128);
    gCtx1.fillStyle = '#ffffff';
    gCtx1.font = 'bold 90px monospace';
    gCtx1.textAlign = 'center';
    gCtx1.textBaseline = 'middle';
    gCtx1.fillText('1', 64, 64);
    const glyphTexture1 = new THREE.CanvasTexture(glyphCanvas1);

    const glyphCanvas0 = document.createElement('canvas');
    glyphCanvas0.width = 128;
    glyphCanvas0.height = 128;
    const gCtx0 = glyphCanvas0.getContext('2d');
    gCtx0.fillStyle = '#000000';
    gCtx0.fillRect(0, 0, 128, 128);
    gCtx0.fillStyle = '#ffffff';
    gCtx0.font = 'bold 90px monospace';
    gCtx0.textAlign = 'center';
    gCtx0.textBaseline = 'middle';
    gCtx0.fillText('0', 64, 64);
    const glyphTexture0 = new THREE.CanvasTexture(glyphCanvas0);

    // === Particle Setup (Digital Rain Streams) ===
    const streamCount = 100;
    const particlesPerStream = 18;
    const halfStreamCount = streamCount / 2;
    const particleCountHalf = halfStreamCount * particlesPerStream;

    const positions1 = new Float32Array(particleCountHalf * 3);
    const colors1 = new Float32Array(particleCountHalf * 3);

    const positions0 = new Float32Array(particleCountHalf * 3);
    const colors0 = new Float32Array(particleCountHalf * 3);

    const streams = [];

    for (let i = 0; i < streamCount; i++) {
      const x = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 80 - 10;
      const speed = Math.random() * 0.4 + 0.1;
      const length = particlesPerStream;
      const spacing = Math.random() * 1.5 + 0.8;
      const headY = Math.random() * 80 + 30;

      streams.push({
        x,
        z,
        headY,
        speed,
        length,
        spacing,
        charType: i % 2,
      });
    }

    // Geometries & Materials (Allocated ONCE)
    const geometry1 = new THREE.BufferGeometry();
    const posAttr1 = new THREE.BufferAttribute(positions1, 3);
    const colAttr1 = new THREE.BufferAttribute(colors1, 3);
    posAttr1.setUsage(THREE.DynamicDrawUsage);
    colAttr1.setUsage(THREE.DynamicDrawUsage);
    geometry1.setAttribute('position', posAttr1);
    geometry1.setAttribute('color', colAttr1);

    const material1 = new THREE.PointsMaterial({
      size: 1.8,
      map: glyphTexture1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });
    const points1 = new THREE.Points(geometry1, material1);
    scene.add(points1);

    const geometry0 = new THREE.BufferGeometry();
    const posAttr0 = new THREE.BufferAttribute(positions0, 3);
    const colAttr0 = new THREE.BufferAttribute(colors0, 3);
    posAttr0.setUsage(THREE.DynamicDrawUsage);
    colAttr0.setUsage(THREE.DynamicDrawUsage);
    geometry0.setAttribute('position', posAttr0);
    geometry0.setAttribute('color', colAttr0);

    const material0 = new THREE.PointsMaterial({
      size: 1.8,
      map: glyphTexture0,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });
    const points0 = new THREE.Points(geometry0, material0);
    scene.add(points0);

    // Camera target for mouse movement
    let targetX = 0;
    let targetY = 0;
    let mouseTicking = false;

    const handleMouseMove = (e) => {
      if (mouseTicking) return;
      mouseTicking = true;
      requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = container.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
        targetX = mouseX * 25;
        targetY = mouseY * 15;
        mouseTicking = false;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // In-place buffer updates without garbage-collection overhead
    const updateParticles = () => {
      let idx0 = 0;
      let idx1 = 0;

      streams.forEach((stream) => {
        stream.headY -= stream.speed;

        if (stream.headY - stream.length * stream.spacing < -50) {
          stream.headY = 50 + Math.random() * 20;
          stream.x = (Math.random() - 0.5) * 120;
          stream.z = (Math.random() - 0.5) * 80 - 10;
        }

        const isOne = stream.charType === 1;
        const positions = isOne ? positions1 : positions0;
        const colors = isOne ? colors1 : colors0;
        const currentIdx = isOne ? idx1 : idx0;

        for (let j = 0; j < stream.length; j++) {
          const y = stream.headY - j * stream.spacing;
          const pIdx = currentIdx + j * 3;

          positions[pIdx] = stream.x;
          positions[pIdx + 1] = y;
          positions[pIdx + 2] = stream.z;

          const tailFade = 1.0 - j / stream.length;
          const glitched = Math.random() < 0.05;
          const greenIntensity = glitched ? 1.0 : tailFade;
          const redBlueIntensity = j === 0 ? 0.8 : glitched ? 0.4 : 0.0;

          colors[pIdx] = redBlueIntensity;
          colors[pIdx + 1] = greenIntensity;
          colors[pIdx + 2] = redBlueIntensity;
        }

        if (isOne) {
          idx1 += stream.length * 3;
        } else {
          idx0 += stream.length * 3;
        }
      });

      // Update existing buffer attributes in place
      posAttr1.needsUpdate = true;
      colAttr1.needsUpdate = true;
      posAttr0.needsUpdate = true;
      colAttr0.needsUpdate = true;
    };

    // Animation Loop with 30 FPS cap and Visibility Pausing
    let animationId;
    let isVisible = true;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastFrameTime = performance.now();

    const animate = (now) => {
      animationId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) return;

      const elapsed = now - lastFrameTime;
      if (elapsed < FRAME_INTERVAL) return;
      lastFrameTime = now - (elapsed % FRAME_INTERVAL);

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, -20);

      updateParticles();

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // Page Visibility and IntersectionObserver Pausing
    const handleVisibility = () => {
      if (!document.hidden && isVisible) {
        lastFrameTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let observer = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              lastFrameTime = performance.now();
            }
          });
        },
        { threshold: 0.01 }
      );
      observer.observe(container);
    }

    // Debounced Resize Handler
    let resizeTimer = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!containerRef.current) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }, 100);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      cancelAnimationFrame(animationId);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry1.dispose();
      material1.dispose();
      glyphTexture1.dispose();

      geometry0.dispose();
      material0.dispose();
      glyphTexture0.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        willChange: 'transform',
      }}
    />
  );
}
