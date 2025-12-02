/**
 * Optimiza imágenes para dispositivos móviles reduciendo resolución y calidad
 * si exceden ciertos límites para evitar problemas de memoria
 */

interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxFileSize?: number; // en bytes
}

const DEFAULT_MOBILE_OPTIONS: OptimizationOptions = {
  maxWidth: 1024, // Reducido drásticamente para iOS Safari
  maxHeight: 1024, // Reducido drásticamente para iOS Safari
  quality: 0.75, // 75% quality para máxima compatibilidad
  maxFileSize: 2 * 1024 * 1024, // Reducido a 2MB
};

const DEFAULT_DESKTOP_OPTIONS: OptimizationOptions = {
  maxWidth: 4096,
  maxHeight: 4096,
  quality: 0.92,
  maxFileSize: 15 * 1024 * 1024, // 15MB
};

/**
 * Detecta si el dispositivo es móvil
 */
export function isMobileDevice(): boolean {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768
  );
}

/**
 * Optimiza una imagen si es necesario basándose en el dispositivo
 */
export async function optimizeImageForDevice(file: File): Promise<File> {
  const options = isMobileDevice()
    ? DEFAULT_MOBILE_OPTIONS
    : DEFAULT_DESKTOP_OPTIONS;

  // Si la imagen ya es suficientemente pequeña, no hacer nada
  if (file.size <= (options.maxFileSize || Infinity)) {
    // Pero aún necesitamos verificar las dimensiones
    const needsResize = await checkIfNeedsResize(file, options);
    if (!needsResize) {
      return file;
    }
  }

  return optimizeImage(file, options);
}

/**
 * Verifica si la imagen necesita ser redimensionada
 */
async function checkIfNeedsResize(
  file: File,
  options: OptimizationOptions
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const needsResize =
        img.width > (options.maxWidth || Infinity) ||
        img.height > (options.maxHeight || Infinity);
      resolve(needsResize);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });
}

/**
 * Optimiza una imagen aplicando compresión y redimensionamiento
 */
async function optimizeImage(
  file: File,
  options: OptimizationOptions
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calcular nuevas dimensiones manteniendo aspect ratio
      let { width, height } = img;
      const maxW = options.maxWidth || width;
      const maxH = options.maxHeight || height;

      if (width > maxW || height > maxH) {
        const ratio = Math.min(maxW / width, maxH / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Crear canvas y dibujar imagen redimensionada
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("No se pudo obtener el contexto del canvas"));
        return;
      }

      // Configurar para mejor calidad en redimensionamiento
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a blob con compresión
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("No se pudo crear el blob"));
            return;
          }

          const optimizedFile = new File([blob], file.name, {
            type: "image/jpeg", // JPEG es más eficiente para fotos
            lastModified: Date.now(),
          });

          resolve(optimizedFile);
        },
        "image/jpeg",
        options.quality || 0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo cargar la imagen"));
    };

    img.src = url;
  });
}
