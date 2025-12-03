import * as React from "react";

interface UseResizeToolProps {
  natural: { w: number; h: number } | null;
  imgRef: React.RefObject<HTMLImageElement | null>;
  setSourceFile: (file: File | null) => void;
  setNatural: (dims: { w: number; h: number }) => void;
  fitToScreen: () => void;
  onBeforeResize?: () => void;
}

/**
 * Hook for resizing images with aspect ratio control.
 *
 * Provides width/height input controls with optional aspect ratio lock. When aspect ratio
 * is enabled, changing one dimension automatically calculates the other to maintain proportions.
 * Uses Canvas API to create a new image file with specified dimensions.
 *
 * **Usage pattern**:
 * 1. Call `initializeResize()` when tool activates (sets current dimensions)
 * 2. User adjusts `newWidth`/`newHeight` via `handleWidthChange`/`handleHeightChange`
 * 3. Toggle `maintainAspect` to lock/unlock aspect ratio
 * 4. Call `applyResize()` to create new file with new dimensions
 * 5. Call `cancelResize()` to reset inputs to original dimensions
 *
 * @param props - Resize tool configuration
 * @param props.natural - Current image natural dimensions (width and height)
 * @param props.imgRef - Reference to the HTMLImageElement being edited
 * @param props.setSourceFile - Callback to update source file after resize
 * @param props.setNatural - Callback to update natural dimensions after resize
 * @param props.fitToScreen - Callback to reset viewport after resize
 * @param props.onBeforeResize - Optional callback invoked before resize (for history snapshot)
 * @returns Resize tool state and controls
 *
 * @example
 * ```tsx
 * const resize = useResizeTool({
 *   natural,
 *   imgRef,
 *   setSourceFile,
 *   setNatural,
 *   fitToScreen,
 *   onBeforeResize: () => history.saveSnapshot()
 * });
 *
 * // In UI:
 * <input value={resize.newWidth} onChange={e => resize.handleWidthChange(+e.target.value)} />
 * <input value={resize.newHeight} onChange={e => resize.handleHeightChange(+e.target.value)} />
 * <input type="checkbox" checked={resize.maintainAspect} onChange={e => resize.setMaintainAspect(e.target.checked)} />
 * <button onClick={resize.applyResize}>Apply</button>
 * ```
 */
export function useResizeTool({
  natural,
  imgRef,
  setSourceFile,
  setNatural,
  fitToScreen,
  onBeforeResize,
}: UseResizeToolProps) {
  const [newWidth, setNewWidth] = React.useState<number>(0);
  const [newHeight, setNewHeight] = React.useState<number>(0);
  const [maintainAspect, setMaintainAspect] = React.useState(true);

  const handleWidthChange = React.useCallback(
    (w: number) => {
      setNewWidth(w);
      if (maintainAspect && natural) {
        setNewHeight(Math.round((w * natural.h) / natural.w));
      }
    },
    [maintainAspect, natural]
  );

  const handleHeightChange = React.useCallback(
    (h: number) => {
      setNewHeight(h);
      if (maintainAspect && natural) {
        setNewWidth(Math.round((h * natural.w) / natural.h));
      }
    },
    [maintainAspect, natural]
  );

  const initializeResize = React.useCallback(() => {
    if (natural) {
      setNewWidth(natural.w);
      setNewHeight(natural.h);
    }
  }, [natural]);

  const applyResize = React.useCallback(() => {
    const image = imgRef.current;
    if (!image || !natural || newWidth <= 0 || newHeight <= 0) return;

    // Guardar snapshot antes de redimensionar
    onBeforeResize?.();

    // Crear canvas con nuevas dimensiones
    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Dibujar imagen redimensionada
    ctx.drawImage(image, 0, 0, newWidth, newHeight);

    // Convertir a blob y crear nuevo archivo
    canvas.toBlob((blob) => {
      if (!blob) return;

      const resizedFile = new File([blob], "resized-image.png", {
        type: "image/png",
      });

      setSourceFile(resizedFile);
      setNatural({ w: newWidth, h: newHeight });

      // Ajustar vista después de redimensionar
      setTimeout(() => {
        fitToScreen();
      }, 100);
    }, "image/png");
  }, [
    imgRef,
    natural,
    newWidth,
    newHeight,
    onBeforeResize,
    setSourceFile,
    setNatural,
    fitToScreen,
  ]);

  const cancelResize = React.useCallback(() => {
    initializeResize();
  }, [initializeResize]);

  return {
    newWidth,
    newHeight,
    maintainAspect,
    setMaintainAspect,
    handleWidthChange,
    handleHeightChange,
    initializeResize,
    applyResize,
    cancelResize,
  };
}
