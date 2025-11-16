import React from "react";
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
  return (
    <div
      className={styles.zoomControls}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onZoomOut}
        aria-label="Reducir zoom"
      >
        <IconMinus size={16} />
      </button>
      <span>{Math.round(zoom * 100)}%</span>
      <input
        className={styles.range}
        type="range"
        min={0.1}
        max={4}
        step={0.01}
        value={zoom}
        onChange={(e) => onSlider(parseFloat(e.target.value))}
      />
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onZoomIn}
        aria-label="Aumentar zoom"
      >
        <IconPlus size={16} />
      </button>
      <button className={styles.button} onClick={onFit}>
        Encajar <IconObjectScan size={16} />
      </button>
      <button className={styles.button} onClick={onOneToOne}>
        1:1 <IconAspectRatio size={16} />
      </button>
    </div>
  );
};

export default ZoomControls;
