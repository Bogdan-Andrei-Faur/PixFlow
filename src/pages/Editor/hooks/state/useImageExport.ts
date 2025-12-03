import * as React from "react";
import type { PixelCrop } from "react-image-crop";

interface UseImageExportProps {
  imgRef: React.RefObject<HTMLImageElement | null>;
  natural: { w: number; h: number } | null;
  file: File | null;
  completedCrop: PixelCrop | undefined;
  activeTool:
    | "none"
    | "crop"
    | "resize"
    | "transform"
    | "adjustments"
    | "filters";
  newWidth: number;
  newHeight: number;
}

/**
 * Hook for exporting images with format conversion and quality control.
 *
 * Generates downloadable image files from current editor state, respecting active tool
 * settings (crop area, resize dimensions). Supports PNG, JPEG, and WebP formats with
 * configurable JPEG quality. Creates temporary canvas to render final image, then triggers
 * browser download with proper filename and extension.
 *
 * **Export behavior**:
 * - **Crop tool active**: Exports only cropped region
 * - **Resize tool active**: Exports with new dimensions (newWidth × newHeight)
 * - **Other tools**: Exports full natural dimensions
 * - **Format**: PNG (lossless), JPEG (quality 0-1), WebP (quality 0-1)
 * - **Filename**: Preserves original name, changes extension to match format
 *
 * **Quality recommendations**:
 * - PNG: Lossless, no quality parameter
 * - JPEG: 0.92 default (high quality), 0.75-0.85 for smaller files
 * - WebP: 0.92 default, 0.80-0.90 for balance
 *
 * @param props - Export configuration
 * @param props.imgRef - Reference to the HTMLImageElement being exported
 * @param props.natural - Current image natural dimensions
 * @param props.file - Current source file (for filename extraction)
 * @param props.completedCrop - Active crop area (if crop tool is active)
 * @param props.activeTool - Currently active tool (affects export dimensions)
 * @param props.newWidth - Target width if resize tool is active
 * @param props.newHeight - Target height if resize tool is active
 * @returns Export function
 *
 * @example
 * ```tsx
 * const { handleExport } = useImageExport({
 *   imgRef,
 *   natural,
 *   file,
 *   completedCrop,
 *   activeTool,
 *   newWidth,
 *   newHeight
 * });
 *
 * // In export modal:
 * <button onClick={() => handleExport("png")}>Export PNG</button>
 * <button onClick={() => handleExport("jpeg", 0.85)}>Export JPEG (85%)</button>
 * <button onClick={() => handleExport("webp", 0.90, "custom-name")}>Export WebP</button>
 * ```
 */
export function useImageExport({
  imgRef,
  natural,
  file,
  completedCrop,
  activeTool,
  newWidth,
  newHeight,
}: UseImageExportProps) {
  const handleExport = React.useCallback(
    async (
      targetFormat: "png" | "jpeg" | "webp" = "png",
      jpegQuality: number = 0.92,
      fileName?: string
    ) => {
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
          a.download =
            fileName ||
            `${file?.name.split(".")[0] || "imagen"}.${
              targetFormat === "jpeg" ? "jpg" : targetFormat
            }`;
          a.click();
          URL.revokeObjectURL(url);
        },
        mimeType,
        quality
      );
    },
    [imgRef, natural, file, completedCrop, activeTool, newWidth, newHeight]
  );

  return { handleExport };
}
