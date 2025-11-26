import * as React from "react";

interface UseAdjustmentsToolProps {
  imgRef: React.RefObject<HTMLImageElement | null>;
  setSourceFile: (file: File | null) => void;
  fitToScreen: () => void;
  onBeforeAdjust?: () => void;
}

export function useAdjustmentsTool({
  imgRef,
  setSourceFile,
  fitToScreen,
  onBeforeAdjust,
}: UseAdjustmentsToolProps) {
  const [brightness, setBrightness] = React.useState(0);
  const [contrast, setContrast] = React.useState(0);
  const [saturation, setSaturation] = React.useState(0);
  const [previewFilter, setPreviewFilter] = React.useState("");

  const initializeAdjustments = React.useCallback(() => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setPreviewFilter("");
  }, []);

  const cancelAdjustments = React.useCallback(() => {
    initializeAdjustments();
  }, [initializeAdjustments]);

  // Actualizar preview en tiempo real
  React.useEffect(() => {
    const filters: string[] = [];

    if (brightness !== 0) {
      filters.push(`brightness(${1 + brightness / 100})`);
    }
    if (contrast !== 0) {
      filters.push(`contrast(${1 + contrast / 100})`);
    }
    if (saturation !== 0) {
      filters.push(`saturate(${1 + saturation / 100})`);
    }

    setPreviewFilter(filters.join(" "));
  }, [brightness, contrast, saturation]);

  const applyAdjustments = React.useCallback(() => {
    const image = imgRef.current;
    if (!image) return;

    // Solo aplicar si hay cambios
    if (brightness === 0 && contrast === 0 && saturation === 0) {
      return;
    }

    // Guardar snapshot antes de ajustar
    onBeforeAdjust?.();

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Aplicar filtros CSS al contexto
    ctx.filter = previewFilter;
    ctx.drawImage(image, 0, 0);

    // Convertir a blob y crear nuevo archivo
    canvas.toBlob((blob) => {
      if (!blob) return;

      const adjustedFile = new File([blob], "adjusted-image.png", {
        type: "image/png",
      });

      setSourceFile(adjustedFile);

      // Resetear ajustes después de aplicar
      initializeAdjustments();

      // Ajustar vista después de aplicar
      setTimeout(() => {
        fitToScreen();
      }, 100);
    }, "image/png");
  }, [
    imgRef,
    brightness,
    contrast,
    saturation,
    previewFilter,
    onBeforeAdjust,
    setSourceFile,
    initializeAdjustments,
    fitToScreen,
  ]);

  return {
    brightness,
    contrast,
    saturation,
    previewFilter,
    setBrightness,
    setContrast,
    setSaturation,
    initializeAdjustments,
    applyAdjustments,
    cancelAdjustments,
    hasChanges: brightness !== 0 || contrast !== 0 || saturation !== 0,
  };
}
