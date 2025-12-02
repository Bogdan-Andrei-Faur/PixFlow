import React from "react";
import styles from "./ZoomIndicator.module.css";

interface Props {
  zoom: number;
  visible: boolean;
}

const ZoomIndicator: React.FC<Props> = ({ zoom, visible }) => {
  const percentage = Math.round(zoom * 100);

  return (
    <div className={`${styles.indicator} ${visible ? styles.visible : ""}`}>
      {percentage}%
    </div>
  );
};

export default ZoomIndicator;
