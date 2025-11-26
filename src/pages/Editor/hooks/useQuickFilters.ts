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

    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Aplicar filtro CSS al contexto del canvas
    ctx.filter = previewFilter;
    ctx.drawImage(img, 0, 0);

    // Convertir a blob y crear nuevo archivo
    canvas.toBlob((blob) => {
      if (!blob) return;
      const newFile = new File([blob], `filtered-${Date.now()}.png`, {
        type: "image/png",
      });
      setSourceFile(newFile);
      setActiveFilter("none");
      setTimeout(() => fitToScreen(), 50);
    }, "image/png");
  }, [
    imgRef,
    activeFilter,
    previewFilter,
    onBeforeApply,
    setSourceFile,
    fitToScreen,
  ]);

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
