import * as React from "react";

interface UsePanDragProps {
  enabled: boolean;
  offset: { x: number; y: number };
  setOffset: (offset: { x: number; y: number }) => void;
}

/**
 * Hook for pointer-based pan/drag interaction on desktop.
 *
 * Provides click-and-drag functionality for panning the viewport with pointer events
 * (mouse/trackpad). Uses refs for drag state to avoid re-renders during drag operations.
 * Can be enabled/disabled (e.g., disable during crop tool use to avoid conflicts).
 *
 * **Usage pattern**:
 * 1. Attach `startDrag` to `onPointerDown` event
 * 2. Attach `onDrag` to `onPointerMove` event
 * 3. Attach `endDrag` to `onPointerUp` and `onPointerLeave` events
 * 4. Toggle `enabled` prop to control when dragging is allowed
 *
 * **Drag mechanics**:
 * - Captures initial pointer position and current offset on start
 * - Calculates delta from initial position during move
 * - Applies delta to initial offset (not incremental)
 * - Clears drag state on end/leave
 *
 * @param props - Pan drag configuration
 * @param props.enabled - Whether drag interaction is currently enabled
 * @param props.offset - Current viewport offset (x, y)
 * @param props.setOffset - Callback to update viewport offset during drag
 * @returns Drag state and event handlers
 *
 * @example
 * ```tsx
 * const panDrag = usePanDrag({
 *   enabled: activeTool !== "crop", // Disable during crop
 *   offset,
 *   setOffset
 * });
 *
 * // In viewport:
 * <div
 *   onPointerDown={panDrag.startDrag}
 *   onPointerMove={panDrag.onDrag}
 *   onPointerUp={panDrag.endDrag}
 *   onPointerLeave={panDrag.endDrag}
 *   style={{ cursor: panDrag.isDragging ? "grabbing" : "grab" }}
 * />
 * ```
 */
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
