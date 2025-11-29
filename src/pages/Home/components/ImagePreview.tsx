import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("home");
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
          {t("preview.cancel")}
        </button>
        <button
          className={`${styles.button} ${styles.editButton}`}
          onClick={onEdit}
        >
          {t("preview.edit")}
        </button>
      </div>
    </>
  );
};

export default ImagePreview;
