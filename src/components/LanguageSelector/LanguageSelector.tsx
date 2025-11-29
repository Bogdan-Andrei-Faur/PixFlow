import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSelector.module.css";
import { IconLanguage } from "@tabler/icons-react";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = i18n.language.split("-")[0]; // "es-ES" -> "es"

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇬🇧" },
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  return (
    <div className={styles.languageSelector}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <IconLanguage size={16} />
        <span className={styles.currentLang}>
          {currentLang?.flag} {currentLang?.code.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdown}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`${styles.option} ${
                  currentLanguage === lang.code ? styles.active : ""
                }`}
                onClick={() => changeLanguage(lang.code)}
              >
                <span className={styles.flag}>{lang.flag}</span>
                <span className={styles.name}>{lang.name}</span>
                {currentLanguage === lang.code && (
                  <span className={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
