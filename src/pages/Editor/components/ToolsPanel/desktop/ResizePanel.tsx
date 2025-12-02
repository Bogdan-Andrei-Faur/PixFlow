import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../Editor.module.css";
import type { NaturalDims } from "../types";

interface ResizePanelProps {
  natural: NaturalDims | null;
  newWidth: number;
  newHeight: number;
  maintainAspect: boolean;
  onChangeWidth: (w: number) => void;
  onChangeHeight: (h: number) => void;
  onToggleAspect: (v: boolean) => void;
  onApplyResize: () => void;
  onCancelResize: () => void;
}

export const ResizePanel: React.FC<ResizePanelProps> = ({
  natural,
  newWidth,
  newHeight,
  maintainAspect,
  onChangeWidth,
  onChangeHeight,
  onToggleAspect,
  onApplyResize,
  onCancelResize,
}) => {
  const { t } = useTranslation(["editor", "common"]);

  if (!natural) return null;

  return (
    <div className={styles.toolOptions}>
      <label className={styles.optionLabel}>
        {t("editor:tools.resize.width")}
        <input
          type="number"
          value={newWidth}
          onChange={(e) => onChangeWidth(parseInt(e.target.value) || 0)}
          className={styles.numberInput}
        />
      </label>
      <label className={styles.optionLabel}>
        {t("editor:tools.resize.height")}
        <input
          type="number"
          value={newHeight}
          onChange={(e) => onChangeHeight(parseInt(e.target.value) || 0)}
          className={styles.numberInput}
        />
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={maintainAspect}
          onChange={(e) => onToggleAspect(e.target.checked)}
        />
        {t("editor:tools.resize.maintainAspect")}
      </label>
      <button
        className={`${styles.button} ${styles.primary}`}
        onClick={onApplyResize}
        style={{ width: "100%", marginTop: "0.5rem" }}
      >
        {t("editor:tools.resize.apply")}
      </button>
      <button
        className={styles.button}
        onClick={onCancelResize}
        style={{ width: "100%" }}
      >
        {t("common:buttons.cancel")}
      </button>
    </div>
  );
};
