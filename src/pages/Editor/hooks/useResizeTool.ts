import * as React from "react";

interface UseResizeToolProps {
  natural: { w: number; h: number } | null;
  imgRef: React.RefObject<HTMLImageElement | null>;
  setSourceFile: (file: File | null) => void;
  setNatural: (dims: { w: number; h: number }) => void;
  fitToScreen: () => void;
  onBeforeResize?: () => void;
}

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
