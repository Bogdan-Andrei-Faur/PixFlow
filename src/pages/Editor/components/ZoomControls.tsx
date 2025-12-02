import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../Editor.module.css";
import {
  IconMinus,
  IconPlus,
  IconObjectScan,
  IconAspectRatio,
} from "@tabler/icons-react";

interface Props {
  zoom: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onSlider: (v: number) => void;
  onFit: () => void;
  onOneToOne: () => void;
}

const ZoomControls: React.FC<Props> = ({
  zoom,
  onZoomOut,
  onZoomIn,
  onSlider,
  onFit,
  onOneToOne,
}) => {
  const { t } = useTranslation("editor");

  return (
    <div
      className={styles.zoomControls}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onZoomOut}
        aria-label={t("zoom.out")}
      >
        <IconMinus size={16} />
      </button>
      <span>{Math.round(zoom * 100)}%</span>
      <input
        className={styles.range}
        type="range"
        min={0.01}
        max={4}
        step={0.01}
        value={zoom}
        onChange={(e) => onSlider(parseFloat(e.target.value))}
      />
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onZoomIn}
        aria-label={t("zoom.in")}
      >
        <IconPlus size={16} />
      </button>
      <button className={styles.button} onClick={onFit}>
        {t("zoom.fit")} <IconObjectScan size={16} />
      </button>
      <button className={styles.button} onClick={onOneToOne}>
        {t("zoom.oneToOne")} <IconAspectRatio size={16} />
      </button>
    </div>
  );
};

export default ZoomControls;
