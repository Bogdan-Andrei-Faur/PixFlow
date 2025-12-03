import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../../Editor.module.css";
import type { NaturalDims, FilterType } from "../types";

interface FiltersPanelProps {
  natural: NaturalDims | null;
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  onApplyFilter: () => void;
  onCancelFilter: () => void;
  hasFilterChanges: boolean;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  natural,
  activeFilter,
  onSelectFilter,
  onApplyFilter,
  onCancelFilter,
  hasFilterChanges,
}) => {
  const { t } = useTranslation(["editor", "common"]);

  if (!natural) return null;

  return (
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
  );
};
