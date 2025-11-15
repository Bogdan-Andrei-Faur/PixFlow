import React from "react";
import styles from "./ImageUploader.module.css";

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
  const [isDragActive, setIsDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const validateAndSetFile = (file: File | null) => {
    if (!file) {
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      onError("Solo se permiten archivos de imagen (PNG, JPG, etc.)");
      return;
    }

    // Validar tamaño del archivo
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError(`El tamaño del archivo excede el límite de ${maxSizeMB} MB.`);
      return;
    }

    onImageSelect(file);
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
      className={`${styles.dropZone} ${isDragActive ? styles.dragActive : ""}`}
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
      />
      <div className={styles.dropZoneContent}>
        <div className={styles.uploadIcon}>📁</div>
        <p className={styles.dropZoneText}>Arrastra una imagen aquí</p>
        <p className={styles.dropZoneSubtext}>
          o haz clic para seleccionar (máx. {maxSizeMB}MB)
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
