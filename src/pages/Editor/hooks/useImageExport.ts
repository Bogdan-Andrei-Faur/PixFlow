import * as React from "react";
import type { PixelCrop } from "react-image-crop";

interface UseImageExportProps {
  imgRef: React.RefObject<HTMLImageElement | null>;
  natural: { w: number; h: number } | null;
  file: File | null;
  completedCrop: PixelCrop | undefined;
  activeTool: "none" | "crop" | "resize" | "format";
  newWidth: number;
  newHeight: number;
  targetFormat: "png" | "jpeg" | "webp";
  jpegQuality: number;
}

export function useImageExport({
  imgRef,
  natural,
  file,
  completedCrop,
  activeTool,
  newWidth,
  newHeight,
  targetFormat,
  jpegQuality,
}: UseImageExportProps) {
  const handleExport = React.useCallback(async () => {
    if (!imgRef.current || !natural) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Coordenadas fuente
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = natural.w;
    let sourceHeight = natural.h;

    if (completedCrop) {
      sourceX = Math.max(0, Math.min(completedCrop.x, natural.w));
      sourceY = Math.max(0, Math.min(completedCrop.y, natural.h));
      sourceWidth = Math.min(completedCrop.width, natural.w - sourceX);
      sourceHeight = Math.min(completedCrop.height, natural.h - sourceY);
    }

    // Dimensiones finales
    const finalWidth =
      activeTool === "resize" && newWidth > 0
        ? newWidth
        : Math.round(sourceWidth);
    const finalHeight =
      activeTool === "resize" && newHeight > 0
        ? newHeight
        : Math.round(sourceHeight);

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // Dibujar
    ctx.drawImage(
      imgRef.current,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      finalWidth,
      finalHeight
    );

    // Exportar
    const mimeType =
      targetFormat === "jpeg"
        ? "image/jpeg"
        : targetFormat === "webp"
        ? "image/webp"
        : "image/png";
    const quality = targetFormat === "jpeg" ? jpegQuality : 0.92;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
        a.download = `${file?.name.split(".")[0] || "imagen"}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      mimeType,
      quality
    );
  }, [
    imgRef,
    natural,
    file,
    completedCrop,
    activeTool,
    newWidth,
    newHeight,
    targetFormat,
    jpegQuality,
  ]);

  return { handleExport };
}
