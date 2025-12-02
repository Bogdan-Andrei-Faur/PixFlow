import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../Editor.module.css";
import { IconLink, IconLinkOff } from "@tabler/icons-react";
import type { NaturalDims } from "../types";

interface ResizeDockProps {
  natural: NaturalDims | null;
  newWidth: number;
  newHeight: number;
  maintainAspect: boolean;
  onChangeWidth: (w: number) => void;
  onChangeHeight: (h: number) => void;
  onToggleAspect: (v: boolean) => void;
  onApplyResize: () => void;
  onCancelResize: () => void;
  onSetActiveTool: (t: "none") => void;
}

export const ResizeDock: React.FC<ResizeDockProps> = ({
  natural,
  newWidth,
  newHeight,
  maintainAspect,
  onChangeWidth,
  onChangeHeight,
  onToggleAspect,
  onApplyResize,
  onCancelResize,
  onSetActiveTool,
}) => {
  const { t } = useTranslation(["editor", "common"]);

  if (!natural) return null;

  return (
    <div className={styles.dockResizeControls}>
      <div className={styles.resizeInputs}>
        <input
          type="number"
          value={newWidth}
          onChange={(e) => onChangeWidth(parseInt(e.target.value) || 0)}
          className={styles.resizeInput}
          placeholder="Ancho"
        />
        <span>×</span>
        <input
          type="number"
          value={newHeight}
          onChange={(e) => onChangeHeight(parseInt(e.target.value) || 0)}
          className={styles.resizeInput}
          placeholder="Alto"
        />
        <label className={styles.aspectCheckbox}>
          <input
            type="checkbox"
            checked={maintainAspect}
            onChange={(e) => onToggleAspect(e.target.checked)}
          />
          {maintainAspect ? (
            <IconLink size={18} />
          ) : (
            <IconLinkOff size={18} style={{ opacity: 0.5 }} />
          )}
        </label>
      </div>
      <div className={styles.dockActions}>
        <button
          className={`${styles.button} ${styles.secondary}`}
          onClick={() => {
            onCancelResize();
            onSetActiveTool("none");
          }}
        >
          {t("common:buttons.cancel")}
        </button>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={() => {
            onApplyResize();
            onSetActiveTool("none");
          }}
        >
          {t("editor:tools.resize.apply")}
        </button>
      </div>
    </div>
  );
};
