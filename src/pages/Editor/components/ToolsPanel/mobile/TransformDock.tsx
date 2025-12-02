import React from "react";
import styles from "../../../Editor.module.css";
import {
  IconFlipHorizontal,
  IconFlipVertical,
  IconRotateClockwise,
  IconRotate2,
  IconX,
} from "@tabler/icons-react";
import type { NaturalDims } from "../types";

interface TransformDockProps {
  natural: NaturalDims | null;
  onRotate90: () => void;
  onRotateMinus90: () => void;
  onRotate180: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onSetActiveTool: (t: "none") => void;
}

export const TransformDock: React.FC<TransformDockProps> = ({
  natural,
  onRotate90,
  onRotateMinus90,
  onRotate180,
  onFlipHorizontal,
  onFlipVertical,
  onSetActiveTool,
}) => {
  if (!natural) return null;

  return (
    <div className={styles.dockTransformControls}>
      <div className={styles.transformRow}>
        <button
          className={`${styles.button} ${styles.transformButton}`}
          onClick={onRotateMinus90}
        >
          <IconRotateClockwise size={18} style={{ transform: "scaleX(-1)" }} />
        </button>
        <button
          className={`${styles.button} ${styles.transformButton}`}
          onClick={onRotate90}
        >
          <IconRotateClockwise size={18} />
        </button>
        <button
          className={`${styles.button} ${styles.transformButton}`}
          onClick={onRotate180}
        >
          <IconRotate2 size={18} />
        </button>
        <button
          className={`${styles.button} ${styles.transformButton}`}
          onClick={onFlipHorizontal}
        >
          <IconFlipHorizontal size={18} />
        </button>
        <button
          className={`${styles.button} ${styles.transformButton}`}
          onClick={onFlipVertical}
        >
          <IconFlipVertical size={18} />
        </button>
        <button
          className={`${styles.button} ${styles.closeToolButton}`}
          onClick={() => onSetActiveTool("none")}
        >
          <IconX size={18} />
        </button>
      </div>
    </div>
  );
};
