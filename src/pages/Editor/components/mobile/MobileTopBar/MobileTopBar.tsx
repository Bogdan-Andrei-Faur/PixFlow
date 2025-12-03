import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./MobileTopBar.module.css";
import { IconMenu2, IconCheck, IconEdit } from "@tabler/icons-react";

interface Props {
  onMenuOpen: () => void;
  onApply?: () => void;
  hasChanges?: boolean;
  activeTool?: string;
}

const MobileTopBar: React.FC<Props> = ({
  onMenuOpen,
  onApply,
  hasChanges = false,
  activeTool,
}) => {
  const { t } = useTranslation("editor");

  const getToolTitle = () => {
    if (!activeTool || activeTool === "none") {
      return t("title");
    }
    return activeTool.charAt(0).toUpperCase() + activeTool.slice(1);
  };

  return (
    <div className={styles.mobileTopBar}>
      <button
        className={styles.iconButton}
        onClick={onMenuOpen}
        aria-label="Menu"
      >
        <IconMenu2 size={24} />
      </button>

      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          {activeTool && activeTool !== "none" ? (
            getToolTitle()
          ) : (
            <>
              PixFlow <IconEdit size={20} />
            </>
          )}
        </h1>
      </div>

      <div className={styles.actions}>
        {hasChanges && onApply ? (
          <button
            className={`${styles.iconButton} ${styles.applyButton}`}
            onClick={onApply}
            aria-label={t("common:buttons.apply")}
          >
            <IconCheck size={24} />
          </button>
        ) : (
          <div style={{ width: "44px" }} />
        )}
      </div>
    </div>
  );
};

export default MobileTopBar;
