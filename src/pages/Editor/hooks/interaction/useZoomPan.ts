import * as React from "react";
import { clamp } from "../../utils/number";

interface TouchState {
  distance: number;
  centerX: number;
  centerY: number;
}

/**
 * Hook for zoom and pan controls with comprehensive touch gesture support.
 *
 * Provides desktop (mouse wheel) and mobile (touch gestures) interactions for viewport
 * navigation. Supports pinch-to-zoom, pan drag, double-tap toggle, and keyboard zoom.
 * Automatically adjusts fit-to-screen padding based on device type (90% mobile, 98% desktop).
 *
 * **Gestures**:
 * - **Mouse wheel**: Ctrl+scroll to zoom, scroll to pan
 * - **Pinch-to-zoom**: Two-finger distance changes (0.01x to 8x range)
 * - **Pan drag**: Single-finger drag to move viewport
 * - **Double-tap**: Toggles between fit-to-screen and 2x zoom
 *
 * **Mobile optimizations**:
 * - Prevents default scroll behavior during gestures
 * - 300ms double-tap detection window
 * - Touch state refs for performance (avoid re-renders)
 * - Zoom clamping with 3 decimal precision
 *
 * @param natural - Current image natural dimensions (width and height)
 * @param viewportRef - Reference to the viewport container element
 * @returns Zoom/pan state, gesture handlers, and utility functions
 *
 * @example
 * ```tsx
 * const zoomPan = useZoomPan(natural, viewportRef);
 *
 * // In viewport:
 * <div
 *   ref={viewportRef}
 *   onWheel={zoomPan.handleWheel}
 *   onTouchStart={zoomPan.handleTouchStart}
 *   onTouchMove={zoomPan.handleTouchMove}
 *   onTouchEnd={zoomPan.handleTouchEnd}
 * >
 *   <img style={{
 *     transform: `scale(${zoomPan.zoom}) translate(${-zoomPan.offset.x}px, ${-zoomPan.offset.y}px)`
 *   }} />
 * </div>
 *
 * // Controls:
 * <button onClick={zoomPan.fitToScreen}>Fit</button>
 * <button onClick={zoomPan.setOneToOne}>100%</button>
 * ```
 */
export function useZoomPan(
  natural: { w: number; h: number } | null,
  viewportRef: React.RefObject<HTMLDivElement | null>
) {
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Estado para gestos táctiles
  const touchStateRef = React.useRef<TouchState | null>(null);
  const isPanningRef = React.useRef(false);
  const lastTouchRef = React.useRef<{ x: number; y: number } | null>(null);

  // Estado para double-tap
  const lastTapRef = React.useRef<number>(0);
  const [isZoomedIn, setIsZoomedIn] = React.useState(false);

  // Calcular distancia entre dos puntos táctiles
  const getTouchDistance = React.useCallback(
    (touches: React.TouchList): number => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    },
    []
  );

  // Obtener punto central entre dos toques
  const getTouchCenter = React.useCallback((touches: React.TouchList) => {
    if (touches.length < 2)
      return { x: touches[0].clientX, y: touches[0].clientY };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  }, []);

  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const factor = 1 - e.deltaY * 0.0015;
      setZoom((z) => clamp(parseFloat((z * factor).toFixed(3)), 0.01, 8));
    } else {
      setOffset((o) => ({ x: o.x + e.deltaX, y: o.y + e.deltaY }));
    }
  }, []);

  const fitToScreen = React.useCallback(() => {
    if (!natural || !viewportRef.current) return;
    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;
    // Usar 0.9 en móvil para dar más margen, 0.98 en desktop
    const isMobile = window.innerWidth <= 768;
    const padding = isMobile ? 0.9 : 0.98;
    const scale = Math.min(vw / natural.w, vh / natural.h) * padding;
    setZoom(clamp(scale, 0.01, 8));
    setOffset({ x: 0, y: 0 });
  }, [natural, viewportRef]);

  const setOneToOne = React.useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Touch start - detectar pinch o pan
  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch-to-zoom
        e.preventDefault();
        const distance = getTouchDistance(e.touches);
        const center = getTouchCenter(e.touches);
        touchStateRef.current = {
          distance,
          centerX: center.x,
          centerY: center.y,
        };
        isPanningRef.current = false;
      } else if (e.touches.length === 1) {
        // Detectar double-tap
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;

        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
          // Double-tap detectado
          e.preventDefault();
          if (isZoomedIn) {
            fitToScreen();
            setIsZoomedIn(false);
          } else {
            setZoom(2);
            setOffset({ x: 0, y: 0 });
            setIsZoomedIn(true);
          }
          lastTapRef.current = 0;
        } else {
          // Primer tap o tap simple - preparar para pan
          lastTapRef.current = now;
          lastTouchRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
          isPanningRef.current = true;
          touchStateRef.current = null;
        }
      }
    },
    [getTouchDistance, getTouchCenter, isZoomedIn, fitToScreen]
  );

  // Touch move - aplicar pinch o pan
  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && touchStateRef.current) {
        // Pinch-to-zoom
        e.preventDefault();
        const newDistance = getTouchDistance(e.touches);
        const scale = newDistance / touchStateRef.current.distance;

        setZoom((prevZoom) => {
          const newZoom = clamp(prevZoom * scale, 0.01, 8);
          return parseFloat(newZoom.toFixed(3));
        });

        touchStateRef.current.distance = newDistance;
      } else if (
        e.touches.length === 1 &&
        isPanningRef.current &&
        lastTouchRef.current
      ) {
        // Pan con un dedo
        e.preventDefault();
        const deltaX = e.touches[0].clientX - lastTouchRef.current.x;
        const deltaY = e.touches[0].clientY - lastTouchRef.current.y;

        setOffset((prev) => ({
          x: prev.x - deltaX,
          y: prev.y - deltaY,
        }));

        lastTouchRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    },
    [getTouchDistance]
  );

  // Touch end - limpiar estado
  const handleTouchEnd = React.useCallback(() => {
    touchStateRef.current = null;
    isPanningRef.current = false;
    lastTouchRef.current = null;
  }, []);

  return {
    zoom,
    setZoom,
    offset,
    setOffset,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    fitToScreen,
    setOneToOne,
  } as const;
}
