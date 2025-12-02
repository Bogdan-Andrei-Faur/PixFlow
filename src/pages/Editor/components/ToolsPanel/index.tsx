import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../Editor.module.css";
import { MobileDock } from "./MobileDock";
import { DesktopPanel } from "./DesktopPanel";
import type { Tool, NaturalDims, CropRect, FilterType } from "./types";

export type { Tool, NaturalDims, CropRect, FilterType };

interface ToolsPanelProps {
  activeTool: Tool;
  onSetActiveTool: (t: Tool) => void;

  // Crop
  cropRect: CropRect | null;
  natural: NaturalDims | null;
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

  // Quick Filters
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  onApplyFilter: () => void;
  onCancelFilter: () => void;
  hasFilterChanges: boolean;

  // Export
  onOpenExportModal: () => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = (props) => {
  const { t } = useTranslation(["editor"]);

  return (
    <div className={styles.toolsPanel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>{t("editor:tools.title")}</h3>
      </div>

      <MobileDock {...props} />
      <DesktopPanel {...props} />
    </div>
  );
};

export default ToolsPanel;
