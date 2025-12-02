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
    try {
      if (!completedPercentCrop || !natural || !imgRef.current) return;

      // Convertir porcentajes a píxeles de la imagen natural
      const cropX = (completedPercentCrop.x / 100) * natural.w;
      const cropY = (completedPercentCrop.y / 100) * natural.h;
      let cropWidth = (completedPercentCrop.width / 100) * natural.w;
      let cropHeight = (completedPercentCrop.height / 100) * natural.h;

      // En móvil, limitar tamaño del crop para evitar crashes
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;

      const maxCropDimension = isMobile ? 1024 : 4096; // Reducido a 1024 para iOS Safari

      if (cropWidth > maxCropDimension || cropHeight > maxCropDimension) {
        const scale = Math.min(
          maxCropDimension / cropWidth,
          maxCropDimension / cropHeight
        );
        cropWidth = Math.round(cropWidth * scale);
        cropHeight = Math.round(cropHeight * scale);
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: false });
      if (!ctx) return;

      canvas.width = Math.round(cropWidth);
      canvas.height = Math.round(cropHeight);

      // Configurar para mejor rendimiento
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Dibujar la porción recortada (escalada si fue necesario)
      ctx.drawImage(
        imgRef.current,
        cropX,
        cropY,
        (completedPercentCrop.width / 100) * natural.w,
        (completedPercentCrop.height / 100) * natural.h,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Usar JPEG con calidad alta para mejor compresión (reduce uso de memoria)
      const quality = isMobile ? 0.75 : 0.92;

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          // Guardar snapshot antes de modificar
          onBeforeCrop?.();

          const newFile = new File([blob], file?.name || "cropped.jpg", {
            type: "image/jpeg",
          });

          setSourceFile(newFile);
          setNatural({ w: canvas.width, h: canvas.height });

          // Limpiar estados de crop
          setCrop(undefined);
          setCompletedCrop(undefined);
          setCompletedPercentCrop(undefined);

          // Forzar limpieza de memoria
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          requestAnimationFrame(() => fitToScreen());
        },
        "image/jpeg",
        quality
      );
    } catch {
      alert(
        "Error al recortar la imagen. La imagen puede ser demasiado grande para este dispositivo."
      );
      setCrop(undefined);
      setCompletedCrop(undefined);
      setCompletedPercentCrop(undefined);
    }
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

  const initializeCrop = React.useCallback(() => {
    if (!natural) return;

    // Inicializar con un crop que ocupa toda la imagen (100%)
    const initialCrop: Crop = {
      unit: "%",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };

    setCrop(initialCrop);

    // También establecer el completedCrop con las dimensiones en píxeles
    const initialPixelCrop: PixelCrop = {
      unit: "px",
      x: 0,
      y: 0,
      width: natural.w,
      height: natural.h,
    };

    setCompletedCrop(initialPixelCrop);
    setCompletedPercentCrop(initialCrop);
  }, [natural]);

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
    initializeCrop,
  };
}
