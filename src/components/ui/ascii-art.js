// src/components/ui/ascii-art.js
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createAsciiWorker } from './asciiWorker';

const MATRIX_LOW = ' .:-=+10';
const MATRIX_MID = '10XYZTY7*=#%';
const MATRIX_HIGH = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ#@$%&';
const STANDARD_CHARS = ' .:-=+*#%@';

export function AsciiArt({
  src,
  fallbackSrc,
  resolution = 80,
  mobileResolution = 80,
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
  const workerRef = useRef(null);
  const offscreenTransferredRef = useRef(false);
  const isVisibleRef = useRef(true);

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
    cols: 0,
    rows: 0,
    scale,
    color,
    animationStyle,
    inverted,
    transparent,
    faceCenter,
    useWorker: false,
  });

  // Keep refs up to date with latest props
  stateRef.current.color = color;
  stateRef.current.animationStyle = animationStyle;
  stateRef.current.inverted = inverted;
  stateRef.current.transparent = transparent;
  stateRef.current.faceCenter = faceCenter;
  stateRef.current.scale = scale;

  // Precomputed color table for fallback mode
  const colorLookupRef = useRef(new Array(256));
  const updateColorLookup = useCallback((hex) => {
    let r = 0, g = 255, b = 65;
    if (hex && hex.startsWith('#')) {
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
    for (let i = 0; i < 256; i++) {
      const alpha = Math.pow(i / 255, 1.05) * 0.88 + 0.12;
      colorLookupRef.current[i] = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
    }
  }, []);

  // Main thread fallback render loop (throttled to 30 FPS without heavy per-character shadowBlur)
  const startFallbackRenderLoop = useCallback(() => {
    if (stateRef.current.animationFrameId) {
      cancelAnimationFrame(stateRef.current.animationFrameId);
      stateRef.current.animationFrameId = null;
    }

    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastFrameTime = performance.now();

    const render = (now) => {
      if (!isVisibleRef.current) {
        stateRef.current.animationFrameId = requestAnimationFrame(render);
        return;
      }

      stateRef.current.animationFrameId = requestAnimationFrame(render);

      const elapsed = now - lastFrameTime;
      if (elapsed < FRAME_INTERVAL) return;
      lastFrameTime = now - (elapsed % FRAME_INTERVAL);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const {
        originalGrid,
        cols,
        rows,
        animationStyle: renderStyle,
        transparent: isTransparent,
        faceCenter: currentFaceCenter,
        imgAspect,
        scale: currentScale,
      } = stateRef.current;
      if (!originalGrid || originalGrid.length === 0) return;

      const dpr = window.devicePixelRatio || 1;
      const container = containerRef.current;
      const containerRect = container ? container.getBoundingClientRect() : canvas.getBoundingClientRect();

      const containerWidth = containerRect.width || 400;
      const containerHeight = containerRect.height || 400;

      const visualAspect = imgAspect || ((cols / rows) * 0.55);

      let targetWidth = containerWidth;
      let targetHeight = targetWidth / visualAspect;

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
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (isTransparent) {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
      } else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      const cellWidth = targetWidth / cols;
      const cellHeight = targetHeight / rows;

      const fontSize = Math.max(3.2, cellHeight * 0.92);
      ctx.font = `bold ${fontSize.toFixed(1)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const time = now * 0.002;
      const smileFactor = (Math.sin(time) + 1) / 2;
      const breathe = Math.sin(time * 0.6) * 0.012;
      const swayX = Math.sin(time * 0.4) * 0.015;
      const swayY = Math.cos(time * 0.3) * 0.010;

      const mx = currentFaceCenter?.x ?? 0.48;
      const my = currentFaceCenter?.y ?? 0.36;

      const lookup = colorLookupRef.current;

      for (let r = 0; r < rows; r++) {
        const rowData = originalGrid[r];
        if (!rowData) continue;

        for (let c = 0; c < cols; c++) {
          const u = c / cols;
          const v = r / rows;

          const rx = u - mx;
          const ry = v - my;
          const dist = Math.sqrt(rx * rx + ry * ry);

          let sampleU = u;
          let sampleV = v;

          if (dist < 0.18) {
            const strength = Math.pow(1.0 - dist / 0.18, 1.8);
            sampleU = u - rx * 0.22 * strength * smileFactor;
            sampleV = v + Math.abs(rx) * 0.25 * strength * smileFactor;
          }

          sampleU = mx + (sampleU - mx) * (1.0 + breathe);
          sampleV = my + (sampleV - my) * (1.0 + breathe);

          sampleU += swayX;
          sampleV += swayY;

          const sampleC = Math.min(Math.max(0, Math.round(sampleU * (cols - 1))), cols - 1);
          const sampleR = Math.min(Math.max(0, Math.round(sampleV * (rows - 1))), rows - 1);

          const cell = originalGrid[sampleR]?.[sampleC];
          if (!cell || cell.brightness < 20) continue;

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

          ctx.fillStyle = lookup[cell.brightness] || lookup[128];

          const x = c * cellWidth + cellWidth / 2;
          const y = r * cellHeight + cellHeight / 2;

          ctx.fillText(cell.char, x, y);
        }
      }

      if (!isTransparent) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        for (let y = 0; y < targetHeight; y += 4) {
          ctx.fillRect(0, y, targetWidth, 1);
        }
      }
    };

    lastFrameTime = performance.now();
    stateRef.current.animationFrameId = requestAnimationFrame(render);
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

  // Image loader and grid initializer
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    updateColorLookup(color);

    if (stateRef.current.animationFrameId) {
      cancelAnimationFrame(stateRef.current.animationFrameId);
      stateRef.current.animationFrameId = null;
    }

    const isExternal = (url) => typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));

    const img = new Image();
    if (isExternal(src)) {
      img.crossOrigin = 'anonymous';
    }

    let triedFallback = false;

    img.onload = () => {
      if (!active) return;

      const isMobileView = typeof window !== 'undefined' && window.innerWidth <= 768;
      const cols = isMobileView ? (mobileResolution || 80) : resolution;
      const isBg = transparent;

      // On mobile view, crop tighter around the portrait to fit vertical terminal console
      const cropX = isBg ? (isMobileView ? Math.round(img.width * 0.10) : Math.round(img.width * 0.05)) : 0;
      const cropY = 0;
      const cropW = isBg ? (isMobileView ? Math.round(img.width * 0.80) : Math.round(img.width * 0.90)) : img.width;
      const cropH = isBg ? (isMobileView ? Math.round(img.height * 0.85) : Math.round(img.height * 0.75)) : img.height;

      const rows = Math.round(cols * (cropH / cropW) * 0.55);

      const effectiveFaceCenter = isMobileView ? { x: 0.50, y: 0.38 } : faceCenter;

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

      // Attempt OffscreenCanvas with Web Worker
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const rect = container ? container.getBoundingClientRect() : (canvas ? canvas.getBoundingClientRect() : { width: 400, height: 400 });
      const containerWidth = rect.width || 400;
      const containerHeight = rect.height || 400;
      const dpr = window.devicePixelRatio || 1;

      const supportsOffscreen = canvas && typeof canvas.transferControlToOffscreen === 'function' && typeof Worker !== 'undefined';

      if (supportsOffscreen && !offscreenTransferredRef.current) {
        try {
          if (!workerRef.current) {
            workerRef.current = createAsciiWorker();
          }

          const offscreenCanvas = canvas.transferControlToOffscreen();
          offscreenTransferredRef.current = true;
          stateRef.current.useWorker = true;

          workerRef.current.postMessage(
            {
              type: 'INIT',
              payload: {
                canvas: offscreenCanvas,
                grid,
                cols,
                rows,
                imgAspect: cropW / cropH,
                color,
                animationStyle,
                transparent,
                scale,
                faceCenter: effectiveFaceCenter,
                containerWidth,
                containerHeight,
                dpr,
              },
            },
            [offscreenCanvas]
          );
          return;
        } catch (workerErr) {
          console.warn('[AsciiArt] OffscreenCanvas transfer failed, falling back to main-thread canvas:', workerErr);
          stateRef.current.useWorker = false;
        }
      } else if (stateRef.current.useWorker && workerRef.current) {
        // Worker already initialized, send updated grid and dimensions
        workerRef.current.postMessage({
          type: 'UPDATE_CONFIG',
          payload: {
            grid,
            cols,
            rows,
            imgAspect: cropW / cropH,
            color,
            animationStyle,
            scale,
            faceCenter: effectiveFaceCenter,
            transparent,
          },
        });
        return;
      }

      // Main-thread fallback
      startFallbackRenderLoop();
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
        currentRef.animationFrameId = null;
      }
    };
  }, [src, fallbackSrc, resolution, mobileResolution, inverted, transparent, color, animationStyle, scale, faceCenter, updateColorLookup, startFallbackRenderLoop]);

  // Handle color or animationStyle prop updates
  useEffect(() => {
    updateColorLookup(color);
    if (stateRef.current.useWorker && workerRef.current) {
      workerRef.current.postMessage({
        type: 'UPDATE_CONFIG',
        payload: { color, animationStyle, scale, faceCenter, transparent },
      });
    } else if (stateRef.current.imageLoaded && !stateRef.current.useWorker) {
      startFallbackRenderLoop();
    }
  }, [color, animationStyle, scale, faceCenter, transparent, updateColorLookup, startFallbackRenderLoop]);

  // Handle resize and visibility pausing (IntersectionObserver + Page Visibility)
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const payload = {
        containerWidth: rect.width || 400,
        containerHeight: rect.height || 400,
        dpr: window.devicePixelRatio || 1,
      };

      if (stateRef.current.useWorker && workerRef.current) {
        workerRef.current.postMessage({ type: 'RESIZE', payload });
      }
    };

    let resizeTimer = null;
    const debouncedResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);

    const handleVisibility = () => {
      const isVisible = !document.hidden && isVisibleRef.current;
      if (stateRef.current.useWorker && workerRef.current) {
        workerRef.current.postMessage({ type: isVisible ? 'RESUME' : 'PAUSE' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    let observer = null;
    if (containerRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const inView = entry.isIntersecting;
            isVisibleRef.current = inView;
            if (stateRef.current.useWorker && workerRef.current) {
              workerRef.current.postMessage({ type: inView && !document.hidden ? 'RESUME' : 'PAUSE' });
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', debouncedResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'DESTROY' });
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

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
        ...style,
      }}
    >
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00ff41',
            fontFamily: 'monospace',
            fontSize: '12px',
            backgroundColor: transparent ? 'transparent' : '#000000',
            zIndex: 10,
          }}
        >
          <div style={{ marginBottom: '8px', opacity: 0.75, animation: 'scanline-pulse 1.5s infinite ease-in-out' }}>
            {transparent ? 'DECODING_MATRIX_BACKGROUND...' : 'ACCESSING STREAM DATA...'}
          </div>
          {!transparent && (
            <div style={{ width: '128px', backgroundColor: '#003b00', height: '4px', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  backgroundColor: '#00ff41',
                  height: '100%',
                  width: '40%',
                  borderRadius: '4px',
                  animation: 'scanline-loading 1.5s infinite ease-in-out',
                }}
              ></div>
            </div>
          )}
        </div>
      )}
      {error && !transparent && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
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
            border: '1px solid #ff5555',
          }}
        >
          <div>[ERROR: DECRYPTION_FAILED]</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#aa0000' }}>COULD NOT LOAD IMAGE BINARY FROM SOURCE</div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          display: loading || error ? 'none' : 'block',
          filter: 'drop-shadow(0 0 2px rgba(0, 255, 65, 0.45))',
          willChange: 'transform',
          maxWidth: '100%',
          maxHeight: '100%',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
