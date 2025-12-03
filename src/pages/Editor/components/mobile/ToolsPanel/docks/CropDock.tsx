import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../../Editor.module.css";
import type { CropRect } from "../../../desktop/ToolsPanel/types";

interface CropDockProps {
  cropRect: CropRect | null;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
  onSetActiveTool: (t: "none") => void;
}

export const CropDock: React.FC<CropDockProps> = ({
  cropRect,
  onApplyCrop,
  onCancelCrop,
  onSetActiveTool,
}) => {
  const { t } = useTranslation(["editor", "common"]);

  // Detectar iOS para mostrar warning
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!cropRect || cropRect.width === 0 || cropRect.height === 0) {
    return isIOS ? (
      <div
        className={styles.dockActions}
        style={{
          padding: "12px",
          backgroundColor: "rgba(234, 179, 8, 0.1)",
          borderTop: "2px solid rgb(234, 179, 8)",
          fontSize: "0.85rem",
          textAlign: "center",
        }}
      >
        ℹ️ Las imágenes se optimizan automáticamente en iOS para evitar crashes
      </div>
    ) : null;
  }

  return (
    <div className={styles.dockActions}>
      <button
        className={`${styles.button} ${styles.secondary}`}
        onClick={() => {
          onCancelCrop();
          onSetActiveTool("none");
        }}
      >
        {t("common:buttons.cancel")}
      </button>
      <button
        className={`${styles.button} ${styles.primary}`}
        onClick={() => {
          onApplyCrop();
          onSetActiveTool("none");
        }}
      >
        {t("editor:tools.crop.apply")}
      </button>
    </div>
  );
};
