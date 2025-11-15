import React from "react";
import styles from "./Home.module.css";
import Alert from "../../components/Alert/Alert";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import ImagePreview from "../../components/ImagePreview/ImagePreview";
import { useImageEditor } from "../../context/useImageEditor";
import { useNavigate } from "react-router-dom";

const MAX_SIZE_MB = 50;

const Home = () => {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [previewURL, setPreviewURL] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const errorResetTimer = React.useRef<number | null>(null);
  const { setSourceFile } = useImageEditor();
  const navigate = useNavigate();

  const handleImageSelect = (file: File) => {
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
    const newURL = URL.createObjectURL(file);
    setPreviewURL(newURL);
    setImageFile(file);
    setError(null);
  };

  const handleError = (message: string) => {
    // Si el mismo error se repite, forzamos re-montaje de la alerta
    if (errorResetTimer.current) {
      window.clearTimeout(errorResetTimer.current);
      errorResetTimer.current = null;
    }
    setError(null);
    errorResetTimer.current = window.setTimeout(() => {
      setError(message);
      errorResetTimer.current = null;
    }, 0);
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
    if (imageFile) {
      setSourceFile(imageFile); // Llevar archivo al contexto
      navigate("/editor");
    }
  };

  // Limpiar URL cuando el componente se desmonte o cambie la imagen
  React.useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
      if (errorResetTimer.current) {
        window.clearTimeout(errorResetTimer.current);
      }
    };
  }, [previewURL]);

  return (
    <div className={`${styles.container} ${styles.background}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>PixFlow</h1>

        {previewURL && !error ? (
          <ImagePreview
            previewURL={previewURL}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
        ) : (
          <ImageUploader
            onImageSelect={handleImageSelect}
            maxSizeMB={MAX_SIZE_MB}
            onError={handleError}
          />
        )}

        {error && <Alert message={error} onClose={() => setError(null)} />}
      </div>
    </div>
  );
};

export default Home;
