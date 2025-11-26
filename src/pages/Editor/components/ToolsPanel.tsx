import React from "react";
import styles from "../Editor.module.css";
import {
  IconCrop,
  IconResize,
  IconFileTypePng,
  IconDownload,
} from "@tabler/icons-react";

export type Tool = "none" | "crop" | "resize" | "format";

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

  // Format
  targetFormat: "png" | "jpeg" | "webp";
  jpegQuality: number;
  onChangeFormat: (fmt: "png" | "jpeg" | "webp") => void;
  onChangeQuality: (q: number) => void;

  // Export
  onExport: () => void;
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
  targetFormat,
  jpegQuality,
  onChangeFormat,
  onChangeQuality,
  onExport,
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

      {/* Formato */}
      <button
        className={`${styles.toolButton} ${
          activeTool === "format" ? styles.active : ""
        }`}
        onClick={() =>
          onSetActiveTool(activeTool === "format" ? "none" : "format")
        }
      >
        <IconFileTypePng size={20} />
        <span>Formato</span>
      </button>

      {activeTool === "format" && (
        <div className={styles.toolOptions}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="format"
              value="png"
              checked={targetFormat === "png"}
              onChange={() => onChangeFormat("png")}
            />
            PNG
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="format"
              value="jpeg"
              checked={targetFormat === "jpeg"}
              onChange={() => onChangeFormat("jpeg")}
            />
            JPEG
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="format"
              value="webp"
              checked={targetFormat === "webp"}
              onChange={() => onChangeFormat("webp")}
            />
            WebP
          </label>

          {targetFormat === "jpeg" && (
            <label className={styles.optionLabel}>
              Calidad ({Math.round(jpegQuality * 100)}%):
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={jpegQuality}
                onChange={(e) => onChangeQuality(parseFloat(e.target.value))}
                className={styles.qualitySlider}
              />
            </label>
          )}
        </div>
      )}

      <div className={styles.spacer} />

      {/* Exportar */}
      <button
        className={`${styles.toolButton} ${styles.exportButton}`}
        onClick={onExport}
      >
        <IconDownload size={20} />
        <span>Descargar</span>
      </button>
    </div>
  );
};

export default ToolsPanel;
