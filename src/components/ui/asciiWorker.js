/* eslint-disable no-restricted-globals */
// src/components/ui/asciiWorker.js
/**
 * AsciiArt Web Worker
 * Runs the heavy mathematical facial warp, matrix glitch animations,
 * and 2D canvas drawing on a background thread via OffscreenCanvas.
 */

export function createAsciiWorker() {
  const workerFunction = function () {
    const MATRIX_LOW = ' .:-=+10';
    const MATRIX_MID = '10XYZTY7*=#%';
    const MATRIX_HIGH = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ#@$%&';

    let canvas = null;
    let ctx = null;
    let isRunning = false;
    let animationFrameId = null;

    // State
    let originalGrid = [];
    let cols = 0;
    let rows = 0;
    let imgAspect = 1;
    let color = '#00ff41';
    let animationStyle = 'matrix';
    let isTransparent = true;
    let scale = 0.96;
    let faceCenter = { x: 0.48, y: 0.36 };
    let containerWidth = 400;
    let containerHeight = 400;
    let dpr = 1;

    // Precomputed color lookup table to avoid thousands of string allocations per frame
    let colorLookup = new Array(256);

    function updateColorLookup(hex) {
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
        colorLookup[i] = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
      }
    }

    // 30 FPS Cap
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastFrameTime = 0;

    function render(now) {
      if (!isRunning) return;

      animationFrameId = requestAnimationFrame(render);

      const elapsed = now - lastFrameTime;
      if (elapsed < FRAME_INTERVAL) return;
      lastFrameTime = now - (elapsed % FRAME_INTERVAL);

      if (!ctx || !originalGrid || originalGrid.length === 0) return;

      const visualAspect = imgAspect || (cols / rows) * 0.55;

      let targetWidth = containerWidth;
      let targetHeight = targetWidth / visualAspect;

      if (isTransparent) {
        targetHeight = containerHeight;
        targetWidth = containerHeight * visualAspect;
        if (targetWidth > containerWidth) {
          targetWidth = containerWidth;
          targetHeight = containerWidth / visualAspect;
        }
        const effectiveScale = scale && scale > 0 ? scale : 1.0;
        targetWidth = Math.round(targetWidth * effectiveScale);
        targetHeight = Math.round(targetHeight * effectiveScale);
      } else {
        const effectiveScale = scale || 1.0;
        targetWidth = Math.round(targetWidth * effectiveScale);
        targetHeight = Math.round(targetHeight * effectiveScale);
      }

      const pixelWidth = Math.round(targetWidth * dpr);
      const pixelHeight = Math.round(targetHeight * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
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

      const mx = faceCenter?.x ?? 0.48;
      const my = faceCenter?.y ?? 0.36;

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

          if (animationStyle === 'matrix') {
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

          ctx.fillStyle = colorLookup[cell.brightness] || colorLookup[128];

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
    }

    self.onmessage = function (e) {
      const { type, payload } = e.data;

      switch (type) {
        case 'INIT': {
          canvas = payload.canvas;
          ctx = canvas.getContext('2d');
          originalGrid = payload.grid;
          cols = payload.cols;
          rows = payload.rows;
          imgAspect = payload.imgAspect;
          color = payload.color || '#00ff41';
          animationStyle = payload.animationStyle || 'matrix';
          isTransparent = payload.transparent !== false;
          scale = payload.scale || 0.96;
          faceCenter = payload.faceCenter || { x: 0.48, y: 0.36 };
          containerWidth = payload.containerWidth || 400;
          containerHeight = payload.containerHeight || 400;
          dpr = payload.dpr || 1;

          updateColorLookup(color);
          isRunning = true;
          lastFrameTime = performance.now();
          render(performance.now());
          break;
        }

        case 'RESIZE': {
          containerWidth = payload.containerWidth || containerWidth;
          containerHeight = payload.containerHeight || containerHeight;
          dpr = payload.dpr || dpr;
          break;
        }

        case 'UPDATE_CONFIG': {
          if (payload.grid) originalGrid = payload.grid;
          if (payload.cols) cols = payload.cols;
          if (payload.rows) rows = payload.rows;
          if (payload.imgAspect) imgAspect = payload.imgAspect;
          if (payload.color && payload.color !== color) {
            color = payload.color;
            updateColorLookup(color);
          }
          if (payload.animationStyle) animationStyle = payload.animationStyle;
          if (payload.scale !== undefined) scale = payload.scale;
          if (payload.faceCenter) faceCenter = payload.faceCenter;
          if (payload.transparent !== undefined) isTransparent = payload.transparent;
          break;
        }

        case 'PAUSE': {
          isRunning = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
          break;
        }

        case 'RESUME': {
          if (!isRunning) {
            isRunning = true;
            lastFrameTime = performance.now();
            render(performance.now());
          }
          break;
        }

        case 'DESTROY': {
          isRunning = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
          break;
        }

        default:
          break;
      }
    };
  };

  const code = `(${workerFunction.toString()})();`;
  const blob = new Blob([code], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  const worker = new Worker(workerUrl);

  const originalTerminate = worker.terminate.bind(worker);
  worker.terminate = () => {
    URL.revokeObjectURL(workerUrl);
    originalTerminate();
  };

  return worker;
}
