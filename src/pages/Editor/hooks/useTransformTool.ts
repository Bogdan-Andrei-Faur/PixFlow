import * as React from "react";

interface UseTransformToolProps {
  imgRef: React.RefObject<HTMLImageElement | null>;
  setSourceFile: (file: File | null) => void;
  setNatural: (dims: { w: number; h: number }) => void;
  fitToScreen: () => void;
  onBeforeTransform?: () => void;
}

export function useTransformTool({
  imgRef,
  setSourceFile,
  setNatural,
  fitToScreen,
  onBeforeTransform,
}: UseTransformToolProps) {
  const applyRotation = React.useCallback(
    (degrees: 90 | -90 | 180) => {
      const image = imgRef.current;
      if (!image) return;

      // Guardar snapshot antes de rotar
      onBeforeTransform?.();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = image.naturalWidth;
      const height = image.naturalHeight;

      // Para 90° y -90°, intercambiar dimensiones
      if (degrees === 90 || degrees === -90) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // Mover al centro y rotar
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(image, -width / 2, -height / 2);

      // Convertir a blob y crear nuevo archivo
      canvas.toBlob((blob) => {
        if (!blob) return;

        const rotatedFile = new File([blob], "rotated-image.png", {
          type: "image/png",
        });

        setSourceFile(rotatedFile);
        setNatural({ w: canvas.width, h: canvas.height });

        // Ajustar vista después de rotar
        setTimeout(() => {
          fitToScreen();
        }, 100);
      }, "image/png");
    },
    [imgRef, onBeforeTransform, setSourceFile, setNatural, fitToScreen]
  );

  const applyFlip = React.useCallback(
    (direction: "horizontal" | "vertical") => {
      const image = imgRef.current;
      if (!image) return;

      // Guardar snapshot antes de flip
      onBeforeTransform?.();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Aplicar transformación de flip
      if (direction === "horizontal") {
        ctx.scale(-1, 1);
        ctx.drawImage(image, -canvas.width, 0);
      } else {
        ctx.scale(1, -1);
        ctx.drawImage(image, 0, -canvas.height);
      }

      // Convertir a blob y crear nuevo archivo
      canvas.toBlob((blob) => {
        if (!blob) return;

        const flippedFile = new File([blob], "flipped-image.png", {
          type: "image/png",
        });

        setSourceFile(flippedFile);

        // Ajustar vista después de flip
        setTimeout(() => {
          fitToScreen();
        }, 100);
      }, "image/png");
    },
    [imgRef, onBeforeTransform, setSourceFile, fitToScreen]
  );

  return {
    applyRotation,
    applyFlip,
  };
}
