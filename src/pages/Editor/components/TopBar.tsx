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
      <button
        className={`${styles.button} ${styles.iconButton}`}
        onClick={onToggleTheme}
        aria-label="Cambiar tema"
      >
        {theme === "dark" ? <IconMoon size={16} /> : <IconSun size={16} />}
      </button>
      <button className={styles.button} onClick={onReset}>
        Reset <IconRestore size={16} />
      </button>
      <button className={`${styles.button} ${styles.primary}`} onClick={onExit}>
        Salir <IconLogout size={16} />
      </button>
    </div>
  );
};

export default TopBar;
