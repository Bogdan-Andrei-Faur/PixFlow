import * as React from "react";

type FilterType = "none" | "grayscale" | "sepia" | "invert";

interface UseQuickFiltersProps {
  imgRef: React.RefObject<HTMLImageElement | null>;
  setSourceFile: (file: File) => void;
  fitToScreen: () => void;
  onBeforeApply: () => void;
}

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
