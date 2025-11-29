import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importar traducciones
import commonES from "./locales/es/common.json";
import homeES from "./locales/es/home.json";
import editorES from "./locales/es/editor.json";

import commonEN from "./locales/en/common.json";
import homeEN from "./locales/en/home.json";
import editorEN from "./locales/en/editor.json";

const resources = {
  es: {
    common: commonES,
    home: homeES,
    editor: editorES,
  },
  en: {
    common: commonEN,
    home: homeEN,
    editor: editorEN,
  },
};

i18n
  // Detectar idioma del navegador
  .use(LanguageDetector)
  // Pasar la instancia de i18n a react-i18next
  .use(initReactI18next)
  // Inicializar i18next
  .init({
    resources,
    fallbackLng: "en", // Idioma por defecto si no se detecta
    defaultNS: "common", // Namespace por defecto
    ns: ["common", "home", "editor"], // Namespaces disponibles

    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },

    detection: {
      // Orden de detección de idioma
      order: ["localStorage", "navigator"],
      // Cachear idioma seleccionado en localStorage
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    // Modo debug (desactivar en producción)
    debug: false,
  });

export default i18n;
