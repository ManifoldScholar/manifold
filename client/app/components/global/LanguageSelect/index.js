import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateI18n } from "utils/i18n";
import { useAuthentication } from "hooks";
import { Select } from "components/global/atomic/form";

const STORAGE_KEY = "manifold_locale";

function readStoredLanguage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function storeLanguage(lang) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // localStorage unavailable — nothing to persist
  }
}

export default function LanguageSelect() {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuthentication();
  const userLanguage = currentUser?.attributes?.persistentUi?.locale?.language;

  const initialLanguage =
    userLanguage || readStoredLanguage() || i18n.language || "en";
  const [lang, setLang] = useState(initialLanguage);

  const handleChange = event => {
    const newLang = event.target?.value || "en";
    setLang(newLang);
    storeLanguage(newLang);
    updateI18n(newLang);
  };

  useEffect(() => {
    setLang(initialLanguage);
    updateI18n(initialLanguage);
  }, [initialLanguage]);

  return (
    <Select
      label={t("localize-content")}
      value={lang}
      options={[
        { value: "en", label: t(`locales.en`) },
        { value: "es", label: t(`locales.es`) },
        { value: "nl", label: t(`locales.nl`) }
      ]}
      onChange={handleChange}
      preIcon="languageGlobe24"
    />
  );
}

LanguageSelect.displayName = "Global.LanguageSelect";
