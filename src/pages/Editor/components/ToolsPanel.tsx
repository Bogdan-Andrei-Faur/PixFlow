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
  IconAdjustments,
  IconFilter,
} from "@tabler/icons-react";

export type Tool =
  | "none"
  | "crop"
  | "resize"
  | "transform"
  | "adjustments"
  | "filters";

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

  // Adjustments
  brightness: number;
  contrast: number;
  saturation: number;
  onChangeBrightness: (value: number) => void;
  onChangeContrast: (value: number) => void;
  onChangeSaturation: (value: number) => void;
  onApplyAdjustments: () => void;
  onCancelAdjustments: () => void;
  hasAdjustmentChanges: boolean;

  // Quick Filters
  activeFilter: "none" | "grayscale" | "sepia" | "invert";
  onSelectFilter: (filter: "none" | "grayscale" | "sepia" | "invert") => void;
  onApplyFilter: () => void;
  onCancelFilter: () => void;
  hasFilterChanges: boolean;

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
  brightness,
  contrast,
  saturation,
  onChangeBrightness,
  onChangeContrast,
  onChangeSaturation,
  onApplyAdjustments,
  onCancelAdjustments,
  hasAdjustmentChanges,
  activeFilter,
  onSelectFilter,
  onApplyFilter,
  onCancelFilter,
  hasFilterChanges,
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

      {/* Ajustes (Brillo/Contraste/Saturación) */}
      <button
        className={`${styles.toolButton} ${
          activeTool === "adjustments" ? styles.active : ""
        }`}
        onClick={() =>
          onSetActiveTool(activeTool === "adjustments" ? "none" : "adjustments")
        }
        disabled={!natural}
      >
        <IconAdjustments size={20} />
        <span>Ajustes</span>
      </button>

      {activeTool === "adjustments" && natural && (
        <div className={styles.toolOptions}>
          <label className={styles.optionLabel}>
            Brillo: {brightness > 0 ? "+" : ""}
            {brightness}%
            <input
              type="range"
              min="-100"
              max="100"
              value={brightness}
              onChange={(e) => onChangeBrightness(parseInt(e.target.value))}
              className={styles.adjustmentSlider}
            />
          </label>

          <label className={styles.optionLabel}>
            Contraste: {contrast > 0 ? "+" : ""}
            {contrast}%
            <input
              type="range"
              min="-100"
              max="100"
              value={contrast}
              onChange={(e) => onChangeContrast(parseInt(e.target.value))}
              className={styles.adjustmentSlider}
            />
          </label>

          <label className={styles.optionLabel}>
            Saturación: {saturation > 0 ? "+" : ""}
            {saturation}%
            <input
              type="range"
              min="-100"
              max="100"
              value={saturation}
              onChange={(e) => onChangeSaturation(parseInt(e.target.value))}
              className={styles.adjustmentSlider}
            />
          </label>

          {hasAdjustmentChanges && (
            <>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={onApplyAdjustments}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                Aplicar ajustes
              </button>
              <button
                className={styles.button}
                onClick={onCancelAdjustments}
                style={{ width: "100%" }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      )}

      {/* Filtros rápidos */}
      <button
        className={`${styles.toolButton} ${
          activeTool === "filters" ? styles.active : ""
        }`}
        onClick={() =>
          onSetActiveTool(activeTool === "filters" ? "none" : "filters")
        }
        disabled={!natural}
      >
        <IconFilter size={20} />
        <span>Filtros</span>
      </button>

      {activeTool === "filters" && natural && (
        <div className={styles.toolOptions}>
          <div className={styles.filterGrid}>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "grayscale" ? styles.activeFilter : ""
              }`}
              onClick={() => onSelectFilter("grayscale")}
            >
              Grises
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "sepia" ? styles.activeFilter : ""
              }`}
              onClick={() => onSelectFilter("sepia")}
            >
              Sepia
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "invert" ? styles.activeFilter : ""
              }`}
              onClick={() => onSelectFilter("invert")}
            >
              Invertir
            </button>
          </div>

          {hasFilterChanges && (
            <>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={onApplyFilter}
                style={{ width: "100%", marginTop: "1rem" }}
              >
                Aplicar filtro
              </button>
              <button
                className={styles.button}
                onClick={onCancelFilter}
                style={{ width: "100%" }}
              >
                Cancelar
              </button>
            </>
          )}
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
