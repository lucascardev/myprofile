// src/components/ui/ascii-art.js
import React, { useRef, useEffect, useState, useCallback } from 'react';

const MATRIX_CHARS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*+-=';
const STANDARD_CHARS = '@%#*+=-:. ';

export function AsciiArt({
  src,
  resolution = 80,
  color = '#00ff00',
  animationStyle = 'matrix',
  inverted = false,
  animateOnView = false,
  className = '',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const stateRef = useRef({
    originalGrid: [],
    width: 0,
    height: 0,
    animationFrameId: null,
    imageLoaded: false,
    imageData: null,
    color,
    animationStyle,
    inverted,
  });

  // Keep ref up to date with latest props
  stateRef.current.color = color;
  stateRef.current.animationStyle = animationStyle;
  stateRef.current.inverted = inverted;

  const hexToRGBA = (hex, alpha) => {
    let r = 0, g = 255, b = 0;
    if (hex.startsWith('#')) {
      const h = hex.substring(1);
      if (h.length === 3) {
        r = parseInt(h[0] + h[0], 16);
        g = parseInt(h[1] + h[1], 16);
        b = parseInt(h[2] + h[2], 16);
      } else if (h.length === 6) {
        r = parseInt(h.substring(0, 2), 16);
        g = parseInt(h.substring(2, 4), 16);
        b = parseInt(h.substring(4, 6), 16);
      }
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const startRenderLoop = useCallback(() => {
    if (stateRef.current.animationFrameId) {
      cancelAnimationFrame(stateRef.current.animationFrameId);
    }

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { originalGrid, cols, rows, color: renderColor, animationStyle: renderStyle } = stateRef.current;
      if (!originalGrid || originalGrid.length === 0) return;

      // Make canvas display-density aware (HDPI)
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set actual render size based on container client size
      const targetWidth = rect.width || 400;
      const targetHeight = rect.width * (rows / cols) || 400;
      
      if (canvas.width !== targetWidth * dpr || canvas.height !== targetHeight * dpr) {
        canvas.width = targetWidth * dpr;
        canvas.height = targetHeight * dpr;
        ctx.scale(dpr, dpr);
      }

      // Render background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Character cell dimensions
      const cellWidth = targetWidth / cols;
      const cellHeight = targetHeight / rows;

      ctx.font = `bold ${cellHeight}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Neon glow setup (subtle for performance)
      ctx.shadowColor = renderColor;
      ctx.shadowBlur = 4;

      // Animation parameters
      const time = performance.now() * 0.002; // Slower speed for natural organic animation
      const smileFactor = (Math.sin(time) + 1) / 2; // Pulsating value from 0 to 1 for smile morph
      const breathe = Math.sin(time * 0.6) * 0.012; // Slow breathing size pulse
      const swayX = Math.sin(time * 0.4) * 0.015; // Slow horizontal head bobbing/sway
      const swayY = Math.cos(time * 0.3) * 0.010; // Slow vertical head bobbing/sway

      // Draw grid
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Calculate normalized coordinates
          const u = c / cols;
          const v = r / rows;

          // Mouth coordinates in user's profile photo (analyzed at mx=0.58, my=0.46)
          const mx = 0.58;
          const my = 0.46;
          const rx = u - mx;
          const ry = v - my;
          const dist = Math.sqrt(rx * rx + ry * ry);

          let sampleU = u;
          let sampleV = v;

          // Apply a smooth facial smile warp (distort coordinates near the mouth)
          if (dist < 0.18) {
            const strength = Math.pow(1.0 - dist / 0.18, 1.8); // Smooth falloff
            
            // Stretch mouth horizontally (widen)
            sampleU = u - rx * 0.22 * strength * smileFactor;
            
            // Curve mouth corners upwards (lift)
            sampleV = v + Math.abs(rx) * 0.25 * strength * smileFactor;
          }

          // Apply generic head breathing effect (pulse head scale slowly)
          sampleU = mx + (sampleU - mx) * (1.0 + breathe);
          sampleV = my + (sampleV - my) * (1.0 + breathe);

          // Apply slow head bobbing/sway
          sampleU += swayX;
          sampleV += swayY;

          // Bound coordinates
          const sampleC = Math.min(Math.max(0, Math.round(sampleU * (cols - 1))), cols - 1);
          const sampleR = Math.min(Math.max(0, Math.round(sampleV * (rows - 1))), rows - 1);

          const cell = originalGrid[sampleR][sampleC];
          if (!cell || cell.brightness < 15) continue;

          // Matrix Shimmer Effect
          if (renderStyle === 'matrix') {
            if (Math.random() < cell.changeThreshold) {
              cell.char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            }
          }

          // Calculate opacity based on pixel brightness
          const alpha = cell.brightness / 255;
          ctx.fillStyle = hexToRGBA(renderColor, alpha);

          // Center text in its cell
          const x = c * cellWidth + cellWidth / 2;
          const y = r * cellHeight + cellHeight / 2;
          
          ctx.fillText(cell.char, x, y);
        }
      }

      // Add a scanline effect
      ctx.shadowBlur = 0; // disable shadow for overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let y = 0; y < targetHeight; y += 4) {
        ctx.fillRect(0, y, targetWidth, 1);
      }

      stateRef.current.animationFrameId = requestAnimationFrame(render);
    };

    render();
  }, []);

  const getInitialChar = (brightness, isInverted) => {
    const charList = isInverted ? STANDARD_CHARS.split('').reverse().join('') : STANDARD_CHARS;
    const index = Math.min(
      Math.floor((brightness / 255) * charList.length),
      charList.length - 1
    );
    return charList[index];
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    if (stateRef.current.animationFrameId) {
      cancelAnimationFrame(stateRef.current.animationFrameId);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      if (!active) return;
      
      const cols = resolution;
      const rows = Math.round(resolution * (img.height / img.width) * 0.55);

      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = cols;
      hiddenCanvas.height = rows;
      const ctx = hiddenCanvas.getContext('2d');
      
      if (!ctx) {
        setError(true);
        setLoading(false);
        return;
      }

      ctx.drawImage(img, 0, 0, cols, rows);
      const imgData = ctx.getImageData(0, 0, cols, rows);
      const data = imgData.data;

      const grid = [];
      for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c) * 4;
          const red = data[idx];
          const green = data[idx + 1];
          const blue = data[idx + 2];
          
          let brightness = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
          
          row.push({
            brightness,
            char: getInitialChar(brightness, inverted),
            changeThreshold: Math.random() * 0.08 + 0.02,
          });
        }
        grid.push(row);
      }

      stateRef.current.originalGrid = grid;
      stateRef.current.cols = cols;
      stateRef.current.rows = rows;
      stateRef.current.imageLoaded = true;

      setLoading(false);
      startRenderLoop();
    };

    img.onerror = () => {
      if (!active) return;
      setError(true);
      setLoading(false);
    };

    const currentRef = stateRef.current;
    return () => {
      active = false;
      if (currentRef.animationFrameId) {
        cancelAnimationFrame(currentRef.animationFrameId);
      }
    };
  }, [src, resolution, inverted, startRenderLoop]);

  // Handle color or animationStyle change without reloading image
  useEffect(() => {
    if (stateRef.current.imageLoaded) {
      startRenderLoop();
    }
  }, [color, animationStyle, startRenderLoop]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full mx-auto rounded border border-green-950 ${className}`}
      style={{ 
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        minHeight: '200px'
      }}
    >
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, left: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00ff41',
          fontFamily: 'monospace',
          fontSize: '14px',
          backgroundColor: '#000000',
          zIndex: 10
        }}>
          <div style={{ marginBottom: '8px', animation: 'scanline-pulse 1.5s infinite ease-in-out' }}>ACCESSING STREAM DATA...</div>
          <div style={{ width: '128px', backgroundColor: '#003b00', height: '4px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#00ff41', height: '100%', width: '40%', borderRadius: '4px', animation: 'scanline-loading 1.5s infinite ease-in-out' }}></div>
          </div>
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, left: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff5555',
          fontFamily: 'monospace',
          fontSize: '14px',
          backgroundColor: '#000000',
          zIndex: 10,
          padding: '16px',
          textAlign: 'center',
          border: '1px solid #ff5555'
        }}>
          <div>[ERROR: DECRYPTION_FAILED]</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#aa0000' }}>COULD NOT LOAD IMAGE BINARY FROM SOURCE</div>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto block max-w-full"
        style={{ display: loading || error ? 'none' : 'block' }}
      />
    </div>
  );
}
