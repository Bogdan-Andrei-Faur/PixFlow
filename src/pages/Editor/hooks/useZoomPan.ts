import * as React from "react";
import { clamp } from "../utils/number";

export function useZoomPan(
  natural: { w: number; h: number } | null,
  viewportRef: React.RefObject<HTMLDivElement | null>
) {
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const factor = 1 - e.deltaY * 0.0015;
      setZoom((z) => clamp(parseFloat((z * factor).toFixed(3)), 0.1, 8));
    } else {
      setOffset((o) => ({ x: o.x + e.deltaX, y: o.y + e.deltaY }));
    }
  }, []);

  const fitToScreen = React.useCallback(() => {
    if (!natural || !viewportRef.current) return;
    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;
    const scale = Math.min(vw / natural.w, vh / natural.h) * 0.98;
    setZoom(clamp(scale, 0.1, 8));
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
    fitToScreen,
    setOneToOne,
  } as const;
}
