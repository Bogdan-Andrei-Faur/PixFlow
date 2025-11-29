import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(["editor", "common"]);

  return (
    <div className={styles.toolsPanel}>
      <h3 className={styles.panelTitle}>{t("editor:tools.title")}</h3>

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
        <span>{t("editor:tools.crop.name")}</span>
      </button>

      {activeTool === "crop" && (
        <div className={styles.toolOptions}>
          {cropRect && (
            <p className={styles.cropInfo}>
              {t("editor:tools.crop.info", {
                width: Math.round(cropRect.width),
                height: Math.round(cropRect.height),
              })}
            </p>
          )}
          {cropRect && cropRect.width > 0 && cropRect.height > 0 ? (
            <>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={onApplyCrop}
                style={{ width: "100%" }}
              >
                {t("editor:tools.crop.apply")}
              </button>
              <button
                className={styles.button}
                onClick={onCancelCrop}
                style={{ width: "100%" }}
              >
                {t("common:buttons.cancel")}
              </button>
            </>
          ) : (
            <p className={styles.cropInfo}>{t("editor:tools.crop.hint")}</p>
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
        <span>{t("editor:tools.resize.name")}</span>
      </button>

      {activeTool === "resize" && natural && (
        <div className={styles.toolOptions}>
          <label className={styles.optionLabel}>
            {t("editor:tools.resize.width")}
            <input
              type="number"
              value={newWidth}
              onChange={(e) => onChangeWidth(parseInt(e.target.value) || 0)}
              className={styles.numberInput}
            />
          </label>
          <label className={styles.optionLabel}>
            {t("editor:tools.resize.height")}
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
            {t("editor:tools.resize.maintainAspect")}
          </label>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={onApplyResize}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {t("editor:tools.resize.apply")}
          </button>
          <button
            className={styles.button}
            onClick={onCancelResize}
            style={{ width: "100%" }}
          >
            {t("common:buttons.cancel")}
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
        <span>{t("editor:tools.transform.name")}</span>
      </button>

      {activeTool === "transform" && natural && (
        <div className={styles.toolOptions}>
          <div className={styles.transformSection}>
            <label className={styles.optionLabel}>
              {t("editor:tools.transform.rotate")}
            </label>
            <div className={styles.transformButtons}>
              <button
                className={`${styles.button} ${styles.transformButton}`}
                onClick={onRotateMinus90}
                title={t("editor:tools.transform.rotate90Left")}
              >
                <IconRotateClockwise
                  size={20}
                  style={{ transform: "scaleX(-1)" }}
                />
                {t("editor:tools.transform.rotate90Left")}
              </button>
              <button
                className={`${styles.button} ${styles.transformButton}`}
                onClick={onRotate90}
                title={t("editor:tools.transform.rotate90Right")}
              >
                <IconRotateClockwise size={20} />
                {t("editor:tools.transform.rotate90Right")}
              </button>
              <button
                className={`${styles.button} ${styles.transformButton}`}
                onClick={onRotate180}
                title={t("editor:tools.transform.rotate180")}
              >
                <IconRotate size={20} />
                {t("editor:tools.transform.rotate180")}
              </button>
            </div>
          </div>

          <div className={styles.transformSection}>
            <label className={styles.optionLabel}>
              {t("editor:tools.transform.flip")}
            </label>
            <div className={styles.transformButtons}>
              <button
                className={`${styles.button} ${styles.transformButton}`}
                onClick={onFlipHorizontal}
                title={t("editor:tools.transform.flipHorizontal")}
              >
                <IconFlipHorizontal size={20} />
                {t("editor:tools.transform.flipHorizontal")}
              </button>
              <button
                className={`${styles.button} ${styles.transformButton}`}
                onClick={onFlipVertical}
                title={t("editor:tools.transform.flipVertical")}
              >
                <IconFlipVertical size={20} />
                {t("editor:tools.transform.flipVertical")}
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
        <span>{t("editor:tools.adjustments.name")}</span>
      </button>

      {activeTool === "adjustments" && natural && (
        <div className={styles.toolOptions}>
          <label className={styles.optionLabel}>
            {t("editor:tools.adjustments.brightness")}{" "}
            {brightness > 0 ? "+" : ""}
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
            {t("editor:tools.adjustments.contrast")} {contrast > 0 ? "+" : ""}
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
            {t("editor:tools.adjustments.saturation")}{" "}
            {saturation > 0 ? "+" : ""}
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
                {t("editor:tools.adjustments.apply")}
              </button>
              <button
                className={styles.button}
                onClick={onCancelAdjustments}
                style={{ width: "100%" }}
              >
                {t("common:buttons.cancel")}
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
        <span>{t("editor:tools.filters.name")}</span>
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
              {t("editor:tools.filters.grayscale")}
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "sepia" ? styles.activeFilter : ""
              }`}
              onClick={() => onSelectFilter("sepia")}
            >
              {t("editor:tools.filters.sepia")}
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "invert" ? styles.activeFilter : ""
              }`}
              onClick={() => onSelectFilter("invert")}
            >
              {t("editor:tools.filters.invert")}
            </button>
          </div>

          {hasFilterChanges && (
            <>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={onApplyFilter}
                style={{ width: "100%", marginTop: "1rem" }}
              >
                {t("editor:tools.filters.apply")}
              </button>
              <button
                className={styles.button}
                onClick={onCancelFilter}
                style={{ width: "100%" }}
              >
                {t("common:buttons.cancel")}
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
        <span>{t("common:buttons.download")}</span>
      </button>
    </div>
  );
};

export default ToolsPanel;
