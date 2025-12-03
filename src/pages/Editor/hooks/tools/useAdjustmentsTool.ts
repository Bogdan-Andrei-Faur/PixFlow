import * as React from "react";

interface UseAdjustmentsToolProps {
  imgRef: React.RefObject<HTMLImageElement | null>;
  setSourceFile: (file: File | null) => void;
  fitToScreen: () => void;
  onBeforeAdjust?: () => void;
}

/**
 * Hook for applying brightness, contrast, and saturation adjustments to images.
 *
 * Provides slider-based adjustments (-100 to +100 range) with real-time CSS preview and
 * pixel-level Canvas manipulation on apply. Preview uses CSS filters for instant feedback,
 * then applies identical transformations via pixel manipulation to create permanent changes.
 * Ensures Safari compatibility by avoiding `ctx.filter` property.
 *
 * **Adjustment order** (matches CSS filter behavior):
 * 1. Saturation - Adjusts color intensity relative to grayscale
 * 2. Contrast - Adjusts difference from midpoint (128)
 * 3. Brightness - Multiplies RGB values
 *
 * **Usage pattern**:
 * 1. Call `initializeAdjustments()` when tool activates (resets sliders to 0)
 * 2. User adjusts sliders via `setBrightness`/`setContrast`/`setSaturation`
 * 3. `previewFilter` automatically updates with CSS filter string
 * 4. Call `applyAdjustments()` to apply pixel-level changes to image
 * 5. Call `cancelAdjustments()` to reset sliders without applying
 *
 * @param props - Adjustments tool configuration
 * @param props.imgRef - Reference to the HTMLImageElement being adjusted
 * @param props.setSourceFile - Callback to update source file after adjustments
 * @param props.fitToScreen - Callback to reset viewport after adjustments
 * @param props.onBeforeAdjust - Optional callback invoked before adjustment (for history snapshot)
 * @returns Adjustment state, controls, and preview filter
 *
 * @example
 * ```tsx
 * const adjustments = useAdjustmentsTool({
 *   imgRef,
 *   setSourceFile,
 *   fitToScreen,
 *   onBeforeAdjust: () => history.saveSnapshot()
 * });
 *
 * // In UI (with preview):
 * <img ref={imgRef} style={{ filter: adjustments.previewFilter }} />
 * <input type="range" min="-100" max="100" value={adjustments.brightness}
 *   onChange={e => adjustments.setBrightness(+e.target.value)} />
 * <button onClick={adjustments.applyAdjustments} disabled={!adjustments.hasChanges}>Apply</button>
 * <button onClick={adjustments.cancelAdjustments}>Cancel</button>
 * ```
 */
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

  const applyAdjustments = React.useCallback(async () => {
    const originalImg = imgRef.current;
    if (!originalImg) return;

    // Solo aplicar si hay cambios
    if (brightness === 0 && contrast === 0 && saturation === 0) {
      return;
    }

    // Guardar snapshot antes de ajustar
    onBeforeAdjust?.();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) return;

    return new Promise<void>((resolve) => {
      // Crear imagen temporal para cargar desde el src
      const tempImg = new Image();

      tempImg.onload = () => {
        canvas.width = tempImg.naturalWidth;
        canvas.height = tempImg.naturalHeight;

        // Dibujar la imagen original
        ctx.drawImage(tempImg, 0, 0);

        // Obtener los datos de píxeles
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Calcular factores de ajuste (coincidir con filtros CSS)
        const brightnessFactor = 1 + brightness / 100; // brightness CSS: brightness(factor)
        const contrastFactor = 1 + contrast / 100; // contrast CSS: contrast(factor)
        const saturationFactor = 1 + saturation / 100; // saturate CSS: saturate(factor)

        // Aplicar ajustes manualmente (compatible con Safari y coincide con CSS)
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // Aplicar saturación primero (como CSS lo hace)
          if (saturation !== 0) {
            const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            r = gray + saturationFactor * (r - gray);
            g = gray + saturationFactor * (g - gray);
            b = gray + saturationFactor * (b - gray);
          }

          // Aplicar contraste (desde el punto medio como CSS)
          if (contrast !== 0) {
            r = (r - 128) * contrastFactor + 128;
            g = (g - 128) * contrastFactor + 128;
            b = (b - 128) * contrastFactor + 128;
          }

          // Aplicar brillo (multiplicación como CSS)
          if (brightness !== 0) {
            r = r * brightnessFactor;
            g = g * brightnessFactor;
            b = b * brightnessFactor;
          }

          // Asegurar que los valores estén en el rango 0-255
          data[i] = Math.max(0, Math.min(255, r));
          data[i + 1] = Math.max(0, Math.min(255, g));
          data[i + 2] = Math.max(0, Math.min(255, b));
        }

        // Aplicar los datos modificados
        ctx.putImageData(imageData, 0, 0);

        // Convertir a blob y crear nuevo archivo
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error("Failed to create blob from canvas");
            resolve();
            return;
          }

          const adjustedFile = new File([blob], "adjusted-image.png", {
            type: "image/png",
          });

          setSourceFile(adjustedFile);

          // Resetear ajustes después de aplicar
          initializeAdjustments();

          // Ajustar vista después de aplicar
          setTimeout(() => {
            fitToScreen();
            resolve();
          }, 100);
        }, "image/png");
      };

      tempImg.onerror = (e) => {
        console.error("Error loading image for adjustments application:", e);
        resolve();
      };

      // Usar el src directamente (blob URL)
      tempImg.src = originalImg.src;
    });
  }, [
    imgRef,
    brightness,
    contrast,
    saturation,
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
