import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../../Editor.module.css";
import type { CropRect } from "../types";

interface CropPanelProps {
  cropRect: CropRect | null;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
}

export const CropPanel: React.FC<CropPanelProps> = ({
  cropRect,
  onApplyCrop,
  onCancelCrop,
}) => {
  const { t } = useTranslation(["editor", "common"]);

  return (
    <div className={styles.toolOptions}>
      {cropRect && (
        <p className={styles.cropInfo}>
          {t("editor:tools.crop.info", {
            width: Math.round(cropRect.width),
            height: Math.round(cropRect.height),
          })}
        </p>
      )}
      {cropRect && cropRect.width > 0 && cropRect.height > 0 ? (
        <>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={onApplyCrop}
            style={{ width: "100%" }}
          >
            {t("editor:tools.crop.apply")}
          </button>
          <button
            className={styles.button}
            onClick={onCancelCrop}
            style={{ width: "100%" }}
          >
            {t("common:buttons.cancel")}
          </button>
        </>
      ) : (
        <p className={styles.cropInfo}>{t("editor:tools.crop.hint")}</p>
      )}
    </div>
  );
};
