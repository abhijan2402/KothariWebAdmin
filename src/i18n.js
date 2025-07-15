// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "hi"],
    backend: {
      loadPath: "/EcommerceAdmin/locales/{{lng}}/translation.json",
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

// ✅ Export it as named function
export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng).then(() => {
    localStorage.setItem("language", lng);
  });
};

export default i18n;
