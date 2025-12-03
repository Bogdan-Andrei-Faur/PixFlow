import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../Editor.module.css";
import {
  IconEdit,
  IconMoon,
  IconSun,
  IconRestore,
  IconLogout,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconPhotoUp,
} from "@tabler/icons-react";
import LanguageSelector from "../../../../../components/LanguageSelector/LanguageSelector";

interface Props {
  fileName?: string;
  fileSize?: number;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onReset: () => void;
  onExit: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onLoadNewImage?: () => void;
}

const TopBar: React.FC<Props> = ({
  fileName,
  fileSize,
  theme,
  onToggleTheme,
  onReset,
  onExit,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onLoadNewImage,
}) => {
  const { t } = useTranslation(["editor", "common"]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className={styles.topBar}>
      <h1 className={styles.title}>
        {t("editor:title")} <IconEdit size={24} />
      </h1>
      <span className={styles.metaInfo}>
        {fileName
          ? `${fileName} • ${formatBytes(fileSize || 0)}`
          : t("editor:noImage.title")}
      </span>
      <div className={styles.spacer} />

      {/* Acciones de edición */}
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onUndo}
        aria-label={t("common:actions.undo")}
        disabled={!canUndo}
      >
        <IconArrowBackUp size={16} />
      </button>
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onRedo}
        aria-label={t("common:actions.redo")}
        disabled={!canRedo}
      >
        <IconArrowForwardUp size={16} />
      </button>
      {onLoadNewImage && (
        <button
          className={styles.button}
          onClick={onLoadNewImage}
          aria-label={t("common:actions.loadImage")}
        >
          <IconPhotoUp size={16} /> {t("common:buttons.new")}
        </button>
      )}
      <button className={styles.button} onClick={onReset}>
        <IconRestore size={16} /> {t("common:buttons.reset")}
      </button>

      {/* Separador visual */}
      <div
        style={{
          width: "1px",
          height: "24px",
          background: "#444",
          margin: "0 0.5rem",
        }}
      />

      {/* Utilidades */}
      <LanguageSelector />
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onToggleTheme}
        aria-label={t("common:theme.toggle")}
      >
        {theme === "dark" ? <IconMoon size={16} /> : <IconSun size={16} />}
      </button>
      <button className={`${styles.button} ${styles.primary}`} onClick={onExit}>
        <IconLogout size={16} /> {t("common:buttons.exit")}
      </button>
    </div>
  );
};

export default TopBar;
