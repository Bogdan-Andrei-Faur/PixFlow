import React from "react";
import styles from "./Home.module.css";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const Home = () => {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [previewURL, setPreviewURL] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [isAlertClosing, setIsAlertClosing] = React.useState(false);

  const closeAlert = () => {
    setIsAlertClosing(true);
    setTimeout(() => {
      setError(null);
      setIsAlertClosing(false);
    }, 300); // Duración de la animación
  };

  const validateAndSetFile = (file: File | null) => {
    // Si no hay archivo
    if (!file) {
      setImageFile(null);
      setPreviewURL(null);
      setError(null);
      return;
    }

    // Limpiar errores previos
    setError(null);

    // 1) Validar tipo de archivo (solo imagenes)
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen (PNG, JPG, etc.)");
      return;
    }

    // 2) Validar tamaño del archivo
    if (file.size > MAX_SIZE_BYTES) {
      setError(`El tamaño del archivo excede el límite de ${MAX_SIZE_MB} MB.`);
      return;
    }

    // 3) Crear URL de vista previa
    const newURL = URL.createObjectURL(file);
    setPreviewURL(newURL);
    setImageFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(file);
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
  };

  const handleCancel = () => {
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
    setImageFile(null);
    setPreviewURL(null);
    setError(null);
  };

  const handleEdit = () => {
    // TODO: Navegar al editor de imagen
    console.log("Editar imagen", imageFile);
  };

  // 4) Limpiar URL cuando el componente se desmonte o cambie la imagen
  React.useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  // 5) Auto-cerrar alerta de error después de 5 segundos
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        closeAlert();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className={`${styles.container} ${styles.background}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>PixFlow</h1>

        {previewURL && !error ? (
          <>
            <div className={styles.previewContainer}>
              <img
                className={styles.imagePreview}
                src={previewURL}
                alt="Preview"
              />
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                className={`${styles.button} ${styles.editButton}`}
                onClick={handleEdit}
              >
                Editar
              </button>
            </div>
          </>
        ) : (
          <div
            className={`${styles.dropZone} ${
              isDragActive ? styles.dragActive : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              className={styles.fileInput}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className={styles.dropZoneContent}>
              <div className={styles.uploadIcon}>📁</div>
              <p className={styles.dropZoneText}>Arrastra una imagen aquí</p>
              <p className={styles.dropZoneSubtext}>
                o haz clic para seleccionar (máx. {MAX_SIZE_MB}MB)
              </p>
            </div>
          </div>
        )}

        {error && (
          <div
            className={`${styles.alert} ${
              isAlertClosing ? styles.closing : ""
            }`}
          >
            <div className={styles.alertIcon}>⚠️</div>
            <div className={styles.alertContent}>
              <p className={styles.alertTitle}>Error</p>
              <p className={styles.alertMessage}>{error}</p>
            </div>
            <button
              className={styles.alertClose}
              onClick={closeAlert}
              aria-label="Cerrar alerta"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
