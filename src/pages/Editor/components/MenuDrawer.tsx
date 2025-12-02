import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./MenuDrawer.module.css";
import {
  IconX,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconRestore,
  IconPhotoUp,
  IconMoon,
  IconSun,
  IconLogout,
} from "@tabler/icons-react";
import LanguageSelector from "../../../components/LanguageSelector/LanguageSelector";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onReset: () => void;
  onLoadNewImage: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onExit: () => void;
}

const MenuDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onReset,
  onLoadNewImage,
  theme,
  onToggleTheme,
  onExit,
}) => {
  const { t } = useTranslation(["common", "editor"]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("common:menu.title")}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t("common:buttons.close")}
          >
            <IconX size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Edición */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t("common:menu.editing")}</h3>
            <button
              className={styles.menuItem}
              onClick={() => {
                onUndo();
                onClose();
              }}
              disabled={!canUndo}
            >
              <IconArrowBackUp size={20} />
              <span>{t("common:actions.undo")}</span>
            </button>
            <button
              className={styles.menuItem}
              onClick={() => {
                onRedo();
                onClose();
              }}
              disabled={!canRedo}
            >
              <IconArrowForwardUp size={20} />
              <span>{t("common:actions.redo")}</span>
            </button>
          </div>

          <div className={styles.divider} />

          {/* Imagen */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t("common:menu.image")}</h3>
            <button
              className={styles.menuItem}
              onClick={() => {
                onLoadNewImage();
                onClose();
              }}
            >
              <IconPhotoUp size={20} />
              <span>{t("common:actions.loadImage")}</span>
            </button>
            <button
              className={styles.menuItem}
              onClick={() => {
                onReset();
                onClose();
              }}
            >
              <IconRestore size={20} />
              <span>{t("common:buttons.reset")}</span>
            </button>
          </div>

          <div className={styles.divider} />

          {/* Preferencias */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {t("common:menu.preferences")}
            </h3>
            <button
              className={styles.menuItem}
              onClick={() => {
                onToggleTheme();
              }}
            >
              {theme === "dark" ? (
                <IconMoon size={20} />
              ) : (
                <IconSun size={20} />
              )}
              <span>
                {theme === "dark"
                  ? t("common:theme.dark")
                  : t("common:theme.light")}
              </span>
            </button>
            <div className={styles.languageSelectorWrapper}>
              <LanguageSelector />
            </div>
          </div>

          <div className={styles.divider} />

          {/* Salir */}
          <div className={styles.section}>
            <button
              className={`${styles.menuItem} ${styles.exitButton}`}
              onClick={() => {
                onExit();
                onClose();
              }}
            >
              <IconLogout size={20} />
              <span>{t("common:buttons.exit")}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuDrawer;
