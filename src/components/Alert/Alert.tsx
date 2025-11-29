import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Alert.module.css";

interface AlertProps {
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const Alert: React.FC<AlertProps> = ({
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}) => {
  const { t } = useTranslation("editor");
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Duración de la animación
  };

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClose, autoCloseDelay]);

  return (
    <div className={`${styles.alert} ${isClosing ? styles.closing : ""}`}>
      <div className={styles.alertIcon}>⚠️</div>
      <div className={styles.alertContent}>
        <p className={styles.alertTitle}>{t("alert.title")}</p>
        <p className={styles.alertMessage}>{message}</p>
      </div>
      <button
        className={styles.alertClose}
        onClick={handleClose}
        aria-label={t("alert.title")}
      >
        ✕
      </button>
    </div>
  );
};

export default Alert;
