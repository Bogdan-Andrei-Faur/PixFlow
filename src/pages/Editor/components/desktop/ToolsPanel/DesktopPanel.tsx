import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../Editor.module.css";
import {
  IconCrop,
  IconResize,
  IconDownload,
  IconRotate,
  IconAdjustments,
  IconFilter,
} from "@tabler/icons-react";
import { CropPanel } from "./desktop/CropPanel.js";
import { ResizePanel } from "./desktop/ResizePanel.js";
import { TransformPanel } from "./desktop/TransformPanel.js";
import { AdjustmentsPanel } from "./desktop/AdjustmentsPanel.js";
import { FiltersPanel } from "./desktop/FiltersPanel.js";
import type { Tool, NaturalDims, CropRect, FilterType } from "./types";

interface DesktopPanelProps {
  activeTool: Tool;
  onSetActiveTool: (t: Tool) => void;
  natural: NaturalDims | null;

  // Crop
  cropRect: CropRect | null;
  onInitCropIfNeeded: () => void;
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

  // Filters
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  onApplyFilter: () => void;
  onCancelFilter: () => void;
  hasFilterChanges: boolean;

  // Export
  onOpenExportModal: () => void;
}

export const DesktopPanel: React.FC<DesktopPanelProps> = (props) => {
  const { t } = useTranslation(["editor", "common"]);
  const {
    activeTool,
    onSetActiveTool,
    natural,
    onInitCropIfNeeded,
    onOpenExportModal,
  } = props;

  return (
    <div className={styles.desktopPanel}>
      {/* Crop Tool */}
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
      {activeTool === "crop" && <CropPanel {...props} />}

      {/* Resize Tool */}
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
      {activeTool === "resize" && <ResizePanel {...props} />}

      {/* Transform Tool */}
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
      {activeTool === "transform" && <TransformPanel {...props} />}

      {/* Adjustments Tool */}
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
      {activeTool === "adjustments" && <AdjustmentsPanel {...props} />}

      {/* Filters Tool */}
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
      {activeTool === "filters" && <FiltersPanel {...props} />}

      <div className={styles.spacer} />

      {/* Export */}
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
