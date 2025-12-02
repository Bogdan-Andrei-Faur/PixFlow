import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../Editor.module.css";
import type { NaturalDims, FilterType } from "../types";

interface FiltersDockProps {
  natural: NaturalDims | null;
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  onApplyFilter: () => void;
  onCancelFilter: () => void;
  hasFilterChanges: boolean;
  onSetActiveTool: (t: "none") => void;
}

export const FiltersDock: React.FC<FiltersDockProps> = ({
  natural,
  activeFilter,
  onSelectFilter,
  onApplyFilter,
  onCancelFilter,
  hasFilterChanges,
  onSetActiveTool,
}) => {
  const { t } = useTranslation(["editor", "common"]);

  if (!natural) return null;

  return (
    <div className={styles.dockFiltersControls}>
      <div className={styles.dockFilterGrid}>
        <button
          className={`${styles.button} ${styles.filterButton} ${
            activeFilter === "grayscale" ? styles.activeFilter : ""
          }`}
          onClick={() => onSelectFilter("grayscale")}
        >
          {t("editor:tools.filters.grayscale")}
        </button>
        <button
          className={`${styles.button} ${styles.filterButton} ${
            activeFilter === "sepia" ? styles.activeFilter : ""
          }`}
          onClick={() => onSelectFilter("sepia")}
        >
          {t("editor:tools.filters.sepia")}
        </button>
        <button
          className={`${styles.button} ${styles.filterButton} ${
            activeFilter === "invert" ? styles.activeFilter : ""
          }`}
          onClick={() => onSelectFilter("invert")}
        >
          {t("editor:tools.filters.invert")}
        </button>
      </div>
      <div className={styles.dockActions}>
        <button
          className={`${styles.button} ${styles.secondary}`}
          onClick={() => {
            onCancelFilter();
            onSetActiveTool("none");
          }}
        >
          {t("common:buttons.cancel")}
        </button>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={() => {
            onApplyFilter();
            onSetActiveTool("none");
          }}
          disabled={!hasFilterChanges}
        >
          {t("editor:tools.filters.apply")}
        </button>
      </div>
    </div>
  );
};
