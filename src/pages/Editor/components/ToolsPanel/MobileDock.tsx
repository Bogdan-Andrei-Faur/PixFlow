import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../Editor.module.css";
import {
  IconCrop,
  IconResize,
  IconDownload,
  IconRotate,
  IconAdjustments,
  IconFilter,
} from "@tabler/icons-react";
import { CropDock } from "./mobile/CropDock.js";
import { ResizeDock } from "./mobile/ResizeDock.js";
import { TransformDock } from "./mobile/TransformDock.js";
import { AdjustmentsDock } from "./mobile/AdjustmentsDock.js";
import { FiltersDock } from "./mobile/FiltersDock.js";
import type { Tool, NaturalDims, CropRect, FilterType } from "./types";

interface MobileDockProps {
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

export const MobileDock: React.FC<MobileDockProps> = (props) => {
  const { t } = useTranslation(["editor", "common"]);
  const {
    activeTool,
    onSetActiveTool,
    natural,
    onInitCropIfNeeded,
    onOpenExportModal,
  } = props;

  if (activeTool === "none") {
    return (
      <div className={styles.mobileDock}>
        <div className={styles.dockToolButtons}>
          <button
            className={styles.dockButton}
            onClick={() => {
              onSetActiveTool("crop");
              onInitCropIfNeeded();
            }}
            disabled={!natural}
          >
            <IconCrop size={20} />
            <span>{t("editor:tools.crop.name")}</span>
          </button>
          <button
            className={styles.dockButton}
            onClick={() => onSetActiveTool("resize")}
            disabled={!natural}
          >
            <IconResize size={20} />
            <span>{t("editor:tools.resize.name")}</span>
          </button>
          <button
            className={styles.dockButton}
            onClick={() => onSetActiveTool("transform")}
            disabled={!natural}
          >
            <IconRotate size={20} />
            <span>{t("editor:tools.transform.name")}</span>
          </button>
          <button
            className={styles.dockButton}
            onClick={() => onSetActiveTool("adjustments")}
            disabled={!natural}
          >
            <IconAdjustments size={20} />
            <span>{t("editor:tools.adjustments.name")}</span>
          </button>
          <button
            className={styles.dockButton}
            onClick={() => onSetActiveTool("filters")}
            disabled={!natural}
          >
            <IconFilter size={20} />
            <span>{t("editor:tools.filters.name")}</span>
          </button>
          <button className={styles.dockButton} onClick={onOpenExportModal}>
            <IconDownload size={20} />
            <span>{t("common:buttons.download")}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mobileDock}>
      {activeTool === "crop" && <CropDock {...props} />}
      {activeTool === "resize" && <ResizeDock {...props} />}
      {activeTool === "transform" && <TransformDock {...props} />}
      {activeTool === "adjustments" && <AdjustmentsDock {...props} />}
      {activeTool === "filters" && <FiltersDock {...props} />}
    </div>
  );
};
