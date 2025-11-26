import * as React from "react";

interface UsePanDragProps {
  enabled: boolean;
  offset: { x: number; y: number };
  setOffset: (offset: { x: number; y: number }) => void;
}

export function usePanDrag({ enabled, offset, setOffset }: UsePanDragProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = React.useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);

  const startDrag = React.useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        ox: offset.x,
        oy: offset.y,
      };
    },
    [enabled, offset]
  );

  const onDrag = React.useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || !isDragging || !dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
    },
    [enabled, isDragging, setOffset]
  );

  const endDrag = React.useCallback(() => {
    if (!enabled) return;
    setIsDragging(false);
    dragStart.current = null;
  }, [enabled]);

  return {
    isDragging,
    startDrag,
    onDrag,
    endDrag,
  };
}
