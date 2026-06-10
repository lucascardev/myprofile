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

    // === Create Matrix Texture (Glyph Map) ===
    // We create a canvas texture containing characters to render them in 3D
    const glyphCanvas = document.createElement('canvas');
    glyphCanvas.width = 128;
    glyphCanvas.height = 128;
    const gCtx = glyphCanvas.getContext('2d');
    gCtx.fillStyle = '#000000';
    gCtx.fillRect(0, 0, 128, 128);
    gCtx.fillStyle = '#ffffff';
    gCtx.font = 'bold 90px monospace';
    gCtx.textAlign = 'center';
    gCtx.textBaseline = 'middle';
    gCtx.fillText('1', 64, 64); // Render a '1' or binary code symbol
    const glyphTexture = new THREE.CanvasTexture(glyphCanvas);

    // === Particle Setup (Digital Rain Streams) ===
    const streamCount = 120;
    const particlesPerStream = 20;
    const particleCount = streamCount * particlesPerStream;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const streams = [];

    for (let i = 0; i < streamCount; i++) {
      // Scatter stream column positions in X and Z
      const x = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 80 - 10; // depth range
      const speed = Math.random() * 0.4 + 0.1;
      const length = particlesPerStream;
      const spacing = Math.random() * 1.5 + 0.8;
      
      // Starting head position (above screen)
      const headY = Math.random() * 80 + 30;

      streams.push({
        x,
        z,
        headY,
        speed,
        length,
        spacing,
      });
    }

    // Geometry & Material
    const geometry = new THREE.BufferGeometry();
    
    const material = new THREE.PointsMaterial({
      size: 1.8,
      map: glyphTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Camera target for mouse movement
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      // Normalize mouse positions between -1 and 1
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
      
      targetX = mouseX * 25; // camera movement bounds
      targetY = mouseY * 15;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Update positions & colors in buffer
    const updateParticles = () => {
      let idx = 0;
      
      streams.forEach((stream) => {
        // Update stream head position
        stream.headY -= stream.speed;
        
        // Reset stream if the entire tail goes below screen
        if (stream.headY - (stream.length * stream.spacing) < -50) {
          stream.headY = 50 + Math.random() * 20;
          stream.x = (Math.random() - 0.5) * 120;
          stream.z = (Math.random() - 0.5) * 80 - 10;
        }

        // Place each particle in the stream
        for (let j = 0; j < stream.length; j++) {
          const y = stream.headY - (j * stream.spacing);
          
          positions[idx * 3] = stream.x;
          positions[idx * 3 + 1] = y;
          positions[idx * 3 + 2] = stream.z;

          // Color calculation: Head is bright white/green, tail fades out
          const tailFade = 1.0 - (j / stream.length);
          
          // Add some sparkle/glitch to random tail positions
          const glitched = Math.random() < 0.05;
          const greenIntensity = glitched ? 1.0 : tailFade;
          const redBlueIntensity = j === 0 ? 0.8 : (glitched ? 0.4 : 0.0); // white head, green tail

          colors[idx * 3] = redBlueIntensity; // Red
          colors[idx * 3 + 1] = greenIntensity; // Green
          colors[idx * 3 + 2] = redBlueIntensity; // Blue

          sizes[idx] = j === 0 ? 2.5 : 1.5 * tailFade;

          idx++;
        }
      });

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      // Note: PointsMaterial size can't be set per-vertex easily in older Three versions 
      // without shaders, but vertex colors work perfectly to fade particles out.
      
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    };

    // Animation Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth camera interpolation (ease mouse tilt)
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, -20); // Look at mid-depth

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
      
      geometry.dispose();
      material.dispose();
      glyphTexture.dispose();
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
