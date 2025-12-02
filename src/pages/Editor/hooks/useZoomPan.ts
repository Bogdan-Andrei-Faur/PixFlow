import * as React from "react";
import { clamp } from "../utils/number";

interface TouchState {
  distance: number;
  centerX: number;
  centerY: number;
}

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

  // Calcular distancia entre dos puntos táctiles
  const getTouchDistance = React.useCallback((touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Obtener punto central entre dos toques
  const getTouchCenter = React.useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  }, []);

  // Touch start - detectar pinch o pan
  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
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
      // Pan con un dedo
      lastTouchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      isPanningRef.current = true;
      touchStateRef.current = null;
    }
  }, [getTouchDistance, getTouchCenter]);

  // Touch move - aplicar pinch o pan
  const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
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
    } else if (e.touches.length === 1 && isPanningRef.current && lastTouchRef.current) {
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
  }, [getTouchDistance]);

  // Touch end - limpiar estado
  const handleTouchEnd = React.useCallback(() => {
    touchStateRef.current = null;
    isPanningRef.current = false;
    lastTouchRef.current = null;
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
