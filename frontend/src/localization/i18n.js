import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./en.json";
import translationTR from "./tr.json";

// Dil dosyalarını yükle
const resources = {
  en: {
    translation: translationEN,
  },
  tr: {
    translation: translationTR,
  },
};

// i18n başlat
i18n.use(initReactI18next).init({
  resources,
  lng: "tr",
  fallbackLng: "tr", // Desteklenmeyen bir dil olduğunda kullanılacak dil
  interpolation: {
    escapeValue: false, // React içinde değişkenleri kullanmak için false yapın
  },
});

export default i18n;
