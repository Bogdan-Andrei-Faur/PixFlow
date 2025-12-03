import * as React from "react";

type FilterType = "none" | "grayscale" | "sepia" | "invert";

interface UseQuickFiltersProps {
  imgRef: React.RefObject<HTMLImageElement | null>;
  setSourceFile: (file: File) => void;
  fitToScreen: () => void;
  onBeforeApply: () => void;
}

/**
 * Hook for applying one-click preset filters to images.
 *
 * Provides three common filters (grayscale, sepia, invert) with instant CSS preview and
 * pixel-level Canvas manipulation on apply. Filters are mutually exclusive (selecting one
 * deselects others). Uses standard color transformation matrices for accuracy and Safari
 * compatibility.
 *
 * **Filters**:
 * - **Grayscale**: Luminosity-based desaturation (0.299R + 0.587G + 0.114B)
 * - **Sepia**: Warm tone matrix transformation
 * - **Invert**: Pixel-wise color inversion (255 - value)
 *
 * **Usage pattern**:
 * 1. Call `selectFilter(type)` to enable filter and see CSS preview
 * 2. User can switch between filters or select "none" to clear
 * 3. Call `applyFilter()` to permanently apply active filter via pixel manipulation
 * 4. Call `cancelFilter()` to deselect filter without applying
 *
 * @param props - Quick filters configuration
 * @param props.imgRef - Reference to the HTMLImageElement being filtered
 * @param props.setSourceFile - Callback to update source file after filter application
 * @param props.fitToScreen - Callback to reset viewport after filter application
 * @param props.onBeforeApply - Callback invoked before applying filter (for history snapshot)
 * @returns Filter state, selection, and application controls
 *
 * @example
 * ```tsx
 * const filters = useQuickFilters({
 *   imgRef,
 *   setSourceFile,
 *   fitToScreen,
 *   onBeforeApply: () => history.saveSnapshot()
 * });
 *
 * // In UI (with preview):
 * <img ref={imgRef} style={{ filter: filters.previewFilter }} />
 * <button onClick={() => filters.selectFilter("grayscale")}
 *   className={filters.activeFilter === "grayscale" ? "active" : ""}>
 *   Grayscale
 * </button>
 * <button onClick={filters.applyFilter} disabled={!filters.hasChanges}>Apply</button>
 * ```
 */
export function useQuickFilters({
  imgRef,
  setSourceFile,
  fitToScreen,
  onBeforeApply,
}: UseQuickFiltersProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterType>("none");

  // Genera el string de CSS filter para preview
  const previewFilter = React.useMemo(() => {
    switch (activeFilter) {
      case "grayscale":
        return "grayscale(100%)";
      case "sepia":
        return "sepia(100%)";
      case "invert":
        return "invert(100%)";
      case "none":
      default:
        return "none";
    }
  }, [activeFilter]);

  // Indica si hay cambios pendientes
  const hasChanges = activeFilter !== "none";

  // Aplica el filtro seleccionado al canvas (destructivo)
  const applyFilter = React.useCallback(async () => {
    if (!imgRef.current || activeFilter === "none") return;

    onBeforeApply();

    const originalImg = imgRef.current;
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

        // Aplicar filtro manualmente (compatible con Safari)
        switch (activeFilter) {
          case "grayscale":
            for (let i = 0; i < data.length; i += 4) {
              const avg =
                0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
              data[i] = avg; // R
              data[i + 1] = avg; // G
              data[i + 2] = avg; // B
            }
            break;
          case "sepia":
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
              data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
              data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
            }
            break;
          case "invert":
            for (let i = 0; i < data.length; i += 4) {
              data[i] = 255 - data[i]; // R
              data[i + 1] = 255 - data[i + 1]; // G
              data[i + 2] = 255 - data[i + 2]; // B
            }
            break;
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

          const newFile = new File([blob], `filtered-${Date.now()}.png`, {
            type: "image/png",
          });

          setSourceFile(newFile);
          setActiveFilter("none");

          setTimeout(() => {
            fitToScreen();
            resolve();
          }, 100);
        }, "image/png");
      };

      tempImg.onerror = (e) => {
        console.error("Error loading image for filter application:", e);
        resolve();
      };

      // Usar el src directamente (blob URL)
      tempImg.src = originalImg.src;
    });
  }, [imgRef, activeFilter, onBeforeApply, setSourceFile, fitToScreen]);

  // Cancela el filtro y vuelve al estado original
  const cancelFilter = React.useCallback(() => {
    setActiveFilter("none");
  }, []);

  // Selecciona un filtro para preview
  const selectFilter = React.useCallback((filter: FilterType) => {
    setActiveFilter(filter);
  }, []);

  return {
    activeFilter,
    previewFilter,
    hasChanges,
    selectFilter,
    applyFilter,
    cancelFilter,
  };
}
