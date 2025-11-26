import React from "react";
import styles from "../Editor.module.css";
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

interface Props {
  fileName?: string;
  fileSizeKB?: string;
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
  fileSizeKB,
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
  return (
    <div className={styles.topBar}>
      <h1 className={styles.title}>
        Editor PixFlow <IconEdit size={24} />
      </h1>
      <span className={styles.metaInfo}>
        {fileName ? `${fileName} • ${fileSizeKB} KB` : "Sin imagen"}
      </span>
      <div className={styles.spacer} />

      {/* Acciones de edición */}
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onUndo}
        aria-label="Deshacer"
        disabled={!canUndo}
      >
        <IconArrowBackUp size={16} />
      </button>
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onRedo}
        aria-label="Rehacer"
        disabled={!canRedo}
      >
        <IconArrowForwardUp size={16} />
      </button>
      {onLoadNewImage && (
        <button
          className={styles.button}
          onClick={onLoadNewImage}
          aria-label="Cargar nueva imagen"
        >
          <IconPhotoUp size={16} /> Nueva
        </button>
      )}
      <button className={styles.button} onClick={onReset}>
        <IconRestore size={16} /> Reset
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
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onToggleTheme}
        aria-label="Cambiar tema"
      >
        {theme === "dark" ? <IconMoon size={16} /> : <IconSun size={16} />}
      </button>
      <button className={`${styles.button} ${styles.primary}`} onClick={onExit}>
        <IconLogout size={16} /> Salir
      </button>
    </div>
  );
};

export default TopBar;
