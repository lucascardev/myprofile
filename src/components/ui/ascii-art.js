// src/components/ui/ascii-art.js
import React, { useRef, useEffect, useState, useCallback } from 'react';

const MATRIX_LOW = ' .:-=+10';
const MATRIX_MID = '10XYZTY7*=#%';
const MATRIX_HIGH = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ#@$%&';
const STANDARD_CHARS = ' .:-=+*#%@';

export function AsciiArt({
  src,
  fallbackSrc,
  resolution = 80,
  color = '#00ff00',
  animationStyle = 'matrix',
  inverted = false,
  transparent = false,
  scale = 1.0,
  faceCenter = { x: 0.46, y: 0.48 },
  animateOnView = false,
  className = '',
  style = {},
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
    imgAspect: 1,
    scale,
    color,
    animationStyle,
    inverted,
    transparent,
    faceCenter,
  });

  // Keep ref up to date with latest props
  stateRef.current.color = color;
  stateRef.current.animationStyle = animationStyle;
  stateRef.current.inverted = inverted;
  stateRef.current.transparent = transparent;
  stateRef.current.faceCenter = faceCenter;
  stateRef.current.scale = scale;

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

      const { 
        originalGrid, 
        cols, 
        rows, 
        color: renderColor, 
        animationStyle: renderStyle, 
        transparent: isTransparent, 
        faceCenter: currentFaceCenter,
        imgAspect,
        scale: currentScale 
      } = stateRef.current;
      if (!originalGrid || originalGrid.length === 0) return;

      // Make canvas display-density aware (HDPI)
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const container = containerRef.current;
      const containerRect = container ? container.getBoundingClientRect() : rect;
      
      const containerWidth = containerRect.width || rect.width || 400;
      const containerHeight = containerRect.height || rect.height || 400;
      
      // True visual aspect ratio of the rendered image:
      // Monospace characters have an aspect ratio of ~0.55 (width / height).
      // rows was calculated as cols * (img.height / img.width) * 0.55.
      // So on screen, visualAspect = (cols / rows) * 0.55 = img.width / img.height.
      const visualAspect = imgAspect || ((cols / rows) * 0.55);

      let targetWidth = containerWidth;
      let targetHeight = targetWidth / visualAspect;

      // Fit within container boundaries so entire portrait is visible at 100% zoom
      if (isTransparent) {
        targetHeight = containerHeight;
        targetWidth = containerHeight * visualAspect;
        if (targetWidth > containerWidth) {
          targetWidth = containerWidth;
          targetHeight = containerWidth / visualAspect;
        }
        const effectiveScale = (currentScale && currentScale > 0) ? currentScale : 1.0;
        targetWidth = Math.round(targetWidth * effectiveScale);
        targetHeight = Math.round(targetHeight * effectiveScale);
      } else {
        const effectiveScale = currentScale || 1.0;
        targetWidth = Math.round(targetWidth * effectiveScale);
        targetHeight = Math.round(targetHeight * effectiveScale);
      }
      
      const pixelWidth = Math.round(targetWidth * dpr);
      const pixelHeight = Math.round(targetHeight * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        canvas.style.width = `${Math.round(targetWidth)}px`;
        canvas.style.height = `${Math.round(targetHeight)}px`;
        ctx.scale(dpr, dpr);
      }

      // Render background
      if (isTransparent) {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
      } else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Character cell dimensions
      const cellWidth = targetWidth / cols;
      const cellHeight = targetHeight / rows;

      ctx.font = `bold ${Math.max(6, Math.round(cellHeight * 0.95))}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Neon glow setup
      ctx.shadowColor = renderColor;
      ctx.shadowBlur = isTransparent ? 6 : 4;

      // Animation parameters
      const time = performance.now() * 0.002; // Slower speed for natural organic animation
      const smileFactor = (Math.sin(time) + 1) / 2; // Pulsating value from 0 to 1 for smile morph
      const breathe = Math.sin(time * 0.6) * 0.012; // Slow breathing size pulse
      const swayX = Math.sin(time * 0.4) * 0.015; // Slow horizontal head bobbing/sway
      const swayY = Math.cos(time * 0.3) * 0.010; // Slow vertical head bobbing/sway

      const mx = currentFaceCenter?.x ?? 0.46;
      const my = currentFaceCenter?.y ?? 0.48;

      // Draw grid
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Calculate normalized coordinates
          const u = c / cols;
          const v = r / rows;

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
          if (!cell || cell.brightness < 20) continue;

          // Matrix Shimmer Effect within brightness tiers
          if (renderStyle === 'matrix') {
            if (Math.random() < cell.changeThreshold) {
              if (cell.brightness < 70) {
                cell.char = MATRIX_LOW[Math.floor(Math.random() * MATRIX_LOW.length)];
              } else if (cell.brightness < 140) {
                cell.char = MATRIX_MID[Math.floor(Math.random() * MATRIX_MID.length)];
              } else {
                cell.char = MATRIX_HIGH[Math.floor(Math.random() * MATRIX_HIGH.length)];
              }
            }
          }

          // Calculate opacity based on pixel brightness
          const alpha = (cell.brightness / 255) * 0.85 + 0.15;
          ctx.fillStyle = hexToRGBA(renderColor, alpha);

          // Center text in its cell
          const x = c * cellWidth + cellWidth / 2;
          const y = r * cellHeight + cellHeight / 2;
          
          ctx.fillText(cell.char, x, y);
        }
      }

      // Add a scanline effect for non-transparent mode
      if (!isTransparent) {
        ctx.shadowBlur = 0; // disable shadow for overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        for (let y = 0; y < targetHeight; y += 4) {
          ctx.fillRect(0, y, targetWidth, 1);
        }
      }

      stateRef.current.animationFrameId = requestAnimationFrame(render);
    };

    render();
  }, []);

  const getInitialChar = (brightness, isInverted) => {
    if (brightness < 20) return ' ';
    if (isInverted) {
      const idx = Math.min(Math.floor((brightness / 255) * STANDARD_CHARS.length), STANDARD_CHARS.length - 1);
      return STANDARD_CHARS[idx];
    }
    if (brightness < 70) return MATRIX_LOW[Math.floor(Math.random() * MATRIX_LOW.length)];
    if (brightness < 140) return MATRIX_MID[Math.floor(Math.random() * MATRIX_MID.length)];
    return MATRIX_HIGH[Math.floor(Math.random() * MATRIX_HIGH.length)];
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    if (stateRef.current.animationFrameId) {
      cancelAnimationFrame(stateRef.current.animationFrameId);
    }

    const isExternal = (url) => typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));

    const img = new Image();
    if (isExternal(src)) {
      img.crossOrigin = 'anonymous';
    }

    let triedFallback = false;

    img.onload = () => {
      if (!active) return;
      
      const cols = resolution;
      // For background, focus crop on portrait (head and shoulders, removing empty bottom and borders)
      const isBg = transparent;
      const cropX = isBg ? Math.round(img.width * 0.05) : 0;
      const cropY = 0;
      const cropW = isBg ? Math.round(img.width * 0.90) : img.width;
      const cropH = isBg ? Math.round(img.height * 0.75) : img.height;

      const rows = Math.round(cols * (cropH / cropW) * 0.55);

      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = cols;
      hiddenCanvas.height = rows;
      const ctx = hiddenCanvas.getContext('2d');
      
      if (!ctx) {
        setError(true);
        setLoading(false);
        return;
      }

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cols, rows);
      let imgData;
      try {
        imgData = ctx.getImageData(0, 0, cols, rows);
      } catch (err) {
        console.error('Failed to get image data (CORS):', err);
        if (!triedFallback && fallbackSrc && img.src !== fallbackSrc) {
          triedFallback = true;
          if (isExternal(fallbackSrc)) {
            img.crossOrigin = 'anonymous';
          } else {
            img.removeAttribute('crossorigin');
          }
          img.src = fallbackSrc;
          return;
        }
        setError(true);
        setLoading(false);
        return;
      }

      const data = imgData.data;
      const grid = [];
      for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c) * 4;
          const red = data[idx];
          const green = data[idx + 1];
          const blue = data[idx + 2];
          
          let rawBrightness = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
          
          // Contrast stretch: ignore background below 28, map [28, 160] to [0, 255]
          let brightness = 0;
          if (rawBrightness > 28) {
            brightness = Math.min(255, Math.max(0, ((rawBrightness - 28) / (160 - 28)) * 255));
          }

          row.push({
            rawBrightness,
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
      stateRef.current.imgAspect = cropW / cropH;
      stateRef.current.imageLoaded = true;

      setLoading(false);
      startRenderLoop();
    };

    img.onerror = () => {
      if (!active) return;
      if (!triedFallback && fallbackSrc && img.src !== fallbackSrc) {
        console.warn(`[AsciiArt] Failed to load "${img.src}", trying fallback "${fallbackSrc}"`);
        triedFallback = true;
        if (isExternal(fallbackSrc)) {
          img.crossOrigin = 'anonymous';
        } else {
          img.removeAttribute('crossorigin');
        }
        img.src = fallbackSrc;
        return;
      }
      setError(true);
      setLoading(false);
    };

    img.src = src;

    const currentRef = stateRef.current;
    return () => {
      active = false;
      if (currentRef.animationFrameId) {
        cancelAnimationFrame(currentRef.animationFrameId);
      }
    };
  }, [src, fallbackSrc, resolution, inverted, transparent, startRenderLoop]);

  // Handle color or animationStyle change without reloading image
  useEffect(() => {
    if (stateRef.current.imageLoaded) {
      startRenderLoop();
    }
  }, [color, animationStyle, transparent, startRenderLoop]);

  return (
    <div 
      ref={containerRef} 
      className={transparent ? className : `w-full mx-auto rounded border border-green-950 ${className}`}
      style={{ 
        position: 'relative',
        width: '100%',
        height: transparent ? '100%' : 'auto',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: transparent ? 'transparent' : '#000000',
        minHeight: transparent ? '0px' : '200px',
        border: transparent ? 'none' : undefined,
        ...style
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
          fontSize: '12px',
          backgroundColor: transparent ? 'transparent' : '#000000',
          zIndex: 10
        }}>
          <div style={{ marginBottom: '8px', opacity: 0.75, animation: 'scanline-pulse 1.5s infinite ease-in-out' }}>
            {transparent ? 'DECODING_MATRIX_BACKGROUND...' : 'ACCESSING STREAM DATA...'}
          </div>
          {!transparent && (
            <div style={{ width: '128px', backgroundColor: '#003b00', height: '4px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#00ff41', height: '100%', width: '40%', borderRadius: '4px', animation: 'scanline-loading 1.5s infinite ease-in-out' }}></div>
            </div>
          )}
        </div>
      )}
      {error && !transparent && (
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
        className="block"
        style={{ 
          display: loading || error ? 'none' : 'block',
          ...(transparent ? {} : { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' })
        }}
      />
    </div>
  );
}
