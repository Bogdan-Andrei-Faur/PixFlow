import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../../Editor.module.css";
import {
  IconRotateClockwise,
  IconRotate,
  IconFlipHorizontal,
  IconFlipVertical,
} from "@tabler/icons-react";
import type { NaturalDims } from "../types";

interface TransformPanelProps {
  natural: NaturalDims | null;
  onRotate90: () => void;
  onRotateMinus90: () => void;
  onRotate180: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
}

export const TransformPanel: React.FC<TransformPanelProps> = ({
  natural,
  onRotate90,
  onRotateMinus90,
  onRotate180,
  onFlipHorizontal,
  onFlipVertical,
}) => {
  const { t } = useTranslation(["editor"]);

  if (!natural) return null;

  return (
    <div className={styles.toolOptions}>
      <div className={styles.transformSection}>
        <label className={styles.optionLabel}>
          {t("editor:tools.transform.rotate")}
        </label>
        <div className={styles.transformButtons}>
          <button
            className={`${styles.button} ${styles.transformButton}`}
            onClick={onRotateMinus90}
            title={t("editor:tools.transform.rotate90Left")}
          >
            <IconRotateClockwise
              size={20}
              style={{ transform: "scaleX(-1)" }}
            />
            {t("editor:tools.transform.rotate90Left")}
          </button>
          <button
            className={`${styles.button} ${styles.transformButton}`}
            onClick={onRotate90}
            title={t("editor:tools.transform.rotate90Right")}
          >
            <IconRotateClockwise size={20} />
            {t("editor:tools.transform.rotate90Right")}
          </button>
          <button
            className={`${styles.button} ${styles.transformButton}`}
            onClick={onRotate180}
            title={t("editor:tools.transform.rotate180")}
          >
            <IconRotate size={20} />
            {t("editor:tools.transform.rotate180")}
          </button>
        </div>
      </div>

      <div className={styles.transformSection}>
        <label className={styles.optionLabel}>
          {t("editor:tools.transform.flip")}
        </label>
        <div className={styles.transformButtons}>
          <button
            className={`${styles.button} ${styles.transformButton}`}
            onClick={onFlipHorizontal}
            title={t("editor:tools.transform.flipHorizontal")}
          >
            <IconFlipHorizontal size={20} />
            {t("editor:tools.transform.flipHorizontal")}
          </button>
          <button
            className={`${styles.button} ${styles.transformButton}`}
            onClick={onFlipVertical}
            title={t("editor:tools.transform.flipVertical")}
          >
            <IconFlipVertical size={20} />
            {t("editor:tools.transform.flipVertical")}
          </button>
        </div>
      </div>
    </div>
  );
};
