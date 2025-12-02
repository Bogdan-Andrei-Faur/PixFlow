import React from "react";
import styles from "./MobileToolControls.module.css";
import { 
  IconCheck, 
  IconX, 
  IconRotateClockwise,
  IconRotate,
  IconFlipHorizontal,
  IconFlipVertical
} from "@tabler/icons-react";

interface CropControlsProps {
  onApply: () => void;
  onCancel: () => void;
  hasSelection: boolean;
}

export const MobileCropControls: React.FC<CropControlsProps> = ({
  onApply,
  onCancel,
  hasSelection,
}) => {
  return (
    <div className={styles.controlsContainer}>
      <p className={styles.hint}>
        Arrastra los bordes para seleccionar el área a recortar
      </p>
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.cancel}`}
          onClick={onCancel}
        >
          <IconX size={20} />
          Cancelar
        </button>
        <button
          className={`${styles.button} ${styles.apply}`}
          onClick={onApply}
          disabled={!hasSelection}
        >
          <IconCheck size={20} />
          Aplicar
        </button>
      </div>
    </div>
  );
};

interface ResizeControlsProps {
  width: number;
  height: number;
  maintainAspect: boolean;
  onChangeWidth: (w: number) => void;
  onChangeHeight: (h: number) => void;
  onToggleAspect: (v: boolean) => void;
  onApply: () => void;
  onCancel: () => void;
}

export const MobileResizeControls: React.FC<ResizeControlsProps> = ({
  width,
  height,
  maintainAspect,
  onChangeWidth,
  onChangeHeight,
  onToggleAspect,
  onApply,
  onCancel,
}) => {
  return (
    <div className={styles.controlsContainer}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>
          Ancho (px)
          <input
            type="number"
            value={width}
            onChange={(e) => onChangeWidth(Number(e.target.value))}
            className={styles.input}
            min="1"
          />
        </label>
        <label className={styles.label}>
          Alto (px)
          <input
            type="number"
            value={height}
            onChange={(e) => onChangeHeight(Number(e.target.value))}
            className={styles.input}
            min="1"
          />
        </label>
      </div>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={maintainAspect}
          onChange={(e) => onToggleAspect(e.target.checked)}
        />
        Mantener proporción
      </label>
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.cancel}`}
          onClick={onCancel}
        >
          <IconX size={20} />
          Cancelar
        </button>
        <button className={`${styles.button} ${styles.apply}`} onClick={onApply}>
          <IconCheck size={20} />
          Aplicar
        </button>
      </div>
    </div>
  );
};

interface TransformControlsProps {
  onRotate90: () => void;
  onRotateMinus90: () => void;
  onRotate180: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
}

export const MobileTransformControls: React.FC<TransformControlsProps> = ({
  onRotate90,
  onRotateMinus90,
  onRotate180,
  onFlipH,
  onFlipV,
}) => {
  return (
    <div className={styles.controlsContainer}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Rotar</h4>
        <div className={styles.transformGrid}>
          <button className={styles.transformButton} onClick={onRotateMinus90}>
            <IconRotateClockwise size={20} style={{ transform: 'scaleX(-1)' }} />
            -90°
          </button>
          <button className={styles.transformButton} onClick={onRotate90}>
            <IconRotateClockwise size={20} />
            90°
          </button>
          <button className={styles.transformButton} onClick={onRotate180}>
            <IconRotate size={20} />
            180°
          </button>
        </div>
      </div>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Voltear</h4>
        <div className={styles.transformGrid}>
          <button className={styles.transformButton} onClick={onFlipH}>
            <IconFlipHorizontal size={20} />
            Horizontal
          </button>
          <button className={styles.transformButton} onClick={onFlipV}>
            <IconFlipVertical size={20} />
            Vertical
          </button>
        </div>
      </div>
    </div>
  );
};

interface AdjustmentsControlsProps {
  brightness: number;
  contrast: number;
  saturation: number;
  onChangeBrightness: (v: number) => void;
  onChangeContrast: (v: number) => void;
  onChangeSaturation: (v: number) => void;
  onApply: () => void;
  onCancel: () => void;
  hasChanges: boolean;
}

export const MobileAdjustmentsControls: React.FC<
  AdjustmentsControlsProps
> = ({
  brightness,
  contrast,
  saturation,
  onChangeBrightness,
  onChangeContrast,
  onChangeSaturation,
  onApply,
  onCancel,
  hasChanges,
}) => {
  return (
    <div className={styles.controlsContainer}>
      <div className={styles.sliderGroup}>
        <label className={styles.sliderLabel}>
          <span>Brillo</span>
          <span className={styles.value}>{brightness}%</span>
        </label>
        <input
          type="range"
          min="-100"
          max="100"
          value={brightness}
          onChange={(e) => onChangeBrightness(Number(e.target.value))}
          className={styles.slider}
        />
      </div>
      <div className={styles.sliderGroup}>
        <label className={styles.sliderLabel}>
          <span>Contraste</span>
          <span className={styles.value}>{contrast}%</span>
        </label>
        <input
          type="range"
          min="-100"
          max="100"
          value={contrast}
          onChange={(e) => onChangeContrast(Number(e.target.value))}
          className={styles.slider}
        />
      </div>
      <div className={styles.sliderGroup}>
        <label className={styles.sliderLabel}>
          <span>Saturación</span>
          <span className={styles.value}>{saturation}%</span>
        </label>
        <input
          type="range"
          min="-100"
          max="100"
          value={saturation}
          onChange={(e) => onChangeSaturation(Number(e.target.value))}
          className={styles.slider}
        />
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.cancel}`}
          onClick={onCancel}
        >
          <IconX size={20} />
          Cancelar
        </button>
        <button
          className={`${styles.button} ${styles.apply}`}
          onClick={onApply}
          disabled={!hasChanges}
        >
          <IconCheck size={20} />
          Aplicar
        </button>
      </div>
    </div>
  );
};

interface FilterControlsProps {
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  onApply: () => void;
  onCancel: () => void;
  hasChanges: boolean;
}

export const MobileFilterControls: React.FC<FilterControlsProps> = ({
  activeFilter,
  onSelectFilter,
  onApply,
  onCancel,
  hasChanges,
}) => {
  const filters = [
    { id: "none", label: "Original" },
    { id: "grayscale", label: "Blanco y Negro" },
    { id: "sepia", label: "Sepia" },
    { id: "invert", label: "Invertir" },
  ];

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.filterGrid}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`${styles.filterButton} ${
              activeFilter === filter.id ? styles.activeFilter : ""
            }`}
            onClick={() => onSelectFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.cancel}`}
          onClick={onCancel}
        >
          <IconX size={20} />
          Cancelar
        </button>
        <button
          className={`${styles.button} ${styles.apply}`}
          onClick={onApply}
          disabled={!hasChanges}
        >
          <IconCheck size={20} />
          Aplicar
        </button>
      </div>
    </div>
  );
};
