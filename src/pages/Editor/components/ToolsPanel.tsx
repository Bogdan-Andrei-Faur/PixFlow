import React from "react";
import styles from "../Editor.module.css";
import { IconCrop, IconResize, IconDownload } from "@tabler/icons-react";

export type Tool = "none" | "crop" | "resize";

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
