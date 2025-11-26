import React from "react";
import styles from "../Editor.module.css";
import {
  IconCrop,
  IconResize,
  IconDownload,
  IconRotate,
  IconFlipHorizontal,
  IconFlipVertical,
  IconRotateClockwise,
} from "@tabler/icons-react";

export type Tool = "none" | "crop" | "resize" | "transform";

interface NaturalDims {
  w: number;
  h: number;
}

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  activeTool: Tool;
  onSetActiveTool: (t: Tool) => void;

  // Crop
  cropRect: CropRect | null;
  natural: NaturalDims | null;
  onInitCropIfNeeded: () => void; // inicializa rect si no existe
  onApplyCrop: () => void;
  onCancelCrop: () => void;

  // Resize
  newWidth: number;
  newHeight: number;
  maintainAspect: boolean;
  onChangeWidth: (w: number) => void;
  onChangeHeight: (h: number) => void;
  onToggleAspect: (v: boolean) => void;
  onApplyResize: () => void;
  onCancelResize: () => void;

  // Transform
  onRotate90: () => void;
  onRotateMinus90: () => void;
  onRotate180: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;

  // Export
  onOpenExportModal: () => void;
}

const ToolsPanel: React.FC<Props> = ({
  activeTool,
  onSetActiveTool,
  cropRect,
  natural,
  onInitCropIfNeeded,
  onApplyCrop,
  onCancelCrop,
  newWidth,
  newHeight,
  maintainAspect,
  onChangeWidth,
  onChangeHeight,
  onToggleAspect,
  onApplyResize,
  onCancelResize,
  onRotate90,
  onRotateMinus90,
  onRotate180,
  onFlipHorizontal,
  onFlipVertical,
  onOpenExportModal,
}) => {
  return (
    <div className={styles.toolsPanel}>
      <h3 className={styles.panelTitle}>Herramientas</h3>

      {/* Recortar */}
      <button
        className={`${styles.toolButton} ${
          activeTool === "crop" ? styles.active : ""
        }`}
        onClick={() => {
          if (activeTool === "crop") {
            onSetActiveTool("none");
          } else {
            onSetActiveTool("crop");
            onInitCropIfNeeded();
          }
        }}
      >
        <IconCrop size={20} />
        <span>Recortar</span>
      </button>

      {activeTool === "crop" && (
        <div className={styles.toolOptions}>
          {cropRect && (
            <p className={styles.cropInfo}>
              {Math.round(cropRect.width)} × {Math.round(cropRect.height)} px
            </p>
          )}
          {cropRect && cropRect.width > 0 && cropRect.height > 0 ? (
            <>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={onApplyCrop}
                style={{ width: "100%" }}
              >
                Aplicar recorte
              </button>
              <button
                className={styles.button}
                onClick={onCancelCrop}
                style={{ width: "100%" }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <p className={styles.cropInfo}>
              Arrastra sobre la imagen para crear un área de recorte
            </p>
          )}
        </div>
      )}

      {/* Redimensionar */}
      <button
        className={`${styles.toolButton} ${
          activeTool === "resize" ? styles.active : ""
        }`}
        onClick={() =>
          onSetActiveTool(activeTool === "resize" ? "none" : "resize")
        }
        disabled={!natural}
      >
        <IconResize size={20} />
        <span>Redimensionar</span>
      </button>

      {activeTool === "resize" && natural && (
        <div className={styles.toolOptions}>
          <label className={styles.optionLabel}>
            Ancho (px):
            <input
              type="number"
              value={newWidth}
              onChange={(e) => onChangeWidth(parseInt(e.target.value) || 0)}
              className={styles.numberInput}
            />
          </label>
          <label className={styles.optionLabel}>
            Alto (px):
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
            Mantener aspecto
          </label>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={onApplyResize}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Aplicar redimensionado
          </button>
          <button
            className={styles.button}
            onClick={onCancelResize}
            style={{ width: "100%" }}
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Transformar (Rotar/Flip) */}
      <button
        className={`${styles.toolButton} ${
          activeTool === "transform" ? styles.active : ""
        }`}
        onClick={() =>
          onSetActiveTool(activeTool === "transform" ? "none" : "transform")
        }
        disabled={!natural}
      >
        <IconRotate size={20} />
        <span>Transformar</span>
      </button>

      {activeTool === "transform" && natural && (
        <div className={styles.toolOptions}>
          <div className={styles.transformSection}>
            <label className={styles.optionLabel}>Rotar:</label>
            <div className={styles.transformButtons}>
              <button
                className={`${styles.button} ${styles.transformButton}`}
                onClick={onRotateMinus90}
                title="Rotar 90° izquierda"
              >
                <IconRotateClockwise
                  size={20}
                  style={{ transform: "scaleX(-1)" }}
                />
                90° ←
              </button>
              <button
                className={`${styles.button} ${styles.transformButton}`}
                onClick={onRotate90}
                title="Rotar 90° derecha"
              >
                <IconRotateClockwise size={20} />
                90° →
              </button>
              <button
                className={`${styles.button} ${styles.transformButton}`}
                onClick={onRotate180}
                title="Rotar 180°"
              >
                <IconRotate size={20} />
                180°
              </button>
            </div>
          </div>

          <div className={styles.transformSection}>
            <label className={styles.optionLabel}>Voltear:</label>
            <div className={styles.transformButtons}>
              <button
                className={`${styles.button} ${styles.transformButton}`}
                onClick={onFlipHorizontal}
                title="Voltear horizontal"
              >
                <IconFlipHorizontal size={20} />
                Horizontal
              </button>
              <button
                className={`${styles.button} ${styles.transformButton}`}
                onClick={onFlipVertical}
                title="Voltear vertical"
              >
                <IconFlipVertical size={20} />
                Vertical
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.spacer} />

      {/* Exportar */}
      <button
        className={`${styles.toolButton} ${styles.exportButton}`}
        onClick={onOpenExportModal}
      >
        <IconDownload size={20} />
        <span>Descargar</span>
      </button>
    </div>
  );
};

export default ToolsPanel;
