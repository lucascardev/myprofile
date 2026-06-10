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
    grid: [],
    width: 0,
    height: 0,
    animationFrameId: null,
    imageLoaded: false,
    imageData: null,
    color,
    animationStyle,
    inverted,
  });

  // Keep ref up to date with latest color and style props to avoid react re-render cycles in animation
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

      const { grid, cols, rows, color: renderColor, animationStyle: renderStyle } = stateRef.current;
      if (!grid || grid.length === 0) return;

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

      // Draw grid
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];
          
          // Skip drawing if pixel is dark (space character)
          if (cell.brightness < 15) continue;

          // Matrix Shimmer Effect
          if (renderStyle === 'matrix') {
            if (Math.random() < cell.changeThreshold) {
              // Brighter pixels get shinier matrix characters
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

      if (renderStyle === 'matrix') {
        stateRef.current.animationFrameId = requestAnimationFrame(render);
      }
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

      stateRef.current.grid = grid;
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
      className={`relative w-full overflow-hidden flex items-center justify-center bg-black ${className}`}
      style={{ minHeight: '200px' }}
    >
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-green-500 font-mono text-sm bg-black z-10">
          <div className="animate-pulse mb-2">ACCESSING STREAM DATA...</div>
          <div className="w-32 bg-green-950 h-1 rounded overflow-hidden">
            <div className="bg-green-500 h-full animate-[loading_1.5s_infinite_ease-in-out]" style={{ width: '40%' }}></div>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 font-mono text-sm bg-black z-10 p-4 text-center border border-red-500">
          <div>[ERROR: DECRYPTION_FAILED]</div>
          <div className="text-xs mt-2 text-red-700">COULD NOT LOAD IMAGE BINARY FROM SOURCE</div>
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
