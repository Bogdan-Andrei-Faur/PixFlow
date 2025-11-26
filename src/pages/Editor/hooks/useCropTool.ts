import * as React from "react";
import type { Crop, PixelCrop } from "react-image-crop";

interface UseCropToolProps {
  imgRef: React.RefObject<HTMLImageElement | null>;
  natural: { w: number; h: number } | null;
  file: File | null;
  setSourceFile: (file: File) => void;
  setNatural: (dims: { w: number; h: number }) => void;
  fitToScreen: () => void;
  onBeforeCrop?: () => void;
}

export function useCropTool({
  imgRef,
  natural,
  file,
  setSourceFile,
  setNatural,
  fitToScreen,
  onBeforeCrop,
}: UseCropToolProps) {
  const [crop, setCrop] = React.useState<Crop>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
  const [completedPercentCrop, setCompletedPercentCrop] =
    React.useState<Crop>();

  const applyCrop = React.useCallback(() => {
    if (!completedPercentCrop || !natural || !imgRef.current) return;

    // Convertir porcentajes a píxeles de la imagen natural
    const cropX = (completedPercentCrop.x / 100) * natural.w;
    const cropY = (completedPercentCrop.y / 100) * natural.h;
    const cropWidth = (completedPercentCrop.width / 100) * natural.w;
    const cropHeight = (completedPercentCrop.height / 100) * natural.h;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Math.round(cropWidth);
    canvas.height = Math.round(cropHeight);

    // Dibujar la porción recortada
    ctx.drawImage(
      imgRef.current,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    canvas.toBlob((blob) => {
      if (!blob) return;

      // Guardar snapshot antes de modificar
      onBeforeCrop?.();

      const newFile = new File([blob], file?.name || "cropped.png", {
        type: "image/png",
      });

      setSourceFile(newFile);
      setNatural({ w: canvas.width, h: canvas.height });

      // Limpiar estados de crop
      setCrop(undefined);
      setCompletedCrop(undefined);
      setCompletedPercentCrop(undefined);

      requestAnimationFrame(() => fitToScreen());
    });
  }, [
    completedPercentCrop,
    natural,
    imgRef,
    file,
    setSourceFile,
    setNatural,
    fitToScreen,
    onBeforeCrop,
  ]);

  const cancelCrop = React.useCallback(() => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCompletedPercentCrop(undefined);
  }, []);

  const clearCrop = React.useCallback(() => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCompletedPercentCrop(undefined);
  }, []);

  return {
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    completedPercentCrop,
    setCompletedPercentCrop,
    applyCrop,
    cancelCrop,
    clearCrop,
  };
}
