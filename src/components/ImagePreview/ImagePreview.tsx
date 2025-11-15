import React from "react";
import styles from "./ImagePreview.module.css";

interface ImagePreviewProps {
  previewURL: string;
  onCancel: () => void;
  onEdit: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  previewURL,
  onCancel,
  onEdit,
}) => {
  return (
    <>
      <div className={styles.previewContainer}>
        <img className={styles.imagePreview} src={previewURL} alt="Preview" />
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className={`${styles.button} ${styles.editButton}`}
          onClick={onEdit}
        >
          Editar
        </button>
      </div>
    </>
  );
};

export default ImagePreview;
