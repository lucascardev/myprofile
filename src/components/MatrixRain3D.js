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
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // === Create Matrix Textures (Glyph Maps) ===
    // Canvas for '1'
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

    // Canvas for '0'
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
    const streamCount = 120;
    const particlesPerStream = 20;
    const halfStreamCount = streamCount / 2;
    const particleCountHalf = halfStreamCount * particlesPerStream;
    
    // Arrays for '1'
    const positions1 = new Float32Array(particleCountHalf * 3);
    const colors1 = new Float32Array(particleCountHalf * 3);
    
    // Arrays for '0'
    const positions0 = new Float32Array(particleCountHalf * 3);
    const colors0 = new Float32Array(particleCountHalf * 3);

    const streams = [];

    for (let i = 0; i < streamCount; i++) {
      // Scatter stream column positions in X and Z
      const x = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 80 - 10; // depth range
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
        charType: i % 2 // Alternating streams render '0' or '1'
      });
    }

    // Geometries & Materials
    const geometry1 = new THREE.BufferGeometry();
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

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
      
      targetX = mouseX * 25;
      targetY = mouseY * 15;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Update positions & colors in buffer
    const updateParticles = () => {
      let idx0 = 0;
      let idx1 = 0;
      
      streams.forEach((stream) => {
        stream.headY -= stream.speed;
        
        if (stream.headY - (stream.length * stream.spacing) < -50) {
          stream.headY = 50 + Math.random() * 20;
          stream.x = (Math.random() - 0.5) * 120;
          stream.z = (Math.random() - 0.5) * 80 - 10;
        }

        const isOne = stream.charType === 1;
        const positions = isOne ? positions1 : positions0;
        const colors = isOne ? colors1 : colors0;
        const currentIdx = isOne ? idx1 : idx0;

        for (let j = 0; j < stream.length; j++) {
          const y = stream.headY - (j * stream.spacing);
          const pIdx = currentIdx + j * 3;
          
          positions[pIdx] = stream.x;
          positions[pIdx + 1] = y;
          positions[pIdx + 2] = stream.z;

          const tailFade = 1.0 - (j / stream.length);
          const glitched = Math.random() < 0.05;
          const greenIntensity = glitched ? 1.0 : tailFade;
          const redBlueIntensity = j === 0 ? 0.8 : (glitched ? 0.4 : 0.0);

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

      geometry1.setAttribute('position', new THREE.BufferAttribute(positions1, 3));
      geometry1.setAttribute('color', new THREE.BufferAttribute(colors1, 3));
      geometry1.attributes.position.needsUpdate = true;
      geometry1.attributes.color.needsUpdate = true;

      geometry0.setAttribute('position', new THREE.BufferAttribute(positions0, 3));
      geometry0.setAttribute('color', new THREE.BufferAttribute(colors0, 3));
      geometry0.attributes.position.needsUpdate = true;
      geometry0.attributes.color.needsUpdate = true;
    };

    // Animation Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, -20);

      updateParticles();

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
      if (container && renderer.domElement) {
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
        pointerEvents: 'none', // Allow mouse to click elements underneath
        overflow: 'hidden',
      }}
    />
  );
}
