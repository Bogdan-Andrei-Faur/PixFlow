import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./ImageUploader.module.css";
import { optimizeImageForDevice } from "../../../utils/imageOptimization";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  maxSizeMB: number;
  onError: (message: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  maxSizeMB,
  onError,
}) => {
  const { t } = useTranslation("home");
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const validateAndSetFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      onError(t("errors.invalidType"));
      return;
    }

    setIsProcessing(true);

    try {
      // Optimizar imagen para el dispositivo (móvil o desktop)
      const optimizedFile = await optimizeImageForDevice(file);

      // Validar tamaño después de optimización
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (optimizedFile.size > maxSizeBytes) {
        onError(t("errors.sizeExceeded", { maxSize: maxSizeMB }));
        setIsProcessing(false);
        return;
      }

      onImageSelect(optimizedFile);
    } catch (error) {
      onError("Error al procesar la imagen");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(file);
    // Limpia el valor para permitir seleccionar el mismo archivo de nuevo
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0] || null;
    validateAndSetFile(file);
    // Por coherencia, limpia el input en caso de que se haya usado antes
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={`${styles.dropZone} ${isDragActive ? styles.dragActive : ""} ${
        isProcessing ? styles.processing : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        className={styles.fileInput}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        onClick={() => {
          // Asegura que seleccionar el mismo archivo dispare onChange
          if (inputRef.current) inputRef.current.value = "";
        }}
        disabled={isProcessing}
      />
      <div className={styles.dropZoneContent}>
        {isProcessing ? (
          <>
            <div className={styles.uploadIcon}>⏳</div>
            <p className={styles.dropZoneText}>Optimizando imagen...</p>
          </>
        ) : (
          <>
            <div className={styles.uploadIcon}>📁</div>
            <p className={styles.dropZoneText}>{t("upload.dragDrop")}</p>
            <p className={styles.dropZoneSubtext}>
              {t("upload.clickSelect", { maxSize: maxSizeMB })}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
