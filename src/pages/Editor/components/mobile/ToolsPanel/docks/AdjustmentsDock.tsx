import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../../Editor.module.css";
import type { NaturalDims } from "../../../desktop/ToolsPanel/types";

interface AdjustmentsDockProps {
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
  onSetActiveTool: (t: "none") => void;
}

export const AdjustmentsDock: React.FC<AdjustmentsDockProps> = ({
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
  onSetActiveTool,
}) => {
  const { t } = useTranslation(["editor", "common"]);

  if (!natural) return null;

  return (
    <div className={styles.dockAdjustmentsControls}>
      <div className={styles.adjustmentSliderRow}>
        <label className={styles.adjustmentLabel}>
          <span className={styles.adjustmentName}>
            {t("editor:tools.adjustments.brightness")}
          </span>
          <input
            type="range"
            min="-100"
            max="100"
            value={brightness}
            onChange={(e) => onChangeBrightness(parseInt(e.target.value))}
            className={styles.rangeSlider}
          />
          <span className={styles.adjustmentValue}>
            {brightness > 0 ? "+" : ""}
            {brightness}%
          </span>
        </label>
      </div>
      <div className={styles.adjustmentSliderRow}>
        <label className={styles.adjustmentLabel}>
          <span className={styles.adjustmentName}>
            {t("editor:tools.adjustments.contrast")}
          </span>
          <input
            type="range"
            min="-100"
            max="100"
            value={contrast}
            onChange={(e) => onChangeContrast(parseInt(e.target.value))}
            className={styles.rangeSlider}
          />
          <span className={styles.adjustmentValue}>
            {contrast > 0 ? "+" : ""}
            {contrast}%
          </span>
        </label>
      </div>
      <div className={styles.adjustmentSliderRow}>
        <label className={styles.adjustmentLabel}>
          <span className={styles.adjustmentName}>
            {t("editor:tools.adjustments.saturation")}
          </span>
          <input
            type="range"
            min="-100"
            max="100"
            value={saturation}
            onChange={(e) => onChangeSaturation(parseInt(e.target.value))}
            className={styles.rangeSlider}
          />
          <span className={styles.adjustmentValue}>
            {saturation > 0 ? "+" : ""}
            {saturation}%
          </span>
        </label>
      </div>
      <div className={styles.dockActions}>
        <button
          className={`${styles.button} ${styles.secondary}`}
          onClick={() => {
            onCancelAdjustments();
            onSetActiveTool("none");
          }}
        >
          {t("common:buttons.cancel")}
        </button>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={() => {
            onApplyAdjustments();
            onSetActiveTool("none");
          }}
          disabled={!hasAdjustmentChanges}
        >
          {t("editor:tools.adjustments.apply")}
        </button>
      </div>
    </div>
  );
};
