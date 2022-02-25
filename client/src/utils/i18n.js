import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "config/app/locale";

export const updateI18n = lang => {
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // debug: true,
    lng: "en",
    resources: translations,
    interpolation: {
      escapeValue: false
    },
    fallbackLng: {
      default: ["en"]
    },
    react: {
      transSupportBasicHtmlNodes: true
    }
  });

export default i18n;
