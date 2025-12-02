import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../Editor.module.css";
import type { NaturalDims } from "../types";

interface AdjustmentsPanelProps {
  natural: NaturalDims | null;
  brightness: number;
  contrast: number;
  saturation: number;
  onChangeBrightness: (value: number) => void;
  onChangeContrast: (value: number) => void;
  onChangeSaturation: (value: number) => void;
  onApplyAdjustments: () => void;
  onCancelAdjustments: () => void;
  hasAdjustmentChanges: boolean;
}

export const AdjustmentsPanel: React.FC<AdjustmentsPanelProps> = ({
  natural,
  brightness,
  contrast,
  saturation,
  onChangeBrightness,
  onChangeContrast,
  onChangeSaturation,
  onApplyAdjustments,
  onCancelAdjustments,
  hasAdjustmentChanges,
}) => {
  const { t } = useTranslation(["editor", "common"]);

  if (!natural) return null;

  return (
    <div className={styles.toolOptions}>
      <label className={styles.optionLabel}>
        {t("editor:tools.adjustments.brightness")} {brightness > 0 ? "+" : ""}
        {brightness}%
        <input
          type="range"
          min="-100"
          max="100"
          value={brightness}
          onChange={(e) => onChangeBrightness(parseInt(e.target.value))}
          className={styles.adjustmentSlider}
        />
      </label>

      <label className={styles.optionLabel}>
        {t("editor:tools.adjustments.contrast")} {contrast > 0 ? "+" : ""}
        {contrast}%
        <input
          type="range"
          min="-100"
          max="100"
          value={contrast}
          onChange={(e) => onChangeContrast(parseInt(e.target.value))}
          className={styles.adjustmentSlider}
        />
      </label>

      <label className={styles.optionLabel}>
        {t("editor:tools.adjustments.saturation")} {saturation > 0 ? "+" : ""}
        {saturation}%
        <input
          type="range"
          min="-100"
          max="100"
          value={saturation}
          onChange={(e) => onChangeSaturation(parseInt(e.target.value))}
          className={styles.adjustmentSlider}
        />
      </label>

      {hasAdjustmentChanges && (
        <>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={onApplyAdjustments}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {t("editor:tools.adjustments.apply")}
          </button>
          <button
            className={styles.button}
            onClick={onCancelAdjustments}
            style={{ width: "100%" }}
          >
            {t("common:buttons.cancel")}
          </button>
        </>
      )}
    </div>
  );
};
